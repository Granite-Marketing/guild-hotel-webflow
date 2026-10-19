import { after, before, test } from 'node:test'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { discoverFrames, renderPath } from '../../scripts/api/figma/lib/frames.mjs'
import { GENERATED_MARKER, SUBAGENT_LINE, sectionForUse } from '../../scripts/api/figma/lib/queue.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../..')
const sliceScript = path.join(repo, 'scripts/api/figma/slice-sections.mjs')
const inventoryScript = path.join(repo, 'scripts/api/figma/build-inventory.mjs')
const queueScript = path.join(repo, 'scripts/api/figma/build-queue.mjs')
const fixtureFile = path.join(here, 'fixtures/file-depth4.json.gz')
const SCALE = 0.05

// Repo files the briefs point at; copied so the temp root is self-contained.
const REPO_DOCS = [
  'CLAUDE.md',
  '.claude/skills/build-component/SKILL.md',
  'docs/reference/webflow-ids.md',
  'docs/reference/style-inventory.md',
  'docs/reference/style-guide.md',
  'docs/reference/component-patterns.md',
  'docs/reference/breakpoints.md',
  'docs/reference/modal-setup.md',
  'docs/reference/swiper-slider-setup.md',
  'figma/README.md',
  'figma/tokens.json'
]

const copy = (rel, root) => {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true })
  fs.cpSync(path.join(repo, rel), path.join(root, rel), { recursive: true })
}

// Temp root built like tests/figma/inventory.test.mjs: the real depth-4 file,
// blank renders, the slicer and the inventory, plus the real tokens, vectors,
// brand marks and animation notes.
const makeRoot = async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'build-queue-'))
  fs.mkdirSync(path.join(root, 'figma/raw'), { recursive: true })
  fs.mkdirSync(path.join(root, 'figma/.cache/renders'), { recursive: true })
  fs.copyFileSync(fixtureFile, path.join(root, 'figma/raw/file.json.gz'))
  fs.copyFileSync(path.join(repo, 'figma/slicer.config.json'), path.join(root, 'figma/slicer.config.json'))
  const file = JSON.parse(zlib.gunzipSync(fs.readFileSync(fixtureFile)).toString('utf8'))
  const frames = discoverFrames(file).frames.map((frame) =>
    frame.kind === 'brand' ? frame : { ...frame, scale: SCALE, render: renderPath(frame.id), status: 'ok' })
  for (const frame of frames) {
    if (!frame.render) continue
    await sharp({
      create: { width: Math.max(1, Math.round(frame.width * SCALE)), height: Math.max(1, Math.round(frame.height * SCALE)), channels: 3, background: { r: 217, g: 217, b: 217 } }
    }).png().toFile(path.join(root, frame.render))
  }
  fs.writeFileSync(path.join(root, 'figma/snapshot.json'), `${JSON.stringify({ fileKey: 'fixture', version: 'fixture', lastModified: 'fixture', frames }, null, 2)}\n`)
  for (const rel of [...REPO_DOCS, 'figma/vectors', 'figma/brand', 'figma/animations']) {
    if (fs.existsSync(path.join(repo, rel))) copy(rel, root)
  }
  for (const script of [sliceScript, inventoryScript]) {
    const result = spawnSync(process.execPath, [script, '--root', root], { encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
  }
  return root
}

const runQueue = (root) => {
  const result = spawnSync(process.execPath, [queueScript, '--root', root], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result
}

const readJson = (root, rel) => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'))
const briefFiles = (root) => fs.readdirSync(path.join(root, 'docs/figma/briefs')).sort().map((name) => `docs/figma/briefs/${name}`)
const outputHashes = (root) => Object.fromEntries(['figma/assets.json', 'docs/figma/build-queue.md', ...briefFiles(root)]
  .map((rel) => [rel, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, rel))).digest('hex')]))

// Queue rows parsed back from docs/figma/build-queue.md.
const queueRows = (root) => fs.readFileSync(path.join(root, 'docs/figma/build-queue.md'), 'utf8').split('\n')
  .filter((line) => /^\| Q\d{3} \|/.test(line))
  .map((line) => {
    const cells = line.split('|').slice(1, -1).map((cell) => cell.trim())
    return { id: cells[0], title: cells[1], type: cells[2], lane: cells[3], dependsOn: cells[4] === 'none' ? [] : cells[4].split(', '), brief: cells[6] }
  })

