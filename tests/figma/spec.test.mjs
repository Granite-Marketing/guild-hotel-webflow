import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'
import { computeBands } from '../../scripts/api/figma/lib/bands.mjs'
import { MANUAL_NAV_REASON, animationNote, buildSpec, createNavMatcher, toHex, trimTree, wholeFrameBand } from '../../scripts/api/figma/lib/spec.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
// Real Home frame (433:559) with file styles and components, copied from file-depth4.json.gz.
const fixture = JSON.parse(fs.readFileSync(path.join(here, 'fixtures/slicer-home-frame.json'), 'utf8'))
const file = { styles: fixture.styles, components: fixture.components, componentSets: fixture.componentSets }
const frame = fixture.frame
const isNav = createNavMatcher(file)
const bands = computeBands(frame, {}, { isManualOverlay: isNav })
const specs = bands.map((band) => buildSpec({ file, frame, band, pageSlug: 'home' }))

const depth4 = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(here, 'fixtures/file-depth4.json.gz'))).toString('utf8'))
const findNode = (node, id) => {
  if (node.id === id) return node
  for (const child of node.children || []) {
    const found = findNode(child, id)
    if (found) return found
  }
  return null
}

test('a text node carries its named style and raw values', () => {
  const hero = specs[0]
  const heading = hero.texts.find((text) => text.id === '433:571')
  assert.ok(heading, 'hero heading present')
  assert.equal(heading.characters, 'the bold, handsome heart of san diego')
  assert.equal(heading.styleName, 'H2-CAPS')
  assert.equal(heading.fontFamily, 'Sackers Heavy Gothic')
  assert.equal(heading.fontSize, 40)
  assert.equal(heading.fontWeight, 400)
  assert.equal(heading.lineHeightPx, 40)
  assert.equal(heading.letterSpacing, -2)
  assert.equal(heading.textAlignHorizontal, 'CENTER')
  assert.equal(heading.textCase, 'ORIGINAL')
  assert.equal(heading.fill, '#262118')
  assert.deepEqual(heading.bbox, { x: 350, y: 651, width: 900, height: 40 })

  const caps = specs.flatMap((spec) => spec.texts).find((text) => text.id === '433:5742')
  assert.equal(caps.styleName, 'H4-CAPS')
})

test('the nav instance is a manual overlay, not content', () => {
  const hero = specs[0]
  assert.deepEqual(hero.manualOverlays, [
    { nodeId: '433:903', name: 'guild-nav-full-dark', reason: MANUAL_NAV_REASON, bbox: { x: 40, y: 26, width: 1520, height: 56 } }
  ])
  assert.ok(!hero.texts.some((text) => text.id === '433:903'))
  assert.ok(!hero.images.some((image) => image.nodeId === '433:903'))
  assert.equal(hero.slug, 'the-bold-handsome-heart-of-san')
})

test('nav detection works from the component set and from the name', () => {
  const instance = frame.children.find((node) => node.id === '433:903')
  assert.equal(isNav(instance), true)
  assert.equal(createNavMatcher({}, { nav: { componentSetIds: [] } })(instance), true)
  assert.equal(isNav({ ...instance, name: 'renamed' }), true, 'componentId 236:8313 belongs to set 236:8312')
  assert.equal(isNav(frame.children.find((node) => node.id === '433:570')), false)
})

test('image fills and solid colours are collected', () => {
  const vectorSpec = specs.find((spec) => spec.nodes.some((node) => node.id === '433:5753'))
  const image = vectorSpec.images.find((entry) => entry.nodeId === '433:5753')
  assert.ok(image && image.imageRef, 'Vector 33 image ref')
  const hero = specs[0]
  assert.deepEqual(hero.colors.find((color) => color.hex === '#D9D9D9'), { hex: '#D9D9D9', opacity: 1, count: 1 })
})

test('hidden Tribute 1 never appears in any spec', () => {
  const serialised = JSON.stringify(specs)
  assert.ok(!serialised.includes('433:885'))
  assert.ok(!serialised.includes('Tribute 1'))
  assert.ok(!JSON.stringify(trimTree(frame, frame.absoluteBoundingBox.x, frame.absoluteBoundingBox.y, 3, isNav)).includes('433:885'))
})

test('spec geometry and shape', () => {
  const hero = specs[0]
  assert.equal(hero.pageSlug, 'home')
  assert.equal(hero.index, 1)
  assert.deepEqual(hero.bbox, { x: 0, y: 0, width: 1600, height: 900 })
  assert.deepEqual(hero.animationNotes, [])
  assert.deepEqual(hero.nodes.map((node) => node.id), bands[0].nodeIds)
  assert.equal(toHex({ r: 1, g: 1, b: 1 }), '#FFFFFF')
})

test('nested visible text is walked (side frame band over a real animation section)', () => {
  const section = findNode(depth4.document, '433:7368')
  const band = wholeFrameBand(section, 1)
  assert.equal(band.laneHint, 'manual')
  assert.equal(band.slug, 'home-animation-1')
  const spec = buildSpec({ file: depth4, frame: section, band, pageSlug: 'home' })
  const nested = spec.texts.find((text) => text.id === '433:7369')
  assert.ok(nested, 'nested text found')
  assert.equal(nested.textCase, 'LOWER')
  assert.equal(nested.fontSize, 16)
  const note = animationNote(section)
  assert.equal(note.name, 'Home-Animation-1')
  assert.ok(note.texts[0].startsWith('The initial smaller image enlarges on scroll'))
})
