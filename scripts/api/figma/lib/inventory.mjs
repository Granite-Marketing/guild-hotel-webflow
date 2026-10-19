// Pure inventory logic (plan U5): section signatures, clusters of repeated
// sections, CMS template groups from cloned pages, lane tags and overrides,
// plus the markdown renderers. No I/O lives here; build-inventory.mjs reads
// the slicer output and writes the results.

import crypto from 'node:crypto'

export const LANES = Object.freeze(['agent', 'manual', 'needs-decision'])

export const DEFAULTS = Object.freeze({
  // Two pages form a CMS template group when their aligned section lists
  // score at least this (0..1).
  cmsThreshold: 0.8,
  // Section pairs below this similarity are not treated as the same slot when
  // drafting CMS fields.
  alignMin: 0.5,
  // Weights of the per-section similarity used for page alignment.
  weights: { roles: 0.6, height: 0.25, images: 0.15 },
  // Role score of two text-free sections (lower it to make text-free bands
  // count as weaker evidence).
  emptyRoleScore: 1,
  // Height ratio is raised to this power so near-equal heights dominate.
  heightPower: 2,
  // Left edges closer than this belong to one column.
  columnGap: 40,
  // Nodes at least this share of the frame width are full-bleed, not columns.
  fullWidthRatio: 0.9,
  heightBucket: 100,
  headingMaxChars: 60
})

const SLIDER_TEXT = /\b(slides?|sliders?|slideshows?|carousels?)\b|\bgallery types?\b/i
const SLIDER_NAME = /\b(slides?|sliders?|slideshows?|carousels?|gallery)\b/i

// No em or en dashes reach generated docs or JSON text fields.
export const sanitize = (text) => String(text ?? '').replace(/[\u2013\u2014]/g, '-').replace(/\s+/g, ' ').trim()

export const truncate = (text, max) => {
  const clean = sanitize(text)
  return clean.length > max ? `${clean.slice(0, max - 3).trimEnd()}...` : clean
}

export const shortHash = (value) => crypto.createHash('sha1').update(value).digest('hex').slice(0, 10)

// Role of one spec text: its named style, else a quantised bucket.
export const textRole = (text) => {
  if (text.styleName) return text.styleName
  const size = text.fontSize === null || text.fontSize === undefined ? '?' : Math.round(text.fontSize)
  return `${text.fontFamily ?? '?'}|${size}|${text.fontWeight ?? '?'}|${text.textCase ?? 'ORIGINAL'}`
}

// Short, readable slug for a role (used in CMS field names).
export const roleSlug = (role) => {
  const bucket = role.split('|')
  if (bucket.length === 4) return `text-${bucket[1]}`
  return String(role)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'text'
}

// Distinct left-edge clusters of top-level nodes, ignoring full-bleed layers
// and manual overlays. A band with nothing narrow counts as one column.
export const columnCount = (spec, options = DEFAULTS) => {
  const width = spec.bbox?.width || 1600
  const overlayIds = new Set((spec.manualOverlays || []).map((overlay) => overlay.nodeId))
  const lefts = (spec.nodes || [])
    .filter((node) => node.bbox && !overlayIds.has(node.id) && node.bbox.width < width * options.fullWidthRatio)
    .map((node) => node.bbox.x)
    .sort((a, b) => a - b)
  if (!lefts.length) return 1
  let columns = 1
  for (let position = 1; position < lefts.length; position++) {
    if (lefts[position] - lefts[position - 1] > options.columnGap) columns++
  }
  return columns
}

export const sectionSignature = (spec, options = DEFAULTS) => {
  const roles = (spec.texts || []).map(textRole)
  const imageCount = (spec.images || []).length
  const columns = columnCount(spec, options)
  const height = spec.bbox?.height || 0
  const heightBucket = Math.round(height / options.heightBucket) * options.heightBucket
  const loose = `roles=${roles.join(',')};images=${imageCount}`
  const signature = `${loose};columns=${columns};height=${heightBucket}`
  return {
    roles,
    imageCount,
    columns,
    height,
    heightBucket,
    signature,
    loose,
    clusterId: `c-${shortHash(signature)}`,
    looseClusterId: `l-${shortHash(loose)}`
  }
}

