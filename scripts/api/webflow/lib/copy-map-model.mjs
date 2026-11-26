// Turns the committed catalogue (catalogue.json plus raw/ DOM and component dumps) into the slot model
// the copy map matches against. Pure: callers pass parsed JSON in.
import { normText, tagOf, instancesOf } from './catalogue-helpers.mjs'

const TEXT_PROPERTY_TYPES = new Set(['Plain Text', 'Rich Text'])
const SKIPPED_PROPERTY_LABELS = /\(night\)|\balt\b|link|video|image/i

const roleOfTag = (tag) => ({ h1: 'heading', h2: 'heading', h3: 'heading', h4: 'heading', p: 'body', a: 'button', blockquote: 'body' }[tag] || 'label')
function roleOfProperty(label) {
  const last = label.split('/').pop().toLowerCase()
  if (/button/.test(last)) return 'button'
  if (/heading|title|name/.test(last)) return 'heading'
  if (/eyebrow|label|caption/.test(last)) return 'label'
  return 'body'
}

const slugOfName = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const templateOf = (pagePath) => `/${pagePath.split('/')[1]}`

// live element facts keyed the way slots are keyed
function liveIndexOf(pageRecord) {
  const index = new Map()
  const add = (key, element) => {
    const known = index.get(key)
    if (!known) index.set(key, { element, visible: element.visible })
    else if (element.visible && !known.visible) index.set(key, { element, visible: true })
  }
  for (const element of pageRecord.elements || []) {
    const match = element.match
    if (!match) continue
    if (match.propertyId) add(`prop|${match.instance}|${match.propertyId}`, element)
    else if (match.nodeId) add(`node|${match.nodeId}`, element)
  }
  return index
}

function pageSlots(pageRecord, pageDom, components) {
  if (!pageDom) return []
  const live = liveIndexOf(pageRecord)
  const slots = []
  const withLive = (slot, key) => {
    const found = live.get(key)
    if (!found) return slot
    return { ...slot, visible: found.visible, liveOrder: found.element.order, section: found.element.section || null, tag: slot.tag || found.element.tag }
  }
  for (const node of pageDom.nodes) {
    if (node.text) {
      const tag = tagOf(node.text.html)
      if (!normText(node.text.text)) continue
      slots.push(withLive({ key: `page|${node.id}`, kind: 'page-text', role: roleOfTag(tag), tag, text: node.text.text, nodeId: node.id }, `node|${node.id}`))
      continue
    }
    if (node.type !== 'component-instance') continue
    for (const instance of instancesOf([node], components)) {
      const component = components[instance.componentId]
      if (!component) continue
      const overrides = new Map(instance.overrides.map((override) => [override.propertyId, override]))
      for (const property of component.props) {
        if (!TEXT_PROPERTY_TYPES.has(property.type) || SKIPPED_PROPERTY_LABELS.test(property.label)) continue
        const override = overrides.get(property.propertyId)
        const text = (override ? override.text?.text : property.text?.text) ?? ''
        if (!normText(text) || /__wf_reserved/.test(text)) continue
        slots.push(withLive({
          key: `prop|${instance.nodeId}|${property.propertyId}`, kind: 'component-prop', role: roleOfProperty(property.label), text,
          component: component.name, property: property.label, propertyId: property.propertyId, instance: instance.nodeId, overridden: Boolean(override),
        }, `prop|${instance.nodeId}|${property.propertyId}`))
      }
      for (const fixed of component.textNodes) {
        if (!fixed.norm) continue
        slots.push(withLive({ key: `fixed|${instance.nodeId}|${fixed.nodeId}`, kind: 'component-fixed', role: roleOfTag(fixed.tag), tag: fixed.tag, text: fixed.text, component: component.name, nodeId: fixed.nodeId }, `node|${fixed.nodeId}`))
      }
    }
  }
  return slots.map((slot, order) => ({ ...slot, order }))
}

function uniqueByKey(names, key) {
  const seen = new Set()
  return names.filter((name) => { const nameKeyed = key(name); if (seen.has(nameKeyed)) return false; seen.add(nameKeyed); return true })
}

const COLLECTION_LISTINGS = { rooms: ['/rooms'], dining: ['/dining'], 'meeting-venues': ['/meetings', '/legal-corporate/corporate'], 'legal-corporate': [] }

