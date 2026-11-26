import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extract, familyOf, linksOf, summarise } from '../../scripts/api/webflow/where-used.mjs'

test('families and attributes come from class and data- tokens', () => {
  const html = '<section class="section_venue-card"><figure data-video-link="" data-w-id="x" class="venue-card_figure u-image w-inline-block"></figure></section>'
  const { families, attributes } = extract(html)
  assert.deepEqual([...families], ['venue-card'])
  assert.deepEqual([...attributes], ['data-video-link'])
  assert.equal(familyOf('w-dyn-item'), null)
})

test('links stay on the site and skip assets and anchors', () => {
  const html = '<a href="/dining/">x</a><a href="https://other.com/a">x</a><a href="/file.pdf">x</a><a href="#top">x</a><a href="/rooms?x=1#y">x</a>'
  assert.deepEqual([...linksOf(html, 'https://site.io')].sort(), ['/', '/dining', '/rooms'])
})

test('CMS item pages collapse under their template', () => {
  const all = ['/', '/dining', '/dining/zuma', '/dining/bar']
  assert.equal(summarise(['/dining/zuma', '/dining/bar', '/'], all), '/, /dining/* (2)')
  assert.equal(summarise(all, all), 'all 4 pages')
})