// Hash of a section's visible copy and image refs, or null when it has none.
// Equal hashes on different pages mean the same shared content (a footer,
// an FAQ block), not just the same structure.
export const contentHash = (spec) => {
  const texts = (spec.texts || []).map((text) => sanitize(text.characters)).filter(Boolean)
  const images = (spec.images || []).map((image) => image.imageRef).filter(Boolean)
  if (!texts.length && !images.length) return null
  return shortHash(JSON.stringify([texts, images]))
}

// Longest common subsequence length of two arrays.
export const lcsLength = (a, b) => {
  if (!a.length || !b.length) return 0
  let previous = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i++) {
    const current = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j++) {
      current[j] = a[i - 1] === b[j - 1] ? previous[j - 1] + 1 : Math.max(previous[j], current[j - 1])
    }
    previous = current
  }
  return previous[b.length]
}

// LCS index pairs of two arrays, in order.
export const lcsPairs = (a, b) => {
  const table = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1])
    }
  }
  const pairs = []
  let i = 0
  let j = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      pairs.push([i, j])
      i++
      j++
    } else if (table[i + 1][j] >= table[i][j + 1]) i++
    else j++
  }
  return pairs
}

const ratio = (a, b) => {
  if (a === b) return 1
  const high = Math.max(a, b)
  return high > 0 ? Math.min(a, b) / high : 1
}

// Soft similarity of two section signatures (0..1).
export const sectionSimilarity = (a, b, options = DEFAULTS) => {
  const roleScore = !a.roles.length && !b.roles.length
    ? options.emptyRoleScore
    : lcsLength(a.roles, b.roles) / Math.max(a.roles.length, b.roles.length)
  const { roles, height, images } = options.weights
  return roles * roleScore + height * ratio(a.height, b.height) ** options.heightPower + images * ratio(a.imageCount, b.imageCount)
}

// Best monotone alignment of two ordered section lists. Score is the summed
// pair similarity over the longer list, so missing or extra sections cost.
export const alignPages = (listA, listB, options = DEFAULTS) => {
  const n = listA.length
  const m = listB.length
  if (!n || !m) return { score: 0, pairs: [] }
  const table = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  const sims = Array.from({ length: n }, (_, i) => listB.map((b) => sectionSimilarity(listA[i], b, options)))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = Math.max(table[i + 1][j], table[i][j + 1], table[i + 1][j + 1] + sims[i][j])
    }
  }
  const pairs = []
  let i = 0
  let j = 0
  const close = (x, y) => Math.abs(x - y) < 1e-9
  while (i < n && j < m) {
    if (close(table[i][j], table[i + 1][j + 1] + sims[i][j])) {
      pairs.push({ a: i, b: j, similarity: round3(sims[i][j]) })
      i++
      j++
    } else if (close(table[i][j], table[i + 1][j])) i++
    else j++
  }
  return { score: round3(table[0][0] / Math.max(n, m)), pairs }
}

export const round3 = (value) => Math.round(value * 1000) / 1000

// Union pages whose pairwise alignment clears the threshold.
// pages: [{ pageSlug, signatures }] in page order.
export const findTemplateGroups = (pages, options = DEFAULTS) => {
  const parent = new Map(pages.map((page) => [page.pageSlug, page.pageSlug]))
  const find = (slug) => {
    while (parent.get(slug) !== slug) slug = parent.get(slug)
    return slug
  }
  const scores = []
  for (let i = 0; i < pages.length; i++) {
    for (let j = i + 1; j < pages.length; j++) {
      const { score } = alignPages(pages[i].signatures, pages[j].signatures, options)
      scores.push({ a: pages[i].pageSlug, b: pages[j].pageSlug, score })
      if (score >= options.cmsThreshold) {
        const rootA = find(pages[i].pageSlug)
        const rootB = find(pages[j].pageSlug)
        if (rootA !== rootB) parent.set(rootB, rootA)
      }
    }
  }
  const order = new Map(pages.map((page, position) => [page.pageSlug, position]))
  const members = new Map()
  for (const page of pages) {
    const root = find(page.pageSlug)
    if (!members.has(root)) members.set(root, [])
    members.get(root).push(page.pageSlug)
  }
  const groups = [...members.values()]
    .filter((slugs) => slugs.length >= 2)
    .map((slugs) => slugs.sort((a, b) => order.get(a) - order.get(b)))
    .sort((a, b) => order.get(a[0]) - order.get(b[0]))
    .map((slugs) => {
      const inGroup = new Set(slugs)
      const pairScores = scores.filter((entry) => inGroup.has(entry.a) && inGroup.has(entry.b))
      // Reference page: highest summed similarity to the other members.
      const total = (slug) => pairScores.filter((entry) => entry.a === slug || entry.b === slug).reduce((sum, entry) => sum + entry.score, 0)
      const referencePage = [...slugs].sort((a, b) => total(b) - total(a) || order.get(a) - order.get(b))[0]
      return { id: groupId(slugs), pages: slugs, referencePage, similarity: pairScores }
    })
  return { groups, scores }
}

