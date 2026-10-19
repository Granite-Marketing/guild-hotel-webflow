import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export const REQUIRED_COVERAGE_DOMAINS = ['pages', 'variables', 'cms', 'scripts', 'library']

function sortByStableKey(values = []) {
  return [...values].sort((left, right) => String(left.id ?? left.key ?? left.slug ?? left.name).localeCompare(String(right.id ?? right.key ?? right.slug ?? right.name)))
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().filter((key) => !['retrievedAt', 'updatedAt', 'createdAt'].includes(key)).map((key) => [key, stable(value[key])]))
  }
  return value
}

export function normalizeSnapshot(snapshot) {
  return stable({
    version: 1,
    siteId: snapshot.siteId,
    coverage: snapshot.coverage ?? {},
    pages: sortByStableKey(snapshot.pages).map((page) => ({ ...page, components: page.components ?? [] })),
    variables: sortByStableKey(snapshot.variables),
    cms: sortByStableKey(snapshot.cms),
    scripts: sortByStableKey(snapshot.scripts),
    library: snapshot.library ?? null,
    sourceBoundary: 'React implementation is local-only and cannot be reconstructed from Webflow.',
  })
}

function collectChanges(previous, current, path = '', changes = []) {
  if (Object.is(previous, current)) return changes
  if (typeof previous !== typeof current || previous === null || current === null || typeof current !== 'object') {
    changes.push({ path: path || '$', before: previous, after: current, owner: classifyOwner(path), resolution: 'unresolved' })
    return changes
  }
  if (Array.isArray(previous) || Array.isArray(current)) {
    if (!Array.isArray(previous) || !Array.isArray(current)) {
      changes.push({ path: path || '$', before: previous, after: current, owner: classifyOwner(path), resolution: 'unresolved' })
      return changes
    }
    const length = Math.max(previous.length, current.length)
    for (let index = 0; index < length; index += 1) collectChanges(previous[index], current[index], `${path}[${index}]`, changes)
    return changes
  }
  for (const key of new Set([...Object.keys(previous), ...Object.keys(current)])) {
    collectChanges(previous[key], current[key], path ? `${path}.${key}` : key, changes)
  }
  return changes
}

function classifyOwner(path) {
  if (path.startsWith('variables')) return 'shared'
  if (path.startsWith('pages') || path.startsWith('cms') || path.startsWith('scripts')) return 'webflow'
  if (path.startsWith('library')) return 'local-release'
  return 'unknown'
}

export function createDriftReport(previousInput, currentInput) {
  const previous = normalizeSnapshot(previousInput)
  const current = normalizeSnapshot(currentInput)
  if (previous.siteId !== current.siteId) throw new Error('Cannot compare snapshots from different Webflow sites.')
  const warnings = []
  for (const [snapshotName, coverage] of [['approved baseline', previous.coverage], ['current inspection', current.coverage]]) {
    for (const domain of REQUIRED_COVERAGE_DOMAINS) {
      const status = coverage[domain] ?? 'missing'
      if (status !== 'complete') warnings.push(`${snapshotName} ${domain} coverage is ${status}; comparison is incomplete.`)
    }
  }
  const changes = collectChanges(previous, current).filter(({ path }) => !path.startsWith('coverage'))
  return {
    version: 1,
    siteId: current.siteId,
    clean: changes.length === 0 && warnings.length === 0,
    warnings,
    changes,
    mutationPerformed: false,
    sourceBoundary: current.sourceBoundary,
  }
}

export function planDriftResolution(report, resolutions) {
  const allowed = new Set(['accept-webflow', 'restore-local', 'manual'])
  const localUpdates = []
  const webflowOperations = []
  const manualActions = []
  const unresolved = []

  for (const change of report.changes ?? []) {
    const resolution = resolutions[change.path] ?? 'unresolved'
    const resolvedChange = { ...change, resolution }
    if (!allowed.has(resolution)) {
      unresolved.push(resolvedChange)
      continue
    }
    if (resolution === 'accept-webflow') localUpdates.push({ action: 'update-local-record', ...resolvedChange })
    if (resolution === 'restore-local') webflowOperations.push({ action: 'propose-webflow-restore', ...resolvedChange })
    if (resolution === 'manual') manualActions.push({ action: 'manual-resolution', ...resolvedChange })
  }

  return { version: 1, mutationPerformed: false, localUpdates, webflowOperations, manualActions, unresolved }
}

function displayValue(value) {
  if (value === undefined) return '`undefined`'
  const serialized = JSON.stringify(value)
  const display = serialized === undefined ? String(value) : serialized
  return `\`${display.replaceAll('`', '\\`').replaceAll('|', '\\|')}\``
}

export function renderDriftMarkdown(report) {
  const lines = [
    '# Webflow drift report',
    '',
    `- Site: \`${report.siteId}\``,
    `- Status: **${report.clean ? 'clean' : 'review required'}**`,
    `- Mutations performed: **${report.mutationPerformed ? 'yes' : 'no'}**`,
    '',
  ]

  if (report.warnings?.length) {
    lines.push('## Inspection warnings', '', ...report.warnings.map((warning) => `- ${warning}`), '')
  }

  lines.push('## Changes', '')
  if (!report.changes?.length) lines.push('No meaningful changes were detected.', '')
  else {
    lines.push('| Path | Owner | Before | After | Resolution |', '| --- | --- | --- | --- | --- |')
    for (const change of report.changes) {
      lines.push(`| \`${change.path}\` | ${change.owner} | ${displayValue(change.before)} | ${displayValue(change.after)} | ${change.resolution} |`)
    }
    lines.push('')
  }

  lines.push('## Source boundary', '', report.sourceBoundary, '')
  return `${lines.join('\n')}\n`
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const resolutionIndex = process.argv.indexOf('--resolutions')
  if (resolutionIndex !== -1) {
    try {
      const reportPath = resolve(process.argv[resolutionIndex + 1] ?? '')
      const resolutionsPath = resolve(process.argv[resolutionIndex + 2] ?? '')
      const planPath = resolve(process.argv[resolutionIndex + 3] ?? '')
      if (!process.argv[resolutionIndex + 3]) throw new Error('Usage: diff-webflow-state.mjs --resolutions <report.json> <resolutions.json> <plan.json>')
      const report = JSON.parse(await readFile(reportPath, 'utf8'))
      const resolutions = JSON.parse(await readFile(resolutionsPath, 'utf8'))
      await writeFile(planPath, `${JSON.stringify(planDriftResolution(report, resolutions), null, 2)}\n`)
      console.log(`Wrote non-mutating resolution plan to ${planPath}`)
    } catch (error) {
      console.error(error.message)
      process.exitCode = 1
    }
  } else {
    const previousPath = resolve(process.argv[2] ?? 'project/drift/approved-snapshot.json')
    const currentPath = resolve(process.argv[3] ?? 'project/drift/current-snapshot.json')
    const outputPath = process.argv[4] ? resolve(process.argv[4]) : null
    try {
      const previous = JSON.parse(await readFile(previousPath, 'utf8'))
      const current = JSON.parse(await readFile(currentPath, 'utf8'))
      const report = createDriftReport(previous, current)
      const serialized = `${JSON.stringify(report, null, 2)}\n`
      if (outputPath) {
        await writeFile(outputPath, serialized)
        const markdownPath = outputPath.replace(/\.json$/i, '.md')
        if (markdownPath !== outputPath) await writeFile(markdownPath, renderDriftMarkdown(report))
      } else process.stdout.write(serialized)
    } catch (error) {
      console.error(error.message)
      process.exitCode = 1
    }
  }
}
