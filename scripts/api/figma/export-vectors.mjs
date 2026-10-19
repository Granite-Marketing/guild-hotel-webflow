#!/usr/bin/env node
// Exports every distinct vector-only shape inside page and side frames as SVG
// in one batched Figma call, then writes figma/vectors/index.json so specs and
// build briefs can map node ids to files. Each use carries its frame id and
// frame-relative box so it can be matched to a sliced section by y range. Reads the committed raw file and
// snapshot; skips the call when this file version was already exported.
//
// Usage: node scripts/api/figma/export-vectors.mjs [--dry-run]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { gunzipSync } from 'node:zlib'

import { collectVectors, vectorFilename } from './lib/vectors.mjs'

const require = createRequire(import.meta.url)
const { FigmaClient } = require('../lib/figma-client.cjs')

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH_SIZE = 100

function loadEnv () {
  const envPath = join(ROOT, '.env')
  if (existsSync(envPath)) process.loadEnvFile(envPath)
}

async function main () {
  const dryRun = process.argv.includes('--dry-run')
  const snapshot = JSON.parse(readFileSync(join(ROOT, 'figma/snapshot.json'), 'utf-8'))
  const fileJson = JSON.parse(gunzipSync(readFileSync(join(ROOT, 'figma/raw/file.json.gz'))).toString('utf-8'))
  const frameIds = snapshot.frames.filter(f => f.kind === 'page' || f.kind === 'side').map(f => f.id)
  const vectors = collectVectors(fileJson, frameIds)
  const batches = Math.ceil(vectors.length / BATCH_SIZE)
  console.log(`[vectors] ${vectors.length} distinct shapes, ${vectors.reduce((n, v) => n + v.uses.length, 0)} uses, ${batches} Figma call(s)`)

  const outDir = join(ROOT, 'figma/vectors')
  const marker = join(ROOT, 'figma/.cache/steps', String(snapshot.version), 'vectors.done')
  if (dryRun) return
  mkdirSync(outDir, { recursive: true })

  if (!existsSync(marker)) {
    loadEnv()
    const client = new FigmaClient(undefined, { ledgerPath: join(ROOT, 'figma/.cache/ledger.jsonl') })
    for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
      const batch = vectors.slice(i, i + BATCH_SIZE)
      const response = await client.exportImages(snapshot.fileKey, batch.map(v => v.id), 'svg', { svgOutlineText: true })
      const urls = response?.images || {}
      for (const vector of batch) {
        const url = urls[vector.id]
        if (!url) {
          console.warn(`[vectors] no SVG URL for ${vector.id} "${vector.name}"`)
          continue
        }
        const res = await fetch(url)
        if (!res.ok) {
          console.warn(`[vectors] download failed for ${vector.id}: HTTP ${res.status}`)
          continue
        }
        writeFileSync(join(outDir, vectorFilename(vector)), Buffer.from(await res.arrayBuffer()))
      }
    }
    mkdirSync(dirname(marker), { recursive: true })
    writeFileSync(marker, 'done\n')
  } else {
    console.log('[vectors] already exported for this version, rewriting index only')
  }

  const index = vectors.map(v => {
    const file = `figma/vectors/${vectorFilename(v)}`
    return {
      file: existsSync(join(ROOT, file)) ? file : null,
      id: v.id,
      name: v.name,
      width: v.width,
      height: v.height,
      type: v.type,
      useCount: v.uses.length,
      uses: [...v.uses].sort((a, b) => a.id.localeCompare(b.id))
    }
  })
  writeFileSync(join(outDir, 'index.json'), JSON.stringify({ version: snapshot.version, vectors: index }, null, 2) + '\n')
  console.log(`[vectors] wrote figma/vectors/index.json (${index.filter(v => v.file).length} files)`)
}

main().catch(err => {
  console.error(`[vectors] ${err.message}`)
  process.exit(1)
})
