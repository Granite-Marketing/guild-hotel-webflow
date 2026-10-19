// Pure band slicer for flat Figma page frames (plan KTD3).
// A page frame is a 1600px frame of absolutely positioned children with no
// section nodes. Visible top-level children are grouped into vertical bands;
// each band becomes one section folder. No I/O lives here.

export const DEFAULT_CONFIG = Object.freeze({
  mergeGap: 120,
  minBandHeight: 200,
  maxBandHeight: 2500,
  overlapTolerance: 2,
  backgroundTypes: ['RECTANGLE', 'VECTOR', 'ELLIPSE'],
  fullBleed: {
    minWidthRatio: 0.95,
    minHeight: 600,
    types: ['RECTANGLE', 'FRAME', 'GROUP', 'INSTANCE', 'COMPONENT']
  },
  repeat: {
    minHeight: 300,
    heightTolerance: 0.02,
    widthTolerance: 0.02,
    maxGap: 120
  },
  splitBeforeText: {
    patterns: [
      '^faqs?$',
      '^offers? (&|and) packages$',
      '^your request$',
      '^more of the guild$',
      '^book your escape$',
      '^the hotel$',
      '^experiences$',
      '^social$',
      '^links$',
      '^back to rooms$'
    ],
    window: 400,
    padding: 16,
    minGap: 8
  },
  mergeSplitGrids: {
    enabled: true,
    sizeTolerance: 0.02,
    minCells: 2,
    minCellHeight: 300,
    decorMaxThickness: 4
  },
  minCropHeight: 80,
  slugMaxWords: 6,
  pageTreeDepth: 3,
  webpQuality: 85,
  nav: {
    componentSetIds: ['236:8312'],
    namePattern: 'guild-nav'
  }
})

export const resolveConfig = (overrides = {}) => ({
  ...DEFAULT_CONFIG,
  ...overrides,
  fullBleed: { ...DEFAULT_CONFIG.fullBleed, ...(overrides.fullBleed || {}) },
  repeat: { ...DEFAULT_CONFIG.repeat, ...(overrides.repeat || {}) },
  splitBeforeText: { ...DEFAULT_CONFIG.splitBeforeText, ...(overrides.splitBeforeText || {}) },
  mergeSplitGrids: { ...DEFAULT_CONFIG.mergeSplitGrids, ...(overrides.mergeSplitGrids || {}) },
  nav: { ...DEFAULT_CONFIG.nav, ...(overrides.nav || {}) }
})

export const isVisible = (node) => node && node.visible !== false

export const round2 = (value) => Math.round(value * 100) / 100

// Bounding box of a node relative to an origin point, or null when absent.
export const relativeBox = (node, originX, originY) => {
  const box = node.absoluteBoundingBox
  if (!box) return null
  return {
    x: round2(box.x - originX),
    y: round2(box.y - originY),
    width: round2(box.width),
    height: round2(box.height)
  }
}

