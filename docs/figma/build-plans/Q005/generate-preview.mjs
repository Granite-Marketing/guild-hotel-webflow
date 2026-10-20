// Generates preview.css and preview.html from plan.json (three stacked states), then
// (with --shoot) screenshots each state block at 1440x900 and 390x844.
// Usage: node docs/figma/build-plans/Q005/generate-preview.mjs [--shoot]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const plan = JSON.parse(readFileSync(join(planDir, 'plan.json'), 'utf8'))

// Brand fonts are Webflow-only; the preview uses system stand-ins via shared-preview.css variables.
const breakpoints = [['desktop', null], ['tablet', 991], ['mobileLandscape', 767], ['mobilePortrait', 479]]
const declarations = (styles) =>
  Object.entries(styles ?? {}).map(([p, v]) => `  ${p}: ${v};`).join('\n')

const ruleBlocks = { desktop: [], tablet: [], mobileLandscape: [], mobilePortrait: [] }
const addRule = (selector, byBreakpoint) => {
  for (const [bp] of breakpoints) {
    const body = declarations(byBreakpoint?.[bp])
    if (body) ruleBlocks[bp].push(`${selector} {\n${body}\n}`)
  }
}
for (const f of plan.familyClasses) {
  addRule(`.${f.name}`, f.styles)
  if (f.hover) addRule(`.${f.name}:hover`, { desktop: f.hover })
}
for (const c of plan.comboClasses) addRule(`.${c.name.split('.').join('.')}`, c.styles)
// Dark variant is a Webflow component variant; the preview models it as a class.
for (const v of plan.variants) addRule(`.${v.on}.is-preview-dark`, v.styleDeltas)

let css = `/* Generated from plan.json by generate-preview.mjs. Do not edit by hand. */\n`
css += `*, *::before, *::after { box-sizing: border-box; }\nbody { margin: 0; font-family: var(--_typography---font-styles--body); }\np { margin: 0; }\n\n`
css += `/* Preview only: each state block is the positioning context. The live menu is position: fixed
   (covers the viewport); here it is absolute inside the block so stacked states do not overlap.
   The header is made static so the absolute menu measures against the block, not the 70px header. */
.preview-state { position: relative; height: 100vh; overflow: hidden; }
.preview-state .site-nav_component { position: static; }
.preview-state .site-nav_menu { position: absolute; }
.preview-standin { position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0; }
.preview-state[data-state="base-closed"] .preview-standin, .preview-state[data-state="base-open"] .preview-standin { background: #D9D9D9; }
.preview-state[data-state="dark-closed"] .preview-standin { background: #F4EFDF; }\n\n`
for (const [bp, max] of breakpoints) {
  const rules = ruleBlocks[bp].join('\n\n')
  if (!rules) continue
  css += max ? `@media (max-width: ${max}px) {\n${rules}\n}\n\n` : `${rules}\n\n`
}
writeFileSync(join(planDir, 'preview.css'), css)

const esc = (t) => String(t).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const imageSrc = relative(planDir, join(repoRoot, plan.assets[0].local))

const renderNode = (node, extraClasses) => {
  const classes = [...(node.classes ?? []), ...(extraClasses ?? [])]
  const attrs = { ...(node.attributes ?? {}) }
  if (node.link) attrs.href = node.link.path ?? node.link.url
  if (node.asset) { attrs.src = imageSrc; attrs.alt = node.alt ?? '' }
  const attrText = Object.entries(attrs).map(([k, v]) => ` ${k}="${esc(v)}"`).join('')
  const classText = classes.length ? ` class="${classes.join(' ')}"` : ''
  if (node.tag === 'HtmlEmbed') {
    const snippet = readFileSync(join(planDir, node.embed), 'utf8')
    return `<div${classText}${attrText}>${snippet}</div>`
  }
  if (node.tag === 'img') return `<img${classText}${attrText}>`
  const inner = node.text != null ? esc(node.text) : (node.children ?? []).map((c) => renderNode(c)).join('')
  return `<${node.tag}${classText}${attrText}>${inner}</${node.tag}>`
}

const states = [
  ['base-closed', []],
  ['base-open', ['is-nav-open']],
  ['dark-closed', ['is-preview-dark']],
]
const blocks = states.map(([name, extra]) =>
  `<section class="preview-state" data-state="${name}">\n<div class="preview-standin"></div>\n${plan.tree.map((n) => renderNode(n, extra)).join('')}\n</section>`)

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q005 site nav preview</title>
<link rel="stylesheet" href="../shared-preview.css">
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
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } })
    await page.goto(pathToFileURL(join(planDir, 'preview.html')).href)
    await page.waitForLoadState('networkidle')
    for (const [name] of states) {
      await page.locator(`[data-state="${name}"]`).screenshot({ path: join(planDir, `preview-${name}-${width}.png`) })
    }
    await page.close()
  }
  await browser.close()
  console.log('wrote screenshots')
}
