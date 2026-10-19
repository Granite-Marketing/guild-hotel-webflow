#!/usr/bin/env node
/**
 * Generate context-aware alt text for the images in assets/alt-text/inventory.json.
 *
 *   pnpm alt:generate --tier people
 *       Default: estimate only. Prints image count, model and the Batch API
 *       dollar estimate. No network calls, nothing is spent.
 *
 *   pnpm alt:generate --tier people --sample 10 --direct
 *       Synchronous calls for a small calibration sample (up to 25 images
 *       without --yes). Show the output to the user before any batch.
 *
 *   pnpm alt:generate --tier projects --submit --yes
 *       Prepares images, submits a Message Batch, records the batch ids in
 *       assets/alt-text/batches/<tier>.json. Refuses without --yes.
 *
 *   pnpm alt:generate --tier projects --poll
 *       Checks the batch; when it has ended, writes
 *       assets/alt-text/output/<tier>.json  (one record per image, the apply input; edit `alt` here)
 *       assets/alt-text/review/<tier>.md    (human review table)
 *
 * Images are downloaded to assets/alt-text/cache/ and converted with sharp to
 * a JPEG at 1200px on the long edge (handles AVIF, WebP, GIF first frame and
 * SVG). Anything sharp cannot decode is written to the output with
 * `needsManual: true` and a filename-based suggestion.
 */

import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { DIR, loadConfig, loadEnv, parseArgs, readJson, relative } from './lib/alt-text-config.mjs'

const HELP = `Usage: pnpm alt:generate --tier <tier> [mode] [options]

Modes (default is estimate only, no network):
  --direct          Synchronous calls; needs --sample N (N up to 25 without --yes)
  --submit          Submit a Message Batch (paid); needs --yes
  --poll            Fetch batch results and write output/<tier>.json + review/<tier>.md

Options:
  --sample N        Limit to a calibration sample (heroes first, spread across items)
  --yes             Confirm a paid run after reading the estimate
  --config <path>   Config file (default assets/alt-text/config.json, else the example)
`

// USD per million tokens, standard rates. Batch API is 50% of these.
const PRICING = {
  'claude-sonnet-5-5': { input: 2, output: 10 },
  'claude-sonnet-5': { input: 2, output: 10 },
  'claude-opus-5-5': { input: 4, output: 20 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5 }
}
const BATCH_DISCOUNT = 0.5
const DIRECT_SAMPLE_LIMIT = 25
const MAX_EDGE = 1200
// Image tokens are roughly width x height / 750; a 1200px long-edge JPEG is about 1,000 to 1,900.
const EST_IMAGE_TOKENS = 1600
const EST_OUTPUT_TOKENS = 80

const args = parseArgs()
if (args.has('help')) { console.log(HELP); process.exit(0) }
loadEnv()
const { config, isExample } = loadConfig(args)
const MODEL = config.model
const MAX_CHARS = config.maxChars
const BRAND = config.brand?.name || 'the site owner'

const tier = args.get('tier')
const sample = args.get('sample') ? Number(args.get('sample')) : null
if (!tier) { console.error(HELP); process.exit(1) }
if (sample !== null && (!Number.isInteger(sample) || sample < 1)) { console.error('[generate] --sample must be a positive integer'); process.exit(1) }

const CACHE = path.join(DIR, 'cache')
const inventory = readJson(path.join(DIR, 'inventory.json'), 'Inventory (run pnpm alt:inventory first)')
let entries = inventory.filter(entry => entry.tier === tier)
if (!entries.length) {
  const tiers = [...new Set(inventory.map(entry => entry.tier))].join(', ')
  console.error(`[generate] no entries in tier "${tier}". Tiers in the inventory: ${tiers}`)
  process.exit(1)
}
if (sample) entries = pickSample(entries, sample)

/** For calibration prefer heroes and a spread of items rather than the first N of one item. */
function pickSample (list, size) {
  const heroes = list.filter(entry => entry.isHero)
  const rest = list.filter(entry => !entry.isHero)
  const picked = []
  const seenItems = new Set()
  for (const entry of [...heroes, ...rest]) {
    if (picked.length >= size) break
    if (entry.itemId && seenItems.has(entry.itemId) && picked.length < size * 0.7) continue
    picked.push(entry)
    if (entry.itemId) seenItems.add(entry.itemId)
  }
  return picked
}

