import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

import { parseArgs, run } from '../../scripts/api/figma/snapshot.mjs'

const require = createRequire(import.meta.url)
const { FigmaClient } = require('../../scripts/api/lib/figma-client.cjs')

const fixturePath = join(fileURLToPath(new URL('.', import.meta.url)), 'fixtures', 'file-depth4.json.gz')
const fixtureBody = gunzipSync(readFileSync(fixturePath)).toString('utf-8')
const fixture = JSON.parse(fixtureBody)
const PNG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0])
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')
const realFetch = globalThis.fetch

// Routes every request; nothing ever leaves the process.
function installFetch ({ nullRenderIds = [], failOnScale = null } = {}) {
  const requests = []
  globalThis.fetch = async (input) => {
    const url = new URL(String(input))
    requests.push(url)
    const json = body => new Response(JSON.stringify(body), { status: 200 })
    if (url.hostname === 'download.test') {
      return new Response(url.pathname.endsWith('.svg') ? SVG : PNG, { status: 200 })
    }
    assert.equal(url.hostname, 'api.figma.com')
    if (url.pathname === '/v1/files/KEY' && url.searchParams.get('depth') === '1') {
      return json({ name: fixture.name, version: fixture.version, lastModified: fixture.lastModified })
    }
    if (url.pathname === '/v1/files/KEY') return new Response(fixtureBody, { status: 200 })
    if (url.pathname === '/v1/files/KEY/images') {
      return json({ meta: { images: { refA: 'https://download.test/fills/refA', refB: null } } })
    }
    if (url.pathname === '/v1/images/KEY') {
      const ids = url.searchParams.get('ids').split(',')
      const format = url.searchParams.get('format')
      if (failOnScale !== null && url.searchParams.get('scale') === String(failOnScale)) {
        return new Response('rate limited', { status: 429, headers: { 'retry-after': '396863' } })
      }
      const images = {}
      for (const id of ids) {
        images[id] = nullRenderIds.includes(id) ? null : `https://download.test/r/${id.replace(':', '-')}.${format}`
      }
      return json({ err: null, images })
    }
    throw new Error(`Unexpected request ${url}`)
  }
  return requests
}

function figmaCalls (requests) {
  return requests.filter(url => url.hostname === 'api.figma.com')
}

function setup () {
  const root = mkdtempSync(join(tmpdir(), 'figma-snapshot-'))
  const logs = []
  const base = {
    root,
    sleep: async () => {},
    delayMs: 0,
    log: message => logs.push(message),
    warn: message => logs.push(message)
  }
  const client = () => new FigmaClient('test-token', { sleep: async () => {}, ledgerPath: join(root, 'figma', '.cache', 'ledger.jsonl') })
  return { root, logs, base, client }
}

const realError = console.error
test.before(() => { console.error = () => {} })
test.after(() => { console.error = realError })
test.afterEach(() => { globalThis.fetch = realFetch })

