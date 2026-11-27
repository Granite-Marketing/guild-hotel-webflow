import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  parseCsv, parseSheetTab, matchRows, headingSet, countHeadings, checkPage, rowsForPage, sharedPartTags, diffSharedParts,
  missingBaselines, templatePath, checkedPaths,
} from '../../scripts/api/webflow/lib/heading-check.mjs'
import { renderReport, summarise } from '../../scripts/api/webflow/lib/heading-check-report.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FIXTURES = path.join(HERE, 'fixtures/heading-check')
const ROOT = path.resolve(HERE, '../..')
const homepageSheet = () => parseSheetTab(fs.readFileSync(path.join(FIXTURES, 'sheets/homepage.csv'), 'utf8'))

const element = (order, tag, text, extra = {}) => ({ order, tag, text, hasImage: false, classes: [], section: null, swiperClone: false, ...extra })
const fakeReport = (pages, sharedParts = {}) => ({ generated: 'now', source: 'test', tabs: [{ name: 'tab', pages }], sharedParts: { checked: 0, baselineMissing: [], differing: [], notLoaded: [], noPage: [], ...sharedParts } })
const row = (overrides) => ({ number: 1, section: 'Hero', text: 'x', kind: 'text', proposedTag: 'h2', nowTag: 'h2', action: 'Keep', ...overrides })

test('parseCsv keeps commas and doubled quotes inside quoted cells', () => {
  assert.deepEqual(parseCsv('a,"b, ""c""",d\n1,2,3\n'), [['a', 'b, "c"', 'd'], ['1', '2', '3']])
})

test('parseSheetTab reads the page, the rows and stops at the content notes', () => {
  const tab = homepageSheet()
  assert.deepEqual(tab.paths, ['/'])
  assert.equal(tab.rows.length, 8)
  assert.equal(tab.rows[0].text, 'Welcome to the Fixture Hotel, a stay')
  assert.equal(tab.rows[0].proposedTag, 'h1')
  assert.equal(tab.rows[3].proposedTag, 'p')
})

test('parseSheetTab turns a logo row into the alt text and a template row into its example', () => {
  const tab = homepageSheet()
  assert.equal(tab.rows[2].kind, 'logo')
  assert.equal(tab.rows[2].text, 'Zuma San Diego')
  const template = parseSheetTab('Room pages (12): heading structure,,,,,,,\n"Page","12 room pages on one template: /rooms/a, /rooms/b",,,,,,\n#,Section,Heading text (as on staging),Tag now,Proposed tag,Action,Why,Note\n1,Hero,"[room name], e.g. Cozy Queen",H1,H1,Keep,why,\n')
  assert.deepEqual(template.paths, ['/rooms/a', '/rooms/b'])
  assert.equal(template.templateVariants, true)
  assert.equal(template.rows[0].text, 'Cozy Queen')
})

test('a row passes when the element with its text has the proposed tag, ignoring case and punctuation', () => {
  const { results } = matchRows([row({ text: 'A century of stories', proposedTag: 'h2' })], [element(0, 'h2', 'A Century of Stories!')])
  assert.equal(results[0].status, 'passed')
})

test('"p" means a paragraph: an h2 holding the text fails and reports the tag found', () => {
  const { results } = matchRows([row({ text: 'Offer', proposedTag: 'p' })], [element(0, 'h2', 'Offer')])
  assert.equal(results[0].status, 'failed')
  assert.equal(results[0].foundTag, 'h2')
})

test('a row whose text is not on the page is not found', () => {
  const { results } = matchRows([row({ text: 'Gone' })], [element(0, 'h2', 'Other')])
  assert.equal(results[0].status, 'not-found')
})

test('repeated texts match in page order', () => {
  // MUTATION: if the matcher always took the first element with the text, the second row would also read the h2 and fail.
  const elements = [element(0, 'h2', 'Wellness staycation'), element(1, 'p', 'Wellness staycation')]
  const rows = [row({ number: 1, text: 'wellness staycation', proposedTag: 'p' }), row({ number: 2, text: 'wellness staycation', proposedTag: 'p' })]
  const { results } = matchRows(rows, elements)
  assert.deepEqual(results.map((result) => [result.status, result.foundTag]), [['failed', 'h2'], ['passed', 'p']])
})

