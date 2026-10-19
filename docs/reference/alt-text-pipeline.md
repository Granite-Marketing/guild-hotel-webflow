# Alt Text Pipeline

Context-aware alt text for every image on a Webflow site, generated with
Claude vision on the Message Batches API and applied through the Webflow
Data API. Driven by the `/asset-metadata` skill
(`.claude/skills/asset-metadata/SKILL.md`).

Generation runs as standalone scripts so image data never enters a Claude
Code session's context.

## Setup

1. `pnpm install` (adds `@anthropic-ai/sdk`; `sharp` is already a dependency).
2. Add to `.env`:
   - `ANTHROPIC_API_KEY`: generation only. Confirm which key funds the run.
   - `WEBFLOW_API_TOKEN`, `WEBFLOW_SITE_ID`: for `alt:inventory --pull` and `alt:apply`.
   - Optional `ALT_TEXT_SITE_URL`: overrides `siteUrl` in the config (e.g. a staging domain).
3. Copy `scripts/api/anthropic/alt-text.config.example.json` to
   `assets/alt-text/config.json` (gitignored through `assets/`) and replace
   every value. Collection IDs live in `docs/reference/webflow-ids.md`.

All working files live in `assets/alt-text/`: `raw/`, `inventory.json`,
`cache/`, `batches/`, `output/`, `review/`, `apply/`, `baseline.json`.
Keep `output/<tier>.json` somewhere durable: it holds every reviewed line
keyed by image identity, so a later re-upload can be re-applied without
regenerating.

## Config schema

| Key | Type | Meaning |
|---|---|---|
| `brand.name` | string | Brand or firm name used in the prompt and context. |
| `brand.description` | string | Short phrase after the name in the system prompt. |
| `siteUrl` | string | Live site origin, no trailing slash. |
| `staticPages` | string[] | Paths fetched to find where library images render, and checked by `alt:verify`. |
| `model` | string | Default `claude-sonnet-5-5`. |
| `maxChars` | number | Default `200`. |
| `thinking` | object | Optional override for the request's `thinking` field. |
| `promptExamples` | string[] | Example lines in the target voice. Use the project's own entities. |
| `collections.<Label>` | object | One entry per CMS collection, keyed by the label used in `raw/cms.json`. |

Per collection:

| Key | Meaning |
|---|---|
| `collectionId` | Webflow collection ID. Required for `--pull` and payloads. |
| `lookupOnly` | `true` for reference collections (e.g. Countries) that only resolve names. |
| `tier` | Generation and review batch name (e.g. `projects`, `people`). |
| `entity` | Noun the prompt uses ("project", "person", "blog post"). |
| `heroFields` | Image fields that count as the hero; other image fields on a multi-image item are numbered gallery images. |
| `namingRule` | What the line must name for this entity, added to the system prompt. |
| `brandOnHero` | Hero lines may add "by <brand>". |
| `includeBrand` | Adds the brand to the context (e.g. "title at <brand>"). |
| `matchLibraryByName` | Library images whose filename contains an item's name borrow that item's context. |
| `pagePath` | Item page template such as `/projects/{slug}`; used by the CMS probe. |
| `context` | Map of context key to field spec: `"field-slug"` or `{ "field", "ref", "refField", "html", "max" }`. `ref` resolves reference IDs through another collection's `name` (or `refField`). `html` strips tags. `max` truncates. |

Tiers `static` (library images rendered on a configured page) and `library`
(unrendered library images) are always added.

## Commands

