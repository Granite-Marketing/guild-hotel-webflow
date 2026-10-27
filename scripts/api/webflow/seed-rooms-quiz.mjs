#!/usr/bin/env node
// Seeds the /rooms quiz CMS data (plan docs/plans/2026-10-27-001-feat-rooms-quiz-plan.md, U1):
// the "🧭 Quiz Options" collection, the Rooms "Quiz options" multi-reference field,
// room tags, and placeholder rooms until exact-match coverage reaches the target.
//
// Dry run by default. Pass --apply to write. Pass --retag to overwrite rooms that
// already have quiz options (otherwise tagged rooms are kept as editors left them).

import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)

export const ROOMS_COLLECTION_ID = '6adf8f780ea92c0983eddaac'
export const QUIZ_COLLECTION = {
  displayName: '🧭 Quiz Options',
  singularName: '🧭 Quiz Option',
  slug: 'quiz-options'
}
export const ROOMS_FIELD = { displayName: 'Quiz options', slug: 'quiz-options' }
export const COVERAGE_TARGET = 0.7

// Step 1 photos are the ones already on /rooms (hoverImageSwap media). Steps 2 and 3
// use stand-in photos from the site library until the client supplies real ones.
export const OPTIONS = [
  { step: 1, sort: 1, name: 'Just me', slug: 'just-me', minGuests: 1, assetId: '6ad66feb58367429abb4835f', alt: 'Guest relaxing in bed in a robe with a tan channel headboard and breakfast tray' },
  { step: 1, sort: 2, name: 'Two guests', slug: 'two-guests', minGuests: 2, assetId: '6ad67004134731ad1b927d6c', alt: 'Guest room with a tan upholstered headboard, white bedding and an arched window' },
  { step: 1, sort: 3, name: '3-4 guests', slug: '3-4-guests', minGuests: 3, assetId: '6ad66ff0f8bf4846e809ead6', alt: 'Light guest room with two beds, a tan lounge chair and tall factory windows' },
  { step: 1, sort: 4, name: '5+ guests', slug: '5-plus-guests', minGuests: 5, assetId: '6ad67001f08ff78c37d85427', alt: 'Loft suite living area with a wooden dining table, green sofa and tall windows' },
  { step: 2, sort: 1, name: 'Couples getaway', slug: 'couples-getaway', assetId: '6ad6701a28c5dc695c82c539', alt: 'Newlywed couple laughing on a hotel bed beside a small white cake' },
  { step: 2, sort: 2, name: 'Business trip', slug: 'business-trip', assetId: '6ad67004134731ad1b927d6c', alt: 'Guest room with a tan upholstered headboard, white bedding and an arched window' },
  { step: 2, sort: 3, name: 'Family & friends', slug: 'family-and-friends', assetId: '6ad67001f08ff78c37d85427', alt: 'Loft suite living area with a wooden dining table, green sofa and tall windows' },
  { step: 2, sort: 4, name: 'Celebration', slug: 'celebration', assetId: '6ad6701a28c5dc695c82c539', alt: 'Newlywed couple laughing on a hotel bed beside a small white cake' },
  { step: 2, sort: 5, name: 'Extended stay', slug: 'extended-stay', assetId: '6ad66ff0f8bf4846e809ead6', alt: 'Light guest room with two beds, a tan lounge chair and tall factory windows' },
  { step: 3, sort: 1, name: 'Spaciousness', slug: 'spaciousness', assetId: '6ad67001f08ff78c37d85427', alt: 'Loft suite living area with a wooden dining table, green sofa and tall windows' },
  { step: 3, sort: 2, name: 'Elevator proximity', slug: 'elevator-proximity', assetId: '6ad66fed15beaf9a7285e5c8', alt: "The Guild Hotel entrance, a carved stone arch under the Young Men's Christian Association frieze" },
  { step: 3, sort: 3, name: 'Courtyard view', slug: 'courtyard-view', assetId: '6ad67004134731ad1b927d6c', alt: 'Guest room with a tan upholstered headboard, white bedding and an arched window' },
  { step: 3, sort: 4, name: 'Street view', slug: 'street-view', assetId: '6ad66ff0f8bf4846e809ead6', alt: 'Light guest room with two beds, a tan lounge chair and tall factory windows' },
  { step: 3, sort: 5, name: 'Quiet', slug: 'quiet', assetId: '6ad66feb58367429abb4835f', alt: 'Guest in a robe reading a magazine in bed with a breakfast tray' }
]