test('the section decides between repeated texts: a Footer row skips the same text in an earlier section', () => {
  // MUTATION: matching by text and page order only would give the Footer row the offers slider's paragraph (order 1).
  const elements = [
    element(0, 'h2', 'Explore', { section: 'section_hero' }),
    element(1, 'p', 'Explore', { section: 'section_offers-slider-split' }),
    element(2, 'h2', 'Explore', { section: 'section_footer-links' }),
  ]
  const rows = [row({ number: 1, section: 'Hero', text: 'Explore', proposedTag: 'h2' }), row({ number: 2, section: 'Footer', text: 'Explore', proposedTag: 'p' })]
  const { results } = matchRows(rows, elements)
  assert.deepEqual(results.map((result) => [result.element.order, result.status, result.foundTag]), [[0, 'passed', 'h2'], [2, 'failed', 'h2']])
})

test('a section label the page classes do not name is learned from its rows with unique text', () => {
  // MUTATION: without learning, the "Reservations" row would take the first unused "Book now" (order 1, in the hero).
  const elements = [
    element(0, 'h2', 'Plan your stay', { section: 'section_cta-booking-newsletter' }),
    element(1, 'p', 'Book now', { section: 'section_home-hero' }),
    element(2, 'h3', 'Book now', { section: 'section_cta-booking-newsletter' }),
  ]
  const rows = [row({ number: 1, section: 'Reservations', text: 'Plan your stay', proposedTag: 'h2' }), row({ number: 2, section: 'Reservations', text: 'Book now', proposedTag: 'h3' })]
  const { results } = matchRows(rows, elements)
  assert.deepEqual(results.map((result) => result.element.order), [0, 2])
})

test('a row whose text is only in another section is not found, naming the section the text is in', () => {
  // MUTATION: accepting a fit-0 candidate would pass the "Rooms" row against the footer's "Book now" h3.
  const elements = [
    element(0, 'h2', 'Our rooms', { section: 'section_rooms-grid' }),
    element(1, 'h3', 'Book now', { section: 'section_footer-links' }),
  ]
  const { results } = matchRows([row({ section: 'Rooms', text: 'Book now', proposedTag: 'h3' })], elements)
  assert.equal(results[0].status, 'not-found')
  assert.equal(results[0].otherSection, 'section_footer-links')
  assert.match(renderReport(fakeReport([{ path: '/', ...checkPage([row({ section: 'Rooms', text: 'Book now', proposedTag: 'h3' })], elements) }])), /not found in its section \(text found in section_footer-links\)/)
})

test('a unique stray text in another section cannot teach a label its section when a page section names the label', () => {
  // MUTATION: learning "Rooms" from its one unique text would set it to the footer and pass the row (fit 2).
  const elements = [
    element(0, 'h2', 'Rest easy', { section: 'section_rooms-grid' }),
    element(1, 'h3', 'Only in the footer', { section: 'section_footer-links' }),
  ]
  const rows = [row({ number: 1, section: 'Rooms', text: 'Only in the footer', proposedTag: 'h3' }), row({ number: 2, section: 'Rooms', text: 'Rest easy', proposedTag: 'h2' })]
  const { results } = matchRows(rows, elements)
  assert.deepEqual(results.map((result) => result.status), ['not-found', 'passed'])
})

test('with no page section fitting the label, the match falls back to text and page order', () => {
  // The untaken branch of the section guard: nothing on the page fits "Reservations" (no shared word, nothing learned
  // because the text repeats), so the first same-text element is used.
  const elements = [element(0, 'p', 'Book now', { section: 'section_home-hero' }), element(1, 'h3', 'Book now', { section: 'section_footer-links' })]
  const { results } = matchRows([row({ section: 'Reservations', text: 'Book now', proposedTag: 'p' })], elements)
  assert.deepEqual([results[0].status, results[0].element.order], ['passed', 0])
})

