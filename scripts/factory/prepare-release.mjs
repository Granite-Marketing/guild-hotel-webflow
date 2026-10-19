import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import process from 'node:process'

import { scanClientBoundary } from './validate-client-boundary.mjs'

const clientDirectory = resolve(process.argv[2] ?? '')
const version = process.argv[3]
if (!process.argv[2] || !version) {
  console.error('Usage: node scripts/factory/prepare-release.mjs <client-directory> <version>')
  process.exit(1)
}

const findings = await scanClientBoundary(clientDirectory)
if (findings.length) {
  console.error(`Client boundary failed:\n${JSON.stringify(findings, null, 2)}`)
  process.exit(1)
}

const result = spawnSync(process.execPath, ['scripts/release/prepare-release.mjs', version, '--dry-run'], {
  cwd: clientDirectory,
  encoding: 'utf8',
  env: process.env,
})
process.stdout.write(result.stdout)
process.stderr.write(result.stderr)
process.exitCode = result.status ?? 1
