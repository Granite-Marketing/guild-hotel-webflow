import { test } from 'node:test'
import assert from 'node:assert/strict'
import { planTags, coverage, guestOptionFor, OPTIONS } from '../../scripts/api/webflow/seed-rooms-quiz.mjs'

const rooms = [
  { id: 'a', slug: 'cozy-queen', maxGuests: 2, sortOrder: 1, tags: [] },
  { id: 'b', slug: 'guild-double', maxGuests: 4, sortOrder: 2, tags: [] },
  { id: 'c', slug: 'two-bedroom-loft-suite', maxGuests: 6, sortOrder: 3, tags: [] }
]

test('guest option is the largest range the room hosts', () => {
  assert.equal(guestOptionFor(1), 'just-me')
  assert.equal(guestOptionFor(2), 'two-guests')
  assert.equal(guestOptionFor(3), '3-4-guests')
  assert.equal(guestOptionFor(6), '5-plus-guests')
})

test('every room gets one guest option and 2 or 3 per other step', () => {
  const { rooms: planned } = planTags(rooms)
  const byStep = step => OPTIONS.filter(option => option.step === step).map(option => option.slug)
  for (const room of planned) {
    assert.equal(room.tags.filter(tag => byStep(1).includes(tag)).length, 1)
    for (const step of [2, 3]) {
      const count = room.tags.filter(tag => byStep(step).includes(tag)).length
      assert.ok(count >= 2 && count <= 3, `${room.slug} step ${step} has ${count}`)
    }
  }
})

test('placeholders are added until coverage reaches the target', () => {
  const plan = planTags(rooms)
  assert.ok(plan.ratio >= 0.7)
  assert.equal(plan.covered.size + plan.missing.length, 100)
  for (const room of plan.rooms.filter(room => room.action === 'create')) assert.match(room.name, /^Placeholder /)
})

test('rooms that already have tags are kept unless retag', () => {
  const tagged = [{ ...rooms[0], tags: ['two-guests', 'celebration', 'quiet'] }, rooms[1]]
  assert.deepEqual(planTags(tagged, { target: 0 }).rooms.find(room => room.id === 'a').tags, ['two-guests', 'celebration', 'quiet'])
  assert.equal(planTags(tagged, { retag: true, target: 0 }).rooms.find(room => room.id === 'a').action, 'tag')
})

test('planning is deterministic, so re-runs never add more placeholders', () => {
  assert.deepEqual(planTags(rooms), planTags(rooms))
})

test('coverage counts only full guest + stay + feature matches', () => {
  assert.equal(coverage([{ tags: ['two-guests', 'celebration', 'quiet'] }]).covered.size, 1)
  assert.equal(coverage([{ tags: ['two-guests', 'celebration'] }]).covered.size, 0)
})
