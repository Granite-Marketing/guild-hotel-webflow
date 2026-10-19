// Generates preview.html and preview.css from plan.json, then screenshots each
// variant at 1440 and 390 wide. Run from the repo root:
//   node docs/figma/build-plans/Q026/generate-preview.mjs [--no-shots]
// The CSS comes only from plan.json style values (familyClasses, proposedShared,
// variants) plus the reused-class baseline in plan.previewBaseline, so the
// preview cannot drift from the plan.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

const breakpoints = {
  desktop: null,
  tablet: '(max-width: 991px)',
  mobileLandscape: '(max-width: 767px)',
  mobilePortrait: '(max-width: 479px)',
}

const declarations = (styles) =>
  Object.entries(styles)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')

// Collect rules per breakpoint so each media query is emitted once, in cascade order.
const rulesByBreakpoint = Object.fromEntries(Object.keys(breakpoints).map((name) => [name, []]))
const addRules = (selector, styles = {}) => {
  for (const [breakpoint, values] of Object.entries(styles)) {
    if (!rulesByBreakpoint[breakpoint]) throw new Error(`Unknown breakpoint ${breakpoint} on ${selector}`)
    if (Object.keys(values).length) rulesByBreakpoint[breakpoint].push(`${selector} {\n${declarations(values)}\n}`)
  }
}

for (const entry of plan.previewBaseline.classes) addRules(`.${entry.name}`, entry.styles)
for (const entry of plan.proposedShared) addRules(`.${entry.name}`, entry.styles)
for (const entry of plan.familyClasses) addRules(`.${entry.name}`, entry.styles)
for (const variant of plan.variants) addRules(`.${variant.on}.${variant.modifier}`, variant.styleDeltas)

const variableBlock = `:root {\n${Object.entries(plan.previewBaseline.variables)
  .map(([name, value]) => `  --${name}: ${value};`)
  .join('\n')}\n}`

const css = [
  '/* Generated from plan.json by generate-preview.mjs. Do not edit by hand. */',
  variableBlock,
  plan.previewBaseline.reset,
  ...Object.entries(breakpoints).map(([name, query]) => {
    const rules = rulesByBreakpoint[name].join('\n')
    if (!rules) return ''
    return query ? `@media ${query} {\n${rules.replace(/^/gm, '  ')}\n}` : rules
  }),
].join('\n\n')

// Validate: every class used in the tree, variants and instances is declared.
const declared = new Set([
  ...plan.reusedClasses,
  ...plan.familyClasses.map((entry) => entry.name),
  ...plan.proposedShared.map((entry) => entry.name),
  ...plan.variants.map((variant) => variant.modifier),
])
const used = new Set()
const walk = (nodes) => nodes.forEach((node) => { node.classes.forEach((name) => used.add(name)); walk(node.children ?? []) })
walk(plan.tree)
for (const instance of plan.instances) {
  instance.content.sectionModifiers.forEach((name) => used.add(name))
  instance.content.headingClasses.forEach((name) => used.add(name))
  instance.content.items.forEach((item) => [...item.modifiers, ...item.wrapModifiers, ...item.captionClasses].forEach((name) => used.add(name)))
}
const undeclared = [...used].filter((name) => !declared.has(name))
if (undeclared.length) throw new Error(`Classes not declared in plan.json: ${undeclared.join(', ')}`)

const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Variant modifiers go on every element whose class family has an entry for them.
const modifiersFor = (className, sectionModifiers) =>
  plan.variants.filter((variant) => variant.on === className && sectionModifiers.includes(variant.modifier)).map((variant) => variant.modifier)

const renderNode = (node, instance, item) => {
  const content = instance.content
  if (node.repeat === 'items') return content.items.map((entry) => renderNode({ ...node, repeat: undefined }, instance, entry)).join('\n')
  if (node.optional === 'heading' && !content.heading) return ''
  if (node.optional === 'caption' && !item?.caption) return ''
  // Every Figma instance ships grey placeholders (no image fills), so the image
  // node renders only once an instance item names a local asset.
  if (node.optional === 'image' && !item?.image) return ''
  const classes = [...node.classes]
  for (const name of node.classes) classes.push(...modifiersFor(name, content.sectionModifiers))
  if (node.slot === 'item') classes.push(...item.modifiers)
  if (node.slot === 'image-wrap') classes.push(...item.wrapModifiers)
  if (node.slot === 'heading') classes.push(...content.headingClasses)
  if (node.slot === 'caption') classes.push(...item.captionClasses)
  const attributes = Object.entries(node.attributes ?? {})
    .map(([name, value]) => ` ${name}="${escapeHtml(String(value))}"`)
    .join('')
  let inner = ''
  if (node.slot === 'heading') inner = escapeHtml(content.heading)
  else if (node.slot === 'caption') inner = escapeHtml(item.caption)
  else inner = (node.children ?? []).map((child) => renderNode(child, instance, item)).join('\n')
  const ariaLabel = node.slot === 'heading' ? ` aria-label="${escapeHtml(content.heading)}"` : ''
  if (node.tag === 'img') return `<img class="${classes.join(' ')}"${attributes} src="${relative(planDir, join(repoRoot, item.image))}" alt="${escapeHtml(item.alt ?? '')}">`
  return `<${node.tag} class="${[...new Set(classes)].join(' ')}"${attributes}${ariaLabel}>${inner}</${node.tag}>`
}

const pages = plan.instances.map((instance) => {
  const label = instance.variant
  const body = plan.tree.map((node) => renderNode(node, instance)).join('\n')
  return { label, html: `<!-- ${instance.section} (${label}) -->\n<div data-preview-variant="${label}">\n${body}\n</div>` }
})

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q026 timeline-scatter-images preview</title>
<link rel="stylesheet" href="preview.css">
</head>
<body>
${pages.map((page) => page.html).join('\n')}
</body>
</html>
`

writeFileSync(join(planDir, 'preview.css'), `${css}\n`)
writeFileSync(join(planDir, 'preview.html'), html)
console.log(`Wrote preview.html and preview.css (${pages.length} variants)`)

if (!process.argv.includes('--no-shots')) {
  const { chromium } = await import('@playwright/test')
  const browser = await chromium.launch()
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(`file://${join(planDir, 'preview.html')}`)
    for (const { label } of pages) {
      const target = page.locator(`[data-preview-variant="${label}"]`)
      const file = join(planDir, `preview-${label}-${width}.png`)
      await target.screenshot({ path: file })
      console.log(`Captured ${relative(repoRoot, file)}`)
    }
    await page.close()
  }
  await browser.close()
}
