import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

const require = createRequire(import.meta.url)
const { FigmaClient } = require('../../scripts/api/lib/figma-client.cjs')

const realFetch = globalThis.fetch

function response (status, body, headers = {}) {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), { status, headers })
}

function mockFetch (responses) {
  const requests = []
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), init })
    const next = responses.shift()
    if (!next) throw new Error(`Unexpected request: ${url}`)
    return next
  }
  return requests
}

function quietClient (opts = {}) {
  const sleeps = []
  const client = new FigmaClient('test-token', { sleep: async ms => { sleeps.push(ms) }, ...opts })
  return { client, sleeps }
}

test.afterEach(() => { globalThis.fetch = realFetch })

// Keep console.error noise out of test output.
const realError = console.error
test.before(() => { console.error = () => {} })
test.after(() => { console.error = realError })

test('a 429 with a long retry-after throws immediately with the wait in hours', async () => {
  const requests = mockFetch([response(429, 'rate limited', { 'retry-after': '396863' })])
  const { client, sleeps } = quietClient()
  await assert.rejects(client.getFileMeta('KEY'), (err) => {
    assert.match(err.message, /110\.2 hours/)
    return true
  })
  assert.equal(requests.length, 1)
  assert.equal(sleeps.length, 0)
})

test('a 429 with a short retry-after waits that long and retries once', async () => {
  const requests = mockFetch([
    response(429, 'rate limited', { 'retry-after': '2' }),
    response(200, { name: 'File', version: '1', lastModified: 'x' })
  ])
  const { client, sleeps } = quietClient()
  const meta = await client.getFileMeta('KEY')
  assert.equal(meta.version, '1')
  assert.equal(requests.length, 2)
  assert.deepEqual(sleeps, [2000])
  assert.match(requests[0].url, /\/v1\/files\/KEY\?depth=1$/)
})

test('the ledger gets one line per request, including failures, without the token', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'figma-ledger-'))
  try {
    const ledgerPath = join(dir, 'nested', 'ledger.jsonl')
    mockFetch([
      response(200, { version: '1' }),
      response(404, 'not found')
    ])
    const { client } = quietClient({ ledgerPath })
    await client.getFile('KEY')
    await assert.rejects(client.getImageFills('KEY'), /Figma API 404/)
    const lines = readFileSync(ledgerPath, 'utf-8').trim().split('\n').map(line => JSON.parse(line))
    assert.equal(lines.length, 2)
    assert.deepEqual(lines.map(l => l.status), [200, 404])
    assert.equal(lines[0].endpoint, '/v1/files/KEY')
    assert.equal(lines[1].endpoint, '/v1/files/KEY/images')
    assert.ok(lines.every(l => typeof l.at === 'string' && typeof l.bytes === 'number'))
    assert.ok(!readFileSync(ledgerPath, 'utf-8').includes('test-token'))
    assert.equal(client.calls.length, 2)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('setLedgerPath enables the ledger after construction', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'figma-ledger-'))
  try {
    mockFetch([response(200, { version: '1' })])
    const { client } = quietClient()
    client.setLedgerPath(join(dir, 'ledger.jsonl'))
    await client.getFileMeta('KEY')
    assert.equal(readFileSync(join(dir, 'ledger.jsonl'), 'utf-8').trim().split('\n').length, 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('a non-Figma URL is still refused', async () => {
  const requests = mockFetch([])
  const { client } = quietClient()
  await assert.rejects(client._request('https://example.com/v1/files/KEY'), /Refusing to send auth token/)
  assert.equal(requests.length, 0)
})

test('getFile with raw returns the verbatim body', async () => {
  const body = '{"version":"7","name":"File"}'
  mockFetch([response(200, body)])
  const { client } = quietClient()
  assert.equal(await client.getFile('KEY', { raw: true }), body)
})

test('plan tier headers are logged when present', async () => {
  const logged = []
  console.error = (message) => logged.push(message)
  try {
    mockFetch([response(200, { version: '1' }, { 'x-figma-plan-tier': 'pro', 'x-figma-rate-limit-type': 'low' })])
    const { client } = quietClient()
    await client.getFileMeta('KEY')
    assert.ok(logged.some(line => /plan tier: pro, rate limit type: low/.test(line)))
  } finally {
    console.error = () => {}
  }
})

test('existing method signatures still build the same URLs', async () => {
  const requests = mockFetch([
    response(200, { nodes: {} }),
    response(200, { images: {} })
  ])
  const { client } = quietClient()
  await client.getFileNodes('KEY', ['1:2'], { depth: 10 })
  await client.exportImages('KEY', ['1:2', '3:4'], 'svg', { svgOutlineText: true })
  assert.match(requests[0].url, /\/v1\/files\/KEY\/nodes\?ids=1%3A2&depth=10$/)
  assert.match(requests[1].url, /\/v1\/images\/KEY\?ids=1%3A2%2C3%3A4&format=svg&svg_outline_text=true$/)
  assert.equal(requests[0].init.headers['X-Figma-Token'], 'test-token')
})
