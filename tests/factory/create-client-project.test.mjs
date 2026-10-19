import assert from 'node:assert/strict'
import { access, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const node = process.execPath
const script = new URL('../../scripts/factory/create-client-project.mjs', import.meta.url)

test('generator creates an independent client project', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'webflow-generator-'))
  const destination = join(parent, 'Acme Website')
  const result = spawnSync(node, [fileURLToPath(script), destination, 'Acme Library'], {
    cwd: new URL('../..', import.meta.url),
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
  const packageJson = JSON.parse(await readFile(join(destination, 'package.json'), 'utf8'))
  const webflowJson = JSON.parse(await readFile(join(destination, 'webflow.json'), 'utf8'))
  assert.equal(packageJson.name, 'acme-website')
  assert.equal(webflowJson.library.name, 'Acme Library')
  await access(join(destination, '.git', 'HEAD'))
  for (const scriptName of ['diff-webflow-state.mjs', 'inspect-webflow.mjs', 'probe-webflow-capabilities.mjs', 'validate-blueprint.mjs']) {
    await access(join(destination, 'scripts', 'project', scriptName))
  }
  assert.equal(packageJson.scripts['project:snapshot'], 'node scripts/project/inspect-webflow.mjs')
  await assert.rejects(access(join(destination, '.claude')))
  await assert.rejects(access(join(destination, 'node_modules')))
})

test('generator rejects a non-empty destination without modifying it', async () => {
  const destination = await mkdtemp(join(tmpdir(), 'webflow-generator-existing-'))
  const marker = join(destination, 'keep.txt')
  await writeFile(marker, 'keep')
  const result = spawnSync(node, [fileURLToPath(script), destination], {
    cwd: new URL('../..', import.meta.url),
    encoding: 'utf8',
  })

  assert.notEqual(result.status, 0)
  assert.equal(await readFile(marker, 'utf8'), 'keep')
})

test('generator cleans up a destination it owns when initialization fails', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'webflow-generator-cleanup-'))
  const destination = join(parent, 'failed-project')
  const result = spawnSync(node, [fileURLToPath(script), destination], {
    cwd: new URL('../..', import.meta.url),
    encoding: 'utf8',
    env: { ...process.env, PATH: '' },
  })
  assert.notEqual(result.status, 0)
  await assert.rejects(access(destination))
})
