#!/usr/bin/env node
// One-shot Figma snapshot: change check, full file, image fills, page renders
// and brand SVGs. Every Figma call is serial, counted and logged. Each network
// step writes a completion marker under figma/.cache/steps/<version>/ so an
// interrupted run resumes with only the remaining calls. figma/snapshot.json is
// written last, only after every step has completed.
//
// Usage: node scripts/api/figma/snapshot.mjs [fileKey] [--dry-run] [--only <frameId>] [--from-fixture <file.json.gz>]

import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { gzipSync, gunzipSync } from 'node:zlib'

import {
  BRAND_FRAME_ID,
  DEFAULT_RENDER_CAP_MEGAPIXELS,
  SCALE_TIERS,
  brandGroups,
  bucketByTier,
  collectImageFills,
  discoverFrames,
  idSafe,
  renderPath
} from './lib/frames.mjs'

const require = createRequire(import.meta.url)
const manifestLib = require('../lib/manifest.cjs')

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

export const CALL_BUDGET = 8
export const MAX_COMMITTED_BYTES = 10 * 1024 * 1024
const DEFAULT_DELAY_MS = 1000

export function parseArgs (argv) {
  const args = { fileKey: null, dryRun: false, only: null, fromFixture: null }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--only') args.only = argv[++i]
    else if (arg === '--from-fixture') args.fromFixture = argv[++i]
    else if (arg.startsWith('--')) throw new Error(`Unknown option: ${arg}`)
    else args.fileKey = arg
  }
  if (args.only === undefined) throw new Error('--only needs a frame id')
  if (args.fromFixture === undefined) throw new Error('--from-fixture needs a path')
  if (args.fromFixture && !args.dryRun) throw new Error('--from-fixture is only valid with --dry-run')
  return args
}

function readGzJson (path) {
  return JSON.parse(gunzipSync(readFileSync(path)).toString('utf-8'))
}

function sniffExtension (buffer) {
  if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return '.png'
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return '.jpg'
  if (buffer.length >= 3 && buffer.toString('ascii', 0, 3) === 'GIF') return '.gif'
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return '.webp'
  const head = buffer.toString('utf-8', 0, 100).trimStart()
  if (head.startsWith('<svg') || head.startsWith('<?xml')) return '.svg'
  return '.png'
}

async function defaultDownload (url) {
  if (!url.startsWith('https://')) throw new Error(`Refusing to download from non-HTTPS URL: ${url}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed (${res.status})`)
  return Buffer.from(await res.arrayBuffer())
}

// Planned calls for a dry run. fileJson may be null when no local copy exists.
export function planCalls (fileKey, fileJson, capMegapixels = DEFAULT_RENDER_CAP_MEGAPIXELS) {
  const calls = [
    { endpoint: `/v1/files/${fileKey}?depth=1`, purpose: 'change check' },
    { endpoint: `/v1/files/${fileKey}`, purpose: 'full file' },
    { endpoint: `/v1/files/${fileKey}/images`, purpose: 'image fills' }
  ]
  if (!fileJson) {
    calls.push({ endpoint: `/v1/images/${fileKey}?format=png&scale=<tier>`, purpose: 'renders, 1 to 4 calls; tiers known after the file fetch' })
    calls.push({ endpoint: `/v1/images/${fileKey}?format=svg&svg_outline_text=true`, purpose: 'brand SVGs' })
    return { calls, frames: [], tiers: [], brand: [] }
  }
  const { frames, warnings } = discoverFrames(fileJson)
  const tiers = bucketByTier(frames, capMegapixels)
  for (const tier of tiers) {
    calls.push({
      endpoint: `/v1/images/${fileKey}?format=png&scale=${tier.scale}`,
      purpose: `renders, ${tier.frames.length} frames (${tier.frames.map(f => f.name).join(', ')})`
    })
  }
  const brand = brandGroups(fileJson)
  calls.push({
    endpoint: `/v1/images/${fileKey}?format=svg&svg_outline_text=true`,
    purpose: `brand SVGs, ${brand.length} groups (${brand.map(b => b.name).join(', ')})`
  })
  return { calls, frames, tiers, brand, warnings }
}

