import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { DEFAULT_CONFIG, applyPageOverrides, computeBands, foldThinCrops, isGridContinuation, kebab, pageItems, resolveConfig } from '../../scripts/api/figma/lib/bands.mjs'
import { createNavMatcher } from '../../scripts/api/figma/lib/spec.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, '../..')
const file = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(here, 'fixtures/file-depth4.json.gz'))).toString('utf8'))
const isNav = createNavMatcher(file)

const findNode = (node, id) => {
  if (node.id === id) return node
  for (const child of node.children || []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

// Structural page discovery per KTD8: the 1600px frame of 3000px or more in each SECTION.
const pageFrames = () => {
  const canvas = file.document.children[0]
  const frames = []
  for (const section of canvas.children) {
    if (section.type !== 'SECTION') continue
    for (const child of section.children || []) {
      const box = child.absoluteBoundingBox
      if (child.type === 'FRAME' && box.width === 1600 && box.height >= 3000) frames.push(child)
    }
  }
  return frames
}

const home = findNode(file.document, '433:559')
const homeBands = computeBands(home, {}, { isManualOverlay: isNav })
const bandOf = (bands, id) => bands.find((band) => band.nodeIds.includes(id))

// A copy of the Home frame holding only the given real children, moved to new y positions.
const frameWith = (placements) => {
  const frameBox = home.absoluteBoundingBox
  const children = placements.map(({ id, y }) => {
    const node = structuredClone(findNode(home, id))
    node.absoluteBoundingBox = { ...node.absoluteBoundingBox, y: frameBox.y + y }
    return node
  })
  return { ...home, children }
}

test('figma/slicer.config.json matches the built-in defaults', () => {
  const config = JSON.parse(fs.readFileSync(path.join(repoRoot, 'figma/slicer.config.json'), 'utf8'))
  assert.deepEqual(config, JSON.parse(JSON.stringify(DEFAULT_CONFIG)))
})

test('Home hero band ends near 900px and holds the nav instance', () => {
  const hero = homeBands[0]
  assert.equal(hero.y0, 0)
  assert.ok(hero.y1 >= 880 && hero.y1 <= 950, `hero ends at ${hero.y1}`)
  assert.ok(hero.nodeIds.includes('433:570'), 'Rectangle 1 in hero')
  assert.ok(hero.nodeIds.includes('433:903'), 'nav instance in hero')
  assert.equal(hero.slug, 'the-bold-handsome-heart-of-san')
  assert.equal(bandOf(homeBands, '433:4759').index, 2, 'content at 1129 starts band 2')
})

test('the five 988px Home cards become five bands', () => {
  const cards = ['433:5754', '433:5769', '433:5787', '433:5796', '433:5804']
  const bands = cards.map((id) => bandOf(homeBands, id))
  assert.equal(new Set(bands.map((band) => band.index)).size, 5)
  for (const band of bands) {
    assert.equal(band.nodeIds.length, 1)
    assert.equal(Math.round(band.y1 - band.y0), 988)
  }
  assert.notEqual(bandOf(homeBands, '433:5753').index, bands[0].index, 'Vector 33 above the cards stays separate')
})

test('hidden Tribute 1 never appears in any band on any page', () => {
  for (const frame of pageFrames()) {
    for (const band of computeBands(frame, {}, { isManualOverlay: isNav })) {
      assert.ok(!band.nodeIds.includes('433:885'))
      assert.ok(!band.nodeIds.includes('250:2077'))
      assert.ok(!(band.backgroundIds || []).includes('433:885'))
    }
  }
})

test('overlapping groups merge into one band', () => {
  const band = bandOf(homeBands, '433:5740')
  assert.ok(band.nodeIds.includes('433:5743'), 'Rectangle 566 and the overlapping Rectangle 567 share a band')
  assert.ok(band.nodeIds.includes('433:5742'))
})

test('a 40px gap merges and a 300px gap splits', () => {
  // Two real blocks taller than minBandHeight: Group 270989565 (254px) and the 292px heading.
  const group = findNode(home, '433:4759')
  const height = group.absoluteBoundingBox.height
  const near = computeBands(frameWith([{ id: '433:4759', y: 1000 }, { id: '433:787', y: 1000 + height + 40 }]))
  assert.equal(near.length, 1)
  const far = computeBands(frameWith([{ id: '433:4759', y: 1000 }, { id: '433:787', y: 1000 + height + 300 }]))
  assert.equal(far.length, 2)
  assert.deepEqual(far.map((band) => band.nodeIds), [['433:4759'], ['433:787']])
})

test('every page yields ordered bands whose crops tile the frame', () => {
  const frames = pageFrames()
  assert.equal(frames.length, 24)
  for (const frame of frames) {
    const bands = computeBands(frame, {}, { isManualOverlay: isNav })
    assert.ok(bands.length >= 1, frame.name)
    assert.equal(bands[0].cropY0, 0)
    assert.equal(bands.at(-1).cropY1, frame.absoluteBoundingBox.height)
    bands.forEach((band, position) => {
      assert.equal(band.index, position + 1)
      if (position) assert.equal(band.cropY0, bands[position - 1].cropY1)
      assert.ok(band.slug.length > 0)
    })
  }
})

test('banding is deterministic', () => {
  assert.deepEqual(computeBands(home, {}, { isManualOverlay: isNav }), homeBands)
})

test('kebab keeps at most six words and drops punctuation', () => {
  assert.equal(kebab('A century of stories meets\na new hospitality'), 'a-century-of-stories-meets-a')
  assert.equal(kebab('West Coast Hospitality\nsince 1924'), 'west-coast-hospitality-since-1924')
  assert.equal(kebab('it\u2019s here'), 'its-here')
})

// Real frames from figma/raw/file.json.gz, pruned to geometry, text and visibility.
const loadFrame = (name) => JSON.parse(fs.readFileSync(path.join(here, `fixtures/slicer-${name}.json`), 'utf8')).frame
const homeTail = loadFrame('home-tail')
const gallery = loadFrame('gallery-frame')
const legal = loadFrame('legal-frame')
const navless = createNavMatcher({})
const bandsOf = (frame, options = {}) => computeBands(frame, {}, { isManualOverlay: navless, ...options })
const slugs = (bands) => bands.map((band) => band.slug)
const bandAt = (bands, y) => bands.find((band) => band.y0 <= y && band.y1 > y)

test('splitBeforeText: offers plus FAQ frame and CTA plus footer group each split in two', () => {
  const bands = bandsOf(homeTail)
  assert.deepEqual(slugs(bands), ['meetings-events', 'offers-packages', 'faqs', 'book-your-escape', 'the-hotel'])
  const [, offers, faqs, cta, footer] = bands
  // One top-level frame (487:2077) cut above the FAQS eyebrow: the frame
  // becomes a background of both pieces and its children are shared out.
  assert.equal(offers.cropY1, faqs.cropY0)
  assert.ok(offers.cropY1 < 18968 && offers.cropY1 > 18694, `FAQ cut at ${offers.cropY1}`)
  assert.ok(offers.backgroundIds.includes('487:2077') && faqs.backgroundIds.includes('487:2077'))
  // The CTA group splits at the topmost footer column header (The Hotel at 21147),
  // not at Book your escape, which already opens its band.
  assert.ok(cta.cropY1 > 20738 && cta.cropY1 < 21147, `footer cut at ${cta.cropY1}`)
  assert.equal(cta.cropY0, 19969, 'CTA crop keeps the group top edge')
  assert.equal(footer.cropY1, 21647)
  assert.ok(footer.nodeIds.length > 0 && cta.nodeIds.length > 0)
})

test('splitBeforeText: a section-start text at a full-width layer edge cuts on that edge (gallery offers)', () => {
  const bands = bandsOf(gallery)
  assert.deepEqual(slugs(bands), ['gallery', 'offers-packages', 'more-of-the-guild', 'faqs', 'book-your-escape', 'the-hotel'])
  assert.equal(bandAt(bands, 1842).slug, 'offers-packages')
  assert.ok(bands[0].cropY1 >= 1776 && bands[0].cropY1 <= 1800, `cut between grid and offers at ${bands[0].cropY1}`)
})

test('splitBeforeText can be turned off from config', () => {
  const plain = computeBands(homeTail, { splitBeforeText: { patterns: [] } }, { isManualOverlay: navless })
  assert.deepEqual(slugs(plain), ['meetings-events', 'offers-packages', 'book-your-escape'])
})

test('mergeSplitGrids: a gallery cut across two bands becomes one band (legal corporate gallery)', () => {
  const bands = bandsOf(legal)
  const galleryBand = bandAt(bands, 15200)
  assert.equal(galleryBand.slug, 'corporate-gallery')
  assert.ok(galleryBand.nodeIds.includes('359:1526'), 'Rectangle 504, tiles 1 to 3')
  assert.ok(galleryBand.nodeIds.includes('359:1527'), 'Rectangle 561, tile 4')
  assert.ok(galleryBand.nodeIds.includes('359:1536'), 'tile 4 caption')
  const unmerged = computeBands(legal, { mergeSplitGrids: { enabled: false } }, { isManualOverlay: navless })
  assert.notEqual(bandAt(unmerged, 15200).index, bandAt(unmerged, 17100).index)
})

test('mergeSplitGrids never merges single repeated cards or a band holding a section-start text', () => {
  const bands = bandsOf(legal)
  // Four 988px venue cards stay four bands.
  for (const y of [7400, 8500, 9500, 10500]) assert.equal(bandAt(bands, y).nodeIds.length, 1, `card at ${y}`)
  assert.equal(new Set([7400, 8500, 9500, 10500].map((y) => bandAt(bands, y).index)).size, 4)
  // Gallery hero rectangle (1600x900) and the offers group (1601x900) match in
  // size, but the offers band opens with OFFERS & PACKAGES.
  const config = resolveConfig()
  const items = pageItems(gallery, config).items
  const first = { items: items.filter((item) => item.y1 <= 1776), cutBefore: null }
  const offers = { items: items.filter((item) => item.id === '477:819'), cutBefore: null }
  assert.equal(isGridContinuation(first, offers, config), false)
})

test('page overrides: splitAt cuts a band and mergeRanges joins bands (legal sticky split section)', () => {
  const auto = bandsOf(legal)
  assert.equal(bandAt(auto, 2900).index, bandAt(auto, 4000).index, 'dark grid and sticky section share a band before the override')
  const bands = bandsOf(legal, { pageOverrides: { splitAt: [3930] } })
  const dark = bandAt(bands, 2900)
  const sticky = bandAt(bands, 4000)
  assert.notEqual(dark.index, sticky.index)
  assert.equal(dark.cropY1, 3930)
  assert.equal(sticky.cropY0, 3930)
  assert.equal(sticky.slug, 'designed-for-focused-work-confidential-strategy')
  assert.ok(sticky.y1 >= 7199, 'sticky section runs through all four panels')

  const merged = bandsOf(legal, { pageOverrides: { mergeRanges: [[7300, 9500]] } })
  assert.equal(bandAt(merged, 7400).index, bandAt(merged, 9000).index)
  assert.equal(merged.length, auto.length - 1)
})

test('page overrides: splitAt in a gap between bands moves the crop line only', () => {
  const config = resolveConfig()
  const bands = [
    { y0: 0, y1: 900, items: [], extraBackgrounds: [], cutBefore: null, cutAfter: null },
    { y0: 1142, y1: 1580, items: [], extraBackgrounds: [], cutBefore: null, cutAfter: null }
  ]
  const result = applyPageOverrides(bands, { splitAt: [950] }, legal.absoluteBoundingBox, config)
  assert.equal(result.length, 2)
  assert.equal(result[0].cutAfter, 950)
  assert.equal(result[1].cutBefore, 950)
})

test('no crop is shorter than minCropHeight', () => {
  for (const frame of [homeTail, gallery, legal]) {
    for (const band of bandsOf(frame)) assert.ok(band.cropY1 - band.cropY0 >= DEFAULT_CONFIG.minCropHeight, `${frame.name} ${band.slug}`)
  }
  // A 40px crop (real legal items, explicit cut lines) folds into its nearer neighbour.
  const config = resolveConfig()
  const items = pageItems(legal, config).items
  const pick = (id) => items.find((item) => item.id === id)
  const band = (item, cutBefore, cutAfter) => ({ y0: item.y0, y1: item.y1, items: [item], extraBackgrounds: [], cutBefore, cutAfter })
  const hero = pick('318:837')
  const title = pick('318:842')
  const intro = pick('359:1568')
  const folded = foldThinCrops([band(hero, null, 730), band(title, 730, 770), band(intro, 770, null)], legal.absoluteBoundingBox.height, config)
  assert.equal(folded.length, 2)
  assert.deepEqual(folded[0].items.map((item) => item.id), ['318:837', '318:842'])
})
