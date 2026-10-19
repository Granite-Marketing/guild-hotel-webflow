// Pure section spec builder (plan U3). Turns one band of a page frame into a
// trimmed spec: visible text with type styles, colours, image fills,
// geometry relative to the band, and nav instances as manual overlays.
// Hidden nodes (visible === false) never appear. No I/O lives here.

import { isVisible, kebab, relativeBox, resolveConfig, round2, walkVisible } from './bands.mjs'

export const MANUAL_NAV_REASON = 'nav component instance: manual lane, bbox only'

const channel = (value) => Math.round(Math.max(0, Math.min(1, value)) * 255).toString(16).padStart(2, '0')

export const toHex = (color) => `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`.toUpperCase()

const visiblePaints = (paints) => (Array.isArray(paints) ? paints.filter((paint) => paint && paint.visible !== false) : [])

const paintOpacity = (paint) => round2((paint.opacity ?? 1) * (paint.color?.a ?? 1))

// Predicate: is this node a nav instance that a human builds by hand?
export const createNavMatcher = (file, overrides = {}) => {
  const config = resolveConfig(overrides)
  const pattern = new RegExp(config.nav.namePattern, 'i')
  const setIds = new Set(config.nav.componentSetIds)
  for (const [id, set] of Object.entries(file.componentSets || {})) {
    if (pattern.test(set.name || '')) setIds.add(id)
  }
  const componentIds = new Set()
  for (const [id, component] of Object.entries(file.components || {})) {
    if (setIds.has(component.componentSetId)) componentIds.add(id)
  }
  return (node) =>
    node.type === 'INSTANCE' && (componentIds.has(node.componentId) || pattern.test(node.name || ''))
}

export const indexNodes = (root) => {
  const index = new Map()
  const visit = (node) => {
    index.set(node.id, node)
    for (const child of node.children || []) visit(child)
  }
  visit(root)
  return index
}

const textEntry = (node, file, originX, originY) => {
  const style = node.style || {}
  const styleId = node.styles?.text || null
  const fill = visiblePaints(node.fills).find((paint) => paint.type === 'SOLID')
  return {
    id: node.id,
    characters: node.characters,
    styleName: styleId ? file.styles?.[styleId]?.name ?? null : null,
    styleId,
    fontFamily: style.fontFamily ?? null,
    fontSize: style.fontSize ?? null,
    fontWeight: style.fontWeight ?? null,
    lineHeightPx: style.lineHeightPx !== undefined ? round2(style.lineHeightPx) : null,
    letterSpacing: style.letterSpacing !== undefined ? round2(style.letterSpacing) : null,
    textCase: style.textCase ?? 'ORIGINAL',
    textAlignHorizontal: style.textAlignHorizontal ?? null,
    fill: fill ? toHex(fill.color) : null,
    bbox: relativeBox(node, originX, originY)
  }
}

