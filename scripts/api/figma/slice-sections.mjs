#!/usr/bin/env node
// Slice cached Figma page renders into section folders (plan U3).
//
// Reads figma/snapshot.json and figma/raw/file.json.gz, bands every page
// frame, crops each band from its render and writes:
//   figma/pages/<pageSlug>/sections/<NN>-<slug>/section.webp + spec.json
//   figma/pages/<pageSlug>/page.json      trimmed visible tree + animation notes
//   figma/pages/<pageSlug>/sections.json  ordered band list
//   figma/animations/<pageSlug>.md        animation notes per page
// Boundary rules live in figma/slicer.config.json; per-page fixes in
// figma/slicer.overrides.json.
// Fully local: no network. Output is deterministic, so re-runs are byte-identical.
//
// Usage: node scripts/api/figma/slice-sections.mjs [--page <slug>] [--root <dir>]

import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { computeBands, resolveConfig, round2 } from './lib/bands.mjs'
import { animationNote, buildSpec, createNavMatcher, indexNodes, trimTree, wholeFrameBand } from './lib/spec.mjs'

const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

export const parseArgs = (argv) => {
  const options = { root: DEFAULT_ROOT, page: null }
  for (let position = 0; position < argv.length; position++) {
    const flag = argv[position]
    if (flag === '--root') options.root = path.resolve(argv[++position])
    else if (flag === '--page') options.page = argv[++position]
    else if (flag === '--help' || flag === '-h') options.help = true
    else throw new Error(`Unknown argument: ${flag}`)
  }
  return options
}

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))

