import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const version = process.argv.find((argument) => /^\d+\.\d+\.\d+/.test(argument))
if (!version) {
  console.error('Usage: pnpm release:rollback <version>')
  process.exit(1)
}

const releases = JSON.parse(await readFile(resolve(root, 'project/releases.json'), 'utf8'))
const release = releases.releases.find((candidate) => candidate.version === version)
if (!release) {
  console.error(`Unknown release ${version}. No Webflow changes were made.`)
  process.exit(1)
}
if (!['production', 'superseded'].includes(release.status) || !release.productionRevision || !release.productionImportedAt) {
  console.error(`Release ${version} was not previously imported to production and cannot be a rollback target. No Webflow changes were made.`)
  process.exit(1)
}

console.log(JSON.stringify({
  mutationPerformed: false,
  target: release,
  nextSteps: [
    `Check out verified revision ${release.productionRevision ?? release.sourceRevision}.`,
    'Run pnpm install --frozen-lockfile and pnpm release:check.',
    `Import the exact verified library with pnpm devlink:import:production ${version} --rollback.`,
    'Verify the Webflow staging domain before publishing the site.'
  ]
}, null, 2))
