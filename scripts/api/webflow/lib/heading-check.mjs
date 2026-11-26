// Heading check, pure logic: parses the SEO sheet export, matches each row to a page element, gives the
// verdicts, the H1/H2/H3 counts, the headings no row covers and the shared-part comparison.
// No I/O and no network: it takes the sheet text and the element lists the browser module collected.
import { normText } from './catalogue-helpers.mjs'

export const HEADING_TAGS = ['h1', 'h2', 'h3']

/** Minimal CSV reader: quoted cells may hold commas, line breaks and doubled quotes. */
export function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let quoted = false
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index += 1 } else if (character === '"') quoted = false
      else cell += character
    } else if (character === '"') quoted = true
    else if (character === ',') { row.push(cell); cell = '' }
    else if (character === '\n' || character === '\r') {
      if (character === '\r' && text[index + 1] === '\n') index += 1
      row.push(cell); rows.push(row); row = []; cell = ''
    } else cell += character
  }
  if (cell !== '' || row.length > 0) { row.push(cell); rows.push(row) }
  return rows
}

const pathsIn = (cell) => {
  const found = []
  for (const token of cell.split(/[\s,]+/)) {
    if (/^https?:\/\//.test(token)) { try { found.push(new URL(token).pathname.replace(/\/$/, '') || '/') } catch { /* not a link */ } }
    else if (token.startsWith('/')) found.push(token.replace(/,$/, '').replace(/\/$/, '') || '/')
  }
  return found
}

const LOGO_ROW = /^(.*?)\s*\(logo, alt text\s+"([^"]*)"\)\s*$/
const TEMPLATE_ROW = /^\[[^\]]*\][^,]*,\s*e\.g\.\s*(.+)$/

function parseRowText(rawText) {
  const text = rawText.trim()
  const logo = LOGO_ROW.exec(text)
  if (logo) return { kind: 'logo', text: logo[2] }
  const template = TEMPLATE_ROW.exec(text)
  if (template) return { kind: 'template', text: template[1].trim() }
  return { kind: 'text', text }
}

/** One sheet tab: the page paths it covers and its rows (stops at the first blank line after the table). */
export function parseSheetTab(csvText) {
  const lines = parseCsv(csvText)
  const pageCell = lines.find((line) => line[0] === 'Page')?.[1] ?? ''
  const paths = pathsIn(pageCell)
  const templateVariants = /on one template/.test(pageCell)
  const headerIndex = lines.findIndex((line) => line[0] === '#' && /^Heading text/.test(line[2] ?? ''))
  const rows = []
  for (let index = headerIndex + 1; headerIndex >= 0 && index < lines.length; index += 1) {
    const line = lines[index]
    if (line.every((cell) => cell.trim() === '')) break
    const proposed = (line[4] ?? '').trim()
    if (proposed === '') continue
    rows.push({
      number: rows.length + 1,
      sheetLine: index + 1,
      section: (line[1] ?? '').trim(),
      ...parseRowText(line[2] ?? ''),
      nowTag: (line[3] ?? '').trim().toLowerCase(),
      proposedTag: proposed.toLowerCase(),
      action: (line[5] ?? '').trim(),
    })
  }
  return { title: lines[0]?.[0] ?? '', paths, templateVariants, rows }
}

/** The page's headings in scope: h1 to h3 in page order. Counts and the uncovered list both start here. */
export const headingSet = (elements) => elements.filter((entry) => HEADING_TAGS.includes(entry.tag))

/** {h1, h2, h3} counts of a list; `key` is the field holding the tag (`tag` for elements, `proposedTag` for rows). */
export function countHeadings(items, key = 'tag') {
  const counts = { h1: 0, h2: 0, h3: 0 }
  for (const item of items) if (HEADING_TAGS.includes(item[key])) counts[item[key]] += 1
  return counts
}

const sectionWords = (domSection) => new Set(normText((domSection ?? '').replace(/^section_/, '').replace(/[-_]/g, ' ')).split(' ').filter(Boolean))

const textMatches = (row, entry, wanted) => wanted !== '' && normText(entry.text) === wanted
  && (row.kind === 'logo' ? entry.tag === 'img' || entry.hasImage : entry.tag !== 'img')

/** Page section (section_ class) each sheet section label sits in, learned from its rows whose text appears once on the page. */
function learnSections(rows, elements) {
  const votes = new Map()
  for (const row of rows) {
    const wanted = normText(row.text)
    const candidates = elements.filter((entry) => textMatches(row, entry, wanted))
    if (candidates.length !== 1 || !candidates[0].section) continue
    const tally = votes.get(row.section) ?? new Map()
    tally.set(candidates[0].section, (tally.get(candidates[0].section) ?? 0) + 1)
    votes.set(row.section, tally)
  }
  const learned = new Map()
  for (const [label, tally] of votes) learned.set(label, [...tally].sort((first, second) => second[1] - first[1])[0][0])
  return learned
}

