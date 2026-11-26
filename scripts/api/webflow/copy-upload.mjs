#!/usr/bin/env node
// Copy upload (#418): writes the copy map's "change" rows to staging through the Webflow Data API.
// Dry run by default. One batch per call: a static page ("/arts") or a CMS collection ("cms:rooms").
// Reads before it writes and only touches mapped nodes, props and text fields; never writes an image field.
// Every action is appended to docs/specs/guild-content/upload-log.json (and upload-log.csv) for client review.
// Usage: node scripts/api/webflow/copy-upload.mjs --list
//        node scripts/api/webflow/copy-upload.mjs --batch /arts [--apply] [--publish]
//        node scripts/api/webflow/copy-upload.mjs --publish-only
// Credentials: WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID from the environment.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { readJson } from './lib/catalogue-helpers.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const CONTENT = path.join(ROOT, 'docs/specs/guild-content')
const MAP = path.join(CONTENT, 'catalogue/copy-map.json')
const LOG_JSON = path.join(CONTENT, 'upload-log.json')
const LOG_CSV = path.join(CONTENT, 'upload-log.csv')
const TEXT_FIELD_TYPES = new Set(['PlainText', 'RichText'])

const collapse = (text) => (text || '').replace(/&nbsp;| /g, ' ').replace(/\s+/g, ' ').trim().toLowerCase()
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const stripTags = (html) => (html || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')

// ---------------------------------------------------------------- pure planning (tested)
export function writableRows(rows) {
  return rows.filter((row) => row.status === 'change' && !row.joinedInto && !row.duplicateOf && (row.newText || '').trim())
}

export function batchOf(row) {
  if (row.targetKind === 'cms-field') return `cms:${row.cmsItem.collection}`
  if (row.targetKind === 'page-text' || row.targetKind === 'component-prop') return row.page
  return null // component-fixed: text inside a shared component definition, never written here
}

export function richTextHtml(row) {
  if (row.target?.format === 'list') return `<ul>${row.newText.split('\n').map((line) => `<li>${escapeHtml(line.trim())}</li>`).join('')}</ul>`
  return row.newText.split(/\n{2,}/).map((paragraph) => `<p>${escapeHtml(paragraph.trim())}</p>`).join('')
}

// New html for a page text node: keep the outer tag and its attributes, replace the content.
export function replaceNodeHtml(html, newText) {
  const match = /^\s*(<(\w+)[^>]*>)([\s\S]*)(<\/\2>)\s*$/.exec(html || '')
  if (!match) return escapeHtml(newText)
  return `${match[1]}${escapeHtml(newText)}${match[4]}`
}

// Compare what Webflow holds now with what the map expects: write, skip (already new), or drift (someone changed it).
export function decide(liveText, row) {
  const live = collapse(liveText)
  if (live === collapse(row.newText)) return 'already'
  if (row.currentText == null || row.currentText === '') return 'write'
  return live === collapse(row.currentText) ? 'write' : 'drift'
}

// ---------------------------------------------------------------- API
const TOKEN = process.env.WEBFLOW_API_TOKEN
const SITE = process.env.WEBFLOW_SITE_ID
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
async function api(method, pathname, body) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch('https://api.webflow.com' + pathname, { method, headers: { Authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined })
    if (res.status === 429 && attempt < 1) { const wait = Number(res.headers.get('retry-after') || 60); console.log(`429, waiting ${wait}s`); await sleep(wait * 1000 + 500); continue }
    const text = await res.text()
    if (!res.ok) throw new Error(`${method} ${pathname} ${res.status} ${text.slice(0, 400)}`)
    return text ? JSON.parse(text) : {}
  }
}
async function paged(pathname, key) {
  const out = []
  for (let offset = 0; ; offset += 100) {
    const data = await api('GET', `${pathname}${pathname.includes('?') ? '&' : '?'}limit=100&offset=${offset}`)
    out.push(...(data[key] || []))
    if ((data[key] || []).length < 100) return out
  }
}

// ---------------------------------------------------------------- log
function readLog() { return fs.existsSync(LOG_JSON) ? readJson(LOG_JSON) : [] }
function writeLog(entries) {
  fs.writeFileSync(LOG_JSON, JSON.stringify(entries, null, 1).replace(/—/g, '\\u2014') + '\n')
  const columns = ['time', 'batch', 'row', 'doc', 'docLine', 'page', 'where', 'item', 'field', 'oldText', 'newText', 'result', 'note']
  const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  fs.writeFileSync(LOG_CSV, [columns.join(','), ...entries.map((entry) => columns.map((column) => quote(entry[column])).join(','))].join('\n') + '\n')
}
const logEntry = (batch, row, extra) => ({ time: new Date().toISOString(), batch, row: row?.id ?? null, doc: row?.doc ?? null, docLine: row?.line ?? null, page: row?.cmsItem?.itemPath || row?.page || null, ...extra })

