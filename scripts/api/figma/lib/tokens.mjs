// Token extraction from a verbatim Figma file JSON (GET /v1/files/:key).
// Pure functions only: no network, no filesystem. The CLI lives in
// scripts/api/figma/extract-tokens.mjs.
//
// Output is deterministic: every list is explicitly sorted and no timestamps
// are emitted (only the optional `sourceVersion` from the file).

export const TOKENS_SCHEMA_VERSION = 1

// Fonts every browser can render without a webfont upload.
export const SYSTEM_FONTS = [
  '-apple-system',
  'Arial',
  'Arial Black',
  'BlinkMacSystemFont',
  'Courier New',
  'Georgia',
  'Helvetica',
  'Helvetica Neue',
  'Impact',
  'monospace',
  'sans-serif',
  'Segoe UI',
  'serif',
  'system-ui',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana',
]

// Figma's default rectangle and image-placeholder fills. They mark layout
// placeholders, not design colours, so they are reported but never mapped.
export const FIGMA_PLACEHOLDER_HEXES = ['#C4C4C4', '#D9D9D9']

// RGB distance (0 to 255 per channel) under which two opaque hexes are treated
// as near duplicates of each other.
export const NEAR_DUPLICATE_DISTANCE = 3

// Chroma (max channel minus min channel, 0 to 1) under which a colour counts
// as a neutral for the neutral ladder.
export const NEUTRAL_CHROMA_MAX = 0.1

// Neutral ladder: lightest band first. A neutral lands in the first band whose
// minimum HSL lightness it meets.
export const NEUTRAL_LADDER = [
  { variable: 'color-neutral-0', minLightness: 0.97 },
  { variable: 'color-neutral-100', minLightness: 0.85 },
  { variable: 'color-neutral-300', minLightness: 0.7 },
  { variable: 'color-neutral-500', minLightness: 0.4 },
  { variable: 'color-neutral-700', minLightness: 0.2 },
  { variable: 'color-neutral-900', minLightness: 0 },
]

// Brand variables, filled in order of usage frequency.
export const BRAND_VARIABLES = ['color-primary', 'color-secondary', 'color-accent']

// Body slots in Relume order, relative to the most used body size.
const BODY_PRIMARY_CLASS = 'text-size-medium'
const BODY_LARGER_CLASSES = ['text-size-large']
const BODY_SMALLER_CLASSES = ['text-size-regular', 'text-size-small']

const WEIGHT_CLASSES = [
  [300, 'text-weight-light'],
  [400, 'text-weight-normal'],
  [500, 'text-weight-medium'],
  [600, 'text-weight-semibold'],
  [700, 'text-weight-bold'],
  [800, 'text-weight-xbold'],
]

const TEXT_CASE_TRANSFORM = {
  UPPER: 'uppercase',
  LOWER: 'lowercase',
  TITLE: 'capitalize',
  SMALL_CAPS: 'small-caps',
  SMALL_CAPS_FORCED: 'small-caps',
}

const EXAMPLE_LIMIT = 3

// ---------------------------------------------------------------------------
// Small helpers

const round = (value, places) => {
  const factor = 10 ** places
  return Math.round(value * factor) / factor
}

const compareStrings = (left, right) => (left < right ? -1 : left > right ? 1 : 0)

const toHexChannel = (unit) =>
  Math.round(Math.min(1, Math.max(0, unit)) * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()

const colorToHex = (color) => `#${toHexChannel(color.r)}${toHexChannel(color.g)}${toHexChannel(color.b)}`

const hexToRgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16))

const rgbDistance = (leftHex, rightHex) => {
  const left = hexToRgb(leftHex)
  const right = hexToRgb(rightHex)
  return Math.sqrt(left.reduce((sum, channel, index) => sum + (channel - right[index]) ** 2, 0))
}

const hslLightness = (hex) => {
  const channels = hexToRgb(hex).map((channel) => channel / 255)
  return (Math.max(...channels) + Math.min(...channels)) / 2
}

const chroma = (hex) => {
  const channels = hexToRgb(hex).map((channel) => channel / 255)
  return Math.max(...channels) - Math.min(...channels)
}

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const weightClass = (weight) => {
  let best = WEIGHT_CLASSES[0]
  for (const candidate of WEIGHT_CLASSES) {
    if (Math.abs(candidate[0] - weight) < Math.abs(best[0] - weight)) best = candidate
  }
  return best[1]
}

const isSystemFont = (family) => SYSTEM_FONTS.some((name) => name.toLowerCase() === family.toLowerCase())

