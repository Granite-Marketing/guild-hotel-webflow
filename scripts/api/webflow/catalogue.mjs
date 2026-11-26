#!/usr/bin/env node
// Read-only catalogue of the Guild Hotel site: Data API (GET only) + headless live crawl + join + reports.
// Usage: node scripts/api/webflow/catalogue.mjs [--refresh] [--skip-api] [--skip-live] [--skip-join]
//   --refresh re-fetches API data even if raw/ already has it. Credentials come from the environment
//   (WEBFLOW_API_TOKEN, WEBFLOW_SITE_ID); load .env before running. Nothing here writes to Webflow.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readJson, slugify, normText, squash, tagOf, instancesOf } from './lib/catalogue-helpers.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const OUT = path.join(ROOT, 'docs/specs/guild-content/catalogue')
const RAW = path.join(OUT, 'raw')
const LIVE = path.join(OUT, 'live')
const STAGING = 'https://the-guild-hotel-c34e71.webflow.io'
const args = new Set(process.argv.slice(2))
const TOKEN = process.env.WEBFLOW_API_TOKEN
const SITE = process.env.WEBFLOW_SITE_ID

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const writeJson = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 1))
}
const exists = (file) => fs.existsSync(file)

// ---------------------------------------------------------------- Data API (GET only)
let lastCall = 0
let apiCalls = 0
async function api(pathname, query = {}) {
  const url = new URL('https://api.webflow.com' + pathname)
  for (const [k, v] of Object.entries(query)) url.searchParams.set(k, v)
  for (let attempt = 0; attempt < 8; attempt++) {
    const wait = 1300 - (Date.now() - lastCall) // under 50 requests a minute
    if (wait > 0) await sleep(wait)
    lastCall = Date.now()
    apiCalls++
    const res = await fetch(url, { method: 'GET', headers: { Authorization: `Bearer ${TOKEN}`, accept: 'application/json' } })
    if (res.status === 429) {
      const s = Number(res.headers.get('retry-after') || 30)
      console.log(`  429 on ${pathname}, waiting ${s}s`)
      await sleep((s + 1) * 1000)
      continue
    }
    if (res.status >= 500) { await sleep(2000 * (attempt + 1)); continue }
    if (!res.ok) throw new Error(`${res.status} ${pathname}: ${(await res.text()).slice(0, 200)}`)
    return res.json()
  }
  throw new Error(`gave up on ${pathname}`)
}

async function paged(pathname, key, extra = {}) {
  const out = []
  let offset = 0
  for (;;) {
    const d = await api(pathname, { limit: 100, offset, ...extra })
    const items = d[key] || []
    out.push(...items)
    const total = d.pagination?.total ?? out.length
    offset += 100
    if (items.length === 0 || offset >= total) return { items: out, total, last: d }
  }
}

async function cached(file, fetcher) {
  if (!args.has('--refresh') && exists(file)) return readJson(file)
  const data = await fetcher()
  writeJson(file, data)
  return data
}

async function fetchApi() {
  if (!TOKEN || !SITE) throw new Error('WEBFLOW_API_TOKEN / WEBFLOW_SITE_ID missing from the environment')
  const pages = (await cached(path.join(RAW, 'pages.json'), async () => (await paged(`/v2/sites/${SITE}/pages`, 'pages')).items))
  const wanted = pages.filter((p) => !p.archived && (p.collectionId ? true : !p.draft))
  for (const p of wanted) {
    await cached(path.join(RAW, 'pages', `${p.id}.json`), async () => {
      const { items, last } = await paged(`/v2/pages/${p.id}/dom`, 'nodes')
      return { page: p, nodes: items, lastUpdated: last.lastUpdated }
    })
    process.stdout.write('.')
  }
  console.log(`\npages: ${pages.length} listed, ${wanted.length} DOMs`)

  const comps = await cached(path.join(RAW, 'components.json'), async () => (await paged(`/v2/sites/${SITE}/components`, 'components')).items)
  for (const c of comps) {
    await cached(path.join(RAW, 'components', `${c.id}.json`), async () => {
      const dom = await paged(`/v2/sites/${SITE}/components/${c.id}/dom`, 'nodes')
      const props = await paged(`/v2/sites/${SITE}/components/${c.id}/properties`, 'properties')
      return { component: c, nodes: dom.items, properties: props.items }
    })
    process.stdout.write('.')
  }
  console.log(`\ncomponents: ${comps.length}`)

  await cached(path.join(RAW, 'collections.json'), async () => {
    const { collections } = await api(`/v2/sites/${SITE}/collections`)
    const out = []
    for (const c of collections) {
      const detail = await api(`/v2/collections/${c.id}`)
      const items = await api(`/v2/collections/${c.id}/items`, { limit: 1 })
      out.push({ ...c, fields: detail.fields, itemCount: items.pagination?.total ?? null })
    }
    return out
  })
  console.log(`API calls this run: ${apiCalls}`)
}

