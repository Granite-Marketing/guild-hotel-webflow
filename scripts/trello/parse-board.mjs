#!/usr/bin/env node
// Trims a Trello board JSON export to the fields we act on: list > card > desc, checklists, comments, attachments.
// Usage: node scripts/trello/parse-board.mjs <export.json> [--lists "To-Do Desktop,Technical"] [--json]
import { readFileSync } from 'node:fs'

export const parseBoard = (board) => {
  const comments = {}
  // Export actions are newest first; reverse so comments read in posting order.
  for (const action of [...board.actions].reverse()) {
    if (action.type !== 'commentCard') continue
    const cardId = action.data.card.id
    ;(comments[cardId] ??= []).push({
      author: action.memberCreator?.fullName ?? 'unknown',
      date: action.date.slice(0, 10),
      text: action.data.text,
    })
  }
  const checklistsByCard = {}
  for (const checklist of [...board.checklists].sort((a, b) => a.pos - b.pos)) {
    ;(checklistsByCard[checklist.idCard] ??= []).push({
      name: checklist.name,
      items: [...checklist.checkItems]
        .sort((a, b) => a.pos - b.pos)
        .map((item) => ({ text: item.name, done: item.state === 'complete' })),
    })
  }
  return [...board.lists]
    .filter((list) => !list.closed)
    .sort((a, b) => a.pos - b.pos)
    .map((list) => ({
      list: list.name,
      cards: board.cards
        .filter((card) => card.idList === list.id && !card.closed)
        .sort((a, b) => a.pos - b.pos)
        .map((card) => ({
          name: card.name,
          url: card.shortUrl,
          labels: card.labels.map((label) => label.name || label.color),
          desc: card.desc.trim(),
          checklists: checklistsByCard[card.id] ?? [],
          comments: comments[card.id] ?? [],
          attachments: card.attachments.map((attachment) => ({ name: attachment.name, url: attachment.url })),
        })),
    }))
}

export const toMarkdown = (lists) =>
  lists
    .map(({ list, cards }) => {
      const body = cards.map((card) => {
        const lines = [`### ${card.name}${card.labels.length ? ` [${card.labels.join(', ')}]` : ''}`, card.url]
        if (card.desc) lines.push('', card.desc)
        for (const checklist of card.checklists) {
          lines.push('', `**${checklist.name}**`, ...checklist.items.map((item) => `- [${item.done ? 'x' : ' '}] ${item.text}`))
        }
        if (card.comments.length) lines.push('', '**Comments**', ...card.comments.map((c) => `- ${c.author} (${c.date}): ${c.text}`))
        if (card.attachments.length) lines.push('', '**Attachments**', ...card.attachments.map((a) => `- [${a.name}](${a.url})`))
        return lines.join('\n')
      })
      return [`## ${list} (${cards.length})`, ...body].join('\n\n')
    })
    .join('\n\n')

if (import.meta.url === `file://${process.argv[1]}`) {
  const [file, ...flags] = process.argv.slice(2)
  if (!file) {
    console.error('Usage: node scripts/trello/parse-board.mjs <export.json> [--lists "A,B"] [--json]')
    process.exit(1)
  }
  const listsFlag = flags.indexOf('--lists')
  const wanted = listsFlag >= 0 ? flags[listsFlag + 1].split(',').map((name) => name.trim()) : null
  const lists = parseBoard(JSON.parse(readFileSync(file, 'utf8'))).filter((l) => !wanted || wanted.includes(l.list))
  console.log(flags.includes('--json') ? JSON.stringify(lists, null, 2) : toMarkdown(lists))
}