// ---------------------------------------------------------------- page batch
async function pageBatch(batch, rows, apply) {
  const catalogue = readJson(path.join(CONTENT, 'catalogue/catalogue.json'))
  const page = catalogue.pages.find((candidate) => candidate.path === batch)
  if (!page?.pageId) throw new Error(`no page id for ${batch}`)
  const nodes = await paged(`/v2/pages/${page.pageId}/dom`, 'nodes')
  const byId = new Map(nodes.map((node) => [node.id, node]))
  const updates = new Map()
  const entries = []
  for (const row of rows) {
    const target = row.target
    if (row.targetKind === 'page-text') {
      const node = byId.get(target.nodeId)
      if (!node?.text) { entries.push(logEntry(batch, row, { where: `node ${target.nodeId}`, newText: row.newText, result: 'skipped', note: 'node not found on the page' })); continue }
      const liveText = node.text.text ?? stripTags(node.text.html)
      const verdict = decide(liveText, row)
      entries.push(logEntry(batch, row, { where: `page text <${target.tag}> ${target.section || ''}`.trim(), oldText: liveText, newText: row.newText, result: verdict === 'write' ? (apply ? 'written' : 'would write') : verdict === 'already' ? 'already live' : 'skipped', note: verdict === 'drift' ? 'live text differs from the map, left as it is' : undefined }))
      if (verdict === 'write') updates.set(node.id, { nodeId: node.id, text: replaceNodeHtml(node.text.html, row.newText) })
    } else {
      const node = byId.get(target.instance)
      const override = node?.propertyOverrides?.find((candidate) => candidate.propertyId === target.propertyId)
      if (!node) { entries.push(logEntry(batch, row, { where: `${target.component} / ${target.property}`, newText: row.newText, result: 'skipped', note: 'component instance not found' })); continue }
      const liveText = override?.text?.text ?? stripTags(override?.text?.html) ?? ''
      const verdict = override ? decide(liveText, row) : 'write' // no override: the instance shows the component default
      entries.push(logEntry(batch, row, { where: `${target.component} / ${target.property}`, oldText: override ? liveText : row.currentText, newText: row.newText, result: verdict === 'write' ? (apply ? 'written' : 'would write') : verdict === 'already' ? 'already live' : 'skipped', note: verdict === 'drift' ? 'live text differs from the map, left as it is' : undefined }))
      if (verdict === 'write') {
        const update = updates.get(node.id) || { nodeId: node.id, propertyOverrides: [] }
        update.propertyOverrides.push({ propertyId: target.propertyId, text: row.newText })
        updates.set(node.id, update)
      }
    }
  }
  if (apply && updates.size) {
    const site = await api('GET', `/v2/sites/${SITE}`)
    const result = await api('POST', `/v2/pages/${page.pageId}/dom?localeId=${site.locales.primary.id}`, { nodes: [...updates.values()] })
    if (result.errors?.length) throw new Error(`page write errors: ${JSON.stringify(result.errors).slice(0, 600)}`)
  }
  return entries
}

