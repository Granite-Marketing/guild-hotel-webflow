import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, rmSync, rmdirSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { dependencyProblem, installDependencies } from '../../scripts/build-preflight.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const MANIFEST = JSON.parse(readFileSync(path.join(ROOT, '.claude/build.json'), 'utf8'))
const bin = (name) => path.join(ROOT, 'node_modules/.bin', name)
const sha = (file) => createHash('sha256').update(readFileSync(path.join(ROOT, file))).digest('hex')

function checkout(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'preflight-'))
  t.after(() => rmSync(dir, { recursive: true, force: true }))
  mkdirSync(path.join(dir, 'build'))
  writeFileSync(path.join(dir, 'build/pnpm-lock.yaml'), 'lock')
  return { dir, root: path.join(dir, 'build') }
}

test('a missing or linked node_modules is replaced by a real install', (t) => {
  const { dir, root } = checkout(t)
  const install = (r) => mkdirSync(path.join(r, 'node_modules'), { recursive: true })
  assert.equal(dependencyProblem(root), 'missing')
  mkdirSync(path.join(dir, 'main/node_modules/esbuild'), { recursive: true })
  symlinkSync(path.join(dir, 'main/node_modules'), path.join(root, 'node_modules'))
  assert.equal(dependencyProblem(root), 'link')
  installDependencies(root, 'link', install)
  assert.equal(lstatSync(path.join(root, 'node_modules')).isSymbolicLink(), false)
  assert.ok(existsSync(path.join(dir, 'main/node_modules/esbuild')), 'the other checkout keeps its packages')
  assert.equal(dependencyProblem(root), null)
  writeFileSync(path.join(root, 'pnpm-lock.yaml'), 'changed')
  assert.equal(dependencyProblem(root), 'stale')
})

test("the build's checks never write the tracked dist files", () => {
  const before = ['dist/index.js', 'dist/site.css'].map(sha)
  const commands = [...MANIFEST.commands.validate.map((c) => c.run), MANIFEST.visual.prepare]
  assert.ok(!commands.some((run) => /\bpnpm (run )?build(?!:check)/.test(run)), 'a check runs the release build')
  assert.ok(MANIFEST.visual.replace.every((r) => !r.file.startsWith('dist/')), 'page checks read the tracked bundle')
  // Marked, so it differs from the release bundle whatever the branch holds.
  execFileSync(process.execPath, ['bin/build.js'], { cwd: ROOT, env: { ...process.env, NODE_ENV: 'development', GUILD_BUILD_DIR: '.build-check/test' } })
  assert.ok(existsSync(path.join(ROOT, '.build-check/test/index.js')))
  assert.deepEqual(['dist/index.js', 'dist/site.css'].map(sha), before)
})

test('a held-out check file under src never reaches the typecheck', (t) => {
  for (const dir of ['src/__heldout__', 'src/utils/__heldout__']) {
    // A folder of our own inside it: src/__heldout__ is where a validator keeps its checks while it works.
    const full = path.join(ROOT, dir, `setup-test-${process.pid}`)
    const existed = existsSync(path.join(ROOT, dir))
    mkdirSync(full, { recursive: true })
    t.after(() => {
      rmSync(full, { recursive: true, force: true })
      if (!existed) rmdirSync(path.join(ROOT, dir))
    })
    writeFileSync(path.join(full, 'setup-test.heldout.ts'), 'process.exit(notDefinedAnywhere)\n')
  }
  const files = execFileSync(bin('tsc'), ['--noEmit', '--listFilesOnly'], { cwd: ROOT, encoding: 'utf8' })
  assert.ok(!files.includes('setup-test-'))
})