| Command | Network | What it does |
|---|---|---|
| `pnpm alt:verify --save-baseline` | live site | Records alt and srcset counts per page before the run. |
| `pnpm alt:inventory --pull` | Webflow API, live site | Dumps assets and configured collections, builds `inventory.json`. |
| `pnpm alt:inventory --no-fetch` | none | Builds from existing raw dumps without page context. |
| `pnpm alt:generate --tier <t>` | none | Estimate only: count, model, Batch dollar figure. |
| `pnpm alt:generate --tier <t> --sample 10 --direct` | Anthropic | Calibration sample at standard rates (over 25 needs `--yes`). |
| `pnpm alt:generate --tier <t> --submit --yes` | Anthropic | Submits the paid batch. Refused without `--yes` or on the example config. |
| `pnpm alt:generate --tier <t> --poll` | Anthropic | Writes `output/<t>.json` and `review/<t>.md` once the batch ends. |
| `pnpm alt:payload --tier <t>` | none | Builds library and CMS apply chunks. |
| `pnpm alt:apply --tier <t>` | none | Dry run, library chunks only. |
| `pnpm alt:apply --tier <t> --write` | Webflow API | `PATCH /assets/{id}` per library image. |
| `pnpm alt:apply --tier <t> --include-cms --probe <itemId> --write --publish` | Webflow API, live site | Writes and publishes one CMS item, records `apply/<t>.probe.json`. |
| `pnpm alt:apply --tier <t> --include-cms --confirm-probed --write [--publish]` | Webflow API | Bulk CMS write; refused without a clean probe record. |
| `pnpm alt:verify [/path ...]` | live site | Alt and srcset counts against the baseline; flags `SRCSET DROPPED`. |

Every script takes `--help` and `--config <path>`.

Write pacing: every Webflow write is spaced 1.5s apart and 429s are retried
with 5s, 10s, 20s backoff on top of the client's own five retries. In one
earlier run, 821 back-to-back asset writes produced 13 failed 429s without pacing.

## Cost

Rates per million tokens (input / output): Sonnet 5.5 $2 / $10, Haiku 5.5
$0.10 / $0.50, Opus 5.5 $4 / $20. The Batch API is 50% of these. Images are
converted to a JPEG at 1200px on the long edge, about 1,000 to 1,900 tokens
each (width x height / 750). The estimate assumes 1,600 image tokens, the
system prompt, the item context and 80 output tokens per image.

Rule of thumb on Sonnet 5.5 Batch: about $2.50 per 1,000 images. Get the
printed figure approved before `--submit --yes`. The SDK's refusal fallback
parameter is not accepted on the Batches API; refused lines come back with
`error: "refusal"` in the output and are skipped by the payload builder.

## The srcset trap

Webflow holds alt in two places:

- **Asset library** (`altText`). Static Designer images inherit it.
  `PATCH /v2/assets/{id} { altText }` changes metadata only. Safe. Needs a
  site publish to go live.
- **CMS Image and MultiImage field values** (`{ fileId, url, alt }`). Library
  alt does not propagate here.

There is no alt-only write for a CMS image field. `{ fileId, alt }` without
`url` returns `400 Expected value to have a 'url' field`. With `url`, Webflow
**re-imports** the file: a new fileId, a filename like
`<newId>_<oldId>_name.jpeg`, and no responsive `srcset` variants, ever.
Pointing the field back at the old URL is another import. Importing from the
asset library's hosted URL behaves the same. On one site this turned a page
with about 1.5MB of variant images into 34MB of originals.

Rules that follow:

- Library tier first, freely. CMS tier only after an explicit decision to
  trade variants for alt.
- Ways to keep variants: set CMS alt in the Webflow Editor, or bind the
  image element's alt to a PlainText field (if the collection is under the
  60-field cap).
- If re-import is accepted, send the original file untouched (no resizing),
  so the only loss is the variants.
- Probe one item, publish it, compare the live page against the baseline,
  then run the rest. `alt:apply` enforces this.
- Verify alt, expect a new URL: the apply verifier accepts a URL that embeds
  the original file ID and fails on anything else.
- MultiImage writes replace the whole array; the payload builder rebuilds it in full.

## Alt text rules (prompt)

- Describe the image as if to someone over the phone who can't see it.
- Functional, not decorative. Information, not aesthetics. Specific and succinct.
- Under 200 characters. Normal punctuation, no trailing full stop, no credits.
- Never open with "Image of", "Photo of", "Picture of".
- Name the entity when there is one; invent nothing when there is not.
