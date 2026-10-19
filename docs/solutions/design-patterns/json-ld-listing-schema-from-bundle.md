---
title: "JSON-LD for a CMS listing page injected from the bundle (10,000-char custom-code slot limit)"
date: "2026-05-02"
category: "design-patterns"
module: "SEO structured data (src/utils, scripts/api/webflow)"
component: "frontend_stimulus"
problem_type: "design_pattern"
severity: "low"
status: "active"
applies_when:
  - "Adding schema.org structured data to a page that lists every CMS item"
  - "Generated JSON-LD is larger than 10,000 characters"
tags:
  - seo
  - json-ld
  - structured-data
  - schema-org
  - webflow-custom-code
  - character-limit
  - webflow-bundle
---

# JSON-LD for a CMS listing page injected from the bundle

## Problem

A listing page's structured data (a `CollectionPage` whose `mainEntity` is an `ItemList` of 46 `CreativeWork` items with name, URL, image, year, genre, location and creator) came to 45,108 characters pretty-printed and 30,690 minified. Webflow's page custom code slots (head and before-body) are capped at **10,000 characters** each, so it fits in no single slot.

## Pattern

1. **Generate the JSON-LD from the CMS by script.** A read-only script (`scripts/api/webflow/generate-<page>-schema.mjs`) pages through the published items, resolves reference fields (category, country), maps countries to ISO 3166-1 alpha-2 codes, picks the first populated image field, and writes both a pretty-printed copy for review and the minified payload to the repo (e.g. `docs/seo/<page>-schema.md` and `src/data/<page>-schema.json`). Build URLs from one `SITE_URL` constant so the staging domain is swapped for production in one place before launch.
2. **Inject it from the bundle, gated on pathname.** The bundle already loads on every page and imports JSON at build time:

   ```ts
   // src/utils/structuredData.ts
   import listingSchema from '../data/listing-schema.json'

   export const structuredData = () => {
     if (window.location.pathname !== '/projects') return
     const script = document.createElement('script')
     script.type = 'application/ld+json'
     script.textContent = JSON.stringify(listingSchema)
     document.head.appendChild(script)
   }
   ```

   esbuild bundles JSON imports natively; add `"resolveJsonModule": true` to `tsconfig.json` so `pnpm run check` accepts the import. Call it from `src/index.ts` inside `Webflow.push` like any module. Googlebot renders JavaScript and indexes injected JSON-LD; confirm with Google's Rich Results Test against the published URL.
3. **Regenerate when items change,** then rebuild and release. The schema is a snapshot of published CMS data, not live.

## Alternatives considered

- **Static file plus link:** host the JSON-LD next to `dist/index.js` on jsDelivr and reference it from the page head. Smaller bundle, but search engines do not reliably consume linked JSON-LD, so prefer inline injection.
- **Split across slots and a CMS embed:** opening `<script>` and array prefix in the page head, items in an Embed inside the Collection List, closing braces before body. Fits the limit and stays live with CMS data, but one stray comma breaks the whole block. Most fragile.

## Gotchas

- Keep site names, organisation names and domains in config, never hardcoded in the generator.
- Small per-item schema (a single `CreativeWork` on an item template page) fits a page slot or a CMS-bound Embed; only the all-items listing needs this pattern.
- Count characters on the minified payload plus the `<script>` wrapper, and remember every slot also holds whatever else is already in it.

## Related

- [webflow-scripts-api.md](../../reference/webflow-scripts-api.md): custom-code slot and script limits
- `.claude/skills/update-seo/SKILL.md`: page titles, descriptions and Open Graph tags
