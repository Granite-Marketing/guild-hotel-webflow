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
import { alignPages, groupId, sectionSignature, textRole } from '../../scripts/api/figma/lib/inventory.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../..')
const sliceScript = path.join(repo, 'scripts/api/figma/slice-sections.mjs')
const inventoryScript = path.join(repo, 'scripts/api/figma/build-inventory.mjs')
const fixtureFile = path.join(here, 'fixtures/file-depth4.json.gz')
const SCALE = 0.05

// Temp repo root: the real depth-4 file as the raw snapshot, a snapshot.json
// built from its real frames, blank renders at a small scale, and the
// slicer's output, exactly as `pnpm figma:slice` would leave it.
const makeRoot = async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'inventory-'))
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
  const snapshot = { fileKey: 'fixture', version: 'fixture', lastModified: 'fixture', frames }
  fs.writeFileSync(path.join(root, 'figma/snapshot.json'), `${JSON.stringify(snapshot, null, 2)}\n`)
  const sliced = spawnSync(process.execPath, [sliceScript, '--root', root], { encoding: 'utf8' })
  assert.equal(sliced.status, 0, sliced.stderr)
  return root
}

const runInventory = (root) => {
  const result = spawnSync(process.execPath, [inventoryScript, '--root', root], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  return result
}

const outputFiles = ['figma/inventory.json', 'docs/figma/inventory.md', 'docs/figma/cms-proposal.md', 'figma/inventory.overrides.json']
const hashes = (root) => Object.fromEntries(outputFiles.map((file) => [file, crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex')]))
const readInventory = (root) => JSON.parse(fs.readFileSync(path.join(root, 'figma/inventory.json'), 'utf8'))
const bySlug = (inventory, pageSlug, slug) => inventory.sections.find((entry) => entry.pageSlug === pageSlug && entry.slug === slug)

let root
let inventory

before(async () => {
  root = await makeRoot()
  runInventory(root)
  inventory = readInventory(root)
})

after(() => {
  if (root) fs.rmSync(root, { recursive: true, force: true })
})

test('the four dining venue pages form one CMS template group, and the other clones pair up', () => {
  const groups = inventory.cmsGroups.map((group) => [...group.pages].sort())
  assert.deepEqual(groups.find((pages) => pages.includes('dining-zuma')), ['dining-gardenterrace', 'dining-lobbybar', 'dining-poollounge', 'dining-zuma'])
  assert.deepEqual(groups.find((pages) => pages.includes('legal')), ['corporate', 'legal'])
  assert.deepEqual(groups.find((pages) => pages.includes('happenings-collection')), ['blog-collection', 'happenings-collection'])
  assert.deepEqual(groups.find((pages) => pages.includes('happenings-indiv')), ['blog-indiv', 'happenings-indiv'])
  assert.equal(inventory.cmsGroups.length, 4, 'no other page pairs clear the threshold')

  const dining = inventory.cmsGroups.find((group) => group.pages.includes('dining-zuma'))
  assert.equal(dining.id, 'cms-dining')
  assert.deepEqual(dining.listedBy, ['dining-collection'])
  for (const entry of inventory.sections.filter((section) => section.pageSlug === 'dining-lobbybar' && section.source === 'page')) {
    assert.equal(entry.cmsTemplateGroup, 'cms-dining', entry.key)
  }
  // Matching sections across the venue clones share exact clusters.
  const lobbyHero = bySlug(inventory, 'dining-lobbybar', 'lobby-bar')
  const poolHero = bySlug(inventory, 'dining-poollounge', 'pool-lounge')
  assert.equal(lobbyHero.clusterId, poolHero.clusterId)
  assert.ok(lobbyHero.pagesInCluster.includes('dining-gardenterrace'))

  const proposal = fs.readFileSync(path.join(root, 'docs/figma/cms-proposal.md'), 'utf8')
  assert.match(proposal, /Requires approval before creation/)
  assert.match(proposal, /## `cms-dining`/)
  assert.match(proposal, /\| s01-h2-caps \| PlainText \|/, 'venue hero title differs between venues, so it is a field')
  for (const list of ['dining-collection', 'rooms-collection', 'happenings-collection', 'blog-collection', 'meetings-collection', 'wellness-collection']) {
    assert.match(proposal, new RegExp(`\\| ${list} \\|`), list)
  }
})

test('side frames are manual and nav component sets are tagged', () => {
  for (const [pageSlug, slug] of [['legal', 'legal'], ['corporate', 'corporate-overlay'], ['meetings-collection', 'meetings-overlay'], ['neighborhood', 'neighborhood-overlay'], ['arts', 'arts-modal']]) {
    const entry = bySlug(inventory, pageSlug, slug)
    assert.ok(entry, `${pageSlug}/${slug} present`)
    assert.equal(entry.lane, 'manual', entry.key)
    assert.equal(entry.source, 'side')
  }
  assert.equal(inventory.sections.find((entry) => entry.key === 'legal/set-319-1298').lane, 'needs-decision')
  assert.equal(inventory.sections.find((entry) => entry.key === 'corporate/set-2034-2891').lane, 'needs-decision')
  assert.equal(inventory.sections.find((entry) => entry.key === 'nav-elements/set-236-8312').lane, 'manual')

  // A section with a nav overlay and real content stays agent, overlay excluded.
  const hero = bySlug(inventory, 'home', 'the-bold-handsome-heart-of-san')
  assert.equal(hero.lane, 'agent')
  assert.deepEqual(hero.excludedOverlays.map((overlay) => overlay.nodeId), ['433:903'])
  // The gallery page's animation reference names a gallery type: manual.
  assert.equal(bySlug(inventory, 'gallery', 'gallery').lane, 'manual')

  const markdown = fs.readFileSync(path.join(root, 'docs/figma/inventory.md'), 'utf8')
  assert.match(markdown, /\| set \| `legal\/set-319-1298` \| needs-decision \|/)
  assert.match(markdown, /\[crop\]\(\.\.\/\.\.\/figma\/pages\/home\/sections\/01-the-bold-handsome-heart-of-san\/section\.webp\)/)
  const { lanes } = inventory.summary
  assert.equal(lanes.agent + lanes.manual + lanes['needs-decision'], inventory.summary.sections + inventory.summary.componentSets)
})

test('an override wins over auto-tagging and survives a re-run', async () => {
  const overrideRoot = await makeRoot()
  try {
    runInventory(overrideRoot)
    // Side-frame keys depend on how many bands the page slices into, so look them up.
    const initial = readInventory(overrideRoot)
    const legalKey = initial.sections.find((entry) => entry.pageSlug === 'legal' && entry.slug === 'legal').key
    const corporateKey = initial.sections.find((entry) => entry.pageSlug === 'corporate' && entry.slug === 'corporate-overlay').key
    const seeded = JSON.parse(fs.readFileSync(path.join(overrideRoot, 'figma/inventory.overrides.json'), 'utf8'))
    assert.deepEqual(seeded.sections, {}, 'seeded empty when missing')
    const overrides = {
      sections: {
        'home/01-the-bold-handsome-heart-of-san': { lane: 'manual', name: 'Home hero', note: 'video hero, built by hand' },
        [legalKey]: { lane: 'agent', mergeWith: corporateKey },
        'home/99-missing': { lane: 'manual' }
      }
    }
    const overridesText = `${JSON.stringify(overrides, null, 2)}\n`
    fs.writeFileSync(path.join(overrideRoot, 'figma/inventory.overrides.json'), overridesText)

    for (let run = 0; run < 2; run++) {
      const result = runInventory(overrideRoot)
      assert.match(result.stderr, /unknown section "home\/99-missing"/)
      const current = readInventory(overrideRoot)
      const hero = current.sections.find((entry) => entry.key === 'home/01-the-bold-handsome-heart-of-san')
      assert.equal(hero.lane, 'manual')
      assert.equal(hero.proposedName, 'Home hero')
      assert.equal(hero.laneReason, 'override: video hero, built by hand')
      const legal = current.sections.find((entry) => entry.key === legalKey)
      assert.equal(legal.lane, 'agent')
      assert.equal(legal.mergeWith, corporateKey)
      assert.equal(current.summary.overrides, 2)
      assert.equal(fs.readFileSync(path.join(overrideRoot, 'figma/inventory.overrides.json'), 'utf8'), overridesText, 'overrides file never rewritten')
    }
    const markdown = fs.readFileSync(path.join(overrideRoot, 'docs/figma/inventory.md'), 'utf8')
    assert.match(markdown, /name: Home hero/)
    assert.ok(markdown.includes(`merge into \`${corporateKey}\``))
  } finally {
    fs.rmSync(overrideRoot, { recursive: true, force: true })
  }
})

test('output is deterministic, ordered, and free of em dashes', () => {
  const first = hashes(root)
  runInventory(root)
  assert.deepEqual(hashes(root), first, 're-run is byte-identical')

  const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'figma/snapshot.json'), 'utf8'))
  const snapshotOrder = [...new Set(snapshot.frames.filter((frame) => frame.kind !== 'brand').map((frame) => frame.pageSlug))]
  const pageOrder = inventory.pages.map((page) => page.pageSlug)
  assert.deepEqual(pageOrder, snapshotOrder.filter((slug) => pageOrder.includes(slug)))
  const position = (entry) => [pageOrder.indexOf(entry.pageSlug), entry.index ?? Infinity]
  for (let i = 1; i < inventory.sections.length; i++) {
    const [pageA, indexA] = position(inventory.sections[i - 1])
    const [pageB, indexB] = position(inventory.sections[i])
    assert.ok(pageA < pageB || (pageA === pageB && indexA <= indexB), inventory.sections[i].key)
  }
  for (const entry of inventory.sections) {
    assert.equal(entry.proposedName, null)
    if (entry.spec) assert.ok(fs.existsSync(path.join(root, entry.spec)), entry.spec)
    if (entry.crop) assert.ok(fs.existsSync(path.join(root, entry.crop)), entry.crop)
  }
  for (const file of outputFiles) assert.ok(!fs.readFileSync(path.join(root, file), 'utf8').includes('\u2014'), file)
})

test('signatures and page alignment on real sections', () => {
  const spec = (key) => JSON.parse(fs.readFileSync(path.join(root, inventory.sections.find((entry) => entry.key === key).spec), 'utf8'))
  const hero = spec('dining-zuma/01-zuma-san-diego')
  assert.deepEqual(hero.texts.map(textRole), ['H2-CAPS', 'Gatch Test|22|400|ORIGINAL'])
  const signature = sectionSignature(hero)
  assert.equal(signature.heightBucket, 900)
  assert.match(signature.clusterId, /^c-[0-9a-f]{10}$/)

  const pageSignatures = (pageSlug) => inventory.sections
    .filter((entry) => entry.pageSlug === pageSlug && entry.source === 'page')
    .map((entry) => sectionSignature(JSON.parse(fs.readFileSync(path.join(root, entry.spec), 'utf8'))))
  assert.equal(alignPages(pageSignatures('legal'), pageSignatures('corporate')).score, 1)
  assert.ok(alignPages(pageSignatures('home'), pageSignatures('legal')).score < 0.8)
  assert.equal(groupId(['legal', 'corporate']), 'cms-legal-corporate')
  assert.equal(groupId(['happenings-indiv', 'blog-indiv']), 'cms-happenings-blog-indiv')
})

test('the inventory scripts make no network calls', () => {
  const source = fs.readFileSync(inventoryScript, 'utf8') + fs.readFileSync(path.join(repo, 'scripts/api/figma/lib/inventory.mjs'), 'utf8')
  assert.ok(!/\bfetch\(|https?:\/\/|node:https?\b/.test(source))
})
