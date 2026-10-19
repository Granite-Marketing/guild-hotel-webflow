#!/usr/bin/env node
/**
 * Build the alt-text inventory: every CMS image field value and every asset
 * library image, each with the context the generator needs.
 *
 *   pnpm alt:inventory --pull        dump assets and CMS items via the Webflow REST API first
 *   pnpm alt:inventory               build from existing raw dumps (fetches live pages for context)
 *   pnpm alt:inventory --no-fetch    build without fetching live pages (no network at all)
 *   pnpm alt:inventory --help
 *
 * Inputs (raw dumps, from --pull or saved from the Webflow MCP):
 *   assets/alt-text/raw/assets.json   array of asset records
 *   assets/alt-text/raw/cms.json      { [collectionLabel]: { items: [...] } }
 *
 * Output:
 *   assets/alt-text/inventory.json    array of entries, one per image
 *
 * Collection labels, context fields and tiers come from the config file
 * (see docs/reference/alt-text-pipeline.md). Live pages listed in
 * config.staticPages are fetched to record which library images render where,
 * so static images get page and class context.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { DIR, ROOT, loadConfig, loadEnv, parseArgs, readJson, relative } from './lib/alt-text-config.mjs'

const HELP = `Usage: pnpm alt:inventory [--pull] [--no-fetch] [--config <path>]

  --pull       Dump assets and every configured collection via the Webflow REST API
               (needs WEBFLOW_API_TOKEN and WEBFLOW_SITE_ID) into assets/alt-text/raw/
  --no-fetch   Skip fetching live pages (library images then get no page context)
  --config     Config file (default assets/alt-text/config.json, else the example)
`

const args = parseArgs()
if (args.has('help')) { console.log(HELP); process.exit(0) }
loadEnv()
const { config } = loadConfig(args)

const RAW = path.join(DIR, 'raw')
const OUT = path.join(DIR, 'inventory.json')
const BRAND = config.brand?.name || null

if (args.has('pull')) await pullRaw()

const assets = readJson(path.join(RAW, 'assets.json'), 'Asset dump')
const cms = readJson(path.join(RAW, 'cms.json'), 'CMS dump')

const stripHtml = (html) => String(html || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|‍/g, ' ').replace(/\s+/g, ' ').trim()
const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'svg'])
const imageExtension = (url) => (String(url).split('?')[0].match(/\.([a-z0-9]+)$/i) || [null, ''])[1].toLowerCase()
// File fields share the { fileId, url } shape, so filter on extension too
const isImageValue = (value) => value && typeof value === 'object' && !Array.isArray(value) && 'fileId' in value && typeof value.url === 'string' && IMAGE_EXTENSIONS.has(imageExtension(value.url))

const itemsById = new Map()
for (const [label, data] of Object.entries(cms)) itemsById.set(label, new Map((data.items || []).map(item => [item.id, item])))

/** Resolve one context spec: "field-slug" or { field, ref, html, max }. */
function resolveContextValue (fieldData, spec) {
  const def = typeof spec === 'string' ? { field: spec } : spec
  let value = fieldData[def.field]
  if (value === undefined || value === null || value === '') return null
  if (def.ref) {
    const lookup = itemsById.get(def.ref)
    const ids = Array.isArray(value) ? value : [value]
    value = ids.map(id => lookup?.get(id)?.fieldData?.[def.refField || 'name']).filter(Boolean).join(', ')
    if (!value) return null
  }
  if (typeof value === 'object') return null
  if (def.html) value = stripHtml(value)
  value = String(value)
  if (def.max) value = value.slice(0, def.max)
  return value || null
}

function buildContext (collectionConfig, item) {
  const context = {}
  for (const [key, spec] of Object.entries(collectionConfig.context || { name: 'name' })) {
    context[key] = resolveContextValue(item.fieldData || {}, spec)
  }
  if (collectionConfig.includeBrand && BRAND) context.brand = BRAND
  return context
}

const entries = []

// CMS image field values
for (const [label, collectionConfig] of Object.entries(config.collections)) {
  if (collectionConfig.lookupOnly) continue
  const data = cms[label]
  if (!data) { console.warn(`[inventory] collection "${label}" is in the config but not in raw/cms.json`); continue }
  const heroFields = new Set(collectionConfig.heroFields || [])
  for (const item of data.items || []) {
    if (item.isArchived) continue
    const imageFields = []
    for (const [field, value] of Object.entries(item.fieldData || {})) {
      if (Array.isArray(value)) value.forEach((entry, index) => { if (isImageValue(entry)) imageFields.push({ field, value: entry, index: index + 1, multi: true }) })
      else if (isImageValue(value)) imageFields.push({ field, value, index: 0, multi: false })
    }
    const isGalleryField = (field, multi) => multi || (!heroFields.has(field) && imageFields.length > 1)
    const galleryCount = imageFields.filter(x => isGalleryField(x.field, x.multi)).length
    const baseContext = buildContext(collectionConfig, item)
    let galleryIndex = 0
    for (const { field, value, index, multi } of imageFields) {
      const isHero = heroFields.has(field)
      let role = 'image'
      if (isHero) role = 'hero image'
      else if (isGalleryField(field, multi)) role = `gallery image ${++galleryIndex} of ${galleryCount}`
      entries.push({
        key: `cms:${label}:${item.id}:${field}${multi ? `[${index - 1}]` : ''}`,
        kind: 'cms',
        tier: collectionConfig.tier || 'cms',
        entity: collectionConfig.entity || null,
        collection: label,
        itemId: item.id,
        itemName: item.fieldData?.name,
        itemSlug: item.fieldData?.slug,
        isDraft: !!item.isDraft,
        isHero,
        field,
        multiIndex: multi ? index - 1 : null,
        fileId: value.fileId,
        url: value.url,
        extension: imageExtension(value.url),
        currentAlt: value.alt || null,
        context: { ...baseContext, role }
      })
    }
  }
}

