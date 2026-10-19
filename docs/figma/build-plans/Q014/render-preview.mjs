// Renders preview.html and preview.css from plan.json, then screenshots each
// preview block at 1440 and 390 wide. Run from the repo root:
// node docs/figma/build-plans/Q014/render-preview.mjs [--no-shots]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))
const tokens = JSON.parse(readFileSync(join(repoRoot, 'figma/tokens.json'), 'utf8'))
const component = plan.component

// Variable values come from the tokens.json mapping (plus the suggested brand
// variables). The licensed fonts are not in the repo, so each falls back to a
// local face: Copperplate renders lowercase input as small caps like Sackers.
const variableValues = {}
for (const color of tokens.mapping.colors) {
  if (color.target) variableValues[color.target] ??= color.hex
  else if (color.suggestedVariable && color.opacity === 1) variableValues[color.suggestedVariable] ??= color.hex
}
const fallbacks = { 'font-style-heading': 'Copperplate, serif', 'font-style-body': '"Helvetica Neue", Arial, sans-serif' }
for (const font of tokens.mapping.fontVariables)
  variableValues[font.variable] = `"${font.value}", ${fallbacks[font.variable]}`
const missing = plan.variables.filter((name) => !variableValues[name])
if (missing.length) throw new Error(`No preview value for variables: ${missing.join(', ')}`)

// Reused classes: values Q001 sets from the tokens.json mapping, and the
// Relume utilities from CLAUDE.md and docs/reference/breakpoints.md.
const typeValues = (name) => {
  const entry = tokens.mapping.typography.find((m) => (m.source.name || m.source.key) === name)
  const v = entry.classValues
  return {
    'font-family': v.fontFamily === 'Gatch Test' ? 'var(--font-style-body)' : 'var(--font-style-heading)',
    'font-weight': String(v.fontWeight),
    'font-size': `${v.fontSizeRem}rem`,
    'line-height': String(v.lineHeight),
    'letter-spacing': `${v.letterSpacingEm}em`,
  }
}
const reusedStyles = {
  'padding-global': { desktop: { 'padding-left': '2rem', 'padding-right': '2rem' } },
  'padding-section-small': {
    desktop: { 'padding-top': '3rem', 'padding-bottom': '3rem' },
    tablet: { 'padding-top': '2rem', 'padding-bottom': '2rem' },
    mobileLandscape: { 'padding-top': '1.5rem', 'padding-bottom': '1.5rem' },
    mobilePortrait: { 'padding-top': '1rem', 'padding-bottom': '1rem' },
  },
  'container-large': { desktop: { width: '100%', 'max-width': '80rem', 'margin-left': 'auto', 'margin-right': 'auto' } },
  'heading-style-h2': { desktop: { margin: '0', ...typeValues('H2-CAPS') } },
  'text-size-large': { desktop: typeValues('Gatch Test|400|22|35.2|0|ORIGINAL') },
  'text-size-regular': { desktop: { 'font-size': '1rem' } },
  button: { desktop: { cursor: 'pointer' } },
}
const unknownReused = plan.reusedClasses.filter((name) => !reusedStyles[name])
if (unknownReused.length) throw new Error(`No preview style for reused classes: ${unknownReused.join(', ')}`)

const breakpoints = {
  desktop: null,
  tablet: '(max-width: 991px)',
  mobileLandscape: '(max-width: 767px)',
  mobilePortrait: '(max-width: 479px)',
}
const declarations = (styles) =>
  Object.entries(styles).map(([property, value]) => `  ${property}: ${value};`).join('\n')

const rulesets = [
  ...Object.entries(reusedStyles).map(([name, styles]) => ({ selector: `.${name}`, styles })),
  ...plan.familyClasses.map((c) => ({ selector: c.comboOf ? `.${c.comboOf}.${c.name}` : `.${c.name}`, styles: c.styles })),
  ...plan.proposedShared.map((c) => ({ selector: `.${c.on}.${c.name}`, styles: c.styles })),
]

