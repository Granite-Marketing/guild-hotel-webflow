// Generates preview.css and preview.html from plan.json, then (with --shoot)
// screenshots each variant at 1440 and 390 wide.
// Usage: node docs/figma/build-plans/Q023/generate-preview.mjs [--shoot]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

// Variable values from figma/tokens.json (mapping.colors) and decisions.md D01, until Q001 syncs them live.
const variableValues = {
  'color-neutral-100': '#F4EFDF',
  'color-accent': '#29310C',
  'color-brand-4a1217': '#4A1217',
}

// The brand fonts are uploaded to Webflow only, so the preview swaps in the
// closest macOS system faces. Plan values keep the real family names.
const fontFallbacks = {
  Morello: '"Snell Roundhand", "Apple Chancery", cursive',
  '"Sackers Heavy Gothic"': 'Copperplate, "Copperplate Gothic", serif',
}
const bodyFont = '"Avenir Next", Avenir, system-ui, sans-serif'

// Reused classes keep their site values; these mirror CLAUDE.md, docs/reference/breakpoints.md
// and the figma/tokens.json mapping targets (Morello 80/96 -> heading-style-h1, Paragraph -> text-size-medium).
const reusedClassStyles = {
  'padding-global': { desktop: { 'padding-left': '2rem', 'padding-right': '2rem' } },
  'container-large': { desktop: { width: '100%', 'max-width': '80rem', 'margin-left': 'auto', 'margin-right': 'auto' } },
  'heading-style-h1': {
    desktop: { 'font-size': '5rem', 'line-height': '1.1', 'font-weight': '700' },
    tablet: { 'font-size': '4rem' },
    mobileLandscape: { 'font-size': '3.25rem' },
    mobilePortrait: { 'font-size': '2.75rem' },
  },
  'text-size-medium': {
    desktop: { 'font-size': '1.25rem', 'line-height': '1.3' },
    mobilePortrait: { 'font-size': '1.125rem' },
  },
}

const breakpoints = [
  ['desktop', null],
  ['tablet', 991],
  ['mobileLandscape', 767],
  ['mobilePortrait', 479],
]

const previewValue = (property, value) =>
  property === 'font-family' ? fontFallbacks[value] ?? value : value

const declarations = (styles) =>
  Object.entries(styles ?? {})
    .map(([property, value]) => `  ${property}: ${previewValue(property, value)};`)
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
css += `:root {\n${rootVariables}\n}\n\n*, *::before, *::after { box-sizing: border-box; }\n`
css += `body { margin: 0; font-family: ${bodyFont}; }\np { margin: 0; }\n\n`
css += `/* Preview only: stand-in for the Q021 venue-card panels that fill the panels slot. */\n`
css += `[data-preview-standin] { position: absolute; inset: 0; margin: 0; }\n`
css += `[data-preview-standin] img { display: block; width: 100%; height: 100%; object-fit: cover; }\n\n`
for (const [breakpoint, maxWidth] of breakpoints) {
  const rules = ruleBlocks[breakpoint].join('\n\n')
  if (!rules) continue
  css += maxWidth ? `@media (max-width: ${maxWidth}px) {\n${rules}\n}\n\n` : `${rules}\n\n`
}
writeFileSync(join(planDir, 'preview.css'), css)

const escapeHtml = (text) =>
  String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const assetPath = (localPath) => relative(planDir, join(repoRoot, localPath))
const fillPlaceholders = (value, content) =>
  String(value).replace(/\{([^}]+)\}/g, (_, key) => String(content[key] ?? '').replaceAll('\n', ' '))

const renderNode = (node, instance) => {
  const { content } = instance
  if (node.slot === 'panels') {
    if (instance.variant !== 'is-media') return ''
    return content.panels
      .map(
        (panel, index) =>
          `<figure data-preview-standin data-scroll-enlarge-snap-item data-panel="${panel}"${index ? ' hidden' : ''}><img src="${assetPath(content.previewPanelImage)}" alt="" loading="eager"></figure>`,
      )
      .join('')
  }
  if (node.repeat === 'tabs') {
    return content.tabs
      .map((tab, index) => {
        const classes = [...node.classes, ...(index === content.activeTab ? ['is-active'] : [])]
        const attributes = { ...node.attributes, href: tab.href }
        if (index === content.activeTab) attributes['aria-current'] = 'true'
        const attributeText = Object.entries(attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('')
        return `<a class="${classes.join(' ')}"${attributeText}>${escapeHtml(tab.label)}</a>`
      })
      .join('')
  }
  const classes = [...node.classes]
  for (const variant of plan.variants) {
    if (variant.modifier === instance.variant && classes.includes(variant.on)) classes.push(variant.modifier)
  }
  const attributes = Object.fromEntries(
    Object.entries(node.attributes).map(([key, value]) => [key, fillPlaceholders(value, content)]),
  )
  const attributeText = Object.entries(attributes).map(([key, value]) => ` ${key}="${escapeHtml(value)}"`).join('')
  const classText = classes.length ? ` class="${classes.join(' ')}"` : ''
  const inner = node.prop
    ? escapeHtml(content[node.prop]).replaceAll('\n', '<br>')
    : node.children.map((child) => renderNode(child, instance)).join('')
  return `<${node.tag}${classText}${attributeText}>${inner}</${node.tag}>`
}

const shots = {
  base: 'press',
  'is-media-wellness': 'wellness-collection',
  'is-media-meetings': 'meetings-collection',
}
const instanceBlocks = Object.values(shots).map((page) => {
  const instance = plan.instances.find((candidate) => candidate.page === page)
  return `<div data-preview="${page}" data-variant="${instance.variant}">\n${plan.tree.map((node) => renderNode(node, instance)).join('')}\n</div>`
})

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q023 tab-pills-intro preview</title>
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