// ---------------------------------------------------------------- live crawl
// Runs inside the page. Returns every heading-like element in DOM order.
function collectInPage() {
  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim()
  const isH = (el) => /^H[1-6]$/.test(el.tagName)
  const classStr = (el) => (typeof el.className === 'string' ? el.className : el.getAttribute('class') || '')
  const hasHeadingClass = (el) => /heading/i.test(classStr(el))
  const ownText = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim()
  const fs = (el) => parseFloat(getComputedStyle(el).fontSize)
  const all = [...document.body.querySelectorAll('*')].filter((el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(el.tagName.toUpperCase()))
  const candidates = new Set()
  const noise = (el) => el.textContent.trim() === 'BESbswy' // font-loader probe
  for (const el of all) {
    if (el.closest('svg') || noise(el)) continue
    if (isH(el) || hasHeadingClass(el)) { if (norm(el.textContent)) candidates.add(el); continue }
    if (ownText(el) && fs(el) >= 24) candidates.add(el)
  }
  // climb split-text children (same font size, short, no heading inside) to the container
  const lifted = new Set()
  for (const el of candidates) {
    let cur = el
    if (!isH(cur) && !hasHeadingClass(cur)) {
      while (cur.parentElement && cur.parentElement !== document.body) {
        const p = cur.parentElement
        const cls = classStr(p)
        if (fs(p) !== fs(cur) || /(^|\s)section_/.test(cls) || norm(p.textContent).length > 400 || p.querySelector('h1,h2,h3,h4,h5,h6,[class*="heading"]')) break
        if (![...p.children].every((c) => fs(c) === fs(cur))) break
        cur = p
      }
    }
    lifted.add(cur)
  }
  // keep outermost only
  const kept = [...lifted].filter((el) => ![...lifted].some((o) => o !== el && o.contains(el)))
  const order = new Map(all.map((el, i) => [el, i]))
  kept.sort((a, b) => order.get(a) - order.get(b))
  return kept.map((el, idx) => {
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    let hiddenBy = null
    for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
      const s = getComputedStyle(a)
      if (a.getAttribute('aria-hidden') === 'true') { hiddenBy = hiddenBy || 'aria-hidden'; }
      if (s.display === 'none') { hiddenBy = 'display:none'; break }
      if (s.visibility === 'hidden') { hiddenBy = hiddenBy || 'visibility:hidden' }
    }
    if (!hiddenBy && (r.width === 0 || r.height === 0)) hiddenBy = 'zero-size'
    if (!hiddenBy && el.offsetParent === null && cs.position !== 'fixed') hiddenBy = 'no-offsetParent'
    let section = null
    let sectionClasses = []
    let swiperClone = false
    for (let a = el; a && a !== document.body; a = a.parentElement) {
      const cl = [...a.classList]
      if (cl.includes('swiper-slide-duplicate')) swiperClone = true
      if (!section) {
        const sc = cl.find((c) => c.startsWith('section_'))
        if (sc) { section = sc; sectionClasses = cl }
      }
    }
    let dyn = false
    for (let a = el; a && a !== document.body; a = a.parentElement) if (a.classList.contains('w-dyn-item') || a.classList.contains('w-dyn-list') || a.classList.contains('w-dyn-bind-empty')) dyn = true
    return {
      order: idx,
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      innerText: norm(el.innerText),
      textContent: norm(el.textContent),
      rawTextContent: el.textContent,
      fontSize: cs.fontSize,
      textTransform: cs.textTransform,
      classes: [...el.classList],
      visible: hiddenBy === null || hiddenBy === 'aria-hidden' ? hiddenBy === null : false,
      hiddenBy,
      ariaHidden: el.closest('[aria-hidden="true"]') !== null,
      section,
      sectionClasses,
      variantIds: sectionClasses.filter((c) => c.startsWith('w-variant-')),
      swiperClone,
      inCmsList: dyn,
    }
  })
}