let css = '/* Generated from plan.json by render-preview.mjs. Do not edit by hand. */\n'
css += `:root {\n${plan.variables.map((name) => `  --${name}: ${variableValues[name]};`).join('\n')}\n}\n`
css += '*, *::before, *::after { box-sizing: border-box; }\n'
css += 'body { margin: 0; font-family: var(--font-style-body); }\np { margin: 0; }\n'
css += '.preview-label { font: 12px/1.4 system-ui, sans-serif; padding: 8px 16px; background: #fff; color: #333; }\n'
for (const [breakpoint, query] of Object.entries(breakpoints)) {
  const rules = rulesets
    .filter((r) => r.styles[breakpoint] && Object.keys(r.styles[breakpoint]).length)
    .map((r) => `${r.selector} {\n${declarations(r.styles[breakpoint])}\n}`)
  if (!rules.length) continue
  css += query ? `@media ${query} {\n${rules.join('\n')}\n}\n` : `${rules.join('\n')}\n`
}

// Preview blocks: one per brief variant, plus the dining button and logo slot.
const instanceFor = (section) => plan.instances.find((i) => i.section === section)
const blocks = [
  { id: 'base', label: 'base (press/01)', instance: instanceFor('press/01-press') },
  { id: 'is-text-dark', label: 'is-text-dark (home/01, the reference)', instance: instanceFor('home/01-the-bold-handsome-heart-of-san') },
  { id: 'image-centered', label: 'is-image-bg + is-1-image: base with image (arts/01)', instance: instanceFor('arts/01-art-collection') },
  { id: 'is-left', label: 'is-image-bg + is-left + is-1-image: is-left with image (rooms-individual/05)', instance: instanceFor('rooms-individual/05-etiam-imperdiet-sodales-dui-a-vestibulum') },
  { id: 'logo-button-blue', label: 'base with logo and button is-blue (dining-zuma/01)', instance: instanceFor('dining-zuma/01-zuma-san-diego') },
  { id: 'button-burgundy', label: 'base with button is-burgundy (dining-gardenterrace/01)', instance: instanceFor('dining-gardenterrace/01-garden-terrace') },
]

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const assetPrefix = relative(planDir, repoRoot)
const fill = (value, content) =>
  value.replace(/\{(\w+)\}/g, (_, key) => {
    if (key === 'image') return `${assetPrefix}/${content.image.local}`
    if (key === 'logo') return `${assetPrefix}/${content.logo}`
    if (key === 'logoAlt') return 'Zuma'
    if (key === 'buttonLink') return '#'
    return content[key] ?? ''
  })

const renderNode = (node, instance) => {
  const { content } = instance
  if (node.optional && !content[node.optional === 'button' ? 'buttonText' : node.optional]) return ''
  let classes = [...node.classes, ...instance.modifiers.filter((m) => m.on === node.classes[0]).map((m) => m.class)]
  if (classes.includes('is-octagon') && content.buttonColor?.startsWith('is-')) classes = [...classes, content.buttonColor]
  const attributes = Object.entries(node.attributes)
    .map(([key, value]) => (value === '' ? ` ${key}` : ` ${key}="${escapeHtml(fill(String(value), content))}"`))
    .join('')
  const open = `<${node.tag}${classes.length ? ` class="${classes.join(' ')}"` : ''}${attributes}>`
  if (node.tag === 'img') return open
  const text = node.text ? escapeHtml(fill(node.text, content)) : ''
  return `${open}${text}${node.children.map((child) => renderNode(child, instance)).join('')}</${node.tag}>`
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q014 hero-fullbleed-centered preview</title>
<link rel="stylesheet" href="preview.css">
</head>
<body>
${blocks
  .map((b) => `<div class="preview-label">${escapeHtml(b.label)}</div>\n<div data-preview="${b.id}">${plan.tree.map((n) => renderNode(n, b.instance)).join('')}</div>`)
  .join('\n')}
</body>
</html>
`
writeFileSync(join(planDir, 'preview.css'), css)
writeFileSync(join(planDir, 'preview.html'), html)
console.log('wrote preview.html and preview.css')

if (!process.argv.includes('--no-shots')) {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
    await page.waitForLoadState('load')
    for (const block of blocks) {
      await page.locator(`[data-preview="${block.id}"] > section`).screenshot({ path: join(planDir, `preview-${block.id}-${width}.png`) })
    }
    await page.close()
  }
  await browser.close()
  console.log('wrote screenshots')
}
