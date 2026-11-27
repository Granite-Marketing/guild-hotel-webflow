#!/usr/bin/env node
// Heading check: reads the SEO sheet export and staging, marks every sheet row passed, failed or not found, gives
// H1/H2/H3 counts per page against the sheet's proposed counts and lists headings no row covers. Then compares the
// shared parts (footer, booking and newsletter band, offers slider, FAQ) of every other room, venue and untabbed
// page with the homepage's. READ ONLY: page loads and link crawling (GET) are the only network use. No Webflow
// API calls and no tokens are read.
// Usage: node scripts/api/webflow/heading-check.mjs [--sheets <dir>] [--fixtures <dir>] [--out <report.md>] [--base <url>]
//   --fixtures <dir>  read saved pages (<dir>/<slugified path>.html, "/" is home.html) instead of staging
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { slugify } from './lib/catalogue-helpers.mjs'
import { openBrowser } from './lib/copy-check-browser.mjs'
import { loadHeadingElements } from './lib/heading-check-browser.mjs'
import { parseSheetTab, rowsForPage, checkPage, sharedPartTags, diffSharedParts, missingBaselines, checkedPaths } from './lib/heading-check.mjs'
import { renderReport, summarise } from './lib/heading-check-report.mjs'
import { linksOf } from './where-used.mjs'
import { STAGING, pageUrl } from './copy-check.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const WORKERS = 4
const MAX_PAGES = 400

export function parseArguments(argv) {
  const options = { sheets: path.join(ROOT, 'docs/specs/heading-structure/source'), fixtures: null, out: null, base: STAGING }
  for (let index = 0; index < argv.length; index += 2) {
    const flag = argv[index]
    if (!['--sheets', '--fixtures', '--out', '--base'].includes(flag) || argv[index + 1] === undefined) throw new Error(`unknown or incomplete option ${flag}`)
    options[flag.slice(2)] = flag === '--base' ? argv[index + 1].replace(/\/$/, '') : path.resolve(argv[index + 1])
  }
  return options
}

export const loadTabs = (sheetsDirectory) => fs.readdirSync(sheetsDirectory).filter((file) => file.endsWith('.csv') && file !== 'read-me.csv').sort()
  .map((file) => ({ name: file.replace(/\.csv$/, ''), ...parseSheetTab(fs.readFileSync(path.join(sheetsDirectory, file), 'utf8')) }))

/** Every published page: saved files in fixtures mode, otherwise the same link crawl as where-used. Read only (GET). */
export async function discoverPaths(options) {
  if (options.fixtures) {
    return fs.readdirSync(options.fixtures).filter((file) => file.endsWith('.html')).map((file) => {
      const slug = file.replace(/\.html$/, '')
      return slug === 'home' ? '/' : `/${slug.replace(/__/g, '/')}`
    })
  }
  const seen = new Set(['/'])
  const queue = ['/']
  for (let visited = 0; queue.length > 0 && visited < MAX_PAGES; visited += 1) {
    const page = queue.shift()
    const response = await fetch(options.base + page)
    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) continue
    for (const link of linksOf(await response.text(), options.base)) if (!seen.has(link)) { seen.add(link); queue.push(link) }
  }
  seen.add('/404')
  return [...seen].sort()
}

async function loadPages(pagePaths, options) {
  const browser = await openBrowser()
  const pages = {}
  const queue = [...new Set(pagePaths)]
  const worker = async () => {
    for (let pagePath; (pagePath = queue.shift()); ) {
      pages[pagePath] = await loadHeadingElements(browser, options.fixtures ? pageUrl(pagePath, options.fixtures) : options.base + pagePath)
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

export function buildReport(tabs, pages, allPaths, meta) {
  const tabReports = tabs.map((tab) => {
    return {
      name: tab.name,
      pages: checkedPaths(tab).map((pagePath) => {
        const loaded = pages[pagePath]
        if (loaded?.status !== 'ok') return { path: pagePath, error: loaded?.error ?? 'not loaded' }
        return { path: pagePath, ...checkPage(rowsForPage(tab, pagePath), loaded.elements) }
      }),
    }
  })
  const tabPaths = new Set(tabs.flatMap(checkedPaths))
  const otherPaths = allPaths.filter((pagePath) => pagePath !== '/' && !tabPaths.has(pagePath))
  const home = pages['/']?.status === 'ok' ? sharedPartTags(pages['/'].elements) : null
  const baselineMissing = missingBaselines(home)
  const differing = []
  const notLoaded = []
  const noPage = []
  for (const pagePath of otherPaths) {
    const loaded = pages[pagePath]
    if (loaded?.httpStatus === 404 && pagePath !== '/404') { noPage.push(pagePath); continue } // linked CMS items with no published page
    if (loaded?.status !== 'ok') { notLoaded.push({ path: pagePath, error: loaded?.error ?? 'not loaded' }); continue }
    const differences = diffSharedParts(home, sharedPartTags(loaded.elements))
    if (differences.length > 0) differing.push({ path: pagePath, differences })
  }
  return { ...meta, tabs: tabReports, sharedParts: { checked: otherPaths.length - noPage.length, baselineMissing, differing, notLoaded, noPage } }
}

export async function main(argv) {
  const options = parseArguments(argv)
  const tabs = loadTabs(options.sheets)
  const discovered = await discoverPaths(options)
  const sheetPaths = tabs.flatMap((tab) => tab.paths)
  const allPaths = [...new Set(options.fixtures ? discovered : [...discovered, ...sheetPaths])].sort()
  const pages = await loadPages(allPaths, options)
  const report = buildReport(tabs, pages, allPaths, {
    generated: new Date().toISOString(),
    source: options.fixtures ? `saved pages in ${path.relative(ROOT, options.fixtures)}` : options.base,
  })
  const markdown = renderReport(report)
  if (options.out) { fs.mkdirSync(path.dirname(options.out), { recursive: true }); fs.writeFileSync(options.out, markdown) } else process.stdout.write(markdown)
  console.log(JSON.stringify(summarise(report)))
  return report
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => { console.error(error); process.exit(1) })
}
