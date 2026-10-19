import { execFileSync, spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { validateStagingApproval } from './release-contract.mjs'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const version = process.argv.find((argument) => /^\d+\.\d+\.\d+(?:[-+].*)?$/.test(argument))
if (!version) {
  console.error('Usage: pnpm release:approve-staging <version>')
  process.exit(1)
}

const releasePath = resolve(root, 'project/releases.json')
const document = JSON.parse(await readFile(releasePath, 'utf8'))
const release = document.releases.find((candidate) => candidate.version === version)
const isClean = !execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()
const changedSinceSource = release?.sourceRevision
  ? execFileSync('git', ['diff', '--name-only', `${release.sourceRevision}..HEAD`], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean)
  : []
const approvalErrors = validateStagingApproval({ release, changedSinceSource, isClean })
if (approvalErrors.length) {
  console.error(approvalErrors.join('\n'))
  process.exit(1)
}

if (!process.env.WEBFLOW_SMOKE_URL) {
  console.error('Set WEBFLOW_SMOKE_URL to the imported Webflow staging page before approval.')
  process.exit(1)
}
const npmExecutable = process.env.npm_execpath
const command = npmExecutable ? process.execPath : 'pnpm'
const arguments_ = npmExecutable ? [npmExecutable, 'run', 'release:check'] : ['run', 'release:check']
const smoke = spawnSync(command, arguments_, { cwd: root, encoding: 'utf8', stdio: 'inherit', env: process.env })
if (smoke.status !== 0) {
  console.error('Release checks or Webflow staging smoke verification failed; approval was not recorded.')
  process.exit(smoke.status ?? 1)
}

release.status = 'staging'
release.stagingApproved = true
release.stagingApprovedAt = new Date().toISOString()
release.stagingReceipt = {
  sourceRevision: release.sourceRevision,
  url: process.env.WEBFLOW_SMOKE_URL,
  verifiedAt: release.stagingApprovedAt
}
await writeFile(releasePath, `${JSON.stringify(document, null, 2)}\n`)
console.log(`Approved ${version} for production promotion after the metadata change is reviewed and committed.`)
