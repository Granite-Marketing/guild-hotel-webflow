// Copy map library: parses the client's content docs and matches every line to a staging target.
// Pure functions only (no file or network access); the CLI in ../copy-map.mjs does the reading and writing.
import { normText } from './catalogue-helpers.mjs'
import { ITEM_ALIASES } from './copy-map-registry.mjs'

// ---------------------------------------------------------------- tuning values (product assumptions, see the CLI report)
export const CONFIDENCE_MATCH_MINIMUM = 0.45 // below this a line is listed as not on site
export const CONFIDENCE_CONFIRM_BELOW = 0.75 // below this (and not an exact text hit) a person confirms the match
export const DEFAULT_SLOT_PENALTY = 0.04 // a prop the page never overrode is shared default text: prefer the page's own text slots
export const CMS_CONFIRM_BELOW = 0.65 // CMS field choices this unsure are marked for a person to confirm
export const POSITIONAL_ONLY_SIMILARITY = 0.2 // a match below this rests on position and role alone
export const POSITIONAL_ONLY_MAX_DISTANCE = 4 // ...and only counts when the slot is within this many slots of the previous match
export const IMPLICIT_ALTERNATE_SIMILARITY = 0.5 // consecutive plain lines this alike, with no "or", are a second version to confirm
const IMPLICIT_ALTERNATE_MINIMUM_TOKENS = 4 // shorter lines ("1 King Bed", "1 Sofa Bed") are lists, not versions
const SHORT_LINE_LENGTH = 40 // a plain line this short can wrap onto a function-word line
const FUNCTION_WORD_START = /^(and|or|of|on|in|to|the|for|with|at|by|from|a|an)\b/

const tokenSet = (text) => new Set(normText(text).split(' ').filter(Boolean))

const minimumTokens = (left, right) => Math.min(tokenSet(left).size, tokenSet(right).size)

export function tokenSimilarity(left, right) {
  const leftTokens = tokenSet(left)
  const rightTokens = tokenSet(right)
  if (!leftTokens.size || !rightTokens.size) return 0
  let shared = 0
  for (const token of leftTokens) if (rightTokens.has(token)) shared++
  return shared / (leftTokens.size + rightTokens.size - shared)
}

