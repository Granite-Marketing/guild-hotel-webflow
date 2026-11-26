import test from 'node:test'
import assert from 'node:assert/strict'
import { checkRows, pagesNeeded, countStatuses } from '../../scripts/api/webflow/lib/copy-check.mjs'

const element = (tag, textContent, extra = {}) => ({ tag, textContent, order: 0, section: null, classes: [], swiperClone: false, ...extra })
const okPage = (...elements) => ({ status: 'ok', elements: elements.map((entry, order) => ({ ...entry, order })) })
const pageRow = (overrides = {}) => ({
  id: 'doc:1', doc: 'doc', line: 1, page: '/arts', cmsItem: null, newText: 'Art & Stories', status: 'change', targetKind: 'page-text',
  target: { tag: 'h1', section: 'section_hero', liveOrder: 1, textHint: 'art collection' }, currentText: 'art collection',
  alternates: [], alternateOf: null, joinedInto: null, duplicateOf: null, ...overrides,
})
const cmsRow = (cmsItem, overrides = {}) => pageRow({
  id: 'cms:1', page: '/rooms/cozy-queen', targetKind: 'cms-field', target: { fieldSlug: 'hero-heading', tag: 'h1' }, currentText: 'old room name', cmsItem: { itemPath: null, listingPaths: [], ...cmsItem }, ...overrides,
})
const statusOf = (row, pages) => checkRows([row], pages)[0]

test('a row is done when the target text is on the page, ignoring case and whitespace', () => {
  const pages = { '/arts': okPage(element('h1', '  art &\n stories ', { section: 'section_hero' })) }
  assert.equal(statusOf(pageRow(), pages).status, 'done')
})

test('a heading the CSS lowercases counts as done', () => {
  const pages = { '/arts': okPage(element('h1', 'art & stories', { section: 'section_hero' })) }
  assert.equal(statusOf(pageRow({ newText: 'ART & Stories' }), pages).status, 'done')
})

test('a row is differs, with the found text, when the target is found by its current text but reads differently', () => {
  const pages = { '/arts': okPage(element('p', 'intro'), element('h1', 'Art Collection', { section: 'section_hero' })) }
  const result = statusOf(pageRow(), pages)
  assert.equal(result.status, 'differs')
  assert.equal(result.foundText, 'Art Collection')
})

test('a row is differs when the target is found by tag, section and position although its text was edited to something else', () => {
  const pages = { '/arts': okPage(element('p', 'intro'), element('h1', 'Something else entirely', { section: 'section_hero' })) }
  const result = statusOf(pageRow(), pages)
  assert.equal(result.status, 'differs')
  assert.equal(result.foundText, 'Something else entirely')
})

test('a row is missing when neither the new text nor the target is on the page', () => {
  const pages = { '/arts': okPage(element('h2', 'unrelated', { section: 'section_other' })) }
  const result = statusOf(pageRow(), pages)
  assert.equal(result.status, 'missing')
  assert.equal(result.foundText, undefined)
})

test('a CMS row is checked on the item page when one exists, not on the listing', () => {
  const row = cmsRow({ itemPath: '/rooms/cozy-queen', listingPaths: ['/rooms'] }, { newText: 'Cozy Queen Suite' })
  const pages = {
    '/rooms/cozy-queen': okPage(element('h1', 'old room name')),
    '/rooms': okPage(element('h3', 'Cozy Queen Suite')),
  }
  assert.deepEqual(pagesNeeded([row]), ['/rooms/cozy-queen'])
  const result = statusOf(row, pages)
  assert.equal(result.status, 'differs')
  assert.equal(result.checkedOn, '/rooms/cozy-queen')
})

test('a CMS row without an item page is checked on the listing pages', () => {
  const row = cmsRow({ listingPaths: ['/meetings', '/legal-corporate/corporate'] }, { newText: 'Small Conference Center', currentText: null, target: { fieldSlug: 'name', tag: null } })
  const pages = { '/meetings': okPage(element('h3', 'something')), '/legal-corporate/corporate': okPage(element('h3', 'small conference center')) }
  assert.deepEqual(pagesNeeded([row]), ['/meetings', '/legal-corporate/corporate'])
  const result = statusOf(row, pages)
  assert.equal(result.status, 'done')
  assert.equal(result.checkedOn, '/legal-corporate/corporate')
})

test('a CMS row falls back to appearsOn when it has no listing path', () => {
  const row = cmsRow({}, { appearsOn: ['/dining'], newText: 'Zuma' })
  assert.deepEqual(pagesNeeded([row]), ['/dining'])
})