// Readable group id: distinct leading tokens, plus a shared trailing token.
export const groupId = (slugs) => {
  const tokens = slugs.map((slug) => slug.split('-'))
  const leading = [...new Set(tokens.map((parts) => parts[0]))]
  const last = tokens[0][tokens[0].length - 1]
  const sharedTail = tokens.every((parts) => parts.length > 1 && parts[parts.length - 1] === last) && !leading.includes(last)
  return `cms-${[...leading, ...(sharedTail ? [last] : [])].join('-')}`
}

export const isCollectionPage = (pageSlug) => /(^|-)collection$/.test(pageSlug)

// Detail pages a collection page lists: template groups or single pages
// sharing its first slug token.
export const linkListPage = (pageSlug, groups, pageSlugs) => {
  const token = pageSlug.split('-')[0]
  const group = groups.find((entry) => entry.pages.every((slug) => slug.split('-')[0] === token) && !entry.pages.includes(pageSlug))
  if (group) return { group: group.id, pages: group.pages }
  const singles = pageSlugs.filter((slug) => slug !== pageSlug && !isCollectionPage(slug) && slug.split('-')[0] === token)
  return singles.length ? { group: null, pages: singles } : { group: null, pages: [] }
}

const isSliderNote = (note) =>
  SLIDER_NAME.test(note.name || '') || (note.texts || []).some((text) => SLIDER_TEXT.test(text))

// Lane for one sliced section (before overrides).
export const sectionLane = (spec) => {
  if (spec.source === 'side' || spec.laneHint === 'manual') {
    return { lane: 'manual', laneReason: 'side frame: overlay, modal or menu (KTD8)' }
  }
  const slider = (spec.animationNotes || []).find(isSliderNote)
  if (slider) return { lane: 'manual', laneReason: `slider or gallery animation: ${slider.name}` }
  const overlays = spec.manualOverlays || []
  if (overlays.length && !(spec.texts || []).length && !(spec.images || []).length) {
    return { lane: 'manual', laneReason: 'only content is a nav overlay' }
  }
  return { lane: 'agent', laneReason: overlays.length ? 'default; nav overlay excluded' : 'default' }
}

// Lane for a COMPONENT_SET frame beside a page.
export const componentSetLane = (frame, navConfig) => {
  const pattern = new RegExp(navConfig?.namePattern || 'guild-nav', 'i')
  const ids = new Set(navConfig?.componentSetIds || [])
  if (ids.has(frame.id) || pattern.test(frame.name || '')) {
    return { lane: 'manual', laneReason: 'nav component set (KTD8)' }
  }
  return {
    lane: 'needs-decision',
    laneReason: `component set ${frame.width}x${frame.height} beside the page: probably an accordion or card set, not a nav`
  }
}

// Apply overrides in place. Returns warnings for unknown keys or values.
export const applyOverrides = (entries, overrides) => {
  const warnings = []
  const byKey = new Map(entries.map((entry) => [entry.key, entry]))
  const sections = overrides?.sections || {}
  for (const key of Object.keys(sections).sort()) {
    const override = sections[key] || {}
    const entry = byKey.get(key)
    if (!entry) {
      warnings.push(`override for unknown section "${key}" ignored`)
      continue
    }
    const applied = {}
    if (override.lane !== undefined) {
      if (LANES.includes(override.lane)) {
        entry.lane = override.lane
        entry.laneReason = `override${override.note ? `: ${sanitize(override.note)}` : ''}`
        applied.lane = override.lane
      } else {
        warnings.push(`override for "${key}" has unknown lane "${override.lane}"; expected ${LANES.join(', ')}`)
      }
    }
    if (override.name !== undefined) {
      entry.proposedName = override.name
      applied.name = override.name
    }
    if (override.mergeWith !== undefined) {
      if (!byKey.has(override.mergeWith)) warnings.push(`override for "${key}" merges with unknown section "${override.mergeWith}"`)
      entry.mergeWith = override.mergeWith
      applied.mergeWith = override.mergeWith
    }
    if (override.note !== undefined) {
      entry.note = sanitize(override.note)
      applied.note = entry.note
    }
    entry.override = applied
  }
  return warnings
}

