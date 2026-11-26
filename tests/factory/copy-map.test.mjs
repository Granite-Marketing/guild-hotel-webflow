import test from 'node:test'
import assert from 'node:assert/strict'
import { parseDoc } from '../../scripts/api/webflow/lib/copy-map.mjs'

const comment = '<!-- source: https://example.test/doc exported 2026-11-26 -->\n'

test('parseDoc keeps the first version and records every other version on that entry', () => {
  const { entries } = parseDoc(comment + [
    '**A Century of Stories Meets a New Hospitality**  ',
    '**or**  ',
    '**A Spirited History Meets a New Hospitality**',
    '',
    'Behind this facade is a century of mischief.',
    'Or',
    'Behind this facade is a hundred years of mischief.',
    'or',
    'A third version of the paragraph.',
  ].join('\n'))
  assert.equal(entries.length, 2)
  assert.equal(entries[0].text, 'A Century of Stories Meets a New Hospitality')
  assert.deepEqual(entries[0].alternates.map((alternate) => [alternate.line, alternate.text]), [[4, 'A Spirited History Meets a New Hospitality']])
  assert.equal(entries[1].text, 'Behind this facade is a century of mischief.')
  assert.deepEqual(entries[1].alternates.map((alternate) => alternate.text), ['Behind this facade is a hundred years of mischief.', 'A third version of the paragraph.'])
  assert.equal(entries[1].line, 6)
})

test('parseDoc drops writer notes from the copy and records them as notes', () => {
  const { entries, notes } = parseDoc(comment + [
    '**COZY QUEEN**  ',
    'Perfectly Intimate',
    '',
    '**Room Description**  ',
    'Snuggle up in our most intimate room.',
    '',
    '**(stats)**  ',
    '1 Queen Bed  ',
    '',
    'Cutline on photo  ',
    'After a night out, the Cozy Queen offers privacy.',
    '',
    '**(Next text block)**  ',
    'The Cozy Queen is an intimate room.',
    '',
    '(**Next block)**  ',
    'Accessible rooms have lowered features.',
    '',
    '**As instructed, stopping here on this page.**',
    '![][image1]',
    '[imageN]: data:image-omitted',
  ].join('\n'))
  assert.deepEqual(entries.map((entry) => entry.text), [
    'COZY QUEEN', 'Perfectly Intimate', 'Snuggle up in our most intimate room.', '1 Queen Bed',
    'After a night out, the Cozy Queen offers privacy.', 'The Cozy Queen is an intimate room.', 'Accessible rooms have lowered features.',
  ])
  assert.deepEqual(notes.map((note) => note.text), [
    'Room Description', '(stats)', 'Cutline on photo', '(Next text block)', '(Next block)', 'As instructed, stopping here on this page.',
  ])
  assert.ok(notes.every((note) => note.line > 0 && note.kind))
  assert.equal(entries.find((entry) => entry.text === '1 Queen Bed').notes[0].text, '(stats)')
})

test('parseDoc marks the handwriting heading as the script heading and strips the note from its text', () => {
  const { entries, notes } = parseDoc(comment + [
    'The Art of Solo Travel  (handwriting)  ',
    '',
    '**Upgrade Your Offsite**   (handwriting) ',
    '',
    '**Plain heading**',
  ].join('\n'))
  assert.deepEqual(entries.map((entry) => [entry.text, entry.scriptHeading]), [['The Art of Solo Travel', true], ['Upgrade Your Offsite', true], ['Plain heading', false]])
  assert.equal(entries[1].bold, true)
  assert.equal(notes.filter((note) => note.kind === 'handwriting').length, 2)
})

test('parseDoc keeps the doc heading case and unescapes markdown', () => {
  const { entries } = parseDoc(comment + '**ART & STORIES**  \n**The Works** 12\\* \\| 14\n')
  assert.equal(entries[0].text, 'ART & STORIES')
  assert.equal(entries[1].text, 'The Works 12* | 14')
})

test('parseDoc joins a heading that wraps onto a second bold line', () => {
  const { entries } = parseDoc(comment + [
    '**A Collector’s Eye**   ',
    '**on the City**',
    '',
    '**WE’RE THE TALK**  ',
    '**OF THE TOWN**',
    '',
    '**1924**  ',
    '**A Landmark YMCA is Born**  ',
  ].join('\n'))
  assert.deepEqual(entries.map((entry) => entry.text), ['A Collector’s Eye on the City', 'WE’RE THE TALK OF THE TOWN', '1924', 'A Landmark YMCA is Born'])
  assert.deepEqual(entries[0].joined.map((part) => [part.line, part.text]), [[3, 'on the City']])
})

test('parseDoc joins a wrapped plain heading and its wrapped second version but keeps list lines apart', () => {
  const { entries } = parseDoc(comment + [
    'Spaces for celebration  ', 'and collaboration   ', '**or**  ', 'Spaces for small teams  ', 'or big deals', '',
    'le labo santal 33 bath amenities  ', 'iron & board (steamer upon request)  ', 'curated local art',
  ].join('\n'))
  assert.equal(entries[0].text, 'Spaces for celebration and collaboration')
  assert.deepEqual(entries[0].alternates.map((alternate) => alternate.text), ['Spaces for small teams or big deals'])
  assert.deepEqual(entries.slice(1).map((entry) => entry.text), ['le labo santal 33 bath amenities', 'iron & board (steamer upon request)', 'curated local art'])
})

