// Q018 plan tooling: fills plan.json instances from the Figma snapshot specs,
// validates the plan, and generates preview.css and preview.html from it.
// Run from the repo root: node docs/figma/build-plans/Q018/generate.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const planDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(planDir, '../../../..')
const planPath = join(planDir, 'plan.json')
const plan = JSON.parse(readFileSync(planPath, 'utf8'))
const tokens = JSON.parse(readFileSync(join(repoRoot, 'figma/tokens.json'), 'utf8'))

// Instances, read from each section spec (texts only; no image fills exist).
const instanceSections = [
  'meetings-collection/09-meetings-events-gallery',
  'history/07-1-etiam-imperdiet-sodales-dui-a',
  'rooms-individual/09-deluxe-king-suite-gallery',
  'neighborhood/11-neighborhood-gallery',
  'dining-zuma/08-zuma-gallery',
  'dining-gardenterrace/07-zuma-gallery',
  'dining-lobbybar/07-zuma-gallery',
  'dining-poollounge/07-zuma-gallery',
  'legal/13-corporate-gallery',
  'corporate/13-corporate-gallery',
]

const readInstance = (section) => {
  const [page, sectionSlug] = section.split('/')
  const specPath = `figma/pages/${page}/sections/${sectionSlug}/spec.json`
  const spec = JSON.parse(readFileSync(join(repoRoot, specPath), 'utf8'))
  const heading = spec.texts.find((text) => text.fontSize === 24)
  const featureTitle = spec.texts.find((text) => text.fontSize === 40)
  const captions = spec.texts
    .filter((text) => text.fontSize === 16)
    .sort((a, b) => a.bbox.y - b.bbox.y || a.bbox.x - b.bbox.x)
    .map((text) => text.characters.replace(/^\d+\s+/, ''))
  const content = {
    headingVisible: Boolean(heading),
    // The 40px title exists in Figma but is drawn under the tile, so no crop shows it: off until confirmed.
    featureTitleVisible: false,
  }
  if (heading) content.heading = heading.characters
  if (featureTitle) content.featureTitle = featureTitle.characters
  captions.forEach((caption, index) => {
    content[`caption${index + 1}`] = caption
  })
  return {
    page,
    section,
    variant: 'base',
    crop: `figma/pages/${page}/sections/${sectionSlug}/section.webp`,
    headingOffset: heading ? { left: heading.bbox.x, top: heading.bbox.y - spec.nodes.find((node) => node.type !== "TEXT").bbox.y } : null,
    content,
  }
}

plan.instances = instanceSections.map(readInstance)

