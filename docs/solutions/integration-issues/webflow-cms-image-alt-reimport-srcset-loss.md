---
title: "Webflow Data API re-imports CMS images on every image-field write, dropping srcset variants"
date: "2026-09-17"
category: "integration-issues"
module: "scripts/api/webflow (CMS image and alt-text writes)"
component: "tooling"
problem_type: "integration_issue"
severity: "high"
root_cause: "wrong_api"
resolution_type: "workflow_improvement"
symptoms:
  - "PATCH /collections/{id}/items with { fileId, url, alt } returns 200 and sets alt, but the re-fetched item shows a new fileId and a double-id URL (<newId>_<oldId>_name.jpeg)"
  - "Sending { fileId, alt } without url returns 400 Expected value to have a 'url' field"
  - "Live pages lose srcset and sizes on every rewritten CMS image; one page went from about 1.5MB to 34MB of image bytes"
  - "Re-importing from the asset library S3 URL instead of the CDN URL produces the same double-id copy with no variants"
  - "Asset library records updated via PATCH /assets/{id} { altText } keep their file and variants"
related_components:
  - "Webflow CMS Image and MultiImage fields"
  - "Webflow asset library"
tags:
  - webflow-api
  - cms-image-field
  - alt-text
  - srcset
  - responsive-images
  - re-import
  - asset-library
  - data-api-v2
---

# Webflow Data API re-imports CMS images on every image-field write, dropping srcset variants

## Problem

Writing alt text to a Webflow CMS image field through the Data API v2 is not an in-place update. Every write to an Image or MultiImage field is "upload from `url`": Webflow fetches the file, stores a new copy under a new `fileId`, and points the field at the copy. Copies created this way never receive Webflow's responsive `srcset` variants. On a production project, a bulk alt-text pass over several hundred CMS images replaced every variant-bearing image with its full-size original, and the change was published before the verifier caught it.

## Symptoms

- `{ fileId, alt }` with no `url` returns `400 Validation Error ... Expected value to have a 'url' field`. `fileId` is read-only on write; Webflow's field-types reference only says "To upload a new image, provide an object containing a `url`."
- After a write with `{ fileId, url, alt }` using the field's current `url`, the re-fetched item has a new `fileId` and a filename like `<newId>_<oldId>_original-name.jpeg` (double id prefix, `.jpg` renamed `.jpeg`). Bytes are identical and the alt is applied.
- Using an asset-library S3 `hostedUrl` as `url` gives the same double-id copy with no variants. The URL's origin makes no difference.
- Live HTML loses `srcset` and `sizes`. A project page with 7 of 7 images carrying `srcset` had 0 of 7 after. A 4000px hero served 3.1MB where its `-p-500` to `-p-1600` variants had weighed 25 to 250KB.
- A post-write check comparing URLs reports "url changed" for nearly every item: the fingerprint of a re-import.

## What Didn't Work

- **`{ fileId, alt }` without `url`:** rejected with the 400 above. There is no alt-only write shape for image fields.
- **Re-importing from the asset library's S3 URL** (upload the original through the presigned asset flow, write its `hostedUrl` into the field): same double-id copy, no `srcset`. Variants are decided by the import path, not the file's source.
- **Waiting for variants to appear:** CMS images imported through the API had no `srcset` five months later. Webflow does not backfill. Designer and Editor uploads (single-id filenames) do get variants, AVIF included.
- **Moving alt into PlainText fields bound to the image element's alt:** avoids touching images, but needs one spare field per image slot, and the collection was at Webflow's field cap (see [webflow-cms-field-limit-migration.md](../workflow-issues/webflow-cms-field-limit-migration.md)).
- **Resizing before re-import to offset the missing variants:** rejected on product grounds; the client reviewed on a large display and wanted untouched originals.

## Solution

Split the work by where alt lives.