test('parseDoc can fold a heading repeated later with its own body into a second version of the first block', () => {
  const markdown = comment + ['**A LANDMARK REIMAGINED**  ', 'INC brought depth.', '', '**A LANDMARK REIMAGINED**  ', 'INC interpreted history.', ''].join('\n')
  assert.equal(parseDoc(markdown).entries.length, 4)
  const { entries } = parseDoc(markdown, { foldRepeatedBlocks: true })
  assert.deepEqual(entries.map((entry) => entry.text), ['A LANDMARK REIMAGINED', 'INC brought depth.'])
  assert.deepEqual(entries[0].alternates.map((alternate) => [alternate.line, alternate.implicit]), [[5, true]])
  assert.deepEqual(entries[1].alternates.map((alternate) => alternate.text), ['INC interpreted history.'])
})

test('parseDoc treats near-identical consecutive lines as an implicit second version to confirm', () => {
  const { entries } = parseDoc(comment + [
    '**Rooms & Suites**  ',
    'Generous comfort and stylish details.   ',
    'Generous comfort and luxe, stylish details.   ',
    'Generous comfort and chic in-room details',
  ].join('\n'))
  assert.equal(entries.length, 2)
  assert.deepEqual(entries[1].alternates.map((alternate) => [alternate.text, alternate.implicit]), [
    ['Generous comfort and luxe, stylish details.', true],
    ['Generous comfort and chic in-room details', true],
  ])
})

// ---------------------------------------------------------------- matching
import { buildCopyMap } from '../../scripts/api/webflow/lib/copy-map.mjs'

const slot = (overrides) => ({ kind: 'component-prop', role: 'heading', tag: 'h2', order: 0, text: '', component: 'Hero', property: 'Content/Heading', ...overrides })

const homeModel = () => ({
  pages: [{ path: '/', kind: 'static', slots: [
    slot({ key: 'hero-heading', order: 0, tag: 'h1', text: 'the bold, handsome heart of san diego', propertyId: 'p-heading', instance: 'i-hero' }),
    slot({ key: 'hero-text', order: 1, role: 'body', tag: 'p', text: 'Suspendisse viverra interdum elit, vitae vestibulum.', property: 'Content/Text', propertyId: 'p-text', instance: 'i-hero' }),
    slot({ key: 'hero-button', order: 2, role: 'button', tag: 'a', text: 'Book Your Stay', property: 'Button/Button Text', propertyId: 'p-button', instance: 'i-hero' }),
    slot({ key: 'script-heading', order: 3, component: 'script-intro-centered', property: 'Content/heading', text: 'a century of stories meets a new hospitality', propertyId: 'p-script', instance: 'i-script' }),
    slot({ key: 'leftover', order: 4, kind: 'page-text', component: undefined, property: undefined, role: 'body', tag: 'p', text: 'Staging only placeholder paragraph.', nodeId: 'n-leftover' }),
    slot({ key: 'footer-heading', order: 5, kind: 'component-fixed', component: 'Footer Links', property: undefined, text: 'the hotel', nodeId: 'n-footer' }),
  ] }],
  components: [{ name: 'Footer Links', pages: { '/': 1, '/meetings': 1 } }],
  collections: {},
})

const homeDoc = [
  '**The Bold, Handsome Heart of San Diego**',
  'The Guild is quintessential San Diego.',
  '**Book Your Stay**',
  '',
  '**A Century Of Stories Meets A New Hospitality**',
  '**or**',
  '**A Spirited History Meets A New Hospitality**',
  '',
  '**Meetings & Events**',
].join('\n')

const buildHome = () => buildCopyMap({
  docs: [{ name: 'Guild-Home', markdown: '<!-- x -->\n' + homeDoc }],
  model: homeModel(),
  registry: { 'Guild-Home': { type: 'page', path: '/' } },
  held: [],
})

const rowFor = (map, line) => map.rows.find((row) => row.doc === 'Guild-Home' && row.line === line)

test('a doc line becomes a row naming its page, doc line, target kind, identity, current and new text', () => {
  const row = rowFor(buildHome(), 2)
  assert.equal(row.page, '/')
  assert.equal(row.doc, 'Guild-Home')
  assert.equal(row.targetKind, 'component-prop')
  assert.equal(row.target.component, 'Hero')
  assert.equal(row.target.property, 'Content/Heading')
  assert.equal(row.target.propertyId, 'p-heading')
  assert.equal(row.target.instance, 'i-hero')
  assert.equal(row.currentText, 'the bold, handsome heart of san diego')
  assert.equal(row.newText, 'The Bold, Handsome Heart of San Diego')
  assert.equal(row.status, 'change')
  assert.equal(row.needsConfirm, false)
})

test('headings keep the doc case in the new text even when staging holds the lowercase text', () => {
  const row = rowFor(buildHome(), 6)
  assert.equal(row.newText, 'A Century Of Stories Meets A New Hospitality')
  assert.equal(row.target.propertyId, 'p-script')
})

