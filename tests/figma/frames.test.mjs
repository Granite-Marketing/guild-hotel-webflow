import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

import {
  brandGroups,
  bucketByTier,
  discoverFrames,
  idSafe,
  pickScale,
  slugify
} from '../../scripts/api/figma/lib/frames.mjs'

const fixturePath = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures', 'file-depth4.json.gz')
const fileJson = JSON.parse(gunzipSync(readFileSync(fixturePath)).toString('utf-8'))

test('structural discovery finds 24 page frames', () => {
  const { frames } = discoverFrames(fileJson)
  const pages = frames.filter(f => f.kind === 'page')
  assert.equal(pages.length, 24)
  assert.ok(pages.every(p => p.width === 1600 && p.height >= 3000))
  const home = pages.find(p => p.id === '433:559')
  assert.equal(home.pageSlug, 'home')
  assert.equal(home.sectionName, 'HOME')
  assert.equal(pages.find(p => p.id === '266:2135').pageSlug, 'dining-zuma')
})

test('Legal, All Rooms, window-1 and overlays are side frames', () => {
  const { frames } = discoverFrames(fileJson)
  const byName = name => frames.find(f => f.name === name)
  for (const name of ['Legal', 'All Rooms', 'window-1', 'menu-1', 'full-2', 'ARTS-MODAL', 'Corporate-Overlay', 'NEIGHBORHOOD-OVERLAY']) {
    assert.equal(byName(name)?.kind, 'side', name)
  }
  assert.equal(byName('window-1').pageSlug, 'nav-elements')
})

test('animation sections, the nav component set and the brand frame are tagged', () => {
  const { frames } = discoverFrames(fileJson)
  assert.equal(frames.find(f => f.id === '255:203').kind, 'animation')
  const nav = frames.find(f => f.id === '236:8312')
  assert.equal(nav.kind, 'nav')
  assert.equal(nav.pageSlug, 'nav-elements')
  const brand = frames.find(f => f.id === '2154:2273')
  assert.equal(brand.kind, 'brand')
  assert.equal(brand.pageSlug, 'brand')
  assert.equal(brand.sectionId, null)
})

test('stray groups are ignored', () => {
  const { frames } = discoverFrames(fileJson)
  for (const id of ['2001:1524', '2003:1971', '2005:2016', '477:1391']) {
    assert.ok(!frames.some(f => f.id === id), id)
  }
})

test('scale tiers: 1600x900 gets 2, the tallest page drops to 0.75 or lower', () => {
  assert.equal(pickScale(1600, 900), 2)
  assert.ok(pickScale(1600, 24866) <= 0.75)
  assert.ok(1600 * 24866 * pickScale(1600, 24866) ** 2 <= 25e6)
  assert.equal(pickScale(100000, 100000), 0.5)
})

test('real frame sizes resolve to 4 or fewer tiers, each frame within the cap', () => {
  const { frames } = discoverFrames(fileJson)
  const tiers = bucketByTier(frames)
  assert.ok(tiers.length <= 4)
  assert.ok(tiers.every(t => [2, 1, 0.75, 0.5].includes(t.scale)))
  const rendered = tiers.flatMap(t => t.frames)
  assert.equal(rendered.length, frames.filter(f => f.kind !== 'brand').length)
  assert.ok(rendered.every(f => f.width * f.height * f.scale ** 2 <= 25e6))
})

test('brand groups map to kebab SVG paths', () => {
  const groups = brandGroups(fileJson)
  assert.equal(groups.length, 9)
  assert.ok(groups.some(g => g.file === 'figma/brand/guildlogo.svg'))
})

test('slug and id helpers', () => {
  assert.equal(slugify('DINING-ZUMA'), 'dining-zuma')
  assert.equal(slugify('WELLNESS_COLLECTION  x'), 'wellness-collection-x')
  assert.equal(idSafe('433:559'), '433-559')
})