async function crawl() {
  const { chromium } = await import('@playwright/test')
  const pages = readJson(path.join(RAW, 'pages.json'))
  const statics = pages.filter((p) => !p.collectionId && !p.draft && !p.archived)
  const targets = statics.map((p) => ({ path: p.slug ? (p.publishedPath || '/' + p.slug) : '/', kind: 'static', pageId: p.id, title: p.title }))
  const templates = pages.filter((p) => p.collectionId && !p.draft && !p.archived)

  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  // find sample item URLs for every CMS template via the sitemap, then pinned ones from the brief
  let sitemapUrls = []
  try {
    const xml = await (await fetch(`${STAGING}/sitemap.xml`)).text()
    sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
  } catch (e) { console.log('sitemap failed', e.message) }
  const pinned = { '/rooms': '/rooms/cozy-queen', '/dining': '/dining/dining-zuma', '/legal-corporate': '/legal-corporate/corporate' }
  for (const t of templates) {
    const prefix = t.publishedPath
    let sample = pinned[prefix]
    const under = sitemapUrls.filter((u) => u.startsWith(prefix + '/'))
    if (!sample || (sitemapUrls.length && !sitemapUrls.includes(sample) && under.length)) sample = under[0]
    targets.push({ path: sample || null, kind: 'cms-sample', pageId: t.id, title: t.title, templatePath: prefix, itemsInSitemap: under.length })
  }
  // fallback: follow links on listing pages for templates with no sitemap sample
  const listingPaths = { '/happenings-stories': '/happenings', '/packages': '/packages', '/rooms': '/rooms', '/dining': '/dining' }
  const page = await ctx.newPage()
  for (const t of targets.filter((x) => x.kind === 'cms-sample' && !x.path)) {
    const listing = listingPaths[t.templatePath] || t.templatePath
    try {
      await page.goto(STAGING + listing, { waitUntil: 'networkidle', timeout: 45000 })
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => new URL(a.href).pathname))
      t.path = hrefs.find((h) => h.startsWith(t.templatePath + '/')) || null
    } catch { /* leave null */ }
  }

  fs.mkdirSync(LIVE, { recursive: true })
  const index = []
  const queue = [...targets]
  const worker = async () => {
    const pg = await ctx.newPage()
    for (let t; (t = queue.shift()); ) {
      if (!t.path) { index.push({ path: null, templatePath: t.templatePath, kind: t.kind, pageId: t.pageId, title: t.title, status: 'no-live-sample' }); continue }
      const file = slugify(t.path) + '.json'
      const target = path.join(LIVE, file)
      if (!args.has('--refresh') && exists(target) && readJson(target).status === 'ok') {
        const old = readJson(target)
        index.push({ path: t.path, kind: t.kind, pageId: t.pageId, status: 'ok', httpStatus: old.httpStatus, elements: old.elements?.length })
        continue
      }
      const rec = { ...t, url: STAGING + t.path, file }
      try {
        const resp = await pg.goto(STAGING + t.path, { waitUntil: 'load', timeout: 45000 })
        rec.httpStatus = resp?.status()
        await pg.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {})
        await pg.evaluate(async () => {
          const step = Math.max(300, innerHeight * 0.8)
          for (let y = 0; y < document.documentElement.scrollHeight + step; y += step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 80)) }
          scrollTo(0, document.documentElement.scrollHeight)
        })
        await pg.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {})
        await pg.waitForTimeout(500)
        rec.documentTitle = await pg.title()
        rec.metaDescription = await pg.$eval('meta[name="description"]', (m) => m.content).catch(() => null)
        rec.elements = await pg.evaluate(collectInPage)
        rec.status = 'ok'
      } catch (e) {
        rec.status = 'failed'
        rec.error = String(e.message).slice(0, 300)
      }
      writeJson(target, rec)
      index.push({ path: t.path, kind: t.kind, pageId: t.pageId, status: rec.status, httpStatus: rec.httpStatus, elements: rec.elements?.length, error: rec.error })
      console.log(`${rec.status} ${t.path} ${rec.elements?.length ?? ''}`)
    }
  }
  await Promise.all([worker(), worker(), worker(), worker()])
  writeJson(path.join(LIVE, '_index.json'), index)
  await browser.close()
}