test('text already on staging is marked same', () => {
  const row = rowFor(buildHome(), 4)
  assert.equal(row.status, 'same')
  assert.equal(row.targetKind, 'component-prop')
})

test('the first of two versions is the new text and the second gets its own row listed on the first', () => {
  const map = buildHome()
  const first = rowFor(map, 6)
  const second = rowFor(map, 8)
  assert.deepEqual(first.alternates.map((alternate) => alternate.text), ['A Spirited History Meets A New Hospitality'])
  assert.equal(second.status, 'second version listed')
  assert.equal(second.alternateOf, 6)
  assert.equal(second.newText, 'A Spirited History Meets A New Hospitality')
})

test('a doc line with no element left to hold it is listed as not on site, never forced onto a target', () => {
  const row = rowFor(buildHome(), 10)
  assert.equal(row.status, 'not on site')
  assert.equal(row.targetKind, 'not-on-site')
  assert.equal(row.currentText, null)
})

test('a position-only match with no text overlap is marked for a person to confirm', () => {
  const row = rowFor(buildHome(), 3)
  assert.equal(row.targetKind, 'component-prop')
  assert.equal(row.target.propertyId, 'p-text')
  assert.equal(row.needsConfirm, true)
  assert.match(row.confirmReasons.join(' '), /position/)
})

test('staging text on a mapped page with no doc line is listed as no copy yet, but shared site chrome is not', () => {
  const rows = buildHome().rows.filter((row) => row.status === 'no copy yet')
  assert.deepEqual(rows.map((row) => row.currentText), ['Staging only placeholder paragraph.'])
  assert.equal(rows[0].doc, null)
  assert.equal(rows[0].page, '/')
})

// ---------------------------------------------------------------- shared text, held pages, notes, conflicts
const sharedModel = () => ({
  pages: [
    { path: '/', kind: 'static', slots: [
      slot({ key: 'council', kind: 'component-fixed', component: 'Venue Card Fullbleed Left', property: undefined, role: 'heading', tag: 'div', order: 0, text: 'council boardroom', nodeId: 'n-council' }),
      slot({ key: 'own', kind: 'page-text', component: undefined, property: undefined, order: 1, text: 'only on home', nodeId: 'n-own' }),
    ] },
    { path: '/meetings', kind: 'static', slots: [] },
    { path: '/rooms/cozy-queen', kind: 'cms-sample', templatePath: '/rooms', slots: [] },
  ],
  components: [{ name: 'Venue Card Fullbleed Left', pages: { '/': 1, '/meetings': 1, '/rooms/cozy-queen': 2 } }],
  collections: {},
})

test('text fixed inside a component used on several pages is marked shared with every page it appears on', () => {
  const map = buildCopyMap({
    docs: [{ name: 'Guild-Home', markdown: '<!-- x -->\n**Council Boardroom Suite**\n\n**Only On Home**' }],
    model: sharedModel(),
    registry: { 'Guild-Home': { type: 'page', path: '/' } },
    held: [],
  })
  const fixed = map.rows.find((row) => row.line === 2)
  assert.equal(fixed.targetKind, 'component-fixed')
  assert.equal(fixed.shared, true)
  assert.deepEqual(fixed.sharedPages.sort(), ['/', '/meetings', '/rooms/*'])
  assert.equal(fixed.needsDecision, true)
  const own = map.rows.find((row) => row.line === 4)
  assert.equal(own.targetKind, 'page-text')
  assert.equal(own.shared, false)
  assert.deepEqual(own.sharedPages, [])
  // MUTATION: disable the component-fixed branch of sharedInfo (never read model.components, so shared stays false); this test must go red.
})

test('contact and the wellness sub-pages are listed as held', () => {
  const map = buildCopyMap({ docs: [], model: { pages: [], components: [], collections: {} }, registry: {} })
  const heldPages = map.rows.filter((row) => row.status === 'held').map((row) => row.page)
  assert.deepEqual(heldPages, ['/contact', '/wellness/in-room-wellness', '/wellness/fitness-centre', '/wellness/mindful-dining', '/wellness/wellness-events'])
  assert.ok(map.rows.every((row) => row.status !== 'held' || (row.newText === null && row.target === null)))
})

test('writer notes never become the new text of any row and are listed with their doc and line', () => {
  const markdown = '<!-- x -->\n**Hero Heading**\n**(stats)**\n1 Queen Bed\nCutline on photo\nAfter a night out.\n**As instructed, stopping here on this page.**'
  const map = buildCopyMap({
    docs: [{ name: 'Guild-Home', markdown }],
    model: homeModel(),
    registry: { 'Guild-Home': { type: 'page', path: '/' } },
    held: [],
  })
  const noteTexts = map.notes.map((note) => note.text)
  assert.deepEqual(noteTexts, ['(stats)', 'Cutline on photo', 'As instructed, stopping here on this page.'])
  assert.ok(map.notes.every((note) => note.doc === 'Guild-Home' && note.line > 0))
  const newTexts = map.rows.map((row) => row.newText)
  for (const text of noteTexts) assert.ok(!newTexts.includes(text), `note became copy: ${text}`)
  // MUTATION: classifyLine returns type 'copy' for bracketed notes and drops the cutline-label pattern, so notes become new text; this test must go red.
})

