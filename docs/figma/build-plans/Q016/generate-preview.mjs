// Generates preview.css and preview.html from plan.json, then (with --shoot)
// screenshots each preview block at 1440 and 390 wide, and (with --validate)
// checks that every class in the tree is declared in the plan.
// Usage: node docs/figma/build-plans/Q016/generate-preview.mjs [--validate] [--shoot]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

// Variable values from figma/tokens.json (mapping.colors, mapping.fontVariables) until Q001 syncs them live.
// Fonts are not installed locally, so each font variable carries a fallback stack.
const variableValues = {
  'color-neutral-100': '#F4EFDF',
  'color-neutral-900': '#262118',
  'color-accent': '#29310C',
  'font-style-heading': "'Sackers Heavy Gothic', Copperplate, 'Arial Narrow', sans-serif",
  'font-style-body': "'Gatch Test', 'Avenir Next', Avenir, sans-serif",
}

// Reused classes keep their site values; these mirror CLAUDE.md, docs/reference/breakpoints.md
// and the figma/tokens.json class values.
const reusedClassStyles = {
  'padding-global': { desktop: { 'padding-left': '2rem', 'padding-right': '2rem' } },
  'container-large': { desktop: { width: '100%', 'max-width': '80rem', 'margin-left': 'auto', 'margin-right': 'auto' } },
  'heading-style-h1': { desktop: { 'font-family': 'var(--font-style-heading)', 'font-size': '3.5rem', 'line-height': '1', 'text-transform': 'lowercase' } },
  'text-size-medium': { desktop: { 'font-size': '1.25rem', 'line-height': '1.3' } },
  'text-size-regular': { desktop: { 'font-size': '1rem', 'line-height': '1.5' } },
  'text-weight-normal': { desktop: { 'font-weight': '400' } },
}

const breakpoints = [
  ['desktop', null],
  ['tablet', 991],
  ['mobileLandscape', 767],
  ['mobilePortrait', 479],
]

// Every class in the tree must be reused, in the family, proposed as shared, or a modifier.
const declaredClasses = new Set([
  ...plan.reusedClasses,
  ...plan.familyClasses.map((familyClass) => familyClass.name),
  ...plan.proposedShared.map((sharedClass) => sharedClass.name),
])
const treeClasses = new Set()
const collectClasses = (node) => {
  node.classes.forEach((name) => treeClasses.add(name))
  node.children.forEach(collectClasses)
}
plan.tree.forEach(collectClasses)
const undeclared = [...treeClasses].filter((name) => !declaredClasses.has(name))
const variantTargets = plan.variants.filter((variant) => !declaredClasses.has(variant.on))
const instanceModifiers = plan.instances.flatMap((instance) =>
  Object.entries(instance.modifiers ?? {}).flatMap(([on, modifiers]) =>
    modifiers.filter((modifier) => !plan.variants.some((variant) => variant.on === on && variant.modifier === modifier)).map((modifier) => `${on}.${modifier}`),
  ),
)
const unknownVariables = plan.variables.filter((name) => !(name in variableValues))
const problems = [
  ...undeclared.map((name) => `class in tree not declared: ${name}`),
  ...variantTargets.map((variant) => `variant ${variant.modifier} targets undeclared class ${variant.on}`),
  ...instanceModifiers.map((name) => `instance modifier not declared in variants: ${name}`),
  ...unknownVariables.map((name) => `variable without a preview value: ${name}`),
]
if (process.argv.includes('--validate')) {
  if (problems.length) {
    console.error(problems.join('\n'))
    process.exit(1)
  }
  console.log(`plan.json valid: ${treeClasses.size} tree classes, all declared`)
}

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
// Shared typography combos follow their base class, family classes follow both, as in Webflow's cascade.
for (const sharedClass of plan.proposedShared) {
  addRule(sharedClass.comboOn ? `.${sharedClass.comboOn}.${sharedClass.name}` : `.${sharedClass.name}`, sharedClass.styles)
}
for (const familyClass of plan.familyClasses) addRule(`.${familyClass.name}`, familyClass.styles)
for (const variant of plan.variants) addRule(`.${variant.on}.${variant.modifier}`, variant.styleDeltas)