const headingLevelFromName = (name) => {
  const match = /(?:^|[^a-z0-9])h([1-6])(?![0-9])/i.exec(name)
  return match ? Number(match[1]) : null
}

// ---------------------------------------------------------------------------
// Text style normalisation

// Concrete, rounded values a text run resolves to. `textCase` is null when the
// run keeps its original case.
export const normaliseTextStyle = (style) => {
  const fontSize = round(style.fontSize ?? 0, 2)
  const lineHeightPx = style.lineHeightPx == null ? null : round(style.lineHeightPx, 1)
  const letterSpacing = round(style.letterSpacing ?? 0, 2)
  const textCase = style.textCase && style.textCase !== 'ORIGINAL' ? style.textCase : null
  return {
    fontFamily: style.fontFamily ?? 'unknown',
    fontStyle: style.fontStyle ?? null,
    fontWeight: style.fontWeight ?? 400,
    fontSize,
    lineHeightPx,
    letterSpacing,
    textCase,
  }
}

export const textStyleKey = (values) =>
  [
    values.fontFamily,
    values.fontWeight,
    values.fontSize,
    values.lineHeightPx ?? 'auto',
    values.letterSpacing,
    values.textCase ?? 'ORIGINAL',
  ].join('|')

// CSS-ready values for a class update in Webflow.
const classValues = (values) => ({
  fontFamily: values.fontFamily,
  fontWeight: values.fontWeight,
  fontSizeRem: round(values.fontSize / 16, 4),
  lineHeight: values.lineHeightPx == null || values.fontSize === 0 ? null : round(values.lineHeightPx / values.fontSize, 3),
  letterSpacingEm: values.fontSize === 0 ? 0 : round(values.letterSpacing / values.fontSize, 4),
  textTransform: values.textCase ? TEXT_CASE_TRANSFORM[values.textCase] ?? null : null,
})

// ---------------------------------------------------------------------------
// Tree walk

const sortedCounts = (record) =>
  Object.keys(record)
    .sort(compareStrings)
    .reduce((result, key) => {
      result[key] = record[key]
      return result
    }, {})

