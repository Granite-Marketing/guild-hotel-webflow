import { test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { cropRect, renderMapping } from '../../scripts/api/figma/slice-sections.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const script = path.resolve(here, '../../scripts/api/figma/slice-sections.mjs')
const HOME_SCALE = 0.25
const HOME_WIDTH = 1600
const HOME_HEIGHT = 21647

// Temp repo root: the real depth-4 file as the raw snapshot, a snapshot.json
// built from real frame ids, and a blank render of the Home frame's size.
const makeRoot = async ({ renderFactor = 1, overrides = null } = {}) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'slice-sections-'))
  fs.mkdirSync(path.join(root, 'figma/raw'), { recursive: true })
  fs.mkdirSync(path.join(root, 'figma/.cache/renders'), { recursive: true })
  fs.copyFileSync(path.join(here, 'fixtures/file-depth4.json.gz'), path.join(root, 'figma/raw/file.json.gz'))
  const render = (id) => `figma/.cache/renders/${id.replace(':', '-')}.png`
  const snapshot = {
    fileKey: 'fixture',
    version: 'fixture',
    lastModified: 'fixture',
    frames: [
      { id: '433:559', name: 'HOME', kind: 'page', sectionId: '433:558', sectionName: 'HOME', pageSlug: 'home', width: HOME_WIDTH, height: HOME_HEIGHT, scale: HOME_SCALE, render: render('433:559'), status: 'ok' },
      { id: '433:7368', name: 'Home-Animation-1', kind: 'animation', sectionId: '433:558', sectionName: 'HOME', pageSlug: 'home', width: 930, height: 610, scale: 1, render: render('433:7368'), status: 'ok' },
      { id: '433:7364', name: 'Home-Animation-2', kind: 'animation', sectionId: '433:558', sectionName: 'HOME', pageSlug: 'home', width: 930, height: 610, scale: 1, render: render('433:7364'), status: 'ok' },
      { id: '2034:2906', name: 'Corporate-Overlay', kind: 'side', sectionId: '2034:2489', sectionName: 'CORPORATE', pageSlug: 'corporate', width: 1600, height: 899, scale: 1, render: render('2034:2906'), status: 'failed' },
      { id: '236:8312', name: 'guild-nav-full-dark', kind: 'nav', sectionId: '255:206', sectionName: 'NAV-ELEMENTS', pageSlug: 'nav-elements', width: 1560, height: 606, scale: 1, render: render('236:8312'), status: 'ok' }
    ]
  }
  fs.writeFileSync(path.join(root, 'figma/snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`)
  await sharp({
    create: { width: Math.round(HOME_WIDTH * HOME_SCALE * renderFactor), height: Math.round(HOME_HEIGHT * HOME_SCALE * renderFactor), channels: 3, background: { r: 217, g: 217, b: 217 } }
  }).png().toFile(path.join(root, render('433:559')))
  if (overrides) fs.writeFileSync(path.join(root, 'figma/slicer.overrides.json'), `${JSON.stringify(overrides, null, 2)}\n`)
  return root
}

const hashTree = (dir) => {
  const result = {}
  const visit = (current) => {
    for (const entry of fs.readdirSync(current).sort()) {
      const full = path.join(current, entry)
      if (fs.statSync(full).isDirectory()) visit(full)
      else result[path.relative(dir, full)] = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex')
    }
  }
  if (fs.existsSync(dir)) visit(dir)
  return result
}

const outputs = (root) => ({ ...hashTree(path.join(root, 'figma/pages')), ...hashTree(path.join(root, 'figma/animations')) })

const run = (root, extra = []) => spawnSync(process.execPath, [script, '--root', root, ...extra], { encoding: 'utf8' })

test('slices the Home frame into cropped sections, deterministically', async () => {
  const root = await makeRoot()
  try {
    const first = run(root)
    assert.equal(first.status, 0, first.stderr)
    assert.match(first.stderr, /render failed for Corporate-Overlay/)
    const firstHashes = outputs(root)

    const sections = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home/sections.json'), 'utf8'))
    assert.equal(sections.sections.length, 17)
    assert.equal(sections.sections[0].dir, 'sections/01-the-bold-handsome-heart-of-san')

    // Each crop matches its band at the render's true scale, clamped to the image.
    const imageHeight = Math.round(HOME_HEIGHT * HOME_SCALE)
    const trueScale = imageHeight / HOME_HEIGHT
    for (const section of sections.sections) {
      const meta = await sharp(path.join(root, 'figma/pages/home', section.crop)).metadata()
      assert.equal(meta.format, 'webp')
      assert.equal(meta.width, HOME_WIDTH * HOME_SCALE)
      const top = Math.floor(section.cropY0 * trueScale)
      const bottom = Math.min(imageHeight, Math.ceil(section.cropY1 * trueScale))
      assert.equal(meta.height, bottom - top, section.dir)
      assert.ok(meta.height >= 80 * trueScale, `${section.dir} is not near-empty`)
    }

    const heroSpec = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home/sections/01-the-bold-handsome-heart-of-san/spec.json'), 'utf8'))
    assert.equal(heroSpec.texts[0].styleName, 'H2-CAPS')
    assert.equal(heroSpec.manualOverlays[0].nodeId, '433:903')

    // Animation notes reach page.json, the markdown file, and the section they sit beside.
    const page = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home/page.json'), 'utf8'))
    assert.deepEqual(page.animationNotes.map((note) => note.name), ['Home-Animation-1', 'Home-Animation-2'])
    assert.ok(!JSON.stringify(page).includes('433:885'), 'hidden Tribute 1 not in page tree')
    const markdown = fs.readFileSync(path.join(root, 'figma/animations/home.md'), 'utf8')
    assert.match(markdown, /## Home-Animation-1 \(433:7368\)/)
    assert.match(markdown, /The initial smaller image enlarges on scroll/)
    assert.ok(!markdown.includes('\u2014'))
    const noted = sections.sections.find((section) => {
      const spec = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home', section.dir, 'spec.json'), 'utf8'))
      return spec.animationNotes.some((note) => note.id === '433:7368')
    })
    assert.ok(noted, 'Home-Animation-1 attached to a section')

    // A failed side render still produces a manual single-band spec, without a crop.
    const corporate = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/corporate/sections.json'), 'utf8'))
    assert.equal(corporate.sections.length, 1)
    assert.equal(corporate.sections[0].laneHint, 'manual')
    assert.equal(corporate.sections[0].crop, null)
    assert.ok(fs.existsSync(path.join(root, 'figma/pages/corporate/sections/01-corporate-overlay/spec.json')))
    assert.ok(!fs.existsSync(path.join(root, 'figma/pages/nav-elements')), 'nav frames are not sliced')

    const second = run(root)
    assert.equal(second.status, 0, second.stderr)
    assert.deepEqual(outputs(root), firstHashes, 're-run is byte-identical')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('a render Figma scaled down below the requested scale still crops in place', async () => {
  // History came back 1055x16384 for a requested 0.75 (1200x18650): Figma caps
  // render size. Crops must use the decoded size, not the requested scale.
  const root = await makeRoot({ renderFactor: 0.8 })
  try {
    const result = run(root, ['--page', 'home'])
    assert.equal(result.status, 0, result.stderr)
    const sections = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home/sections.json'), 'utf8'))
    const imageHeight = Math.round(HOME_HEIGHT * HOME_SCALE * 0.8)
    assert.equal(sections.frames[0].renderScale, Math.round((imageHeight / HOME_HEIGHT) * 10000) / 10000)
    let total = 0
    for (const section of sections.sections) {
      const meta = await sharp(path.join(root, 'figma/pages/home', section.crop)).metadata()
      assert.equal(meta.width, Math.round(HOME_WIDTH * HOME_SCALE * 0.8))
      const expected = (section.cropY1 - section.cropY0) * (imageHeight / HOME_HEIGHT)
      assert.ok(Math.abs(meta.height - expected) <= 2, `${section.dir}: ${meta.height} vs ${expected}`)
      total += meta.height
    }
    assert.ok(Math.abs(total - imageHeight) <= sections.sections.length, 'crops tile the whole render, last crop not empty')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('renderMapping uses render bounds when the frame does not clip content', () => {
  const frame = {
    clipsContent: false,
    absoluteBoundingBox: { x: 100, y: 200, width: 1600, height: 1000 },
    absoluteRenderBounds: { x: 80, y: 150, width: 1640, height: 1100 }
  }
  const info = { width: 820, height: 550 }
  const mapping = renderMapping(frame, info)
  assert.deepEqual(mapping, { scaleX: 0.5, scaleY: 0.5, offsetX: -20, offsetY: -50 })
  assert.deepEqual(cropRect(mapping, info, 1600, 0, 1000), { left: 10, top: 25, width: 800, height: 500 })
  assert.deepEqual(renderMapping({ ...frame, clipsContent: true }, { width: 800, height: 500 }), { scaleX: 0.5, scaleY: 0.5, offsetX: 0, offsetY: 0 })
})

test('figma/slicer.overrides.json splits and merges bands for its page', async () => {
  const root = await makeRoot({ overrides: { pages: { home: { splitAt: [3420], mergeRanges: [[4200, 6300]] } } } })
  try {
    const result = run(root, ['--page', 'home'])
    assert.equal(result.status, 0, result.stderr)
    const { sections } = JSON.parse(fs.readFileSync(path.join(root, 'figma/pages/home/sections.json'), 'utf8'))
    const at = (y) => sections.find((section) => section.cropY0 <= y && section.cropY1 > y)
    assert.notEqual(at(3380).index, at(3500).index, 'dining label split from the framed image')
    assert.equal(at(3500).cropY0, 3420)
    assert.equal(at(4300).index, at(5300).index, 'Zuma and Lobby Bar cards merged')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('--page slices one page only, and an unknown page fails', async () => {
  const root = await makeRoot()
  try {
    const result = run(root, ['--page', 'home'])
    assert.equal(result.status, 0, result.stderr)
    assert.ok(fs.existsSync(path.join(root, 'figma/pages/home/sections.json')))
    assert.ok(!fs.existsSync(path.join(root, 'figma/pages/corporate')))
    const missing = run(root, ['--page', 'nope'])
    assert.equal(missing.status, 1)
    assert.match(missing.stderr, /No page or side frame with pageSlug "nope"/)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})

test('the script makes no network calls', () => {
  const source = fs.readFileSync(script, 'utf8') + fs.readFileSync(path.resolve(here, '../../scripts/api/figma/lib/spec.mjs'), 'utf8') + fs.readFileSync(path.resolve(here, '../../scripts/api/figma/lib/bands.mjs'), 'utf8')
  assert.ok(!/\bfetch\(|https?:\/\/|node:https?\b/.test(source))
  assert.ok(execFileSync(process.execPath, [script, '--help'], { encoding: 'utf8' }).includes('Usage'))
})
