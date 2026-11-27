// Markdown report for the heading check. Plain text only: no em dashes.
const TAG = (tag) => (tag ? tag.toUpperCase() : '')
const cell = (text) => String(text ?? '').replace(/\|/g, '/').replace(/\s+/g, ' ').trim()

export function summarise(report) {
  const rows = report.tabs.flatMap((tab) => tab.pages.flatMap((page) => (page.results ?? [])))
  const count = (status) => rows.filter((result) => result.status === status).length
  return {
    tabs: report.tabs.length,
    rows: rows.length,
    passed: count('passed'),
    failed: count('failed'),
    notFound: count('not-found'),
    pagesNotLoaded: report.tabs.flatMap((tab) => tab.pages).filter((page) => page.error).length,
    sharedPartPagesDiffering: report.sharedParts.differing.length,
    sharedPartPagesNotLoaded: report.sharedParts.notLoaded.length,
    sharedPartsBaselineMissing: (report.sharedParts.baselineMissing ?? []).length,
  }
}

export function renderReport(report) {
  const lines = ['# Heading check', '', `Generated ${report.generated} from ${report.source}. Read only: page loads only, nothing is written to Webflow.`, '', '## Summary', '']
  const summary = summarise(report)
  lines.push(`- ${summary.tabs} tabs, ${summary.rows} rows: ${summary.passed} passed, ${summary.failed} failed, ${summary.notFound} not found`)
  lines.push(`- ${summary.sharedPartPagesDiffering} other pages differ from the homepage on a shared part, ${summary.sharedPartPagesNotLoaded} could not be loaded`)
  if (summary.sharedPartsBaselineMissing > 0) lines.push(`- ${summary.sharedPartsBaselineMissing} shared parts not compared: homepage baseline missing`)
  lines.push('')
  lines.push('| Tab | Page | Passed | Failed | Not found | H1 found/proposed | H2 found/proposed | H3 found/proposed | Uncovered h1-h3 |', '|---|---|---|---|---|---|---|---|---|')
  for (const tab of report.tabs) {
    for (const page of tab.pages) {
      if (page.error) { lines.push(`| ${tab.name} | ${page.path} | page not loaded: ${cell(page.error)} | | | | | | |`); continue }
      const count = (status) => page.results.filter((result) => result.status === status).length
      const pair = (tag) => `${page.counts[tag].found}/${page.counts[tag].proposed}`
      lines.push(`| ${tab.name} | ${page.path} | ${count('passed')} | ${count('failed')} | ${count('not-found')} | ${pair('h1')} | ${pair('h2')} | ${pair('h3')} | ${page.uncovered.length} |`)
    }
  }
  for (const tab of report.tabs) {
    for (const page of tab.pages.filter((entry) => !entry.error)) {
      const problems = page.results.filter((result) => result.status !== 'passed')
      lines.push('', `## ${tab.name}: ${page.path}`, '')
      if (problems.length === 0) lines.push('Every row passed.')
      else {
        lines.push('| Row | Section | Text | Proposed | Result |', '|---|---|---|---|---|')
        for (const { row, status, foundTag, otherSection } of problems) {
          const result = status === 'failed' ? `failed, found ${row.kind === 'logo' && foundTag !== 'img' ? `${TAG(foundTag)} without the logo` : TAG(foundTag)}`
            : otherSection ? `not found in its section (text found in ${otherSection})` : 'not found'
          lines.push(`| ${row.number} | ${cell(row.section)} | ${cell(row.text)} | ${row.kind === 'logo' ? 'H3 around logo' : TAG(row.proposedTag)} | ${result} |`)
        }
      }
      if (page.uncovered.length > 0) {
        lines.push('', 'Headings on the page that no row covers:', '')
        for (const entry of page.uncovered) lines.push(`- ${TAG(entry.tag)} "${cell(entry.text)}"${entry.section ? ` (${entry.section})` : ''}`)
      }
    }
  }
  lines.push('', '## Shared parts against the homepage', '', `Pages checked: ${report.sharedParts.checked}. Parts: footer, booking and newsletter band, offers slider, FAQ. A part differs when a class uses other tags than on the homepage, or the part is missing.`, '')
  const baselineMissing = report.sharedParts.baselineMissing ?? []
  for (const part of baselineMissing) lines.push(`- ${part}: baseline missing, comparison not done (the homepage did not load or has no ${part})`)
  if (baselineMissing.length > 0) lines.push('')
  if (report.sharedParts.differing.length === 0) lines.push(baselineMissing.length === 0 ? 'No page differs.' : 'No page differs on the parts compared.')
  for (const entry of report.sharedParts.differing) {
    lines.push(`- ${entry.path}`)
    for (const difference of entry.differences) {
      const tags = (list) => (list.length === 0 ? 'none' : list.map(TAG).join('+'))
      lines.push(difference.page === 'absent' ? `  - ${difference.part}: missing` : `  - ${difference.part}, \`${difference.classKey}\`: homepage ${tags(difference.homepage)}, here ${tags(difference.page)}`)
    }
  }
  if (report.sharedParts.noPage.length > 0) lines.push('', `Linked paths with no published page (HTTP 404), skipped: ${report.sharedParts.noPage.length} (${report.sharedParts.noPage.slice(0, 3).join(', ')}, ...)`)
  if (report.sharedParts.notLoaded.length > 0) lines.push('', 'Not loaded:', ...report.sharedParts.notLoaded.map((entry) => `- ${entry.path}: ${cell(entry.error)}`))
  return lines.join('\n') + '\n'
}
