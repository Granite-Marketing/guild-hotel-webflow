import test from 'node:test'
import assert from 'node:assert/strict'
import { parseBoard, toMarkdown } from '../../scripts/trello/parse-board.mjs'

const board = {
  lists: [
    { id: 'l2', name: 'Done', closed: false, pos: 2 },
    { id: 'l1', name: 'To-Do', closed: false, pos: 1 },
    { id: 'l3', name: 'Old', closed: true, pos: 3 },
  ],
  cards: [
    { id: 'c2', idList: 'l1', name: 'Second', pos: 2, closed: false, shortUrl: 'u2', labels: [], desc: '', attachments: [] },
    { id: 'c1', idList: 'l1', name: 'First', pos: 1, closed: false, shortUrl: 'u1', labels: [{ name: '', color: 'red' }], desc: ' fix it ', attachments: [] },
    { id: 'c3', idList: 'l1', name: 'Archived', pos: 3, closed: true, shortUrl: 'u3', labels: [], desc: '', attachments: [] },
  ],
  checklists: [
    { idCard: 'c1', name: 'Checklist', pos: 1, checkItems: [{ name: 'b', pos: 2, state: 'complete' }, { name: 'a', pos: 1, state: 'incomplete' }] },
  ],
  actions: [
    { type: 'commentCard', date: '2026-11-04T10:00:00Z', memberCreator: { fullName: 'Omar' }, data: { card: { id: 'c1' }, text: 'later' } },
    { type: 'commentCard', date: '2026-11-03T10:00:00Z', memberCreator: { fullName: 'Stephen' }, data: { card: { id: 'c1' }, text: 'earlier' } },
  ],
}

test('parseBoard keeps open lists and cards in board order with checklists and comments', () => {
  const lists = parseBoard(board)
  assert.deepEqual(lists.map((l) => l.list), ['To-Do', 'Done'])
  const [first, second] = lists[0].cards
  assert.equal(lists[0].cards.length, 2)
  assert.equal(second.name, 'Second')
  assert.equal(first.desc, 'fix it')
  assert.deepEqual(first.labels, ['red'])
  assert.deepEqual(first.checklists[0].items, [{ text: 'a', done: false }, { text: 'b', done: true }])
  assert.deepEqual(first.comments.map((c) => c.text), ['earlier', 'later'])
  assert.match(toMarkdown(lists), /- \[x\] b/)
})
