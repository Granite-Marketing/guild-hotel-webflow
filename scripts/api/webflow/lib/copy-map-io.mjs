// Reads the committed content docs and catalogue from disk (no network) and builds the copy map inputs.
import fs from 'node:fs'
import path from 'node:path'
import { readJson, normText, tagOf } from './catalogue-helpers.mjs'
import { buildCopyModel } from './copy-map-model.mjs'

function loadComponents(rawDir) {
  const byId = {}
  for (const component of readJson(path.join(rawDir, 'components.json'))) {
    const raw = readJson(path.join(rawDir, 'components', `${component.id}.json`))
    const textNodes = raw.nodes.filter((node) => node.text).map((node) => ({ nodeId: node.id, html: node.text.html, text: node.text.text, tag: tagOf(node.text.html), norm: normText(node.text.text) }))
    byId[component.id] = { id: component.id, name: component.name, props: raw.properties, textNodes, nested: raw.nodes.filter((node) => node.type === 'component-instance') }
  }
  return byId
}

// contentDir is docs/specs/guild-content
export function loadCopyMapInputs(contentDir) {
  const catalogueDir = path.join(contentDir, 'catalogue')
  const rawDir = path.join(catalogueDir, 'raw')
  const catalogue = readJson(path.join(catalogueDir, 'catalogue.json'))
  const pageDoms = {}
  for (const page of catalogue.pages) {
    const file = path.join(rawDir, 'pages', `${page.pageId}.json`)
    if (fs.existsSync(file)) pageDoms[page.pageId] = readJson(file)
  }
  const model = buildCopyModel({ catalogue, pageDoms, componentsById: loadComponents(rawDir) })
  const sourceDir = path.join(contentDir, 'source')
  const docs = fs.readdirSync(sourceDir).filter((file) => /^Guild-.*\.md$/.test(file)).sort()
    .map((file) => ({ name: file.replace(/\.md$/, ''), markdown: fs.readFileSync(path.join(sourceDir, file), 'utf8') }))
  return { docs, model, catalogueDir }
}