// ---------------------------------------------------------------- join

function loadModel() {
  const pages = readJson(path.join(RAW, 'pages.json'))
  const comps = {}
  for (const c of readJson(path.join(RAW, 'components.json'))) {
    const raw = readJson(path.join(RAW, 'components', `${c.id}.json`))
    const textNodes = raw.nodes.filter((n) => n.text).map((n) => ({
      nodeId: n.id, type: n.type, html: n.text.html, text: n.text.text, tag: tagOf(n.text.html), norm: normText(n.text.text),
    }))
    const nested = raw.nodes.filter((n) => n.type === 'component-instance')
    comps[c.id] = { id: c.id, name: c.name, group: c.group, props: raw.properties, textNodes, nested, nodes: raw.nodes }
  }
  const pageDoms = {}
  for (const p of pages) {
    const f = path.join(RAW, 'pages', `${p.id}.json`)
    if (exists(f)) pageDoms[p.id] = readJson(f)
  }
  return { pages, comps, pageDoms }
}

function join(model) {
  const { pages, comps, pageDoms } = model
  const liveIndex = exists(path.join(LIVE, '_index.json')) ? readJson(path.join(LIVE, '_index.json')) : []
  const result = { generated: new Date().toISOString(), pages: [], unjoined: [], components: [] }

  const compUse = {} // componentId -> { pages: {pageKey: count}, instances }
  const pageRecords = []

  for (const ent0 of liveIndex) {
    const ent = ent0.path ? ent0 : { ...ent0, path: `${ent0.templatePath}/<no live item>`, status: 'no-live-item' }
    const p = pages.find((x) => x.id === ent.pageId)
    const dom = pageDoms[ent.pageId]
    const live = ent.status === 'ok' ? readJson(path.join(LIVE, slugify(ent.path) + '.json')) : null
    const rec = { path: ent.path, kind: ent.kind, pageId: ent.pageId, title: p?.title, status: ent.status, error: ent.error, instances: [], pageText: [], elements: [] }
    if (!dom) { result.unjoined.push({ path: ent.path, reason: 'no page DOM fetched' }); pageRecords.push(rec); continue }
    const pageNodes = dom.nodes
    const inst = instancesOf(pageNodes, comps)
    rec.pageText = pageNodes.filter((n) => n.text).map((n) => ({ nodeId: n.id, html: n.text.html, text: n.text.text, tag: tagOf(n.text.html), norm: normText(n.text.text) }))
    const counts = {}
    for (const i of inst) counts[i.componentId] = (counts[i.componentId] || 0) + 1
    rec.instances = Object.entries(counts).map(([id, n]) => ({ componentId: id, name: comps[id]?.name || '(unknown)', count: n }))
    for (const [id, n] of Object.entries(counts)) {
      compUse[id] ||= { pages: {} }
      compUse[id].pages[ent.path] = n
    }
    // candidate sources for this page
    const cands = []
    for (const t of rec.pageText) cands.push({ source: 'page', norm: t.norm, sq: t.norm.replace(/ /g, ''), detail: { nodeId: t.nodeId, tag: t.tag } })
    for (const i of inst) {
      const c = comps[i.componentId]
      if (!c) continue
      const overridden = new Set(i.overrides.map((o) => o.propertyId))
      for (const o of i.overrides) {
        const t = o.text?.text ?? ''
        if (normText(t)) cands.push({ source: 'component-prop', norm: normText(t), sq: squash(t), detail: { component: c.name, property: o.label, propertyId: o.propertyId, instance: i.nodeId } })
      }
      for (const pr of c.props) {
        if (overridden.has(pr.propertyId)) continue
        const t = pr.text?.text ?? ''
        if (normText(t) && !/__wf_reserved/.test(t)) cands.push({ source: 'component-default', norm: normText(t), sq: squash(t), detail: { component: c.name, property: pr.label, propertyId: pr.propertyId, instance: i.nodeId } })
      }
      for (const t of c.textNodes) if (t.norm) cands.push({ source: 'component-fixed', norm: t.norm, sq: t.norm.replace(/ /g, ''), detail: { component: c.name, nodeId: t.nodeId, tag: t.tag } })
    }
    const prio = ['component-prop', 'page', 'component-fixed', 'component-default']
    for (const el of live?.elements || []) {
      const n = normText(el.textContent)
      let match = null
      let how = 'exact'
      for (const s of prio) { match = cands.find((c) => c.source === s && (c.norm === n || c.sq === n.replace(/ /g, ''))); if (match) break }
      if (!match && n.length >= 12) {
        how = 'partial'
        for (const s of prio) { match = cands.find((c) => c.source === s && c.norm.length >= 12 && (n.includes(c.norm) || c.norm.includes(n))); if (match) break }
      }
      let source = match?.source
      if (!source) source = (rec.kind === 'cms-sample' || el.inCmsList) ? 'cms' : 'unknown'
      rec.elements.push({ ...el, rawTextContent: undefined, source, match: match ? { how, ...match.detail } : null })
    }
    pageRecords.push(rec)
  }
  // section class -> component, learned from matched elements, used to place unmatched (CMS-bound) headings
  const votes = {}
  for (const r of pageRecords) for (const e of r.elements) if (e.section && e.match?.component && e.source !== 'cms') {
    const v = (votes[e.section] ||= {})
    v[e.match.component] = (v[e.match.component] || 0) + 1
  }
  const secMap = Object.fromEntries(Object.entries(votes).map(([k, v]) => [k, Object.entries(v).sort((a, b) => b[1] - a[1])[0][0]]))
  for (const r of pageRecords) for (const e of r.elements) if (!e.match?.component && e.section && secMap[e.section]) e.inferredComponent = secMap[e.section]
  result.sectionToComponent = secMap
  result.pages = pageRecords

  // component catalogue
  for (const c of Object.values(comps)) {
    const use = compUse[c.id]?.pages || {}
    result.components.push({
      id: c.id, name: c.name, group: c.group,
      instanceCount: Object.values(use).reduce((a, b) => a + b, 0),
      pageCount: Object.keys(use).length,
      pages: use,
      properties: c.props.map((p) => ({ id: p.propertyId, label: p.label, type: p.type, default: p.text?.text ?? null, defaultHtml: p.text?.html ?? null })),
      fixedText: c.textNodes.map((t) => ({ nodeId: t.nodeId, tag: t.tag, text: t.text, html: t.html })),
      nestedComponents: c.nested.map((n) => comps[n.componentId]?.name || n.componentId),
    })
  }
  return result
}

