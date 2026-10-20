# Webflow IDs Reference

Quick-lookup for site, page, collection, and field IDs to avoid redundant API/MCP calls. Several skills (`build-component`, `content-ingest`, `update-seo`, `upload-copy`) read these IDs implicitly; keep this file current as pages and the CMS schema evolve.

Last verified: 2026-10-20 via the Webflow Data API (K02 build pages and assets).

## Site

- **Name**: The Guild Hotel
- **Site ID**: `6ad6405eae8eac6d7b7c41a3`
- **Short name**: `the-guild-hotel-c34e71`
- **Staging URL**: `the-guild-hotel-c34e71.webflow.io`
- **Figma file**: `7KV5sqOiFIoei8gxhptDOU` (GUILD-WEB-NEW), see `figma/README.md`

## Site custom code (R00)

- **Bundle release**: v1.1.1, commit `1e3e1429a832235a38903d7df288fa881d22a8fa`; content of the head and footer blocks in `site-scripts.md`.
- **Registered scripts**: none (site uses raw freeform head and footer blocks, not registered scripts).

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
| Rooms | `6ad66fd5f8bf4846e809dbee` | `/rooms` | rooms-collection; assembled by Q033 (2026-10-20), Body `6ad66fd5f8bf4846e809dbf6` |
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

## Build Pages (K02)

Draft pages, one per wave 2 parallel build, created by K02 on 2026-10-20. Not in the nav. Each build session works only on its own page. Pages cannot be deleted through the API (X01); remove them in the Designer once their components move to real pages.

| Entry | Title | Page ID | Slug |
|---|---|---|---|
| Q012 | 🧱 cta-booking-newsletter | `6ad712be4a1db356ac74034b` | `/build-cta-booking-newsletter` |
| Q013 | 🧱 footer-links | `6ad712c0de3165cd9f83bb50` | `/build-footer-links` |
| Q014 | 🧱 hero-fullbleed-centered | `6ad712c2faaaa1926dd00419` | `/build-hero-fullbleed-centered` |
| Q015 | 🧱 faq-accordion | `6ad712c2faaaa1926dd004e3` | `/build-faq-accordion` |
| Q016 | 🧱 script-intro-centered | `6ad712c471aebc47c94f1c20` | `/build-script-intro-centered` |
| Q017 | 🧱 split-image-text-light | `6ad712c53e506fddaa973858` | `/build-split-image-text-light` |
| Q018 | 🧱 gallery-mosaic-captioned | `6ad712c63e506fddaa973910` | `/build-gallery-mosaic-captioned` |
| Q019 | 🧱 map-feature | `6ad712c79096987033862a20` | `/build-map-feature` |
| Q020 | 🧱 image-trio-text | `6ad712c8f7fb71b6e78048f9` | `/build-image-trio-text` |
| Q021 | 🧱 venue-card-fullbleed | `6ad712c8f7fb71b6e780492e` | `/build-venue-card-fullbleed` |
| Q022 | 🧱 form-split-script-contact | `6ad712c99096987033862bfc` | `/build-form-split-script-contact` |
| Q023 | 🧱 tab-pills-intro | `6ad712caa15308564d06f1a8` | `/build-tab-pills-intro` |
| Q024 | 🧱 image-inset-single | `6ad712cc8669ab49cd2c7290` | `/build-image-inset-single` |
| Q025 | 🧱 article-card-staggered | `6ad712cd74b1a594d93c88aa` | `/build-article-card-staggered` |
| Q026 | 🧱 timeline-scatter-images | `6ad712cefaaaa1926dd00d80` | `/build-timeline-scatter-images` |
| Q005 | 🧱 site-nav | `6ad769cad74aa30b7c564578` | `/build-site-nav` (created by the Q005 session; published to staging, not draft) |
| Q008 | 🧱 offers-slider-split | `6ad77f7b41c3b044b01140a4` | `/build-offers-slider-split` (created by the Q008 session; un-drafted for staging) |

## Shared Assets (K02)

