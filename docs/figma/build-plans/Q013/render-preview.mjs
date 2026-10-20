// Renders preview.html and preview.css from plan.json. Run from the repo root:
// node docs/figma/build-plans/Q013/render-preview.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

// Reused and K01 shared classes come from ../shared-preview.css (canonical stylesheet).

const breakpoints = {
  desktop: null,
  tablet: '(max-width: 991px)',
  mobileLandscape: '(max-width: 767px)',
  mobilePortrait: '(max-width: 479px)',
}

const selectorFor = (styleClass) =>
  styleClass.comboOf ? `.${styleClass.comboOf}.${styleClass.name}` : `.${styleClass.name}`

const declarations = (styles) =>
  Object.entries(styles).map(([property, value]) => `  ${property}: ${value};`).join('\n')

const allClasses = [
  ...plan.familyClasses,
]

let css = `/* Generated from plan.json by render-preview.mjs. Do not edit by hand. */\n`
css += `*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: var(--_typography---font-styles--heading); }\n`
css += `.preview-label { font: 12px/1.4 system-ui, sans-serif; padding: 8px 16px; background: #fff; color: #333; }\n`
for (const [breakpoint, query] of Object.entries(breakpoints)) {
  const rules = []
  for (const styleClass of allClasses) {
    const styles = styleClass.styles[breakpoint]
    if (styles && Object.keys(styles).length) rules.push(`${selectorFor(styleClass)} {\n${declarations(styles)}\n}`)
    if (breakpoint === 'desktop' && styleClass.states)
      for (const [state, stateStyles] of Object.entries(styleClass.states))
        rules.push(`${selectorFor(styleClass)}:${state} {\n${declarations(stateStyles)}\n}`)
  }
  if (!rules.length) continue
  css += query ? `@media ${query} {\n${rules.join('\n')}\n}\n` : `${rules.join('\n')}\n`
}

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const voidTags = new Set(['img'])
const assetPrefix = relative(planDir, repoRoot)

const renderNode = (node, depth, variantModifier) => {
  if (node.tag === '#text') return escapeHtml(node.text)
  const classes = [...node.classes]
  if (variantModifier && classes[0] === 'section_footer-links') classes.push(variantModifier)
  const attributes = { ...node.attributes }
  if (attributes.src) attributes.src = `${assetPrefix}/${attributes.src}`
  const attributeText = Object.entries(attributes)
    .map(([key, value]) => (value === '' ? ` ${key}` : ` ${key}="${escapeHtml(String(value))}"`))
    .join('')
  const classText = classes.length ? ` class="${classes.join(' ')}"` : ''
  const open = `<${node.tag}${classText}${attributeText}>`
  if (voidTags.has(node.tag)) return open
  const inner = (node.text !== undefined ? escapeHtml(node.text) : '') +
    node.children.map((child) => renderNode(child, depth + 1, variantModifier)).join('')
  return `${open}${inner}</${node.tag}>`
}

const body = plan.variants
  .map((variant) => `<div class="preview-label" data-variant="${variant.name}">Q013 footer-links, variant: ${variant.name}</div>\n` +
    plan.tree.map((node) => renderNode(node, 0, variant.modifier)).join('\n'))
  .join('\n')

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q013 footer-links preview</title>
<link rel="stylesheet" href="../shared-preview.css">
<link rel="stylesheet" href="preview.css">
</head>
<body>
${body}
</body>
</html>
`
writeFileSync(join(planDir, 'preview.css'), css)
writeFileSync(join(planDir, 'preview.html'), html)
console.log('wrote preview.html and preview.css')