// ---------------------------------------------------------------- reports
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ')
const short = (s, n = 90) => { s = String(s ?? '').replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n - 1) + '...' : s }

function writeCatalogueMd(res) {
  const L = ['# Guild Hotel content catalogue', '', `Generated ${res.generated}. Staging crawl at 1440x900, headless. Source key: page, component-prop, component-default, component-fixed, cms, unknown.`, '']
  for (const p of res.pages) {
    L.push(`## ${p.path}  (${p.kind}, ${p.title || ''})`, '')
    if (p.status !== 'ok') { L.push(`Live crawl: ${p.status} ${p.error || ''}`, ''); }
    if (p.instances.length) L.push('Components: ' + p.instances.map((i) => `${i.name} x${i.count}`).join(', '), '')
    if (p.elements.length) {
      L.push('| # | tag | visible | text (textContent) | source | detail | section |', '|---|---|---|---|---|---|---|')
      for (const e of p.elements) {
        const d = e.match ? (e.match.component ? `${e.match.component}${e.match.property ? ' / ' + e.match.property : ''}` : '') + (e.match.how === 'partial' ? ' (partial)' : '') : ''
        L.push(`| ${e.order} | ${e.tag} | ${e.visible ? 'y' : 'n' + (e.hiddenBy ? ' ' + e.hiddenBy : '')} | ${esc(short(e.textContent))} | ${e.source} | ${esc(d)} | ${esc(e.section || '')}${e.variantIds.length ? ' [' + e.variantIds.map((v) => v.slice(0, 22)).join(' ') + ']' : ''} |`)
      }
      L.push('')
    }
  }
  fs.writeFileSync(path.join(OUT, 'catalogue.md'), L.join('\n'))
}