test('two docs that give different copy for the same element are flagged as a conflict, identical copy as a duplicate', () => {
  const model = homeModel()
  const map = buildCopyMap({
    docs: [
      { name: 'Guild-A', markdown: '<!-- x -->\n**First Heading**' },
      { name: 'Guild-B', markdown: '<!-- x -->\n**Second Heading**' },
      { name: 'Guild-C', markdown: '<!-- x -->\n**First Heading**' },
    ],
    model,
    registry: { 'Guild-A': { type: 'page', path: '/' }, 'Guild-B': { type: 'page', path: '/', reuseSlots: true }, 'Guild-C': { type: 'page', path: '/', reuseSlots: true } },
    held: [],
  })
  const [a, b, c] = ['Guild-A', 'Guild-B', 'Guild-C'].map((name) => map.rows.find((row) => row.doc === name))
  assert.equal(a.target.propertyId, b.target.propertyId)
  assert.deepEqual(a.conflictsWith.sort(), [b.id].sort())
  assert.equal(a.needsConfirm, true)
  assert.equal(c.duplicateOf, a.id)
})

// ---------------------------------------------------------------- rooms
const roomsModel = () => ({
  pages: [
    { path: '/rooms/cozy-queen', kind: 'cms-sample', templatePath: '/rooms', slots: [
      slot({ key: 'script', component: 'script-intro-centered', property: 'Content/heading', propertyId: 'p-room-script', instance: 'i-room-script', order: 0, text: 'A room for every stay' }),
      slot({ key: 'desc-h2', kind: 'page-text', component: undefined, property: undefined, order: 1, text: 'room description', nodeId: 'n-room-description' }),
      slot({ key: 'floorplan', kind: 'page-text', component: undefined, property: undefined, role: 'button', tag: 'a', order: 2, text: 'view floorplan', nodeId: 'n-floorplan' }),
      slot({ key: 'amenities-h2', kind: 'page-text', component: undefined, property: undefined, order: 3, text: 'in room amenities', nodeId: 'n-amenities' }),
      slot({ key: 'amenities-p', kind: 'page-text', component: undefined, property: undefined, role: 'body', tag: 'p', order: 4, text: 'Nullam ac ultricies tortor.', nodeId: 'n-amenities-p' }),
    ] },
  ],
  components: [],
  collections: {
    rooms: {
      name: 'Rooms',
      listingPaths: ['/rooms'],
      templatePath: '/rooms',
      fields: ['name', 'hero-intro', 'guests-label', 'size-label', 'room-description---text', 'room-description---details'],
      items: [
        { name: 'Cozy Queen', slug: 'cozy-queen', itemPath: '/rooms/cozy-queen', itemPathDerived: false },
        { name: 'Cozy King', slug: 'cozy-king', itemPath: '/rooms/cozy-king', itemPathDerived: true },
        { name: 'Placeholder Single 1', slug: 'placeholder-single-1', itemPath: '/rooms/placeholder-single-1', itemPathDerived: true },
      ],
    },
  },
})

const roomSection = (name, tagline, script, description, guests, size, cutline, details) => [
  `**${name.toUpperCase()}**  `, tagline, '', `${script}  (handwriting)`, '', '**Room Description**  ', `${name} Room`, '', description, '**View Floorplan** ', '',
  '**(stats)**  ', '1 Queen Bed  ', guests + '  ', size, '', 'Cutline on photo  ', cutline, '', '**(Next text block)**  ', details, '',
  '**In-Room Amenities**  ', 'The little things make all the difference.', '', 'le labo santal 33 bath amenities  ', 'laptop safe', '', '(**Next block)**  ', 'Accessible rooms have lowered features.', '',
].join('\n')

const roomsDoc = '<!-- x -->\n' + [
  roomSection('Cozy Queen', 'Perfectly Intimate', 'The Art of Solo Travel', 'Snuggle up in our most intimate room.', '2 Guests', '180sqft / 16sqm | 200sqft / 18sqm', 'After a night out.', 'The Cozy Queen is an intimate room with big ideas.'),
  roomSection('Cozy King', 'Intimate never felt so big', 'King-Sized Comfort', 'An upholstered King bed makes the world bigger.', '2 Guests', '206sqft / 19sqm', 'After a night out, a sanctuary.', 'The Cozy King thinks big.'),
  roomSection('Society King ADA', 'Accessibility Comes Home to Luxury', 'Effortless is Everything', 'Comfort meets convenience.', '2 Guests', '314 sqft | 340 sqft.', 'Exploring is easy.', 'Our ADA-compliant roll-under sinks.'),
].join('\n')

const buildRooms = () => buildCopyMap({
  docs: [{ name: 'Guild-Rooms-SubPages', markdown: roomsDoc }],
  model: roomsModel(),
  registry: { 'Guild-Rooms-SubPages': { type: 'rooms', collection: 'rooms', templatePage: '/rooms/cozy-queen' } },
  held: [],
})

