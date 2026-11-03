// Mobile snapshot of THE GUILD - HANDOFF (Internal): every "— MOBILE" section,
// both NAV sections (booking menu) and the UI KIT page, written to figma/mobile/.
// Four Figma calls: one nodes fetch, three render batches. Re-run only when the
// handoff file changes; build sessions read figma/mobile/ and never call Figma.
//
//   node scripts/api/figma/snapshot-mobile.mjs [fileKey]

import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { gzipSync } from 'node:zlib'
import { slugify, idSafe } from './lib/frames.mjs'

const require = createRequire(import.meta.url)
const { FigmaClient } = require('../lib/figma-client.cjs')

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const OUT = join(ROOT, 'figma', 'mobile')
const FILE_KEY = process.argv[2] || 'J39OO1f7mLYOYZqVc8Mghw'
const MOBILE_PAGE = '11:377'
const UI_KIT_PAGE = '995:51368'
const MAX_MEGAPIXELS = 25

const client = new FigmaClient(null, { ledgerPath: join(ROOT, 'figma', '.cache', 'ledger.jsonl') })

const meta = await client.getFile(FILE_KEY, { depth: 2 })
const pages = meta.document.children
const mobileSections = pages.find(p => p.id === MOBILE_PAGE).children
  .filter(c => c.type === 'SECTION' && (/MOBILE/.test(c.name) || c.name === 'NAV'))
const uiKitSections = pages.find(p => p.id === UI_KIT_PAGE).children.filter(c => c.type === 'SECTION')

const nodes = await client.getFileNodes(FILE_KEY, [...mobileSections, ...uiKitSections].map(s => s.id))
mkdirSync(OUT, { recursive: true })
writeFileSync(join(OUT, 'nodes.json.gz'), gzipSync(JSON.stringify(nodes)))

// Mobile frames are the visible direct children of each mobile section; the
// desktop NAV section and UI kit sections render whole.
const frames = []
for (const section of mobileSections) {
  const doc = nodes.nodes[section.id].document
  if (section.name === 'NAV') {
    frames.push({ id: doc.id, name: doc.name, section: 'nav-desktop', kind: 'desktop-nav', box: doc.absoluteBoundingBox })
    continue
  }
  const slug = slugify(section.name.replace(/—\s*MOBILE/, ''))
  for (const child of doc.children || []) {
    if (child.visible === false) continue
    const isPage = child.absoluteBoundingBox.height > 2000
    frames.push({ id: child.id, name: child.name, section: slug, kind: isPage ? 'page' : 'state', box: child.absoluteBoundingBox })
  }
}
for (const section of uiKitSections) {
  frames.push({ id: section.id, name: section.name, section: 'ui-kit', kind: 'ui-kit', box: section.absoluteBoundingBox })
}

// Largest scale from 2 down that keeps each render under the megapixel cap.
for (const frame of frames) {
  const megapixels = frame.box.width * frame.box.height / 1e6
  frame.scale = [2, 1, 0.75, 0.5, 0.25].find(s => megapixels * s * s <= MAX_MEGAPIXELS)
}

const byScale = Map.groupBy(frames, f => f.scale)
for (const [scale, group] of byScale) {
  const { images } = await client.exportImages(FILE_KEY, group.map(f => f.id), 'jpg', { scale })
  for (const frame of group) {
    const url = images[frame.id]
    if (!url) { frame.status = 'failed'; continue }
    const file = join('renders', frame.section, `${slugify(frame.name)}-${idSafe(frame.id)}.jpg`)
    const res = await fetch(url)
    mkdirSync(dirname(join(OUT, file)), { recursive: true })
    writeFileSync(join(OUT, file), Buffer.from(await res.arrayBuffer()))
    Object.assign(frame, { file, status: 'ok' })
  }
}

const index = {
  fileKey: FILE_KEY,
  fileName: meta.name,
  version: meta.version,
  lastModified: meta.lastModified,
  fetchedAt: new Date().toISOString(),
  frames: frames.map(({ box, ...f }) => ({ ...f, width: Math.round(box.width), height: Math.round(box.height) }))
}
writeFileSync(join(OUT, 'index.json'), JSON.stringify(index, null, 2) + '\n')
console.log(`[mobile] ${frames.filter(f => f.status === 'ok').length}/${frames.length} frames rendered, ${client.calls.length} Figma calls`)