const namingRules = Object.values(config.collections)
  .filter(collection => !collection.lookupOnly && collection.entity && collection.namingRule)
  .map(collection => `  - ${collection.entity}: ${collection.namingRule}`)
const brandOnHeroEntities = Object.values(config.collections).filter(c => c.brandOnHero && c.entity).map(c => c.entity)

const SYSTEM = `You write alt text for images on the website of ${BRAND}${config.brand?.description ? `, ${config.brand.description}` : ''}.

Imagine you're describing this image to someone over the phone who can't see it. Provide a concise, descriptive alt text that conveys the key information and context of the image to someone who is visually impaired.

Rules:
- Be specific and succinct. Don't be overly descriptive. Describe information, not aesthetics. Think about the function of the image.
- Use normal punctuation. Don't include copyright information or photo credits.
- Never start with "Image of", "Photo of", "Picture of", "A photo showing".
- Under ${MAX_CHARS} characters. You must NOT write more than ${MAX_CHARS} characters.
- Context rule: when the image belongs to an entity, the line MUST name it. Work the name in naturally, not as a label.${namingRules.length ? `\n${namingRules.join('\n')}` : ''}
${brandOnHeroEntities.length ? `- Hero images of a ${brandOnHeroEntities.join(' or ')} may add "by ${BRAND}"; other images do not repeat the brand name.\n` : ''}- When no entity context is given, describe the image on its own and invent nothing: no project names, no people's names.
- Logos name the brand. Black and white photographs are described as such.
- Output the alt text line only. No quotes, no preamble, no trailing full stop.${config.promptExamples.length ? `\n\nExamples of the expected shape:\n${config.promptExamples.map(example => `- ${example}`).join('\n')}` : ''}`

const contextText = (entry) => {
  const context = { ...entry.context }
  const lines = []
  if (entry.entity) lines.push(`This image belongs to a ${entry.entity}.`)
  else lines.push('This image has no entity attached. Describe it on its own.')
  if (context.renderedOn) { lines.push(`It appears on: ${context.renderedOn.join('; ')}.`); delete context.renderedOn }
  if (context.fileName) { lines.push(`File name: ${context.fileName}`); delete context.fileName }
  for (const [key, value] of Object.entries(context)) if (value !== null && value !== undefined && value !== '') lines.push(`${key}: ${value}`)
  return lines.join('\n')
}

function estimate (list, { batch }) {
  const price = PRICING[MODEL]
  const systemTokens = Math.ceil(SYSTEM.length / 4)
  const contextTokens = list.reduce((sum, entry) => sum + Math.ceil(contextText(entry).length / 4), 0)
  const inputTokens = list.length * (EST_IMAGE_TOKENS + systemTokens + 20) + contextTokens
  const outputTokens = list.length * EST_OUTPUT_TOKENS
  if (!price) return { inputTokens, outputTokens, dollars: null }
  const factor = batch ? BATCH_DISCOUNT : 1
  const dollars = (inputTokens * price.input + outputTokens * price.output) / 1e6 * factor
  return { inputTokens, outputTokens, dollars }
}

function printEstimate (list, { batch }) {
  const { inputTokens, outputTokens, dollars } = estimate(list, { batch })
  const price = PRICING[MODEL]
  console.log(`[generate] tier "${tier}": ${list.length} image(s), model ${MODEL}, ${batch ? 'Batch API (50% of standard rates)' : 'direct calls (standard rates)'}`)
  console.log(`[generate] estimated tokens: about ${inputTokens.toLocaleString()} in, ${outputTokens.toLocaleString()} out`)
  if (dollars === null) console.log(`[generate] no price table for ${MODEL}; check current pricing before running`)
  else console.log(`[generate] estimated cost: about $${dollars.toFixed(2)} (rates $${price.input}/$${price.output} per million in/out${batch ? ', halved for batch' : ''}; estimate assumes ~${EST_IMAGE_TOKENS} tokens per image)`)
}

