// Finds vector-only artwork (icons, arrows, button outlines, frame shapes,
// illustrations) inside page and side frames, de-duplicated by structure, name
// and size so each distinct shape is exported once. Pure functions; no I/O.

import { createHash } from 'node:crypto'

const VECTOR_TYPES = new Set(['VECTOR', 'BOOLEAN_OPERATION', 'STAR', 'LINE', 'ELLIPSE', 'REGULAR_POLYGON'])
const CONTAINER_TYPES = new Set(['GROUP', 'FRAME', 'INSTANCE', 'COMPONENT'])
const MIN_SIZE = 4

function hasImageFill (node) {
  return (node.fills || []).some(fill => fill.type === 'IMAGE' && fill.visible !== false)
}

export function isVectorOnly (node) {
  if (node.visible === false) return true
  if (VECTOR_TYPES.has(node.type)) return !hasImageFill(node)
  if (CONTAINER_TYPES.has(node.type) && node.children?.length) {
    if (hasImageFill(node)) return false
    return node.children.every(isVectorOnly)
  }
  return false
}

function shape (node) {
  const kids = (node.children || []).filter(child => child.visible !== false)
  return `${node.type}(${kids.map(shape).join(',')})`
}

export function vectorSignature (node) {
  const box = node.absoluteBoundingBox
  const key = `${shape(node)}|${node.name}|${Math.round(box.width)}x${Math.round(box.height)}`
  return createHash('md5').update(key).digest('hex').slice(0, 10)
}

export function kebab (value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'vector'
}

// Returns [{ signature, id, name, width, height, type, uses: [{ id, frameId }] }]
// sorted by first appearance. frameIds limits the search to page and side frames.
export function collectVectors (fileJson, frameIds) {
  const wanted = new Set(frameIds)
  const bySignature = new Map()

  function visit (node, frameId, isTop, frameBox) {
    if (node.visible === false) return
    const box = node.absoluteBoundingBox
    const candidate = !isTop &&
      (CONTAINER_TYPES.has(node.type) || VECTOR_TYPES.has(node.type)) &&
      box && box.width >= MIN_SIZE && box.height >= MIN_SIZE &&
      isVectorOnly(node)
    if (candidate) {
      const signature = vectorSignature(node)
      if (!bySignature.has(signature)) {
        bySignature.set(signature, {
          signature,
          id: node.id,
          name: node.name,
          width: Math.round(box.width),
          height: Math.round(box.height),
          type: node.type,
          uses: []
        })
      }
      bySignature.get(signature).uses.push({
        id: node.id,
        frameId,
        x: Math.round(box.x - frameBox.x),
        y: Math.round(box.y - frameBox.y),
        width: Math.round(box.width),
        height: Math.round(box.height)
      })
      return
    }
    for (const child of node.children || []) visit(child, frameId, false, frameBox)
  }

  function find (node) {
    if (wanted.has(node.id)) {
      visit(node, node.id, true, node.absoluteBoundingBox)
      return
    }
    for (const child of node.children || []) find(child)
  }

  find(fileJson.document)
  return [...bySignature.values()]
}

export function vectorFilename (vector) {
  return `${kebab(vector.name)}-${vector.width}x${vector.height}-${vector.id.replace(/[:;]/g, '-')}.svg`
}