| Asset | ID | Used by |
|---|---|---|
| button-outline-dark.svg | `6ad712867471777f5f7e40b1` | `button.is-chamfer.is-outline` |
| button-outline-light.svg | `6ad7128647118d6eef7696f1` | `button.is-chamfer.is-outline-light` |
| tribute-portfolio-logo.svg | `6ad744312406f6ae5126bc5f` | `footer-links_logo-image` (Q013, figma node 250:2123) |
| bonvoy.svg | `6ad744318e4b52f5c4d49ec6` | `cta-booking-newsletter_logo` (Q012) |
| guild-building-drawing.svg | `6ad74da48e7763c5db93ef04` | `script-intro-centered_image`, home/02 (Q016, figma node 433:4759) |
| guild-postmark-stamp.svg | `6ad74da46b56ff1d7223e4d7` | `script-intro-centered_image`, rooms-collection/02 (Q016, figma node 379:1187) |
| arrow-back.svg | `6ad74da5f1658ec1f273e890` | `script-intro-centered_back-icon` (Q016, figma node 413:5536) |
| neighborhood-map.svg | `6ad74983c0f141bdb6fd4115` | Map Feature base image (Q019, figma node 433:6592) |
| zuma-wordmark.svg | `6ad74d2ed0e5a6a8fc1be09e` | Venue card logo (Q021, figma node 250:1958); also the Q014 dining-zuma hero logo |
| lobby-bar-wordmark.svg | `6ad74d2f5fbf02cd56e2df7e` | Venue card logo (Q021, figma node 433:5771) |
| pool-lounge-wordmark.svg | `6ad74d3052f189f238b78a70` | Venue card logo (Q021, figma node 433:5793) |

## Components

