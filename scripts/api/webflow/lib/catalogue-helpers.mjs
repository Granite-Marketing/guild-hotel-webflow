// Pure helpers shared by the catalogue script and the copy map. No I/O besides readJson.
import fs from 'node:fs'

export const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
export const slugify = (text) => (text.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'home')

// Lowercase, strip tags and punctuation, collapse spaces: the catalogue's text comparison key.
export const normText = (text) => (text || '').toLowerCase().replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
export const squash = (text) => normText(text).replace(/ /g, '')
export const tagOf = (html) => (html && /^\s*<(\w+)/.exec(html)?.[1]?.toLowerCase()) || null

// Component instances reachable from a node list, with their overrides and the components they sit in.
export function instancesOf(nodes, comps) {
  const out = []
  const walk = (list, via) => {
    for (const node of list) {
      if (node.type !== 'component-instance') continue
      out.push({ nodeId: node.id, componentId: node.componentId, overrides: node.propertyOverrides || [], via })
      const component = comps[node.componentId]
      if (component) walk(component.nested, [...via, component.name])
    }
  }
  walk(nodes, [])
  return out
}