// Section keys per entry, from the per-entry lists in build-queue.md.
const entrySections = (root) => {
  const text = fs.readFileSync(path.join(root, 'docs/figma/build-queue.md'), 'utf8')
  const map = new Map()
  for (const block of text.split(/^### /m).slice(1)) {
    const id = block.slice(0, 4)
    const keys = [...block.matchAll(/^- `([^`]+)`/gm)].map((match) => match[1])
    map.set(id, keys)
  }
  return map
}

let root
let inventory

before(async () => {
  root = await makeRoot()
  runQueue(root)
  inventory = readJson(root, 'figma/inventory.json')
})

after(() => {
  if (root && process.env.KEEP_QUEUE_ROOT) console.log(`kept temp root: ${root}`)
  else if (root) fs.rmSync(root, { recursive: true, force: true })
})

test('every agent section appears exactly once across shared, CMS and page entries', () => {
  const rows = queueRows(root)
  const sections = entrySections(root)
  const placed = new Map()
  for (const row of rows.filter((entry) => ['shared', 'cms', 'page'].includes(entry.type))) {
    for (const key of sections.get(row.id)) placed.set(key, (placed.get(key) || 0) + 1)
  }
  const agent = inventory.sections.filter((section) => section.lane === 'agent').map((section) => section.key)
  assert.ok(agent.length > 100)
  for (const key of agent) assert.equal(placed.get(key), 1, key)
  for (const key of placed.keys()) assert.ok(agent.includes(key), `${key} is agent lane`)
  const text = fs.readFileSync(path.join(root, 'docs/figma/build-queue.md'), 'utf8')
  assert.match(text, /Every agent section appears in exactly one shared, CMS or page entry\./)
  assert.deepEqual(rows.slice(0, 4).map((row) => row.id), ['Q001', 'Q002', 'Q003', 'Q004'])
  assert.match(rows[0].title, /Token sync/)
  assert.equal(rows[1].lane, 'manual')
  assert.ok(rows.find((row) => row.type === 'page').title.endsWith('Home'), 'home is the first page entry')
})

test('manual sections never get briefs and are listed with their crops', () => {
  const rows = queueRows(root)
  const sections = entrySections(root)
  const manualKeys = inventory.sections.filter((section) => section.lane !== 'agent').map((section) => section.key)
  const modal = inventory.sections.find((section) => section.pageSlug === 'arts' && section.slug === 'arts-modal')
  assert.ok(manualKeys.includes(modal.key))
  for (const row of rows.filter((entry) => entry.lane === 'manual')) assert.equal(row.brief, 'yours', row.id)
  const listedManual = rows.filter((row) => row.type === 'manual').flatMap((row) => sections.get(row.id))
  assert.deepEqual([...listedManual].sort(), [...manualKeys].sort())
  for (const rel of briefFiles(root)) {
    const brief = fs.readFileSync(path.join(root, rel), 'utf8')
    for (const key of manualKeys) assert.ok(!brief.includes(`#### \`${key}\``), `${key} built in ${rel}`)
  }
  const text = fs.readFileSync(path.join(root, 'docs/figma/build-queue.md'), 'utf8')
  assert.ok(text.includes(`\`${modal.key}\` (`) && text.includes(`[crop](../../${modal.crop})`), 'modal listed with its crop')
})

