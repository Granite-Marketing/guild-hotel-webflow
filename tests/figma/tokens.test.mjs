import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { readFigmaFile } from '../../scripts/api/figma/extract-tokens.mjs'
import { extractTokens, serialiseTokens } from '../../scripts/api/figma/lib/tokens.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const fixturePath = join(repoRoot, 'tests/figma/fixtures/file-depth4.json.gz')
const cliPath = join(repoRoot, 'scripts/api/figma/extract-tokens.mjs')

const loadFixture = () => readFigmaFile(fixturePath)

test('every named TEXT style resolves to exactly one mapping entry', () => {
  const file = loadFixture()
  const tokens = extractTokens(file)
  const namedTextIds = Object.entries(file.styles)
    .filter(([, style]) => style.styleType === 'TEXT')
    .map(([id]) => id)
    .sort()
  assert.ok(namedTextIds.length > 0)
  assert.deepEqual(tokens.namedStyles.text.map((style) => style.id).sort(), namedTextIds)

  for (const styleId of namedTextIds) {
    const entries = tokens.mapping.typography.filter(
      (entry) => entry.source.type === 'namedStyle' && entry.source.id === styleId,
    )
    assert.equal(entries.length, 1, `named style ${styleId} has ${entries.length} mapping entries`)
    const [entry] = entries
    assert.equal(typeof entry.override, 'boolean')
    if (entry.status === 'mapped') {
      assert.match(entry.target, /^(heading-style-h[1-6]|text-size-[a-z]+)$/)
    }
    if (entry.override) assert.ok(entry.reasons.length > 0, `override on ${styleId} needs a reason`)
  }
})

test('all 11 named styles in the fixture are collected by type', () => {
  const tokens = extractTokens(loadFixture())
  const total = Object.values(tokens.namedStyles).reduce((sum, list) => sum + list.length, 0)
  assert.equal(total, 11)
  assert.equal(tokens.namedStyles.grid.length, 1)
  assert.equal(tokens.verifiedAgainstLive, false)
})

test('named styles used on visible nodes resolve to concrete values with counts', () => {
  const tokens = extractTokens(loadFixture())
  const h2 = tokens.namedStyles.text.find((style) => style.name === 'H2-CAPS')
  assert.ok(h2.usageCount > 0)
  assert.equal(h2.resolved.fontFamily, 'Sackers Heavy Gothic')
  assert.equal(h2.resolved.fontSize, 40)
  const h2Entry = tokens.mapping.typography.find((entry) => entry.source.id === h2.id)
  assert.equal(h2Entry.target, 'heading-style-h2')
})

test('every distinct text style without a named style gets a mapping entry', () => {
  const tokens = extractTokens(loadFixture())
  const unnamed = tokens.textStyles.filter((style) => style.namedStyleIds.length === 0)
  for (const style of unnamed) {
    const entries = tokens.mapping.typography.filter(
      (entry) => entry.source.type === 'textStyle' && entry.source.key === style.key,
    )
    assert.equal(entries.length, 1, `text style ${style.key}`)
  }
})

test('colours that differ only by alpha stay distinct and are never grouped', () => {
  const tokens = extractTokens(loadFixture())
  const blacks = tokens.colors.filter((color) => color.hex === '#000000')
  const opacities = blacks.map((color) => color.opacity).sort()
  assert.ok(blacks.length >= 2, 'fixture has alpha variants of black')
  assert.equal(new Set(opacities).size, blacks.length)
  for (const group of tokens.colorGroups) {
    const groupOpacities = new Set(
      group.members.map((key) => tokens.colors.find((color) => color.key === key).opacity),
    )
    assert.equal(groupOpacities.size, 1, `group ${group.id} mixes opacities`)
  }
  const alphaEntries = tokens.mapping.colors.filter((entry) => entry.hex === '#000000' && entry.opacity < 1)
  assert.equal(alphaEntries.length, blacks.filter((color) => color.opacity < 1).length)
  for (const entry of alphaEntries) assert.equal(entry.override, true)
})

test('near-duplicate hexes are grouped with a note', () => {
  const tokens = extractTokens(loadFixture())
  const group = tokens.colorGroups.find((candidate) => candidate.members.includes('#D0D0D0@1'))
  assert.ok(group, 'expected #D0D0D0 grouped with a near duplicate')
  assert.ok(group.members.includes('#D1D1D1@1'))
  assert.match(group.note, /Near-duplicate/)
})

test('fonts include Sackers Heavy Gothic flagged for manual upload', () => {
  const tokens = extractTokens(loadFixture())
  const sackers = tokens.fonts.find((font) => font.family === 'Sackers Heavy Gothic')
  assert.ok(sackers)
  assert.equal(sackers.requiresUpload, true)
  assert.ok(tokens.fontsRequiringUpload.includes('Sackers Heavy Gothic'))
  for (const font of tokens.fonts) assert.equal(font.requiresUpload, !font.system)
})

test('output is deterministic across two runs, including the CLI', () => {
  const first = serialiseTokens(extractTokens(loadFixture()))
  const second = serialiseTokens(extractTokens(loadFixture()))
  assert.equal(first, second)

  const workDir = mkdtempSync(join(tmpdir(), 'tokens-test-'))
  try {
    const outA = join(workDir, 'a.json')
    const outB = join(workDir, 'b.json')
    execFileSync(process.execPath, [cliPath, '--input', fixturePath, '--out', outA], { stdio: 'pipe' })
    execFileSync(process.execPath, [cliPath, '--input', fixturePath, '--out', outB], { stdio: 'pipe' })
    const cliFirst = readFileSync(outA, 'utf8')
    assert.equal(cliFirst, readFileSync(outB, 'utf8'))
    assert.equal(cliFirst, first)
    assert.doesNotMatch(cliFirst, /lastModified|\d{4}-\d{2}-\d{2}T\d{2}:/)
  } finally {
    rmSync(workDir, { recursive: true, force: true })
  }
})

test('output contains no em dashes', () => {
  const output = serialiseTokens(extractTokens(loadFixture()))
  assert.equal(output.includes('\u2014'), false)
})