test('a CMS row with neither an item page nor a listing page is unchecked with the reason', () => {
  const result = statusOf(cmsRow({}), {})
  assert.equal(result.status, 'unchecked')
  assert.match(result.reason, /no item page and no listing page/)
  assert.deepEqual(pagesNeeded([cmsRow({})]), [])
})

test('a page that could not be loaded leaves its rows unchecked with the load error', () => {
  const result = statusOf(pageRow(), { '/arts': { status: 'failed', error: 'timeout' } })
  assert.equal(result.status, 'unchecked')
  assert.match(result.reason, /could not be loaded.*timeout/)
})

test('rows that must not be checked are unchecked with a reason and never counted done, differs or missing', () => {
  // Every one of these would be "done" or "differs" if it were checked: the text is on the page.
  const pages = { '/arts': okPage(element('h1', 'Art & Stories', { section: 'section_hero' })) }
  const rows = [
    pageRow({ id: 'a', joinedInto: 'head' }),
    pageRow({ id: 'b', duplicateOf: 'head' }),
    pageRow({ id: 'c', status: 'second version listed', alternateOf: 'head' }),
    pageRow({ id: 'd', status: 'not on site', targetKind: 'not-on-site' }),
    pageRow({ id: 'e', status: 'no copy yet', newText: null }),
    pageRow({ id: 'f', status: 'held', targetKind: 'none' }),
    pageRow({ id: 'g' }),
  ]
  const results = checkRows(rows, pages)
  assert.deepEqual(results.map((result) => result.status), ['unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked', 'unchecked', 'done'])
  assert.ok(results.slice(0, 6).every((result) => result.reason))
  assert.match(results[0].reason, /joined into head/)
  assert.match(results[1].reason, /duplicate of head/)
  assert.match(results[2].reason, /second version/)
  assert.deepEqual(countStatuses(results), { done: 1, differs: 0, missing: 0, unchecked: 6 })
  assert.deepEqual(pagesNeeded(rows), ['/arts'])
})