// Collects raw usage from every visible node. A node with `visible: false`
// hides its whole subtree, so the walk stops there.
export const collectUsage = (file) => {
  const textBuckets = new Map()
  const namedUsage = new Map()
  const colorUsage = new Map()
  const unlistedStyleRefs = new Map()
  const listedStyles = file.styles ?? {}

  const noteNamedUsage = (styleId, styleType, values, nodeId) => {
    if (!listedStyles[styleId]) {
      const entry = unlistedStyleRefs.get(styleId) ?? { id: styleId, styleType, usageCount: 0 }
      entry.usageCount += 1
      unlistedStyleRefs.set(styleId, entry)
      return
    }
    const usage = namedUsage.get(styleId) ?? { usageCount: 0, variants: new Map() }
    usage.usageCount += 1
    if (values) {
      const key = textStyleKey(values)
      const variant = usage.variants.get(key) ?? { key, values, count: 0, exampleNodeIds: [] }
      variant.count += 1
      if (variant.exampleNodeIds.length < EXAMPLE_LIMIT && !variant.exampleNodeIds.includes(nodeId)) {
        variant.exampleNodeIds.push(nodeId)
      }
      usage.variants.set(key, variant)
    }
    namedUsage.set(styleId, usage)
  }

  const noteTextRun = (values, namedStyleId, nodeId) => {
    const key = textStyleKey(values)
    const bucket = textBuckets.get(key) ?? {
      key,
      values,
      count: 0,
      namedStyleIds: new Set(),
      exampleNodeIds: [],
    }
    bucket.count += 1
    if (namedStyleId && listedStyles[namedStyleId]) bucket.namedStyleIds.add(namedStyleId)
    if (bucket.exampleNodeIds.length < EXAMPLE_LIMIT && !bucket.exampleNodeIds.includes(nodeId)) {
      bucket.exampleNodeIds.push(nodeId)
    }
    textBuckets.set(key, bucket)
  }

  const noteFills = (fills, node, isText) => {
    for (const paint of fills ?? []) {
      if (paint.type !== 'SOLID' || paint.visible === false || !paint.color) continue
      const hex = colorToHex(paint.color)
      const opacity = round((paint.color.a ?? 1) * (paint.opacity ?? 1), 2)
      const key = `${hex}@${opacity}`
      const entry = colorUsage.get(key) ?? {
        hex,
        opacity,
        count: 0,
        usage: { shape: 0, text: 0 },
        variableIds: new Set(),
        exampleNodeIds: [],
      }
      entry.count += 1
      entry.usage[isText ? 'text' : 'shape'] += 1
      const variableId = paint.boundVariables?.color?.id
      if (variableId) entry.variableIds.add(variableId)
      if (entry.exampleNodeIds.length < EXAMPLE_LIMIT && !entry.exampleNodeIds.includes(node.id)) {
        entry.exampleNodeIds.push(node.id)
      }
      colorUsage.set(key, entry)
    }
  }

  const visit = (node) => {
    if (!node || node.visible === false) return
    const isText = node.type === 'TEXT'
    const styleRefs = node.styles ?? {}

    if (isText && node.style) {
      const baseValues = normaliseTextStyle(node.style)
      const baseStyleId = styleRefs.text ?? null
      noteTextRun(baseValues, baseStyleId, node.id)
      if (baseStyleId) noteNamedUsage(baseStyleId, 'TEXT', baseValues, node.id)

      // Mixed-style text: each override segment in use is its own run.
      const usedOverrides = new Set((node.characterStyleOverrides ?? []).filter((id) => id !== 0))
      const overrideTable = node.styleOverrideTable ?? {}
      for (const overrideId of [...usedOverrides].sort((left, right) => left - right)) {
        const override = overrideTable[String(overrideId)]
        if (!override) continue
        if (override.fills) noteFills(override.fills, node, true)
        const changesType = ['fontFamily', 'fontWeight', 'fontSize', 'lineHeightPx', 'letterSpacing', 'textCase'].some(
          (property) => property in override,
        )
        if (!changesType) continue
        const runValues = normaliseTextStyle({ ...node.style, ...override })
        const runStyleId = override.inheritTextStyleId ?? null
        noteTextRun(runValues, runStyleId, node.id)
        if (runStyleId) noteNamedUsage(runStyleId, 'TEXT', runValues, node.id)
      }
    } else if (styleRefs.text) {
      noteNamedUsage(styleRefs.text, 'TEXT', null, node.id)
    }

    for (const [refKind, styleId] of Object.entries(styleRefs).sort(([left], [right]) => compareStrings(left, right))) {
      if (refKind === 'text') continue
      noteNamedUsage(styleId, refKind.toUpperCase(), null, node.id)
    }

    noteFills(node.fills, node, isText)
    for (const child of node.children ?? []) visit(child)
  }

  visit(file.document)
  return { textBuckets, namedUsage, colorUsage, unlistedStyleRefs }
}

// ---------------------------------------------------------------------------
// Collections

const compareTextBuckets = (left, right) =>
  right.count - left.count ||
  right.values.fontSize - left.values.fontSize ||
  compareStrings(left.key, right.key)

const buildNamedStyles = (file, namedUsage) => {
  const groups = { TEXT: [], FILL: [], EFFECT: [], GRID: [] }
  const styleIds = Object.keys(file.styles ?? {}).sort(compareStrings)
  for (const styleId of styleIds) {
    const meta = file.styles[styleId]
    const usage = namedUsage.get(styleId)
    const entry = {
      id: styleId,
      name: meta.name,
      styleType: meta.styleType,
      remote: Boolean(meta.remote),
      description: meta.description ?? '',
      usageCount: usage?.usageCount ?? 0,
    }
    if (meta.styleType === 'TEXT') {
      const variants = usage ? [...usage.variants.values()].sort(compareTextBuckets) : []
      entry.resolved = variants.length ? { ...variants[0].values } : null
      entry.variants = variants.map((variant) => ({
        key: variant.key,
        count: variant.count,
        values: variant.values,
        exampleNodeIds: variant.exampleNodeIds,
      }))
      if (variants.length > 1) {
        entry.note = `Resolves to ${variants.length} different value sets; the most used one is taken as the style value.`
      }
      if (!variants.length) {
        entry.note = 'Not used on any visible node in this input, so its values are unknown.'
      }
    }
    ;(groups[meta.styleType] ?? (groups[meta.styleType] = [])).push(entry)
  }
  return {
    text: groups.TEXT,
    fill: groups.FILL,
    effect: groups.EFFECT,
    grid: groups.GRID,
  }
}

const buildTextStyles = (textBuckets) =>
  [...textBuckets.values()].sort(compareTextBuckets).map((bucket) => ({
    key: bucket.key,
    ...bucket.values,
    count: bucket.count,
    namedStyleIds: [...bucket.namedStyleIds].sort(compareStrings),
    exampleNodeIds: bucket.exampleNodeIds,
  }))