test('a shared cluster on three or more pages is queued before every page using it', () => {
  const rows = queueRows(root)
  const sections = entrySections(root)
  const pageOf = (key) => key.split('/')[0]
  const wide = rows.filter((row) => row.type === 'shared' && new Set(sections.get(row.id).map(pageOf)).size >= 3)
  assert.ok(wide.length > 0, 'at least one shared entry spans three pages')
  for (const shared of wide) {
    const pages = new Set(sections.get(shared.id).map(pageOf))
    for (const row of rows.filter((entry) => entry.type === 'page' || entry.type === 'cms')) {
      const body = fs.readFileSync(path.join(root, 'docs/figma/briefs', row.brief.match(/\(briefs\/([^)]+)\)/)[1]), 'utf8')
      const usesShared = [...pages].some((page) => body.includes(`\`${page}/`)) && row.dependsOn.includes(shared.id)
      if (!usesShared) continue
      assert.ok(shared.id < row.id, `${shared.id} before ${row.id}`)
    }
    for (const page of pages) {
      const pageRow = rows.find((row) => row.type === 'page' && row.brief.includes(`page-${page}.md`))
      if (pageRow) {
        assert.ok(pageRow.dependsOn.includes(shared.id), `${pageRow.id} depends on ${shared.id}`)
        assert.ok(shared.id < pageRow.id)
      }
    }
  }
  // The largest inventory cluster lands whole in one shared entry.
  const largest = inventory.clusters[0]
  const members = largest.sections.filter((key) => inventory.sections.find((section) => section.key === key).lane === 'agent')
  const owner = rows.find((row) => row.type === 'shared' && sections.get(row.id).includes(members[0]))
  assert.ok(owner, 'largest cluster is shared')
  for (const key of members) assert.ok(sections.get(owner.id).includes(key), key)
})

test('every brief references files that exist and carries the required lines', () => {
  const briefs = briefFiles(root)
  const rows = queueRows(root)
  assert.equal(briefs.length, rows.filter((row) => row.brief !== 'yours').length)
  for (const rel of briefs) {
    const text = fs.readFileSync(path.join(root, rel), 'utf8')
    assert.ok(text.includes(SUBAGENT_LINE), rel)
    assert.ok(text.includes(GENERATED_MARKER), rel)
    assert.ok(!text.includes('\u2014'), `${rel} has no em dash`)
    const paths = [...text.matchAll(/`([A-Za-z0-9_.][A-Za-z0-9_./-]*\.(?:md|json|webp|svg|png))`/g)].map((match) => match[1])
    assert.ok(paths.length > 3, rel)
    for (const file of paths) assert.ok(fs.existsSync(path.join(root, file)), `${rel} -> ${file}`)
  }
  const home = fs.readFileSync(path.join(root, briefs.find((rel) => rel.endsWith('page-home.md'))), 'utf8')
  assert.match(home, /6ad64060ae8eac6d7b7c4241/, 'home page id from webflow-ids.md')
  const allBriefs = briefs.map((rel) => fs.readFileSync(path.join(root, rel), 'utf8')).join('\n')
  assert.match(allBriefs, /Excluded manual overlay: guild-nav-full-dark \(433:903\), built by hand/)
  const create = briefs.find((rel) => /page-history\.md$/.test(rel))
  assert.match(fs.readFileSync(path.join(root, create), 'utf8'), /create page first, see Q004/)
})

test('assets.json indexes image fills, brand marks and vectors, each vector use in one section', () => {
  const assets = readJson(root, 'figma/assets.json')
  const refs = Object.keys(assets.images)
  assert.ok(refs.length > 0)
  for (const ref of refs) {
    assert.ok(assets.images[ref].usedBy.length > 0, ref)
    for (const key of assets.images[ref].usedBy) assert.ok(inventory.sections.some((section) => section.key === key), key)
  }
  assert.ok(Object.keys(assets.brand).includes('guildlogo'))

  // Ranges from the real sections.json files: every vector use lands in at most one section.
  const ranges = []
  for (const page of inventory.pages) {
    const file = path.join(root, 'figma/pages', page.pageSlug, 'sections.json')
    if (!fs.existsSync(file)) continue
    for (const entry of readJson(root, `figma/pages/${page.pageSlug}/sections.json`).sections) {
      ranges.push({ key: `${page.pageSlug}/${path.basename(entry.dir)}`, frameId: entry.frameId, y0: entry.cropY0, y1: entry.cropY1 })
    }
  }
  const index = readJson(root, 'figma/vectors/index.json')
  let matched = 0
  for (const vector of index.vectors) {
    for (const use of vector.uses) {
      const centre = use.y + use.height / 2
      const hits = ranges.filter((range) => range.frameId === use.frameId && centre >= range.y0 && centre < range.y1)
      assert.ok(hits.length <= 1, `${use.id} matches ${hits.length} sections`)
      if (hits.length) {
        matched++
        assert.equal(sectionForUse(use, ranges), hits[0].key)
      }
    }
  }
  assert.ok(matched > 0)
  assert.equal(assets.vectors.length, index.vectors.length)
  const placedUses = assets.vectors.reduce((sum, vector) => sum + vector.useCount - vector.unmatchedUses, 0)
  assert.ok(placedUses >= matched)
  // Boundary: a centre exactly on a crop edge belongs to the lower section only.
  const edge = [{ key: 'a', frameId: 'f', y0: 0, y1: 100 }, { key: 'b', frameId: 'f', y0: 100, y1: 200, last: true }]
  assert.equal(sectionForUse({ frameId: 'f', y: 90, height: 20 }, edge), 'b')
  assert.equal(sectionForUse({ frameId: 'f', y: 190, height: 20 }, edge), 'b')
  assert.equal(sectionForUse({ frameId: 'g', y: 10, height: 20 }, edge), null)
})