const roomRow = (map, itemName, text) => map.rows.find((row) => row.cmsItem?.name === itemName && row.newText === text)

test('each doc room section maps to the room item of the same name and carries that item path and listing page', () => {
  const map = buildRooms()
  const tagline = roomRow(map, 'Cozy Queen', 'Perfectly Intimate')
  assert.equal(tagline.targetKind, 'cms-field')
  assert.equal(tagline.target.fieldSlug, 'hero-intro')
  assert.equal(tagline.cmsItem.collection, 'rooms')
  assert.equal(tagline.cmsItem.itemPath, '/rooms/cozy-queen')
  assert.deepEqual(tagline.cmsItem.listingPaths, ['/rooms'])
  assert.equal(tagline.page, '/rooms/cozy-queen')
  assert.equal(roomRow(map, 'Cozy Queen', 'Snuggle up in our most intimate room.').target.fieldSlug, 'room-description---text')
  assert.equal(roomRow(map, 'Cozy Queen', '2 Guests').target.fieldSlug, 'guests-label')
  assert.equal(roomRow(map, 'Cozy Queen', '180sqft / 16sqm | 200sqft / 18sqm').target.fieldSlug, 'size-label')
  assert.equal(roomRow(map, 'Cozy Queen', 'The Cozy Queen is an intimate room with big ideas.').target.fieldSlug, 'room-description---details')
  const king = roomRow(map, 'Cozy King', 'Intimate never felt so big')
  assert.equal(king.cmsItem.slug, 'cozy-king')
  assert.equal(king.cmsItem.itemPathDerived, true)
  assert.equal(map.rows.filter((row) => row.cmsItem?.name === 'Cozy Queen' && row.newText?.includes('King')).length, 0)
})

test('doc rooms with no item and items with no doc section are listed, and no room is created', () => {
  const map = buildRooms()
  assert.deepEqual(map.rooms.matched.map((pair) => [pair.docRoom, pair.item]), [['COZY QUEEN', 'Cozy Queen'], ['COZY KING', 'Cozy King']])
  assert.deepEqual(map.rooms.docRoomsWithoutItem.map((entry) => entry.docRoom), ['SOCIETY KING ADA'])
  assert.deepEqual(map.rooms.itemsWithoutDoc.map((entry) => entry.item), ['Placeholder Single 1'])
  const orphan = map.rows.filter((row) => row.doc === 'Guild-Rooms-SubPages' && row.newText === 'Accessibility Comes Home to Luxury')
  assert.equal(orphan[0].status, 'not on site')
  assert.equal(orphan[0].cmsItem, null)
  assert.match(orphan[0].reason, /no room item/)
  assert.ok(map.rows.every((row) => row.cmsItem?.name !== 'Society King ADA'))
})

test('room lines with no field to hold them are listed as not on site and the shared template lines are flagged', () => {
  const map = buildRooms()
  const cutline = roomRow(map, 'Cozy Queen', 'After a night out.')
  assert.equal(cutline.status, 'not on site')
  assert.equal(roomRow(map, 'Cozy Queen', '1 Queen Bed').status, 'not on site')
  assert.equal(roomRow(map, 'Cozy Queen', 'laptop safe').status, 'not on site')
  const script = map.rows.find((row) => row.newText === 'The Art of Solo Travel')
  assert.equal(script.targetKind, 'component-prop')
  assert.equal(script.shared, true)
  assert.deepEqual(script.sharedPages, ['/rooms/*'])
  assert.ok(script.conflictsWith.length > 0, 'two rooms write different script headings to the one template element')
  const floorplan = map.rows.find((row) => row.newText === 'View Floorplan' && row.target?.nodeId === 'n-floorplan')
  assert.equal(floorplan.shared, true)
  const orphanSlots = map.rows.filter((row) => row.status === 'no copy yet').map((row) => row.currentText)
  assert.ok(!orphanSlots.includes('A room for every stay'), 'a template slot a doc line took is not also listed as no copy yet')
})