// Build the spec for one band. `frame` is the page frame node, `band` comes
// from computeBands (or a whole-frame band for side frames).
export const buildSpec = ({ file, frame, band, pageSlug, overrides = {}, index: nodeIndex, isManualOverlay }) => {
  const nodes = nodeIndex || indexNodes(frame)
  const isNav = isManualOverlay || createNavMatcher(file, overrides)
  const frameBox = frame.absoluteBoundingBox
  const originX = frameBox.x
  const originY = frameBox.y + band.cropY0

  const texts = []
  const images = []
  const manualOverlays = []
  const colorCounts = new Map()

  const countFills = (node) => {
    for (const paint of visiblePaints(node.fills)) {
      if (paint.type === 'SOLID' && paint.color) {
        const key = `${toHex(paint.color)}|${paintOpacity(paint)}`
        colorCounts.set(key, (colorCounts.get(key) || 0) + 1)
      }
      if (paint.type === 'IMAGE' && paint.imageRef) {
        images.push({ nodeId: node.id, name: node.name, imageRef: paint.imageRef, bbox: relativeBox(node, originX, originY) })
      }
    }
  }

  const bandNodes = band.nodeIds.map((id) => nodes.get(id)).filter(isVisible)
  for (const root of bandNodes) {
    walkVisible(root, (node) => {
      if (isNav(node)) {
        manualOverlays.push({ nodeId: node.id, name: node.name, reason: MANUAL_NAV_REASON, bbox: relativeBox(node, originX, originY) })
        return false
      }
      countFills(node)
      if (node.type === 'TEXT' && typeof node.characters === 'string') {
        texts.push(textEntry(node, file, originX, originY))
      }
      return true
    })
  }

  // Background layers contribute their own fills only; their children are
  // banded separately.
  const backgroundNodes = (band.backgroundIds || []).map((id) => nodes.get(id)).filter(isVisible)
  for (const node of backgroundNodes) countFills(node)

  const byPosition = (a, b) => a.bbox.y - b.bbox.y || a.bbox.x - b.bbox.x || String(a.id || a.nodeId).localeCompare(String(b.id || b.nodeId))
  texts.sort(byPosition)
  images.sort(byPosition)
  manualOverlays.sort(byPosition)

  const colors = [...colorCounts.entries()]
    .map(([key, count]) => {
      const [hex, opacity] = key.split('|')
      return { hex, opacity: Number(opacity), count }
    })
    .sort((a, b) => b.count - a.count || a.hex.localeCompare(b.hex) || a.opacity - b.opacity)

  const compact = (node) => ({ id: node.id, type: node.type, name: node.name, bbox: relativeBox(node, originX, originY) })

  return {
    pageSlug,
    index: band.index,
    slug: band.slug,
    laneHint: band.laneHint ?? null,
    frameId: frame.id,
    bbox: {
      x: 0,
      y: round2(band.y0),
      width: round2(frameBox.width),
      height: round2(band.y1 - band.y0)
    },
    crop: {
      y0: round2(band.cropY0),
      y1: round2(band.cropY1)
    },
    bboxOrigin: 'band crop top-left (x from the page frame left edge, y from crop.y0)',
    texts,
    colors,
    images,
    manualOverlays,
    nodes: bandNodes.map(compact),
    backgrounds: backgroundNodes.map(compact),
    animationNotes: band.animationNotes || []
  }
}

// A whole side frame (overlay, modal, menu) as one manual band.
export const wholeFrameBand = (frame, index, overrides = {}) => {
  const config = resolveConfig(overrides)
  const box = frame.absoluteBoundingBox
  return {
    index,
    y0: 0,
    y1: round2(box.height),
    cropY0: 0,
    cropY1: round2(box.height),
    nodeIds: (frame.children || []).filter(isVisible).map((node) => node.id),
    backgroundIds: [],
    slug: kebab(frame.name, config.slugMaxWords) || 'section',
    laneHint: 'manual'
  }
}

// Trimmed visible tree for page.json, depth-limited.
export const trimTree = (node, originX, originY, depth, isManualOverlay = () => false) => {
  const entry = { id: node.id, type: node.type, name: node.name, bbox: relativeBox(node, originX, originY) }
  if (node.type === 'TEXT') entry.characters = node.characters
  if (isManualOverlay(node)) {
    entry.manual = true
    return entry
  }
  const children = (node.children || []).filter(isVisible)
  if (children.length) {
    if (depth > 0) {
      entry.children = children.map((child) => trimTree(child, originX, originY, depth - 1, isManualOverlay))
    } else {
      entry.childCount = children.length
    }
  }
  return entry
}

// Visible text of an animation reference section, in reading order.
export const animationNote = (node) => {
  const texts = []
  walkVisible(node, (child) => {
    if (child.type === 'TEXT' && String(child.characters || '').trim() && child.absoluteBoundingBox) texts.push(child)
    return true
  })
  texts.sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y || a.absoluteBoundingBox.x - b.absoluteBoundingBox.x)
  return { id: node.id, name: node.name, texts: texts.map((text) => text.characters) }
}