| Component | ID | Notes |
|---|---|---|
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | Relume starter global styles embed |
| Footer Links | `14efd120-8e4c-efe3-75b9-396e4792ed73` | Q013 site footer, no props; built on `🧱 footer-links` (2026-10-20) |
| CTA Booking Newsletter | `916e4ffc-007b-3572-a686-946c6645b2e8` | Q012, no props; instance on `🧱 cta-booking-newsletter` |
| faq-accordion | `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7` | Q015, built on `/build-faq-accordion` (2026-10-20), no props |
| Hero Fullbleed Centered | `f91dcf8c-5c66-6cf4-32b6-a2f2427f7bfa` | Q014 shared page hero, built on `/build-hero-fullbleed-centered`; 15 props (9 content, 6 Show booleans), plus the auto-created Variant prop `69451566-4154-e6c8-a0db-695c14d9c0af`; variants (V01) Text Dark `c5755984-9207-f25b-c049-f99910c92943`, Left `75108921-8bef-ba10-2260-5af2990c9e7d`; (V02) Blue Button `e8c11cfd-fe49-cdf5-9556-32d89df58988`, Burgundy Button `81c5f9ea-386b-7949-fba8-9ed7d1d78407` |
| script-intro-centered | `bdff66b3-92d9-e1e3-dbc0-86a28e384c9b` | Q016, group Sections, built on `/build-script-intro-centered` (2026-10-20); 9 props (6 content, 3 Show booleans), plus the auto-created Variant prop `a756475a-6061-cff6-3f67-57b297c53d34`; variants (V02) Tall `ac455635-ebdb-afce-1b26-c3754520f0b3`, Wide `16b2e029-4d87-68f1-ffc1-4a8294038434`, Bottom `211f09b3-312a-f072-e7c4-4e0894618a51` |
| Gallery Mosaic Captioned | `560e1b31-d612-0921-8773-8f9de2e2b06f` | Q018 four-tile gallery, built on `/build-gallery-mosaic-captioned` (2026-10-20); 12 props (6 text, 4 image, 2 Show booleans) |
| Map Feature | `8e90ff20-1ed1-43a7-edce-89b7ea10c487` | Q019, built on `/build-map-feature` (2026-10-20); 22 props (Content, Button, Visibility, Places, Image groups); `is-image-bg` and `is-centered` are the separate components below (V02); no Variant prop |
| Map Feature Image Bg | `5d830b69-6507-7d04-4828-069b2539cffb` | V02 separate component for `is-image-bg` (meetings, neighborhood, legal, corporate), duplicated from Map Feature; same 22 props; is-image-bg combos on section, content, header, aside, figure and image; h4 heading. Build page instance `d9b87af6-78b5-9dd0-a286-370ebce38039` |
| Map Feature Centered | `d6e2f6bc-b2b0-8951-1f0a-59832380519b` | V02 separate component for `is-centered` (history/08), duplicated from Map Feature; same 22 props; is-centered combos on content, header, aside, figure and image; h2 heading. Build page instance `0f348b0e-cc20-7b7b-6826-e2535397a490` |
| Split image text light | `663131a8-3362-867e-25ef-28b6d3d209a2` | Q017, built on `/build-split-image-text-light` (2026-10-20); 17 props (7 content, 2 image, 8 visibility booleans), plus the auto-created Variant prop `aa420cb8-91f6-452f-84c8-06d3561e68b6`; variants (V02) Olive `654bb362-ab8e-2b17-8c1c-352117770874`, Blue `f30ba1e7-28c4-ef9f-30bc-31294c23f46d`, Tan `9cd3f054-0bc5-3e71-98b6-562cb8361ab0`, Compact `a6df7398-8cb4-0616-9847-2ba4833207db`, Edge `473c3237-6d5f-b4e2-46df-945ff89461a7`, Stagger Left `5fb6b74c-56cc-c3c2-eef8-32b240b619e7`, Stagger Mid `8dcc8de6-914e-f2a6-a0b5-5f95af173bdf`, Wide `45de7441-0ac3-59ed-e7fb-5c6524848b2d`; the old reference sections stay on the build page until deleted |
| Image Trio Text | `eae1d08c-c012-be1b-bafe-4ca88d995c14` | Q020, built on `/build-image-trio-text` (2026-10-20); 16 props (Header, CTA, Images, Items groups); base layout only, no variants (V02: the card layouts are the two components below) |
| Image Trio Text Left | `46897c76-730a-1978-c362-54be3e026510` | V02 separate component for `is-left` (legal/03, corporate/03), duplicated from Image Trio Text; same 16 props (defaults: cards shown, paragraph and CTA hidden); `is-left` combos on section, header, list and figures; heading-style-h4; no image stack collapse attributes; instance `8d67aba1-ae7a-8fbb-3aef-cff2a91d79d4` on the build page |
| Image Trio Text Left Offset | `f6f42b26-759f-d2b6-03de-516393880a37` | V02 separate component for `is-left` + `is-offset` (legal/11, corporate/11), duplicated from Image Trio Text Left; same 16 props and defaults; `is-offset` on items 1 and 3; heading-style-h3; instance `933ea046-66a9-f832-470a-173bbc09d721` on the build page |
| form-split-script-contact | `2f0cac24-8156-b0d7-520c-f5128139d6b0` | Q022, built on `/build-form-split-script-contact` (2026-10-20); 7 props (Heading, Paragraph, 5 Show booleans); default content is the guidelines/06 photoshoot form; `is-tall` is a reference section on the build page |
| Venue Card Fullbleed | `bbccdbb5-db17-02a1-a0cc-43ce0f5da371` | Q021 static base card, built on `/build-venue-card-fullbleed` (2026-10-20); 15 props (5 content and button, 4 image, 6 Show booleans), plus the auto-created Variant prop `610e37db-a68b-e1aa-27de-a2d2456aa054`; variant (V02) Media Center `024eaaa9-a9b9-c251-8d00-f211d30965d2`; the multi-panel snap groups stay plain sections on the build page |
| Venue Card Fullbleed Tall | `f8269db7-7b82-27f1-dd64-8dd069d633f6` | V02 separate component for `is-tall` (home/11), duplicated from Venue Card Fullbleed; same 15 props; h1 heading, regular text, outline CTA |
| Venue Card Fullbleed Left | `100e1eab-d304-3568-6d93-6fa936f8c0af` | V02 separate component for `is-left` (home/15), duplicated from Venue Card Fullbleed; same 15 props; h2 heading, medium text, outline CTA, static three-row venue list (no list props yet) |
| Article Card Staggered | `155bf09c-0bd4-9e9a-db53-4a8060b48cf1` | Q025 single base card, group Shared, built on `/build-article-card-staggered` (2026-10-20); 13 props (6 content, 1 image, 6 Show booleans); `is-right`, `is-right` with the culture header and `is-tall` are plain reference sections on the build page |
| image-inset-single | `3eeb97fa-6550-7845-31ee-e997e4b8f2f1` | Q024, group Sections, built on `/build-image-inset-single` (2026-10-20); 2 props (image, image alt); `is-small` is a plain reference section on the build page |
| tab-pills-intro | `30192280-e01e-6f0a-638c-42d4686bee29` | Q023, group Sections, built on `/build-tab-pills-intro` (2026-10-20); 12 props (Content, Tabs, Visibility groups); default content is press/02; `is-media` wellness and meetings are plain reference sections on the build page |
| timeline-scatter-images | `144b7315-3604-2419-b046-c09d180f1163` | Q026, group Sections, built on `/build-timeline-scatter-images` (2026-10-20); 6 props (Heading, Show Heading, Caption 1 to 4); no slot, items fixed; `is-tall` is a reference section on the build page |
| Site Nav | `fc94d1a2-3399-4de0-e836-0233a6c86cdf` | Q005 shared navbar and full-screen menu, group Global, built on `/build-site-nav` (2026-10-20). Props: Book link `f6c9cf45-4dfc-02ea-be81-50f6e2ecee62` (url, default `#book`), Variant `454e7f56-bf51-5074-566c-b5cbae95cdd5` (base = light text; Dark `08083309-2be0-2228-878a-7f1c05773f43`) |
| Offers Slider Split | `96c19058-a54d-49c3-9568-d7aee87662b0` | Q008 slider, group Sliders, built on `/build-offers-slider-split` (2026-10-20). Variant prop `d176b097-92cb-1f48-49bb-d3e451881938`: Base, Blue `1993beed-24b7-3024-c815-349d23e9e282`, Tan `33c1374c-e0f0-7e2f-88ab-e318ee666728`. 32 content props (ids in `docs/figma/build-plans/Q008/plan.json`). Runtime `src/utils/offersSliderSplit.ts` |

