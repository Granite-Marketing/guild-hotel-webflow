// Copy check: decides, for each copy map row, whether staging already shows the row's new text.
// Pure functions only: no I/O, no network. The crawl lives in copy-check-browser.mjs.
//
// Statuses
//   done       the new text is on the page (case, whitespace and nbsp ignored; the CSS lowercases headings)
//   differs    the row's target is on the page but reads differently (the found text is reported)
//   missing    neither the new text nor the target is on the page
//   unchecked  the row is not checked at all (reason given): joined or duplicate row, second version,
//              not on site, no copy yet, held, a CMS row with no page to look on, or a page that failed to load
//
// Where a row is checked
//   page rows: row.page
//   CMS rows: cmsItem.itemPath when the item has its own page, otherwise cmsItem.listingPaths, then row.appearsOn
//
// How the target is located (in this order, first hit wins; clones made by the slider are never used):
//   1. done: any element on a checked page whose normalised text equals the normalised new text
//      (limit: a short line such as "Discover More" also counts as done when another element shows it)
//   2. by text: an element whose normalised text equals the row's current text (or starts with the
//      truncated textHint when there is no current text); ties go to the same tag, then the same
//      section, then the order closest to target.liveOrder
//   3. by position: the element with target.tag, target.section and order equal to target.liveOrder
//   otherwise missing. With several pages (listings) the best result wins: done, then differs, then missing.
export const STATUSES = ['done', 'differs', 'missing', 'unchecked']

const collapse = (text) => (text || '').replace(/\s+/g, ' ').trim().toLowerCase()
const collapseWithoutSpaces = (text) => collapse(text).replace(/ /g, '')
export const sameText = (left, right) => {
  const leftText = collapse(left)
  return leftText !== '' && (leftText === collapse(right) || collapseWithoutSpaces(left) === collapseWithoutSpaces(right))
}

const UNCHECKED_STATUS_REASONS = {
  'second version listed': 'second version: the alternate is listed for Omar, not published',
  'not on site': 'not on site: no element to check',
  'no copy yet': 'no copy yet: staging text is a placeholder',
  held: 'held: left as it is',
}

// Where to look for a row, or why not to check it.
export function planRow(row) {
  if (row.joinedInto) return { reason: `joined into ${row.joinedInto}: the head row carries the composed text` }
  if (row.duplicateOf) return { reason: `duplicate of ${row.duplicateOf}` }
  if (UNCHECKED_STATUS_REASONS[row.status]) return { reason: UNCHECKED_STATUS_REASONS[row.status] }
  if (!collapse(row.newText)) return { reason: 'no new text' }
  if (!row.cmsItem) {
    if (!row.page || row.page.includes('*')) return { reason: 'page is a template path, not a page' }
    return { paths: [row.page] }
  }
  if (row.cmsItem.itemPath) return { paths: [row.cmsItem.itemPath] }
  const listing = [...(row.cmsItem.listingPaths || []), ...(row.appearsOn || [])]
  const paths = [...new Set(listing)]
  if (paths.length === 0) return { reason: 'CMS item has no item page and no listing page to check' }
  return { paths }
}

export function pagesNeeded(rows) {
  return [...new Set(rows.flatMap((row) => planRow(row).paths || []))]
}

const rank = { done: 3, differs: 2, missing: 1 }

function locateOnPage(row, elements) {
  const usable = elements.filter((candidate) => !candidate.swiperClone)
  if (elements.some((candidate) => sameText(candidate.textContent, row.newText))) return { status: 'done' }
  const target = row.target || {}
  const currentText = row.currentText ? collapse(row.currentText) : null
  const hint = currentText ? null : collapse(target.textHint)
  const byText = usable.filter((candidate) => {
    const text = collapse(candidate.textContent)
    if (currentText) return text === currentText || collapseWithoutSpaces(candidate.textContent) === collapseWithoutSpaces(row.currentText)
    return hint !== '' && text.startsWith(hint)
  })
  const distance = (candidate) => (Number.isInteger(target.liveOrder) ? Math.abs(candidate.order - target.liveOrder) : 0)
  byText.sort((left, right) => {
    const leftScore = (left.tag === target.tag ? 0 : 2) + (left.section === target.section ? 0 : 1)
    const rightScore = (right.tag === target.tag ? 0 : 2) + (right.section === target.section ? 0 : 1)
    return leftScore - rightScore || distance(left) - distance(right) || left.order - right.order
  })
  let found = byText[0]
  if (!found && target.tag && Number.isInteger(target.liveOrder)) {
    found = usable.find((candidate) => candidate.order === target.liveOrder && candidate.tag === target.tag && (candidate.section ?? null) === (target.section ?? null))
  }
  return found ? { status: 'differs', foundText: found.textContent.replace(/\s+/g, ' ').trim() } : { status: 'missing' }
}

export function checkRow(row, pages) {
  const base = { id: row.id, doc: row.doc, line: row.line, page: row.page, status: row.status, newText: row.newText ?? null }
  const plan = planRow(row)
  if (!plan.paths) return { ...base, check: 'unchecked', reason: plan.reason }
  let best = null
  const errors = []
  for (const path of plan.paths) {
    const page = pages[path]
    if (!page || page.status !== 'ok') { errors.push(`${path}: ${page?.error || 'not loaded'}`); continue }
    const outcome = { ...locateOnPage(row, page.elements), checkedOn: path }
    if (!best || rank[outcome.status] > rank[best.status]) best = outcome
  }
  if (!best) return { ...base, check: 'unchecked', reason: `page could not be loaded (${errors.join('; ')})` }
  return { ...base, check: best.status, checkedOn: best.checkedOn, ...(best.foundText === undefined ? {} : { foundText: best.foundText }) }
}

// One shared decision: results carry `status` (done, differs, missing, unchecked) and the copy map status as `mapStatus`.
export function checkRows(rows, pages) {
  return rows.map((row) => {
    const { check, status, ...rest } = checkRow(row, pages)
    return { ...rest, mapStatus: status, status: check }
  })
}

export function countStatuses(results) {
  const counts = { done: 0, differs: 0, missing: 0, unchecked: 0 }
  for (const result of results) counts[result.status] += 1
  return counts
}
