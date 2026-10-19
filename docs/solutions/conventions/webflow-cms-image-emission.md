---
title: "Webflow CMS images: what the platform emits, and which writes are safe"
date: "2026-10-19"
category: "conventions"
module: "CMS images (Designer bindings, scripts/api/webflow)"
component: "tooling"
problem_type: "convention"
severity: "high"
applies_when:
  - "Diagnosing layout shift, CLS or stale ScrollTrigger positions on CMS-driven pages"
  - "Writing to any CMS Image or MultiImage field through the Data API"
  - "Setting alt text on library or CMS images"
  - "Uploading client images to Webflow"
tags:
  - webflow-cms
  - cms-image-field
  - srcset
  - width-height
  - cls
  - re-import
  - asset-library
  - upload-size
---

# Webflow CMS images: what the platform emits, and which writes are safe

## Rules

### 1. Webflow never emits `width` / `height` on CMS-bound images

CMS-bound `<img>` elements get no `width` or `height` HTML attributes, whichever binding you use. Static (non-CMS) Image elements have dimension controls in Image Settings and do emit them; CMS-bound ones do not. So "switch to the native CMS image binding" is not a layout-shift fix.

Ways to reserve space instead:

- **CSS `aspect-ratio` on the image wrapper** (the default; one rule per card type, set in the Designer or head custom code).
- **Per-item dimensions** when items genuinely vary: add `Image Width` / `Image Height` Number fields, have the upload pipeline read intrinsic dimensions and write them, bind them to `data-width` / `data-height` custom attributes, and promote those to real `width` / `height` attributes in the bundle. Browsers derive the aspect-ratio reservation from the attributes.
- **Eager-promote** the offending lazy images before ScrollTriggers are created (see [runtime-modules.md](../../reference/runtime-modules.md) and [scrolltrigger-mobile-premature-animations.md](../integration-issues/scrolltrigger-mobile-premature-animations.md)).

### 2. `srcset` / `sizes` exist only for Designer and Editor uploads

Webflow's responsive-variant pipeline runs only for images uploaded through the Designer, the Editor or the asset library UI. Webflow's help centre states that images added through CSV import or the API do not get responsive variants. Webflow does not backfill them later, and re-binding an element to a different field does not create them.

**Tell by filename.** Designer and Editor uploads have single-id filenames (`<id>_name.jpg`) and carry `srcset` (AVIF included). API imports have double-id filenames (`<newId>_<oldId>_name.jpeg`) and never do. If the content pipeline imports CMS images through the API, assume no CMS image on the site has `srcset`, and size listing images accordingly (see [cms-listing-thumbnail-field-webp.md](../design-patterns/cms-listing-thumbnail-field-webp.md)).

### 3. Any CMS image-field write is a re-import

A Data API v2 write to an Image or MultiImage field, `{ fileId, url, alt }`, always uploads from `url`: a new `fileId`, a double-id filename, and no variants, even when `url` is the field's current value. `fileId` is read-only; `{ fileId, alt }` without `url` returns 400. There is no alt-only update. Before any bulk write, patch one item, publish it and diff the live HTML (`srcset` presence, image bytes). MultiImage writes replace the whole array. Full incident and verifier pattern: [webflow-cms-image-alt-reimport-srcset-loss.md](../integration-issues/webflow-cms-image-alt-reimport-srcset-loss.md).

### 4. Library alt via `PATCH /v2/assets/{id}` is safe

`{ altText }` on an asset-library record changes metadata only: the file, its variants and every static element using it are untouched. It reaches the live site on the next full site publish. Pace bulk asset PATCHes (about 1.5s apart); back-to-back runs hit 429s even with client retries.

### 5. Uploads: 4MB cap, resize the long edge only

Webflow rejects image uploads above 4MB. For oversized client files:

- Reduce dimensions only, preserving aspect ratio. Never crop or stretch.
- Aim for a long edge around 2560px (lower only if the file is still over the cap), JPEG quality about 85 to 90. Do not over-compress: Webflow re-encodes to AVIF on delivery.
- Use `sharp` (Node) or `magick` (ImageMagick); both honour EXIF orientation.
- Write resized files to a sibling folder (e.g. `-resized/`) and keep the originals.

Animated GIFs have their own route: [animated-gif-compression-webflow-4mb-cap.md](../integration-issues/animated-gif-compression-webflow-4mb-cap.md).

## Why This Matters

Each wrong assumption here has a concrete cost: recommending native binding wastes a Designer pass and fixes nothing; a bulk alt write over CMS images can turn a 1.5MB page into 34MB irreversibly; an upload over 4MB fails mid-run.

## Related

- [alt-text-pipeline.md](../../reference/alt-text-pipeline.md): the alt-text pipeline, which writes library alt freely and guards CMS writes
- [mcp-api-gap-asset-pipeline.md](../integration-issues/mcp-api-gap-asset-pipeline.md): REST upload pipeline and MCP limits
- [scrolltrigger-stale-positions-late-image-loads.md](../integration-issues/scrolltrigger-stale-positions-late-image-loads.md): why missing dimensions break ScrollTrigger positions