export async function run (options) {
  const {
    args,
    root = REPO_ROOT,
    client = null,
    download = defaultDownload,
    sleep = ms => new Promise(resolveSleep => setTimeout(resolveSleep, ms)),
    delayMs = DEFAULT_DELAY_MS,
    log = console.log,
    warn = console.error,
    now = () => new Date().toISOString(),
    capMegapixels = DEFAULT_RENDER_CAP_MEGAPIXELS,
    maxCommittedBytes = MAX_COMMITTED_BYTES
  } = options

  const paths = {
    snapshot: join(root, 'figma', 'snapshot.json'),
    raw: join(root, 'figma', 'raw', 'file.json.gz'),
    cache: join(root, 'figma', '.cache'),
    manifest: join(root, 'assets', 'asset-manifest.json'),
    images: join(root, 'assets', 'images')
  }
  const fileKey = args.fileKey

  if (args.dryRun) return dryRun({ args, paths, fileKey: fileKey || '<fileKey>', log, warn, capMegapixels })

  if (!fileKey) throw new Error('No file key. Pass it as an argument or set FIGMA_FILE_KEY.')
  if (!client) throw new Error('A Figma client is required for a live run.')

  // Write a file that will be committed (anything under figma/ outside .cache).
  const writeCommitted = (absPath, data) => {
    const bytes = Buffer.byteLength(data)
    if (bytes > maxCommittedBytes) {
      throw new Error(`${relative(root, absPath)} is ${(bytes / 1024 / 1024).toFixed(1)}MB, over the ${(maxCommittedBytes / 1024 / 1024).toFixed(0)}MB committed file limit`)
    }
    mkdirSync(dirname(absPath), { recursive: true })
    writeFileSync(absPath, data)
  }
  const writeCache = (absPath, data) => {
    mkdirSync(dirname(absPath), { recursive: true })
    writeFileSync(absPath, data)
  }

  // Ledger of Figma API calls for this version, flushed after each call.
  const callStart = client.calls.length
  let flushed = 0
  let callsPath = null
  const flushCalls = () => {
    const fresh = client.calls.slice(callStart + flushed)
    if (!callsPath || fresh.length === 0) return
    mkdirSync(dirname(callsPath), { recursive: true })
    appendFileSync(callsPath, fresh.map(entry => JSON.stringify(entry)).join('\n') + '\n')
    flushed += fresh.length
  }
  const runCalls = () => client.calls.length - callStart
  let firstCall = true
  const figmaCall = async (fn) => {
    if (!firstCall && delayMs > 0) await sleep(delayMs)
    firstCall = false
    try {
      return await fn()
    } finally {
      flushCalls()
    }
  }

  if (args.only) return renderOnly({ args, paths, fileKey, client, download, figmaCall, writeCache, writeCommitted, log, warn, runCalls })

  // Step 0: change check (always one call).
  const meta = await figmaCall(() => client.getFileMeta(fileKey))
  const version = String(meta.version)
  const lastModified = meta.lastModified
  callsPath = join(paths.cache, 'steps', version, 'calls.jsonl')
  flushCalls()

  if (existsSync(paths.snapshot)) {
    const previous = JSON.parse(readFileSync(paths.snapshot, 'utf-8'))
    if (String(previous.version) === version && previous.lastModified === lastModified) {
      log(`[snapshot] Unchanged: version ${version}, last modified ${lastModified}. Nothing written.`)
      log(`[snapshot] Figma calls this run: ${runCalls()} / budget ${CALL_BUDGET}`)
      return { unchanged: true, calls: runCalls() }
    }
  }

  const stepsDir = join(paths.cache, 'steps', version)
  const markerPath = step => join(stepsDir, `${step}.done`)
  const readMarker = step => existsSync(markerPath(step)) ? JSON.parse(readFileSync(markerPath(step), 'utf-8')) : null
  const writeMarker = (step, data) => writeCache(markerPath(step), JSON.stringify({ step, at: now(), ...data }, null, 2) + '\n')

  log(`[snapshot] File ${fileKey} version ${version} (last modified ${lastModified})`)

  // Step 1: full file.
  let fileJson
  if (readMarker('file') && existsSync(paths.raw)) {
    log('[snapshot] file: cached, skipping fetch')
    fileJson = readGzJson(paths.raw)
  } else {
    log('[snapshot] file: fetching full file (no depth limit)')
    const body = await figmaCall(() => client.getFile(fileKey, { raw: true }))
    fileJson = JSON.parse(body)
    if (String(fileJson.version) !== version) {
      warn(`[snapshot] warning: file version ${fileJson.version} differs from change check version ${version}`)
    }
    writeCommitted(paths.raw, gzipSync(Buffer.from(body, 'utf-8')))
    writeMarker('file', { bytes: Buffer.byteLength(body) })
  }

  const { frames, warnings } = discoverFrames(fileJson)
  for (const message of warnings) warn(`[snapshot] warning: ${message}`)
  const pageCount = frames.filter(f => f.kind === 'page').length
  log(`[snapshot] discovered ${frames.length} frames (${pageCount} pages)`)

  // Step 2: image fills.
  let fills = readMarker('fills')
  if (fills) {
    log('[snapshot] fills: cached, skipping')
  } else {
    log('[snapshot] fills: fetching image fill URLs')
    const response = await figmaCall(() => client.getImageFills(fileKey))
    const urls = response?.meta?.images || {}
    const usage = collectImageFills(fileJson)
    const manifest = await manifestLib.read(paths.manifest)
    mkdirSync(paths.images, { recursive: true })
    const result = { downloaded: [], missing: [], failed: [] }
    for (const [imageRef, url] of Object.entries(urls)) {
      if (!url) {
        warn(`[snapshot] fills: no URL for imageRef ${imageRef}`)
        result.missing.push(imageRef)
        continue
      }
      try {
        const buffer = await download(url)
        const ext = sniffExtension(buffer)
        const filename = `${imageRef}${ext}`
        writeFileSync(join(paths.images, filename), buffer)
        const nodes = usage.get(imageRef) || []
        const first = nodes[0]
        const entry = {
          filename,
          originalFigmaName: first ? first.name : imageRef,
          figmaNodeId: first ? first.nodeId : null,
          figmaImageRef: imageRef,
          type: 'image',
          format: ext.slice(1),
          dimensions: first?.bounds ? { width: Math.round(first.bounds.width), height: Math.round(first.bounds.height) } : null,
          localPath: `assets/images/${filename}`,
          context: { source: 'figma-snapshot', nodeIds: nodes.map(n => n.nodeId) },
          status: 'exported'
        }
        const index = manifest.assets.findIndex(a => a.figmaImageRef === imageRef)
        if (index >= 0) {
          const existing = manifest.assets[index]
          manifest.assets[index] = {
            ...existing,
            ...entry,
            webflowAssetId: existing.webflowAssetId,
            webflowUrl: existing.webflowUrl
          }
        } else {
          manifest.assets.push(entry)
        }
        result.downloaded.push(imageRef)
      } catch (err) {
        warn(`[snapshot] fills: download failed for ${imageRef}: ${err.message}`)
        result.failed.push(imageRef)
      }
    }
    manifest.exportedAt = now()
    await manifestLib.write(manifest, paths.manifest)
    writeMarker('fills', result)
    fills = result
    log(`[snapshot] fills: ${result.downloaded.length} downloaded, ${result.missing.length} without URL, ${result.failed.length} failed`)
  }

  // Step 3: renders, one call per occupied scale tier.
  const tiers = bucketByTier(frames, capMegapixels)
  const renderStatus = {}
  for (const tier of tiers) {
    const step = `renders-${tier.scale}`
    const cached = readMarker(step)
    if (cached) {
      log(`[snapshot] ${step}: cached, skipping`)
      Object.assign(renderStatus, cached.results)
      continue
    }
    log(`[snapshot] ${step}: rendering ${tier.frames.length} frames at scale ${tier.scale}`)
    const ids = tier.frames.map(f => f.id)
    const response = await figmaCall(() => client.exportImages(fileKey, ids, 'png', { scale: tier.scale }))
    const urls = response?.images || {}
    const results = {}
    // Download every URL straight away: render URLs expire.
    for (const frame of tier.frames) {
      const url = urls[frame.id]
      if (!url) {
        warn(`[snapshot] ${step}: no render URL for ${frame.id} "${frame.name}"; retry with --only ${frame.id}`)
        results[frame.id] = 'failed'
        continue
      }
      try {
        writeCache(join(root, renderPath(frame.id)), await download(url))
        results[frame.id] = 'ok'
      } catch (err) {
        warn(`[snapshot] ${step}: download failed for ${frame.id}: ${err.message}; retry with --only ${frame.id}`)
        results[frame.id] = 'failed'
      }
    }
    writeMarker(step, { scale: tier.scale, results })
    Object.assign(renderStatus, results)
  }

  // Step 4: brand SVGs, one batched call.
  let brand = readMarker('brand')
  const groups = brandGroups(fileJson)
  if (brand) {
    log('[snapshot] brand: cached, skipping')
  } else if (groups.length === 0) {
    warn(`[snapshot] brand: no GROUP children found in brand frame ${BRAND_FRAME_ID}`)
    brand = { results: {} }
    writeMarker('brand', brand)
  } else {
    log(`[snapshot] brand: exporting ${groups.length} SVGs`)
    const response = await figmaCall(() => client.exportImages(fileKey, groups.map(g => g.id), 'svg', { svgOutlineText: true }))
    const urls = response?.images || {}
    const results = {}
    for (const group of groups) {
      const url = urls[group.id]
      if (!url) {
        warn(`[snapshot] brand: no SVG URL for ${group.id} "${group.name}"`)
        results[group.id] = 'failed'
        continue
      }
      try {
        writeCommitted(join(root, group.file), await download(url))
        results[group.id] = 'ok'
      } catch (err) {
        if (/committed file limit/.test(err.message)) throw err
        warn(`[snapshot] brand: download failed for ${group.id}: ${err.message}`)
        results[group.id] = 'failed'
      }
    }
    brand = { results }
    writeMarker('brand', brand)
  }

  // Assemble snapshot.json last.
  const brandOk = Object.values(brand.results || {}).every(status => status === 'ok')
  const snapshotFrames = frames.map(frame => {
    if (frame.kind === 'brand') {
      return { ...frame, scale: null, render: null, status: brandOk ? 'ok' : 'failed' }
    }
    const tier = tiers.find(t => t.frames.some(f => f.id === frame.id))
    return {
      ...frame,
      scale: tier.scale,
      render: renderPath(frame.id),
      status: renderStatus[frame.id] === 'ok' ? 'ok' : 'failed'
    }
  })
  const calls = readFileSync(callsPath, 'utf-8').split('\n').filter(Boolean).map(line => JSON.parse(line))
  const snapshot = {
    fileKey,
    fileName: fileJson.name,
    version,
    lastModified,
    fetchedAt: now(),
    renderCapMegapixels: capMegapixels,
    tiers: SCALE_TIERS,
    calls,
    frames: snapshotFrames
  }
  writeCommitted(paths.snapshot, JSON.stringify(snapshot, null, 2) + '\n')

  const failed = snapshotFrames.filter(f => f.status === 'failed')
  log(`[snapshot] wrote figma/snapshot.json: ${snapshotFrames.length} frames, ${failed.length} failed`)
  for (const frame of failed) log(`[snapshot]   failed: ${frame.id} "${frame.name}" (${frame.kind})`)
  if (fills.missing.length || fills.failed.length) {
    log(`[snapshot] fills: ${fills.missing.length} without URL, ${fills.failed.length} failed downloads (see warnings)`)
  }
  log(`[snapshot] Figma calls this run: ${runCalls()}; this version: ${calls.length} / budget ${CALL_BUDGET}`)
  if (calls.length > CALL_BUDGET) warn(`[snapshot] warning: over the call budget of ${CALL_BUDGET}`)
  return { unchanged: false, calls: runCalls(), snapshot }
}

