import assert from 'node:assert/strict'
import test from 'node:test'

import { generateTokenCss, validateTokenLedger } from '../../scripts/factory/generate-token-adapters.mjs'
import { generateTokenCss as generateClientTokenCss, validateTokenLedger as validateClientTokenLedger } from '../../templates/code-component-project/scripts/tokens/generate.mjs'

const baseLedger = {
  version: 1,
  breakpoints: { tablet: 991, mobileLandscape: 767, mobilePortrait: 479 },
  tokens: {
    'color.brand': {
      type: 'color',
      figma: '#111111',
      approved: '#222222',
      semantic: 'brand',
      webflow: { collection: 'Colors', name: 'color-primary', cssVariable: '--wf-color-primary' },
      override: { reason: 'Browser contrast adjustment', author: 'Designer', date: '2026-07-16' },
    },
  },
}

test('token adapter emits semantic utilities with non-circular fallbacks', () => {
  assert.deepEqual(validateTokenLedger(baseLedger), [])
  const css = generateTokenCss(baseLedger)
  assert.match(css, /--factory-color-brand-fallback: #222222/)
  assert.match(css, /--color-brand: var\(--wf-color-primary, var\(--factory-color-brand-fallback\)\)/)
  assert.doesNotMatch(css, /--wf-color-primary:\s*var\(--wf-color-primary/)
  assert.match(css, /@custom-variant wf-tablet \(@media \(max-width: 991px\)\)/)
})

test('changed Figma values require intentional override provenance', () => {
  const ledger = structuredClone(baseLedger)
  ledger.tokens['color.brand'].override = null
  assert.ok(validateTokenLedger(ledger).some((error) => error.includes('override')))
})

test('normalized semantic collisions are rejected before generating CSS', () => {
  const ledger = structuredClone(baseLedger)
  ledger.tokens['color.brand-alias'] = {
    ...structuredClone(ledger.tokens['color.brand']),
    semantic: 'Brand!',
    webflow: { ...ledger.tokens['color.brand'].webflow, cssVariable: '--wf-color-brand-alias' },
  }
  ledger.tokens['color.brand'].semantic = 'Brand'
  assert.ok(validateTokenLedger(ledger).some((error) => error.includes('normalizes to a duplicate')))
})

test('factory and generated-client token contracts stay identical', () => {
  assert.deepEqual(validateClientTokenLedger(baseLedger), validateTokenLedger(baseLedger))
  assert.equal(generateClientTokenCss(baseLedger), generateTokenCss(baseLedger))
  const future = structuredClone(baseLedger)
  future.version = 2
  assert.ok(validateClientTokenLedger(future).some((error) => error.includes('version must be 1')))
})