const directMode = args.has('direct')
const submitMode = args.has('submit')
const pollMode = args.has('poll')

if (!directMode && !submitMode && !pollMode) {
  printEstimate(entries, { batch: true })
  console.log(`[generate] estimate only, nothing sent. Calibrate with --sample 10 --direct, then submit with --submit --yes.`)
  process.exit(0)
}

if (directMode) {
  if (!sample) { console.error('[generate] --direct needs --sample N; use --submit for a whole tier'); process.exit(1) }
  printEstimate(entries, { batch: false })
  if (entries.length > DIRECT_SAMPLE_LIMIT && !args.has('yes')) { console.error(`[generate] sample over ${DIRECT_SAMPLE_LIMIT}: re-run with --yes to confirm the spend`); process.exit(1) }
}
if (submitMode) {
  printEstimate(entries, { batch: true })
  if (!args.has('yes')) { console.error('[generate] paid batch not submitted. Read the estimate, get approval, then re-run with --yes'); process.exit(1) }
}
if ((directMode || submitMode) && isExample) { console.error('[generate] refusing a paid run on the example config; create assets/alt-text/config.json first'); process.exit(1) }

for (const sub of ['cache', 'batches', 'output', 'review']) fs.mkdirSync(path.join(DIR, sub), { recursive: true })

const { default: Anthropic } = await import('@anthropic-ai/sdk')
const client = new Anthropic()

/** Thinking off for a short description task; the accepted shape differs by model. */
function thinkingFor (model) {
  if (config.thinking) return config.thinking
  if (model === 'claude-sonnet-5-5') return { type: 'between_tools' }
  if (model === 'claude-opus-5-5') return undefined // cannot be disabled; low effort keeps it short
  return { type: 'disabled' }
}
const baseParams = () => {
  const params = { model: MODEL, max_tokens: 400, output_config: { effort: 'low' } }
  const thinking = thinkingFor(MODEL)
  if (thinking) params.thinking = thinking
  return params
}

const cachePath = (entry) => path.join(CACHE, createHash('md5').update(entry.url).digest('hex'))

/** Download and convert to a 1200px JPEG with sharp. Returns the jpeg path. */
async function prepareImage (entry) {
  const base = cachePath(entry)
  const original = `${base}.${entry.extension || 'bin'}`
  const jpeg = `${base}.jpg`
  if (fs.existsSync(jpeg)) return jpeg
  if (!fs.existsSync(original)) {
    const response = await fetch(entry.url)
    if (!response.ok) throw new Error(`download ${response.status} for ${entry.url}`)
    fs.writeFileSync(original, Buffer.from(await response.arrayBuffer()))
  }
  const { default: sharp } = await import('sharp')
  await sharp(original, { animated: false, density: entry.extension === 'svg' ? 300 : undefined })
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: entry.extension !== 'svg' })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 85 })
    .toFile(jpeg)
  return jpeg
}

const requestParams = (entry, jpegPath) => ({
  ...baseParams(),
  system: SYSTEM,
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: fs.readFileSync(jpegPath).toString('base64') } },
      { type: 'text', text: `${contextText(entry)}\n\nWrite the alt text.` }
    ]
  }]
})

const textOf = (message) => message.content.find(block => block.type === 'text')?.text || ''