function dryRun ({ args, paths, fileKey, log, warn, capMegapixels }) {
  let fileJson = null
  let source = 'none'
  if (args.fromFixture) {
    fileJson = readGzJson(resolve(args.fromFixture))
    source = args.fromFixture
  } else if (existsSync(paths.raw)) {
    fileJson = readGzJson(paths.raw)
    source = 'figma/raw/file.json.gz'
  }
  const plan = planCalls(fileKey, fileJson, capMegapixels)
  log('[snapshot] Dry run: no network requests will be made.')
  log(`[snapshot] Frame source: ${source}`)
  if (fileJson) {
    const byKind = {}
    for (const frame of plan.frames) byKind[frame.kind] = (byKind[frame.kind] || 0) + 1
    log(`[snapshot] Frames: ${Object.entries(byKind).map(([kind, count]) => `${count} ${kind}`).join(', ')}`)
    for (const message of plan.warnings) warn(`[snapshot] warning: ${message}`)
  }
  log(`[snapshot] Planned Figma calls (budget ${CALL_BUDGET}):`)
  plan.calls.forEach((call, index) => log(`  ${index + 1}. GET ${call.endpoint}  ${call.purpose}`))
  log('[snapshot] Completed steps for the live version are skipped on a real run, so it may make fewer calls.')
  log(`[snapshot] Total planned: ${plan.calls.length} / ${CALL_BUDGET}`)
  return { dryRun: true, calls: 0, plan }
}

