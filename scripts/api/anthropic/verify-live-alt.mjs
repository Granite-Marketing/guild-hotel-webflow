#!/usr/bin/env node
/**
 * Count <img> tags with non-empty alt, and with srcset, on the live site.
 *
 *   pnpm alt:verify --save-baseline          record the pre-run state to assets/alt-text/baseline.json
 *   pnpm alt:verify                          compare the live site against that baseline
 *   pnpm alt:verify /projects/some-slug      add pages (e.g. the page of a probed CMS item)
 *
 * Pages: config.staticPages plus any paths given as arguments. The srcset
 * column is the check for the CMS re-import trap: if it drops after a CMS
 * write, the images lost their responsive variants.
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIR, loadConfig, parseArgs, relative } from './lib/alt-text-config.mjs'

const HELP = `Usage: pnpm alt:verify [--save-baseline] [--baseline <file>] [--config <path>] [/extra/page ...]

Fetches each page from config.siteUrl and reports images with alt and with srcset.
`

const args = parseArgs()
if (args.has('help')) { console.log(HELP); process.exit(0) }
const { config } = loadConfig(args)
if (!config.siteUrl) { console.error('[verify] no siteUrl in config (or ALT_TEXT_SITE_URL)'); process.exit(1) }

const baselinePath = path.resolve(args.get('baseline') || path.join(DIR, 'baseline.json'))
const baseline = !args.has('save-baseline') && fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {}
const pages = [...new Set([...config.staticPages, ...args.positional.filter(p => p.startsWith('/'))])]
const results = {}

for (const page of pages) {
  let html
  try { html = await (await fetch(config.siteUrl + page)).text() } catch (error) { console.error(`${page.padEnd(32)} fetch failed: ${error.message}`); continue }
  const images = [...html.matchAll(/<img[^>]*>/g)].map(match => match[0])
  const withAlt = images.filter(tag => /\balt="[^"]+"/.test(tag)).length
  const withSrcset = images.filter(tag => /\bsrcset="[^"]+"/.test(tag)).length
  results[page] = { images: images.length, withAlt, withSrcset }
  const before = baseline[page]
  const comparison = before ? `   baseline alt ${before.withAlt}/${before.images}, srcset ${before.withSrcset}` : ''
  const srcsetDrop = before && withSrcset < before.withSrcset ? '   SRCSET DROPPED' : ''
  console.log(`${page.padEnd(32)} alt ${String(withAlt).padStart(3)}/${String(images.length).padEnd(3)} srcset ${String(withSrcset).padStart(3)}${comparison}${srcsetDrop}`)
  const missing = images.filter(tag => !/\balt="[^"]+"/.test(tag))
  if (missing.length && missing.length <= 5) for (const tag of missing) console.log(`    missing alt: ${((tag.match(/src="([^"]+)"/) || [])[1] || '').split('/').pop().slice(0, 80)}`)
}

if (args.has('save-baseline')) {
  fs.mkdirSync(path.dirname(baselinePath), { recursive: true })
  fs.writeFileSync(baselinePath, JSON.stringify({ ...results, savedAt: new Date().toISOString() }, null, 2))
  console.log(`[verify] baseline saved to ${relative(baselinePath)}`)
}
