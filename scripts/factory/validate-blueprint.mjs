import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const capabilityStatuses = new Set(['automatic', 'manual-only', 'unavailable'])

export function validateBlueprint(blueprint) {
  const errors = []
  if (blueprint?.version !== 1) errors.push('Blueprint version must be 1.')
  if (!blueprint?.project) errors.push('Blueprint project is required.')
  if (!blueprint?.library) errors.push('Blueprint library is required.')
  if (!blueprint?.source?.figmaFileKey || !blueprint?.source?.figmaStyleGuideNode) errors.push('Blueprint source requires Figma file key and style guide node.')
  if (!blueprint?.webflow?.siteId) errors.push('Webflow siteId is required.')
  if (!blueprint?.webflow?.styleGuidePath?.startsWith('/')) errors.push('Style guide path must start with /.')
  if (!Array.isArray(blueprint?.pages)) errors.push('Blueprint pages must be an array.')

  const pageKeys = new Set()
  const slugs = new Set()
  for (const [pageIndex, page] of (blueprint?.pages ?? []).entries()) {
    const location = `pages[${pageIndex}]`
    if (!page || typeof page !== 'object') {
      errors.push(`${location} must be an object.`)
      continue
    }
    if (!page.key) errors.push(`${location} page key is required.`)
    if (typeof page.name !== 'string') errors.push(`${location} page name is required.`)
    if (pageKeys.has(page.key)) errors.push(`${location} duplicates page key ${page.key}.`)
    pageKeys.add(page.key)
    if (!page.slug?.startsWith('/')) errors.push(`${location} slug must start with /.`)
    if (slugs.has(page.slug)) errors.push(`${location} duplicates slug ${page.slug}.`)
    slugs.add(page.slug)
    if (!page.seo?.title || !page.seo?.description) errors.push(`${location} requires SEO title and description.`)
    if (!Array.isArray(page.components)) {
      errors.push(`${location} components must be an array.`)
      continue
    }
    const instanceKeys = new Set()
    for (const [componentIndex, component] of page.components.entries()) {
      const componentLocation = `${location}.components[${componentIndex}]`
      if (!component || typeof component !== 'object') {
        errors.push(`${componentLocation} must be an object.`)
        continue
      }
      if (!component.key || !component.component || !component.version) errors.push(`${componentLocation} requires key, component, and version.`)
      if (!component.props || typeof component.props !== 'object' || Array.isArray(component.props)) errors.push(`${componentLocation} props must be an object.`)
      if (instanceKeys.has(component.key)) errors.push(`${componentLocation} duplicates instance key ${component.key}.`)
      instanceKeys.add(component.key)
      for (const [propName, binding] of Object.entries(component.props ?? {})) {
        if (!['literal', 'cms', 'manual'].includes(binding?.source)) errors.push(`${componentLocation}.props.${propName} has an invalid source.`)
        if (binding?.source === 'literal' && !Object.hasOwn(binding, 'value')) errors.push(`${componentLocation}.props.${propName} literal source requires value.`)
        if (binding?.source === 'cms' && (!binding.collection || !binding.field)) errors.push(`${componentLocation}.props.${propName} CMS source requires collection and field.`)
        if (binding?.source === 'manual' && !binding.instructions) errors.push(`${componentLocation}.props.${propName} manual source requires instructions.`)
      }
    }
  }
  return errors
}

function route(capability, capabilities, operation, operations, manualActions, unavailable) {
  const status = capabilities[capability]
  if (!capabilityStatuses.has(status)) throw new Error(`Capability ${capability} must be probed before compilation.`)
  if (status === 'automatic') operations.push(operation)
  else if (status === 'manual-only') manualActions.push({ capability, ...operation })
  else unavailable.push({ capability, ...operation })
}

function equal(left, right) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function resolveCapabilities(capabilityDocument, siteId) {
  if (capabilityDocument?.capabilities) {
    if (capabilityDocument.version !== 1) throw new Error('Capability matrix version must be 1.')
    if (capabilityDocument.siteId !== siteId) throw new Error('Capability matrix siteId must match the blueprint siteId.')
    return capabilityDocument.capabilities
  }
  throw new Error('Compilation requires a versioned, site-bound capability matrix.')
}