## Variable Collections

| Collection | ID |
|---|---|
| Primitives | `collection-0220e3ad-eb86-03ea-3026-8a5979301dd2` |
| Color Schemes | `collection-139f4ef2-8521-8181-4a7f-fc90894e2d6f` |
| Typography | `collection-3c6a4911-12c4-e415-7fe0-514cefa2d46d` |
| UI Styles | `collection-08964abb-b13c-a798-071a-663d82b7f0a6` |

Each has one mode, `base`. Variable IDs, values and the convention-name map live in `docs/reference/style-inventory.md` (Q001, 2026-10-20).

## Custom Fonts

| Family | Weight | Font ID |
|---|---|---|
| Sackers Gothic | 900 | `6ad67b3ff294f472f82ca72c` |
| Gatchtest | 400 | `6ad67b1b1c2db33882637dce` |
| Gatchtest | 500 | `6ad67b211c2db33882637e72` |
| Morello Pen | 400 | `6ad67b4109d470f005e31d2b` |

## CMS Collections

Created by C01 (2026-10-19); IDs are in the C01 section below. Proposed schemas: `docs/figma/cms-proposal.md`; field map: `docs/figma/build-plans/cms-fields.md`.

## Conventions

- **IDs are 24-char hex** for collections, pages, and items; 32-char hex for option-field option IDs.
- **Slug fields are kebab-case**, generated from the item name unless overridden.
- **Reference fields** store the target item's ID; multi-reference fields store an array of IDs.
- Update this file whenever you add a new collection, page, or field that another skill depends on.

## Asset library (Q003)

