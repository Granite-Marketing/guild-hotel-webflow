import test from 'node:test'
import assert from 'node:assert/strict'
import { parseRevealStart } from '../../src/utils/revealStart.ts'

test('a number sets the start percentage', () => {
  assert.equal(parseRevealStart('60'), 'top 60%')
  assert.equal(parseRevealStart('72.5'), 'top 72.5%')
  assert.equal(parseRevealStart(' 40 '), 'top 40%')
  assert.equal(parseRevealStart('0'), 'top 0%')
})

test('missing value keeps today\'s start', () => {
  assert.equal(parseRevealStart(undefined), 'top 90%')
  assert.equal(parseRevealStart(null), 'top 90%')
  assert.equal(parseRevealStart(''), 'top 90%')
  assert.equal(parseRevealStart('  '), 'top 90%')
})

test('invalid value keeps today\'s start', () => {
  for (const bad of ['abc', '60%', 'NaN', 'Infinity', '-5', '101', '5 0']) {
    assert.equal(parseRevealStart(bad), 'top 90%', bad)
  }
})