// ---------------------------------------------------------------- dining venues, meeting venues, legal and corporate
const cmsModel = () => ({
  pages: [
    { path: '/dining/dining-zuma', kind: 'cms-sample', templatePath: '/dining', slots: [
      slot({ key: 'group', component: 'Image Trio Text', property: 'Header/Heading', propertyId: 'p-group', instance: 'i-group', order: 0, text: 'group dining & events' }),
    ] },
    { path: '/meetings', kind: 'static', slots: [
      slot({ key: 'modal-heading', component: 'Venue Detail Modal', property: 'Header/Heading', propertyId: 'p-modal-heading', instance: 'i-modal', order: 0, text: 'meetings and events at the guild' }),
      slot({ key: 'details', component: 'Venue Detail Modal', property: 'Body/Subheading', propertyId: 'p-details', instance: 'i-modal', order: 1, text: 'details' }),
      slot({ key: 'layout', component: 'Venue Detail Modal', property: 'Extras/Extras heading', propertyId: 'p-layout', instance: 'i-modal', order: 2, text: 'layout options' }),
    ] },
    { path: '/legal-corporate/corporate', kind: 'cms-sample', templatePath: '/legal-corporate', slots: [
      slot({ key: 'steps', component: 'Map Feature Image Bg', property: 'Content/Heading', propertyId: 'p-steps', instance: 'i-steps', order: 0, text: 'Steps from key legal addresses' }),
    ] },
  ],
  components: [],
  collections: {
    dining: {
      name: 'Dinings', listingPaths: ['/dining'], templatePath: '/dining',
      fields: ['name', 'hero-heading', 'hero-intro', 'intro---heading', 'intro---text', 'info---dress-code', 'explore---text', 'image-pair---text', 'home-card-tagline'],
      hints: { '/dining/dining-zuma': [{ tag: 'h1', text: 'zuma san diego' }] },
      items: [
        { name: 'Zuma San Diego', slug: 'dining-zuma', itemPath: '/dining/dining-zuma' },
        { name: 'Garden Terrace', slug: null, itemPath: null },
        { name: 'Solana Coffee', slug: null, itemPath: null },
      ],
    },
    'meeting-venues': {
      name: 'Meeting Venues', listingPaths: ['/meetings', '/legal-corporate/corporate'], templatePath: '/meeting-venues',
      fields: ['name', 'card---intro', 'pop-up---text', 'pop-up---layout-options'],
      items: [{ name: 'council boardroom', slug: null, itemPath: null }, { name: '1 america plaza', slug: null, itemPath: null }, { name: 'lobby terrace', slug: null, itemPath: null }],
    },
    'legal-corporate': {
      name: 'Legal Corporates', listingPaths: [], templatePath: '/legal-corporate',
      fields: ['name', 'hero-heading', 'hero-text', 'intro-heading', 'intro-text', 'focus-heading', 'focus-text'],
      hints: { '/legal-corporate/corporate': [{ tag: 'h1', text: 'retreat for corporate teams' }] },
      items: [{ name: 'Corporate', slug: 'corporate', itemPath: '/legal-corporate/corporate' }],
    },
  },
})

const cmsRegistry = {
  'Guild-Dining-Zuma': { type: 'cms-plan', plan: 'dining-venue', collection: 'dining', itemName: 'Zuma San Diego', templatePage: '/dining/dining-zuma' },
  'Guild-Dining-GardenTerrace': { type: 'cms-plan', plan: 'dining-venue', collection: 'dining', itemName: 'Garden Terrace', templatePage: '/dining/dining-zuma' },
  'Guild-Meeting-Collection': { type: 'page', path: '/meetings', cards: [{ collection: 'meeting-venues', field: 'card---intro' }] },
  'Guild-Corporate': { type: 'cms-plan', plan: 'legal-corporate', collection: 'legal-corporate', itemName: 'Corporate', templatePage: '/legal-corporate/corporate', cards: [{ collection: 'meeting-venues', field: 'card---intro' }] },
  'Guild-Meetings-Modals': { type: 'cms-plan', plan: 'meeting-modals', collection: 'meeting-venues', page: '/meetings', venues: ['Council Boardroom', 'Lobby Bar', '1 America Plaza'] },
}

const zumaDoc = '<!-- x -->\n' + [
  '**ZUMA SAN DIEGO**', '', 'Welcome to the deliciously glamorous energy of California’s first Zuma', '',
  '**CONTEMPORARY JAPANESE IZAKAYA**', '', 'Zuma is a feast for the senses.', '', 'Zuma has become a destination.', '',
  '**DRESS CODE**  ', 'You’ve been waiting to get dressed up.  ', 'or  ', 'San Diego’s a beach town.', '',
  '**EXPLORE THE SPACE**  ', 'Your arrival at Zuma is a one-of-a-kind taste of things to come.', '',
].join('\n')
const gardenDoc = '<!-- x -->\n' + [
  '**GARDEN TERRACE**  ', 'A leafy shelter for all-day alfresco dining. ', '', '**FRESH AIR MEETS INSPIRED FLAVOR**  ', 'The Garden Terrace brings the Lobby Bar menu to the courtyard.', '',
  '**About the Space**  ', 'Lush plantings make a calm retreat.', '', '**Group Dining & Events**   ', 'Bring friends and colleagues.', '',
].join('\n')

const buildCms = (docs) => buildCopyMap({ docs, model: cmsModel(), registry: cmsRegistry, held: [] })