// Library images: where do they render?
const libraryImages = assets.filter(asset => /^image\//.test(asset.contentType || ''))
const libraryById = new Map(libraryImages.map(asset => [asset.id, asset]))
const rendered = new Map() // assetId -> [{ page, className }]
if (!args.has('no-fetch')) {
  if (!config.siteUrl) console.warn('[inventory] no siteUrl in config; skipping live page fetch')
  else {
    for (const page of config.staticPages) {
      let html
      try { html = await (await fetch(config.siteUrl + page)).text() } catch (error) { console.error(`[inventory] fetch failed for ${page}: ${error.message}`); continue }
      for (const tag of html.matchAll(/<img[^>]*>/g)) {
        const src = (tag[0].match(/src="([^"]+)"/) || [])[1] || ''
        const id = (src.match(/\/([0-9a-f]{24})_/) || [])[1]
        if (!id || !libraryById.has(id)) continue
        const className = (tag[0].match(/class="([^"]*)"/) || [])[1] || ''
        if (!rendered.has(id)) rendered.set(id, [])
        const list = rendered.get(id)
        if (!list.some(r => r.page === page && r.className === className)) list.push({ page, className })
      }
    }
  }
}

// Library images can borrow CMS context by filename (e.g. a team portrait uploaded to the library)
const normalise = (text) => String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const nameMatchers = []
for (const [label, collectionConfig] of Object.entries(config.collections)) {
  if (!collectionConfig.matchLibraryByName || !cms[label]) continue
  for (const item of cms[label].items || []) {
    if (item.isArchived || !item.fieldData?.name || normalise(item.fieldData.name).length < 4) continue
    nameMatchers.push({ needle: normalise(item.fieldData.name), entity: collectionConfig.entity || null, context: buildContext(collectionConfig, item) })
  }
}
// Longest names first so "Sam Taylor Smith" wins over "Sam Taylor"
nameMatchers.sort((a, b) => b.needle.length - a.needle.length)

for (const asset of libraryImages) {
  const name = asset.displayName || asset.originalFileName || ''
  const where = rendered.get(asset.id) || []
  const haystack = normalise(name)
  const match = nameMatchers.find(m => haystack.includes(m.needle))
  let context = { fileName: name }
  if (match) context = { ...context, ...match.context }
  if (where.length) context.renderedOn = where.map(w => `${w.page}${w.className ? ` (${w.className})` : ''}`)
  entries.push({
    key: `library:${asset.id}`,
    kind: 'library',
    tier: where.length ? 'static' : 'library',
    entity: match ? match.entity : null,
    assetId: asset.id,
    displayName: name,
    contentType: asset.contentType,
    url: asset.hostedUrl || asset.url,
    extension: imageExtension(asset.hostedUrl || asset.url || '') || String(asset.contentType).split('/')[1],
    currentAlt: asset.altText || null,
    context
  })
}

fs.mkdirSync(DIR, { recursive: true })
fs.writeFileSync(OUT, JSON.stringify(entries, null, 2))

const byTier = {}
for (const entry of entries) {
  byTier[entry.tier] ||= { total: 0, withAlt: 0, svg: 0 }
  byTier[entry.tier].total++
  if (entry.currentAlt) byTier[entry.tier].withAlt++
  if (entry.extension === 'svg') byTier[entry.tier].svg++
}
console.log(`[inventory] ${entries.length} images written to ${relative(OUT)}`)
for (const [tier, stats] of Object.entries(byTier)) console.log(`  ${tier.padEnd(10)} ${String(stats.total).padStart(4)}  (alt already: ${stats.withAlt}, svg: ${stats.svg})`)

async function pullRaw () {
  const require = createRequire(import.meta.url)
  const { WebflowClient } = require(path.join(ROOT, 'scripts/api/lib/webflow-client.cjs'))
  const client = new WebflowClient()
  fs.mkdirSync(RAW, { recursive: true })
  console.log('[inventory] pulling asset library...')
  const assetList = await client.listAssets()
  fs.writeFileSync(path.join(RAW, 'assets.json'), JSON.stringify(assetList, null, 2))
  const dump = {}
  for (const [label, collectionConfig] of Object.entries(config.collections)) {
    if (!collectionConfig.collectionId || collectionConfig.collectionId === 'REPLACE_ME') { console.warn(`[inventory] ${label}: no collectionId, skipped`); continue }
    const items = []
    for (let offset = 0; ; offset += 100) {
      const page = await client._request(`/collections/${collectionConfig.collectionId}/items?limit=100&offset=${offset}`)
      items.push(...(page.items || []))
      if (!page.items || page.items.length < 100) break
    }
    dump[label] = { collectionId: collectionConfig.collectionId, items }
    console.log(`[inventory] ${label}: ${items.length} items`)
  }
  fs.writeFileSync(path.join(RAW, 'cms.json'), JSON.stringify(dump, null, 2))
  console.log(`[inventory] raw dumps written to ${relative(RAW)}`)
}