test('a full run captures file, fills, renders and brand within budget', async () => {
  const { root, logs, base, client } = setup()
  try {
    const requests = installFetch()
    const result = await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    assert.equal(figmaCalls(requests).length, 7)
    assert.equal(result.calls, 7)

    const snapshot = JSON.parse(readFileSync(join(root, 'figma', 'snapshot.json'), 'utf-8'))
    assert.equal(snapshot.version, fixture.version)
    assert.equal(snapshot.fileName, 'GUILD-WEB-NEW')
    assert.equal(snapshot.calls.length, 7)
    assert.deepEqual(snapshot.tiers, [2, 1, 0.75, 0.5])
    assert.equal(snapshot.frames.filter(f => f.kind === 'page').length, 24)
    assert.ok(snapshot.frames.every(f => f.status === 'ok'))
    const home = snapshot.frames.find(f => f.id === '433:559')
    assert.equal(home.render, 'figma/.cache/renders/433-559.png')
    assert.ok(existsSync(join(root, home.render)))

    const raw = gunzipSync(readFileSync(join(root, 'figma', 'raw', 'file.json.gz'))).toString('utf-8')
    assert.equal(raw, fixtureBody)
    assert.ok(existsSync(join(root, 'figma', 'brand', 'guildlogo.svg')))
    assert.equal(readdirSync(join(root, 'figma', 'brand')).length, 9)

    const manifest = JSON.parse(readFileSync(join(root, 'assets', 'asset-manifest.json'), 'utf-8'))
    const fill = manifest.assets.find(a => a.figmaImageRef === 'refA')
    assert.equal(fill.filename, 'refA.png')
    assert.equal(fill.status, 'exported')
    assert.equal(fill.type, 'image')
    assert.ok(existsSync(join(root, 'assets', 'images', 'refA.png')))
    assert.ok(logs.some(line => /no URL for imageRef refB/.test(line)))

    const ledger = readFileSync(join(root, 'figma', '.cache', 'ledger.jsonl'), 'utf-8').trim().split('\n')
    assert.equal(ledger.length, 7)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('an unchanged file costs one call and writes nothing', async () => {
  const { root, logs, base, client } = setup()
  try {
    installFetch()
    await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    const snapshotPath = join(root, 'figma', 'snapshot.json')
    const before = readFileSync(snapshotPath, 'utf-8')
    const mtime = statSync(snapshotPath).mtimeMs

    const requests = installFetch()
    const result = await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    assert.equal(result.unchanged, true)
    assert.equal(figmaCalls(requests).length, 1)
    assert.equal(requests.length, 1)
    assert.equal(readFileSync(snapshotPath, 'utf-8'), before)
    assert.equal(statSync(snapshotPath).mtimeMs, mtime)
    assert.ok(logs.some(line => /Unchanged/.test(line)))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('dry run lists planned calls and makes zero network requests', async () => {
  const { root, logs, base } = setup()
  try {
    let fetched = 0
    globalThis.fetch = async () => { fetched++; throw new Error('network is not allowed in a dry run') }
    const result = await run({ ...base, args: { fileKey: 'KEY', dryRun: true, fromFixture: fixturePath } })
    assert.equal(fetched, 0)
    assert.equal(result.calls, 0)
    assert.equal(result.plan.calls.length, 7)
    assert.ok(result.plan.calls.length <= 8)
    assert.ok(logs.some(line => /Dry run/.test(line)))
    assert.ok(!existsSync(join(root, 'figma')))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a missing render URL marks that frame failed and the run continues', async () => {
  const { root, logs, base, client } = setup()
  try {
    installFetch({ nullRenderIds: ['219:739'] })
    await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    const snapshot = JSON.parse(readFileSync(join(root, 'figma', 'snapshot.json'), 'utf-8'))
    const history = snapshot.frames.find(f => f.id === '219:739')
    assert.equal(history.status, 'failed')
    assert.equal(snapshot.frames.filter(f => f.status === 'failed').length, 1)
    assert.ok(logs.some(line => /no render URL for 219:739.*--only 219:739/.test(line)))
    assert.ok(existsSync(join(root, 'figma', 'brand', 'stamp.svg')))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a run aborted by a long 429 resumes without re-fetching the file', async () => {
  const { root, base, client } = setup()
  try {
    installFetch({ failOnScale: 1 })
    await assert.rejects(run({ ...base, args: { fileKey: 'KEY' }, client: client() }), /about 110\.2 hours/)
    assert.ok(!existsSync(join(root, 'figma', 'snapshot.json')))
    const steps = join(root, 'figma', '.cache', 'steps', fixture.version)
    assert.ok(existsSync(join(steps, 'file.done')))
    assert.ok(existsSync(join(steps, 'renders-2.done')))
    assert.ok(!existsSync(join(steps, 'renders-1.done')))

    const requests = installFetch()
    const result = await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    assert.equal(result.unchanged, false)
    const paths = figmaCalls(requests).map(url => `${url.pathname}${url.search}`)
    assert.ok(!paths.includes('/v1/files/KEY'), 'full file must not be re-fetched')
    assert.ok(!paths.includes('/v1/files/KEY/images'), 'fills must not be re-fetched')
    assert.ok(!paths.some(p => p.includes('scale=2')), 'completed tier must not be re-rendered')
    // change check, tier 1, tier 0.75, brand
    assert.equal(paths.length, 4)

    const snapshot = JSON.parse(readFileSync(join(root, 'figma', 'snapshot.json'), 'utf-8'))
    assert.ok(snapshot.frames.every(f => f.status === 'ok'))
    // Calls for this version span both runs: 5 from the first (including the 429), 4 from the second.
    assert.equal(snapshot.calls.length, 9)
    assert.ok(snapshot.calls.some(c => c.status === 429))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('--only re-renders one frame for one call', async () => {
  const { root, base, client } = setup()
  try {
    installFetch({ nullRenderIds: ['219:739'] })
    await run({ ...base, args: { fileKey: 'KEY' }, client: client() })
    const requests = installFetch()
    const result = await run({ ...base, args: { fileKey: 'KEY', only: '219:739' }, client: client() })
    assert.equal(result.status, 'ok')
    assert.equal(figmaCalls(requests).length, 1)
    assert.equal(figmaCalls(requests)[0].searchParams.get('scale'), '0.75')
    const snapshot = JSON.parse(readFileSync(join(root, 'figma', 'snapshot.json'), 'utf-8'))
    assert.equal(snapshot.frames.find(f => f.id === '219:739').status, 'ok')
    assert.equal(snapshot.calls.length, 8)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('a committed file over the size limit fails the run', async () => {
  const { root, base, client } = setup()
  try {
    installFetch()
    await assert.rejects(
      run({ ...base, maxCommittedBytes: 1024, args: { fileKey: 'KEY' }, client: client() }),
      /figma\/raw\/file\.json\.gz is .*over the 0MB committed file limit|committed file limit/
    )
    assert.ok(!existsSync(join(root, 'figma', 'raw', 'file.json.gz')))
    assert.ok(!existsSync(join(root, 'figma', 'snapshot.json')))
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('argument parsing', () => {
  assert.deepEqual(parseArgs(['KEY', '--dry-run', '--from-fixture', 'f.json.gz']), { fileKey: 'KEY', dryRun: true, only: null, fromFixture: 'f.json.gz' })
  assert.equal(parseArgs(['--only', '1:2']).only, '1:2')
  assert.throws(() => parseArgs(['--from-fixture', 'f.json.gz']), /only valid with --dry-run/)
  assert.throws(() => parseArgs(['--bogus']), /Unknown option/)
})
