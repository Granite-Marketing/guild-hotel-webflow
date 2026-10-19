# Webflow IDs Reference

Quick-lookup for site, page, collection, and field IDs to avoid redundant API/MCP calls. Several skills (`build-component`, `content-ingest`, `update-seo`, `upload-copy`) read these IDs implicitly; keep this file current as pages and the CMS schema evolve.

Last verified: 2026-10-19 via the Webflow Data API (read-only).

## Site

- **Name**: The Guild Hotel
- **Site ID**: `6ad6405eae8eac6d7b7c41a3`
- **Short name**: `the-guild-hotel-c34e71`
- **Staging URL**: `the-guild-hotel-c34e71.webflow.io`
- **Figma file**: `7KV5sqOiFIoei8gxhptDOU` (GUILD-WEB-NEW), see `figma/README.md`

## Pages

| Page | ID | Slug |
|---|---|---|
| Home | `6ad64060ae8eac6d7b7c4241` | `/` |
| Style Guide | `6ad64060ae8eac6d7b7c4244` | `/style-guide` |
| Starter Components | `6ad64060ae8eac6d7b7c4245` | `/starter-components` |
| Password | `6ad64060ae8eac6d7b7c4242` | `/401` |
| 404 | `6ad64060ae8eac6d7b7c4243` | `/404` |

Pages for the remaining Figma designs do not exist yet; add rows as build sessions create them.

## Components

| Component | ID | Notes |
|---|---|---|
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | Relume starter global styles embed |

## CMS Collections

None yet. Proposed schemas live in `docs/figma/cms-proposal.md`; collections are created only after approval.

## Conventions

- **IDs are 24-char hex** for collections, pages, and items; 32-char hex for option-field option IDs.
- **Slug fields are kebab-case**, generated from the item name unless overridden.
- **Reference fields** store the target item's ID; multi-reference fields store an array of IDs.
- Update this file whenever you add a new collection, page, or field that another skill depends on.

## Asset library (Q003)

46 image fills from `figma/assets.json` uploaded to site `6ad6405eae8eac6d7b7c41a3`. Per-image `webflowAssetId` and `webflowUrl` live in `figma/assets.json` (and `assets/asset-manifest.json`). Run `pnpm run upload-assets -- --used-only` to limit uploads to the design's fills; without the flag the script uploads every manifest entry. Alt text is not yet generated.
