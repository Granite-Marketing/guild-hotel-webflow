#!/usr/bin/env node
// Copy map: matches every line of the client's content docs to the staging element it replaces.
// Reads the committed docs and catalogue only; no network calls, nothing is written to Webflow.
// Usage: node scripts/api/webflow/copy-map.mjs   (or: pnpm copy-map)
// Writes docs/specs/guild-content/catalogue/copy-map.json and copy-map.md.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCopyMap, CONFIDENCE_MATCH_MINIMUM, CONFIDENCE_CONFIRM_BELOW, IMPLICIT_ALTERNATE_SIMILARITY, DEFAULT_SLOT_PENALTY } from './lib/copy-map.mjs'
import { loadCopyMapInputs } from './lib/copy-map-io.mjs'
import { REGISTRY } from './lib/copy-map-registry.mjs'
import { renderCopyMapMarkdown, summarise } from './lib/copy-map-report.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

function main() {
  const { docs, model, catalogueDir } = loadCopyMapInputs(path.join(ROOT, 'docs/specs/guild-content'))
  const map = buildCopyMap({ docs, model, registry: REGISTRY })
  const output = {
    settings: { defaultSlotPenalty: DEFAULT_SLOT_PENALTY, confidenceMatchMinimum: CONFIDENCE_MATCH_MINIMUM, confidenceConfirmBelow: CONFIDENCE_CONFIRM_BELOW, implicitAlternateSimilarity: IMPLICIT_ALTERNATE_SIMILARITY },
    docs: docs.map((doc) => doc.name),
    summary: summarise(map),
    rooms: map.rooms,
    notes: map.notes,
    rows: map.rows,
  }
  // U+2014 is written as a JSON escape so the file holds no literal em dash; it parses back to the exact doc text.
  fs.writeFileSync(path.join(catalogueDir, 'copy-map.json'), JSON.stringify(output, null, 1).replace(/\u2014/g, '\\u2014') + '\n')
  fs.writeFileSync(path.join(catalogueDir, 'copy-map.md'), renderCopyMapMarkdown(output))
  console.log(JSON.stringify(output.summary, null, 1))
}
main()