test('label words of two letters or fewer do not make a section fit', () => {
  // Adversarial: a two-letter label word like "of" must not tie the row to section_cta-of; the text fallback keeps page order.
  const elements = [element(0, 'h2', 'Hi', { section: 'section_home-hero' }), element(1, 'h2', 'Hi', { section: 'section_cta-of' })]
  const { results } = matchRows([row({ section: 'Of', text: 'Hi', proposedTag: 'h2' })], elements)
  assert.equal(results[0].status, 'passed')
  assert.equal(results[0].element.order, 0)
})

test('a wrapped logo passes only as an h3 that contains the image, found by its alt text', () => {
  const logoRow = row({ text: 'Zuma San Diego', kind: 'logo', proposedTag: 'h3' })
  const wrapped = matchRows([logoRow], [element(0, 'h3', 'Zuma San Diego', { hasImage: true })])
  assert.equal(wrapped.results[0].status, 'passed')
  // MUTATION: matching a bare image as if it were the heading would pass an unwrapped logo.
  const bare = matchRows([logoRow], [element(0, 'img', 'Zuma San Diego')])
  assert.equal(bare.results[0].status, 'failed')
  assert.equal(bare.results[0].foundTag, 'img')
  const wrongTag = matchRows([logoRow], [element(0, 'h2', 'Zuma San Diego', { hasImage: true })])
  assert.equal(wrongTag.results[0].status, 'failed')
})

test('one shared function gives the heading set that both the counts and the uncovered list use', () => {
  const elements = [element(0, 'h1', 'A'), element(1, 'h2', 'B'), element(2, 'h4', 'C'), element(3, 'p', 'D'), element(4, 'h3', 'E')]
  assert.deepEqual(headingSet(elements).map((entry) => entry.text), ['A', 'B', 'E'])
  assert.deepEqual(countHeadings(headingSet(elements)), { h1: 1, h2: 1, h3: 1 })
})

test('checkPage counts proposed headings against found, leaves paragraph rows out of the proposed count and lists uncovered headings', () => {
  const rows = [row({ number: 1, text: 'Title', proposedTag: 'h1' }), row({ number: 2, text: 'Card', proposedTag: 'p' }), row({ number: 3, text: 'Section', proposedTag: 'h2' })]
  const elements = [element(0, 'h1', 'Title'), element(1, 'h2', 'Card'), element(2, 'h2', 'Section'), element(3, 'h2', 'Stay in the loop'), element(4, 'h3', 'Loose')]
  const page = checkPage(rows, elements)
  // MUTATION: counting the p row as a heading would make the proposed h2 count 2.
  assert.deepEqual(page.counts, { h1: { proposed: 1, found: 1 }, h2: { proposed: 1, found: 3 }, h3: { proposed: 0, found: 1 } })
  assert.deepEqual(page.uncovered.map((entry) => [entry.tag, entry.text]), [['h2', 'Stay in the loop'], ['h3', 'Loose']])
})

test('rowsForPage leaves out a row that belongs to the other page of a two-page tab', () => {
  const tab = { templateVariants: false, paths: ['/privacy-policy', '/accessibility'], rows: [row({ section: 'Privacy policy page' }), row({ section: 'Accessibility page' }), row({ section: 'Footer' })] }
  assert.deepEqual(rowsForPage(tab, '/accessibility').map((entry) => entry.section), ['Accessibility page', 'Footer'])
  assert.deepEqual(rowsForPage(tab, '/privacy-policy').map((entry) => entry.section), ['Privacy policy page', 'Footer'])
})

