import assert from 'node:assert/strict'
import test from 'node:test'

import { compileCapabilityMatrix } from '../../scripts/factory/probe-webflow-capabilities.mjs'

const capabilityNames = ['pages', 'seo', 'componentDiscovery', 'componentPlacement', 'props', 'cmsBindings', 'variables', 'readBack']

test('capability probe requires observed evidence for every operation', () => {
  const results = Object.fromEntries(capabilityNames.map((name) => [name, { status: 'automatic', evidence: `${name} verified` }]))
  const matrix = compileCapabilityMatrix({ siteId: 'site-1', inspectedAt: '2026-07-16T00:00:00.000Z', results })
  assert.equal(matrix.capabilities.componentPlacement, 'automatic')
  assert.equal(matrix.evidence.readBack, 'readBack verified')

  delete results.props.evidence
  assert.throws(() => compileCapabilityMatrix({ siteId: 'site-1', results }), /props requires observed evidence/)
})
