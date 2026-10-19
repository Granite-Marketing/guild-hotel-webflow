import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { gunzipSync } from 'node:zlib'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { collectVectors, isVectorOnly, vectorFilename } from '../../scripts/api/figma/lib/vectors.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const RAW = join(ROOT, 'figma/raw/file.json.gz')
const SNAPSHOT = join(ROOT, 'figma/snapshot.json')
const haveSnapshot = existsSync(RAW) && existsSync(SNAPSHOT)

function load () {
  const fileJson = JSON.parse(gunzipSync(readFileSync(RAW)).toString('utf-8'))
  const snapshot = JSON.parse(readFileSync(SNAPSHOT, 'utf-8'))
  const frameIds = snapshot.frames.filter(f => f.kind === 'page' || f.kind === 'side').map(f => f.id)
  return { fileJson, frameIds }
}

test('collects distinct vector shapes from the real snapshot, deterministically', { skip: !haveSnapshot }, () => {
  const { fileJson, frameIds } = load()
  const first = collectVectors(fileJson, frameIds)
  const second = collectVectors(fileJson, frameIds)
  assert.ok(first.length > 20, `expected many shapes, got ${first.length}`)
  assert.deepEqual(first, second)
  const signatures = new Set(first.map(v => v.signature))
  assert.equal(signatures.size, first.length)
  for (const vector of first) {
    assert.ok(vector.uses.length >= 1)
    assert.ok(vector.width >= 4 && vector.height >= 4)
  }
})

test('a node with an image fill is never treated as vector-only', { skip: !haveSnapshot }, () => {
  const { fileJson } = load()
  let found = null
  const walk = node => {
    if (found) return
    if ((node.fills || []).some(f => f.type === 'IMAGE')) { found = node; return }
    for (const child of node.children || []) walk(child)
  }
  walk(fileJson.document)
  assert.ok(found, 'real file has an image-filled node')
  assert.equal(isVectorOnly(found), false)
})

test('filenames are kebab-case, sized and id-suffixed', () => {
  const name = vectorFilename({ name: 'Group 270989618', width: 28, height: 12, id: '433:600' })
  assert.equal(name, 'group-270989618-28x12-433-600.svg')
})
