// Renders preview.html and preview.css from plan.json, then screenshots each
// preview block at 1440 and 390 wide. Run from the repo root:
// node docs/figma/build-plans/Q014/render-preview.mjs [--no-shots]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))
const component = plan.component

// Reused and K01 shared classes come from ../shared-preview.css (canonical stylesheet).

const breakpoints = {
  desktop: null,
  tablet: '(max-width: 991px)',
  mobileLandscape: '(max-width: 767px)',
  mobilePortrait: '(max-width: 479px)',
}
const declarations = (styles) =>
  Object.entries(styles).map(([property, value]) => `  ${property}: ${value};`).join('\n')

const rulesets = [
  ...plan.familyClasses.map((c) => ({ selector: c.comboOf ? `.${c.comboOf}.${c.name}` : `.${c.name}`, styles: c.styles })),
]

let css = '/* Generated from plan.json by render-preview.mjs. Do not edit by hand. */\n'
css += '*, *::before, *::after { box-sizing: border-box; }\n'
css += 'body { margin: 0; font-family: var(--_typography---font-styles--body); }\np { margin: 0; }\n'
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
  if (classes.includes('is-chamfer') && content.buttonColor?.startsWith('is-')) classes = [...classes, content.buttonColor]
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
<link rel="stylesheet" href="../shared-preview.css">
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