test('the report groups rows by page with counts per status and overall, from the same results', async () => {
  const { buildCopyCheckReport, renderCopyCheckMarkdown } = await import('../../scripts/api/webflow/lib/copy-check-report.mjs')
  const pages = { '/arts': okPage(element('h1', 'Art & Stories', { section: 'section_hero' })), '/history': okPage(element('p', 'x')) }
  const rows = [
    pageRow({ id: 'a' }),
    pageRow({ id: 'b', page: '/history', target: { tag: 'h1', section: 's', liveOrder: 9 }, currentText: 'gone' }),
    pageRow({ id: 'c', page: '/history', status: 'held' }),
  ]
  const results = checkRows(rows, pages)
  const report = buildCopyCheckReport(results, { generated: '2026-11-26T00:00:00.000Z', staging: 'https://staging.test' })
  assert.deepEqual(report.summary, { done: 1, differs: 0, missing: 1, unchecked: 1, total: 3 })
  assert.deepEqual(report.pages.map((entry) => [entry.page, entry.counts, entry.rows.length]), [
    ['/arts', { done: 1, differs: 0, missing: 0, unchecked: 0 }, 1],
    ['/history', { done: 0, differs: 0, missing: 1, unchecked: 1 }, 2],
  ])
  const markdown = renderCopyCheckMarkdown(report)
  assert.match(markdown, /## \/history/)
  assert.match(markdown, /held: left as it is/)
  assert.ok(['a', 'b', 'c'].every((id) => markdown.includes(`\`${id}\``)), 'every row appears in the report')
  assert.ok(!markdown.includes('\u2014'))
})

// Browser extraction on saved page fixtures (headless chromium, 1440 wide, file:// URLs only).
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/copy-check')

test('extraction from saved fixtures finds headings, body text and sections; a CSS-lowercased heading is done', async () => {
  const { openBrowser, loadPageElements } = await import('../../scripts/api/webflow/lib/copy-check-browser.mjs')
  const browser = await openBrowser()
  try {
    const home = await loadPageElements(browser, `file://${FIXTURES}/home.html`)
    assert.equal(home.status, 'ok')
    const heading = home.elements.find((candidate) => candidate.tag === 'h1')
    assert.equal(heading.section, 'section_hero-fullbleed-centered')
    assert.ok(home.elements.some((candidate) => candidate.tag === 'p' && candidate.textContent === 'Behind this facade is a century of mischief.'))
    assert.ok(home.elements.some((candidate) => candidate.tag === 'a' && candidate.swiperClone))
    assert.ok(!home.elements.some((candidate) => candidate.textContent.includes('data.ran')), 'script text is not copy')
    const row = pageRow({ page: '/', newText: 'A CENTURY OF STORIES', target: { tag: 'h1', section: 'section_hero-fullbleed-centered', liveOrder: 0 } })
    assert.equal(statusOf(row, { '/': home }).status, 'done')
    const failed = await loadPageElements(browser, `file://${FIXTURES}/nope.html`)
    assert.equal(failed.status, 'failed')
  } finally {
    await browser.close()
  }
})

test('the fixture pages decide done, differs and missing end to end', async () => {
  const { openBrowser, loadPageElements } = await import('../../scripts/api/webflow/lib/copy-check-browser.mjs')
  const browser = await openBrowser()
  try {
    const room = await loadPageElements(browser, `file://${FIXTURES}/rooms__cozy-queen.html`)
    const base = { page: '/rooms/cozy-queen', targetKind: 'cms-field', cmsItem: { itemPath: '/rooms/cozy-queen', listingPaths: [] } }
    const rows = [
      pageRow({ ...base, id: 'done', newText: 'Perfectly Intimate', currentText: 'x' }),
      pageRow({ ...base, id: 'differs', newText: 'The Cozy Queen Room', currentText: 'Cozy Queen', target: { tag: 'h1' } }),
      pageRow({ ...base, id: 'missing', newText: 'Snuggle up', currentText: 'nothing like this', target: { tag: 'p' } }),
    ]
    const results = checkRows(rows, { '/rooms/cozy-queen': room })
    assert.deepEqual(results.map((result) => result.status), ['done', 'differs', 'missing'])
  } finally {
    await browser.close()
  }
})

// Read-only guard. The copy check may load pages (GET) and nothing else.
import fs from 'node:fs'
import { tmpdir } from 'node:os'

const SCRIPTS = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../scripts/api/webflow')
const COPY_CHECK_SOURCES = ['copy-check.mjs', 'lib/copy-check.mjs', 'lib/copy-check-report.mjs', 'lib/copy-check-browser.mjs']
// MUTATION: each pattern below is a way the check could write to Webflow or reach its API; a planted offender must trip it.
const FORBIDDEN = [
  [/api\.webflow\.com/, 'Webflow API host'],
  [/WEBFLOW_API_TOKEN|WEBFLOW_SITE_ID|process\.env/, 'token or environment read'],
  [/\bfetch\s*\(/, 'fetch call'],
  [/method\s*:\s*['"`](?!GET)/i, 'non-GET method'],
  [/\.(post|put|patch|delete)\s*\(/i, 'write request'],
  [/\.(click|fill|type|press|check|setInputFiles)\s*\(/, 'page interaction'],
  [/page\.route\s*\(|\.evaluate\([^)]*XMLHttpRequest/, 'request interception or XHR'],
]
const offences = (source) => FORBIDDEN.filter(([pattern]) => pattern.test(source)).map(([, label]) => label)

test('the copy check source makes no non-GET request, no Webflow API call and reads no token', () => {
  for (const file of COPY_CHECK_SOURCES) {
    const source = fs.readFileSync(path.join(SCRIPTS, file), 'utf8')
    assert.deepEqual(offences(source), [], `${file} must stay read only`)
  }
})

test('the read-only guard catches a planted offender', () => {
  assert.deepEqual(offences("await fetch('https://api.webflow.com/v2/pages/1', { method: 'PATCH' })"), ['Webflow API host', 'fetch call', 'non-GET method'])
  assert.deepEqual(offences('const token = process.env.WEBFLOW_API_TOKEN'), ['token or environment read'])
  assert.deepEqual(offences('await page.click("button")'), ['page interaction'])
  assert.deepEqual(offences("await page.goto(url, { waitUntil: 'load' })"), [])
})

test('the CLI runs end to end on saved fixtures and writes the report without touching the network', async () => {
  const { main } = await import('../../scripts/api/webflow/copy-check.mjs')
  const out = fs.mkdtempSync(path.join(tmpdir(), 'copy-check-'))
  const map = path.join(out, 'map.json')
  fs.writeFileSync(map, JSON.stringify({ rows: [
    pageRow({ id: 'home', page: '/', newText: 'A Century of Stories', target: { tag: 'h1', section: 'section_hero-fullbleed-centered', liveOrder: 0 } }),
    pageRow({ id: 'room', page: '/rooms/cozy-queen', newText: 'Nothing like it', currentText: 'Cozy Queen', target: { tag: 'h1' }, cmsItem: { itemPath: '/rooms/cozy-queen', listingPaths: [] } }),
    pageRow({ id: 'held', page: '/wellness', status: 'held' }),
  ] }))
  const report = await main(['--fixtures', FIXTURES, '--map', map, '--out', out])
  assert.deepEqual(report.summary, { done: 1, differs: 1, missing: 0, unchecked: 1, total: 3 })
  assert.ok(fs.existsSync(path.join(out, 'copy-check.json')) && fs.existsSync(path.join(out, 'copy-check.md')))
})