test('shared parts diff reports a part whose tags differ from the homepage', () => {
  const part = (section, tag) => element(0, tag, 'x', { section, classes: ['footer-links_column-heading'] })
  const home = sharedPartTags([part('section_footer-links', 'p')])
  assert.deepEqual(diffSharedParts(home, sharedPartTags([part('section_footer-links', 'p')])), [])
  const differences = diffSharedParts(home, sharedPartTags([part('section_footer-links', 'h2')]))
  assert.equal(differences.length, 1)
  assert.equal(differences[0].part, 'footer')
  assert.deepEqual([differences[0].homepage, differences[0].page], [['p'], ['h2']])
})

test('a page that lacks a shared part the homepage has is reported as absent', () => {
  const home = sharedPartTags([element(0, 'h2', 'x', { section: 'section_faq-accordion', classes: ['q'] })])
  assert.deepEqual(diffSharedParts(home, sharedPartTags([])).map((entry) => [entry.part, entry.page]), [['faq', 'absent']])
})

test('shared parts diff lists a class found only on the page and one found only on the homepage', () => {
  // MUTATION: comparing only the classes both sides have would report nothing for either case.
  const footer = (classes, tag) => element(0, tag, 'x', { section: 'section_footer-links', classes })
  const home = sharedPartTags([footer(['footer-links_column-heading'], 'p'), footer(['footer-links_legal'], 'p')])
  const page = sharedPartTags([footer(['footer-links_column-heading'], 'p'), footer(['footer-links_extra-heading'], 'h2')])
  assert.deepEqual(diffSharedParts(home, page).map((entry) => [entry.classKey, entry.homepage, entry.page]), [
    ['footer-links_extra-heading', [], ['h2']],
    ['footer-links_legal', ['p'], []],
  ])
  const report = fakeReport([], { differing: [{ path: '/about', differences: diffSharedParts(home, page) }] })
  assert.match(renderReport(report), /footer-links_extra-heading`: homepage none, here H2/)
})

test('a missing homepage baseline is reported per part and counted, never as "no page differs"', async () => {
  // MUTATION: treating a missing baseline as no differences prints "No page differs." with nothing compared.
  assert.deepEqual(missingBaselines(null), ['footer', 'booking and newsletter band', 'offers slider', 'faq'])
  const homeWithoutFaq = sharedPartTags([element(0, 'p', 'x', { section: 'section_footer-links', classes: ['a'] })])
  assert.deepEqual(missingBaselines(homeWithoutFaq), ['booking and newsletter band', 'offers slider', 'faq'])
  assert.deepEqual(diffSharedParts(null, sharedPartTags([element(0, 'h2', 'x', { section: 'section_faq-accordion', classes: ['q'] })])), [])
  const { buildReport } = await import('../../scripts/api/webflow/heading-check.mjs')
  const pages = { '/about': { status: 'ok', elements: [element(0, 'h2', 'x', { section: 'section_faq-accordion', classes: ['q'] })] }, '/': { status: 'error', error: 'timeout' } }
  const report = buildReport([], pages, ['/', '/about'], { generated: 'now', source: 'test' })
  assert.deepEqual(report.sharedParts.baselineMissing, ['footer', 'booking and newsletter band', 'offers slider', 'faq'])
  assert.equal(summarise(report).sharedPartsBaselineMissing, 4)
  const markdown = renderReport(report)
  assert.match(markdown, /- faq: baseline missing, comparison not done/)
  assert.doesNotMatch(markdown, /No page differs\./)
})

test('a template tab is checked on the page whose slug matches its example, else the closest, else the first', () => {
  const roomTab = { templateVariants: true, paths: ['/rooms/guild-city-level-loft', '/rooms/cozy-courtyard-queen', '/rooms/cozy-queen'], rows: [row({ kind: 'template', text: 'Cozy Queen' })] }
  // MUTATION: taking paths[0] checks the loft page, where the "Cozy Queen" H1 row can never pass.
  assert.equal(templatePath(roomTab), '/rooms/cozy-queen')
  const venueTab = { templateVariants: true, paths: ['/dining/dining-lobbybar', '/dining/dining-zuma'], rows: [row({ kind: 'template', text: 'zuma san diego' })] }
  assert.equal(templatePath(venueTab), '/dining/dining-zuma')
  // Adversarial: equal word overlap ("cozy queen" in both) goes to the path with fewer extra words.
  assert.equal(templatePath({ ...roomTab, paths: ['/rooms/cozy-courtyard-queen', '/rooms/queen-cozy'] }), '/rooms/queen-cozy')
  assert.equal(templatePath({ ...roomTab, paths: ['/rooms/loft', '/rooms/double'] }), '/rooms/loft')
  assert.equal(templatePath({ ...roomTab, rows: [row({ text: 'Not a template row' })] }), '/rooms/guild-city-level-loft')
  assert.deepEqual(checkedPaths(roomTab), ['/rooms/cozy-queen'])
  assert.deepEqual(checkedPaths({ templateVariants: false, paths: ['/a', '/b'], rows: [] }), ['/a', '/b'])
})

test('buildReport checks a template tab on its matched page and sends the other template pages to the shared-part check', async () => {
  const { buildReport } = await import('../../scripts/api/webflow/heading-check.mjs')
  const tab = { name: 'rooms', templateVariants: true, paths: ['/rooms/guild-city-level-loft', '/rooms/cozy-queen'], rows: [row({ kind: 'template', section: 'Hero', text: 'Cozy Queen', proposedTag: 'h1' })] }
  const ok = (elements) => ({ status: 'ok', elements })
  const pages = { '/': ok([]), '/rooms/guild-city-level-loft': ok([element(0, 'h1', 'Guild City Level Loft')]), '/rooms/cozy-queen': ok([element(0, 'h1', 'Cozy Queen')]) }
  const report = buildReport([tab], pages, ['/', ...tab.paths], { generated: 'now', source: 'test' })
  assert.deepEqual(report.tabs[0].pages.map((page) => [page.path, page.results[0].status]), [['/rooms/cozy-queen', 'passed']])
  assert.equal(report.sharedParts.checked, 1)
})

test('the check has no way to write to Webflow: no API host, token, write verb or webflow-write script in its sources', () => {
  // MUTATION: adding a Webflow API call, token read or POST/PUT/PATCH/DELETE to any heading-check source turns this red.
  const sources = ['scripts/api/webflow/heading-check.mjs', 'scripts/api/webflow/lib/heading-check.mjs', 'scripts/api/webflow/lib/heading-check-browser.mjs', 'scripts/api/webflow/lib/heading-check-report.mjs']
  for (const source of sources) {
    const text = fs.readFileSync(path.join(ROOT, source), 'utf8')
    assert.doesNotMatch(text, /api\.webflow\.com|WEBFLOW_API_TOKEN|process\.env|method:\s*['"](POST|PUT|PATCH|DELETE)/i, source)
  }
})

test('end to end on saved pages: rows pass, fail and are not found, uncovered headings are listed, shared parts are diffed', async (context) => {
  const { main } = await import('../../scripts/api/webflow/heading-check.mjs')
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'heading-check-'))
  let report
  try {
    report = await main(['--fixtures', path.join(FIXTURES, 'pages'), '--sheets', path.join(FIXTURES, 'sheets'), '--out', path.join(out, 'report.md')])
  } catch (error) {
    if (/Executable doesn't exist|browserType\.launch/.test(String(error.message))) return context.skip('chromium not installed')
    throw error
  }
  const home = report.tabs[0].pages[0]
  assert.deepEqual(home.results.map((result) => result.status), ['passed', 'passed', 'passed', 'failed', 'passed', 'failed', 'not-found', 'not-found'])
  assert.deepEqual(home.counts, { h1: { proposed: 1, found: 1 }, h2: { proposed: 3, found: 4 }, h3: { proposed: 1, found: 2 } })
  assert.deepEqual(home.uncovered.map((entry) => entry.text), ['Stay in the loop', 'Experience'])
  assert.deepEqual(report.sharedParts.differing.map((entry) => entry.path), ['/about'])
  assert.match(fs.readFileSync(path.join(out, 'report.md'), 'utf8'), /\/about/)
})