// ---------------------------------------------------------------- doc parsing
const NOTE_LABEL_PATTERNS = [
  [/^cutline on (photo|video)$/i, 'cutline-label'],
  [/^(room description|your room)$/i, 'style-label'],
  [/^guild meeting modals$/i, 'style-label'],
  [/^neighborhood page$/i, 'style-label'],
  [/stopping here/i, 'stop'],
]
const TRAILING_HANDWRITING = /\s*\(handwriting\)\s*$/i
const unescapeMarkdown = (text) => text.replace(/\\([*|\-.!#()[\]_>~`])/g, '$1')
const isUppercaseText = (text) => /\p{L}/u.test(text) && text === text.toUpperCase()
const startsLowercase = (text) => /^\p{Ll}/u.test(text)

function classifyLine(rawLine, lineNumber) {
  let core = rawLine.trim()
  if (!core || core.startsWith('<!--') || /^!\[/.test(core) || /^\[image\w*\]:/.test(core)) return null
  const scriptHeading = TRAILING_HANDWRITING.test(core)
  if (scriptHeading) core = core.replace(TRAILING_HANDWRITING, '').trim()
  const bold = /^\*\*[^*]+\*\*$/.test(core)
  const text = unescapeMarkdown(core.replace(/\*\*/g, '')).replace(/\s+/g, ' ').trim()
  if (!text) return null
  const item = { line: lineNumber, text, bold, scriptHeading }
  if (/^or$/i.test(text)) return { ...item, type: 'or' }
  if (/^\(.*\)$/.test(text)) return { ...item, type: 'note', kind: 'bracket' }
  for (const [pattern, kind] of NOTE_LABEL_PATTERNS) if (pattern.test(text)) return { ...item, type: 'note', kind }
  return { ...item, type: 'copy' }
}

// Reads one exported doc. Returns the copy entries (one per doc line group the writer meant as one line)
// and every writer's note, which is never copy.
export function parseDoc(markdown, { foldRepeatedBlocks = false } = {}) {
  const entries = []
  const notes = []
  let pendingNotes = []
  let chainHead = null // entry whose alternates a following "or" line extends
  let expectingAlternate = false
  let previousCopy = null // last copy item seen (entry text line, alternate or joined part)
  let tail = null // the entry or alternate the latest copy line belongs to; a wrapped line extends it

  const attachNote = (note, entry) => { note.attachedTo = entry.line; entry.notes.push(note) }
  const wraps = (item) => tail && previousCopy && item.line === previousCopy.line + 1 && !pendingNotes.length
    && item.bold === tail.ref.bold && !tail.ref.scriptHeading && !item.scriptHeading
    && !/[.!?:;,]$/.test(tail.ref.text)
    && (item.bold
      ? startsLowercase(item.text) || (isUppercaseText(tail.ref.text) && isUppercaseText(item.text))
      : FUNCTION_WORD_START.test(item.text) && tail.ref.text.length <= SHORT_LINE_LENGTH)

  markdown.split(/\r?\n/).forEach((rawLine, index) => {
    const item = classifyLine(rawLine, index + 1)
    if (!item) return
    if (item.type === 'or') { if (chainHead) expectingAlternate = true; return }
    if (item.type === 'note') {
      const note = { line: item.line, text: item.text, kind: item.kind, attachedTo: null }
      notes.push(note)
      pendingNotes.push(note)
      return
    }
    if (expectingAlternate && chainHead) {
      const alternate = { line: item.line, text: item.text, bold: item.bold, implicit: false, joined: [] }
      chainHead.alternates.push(alternate)
      tail = { ref: alternate, entry: chainHead }
      expectingAlternate = false
    } else if (wraps(item)) {
      tail.ref.joined.push({ line: item.line, text: item.text })
      tail.ref.text = `${tail.ref.text} ${item.text}`
    } else if (previousCopy && item.line === previousCopy.line + 1 && !pendingNotes.length && chainHead && !item.bold && !chainHead.bold
      && tail.ref === chainHead && minimumTokens(chainHead.text, item.text) >= IMPLICIT_ALTERNATE_MINIMUM_TOKENS
      && tokenSimilarity(chainHead.text, item.text) >= IMPLICIT_ALTERNATE_SIMILARITY) {
      const alternate = { line: item.line, text: item.text, bold: false, implicit: true, joined: [] }
      chainHead.alternates.push(alternate)
      tail = { ref: chainHead, entry: chainHead }
    } else {
      const entry = { line: item.line, text: item.text, bold: item.bold, scriptHeading: item.scriptHeading, alternates: [], joined: [], notes: [] }
      for (const note of pendingNotes) attachNote(note, entry)
      if (item.scriptHeading) {
        const inline = { line: item.line, text: '(handwriting)', kind: 'handwriting', attachedTo: null }
        notes.push(inline)
        attachNote(inline, entry)
      }
      pendingNotes = []
      entries.push(entry)
      chainHead = entry
      tail = { ref: entry, entry }
    }
    previousCopy = { line: item.line }
  })
  const last = entries[entries.length - 1]
  if (last) for (const note of pendingNotes) attachNote(note, last)
  return { entries: foldRepeatedBlocks ? foldRepeated(entries) : entries, notes: notes.sort((left, right) => left.line - right.line) }
}

// A heading that comes back later with its own body (no "or" between them) is a second version of that block.
function foldRepeated(entries) {
  const bodyAfter = (position) => {
    const body = []
    for (let next = position + 1; next < entries.length && !entries[next].bold; next++) body.push(entries[next])
    return body
  }
  const dropped = new Set()
  entries.forEach((entry, position) => {
    if (!entry.bold || dropped.has(entry)) return
    const earlierAt = entries.findIndex((candidate, at) => at < position && candidate.bold && !dropped.has(candidate) && normText(candidate.text) === normText(entry.text))
    if (earlierAt < 0) return
    const earlier = entries[earlierAt]
    const asAlternate = (entryItem) => ({ line: entryItem.line, text: entryItem.text, bold: entryItem.bold, implicit: true, joined: entryItem.joined })
    earlier.alternates.push(asAlternate(entry))
    dropped.add(entry)
    const earlierBody = bodyAfter(earlierAt)
    bodyAfter(position).forEach((bodyEntry, index) => {
      if (!earlierBody[index]) return
      earlierBody[index].alternates.push(asAlternate(bodyEntry))
      dropped.add(bodyEntry)
    })
  })
  return entries.filter((entry) => !dropped.has(entry))
}

// ---------------------------------------------------------------- targets
// Components whose text is site chrome or shared furniture, not page copy: never offered as a target
// and never listed as "no copy yet".
export const CHROME_COMPONENTS = new Set([
  'Site Nav', 'Global Styles', 'Footer Links', 'CTA Booking Newsletter', 'Booking Menu', 'Booking Menu Panel',
  'FAQ Accordion', 'Offers Slider', 'Legal Rich Text Styles',
])

// Text that is hidden until opened (pop-ups) or only form plumbing is never reported as "no copy yet".
const HIDDEN_COMPONENT_PATTERN = /modal|^form /i
const EMPTY_LIST_TEXT = /^no items found\.?$/i
const NUMERIC_LABEL = /^[\d\s/\-–.]+$/ // timeline years and slide counters are not copy

// Whether staging text is evidenced as showing on the page: a visible live element, or body text
// (paragraphs are not in the live crawl, so their visibility is unknown and they count).
export const showsOnPage = (slotItem) => Boolean(slotItem.text?.trim())
  && !EMPTY_LIST_TEXT.test(slotItem.text.trim())
  && !NUMERIC_LABEL.test(slotItem.text.trim())
  && !HIDDEN_COMPONENT_PATTERN.test(slotItem.component || '')
  && slotItem.visible !== false
  && (slotItem.visible === true || slotItem.role === 'body')

const BUTTON_TEXT = /^(discover more|book your stay|explore more|learn more|read more|view floorplan|book now|reserve|view menu|browse the menu)$/i
const sameText = (left, right) => (left ?? '').replace(/\s+/g, ' ').trim() === (right ?? '').replace(/\s+/g, ' ').trim()
const nameKey = (text) => normText(text).replace(/\bthe\b/g, ' ').replace(/\b1\b/g, 'one').replace(/\s+/g, ' ').trim()

const entryRole = (entry) => entry.roleOverride ?? (BUTTON_TEXT.test(entry.text) ? 'button' : entry.bold || entry.scriptHeading ? 'heading' : 'body')
const ROLE_FIT = {
  heading: { heading: 1, label: 0.6, button: 0.2, body: 0.1 },
  body: { body: 1, label: 0.3, heading: 0.1, button: 0 },
  button: { button: 1, label: 0.4, heading: 0.3, body: 0 },
}

// pages -> { path -> page }, with every slot ordered; chrome slots dropped
function indexModel(model) {
  const pages = new Map()
  for (const page of model.pages) {
    const slots = page.slots.filter((slotItem) => !CHROME_COMPONENTS.has(slotItem.component)).sort((left, right) => left.order - right.order)
    pages.set(page.path, { ...page, slots })
  }
  const componentPages = new Map((model.components || []).map((component) => [component.name, component.pages || {}]))
  const usedByPage = new Map()
  const usedFor = (pagePath) => { if (!usedByPage.has(pagePath)) usedByPage.set(pagePath, new Set()); return usedByPage.get(pagePath) }
  return { pages, componentPages, usedByPage, usedFor }
}

function sharedInfo(slotItem, page, index) {
  const sharedPages = new Set()
  let reason = null
  if (slotItem.kind === 'component-fixed') {
    const used = Object.keys(index.componentPages.get(slotItem.component) || {})
    if (used.length > 1) { for (const usedPath of used) sharedPages.add(displayPath(usedPath, index)); reason = 'component-fixed' }
  }
  if (page.kind === 'cms-sample' && page.templatePath) {
    sharedPages.add(`${page.templatePath}/*`)
    reason = reason || 'template'
  }
  const list = [...sharedPages]
  return list.length > 1 || (list.length === 1 && reason === 'template') ? { shared: true, sharedPages: list, sharedReason: reason } : { shared: false, sharedPages: [], sharedReason: null }
}

function displayPath(pagePath, index) {
  const page = index.pages.get(pagePath)
  return page?.kind === 'cms-sample' && page.templatePath ? `${page.templatePath}/*` : pagePath
}

function slotTarget(slotItem) {
  const base = { tag: slotItem.tag ?? null, section: slotItem.section ?? null, liveOrder: slotItem.liveOrder ?? null, textHint: slotItem.text ? slotItem.text.slice(0, 80) : null }
  if (slotItem.kind === 'page-text') return { ...base, nodeId: slotItem.nodeId }
  if (slotItem.kind === 'component-fixed') return { ...base, component: slotItem.component, nodeId: slotItem.nodeId }
  return { ...base, component: slotItem.component, property: slotItem.property, propertyId: slotItem.propertyId, instance: slotItem.instance, overridden: slotItem.overridden ?? true }
}

// ---------------------------------------------------------------- alignment of doc lines to page slots
function scoreSlot(entry, slotItem, gap) {
  const role = entryRole(entry)
  const exact = normText(entry.text) === normText(slotItem.text) && normText(entry.text) !== ''
  const similarity = exact ? 1 : tokenSimilarity(entry.text, slotItem.text)
  const roleFit = ROLE_FIT[role][slotItem.role] ?? 0
  const orderFit = gap === null ? 0 : Math.max(0, 1 - gap / 4)
  let confidence = 0.5 * similarity + 0.25 * roleFit + 0.25 * orderFit - (slotItem.overridden === false ? DEFAULT_SLOT_PENALTY : 0)
  if (exact) confidence = Math.max(confidence, 0.9)
  return { confidence, similarity, roleFit, orderFit }
}

// Two passes. First, lines whose text already sits in a slot are anchors (in doc order, each takes the next
// unused slot with that exact text). Second, the lines between two anchors take the best unused slot between those
// anchors by position and role ("position and role in the section"), with the current text as a hint.
// minimumSimilarity > 0 makes the second pass wording-only.
function alignToSlots(entries, slots, used, { minimumSimilarity = 0 } = {}) {
  const assignments = new Map()
  const ranks = new Map() // entry.line -> rank of its slot
  let cursor = -1
  for (const entry of entries) {
    const key = normText(entry.text)
    if (!key) continue
    const exact = slots.map((slotItem, rank) => ({ slotItem, rank })).filter(({ slotItem, rank }) => !used.has(slotItem.key) && normText(slotItem.text) === key && rank >= 0)
    const pick = exact.find(({ rank }) => rank > cursor) || exact[0]
    if (!pick) continue
    used.add(pick.slotItem.key)
    ranks.set(entry.line, pick.rank)
    assignments.set(entry.line, { ...scoreSlot(entry, pick.slotItem, 0), slotItem: pick.slotItem, rank: pick.rank })
    cursor = pick.rank
  }
  let lastRank = -1
  entries.forEach((entry, position) => {
    if (ranks.has(entry.line)) { lastRank = ranks.get(entry.line); return }
    const nextAnchor = entries.slice(position + 1).find((later) => ranks.has(later.line))
    const upper = nextAnchor && ranks.get(nextAnchor.line) > lastRank ? ranks.get(nextAnchor.line) : Infinity
    let best = null
    slots.forEach((slotItem, rank) => {
      if (used.has(slotItem.key) || rank <= lastRank || rank >= upper) return
      let gap = 0
      for (let between = lastRank + 1; between < rank; between++) if (!used.has(slots[between].key) && slots[between].role === slotItem.role) gap++
      const scored = scoreSlot(entry, slotItem, gap)
      if (scored.similarity < minimumSimilarity) return
      if (scored.similarity < POSITIONAL_ONLY_SIMILARITY && (slotItem.kind === 'component-fixed' || rank - lastRank > POSITIONAL_ONLY_MAX_DISTANCE)) return
      if (!best || scored.confidence > best.confidence) best = { ...scored, slotItem, rank }
    })
    if (best && best.confidence >= CONFIDENCE_MATCH_MINIMUM) {
      used.add(best.slotItem.key)
      ranks.set(entry.line, best.rank)
      assignments.set(entry.line, best)
      lastRank = best.rank
    }
  })
  return assignments
}

// ---------------------------------------------------------------- rows
const baseRow = (docName, entryLike, extra) => ({
  id: `${docName}:${entryLike.line}`,
  doc: docName,
  line: entryLike.line,
  page: null,
  cmsItem: null,
  docRole: entryLike.bold ? 'heading' : 'body',
  scriptHeading: Boolean(entryLike.scriptHeading),
  newText: entryLike.text,
  status: 'not on site',
  targetKind: 'not-on-site',
  target: null,
  currentText: null,
  confidence: 0,
  needsConfirm: false,
  confirmReasons: [],
  reason: null,
  alternates: [],
  alternateOf: null,
  joinedInto: null,
  notes: (entryLike.notes || []).map((note) => ({ line: note.line, text: note.text, kind: note.kind })),
  shared: false,
  sharedPages: [],
  sharedReason: null,
  needsDecision: false,
  duplicateOf: null,
  conflictsWith: [],
  ...extra,
})

function slotRow(docName, entry, match, page, index) {
  const { slotItem, confidence, similarity } = match
  const reasons = []
  if (confidence < CONFIDENCE_CONFIRM_BELOW && similarity < 0.999) {
    reasons.push(similarity < 0.3 ? 'matched by position and role only, staging text does not resemble the doc line' : 'partial text match, confirm the element')
  }
  const share = sharedInfo(slotItem, page, index)
  const status = sameText(entry.text, slotItem.text) ? 'same' : 'change'
  return baseRow(docName, entry, {
    page: page.path,
    status,
    targetKind: slotItem.kind,
    target: slotTarget(slotItem),
    currentText: slotItem.text,
    confidence: Number(confidence.toFixed(2)),
    needsConfirm: reasons.length > 0,
    confirmReasons: reasons,
    ...share,
    needsDecision: share.shared && status === 'change',
  })
}

function expandEntryRows(docName, entry, headRow) {
  const rows = [{ ...headRow, alternates: entry.alternates.map((alternate) => ({ line: alternate.line, text: alternate.text, implicit: alternate.implicit })) }]
  for (const alternate of entry.alternates) {
    rows.push({
      ...headRow,
      id: `${docName}:${alternate.line}`,
      line: alternate.line,
      newText: alternate.text,
      status: 'second version listed',
      alternateOf: entry.line,
      alternates: [],
      notes: [],
      needsConfirm: alternate.implicit,
      confirmReasons: alternate.implicit ? ['doc gives no "or" between these lines; treated as a second version'] : [],
      docRole: alternate.bold ? 'heading' : 'body',
      scriptHeading: false,
    })
  }
  for (const part of entry.joined) {
    rows.push({ ...headRow, id: `${docName}:${part.line}`, line: part.line, newText: part.text, joinedInto: entry.line, alternates: [], notes: [], scriptHeading: false })
  }
  for (const alternate of entry.alternates) {
    for (const part of alternate.joined || []) {
      rows.push({ ...headRow, id: `${docName}:${part.line}`, line: part.line, newText: part.text, status: 'second version listed', alternateOf: entry.line, joinedInto: alternate.line, alternates: [], notes: [], scriptHeading: false })
    }
  }
  return rows
}


// ---------------------------------------------------------------- CMS items
const hasField = (collection, fieldSlug) => (collection.fields || []).includes(fieldSlug)

function itemByName(collection, name) {
  const alias = ITEM_ALIASES[(collection.templatePath || '').slice(1)]?.[nameKey(name)]
  const key = nameKey(alias || name)
  return (collection.items || []).find((item) => nameKey(item.name) === key) || null
}

// Items whose name overlaps this one, offered as a hint only: a person decides, nothing is mapped.
function possibleItems(collection, name, excludeKeys = new Set()) {
  const key = nameKey(name)
  return (collection.items || [])
    .filter((item) => !excludeKeys.has(nameKey(item.name)))
    .filter((item) => nameKey(item.name).includes(key) || key.includes(nameKey(item.name)) || tokenSimilarity(nameKey(item.name), key) >= 0.33)
    .map((item) => item.name)
}

function cmsItemInfo(collectionKey, collection, item) {
  return {
    collection: collectionKey,
    collectionName: collection.name,
    name: item.name,
    slug: item.slug ?? null,
    itemPath: item.itemPath ?? null,
    itemPathDerived: Boolean(item.itemPathDerived),
    listingPaths: collection.listingPaths || [],
    observed: item.observed !== false,
  }
}

function hintFor(collection, item, tag) {
  if (!tag || !item.itemPath) return null
  return (collection.hints?.[item.itemPath] || []).find((hint) => hint.tag === tag) || null
}

// One row writing `text` to a CMS field of one item. Without a hint the item's current text is not in the catalogue.
function cmsFieldRow(docName, entry, { collectionKey, collection, item, fieldSlug, text, confidence = 0.8, reasons = [], hintTag = null, status = null }) {
  if (!hasField(collection, fieldSlug)) {
    return baseRow(docName, entry, { page: item.itemPath || `${collection.templatePath}/*`, cmsItem: cmsItemInfo(collectionKey, collection, item), reason: `collection ${collectionKey} has no field ${fieldSlug}` })
  }
  const hint = hintFor(collection, item, hintTag)
  const newText = text ?? entry.text
  const currentText = hint ? hint.text : null
  const confirmReasons = [...reasons]
  if (item.observed === false) confirmReasons.push('item is not in the catalogue, name taken from the doc')
  if (confidence < CMS_CONFIRM_BELOW && !confirmReasons.length) confirmReasons.push('field chosen from the doc layout, not from a label: confirm it')
  return baseRow(docName, entry, {
    page: item.itemPath || `${collection.templatePath}/*`,
    cmsItem: cmsItemInfo(collectionKey, collection, item),
    newText,
    status: status ?? (hint && sameText(hint.text, newText) ? 'same' : 'change'),
    targetKind: 'cms-field',
    target: { fieldSlug, currentKnown: Boolean(hint), tag: hintTag },
    currentText,
    confidence,
    needsConfirm: confirmReasons.length > 0,
    confirmReasons,
  })
}

// A doc line that names something close to a CMS item gets those items as a hint, never as a mapping.
function hintForUnmatched(entry, model, config) {
  const hints = (config.cards || []).flatMap((card) => (model.collections[card.collection] ? possibleItems(model.collections[card.collection], entry.text) : []))
  if (!hints.length || entry.text.length > 40) return {}
  return { possibleItems: hints, needsConfirm: true, confirmReasons: [`similar CMS item exists: ${hints.join(', ')}`] }
}

const noTarget = (docName, entry, reason, extra = {}) => baseRow(docName, entry, { reason, ...extra })

// Writes one value made of several doc lines: the first line's row carries the joined value, the others point at it.
function groupRows(docName, entries, buildHead, joiner) {
  const text = entries.map((entry) => entry.text).join(joiner)
  const [first, ...rest] = entries
  const head = buildHead(first, text)
  const rows = expandEntryRows(docName, first, head)
  for (const entry of rest) {
    rows.push(...expandEntryRows(docName, entry, { ...head, id: `${docName}:${entry.line}`, line: entry.line, newText: entry.text, joinedInto: first.line, alternates: [], notes: (entry.notes || []).map((note) => ({ line: note.line, text: note.text, kind: note.kind })), docRole: entry.bold ? 'heading' : 'body', scriptHeading: false }))
  }
  return rows
}

// Lines that belong to the shared template page (script heading, floor plan button, amenities heading) are aligned to its slots.
function templateRows(docName, entries, page, index, used, { slotFilter = null, minimumSimilarity = 0 } = {}) {
  const assignments = alignToSlots(entries, slotFilter ? page.slots.filter(slotFilter) : page.slots, used, { minimumSimilarity })
  for (const match of assignments.values()) index.usedFor(page.path).add(match.slotItem.key)
  const rows = []
  for (const entry of entries) {
    const match = assignments.get(entry.line)
    const head = match ? slotRow(docName, entry, match, page, index) : noTarget(docName, entry, 'no element on the template page is left to hold this line', { page: page.path })
    rows.push(...expandEntryRows(docName, entry, head))
  }
  return rows
}

// ---------------------------------------------------------------- rooms
const STAT_GUESTS = /\bguests?\b/i
const STAT_SIZE = /sq\s?ft|sqm|sq\. ?ft/i
const hasNote = (entry, pattern) => entry.notes.some((note) => pattern.test(note.text))

function splitRoomSections(entries) {
  const sections = []
  let current = []
  for (const entry of entries) {
    current.push(entry)
    if (hasNote(entry, /^\(next block\)$/i)) { sections.push(current); current = [] }
  }
  if (current.length) sections.push(current)
  return sections
}

function classifyRoomEntries(entries) {
  const roles = new Map()
  const roomKey = nameKey(entries[0].text)
  let state = 'head'
  let taglineSeen = false
  let descriptionSeen = false
  entries.forEach((entry, position) => {
    let role
    if (position === 0) role = 'name'
    else if (hasNote(entry, /^\(next block\)$/i)) role = 'accessible'
    else if (hasNote(entry, /^cutline on (photo|video)$/i)) { role = 'cutline'; state = 'after-cutline' }
    else if (hasNote(entry, /^\(next text block\)$/i)) { role = 'details'; state = 'after-details' }
    else if (entry.scriptHeading) role = 'script'
    else if (hasNote(entry, /^(room description|your room)$/i)) { role = 'description-heading'; state = 'description' }
    else if (/^view floorplan$/i.test(entry.text)) { role = 'floorplan'; state = 'stats' }
    else if (normText(entry.text) === 'in room amenities') { role = 'amenities-heading'; state = 'amenities-intro' }
    else if (state === 'head') { role = taglineSeen ? 'other' : 'tagline'; taglineSeen = true }
    else if (state === 'description') {
      const isRoomName = nameKey(entry.text) === roomKey
      if (!descriptionSeen && !isRoomName) { role = 'description'; descriptionSeen = true }
      else if (descriptionSeen && entry.text.length > 60 && !STAT_SIZE.test(entry.text)) role = 'description'
      else { state = 'stats'; role = isRoomName ? 'stat-name' : 'stat' }
    } else if (state === 'stats') role = nameKey(entry.text) === roomKey ? 'stat-name' : 'stat'
    else if (state === 'amenities-intro') { role = 'amenities-intro'; state = 'amenity-list' }
    else if (state === 'amenity-list') role = 'amenity'
    else role = 'other'
    if (role === 'stat' && hasNote(entry, /^\(stats\)$/i)) state = 'stats'
    roles.set(entry.line, role)
  })
  return roles
}

function roomRows(docName, config, parsed, index, model) {
  const collection = model.collections[config.collection]
  const page = index.pages.get(config.templatePage)
  const sections = splitRoomSections(parsed.entries)
  const rows = []
  const matched = []
  const docRoomsWithoutItem = []
  const matchedItems = new Set()
  for (const section of sections) {
    const roomName = section[0].text
    const item = itemByName(collection, roomName)
    if (item) { matched.push({ docRoom: roomName, item: item.name, line: section[0].line }); matchedItems.add(nameKey(item.name)) }
    else docRoomsWithoutItem.push({ docRoom: roomName, line: section[0].line })
  }
  for (const entry of docRoomsWithoutItem) entry.possibleItems = possibleItems(collection, entry.docRoom, matchedItems)
  const itemsWithoutDoc = (collection.items || []).filter((item) => !matchedItems.has(nameKey(item.name))).map((item) => ({ item: item.name, slug: item.slug, itemPath: item.itemPath }))

  for (const section of sections) {
    const roomName = section[0].text
    const item = itemByName(collection, roomName)
    const roles = classifyRoomEntries(section)
    if (!item) {
      const orphan = docRoomsWithoutItem.find((entry) => entry.line === section[0].line)
      const hint = orphan.possibleItems.length ? `; possible match, not mapped: ${orphan.possibleItems.join(', ')}` : ''
      for (const entry of section) rows.push(...expandEntryRows(docName, entry, noTarget(docName, entry, `no room item named ${roomName}${hint}`, { possibleItems: orphan.possibleItems })))
      continue
    }
    const ctx = { collectionKey: config.collection, collection, item }
    const single = (entry, fieldSlug, extra = {}) => expandEntryRows(docName, entry, cmsFieldRow(docName, entry, { ...ctx, fieldSlug, ...extra }))
    const none = (entry, reason) => expandEntryRows(docName, entry, noTarget(docName, entry, reason, { page: item.itemPath || `${collection.templatePath}/*`, cmsItem: cmsItemInfo(config.collection, collection, item) }))
    const byRole = (...wanted) => section.filter((entry) => wanted.includes(roles.get(entry.line)))
    const templateEntries = []

    for (const entry of section) {
      const role = roles.get(entry.line)
      if (role === 'name') rows.push(...single(entry, 'name', { status: 'same', confidence: 0.95, reasons: [] }))
      else if (role === 'tagline') rows.push(...single(entry, 'hero-intro'))
      else if (role === 'details') rows.push(...single(entry, 'room-description---details', { confidence: 0.6 }))
      else if (['script', 'floorplan', 'amenities-heading', 'amenities-intro'].includes(role)) templateEntries.push(entry.roleOverride === undefined && role === 'floorplan' ? { ...entry, roleOverride: 'button' } : entry)
      else if (role === 'description-heading') rows.push(...none(entry, 'restates the room name under the description label; no field holds it'))
      else if (role === 'cutline') rows.push(...none(entry, 'photo cutline: the room page has no cutline field'))
      else if (role === 'accessible') rows.push(...none(entry, 'accessible-room paragraph: no room field holds it'))
      else if (role === 'amenity') rows.push(...none(entry, 'amenity list item: amenities are items of the Amenities collection shared by every room'))
      else if (role === 'stat-name') rows.push(...none(entry, 'restates the room name above the stats; no field holds it'))
      else if (role === 'other') rows.push(...none(entry, 'extra line with no place in the room layout'))
    }
    const descriptionEntries = byRole('description')
    if (descriptionEntries.length) rows.push(...groupRows(docName, descriptionEntries, (first, text) => cmsFieldRow(docName, first, { ...ctx, fieldSlug: 'room-description---text', text, confidence: 0.85 }), '\n\n'))
    const stats = byRole('stat')
    const sizeEntries = stats.filter((entry) => STAT_SIZE.test(entry.text))
    for (const entry of stats) {
      if (STAT_SIZE.test(entry.text)) continue
      if (STAT_GUESTS.test(entry.text)) rows.push(...single(entry, 'guests-label'))
      else rows.push(...none(entry, 'bed, view or terrace line: the room card holds only guests and size labels'))
    }
    if (sizeEntries.length) rows.push(...groupRows(docName, sizeEntries, (first, text) => cmsFieldRow(docName, first, { ...ctx, fieldSlug: 'size-label', text, confidence: sizeEntries.length > 1 ? 0.6 : 0.85, reasons: sizeEntries.length > 1 ? ['doc gives the sizes on separate lines; confirm how they join'] : [] }), ' | '))
    if (templateEntries.length && page) rows.push(...templateRows(docName, templateEntries.sort((left, right) => left.line - right.line), page, index, new Set()))
  }
  rows.sort((left, right) => left.line - right.line)
  return { rows, rooms: { matched, docRoomsWithoutItem, itemsWithoutDoc } }
}

// ---------------------------------------------------------------- venue cards (a name line followed by its one-line description)
function cardPairs(entries, collections, cards) {
  const pairs = []
  const consumed = new Set()
  entries.forEach((entry, position) => {
    const following = entries[position + 1]
    if (consumed.has(entry.line) || !following || following.bold || BUTTON_TEXT.test(entry.text) || BUTTON_TEXT.test(following.text)) return
    if (entry.text.length > 40 || /[.!?]$/.test(entry.text) || following.line - entry.line > 2 || entry.scriptHeading) return
    for (const card of cards) {
      const collection = collections[card.collection]
      if (!collection) continue
      const key = nameKey(entry.text)
      const exact = itemByName(collection, entry.text)
      const shortForm = exact ? null : (collection.items || []).filter((item) => {
        const itemTokens = nameKey(item.name).split(' ')
        const keyTokens = key.split(' ')
        return keyTokens.length < itemTokens.length && keyTokens.every((token) => itemTokens.includes(token))
      })
      const item = exact || (shortForm?.length === 1 ? shortForm[0] : null)
      if (!item) continue
      pairs.push({ name: entry, text: following, item, card, collectionKey: card.collection, collection, exact: Boolean(exact) })
      consumed.add(entry.line)
      consumed.add(following.line)
      break
    }
  })
  return { pairs, consumed }
}

function cardRows(docName, pair, page) {
  const reasons = pair.exact ? [] : [`doc name is a short form of the item name ${pair.item.name}`]
  const ctx = { collectionKey: pair.collectionKey, collection: pair.collection, item: pair.item }
  const nameRow = cmsFieldRow(docName, pair.name, { ...ctx, fieldSlug: 'name', status: 'same', confidence: pair.exact ? 0.95 : 0.7, reasons })
  const textRow = cmsFieldRow(docName, pair.text, { ...ctx, fieldSlug: pair.card.field, confidence: pair.exact ? 0.85 : 0.7, reasons })
  for (const row of [nameRow, textRow]) row.appearsOn = [page]
  return [...expandEntryRows(docName, pair.name, nameRow), ...expandEntryRows(docName, pair.text, textRow)]
}

// ---------------------------------------------------------------- dining venue docs
const DINING_LABELS = [
  [/^dress code$/, 'info---dress-code', '\n'],
  [/^(explore|about) the space$/, 'explore---text', '\n\n'],
]

function diningVenueRows(docName, config, parsed, index, model) {
  const collection = model.collections[config.collection]
  const found = itemByName(collection, config.itemName)
  // the catalogue only saw the Zuma item page; the registry gives the other venues' slugs so the check opens their pages
  const item = found && !found.itemPath && config.slug ? { ...found, slug: config.slug, itemPath: `/${config.collection}/${config.slug}` } : found
  const page = index.pages.get(config.templatePage)
  const entries = parsed.entries
  if (!item) return entries.flatMap((entry) => expandEntryRows(docName, entry, noTarget(docName, entry, `no ${config.collection} item named ${config.itemName}`)))
  const ctx = { collectionKey: config.collection, collection, item }
  const rows = []
  const single = (entry, fieldSlug, extra = {}) => expandEntryRows(docName, entry, cmsFieldRow(docName, entry, { ...ctx, fieldSlug, ...extra }))
  const group = (list, fieldSlug, joiner, extra = {}) => (list.length ? groupRows(docName, list, (first, text) => cmsFieldRow(docName, first, { ...ctx, fieldSlug, text, ...extra }), joiner) : [])
  const none = (list, reason) => list.flatMap((entry) => expandEntryRows(docName, entry, noTarget(docName, entry, reason, { page: item.itemPath || `${collection.templatePath}/*`, cmsItem: cmsItemInfo(config.collection, collection, item) })))
  const templateEntries = []

  const [first, ...rest] = entries
  const hint = hintFor(collection, item, 'h1')
  const heroConfirmed = hint && normText(hint.text) === normText(first.text)
  rows.push(...single(first, 'hero-heading', { hintTag: 'h1', confidence: heroConfirmed ? 0.9 : 0.6, reasons: hint ? [] : ['no sample page for this item: the catalogue cannot tell whether the h1 is the item name or its hero heading field'] }))
  let position = 0
  if (rest[0] && !rest[0].bold && !rest[0].scriptHeading) { rows.push(...single(rest[0], 'hero-intro', { confidence: 0.75 })); position = 1 }
  let introDone = false
  while (position < rest.length) {
    const heading = rest[position]
    const body = []
    position++
    while (position < rest.length && !rest[position].bold) body.push(rest[position++])
    const label = normText(heading.text)
    const labelled = DINING_LABELS.find(([pattern]) => pattern.test(label))
    if (labelled) { rows.push(...none([heading], 'section label: the venue page holds only the text under it')); rows.push(...group(body, labelled[1], labelled[2], { confidence: 0.85 })) }
    else if (/^group dining/.test(label)) { templateEntries.push(heading); rows.push(...group(body, 'image-pair---text', '\n\n', { confidence: 0.8 })) }
    else if (!introDone) { introDone = true; rows.push(...single(heading, 'intro---heading', { confidence: 0.75 })); rows.push(...group(body, 'intro---text', '\n\n', { confidence: 0.8 })) }
    else rows.push(...none([heading, ...body], 'further text block: the dining item has no field for a second intro section'))
  }
  if (templateEntries.length && page) rows.push(...templateRows(docName, templateEntries, page, index, new Set()))
  rows.sort((left, right) => left.line - right.line)
  return rows
}

// ---------------------------------------------------------------- legal and corporate docs
function legalCorporateRows(docName, config, parsed, index, model) {
  const collection = model.collections[config.collection]
  const found = itemByName(collection, config.itemName) || { name: config.itemName, slug: null, itemPath: null, observed: false }
  const item = !found.itemPath && config.slug ? { ...found, slug: config.slug, itemPath: `/${config.collection}/${config.slug}` } : found
  const page = index.pages.get(config.templatePage)
  const entries = parsed.entries
  const ctx = { collectionKey: config.collection, collection, item }
  const rows = []
  const taken = new Set()
  const take = (entry, fieldSlug, extra = {}) => { taken.add(entry.line); rows.push(...expandEntryRows(docName, entry, cmsFieldRow(docName, entry, { ...ctx, fieldSlug, ...extra }))) }
  const nextPlain = (entry) => { const next = entries[entries.indexOf(entry) + 1]; return next && !next.bold && !next.scriptHeading && !taken.has(next.line) ? next : null }

  take(entries[0], 'hero-heading', { hintTag: 'h1', confidence: 0.85 })
  const heroText = nextPlain(entries[0])
  if (heroText) take(heroText, 'hero-text', { confidence: 0.8 })
  const script = entries.find((entry) => entry.scriptHeading)
  if (script) {
    take(script, 'intro-heading', { hintTag: 'h2', confidence: 0.85 })
    const introText = nextPlain(script)
    if (introText) take(introText, 'intro-text', { confidence: 0.8 })
  }
  const focus = entries.find((entry) => /^designed for focused/.test(normText(entry.text)))
  if (focus) {
    take(focus, 'focus-heading', { confidence: 0.8 })
    const focusText = nextPlain(focus)
    if (focusText) take(focusText, 'focus-text', { confidence: 0.8 })
  }
  const remaining = entries.filter((entry) => !taken.has(entry.line))
  const { pairs, consumed } = cardPairs(remaining, model.collections, config.cards || [])
  for (const pair of pairs) rows.push(...cardRows(docName, pair, page?.path ?? config.templatePage))
  const leftovers = remaining.filter((entry) => !consumed.has(entry.line))
  if (page) rows.push(...templateRows(docName, leftovers, page, index, new Set()))
  else for (const entry of leftovers) rows.push(...expandEntryRows(docName, entry, noTarget(docName, entry, 'no template page in the catalogue')))
  rows.sort((left, right) => left.line - right.line)
  return rows
}

// ---------------------------------------------------------------- meeting venue pop-up doc
const isModalSlot = (slotItem) => /modal/i.test(slotItem.component || '')
function meetingModalRows(docName, config, parsed, index, model) {
  const collection = model.collections[config.collection]
  const page = index.pages.get(config.page)
  const entries = parsed.entries
  const occurrences = config.venues.map((venue) => ({ venue, key: nameKey(venue), positions: entries.map((entry, position) => (entry.bold && nameKey(entry.text) === nameKey(venue) ? position : -1)).filter((position) => position >= 0) }))
    .filter((venue) => venue.positions.length)
    .sort((left, right) => left.positions[0] - right.positions[0])
  const rows = []
  const bodyRange = new Map()
  occurrences.forEach((venue, order) => {
    const start = venue.positions[venue.positions.length - 1]
    const end = order + 1 < occurrences.length ? occurrences[order + 1].positions[0] : entries.length
    bodyRange.set(venue, [start, end])
  })
  const inBody = (position) => [...bodyRange.values()].some(([start, end]) => position >= start && position < end)
  const earlierNames = new Set(occurrences.flatMap((venue) => venue.positions.slice(0, -1)))

  // header blocks (repeated modal heading and intro): aligned to the modal's own slots, one run at a time
  let run = []
  const flushRun = () => { if (run.length && page) rows.push(...templateRows(docName, run, page, index, new Set(), { slotFilter: isModalSlot, minimumSimilarity: 0.5 })); else for (const entry of run) rows.push(...expandEntryRows(docName, entry, noTarget(docName, entry, 'no meetings page in the catalogue'))); run = [] }
  entries.forEach((entry, position) => {
    if (inBody(position) || earlierNames.has(position)) { flushRun(); return }
    run.push(entry)
  })
  flushRun()

  for (const venue of occurrences) {
    const item = itemByName(collection, venue.venue)
    const [start, end] = bodyRange.get(venue)
    const body = entries.slice(start + 1, end)
    const nameEntries = venue.positions.map((position) => entries[position])
    if (!item) {
      const hints = possibleItems(collection, venue.venue)
      const reason = `no meeting-venues item named ${venue.venue}${hints.length ? `; possible match, not mapped: ${hints.join(', ')}` : ''}`
      for (const entry of [...nameEntries, ...body]) rows.push(...expandEntryRows(docName, entry, noTarget(docName, entry, reason, { possibleItems: hints, needsConfirm: hints.length > 0, confirmReasons: hints.length ? ['a similar item exists'] : [] })))
      continue
    }
    const ctx = { collectionKey: config.collection, collection, item }
    const group = (list, fieldSlug, joiner, extra = {}) => (list.length ? groupRows(docName, list, (first, text) => cmsFieldRow(docName, first, { ...ctx, fieldSlug, text, ...extra }), joiner) : [])
    for (const entry of nameEntries) rows.push(...expandEntryRows(docName, entry, cmsFieldRow(docName, entry, { ...ctx, fieldSlug: 'name', status: 'same', confidence: 0.95 })))
    const detailsAt = body.findIndex((entry) => entry.bold && normText(entry.text) === 'details')
    const featuresAt = body.findIndex((entry) => entry.bold && normText(entry.text) === 'features')
    const labels = body.filter((_, position) => position === detailsAt || position === featuresAt)
    if (labels.length && page) rows.push(...templateRows(docName, labels, page, index, new Set(), { slotFilter: isModalSlot, minimumSimilarity: 0.5 }))
    let intro = null
    let textEntries = []
    let layoutEntries = []
    if (detailsAt >= 0) {
      const beforeDetails = body.slice(0, detailsAt)
      intro = beforeDetails[0] || null
      const featuresStart = featuresAt >= 0 ? featuresAt : body.length
      textEntries = [...beforeDetails.slice(1), ...body.slice(detailsAt + 1, featuresStart)]
      layoutEntries = featuresAt >= 0 ? body.slice(featuresAt + 1) : []
    } else {
      textEntries = body.slice(0, 1)
      layoutEntries = body.slice(1)
    }
    if (intro) rows.push(...expandEntryRows(docName, intro, cmsFieldRow(docName, intro, { ...ctx, fieldSlug: 'card---intro', confidence: 0.6, reasons: ['pop-up tagline taken as the venue card intro; another doc may give the card intro too'] })))
    rows.push(...group(textEntries, 'pop-up---text', '\n\n', { confidence: 0.85 }))
    rows.push(...group(layoutEntries, 'pop-up---layout-options', '\n', { confidence: 0.75 }))
  }
  rows.sort((left, right) => left.line - right.line)
  return rows
}

// ---------------------------------------------------------------- map
export const HELD_PAGES = [
  { page: '/contact', label: 'Contact', doc: 'Guild-Contact', reason: 'Contact doc is empty (C3): page left as it is' },
  { page: '/wellness/in-room-wellness', label: 'In-Room Wellness', doc: null, reason: 'Wellness sub-page on hold (C3): left as it is' },
  { page: '/wellness/fitness-centre', label: 'Fitness Centre', doc: null, reason: 'Wellness sub-page on hold (C3): left as it is' },
  { page: '/wellness/mindful-dining', label: 'Mindful Dining', doc: null, reason: 'Wellness sub-page on hold (C3): left as it is' },
  { page: '/wellness/wellness-events', label: 'Wellness Events', doc: null, reason: 'Wellness sub-page on hold (C3): left as it is' },
]

export function buildCopyMap({ docs, model, registry, held = HELD_PAGES }) {
  const index = indexModel(model)
  const rows = []
  const notes = []
  let rooms = null
  const { usedByPage, usedFor } = index

  for (const doc of docs) {
    const config = registry[doc.name]
    if (!config) throw new Error(`no registry entry for doc ${doc.name}`)
    const parsed = parseDoc(doc.markdown, { foldRepeatedBlocks: Boolean(config.foldRepeatedBlocks) })
    for (const note of parsed.notes) notes.push({ doc: doc.name, ...note })
    if (config.type === 'rooms') {
      const result = roomRows(doc.name, config, parsed, index, model)
      usedFor(config.templatePage)
      rows.push(...result.rows)
      rooms = result.rooms
      continue
    }
    if (config.type === 'cms-plan') {
      const planner = { 'dining-venue': diningVenueRows, 'legal-corporate': legalCorporateRows, 'meeting-modals': meetingModalRows }[config.plan]
      rows.push(...planner(doc.name, config, parsed, index, model))
      usedFor(config.templatePage || config.page)
      continue
    }
    const page = index.pages.get(config.path)
    if (!page) throw new Error(`doc ${doc.name} maps to ${config.path}, which is not in the catalogue`)
    const used = config.reuseSlots ? new Set() : usedFor(page.path)
    const { pairs, consumed } = cardPairs(parsed.entries, model.collections, config.cards || [])
    for (const pair of pairs) rows.push(...cardRows(doc.name, pair, page.path))
    const flowEntries = parsed.entries.filter((entry) => !consumed.has(entry.line))
    const assignments = alignToSlots(flowEntries, page.slots, used)
    if (config.reuseSlots) for (const key of used) usedFor(page.path).add(key)
    for (const entry of flowEntries) {
      const match = assignments.get(entry.line)
      const headRow = match
        ? slotRow(doc.name, entry, match, page, index)
        : baseRow(doc.name, entry, { page: page.path, reason: 'no element on the page is left to hold this line', ...hintForUnmatched(entry, model, config) })
      rows.push(...expandEntryRows(doc.name, entry, headRow))
    }
  }

  // staging text on a mapped page that no doc line took
  for (const [pagePath, used] of usedByPage) {
    const page = index.pages.get(pagePath)
    for (const slotItem of page.slots) {
      if (used.has(slotItem.key) || !showsOnPage(slotItem)) continue
      rows.push({
        ...baseRow(null, { line: null, text: '', notes: [] }, {}),
        id: `no-copy:${pagePath}:${slotItem.key}`,
        doc: null,
        line: null,
        docRole: null,
        page: pagePath,
        newText: null,
        status: 'no copy yet',
        targetKind: slotItem.kind,
        target: slotTarget(slotItem),
        currentText: slotItem.text,
        ...sharedInfo(slotItem, page, index),
      })
    }
  }

  for (const entry of held) {
    rows.push({
      ...baseRow(entry.doc, { line: null, text: '', notes: [] }, {}),
      id: `held:${entry.page}`,
      doc: entry.doc,
      line: null,
      docRole: null,
      page: entry.page,
      newText: null,
      status: 'held',
      targetKind: 'none',
      reason: entry.reason,
    })
  }

  flagConflicts(rows)
  return { rows, notes, rooms }
}

// ---------------------------------------------------------------- one element, several docs
const targetKey = (row) => {
  const target = row.target
  if (!target) return null
  const identity = target.fieldSlug ? `${row.cmsItem?.collection}/${row.cmsItem?.slug ?? nameKey(row.cmsItem?.name ?? '')}/${target.fieldSlug}` : `${target.instance || ''}/${target.propertyId || target.nodeId || ''}`
  return `${row.targetKind}|${row.page}|${identity}`
}

// Rows from different doc lines that write to the same element: identical copy is a duplicate of the first,
// different copy is a conflict a person must settle.
function flagConflicts(rows) {
  const groups = new Map()
  for (const row of rows) {
    if (!['change', 'same'].includes(row.status) || row.joinedInto !== null) continue
    const key = targetKey(row)
    if (!key) continue
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const seen = []
    for (const row of group) {
      const twin = seen.find((other) => normText(other.newText) === normText(row.newText))
      if (twin) row.duplicateOf = twin.id
      else seen.push(row)
    }
    for (const row of group) {
      row.conflictsWith = seen.filter((other) => normText(other.newText) !== normText(row.newText)).map((other) => other.id)
      if (row.conflictsWith.length) {
        row.needsConfirm = true
        row.confirmReasons.push('another doc line writes different copy to this same element')
      }
    }
  }
}
