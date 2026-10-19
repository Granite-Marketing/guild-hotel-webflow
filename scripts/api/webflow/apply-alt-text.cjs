#!/usr/bin/env node
/**
 * Write reviewed alt text to Webflow from the payload chunks produced by
 * scripts/api/anthropic/build-apply-payload.mjs.
 *
 * Default is a dry run. Default scope is the asset library only.
 *
 *   pnpm alt:apply --tier static                       dry run, library chunks only
 *   pnpm alt:apply --tier static --write               PATCH /assets/{id} { altText }  (safe, keeps file and srcset)
 *
 * CMS image fields (destructive to responsive variants, opt in twice):
 *   pnpm alt:apply --tier projects --include-cms --probe <itemId> --write --publish
 *       writes ONE item, re-fetches it, publishes it, records assets/alt-text/apply/<tier>.probe.json
 *       then: check the live page (pnpm alt:verify /path/of/item) for srcset and image weight
 *   pnpm alt:apply --tier projects --include-cms --confirm-probed --write [--publish]
 *       bulk CMS write, refused unless the probe record exists and --confirm-probed is given
 *
 * Library alt reaches the live site only on a site publish, which this script
 * never performs. All write requests are spaced 1.5s apart and 429s are retried
 * with backoff on top of the client's own retry.
 */

const fs = require('node:fs')
const path = require('node:path')
const { setTimeout: sleep } = require('node:timers/promises')

const ROOT = path.resolve(__dirname, '../../..')
const DIR = path.join(ROOT, 'assets/alt-text')
const WRITE_SPACING_MS = 1500
const RATE_LIMIT_RETRIES = 3

const HELP = `Usage: pnpm alt:apply --tier <tier> [options]

Default: dry run, asset library chunks only.

  --write             Perform the writes (without it nothing is sent)
  --include-cms       Also process CMS image-field chunks (re-imports every image written)
  --probe <itemId>    With --include-cms: write only this one item, then verify it live
  --confirm-probed    With --include-cms: allow the bulk CMS write after a recorded probe
  --publish           Publish the written non-draft CMS items (never publishes the site)
  --config <path>     Config file (default assets/alt-text/config.json, else the example)
`

const CMS_WARNING = `
  WARNING: every CMS image-field write is a RE-IMPORT. Webflow copies the file
  to a new fileId (filename becomes <newId>_<oldId>_name), and the copy never
  gets responsive srcset variants. The variants are lost permanently; pointing
  the field back at the old URL is another import. Library alt (PATCH /assets)
  does not have this problem. See docs/reference/alt-text-pipeline.md.
`

const argv = process.argv.slice(2)
const has = (name) => argv.includes(`--${name}`)
const get = (name) => { const index = argv.indexOf(`--${name}`); return index === -1 ? null : (argv[index + 1] ?? null) }

if (has('help')) { console.log(HELP); process.exit(0) }

const tier = get('tier')
const write = has('write')
const includeCms = has('include-cms')
const probeItemId = get('probe')
const confirmProbed = has('confirm-probed')
const publish = has('publish')
if (!tier) { console.error(HELP); process.exit(1) }
if ((probeItemId || confirmProbed) && !includeCms) { console.error('[apply] --probe and --confirm-probed only apply with --include-cms'); process.exit(1) }
if (probeItemId && confirmProbed) { console.error('[apply] use --probe first, then --confirm-probed in a separate run'); process.exit(1) }

function loadEnv () {
  const envPath = path.join(ROOT, '.env')
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') { try { process.loadEnvFile(envPath) } catch {} }
}

function loadConfig () {
  const candidates = [get('config') && path.resolve(process.cwd(), get('config')), path.join(DIR, 'config.json'), path.join(ROOT, 'scripts/api/anthropic/alt-text.config.example.json')].filter(Boolean)
  const configPath = candidates.find(candidate => fs.existsSync(candidate))
  if (!configPath) return { siteUrl: '' }
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  config.siteUrl = (process.env.ALT_TEXT_SITE_URL || config.siteUrl || '').replace(/\/$/, '')
  return config
}

loadEnv()
const config = loadConfig()
const applyDir = path.join(DIR, 'apply', tier)
if (!fs.existsSync(applyDir)) { console.error(`[apply] no payloads in ${path.relative(ROOT, applyDir)}; run pnpm alt:payload --tier ${tier} first`); process.exit(1) }
const files = fs.readdirSync(applyDir).filter(file => file.endsWith('.json')).sort()
const probePath = path.join(DIR, 'apply', `${tier}.probe.json`)
const log = { tier, write, includeCms, probeItemId, startedAt: new Date().toISOString(), updatedItems: [], publishedItems: [], updatedAssets: [], failures: [] }

let client = null
function webflow () {
  if (!client) {
    const { WebflowClient } = require('../lib/webflow-client.cjs')
    client = new WebflowClient()
  }
  return client
}

