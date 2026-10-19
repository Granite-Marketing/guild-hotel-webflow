import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { normalizeSnapshot, REQUIRED_COVERAGE_DOMAINS } from './diff-webflow-state.mjs'

function redact(value) {
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([key]) => !/(token|secret|authorization)/i.test(key)).map(([key, item]) => [key, redact(item)]))
  }
  return value
}

export function createReadOnlySnapshot(rawState, retrievedAt = new Date().toISOString()) {
  if (!rawState?.siteId) throw new Error('Raw Webflow state requires siteId.')
  if (!rawState?.coverage || typeof rawState.coverage !== 'object') throw new Error('Raw Webflow state requires coverage metadata.')
  for (const domain of REQUIRED_COVERAGE_DOMAINS) {
    if (!['complete', 'incomplete', 'unavailable'].includes(rawState.coverage[domain])) {
      throw new Error(`Raw Webflow state coverage for ${domain} must be complete, incomplete, or unavailable.`)
    }
  }
  const normalized = normalizeSnapshot(redact(rawState))
  return { ...normalized, retrievedAt, mutationPerformed: false }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputPath = resolve(process.argv[2] ?? 'project/drift/raw-webflow-state.json')
  const outputPath = resolve(process.argv[3] ?? 'project/drift/current-snapshot.json')
  try {
    const raw = JSON.parse(await readFile(inputPath, 'utf8'))
    await writeFile(outputPath, `${JSON.stringify(createReadOnlySnapshot(raw), null, 2)}\n`)
    console.log(`Wrote read-only snapshot to ${outputPath}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
