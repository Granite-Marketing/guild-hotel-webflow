import { execFileSync, spawnSync } from 'node:child_process'
import { readFile, rm, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { validatePendingImport, validateProductionPromotion } from './release-contract.mjs'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const version = process.argv.find((argument) => /^\d+\.\d+\.\d+(?:[-+].*)?$/.test(argument))
const rollback = process.argv.includes('--rollback')
const acknowledgePending = process.argv.includes('--acknowledge-pending')
if (!version) {
  console.error('Usage: pnpm devlink:import:production <version>')
  process.exit(1)
}

function runPnpm(arguments_) {
  const npmExecutable = process.env.npm_execpath
  const command = npmExecutable ? process.execPath : 'pnpm'
  const args = npmExecutable ? [npmExecutable, ...arguments_] : arguments_
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const releasePath = resolve(root, 'project/releases.json')
const pendingPath = resolve(root, 'project/production-import-pending.json')
const pending = await readFile(pendingPath, 'utf8').then(JSON.parse).catch((error) => {
  if (error.code === 'ENOENT') return null
  throw error
})
const pendingErrors = validatePendingImport({
  pending,
  version,
  acknowledge: acknowledgePending,
  confirmation: process.env.CONFIRM_WEBFLOW_IMPORT_STATE,
})
if (pendingErrors.length) {
  console.error(pendingErrors.join('\n'))
  process.exit(1)
}
if (acknowledgePending) {
  await rm(pendingPath, { force: true })
  console.log(`Acknowledged reconciled pending import ${version}. Run the import command again as a separate step.`)
  process.exit(0)
}
const document = JSON.parse(await readFile(releasePath, 'utf8'))
const release = document.releases.find((candidate) => candidate.version === version)
const currentRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
const isClean = !execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()
let changedSinceSource = []
if (release?.sourceRevision) {
  changedSinceSource = execFileSync('git', ['diff', '--name-only', `${release.sourceRevision}..HEAD`], { cwd: root, encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean)
}
let errors = validateProductionPromotion({ release, currentRevision, changedSinceSource, isClean, rollback })
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

runPnpm(['run', 'release:check'])

const revisionBeforeImport = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
const cleanBeforeImport = !execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()
let changesBeforeImport = []
if (release?.sourceRevision) {
  changesBeforeImport = execFileSync('git', ['diff', '--name-only', `${release.sourceRevision}..HEAD`], { cwd: root, encoding: 'utf8' }).trim().split('\n').filter(Boolean)
}
errors = validateProductionPromotion({ release, currentRevision: revisionBeforeImport, changedSinceSource: changesBeforeImport, isClean: cleanBeforeImport, rollback })
if (errors.length) {
  console.error(`Production pre-import recheck failed:\n${errors.join('\n')}`)
  process.exit(1)
}

await writeFile(pendingPath, `${JSON.stringify({ version, rollback, sourceRevision: release.sourceRevision, startedAt: new Date().toISOString() }, null, 2)}\n`)
runPnpm(['run', '_devlink:import:production'])

for (const candidate of document.releases) {
  if (candidate.status === 'production') candidate.status = 'superseded'
}
release.status = 'production'
release.productionImportedAt = new Date().toISOString()
release.productionRevision = currentRevision
await writeFile(releasePath, `${JSON.stringify(document, null, 2)}\n`)
await rm(pendingPath, { force: true })
console.log(`Imported release ${version}. Review and commit the production metadata, then publish the Webflow site through its confirmed publish flow.`)