test('re-run is byte-identical and keeps Webflow URLs in assets.json', () => {
  const assetsFile = path.join(root, 'figma/assets.json')
  const assets = JSON.parse(fs.readFileSync(assetsFile, 'utf8'))
  const ref = Object.keys(assets.images)[0]
  assets.images[ref].webflowUrl = 'https://cdn.prod.website-files.com/test/asset.webp'
  assets.images[ref].webflowAssetId = 'a'.repeat(24)
  fs.writeFileSync(assetsFile, `${JSON.stringify(assets, null, 2)}\n`)
  runQueue(root)
  const first = outputHashes(root)
  runQueue(root)
  assert.deepEqual(outputHashes(root), first, 're-run is byte-identical')
  const after = readJson(root, 'figma/assets.json')
  assert.equal(after.images[ref].webflowUrl, 'https://cdn.prod.website-files.com/test/asset.webp')
  assert.equal(after.images[ref].webflowAssetId, 'a'.repeat(24))
})

test('a vision slider flips an agent section to manual, and stale generated briefs are removed', () => {
  const target = inventory.sections.find((section) => section.lane === 'agent' && section.pageSlug === 'home' && section.clusterSize === 1)
  const handWritten = path.join(root, 'docs/figma/briefs/notes.md')
  fs.writeFileSync(handWritten, '# hand-written notes\n')
  const stale = path.join(root, 'docs/figma/briefs/Q999-removed-entry.md')
  fs.writeFileSync(stale, `# Q999\n\n${GENERATED_MARKER}\n`)
  fs.mkdirSync(path.join(root, 'figma/review'), { recursive: true })
  fs.writeFileSync(path.join(root, 'figma/review/vision-test.json'), `${JSON.stringify({ sections: [{ key: target.key, name: 'hero-video-slider', kind: 'hero', slider: true, interactive: '', boundaryIssue: '', note: '' }] }, null, 2)}\n`)
  const result = runQueue(root)
  assert.match(result.stdout, /vision reviews: 1 sections/)
  const rows = queueRows(root)
  const sections = entrySections(root)
  const slider = rows.find((row) => row.type === 'manual' && sections.get(row.id).includes(target.key))
  assert.ok(slider, 'listed in a manual entry')
  const text = fs.readFileSync(path.join(root, 'docs/figma/build-queue.md'), 'utf8')
  assert.match(text, new RegExp(`\`${target.key}\` \\(Hero video slider\\): vision: slider`))
  for (const row of rows.filter((entry) => entry.type !== 'manual')) assert.ok(!sections.get(row.id).includes(target.key), row.id)
  for (const rel of briefFiles(root)) assert.ok(!fs.readFileSync(path.join(root, rel), 'utf8').includes(`#### \`${target.key}\``), rel)
  // A generated brief with no queue entry is removed; one without the marker is kept.
  assert.ok(!fs.existsSync(stale), 'stale generated brief removed')
  const now = new Set(briefFiles(root))
  for (const rel of now) {
    if (rel === 'docs/figma/briefs/notes.md') continue
    assert.ok(rows.some((row) => row.brief.includes(rel.replace('docs/figma/', ''))), `${rel} is a current brief`)
  }
  assert.ok(fs.existsSync(handWritten))
})

test('the queue scripts make no network calls', () => {
  const source = fs.readFileSync(queueScript, 'utf8') + fs.readFileSync(path.join(repo, 'scripts/api/figma/lib/queue.mjs'), 'utf8')
  assert.ok(!/\bfetch\(|https?:\/\/|node:https?\b/.test(source))
})