const rootVariables = plan.variables.map((name) => `  --${name}: ${variableValues[name]};`).join('\n')
let css = `/* Generated from plan.json by generate-preview.mjs. Do not edit by hand. */\n`
css += `:root {\n${rootVariables}\n}\n\n*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: var(--font-style-body); }\nh2, p, figure { margin: 0; }\n\n`
for (const [breakpoint, maxWidth] of breakpoints) {
  const rules = ruleBlocks[breakpoint].join('\n\n')
  if (!rules) continue
  css += maxWidth ? `@media (max-width: ${maxWidth}px) {\n${rules}\n}\n\n` : `${rules}\n\n`
}
writeFileSync(join(planDir, 'preview.css'), css)

const escapeHtml = (text) => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
const assetPath = (localPath) => relative(planDir, join(repoRoot, localPath))
const linkProps = { backLinkUrl: 'backLink', ctaUrl: 'cta' }

const renderNode = (node, instance) => {
  const content = instance.content
  if (node.optionalProp && !content[node.optionalProp]) return ''
  const classes = [...node.classes]
  const variantDef = plan.variants.find((variant) => variant.modifier === instance.variant)
  if (variantDef && classes.includes(variantDef.on)) classes.push(variantDef.modifier)
  for (const [on, modifiers] of Object.entries(instance.modifiers ?? {})) {
    if (classes.includes(on)) classes.push(...modifiers)
  }
  const attributes = { ...node.attributes }
  if (node.tag === 'img') {
    const source = node.prop === 'image' ? content.image : attributes.src
    attributes.src = assetPath(source)
    attributes.alt = node.prop === 'image' ? (content['image alt'] ?? '') : (attributes.alt ?? '')
    attributes.loading = 'eager'
  }
  if (node.tag === 'a') {
    const urlProp = node.prop in linkProps ? node.prop : Object.keys(linkProps).find((key) => linkProps[key] === node.prop)
    if (urlProp && content[urlProp]) attributes.href = content[urlProp]
  }
  const classText = classes.length ? ` class="${classes.join(' ')}"` : ''
  const attributeText = Object.entries(attributes)
    .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
    .join('')
  const open = `<${node.tag}${classText}${attributeText}>`
  if (node.tag === 'img') return open
  const textProp = node.prop && !(node.prop in linkProps) ? node.prop : null
  const inner = node.children.length
    ? node.children.map((child) => renderNode(child, instance)).join('')
    : textProp
      ? escapeHtml(content[textProp] ?? '')
      : ''
  return `${open}${inner}</${node.tag}>`
}

// One preview block per distinct content form: the base reference, the is-tall reference,
// and the two base instances that exercise the element modifiers and optional slots.
const previews = [
  { name: 'base', section: 'dining-collection/02-first-sips-small-bites-big-nights' },
  { name: 'is-tall', section: 'home/02-a-century-of-stories-meets-a' },
  { name: 'base-stamp', section: 'rooms-collection/02-a-room-for-every-stay' },
  { name: 'base-back-link', section: 'rooms-individual/02-back-to-rooms' },
]
const blocks = previews.map(({ name, section }) => {
  const instance = plan.instances.find((candidate) => candidate.section === section)
  return `<div data-preview="${name}" data-section="${section}">\n${plan.tree.map((node) => renderNode(node, instance)).join('')}\n</div>`
})

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q016 script-intro-centered preview</title>
<link rel="stylesheet" href="preview.css">
</head>
<body>
${blocks.join('\n')}
</body>
</html>
`
writeFileSync(join(planDir, 'preview.html'), html)
console.log('wrote preview.css and preview.html')

if (process.argv.includes('--shoot')) {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
    await page.waitForLoadState('networkidle')
    for (const { name } of previews) {
      await page.locator(`[data-preview="${name}"]`).screenshot({ path: join(planDir, `preview-${name}-${width}.png`) })
    }
    await page.close()
  }
  await browser.close()
  console.log('wrote preview screenshots')
}
