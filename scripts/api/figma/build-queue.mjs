#!/usr/bin/env node
// Build queue and session briefs (plan U7).
//
// Reads figma/inventory.json, figma/inventory.overrides.json, figma/tokens.json,
// figma/snapshot.json, every section spec.json, and optionally
// assets/asset-manifest.json, figma/vectors/index.json and
// figma/review/vision-*.json. Writes:
//   figma/assets.json             image, brand and vector index (Webflow ids preserved)
//   docs/figma/build-queue.md     ordered queue
//   docs/figma/components.md      component catalogue: variants and duplicates
//   docs/figma/briefs/Qnnn-*.md   one session brief per agent entry
// Fully local: no network. Output is deterministic; stale generated briefs are removed.
//
// Usage: node scripts/api/figma/build-queue.mjs [--root <dir>]

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import {
  APPROVAL_RULE,
  GENERATED_MARKER,
  HEIGHT_CLASS_RATIO,
  SUBAGENT_LINE,
  SESSION_SETUP_LINE,
  bandFills,
  buildAssetIndex,
  buildComponents,
  clean,
  contentKey,
  effectiveSections,
  mergeVision,
  pageBuildOrder,
  planQueue,
  tokenSummary,
  toneName,
  truncate,
  variantFeatures,
  variantText
} from './lib/queue.mjs'
import { indexNodes } from './lib/spec.mjs'

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

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
const readOptionalJson = (file, warn) => {
  if (!fs.existsSync(file)) return null
  try {
    return readJson(file)
  } catch (error) {
    warn(`${file}: ${error.message}; ignored`)
    return null
  }
}
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`
const writeIfChanged = (file, text) => {
  const buffer = Buffer.from(text)
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buffer)) return false
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buffer)
  return true
}

// Site and page ids from docs/reference/webflow-ids.md.
export const parseWebflowIds = (text) => {
  const siteId = text.match(/\*\*Site ID\*\*:\s*`([0-9a-f]+)`/)?.[1] ?? null
  const staging = text.match(/\*\*Staging URL\*\*:\s*`([^`]+)`/)?.[1] ?? null
  const pages = []
  for (const match of text.matchAll(/^\|\s*([^|`]+?)\s*\|\s*`([0-9a-f]{24})`\s*\|\s*`([^`]+)`\s*\|/gm)) {
    pages.push({ name: match[1], id: match[2], slug: match[3] })
  }
  return { siteId, staging, pages }
}

const webflowSlugFor = (pageSlug) => (pageSlug === 'home' ? '/' : `/${pageSlug}`)

const code = (value) => `\`${value}\``

export const buildQueue = ({ root = DEFAULT_ROOT, log = console.log, warn = (message) => console.warn(`warning: ${message}`) } = {}) => {
  const figmaDir = path.join(root, 'figma')
  const inventoryFile = path.join(figmaDir, 'inventory.json')
  if (!fs.existsSync(inventoryFile)) throw new Error('Missing figma/inventory.json; run pnpm figma:inventory first')
  const inventory = readJson(inventoryFile)
  const overrides = readOptionalJson(path.join(figmaDir, 'inventory.overrides.json'), warn) || {}
  const tokens = readOptionalJson(path.join(figmaDir, 'tokens.json'), warn)
  if (!tokens) warn('figma/tokens.json missing; briefs carry no token mapping (run pnpm figma:tokens)')
  const manifest = readOptionalJson(path.join(root, 'assets', 'asset-manifest.json'), warn)
  const assetsFile = path.join(figmaDir, 'assets.json')
  const existingAssets = readOptionalJson(assetsFile, warn)
  const vectorIndex = readOptionalJson(path.join(figmaDir, 'vectors', 'index.json'), warn)
  const idsFile = path.join(root, 'docs', 'reference', 'webflow-ids.md')
  const webflow = fs.existsSync(idsFile) ? parseWebflowIds(fs.readFileSync(idsFile, 'utf8')) : { siteId: null, staging: null, pages: [] }

  const reviewDir = path.join(figmaDir, 'review')
  const visionFiles = fs.existsSync(reviewDir)
    ? fs.readdirSync(reviewDir).filter((name) => /^vision-.*\.json$/.test(name)).sort()
      .map((name) => ({ name, data: readOptionalJson(path.join(reviewDir, name), warn) }))
      .filter((file) => file.data)
    : []
  const vision = mergeVision(visionFiles)

  const sections = effectiveSections(inventory, { overrides, vision })
  const specs = new Map()
  for (const section of sections) {
    if (section.spec && fs.existsSync(path.join(root, section.spec))) specs.set(section.key, readJson(path.join(root, section.spec)))
  }

  // Vector matching ranges from each page's sections.json crop ranges.
  const sectionRanges = []
  for (const page of inventory.pages) {
    const file = path.join(figmaDir, 'pages', page.pageSlug, 'sections.json')
    if (!fs.existsSync(file)) continue
    const listed = (readJson(file).sections || []).filter((entry) => entry.frameId != null)
    const byFrame = new Map()
    for (const entry of listed) {
      if (!byFrame.has(entry.frameId)) byFrame.set(entry.frameId, [])
      byFrame.get(entry.frameId).push(entry)
    }
    for (const [frameId, list] of byFrame) {
      list.sort((a, b) => (a.cropY0 ?? a.y0) - (b.cropY0 ?? b.y0))
      list.forEach((entry, position) => {
        const key = `${page.pageSlug}/${path.basename(entry.dir)}`
        sectionRanges.push({
          key,
          frameId,
          y0: entry.cropY0 ?? entry.y0,
          y1: entry.cropY1 ?? entry.y1,
          last: position === list.length - 1,
          overlays: (specs.get(key)?.manualOverlays || []).map((overlay) => overlay.bbox).filter(Boolean)
        })
      })
    }
  }

  const brandDir = path.join(figmaDir, 'brand')
  const brandFiles = fs.existsSync(brandDir) ? fs.readdirSync(brandDir).filter((name) => name.endsWith('.svg')).map((name) => `figma/brand/${name}`) : []
  const assets = buildAssetIndex({ sections, specs, manifest, existing: existingAssets, brandFiles, vectors: vectorIndex, sectionRanges })
  writeIfChanged(assetsFile, stableJson(assets))
  const vectorsBySection = new Map()
  for (const vector of assets.vectors || []) {
    for (const key of vector.usedBy) {
      if (!vectorsBySection.has(key)) vectorsBySection.set(key, [])
      vectorsBySection.get(key).push(vector)
    }
  }

  // Component model: variant features per instance. Background fills come
  // from the committed raw file when present (local read, no network).
  const rawFile = path.join(figmaDir, 'raw', 'file.json.gz')
  let rawNodes = null
  if (fs.existsSync(rawFile)) {
    try {
      rawNodes = indexNodes(JSON.parse(zlib.gunzipSync(fs.readFileSync(rawFile)).toString('utf8')).document)
    } catch (error) {
      warn(`${rawFile}: ${error.message}; backgrounds fall back to spec colour counts`)
    }
  }
  const skipHexes = (tokens?.mapping?.colors || []).filter((color) => color.skipped).map((color) => color.hex)
  const features = new Map()
  const contents = new Map()
  for (const section of sections) {
    const spec = specs.get(section.key) || null
    const fills = spec && rawNodes ? bandFills(spec, rawNodes) : null
    features.set(section.key, variantFeatures(spec, { fills, skipHexes }))
    contents.set(section.key, contentKey(spec))
  }
  const components = buildComponents(sections, { features, contents, compare: pageBuildOrder(inventory).byRank })

  const fonts = tokens?.fontsRequiringUpload || []
  const plan = planQueue(inventory, sections, { fonts, components })
  const { entries } = plan
  for (const entry of entries) entry.brief = entry.lane === 'manual' ? null : `docs/figma/briefs/${entry.id}-${entry.slug}.md`
  const entryById = new Map(entries.map((entry) => [entry.id, entry]))

  const context = { root, inventory, sections, specs, tokens, assets, webflow, entries, entryById, plan, vectorsBySection, fonts }
  const briefs = new Map()
  for (const entry of entries) if (entry.brief) briefs.set(entry.brief, renderBrief(entry, context))

  writeIfChanged(path.join(root, 'docs', 'figma', 'build-queue.md'), renderQueue(context))
  writeIfChanged(path.join(root, 'docs', 'figma', 'components.md'), renderComponents(context))
  const briefDir = path.join(root, 'docs', 'figma', 'briefs')
  for (const [file, text] of briefs) writeIfChanged(path.join(root, file), text)
  const removed = []
  if (fs.existsSync(briefDir)) {
    for (const name of fs.readdirSync(briefDir).sort()) {
      const rel = `docs/figma/briefs/${name}`
      if (briefs.has(rel) || !name.endsWith('.md')) continue
      const text = fs.readFileSync(path.join(briefDir, name), 'utf8')
      if (text.includes(GENERATED_MARKER)) {
        fs.rmSync(path.join(briefDir, name))
        removed.push(rel)
      }
    }
  }

  const counts = countByType(entries)
  log(`${entries.length} queue entries: ${Object.entries(counts).map(([type, count]) => `${type} ${count}`).join(', ')}`)
  log(`${briefs.size} briefs; ${plan.agentCount} agent sections placed, ${plan.unplaced.length} unplaced${removed.length ? `; removed ${removed.length} stale briefs` : ''}`)
  const summary = componentSummary(plan)
  log(`${summary.total} components (agent ${summary.agent}, manual ${summary.manual}, mixed ${summary.mixed}), ${summary.variants} variants, ${summary.instances} instances`)
  if (vision.size) log(`vision reviews: ${vision.size} sections from ${visionFiles.length} files`)
  for (const key of plan.unplaced) warn(`agent section not placed: ${key}`)
  for (const key of plan.duplicated) warn(`section placed more than once: ${key}`)
  for (const key of plan.unplacedManual) warn(`manual section not placed: ${key}`)
  return { entries, briefs: [...briefs.keys()], assets, plan, removed, components }
}

const countByType = (entries) => {
  const counts = {}
  for (const entry of entries) counts[entry.type] = (counts[entry.type] || 0) + 1
  return counts
}

const pagesOf = (entry) => entry.pages || entry.pageList || [...new Set(entry.sections.map((section) => section.pageSlug))]

// Component helpers shared by the queue, the catalogue and the briefs.

export const componentSummary = (plan) => {
  const list = plan.components.components
  const count = (lane) => list.filter((component) => component.lane === lane).length
  return {
    total: list.length,
    agent: count('agent'),
    manual: count('manual'),
    mixed: count('mixed'),
    shared: plan.entries.filter((entry) => entry.type === 'shared').length,
    variants: list.reduce((sum, component) => sum + component.variants.length, 0),
    instances: list.reduce((sum, component) => sum + component.instances.length, 0),
    multiVariant: list.filter((component) => component.variants.length > 1).length,
    duplicateGroups: list.reduce((sum, component) => sum + component.duplicates.length, 0)
  }
}

const backgroundText = (background) => (background === 'image' ? 'full-bleed image' : background === 'none' ? 'no fill' : `${background} (${toneName(background)})`)

// Visual traits of a variant (what its modifiers style), from the traits and
// the reference instance's features.
export const featureText = (variant) => {
  const { traits, features } = variant
  if (traits.noSpec) return 'no spec (component set beside the page, see `figma/inventory.json`)'
  const background = traits.background === 'image' ? 'full-bleed image' : traits.background === 'none' ? 'no fill' : `${traits.background} (${features.background})`
  const images = traits.images === '3+' ? '3 or more images' : `${traits.images} image${traits.images === '1' ? '' : 's'}`
  return [
    `background ${background}`,
    traits.alignment === 'none' ? 'no text' : `${traits.alignment === 'center' ? 'centred' : 'left-aligned'} text`,
    `${images}${traits.imageSide !== 'none' ? ` (media ${traits.imageSide})` : ''}`,
    `${traits.height} height (reference about ${features.heightBucket}px)`
  ].join(', ')
}

// Content differences the class family must support (not variants).
export const contentText = (component) => {
  const parts = []
  if (component.optionalElements.length) parts.push(`optional elements ${component.optionalElements.map(code).join(', ')} (present on some instances only; support them in the one class family, hide when empty)`)
  if (component.headingSwap) parts.push(`heading size varies (${component.headingRoles.map(code).join(', ')}): set it with a \`heading-style-*\` utility, not a variant`)
  return parts.length ? `Content, not variants: ${parts.join('; ')}.` : ''
}

const variantName = (variant) => (variant.label === 'base' ? 'base' : variant.modifiers.join(' + '))

const sectionVariant = (section, context) => {
  const info = context.plan.components.bySection.get(section.key)
  if (!info) return ''
  return `${info.component.name}, variant ${info.component.variants.length > 1 ? variantText(info.variant) : 'base (only variant)'}`
}

const keyList = (sections, max = Infinity) => {
  const keys = sections.map((section) => code(section.key))
  return keys.length > max ? `${keys.slice(0, max).join(', ')} and ${keys.length - max} more` : keys.join(', ')
}

// Duplicate note for one variant restricted to some members.
const duplicateNotes = (variant, members) => {
  const keys = new Set(members.map((section) => section.key))
  return variant.duplicates
    .map((group) => group.filter((section) => keys.has(section.key)))
    .filter((group) => group.length > 1)
    .map((group) => `identical content on ${group.length} instances (${keyList(group, 6)}): build once, reuse; consider a Webflow component with no props`)
}

const entryOf = (section, context) => context.plan.assigned.get(section.key)

const componentEntries = (component, context) => [...new Set(component.instances.map((section) => entryOf(section, context)).filter(Boolean))].sort()

// Variant lines for an entry (queue markdown, crop links relative to docs/figma/).
const queueVariantLines = (entry) => {
  const lines = []
  for (const { component, variants } of entry.components || []) {
    const total = variants.reduce((sum, item) => sum + item.members.length, 0)
    lines.push(`Component \`${component.name}\` (${component.kind}): ${total} instance${total === 1 ? '' : 's'} here, ${variants.length} variant${variants.length === 1 ? '' : 's'}.${contentText(component) ? ` ${contentText(component)}` : ''}`, '')
    for (const { variant, members } of variants) {
      const reference = members.find((section) => section.crop) || null
      const crop = reference ? `[crop](../../${reference.crop})` : 'no crop'
      const notes = duplicateNotes(variant, members)
      const content = notes.length ? ` ${notes.join('; ')}.` : members.length > 1 ? ' Different content per instance: props or CMS fields.' : ''
      lines.push(`- Variant ${variant.label === 'base' ? 'base' : variantText(variant)} (${members.length}): ${featureText(variant)}. Reference ${crop}.${content}`)
    }
    lines.push('')
  }
  return lines
}

// Variants block for a shared brief: one reference crop per variant.
const briefVariantLines = (entry) => {
  const lines = ['## Variants', '']
  if (entry.components.length > 1) {
    lines.push(`These ${entry.components.length} component names share an exact structural cluster: build them as one class family on \`${entry.components[0].component.name}\`, each name and variant an \`is-\` modifier, not separate components.`, '')
  }
  for (const { component, variants } of entry.components) {
    lines.push(`### Component \`${component.name}\` (${component.kind})`, '')
    if (contentText(component)) lines.push(contentText(component), '')
    for (const { variant, members } of variants) {
      const reference = members.find((section) => section.crop) || members[0]
      lines.push(`- ${variant.label === 'base' ? 'Base (no modifier)' : `Modifier ${variantText(variant)}`}, ${members.length} instance${members.length === 1 ? '' : 's'}: ${featureText(variant)}.`)
      lines.push(`  Reference crop: ${reference.crop ? `\`${reference.crop}\`` : 'none'} (\`${reference.key}\`). Instances: ${keyList(members)}.`)
      const notes = duplicateNotes(variant, members)
      if (notes.length) for (const note of notes) lines.push(`  Duplicates: ${note}.`)
      else if (members.length > 1) lines.push('  Same variant, different content: use component properties or CMS fields.')
    }
    lines.push('')
  }
  return lines
}

const renderQueue = (context) => {
  const { entries, plan, inventory } = context
  const summary = componentSummary(plan)
  const manualEntries = entries.filter((entry) => entry.type === 'manual')
  const lines = [
    '# Build queue',
    '',
    GENERATED_MARKER,
    '',
    `Source: Figma version ${clean(inventory.source?.version ?? 'unknown')}. Inputs: \`figma/inventory.json\`, \`figma/inventory.overrides.json\`, vision reviews in \`figma/review/\`. Regenerate after any inventory change.`,
    '',
    '## Summary',
    '',
    `- Distinct components to build: ${summary.total} (agent ${summary.agent}, manual ${summary.manual}, mixed ${summary.mixed}). Agent components on two or more pages are built once in ${summary.shared} shared entries; the rest are built inside their page or CMS entry. Manual components: ${manualEntries.length} entries for Stephen.`,
    `- Variants: ${summary.variants} across all components (${summary.multiVariant} components have more than one); build each as an \`is-\` modifier, not a separate component.`,
    `- Instances: ${summary.instances} sections; ${summary.duplicateGroups} groups of identical-content duplicates.`,
    '- Catalogue with every component, variant, reference crop and duplicate group: [components.md](components.md).',
    '',
    'Order: global setup, manual entries for Stephen (one per component type), shared components (by pages using them), CMS templates, then pages (home, collection pages, the rest). Every agent entry has a session brief; run one fresh session per brief, in order, after its dependencies are done. Manual entries never get agent briefs.',
    '',
    `Entries: ${Object.entries(countByType(entries)).map(([type, count]) => `${type} ${count}`).join(', ')}. Agent sections: ${plan.agentCount}, placed exactly once: ${plan.agentCount - plan.unplaced.length - plan.duplicated.length}.`,
    '',
    '| ID | Title | Type | Lane | Depends on | Sections | Brief |',
    '|---|---|---|---|---|---|---|'
  ]
  for (const entry of entries) {
    const pages = pagesOf(entry)
    const sectionCell = entry.type === 'page'
      ? `${entry.sections.length} own, ${entry.sharedOnPage.length} shared`
      : entry.sections.length ? `${entry.sections.length} on ${pages.length} page${pages.length === 1 ? '' : 's'}` : (entry.pageList ? `${entry.pageList.length} pages` : '')
    const brief = entry.brief ? `[brief](${entry.brief.replace('docs/figma/', '')})` : 'yours'
    lines.push(`| ${entry.id} | ${clean(entry.title)} | ${entry.type} | ${entry.lane} | ${entry.dependsOn.join(', ') || 'none'} | ${sectionCell} | ${brief} |`)
  }
  lines.push('', '## Entries', '')
  for (const entry of entries) {
    lines.push(`### ${entry.id} ${clean(entry.title)}`, '')
    if (entry.type === 'manual') {
      lines.push(entry.instruction, '')
      for (const { component } of entry.components || []) {
        const elsewhere = componentEntries(component, context).filter((id) => id !== entry.id)
        if (elsewhere.length) lines.push(`Other instances of \`${component.name}\` are queued in ${elsewhere.join(', ')}; use the same variant classes.`, '')
      }
      lines.push(...queueVariantLines(entry))
      for (const section of entry.sections) {
        const ref = section.crop ? `[crop](../../${section.crop})` : `no crop: component set ${clean(section.frameId ?? '')}, see \`figma/inventory.json\``
        lines.push(`- \`${section.key}\` (${clean(section.displayName)}): ${clean(section.laneReason)}. ${ref}. ${sectionVariant(section, context)}`)
      }
    } else if (entry.type === 'setup') {
      lines.push(setupSummary(entry))
    } else {
      lines.push(`Pages: ${pagesOf(entry).join(', ')}. Brief: [${entry.brief.replace('docs/figma/briefs/', '')}](${entry.brief.replace('docs/figma/', '')})`, '')
      if (entry.type === 'shared') lines.push(...queueVariantLines(entry))
      for (const section of entry.sections) lines.push(`- \`${section.key}\` ${clean(section.displayName)}${entry.type === 'shared' ? ` (${sectionVariant(section, context).replace(/^[^,]+, /, '')})` : ''}`)
      if (entry.type === 'page' && entry.sharedOnPage.length) {
        lines.push(`- Shared on this page: ${entry.sharedOnPage.map((section) => `\`${section.key}\` (${plan.assigned.get(section.key)})`).join(', ')}`)
      }
    }
    lines.push('')
  }
  lines.push('## Coverage', '')
  lines.push(plan.unplaced.length ? `Unplaced agent sections: ${plan.unplaced.map(code).join(', ')}` : 'Every agent section appears in exactly one shared, CMS or page entry.')
  lines.push(plan.unplacedManual.length ? `Unplaced manual sections: ${plan.unplacedManual.map(code).join(', ')}` : 'Every manual section appears in exactly one manual entry.')
  lines.push('')
  return lines.join('\n')
}

// docs/figma/components.md: the component catalogue.
const renderComponents = (context) => {
  const { plan, inventory } = context
  const summary = componentSummary(plan)
  const list = plan.components.components
  const lines = [
    '# Component catalogue',
    '',
    GENERATED_MARKER,
    '',
    `Source: Figma version ${clean(inventory.source?.version ?? 'unknown')}. Queue: [build-queue.md](build-queue.md).`,
    '',
    `A component is every section sharing a component name (override name, then inventory proposed name, then vision name, else the cluster id). Each instance gets a variant key from visual traits a designer would style: background colour family, text alignment, media side (reversed), image layout (0, 1, 2, 3 or more) and height class (compact or tall only beyond ${HEIGHT_CLASS_RATIO}x the component median). Optional text elements (eyebrow, button, caption) and heading size swaps are content, listed per component, not variants. Same key and same text content: a duplicate (build once, reuse). Same key, different content: one variant with different content (props or CMS fields). Different keys: variants, built as \`is-\` modifiers on one component (CLAUDE.md, Component Variants). Labels describe how a variant differs from the base (the most common variant).`,
    '',
    `${summary.total} components (agent ${summary.agent}, manual ${summary.manual}, mixed ${summary.mixed}), ${summary.variants} variants, ${summary.instances} instances, ${summary.duplicateGroups} duplicate groups.`,
    '',
    '| Component | Kind | Lane | Instances | Pages | Variants (label: count) | Duplicates | Queue entry |',
    '|---|---|---|---|---|---|---|---|'
  ]
  for (const component of list) {
    const variants = component.variants.map((variant) => `${variantName(variant)}: ${variant.instances.length}`).join('; ')
    const duplicates = component.duplicates.length ? component.duplicates.map((group) => `${group.length} identical`).join('; ') : 'none'
    const alias = component.aliases.length ? ` (alias ${component.aliases.map(clean).join(', ')})` : ''
    lines.push(`| [${clean(component.name)}](#${anchor(component.name)})${alias} | ${clean(component.kind)} | ${component.lane} | ${component.instances.length} | ${component.pages.length} | ${clean(variants)} | ${duplicates} | ${componentEntries(component, context).join(', ')} |`)
  }
  lines.push('')
  const { merges, nearMisses, similarity } = plan.components
  const weights = Object.entries(similarity.weights).map(([name, weight]) => `${name} ${weight}`).join(', ')
  lines.push('## Merged near-identical components', '')
  lines.push(`Vision reviewers named sections independently, so one block can carry two names. Score = ${similarity.blend.structure} x structural link (exact shared inventory cluster 1, loose cluster only ${similarity.LOOSE_LINK}, none 0) + ${similarity.blend.features} x spec feature similarity (${weights}; each variant matched to its best counterpart). Pairs at or above ${similarity.MERGE_THRESHOLD} merge into the name with more instances; the other name becomes an alias and its instances become variants. Constants: \`SIMILARITY\` in \`scripts/api/figma/lib/queue.mjs\`.`, '')
  if (merges.length) {
    lines.push('| Component | Component | Score | Merged into |', '|---|---|---|---|')
    for (const pair of merges) lines.push(`| ${clean(pair.a)} | ${clean(pair.b)} | ${pair.score.toFixed(3)} | ${clean(pair.into)} |`)
  } else {
    lines.push('None.')
  }
  lines.push('', '## Check these', '')
  lines.push(`Near misses scoring ${similarity.NEAR_MISS_FLOOR} to just under ${similarity.MERGE_THRESHOLD}: compare the crops; if they are the same block, add the same \`name\` to both in \`figma/inventory.overrides.json\` and re-run \`pnpm figma:inventory\` and \`pnpm figma:queue\`.`, '')
  if (nearMisses.length) {
    const byName = new Map(list.flatMap((component) => [[component.name, component], ...component.aliases.map((alias) => [alias, component])]))
    const cropOf = (name) => {
      const component = byName.get(name)
      const section = component?.instances.find((instance) => instance.crop && (instance.vision?.name ? instance.vision.name === name : true)) || component?.instances.find((instance) => instance.crop)
      return section ? `[crop](../../${section.crop})` : 'no crop'
    }
    lines.push('| Component | Component | Score | Crops |', '|---|---|---|---|')
    for (const pair of nearMisses) lines.push(`| ${clean(pair.a)} | ${clean(pair.b)} | ${pair.score.toFixed(3)} | ${cropOf(pair.a)}, ${cropOf(pair.b)} |`)
  } else {
    lines.push('None.')
  }
  lines.push('')
  for (const component of list) {
    lines.push(`## ${clean(component.name)}`, '')
    if (component.aliases.length) lines.push(`Also named ${component.aliases.map((alias) => code(alias)).join(', ')} by the vision review; merged as near-identical (see Merged near-identical components).`, '')
    if (contentText(component)) lines.push(contentText(component), '')
    lines.push(`Kind ${clean(component.kind)}, lane ${component.lane}, ${component.instances.length} instance${component.instances.length === 1 ? '' : 's'} on ${component.pages.length} page${component.pages.length === 1 ? '' : 's'}, queue ${componentEntries(component, context).join(', ')}.`, '')
    for (const variant of component.variants) {
      const crop = variant.reference?.crop ? `[crop](../../${variant.reference.crop})` : 'no crop'
      const content = variant.duplicates.length
        ? `; ${variant.duplicates.map((group) => `identical content: ${keyList(group)}`).join('; ')}`
        : ''
      const distinct = variant.instances.length > 1 ? ` ${variant.distinctContent} distinct content version${variant.distinctContent === 1 ? '' : 's'}` : ''
      lines.push(`- ${variant.label === 'base' ? '**base**' : `**${variantName(variant)}**`} (${variant.instances.length}): ${featureText(variant)}. Example ${crop}.${distinct}${content}`)
      lines.push(`  Instances: ${keyList(variant.instances)}`)
    }
    lines.push('')
  }
  return lines.join('\n')
}

const anchor = (name) => String(name).toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/ /g, '-')

const setupSummary = (entry) => {
  if (entry.kind === 'tokens') return 'Verify live variable collections and Relume classes read-only, then sync `figma/tokens.json` onto them after approval.'
  if (entry.kind === 'fonts') return 'Yours: upload the font files in Webflow Site settings, Fonts. Font names must match the families in `figma/tokens.json`.'
  if (entry.kind === 'assets') return 'Run `pnpm run upload-assets` after approval; resize anything over 4MB on the long edge first. Re-run `pnpm figma:queue` afterwards so `figma/assets.json` carries the Webflow URLs.'
  return `Create the Webflow pages (approval first): ${entry.pageList.join(', ')}.`
}

// Brief rendering.

const sectionBlock = (section, context, { compact = false } = {}) => {
  const { specs, assets, vectorsBySection } = context
  const spec = specs.get(section.key)
  const lines = [`#### \`${section.key}\`: ${clean(section.displayName)}`, '']
  lines.push(`- Spec: \`${section.spec}\``)
  if (section.crop) lines.push(`- Reference crop: \`${section.crop}\``)
  const variant = sectionVariant(section, context)
  if (variant) lines.push(`- Component: ${variant}`)
  const texts = (spec?.texts || []).map((text) => text.characters).filter(Boolean)
  lines.push(`- Texts (${texts.length}): ${texts.slice(0, 3).map((text) => `"${truncate(text, 80)}"`).join('; ') || 'none'}`)
  const refs = [...new Set((spec?.images || []).map((image) => image.imageRef).filter(Boolean))]
  if (refs.length) {
    const status = (ref) => (assets.images[ref]?.webflowUrl ? 'uploaded' : 'not uploaded')
    lines.push(`- Images: ${(spec?.images || []).length} (${refs.length} distinct), \`figma/assets.json\` images: ${refs.map((ref) => `${ref} (${status(ref)})`).join(', ')}`)
  } else {
    lines.push('- Images: none')
  }
  const vectors = vectorsBySection.get(section.key) || []
  if (vectors.length) lines.push(`- Vectors: ${vectors.map((vector) => `${vector.file ? `\`${vector.file}\`` : `not exported (${vector.id})`} (${vector.name}, ${vector.width}x${vector.height})`).join(', ')}`)
  if (compact) {
    lines.push('')
    return lines
  }
  for (const note of spec?.animationNotes || []) lines.push(`- Animation (${clean(note.name)}): ${truncate((note.texts || []).join(' '), 300)}`)
  for (const overlay of section.excludedOverlays || []) lines.push(`- Excluded manual overlay: ${clean(overlay.name)} (${clean(overlay.nodeId)}), built by hand; do not build it and ignore its region in the compare`)
  const review = section.vision
  if (review) {
    const parts = [review.kind && `kind ${clean(review.kind)}`, review.interactive && `interactive: ${clean(review.interactive)}`, review.boundaryIssue && `boundary issue: ${clean(review.boundaryIssue)}`, review.note && `note: ${clean(review.note)}`].filter(Boolean)
    if (parts.length) lines.push(`- Vision review: ${parts.join('; ')}`)
  }
  if (section.mergeWith) lines.push(`- Override: merge with \`${section.mergeWith}\` and build them as one section`)
  if (section.note) lines.push(`- Override note: ${clean(section.note)}`)
  lines.push('')
  return lines
}

const commonHeader = (entry, context) => {
  const depends = entry.dependsOn.map((id) => `${id} (${clean(context.entryById.get(id).title)})`).join(', ') || 'none'
  return [
    `# ${entry.id}: ${clean(entry.title)}`,
    '',
    GENERATED_MARKER,
    '',
    `Queue: \`docs/figma/build-queue.md\`. Type: ${entry.type}. Lane: ${entry.lane}. Depends on: ${depends}.`,
    '',
    SUBAGENT_LINE,
    '',
    SESSION_SETUP_LINE,
    ''
  ]
}

const targetLine = (pageSlug, context) => {
  const { webflow } = context
  const slug = webflowSlugFor(pageSlug)
  const page = webflow.pages.find((entry) => entry.slug === slug)
  const site = webflow.siteId ? `site \`${webflow.siteId}\`` : 'site id: see `docs/reference/webflow-ids.md`'
  if (page) return `Target: ${site}, page ${clean(page.name)} \`${page.id}\` (\`${page.slug}\`).`
  const create = context.entries.find((entry) => entry.kind === 'pages')
  return `Target: ${site}, page \`${slug}\`: create page first, see ${create.id}. Then record its id in \`docs/reference/webflow-ids.md\`.`
}

const rulesBlock = (context, specList) => {
  const tokens = tokenSummary(specList, context.tokens)
  const lines = [
    '## Build lane',
    '',
    '- Native Webflow lane (KTD7): build with the build-component skill (`.claude/skills/build-component/SKILL.md`), snapshot-first Phase 3.0. Do not call the Figma API or MCP; Phase 3.1 is a fallback only for a field the snapshot lacks, one call, logged in the component map.',
    '- Class naming: Client-First adapted per `CLAUDE.md` (`section_component-name`, `component-name_element`, `is-` modifiers, `padding-global` plus `padding-section-*`, `container-*`).',
    '- Reuse styles before creating them: read `docs/reference/style-inventory.md` and the live `get_styles` first; name new shared classes generically.',
    '- Semantic wrappers per `docs/reference/component-patterns.md`: every heading in a `_header` wrapper, every image in a figure wrapper, every CTA in a footer wrapper. Responsive rules: `docs/reference/breakpoints.md`.',
    '',
    '## Tokens',
    '',
    'From `figma/tokens.json` (mapping proposals; the token sync entry verifies live names):',
    ''
  ]
  if (!context.tokens) lines.push('- `figma/tokens.json` missing: run `pnpm figma:tokens` first.')
  for (const label of tokens.typography) lines.push(`- Type: ${label}`)
  for (const label of tokens.colors) lines.push(`- Colour: ${label}`)
  for (const label of tokens.fontVariables) lines.push(`- Font variable: ${label}`)
  lines.push('')
  return lines
}

const closingBlock = (context, { compareAgainst = 'each section.webp listed above' } = {}) => [
  '## Manual Designer steps to expect',
  '',
  '- Image placement (KTD10): REST-uploaded assets can be invisible to the Webflow MCP asset tools. List each image slot with its `figma/assets.json` ref and Webflow URL for a manual Designer step unless this session proves MCP placement works.',
  '- Anything listed as an excluded manual overlay is built by Stephen; leave its slot empty.',
  '',
  '## Approval',
  '',
  APPROVAL_RULE,
  '',
  '## Definition of done',
  '',
  `- Visual compare against ${compareAgainst} matches, within at most 5 fix iterations.`,
  `- Published to staging${context.webflow.staging ? ` (\`${context.webflow.staging}\`)` : ''} after an approved publish.`,
  '- `docs/reference/style-inventory.md` updated with new classes and components; `docs/reference/webflow-ids.md` updated with any new page, component or collection ids.',
  ''
]

export const renderBrief = (entry, context) => {
  if (entry.type === 'setup') return renderSetupBrief(entry, context)
  const lines = commonHeader(entry, context)
  const specList = entry.sections.map((section) => context.specs.get(section.key)).filter(Boolean)
  lines.push('## Goal', '')
  if (entry.type === 'shared') {
    const reference = entry.reference
    const variantCount = entry.components.reduce((sum, item) => sum + item.variants.length, 0)
    lines.push(`Build one shared component used by ${entry.sections.length} sections on ${entry.pages.length} pages (${entry.pages.join(', ')}). Build it once on \`${reference.pageSlug}\` from \`${reference.key}\`, convert it to a Webflow component, then add the ${variantCount > 1 ? `${variantCount - 1} other variant${variantCount === 2 ? '' : 's'} listed under Variants as \`is-\` modifier combo classes on that one component (or one class family), never as a second component` : 'instances below: they share one variant, so only content differs'}. Page entries insert instances; they do not rebuild it.`, '')
    lines.push(targetLine(reference.pageSlug, context), '')
    lines.push(...rulesBlock(context, specList))
    lines.push(...briefVariantLines(entry))
    lines.push('## Sections', '', '### Reference instance', '')
    lines.push(...sectionBlock(reference, context))
    lines.push('### Other instances', '')
    for (const section of entry.sections) if (section !== reference) lines.push(...sectionBlock(section, context, { compact: true }))
  } else if (entry.type === 'cms') {
    const group = entry.group
    const listedBy = group.listedBy?.length ? ` Listed by ${group.listedBy.join(', ')}.` : ''
    lines.push(`Build the CMS template page for \`${group.id}\` once. Pages ${entry.pages.join(', ')} are clones; \`${group.referencePage}\` is the reference.${listedBy} Creating the collection needs approval first: present the schema from \`docs/figma/cms-proposal.md\` and wait for a yes, then create it, record ids in \`docs/reference/webflow-ids.md\`, build the template from the reference page sections and bind fields.`, '')
    const create = context.entries.find((candidate) => candidate.kind === 'pages')
    lines.push(`Target: site \`${context.webflow.siteId ?? 'see docs/reference/webflow-ids.md'}\`, the collection template page (created with the collection; static pages for these clones are not needed, see ${create.id}).`, '')
    const sharedIds = entry.dependsOn.filter((id) => context.entryById.get(id).type === 'shared')
    if (sharedIds.length) {
      lines.push(`Insert instances of shared components from ${sharedIds.join(', ')} where those sections appear; do not rebuild them. Variant to use per section:`, '')
      const onPages = context.sections
        .filter((section) => entry.pages.includes(section.pageSlug) && sharedIds.includes(context.plan.assigned.get(section.key)))
        .sort((a, b) => entry.pages.indexOf(a.pageSlug) - entry.pages.indexOf(b.pageSlug) || (a.index ?? Infinity) - (b.index ?? Infinity) || a.key.localeCompare(b.key))
      for (const section of onPages) lines.push(`- \`${section.key}\`: insert shared component from ${context.plan.assigned.get(section.key)} (${sectionVariant(section, context)})`)
      lines.push('')
    }
    lines.push(...rulesBlock(context, specList))
    lines.push('## Sections', '')
    const referenceSections = entry.sections.filter((section) => section.pageSlug === group.referencePage)
    const referenceClusters = new Set(referenceSections.map((section) => section.clusterId))
    lines.push(`### Reference page: ${group.referencePage}`, '')
    for (const section of referenceSections) lines.push(...sectionBlock(section, context))
    const others = entry.sections.filter((section) => section.pageSlug !== group.referencePage)
    if (others.length) {
      lines.push('### Clone pages (check for fields and conditional visibility)', '')
      for (const section of others) {
        lines.push(...sectionBlock(section, context, { compact: true }).slice(0, -1))
        lines.push(`- ${referenceClusters.has(section.clusterId) ? 'Same structure as a reference section: content becomes CMS fields.' : 'Differs from the reference: needs a field, conditional visibility or a note to Stephen.'}`, '')
      }
    }
  } else {
    const { page } = entry
    lines.push(`Build the ${clean(page.sectionName || page.pageSlug)} page section by section, top to bottom, inserting shared component instances where listed.`, '')
    if (entry.listing?.listsGroup) lines.push(`This page lists the \`${entry.listing.listsGroup}\` collection (${entry.listing.listsPages.join(', ')}): bind the list to that collection once it exists.`, '')
    else if (entry.listing?.listsPages?.length) lines.push(`This collection page links to ${entry.listing.listsPages.join(', ')}; a collection may be needed, see \`docs/figma/cms-proposal.md\`.`, '')
    lines.push(targetLine(page.pageSlug, context), '')
    lines.push(...rulesBlock(context, specList))
    const animationFile = `figma/animations/${page.pageSlug}.md`
    if (fs.existsSync(path.join(context.root, animationFile))) lines.push(`Animation notes for the whole page: \`${animationFile}\`.`, '')
    lines.push('## Page order', '')
    const all = [...entry.sections, ...entry.sharedOnPage, ...entry.manualOnPage].sort((a, b) => (a.index ?? Infinity) - (b.index ?? Infinity) || a.key.localeCompare(b.key))
    for (const section of all) {
      const owner = context.plan.assigned.get(section.key)
      const role = owner === entry.id ? 'build here' : section.lane === 'agent' ? `insert shared component from ${owner} (${sectionVariant(section, context)})` : `manual (${owner}: ${sectionVariant(section, context)}), leave a placeholder`
      lines.push(`- \`${section.key}\` ${clean(section.displayName)}: ${role}`)
    }
    lines.push('', '## Sections to build', '')
    if (!entry.sections.length) lines.push('None: this page only assembles shared component instances.', '')
    for (const section of entry.sections) lines.push(...sectionBlock(section, context))
  }
  lines.push(...reuseGate(entry, context))
  lines.push(...closingBlock(context))
  return lines.join('\n')
}

// Mandatory reuse gate for every agent brief: one class family per component.
const reuseGate = (entry, context) => {
  const lines = [
    '## Component reuse gate',
    '',
    'Mandatory before creating any class. Five similar blocks with five unique class families is a failed build.',
    '',
    '1. Look up each section\'s component and variant in `docs/figma/components.md` (listed below), including its aliases and the Check these list.',
    '2. Check whether that component, or a near-identical one, already has a class family in Webflow: read `docs/reference/style-inventory.md` and the live `get_styles`.',
    '3. If it exists, reuse its `section_<component>` and `<component>_<element>` classes and apply the variant\'s `is-` modifier (or a utility class for a one-property difference). Do not create a new class family.',
    '4. Create a new class family only for a component with no existing family. Name it after the component (its layout), never after the page or the content, and record the family and all its variants in `docs/reference/style-inventory.md` in this session.',
    ''
  ]
  const sections = [...entry.sections, ...(entry.sharedOnPage || [])]
  const seen = new Map()
  for (const section of sections) {
    const info = context.plan.components.bySection.get(section.key)
    if (!info) continue
    if (!seen.has(info.component.name)) seen.set(info.component.name, { component: info.component, variants: new Set() })
    seen.get(info.component.name).variants.add(info.variant.label === 'base' ? 'base' : info.variant.modifiers.join(' + '))
  }
  if (seen.size) {
    lines.push('Components in this entry:', '')
    for (const { component, variants } of [...seen.values()].sort((a, b) => a.component.name.localeCompare(b.component.name))) {
      const alias = component.aliases.length ? ` (alias ${component.aliases.join(', ')})` : ''
      const optional = component.optionalElements.length ? `; optional elements ${component.optionalElements.map(code).join(', ')}` : ''
      const heading = component.headingSwap ? '; heading size via `heading-style-*` utility' : ''
      lines.push(`- \`${component.name}\`${alias}: class family \`section_${component.name}\`; variants used here: ${[...variants].map(code).join(', ')}${optional}${heading}; ${component.instances.length} instance${component.instances.length === 1 ? "" : "s"} site-wide, queue ${componentEntries(component, context).join(', ')}.`)
    }
    lines.push('')
  }
  return lines
}

const renderSetupBrief = (entry, context) => {
  const lines = commonHeader(entry, context)
  const { tokens, assets, webflow, inventory } = context
  if (entry.kind === 'tokens') {
    lines.push('## Goal', '', 'Map the Figma design tokens onto the existing Relume style guide on the live site: colour and font variables, and typography class values.', '')
    lines.push(`Target: site \`${webflow.siteId ?? 'see docs/reference/webflow-ids.md'}\`, the \`/style-guide\` page and the variable collections.`, '')
    lines.push('## Steps', '')
    lines.push('1. Read-only first: `variable_tool > get_variable_collections` and the variables in each, plus `style_tool > get_styles(query: "all")`. Record the live names.')
    lines.push('2. Compare with `figma/tokens.json` `mapping.colors`, `mapping.fontVariables` and `mapping.typography` (targets are proposals from `docs/reference/style-guide.md`). Note every target that does not exist live.')
    lines.push('3. Present the exact writes: variable value updates, class value updates, suggested combo classes to create. Prefer updating existing Relume variables over creating duplicates.')
    lines.push('4. After a yes, apply them, then regenerate `docs/reference/style-inventory.md` from the live styles.')
    lines.push('5. Fonts must be uploaded first (Q002, manual); if they are not, set font variables but expect fallback rendering.', '')
    if (tokens) {
      lines.push('## Mapping summary', '')
      for (const color of (tokens.mapping?.colors || []).filter((entry) => entry.target)) lines.push(`- Colour ${color.hex} -> \`${color.target}\` (${color.count} uses)`)
      for (const variable of tokens.mapping?.fontVariables || []) lines.push(`- Font variable \`${variable.variable}\`: ${clean(variable.value)}`)
      const targets = [...new Set((tokens.mapping?.typography || []).map((entry) => entry.target).filter(Boolean))].sort()
      const combos = [...new Set((tokens.mapping?.typography || []).map((entry) => entry.suggestedComboClass).filter(Boolean))].sort()
      lines.push(`- Typography targets: ${targets.map(code).join(', ')}`)
      if (combos.length) lines.push(`- Suggested combo classes: ${combos.map(code).join(', ')}`)
      lines.push('')
    }
  } else if (entry.kind === 'assets') {
    const images = Object.entries(assets.images)
    const pending = images.filter(([, image]) => !image.webflowUrl)
    lines.push('## Goal', '', `Upload the image fills used by the design to the Webflow asset library. ${images.length} images are indexed in \`figma/assets.json\`, ${pending.length} without a Webflow URL. Brand SVGs (${Object.keys(assets.brand).length}) and vectors (${(assets.vectors || []).length}) are committed under \`figma/\` and are uploaded only when a build needs them as image files.`, '')
    lines.push('## Steps', '')
    lines.push('1. Check that assets/asset-manifest.json and assets/images/ exist (both gitignored; a fresh checkout needs the snapshot image fills, see `figma/README.md`).')
    lines.push('2. List files over 4MB; resize each on the long edge only (aspect ratio kept), let Webflow handle AVIF compression.')
    lines.push('3. Present the count, total size and resized files, and wait for a yes.')
    lines.push('4. Run `pnpm run upload-assets` (dedup by MD5). Then run `pnpm figma:queue` so `figma/assets.json` picks up each `webflowUrl` and `webflowAssetId` from the manifest.')
    lines.push('5. Run `pnpm run update-metadata --dry-run` to list assets missing alt text (alt text generation is paid; it needs a separate yes).', '')
  } else if (entry.kind === 'pages') {
    lines.push('## Goal', '', 'Create a Webflow page for each Figma page design so build sessions have a target. Clone pages in a CMS template group get one collection template page, created with the collection in their CMS entry, not static pages.', '')
    lines.push(`Target: site \`${webflow.siteId ?? 'see docs/reference/webflow-ids.md'}\`.`, '')
    lines.push('| Figma page | Webflow slug | Status |', '|---|---|---|')
    for (const pageSlug of entry.pageList) {
      const page = inventory.pages.find((candidate) => candidate.pageSlug === pageSlug)
      const slug = webflowSlugFor(pageSlug)
      const live = webflow.pages.find((candidate) => candidate.slug === slug)
      const status = live ? `exists (\`${live.id}\`)` : page.cmsTemplateGroup ? `CMS template (${page.cmsTemplateGroup}), created with the collection` : 'create'
      lines.push(`| ${pageSlug} | \`${slug}\` | ${status} |`)
    }
    lines.push('', '## Steps', '')
    lines.push('1. Read-only: list the live pages and compare with the table (slugs are proposals; confirm with Stephen).')
    lines.push('2. Present the pages to create and wait for a yes.')
    lines.push('3. Create them, then record each id in `docs/reference/webflow-ids.md`.', '')
  }
  lines.push('## Approval', '', APPROVAL_RULE, '')
  lines.push('## Definition of done', '', '- The writes above are applied after an explicit yes, and `docs/reference/webflow-ids.md` and `docs/reference/style-inventory.md` reflect the live site.', '')
  return lines.join('\n')
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.help) console.log('Usage: node scripts/api/figma/build-queue.mjs [--root <dir>]')
    else buildQueue(options)
  } catch (error) {
    console.error(`build-queue: ${error.message}`)
    process.exitCode = 1
  }
}
