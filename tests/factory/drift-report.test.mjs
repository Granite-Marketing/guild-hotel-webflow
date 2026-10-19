import assert from 'node:assert/strict'
import test from 'node:test'

import { createDriftReport, normalizeSnapshot, planDriftResolution, renderDriftMarkdown } from '../../scripts/factory/diff-webflow-state.mjs'

test('drift ignores volatile fields and reports meaningful changes', () => {
  const previous = normalizeSnapshot({
    siteId: 'site-1',
    retrievedAt: 'yesterday',
    coverage: { pages: 'complete', variables: 'complete' },
    pages: [{ id: 'p1', slug: '/', name: 'Home', order: 0, seo: { title: 'Old' }, components: [] }],
    variables: [{ id: 'v1', name: 'color-primary', value: '#111111' }],
  })
  const current = normalizeSnapshot({
    siteId: 'site-1',
    retrievedAt: 'today',
    coverage: { pages: 'complete', variables: 'complete' },
    pages: [{ id: 'p1', slug: '/', name: 'Home', order: 0, seo: { title: 'New' }, components: [] }],
    variables: [{ id: 'v1', name: 'color-primary', value: '#222222' }],
  })

  const report = createDriftReport(previous, current)
  assert.equal(report.clean, false)
  assert.ok(report.changes.some(({ path }) => path.includes('seo.title')))
  assert.ok(report.changes.some(({ path }) => path.includes('variables')))
  assert.ok(report.changes.every(({ resolution }) => resolution === 'unresolved'))
})

test('incomplete coverage can never produce a clean conclusion', () => {
  const snapshot = normalizeSnapshot({ siteId: 'site-1', coverage: { pages: 'incomplete' }, pages: [] })
  const report = createDriftReport(snapshot, snapshot)
  assert.equal(report.clean, false)
  assert.ok(report.warnings.some((warning) => warning.includes('incomplete')))
})

test('an incomplete approved baseline can never produce a clean conclusion', () => {
  const previous = normalizeSnapshot({ siteId: 'site-1', coverage: { pages: 'incomplete' }, pages: [] })
  const current = normalizeSnapshot({ siteId: 'site-1', coverage: { pages: 'complete' }, pages: [] })
  const report = createDriftReport(previous, current)
  assert.equal(report.clean, false)
  assert.ok(report.warnings.some((warning) => warning.includes('approved baseline')))
})

test('missing coverage domains fail closed', () => {
  const previous = normalizeSnapshot({ siteId: 'site-1', coverage: {}, pages: [] })
  const current = normalizeSnapshot({ siteId: 'site-1', coverage: {}, pages: [] })
  const report = createDriftReport(previous, current)
  assert.equal(report.clean, false)
  assert.ok(report.warnings.some((warning) => warning.includes('coverage is missing')))
})

test('drift resolution produces plans without mutating either side', () => {
  const report = {
    changes: [
      { path: 'variables[0].value', before: '#111', after: '#222', owner: 'shared', resolution: 'unresolved' },
      { path: 'pages[0].seo.title', before: 'Local', after: 'Webflow', owner: 'webflow', resolution: 'unresolved' },
    ],
  }
  const plan = planDriftResolution(report, {
    'variables[0].value': 'accept-webflow',
    'pages[0].seo.title': 'restore-local',
  })
  assert.equal(plan.mutationPerformed, false)
  assert.equal(plan.localUpdates.length, 1)
  assert.equal(plan.webflowOperations.length, 1)
})

test('drift report has a human-readable companion', () => {
  const markdown = renderDriftMarkdown({
    siteId: 'site-1',
    clean: false,
    warnings: ['variables coverage is incomplete; inspection is incomplete.'],
    mutationPerformed: false,
    changes: [{ path: 'variables[0].value', before: '#111', after: '#222', owner: 'shared', resolution: 'unresolved' }],
    sourceBoundary: 'React source remains local.',
  })
  assert.match(markdown, /review required/)
  assert.match(markdown, /variables\[0\]\.value/)
  assert.match(markdown, /Mutations performed: \*\*no\*\*/)
})