// Strip quotes and a trailing full stop unless it closes an abbreviation like "D.C."
const cleanLine = (text) => text.trim().replace(/^["'“”]+|["'“”]+$/g, '').replace(/\s+/g, ' ').replace(/(?<![A-Z])\.$/, '').trim()

const manualSuggestion = (entry) => {
  const name = (entry.displayName || entry.itemName || '').replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim()
  return /logo/i.test(name) ? `${name.replace(/logo/i, '').trim() || BRAND} logo` : name
}

/** Text-only pass that rewrites any line over MAX_CHARS, keeping names and places. */
async function shortenLong (records) {
  const long = records.filter(record => record.alt && record.alt.length > MAX_CHARS && !record.needsManual)
  for (const record of long) {
    const response = await client.messages.create({
      ...baseParams(),
      system: `You shorten alt text. Keep every proper name and place name, drop adjectives first. Output the line only, no quotes, no trailing full stop, under ${MAX_CHARS - 20} characters.`,
      messages: [{ role: 'user', content: record.alt }]
    })
    const text = cleanLine(textOf(response))
    if (text && text.length <= MAX_CHARS) { record.longVersion = record.alt; record.alt = text }
  }
  if (long.length) console.log(`[generate] shortened ${long.length} over-length line(s)`)
}

function writeOutputs (records) {
  const outPath = path.join(DIR, 'output', `${tier}.json`)
  fs.writeFileSync(outPath, JSON.stringify(records, null, 2))
  const rows = records.map(record => {
    const where = record.kind === 'cms'
      ? `${record.collection} / ${record.itemName} / ${record.field}${record.multiIndex !== null && record.multiIndex !== undefined ? `[${record.multiIndex}]` : ''}`
      : `library / ${record.displayName}`
    const flags = [record.needsManual ? 'MANUAL' : null, record.alt && record.alt.length > MAX_CHARS ? 'TOO LONG' : null, record.error ? `ERROR ${record.error}` : null].filter(Boolean).join(', ')
    return `| [img](${record.url}) | ${where.replace(/\|/g, '/')} | ${(record.alt || '').replace(/\|/g, '/')} | ${record.alt ? record.alt.length : ''} | ${flags} |`
  })
  const markdown = `# Alt text review: ${tier}\n\n${records.length} images. Edit the \`alt\` field in \`assets/alt-text/output/${tier}.json\` before building the payload; this table is read-only.\n\n| Image | Where | Alt | Chars | Flags |\n|---|---|---|---|---|\n${rows.join('\n')}\n`
  fs.writeFileSync(path.join(DIR, 'review', `${tier}.md`), markdown)
  const flagged = records.filter(record => record.needsManual || record.error || (record.alt && record.alt.length > MAX_CHARS)).length
  console.log(`[generate] wrote ${relative(outPath)} and assets/alt-text/review/${tier}.md (${records.length} records, ${flagged} flagged)`)
}

const baseRecord = (entry) => ({
  key: entry.key,
  kind: entry.kind,
  tier: entry.tier,
  collection: entry.collection,
  itemId: entry.itemId,
  itemName: entry.itemName,
  field: entry.field,
  multiIndex: entry.multiIndex,
  fileId: entry.fileId,
  assetId: entry.assetId,
  displayName: entry.displayName,
  url: entry.url,
  previousAlt: entry.currentAlt,
  alt: null
})

async function prepareAll () {
  const prepared = []
  let done = 0
  for (const entry of entries) {
    try {
      prepared.push({ entry, jpeg: await prepareImage(entry) })
    } catch (error) {
      console.error(`[generate] could not prepare ${entry.key}: ${error.message}`)
      prepared.push({ entry, jpeg: null, error: error.message })
    }
    if (++done % 50 === 0) console.log(`[generate] prepared ${done}/${entries.length}`)
  }
  return prepared
}

const actualCost = (inputTokens, outputTokens, { batch }) => {
  const price = PRICING[MODEL]
  if (!price) return 'unknown'
  return `$${((inputTokens * price.input + outputTokens * price.output) / 1e6 * (batch ? BATCH_DISCOUNT : 1)).toFixed(3)}`
}

if (directMode) {
  const prepared = await prepareAll()
  const records = []
  let inputTokens = 0
  let outputTokens = 0
  for (const { entry, jpeg, error } of prepared) {
    const record = baseRecord(entry)
    if (!jpeg) { record.needsManual = true; record.alt = manualSuggestion(entry); if (error) record.error = error; records.push(record); continue }
    const response = await client.messages.create(requestParams(entry, jpeg))
    if (response.stop_reason === 'refusal') record.error = 'refusal'
    else record.alt = cleanLine(textOf(response))
    inputTokens += response.usage.input_tokens
    outputTokens += response.usage.output_tokens
    console.log(`  ${String(entry.itemName || entry.displayName || '').slice(0, 40).padEnd(40)} ${record.alt || record.error}`)
    records.push(record)
  }
  await shortenLong(records)
  writeOutputs(records)
  console.log(`[generate] tokens in ${inputTokens} / out ${outputTokens}; direct cost about ${actualCost(inputTokens, outputTokens, { batch: false })}`)
} else if (submitMode) {
  const prepared = await prepareAll()
  const manual = []
  const keyById = {}
  const parts = [[]]
  let partBytes = 0
  const MAX_PART_BYTES = 150 * 1024 * 1024 // base64 inflates about 1.37x; stay well under the 256MB batch cap
  for (const { entry, jpeg, error } of prepared) {
    if (!jpeg) { manual.push({ ...baseRecord(entry), needsManual: true, alt: manualSuggestion(entry), ...(error ? { error } : {}) }); continue }
    const bytes = Math.ceil(fs.statSync(jpeg).size * 1.37) + SYSTEM.length + 1000
    if (partBytes + bytes > MAX_PART_BYTES && parts.at(-1).length) { parts.push([]); partBytes = 0 }
    const customId = createHash('md5').update(entry.key).digest('hex')
    keyById[customId] = entry.key
    parts.at(-1).push({ custom_id: customId, params: requestParams(entry, jpeg) })
    partBytes += bytes
  }
  const batches = []
  for (const requests of parts.filter(part => part.length)) {
    const batch = await client.messages.batches.create({ requests })
    batches.push({ batchId: batch.id, createdAt: batch.created_at, requestCount: requests.length })
    console.log(`[generate] batch ${batch.id} submitted: ${requests.length} requests. Status: ${batch.processing_status}`)
  }
  fs.writeFileSync(path.join(DIR, 'batches', `${tier}.json`), JSON.stringify({ tier, model: MODEL, sample, batches, keyById, manual }, null, 2))
  console.log(`[generate] ${batches.length} batch(es), ${manual.length} manual or failed. Poll with: pnpm alt:generate --tier ${tier} --poll`)
} else if (pollMode) {
  const meta = readJson(path.join(DIR, 'batches', `${tier}.json`), 'Batch record')
  const batchIds = meta.batches.map(batch => batch.batchId)
  let allEnded = true
  for (const id of batchIds) {
    const batch = await client.messages.batches.retrieve(id)
    console.log(`[generate] ${id}: ${batch.processing_status} (processing ${batch.request_counts.processing}, succeeded ${batch.request_counts.succeeded}, errored ${batch.request_counts.errored})`)
    if (batch.processing_status !== 'ended') allEnded = false
  }
  if (!allEnded) process.exit(0)
  const byKey = new Map(inventory.filter(entry => entry.tier === tier).map(entry => [entry.key, entry]))
  const records = []
  let inputTokens = 0
  let outputTokens = 0
  for (const id of batchIds) {
    for await (const result of await client.messages.batches.results(id)) {
      const entry = byKey.get(meta.keyById[result.custom_id])
      if (!entry) { console.error(`[generate] unknown custom_id ${result.custom_id}`); continue }
      const record = baseRecord(entry)
      if (result.result.type === 'succeeded') {
        const message = result.result.message
        if (message.stop_reason === 'refusal') record.error = 'refusal'
        else record.alt = cleanLine(textOf(message))
        inputTokens += message.usage.input_tokens
        outputTokens += message.usage.output_tokens
      } else {
        record.error = result.result.type === 'errored' ? result.result.error?.type || 'errored' : result.result.type
      }
      records.push(record)
    }
  }
  records.push(...meta.manual)
  const order = new Map([...byKey.keys()].map((key, index) => [key, index]))
  records.sort((a, b) => (order.get(a.key) ?? 0) - (order.get(b.key) ?? 0))
  await shortenLong(records)
  writeOutputs(records)
  console.log(`[generate] tokens in ${inputTokens} / out ${outputTokens}; batch cost about ${actualCost(inputTokens, outputTokens, { batch: true })}`)
}