const HEADING_STYLE = /^h\d|display|hero/i

// First heading-like text of a spec (named heading style or 32px and up),
// else its first text.
export const firstHeading = (spec, max = DEFAULTS.headingMaxChars) => {
  const texts = (spec.texts || []).filter((text) => sanitize(text.characters))
  const heading = texts.find((text) => (text.styleName && HEADING_STYLE.test(text.styleName)) || (text.fontSize || 0) >= 32) || texts[0]
  return heading ? truncate(heading.characters, max) : null
}

const fieldType = (role, values) => {
  if (/button|link|cta/i.test(role)) return 'Link'
  if (values.some((value) => value.length > 160 || /\n/.test(value))) return 'RichText'
  return 'PlainText'
}

// Draft collection fields for one template group. pageSpecs maps pageSlug to
// its ordered page-section specs. Slots whose text or image differs between
// member pages become fields. Sections that also appear on pages outside the
// group (sharedOutside(spec) true, for example the FAQ or booking footer) are
// shared components and stay static. Remaining sections whose copy is the
// same on every page are listed as identical copy for review: placeholder
// text to replace per item, or static template copy.
export const draftCmsFields = (group, pageSpecs, { sharedOutside = () => false, options = DEFAULTS } = {}) => {
  const reference = pageSpecs.get(group.referencePage) || []
  const others = group.pages.filter((slug) => slug !== group.referencePage)
  const signatures = (specs) => specs.map((spec) => sectionSignature(spec, options))
  const refSignatures = signatures(reference)
  const alignments = new Map(others.map((slug) => {
    const specs = pageSpecs.get(slug) || []
    const { pairs } = alignPages(refSignatures, signatures(specs), options)
    const map = new Map(pairs.filter((pair) => pair.similarity >= options.alignMin).map((pair) => [pair.a, specs[pair.b]]))
    return [slug, map]
  }))
  const total = group.pages.length
  const missingNote = (count) => (count < total ? `missing on ${total - count} of ${total} pages` : null)

  const fields = []
  const sections = []
  reference.forEach((spec, position) => {
    const matched = others.map((slug) => alignments.get(slug).get(position) || null)
    const present = 1 + matched.filter(Boolean).length
    const number = String(spec.index).padStart(2, '0')
    const sectionKey = `${group.referencePage}/${number}-${spec.slug}`
    const shared = sharedOutside(spec)
    const summary = { section: sectionKey, presentOn: present, of: total, sharedSiteWide: shared, fields: 0, identicalSlots: 0, firstHeading: firstHeading(spec, 40) }
    sections.push(summary)
    if (shared) return

    const refRoles = (spec.texts || []).map(textRole)
    const textMaps = matched.map((other) => {
      if (!other) return null
      const otherRoles = (other.texts || []).map(textRole)
      return new Map(lcsPairs(refRoles, otherRoles).map(([i, j]) => [i, other.texts[j]]))
    })
    const roleCounts = new Map()
    ;(spec.texts || []).forEach((text, textIndex) => {
      const role = refRoles[textIndex]
      const count = (roleCounts.get(role) || 0) + 1
      roleCounts.set(role, count)
      const values = [text.characters, ...textMaps.map((map) => (map ? map.get(textIndex)?.characters ?? null : null))]
      const known = values.filter((value) => value !== null).map((value) => String(value))
      if (new Set(known.map(sanitize)).size <= 1 && known.length === total) {
        summary.identicalSlots++
        return
      }
      summary.fields++
      fields.push({
        name: `s${number}-${roleSlug(role)}${count > 1 ? `-${count}` : ''}`,
        type: fieldType(role, known),
        section: sectionKey,
        role,
        samples: [...new Set(known.map((value) => truncate(value, 40)))].slice(0, 3),
        note: missingNote(known.length)
      })
    })

    const imageSlots = Math.max((spec.images || []).length, ...matched.map((other) => (other?.images || []).length))
    for (let imageIndex = 0; imageIndex < imageSlots; imageIndex++) {
      const refs = [spec, ...matched].map((section) => section?.images?.[imageIndex]?.imageRef ?? null)
      const known = refs.filter(Boolean)
      if (new Set(known).size <= 1 && known.length === total) {
        summary.identicalSlots++
        continue
      }
      summary.fields++
      fields.push({
        name: `s${number}-image${imageSlots > 1 ? `-${imageIndex + 1}` : ''}`,
        type: 'Image',
        section: sectionKey,
        role: 'image',
        samples: [],
        note: missingNote(known.length)
      })
    }
  })
  return { fields, sections }
}

