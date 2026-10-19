import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const required = ['pages', 'seo', 'componentDiscovery', 'componentPlacement', 'props', 'cmsBindings', 'variables', 'readBack']
const statuses = new Set(['automatic', 'manual-only', 'unavailable'])

export function compileCapabilityMatrix(probe) {
  const errors = []
  if (!probe.siteId) errors.push('Capability probe requires siteId.')
  const capabilities = {}
  const evidence = {}
  for (const capability of required) {
    const result = probe.results?.[capability]
    if (!statuses.has(result?.status)) errors.push(`${capability} requires automatic, manual-only, or unavailable status.`)
    if (!result?.evidence?.trim()) errors.push(`${capability} requires observed evidence.`)
    capabilities[capability] = result?.status ?? 'probe-required'
    evidence[capability] = result?.evidence ?? null
  }
  if (errors.length) throw new Error(errors.join('\n'))
  return { version: 1, siteId: probe.siteId, inspectedAt: probe.inspectedAt ?? new Date().toISOString(), capabilities, evidence }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputPath = resolve(process.argv[2] ?? 'project/webflow-capability-probe.json')
  const outputPath = resolve(process.argv[3] ?? 'project/webflow-capabilities.json')
  try {
    const matrix = compileCapabilityMatrix(JSON.parse(await readFile(inputPath, 'utf8')))
    await writeFile(outputPath, `${JSON.stringify(matrix, null, 2)}\n`)
    console.log(`Wrote capability matrix to ${outputPath}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