const compareColors = (left, right) =>
  right.count - left.count || compareStrings(left.hex, right.hex) || right.opacity - left.opacity

const buildColors = (colorUsage) => {
  const colors = [...colorUsage.values()].sort(compareColors).map((entry) => ({
    hex: entry.hex,
    opacity: entry.opacity,
    key: `${entry.hex}@${entry.opacity}`,
    count: entry.count,
    usage: entry.usage,
    variableIds: [...entry.variableIds].sort(compareStrings),
    exampleNodeIds: entry.exampleNodeIds,
    group: null,
  }))

  // Single-link grouping of near duplicates. Only colours with the same
  // opacity are compared, so alpha variants always stay distinct.
  const groups = []
  const assigned = new Set()
  for (const color of colors) {
    if (assigned.has(color.key)) continue
    const members = [color]
    assigned.add(color.key)
    for (let index = 0; index < members.length; index += 1) {
      for (const candidate of colors) {
        if (assigned.has(candidate.key) || candidate.opacity !== members[index].opacity) continue
        if (rgbDistance(candidate.hex, members[index].hex) < NEAR_DUPLICATE_DISTANCE) {
          members.push(candidate)
          assigned.add(candidate.key)
        }
      }
    }
    if (members.length < 2) continue
    members.sort(compareColors)
    const representative = members[0]
    const group = {
      id: `group-${representative.hex.slice(1).toLowerCase()}-${representative.opacity}`,
      representative: representative.key,
      members: members.map((member) => member.key),
      totalCount: members.reduce((sum, member) => sum + member.count, 0),
      note: `Near-duplicate hexes (RGB distance under ${NEAR_DUPLICATE_DISTANCE}); use ${representative.hex} for all of them.`,
    }
    for (const member of members) member.group = group.id
    groups.push(group)
  }
  groups.sort((left, right) => right.totalCount - left.totalCount || compareStrings(left.id, right.id))
  return { colors, colorGroups: groups }
}

const buildFonts = (textStyles) => {
  const families = new Map()
  for (const style of textStyles) {
    const family = families.get(style.fontFamily) ?? { family: style.fontFamily, usageCount: 0, variants: new Map() }
    family.usageCount += style.count
    const variantKey = `${style.fontWeight}|${style.fontStyle ?? ''}`
    const variant = family.variants.get(variantKey) ?? { weight: style.fontWeight, style: style.fontStyle, usageCount: 0 }
    variant.usageCount += style.count
    family.variants.set(variantKey, variant)
    families.set(style.fontFamily, family)
  }
  const fonts = [...families.values()]
    .sort((left, right) => right.usageCount - left.usageCount || compareStrings(left.family, right.family))
    .map((family) => {
      const system = isSystemFont(family.family)
      const variants = [...family.variants.values()].sort(
        (left, right) => left.weight - right.weight || compareStrings(left.style ?? '', right.style ?? ''),
      )
      return {
        family: family.family,
        usageCount: family.usageCount,
        weights: [...new Set(variants.map((variant) => variant.weight))],
        variants,
        system,
        requiresUpload: !system,
        note: system ? 'System font; no upload needed.' : 'Not a system font: upload the font files to Webflow by hand (Site settings, Fonts).',
      }
    })
  return {
    fonts,
    fontsRequiringUpload: fonts.filter((font) => font.requiresUpload).map((font) => font.family),
  }
}

// ---------------------------------------------------------------------------
// Typography mapping

const describeDifferences = (values, reference) => {
  const differences = []
  if (values.fontFamily !== reference.fontFamily) differences.push(`family ${values.fontFamily} vs ${reference.fontFamily}`)
  if (values.fontWeight !== reference.fontWeight) differences.push(`weight ${values.fontWeight} vs ${reference.fontWeight}`)
  if (values.fontSize !== reference.fontSize) differences.push(`size ${values.fontSize}px vs ${reference.fontSize}px`)
  if (values.lineHeightPx !== reference.lineHeightPx) {
    differences.push(`line-height ${values.lineHeightPx}px vs ${reference.lineHeightPx}px`)
  }
  if (values.letterSpacing !== reference.letterSpacing) {
    differences.push(`letter-spacing ${values.letterSpacing}px vs ${reference.letterSpacing}px`)
  }
  if (values.textCase !== reference.textCase) {
    differences.push(`text case ${values.textCase ?? 'original'} vs ${reference.textCase ?? 'original'}`)
  }
  return differences
}

