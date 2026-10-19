# Webflow IDs Reference

Quick-lookup for site, page, collection, and field IDs to avoid redundant API/MCP calls. Several skills (`build-component`, `content-ingest`, `update-seo`, `upload-copy`) read these IDs implicitly; keep this file current as pages and the CMS schema evolve.

Last verified: 2026-10-19 via the Webflow Data API.

## Site

- **Name**: The Guild Hotel
- **Site ID**: `6ad6405eae8eac6d7b7c41a3`
- **Short name**: `the-guild-hotel-c34e71`
- **Staging URL**: `the-guild-hotel-c34e71.webflow.io`
- **Figma file**: `7KV5sqOiFIoei8gxhptDOU` (GUILD-WEB-NEW), see `figma/README.md`

## Pages

| Page | ID | Slug | Figma page |
|---|---|---|---|
| Home | `6ad64060ae8eac6d7b7c4241` | `/` | home |
| Style Guide | `6ad64060ae8eac6d7b7c4244` | `/style-guide` | - |
| Starter Components | `6ad64060ae8eac6d7b7c4245` | `/starter-components` | - |
| Password | `6ad64060ae8eac6d7b7c4242` | `/401` | - |
| 404 | `6ad64060ae8eac6d7b7c4243` | `/404` | - |
| History | `6ad66fd276d24ed37ac4c52f` | `/history` | history |
| Dining | `6ad66fd476d24ed37ac4c5cb` | `/dining` | dining-collection |
| Guidelines | `6ad66fd44c7f57894534ada5` | `/guidelines` | guidelines |
| Rooms | `6ad66fd5f8bf4846e809dbee` | `/rooms` | rooms-collection |
| Room Detail | `6ad66fd5f8bf4846e809dc45` | `/rooms-individual` | rooms-individual |
| Press | `6ad66fd5735773f253406642` | `/press` | press |
| Gallery | `6ad66fd65794075272b95584` | `/gallery` | gallery |
| Arts | `6ad66fd7ba96f2e53726a2eb` | `/arts` | arts |
| Wellness | `6ad66fd7735773f253406791` | `/wellness` | wellness-collection |
| Static Template | `6ad66fd802cc199b55b924be` | `/static-template` | static-template |
| Contact | `6ad66fd8e0b7968459e18f22` | `/contact` | contact |
| Meetings | `6ad66fd96684c3e22ea4d417` | `/meetings` | meetings-collection |
| Neighborhood | `6ad66fdb02cc199b55b926ba` | `/neighborhood` | neighborhood |

Static pages created by Q004 on 2026-10-19 (slugs approved by Stephen: the four `-collection` Figma pages use clean slugs). CMS template pages (dining-*, legal, corporate, happenings-*, blog-*) are created with their collections in Q027 to Q030; add their rows then.

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