function writeConflictsMd(res, model) {
  const L = ['# Conflicts and shared-component report', '', `Generated ${res.generated}.`, '']
  const used = res.components.filter((c) => c.instanceCount > 0).sort((a, b) => b.pageCount - a.pageCount || b.instanceCount - a.instanceCount)

  // heading tags per component, from component DOM (fixed) and from live crawl (rendered, matched via prop)
  const liveTagsByComp = {} // comp name -> Map(property label -> Set(tag))
  for (const p of res.pages) for (const e of p.elements) {
    const cname = e.match?.component || e.inferredComponent
    if (cname && /^h[1-6]$/.test(e.tag) && e.visible) {
      const m = (liveTagsByComp[cname] ||= {})
      const key = e.match?.property || (e.match?.nodeId ? `fixed text "${short(e.textContent, 30)}"` : e.source === 'cms' ? 'CMS-bound heading (section ' + e.section + ')' : '(unmatched)')
      ;(m[key] ||= new Map())
      m[key].set(e.tag, (m[key].get(e.tag) || 0) + 1)
    }
  }

  L.push('## a. Shared components', '', 'Heading tags come from the component DOM when the text is hardcoded (tag fixed inside the component, so one change hits every instance). For prop-bound or CMS-bound text the Data API does not expose the tag, so it is taken from the visible live headings (matched by text, or placed by section class when CMS-bound). More than one tag for one property means the tag is not fixed in the component, or a text match was shared. Page counts treat each CMS template as one page, however many items it serves.', '')
  L.push('| component | pages | instances | pages (list) |', '|---|---|---|---|')
  for (const c of used) L.push(`| ${esc(c.name)} | ${c.pageCount} | ${c.instanceCount} | ${esc(Object.entries(c.pages).map(([k, n]) => k + (n > 1 ? ` x${n}` : '')).join(', '))} |`)
  L.push('')
  let fixedHeadings = 0
  let fixedHeadingsShared = 0
  for (const c of used) {
    const fixed = c.fixedText.filter((t) => /^h[1-6]$/.test(t.tag || ''))
    const live = liveTagsByComp[c.name] || {}
    if (!fixed.length && !Object.keys(live).length) continue
    L.push(`### ${c.name} (${c.pageCount} pages, ${c.instanceCount} instances)`, '')
    for (const t of fixed) {
      fixedHeadings++
      if (c.pageCount > 1) fixedHeadingsShared++
      L.push(`- FIXED ${t.tag}: "${short(t.text, 100)}" (hardcoded in the component DOM; changing the tag or text changes all ${c.instanceCount} instances on ${c.pageCount} pages)`)
    }
    for (const [prop, m] of Object.entries(live)) {
      const tags = [...m.entries()].map(([t, n]) => `${t} x${n}`).join(', ')
      L.push(`- prop "${prop}": rendered as ${tags}${m.size > 1 ? ' (varies per page: check whether the tag is a per-instance setting)' : (c.pageCount > 1 ? ' (same tag everywhere: tag is set inside the component)' : '')}`)
    }
    L.push('')
  }
  res.stats = { fixedHeadings, fixedHeadingsShared }
  const unusedHeadingFixed = res.components.filter((c) => c.instanceCount === 0).reduce((a, c) => a + c.fixedText.filter((t) => /^h[1-6]$/.test(t.tag || '')).length, 0)
  L.push(`Fixed-tag heading elements inside components in use: ${fixedHeadings} (${fixedHeadingsShared} of them in components used on more than one page). Unused components hold ${unusedHeadingFixed} more.`, '')

  // b. fixed text per component
  L.push('## b. Hardcoded (non-prop) text inside components', '', 'Text a writer cannot change per page. "Pages" shows reach; text on a component used on more than one page is shared copy, listed here so it can be judged page by page.', '')
  L.push('| component | pages | tag | fixed text | live evidence |', '|---|---|---|---|---|')
  const fixedLive = {} // norm -> Set(paths) from live
  for (const p of res.pages) for (const e of p.elements) if (e.source === 'component-fixed') (fixedLive[normText(e.textContent)] ||= new Set()).add(p.path)
  for (const c of used) for (const t of c.fixedText) {
    if (!normText(t.text)) continue
    const ev = fixedLive[normText(t.text)]
    L.push(`| ${esc(c.name)} | ${c.pageCount} | ${t.tag || ''} | ${esc(short(t.text, 120))} | ${ev ? 'seen live on ' + ev.size + ' page(s)' : 'not matched live (hidden or not a heading-sized element)'} |`)
  }
  L.push('')
  // b2. static page text identical across pages vs differing
  L.push('### Same component, differing fixed text across pages', '', 'Fixed text does not differ per page by construction (one component DOM). The pages most likely to want different copy are those where the same fixed text appears under different page contexts:', '')
  const shared = used.filter((c) => c.pageCount > 2 && c.fixedText.some((t) => normText(t.text).length > 3))
  for (const c of shared) L.push(`- ${c.name}: ${c.fixedText.filter((t) => normText(t.text)).map((t) => '"' + short(t.text, 60) + '"').join('; ')} on ${c.pageCount} pages`)
  L.push('')

  // c. duplicates
  L.push('## c. Duplicates on one page', '')
  let dupTotal = 0
  for (const p of res.pages) {
    const groups = new Map()
    for (const e of p.elements) {
      const k = normText(e.textContent)
      if (!k) continue
      ;(groups.get(k) || groups.set(k, []).get(k)).push(e)
    }
    const dups = [...groups.entries()].filter(([, v]) => v.length > 1)
    if (!dups.length) continue
    L.push(`### ${p.path}`, '')
    for (const [k, v] of dups) {
      dupTotal++
      const why = v.map((e) => (e.swiperClone ? 'slider-clone' : e.visible ? 'visible' : 'hidden:' + (e.hiddenBy || '?'))).join(', ')
      L.push(`- "${short(v[0].textContent, 80)}" x${v.length} [${v.map((e) => e.tag).join(',')}] (${why}) in ${[...new Set(v.map((e) => e.section || '-'))].join(', ')}${v[0].match?.component ? ' via ' + v[0].match.component : ''}`)
    }
    L.push('')
  }
  L.push(`Duplicate groups: ${dupTotal}`, '')

  // d. named blocks
  L.push('## d. Footer, booking/newsletter, offers slider, FAQ', '')
  const find = (re) => res.components.filter((c) => re.test(c.name))
  const wanted = [['Footer', /footer/i], ['Booking / newsletter', /booking|newsletter|cta/i], ['Offers slider', /offers/i], ['FAQ', /faq/i]]
  for (const [label, re] of wanted) {
    const cs = find(re)
    L.push(`### ${label}`, '')
    if (!cs.length) L.push('- no component with a matching name', '')
    for (const c of cs) L.push(`- component "${c.name}" (${c.id}): ${c.pageCount} pages, ${c.instanceCount} instances${c.pageCount ? ': ' + Object.keys(c.pages).join(', ') : ''}`)
    // native sections on live pages that look like these blocks but are not component instances
    const nativeHits = []
    const reSec = { Footer: /footer/i, 'Booking / newsletter': /booking|newsletter|cta/i, 'Offers slider': /offers/i, FAQ: /faq/i }[label]
    for (const p of res.pages) {
      const secs = new Set(p.elements.filter((e) => e.section && reSec.test(e.section)).map((e) => e.section))
      for (const s of secs) nativeHits.push(`${p.path}: ${s}`)
    }
    if (nativeHits.length) L.push('', `Live sections matching on pages: ${nativeHits.length}`, ...nativeHits.slice(0, 80).map((x) => '  - ' + x))
    L.push('')
  }
  fs.writeFileSync(path.join(OUT, 'conflicts.md'), L.join('\n'))
}

