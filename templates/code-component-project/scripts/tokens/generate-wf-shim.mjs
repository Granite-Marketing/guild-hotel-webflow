import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { cssName, validateTokenLedger } from './generate.mjs'

// Webflow emits a CSS custom property for every Variable as
// `--_<collection>---<name>`, where the collection name is lowercased with
// non-alphanumeric runs collapsed to a single hyphen (e.g. collection "Colors"
// + var "color-primary" -> `--_colors---color-primary`). The variable name is
// already authored as a slug in the ledger, so it is used verbatim.
export function webflowCssName(collection, name) {
  return `--_${cssName(collection)}---${name}`
}

function validateWebflowMappings(ledger) {
  const errors = []
  for (const [key, token] of Object.entries(ledger?.tokens ?? {})) {
    const webflow = token?.webflow
    if (typeof webflow?.collection !== 'string' || !webflow.collection.trim()) {
      errors.push(`${key} must define webflow.collection to build the bridge shim.`)
    }
    if (typeof webflow?.name !== 'string' || !webflow.name.trim()) {
      errors.push(`${key} must define webflow.name to build the bridge shim.`)
    }
  }
  return errors
}

export function generateWfShim(ledger) {
  const errors = [...validateTokenLedger(ledger), ...validateWebflowMappings(ledger)]
  if (errors.length) throw new Error(errors.join('\n'))

  const aliasLines = Object.values(ledger.tokens)
    .map((token) => ({
      alias: token.webflow.cssVariable,
      target: webflowCssName(token.webflow.collection, token.webflow.name),
    }))
    .sort((left, right) => left.alias.localeCompare(right.alias))
    .map(({ alias, target }) => `    ${alias}: var(${target});`)

  return `<!-- Generated from project/tokens.json by scripts/tokens/generate-wf-shim.mjs. Do not edit directly. -->
<!-- Paste into Webflow site head code. Aliases friendly --wf-* token names onto Webflow's generated Variable cssNames. -->
<style>
  :root {
${aliasLines.join('\n')}
  }
</style>
`
}

export async function generateWfShimFile(inputPath, outputPath, { check = false } = {}) {
  const ledger = JSON.parse(await readFile(inputPath, 'utf8'))
  const shim = generateWfShim(ledger)
  if (check) {
    const current = await readFile(outputPath, 'utf8').catch(() => '')
    if (current !== shim) throw new Error('Generated Webflow bridge shim is stale. Run pnpm tokens:shim.')
  } else {
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, shim)
  }
  return { tokenCount: Object.keys(ledger.tokens).length, outputPath }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
  const inputPath = resolve(root, 'project/tokens.json')
  const outputPath = resolve(root, 'project/generated/wf-bridge-shim.html')
  try {
    const result = await generateWfShimFile(inputPath, outputPath, { check: process.argv.includes('--check') })
    if (!process.argv.includes('--check')) console.log(`Generated ${result.outputPath}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
