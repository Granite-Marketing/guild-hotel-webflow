import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

import { scanClientBoundary } from './validate-client-boundary.mjs'

const [, , destinationArgument, libraryNameArgument] = process.argv

if (!destinationArgument) {
  console.error('Usage: pnpm create:client <destination> [library name]')
  process.exit(1)
}

const destination = resolve(destinationArgument)
const projectSlug = basename(destination)
  .toLowerCase()
  .replace(/[^a-z0-9-]+/g, '-')
  .replace(/^-|-$/g, '')
const libraryName = libraryNameArgument ?? projectSlug
const factoryDirectory = dirname(fileURLToPath(import.meta.url))
const template = resolve(factoryDirectory, '../../templates/code-component-project')

if (!projectSlug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectSlug)) {
  console.error('Project destination must produce a non-empty package slug using letters, numbers, and hyphens.')
  process.exit(1)
}
if (!libraryName.trim() || /[\u0000-\u001f]/.test(libraryName)) {
  console.error('Library name must be non-empty and cannot contain control characters.')
  process.exit(1)
}
const replacements = new Map([
  ['{{PROJECT_SLUG}}', projectSlug],
  ['{{LIBRARY_NAME}}', libraryName],
])

function replaceTokens(value) {
  if (typeof value === 'string') {
    let result = value
    for (const [token, replacement] of replacements) result = result.replaceAll(token, replacement)
    return result
  }
  if (Array.isArray(value)) return value.map(replaceTokens)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceTokens(item)]))
  return value
}

let created = false
try {
  const excludedTemplatePaths = new Set(['node_modules', 'dist', 'playwright-report', 'test-results'])
  try {
    await mkdir(destination)
    created = true
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`Destination already exists: ${destination}`)
    throw error
  }
  for (const entry of await readdir(template)) {
    if (excludedTemplatePaths.has(entry)) continue
    await cp(resolve(template, entry), resolve(destination, entry), { recursive: true, errorOnExist: true, force: false })
  }

  const clientMaintenanceScripts = [
    'diff-webflow-state.mjs',
    'inspect-webflow.mjs',
    'probe-webflow-capabilities.mjs',
    'validate-blueprint.mjs',
  ]
  const clientScriptsDirectory = resolve(destination, 'scripts/project')
  await mkdir(clientScriptsDirectory, { recursive: true })
  for (const scriptName of clientMaintenanceScripts) {
    await cp(resolve(factoryDirectory, scriptName), resolve(clientScriptsDirectory, scriptName), { errorOnExist: true, force: false })
  }

  for (const relativePath of ['package.json', 'webflow.json', 'project/blueprint.json']) {
    const filePath = resolve(destination, relativePath)
    const parsed = JSON.parse(await readFile(filePath, 'utf8'))
    await writeFile(filePath, `${JSON.stringify(replaceTokens(parsed), null, 2)}\n`)
  }
  for (const relativePath of ['README.md']) {
    const filePath = resolve(destination, relativePath)
    await writeFile(filePath, replaceTokens(await readFile(filePath, 'utf8')))
  }

  const findings = await scanClientBoundary(destination)
  if (findings.length) throw new Error(`Client boundary validation failed:\n${JSON.stringify(findings, null, 2)}`)

  const git = spawnSync('git', ['init', '--quiet', destination], { encoding: 'utf8' })
  if (git.status !== 0) throw new Error(`Unable to initialize independent git repository: ${git.stderr.trim()}`)

  console.log(`Created client-safe Webflow code-component project at ${destination}`)
  console.log('Next: cd into the project, run pnpm install, then pnpm dev')
} catch (error) {
  if (created) await rm(destination, { recursive: true, force: true })
  console.error(error.message)
  process.exitCode = 1
}