// Validation: the plan shape and the class coverage rule.
const errors = []
const requiredKeys = ['entry', 'component', 'buildOn', 'reusedClasses', 'familyClasses', 'proposedShared', 'variables', 'tree', 'variants', 'props', 'assets', 'instances', 'openQuestions', 'deviations']
for (const key of requiredKeys) if (!(key in plan)) errors.push(`missing key ${key}`)
const breakpoints = ['desktop', 'tablet', 'mobileLandscape', 'mobilePortrait']
for (const familyClass of plan.familyClasses) {
  for (const breakpoint of breakpoints) {
    if (!(breakpoint in familyClass.styles)) errors.push(`${familyClass.name} lacks ${breakpoint}`)
  }
}
const knownClasses = new Set([
  ...plan.reusedClasses,
  ...plan.familyClasses.map((familyClass) => familyClass.name),
  ...plan.proposedShared.map((sharedClass) => sharedClass.name),
])
const treeClasses = new Set()
const walk = (nodes, parent) => {
  for (const node of nodes) {
    for (const className of node.classes) {
      treeClasses.add(className)
      if (!knownClasses.has(className)) errors.push(`tree class ${className} is not declared`)
    }
    if (/^h[1-6]$/.test(node.tag) && parent?.tag !== 'header') errors.push(`${node.tag} outside a header wrapper`)
    if (node.tag === 'img' && parent?.tag !== 'figure') errors.push('img outside a figure wrapper')
    walk(node.children ?? [], node)
  }
}
walk(plan.tree, null)
for (const name of knownClasses) if (!treeClasses.has(name)) errors.push(`declared class ${name} is unused in the tree`)
const propNames = new Set(plan.props.map((prop) => prop.name))
for (const instance of plan.instances) {
  for (const key of Object.keys(instance.content)) {
    if (!propNames.has(key)) errors.push(`instance ${instance.section} sets unknown prop ${key}`)
  }
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
writeFileSync(planPath, `${JSON.stringify(plan, null, 2)}\n`)

// Preview CSS, generated from the plan's style values. Reused Relume classes
// take their values from the figma/tokens.json mapping.
const mediaQueries = {
  desktop: null,
  tablet: '(max-width: 991px)',
  mobileLandscape: '(max-width: 767px)',
  mobilePortrait: '(max-width: 479px)',
}
const colorVariables = Object.fromEntries(
  tokens.mapping.colors.filter((color) => color.target).map((color) => [color.target, color.source?.hex ?? color.hex]),
)
const fontVariables = Object.fromEntries(tokens.mapping.fontVariables.map((font) => [font.variable, font.value]))

const typographyRule = (className) => {
  const mapped = tokens.mapping.typography.find((entry) => entry.target === className && entry.isPrimary)
    ?? tokens.mapping.typography.find((entry) => entry.target === className)
  const values = mapped.classValues
  const declarations = {
    'font-family': 'var(--font-style-heading)',
    'font-size': `${values.fontSizeRem}rem`,
    'line-height': String(values.lineHeight),
    'letter-spacing': `${values.letterSpacingEm}em`,
  }
  if (values.textTransform) declarations['text-transform'] = values.textTransform
  return declarations
}
const reusedStyles = {
  'heading-style-h4': typographyRule('heading-style-h4'),
  'heading-style-h2': typographyRule('heading-style-h2'),
  'text-size-regular': { 'font-size': '1rem' },
  'text-weight-normal': { 'font-weight': '400' },
}

const selectorFor = (styleClass) => (styleClass.comboOn ? `.${styleClass.comboOn}.${styleClass.name}` : `.${styleClass.name}`)
const block = (selector, declarations) => {
  const lines = Object.entries(declarations).map(([property, value]) => `  ${property}: ${value};`)
  return lines.length ? `${selector} {\n${lines.join('\n')}\n}` : ''
}
const indent = (text) => text.split('\n').map((line) => `  ${line}`).join('\n')

const cssParts = [
  '/* Generated by generate.mjs from plan.json. Do not edit by hand. */',
  block(':root', {
    ...Object.fromEntries(plan.variables.filter((name) => name.startsWith('color-')).map((name) => [`--${name}`, colorVariables[name]])),
    // Preview only: Sackers Heavy Gothic is not available locally; Copperplate is the closest macOS face.
    '--font-style-heading': `"${fontVariables['font-style-heading']}", Copperplate, "Copperplate Gothic Light", serif`,
  }),
  block('*, *::before, *::after', { 'box-sizing': 'border-box' }),
  block('body', { margin: '0', 'font-family': 'var(--font-style-heading)', background: '#ffffff' }),
  block('.preview-label', { margin: '0', padding: '1rem 2.5rem', 'font-family': 'ui-monospace, monospace', 'font-size': '0.75rem', background: '#111', color: '#eee' }),
  ...Object.entries(reusedStyles).map(([name, declarations]) => block(`.${name}`, declarations)),
]
const ordered = [...plan.proposedShared, ...plan.familyClasses]
for (const breakpoint of breakpoints) {
  const rules = ordered
    .map((styleClass) => block(selectorFor(styleClass), styleClass.styles[breakpoint] ?? {}))
    .filter(Boolean)
  if (!rules.length) continue
  const query = mediaQueries[breakpoint]
  cssParts.push(query ? `@media ${query} {\n${indent(rules.join('\n'))}\n}` : rules.join('\n'))
}
writeFileSync(join(planDir, 'preview.css'), `${cssParts.filter(Boolean).join('\n\n')}\n`)

// Preview HTML: render the tree once per preview instance (content overrides apply on top).
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const blankImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const renderNode = (node, content) => {
  if (node.visibilityProp && !content[node.visibilityProp]) return ''
  const classAttribute = node.classes.length ? ` class="${node.classes.join(' ')}"` : ''
  const attributes = Object.entries(node.attributes).map(([name, value]) => ` ${name}="${value}"`).join('')
  if (node.tag === 'img') {
    const source = content[node.prop] ?? blankImage
    return `<img${classAttribute}${attributes} src="${source}" alt="">`
  }
  const inner = node.prop
    ? escapeHtml(content[node.prop] ?? '')
    : (node.text ?? '') + (node.children ?? []).map((child) => renderNode(child, content)).join('')
  return `<${node.tag}${classAttribute}${attributes}>${inner}</${node.tag}>`
}
const previewInstances = [
  { id: 'base', label: 'base: meetings-collection/09 (reference crop)', section: 'meetings-collection/09-meetings-events-gallery' },
  { id: 'base-feature-title', label: 'base: meetings-collection/09 with the optional feature title switched on', section: 'meetings-collection/09-meetings-events-gallery', content: { featureTitleVisible: true } },
  { id: 'base-heading-only', label: 'base: rooms-individual/09 (heading, no feature title)', section: 'rooms-individual/09-deluxe-king-suite-gallery' },
  { id: 'base-no-heading', label: 'base: history/07 (no heading, no feature title)', section: 'history/07-1-etiam-imperdiet-sodales-dui-a' },
]
const sections = previewInstances.map((previewInstance) => {
  const instance = plan.instances.find((candidate) => candidate.section === previewInstance.section)
  return `<div class="preview-instance" id="${previewInstance.id}">\n<p class="preview-label">${previewInstance.label}</p>\n${plan.tree.map((node) => renderNode(node, { ...instance.content, ...previewInstance.content })).join('\n')}\n</div>`
})
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Q018 gallery-mosaic-captioned preview</title>
<link rel="stylesheet" href="preview.css">
</head>
<body>
<!-- Generated by generate.mjs from plan.json. Do not edit by hand. -->
${sections.join('\n')}
</body>
</html>
`
writeFileSync(join(planDir, 'preview.html'), html)
console.log(`plan valid: ${treeClasses.size} classes, ${plan.instances.length} instances; preview written`)
