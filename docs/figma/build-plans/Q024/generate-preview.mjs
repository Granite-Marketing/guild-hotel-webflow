// Generates preview.css and preview.html from plan.json, then (with --shoot)
// screenshots each variant at 1440 and 390 wide.
// Usage: node docs/figma/build-plans/Q024/generate-preview.mjs [--shoot]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

// Variable values from figma/tokens.json (mapping.colors) until Q001 syncs them live.
const variableValues = { 'color-neutral-100': '#F4EFDF' }

// Reused classes keep their site values; these mirror CLAUDE.md and docs/reference/breakpoints.md.
const reusedClassStyles = {
  'padding-global': { desktop: { 'padding-left': '2rem', 'padding-right': '2rem' } },
  'padding-section-small': {
    desktop: { 'padding-top': '3rem', 'padding-bottom': '3rem' },
    tablet: { 'padding-top': '2rem', 'padding-bottom': '2rem' },
    mobileLandscape: { 'padding-top': '1.5rem', 'padding-bottom': '1.5rem' },
    mobilePortrait: { 'padding-top': '1rem', 'padding-bottom': '1rem' },
  },
  'container-large': { desktop: { width: '100%', 'max-width': '80rem', 'margin-left': 'auto', 'margin-right': 'auto' } },
}

const breakpoints = [
  ['desktop', null],
  ['tablet', 991],
  ['mobileLandscape', 767],
  ['mobilePortrait', 479],
]

const declarations = (styles) =>
  Object.entries(styles ?? {})
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')

const ruleBlocks = { desktop: [], tablet: [], mobileLandscape: [], mobilePortrait: [] }
const addRule = (selector, stylesByBreakpoint) => {
  for (const [breakpoint] of breakpoints) {
    const body = declarations(stylesByBreakpoint[breakpoint])
    if (body) ruleBlocks[breakpoint].push(`${selector} {\n${body}\n}`)
  }
}

for (const [name, styles] of Object.entries(reusedClassStyles)) addRule(`.${name}`, styles)
for (const familyClass of plan.familyClasses) addRule(`.${familyClass.name}`, familyClass.styles)
for (const sharedClass of plan.proposedShared) addRule(`.${sharedClass.name}`, sharedClass.styles)
for (const variant of plan.variants) addRule(`.${variant.on}.${variant.modifier}`, variant.styleDeltas)

const rootVariables = plan.variables.map((name) => `  --${name}: ${variableValues[name]};`).join('\n')
let css = `/* Generated from plan.json by generate-preview.mjs. Do not edit by hand. */\n`
css += `:root {\n${rootVariables}\n}\n\n*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; }\n\n`
for (const [breakpoint, maxWidth] of breakpoints) {
  const rules = ruleBlocks[breakpoint].join('\n\n')
  if (!rules) continue
  css += maxWidth ? `@media (max-width: ${maxWidth}px) {\n${rules}\n}\n\n` : `${rules}\n\n`
}
writeFileSync(join(planDir, 'preview.css'), css)

const assetPath = (localPath) => relative(planDir, join(repoRoot, localPath))
const renderNode = (node, instance, variant) => {
  const classes = [...node.classes]
  const variantDef = plan.variants.find((v) => v.modifier === variant)
  if (variantDef && classes.includes(variantDef.on)) classes.push(variantDef.modifier)
  const attributes = { ...node.attributes }
  if (node.tag === 'img') {
    attributes.src = instance.content.image ? assetPath(instance.content.image) : 'placeholder.svg'
    attributes.alt = instance.content['image alt'] ?? ''
    attributes.loading = 'eager'
  }
  const attributeText = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${String(value).replaceAll('"', '&quot;')}"`)
    .join('')
  const open = `<${node.tag} class="${classes.join(' ')}"${attributeText}>`
  if (node.tag === 'img') return open
  return `${open}${node.children.map((child) => renderNode(child, instance, variant)).join('')}</${node.tag}>`
}

const seenVariants = new Set()
const instanceBlocks = plan.instances
  .filter((instance) => {
    const key = `${instance.variant}|${instance.content.image}`
    if (seenVariants.has(key)) return false
    seenVariants.add(key)
    return true
  })
  .map((instance) => {
    const id = instance.variant === 'base' ? `base-${instance.page}` : instance.variant
    return `<div data-preview="${id}" data-variant="${instance.variant}">\n${plan.tree.map((node) => renderNode(node, instance, instance.variant)).join('')}\n</div>`
  })

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q024 image-inset-single preview</title>
<link rel="stylesheet" href="preview.css">
</head>
<body>
${instanceBlocks.join('\n')}
</body>
</html>
`
writeFileSync(join(planDir, 'preview.html'), html)
console.log('wrote preview.css and preview.html')

if (process.argv.includes('--shoot')) {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()
  const shots = { base: 'base-rooms-individual', 'base-arts': 'base-arts', 'is-small': 'is-small' }
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
    await page.waitForLoadState('networkidle')
    for (const [name, id] of Object.entries(shots)) {
      await page.locator(`[data-preview="${id}"]`).screenshot({ path: join(planDir, `preview-${name}-${width}.png`) })
    }
    await page.close()
  }
  await browser.close()
  console.log('wrote screenshots')
}