export const kebab = (text, maxWords = 6) => {
  const words = String(text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\u2018\u2019'`]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
  return words.slice(0, maxWords).join('-')
}

// Depth-first walk over visible nodes. The callback returns false to stop
// descent into a node's children (same contract as walkNode in export-assets).
export const walkVisible = (node, callback) => {
  if (!isVisible(node)) return
  const descend = callback(node)
  if (descend === false) return
  for (const child of node.children || []) walkVisible(child, callback)
}

// First visible TEXT (by y, then x) under the given nodes, skipping any node
// the skip predicate flags (nav instances are manual overlays, not content).
export const firstText = (nodes, skip = () => false) => {
  const texts = []
  for (const root of nodes) {
    walkVisible(root, (node) => {
      if (skip(node)) return false
      if (node.type === 'TEXT' && String(node.characters || '').trim() && node.absoluteBoundingBox) {
        texts.push(node)
      }
      return true
    })
  }
  texts.sort((a, b) =>
    a.absoluteBoundingBox.y - b.absoluteBoundingBox.y ||
    a.absoluteBoundingBox.x - b.absoluteBoundingBox.x ||
    String(a.id).localeCompare(String(b.id))
  )
  return texts[0] || null
}

// A banding item: a node with its page-relative extent clamped to the frame.
export const makeItem = (node, frameBox) => {
  const box = relativeBox(node, frameBox.x, frameBox.y)
  return {
    node,
    id: node.id,
    type: node.type,
    x: box.x,
    width: box.width,
    height: box.height,
    y0: Math.max(0, box.y),
    y1: Math.min(frameBox.height, box.y + box.height)
  }
}

const insideFrame = (node, frameBox) => {
  if (!isVisible(node) || !node.absoluteBoundingBox) return false
  const box = relativeBox(node, frameBox.x, frameBox.y)
  return !(box.y + box.height <= 0 || box.y >= frameBox.height || box.x + box.width <= 0 || box.x >= frameBox.width)
}

// Visible top-level children with page-relative extents, outside nodes dropped.
// A child taller than maxBandHeight is not allowed to swallow the page:
// a container with visible children is replaced by its children (and kept as
// a background layer), and a childless shape becomes a background layer.
// Background layers do not drive banding; they attach to every band they
// overlap so their fills still reach the spec.
export const pageItems = (frame, overrides = {}) => {
  const config = resolveConfig(overrides)
  const frameBox = frame.absoluteBoundingBox
  const items = []
  const backgrounds = []
  const toItem = (node) => makeItem(node, frameBox)
  const visit = (node) => {
    if (!isVisible(node) || !node.absoluteBoundingBox) return
    const box = relativeBox(node, frameBox.x, frameBox.y)
    const outside =
      box.y + box.height <= 0 ||
      box.y >= frameBox.height ||
      box.x + box.width <= 0 ||
      box.x >= frameBox.width
    if (outside) return
    const item = toItem(node)
    if (item.y1 - item.y0 > config.maxBandHeight) {
      const visibleChildren = (node.children || []).filter(isVisible)
      if (visibleChildren.length) {
        backgrounds.push({ ...item, expanded: true })
        for (const child of visibleChildren) visit(child)
        return
      }
      if (config.backgroundTypes.includes(node.type)) {
        backgrounds.push({ ...item, expanded: false })
        return
      }
    }
    items.push(item)
  }
  for (const node of frame.children || []) visit(node)
  const byPosition = (a, b) => a.y0 - b.y0 || b.y1 - a.y1 || String(a.id).localeCompare(String(b.id))
  items.sort(byPosition)
  backgrounds.sort(byPosition)
  return { items, backgrounds }
}

const nearlyEqual = (a, b, tolerance) => Math.abs(a - b) <= tolerance * Math.max(a, b)

// Ids of items that sit in a vertical run of 2+ near-identical siblings.
export const repeatedRunIds = (items, config) => {
  const { minHeight, heightTolerance, widthTolerance, maxGap } = config.repeat
  const candidates = items.filter((item) => item.height >= minHeight)
  const ids = new Set()
  for (let index = 0; index < candidates.length - 1; index++) {
    const current = candidates[index]
    const next = candidates[index + 1]
    const gap = next.y0 - current.y1
    if (
      gap >= -config.overlapTolerance &&
      gap <= maxGap &&
      nearlyEqual(current.height, next.height, heightTolerance) &&
      nearlyEqual(current.width, next.width, widthTolerance)
    ) {
      ids.add(current.id)
      ids.add(next.id)
    }
  }
  return ids
}

const isFullBleed = (item, frameWidth, config) =>
  config.fullBleed.types.includes(item.type) &&
  item.width >= config.fullBleed.minWidthRatio * frameWidth &&
  item.height >= config.fullBleed.minHeight

const newBand = (item, anchored) => ({
  y0: item.y0,
  y1: item.y1,
  items: [item],
  anchorEnd: anchored ? item.y1 : null
})

const mergeBands = (first, second) => ({
  y0: Math.min(first.y0, second.y0),
  y1: Math.max(first.y1, second.y1),
  items: [...first.items, ...second.items],
  anchorEnd: [first.anchorEnd, second.anchorEnd].filter((value) => value !== null).reduce((a, b) => Math.max(a, b), -Infinity)
})

const normaliseAnchor = (band) => ({ ...band, anchorEnd: Number.isFinite(band.anchorEnd) ? band.anchorEnd : null })

// Step 1: merge sorted items into bands by overlap or near-touching ranges,
// forcing a new band at full-bleed blocks and around repeated siblings.
const mergeItems = (items, frameWidth, repeatedIds, config) => {
  const bands = []
  let current = null
  for (const item of items) {
    const repeated = repeatedIds.has(item.id)
    if (!current) {
      current = newBand(item, repeated)
      continue
    }
    const clearOfCurrent = item.y0 >= current.y1 - config.overlapTolerance
    const forcedStart = (repeated || isFullBleed(item, frameWidth, config)) && clearOfCurrent
    const afterAnchor = current.anchorEnd !== null && item.y0 >= current.anchorEnd - config.overlapTolerance
    const near = item.y0 <= current.y1 + config.mergeGap
    if (!forcedStart && !afterAnchor && near) {
      current.y1 = Math.max(current.y1, item.y1)
      current.items.push(item)
      if (repeated) current.anchorEnd = Math.max(current.anchorEnd ?? -Infinity, item.y1)
    } else {
      bands.push(current)
      current = newBand(item, repeated)
    }
  }
  if (current) bands.push(current)
  return bands
}

// Step 2: fold bands shorter than minBandHeight into the nearer neighbour.
const foldSmall = (bands, config) => {
  const result = bands.map(normaliseAnchor)
  let changed = true
  while (changed && result.length > 1) {
    changed = false
    for (let index = 0; index < result.length; index++) {
      const band = result[index]
      if (band.y1 - band.y0 >= config.minBandHeight) continue
      const previous = result[index - 1]
      const next = result[index + 1]
      const gapBefore = previous ? band.y0 - previous.y1 : Infinity
      const gapAfter = next ? next.y0 - band.y1 : Infinity
      if (gapBefore <= gapAfter) {
        result.splice(index - 1, 2, normaliseAnchor(mergeBands(previous, band)))
      } else {
        result.splice(index, 2, normaliseAnchor(mergeBands(band, next)))
      }
      changed = true
      break
    }
  }
  return result
}

// Clean cut positions inside a band: points no item spans.
const cutPoints = (items) => {
  const sorted = [...items].sort((a, b) => a.y0 - b.y0 || a.y1 - b.y1)
  const cuts = []
  let reach = -Infinity
  for (const item of sorted) {
    if (reach !== -Infinity && item.y0 >= reach) cuts.push(item.y0)
    reach = Math.max(reach, item.y1)
  }
  return cuts
}

const bandFromItems = (items) => ({
  y0: Math.min(...items.map((item) => item.y0)),
  y1: Math.max(...items.map((item) => item.y1)),
  items,
  anchorEnd: null
})

// Step 3: split bands taller than maxBandHeight at child boundaries.
const splitTall = (band, config) => {
  if (band.y1 - band.y0 <= config.maxBandHeight) return [band]
  const cuts = cutPoints(band.items)
  if (!cuts.length) return [band]
  const pieces = []
  let remaining = band.items
  let start = band.y0
  while (remaining.length) {
    const end = Math.max(...remaining.map((item) => item.y1))
    if (end - start <= config.maxBandHeight) break
    const usable = cuts.filter((cut) => cut > start && end - cut >= config.minBandHeight && cut - start >= config.minBandHeight)
    if (!usable.length) break
    const within = usable.filter((cut) => cut - start <= config.maxBandHeight)
    const cut = within.length ? within[within.length - 1] : usable[0]
    const head = remaining.filter((item) => item.y0 < cut)
    pieces.push(bandFromItems(head))
    remaining = remaining.filter((item) => item.y0 >= cut)
    start = cut
  }
  if (remaining.length) pieces.push(bandFromItems(remaining))
  return pieces
}

// ---------------------------------------------------------------------------
// Boundary refinement. Bands from steps 1 to 3 follow top-level children,
// which often hold two design sections in one group. The steps below cut
// bands at section-start text, merge grids cut in two, then apply per-page
// overrides. A cut that crosses a container replaces it with its children
// (the container becomes a background of both pieces).

const byItemPosition = (a, b) => a.y0 - b.y0 || b.y1 - a.y1 || String(a.id).localeCompare(String(b.id))

const refinable = (band) => ({
  ...band,
  extraBackgrounds: band.extraBackgrounds || [],
  cutBefore: band.cutBefore ?? null,
  cutAfter: band.cutAfter ?? null
})

const joinBands = (first, second) => ({
  y0: Math.min(first.y0, second.y0),
  y1: Math.max(first.y1, second.y1),
  items: [...first.items, ...second.items],
  anchorEnd: null,
  extraBackgrounds: [...first.extraBackgrounds, ...second.extraBackgrounds.filter((layer) => !first.extraBackgrounds.some((other) => other.id === layer.id))],
  cutBefore: first.cutBefore,
  cutAfter: second.cutAfter
})

// Visible leaf boxes (nodes without visible children) under the given items.
const leafBoxes = (items, frameBox, skip) => {
  const leaves = []
  for (const item of items) {
    walkVisible(item.node, (node) => {
      if (!node.absoluteBoundingBox) return false
      const childless = !(node.children || []).some(isVisible)
      if (skip(node) || childless) {
        if (insideFrame(node, frameBox)) leaves.push(makeItem(node, frameBox))
        return false
      }
      return true
    })
  }
  return leaves
}

// Split one band at y. Items wholly above or below go to that side; a
// crossing container is replaced by its children; a crossing leaf becomes a
// background of both sides. Returns null when one side would be empty.
export const cutBandAt = (band, cut, frameBox, config) => {
  const tolerance = config.overlapTolerance
  const upper = []
  const lower = []
  const shared = []
  const queue = [...band.items]
  while (queue.length) {
    const item = queue.shift()
    if (item.y1 <= cut + tolerance) upper.push(item)
    else if (item.y0 >= cut - tolerance) lower.push(item)
    else {
      const children = (item.node.children || []).filter((child) => insideFrame(child, frameBox))
      if (children.length) queue.push(...children.map((child) => makeItem(child, frameBox)))
      shared.push(item)
    }
  }
  if (!upper.length || !lower.length) return null
  const background = [...band.extraBackgrounds, ...shared]
  // A piece keeps the outer edge of any container it was cut from, so the
  // crop line on its far side still follows that container.
  const piece = (items, cutBefore, cutAfter) => ({
    y0: Math.max(cutBefore ?? -Infinity, Math.min(...[...items, ...shared].map((item) => item.y0))),
    y1: Math.min(cutAfter ?? Infinity, Math.max(...[...items, ...shared].map((item) => item.y1))),
    items: items.sort(byItemPosition),
    anchorEnd: null,
    extraBackgrounds: background.filter((layer) => layer.y0 < (cutAfter ?? Infinity) && layer.y1 > (cutBefore ?? -Infinity)),
    cutBefore,
    cutAfter
  })
  return [piece(upper, band.cutBefore, cut), piece(lower, cut, band.cutAfter)]
}

// Where to cut above a section-start text, or null when the text does not
// open a new section inside this band.
export const findTextCut = (band, text, frameBox, config, skip) => {
  const { window, padding, minGap } = config.splitBeforeText
  const textTop = round2(text.absoluteBoundingBox.y - frameBox.y)
  const tolerance = config.overlapTolerance
  if (textTop - band.y0 < config.minBandHeight || band.y1 - textTop < config.minBandHeight / 2) return null
  const leaves = leafBoxes(band.items, frameBox, skip)
  const wide = (leaf) => leaf.width >= config.fullBleed.minWidthRatio * frameBox.width
  const spans = (leaf, y) => leaf.y0 < y - tolerance && leaf.y1 > y + tolerance
  // Full-width layers are section backgrounds: they do not fill gaps, and
  // their edges are the preferred cut lines.
  const layers = leaves.filter(wide)
  const content = leaves.filter((leaf) => !wide(leaf))
  const clear = (y) => !content.some((leaf) => spans(leaf, y))
  const low = Math.max(band.y0 + config.minBandHeight, textTop - window)
  let cut = null
  const edges = layers
    .flatMap((leaf) => [leaf.y0, leaf.y1])
    .filter((y) => y >= low && y <= textTop && clear(y) && !layers.some((leaf) => spans(leaf, y) && !spans(leaf, textTop)))
    .sort((a, b) => b - a)
  if (edges.length) cut = edges[0]
  if (cut === null) {
    // Otherwise the middle of the largest empty gap above the text.
    const occupied = content.filter((leaf) => leaf.y1 > low && leaf.y0 < textTop).sort((a, b) => a.y0 - b.y0)
    let reach = low
    let best = null
    for (const leaf of occupied) {
      if (leaf.y0 - reach >= minGap && (!best || leaf.y0 - reach > best.size)) best = { start: reach, size: leaf.y0 - reach }
      reach = Math.max(reach, leaf.y1)
    }
    if (textTop - reach >= minGap && (!best || textTop - reach > best.size)) best = { start: reach, size: textTop - reach }
    if (best) cut = round2(best.start + best.size / 2)
    else if (clear(textTop - padding)) cut = round2(textTop - padding)
  }
  if (cut === null || cut - band.y0 < config.minBandHeight) return null
  // The upper piece must hold real content, not only a background that
  // also runs behind the text.
  const above = leaves.filter((leaf) => !spans(leaf, textTop) && leaf.y1 <= cut + tolerance && leaf.y0 >= band.y0 - tolerance)
  if (!above.length) return null
  return cut
}

const matchingTexts = (band, patterns, skip) => {
  const texts = []
  for (const item of band.items) {
    walkVisible(item.node, (node) => {
      if (skip(node)) return false
      if (node.type === 'TEXT' && node.absoluteBoundingBox) {
        const value = String(node.characters || '').trim()
        if (patterns.some((pattern) => pattern.test(value))) texts.push(node)
      }
      return true
    })
  }
  return texts.sort((a, b) => a.absoluteBoundingBox.y - b.absoluteBoundingBox.y || String(a.id).localeCompare(String(b.id)))
}

// Step 4: start a new band at the topmost section-start text in each band.
export const splitBeforeText = (bands, frameBox, config, skip = () => false) => {
  const patterns = (config.splitBeforeText.patterns || []).map((source) => new RegExp(source, 'i'))
  if (!patterns.length) return bands
  const result = []
  const queue = [...bands]
  while (queue.length) {
    const band = queue.shift()
    let pieces = null
    for (const text of matchingTexts(band, patterns, skip)) {
      const cut = findTextCut(band, text, frameBox, config, skip)
      if (cut === null) continue
      pieces = cutBandAt(band, cut, frameBox, config)
      if (pieces) break
    }
    if (pieces) {
      result.push(pieces[0])
      queue.unshift(pieces[1])
    } else {
      result.push(band)
    }
  }
  return result
}

const sameSize = (a, b, tolerance) => nearlyEqual(a.width, b.width, tolerance) && nearlyEqual(a.height, b.height, tolerance)

// Step 5: a grid or gallery cut across two bands becomes one band. The first
// band must hold 2+ grid cells; the second may hold only cells of a size
// already in the first, thin decoration, and text sitting on those cells.
// A band opened by an explicit cut, or holding a section-start text
// (splitBeforeText patterns), is never merged back.
export const isGridContinuation = (first, second, config, skip = () => false) => {
  if (second.cutBefore !== null && second.cutBefore !== undefined) return false
  const patterns = (config.splitBeforeText.patterns || []).map((source) => new RegExp(source, 'i'))
  if (matchingTexts(second, patterns, skip).length) return false
  const { sizeTolerance, minCells, minCellHeight, decorMaxThickness } = config.mergeSplitGrids
  const cells = first.items.filter((item) => item.height >= minCellHeight)
  if (cells.length < minCells) return false
  const decor = (item) => Math.min(item.width, item.height) <= decorMaxThickness
  const matched = second.items.filter((item) => !decor(item) && item.type !== 'TEXT' && cells.some((cell) => sameSize(cell, item, sizeTolerance)))
  if (!matched.length) return false
  return second.items.every((item) => {
    if (decor(item) || matched.includes(item)) return true
    if (item.type !== 'TEXT') return false
    return matched.some((cell) => item.y0 >= cell.y0 && item.y1 <= cell.y1 && item.x >= cell.x - 1 && item.x < cell.x + cell.width)
  })
}

export const mergeSplitGrids = (bands, config, skip = () => false) => {
  if (!config.mergeSplitGrids.enabled) return bands
  const result = []
  for (const band of bands) {
    const previous = result[result.length - 1]
    if (previous && isGridContinuation(previous, band, config, skip)) result[result.length - 1] = joinBands(previous, band)
    else result.push(band)
  }
  return result
}

// Step 6: per-page overrides from figma/slicer.overrides.json, frame y units.
// splitAt cuts the band holding y (or fixes the crop line when y falls
// between bands); mergeRanges joins every band whose centre lies in range.
export const applyPageOverrides = (bands, pageOverrides, frameBox, config) => {
  let result = bands
  for (const y of [...(pageOverrides?.splitAt || [])].sort((a, b) => a - b)) {
    const position = result.findIndex((band) => band.y0 < y && band.y1 > y)
    if (position >= 0) {
      const pieces = cutBandAt(result[position], y, frameBox, config)
      if (pieces) result = [...result.slice(0, position), ...pieces, ...result.slice(position + 1)]
      continue
    }
    const next = result.findIndex((band) => band.y0 >= y)
    if (next > 0) {
      result = result.map((band, index) => (index === next - 1 ? { ...band, cutAfter: y } : index === next ? { ...band, cutBefore: y } : band))
    }
  }
  for (const [start, end] of pageOverrides?.mergeRanges || []) {
    const merged = []
    for (const band of result) {
      const centre = (band.y0 + band.y1) / 2
      const previous = merged[merged.length - 1]
      const inRange = centre >= start && centre <= end
      if (inRange && previous && previous.inRange) merged[merged.length - 1] = { ...joinBands(previous, band), inRange: true }
      else merged.push({ ...band, inRange })
    }
    result = merged.map(({ inRange, ...band }) => band)
  }
  return result
}

// Crop lines: an explicit cut wins, otherwise halfway between bands.
const cropLines = (bands, frameHeight) =>
  bands.map((band, position) => {
    const previous = bands[position - 1]
    const next = bands[position + 1]
    const cropY0 = previous ? round2(band.cutBefore ?? previous.cutAfter ?? (previous.y1 + band.y0) / 2) : 0
    const cropY1 = next ? round2(band.cutAfter ?? next.cutBefore ?? (band.y1 + next.y0) / 2) : round2(frameHeight)
    return { cropY0, cropY1 }
  })

// Step 7: no empty or near-empty crops. A band whose crop is shorter than
// minCropHeight joins the neighbour it is closer to.
export const foldThinCrops = (bands, frameHeight, config) => {
  let result = bands
  for (;;) {
    const lines = cropLines(result, frameHeight)
    const position = lines.findIndex((line) => line.cropY1 - line.cropY0 < config.minCropHeight)
    if (position < 0 || result.length < 2) return result
    const previous = result[position - 1]
    const next = result[position + 1]
    const gapBefore = previous ? result[position].y0 - previous.y1 : Infinity
    const gapAfter = next ? next.y0 - result[position].y1 : Infinity
    if (gapBefore <= gapAfter) result = [...result.slice(0, position - 1), joinBands(previous, result[position]), ...result.slice(position + 1)]
    else result = [...result.slice(0, position), joinBands(result[position], next), ...result.slice(position + 2)]
  }
}

// Main entry. Returns ordered bands with content extents (y0, y1), crop
// extents that tile the frame (cropY0, cropY1), top-level node ids and a slug.
// options.pageOverrides: { splitAt: [y], mergeRanges: [[y0, y1]] } for this frame.
export const computeBands = (frame, overrides = {}, options = {}) => {
  const config = resolveConfig(overrides)
  const skip = options.isManualOverlay || (() => false)
  const frameBox = frame.absoluteBoundingBox
  const { items, backgrounds } = pageItems(frame, config)
  if (!items.length) return []
  const repeatedIds = repeatedRunIds(items, config)
  const merged = mergeItems(items, frameBox.width, repeatedIds, config)
  const folded = foldSmall(merged, config)
  const split = folded.flatMap((band) => splitTall(band, config)).map(refinable)
  const texted = splitBeforeText(split, frameBox, config, skip)
  const grids = mergeSplitGrids(texted, config, skip)
  const overridden = applyPageOverrides(grids, options.pageOverrides, frameBox, config)
  const final = foldThinCrops(overridden, frameBox.height, config)
  const lines = cropLines(final, frameBox.height)

  return final.map((band, position) => {
    const { cropY0, cropY1 } = lines[position]
    const orderedItems = [...band.items].sort((a, b) => a.y0 - b.y0 || String(a.id).localeCompare(String(b.id)))
    const text = firstText(orderedItems.map((item) => item.node), skip)
    const slug = (text && kebab(text.characters, config.slugMaxWords)) || 'section'
    const layers = [
      ...backgrounds.filter((layer) => layer.y0 < band.y1 && layer.y1 > band.y0),
      ...band.extraBackgrounds.filter((layer) => layer.y0 < cropY1 && layer.y1 > cropY0)
    ]
    return {
      index: position + 1,
      y0: round2(band.y0),
      y1: round2(band.y1),
      cropY0,
      cropY1,
      nodeIds: orderedItems.map((item) => item.id),
      backgroundIds: [...new Set(layers.map((layer) => layer.id))],
      slug
    }
  })
}