const GUESTS = OPTIONS.filter(option => option.step === 1)
const STAYS = OPTIONS.filter(option => option.step === 2).map(option => option.slug)
const FEATURES = OPTIONS.filter(option => option.step === 3).map(option => option.slug)

// Largest guest option the room can host: one guest range per room.
export const guestOptionFor = (maxGuests) =>
  [...GUESTS].reverse().find(option => (maxGuests || 1) >= option.minGuests).slug

const combos = (list, size) => {
  if (size === 0) return [[]]
  if (list.length < size) return []
  const [first, ...rest] = list
  return [...combos(rest, size - 1).map(tail => [first, ...tail]), ...combos(rest, size)]
}
const SUBSETS = (list) => [...combos(list, 3), ...combos(list, 2)]

// Picks the stay and feature sets (2 or 3 of each) that cover the most uncovered
// combinations for this guest option. Deterministic: ties keep the first candidate.
export const pickTags = (guestSlug, covered) => {
  let best = { stays: STAYS.slice(0, 3), features: FEATURES.slice(0, 3), gain: -1 }
  for (const stays of SUBSETS(STAYS)) {
    for (const features of SUBSETS(FEATURES)) {
      let gain = 0
      for (const stay of stays) for (const feature of features) if (!covered.has(`${guestSlug}|${stay}|${feature}`)) gain++
      if (gain > best.gain) best = { stays, features, gain }
    }
  }
  return { tags: [guestSlug, ...best.stays, ...best.features], gain: best.gain }
}

export const coverage = (rooms) => {
  const covered = new Set()
  for (const room of rooms) {
    const guests = room.tags.filter(tag => GUESTS.some(option => option.slug === tag))
    const stays = room.tags.filter(tag => STAYS.includes(tag))
    const features = room.tags.filter(tag => FEATURES.includes(tag))
    for (const guest of guests) for (const stay of stays) for (const feature of features) covered.add(`${guest}|${stay}|${feature}`)
  }
  const all = []
  for (const guest of GUESTS) for (const stay of STAYS) for (const feature of FEATURES) all.push(`${guest.slug}|${stay}|${feature}`)
  return { covered, ratio: covered.size / all.length, missing: all.filter(key => !covered.has(key)) }
}

const PLACEHOLDER_PROFILES = {
  'just-me': { maxGuests: 1, label: 'Single', size: '18 m² size' },
  'two-guests': { maxGuests: 2, label: 'Double', size: '24 m² size' },
  '3-4-guests': { maxGuests: 4, label: 'Family', size: '40 m² size' },
  '5-plus-guests': { maxGuests: 6, label: 'Group Suite', size: '85 m² size' }
}

// rooms: [{ id, slug, name, maxGuests, sortOrder, tags }] for published rooms.
// Keeps existing tags unless retag; tags the rest greedily; then adds placeholder
// rooms in whichever guest range gains the most until coverage reaches the target.
export const planTags = (rooms, { retag = false, target = COVERAGE_TARGET } = {}) => {
  const planned = []
  const ordered = [...rooms].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  for (const room of ordered) {
    if (room.tags.length && !retag) planned.push({ ...room, action: 'keep' })
  }
  let covered = coverage(planned).covered
  for (const room of ordered) {
    if (room.tags.length && !retag) continue
    const { tags } = pickTags(guestOptionFor(room.maxGuests), covered)
    planned.push({ ...room, tags, action: 'tag' })
    covered = coverage(planned).covered
  }

  const counts = {}
  let sortOrder = Math.max(0, ...rooms.map(room => room.sortOrder ?? 0))
  while (coverage(planned).ratio < target) {
    let best = null
    for (const guest of GUESTS) {
      const pick = pickTags(guest.slug, covered)
      if (!best || pick.gain > best.gain) best = { ...pick, guest: guest.slug }
    }
    if (!best || best.gain <= 0) break
    const profile = PLACEHOLDER_PROFILES[best.guest]
    counts[best.guest] = (counts[best.guest] || 0) + 1
    sortOrder++
    const name = `Placeholder ${profile.label} ${counts[best.guest]}`
    planned.push({
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      maxGuests: profile.maxGuests,
      sizeLabel: profile.size,
      sortOrder,
      tags: best.tags,
      action: 'create'
    })
    covered = coverage(planned).covered
  }
  return { rooms: planned, ...coverage(planned) }
}

