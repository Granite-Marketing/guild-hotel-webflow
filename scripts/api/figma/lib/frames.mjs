// Structural frame discovery and render scale tiers for the Figma snapshot.
// Pure functions: no network, no filesystem.

// Render cap in megapixels per rendered image. Figma scales down renders that
// exceed its own limit; 25 is a conservative default. Confirm the current limit
// against Figma's GET /v1/images documentation before raising it.
export const DEFAULT_RENDER_CAP_MEGAPIXELS = 25

export const SCALE_TIERS = [2, 1, 0.75, 0.5]

export const BRAND_FRAME_ID = '2154:2273'

const PAGE_WIDTH = 1600
const PAGE_WIDTH_TOLERANCE = 2
const PAGE_MIN_HEIGHT = 3000
const SIDE_MAX_HEIGHT = 1000

export function slugify (name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function kebab (name) {
  return String(name)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function idSafe (id) {
  return String(id).replace(/:/g, '-')
}

export function renderPath (id) {
  return `figma/.cache/renders/${idSafe(id)}.png`
}

function size (node) {
  const box = node.absoluteBoundingBox || {}
  return { width: Math.round(box.width || 0), height: Math.round(box.height || 0) }
}

function isPageWidth (width) {
  return Math.abs(width - PAGE_WIDTH) <= PAGE_WIDTH_TOLERANCE
}

// Classify one child of a top-level SECTION. Returns a kind or null (ignored).
export function classifySectionChild (child) {
  if (child.visible === false) return null
  const { width, height } = size(child)
  if (child.type === 'FRAME' && isPageWidth(width)) {
    if (height >= PAGE_MIN_HEIGHT) return 'page'
    if (height < SIDE_MAX_HEIGHT) return 'side'
    return null
  }
  if (child.type === 'SECTION' && /animation/i.test(child.name)) return 'animation'
  if (child.type === 'COMPONENT_SET') return 'nav'
  return null
}

// Walk the first canvas and return every frame the snapshot should capture.
// Brand frame is included with kind 'brand' (exported as SVGs, not rendered).
export function discoverFrames (fileJson) {
  const frames = []
  const warnings = []
  const canvases = fileJson?.document?.children || []
  for (const canvas of canvases) {
    for (const top of canvas.children || []) {
      if (top.visible === false) continue
      if (top.id === BRAND_FRAME_ID) {
        frames.push(frameEntry(top, 'brand', null, 'brand'))
        continue
      }
      if (top.type !== 'SECTION') continue
      const pageSlug = slugify(top.name)
      const pagesInSection = []
      for (const child of top.children || []) {
        const kind = classifySectionChild(child)
        if (!kind) {
          if (child.type === 'FRAME') {
            const { width, height } = size(child)
            warnings.push(`Unclassified frame ${child.id} "${child.name}" (${width}x${height}) in ${top.name}`)
          }
          continue
        }
        const entry = frameEntry(child, kind, top, pageSlug)
        frames.push(entry)
        if (kind === 'page') pagesInSection.push(entry)
      }
      if (pagesInSection.length > 1) {
        warnings.push(`Section ${top.name} has ${pagesInSection.length} page frames`)
      }
    }
  }
  return { frames, warnings }
}

function frameEntry (node, kind, section, pageSlug) {
  const { width, height } = size(node)
  return {
    id: node.id,
    name: node.name,
    kind,
    sectionId: section ? section.id : null,
    sectionName: section ? section.name : null,
    pageSlug,
    width,
    height
  }
}

// Highest tier whose rendered pixel count stays within the cap.
export function pickScale (width, height, capMegapixels = DEFAULT_RENDER_CAP_MEGAPIXELS, tiers = SCALE_TIERS) {
  const cap = capMegapixels * 1e6
  const sorted = [...tiers].sort((a, b) => b - a)
  for (const tier of sorted) {
    if (width * height * tier * tier <= cap) return tier
  }
  return sorted[sorted.length - 1]
}

// Group renderable frames by scale tier: { [scale]: [frame, ...] }, highest tier first.
export function bucketByTier (frames, capMegapixels = DEFAULT_RENDER_CAP_MEGAPIXELS, tiers = SCALE_TIERS) {
  const buckets = new Map()
  for (const frame of frames) {
    if (frame.kind === 'brand') continue
    const scale = pickScale(frame.width, frame.height, capMegapixels, tiers)
    if (!buckets.has(scale)) buckets.set(scale, [])
    buckets.get(scale).push({ ...frame, scale })
  }
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([scale, items]) => ({ scale, frames: items }))
}

// Top-level GROUP children of the brand frame, each exported as one SVG.
export function brandGroups (fileJson) {
  const canvases = fileJson?.document?.children || []
  for (const canvas of canvases) {
    for (const top of canvas.children || []) {
      if (top.id !== BRAND_FRAME_ID) continue
      return (top.children || [])
        .filter(child => child.type === 'GROUP' && child.visible !== false)
        .map(child => ({ id: child.id, name: child.name, file: `figma/brand/${kebab(child.name)}.svg` }))
    }
  }
  return []
}

// Visible nodes with IMAGE fills, grouped by imageRef.
export function collectImageFills (fileJson) {
  const byRef = new Map()
  const walk = (node, path) => {
    if (node.visible === false) return
    const here = [...path, node.name]
    for (const fill of node.fills || []) {
      if (fill.type === 'IMAGE' && fill.imageRef) {
        if (!byRef.has(fill.imageRef)) byRef.set(fill.imageRef, [])
        byRef.get(fill.imageRef).push({
          nodeId: node.id,
          name: node.name,
          path: here.join(' > '),
          bounds: node.absoluteBoundingBox || null
        })
      }
    }
    for (const child of node.children || []) walk(child, here)
  }
  if (fileJson?.document) walk(fileJson.document, [])
  return byRef
}
