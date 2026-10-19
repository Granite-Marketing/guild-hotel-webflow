#!/usr/bin/env node
// Build the section inventory from the sliced snapshot (plan U5).
//
// Reads figma/snapshot.json, figma/slicer.config.json and every
// figma/pages/<pageSlug>/sections.json plus section spec.json, then writes:
//   figma/inventory.json        every section with cluster, lane, CMS group
//   docs/figma/inventory.md     review table
//   docs/figma/cms-proposal.md  proposed collections (requires approval)
// figma/inventory.overrides.json is read and applied last; it is only
// created (empty) when missing, never rewritten.
// Fully local: no network. Output is deterministic.
//
// Usage: node scripts/api/figma/build-inventory.mjs [--root <dir>]

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  DEFAULTS,
  LANES,
  applyOverrides,
  componentSetLane,
  contentHash,
  draftCmsFields,
  findTemplateGroups,
  firstHeading,
  isCollectionPage,
  linkListPage,
  renderCmsProposal,
  renderInventoryMarkdown,
  sectionLane,
  sectionSignature
} from './lib/inventory.mjs'

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export const OVERRIDES_SEED = {
  _readme: 'Manual inventory corrections, applied last by scripts/api/figma/build-inventory.mjs. Key each entry by section key (<pageSlug>/<NN-slug>, see figma/inventory.json). Fields: lane (agent | manual | needs-decision), name, mergeWith (another section key), note.',
  sections: {}
}

