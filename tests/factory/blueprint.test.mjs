import assert from 'node:assert/strict'
import test from 'node:test'

import { compileBlueprint, validateBlueprint } from '../../scripts/factory/validate-blueprint.mjs'

const blueprint = {
  version: 1,
  project: 'acme',
  library: 'Acme Library',
  source: { figmaFileKey: 'figma-file', figmaStyleGuideNode: '1:2' },
  webflow: { siteId: 'site-1', styleGuidePath: '/style-guide' },
  pages: [
    {
      key: 'home',
      name: 'Home',
      slug: '/',
      seo: { title: 'Acme', description: 'Acme home page' },
      components: [
        {
          key: 'hero',
          component: 'HeroSection',
          version: '1.0.0',
          props: { heading: { source: 'literal', value: 'Hello' } },
        },
      ],
    },
  ],
}

test('blueprint compiles deterministic, capability-aware operations', () => {
  assert.deepEqual(validateBlueprint(blueprint), [])
  const capabilityDocument = { version: 1, siteId: 'site-1', capabilities: { pages: 'automatic', seo: 'automatic', componentDiscovery: 'automatic', componentPlacement: 'manual-only', props: 'automatic', cmsBindings: 'automatic' } }
  const emptyState = { siteId: 'site-1', pages: [] }
  const first = compileBlueprint(blueprint, capabilityDocument, emptyState)
  const second = compileBlueprint(blueprint, capabilityDocument, emptyState)
  assert.deepEqual(first, second)
  assert.ok(first.manualActions.some(({ capability }) => capability === 'componentPlacement'))
  assert.ok(first.operations.some(({ action }) => action === 'upsert-page'))
  const matchingState = {
    siteId: 'site-1',
    pages: [{ key: 'home', name: 'Home', slug: '/', seo: blueprint.pages[0].seo, components: blueprint.pages[0].components }],
  }
  const unchanged = compileBlueprint(blueprint, capabilityDocument, matchingState)
  assert.equal(unchanged.operations.length, 0)
  assert.equal(unchanged.manualActions.length, 0)
})

test('blueprint rejects duplicate slugs and instance keys', () => {
  const invalid = structuredClone(blueprint)
  invalid.pages.push(structuredClone(invalid.pages[0]))
  const errors = validateBlueprint(invalid)
  assert.ok(errors.some((error) => error.includes('slug')))
  assert.ok(errors.some((error) => error.includes('page key')))
})

test('manual prop bindings never enter automatic Webflow operations', () => {
  const withManualProp = structuredClone(blueprint)
  withManualProp.pages[0].components[0].props.note = { source: 'manual' }
  withManualProp.pages[0].components[0].props.note.instructions = 'Set in Designer'
  const capabilityDocument = { version: 1, siteId: 'site-1', capabilities: { pages: 'automatic', seo: 'automatic', componentDiscovery: 'automatic', componentPlacement: 'automatic', props: 'automatic', cmsBindings: 'automatic' } }
  const compiled = compileBlueprint(withManualProp, capabilityDocument, { siteId: 'site-1', pages: [] })
  assert.ok(compiled.manualActions.some(({ action }) => action === 'set-props-manually'))
  assert.ok(compiled.operations.every(({ props = {} }) => !Object.hasOwn(props, 'note')))
})

test('blueprint rejects schema-required omissions before compilation', () => {
  const invalid = structuredClone(blueprint)
  delete invalid.pages[0].components
  assert.ok(validateBlueprint(invalid).some((error) => error.includes('components must be an array')))
  const capabilityDocument = { version: 1, siteId: 'site-1', capabilities: {} }
  assert.throws(() => compileBlueprint(invalid, capabilityDocument, { siteId: 'site-1', pages: [] }), /components must be an array/)
})

test('prop-only changes do not emit placement operations', () => {
  const capabilityDocument = { version: 1, siteId: 'site-1', capabilities: { pages: 'automatic', seo: 'automatic', componentDiscovery: 'automatic', componentPlacement: 'automatic', props: 'automatic', cmsBindings: 'automatic' } }
  const currentComponent = structuredClone(blueprint.pages[0].components[0])
  currentComponent.props.heading.value = 'Old heading'
  const currentState = { siteId: 'site-1', pages: [{ ...blueprint.pages[0], components: [currentComponent] }] }
  const compiled = compileBlueprint(blueprint, capabilityDocument, currentState)
  assert.ok(compiled.operations.some(({ action }) => action === 'set-props'))
  assert.ok(compiled.operations.every(({ action }) => action !== 'place-component'))
})

test('capabilities and current state must match the blueprint site', () => {
  const capabilityDocument = { version: 1, siteId: 'other-site', capabilities: {} }
  assert.throws(() => compileBlueprint(blueprint, capabilityDocument, { siteId: 'site-1', pages: [] }), /siteId must match/)
})