const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`

// Write only when bytes differ, so unchanged files keep their mtime.
const writeIfChanged = (file, data) => {
  const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data)
  if (fs.existsSync(file) && fs.readFileSync(file).equals(buffer)) return false
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, buffer)
  return true
}

const loadConfig = (root) => {
  const file = path.join(root, 'figma', 'slicer.config.json')
  return resolveConfig(fs.existsSync(file) ? readJson(file) : {})
}

// Per-page boundary overrides: { pages: { <pageSlug>: { splitAt, mergeRanges } } }.
export const loadPageOverrides = (root) => {
  const file = path.join(root, 'figma', 'slicer.overrides.json')
  return fs.existsSync(file) ? readJson(file).pages || {} : {}
}

const sectionDir = (band) => `${String(band.index).padStart(2, '0')}-${band.slug}`

// Decode a render once; crops reuse the raw pixels.
const loadRender = async (root, frame, warn) => {
  if (!frame.render) {
    warn(`no render recorded for ${frame.name} (${frame.id}); writing specs without crops`)
    return null
  }
  const file = path.join(root, frame.render)
  if (frame.status === 'failed' || !fs.existsSync(file)) {
    warn(`render ${frame.status === 'failed' ? 'failed' : 'missing'} for ${frame.name} (${frame.id}) at ${frame.render}; writing specs without crops`)
    return null
  }
  const { data, info } = await sharp(file).raw().toBuffer({ resolveWithObject: true })
  return { data, info }
}

// Pixel mapping of a frame render. Figma renders the frame's bounding box
// (or its render bounds when it does not clip content) and silently scales a
// render down when it would exceed its maximum image size, so the requested
// scale is not trusted: the true pixels per unit come from the decoded image
// size divided by the rendered box.
export const renderMapping = (frame, info) => {
  const box = frame.absoluteBoundingBox
  const rendered = frame.clipsContent === false && frame.absoluteRenderBounds ? frame.absoluteRenderBounds : box
  return {
    scaleX: info.width / rendered.width,
    scaleY: info.height / rendered.height,
    offsetX: rendered.x - box.x,
    offsetY: rendered.y - box.y
  }
}

// Pixel rectangle (left, top, width, height) of a band crop, clamped to the image.
export const cropRect = (mapping, info, frameWidth, cropY0, cropY1) => {
  const clamp = (value, max) => Math.max(0, Math.min(max, value))
  const left = clamp(Math.round((0 - mapping.offsetX) * mapping.scaleX), info.width - 1)
  const right = clamp(Math.round((frameWidth - mapping.offsetX) * mapping.scaleX), info.width)
  const top = clamp(Math.floor((cropY0 - mapping.offsetY) * mapping.scaleY), info.height - 1)
  const bottom = clamp(Math.ceil((cropY1 - mapping.offsetY) * mapping.scaleY), info.height)
  return { left, top, width: Math.max(1, right - left), height: Math.max(1, bottom - top) }
}

const cropBand = async (render, frame, band, quality) => {
  const { info } = render
  const rect = cropRect(renderMapping(frame, info), info, frame.absoluteBoundingBox.width, band.cropY0, band.cropY1)
  return sharp(render.data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .extract(rect)
    .webp({ quality })
    .toBuffer()
}

// Remove generated files from section folders no longer produced.
const pruneStaleSections = (sectionsRoot, keep, warn) => {
  if (!fs.existsSync(sectionsRoot)) return
  for (const entry of fs.readdirSync(sectionsRoot).sort()) {
    if (keep.has(entry)) continue
    const dir = path.join(sectionsRoot, entry)
    if (!fs.statSync(dir).isDirectory()) continue
    for (const generated of ['section.webp', 'spec.json']) {
      const file = path.join(dir, generated)
      if (fs.existsSync(file)) fs.unlinkSync(file)
    }
    if (fs.readdirSync(dir).length) warn(`stale section folder ${entry} kept: it holds files the slicer did not write`)
    else fs.rmdirSync(dir)
  }
}

const animationMarkdown = (pageSlug, notes) => {
  const lines = [`# Animation notes: ${pageSlug}`, '']
  for (const note of notes) {
    lines.push(`## ${note.name} (${note.id})`, '')
    if (note.sectionIndex) lines.push(`Section: ${note.sectionIndex}`, '')
    if (note.texts.length) for (const text of note.texts) lines.push(text, '')
    else lines.push('(no text notes)', '')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

const byNameThenId = (a, b) => String(a.name).localeCompare(String(b.name)) || String(a.id).localeCompare(String(b.id))

export const slice = async ({ root = DEFAULT_ROOT, page = null, log = console.log, warn = (message) => console.warn(`warning: ${message}`) } = {}) => {
  const snapshotFile = path.join(root, 'figma', 'snapshot.json')
  const rawFile = path.join(root, 'figma', 'raw', 'file.json.gz')
  if (!fs.existsSync(snapshotFile)) throw new Error(`Missing ${path.relative(root, snapshotFile)}; run the snapshot first`)
  if (!fs.existsSync(rawFile)) throw new Error(`Missing ${path.relative(root, rawFile)}; run the snapshot first`)

  const config = loadConfig(root)
  const pageOverrides = loadPageOverrides(root)
  const snapshot = readJson(snapshotFile)
  const file = JSON.parse(zlib.gunzipSync(fs.readFileSync(rawFile)).toString('utf8'))
  const nodes = indexNodes(file.document)
  const isNav = createNavMatcher(file, config)

  // Group frames by page slug.
  const groups = new Map()
  for (const frame of snapshot.frames || []) {
    if (!['page', 'side', 'animation'].includes(frame.kind)) continue
    if (!groups.has(frame.pageSlug)) groups.set(frame.pageSlug, { page: [], side: [], animation: [] })
    groups.get(frame.pageSlug)[frame.kind].push(frame)
  }
  const slugs = [...groups.keys()].filter((slug) => groups.get(slug).page.length || groups.get(slug).side.length).sort()
  const selected = page ? slugs.filter((slug) => slug === page) : slugs
  if (page && !selected.length) throw new Error(`No page or side frame with pageSlug "${page}" in snapshot.json`)

  const summary = []
  for (const pageSlug of selected) {
    const group = groups.get(pageSlug)
    const pageDir = path.join(root, 'figma', 'pages', pageSlug)
    const sections = []
    const outputs = []

    const pageFrames = [...group.page].sort(byNameThenId)
    if (pageFrames.length > 1) warn(`${pageSlug} has ${pageFrames.length} page frames; slicing them in name order`)

    for (const frameMeta of pageFrames) {
      const frame = nodes.get(frameMeta.id)
      if (!frame) {
        warn(`page frame ${frameMeta.id} (${frameMeta.name}) not found in raw file; skipped`)
        continue
      }
      for (const band of computeBands(frame, config, { isManualOverlay: isNav, pageOverrides: pageOverrides[pageSlug] })) {
        const index = sections.length + 1
        outputs.push({ frameMeta, frame, band: { ...band, index, laneHint: null, source: 'page' } })
        sections.push(null)
      }
    }
    for (const frameMeta of [...group.side].sort(byNameThenId)) {
      const frame = nodes.get(frameMeta.id)
      if (!frame) {
        warn(`side frame ${frameMeta.id} (${frameMeta.name}) not found in raw file; skipped`)
        continue
      }
      const index = sections.length + 1
      outputs.push({ frameMeta, frame, band: { ...wholeFrameBand(frame, index, config), source: 'side' } })
      sections.push(null)
    }

    // Animation notes: page level, plus the band whose crop range holds the
    // vertical centre of the animation reference, when it sits beside the page.
    const primary = pageFrames.map((meta) => nodes.get(meta.id)).find(Boolean)
    const animationNotes = []
    for (const frameMeta of [...group.animation].sort(byNameThenId)) {
      const node = nodes.get(frameMeta.id)
      if (!node) {
        warn(`animation frame ${frameMeta.id} (${frameMeta.name}) not found in raw file; skipped`)
        continue
      }
      const note = animationNote(node)
      if (primary && node.absoluteBoundingBox) {
        const centre = node.absoluteBoundingBox.y + node.absoluteBoundingBox.height / 2 - primary.absoluteBoundingBox.y
        const owner = outputs.find((entry) => entry.frame === primary && centre >= entry.band.cropY0 && centre < entry.band.cropY1)
        if (owner) {
          note.sectionIndex = owner.band.index
          owner.band.animationNotes = [...(owner.band.animationNotes || []), { id: note.id, name: note.name, texts: note.texts }]
        }
      }
      animationNotes.push(note)
    }

    const renders = new Map()
    const keep = new Set()
    for (let position = 0; position < outputs.length; position++) {
      const { frameMeta, frame, band } = outputs[position]
      const dir = sectionDir(band)
      keep.add(dir)
      const spec = buildSpec({ file, frame, band, pageSlug, overrides: config, index: nodes, isManualOverlay: isNav })
      spec.source = band.source
      writeIfChanged(path.join(pageDir, 'sections', dir, 'spec.json'), stableJson(spec))

      if (!renders.has(frameMeta.id)) renders.set(frameMeta.id, await loadRender(root, frameMeta, warn))
      const render = renders.get(frameMeta.id)
      let crop = null
      if (render) {
        const webp = await cropBand(render, frame, band, config.webpQuality)
        writeIfChanged(path.join(pageDir, 'sections', dir, 'section.webp'), webp)
        crop = `sections/${dir}/section.webp`
      }
      sections[position] = {
        index: band.index,
        slug: band.slug,
        dir: `sections/${dir}`,
        source: band.source,
        laneHint: band.laneHint ?? null,
        frameId: frame.id,
        frameName: frame.name,
        y0: band.y0,
        y1: band.y1,
        cropY0: band.cropY0,
        cropY1: band.cropY1,
        nodeIds: band.nodeIds,
        backgroundIds: band.backgroundIds || [],
        crop
      }
    }
    pruneStaleSections(path.join(pageDir, 'sections'), keep, warn)

    const describe = (meta) => {
      const node = nodes.get(meta.id)
      const box = node?.absoluteBoundingBox
      return {
        id: meta.id,
        name: meta.name,
        kind: meta.kind,
        width: box ? round2(box.width) : meta.width ?? null,
        height: box ? round2(box.height) : meta.height ?? null,
        scale: meta.scale ?? null,
        renderScale: renders.get(meta.id) && node ? Math.round(renderMapping(node, renders.get(meta.id).info).scaleY * 10000) / 10000 : null,
        render: meta.render ?? null,
        status: meta.status ?? null
      }
    }
    const frames = [...pageFrames, ...[...group.side].sort(byNameThenId)].filter((meta) => nodes.has(meta.id))

    writeIfChanged(path.join(pageDir, 'sections.json'), stableJson({ pageSlug, frames: frames.map(describe), sections }))

    const trees = frames.map((meta) => {
      const node = nodes.get(meta.id)
      const box = node.absoluteBoundingBox
      return { ...describe(meta), tree: trimTree(node, box.x, box.y, config.pageTreeDepth, isNav) }
    })
    writeIfChanged(path.join(pageDir, 'page.json'), stableJson({ pageSlug, frames: trees, animationNotes }))

    if (animationNotes.length) {
      writeIfChanged(path.join(root, 'figma', 'animations', `${pageSlug}.md`), animationMarkdown(pageSlug, animationNotes))
    }

    summary.push({ pageSlug, sections: sections.length, animationNotes: animationNotes.length })
    log(`${pageSlug}: ${sections.length} sections${animationNotes.length ? `, ${animationNotes.length} animation notes` : ''}`)
  }
  return summary
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  try {
    const options = parseArgs(process.argv.slice(2))
    if (options.help) {
      console.log('Usage: node scripts/api/figma/slice-sections.mjs [--page <slug>] [--root <dir>]')
    } else {
      await slice(options)
    }
  } catch (error) {
    console.error(`slice-sections: ${error.message}`)
    process.exitCode = 1
  }
}