// ---------------------------------------------------------------- main
async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  if (!args.has('--skip-api')) await fetchApi()
  if (!args.has('--skip-live')) await crawl()
  if (!args.has('--skip-join')) {
    const model = loadModel()
    const res = join(model)
    writeConflictsMd(res, model)
    // collections appended
    const colFile = path.join(RAW, 'collections.json')
    res.collections = exists(colFile) ? readJson(colFile).map((c) => ({ id: c.id, name: c.displayName, slug: c.slug, itemCount: c.itemCount, fields: (c.fields || []).map((f) => ({ slug: f.slug, displayName: f.displayName, type: f.type })) })) : []
    writeJson(path.join(OUT, 'catalogue.json'), res)
    writeCatalogueMd(res)
    const bySource = {}
    let elements = 0
    for (const p of res.pages) for (const e of p.elements) { elements++; bySource[e.source] = (bySource[e.source] || 0) + 1 }
    console.log(JSON.stringify({ pagesCrawled: res.pages.length, components: res.components.length, componentsUsed: res.components.filter((c) => c.instanceCount).length, liveElements: elements, bySource, stats: res.stats, unjoined: res.unjoined, failedLive: res.pages.filter((p) => p.status !== 'ok').map((p) => `${p.path}:${p.status}`) }, null, 1))
  }
}
main().catch((e) => { console.error(e); process.exit(1) })
