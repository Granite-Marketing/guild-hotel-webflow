import assert from 'node:assert/strict'
import { mkdir, mkdtemp, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { scanClientBoundary } from '../../scripts/factory/validate-client-boundary.mjs'

test('client boundary accepts a clean project', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webflow-boundary-clean-'))
  await writeFile(join(root, 'package.json'), '{"private":true}\n')

  assert.deepEqual(await scanClientBoundary(root), [])
})

test('client boundary rejects private paths and credentials', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webflow-boundary-private-'))
  await mkdir(join(root, '.claude', 'skills'), { recursive: true })
  await writeFile(join(root, '.claude', 'skills', 'secret.md'), 'factory orchestration')
  await writeFile(join(root, 'leak.txt'), 'WEBFLOW_API_TOKEN=wf-secret-value')

  const findings = await scanClientBoundary(root)
  assert.ok(findings.some(({ type }) => type === 'forbidden-path'))
  assert.ok(findings.some(({ type }) => type === 'credential'))
})

test('client boundary rejects structured credentials and private artifacts while allowing placeholders', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webflow-boundary-structured-'))
  await writeFile(join(root, 'secrets.json'), JSON.stringify({ WEBFLOW_WORKSPACE_API_TOKEN: 'wf-live-secret' }))
  await writeFile(join(root, 'config.yml'), 'FIGMA_API_TOKEN: figma-live-secret\n')
  await writeFile(join(root, '.env.example'), 'WEBFLOW_API_TOKEN=${WEBFLOW_API_TOKEN}\n')
  await writeFile(join(root, 'AGENTS.md'), 'instructions')
  await writeFile(join(root, 'renamed.txt'), 'BEGIN COMPOUND CODEX TOOL MAP')

  const findings = await scanClientBoundary(root)
  assert.equal(findings.filter(({ type }) => type === 'credential').length, 2)
  assert.ok(findings.some(({ type, path }) => type === 'forbidden-path' && path === 'AGENTS.md'))
  assert.ok(findings.some(({ type }) => type === 'private-signature'))
})

test('client boundary fails closed on symlinks', async () => {
  const root = await mkdtemp(join(tmpdir(), 'webflow-boundary-symlink-'))
  await writeFile(join(root, 'safe.txt'), 'safe')
  await symlink(join(root, 'safe.txt'), join(root, 'alias.txt'))
  const findings = await scanClientBoundary(root)
  assert.ok(findings.some(({ type, path }) => type === 'symlink' && path === 'alias.txt'))
})
