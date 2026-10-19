import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

// The DevLink CLI rewrites library.globals from a relative path to an absolute
// filesystem path on every bundle/import run. Absolute paths break portability
// and must never be committed, so this lint fails when any string leaf in
// webflow.json looks like an absolute path.
export function isAbsolutePathValue(value) {
  if (typeof value !== 'string') return false
  // Unix absolute path (leading slash), Windows drive path (C:\ or C:/),
  // or Windows UNC path (\\server\share).
  return /^\//.test(value) || /^[a-zA-Z]:[\\/]/.test(value) || /^\\\\/.test(value)
}

export function findAbsolutePaths(data, keyPath = '') {
  const findings = []
  if (typeof data === 'string') {
    if (isAbsolutePathValue(data)) findings.push({ key: keyPath || '(root)', value: data })
  } else if (Array.isArray(data)) {
    data.forEach((entry, index) => findings.push(...findAbsolutePaths(entry, `${keyPath}[${index}]`)))
  } else if (data && typeof data === 'object') {
    for (const [key, entry] of Object.entries(data)) {
      const childPath = keyPath ? `${keyPath}.${key}` : key
      findings.push(...findAbsolutePaths(entry, childPath))
    }
  }
  return findings
}

export async function lintWebflowJson(inputPath) {
  const raw = await readFile(inputPath, 'utf8')
  const data = JSON.parse(raw)
  return findAbsolutePaths(data).sort((left, right) => left.key.localeCompare(right.key))
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
  const inputPath = resolve(root, 'webflow.json')
  try {
    const findings = await lintWebflowJson(inputPath)
    if (findings.length) {
      console.error('Absolute filesystem paths found in webflow.json. These break portability and must not be committed.')
      console.error('Reset offending values to a relative path (e.g. ./src/globals.webflow.ts):')
      for (const { key, value } of findings) console.error(`  ${key}: ${value}`)
      process.exitCode = 1
    } else {
      console.log('webflow.json is clean: no absolute filesystem paths found.')
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
