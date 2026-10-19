import assert from 'node:assert/strict'
import test from 'node:test'

import { compareInventories, hashComponentProps, validatePendingImport, validateProductionPromotion, validateReleaseCandidate, validateStagingApproval } from '../../templates/code-component-project/scripts/release/release-contract.mjs'

test('release contract identifies breaking removals and prop changes', () => {
  const previous = [{ name: 'Hero', propsHash: 'one' }, { name: 'Footer', propsHash: 'same' }]
  const next = [{ name: 'Hero', propsHash: 'two' }]
  const changes = compareInventories(previous, next)
  assert.deepEqual(changes.removed, ['Footer'])
  assert.deepEqual(changes.changed, ['Hero'])
})

test('breaking inventory changes require a major release and migration notes', () => {
  const errors = validateReleaseCandidate({
    version: '1.1.0',
    previousVersion: '1.0.0',
    inventoryChanges: { added: [], removed: ['Footer'], changed: [] },
    migrationNotes: '',
    sourceRevision: 'abc123',
  })
  assert.ok(errors.some((error) => error.includes('major')))
  assert.ok(errors.some((error) => error.includes('migration')))
})

test('production promotion requires staging approval and source-equivalent commits', () => {
  const release = { version: '1.0.0', status: 'staging', stagingApproved: true, sourceRevision: 'abc', stagingReceipt: { sourceRevision: 'abc' } }
  assert.deepEqual(validateProductionPromotion({ release, currentRevision: 'def', changedSinceSource: ['project/releases.json'], isClean: true }), [])
  assert.match(validateProductionPromotion({ release: { ...release, stagingApproved: false }, currentRevision: 'def', isClean: true }).join('\n'), /staging smoke receipt/)
  assert.match(validateProductionPromotion({ release, currentRevision: 'def', changedSinceSource: ['src/component.tsx'], isClean: true }).join('\n'), /Source changed/)
  assert.match(validateProductionPromotion({ release, currentRevision: 'def', isClean: false }).join('\n'), /clean committed/)
})

test('prop hashes ignore declaration formatting and non-contract metadata', () => {
  const first = `declareComponent(Component, { name: 'Hero', description: 'One', props: { heading: props.Text({ name: 'Heading' }) }, options: { ssr: true } })`
  const second = `declareComponent(Component, {\n  name: 'Hero',\n  description: 'Two',\n  props: { heading: props.Text({ name: 'Heading' }) },\n  options: { ssr: true },\n})`
  assert.equal(hashComponentProps(first), hashComponentProps(second))
  const changed = second.replace("props.Text({ name: 'Heading' })", "props.RichText({ name: 'Heading' })")
  assert.notEqual(hashComponentProps(first), hashComponentProps(changed))
})

test('rollback promotion accepts a recorded superseded target', () => {
  const release = { version: '1.0.0', status: 'superseded', sourceRevision: 'abc', productionRevision: 'abc', productionImportedAt: '2026-07-16T00:00:00.000Z' }
  assert.deepEqual(validateProductionPromotion({ release, currentRevision: 'abc', changedSinceSource: [], isClean: true, rollback: true }), [])
  for (const status of ['candidate', 'staging']) {
    assert.match(validateProductionPromotion({ release: { ...release, status }, currentRevision: 'abc', changedSinceSource: [], isClean: true, rollback: true }).join('\n'), /previously imported production release/)
  }
})

test('staging approval rejects source changes after candidate preparation', () => {
  const release = { version: '1.0.0', status: 'candidate', sourceRevision: 'abc' }
  assert.deepEqual(validateStagingApproval({ release, changedSinceSource: ['project/releases.json'], isClean: true }), [])
  assert.match(validateStagingApproval({ release, changedSinceSource: ['src/component.tsx'], isClean: true }).join('\n'), /Source changed/)
})

test('pending production imports fail closed until explicitly reconciled', () => {
  const pending = { version: '1.2.3' }
  assert.match(validatePendingImport({ pending, version: '1.2.3' }).join('\n'), /unresolved pending receipt/)
  assert.match(validatePendingImport({ pending, version: '1.2.3', acknowledge: true, confirmation: 'no' }).join('\n'), /unresolved pending receipt/)
  assert.deepEqual(validatePendingImport({ pending, version: '1.2.3', acknowledge: true, confirmation: 'verified' }), [])
  assert.match(validatePendingImport({ pending: null, version: '1.2.3', acknowledge: true, confirmation: 'verified' }).join('\n'), /no pending/)
})