46 image fills from `figma/assets.json` uploaded to site `6ad6405eae8eac6d7b7c41a3`. Per-image `webflowAssetId` and `webflowUrl` live in `figma/assets.json` (and `assets/asset-manifest.json`). Run `pnpm run upload-assets -- --used-only` to limit uploads to the design's fills; without the flag the script uploads every manifest entry. Alt text is not yet generated.

## CMS collections (C01, created 2026-10-19, items are drafts)

Renamed by Stephen on 2026-10-20 (labels and slugs as shown). Model: decisions.md, CMS model.

| Collection | ID | Items (id) |
|---|---|---|
| `🍴 Dinings` (slug `dining`) | `6ad67d7316e13e66c2b760d7` | dining-zuma `6ad67dd4bf36da0c182e52b3`, dining-gardenterrace `6ad67dd4bf36da0c182e52b5`, dining-lobbybar `6ad67dd4bf36da0c182e52b7`, dining-poollounge `6ad67dd4bf36da0c182e52b9` |
| `🧑‍⚖️ Legal Corporates` (slug `legal-corporate`) | `6ad67d74943352af06e37843` | legal `6ad67dd58726a8a44534c1e6`, corporate `6ad67dd58726a8a44534c1e8` |
| `🏷️ Post Categories` (slug `post-categories`) | `6ad67d74485ab8562b6e34da` | happenings-collection `6ad67dd6f57084c9b83ef704`, blog-collection `6ad67dd6f57084c9b83ef706` |
| `📰 Happenings & Stories` (slug `happenings-stories`) | `6ad67d759914af41be21de7e` | 6 draft sample posts (C02, below); the two placeholder items were deleted on 2026-10-20 |

`cms-dining` fields (slug: id): `hero-heading` a12380119d472b70dd45f91789af3ebf, `hero-intro` f932bc9eac4e78e6dabf2a4960ea3e8e, `intro-image` 013209ec315eebd7a70571d12141516f, `other-dining-heading` ae37b5ef4767d6e216b8d5aed2ff2762, `other-dining-intro` 1db3846d47828d3e66a284c56ba04b21, `other-dining-label-1` 653ca61f0714efbc54188ac10d91001a, `other-dining-label-2` 11ef34b688eb9808b6a0b321df2afd4d, `other-dining-label-3` 55c8a14d41e2850754675b9804c6e4bb.

`cms-happenings-blog-collection` field: `hero-heading` 0af5cdb8abb9c97b54f59decff37e1d3.

`cms-legal-corporate` has only the default name and slug fields.

`📰 Happenings & Stories` fields (C02, 2026-10-20), slug: id. Group "Post details": `category` (Reference to Post Categories, required) 3d27986165618c5d45dcff873530a2ae, `topic` (Option) b31d639e86a84543aeb8dcb1aa2fcba6 (options dining 26fc859228e1e68b33305764f8c42913, culture aa76d85c5d771487b69e806d8df9afa0, conferences 961f923ef32ab852ff148c6655235f43), `date` ad0c2566ded18b287e0d7f5313169e44. Group "Hero and card": `hero-image` e36ae823db95ead0fa58ec6c1b246390, `excerpt` c25832d101a86377abced703154a077c. Group "Content": `body` (RichText) 719d754b805d05fc5e1d5a811a9602da, `body-highlight` 7dc35af6b101817c0c72c4feabfd46a5. Default `name` c2faac5623dab0a0e70d8057511c0dc4, `slug` af3e51c35655f4da9c0aa3a81db2295d.

Sample post items (all draft, Hero image empty): Happenings: locals-night-at-rodeo-bar `6ad719f209c2e7c9626853e1`, autumn-at-spa-adolphus `6ad719f209c2e7c9626853e3`, historical-tours `6ad719f209c2e7c9626853e5`. Blog: best-san-diego-hotels-for-every-traveler `6ad719f209c2e7c9626853e7`, whats-on-in-san-diego-this-autumn `6ad719f209c2e7c9626853e9`, guide-to-dining-at-the-guild `6ad719f209c2e7c9626853eb`.