const isBodyCandidate = (values) => values.fontSize >= 14 && values.fontSize <= 22 && !values.textCase

const pickBodyFamily = (subjects) => {
  const counts = new Map()
  for (const subject of subjects) {
    if (!subject.values || !isBodyCandidate(subject.values)) continue
    counts.set(subject.values.fontFamily, (counts.get(subject.values.fontFamily) ?? 0) + subject.count)
  }
  const ranked = [...counts.entries()].sort((left, right) => right[1] - left[1] || compareStrings(left[0], right[0]))
  return ranked.length ? ranked[0][0] : null
}

const compareSubjects = (left, right) =>
  right.count - left.count ||
  (right.values?.fontSize ?? 0) - (left.values?.fontSize ?? 0) ||
  compareStrings(left.sortKey, right.sortKey)

export const buildTypographyMapping = (namedTextStyles, textStyles) => {
  // One subject per named TEXT style, plus one per distinct style that no named
  // style accounts for.
  const subjects = []
  for (const style of namedTextStyles) {
    subjects.push({
      source: { type: 'namedStyle', id: style.id, name: style.name },
      sortKey: `0|${style.id}`,
      values: style.resolved,
      count: style.usageCount,
      headingLevel: headingLevelFromName(style.name),
      label: style.name,
    })
  }
  for (const style of textStyles) {
    if (style.namedStyleIds.length) continue
    const values = {
      fontFamily: style.fontFamily,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
      fontSize: style.fontSize,
      lineHeightPx: style.lineHeightPx,
      letterSpacing: style.letterSpacing,
      textCase: style.textCase,
    }
    subjects.push({
      source: { type: 'textStyle', key: style.key },
      sortKey: `1|${style.key}`,
      values,
      count: style.count,
      headingLevel: null,
      label: `${style.fontFamily} ${style.fontSize}`,
    })
  }

  const resolvedSubjects = subjects.filter((subject) => subject.values)
  const bodyFamily = pickBodyFamily(resolvedSubjects)
  const results = new Map()
  const slots = new Map() // class name -> primary values

  const setResult = (subject, result) => results.set(subject.sortKey, result)

  const assignToSlot = (subject, className, role, extraReasons = []) => {
    const primary = slots.get(className)
    const reasons = [...extraReasons]
    let isPrimary = false
    if (!primary) {
      slots.set(className, subject.values)
      isPrimary = true
    } else {
      const differences = describeDifferences(subject.values, primary)
      if (differences.length) {
        reasons.push(`Differs from the ${className} primary style: ${differences.join(', ')}. Apply ${className} plus a combo class with only the differing properties.`)
      }
    }
    setResult(subject, { role, target: className, isPrimary, reasons })
  }

  // 1. Body family: slot by size around the most used body size.
  const bodySubjects = resolvedSubjects
    .filter((subject) => subject.values.fontFamily === bodyFamily && subject.headingLevel == null)
    .sort(compareSubjects)
  if (bodySubjects.length) {
    const primarySize = bodySubjects[0].values.fontSize
    const sizes = [...new Set(bodySubjects.map((subject) => subject.values.fontSize))]
    const larger = sizes.filter((size) => size > primarySize).sort((left, right) => left - right)
    const smaller = sizes.filter((size) => size < primarySize).sort((left, right) => right - left)
    const classForSize = (size) => {
      if (size === primarySize) return { className: BODY_PRIMARY_CLASS, overflow: false }
      const ladder = size > primarySize ? BODY_LARGER_CLASSES : BODY_SMALLER_CLASSES
      const order = size > primarySize ? larger : smaller
      const index = order.indexOf(size)
      return index < ladder.length
        ? { className: ladder[index], overflow: false }
        : { className: ladder[ladder.length - 1], overflow: true }
    }
    for (const subject of bodySubjects) {
      const { className, overflow } = classForSize(subject.values.fontSize)
      const extra = overflow
        ? [`No free body class for ${subject.values.fontSize}px; nearest is ${className}.`]
        : []
      assignToSlot(subject, className, 'body', extra)
    }
  }

  // 2. Named heading styles (H1 to H6 in the name).
  const headingSlots = new Map() // level -> size
  const namedHeadings = resolvedSubjects
    .filter((subject) => !results.has(subject.sortKey) && subject.headingLevel != null)
    .sort(compareSubjects)
  for (const subject of namedHeadings) {
    const className = `heading-style-h${subject.headingLevel}`
    if (!headingSlots.has(subject.headingLevel)) headingSlots.set(subject.headingLevel, subject.values.fontSize)
    assignToSlot(subject, className, 'heading', [])
  }

  // 3. Unnamed styles that share family and size with an already mapped style
  //    inherit its target.
  const mappedReference = (subject) => {
    const candidates = resolvedSubjects
      .filter((other) => results.has(other.sortKey) && other.source.type === 'namedStyle')
      .filter(
        (other) =>
          other.values.fontFamily === subject.values.fontFamily && other.values.fontSize === subject.values.fontSize,
      )
      .sort(compareSubjects)
    return candidates[0] ?? null
  }

  // 4. Remaining display styles: labels at or below body size, headings above.
  const bodyPrimarySize = bodySubjects.length ? bodySubjects[0].values.fontSize : 16
  const remaining = resolvedSubjects
    .filter((subject) => !results.has(subject.sortKey))
    .sort(
      (left, right) =>
        Number(left.source.type === 'textStyle') - Number(right.source.type === 'textStyle') ||
        right.values.fontSize - left.values.fontSize ||
        compareSubjects(left, right),
    )

  const freeHeadingLevelFor = (size) => {
    for (let level = 1; level <= 6; level += 1) {
      if (headingSlots.has(level)) continue
      let above = Infinity
      for (let higher = level - 1; higher >= 1; higher -= 1) {
        if (headingSlots.has(higher)) {
          above = headingSlots.get(higher)
          break
        }
      }
      let below = 0
      for (let lower = level + 1; lower <= 6; lower += 1) {
        if (headingSlots.has(lower)) {
          below = headingSlots.get(lower)
          break
        }
      }
      if (size < above && size > below) return level
    }
    return null
  }

  const nearestHeadingLevel = (size) => {
    let best = null
    for (const [level, levelSize] of [...headingSlots.entries()].sort((left, right) => left[0] - right[0])) {
      if (best == null || Math.abs(levelSize - size) < Math.abs(headingSlots.get(best) - size)) best = level
    }
    return best
  }

  const bodySlotSizes = () =>
    [...slots.entries()].filter(([className]) => className.startsWith('text-size-')).map(([className, values]) => [className, values.fontSize])

  for (const subject of remaining) {
    if (subject.source.type === 'textStyle') {
      const reference = mappedReference(subject)
      if (reference) {
        const referenceResult = results.get(reference.sortKey)
        const differences = describeDifferences(subject.values, reference.values)
        setResult(subject, {
          role: referenceResult.role,
          target: referenceResult.target,
          isPrimary: false,
          suggestedComboClass: referenceResult.suggestedComboClass,
          reasons: [
            ...referenceResult.reasons.filter((reason) => reason.startsWith('Label style')),
            `Unnamed variant of ${reference.label}: ${differences.join(', ')}.`,
          ],
        })
        continue
      }
    }

    const size = subject.values.fontSize
    if (size <= bodyPrimarySize) {
      const candidates = bodySlotSizes().sort(
        (left, right) => Math.abs(left[1] - size) - Math.abs(right[1] - size) || compareStrings(left[0], right[0]),
      )
      const target = candidates.length ? candidates[0][0] : 'text-size-small'
      setResult(subject, {
        role: 'label',
        target,
        isPrimary: false,
        suggestedComboClass: `text-style-${slugify(subject.label.split('/').pop()) || 'label'}`,
        reasons: [
          `Label style in ${subject.values.fontFamily} has no Relume class; apply ${target} plus the suggested combo class.`,
        ],
      })
      continue
    }

    const freeLevel = freeHeadingLevelFor(size)
    if (freeLevel != null) {
      headingSlots.set(freeLevel, size)
      assignToSlot(subject, `heading-style-h${freeLevel}`, 'heading', [])
      continue
    }
    const sameSize = [...headingSlots.entries()].find(([, levelSize]) => levelSize === size)
    if (sameSize) {
      assignToSlot(subject, `heading-style-h${sameSize[0]}`, 'heading', [])
      continue
    }
    const nearest = nearestHeadingLevel(size)
    const className = nearest == null ? 'heading-style-h6' : `heading-style-h${nearest}`
    assignToSlot(subject, className, 'heading', [
      `No free heading level fits ${size}px between the assigned levels; nearest is ${className}.`,
    ])
  }

  // Font variables: heading family from heading primaries, body family.
  const headingFamilyCounts = new Map()
  for (const subject of resolvedSubjects) {
    const result = results.get(subject.sortKey)
    if (result?.role !== 'heading') continue
    headingFamilyCounts.set(subject.values.fontFamily, (headingFamilyCounts.get(subject.values.fontFamily) ?? 0) + subject.count)
  }
  const headingFamily =
    [...headingFamilyCounts.entries()].sort((left, right) => right[1] - left[1] || compareStrings(left[0], right[0]))[0]?.[0] ??
    null

  const roleFamily = { heading: headingFamily, body: bodyFamily, label: headingFamily }

  const entries = subjects.map((subject) => {
    const base = {
      source: subject.source,
      count: subject.count,
    }
    if (!subject.values) {
      const level = subject.headingLevel
      return {
        ...base,
        status: 'unresolved',
        target: level ? `heading-style-h${level}` : null,
        inferredFromName: Boolean(level),
        override: false,
        reasons: [
          level
            ? `Not used on any visible node in this input; target inferred from the name only.`
            : 'Not used on any visible node in this input; no values to map.',
        ],
      }
    }
    const result = results.get(subject.sortKey)
    const reasons = [...result.reasons]
    const expectedFamily = roleFamily[result.role]
    if (expectedFamily && subject.values.fontFamily !== expectedFamily) {
      reasons.push(
        `Family ${subject.values.fontFamily} differs from the ${result.role === 'body' ? 'font-style-body' : 'font-style-heading'} variable (${expectedFamily}); set the family in a combo class.`,
      )
    }
    const entry = {
      ...base,
      status: 'mapped',
      role: result.role,
      target: result.target,
      weightClass: weightClass(subject.values.fontWeight),
      isPrimary: result.isPrimary,
      values: subject.values,
      classValues: classValues(subject.values),
      override: reasons.length > 0,
      reasons,
    }
    if (result.suggestedComboClass) entry.suggestedComboClass = result.suggestedComboClass
    return entry
  })

  entries.sort(
    (left, right) =>
      compareStrings(left.source.type, right.source.type) ||
      compareStrings(left.source.id ?? left.source.key, right.source.id ?? right.source.key),
  )

  const fontVariables = [
    { variable: 'font-style-heading', value: headingFamily, override: false, reasons: [] },
    { variable: 'font-style-body', value: bodyFamily, override: false, reasons: [] },
  ]

  return { typography: entries, fontVariables }
}