const cell = (value) => sanitize(value).replace(/\|/g, '\\|')

export const renderInventoryMarkdown = (inventory) => {
  const { summary } = inventory
  const lines = [
    '# Figma section inventory',
    '',
    'Generated by `node scripts/api/figma/build-inventory.mjs` from the sliced snapshot under `figma/pages/`. Do not edit this file by hand; edit `figma/inventory.overrides.json` and re-run.',
    '',
    '## How to review',
    '',
    '1. Read each page table below. Open the crop link to see the section.',
    '2. Check the lane. `agent` sections are built by an agent session; `manual` sections (nav, overlays, modals, sliders) are built by hand; `needs-decision` needs your call.',
    '3. Check clusters. Sections sharing a cluster id have the same structure and are candidates for one shared component.',
    '4. Record every correction in `figma/inventory.overrides.json`, keyed by the section key (`<pageSlug>/<NN-slug>`, shown in the section column):',
    '',
    '```json',
    '{',
    '  "sections": {',
    '    "home/05-dress-up-for-the-rich-worldly": { "lane": "manual", "name": "Venue slider", "mergeWith": "home/06-cocktail-classics-and-drinks-for-connaisseurs", "note": "one slider, not five cards" }',
    '  }',
    '}',
    '```',
    '',
    '   `lane` is one of `agent`, `manual`, `needs-decision`. `name` sets the proposed component name. `mergeWith` marks a section as part of another. `note` is free text. Overrides are applied last and survive every re-run.',
    '5. Re-run `node scripts/api/figma/build-inventory.mjs` and check the table again. CMS collections are proposed separately in `docs/figma/cms-proposal.md`.',
    '',
    '## Summary',
    '',
    '| Measure | Count |',
    '|---|---|',
    `| Pages | ${summary.pages} |`,
    `| Sections | ${summary.sections} |`,
    `| Component sets | ${summary.componentSets} |`,
    `| Lane: agent | ${summary.lanes.agent} |`,
    `| Lane: manual | ${summary.lanes.manual} |`,
    `| Lane: needs-decision | ${summary.lanes['needs-decision']} |`,
    `| Exact clusters with 2 or more sections | ${summary.clusters} |`,
    `| Loose clusters with 2 or more sections | ${summary.looseClusters} |`,
    `| CMS template groups | ${summary.cmsGroups} |`,
    `| Overrides applied | ${summary.overrides} |`,
    ''
  ]
  if (inventory.warnings.length) {
    lines.push('## Warnings', '')
    for (const warning of inventory.warnings) lines.push(`- ${cell(warning)}`)
    lines.push('')
  }
  if (inventory.cmsGroups.length) {
    lines.push('## CMS template groups', '')
    for (const group of inventory.cmsGroups) {
      lines.push(`- \`${group.id}\`: ${group.pages.map((slug) => (slug === group.referencePage ? `${slug} (reference)` : slug)).join(', ')}`)
    }
    lines.push('')
  }
  lines.push('## Pages', '')
  for (const page of inventory.pages) {
    const entries = inventory.sections.filter((entry) => entry.pageSlug === page.pageSlug)
    const tags = [page.cmsTemplateGroup ? `CMS template group \`${page.cmsTemplateGroup}\`` : null, page.isCollectionPage ? 'collection list page' : null].filter(Boolean)
    lines.push(`### ${page.pageSlug}`, '')
    if (tags.length) lines.push(tags.join('; '), '')
    lines.push('| # | section | lane | cluster (size) | texts/images | first heading | crop |', '|---|---|---|---|---|---|---|')
    for (const entry of entries) {
      const sectionCell = [`\`${entry.key}\``, entry.proposedName ? `name: ${entry.proposedName}` : null, entry.mergeWith ? `merge into \`${entry.mergeWith}\`` : null, entry.note ? `note: ${entry.note}` : null]
        .filter(Boolean)
        .map(cell)
        .join('<br>')
      const laneCell = entry.excludedOverlays.length ? `${entry.lane} (overlay excluded)` : entry.lane
      const clusterCell = entry.clusterId ? `${entry.clusterId} (${entry.clusterSize})` : '-'
      const counts = entry.textCount === null ? '-' : `${entry.textCount}/${entry.imageCount}`
      const crop = entry.crop ? `[crop](../../${entry.crop})` : '-'
      lines.push(`| ${entry.index ?? 'set'} | ${sectionCell} | ${cell(laneCell)} | ${clusterCell} | ${counts} | ${cell(entry.firstHeading || '-')} | ${crop} |`)
    }
    lines.push('')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

export const renderCmsProposal = (inventory) => {
  const lines = [
    '# CMS collection proposal',
    '',
    '**Status: proposal only. Requires approval before creation.** Nothing here has been created in Webflow. A build session creates collections only after an explicit yes in chat.',
    '',
    'Generated by `node scripts/api/figma/build-inventory.mjs`. Template groups are pages whose ordered section structures align at or above the CMS threshold. Fields come from text and image slots that differ between the pages of a group. Sections whose copy also appears verbatim on a page outside the group (shared components such as the FAQ or booking footer) stay static. Copy identical on every page of the group is listed for review. Field names follow `s<section>-<style role>`; types are guesses (PlainText, RichText, Image, Link).',
    ''
  ]
  if (!inventory.cmsGroups.length) lines.push('No template groups found.', '')
  for (const group of inventory.cmsGroups) {
    lines.push(`## \`${group.id}\``, '')
    lines.push(`Pages: ${group.pages.join(', ')}. Reference page: ${group.referencePage}.`, '')
    lines.push('| Page pair | Similarity |', '|---|---|')
    for (const pair of group.similarity) lines.push(`| ${pair.a} / ${pair.b} | ${pair.score} |`)
    lines.push('')
    if (group.listedBy.length) lines.push(`Listed by: ${group.listedBy.join(', ')}.`, '')
    lines.push('### Proposed fields', '', '| Field | Type | Section | Style role | Sample values | Note |', '|---|---|---|---|---|---|')
    lines.push('| name | PlainText | - | - | - | Webflow default |', '| slug | PlainText | - | - | - | Webflow default |')
    for (const field of group.fields) {
      lines.push(`| ${field.name} | ${field.type} | \`${field.section}\` | ${cell(field.role)} | ${field.samples.map(cell).join('; ') || '-'} | ${cell(field.note || '-')} |`)
    }
    lines.push('')
    const identical = group.sections.filter((section) => !section.sharedSiteWide && section.identicalSlots)
    if (identical.length) {
      lines.push('### Identical copy to review', '', 'Slots with the same copy on every page of the group. Each is either placeholder text that becomes a field, or static template copy.', '')
      lines.push('| Reference section | Identical slots | First heading |', '|---|---|---|')
      for (const section of identical) lines.push(`| \`${section.section}\` | ${section.identicalSlots} | ${cell(section.firstHeading || '-')} |`)
      lines.push('')
    }
    lines.push('### Section coverage', '', '| Reference section | Present on | Shared site-wide | Fields | Identical slots |', '|---|---|---|---|---|')
    for (const section of group.sections) {
      lines.push(`| \`${section.section}\` | ${section.presentOn} of ${section.of} | ${section.sharedSiteWide ? 'yes (static)' : 'no'} | ${section.fields} | ${section.identicalSlots} |`)
    }
    lines.push('')
  }
  lines.push('## Collection list pages', '')
  lines.push('| List page | Lists | Note |', '|---|---|---|')
  for (const page of inventory.collectionPages) {
    const lists = page.listsGroup ? `\`${page.listsGroup}\` (${page.listsPages.join(', ')})` : page.listsPages.join(', ') || '-'
    const note = page.cmsTemplateGroup
      ? `itself in template group \`${page.cmsTemplateGroup}\``
      : page.listsPages.length ? '' : 'no detail page designed; items may be static or link elsewhere'
    lines.push(`| ${page.pageSlug} | ${lists} | ${cell(note) || '-'} |`)
  }
  lines.push('')
  return `${lines.join('\n').trimEnd()}\n`
}
