---
name: asset-metadata
description: >
  Generate and apply context-aware alt text for every image on a Webflow site:
  asset library images (static Designer images) and CMS image fields. Builds an
  inventory with CMS context, estimates the cost, generates lines with Claude
  vision on the Batch API, gates on human review, applies library alt safely
  and CMS alt only after a probed one-item test, then verifies the live HTML.
  Triggers on "update alt text", "asset metadata", "generate alt text",
  "alt text audit", or "asset audit".
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Glob
  - mcp__webflow__data_assets_tool
  - mcp__webflow__data_cms_tool
  - mcp__webflow__data_sites_tool
---

# Asset Metadata (context-aware alt text)

Full reference: `docs/reference/alt-text-pipeline.md` (setup, config schema,
commands, cost, the srcset trap). Read it before the first run on a project.

## Two alt slots (know which one you are writing)

- **Asset library alt** (`altText` on the asset). Static Designer Image
  elements inherit it. Written with `PATCH /assets/{id}`: metadata only, the
  file and its srcset variants are untouched. Goes live on the next **site**
  publish.
- **CMS image field alt** (`{ fileId, url, alt }` on the item). Library alt
  does NOT propagate here. There is no alt-only write: every write is a
  **re-import** (new fileId, `<newId>_<oldId>_name` filename, srcset variants
  lost for good). Goes live on an **item** publish.

Default: do the library tier freely. Touch CMS image fields only after the
user has decided the variant trade-off (see Safety below).

## Prerequisites

- `assets/alt-text/config.json` copied from
  `scripts/api/anthropic/alt-text.config.example.json` and filled in (brand,
  site URL, static pages, collection-to-context mapping, prompt examples).
  The scripts refuse paid runs on the example config.
- `ANTHROPIC_API_KEY` in `.env` (generation only). Ask which key funds the run.
- `WEBFLOW_API_TOKEN` and `WEBFLOW_SITE_ID` in `.env` for `--pull` and apply.
  Without a token, read and write through the Webflow MCP instead and save
  the raw dumps by hand.

## Workflow

### Step 1: Baseline and inventory

```bash
pnpm alt:verify --save-baseline     # live alt and srcset counts per page, before anything changes
pnpm alt:inventory --pull           # dump assets + configured collections, build assets/alt-text/inventory.json
```

The inventory joins each image to its context: CMS fields per the config,
library images matched to CMS items by filename (`matchLibraryByName`), and
the page and class each library image renders on. Report the per-tier counts.

### Step 2: Estimate (free)

```bash
pnpm alt:generate --tier <tier>
```

Prints image count, model (default `claude-sonnet-5-5`) and the Batch API
dollar estimate. Show the figure to the user. Nothing is sent.

### Step 3: Calibrate on a sample

```bash
pnpm alt:generate --tier people --sample 10 --direct
```

Run the riskiest tier first (people, then project heroes). Show the user the
real lines and adjust `promptExamples` or `namingRule` in the config until
they are right. Samples up to 25 images run without `--yes`.

### Step 4: Generate (paid, needs approval)

Only after the user approves the dollar figure:

```bash
pnpm alt:generate --tier projects --submit --yes
pnpm alt:generate --tier projects --poll      # repeat until ended
```

Writes `assets/alt-text/output/<tier>.json` (the apply input) and
`assets/alt-text/review/<tier>.md` (read-only table with flags).

### Step 5: Review gate

- Read every line that names a person and every hero line in full; spot-check the rest.
- Edits go in the `alt` field of `output/<tier>.json`.
- Clear every MANUAL, TOO LONG and ERROR flag.
- Nothing is written to Webflow until the user approves the tier.

### Step 6: Build the payload

```bash
pnpm alt:payload --tier <tier>
```

Library chunks (`assets-NN.json`) and CMS chunks (`cms-<collection>-NN.json`).
MultiImage arrays are rebuilt in full; drafts stay drafts.

### Step 7: Apply library alt (safe)

```bash
pnpm alt:apply --tier static            # dry run
pnpm alt:apply --tier static --write    # PATCH /assets, spaced 1.5s, 429s retried
```

Library alt goes live only on a site publish. Before publishing the site,
confirm with the user that the Designer has nothing unfinished in it.

### Step 8: CMS alt (optional, destructive to srcset)

Only if the user has explicitly accepted losing responsive variants on the
written images:

```bash
pnpm alt:apply --tier projects --include-cms --probe <itemId> --write --publish
pnpm alt:verify /projects/<slug>        # compare srcset and image weight against the baseline
pnpm alt:apply --tier projects --include-cms --confirm-probed --write --publish
```

The bulk run is refused until a probe is recorded and `--confirm-probed` is
passed. Show the user the probe's before/after numbers and get a yes first.

### Step 9: Verify live

```bash
pnpm alt:verify /projects/<slug> /team
```

Every in-scope page should show full alt coverage. Any `SRCSET DROPPED`
line means CMS images were re-imported; report it.

## Safety: CMS image alt is a re-import

- Every CMS Image or MultiImage write re-imports the file under a new fileId
  and permanently loses srcset (one live page went from about 1.5MB to 34MB
  of images). Sending `{ fileId, alt }` without `url` returns 400.
- Alternatives that keep variants: set alt in the Webflow Editor UI, or bind
  the image element's alt to a PlainText field if the collection has fields
  to spare.
- If re-import is accepted, send the original file untouched (no resizing).
- Patch ONE item, publish it, diff the live HTML, then decide on the rest.

## Alt text rules

- Describe it to someone over the phone who can't see it: functional, not decorative.
- Information, not aesthetics. Specific and succinct. Under 200 characters.
- Normal punctuation, no trailing full stop, no copyright or photo credits.
- Never start with "Image of", "Photo of" or "Picture of".
- Name the entity when the image belongs to one (project and city, person and title); invent no names when there is no context.
- Logos name the brand. Black and white photographs are called out.
- Purely decorative images get empty alt (`""`), set in the Designer.

## Fallback

`pnpm update-metadata --dry-run` lists library assets with no alt (REST,
library slot only). Use it for a quick audit when the full pipeline is not needed.