// ---------------------------------------------------------------------------
// Colour mapping

export const buildColorMapping = (colors, colorGroups) => {
  const groupByMember = new Map()
  for (const group of colorGroups) for (const member of group.members) groupByMember.set(member, group)

  // One subject per group representative or ungrouped colour.
  const subjects = []
  for (const color of colors) {
    const group = groupByMember.get(color.key)
    if (group && group.representative !== color.key) continue
    subjects.push({
      key: color.key,
      hex: color.hex,
      opacity: color.opacity,
      count: group ? group.totalCount : color.count,
      members: group ? group.members : [color.key],
      groupNote: group ? group.note : null,
    })
  }
  subjects.sort((left, right) => right.count - left.count || compareStrings(left.key, right.key))

  const results = new Map()
  const opaqueBaseTargets = new Map()

  const placeholder = (subject) => FIGMA_PLACEHOLDER_HEXES.includes(subject.hex)

  // Neutrals: most used colour per lightness band takes the band variable.
  const neutralBands = new Map()
  for (const subject of subjects) {
    if (subject.opacity !== 1 || placeholder(subject) || chroma(subject.hex) >= NEUTRAL_CHROMA_MAX) continue
    const lightness = hslLightness(subject.hex)
    const band = NEUTRAL_LADDER.find((step) => lightness >= step.minLightness)
    const holder = neutralBands.get(band.variable)
    if (!holder) {
      neutralBands.set(band.variable, subject)
      results.set(subject.key, { role: 'neutral', target: band.variable, override: false, reasons: [] })
      opaqueBaseTargets.set(subject.hex, band.variable)
    } else {
      results.set(subject.key, {
        role: 'neutral',
        target: null,
        override: true,
        reasons: [
          `Second neutral in the ${band.variable} band (${holder.hex} is used more); needs its own variable or should be merged into ${band.variable}.`,
        ],
        suggestedVariable: `color-neutral-${subject.hex.slice(1).toLowerCase()}`,
      })
    }
  }

  // Brand colours: chromatic and opaque, in order of usage.
  let brandIndex = 0
  for (const subject of subjects) {
    if (results.has(subject.key) || subject.opacity !== 1 || placeholder(subject)) continue
    if (brandIndex < BRAND_VARIABLES.length) {
      const variable = BRAND_VARIABLES[brandIndex]
      brandIndex += 1
      results.set(subject.key, {
        role: 'brand',
        target: variable,
        override: false,
        reasons: [],
        note: 'Brand roles are assigned by usage frequency; confirm primary, secondary and accent in review.',
      })
      opaqueBaseTargets.set(subject.hex, variable)
    } else {
      results.set(subject.key, {
        role: 'brand',
        target: null,
        override: true,
        reasons: ['More brand colours than Relume brand variables; add a dedicated variable.'],
        suggestedVariable: `color-brand-${subject.hex.slice(1).toLowerCase()}`,
      })
    }
  }

  for (const subject of subjects) {
    if (results.has(subject.key)) continue
    if (placeholder(subject)) {
      results.set(subject.key, {
        role: 'placeholder',
        target: null,
        override: false,
        skipped: true,
        reasons: ['Figma default placeholder fill (image or layout stand-in); not a design colour.'],
      })
      continue
    }
    const baseTarget = opaqueBaseTargets.get(subject.hex) ?? null
    results.set(subject.key, {
      role: 'alpha',
      target: null,
      override: true,
      baseVariable: baseTarget,
      reasons: [
        `Alpha variant of ${subject.hex} at ${subject.opacity} opacity; Webflow colour variables are set per colour, so add a dedicated variable or apply the alpha in a class.`,
      ],
      suggestedVariable: `color-${subject.hex.slice(1).toLowerCase()}-a${Math.round(subject.opacity * 100)}`,
    })
  }

  return subjects.map((subject) => {
    const result = results.get(subject.key)
    const entry = {
      key: subject.key,
      hex: subject.hex,
      opacity: subject.opacity,
      count: subject.count,
      members: subject.members,
      role: result.role,
      target: result.target,
      override: result.override,
      reasons: result.reasons,
    }
    if (subject.groupNote) entry.groupNote = subject.groupNote
    if (result.note) entry.note = result.note
    if (result.suggestedVariable) entry.suggestedVariable = result.suggestedVariable
    if (result.baseVariable !== undefined) entry.baseVariable = result.baseVariable
    if (result.skipped) entry.skipped = true
    return entry
  })
}