// Item names are not in the catalogue (only counts), so they are read from the staging pages that list them.
function observedItemNames(pages) {
  const byPath = new Map(pages.map((page) => [page.path, page]))
  const texts = (pagePath, predicate) => (byPath.get(pagePath)?.elements || []).filter(predicate).map((element) => element.textContent.trim())
  return {
    rooms: texts('/rooms', (e) => e.inCmsList && e.section === 'section_rooms-collection-room-grid' && e.tag === 'h3'),
    dining: texts('/dining', (e) => e.inCmsList && e.tag === 'div' && !e.section),
    'beyond-downtown-places': texts('/neighborhood', (e) => e.inCmsList && e.source === 'cms' && e.tag === 'h2' && !e.section),
    'meeting-venues': [
      ...texts('/meetings', (e) => e.inCmsList && e.section === 'section_venue-card-fullbleed' && e.tag === 'h3'),
      ...texts('/legal-corporate/corporate', (e) => e.inCmsList && e.section === 'section_venue-card-fullbleed' && e.tag === 'h3'),
    ],
  }
}

function collectionModels(catalogue) {
  const names = observedItemNames(catalogue.pages)
  const samples = catalogue.pages.filter((page) => page.kind === 'cms-sample' && !page.path.includes('<'))
  const hintsOf = (page) => (page.elements || []).filter((e) => e.source === 'cms' && ['h1', 'h2', 'blockquote'].includes(e.tag) && !/offers-slider|faq-accordion/.test(e.section || '')).map((e) => ({ tag: e.tag, text: e.textContent }))
  const out = {}
  for (const collection of catalogue.collections) {
    const sample = samples.find((page) => templateOf(page.path) === `/${collection.slug}`)
    const listed = uniqueByKey(names[collection.slug] || [], (name) => normText(name))
    let items = listed.map((name) => ({ name, slug: null, itemPath: null, itemPathDerived: false }))
    const model = {
      name: collection.name, fields: collection.fields.map((field) => field.slug), listingPaths: COLLECTION_LISTINGS[collection.slug] || [],
      templatePath: `/${collection.slug}`, itemCount: collection.itemCount, hints: {}, items,
    }
    if (collection.slug === 'rooms') items = items.map((item) => ({ ...item, slug: slugOfName(item.name), itemPath: `/rooms/${slugOfName(item.name)}`, itemPathDerived: true }))
    if (collection.slug === 'legal-corporate' && sample) {
      const slug = sample.path.split('/').pop()
      items = [{ name: slug[0].toUpperCase() + slug.slice(1), slug, itemPath: sample.path, itemPathDerived: false }]
    }
    if (sample) {
      model.hints[sample.path] = hintsOf(sample)
      const slug = sample.path.split('/').pop()
      const h1 = model.hints[sample.path].find((hint) => hint.tag === 'h1')
      const owner = items.find((item) => h1 && normText(item.name) === normText(h1.text))
      if (owner) Object.assign(owner, { slug, itemPath: sample.path, itemPathDerived: false })
    }
    model.items = items
    out[collection.slug] = model
  }
  return out
}

const CMS_LIST_SECTIONS = /offers-slider|faq-accordion|venue-card-fullbleed|room-grid|article-card/
function boundSections(record) {
  return [...new Set((record.elements || [])
    .filter((e) => e.source === 'cms' && ['h1', 'h2', 'blockquote'].includes(e.tag) && e.section && !CMS_LIST_SECTIONS.test(e.section))
    .map((e) => e.section))]
}

export function buildCopyModel({ catalogue, pageDoms, componentsById }) {
  const pages = []
  for (const record of catalogue.pages) {
    if (record.path.includes('<')) continue
    let slots = pageSlots(record, pageDoms[record.pageId], componentsById)
    if (record.kind === 'cms-sample') {
      // components whose text the CMS item overrides on this template (a live heading from the item sits in their section)
      const bound = new Set(boundSections(record).map((section) => catalogue.sectionToComponent[section]).filter(Boolean))
      slots = slots.filter((slot) => !(slot.kind !== 'page-text' && bound.has(slot.component)))
    }
    const page = { path: record.path, kind: record.kind, title: record.title, slots }
    if (record.kind === 'cms-sample') page.templatePath = templateOf(record.path)
    pages.push(page)
  }
  const components = catalogue.components.map((component) => ({ name: component.name, pageCount: component.pageCount, pages: component.pages }))
  const collections = collectionModels(catalogue)
  return { pages, components, collections }
}
