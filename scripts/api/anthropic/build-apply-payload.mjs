#!/usr/bin/env node
/**
 * Turn a reviewed alt-text output file into Webflow write payloads.
 *
 *   pnpm alt:payload --tier projects
 *
 * Reads  assets/alt-text/output/<tier>.json  (edit the `alt` field there first)
 * Writes assets/alt-text/apply/<tier>/assets-<n>.json           library chunks (safe):
 *          { assets: [{ assetId, displayName, alt }] }
 *        assets/alt-text/apply/<tier>/cms-<collection>-<n>.json CMS chunks (re-import, see below):
 *          { collection, collectionId, items: [{ id, fieldData }], publishItemIds, draftItemIds }
 *
 * CMS fieldData carries only the image fields being changed, each as
 * { fileId, url, alt } (all three are required by the v2 API). Every such
 * write RE-IMPORTS the file: new fileId, srcset variants lost for good. The
 * apply script skips CMS chunks unless explicitly told otherwise.
 * MultiImage fields are sent as the complete array, rebuilt from the
 * inventory, because an update replaces the whole array. Draft items are
 * updated but left out of publishItemIds so they stay drafts.
 */

import fs from 'node:fs'
import path from 'node:path'
import { DIR, loadConfig, parseArgs, readJson, relative } from './lib/alt-text-config.mjs'

const HELP = `Usage: pnpm alt:payload --tier <tier> [--config <path>]

Builds apply chunks from assets/alt-text/output/<tier>.json into assets/alt-text/apply/<tier>/.
No network calls.
`

const CHUNK = 20
const args = parseArgs()
if (args.has('help')) { console.log(HELP); process.exit(0) }
const tier = args.get('tier')
if (!tier) { console.error(HELP); process.exit(1) }
const { config } = loadConfig(args)

const inventory = readJson(path.join(DIR, 'inventory.json'), 'Inventory')
const records = readJson(path.join(DIR, 'output', `${tier}.json`), `Output for tier "${tier}" (run pnpm alt:generate first)`)
const outDir = path.join(DIR, 'apply', tier)
fs.rmSync(outDir, { recursive: true, force: true })
fs.mkdirSync(outDir, { recursive: true })

const usable = records.filter(record => record.alt && !record.error && record.alt.length <= config.maxChars)
const skipped = records.length - usable.length
const altByKey = new Map(usable.map(record => [record.key, record.alt]))
const inventoryByKey = new Map(inventory.map(entry => [entry.key, entry]))

// CMS: group by collection, then item, then field
const cmsByCollection = {}
for (const record of usable.filter(r => r.kind === 'cms')) {
  const entry = inventoryByKey.get(record.key)
  if (!entry) { console.error(`[payload] ${record.key} is not in the inventory; skipped`); continue }
  const collection = (cmsByCollection[record.collection] ||= {})
  const item = (collection[record.itemId] ||= { id: record.itemId, isDraft: entry.isDraft, name: record.itemName, slug: entry.itemSlug, fieldData: {} })
  if (record.multiIndex === null || record.multiIndex === undefined) {
    item.fieldData[record.field] = { fileId: record.fileId, url: record.url, alt: record.alt }
  } else if (!item.fieldData[record.field]) {
    // Rebuild the full MultiImage array from the inventory, applying new alts where we have them
    const siblings = inventory
      .filter(e => e.itemId === record.itemId && e.field === record.field)
      .sort((a, b) => a.multiIndex - b.multiIndex)
    item.fieldData[record.field] = siblings.map(e => ({ fileId: e.fileId, url: e.url, alt: altByKey.get(e.key) ?? e.currentAlt ?? '' }))
  }
}

const slugify = (text) => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
let fileCount = 0
for (const [collection, items] of Object.entries(cmsByCollection)) {
  const collectionId = config.collections[collection]?.collectionId
  if (!collectionId || collectionId === 'REPLACE_ME') { console.error(`[payload] no collectionId for "${collection}" in the config; its items are skipped`); continue }
  const list = Object.values(items)
  for (let i = 0; i < list.length; i += CHUNK) {
    const chunk = list.slice(i, i + CHUNK)
    const payload = {
      kind: 'cms',
      collection,
      collectionId,
      pagePath: config.collections[collection]?.pagePath || null,
      items: chunk.map(({ id, fieldData }) => ({ id, fieldData })),
      publishItemIds: chunk.filter(x => !x.isDraft).map(x => x.id),
      draftItemIds: chunk.filter(x => x.isDraft).map(x => x.id),
      itemNames: Object.fromEntries(chunk.map(x => [x.id, x.name])),
      itemSlugs: Object.fromEntries(chunk.map(x => [x.id, x.slug]))
    }
    fs.writeFileSync(path.join(outDir, `cms-${slugify(collection)}-${String(i / CHUNK + 1).padStart(2, '0')}.json`), JSON.stringify(payload, null, 2))
    fileCount++
  }
  console.log(`[payload] ${collection}: ${list.length} items, ${list.reduce((n, x) => n + Object.keys(x.fieldData).length, 0)} image fields (CMS: apply re-imports these images)`)
}

// Library assets
const library = usable.filter(record => record.kind === 'library')
for (let i = 0; i < library.length; i += CHUNK) {
  const chunk = library.slice(i, i + CHUNK).map(record => ({ assetId: record.assetId, displayName: record.displayName, alt: record.alt }))
  fs.writeFileSync(path.join(outDir, `assets-${String(i / CHUNK + 1).padStart(2, '0')}.json`), JSON.stringify({ kind: 'library', assets: chunk }, null, 2))
  fileCount++
}
if (library.length) console.log(`[payload] library: ${library.length} assets`)

console.log(`[payload] ${fileCount} payload file(s) in ${relative(outDir)}; ${skipped} record(s) skipped (missing, errored, or over ${config.maxChars} chars)`)