let lastWriteAt = 0
/** Space write requests and retry 429s with backoff beyond the client's own retries. */
async function pacedRequest (route, options) {
  for (let attempt = 0; ; attempt++) {
    const wait = lastWriteAt + WRITE_SPACING_MS - Date.now()
    if (wait > 0) await sleep(wait)
    lastWriteAt = Date.now()
    try {
      return await webflow()._request(route, options)
    } catch (error) {
      if (!/\b429\b/.test(error.message) || attempt >= RATE_LIMIT_RETRIES) throw error
      const delay = 5000 * Math.pow(2, attempt)
      console.error(`[apply] still rate limited, backing off ${delay / 1000}s (retry ${attempt + 1}/${RATE_LIMIT_RETRIES})`)
      await sleep(delay)
    }
  }
}

const imageFields = (fieldData) => Object.entries(fieldData).flatMap(([field, value]) =>
  Array.isArray(value) ? value.map((entry, index) => [`${field}[${index}]`, entry && entry.url]) : [[field, value && value.url]])

async function countLiveImages (pageUrl) {
  try {
    const html = await (await fetch(pageUrl)).text()
    const tags = [...html.matchAll(/<img[^>]*>/g)].map(match => match[0])
    return { images: tags.length, withSrcset: tags.filter(tag => /\bsrcset="[^"]+"/.test(tag)).length, withAlt: tags.filter(tag => /\balt="[^"]+"/.test(tag)).length, bytesOfHtml: html.length }
  } catch (error) {
    return { error: error.message }
  }
}

const pageUrlFor = (payload, itemId) => {
  const slug = payload.itemSlugs && payload.itemSlugs[itemId]
  if (!config.siteUrl || !payload.pagePath || !slug) return null
  return config.siteUrl + payload.pagePath.replace('{slug}', slug)
}

async function applyCms (payload, file) {
  const { collection, collectionId } = payload
  let items = payload.items
  const probedId = !probeItemId && fs.existsSync(probePath) ? JSON.parse(fs.readFileSync(probePath, 'utf8')).itemId : null
  if (probeItemId) items = items.filter(item => item.id === probeItemId)
  else if (probedId) items = items.filter(item => item.id !== probedId) // already written by the probe
  if (!items.length) return
  const publishIds = items.map(item => item.id).filter(id => payload.publishItemIds.includes(id))
  const fieldCount = items.reduce((n, item) => n + imageFields(item.fieldData).length, 0)
  console.log(`[apply] ${file}: ${collection}, ${items.length} item(s), ${fieldCount} image value(s) to RE-IMPORT${write ? '' : ' (dry run)'}`)
  if (!write) return

  const probe = probeItemId ? { tier, collection, collectionId, itemId: probeItemId, itemName: payload.itemNames && payload.itemNames[probeItemId], pageUrl: pageUrlFor(payload, probeItemId) } : null
  if (probe && probe.pageUrl) probe.liveBefore = await countLiveImages(probe.pageUrl)

  await pacedRequest(`/collections/${collectionId}/items`, { method: 'PATCH', json: { items } })

  // Verify: alt landed, and every image is either unchanged or the expected re-import of the original file
  for (const item of items) {
    const live = await pacedRequest(`/collections/${collectionId}/items/${item.id}`)
    const sent = new Map(imageFields(item.fieldData))
    const got = new Map(imageFields(Object.fromEntries(Object.entries(live.fieldData || {}).filter(([key]) => key in item.fieldData))))
    const problems = []
    const reimported = []
    for (const [key, url] of sent) {
      const originalFileId = (String(url).match(/\/([0-9a-f]{24})_/) || [])[1]
      const liveUrl = got.get(key) || ''
      if (liveUrl === url) continue
      if (originalFileId && liveUrl.includes(`_${originalFileId}_`)) reimported.push(key)
      else problems.push(`${key}: image changed unexpectedly (${liveUrl || 'missing'})`)
    }
    for (const [field, value] of Object.entries(item.fieldData)) {
      const liveValue = live.fieldData && live.fieldData[field]
      const pairs = Array.isArray(value) ? value.map((entry, index) => [entry.alt, liveValue && liveValue[index] && liveValue[index].alt]) : [[value.alt, liveValue && liveValue.alt]]
      for (const [want, have] of pairs) if (want && have !== want) problems.push(`${field}: alt not applied`)
    }
    if (problems.length) { log.failures.push({ collection, itemId: item.id, problems }); console.error(`  ! ${item.id}: ${problems.join('; ')}`) } else log.updatedItems.push({ collection, itemId: item.id, reimported })
    if (probe) { probe.reimportedFields = reimported; probe.problems = problems; probe.fieldDataAfter = Object.fromEntries(Object.entries(live.fieldData || {}).filter(([key]) => key in item.fieldData)) }
  }

  if (publish && publishIds.length) {
    await pacedRequest(`/collections/${collectionId}/items/publish`, { method: 'POST', json: { itemIds: publishIds } })
    log.publishedItems.push(...publishIds.map(id => ({ collection, itemId: id })))
    const drafts = items.length - publishIds.length
    console.log(`  published ${publishIds.length} item(s)${drafts ? `, left ${drafts} draft(s) unpublished` : ''}`)
  }

  if (probe) {
    probe.published = publish && publishIds.length > 0
    probe.writtenAt = new Date().toISOString()
    fs.writeFileSync(probePath, JSON.stringify(probe, null, 2))
    console.log(`\n[apply] probe recorded in ${path.relative(ROOT, probePath)}`)
    if (probe.liveBefore && !probe.liveBefore.error) console.log(`[apply] live page before the write: ${probe.liveBefore.images} images, ${probe.liveBefore.withSrcset} with srcset`)
    console.log('[apply] Next: wait for the publish to propagate, then compare the live page:')
    console.log(probe.pageUrl ? `    pnpm alt:verify ${probe.pageUrl.slice(config.siteUrl.length)}` : '    open the item page and inspect its <img> tags for srcset and file size')
    console.log('[apply] Only if the result is acceptable, run the bulk write with --confirm-probed.')
  }
}