**Asset library (static Designer images): safe.** `PATCH /v2/assets/{id}` with `{ altText }` changes the record without touching the file. Static Image elements inherit the library alt exactly. It reaches the live site only on a full site publish. Assert that the response echoes the new text.

**CMS image fields: destructive to variants, so decide before writing.** Accept that the write re-imports, send the original file so nothing is resized, and verify the alt, not the URL:

```js
// The only write shape the API accepts for an Image field
item.fieldData[fieldSlug] = { fileId, url, alt }

// MultiImage is replaced wholesale: rebuild the full array
item.fieldData[fieldSlug] = siblings.map((entry) => ({
  fileId: entry.fileId,
  url: entry.url,
  alt: altByKey.get(entry.key) ?? entry.currentAlt ?? '',
}))
```

```js
// A re-import is expected; a lost image is not
const originalFileId = (url.match(/\/([0-9a-f]{24})_/) || [])[1]
const reimported = originalFileId && liveUrl.includes(`_${originalFileId}_`)
if (liveUrl !== url && !reimported) problems.push(`${key}: url changed (${liveUrl || 'missing'})`)
```

Fail hard if `alt` did not apply. Update drafts but leave them out of the publish list so they stay drafts.

**Pace bulk asset writes.** About 820 back-to-back asset PATCHes produced 13 `429 Too Many Requests` even with five exponential-backoff retries in the client. A retry pass at 1.5s between calls cleared them. Space bulk asset writes rather than relying on retry alone.

## Why This Works

CMS images live in a separate bucket from the site asset library. A CMS field value is a pointer to a file in that bucket plus alt text, and the Data API exposes one mutation for that pointer: "import from URL", which always creates a new object. `fileId` in the request body is informational. Responsive variants are generated by the Designer and Editor upload pipeline at upload time and never for API-created objects, so any API write permanently downgrades the image to a single size. Pointing back at the old URL is itself another import, so the original cannot be restored through the API.

`PATCH /v2/assets/{id}` mutates metadata on an existing library object, so the file, its variants and every static element using it are untouched.

## Prevention

- **Patch one item first, then look at the live page.** Before any bulk CMS image write: PATCH one item, re-fetch it, publish it, and diff the live HTML for `srcset` presence and image bytes against the pre-write state. A one-item probe stops the run at zero damage.
- **Write-order rule.** Library alt is non-destructive and can be applied freely. CMS image alt is an image replacement; get an explicit decision on losing variants before touching it.
- **Decide the trade-off up front.** If `srcset` matters more than alt, set CMS alt through the Editor UI, or bind alt to a text field where the collection has fields to spare. If alt matters more, import the originals untouched so the only loss is the variants.
- **Verify alt, expect a new URL.** A verifier asserting URL equality fails on every write. Assert the new URL embeds the original `fileId` and the alt matches.
- **Rebuild MultiImage arrays completely.** A partial array silently drops images.
- **Never send image fields in unrelated item updates.** A field migration or text patch that echoes an image field back re-imports it.
- **Keep generated alt lines in the repo,** keyed by image identity, so an Editor re-upload can be re-applied without regenerating.

## Related

- [webflow-cms-image-emission.md](../conventions/webflow-cms-image-emission.md): the platform rules this incident proves (srcset only for Designer and Editor uploads)
- [alt-text-pipeline.md](../../reference/alt-text-pipeline.md): the starter's alt-text pipeline and its write guards
- [mcp-api-gap-asset-pipeline.md](mcp-api-gap-asset-pipeline.md): origin of the REST asset pipeline
- [animated-gif-compression-webflow-4mb-cap.md](animated-gif-compression-webflow-4mb-cap.md): uses `{ fileId, url, alt }` as an intentional upload
- [scrolltrigger-mobile-premature-animations.md](scrolltrigger-mobile-premature-animations.md): its performance follow-up measured a listing page with zero `srcset`; the cause is API import, so re-binding cannot restore variants
- Webflow field types reference: https://developers.webflow.com/data/reference/field-types-item-values