/** How well an element's page section fits a row's sheet section: 2 learned from the row's section, 1 shares a word, 0 neither. */
function sectionFit(row, entry, learned) {
  if (!entry.section) return 0
  if (learned.get(row.section) === entry.section) return 2
  const labelWords = normText(row.section).split(' ').filter((word) => word.length > 2)
  const classWords = sectionWords(entry.section)
  return labelWords.some((word) => classWords.has(word)) ? 1 : 0
}

/**
 * Matches each row to an element by section and text (case and punctuation ignored). Among elements with the row's
 * text, the one whose page section best fits the row's sheet section wins; repeated texts in the same section take the
 * next unused element in page order.
 */
export function matchRows(rows, elements) {
  const learned = learnSections(rows, elements)
  const used = new Set()
  const matchedOrders = new Set()
  let lastOrder = -1
  const results = rows.map((row) => {
    const wanted = normText(row.text)
    const candidates = elements.filter((entry) => !used.has(entry.order) && textMatches(row, entry, wanted))
    const bestFit = Math.max(-1, ...candidates.map((entry) => sectionFit(row, entry, learned)))
    const fitting = candidates.filter((entry) => sectionFit(row, entry, learned) === bestFit)
    const found = fitting.find((entry) => entry.order > lastOrder) ?? fitting[0]
    if (!found) return { row, status: 'not-found' }
    used.add(found.order)
    matchedOrders.add(found.order)
    lastOrder = found.order
    const wrapped = row.kind !== 'logo' || found.hasImage === true
    const passed = found.tag === row.proposedTag && wrapped
    return { row, status: passed ? 'passed' : 'failed', foundTag: found.tag, element: found }
  })
  return { results, matchedOrders }
}

/** Verdicts, counts against the proposed counts and uncovered headings for one page. */
export function checkPage(rows, elements) {
  const { results, matchedOrders } = matchRows(rows, elements)
  const headings = headingSet(elements)
  const found = countHeadings(headings)
  const proposed = countHeadings(rows, 'proposedTag')
  const counts = Object.fromEntries(HEADING_TAGS.map((tag) => [tag, { proposed: proposed[tag], found: found[tag] }]))
  return { results, counts, uncovered: headings.filter((entry) => !matchedOrders.has(entry.order)) }
}

/** Rows that apply to one page of a tab. On a two-page tab a row whose section is "<name> page" belongs to that page only. */
export function rowsForPage(tab, pagePath) {
  if (tab.templateVariants || tab.paths.length < 2) return tab.rows
  const pageWords = normText(pagePath)
  return tab.rows.filter((row) => {
    const named = /^(.*) page$/i.exec(row.section)
    return !named || pageWords.includes(normText(named[1]))
  })
}

export const SHARED_PARTS = {
  footer: ['section_footer-links'],
  'booking and newsletter band': ['section_cta-booking-newsletter'],
  'offers slider': ['section_offers-slider-split'],
  faq: ['section_faq-accordion'],
}

/** For each shared part, the tags in use per class combination, e.g. {footer: {'footer-links_column-heading': ['p']}}. */
export function sharedPartTags(elements) {
  const parts = Object.fromEntries(Object.keys(SHARED_PARTS).map((part) => [part, {}]))
  for (const entry of elements) {
    if (entry.tag === 'img') continue
    const part = Object.keys(SHARED_PARTS).find((name) => SHARED_PARTS[name].includes(entry.section))
    if (!part) continue
    const classKey = entry.classes.join('.') || '(no class)'
    const tags = new Set(parts[part][classKey] ?? [])
    tags.add(entry.tag)
    parts[part][classKey] = [...tags].sort()
  }
  return parts
}

/** Differences between a page's shared-part tags and the homepage's: a part missing, or a class using other tags. */
export function diffSharedParts(homepage, page) {
  const differences = []
  for (const part of Object.keys(SHARED_PARTS)) {
    const homeKeys = Object.keys(homepage[part] ?? {})
    const pageKeys = Object.keys(page[part] ?? {})
    if (homeKeys.length > 0 && pageKeys.length === 0) { differences.push({ part, page: 'absent' }); continue }
    for (const classKey of homeKeys.filter((key) => pageKeys.includes(key))) {
      if (homepage[part][classKey].join() !== page[part][classKey].join()) {
        differences.push({ part, classKey, homepage: homepage[part][classKey], page: page[part][classKey] })
      }
    }
  }
  return differences
}
