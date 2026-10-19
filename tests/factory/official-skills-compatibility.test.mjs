import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'

test('only selected official Webflow skills are pinned in the factory manifest', async () => {
  const manifest = JSON.parse(await readFile(new URL('../../vendor/webflow-skills-manifest.json', import.meta.url), 'utf8'))
  assert.equal(manifest.skills.length, 6)
  assert.match(manifest.upstream.revision, /^[a-f0-9]{40}$/)
  for (const skill of manifest.skills) {
    await access(new URL(`../../${skill.installPath}/SKILL.md`, import.meta.url))
  }
  assert.ok(manifest.referenceOnly.includes('webflow-code-component:component-scaffold'))
  assert.ok(manifest.compatibility.some(({ canonical }) => canonical.includes('devlink import')))
})
