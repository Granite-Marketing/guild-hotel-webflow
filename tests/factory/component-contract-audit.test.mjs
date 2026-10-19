import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { auditComponentDirectory } from '../../templates/code-component-project/scripts/component-contract/audit.mjs'

test('template example passes the automated component contract', async () => {
  const findings = await auditComponentDirectory(new URL('../../templates/code-component-project/src/components', import.meta.url))
  assert.deepEqual(findings, [])
})

test('audit rejects fixed IDs, disabled SSR, and arbitrary CSS text props', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'component-contract-'))
  await writeFile(join(directory, 'Bad.tsx'), '<section aria-labelledby="fixed"><article><header><h2 id="fixed">Bad</h2></header></article></section>')
  await writeFile(join(directory, 'Bad.webflow.tsx'), `props: { css: props.Text({ name: 'CSS' }) }, options: { ssr: false }`)
  const findings = await auditComponentDirectory(directory)
  assert.ok(findings.some(({ rule }) => rule === 'unique-ids'))
  assert.ok(findings.some(({ rule }) => rule === 'ssr-default'))
  assert.ok(findings.some(({ rule }) => rule === 'no-arbitrary-css-props'))
})