// ---------------------------------------------------------------------------
// Entry point

export const extractTokens = (file) => {
  if (!file || typeof file !== 'object' || !file.document) {
    throw new Error('Input is not a Figma file response: missing `document`.')
  }
  const usage = collectUsage(file)
  const namedStyles = buildNamedStyles(file, usage.namedUsage)
  const textStyles = buildTextStyles(usage.textBuckets)
  const { colors, colorGroups } = buildColors(usage.colorUsage)
  const { fonts, fontsRequiringUpload } = buildFonts(textStyles)
  const { typography, fontVariables } = buildTypographyMapping(namedStyles.text, textStyles)
  const colorMapping = buildColorMapping(colors, colorGroups)

  const result = {
    schemaVersion: TOKENS_SCHEMA_VERSION,
    source: {
      fileName: file.name ?? null,
      ...(file.version ? { sourceVersion: String(file.version) } : {}),
    },
    verifiedAgainstLive: false,
    notes: [
      'Mapping targets are proposals from the project style guide (docs/reference/style-guide.md); live Webflow variable and class names are checked in the token-sync build entry.',
      'Colour opacity is paint opacity times colour alpha; layer opacity is not applied.',
      'Semantic colour variables (color-success, color-error, color-warning, color-info) keep their defaults; the design does not define them.',
    ],
    namedStyles,
    unlistedStyleRefs: [...usage.unlistedStyleRefs.values()].sort((left, right) => compareStrings(left.id, right.id)),
    textStyles,
    colors,
    colorGroups,
    fonts,
    fontsRequiringUpload,
    mapping: {
      typography,
      colors: colorMapping,
      fontVariables,
    },
    summary: {
      namedStyleCounts: sortedCounts(
        Object.fromEntries(Object.entries(namedStyles).map(([kind, list]) => [kind, list.length])),
      ),
      distinctTextStyles: textStyles.length,
      distinctColors: colors.length,
      overrides: typography.filter((entry) => entry.override).length + colorMapping.filter((entry) => entry.override).length,
    },
  }
  return result
}

export const serialiseTokens = (tokens) => `${JSON.stringify(tokens, null, 2)}\n`