test('each dining venue doc writes to its own dining item and the h1 hint decides name versus hero heading', () => {
  const map = buildCms([{ name: 'Guild-Dining-Zuma', markdown: zumaDoc }, { name: 'Guild-Dining-GardenTerrace', markdown: gardenDoc }])
  const zuma = (text) => map.rows.find((row) => row.doc === 'Guild-Dining-Zuma' && row.newText === text)
  const garden = (text) => map.rows.find((row) => row.doc === 'Guild-Dining-GardenTerrace' && row.newText === text)
  assert.equal(zuma('ZUMA SAN DIEGO').target.fieldSlug, 'hero-heading')
  assert.equal(zuma('ZUMA SAN DIEGO').currentText, 'zuma san diego')
  assert.equal(zuma('ZUMA SAN DIEGO').needsConfirm, false)
  assert.equal(zuma('ZUMA SAN DIEGO').page, '/dining/dining-zuma')
  assert.equal(zuma('Welcome to the deliciously glamorous energy of California’s first Zuma').target.fieldSlug, 'hero-intro')
  assert.equal(zuma('CONTEMPORARY JAPANESE IZAKAYA').target.fieldSlug, 'intro---heading')
  assert.equal(zuma('Zuma is a feast for the senses.\n\nZuma has become a destination.').target.fieldSlug, 'intro---text')
  assert.equal(zuma('You’ve been waiting to get dressed up.').target.fieldSlug, 'info---dress-code')
  assert.equal(zuma('San Diego’s a beach town.').status, 'second version listed')
  assert.equal(zuma('Your arrival at Zuma is a one-of-a-kind taste of things to come.').target.fieldSlug, 'explore---text')
  assert.equal(garden('GARDEN TERRACE').cmsItem.name, 'Garden Terrace')
  assert.equal(garden('GARDEN TERRACE').needsConfirm, true, 'no sample page for this item, so the heading field is a guess to confirm')
  assert.equal(garden('GARDEN TERRACE').page, '/dining/*')
  assert.deepEqual(garden('GARDEN TERRACE').cmsItem.listingPaths, ['/dining'])
  assert.equal(garden('Bring friends and colleagues.').target.fieldSlug, 'image-pair---text')
  const groupHeading = garden('Group Dining & Events')
  assert.equal(groupHeading.targetKind, 'component-prop')
  assert.equal(groupHeading.shared, true)
  assert.equal(map.rows.filter((row) => row.cmsItem?.name === 'Zuma San Diego' && row.doc === 'Guild-Dining-GardenTerrace').length, 0)
})

test('meeting venue cards map to the venue item by name, short names to confirm, and unknown venues are listed with hints', () => {
  const markdown = '<!-- x -->\nCOUNCIL BOARDROOM  \nImpeccably appointed space for intimate meetings\n\nONE AMERICA PLAZA  \nThe landmark next door offers polished spaces\n\nLOBBY BAR  \nAfter work, refined cocktails\n'
  const map = buildCms([{ name: 'Guild-Meeting-Collection', markdown }])
  const council = map.rows.find((row) => row.newText === 'Impeccably appointed space for intimate meetings')
  assert.equal(council.cmsItem.name, 'council boardroom')
  assert.equal(council.target.fieldSlug, 'card---intro')
  assert.equal(council.needsConfirm, false)
  assert.deepEqual(council.appearsOn, ['/meetings'])
  const plaza = map.rows.find((row) => row.newText === 'The landmark next door offers polished spaces')
  assert.equal(plaza.cmsItem.name, '1 america plaza')
  const lobbyBar = map.rows.find((row) => row.newText === 'LOBBY BAR')
  assert.equal(lobbyBar.status, 'not on site')
  assert.deepEqual(lobbyBar.possibleItems, ['lobby terrace'])
  assert.equal(lobbyBar.needsConfirm, true)
})

test('corporate doc fills its own legal-corporate item and conflicts with another doc over the same venue card', () => {
  const corporate = '<!-- x -->\n**Offsites for Corporate Teams**  \nInspiring spaces for productivity \n\n**Upgrade Your Offsite**   (handwriting) \n\nThe Guild has mastered the art.\nOr\nAfter hours, you’ll adjourn.\n\n**Council Boardroom**  \nRefined space for small boards\n\n**Steps From Downtown**  \nThe Guild offers privacy.\n'
  const meeting = '<!-- x -->\nCOUNCIL BOARDROOM  \nImpeccably appointed space for intimate meetings\n'
  const map = buildCms([{ name: 'Guild-Meeting-Collection', markdown: meeting }, { name: 'Guild-Corporate', markdown: corporate }])
  const byText = (text) => map.rows.find((row) => row.newText === text)
  assert.equal(byText('Offsites for Corporate Teams').target.fieldSlug, 'hero-heading')
  assert.equal(byText('Offsites for Corporate Teams').cmsItem.slug, 'corporate')
  assert.equal(byText('Offsites for Corporate Teams').page, '/legal-corporate/corporate')
  assert.equal(byText('Inspiring spaces for productivity').target.fieldSlug, 'hero-text')
  assert.equal(byText('Upgrade Your Offsite').target.fieldSlug, 'intro-heading')
  assert.equal(byText('Upgrade Your Offsite').scriptHeading, true)
  assert.equal(byText('The Guild has mastered the art.').target.fieldSlug, 'intro-text')
  assert.equal(byText('After hours, you’ll adjourn.').status, 'second version listed')
  const corporateCard = byText('Refined space for small boards')
  const meetingCard = byText('Impeccably appointed space for intimate meetings')
  assert.deepEqual(corporateCard.conflictsWith, [meetingCard.id])
  assert.equal(corporateCard.needsConfirm, true)
  const steps = byText('Steps From Downtown')
  assert.equal(steps.target.propertyId, 'p-steps')
  assert.equal(steps.shared, true)
})

