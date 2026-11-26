// Copy check report: rows grouped by page with counts per status, as JSON data and Markdown.
import { STATUSES, countStatuses } from './copy-check.mjs'

export function buildCopyCheckReport(results, meta = {}) {
  const byPage = new Map()
  for (const result of results) {
    if (!byPage.has(result.page)) byPage.set(result.page, [])
    byPage.get(result.page).push(result)
  }
  const pages = [...byPage.keys()].sort().map((page) => ({ page, counts: countStatuses(byPage.get(page)), rows: byPage.get(page) }))
  return { ...meta, summary: { ...countStatuses(results), total: results.length }, pages }
}

const cell = (text, limit = 80) => {
  const flat = String(text ?? '').replace(/\s+/g, ' ').replace(/\|/g, '\\|').trim()
  return flat.length > limit ? `${flat.slice(0, limit - 3)}...` : flat
}

export function renderCopyCheckMarkdown(report) {
  const lines = [
    '# Copy check', '',
    `Generated${report.generated ? ` ${report.generated}` : ''} by \`pnpm copy-check\` from \`copy-map.json\`${report.staging ? ` against ${report.staging}` : ''} (headless, 1440 wide). Read only: nothing is written to Webflow.`, '',
    'done: the new text is on the page (case and whitespace ignored). differs: the target is there but reads differently. missing: neither is there. unchecked: not checked, reason given.', '',
    '## Summary', '', '| status | rows |', '|---|---|',
    ...STATUSES.map((status) => `| ${status} | ${report.summary[status]} |`),
    `| total | ${report.summary.total} |`, '',
    '| page | done | differs | missing | unchecked |', '|---|---|---|---|---|',
    ...report.pages.map((entry) => `| ${cell(entry.page)} | ${STATUSES.map((status) => entry.counts[status]).join(' | ')} |`), '',
  ]
  for (const entry of report.pages) {
    lines.push(`## ${entry.page}`, '', STATUSES.map((status) => `${status} ${entry.counts[status]}`).join(', '), '',
      '| row | status | new text | found or reason |', '|---|---|---|---|')
    for (const row of entry.rows) {
      const detail = row.status === 'differs' ? `found: ${row.foundText}` : row.status === 'unchecked' ? row.reason : row.checkedOn && row.checkedOn !== row.page ? `on ${row.checkedOn}` : ''
      lines.push(`| \`${row.id}\` | ${row.status} | ${cell(row.newText)} | ${cell(detail, 120)} |`)
    }
    lines.push('')
  }
  return lines.join('\n')
}