async function applyAssets (payload, file) {
  console.log(`[apply] ${file}: ${payload.assets.length} library asset(s)${write ? '' : ' (dry run)'}`)
  if (!write) return
  for (const { assetId, displayName, alt } of payload.assets) {
    try {
      const response = await pacedRequest(`/assets/${assetId}`, { method: 'PATCH', json: { altText: alt } })
      if ((response.altText || '') !== alt) throw new Error('altText not applied')
      log.updatedAssets.push({ assetId, displayName })
    } catch (error) {
      log.failures.push({ assetId, displayName, problems: [error.message] })
      console.error(`  ! ${displayName}: ${error.message}`)
    }
  }
}

async function main () {
  const payloads = files.map(file => ({ file, payload: JSON.parse(fs.readFileSync(path.join(applyDir, file), 'utf8')) }))
  const cmsPayloads = payloads.filter(({ payload }) => !payload.assets)
  const assetPayloads = payloads.filter(({ payload }) => payload.assets)

  if (cmsPayloads.length && !includeCms) {
    const count = cmsPayloads.reduce((n, { payload }) => n + payload.items.length, 0)
    console.log(`[apply] skipping ${cmsPayloads.length} CMS chunk(s) (${count} items): library only by default. Add --include-cms after reading the re-import warning.`)
  }

  if (includeCms && cmsPayloads.length) {
    console.warn(CMS_WARNING)
    if (probeItemId) {
      const found = cmsPayloads.some(({ payload }) => payload.items.some(item => item.id === probeItemId))
      if (!found) { console.error(`[apply] probe item ${probeItemId} is not in any CMS chunk for tier "${tier}"`); process.exit(1) }
    } else if (write) {
      if (!fs.existsSync(probePath)) { console.error(`[apply] refusing bulk CMS write: no probe recorded for tier "${tier}". Run --include-cms --probe <itemId> --write --publish first and check the live page.`); process.exit(1) }
      if (!confirmProbed) { console.error(`[apply] refusing bulk CMS write: probe found (${path.relative(ROOT, probePath)}) but --confirm-probed was not given. Check the live page first.`); process.exit(1) }
      const probe = JSON.parse(fs.readFileSync(probePath, 'utf8'))
      if (probe.problems && probe.problems.length) { console.error(`[apply] refusing bulk CMS write: the probe reported problems: ${probe.problems.join('; ')}`); process.exit(1) }
    }
  }

  if (!probeItemId) for (const { file, payload } of assetPayloads) await applyAssets(payload, file)
  if (includeCms) for (const { file, payload } of cmsPayloads) await applyCms(payload, file)

  log.finishedAt = new Date().toISOString()
  if (write) {
    const logPath = path.join(DIR, 'apply', `${tier}${probeItemId ? '.probe' : ''}.log.json`)
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2))
    console.log(`[apply] ${log.updatedItems.length} items updated, ${log.publishedItems.length} published, ${log.updatedAssets.length} assets updated, ${log.failures.length} failures. Log: ${path.relative(ROOT, logPath)}`)
    if (log.updatedAssets.length) console.log('[apply] Library alt goes live only on the next site publish. Confirm the Designer has nothing unfinished before publishing.')
  } else {
    console.log('[apply] dry run complete, nothing sent. Add --write to apply.')
  }
  if (log.failures.length) process.exit(1)
}

main().catch(error => { console.error(`[apply] Error: ${error.message}`); process.exit(1) })