// ---------- Webflow I/O ----------

const listAll = async (client, collectionId) => {
  const items = []
  for (let offset = 0; ; offset += 100) {
    const page = await client._request(`/collections/${collectionId}/items?limit=100&offset=${offset}`)
    items.push(...page.items)
    if (page.items.length < 100) break
  }
  return items
}

const main = async () => {
  const apply = process.argv.includes('--apply')
  const retag = process.argv.includes('--retag')
  const { WebflowClient } = require('../lib/webflow-client.cjs')
  const client = new WebflowClient()
  const log = (...args) => console.log(apply ? '[apply]' : '[dry-run]', ...args)

  const { collections } = await client._request(`/sites/${client.siteId}/collections`)
  let quizCollection = collections.find(collection => collection.slug === QUIZ_COLLECTION.slug)
  const roomsSchema = await client._request(`/collections/${ROOMS_COLLECTION_ID}`)
  let roomsField = roomsSchema.fields.find(field => field.slug === ROOMS_FIELD.slug)

  // 1. Collection and fields
  if (quizCollection) {
    log(`collection ${QUIZ_COLLECTION.displayName} exists ${quizCollection.id}`)
  } else {
    log(`create collection ${QUIZ_COLLECTION.displayName} (slug ${QUIZ_COLLECTION.slug}) with fields step (Option 1/2/3), sort-order (Number), image (Image), image-alt (PlainText)`)
    if (apply) {
      quizCollection = await client._request(`/sites/${client.siteId}/collections`, { method: 'POST', json: QUIZ_COLLECTION })
      const fields = [
        { type: 'Option', displayName: 'Step', helpText: 'Quiz step this option belongs to', metadata: { options: [{ name: '1' }, { name: '2' }, { name: '3' }] } },
        { type: 'Number', displayName: 'Sort order', helpText: 'Order within the step, lowest first' },
        { type: 'Image', displayName: 'Image', helpText: 'Photo shown when the option is hovered or focused' },
        { type: 'PlainText', displayName: 'Image alt', helpText: 'Alt text for the photo' }
      ]
      for (const field of fields) await client._request(`/collections/${quizCollection.id}/fields`, { method: 'POST', json: { isRequired: false, ...field } })
      log(`created collection ${quizCollection.id}`)
    }
  }

  // 2. Options (matched by slug, so re-runs never duplicate)
  const quizSchema = quizCollection?.id ? await client._request(`/collections/${quizCollection.id}`) : null
  const stepField = quizSchema?.fields.find(field => field.slug === 'step')
  const existingOptions = quizCollection?.id ? await listAll(client, quizCollection.id) : []
  const optionIds = Object.fromEntries(existingOptions.map(item => [item.fieldData.slug, item.id]))
  for (const option of OPTIONS) {
    if (optionIds[option.slug]) { log(`option ${option.slug} exists ${optionIds[option.slug]}`); continue }
    log(`create option step ${option.step} #${option.sort} "${option.name}" (${option.slug}) image ${option.assetId}`)
    if (!apply) continue
    const asset = await client._request(`/assets/${option.assetId}`)
    const stepId = stepField.validations.options.find(choice => choice.name === String(option.step)).id
    const item = await client._request(`/collections/${quizCollection.id}/items`, {
      method: 'POST',
      json: {
        isDraft: false,
        fieldData: {
          name: option.name,
          slug: option.slug,
          step: stepId,
          'sort-order': option.sort,
          image: { url: asset.hostedUrl, alt: option.alt },
          'image-alt': option.alt
        }
      }
    })
    optionIds[option.slug] = item.id
  }

  // 3. Rooms multi-reference field
  if (roomsField) {
    log(`Rooms field "${ROOMS_FIELD.displayName}" exists ${roomsField.id}`)
  } else {
    log(`add MultiReference field "${ROOMS_FIELD.displayName}" to Rooms -> ${QUIZ_COLLECTION.displayName}`)
    if (apply) {
      roomsField = await client._request(`/collections/${ROOMS_COLLECTION_ID}/fields`, {
        method: 'POST',
        json: { type: 'MultiReference', displayName: ROOMS_FIELD.displayName, isRequired: false, helpText: 'Quiz answers this room suits', metadata: { collectionId: quizCollection.id } }
      })
    }
  }

  // 4. Tags and placeholder rooms (published rooms only)
  const slugById = Object.fromEntries(Object.entries(optionIds).map(([slug, id]) => [id, slug]))
  const roomItems = (await listAll(client, ROOMS_COLLECTION_ID)).filter(item => !item.isDraft && !item.isArchived)
  const rooms = roomItems.map(item => ({
    id: item.id,
    slug: item.fieldData.slug,
    name: item.fieldData.name,
    maxGuests: item.fieldData['max-guests'],
    sortOrder: item.fieldData['sort-order'],
    image: item.fieldData['card-and-hero-image'],
    roomType: item.fieldData['room-type'],
    tags: (item.fieldData[ROOMS_FIELD.slug] || []).map(id => slugById[id]).filter(Boolean)
  }))
  const plan = planTags(rooms, { retag })
  const template = rooms.find(room => room.slug === 'cozy-queen') || rooms[0]
  for (const room of plan.rooms) {
    log(`${room.action.padEnd(6)} ${room.slug.padEnd(28)} max ${String(room.maxGuests).padEnd(2)} ${room.tags.join(', ')}`)
    if (!apply || room.action === 'keep') continue
    const tagIds = room.tags.map(slug => optionIds[slug])
    if (room.action === 'tag') {
      await client._request(`/collections/${ROOMS_COLLECTION_ID}/items/${room.id}`, { method: 'PATCH', json: { fieldData: { [ROOMS_FIELD.slug]: tagIds } } })
    } else {
      const created = await client._request(`/collections/${ROOMS_COLLECTION_ID}/items`, {
        method: 'POST',
        json: {
          isDraft: false,
          fieldData: {
            name: room.name,
            slug: room.slug,
            'room-type': template.roomType,
            'guests-label': `${room.maxGuests} ${room.maxGuests === 1 ? 'guest' : 'guests'}`,
            'size-label': room.sizeLabel,
            'max-guests': room.maxGuests,
            'card-and-hero-image': { url: template.image.url, alt: template.image.alt },
            'hero-intro': 'Placeholder room for the rooms quiz. Remove before launch.',
            'show-in-recommendations-grid': false,
            'sort-order': room.sortOrder,
            [ROOMS_FIELD.slug]: tagIds
          }
        }
      })
      room.id = created.id
      log(`created ${room.slug} ${created.id}`)
    }
  }

  // 5. Coverage report
  console.log(`\nExact-match coverage: ${plan.covered.size}/100 (${Math.round(plan.ratio * 100)}%), target ${COVERAGE_TARGET * 100}%`)
  console.log(`Rooms: ${plan.rooms.length} (${plan.rooms.filter(room => room.action === 'create').length} placeholders)`)
  console.log(`Combinations with no exact match (${plan.missing.length}):`)
  for (const key of plan.missing) console.log(`  ${key.replaceAll('|', ' + ')}`)
  if (!apply) console.log('\nNothing written. Re-run with --apply to write.')
  else console.log('\nItems are staged (not drafts); they go live with the next site publish.')
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(error.message); process.exit(1) })
}
