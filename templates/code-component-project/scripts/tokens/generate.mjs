import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const requiredBreakpoints = ['tablet', 'mobileLandscape', 'mobilePortrait']

export function cssName(value) {
  return String(value).replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase()
}

function tokenNamespace(type) {
  return type === 'color' ? 'color' : type === 'font' ? 'font' : type
}

function isIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? '')) return false
  return new Date(`${value}T00:00:00.000Z`).toISOString().startsWith(value)
}

export function validateTokenLedger(ledger) {
  const errors = []
  if (ledger?.version !== 1) errors.push('Token ledger version must be 1.')
  for (const breakpoint of requiredBreakpoints) {
    if (!Number.isInteger(ledger?.breakpoints?.[breakpoint]) || ledger.breakpoints[breakpoint] <= 0) {
      errors.push(`Breakpoint ${breakpoint} must be a positive integer pixel width.`)
    }
  }

  const rawSemanticNames = new Set()
  const normalizedSemanticNames = new Set()
  const fallbackNames = new Set()
  const webflowVariables = new Set()
  for (const [key, token] of Object.entries(ledger?.tokens ?? {})) {
    if (!token?.type || token.figma === undefined || token.approved === undefined || !token.semantic) {
      errors.push(`${key} must define type, figma, approved, and semantic values.`)
      continue
    }

    const namespace = tokenNamespace(token.type)
    const rawSemantic = `${namespace}:${token.semantic}`
    const normalizedSemantic = `${namespace}:${cssName(token.semantic)}`
    const fallbackName = `${token.type}:${cssName(token.semantic)}`
    if (rawSemanticNames.has(rawSemantic)) errors.push(`${key} duplicates semantic token ${token.semantic} in the ${namespace} namespace.`)
    if (normalizedSemanticNames.has(normalizedSemantic)) errors.push(`${key} normalizes to a duplicate semantic token ${cssName(token.semantic)} in the ${namespace} namespace.`)
    if (fallbackNames.has(fallbackName)) errors.push(`${key} produces a duplicate fallback token for ${token.semantic}.`)
    rawSemanticNames.add(rawSemantic)
    normalizedSemanticNames.add(normalizedSemantic)
    fallbackNames.add(fallbackName)

    const cssVariable = token.webflow?.cssVariable
    if (typeof cssVariable !== 'string' || !cssVariable.startsWith('--wf-')) errors.push(`${key} Webflow CSS variable must use the --wf- namespace.`)
    else if (webflowVariables.has(cssVariable)) errors.push(`${key} duplicates Webflow CSS variable ${cssVariable}.`)
    else webflowVariables.add(cssVariable)

    if (token.figma !== token.approved) {
      const override = token.override
      if (!override?.reason?.trim() || !override?.author?.trim() || !isIsoDate(override?.date)) {
        errors.push(`${key} changed from Figma and requires override reason, author, and a valid ISO date.`)
      }
    }
  }
  return errors
}

export function generateTokenCss(ledger) {
  const errors = validateTokenLedger(ledger)
  if (errors.length) throw new Error(errors.join('\n'))

  const fallbackLines = []
  const themeLines = []
  for (const token of Object.values(ledger.tokens).sort((left, right) => `${tokenNamespace(left.type)}:${left.semantic}`.localeCompare(`${tokenNamespace(right.type)}:${right.semantic}`))) {
    const semantic = cssName(token.semantic)
    const fallback = `--factory-${token.type}-${semantic}-fallback`
    fallbackLines.push(`  ${fallback}: ${token.approved};`)
    themeLines.push(`  --${tokenNamespace(token.type)}-${semantic}: var(${token.webflow.cssVariable}, var(${fallback}));`)
  }

  return `/* Generated from project/tokens.json. Do not edit directly. */
@custom-variant wf-tablet (@media (max-width: ${ledger.breakpoints.tablet}px));
@custom-variant wf-mobile-landscape (@media (max-width: ${ledger.breakpoints.mobileLandscape}px));
@custom-variant wf-mobile-portrait (@media (max-width: ${ledger.breakpoints.mobilePortrait}px));

:root {
${fallbackLines.join('\n')}
}

@theme inline {
${themeLines.join('\n')}
}
`
}

export async function generateTokenAdapters(inputPath, outputPath, { check = false } = {}) {
  const ledger = JSON.parse(await readFile(inputPath, 'utf8'))
  const css = generateTokenCss(ledger)
  if (check) {
    const current = await readFile(outputPath, 'utf8').catch(() => '')
    if (current !== css) throw new Error('Generated tokens are stale. Run pnpm tokens:generate.')
  } else {
    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, css)
  }
  return { tokenCount: Object.keys(ledger.tokens).length, outputPath }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
  const inputPath = resolve(root, 'project/tokens.json')
  const outputPath = resolve(root, 'src/styles/generated/tokens.css')
  try {
    const result = await generateTokenAdapters(inputPath, outputPath, { check: process.argv.includes('--check') })
    if (!process.argv.includes('--check')) console.log(`Generated ${result.outputPath}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