// ---------------------------------------------------------------- CMS batch
async function cmsBatch(batch, rows, apply, fieldPlan) {
  const slug = batch.slice(4)
  const collections = (await api('GET', `/v2/sites/${SITE}/collections`)).collections
  const collection = collections.find((candidate) => candidate.slug === slug)
  if (!collection) throw new Error(`no collection ${slug}`)
  let schema = await api('GET', `/v2/collections/${collection.id}`)
  const entries = []
  // C6: create the per-item fields for template text before filling them
  const planned = (fieldPlan || []).filter((field) => field.collection === slug)
  for (const field of planned) {
    if (schema.fields.some((existing) => existing.displayName === field.displayName)) continue
    entries.push(logEntry(batch, null, { where: 'new CMS field', field: field.displayName, newText: `PlainText field, bind to: ${field.bindTo}`, result: apply ? 'created' : 'would create' }))
    if (apply) await api('POST', `/v2/collections/${collection.id}/fields`, { type: 'PlainText', displayName: field.displayName, isRequired: false, helpText: `Bind to: ${field.bindTo}`.slice(0, 250) })
  }
  if (apply && planned.length) schema = await api('GET', `/v2/collections/${collection.id}`)
  const fieldByName = new Map(schema.fields.map((field) => [field.displayName, field]))
  const fieldBySlug = new Map(schema.fields.map((field) => [field.slug, field]))
  const items = await paged(`/v2/collections/${collection.id}/items`, 'items')
  const key = (text) => collapse(text).replace(/[^a-z0-9]+/g, ' ').trim()
  const itemFor = (cmsItem) => items.find((item) => item.fieldData.slug === cmsItem.slug) || items.find((item) => key(item.fieldData.name) === key(cmsItem.name))
  const patches = new Map()
  const patch = (item) => { if (!patches.has(item.id)) patches.set(item.id, {}); return patches.get(item.id) }
  for (const row of rows) {
    const item = itemFor(row.cmsItem)
    const field = row.target.fieldSlug ? fieldBySlug.get(row.target.fieldSlug) : fieldByName.get(row.target.fieldName)
    const fieldLabel = field?.displayName || row.target.fieldName || row.target.fieldSlug
    if (!item) { entries.push(logEntry(batch, row, { item: row.cmsItem.name, field: fieldLabel, newText: row.newText, result: 'skipped', note: 'CMS item not found' })); continue }
    if (!field) { entries.push(logEntry(batch, row, { item: item.fieldData.name, field: fieldLabel, newText: row.newText, result: apply ? 'skipped' : 'would write', note: apply ? 'field not found' : 'field is created first' })); continue }
    if (!TEXT_FIELD_TYPES.has(field.type)) throw new Error(`refusing to write ${field.type} field ${field.slug} (row ${row.id}): only text fields are written`)
    const value = field.type === 'RichText' ? richTextHtml(row) : row.newText
    const liveValue = item.fieldData[field.slug]
    const liveText = field.type === 'RichText' ? stripTags(liveValue) : liveValue
    const verdict = collapse(liveText) === collapse(field.type === 'RichText' ? stripTags(value) : value) ? 'already' : 'write'
    entries.push(logEntry(batch, row, { item: item.fieldData.name, field: fieldLabel, where: row.target.newField ? `new field, bind to: ${planned.find((plan) => plan.displayName === fieldLabel)?.bindTo}` : undefined, oldText: liveText, newText: row.newText, result: verdict === 'write' ? (apply ? 'written' : 'would write') : 'already live' }))
    if (verdict === 'write') patch(item)[field.slug] = value
  }
  // items with no doc copy for a new field keep today's template text, so binding never blanks a page
  for (const plan of planned) {
    const field = fieldByName.get(plan.displayName)
    for (const item of items) {
      const has = rows.some((row) => row.target.fieldName === plan.displayName && itemFor(row.cmsItem)?.id === item.id)
      if (has || (field && item.fieldData[field.slug])) continue
      entries.push(logEntry(batch, null, { page: null, item: item.fieldData.name, field: plan.displayName, oldText: '', newText: plan.fallback, result: apply ? 'written' : 'would write', note: 'no doc copy: today\'s template text' }))
      if (field) patch(item)[field.slug] = plan.fallback
    }
  }
  if (apply && patches.size) {
    const list = [...patches].map(([id, fieldData]) => ({ id, fieldData }))
    for (let start = 0; start < list.length; start += 100) await api('PATCH', `/v2/collections/${collection.id}/items`, { items: list.slice(start, start + 100) })
  }
  return entries
}

async function publish() {
  const result = await api('POST', `/v2/sites/${SITE}/publish`, { publishToWebflowSubdomain: true })
  console.log('published', JSON.stringify(result).slice(0, 200))
}

export async function main(argv) {
  const args = new Map()
  for (let index = 0; index < argv.length; index++) args.set(argv[index], argv[index + 1]?.startsWith('--') ? true : argv[index + 1] ?? true)
  if (args.has('--publish-only')) return publish()
  const map = readJson(MAP)
  const rows = writableRows(map.rows)
  const batches = new Map()
  for (const row of rows) { const batch = batchOf(row); if (batch) { if (!batches.has(batch)) batches.set(batch, []); batches.get(batch).push(row) } }
  if (args.has('--list')) { for (const [batch, list] of batches) console.log(`${batch}\t${list.length}`); return }
  const batch = args.get('--batch')
  if (!batches.has(batch)) throw new Error(`unknown batch ${batch}; --list shows them`)
  const apply = args.has('--apply')
  const entries = batch.startsWith('cms:') ? await cmsBatch(batch, batches.get(batch), apply, map.fieldPlan) : await pageBatch(batch, batches.get(batch), apply)
  for (const entry of entries) console.log(`${entry.result}\t${entry.row || ''}\t${entry.item || entry.where || ''}\t${entry.field || ''}\t${String(entry.newText).slice(0, 70)}${entry.note ? `\t(${entry.note})` : ''}`)
  if (apply) {
    writeLog([...readLog(), ...entries])
    if (args.has('--publish')) await publish()
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exit(1) })
}