test('meeting modal doc writes each venue body to that venue item and the repeated header once', () => {
  const header = ['**MEETINGS AND EVENTS AT THE GUILD**  ', 'Smarter meetings start here', '']
  const markdown = '<!-- x -->\n' + [
    '**(COUNCIL BOARDROOMS)**  ', '**GUILD MEETING MODALS**', '', ...header,
    '**COUNCIL BOARDROOM** ', '', '**DETAILS**  ', 'Council Boardrooms offer all the ingredients.', '', '**Features**  ', '510 SQ FT  ', 'Classroom: 21\\*  ', '',
    '**LOBBY BAR**  ', '**GUILD MEETING MODALS**', '', ...header,
    '**LOBBY BAR**  ', 'Comfortable space for casual gatherings', '', '**DETAILS**  ', 'The Lobby Bar is a hub for teams.', '',
  ].join('\n')
  const map = buildCms([{ name: 'Guild-Meetings-Modals', markdown }])
  const council = (text) => map.rows.find((row) => row.cmsItem?.name === 'council boardroom' && row.newText === text)
  assert.equal(council('Council Boardrooms offer all the ingredients.').target.fieldSlug, 'pop-up---text')
  assert.equal(council('510 SQ FT\nClassroom: 21*').target.fieldSlug, 'pop-up---layout-options')
  const lobby = map.rows.find((row) => row.newText === 'The Lobby Bar is a hub for teams.')
  assert.equal(lobby.status, 'not on site')
  assert.equal(lobby.cmsItem, null)
  const headers = map.rows.filter((row) => row.newText === 'MEETINGS AND EVENTS AT THE GUILD')
  assert.equal(headers.length, 2)
  assert.equal(headers[1].duplicateOf, headers[0].id)
  assert.ok(map.rows.every((row) => !/^\(?COUNCIL BOARDROOMS\)?$/.test(row.newText ?? '')))
})

// ---------------------------------------------------------------- the real committed docs and catalogue
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadCopyMapInputs } from '../../scripts/api/webflow/lib/copy-map-io.mjs'
import { REGISTRY } from '../../scripts/api/webflow/lib/copy-map-registry.mjs'

const contentDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../docs/specs/guild-content')

test('the real run covers all 20 docs, one row per copy line, with unique row ids and held pages listed', () => {
  const { docs, model } = loadCopyMapInputs(contentDir)
  assert.equal(docs.length, 20)
  assert.deepEqual(docs.map((doc) => doc.name).filter((name) => !REGISTRY[name]), [])
  const map = buildCopyMap({ docs, model, registry: REGISTRY })
  for (const doc of docs) assert.ok(map.rows.some((row) => row.doc === doc.name && row.line), `no rows for ${doc.name}`)
  const ids = map.rows.map((row) => row.id)
  assert.equal(new Set(ids).size, ids.length, 'row ids are unique')
  assert.equal(map.rows.filter((row) => row.status === 'held').length, 5)
  assert.ok(map.rows.every((row) => row.status !== 'change' || row.newText), 'a change row always has new text')
  assert.ok(map.rows.every((row) => !row.needsConfirm || row.confirmReasons.length), 'every row to confirm says why')
})

test('the real rooms doc matches 9 of its 14 rooms by name and lists the rest without creating any', () => {
  const { docs, model } = loadCopyMapInputs(contentDir)
  const map = buildCopyMap({ docs, model, registry: REGISTRY })
  assert.equal(map.rooms.matched.length + map.rooms.docRoomsWithoutItem.length, 14)
  assert.deepEqual(map.rooms.itemsWithoutDoc.map((entry) => entry.item).sort(), ['Guild City Level Loft', 'Placeholder Single 1', 'Placeholder Single 2'])
  assert.ok(map.rooms.docRoomsWithoutItem.some((entry) => /city level loft/i.test(entry.docRoom) && entry.possibleItems.includes('Guild City Level Loft')))
  const cozyQueen = map.rows.find((row) => row.cmsItem?.slug === 'cozy-queen' && row.target?.fieldSlug === 'hero-intro')
  assert.equal(cozyQueen.newText, 'Perfectly Intimate')
  assert.equal(cozyQueen.cmsItem.itemPath, '/rooms/cozy-queen')
})

test('the real run never lets a writer note become new text and keeps heading case', () => {
  const { docs, model } = loadCopyMapInputs(contentDir)
  const map = buildCopyMap({ docs, model, registry: REGISTRY })
  const newTexts = new Set(map.rows.map((row) => row.newText))
  for (const note of map.notes) if (note.kind !== 'handwriting') assert.ok(!newTexts.has(note.text), `${note.doc}:${note.line} ${note.text}`)
  assert.ok(map.notes.some((note) => note.text === '(stats)') && map.notes.some((note) => /stopping here/i.test(note.text)))
  const arts = map.rows.find((row) => row.doc === 'Guild-Arts' && row.line === 2)
  assert.equal(arts.newText, 'ART & STORIES')
  const home = map.rows.find((row) => row.doc === 'Guild-Homepage' && row.line === 2)
  assert.equal(home.newText, 'The Bold, Handsome Heart of San Diego')
  const script = map.rows.find((row) => row.doc === 'Guild-Homepage' && row.status === 'second version listed' && /Spirited/.test(row.newText))
  assert.equal(script.alternateOf, 7)
})
