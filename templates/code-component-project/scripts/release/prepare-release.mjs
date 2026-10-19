import { execFileSync } from 'node:child_process'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { compareInventories, hashComponentProps, validateReleaseCandidate } from './release-contract.mjs'

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const requestedVersion = process.argv.find((argument) => /^\d+\.\d+\.\d+/.test(argument))
const dryRun = process.argv.includes('--dry-run')

if (!requestedVersion) {
  console.error('Usage: pnpm release:prepare <version> [--dry-run]')
  process.exit(1)
}

async function componentFiles(directory) {
  const results = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) results.push(...await componentFiles(path))
    else if (entry.name.endsWith('.webflow.tsx')) results.push(path)
  }
  return results.sort()
}

const status = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim()
if (status) {
  console.error('Release preparation requires a clean committed client repository.')
  process.exit(1)
}

const sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
const files = await componentFiles(resolve(root, 'src/components'))
const inventory = []
for (const file of files) {
  const contents = await readFile(file, 'utf8')
  const name = /name:\s*['"]([^'"]+)['"]/.exec(contents)?.[1]
  if (!name) throw new Error(`Unable to find declared component name in ${file}`)
  inventory.push({ name, file: file.slice(root.length + 1), propsHash: hashComponentProps(contents, file) })
}

const releasePath = resolve(root, 'project/releases.json')
const releases = JSON.parse(await readFile(releasePath, 'utf8'))
if (releases.releases.some((release) => release.version === requestedVersion)) {
  console.error(`Release ${requestedVersion} already exists.`)
  process.exit(1)
}
const previous = [...releases.releases].reverse().find((release) => release.status === 'production') ?? releases.releases.at(-1)
const migrationNotes = process.env.RELEASE_MIGRATION_NOTES ?? ''
const candidate = {
  version: requestedVersion,
  previousVersion: previous?.version ?? '0.0.0',
  sourceRevision,
  createdAt: new Date().toISOString(),
  status: 'candidate',
  stagingApproved: false,
  inventory,
  inventoryChanges: compareInventories(previous?.inventory ?? [], inventory),
  migrationNotes,
  toolchain: { node: process.version, webflowCli: '2.1.1' }
}
const errors = validateReleaseCandidate(candidate)
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

if (!dryRun) {
  releases.releases.push(candidate)
  await writeFile(releasePath, `${JSON.stringify(releases, null, 2)}\n`)
}
console.log(JSON.stringify(candidate, null, 2))