async function renderOnly ({ args, paths, fileKey, client, download, figmaCall, writeCache, writeCommitted, log, warn, runCalls }) {
  if (!existsSync(paths.snapshot)) throw new Error('--only needs an existing figma/snapshot.json; run a full snapshot first')
  const snapshot = JSON.parse(readFileSync(paths.snapshot, 'utf-8'))
  const frame = snapshot.frames.find(f => f.id === args.only)
  if (!frame) throw new Error(`Frame ${args.only} is not in figma/snapshot.json`)
  if (frame.kind === 'brand') throw new Error('The brand frame is exported as SVGs, not rendered')
  warn(`[snapshot] --only renders the live file, which may be newer than snapshot version ${snapshot.version}`)
  const response = await figmaCall(() => client.exportImages(fileKey, [frame.id], 'png', { scale: frame.scale }))
  const url = response?.images?.[frame.id]
  if (url) {
    try {
      writeCache(join(paths.cache, 'renders', `${idSafe(frame.id)}.png`), await download(url))
      frame.status = 'ok'
    } catch (err) {
      warn(`[snapshot] download failed for ${frame.id}: ${err.message}`)
      frame.status = 'failed'
    }
  } else {
    warn(`[snapshot] no render URL for ${frame.id} "${frame.name}"`)
    frame.status = 'failed'
  }
  snapshot.calls.push(...client.calls.slice(client.calls.length - runCalls()))
  writeCommitted(paths.snapshot, JSON.stringify(snapshot, null, 2) + '\n')
  log(`[snapshot] ${frame.id} "${frame.name}": ${frame.status}`)
  log(`[snapshot] Figma calls this run: ${runCalls()} / budget ${CALL_BUDGET}`)
  return { only: frame.id, status: frame.status, calls: runCalls() }
}

function loadEnv () {
  const envPath = join(REPO_ROOT, '.env')
  if (!existsSync(envPath) || typeof process.loadEnvFile !== 'function') return
  try { process.loadEnvFile(envPath) } catch { /* malformed .env: shell env still applies */ }
}

async function main () {
  const args = parseArgs(process.argv.slice(2))
  loadEnv()
  args.fileKey = args.fileKey || process.env.FIGMA_FILE_KEY || null
  let client = null
  if (!args.dryRun) {
    const { FigmaClient } = require('../lib/figma-client.cjs')
    client = new FigmaClient(null, { ledgerPath: join(REPO_ROOT, 'figma', '.cache', 'ledger.jsonl') })
  }
  await run({ args, client })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(err => {
    console.error(`[snapshot] Error: ${err.message}`)
    console.error('[snapshot] Completed steps are cached; re-run to resume. Do not loop on rate limit errors.')
    process.exit(1)
  })
}