export const parseArgs = (argv) => {
  const options = { root: DEFAULT_ROOT }
  for (let position = 0; position < argv.length; position++) {
    const flag = argv[position]
    if (flag === '--root') options.root = path.resolve(argv[++position])
    else if (flag === '--help' || flag === '-h') options.help = true
    else throw new Error(`Unknown argument: ${flag}`)
  }
  return options
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`

const writeIfChanged = (file, text) => {
  const buffer = Buffer.from(text)
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buffer)) return false
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buffer)
  return true
}

const idSafe = (id) => String(id).replace(/:/g, '-')

const kebabName = (name) => String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const buildInventory = ({ root = DEFAULT_ROOT, log = console.log, warn = (message) => console.warn(`warning: ${message}`) } = {}) => {
  const snapshotFile = path.join(root, 'figma', 'snapshot.json')
  if (!fs.existsSync(snapshotFile)) throw new Error('Missing figma/snapshot.json; run the snapshot first')
  const snapshot = readJson(snapshotFile)
  const configFile = path.join(root, 'figma', 'slicer.config.json')
  const navConfig = fs.existsSync(configFile) ? readJson(configFile).nav : undefined
  const overridesFile = path.join(root, 'figma', 'inventory.overrides.json')
  if (!fs.existsSync(overridesFile)) writeIfChanged(overridesFile, stableJson(OVERRIDES_SEED))
  const overrides = readJson(overridesFile)

  // Page order: first appearance of each page slug in snapshot.json.
  const pageOrder = []
  const sectionNames = new Map()
  for (const frame of snapshot.frames || []) {
    if (!frame.pageSlug || frame.kind === 'brand') continue
    if (!pageOrder.includes(frame.pageSlug)) pageOrder.push(frame.pageSlug)
    if (!sectionNames.has(frame.pageSlug)) sectionNames.set(frame.pageSlug, frame.sectionName ?? null)
  }

  const warnings = []
  const note = (message) => {
    warnings.push(message)
    warn(message)
  }

  const entries = []
  const pageSpecs = new Map()
  const specByKey = new Map()
  const pages = []
  for (const pageSlug of pageOrder) {
    const pageDir = path.join(root, 'figma', 'pages', pageSlug)
    const sectionsFile = path.join(pageDir, 'sections.json')
    const setFrames = (snapshot.frames || []).filter((frame) => frame.kind === 'nav' && frame.pageSlug === pageSlug)
    if (!fs.existsSync(sectionsFile) && !setFrames.length) continue
    const sections = fs.existsSync(sectionsFile) ? readJson(sectionsFile).sections || [] : []
    if (!fs.existsSync(sectionsFile)) note(`${pageSlug}: no sections.json; run the slicer`)
    const specs = []
    for (const section of [...sections].sort((a, b) => a.index - b.index)) {
      const dirName = path.basename(section.dir)
      const specRel = `figma/pages/${pageSlug}/${section.dir}/spec.json`
      const specFile = path.join(root, specRel)
      if (!fs.existsSync(specFile)) {
        note(`${pageSlug}/${dirName}: spec.json missing; section skipped`)
        continue
      }
      const spec = readJson(specFile)
      spec.source = spec.source || section.source || 'page'
      const signature = sectionSignature(spec)
      const { lane, laneReason } = sectionLane(spec)
      const key = `${pageSlug}/${dirName}`
      specByKey.set(key, spec)
      if (spec.source === 'page') specs.push(spec)
      entries.push({
        key,
        pageSlug,
        index: section.index,
        slug: section.slug,
        source: spec.source,
        proposedName: null,
        lane,
        laneReason,
        clusterId: signature.clusterId,
        clusterSize: 0,
        pagesInCluster: [],
        looseClusterId: signature.looseClusterId,
        looseClusterSize: 0,
        cmsTemplateGroup: null,
        crop: section.crop ? `figma/pages/${pageSlug}/${section.crop}` : null,
        spec: specRel,
        height: signature.height,
        columns: signature.columns,
        textCount: (spec.texts || []).length,
        imageCount: (spec.images || []).length,
        animationNotes: (spec.animationNotes || []).length,
        excludedOverlays: (spec.manualOverlays || []).map((overlay) => ({ nodeId: overlay.nodeId, name: overlay.name })),
        firstHeading: firstHeading(spec),
        _signature: signature
      })
    }
    for (const frame of [...setFrames].sort((a, b) => String(a.id).localeCompare(String(b.id)))) {
      const { lane, laneReason } = componentSetLane(frame, navConfig)
      entries.push({
        key: `${pageSlug}/set-${idSafe(frame.id)}`,
        pageSlug,
        index: null,
        slug: kebabName(frame.name),
        source: 'component-set',
        frameId: frame.id,
        proposedName: null,
        lane,
        laneReason,
        clusterId: null,
        clusterSize: 0,
        pagesInCluster: [],
        looseClusterId: null,
        looseClusterSize: 0,
        cmsTemplateGroup: null,
        crop: null,
        spec: null,
        height: frame.height ?? null,
        width: frame.width ?? null,
        columns: null,
        textCount: null,
        imageCount: null,
        animationNotes: 0,
        excludedOverlays: [],
        firstHeading: frame.name ? String(frame.name) : null
      })
    }
    pageSpecs.set(pageSlug, specs)
    pages.push({ pageSlug, sectionName: sectionNames.get(pageSlug), isCollectionPage: isCollectionPage(pageSlug), cmsTemplateGroup: null, sectionCount: sections.length })
  }

  // Clusters: exact signatures and the looser roles-plus-images key.
  const clusterOf = (field) => {
    const map = new Map()
    for (const entry of entries) {
      if (!entry[field]) continue
      if (!map.has(entry[field])) map.set(entry[field], [])
      map.get(entry[field]).push(entry)
    }
    return map
  }
  const exact = clusterOf('clusterId')
  const loose = clusterOf('looseClusterId')
  for (const entry of entries) {
    if (entry.clusterId) {
      const members = exact.get(entry.clusterId)
      entry.clusterSize = members.length
      entry.pagesInCluster = [...new Set(members.map((member) => member.pageSlug))]
      entry.looseClusterSize = loose.get(entry.looseClusterId).length
    }
  }
  const listClusters = (map, field) =>
    [...map.entries()]
      .filter(([, members]) => members.length >= 2)
      .map(([id, members]) => ({
        id,
        signature: members[0]._signature[field],
        size: members.length,
        pages: [...new Set(members.map((member) => member.pageSlug))],
        sections: members.map((member) => member.key)
      }))
      .sort((a, b) => b.size - a.size || a.id.localeCompare(b.id))
  const clusters = listClusters(exact, 'signature')
  const looseClusters = listClusters(loose, 'loose')

  // CMS template groups from whole-page alignment of page sections.
  const pageSignatures = pages
    .filter((page) => (pageSpecs.get(page.pageSlug) || []).length)
    .map((page) => ({ pageSlug: page.pageSlug, signatures: pageSpecs.get(page.pageSlug).map((spec) => sectionSignature(spec)) }))
  const { groups } = findTemplateGroups(pageSignatures)
  const pageSlugs = pages.map((page) => page.pageSlug)
  const collectionPages = pages
    .filter((page) => page.isCollectionPage)
    .map((page) => {
      const link = linkListPage(page.pageSlug, groups, pageSlugs)
      return { pageSlug: page.pageSlug, listsGroup: link.group, listsPages: link.pages, cmsTemplateGroup: null }
    })
  // Pages holding each piece of section copy, to spot shared components.
  const contentPages = new Map()
  for (const [key, spec] of specByKey) {
    const hash = contentHash(spec)
    if (!hash) continue
    if (!contentPages.has(hash)) contentPages.set(hash, new Set())
    contentPages.get(hash).add(key.split('/')[0])
  }
  const cmsGroups = groups.map((group) => {
    const inGroup = new Set(group.pages)
    const sharedOutside = (spec) => [...(contentPages.get(contentHash(spec)) || [])].some((slug) => !inGroup.has(slug))
    const { fields, sections } = draftCmsFields(group, pageSpecs, { sharedOutside })
    return {
      ...group,
      listedBy: collectionPages.filter((page) => page.listsGroup === group.id).map((page) => page.pageSlug),
      status: 'proposal: requires approval before creation',
      fields,
      sections
    }
  })
  for (const group of cmsGroups) {
    for (const slug of group.pages) {
      const page = pages.find((entry) => entry.pageSlug === slug)
      page.cmsTemplateGroup = group.id
      const list = collectionPages.find((entry) => entry.pageSlug === slug)
      if (list) list.cmsTemplateGroup = group.id
    }
  }
  for (const entry of entries) {
    if (entry.source === 'page') entry.cmsTemplateGroup = pages.find((page) => page.pageSlug === entry.pageSlug).cmsTemplateGroup
  }

  for (const warning of applyOverrides(entries, overrides)) note(warning)

  const sections = entries.map(({ _signature, ...rest }) => rest)
  const lanes = Object.fromEntries(LANES.map((lane) => [lane, sections.filter((entry) => entry.lane === lane).length]))
  const inventory = {
    version: 1,
    source: { fileKey: snapshot.fileKey ?? null, version: snapshot.version ?? null, lastModified: snapshot.lastModified ?? null },
    thresholds: { cmsThreshold: DEFAULTS.cmsThreshold, alignMin: DEFAULTS.alignMin, weights: DEFAULTS.weights, heightBucket: DEFAULTS.heightBucket, columnGap: DEFAULTS.columnGap },
    summary: {
      pages: pages.length,
      sections: sections.filter((entry) => entry.source !== 'component-set').length,
      componentSets: sections.filter((entry) => entry.source === 'component-set').length,
      lanes,
      clusters: clusters.length,
      looseClusters: looseClusters.length,
      cmsGroups: cmsGroups.length,
      overrides: sections.filter((entry) => entry.override).length
    },
    warnings,
    pages,
    sections,
    clusters,
    looseClusters,
    cmsGroups,
    collectionPages
  }

  writeIfChanged(path.join(root, 'figma', 'inventory.json'), stableJson(inventory))
  writeIfChanged(path.join(root, 'docs', 'figma', 'inventory.md'), renderInventoryMarkdown(inventory))
  writeIfChanged(path.join(root, 'docs', 'figma', 'cms-proposal.md'), renderCmsProposal(inventory))

  const { summary } = inventory
  log(`${summary.sections} sections and ${summary.componentSets} component sets across ${summary.pages} pages`)
  log(`lanes: agent ${lanes.agent}, manual ${lanes.manual}, needs-decision ${lanes['needs-decision']}`)
  log(`clusters (size 2+): ${summary.clusters} exact, ${summary.looseClusters} loose; CMS template groups: ${summary.cmsGroups}`)
  for (const group of cmsGroups) log(`  ${group.id}: ${group.pages.join(', ')} (${group.fields.length} fields)`)
  return inventory
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.help) console.log('Usage: node scripts/api/figma/build-inventory.mjs [--root <dir>]')
    else buildInventory(options)
  } catch (error) {
    console.error(`build-inventory: ${error.message}`)
    process.exitCode = 1
  }
}