export function compileBlueprint(blueprint, capabilityDocument, currentState) {
  const errors = validateBlueprint(blueprint)
  if (errors.length) throw new Error(errors.join('\n'))
  const capabilities = resolveCapabilities(capabilityDocument, blueprint.webflow.siteId)
  if (!currentState || currentState.siteId !== blueprint.webflow.siteId || !Array.isArray(currentState.pages)) {
    throw new Error('Compilation requires current Webflow state for the same site. Use an explicit empty state only for first assembly.')
  }
  const operations = []
  const manualActions = []
  const unavailable = []

  for (const page of blueprint.pages) {
    const currentPage = currentState.pages?.find((candidate) => candidate.key === page.key || candidate.slug === page.slug)
    if (!currentPage || currentPage.slug !== page.slug || currentPage.name !== page.name) {
      route('pages', capabilities, { action: 'upsert-page', pageKey: page.key, slug: page.slug, name: page.name }, operations, manualActions, unavailable)
    }
    if (!currentPage || !equal(currentPage.seo, page.seo)) {
      route('seo', capabilities, { action: 'upsert-seo', pageKey: page.key, seo: page.seo }, operations, manualActions, unavailable)
    }
    for (const [order, component] of page.components.entries()) {
      const currentComponent = currentPage?.components?.find((candidate) => candidate.key === component.key)
      if (!currentComponent || currentComponent.component !== component.component || currentComponent.version !== component.version) {
        route('componentDiscovery', capabilities, { action: 'verify-component', component: component.component, version: component.version }, operations, manualActions, unavailable)
      }
      if (!currentComponent || currentComponent.component !== component.component || currentComponent.version !== component.version || currentPage.components.indexOf(currentComponent) !== order) {
        route('componentPlacement', capabilities, { action: 'place-component', pageKey: page.key, order, instance: component }, operations, manualActions, unavailable)
      }
      const propEntries = Object.entries(component.props ?? {})
      const literalProps = Object.fromEntries(propEntries.filter(([, binding]) => binding.source === 'literal'))
      const cmsBindings = Object.fromEntries(propEntries.filter(([, binding]) => binding.source === 'cms'))
      const manualProps = Object.fromEntries(propEntries.filter(([, binding]) => binding.source === 'manual'))
      if ((!currentComponent || !equal(currentComponent.props, component.props)) && Object.keys(literalProps).length) {
        route('props', capabilities, { action: 'set-props', pageKey: page.key, instanceKey: component.key, props: literalProps }, operations, manualActions, unavailable)
      }
      if ((!currentComponent || !equal(currentComponent.props, component.props)) && Object.keys(cmsBindings).length) {
        route('cmsBindings', capabilities, { action: 'bind-cms-props', pageKey: page.key, instanceKey: component.key, props: cmsBindings }, operations, manualActions, unavailable)
      }
      if ((!currentComponent || !equal(currentComponent.props, component.props)) && Object.keys(manualProps).length) {
        manualActions.push({ capability: 'props', action: 'set-props-manually', pageKey: page.key, instanceKey: component.key, props: manualProps })
      }
    }
  }

  return { version: 1, siteId: blueprint.webflow.siteId, mutationPerformed: false, operations, manualActions, unavailable }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const blueprintPath = resolve(process.argv[2] ?? 'project/blueprint.json')
  const capabilitiesPath = resolve(process.argv[3] ?? 'project/webflow-capabilities.json')
  try {
    const blueprint = JSON.parse(await readFile(blueprintPath, 'utf8'))
    const capabilityDocument = JSON.parse(await readFile(capabilitiesPath, 'utf8'))
    const stateArgument = process.argv[4]
    if (!stateArgument) throw new Error('Provide a current-state snapshot path, or pass --assume-empty for first assembly.')
    const currentState = stateArgument === '--assume-empty'
      ? { siteId: blueprint.webflow.siteId, pages: [] }
      : JSON.parse(await readFile(resolve(stateArgument), 'utf8'))
    const serialized = `${JSON.stringify(compileBlueprint(blueprint, capabilityDocument, currentState), null, 2)}\n`
    if (process.argv[5]) {
      const outputPath = resolve(process.argv[5])
      await writeFile(outputPath, serialized)
      console.log(`Wrote non-mutating assembly plan to ${outputPath}`)
    } else process.stdout.write(serialized)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
