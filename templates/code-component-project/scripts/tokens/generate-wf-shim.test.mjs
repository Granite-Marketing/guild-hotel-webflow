import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { generateWfShim, webflowCssName } from './generate-wf-shim.mjs'

// Colocated coverage test. This template's `pnpm test` runs Playwright browser
// specs (tests/*.spec.ts); there is no node-based runner wired for scripts, so
// run this directly: `node --test scripts/tokens/generate-wf-shim.test.mjs`.

const root = resolve(fileURLToPath(new URL('../../', import.meta.url)))
const ledger = JSON.parse(await readFile(resolve(root, 'project/tokens.json'), 'utf8'))

test('webflowCssName lowercases and hyphenates the collection, keeps the name verbatim', () => {
  assert.equal(webflowCssName('Colors', 'color-primary'), '--_colors---color-primary')
  assert.equal(webflowCssName('Brand Colors', 'color-neutral-0'), '--_brand-colors---color-neutral-0')
})

test('shim aliases every ledger token to its computed Webflow cssName', () => {
  const shim = generateWfShim(ledger)
  for (const [key, token] of Object.entries(ledger.tokens)) {
    const alias = token.webflow.cssVariable
    const target = webflowCssName(token.webflow.collection, token.webflow.name)
    assert.ok(
      shim.includes(`${alias}: var(${target});`),
      `missing bridge alias for ${key}: expected "${alias}: var(${target});"`,
    )
  }
})

test('shim contains exactly one --wf-* alias line per token', () => {
  const shim = generateWfShim(ledger)
  const aliasLines = shim.split('\n').filter((line) => /^\s*--wf-[a-z0-9-]+: var\(--_/.test(line))
  assert.equal(aliasLines.length, Object.keys(ledger.tokens).length)
})

test('shim is deterministic and wrapped in a generated-file comment + <style>', () => {
  assert.equal(generateWfShim(ledger), generateWfShim(ledger))
  const shim = generateWfShim(ledger)
  assert.match(shim, /Generated from project\/tokens\.json/)
  assert.match(shim, /<style>[\s\S]*:root[\s\S]*<\/style>/)
})
