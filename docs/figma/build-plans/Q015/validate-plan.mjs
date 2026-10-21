// Checks plan.json against the shape in docs/figma/prep/P-build-plan.md and
// that every class in the tree is declared. Run: node docs/figma/build-plans/Q015/validate-plan.mjs
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const planDirectory = dirname(fileURLToPath(import.meta.url))
const plan = JSON.parse(readFileSync(join(planDirectory, 'plan.json'), 'utf8'))
const errors = []
const expectType = (key, type) => {
  const actual = Array.isArray(plan[key]) ? 'array' : typeof plan[key]
  if (actual !== type) errors.push(`${key} should be ${type}, is ${actual}`)
}
expectType('entry', 'string')
expectType('component', 'string')
expectType('buildOn', 'object')
for (const key of ['reusedClasses', 'familyClasses', 'proposedShared', 'variables', 'tree', 'variants', 'props', 'assets', 'instances', 'openQuestions', 'deviations']) expectType(key, 'array')
for (const key of ['page', 'pageId', 'section']) if (!plan.buildOn?.[key]) errors.push(`buildOn.${key} missing`)
// K01 moved shared class styles into shared-classes.json: a proposedShared
// entry may carry `definedIn` instead of inline `styles`, and `why` is optional.
const sharedFiles = new Map()
const sharedNamesIn = (relativePath) => {
  if (!sharedFiles.has(relativePath)) {
    const sharedPath = join(planDirectory, '..', '..', '..', '..', relativePath)
    const names = existsSync(sharedPath)
      ? new Set((JSON.parse(readFileSync(sharedPath, 'utf8')).shared ?? []).map((entry) => entry.name))
      : null
    sharedFiles.set(relativePath, names)
  }
  return sharedFiles.get(relativePath)
}
for (const entry of plan.proposedShared) {
  if (!entry.definedIn) continue
  const names = sharedNamesIn(entry.definedIn)
  if (!names) errors.push(`${entry.name}: definedIn ${entry.definedIn} not found`)
  else if (!names.has(entry.name)) errors.push(`${entry.name}: not listed in ${entry.definedIn}`)
}
for (const entry of [...plan.familyClasses, ...plan.proposedShared]) {
  const hasStyles = typeof entry.styles === 'object' && entry.styles !== null
  if (!entry.name || (!hasStyles && !entry.definedIn)) errors.push(`class entry malformed: ${JSON.stringify(entry).slice(0, 60)}`)
  for (const breakpoint of Object.keys(entry.styles ?? {})) {
    if (!['desktop', 'tablet', 'mobileLandscape', 'mobilePortrait'].includes(breakpoint)) errors.push(`${entry.name}: unknown breakpoint ${breakpoint}`)
  }
}
for (const entry of plan.familyClasses) {
  const ownFamily = entry.name === `section_${plan.component}` || entry.name.startsWith(`${plan.component}_`)
  if (!ownFamily) errors.push(`${entry.name}: familyClasses must be section_${plan.component} or ${plan.component}_*`)
}
const declared = new Set([...plan.reusedClasses, ...plan.familyClasses.map((entry) => entry.name), ...plan.proposedShared.map((entry) => entry.name)])
const modifiers = new Set(plan.variants.map((variant) => variant.modifier).filter(Boolean))
const walk = (node, path) => {
  for (const key of ['tag', 'classes', 'attributes', 'children']) if (!(key in node)) errors.push(`${path}: missing ${key}`)
  for (const name of node.classes ?? []) if (!declared.has(name) && !modifiers.has(name)) errors.push(`${path}: class ${name} is not declared`)
  ;(node.children ?? []).forEach((child, index) => walk(child, `${path}>${child.tag}[${index}]`))
}
plan.tree.forEach((node, index) => walk(node, `tree[${index}]`))
for (const variant of plan.variants) for (const key of ['on', 'styleDeltas', 'crop']) if (!(key in variant)) errors.push(`variant ${variant.modifier}: missing ${key}`)
for (const instance of plan.instances) for (const key of ['page', 'section', 'variant', 'content']) if (!(key in instance)) errors.push(`instance ${instance.section}: missing ${key}`)
const raw = readFileSync(join(planDirectory, 'plan.json'), 'utf8')
if (raw.includes('\u2014')) errors.push('plan.json contains an em dash')
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`plan.json valid: ${declared.size} declared classes, ${plan.instances.length} instances, ${plan.variants.length} variant(s)`)
