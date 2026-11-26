#!/usr/bin/env node
// Copy check: loads each page the copy map points at on staging (headless chromium, 1440 wide), compares every
// row's target with its new text, and writes the report. Read only: page loads (GET) are the only network use.
// No Webflow API calls and no tokens are read.
// Usage: node scripts/api/webflow/copy-check.mjs [--fixtures <dir>] [--out <dir>] [--map <copy-map.json>]
//   --fixtures <dir>  read saved pages (<dir>/<slugified path>.html, "/" is home.html) instead of staging
// Writes docs/specs/guild-content/catalogue/copy-check.json and copy-check.md (or into --out).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { readJson, slugify } from './lib/catalogue-helpers.mjs'
import { checkRows, pagesNeeded } from './lib/copy-check.mjs'
import { buildCopyCheckReport, renderCopyCheckMarkdown } from './lib/copy-check-report.mjs'
import { openBrowser, loadPageElements } from './lib/copy-check-browser.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const CATALOGUE = path.join(ROOT, 'docs/specs/guild-content/catalogue')
export const STAGING = 'https://the-guild-hotel-c34e71.webflow.io' // same as STAGING in catalogue.mjs
const WORKERS = 4

export function parseArguments(argv) {
  const options = { fixtures: null, out: CATALOGUE, map: path.join(CATALOGUE, 'copy-map.json') }
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index]
    if (!['--fixtures', '--out', '--map'].includes(flag) || argv[index + 1] === undefined) throw new Error(`unknown or incomplete option ${flag}`)
    options[flag.slice(2)] = path.resolve(argv[index + 1])
  }
  return options
}

export const pageUrl = (pagePath, fixturesDirectory) =>
  fixturesDirectory ? pathToFileURL(path.join(fixturesDirectory, `${slugify(pagePath)}.html`)).href : STAGING + pagePath

export async function loadPages(pagePaths, fixturesDirectory) {
  const browser = await openBrowser()
  const pages = {}
  const queue = [...pagePaths]
  const worker = async () => {
    for (let pagePath; (pagePath = queue.shift()); ) {
      pages[pagePath] = await loadPageElements(browser, pageUrl(pagePath, fixturesDirectory))
      console.log(`${pages[pagePath].status} ${pagePath} ${pages[pagePath].elements?.length ?? pages[pagePath].error ?? ''}`)
    }
  }
  try {
    await Promise.all(Array.from({ length: WORKERS }, worker))
  } finally {
    await browser.close()
  }
  return pages
}

export async function main(argv) {
  const options = parseArguments(argv)
  const map = readJson(options.map)
  const pages = await loadPages(pagesNeeded(map.rows), options.fixtures)
  const report = buildCopyCheckReport(checkRows(map.rows, pages), {
    generated: new Date().toISOString(),
    staging: options.fixtures ? `saved pages in ${path.relative(ROOT, options.fixtures)}` : STAGING,
  })
  fs.mkdirSync(options.out, { recursive: true })
  fs.writeFileSync(path.join(options.out, 'copy-check.json'), JSON.stringify(report, null, 1).replace(/\u2014/g, '\\u2014') + '\n')
  fs.writeFileSync(path.join(options.out, 'copy-check.md'), renderCopyCheckMarkdown(report))
  console.log(JSON.stringify(report.summary))
  return report
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => { console.error(error); process.exit(1) })
}
