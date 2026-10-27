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

- **Bundle release**: v1.1.2, commit `a511cb050a63ebbb909cfc23decca9fae11ed53e` (live on staging footer); content of the head and footer blocks in `site-scripts.md`.
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
| Dining | `6ad66fd476d24ed37ac4c5cb` | `/dining` | dining-collection; assembled by Q032 (2026-10-20), Body `6ad66fd476d24ed37ac4c5d1` |
| Guidelines | `6ad66fd44c7f57894534ada5` | `/guidelines` | guidelines; assembled by Q037 (2026-10-20), Body `6ad66fd44c7f57894534adac`; element ids in `docs/figma/build-plans/Q037/plan.md` |
| Rooms | `6ad66fd5f8bf4846e809dbee` | `/rooms` | rooms-collection; assembled by Q033 (2026-10-20), Body `6ad66fd5f8bf4846e809dbf6` |
| Room Detail | `6ad66fd5f8bf4846e809dc45` | `/rooms-individual` | rooms-individual; assembled by Q038 (2026-10-20), Body `6ad66fd5f8bf4846e809dc4b`; element ids in `docs/figma/build-plans/Q038/build.md` |
| Press | `6ad66fd5735773f253406642` | `/press` | press; assembled by Q039 (2026-10-20), Body `6ad66fd5735773f253406673`; element ids in `docs/figma/build-plans/Q039/build.md` |
| Gallery | `6ad66fd65794075272b95584` | `/gallery` | gallery |
| Arts | `6ad66fd7ba96f2e53726a2eb` | `/arts` | arts; assembled by Q041 (2026-10-20), Body `6ad66fd7ba96f2e53726a2f3`; element ids in `docs/figma/build-plans/Q041/build.md` |
| Wellness | `6ad66fd7735773f253406791` | `/wellness` | wellness-collection; assembled by Q034 (2026-10-20), Body `6ad66fd7735773f253406797` |
| Privacy Policy | `6ad66fd802cc199b55b924be` | `/privacy-policy` | static-template; renamed from Static Template (2026-10-21); doubles as the legal page template (duplicate it for new legal pages). Footer Links and the Contact consent link point here as page links |
| Accessibility | `6ad85678cff550a80a3287b0` | `/accessibility` | duplicated from Privacy Policy (2026-10-21), same elements and `static-template-privacy-policy_*` classes, placeholder accessibility statement; linked from Footer Links |
| Contact | `6ad66fd8e0b7968459e18f22` | `/contact` | contact; assembled by Q043 (2026-10-20), Body `6ad66fd8e0b7968459e18f28`; instance and section ids in `docs/figma/build-plans/Q043/build.md` |
| Meetings | `6ad66fd96684c3e22ea4d417` | `/meetings` | meetings-collection |
| Neighborhood | `6ad66fdb02cc199b55b926ba` | `/neighborhood` | neighborhood; assembled by Q044 (2026-10-20), Body `6ad66fdb02cc199b55b926c5` |
| Happenings | `6adf8565c9208d434c321a85` | `/happenings` | F30 (2026-10-26), duplicate of /press; instance ids in the feedback batch 2 section below |
| Blog | `6adf856512eff9c0216feca8` | `/blog` | F30 (2026-10-26), duplicate of /press; instance ids in the feedback batch 2 section below |

Static pages created by Q004 on 2026-10-19 (slugs approved by Stephen: the four `-collection` Figma pages use clean slugs). CMS template pages (dining-*, legal, corporate, happenings-*, blog-*) are created with their collections in Q027 to Q030; add their rows then.

### CMS template pages

| Template | Page ID | Path | Collection | Notes |
|---|---|---|---|---|
| `🍴 Dinings Template` | `6ad67d7416e13e66c2b76107` | `/dining/<slug>` | `6ad67d7316e13e66c2b760d7` | Assembled by Q027 (2026-10-20), Body `6ad67d7416e13e66c2b7610f`. Instances: Site Nav `f8cbdfba-9844-bc56-4c18-4675d35c9641`, Hero `726f3724-5fec-e4c7-caa6-8f1195d5abdd`, Split Olive `e0471a1c-0f53-a890-8460-fbddb329850e` (switched to Blue by W02), Split Stagger Left `b43a49ce-0bbb-f743-2fa7-b3250bb8db7c`, Image Trio Text `58d5c5a8-7e22-04a2-886d-09b8d27c59b1`, Gallery `42e6505b-83c4-c38b-82a8-e3aeecc0e1db`, faq-accordion `d1d32ffd-235e-839e-a309-b4fd1b93056b`, CTA `ce35b1a4-354e-eb34-3eea-404aa24ce152`, Footer `ee2f5942-bd9e-9131-52f5-c656c6e42e49`. Native sections: text-columns-info `7b75f1cc-caa9-0b17-844e-273e78e72f7c`, image-pair-text `d72e46c9-866b-1c48-800a-72b64c23e60a`, quote-band-dark `273f2b41-4042-4829-651a-50c1e5beeb62`, card-stagger-header-left `86d57348-f224-7d1f-8ca3-1011769f1eb2` |
| `🧑‍⚖️ Legal Corporates Template` | `6ad67d74943352af06e37850` | `/legal-corporate/<slug>` | `6ad67d74943352af06e37843` | Assembled by Q028 (2026-10-20), Body `6ad67d74943352af06e37858`. Instances: Site Nav `40cfd406-5bb7-375f-f975-a684fc48e66a`, Hero `c5436033-bd61-c713-d904-bd85dc1a3045`, script-intro-centered `94f86a25-6f47-5f22-887a-b4562c503401`, Image Trio Text Left `8d6ed2de-4492-327f-2236-20b3f19afb0e`, Map Feature Image Bg `bf57849a-2fe5-81bb-2554-37d96487c842`, Image Trio Text Left Offset `ac90d2ee-dd2a-f59c-f73a-b7813177d476`, form-split-script-contact `47eef706-d84f-ed20-87ae-22873f1031f2`, Gallery `446835c1-2325-c5f3-20e2-655d5e6507b6`, Offers Slider Split `d5f7d297-3a14-997e-3684-5631f118a3bc`, faq-accordion `b0f362a8-a69e-d19d-4109-27901f2ddfc5`, CTA `713caf69-e087-f5d5-a21e-c49e0fa8aabc`, Footer `6c0be525-c98a-e3c1-8fe7-f78cbd941d30`, Overlay Detail Panel Modal `b43049e8-0c40-e661-713b-202cb32280e2` (dialog `council-boardroom`), F12 (2026-10-21) venue dialogs `c6a62144-62c9-b40b-7bea-094887666d35` (`small-conference-center`), `d8b5b5ea-a719-ce1e-cf9d-5580c93551c6` (`large-conference-center`), `5501597b-b6a7-d0fa-f577-3f980789e23e` (`one-columbia-place`); venue discover-more triggers `03a9c003-ef1d-111b-b863-187c7ca0f048`, `4db0cf96-9a75-6be4-20d4-5f1c8a2d10d8`, `68adb802-b5a8-a288-9aeb-cf5b2a49d7d1`, `5d8042f9-6eb8-d95e-2442-b8fc4d853134`. Native sections: feature-grid-dark-eyebrow `4ccb354e-f642-e2eb-fc3d-76ecf16030e3`, split-sticky-text-stacked-images `b1a9faf3-7c2b-78a2-ee30-22139ab3e070`, venue snap `ebdda439-82b6-ec6c-1418-288aa40890fe` |
| `🏷️ Post Categories Template` | `6ad67d75485ab8562b6e34e0` | `/post-categories/<slug>` | `6ad67d74485ab8562b6e34da` | Assembled by Q029 (2026-10-20), Body `6ad67d75485ab8562b6e34e8`. Instances: Site Nav `20a97c5a-282b-1de8-3701-ec248c4b6802`, Hero `3fb5d2a2-11cd-7297-5e4a-498ef2758467` (Heading bound to `hero-heading`), tab-pills-intro `36b29199-9a85-71bc-9627-6238de533732`, Offers Slider Split `53b3735f-900a-a621-33ab-a8b8113066b8`, faq-accordion `9bd9b08b-7eb5-78bf-38bd-028945704c3b`, CTA `9e3aef17-0539-1972-e07f-6b89547d143f`, Footer `d85c8df9-e117-ce71-678b-8fced343463e`. Native posts list: section `d2131c51-1225-832d-a1f1-106941c7dfd1`, Collection List `a5c0e5b3-38b1-7fef-1453-daeccc3d156e` (source Happenings & Stories, sort date descending), item `a5c0e5b3-38b1-7fef-1453-daeccc3d1570`, card link `a4d6f938-3965-0d25-f0f8-3d055912b2df` |
| `📰 Happenings & Stories Template` | `6ad67d759914af41be21de84` | `/happenings-stories/<slug>` | `6ad67d759914af41be21de7e` | Assembled by Q030 (2026-10-20), Body `6ad67d759914af41be21de8c`. Instances: Site Nav `4528b5e2-f5b8-e5cd-862f-fb5babefae5f`, Hero `ee8a5d6a-b096-60c0-e1f5-595b2e9ceac6` (Image, Heading, Text, Eyebrow bound to hero-image, name, excerpt, topic), image-inset-single Small `2eb0d65b-660c-4518-f3e3-8e277eb9a935`, Split Compact `a7f159bf-8bc8-af43-afc3-0fe6a8e376b2` (Body bound to body-highlight), Card Carousel `b394ebe0-8830-b6e2-71eb-e3bf8adf2cc1`, Offers Slider Split `b85a38f3-5cc2-7f8d-b093-b8f949adafb0`, CTA `5c39a569-7d00-5c79-3ce3-48694f8c4b58`, Footer `22166244-c785-d9a6-ec32-c0977b16c4f5`. Native: article body section `f667acd5-3df1-985c-b6ac-b209685e1ce5` (date eyebrow `d0f68cf6-2cbc-b3dc-2ba8-1328ce3e2a29`, body RichText `4b816f3a-c88d-4ef9-31bf-2c33aa413a3f`); more posts section `ec6687ae-bc5b-97ef-1856-fee0e452ec5a`, Collection List `4048e357-02ea-e0d3-0a14-0d95030910f9`, item `4048e357-02ea-e0d3-0a14-0d95030910fb`, card link `bcf99744-d3ed-d1a5-4a9f-c5cf373c5aff`. Element map: `docs/figma/build-plans/Q030/build.md` |

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
| Q006 | 🧱 overlay-detail-panel-modal | `6ad7885b7f5d5d50523f997f` | `/build-overlay-detail-panel-modal` (created by the Q006 session; un-drafted for staging; Body `6ad7885b7f5d5d50523f9988`) |
| Q009 | 🧱 card-carousel-header-left | `6ad78814d14363c9008ddeff` | `/build-card-carousel-header-left` (created by the Q009 session, not draft; Body `6ad78814d14363c9008ddf05`) |
| Q007 | 🧱 room-list-hover-preview | `6ad7b5d7fc756e91b34c370c` | `/build-room-list-hover-preview` (created by the Q007 session; not draft, for staging; Body `6ad7b5d7fc756e91b34c3712`) |

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
| Footer Links | `14efd120-8e4c-efe3-75b9-396e4792ed73` | Q013 site footer, no props; built on `🧱 footer-links` (2026-10-20). Dining column gap (F35): the CMS list wrapper `6d849dd0-bd96-3cdd-c3ba-77644e482bf8` and the static "in-room dining" `ul.footer-links_list` are separate flex children of `footer-links_column` (row-gap 2rem, 1.25rem at max-width 767px), so the gap after the last CMS item is 32px (20px mobile) instead of the 12px list gap. Fix is combo class `is-after-cms` on the static ul only: margin-top -1.25rem, -0.5rem at max-width 767px. Ul element id not cached yet. |
| CTA Booking Newsletter | `916e4ffc-007b-3572-a686-946c6645b2e8` | Q012, no props; instance on `🧱 cta-booking-newsletter` |
| faq-accordion | `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7` | Q015, built on `/build-faq-accordion` (2026-10-20), no props |
| Hero Fullbleed Centered | `f91dcf8c-5c66-6cf4-32b6-a2f2427f7bfa` | Q014 shared page hero, built on `/build-hero-fullbleed-centered`; 15 props (9 content, 6 Show booleans), plus the auto-created Variant prop `69451566-4154-e6c8-a0db-695c14d9c0af`; variants (V01) Text Dark `c5755984-9207-f25b-c049-f99910c92943`, Left `75108921-8bef-ba10-2260-5af2990c9e7d`; (V02) Blue Button `e8c11cfd-fe49-cdf5-9556-32d89df58988`, Burgundy Button `81c5f9ea-386b-7949-fba8-9ed7d1d78407` |
| script-intro-centered | `bdff66b3-92d9-e1e3-dbc0-86a28e384c9b` | Q016, group Sections, built on `/build-script-intro-centered` (2026-10-20); 9 props (6 content, 3 Show booleans), plus the auto-created Variant prop `a756475a-6061-cff6-3f67-57b297c53d34`; variants (V02) Tall `ac455635-ebdb-afce-1b26-c3754520f0b3`, Wide `16b2e029-4d87-68f1-ffc1-4a8294038434`, Bottom `211f09b3-312a-f072-e7c4-4e0894618a51` |
| Gallery Mosaic Captioned | `560e1b31-d612-0921-8773-8f9de2e2b06f` | Q018 four-tile gallery, built on `/build-gallery-mosaic-captioned` (2026-10-20); 12 props (6 text, 4 image, 2 Show booleans) |
| Map Feature | `8e90ff20-1ed1-43a7-edce-89b7ea10c487` | Q019, built on `/build-map-feature` (2026-10-20); 22 props (Content, Button, Visibility, Places, Image groups); `is-image-bg` and `is-centered` are the separate components below (V02); no Variant prop |
| Map Feature Image Bg | `5d830b69-6507-7d04-4828-069b2539cffb` | V02 separate component for `is-image-bg` (meetings, neighborhood, legal, corporate), duplicated from Map Feature; same 22 props; is-image-bg combos on section, content, header, aside, figure and image; h4 heading. Build page instance `d9b87af6-78b5-9dd0-a286-370ebce38039`. F13 map contract (2026-10-21): figure `5d830b69-6507-7d04-4828-069b2539d01f` (`data-map`, `data-map-home`, `data-map-key`), items `...d007`, `...d00d`, `...d013`, `...d019` (`data-map-item`); Place Link defaults are directions URLs with coordinates |
| Map Feature Centered | `d6e2f6bc-b2b0-8951-1f0a-59832380519b` | V02 separate component for `is-centered` (history/08), duplicated from Map Feature; same 22 props; is-centered combos on content, header, aside, figure and image; h2 heading. Build page instance `0f348b0e-cc20-7b7b-6826-e2535397a490` |
| Split image text light | `663131a8-3362-867e-25ef-28b6d3d209a2` | Q017, built on `/build-split-image-text-light` (2026-10-20); 17 props (7 content, 2 image, 8 visibility booleans), plus the auto-created Variant prop `aa420cb8-91f6-452f-84c8-06d3561e68b6`; variants (V02) Olive `654bb362-ab8e-2b17-8c1c-352117770874`, Blue `f30ba1e7-28c4-ef9f-30bc-31294c23f46d`, Tan `9cd3f054-0bc5-3e71-98b6-562cb8361ab0`, Compact `a6df7398-8cb4-0616-9847-2ba4833207db`, Edge `473c3237-6d5f-b4e2-46df-945ff89461a7`, Stagger Left `5fb6b74c-56cc-c3c2-eef8-32b240b619e7`, Stagger Mid `8dcc8de6-914e-f2a6-a0b5-5f95af173bdf`, Wide `45de7441-0ac3-59ed-e7fb-5c6524848b2d`; the old reference sections stay on the build page until deleted |
| Image Trio Text | `eae1d08c-c012-be1b-bafe-4ca88d995c14` | Q020, built on `/build-image-trio-text` (2026-10-20); 16 props (Header, CTA, Images, Items groups); base layout only, no variants (V02: the card layouts are the two components below) |
| Image Trio Text Left | `46897c76-730a-1978-c362-54be3e026510` | V02 separate component for `is-left` (legal/03, corporate/03), duplicated from Image Trio Text; same 16 props (defaults: cards shown, paragraph and CTA hidden); `is-left` combos on section, header, list and figures; heading-style-h4; no image stack collapse attributes; instance `8d67aba1-ae7a-8fbb-3aef-cff2a91d79d4` on the build page |
| Image Trio Text Left Offset | `f6f42b26-759f-d2b6-03de-516393880a37` | V02 separate component for `is-left` + `is-offset` (legal/11, corporate/11), duplicated from Image Trio Text Left; same 16 props and defaults; `is-offset` on items 1 and 3; heading-style-h3; instance `933ea046-66a9-f832-470a-173bbc09d721` on the build page |
| form-split-script-contact | `2f0cac24-8156-b0d7-520c-f5128139d6b0` | Q022, built on `/build-form-split-script-contact` (2026-10-20); 7 props (Heading, Paragraph, 5 Show booleans); default content is the guidelines/06 photoshoot form; Variant prop `75def639-20c3-2cee-b8b1-a6ef470ca15c`; variant (V02) Tall `c284c9dc-42be-882d-5aca-03608bebfc95` (is-tall); build page instance `7f9cb9e6-00d1-cbae-8e6e-18b2be87916b` (Tall); the old is-tall reference section stays until deleted ; (Q043) variant Contact `cb87b4cf-bba7-94cc-e25e-670072dbadea` (caps heading, no tilt, form wrapper hidden, nav padding); Details props: Detail 1 Label `6b80f13f-54de-a84d-1868-3c15d4089407`, Detail 1 Value `64dae5d6-0db2-6243-c764-23db7aa41612`, Show Detail 2/3/4 `e04adbbb-4eb0-bfba-32f1-ad941f1f9eb9` / `90cf7380-5dd5-14da-2ab2-eee49d5c099b` / `30fe4f6e-5bbe-a5e0-2431-d2c785b94b88`, Detail 2 Label/Value `62b0c303-17d4-81c3-a914-e958b5e184cb` / `9fc3c652-b880-489a-6765-1d62a5f10897`, Detail 3 `d8fe5367-69d6-2197-284b-f2af7584f03d` / `0f9918b7-313c-c102-35ba-104b39e870d1`, Detail 4 `7efa54c1-edff-5e45-43a1-e48beb141f38` / `01c718c2-b810-b13d-aca9-4d61c810431e` |
| Venue Card Fullbleed | `bbccdbb5-db17-02a1-a0cc-43ce0f5da371` | Q021 static base card, built on `/build-venue-card-fullbleed` (2026-10-20); 15 props (5 content and button, 4 image, 6 Show booleans), plus the auto-created Variant prop `610e37db-a68b-e1aa-27de-a2d2456aa054`; variant (V02) Media Center `024eaaa9-a9b9-c251-8d00-f211d30965d2`; the multi-panel snap groups stay plain sections on the build page |
| Venue Card Fullbleed Tall | `f8269db7-7b82-27f1-dd64-8dd069d633f6` | V02 separate component for `is-tall` (home/11), duplicated from Venue Card Fullbleed; same 15 props; h1 heading, regular text, outline CTA |
| Venue Card Fullbleed Left | `100e1eab-d304-3568-6d93-6fa936f8c0af` | V02 separate component for `is-left` (home/15), duplicated from Venue Card Fullbleed; same 15 props; h2 heading, medium text, outline CTA, static three-row venue list (no list props yet). F06 (2026-10-21): media tabs. Item `…c0b4` has `data-media-tabs`; figures `…c0b5` (prop-bound boardroom), `559f6448-d2ff-8497-7763-aabde5918261` (courtyard, asset `6ad66fee735773f253407335`), `2e53a0c6-7eb9-f3dc-52d9-45aa16832941` (conference center stand-in, asset `6ad670147e3d6550932e0fac`) carry `data-media-tabs-media`; panels (class `venue-card-fullbleed_panel` `a41c021c-41c9-68e5-4fd6-d684ddaa01bb`) `80112891-99cf-d68f-d9ca-1bdd16daaf5f` (prop-bound header and CTA), `8f2d493e-5eb5-98f0-f33e-9cca384ed63e`, `1da783d0-0c08-3767-c092-04d1b145ffa0` (static copy) carry `data-media-tabs-panel`; list `63054506-…a388` `data-media-tabs-list`; rows `6ba9cb8d-…`, `0f3effe9-…`, `88857a0f-…` `data-media-tabs-tab` |
| Article Card Staggered | `155bf09c-0bd4-9e9a-db53-4a8060b48cf1` | Q025 single base card, group Shared, built on `/build-article-card-staggered` (2026-10-20); 13 props (6 content, 1 image, 6 Show booleans), plus the auto-created Variant prop `62353da2-b5b1-62cb-98d1-9cdfea8519aa`; variant (V02) Right `c725504c-7f06-39a0-276e-18f876c7c43f` (is-right); build page instances `a4ddd96d-c1a5-8a07-a324-8f4f442598d2` (Right) and `85fd20ac-fa12-6fe4-53e8-ad6c67e7cef4` (Right with the culture header); W02 p8 props Show Logo `be7c8f28-4b60-1b27-f827-9b294d0bb21c`, Logo `db9c3157-4710-720b-c63a-1ce5bcf6b919`, Section ID `b2aa84c0-47f4-c6f1-7044-5007c4bdc021` (root domId) |
| Article Card Staggered Tall | `658f6b02-60da-4e60-799a-540b8a036180` | V02 separate component for `is-tall` (neighborhood/09), duplicated from Article Card Staggered; is-tall combos on component, header, list, item, figure and text; 21 props (the 13 above plus Card 2 and Card 3 groups, not yet bound because cards 2 and 3 are not built); build page instance `7aa25459-b902-f0ca-d12a-a0f9f3ea68e1` |
| image-inset-single | `3eeb97fa-6550-7845-31ee-e997e4b8f2f1` | Q024, group Sections, built on `/build-image-inset-single` (2026-10-20); 2 props (image, image alt), plus the auto-created Variant prop `06d2aef1-4186-3b9f-f515-37143ac1d739`; variant (V02) Small `ed48680f-16db-4226-7dda-8e89d4535148` (is-small); build page instance `466dca97-60e6-0693-8a07-8f408d11bf66` (Small); the is-small reference section stays until deleted |
| tab-pills-intro | `30192280-e01e-6f0a-638c-42d4686bee29` | Q023, group Sections, built on `/build-tab-pills-intro` (2026-10-20); 12 props (Content, Tabs, Visibility groups); default content is press/02; plus the auto-created Variant prop `c5950a24-1677-5228-3720-ece49247f526`; variant (V02) Media `9bd0d616-a2cc-7ffb-c508-bf993eecf81b` (is-media); build page instances `f6c5908b-212a-12d4-c1b3-d94548ce797d` (Media, wellness) and `4718f2e5-5b79-b06a-5408-0516c6d84a9f` (Media, meetings); the old is-media reference sections stay until deleted |
| timeline-scatter-images | `144b7315-3604-2419-b046-c09d180f1163` | Q026, group Sections, built on `/build-timeline-scatter-images` (2026-10-20); 6 props (Heading, Show Heading, Caption 1 to 4); no slot, items fixed; `is-tall` is the separate component below (V02); no variants |
| timeline-scatter-images Tall | `33e949df-43c2-4806-b73e-d403ed483051` | V02 separate component for `is-tall` (neighborhood/07), duplicated from timeline-scatter-images; same 6 prop ids, defaults are the neighborhood/07 copy; is-tall on section, header, heading (h3), list and captions (eyebrow caps); items is-xlarge alternating is-inset and is-end; build page instance `44318675-d385-7bfe-151a-2014c7d5b255` |
| Site Nav | `fc94d1a2-3399-4de0-e836-0233a6c86cdf` | Q005 shared navbar and full-screen menu, group Global, built on `/build-site-nav` (2026-10-20). Props: Book link `f6c9cf45-4dfc-02ea-be81-50f6e2ecee62` (url, default `#book`), Variant `454e7f56-bf51-5074-566c-b5cbae95cdd5` (base = light text; Dark `08083309-2be0-2228-878a-7f1c05773f43`) |
| Offers Slider Split | `96c19058-a54d-49c3-9568-d7aee87662b0` | Q008 slider, group Sliders, built on `/build-offers-slider-split` (2026-10-20). Variant prop `d176b097-92cb-1f48-49bb-d3e451881938`: Base, Blue `1993beed-24b7-3024-c815-349d23e9e282`, Tan `33c1374c-e0f0-7e2f-88ab-e318ee666728`. 32 content props (ids in `docs/figma/build-plans/Q008/plan.json`). Runtime `src/utils/offersSliderSplit.ts` |
| Overlay Detail Panel Modal | `44cccc51-37cb-2526-e426-133987071983` | Q006 dialog on the modals.ts contract, group Modals, built on `/build-overlay-detail-panel-modal` (2026-10-20). Variant prop `58627a5c-9ee5-3e05-ba7c-32f2cfa464f4`: Base, Dark `569f778f-307a-cdc2-95c3-95b18a7c2c5c`, Image Bg `72048989-461a-61a0-ac02-cfc3ae7b6e5c`, Burgundy `0e56f707-a8b4-d396-c73a-900ce080b5db`, Centered `34ca996d-2f65-a59e-6eb0-09dd065e4534`. 54 props incl. Dialog id `e23b2bf6-a467-9c5a-00e4-8cca4596b704` (ids in `docs/figma/build-plans/Q006/plan.json`) |
| Room List Hover Preview | `a9d40053-f1b0-f862-ee0a-4f021e1933a9` | Q007 all-rooms dialog (DOM id `all-rooms`, static, no props), group Modals, built on `/build-room-list-hover-preview` (2026-10-20). Instances: build page, and `/rooms` `80f767d6-0090-5ef7-fde4-878985946d8c` (last child of the Body, where the Q007 placeholder was). Runtime: modals, galleryFilter, roomListHoverPreview |
| Card Carousel Header Left | `f5403de4-dabb-14c3-ecf8-c945d0a8e22e` | Q009 slider, group Sliders, built on `/build-card-carousel-header-left` (2026-10-20). Variant prop `18d9c152-511a-0623-e95e-f0df74c21512`: Base, Compact `c59c2441-38e4-6521-05ae-61ab04e20bf2`. 30 content props (ids in `docs/figma/build-plans/Q009/plan.json`). Runtime `src/utils/cardCarouselHeaderLeft.ts` |

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
| `🍴 Dinings` (slug `dining`) | `6ad67d7316e13e66c2b760d7` | dining-zuma `6ad67dd4bf36da0c182e52b3`, dining-gardenterrace `6ad67dd4bf36da0c182e52b5`, dining-lobbybar `6ad67dd4bf36da0c182e52b7`, dining-poollounge `6ad67dd4bf36da0c182e52b9`; W02 (2026-10-20) added Image field `hero-image` `c3e904183cdd02f7727bdf3cc1fd860a`, bound to the template Hero Image prop |
| `🧑‍⚖️ Legal Corporates` (slug `legal-corporate`) | `6ad67d74943352af06e37843` | legal `6ad67dd58726a8a44534c1e6`, corporate `6ad67dd58726a8a44534c1e8` |
| `🏷️ Post Categories` (slug `post-categories`) | `6ad67d74485ab8562b6e34da` | happenings-collection `6ad67dd6f57084c9b83ef704`, blog-collection `6ad67dd6f57084c9b83ef706` |
| `📰 Happenings & Stories` (slug `happenings-stories`) | `6ad67d759914af41be21de7e` | 6 sample posts (C02, below), live since 2026-10-20 (not drafts); the two placeholder items were deleted on 2026-10-20 |

`cms-dining` fields (slug: id): `hero-heading` a12380119d472b70dd45f91789af3ebf, `hero-intro` f932bc9eac4e78e6dabf2a4960ea3e8e, `intro-image` 013209ec315eebd7a70571d12141516f, `other-dining-heading` ae37b5ef4767d6e216b8d5aed2ff2762, `other-dining-intro` 1db3846d47828d3e66a284c56ba04b21, `other-dining-label-1` 653ca61f0714efbc54188ac10d91001a, `other-dining-label-2` 11ef34b688eb9808b6a0b321df2afd4d, `other-dining-label-3` 55c8a14d41e2850754675b9804c6e4bb. Added by Q027 (2026-10-20): `press-quote` (PlainText) abab1d030d2356f75a28f54324240606, `show-press-quote` (Switch) 7e25bc91cd6301841d6bd29d700c0164; set on dining-zuma only. All four items are now ready to publish (not drafts) so the staging publish renders them.

`🏷️ Post Categories` fields: `hero-heading` 0af5cdb8abb9c97b54f59decff37e1d3, `name` db29760651f9663bd8534536e8f556cb, `slug` 5db7cb81a370ac6e5bf5a3d08b1b7318. Both items set ready to publish (not drafts) by Q029 on 2026-10-20.

`🧑‍⚖️ Legal Corporates` fields (added by Q028, 2026-10-20), slug: id. `hero-heading` db07dee1dad8a585505d5401deafa965, `hero-text` 42736c35f04338d22674a4d32b304eba, `hero-image` (Image) 1b2841347d62727df418322ac155f151, `intro-heading` 0a0776cf9b0f67e6565821b8538eeb6f, `intro-text` 644db29b64005969232cc9bf1bf1dd0a, `focus-heading` 646a98eead2d19434a9ee6823fb4a515, `focus-text` d20219d92802d779b8d922414f684076. Both items are filled and ready to publish (not drafts).

`📰 Happenings & Stories` fields (C02, 2026-10-20), slug: id. Group "Post details": `category` (Reference to Post Categories, required) 3d27986165618c5d45dcff873530a2ae, `topic` (Option) b31d639e86a84543aeb8dcb1aa2fcba6 (options dining 26fc859228e1e68b33305764f8c42913, culture aa76d85c5d771487b69e806d8df9afa0, conferences 961f923ef32ab852ff148c6655235f43), `date` ad0c2566ded18b287e0d7f5313169e44. Group "Hero and card": `hero-image` e36ae823db95ead0fa58ec6c1b246390, `excerpt` c25832d101a86377abced703154a077c. Group "Content": `body` (RichText) 719d754b805d05fc5e1d5a811a9602da, `body-highlight` 7dc35af6b101817c0c72c4feabfd46a5. Default `name` c2faac5623dab0a0e70d8057511c0dc4, `slug` af3e51c35655f4da9c0aa3a81db2295d.

Sample post items (set ready to publish by Q029 on 2026-10-20 so the listing renders on staging; Hero image set to stand-in library photos on 2026-10-20): Happenings: locals-night-at-rodeo-bar `6ad719f209c2e7c9626853e1`, autumn-at-spa-adolphus `6ad719f209c2e7c9626853e3`, historical-tours `6ad719f209c2e7c9626853e5`. Blog: best-san-diego-hotels-for-every-traveler `6ad719f209c2e7c9626853e7`, whats-on-in-san-diego-this-autumn `6ad719f209c2e7c9626853e9`, guide-to-dining-at-the-guild `6ad719f209c2e7c9626853eb`.


## W02 additions (2026-10-20)

- Assets: `press-logo-national-geographic.svg` `6ad7e683ca3bcaf687bb5125`, `press-logo-forbes.svg` `6ad7e683558e3453e0caae39`, `press-logo-architectural-digest.svg` `6ad7e6862c1787a1a6c24f37` (Article Card Staggered Logo prop, /press); British Vogue logo `6ad7df8af5da742df2306bee` (Dinings `press-logo` field); cream history stamp `6ad7e14297b901c25753709d`.
- Styles: `u-logo` `e579b641-c549-6f15-54bb-ff4e033713ff`.
- Dinings fields added by W02 p4: `hero-logo`, `show-hero-logo`, `press-logo`, `menu-link`, `venue-site-link`, `gallery-heading`; Happenings & Stories: `inset-image`, `highlight-image` (field ids in `docs/figma/build-plans/W02/p4.md`).

## F08 History timeline offsets (2026-10-21)

Desktop-only % margin combos on History timeline elements (all reset to 0 at tablet). Shared `history-timeline_figure is-small` (`8573cc8e-1088-6b91-5385-17b1cdc19fef`) gained align-self start + margin-top 26.3%; `is-large` (`29ec84ac-58d4-667b-44f6-b8f32d1035e4`) gained align-self start. Both only used by the 1924-1970 and 2026 entries.

| Combo | Style id | Element |
|---|---|---|
| `history-timeline_figure is-wide is-founding-wide` | `a4cb916b-eb2c-c430-bccd-7ffb2b8525a3` | `283c3db0-146b-a9d0-27ae-9a09e01e9e8d` |
| `history-timeline_content is-founding` | `357dbac3-9328-9d22-b9e0-3c9211b84305` | `c1e006e4-03b6-2e84-067e-2548388445b2` |
| `history-timeline_figure is-founding-square` | `5b37ff38-54ca-bf02-c77d-98a372f8409a` | `071a8456-444b-28df-1ecb-4829dc58978f` |
| `history-timeline_figure is-portrait is-founding-portrait` | `64f979f2-b796-abfb-167d-b549aaa6c19f` | `2edd9ffd-1b69-7cad-2f34-91e59b4d40ea` |
| `history-timeline_text is-founding` | `377bbeb3-2c30-bd52-8c10-4c71a56fcea1` | `4c5eb565-13ae-ef5d-c8d5-3e537f5a992c` |
| `history-timeline_figure is-large is-ymca-large` | `0b977267-264d-bfcc-c42c-9fd64eb015fa` | `a3fa3b08-3b0e-50d6-1ab7-95f22808cebf` |
| `history-timeline_content is-stacked is-ymca` | `d73d9f68-ece0-8c23-c59c-c59db7e57742` | `502f510d-93fe-1239-f66d-903dc66dbfa2` |
| `history-timeline_figure is-ymca-square` | `2ec722a7-051f-091c-8b64-706a9d104a52` | `2cd76254-e014-cee4-6beb-8f5bb9f18ee8` |
| `history-timeline_content is-stacked is-opening` | `d04ed0f3-8a1f-bfc4-7404-a628d3f3ec0c` | `e05ee4de-139f-c107-2aab-10f3323fdd17` |
| `history-timeline_figure is-portrait is-opening-portrait` | `97f14f8d-c6ca-d5cf-cb71-bc216b5dea02` | `9ebe7c91-20ab-7cf7-089d-05fc1811264e` |
| `history-timeline_figure is-opening-square` | `5f137601-7309-f799-1e83-a649925a4064` | `f951ae05-cdbb-d258-66ef-6ae066862368` |
| `history-timeline_content is-future` | `cfb374d9-6c62-12ff-a41f-da0a6738355a` | `bc358f14-1d2c-9eb4-75a9-b845e0bacfdf` |

Square figures carry their own combo name (not the entry name) because `.history-timeline_figure.is-x` would also match a sized figure carrying `is-x`.

## Wave 5 additions (2026-10-21)

- Dinings Switch fields for "other dining options": show-card-zuma `2470fc778745f957fa40e421524891fc`, show-card-garden-terrace `698155bf592f75989a55defeed532740`, show-card-lobby-bar `b629361a238b962208d4d54b898ead47`, show-card-pool-lounge `612ebbc6912a4e82b4c442623af86346` (each item has its own switch off, the other three on). `other-dining-label-1..3` are no longer bound and can be deleted.
- Dinings Template other-dining cards (visibility bound to the switch of the same venue): Zuma `db84d79b-92a4-55e2-a790-6db82538575d`, Garden Terrace `e562a62c-993c-87bf-49d2-aa139028d9b7`, Lobby Bar `fb4ea3f4-81fa-a283-665e-37679a47c662`, Pool Lounge `b9387b55-e8d3-73b7-5813-54f185a43655`. Style `card-stagger-header-left_link` `e9791ae7-d9dd-4574-515e-297cffc17c65`; the stagger is now `card-stagger-header-left_card:nth-child(odd)`, so `is-offset` is unused.
- Gallery and Arts pill bars: combo `tab-pills-intro_tabs.is-scroll` `44113c9b-f8ce-e462-5cb9-22e291b694ad` (one swipeable line at small and tiny). Gallery tags nav `1387fa6c-e0ed-7c6a-c5c5-d0d3b650c5ea`, wrapper `5a4779c9-a0cb-a059-d322-4d1a1af43be8`; Arts tags nav `6dd7c4ec-52e2-1812-8f32-19a3645bc3ce`, wrapper `c9148ee2-276e-9ad7-0b99-b0450cb6335a`.
- Post Categories Template: card topic eyebrow Paragraph `fa3f700e-92d3-1884-a463-27801bd34373` (`text-style-eyebrow-caps`, text bound to the post `topic` field).
- Site Nav combo `site-nav_component.is-on-light` `f7f38838-968d-43ca-f631-7c48d26082d3` (dark text; applied only at runtime by `navContrast`, so Style Manager Clean up must keep it).
- Room List Hover Preview "back to the quiz" link `a9d40053-f1b0-f862-ee0a-4f021e1933d7`, URL `#rooms-quiz`.
- Legal Corporates Template hover photo (`hoverFollowImage`): zone `data-hover-image` on `feature-grid-dark-eyebrow_component` `2910d468-50a2-7498-238b-e9ba49e23d8c`, figure `1b9a7eb1-9d0e-a0ef-5262-bfdb290f8dc8` (`data-hover-image-media`, class `feature-grid-dark-eyebrow_hover-figure` `8572685d-310d-c2fb-769d-766c06bf37fa`), image `c1152b3b-4210-ce92-aa43-9f4fbcfc5d27` (asset `6ad66ff2de86688556051da2`).
- Hover photo per item (`data-hover-image-src` and `-alt` on each `data-hover-image-item`; element ids to be recorded once queried). Asset by eyebrow: location `6ad66fed15beaf9a7285e5c8`, outdoors `6ad66fee735773f253407335`, setting `6ad66ff96684c3e22ea4e1af`, dining `6ad6701b6684c3e22ea4f00f`, connectivity `6ad66ffe58367429abb48c84`, group stays `6ad67015134731ad1b928187`, privacy `6ad66fef6684c3e22ea4dc76`, rewards `6ad66feb58367429abb4835f`. DOM order: location, outdoors, setting, dining, connectivity, group stays, privacy, rewards.
- SEO (2026-10-21): 13 static pages have unique titles and descriptions; the four CMS templates use `{{wf {"path":"name","type":"PlainText"\} }} | The Guild Hotel` titles, descriptions from `hero-intro` (Dinings), `hero-text` (Legal Corporates), `excerpt` (Happenings & Stories), and name plus a fixed sentence (Post Categories). Details in the wave 5 notes.

## 📍 Map Places (2026-10-26)

Collection `6adf73e0711cfc5e16f51bb5` (slug `map-place`). Fields: `walk-time` cc589e25d5e071f1efb5a65e09c1759a, `coordinates` 46a398ff78a7d9c2bc795635df2fb516 (`lat, lng`), `order` e2c905ef609b7282c8e1318e89b98aeb. Shown by the Collection List in Map Feature Image Bg (`9f5fc2f4-169f-6e16-50c0-199b554b43cb`, item `...43cd` carries `data-map-item` and `data-map-coordinates`). The old static list and its 12 Place props were deleted. The list sort could not be set by MCP or in the Designer; display order is CMS created date (newest first), so item contents were assigned in reverse.

## Feedback batch 2 (2026-10-26)

Ids created or first cached by the F15 to F30 groups. Recorded by the integrator from each group's report; not re-read from the API.

### F30 blog and happenings listings

- Pages: Happenings `6adf8565c9208d434c321a85` (`/happenings`), Blog `6adf856512eff9c0216feca8` (`/blog`), both duplicates of /press. Body `6ad66fd5735773f253406673`, main `6f33cce2-3413-7ab7-f697-7980b49521fb`. Instances keep the /press element ids on both pages: Hero `954ba09c-c585-377c-a4e3-a643bbd37f21`, tab-pills-intro `a0cf1b8c-6599-1aeb-0aad-3babaa7eef51`, Offers `08ba98cb-4e73-8f2f-cf82-95a4a0cd939a`, Card Carousel Header Left `38b333ce-daa8-1aed-489f-f7a62cd23b21`, faq `d9c33fc8-fe56-f028-9b83-f8a86dad1ca0`, CTA `52c8df75-7bf3-a29f-bdce-158fef2bd370`, Site Nav `a0bd1537-003b-0e74-9517-515e8817d8c9`, Footer `64ef670f-ec28-a2e3-1928-29026e69ac73`.
- Happenings topic groups (section / Collection List / card link): dining `0d9df6d2-d3e2-16be-e752-b7132be93918` / `c706a153-ad4f-e4b8-e4f2-72ba26467fc5` / `2dbef8f2-6cab-7393-c45b-d6d1e162157a`; culture `1ff8b291-444f-7296-a84f-cb141171b0e7` / `299be75f-7116-40f7-16d3-52bca67aa183` / `e93f435a-f345-9cc7-0f64-ce61ede3ac4e`; conferences `d41254d1-6bfb-84b6-584e-fea3bbed7bc1` / `ab7d9908-50e2-e3e9-77c1-d08c45998131` / `b5dcbcd0-f0cb-3e2e-815e-c0e7a07ff239`; empty-group HtmlEmbed `e1278dda-645e-595d-cd90-59765c8845d5`.
- Blog topic groups (section / Collection List / card link): dining `1039286b-1202-56f0-fb02-14af241b80b0` / `bee9c2ca-2288-5ed8-aa78-38d08bc4a5e5` / `83ff5353-4041-51ed-4c8d-b8c63e633be8`; culture `96e407e4-bc57-82db-139a-c3e60fbd98e3` / `deb440fa-91ce-0ff1-fc30-d7579fe6746e` / `2523a640-02ce-ae73-d934-4f791cc3908a`; conferences `71717da2-a747-2b55-c04c-a596ace45400` / `e29221f4-8ae7-7ea7-9b66-d32845dd30b6` / `19fc353d-a390-9249-69e0-b1a7298c4250`; empty-group HtmlEmbed `fb7823b2-4f49-25e7-6a24-7f5a901b8bd3`.
- Post Categories item slugs are now `happenings` (`6ad67dd6f57084c9b83ef704`) and `blog` (`6ad67dd6f57084c9b83ef706`); template URLs are `/post-categories/happenings` and `/post-categories/blog`.
- Style `.article-card-staggered_header.is-group` `49c9014a-448e-10fc-301b-c769440bccbc`.
- Site Nav menu links: happenings `aab2628a-dae9-6549-ee66-80b145a8fbd1` (after experiences), blog `86fd9983-9ca5-7338-57c4-ff2fdfbb33b9` (after gallery).
- Footer Links: happenings li `5111474e-060a-f9c4-01ed-bf62c739f1cd`, link `c6843ab0-4191-cf48-4d0d-b7db79fde223` (experience column); blog li `526067f6-e693-a7fd-0cd0-a6e112fcf40b`, link `d8698602-9f97-6754-20d7-9272d3390bcd` (hotel column).
- Binding field id for Category > Slug on Happenings & Stories: `3d27986165618c5d45dcff873530a2ae:::5db7cb81a370ac6e5bf5a3d08b1b7318`.

### F27 Rooms collection, template and grid

- Collection "🛏️ Rooms" (singular "🛏️ Room", collection URL `rooms` since 2026-10-27, was `rooms-individual`) `6adf8f780ea92c0983eddaac`. Template page "🛏️ Rooms Template" `6adf8f780ea92c0983eddac0` (path `/rooms/<slug>`, Body `6adf8f780ea92c0983eddacb`). Static Room Detail page `6ad66fd5f8bf4846e809dc45` is now slug `room-detail-static`, draft, superseded (delete it in the Designer later).
- Fields (slug, id): name `3519f8d9ccc29fc4a6d06af65f5dc2dc`, slug `657cd6fcd4b050129d03075fa8864cfe`, `room-type` (Option) `baf9f2feb60cdb165cfee8e651be218a` (Room `16d76cea806f4aa1a651791ffaa77bb4`, Suite `2d55fb41d8a9a223fd08d20a3cb54c2b`), `guests-label` `cc8cf5ea7ee31dd7be74faf4cb8ed2b6`, `size-label` `6a3824d22771cbde62bda4111c37497d`, `max-guests` `7822499a0b088fdf38d63b51b099bd82`, `card-and-hero-image` `c468cf9d6abf07ad5f096b97840956ee`, `hero-intro` `cf28cb64f1b4c30f0136edb70467dcda`, `show-in-recommendations-grid` `2842d7cc5d042dfa315c7f6d43af4bba`, `sort-order` `5222d3966cb63053995ca2802f43b030`. Groups: Card (type, guests, size, image, recommended, sort) and Room page (hero-intro, max-guests). Webflow derived the slugs from the display names, so the plan's `recommended` and `hero-text` are `show-in-recommendations-grid` and `hero-intro`.
- Items (sort order, slug, id): 1 `cozy-queen` `6adf8febfcc9cfc8092476f2`; 2 `cozy-king` `6adf8febfcc9cfc8092476f4`; 3 `cozy-courtyard-queen` `6adf8febfcc9cfc8092476f6`; 4 `cozy-courtyard-king` `6adf8febfcc9cfc8092476f8`; 5 `city-level-below-ground` `6adf8febfcc9cfc8092476fa`; 6 `guild-city-level-loft` `6adf8febfcc9cfc8092476fc`; 7 `guild-loft-suite` `6adf8febfcc9cfc8092476fe`; 8 `guild-corner-loft-suite` `6adf8febfcc9cfc809247700`; 9 `guild-double` `6adf8febfcc9cfc809247702`; 10 `two-bedroom-loft-suite` `6adf8febfcc9cfc809247704`. All have isDraft false (Ready to Publish); `publish_collection_items` returns 404 until the site is published once, so they go live with the next site publish. Recommended: guild-city-level-loft, cozy-queen, guild-double, guild-corner-loft-suite. The corner loft suite uses photo `6ad67017fb3a14e0db41143b` because `6ad67019735773f25340899e` is the "Welcome to the Guild" card photo, not a room.
- /rooms (page `6ad66fd5f8bf4846e809dbee`) grid: Collection List DynamoWrapper `725bdff0-11b3-1c54-dcc9-99db1369bb4a` (source Rooms, filter show-in-recommendations-grid isOn, sort sort-order ascending, limit 4), DynamoList `725bdff0-11b3-1c54-dcc9-99db1369bb4b` (class `rooms-collection-room-grid_list`), DynamoItem `725bdff0-11b3-1c54-dcc9-99db1369bb4c`, empty state `725bdff0-11b3-1c54-dcc9-99db1369bb4d`. Card link `39e088cc-6f4c-d00a-b8ca-bbf1ed98b10e` (still href `#`, needs the Designer click), figure `7c4ee68f-f638-a352-8836-9e31461c122f`, image `3c380f70-824e-00d2-b778-10d4f7f3c173` (assetId bound), overlay `c6d1d93a-da46-8ed0-44bd-ea65aca56946`, content `edd041ba-96d7-5761-317d-1ef469ced6ab`, header `cddaeb7e-3f1c-05d3-d377-d770377af049`, h3 `19aa26fc-43c4-960d-7991-0baacc8c69c5` (name), details `ba3339de-9790-7b91-975e-ea2a580e0fe7`, detail 1 `59ed0111-19e8-1cf0-620b-cf59b96bebdf` (guests-label), detail 2 `4cbd3315-44fc-e6d6-8543-360ceab535df` (size-label), footer `41d9214f-cac6-346c-ce77-ac24455fcecf`.
- Card link `39e088cc-6f4c-d00a-b8ca-bbf1ed98b10e` carries `data-cms-link-path="rooms"` (static) and `data-cms-link-slug` bound to the Rooms Slug field `657cd6fcd4b050129d03075fa8864cfe`; the `cmsItemLinks` module (wired in src/index.ts, ships in the next release) rewrites href to `/rooms/<slug>`. The link itself is also set to Collection page > Current Room in the Designer, so it works without JS and CMS Nest can match on it.
- Old static card list `7626f7b9-d6d1-6195-4802-49d0d8ca3959` kept but hidden: its classes were replaced with `hide` only (not removed from the page).
- Template element ids (page `6adf8f780ea92c0983eddac0`): page-wrapper `3ff24523-b5b1-b375-b2ab-8cb8695c1720`, main `7d32d4c2-3824-5c70-7b35-262969b61ebb`, Site Nav `3ac2e8e7-4783-afb0-217a-2cdc6c700bed`, Global Styles `e6aa731a-b32d-ba7b-52b1-21b20e855b62`, Hero `05e278dc-423f-fcf5-ab2d-ac4d008a2d61` (Heading, Text, Image bound to name, hero-intro, card-and-hero-image), script-intro `67e58af5-a074-f1f6-457a-54bc8ecd98eb`, description section `9bf83316-7b0a-5325-0fcb-b74684ca546d`, image-inset `9e24d43f-9036-d8f7-8de6-59dc2b6a0d14`, Hero Left `4ce1de35-7611-04ea-4c15-d9c7fa602d24`, Split 1 `4a7d51c9-79f6-42cf-c12b-b8b4ffef353b`, amenities section `f26b0109-b5f4-86ac-62f0-049811082656`, Split 2 `8b48b0bb-2895-a9d5-a44e-769acecbe195`, Gallery `eb313bbd-581f-6c71-f842-75034b9234ca`, Card Carousel `11717bc2-0e89-aeb8-91f6-efbc30a4cb05`, Map `3a5178d5-d96b-852a-30b2-630b1a48f742`, Offers `53174b3c-ba9b-b4c6-a75d-c3105a4840da`, faq `2a66d376-1b75-2e37-a009-8bb97375fa57`, CTA `e7046e6d-1e77-66f5-5a34-8faa805d932a`, Footer `aa3a1808-d681-5777-6630-1378866d15e5`. SEO title and description are bound to name and hero-intro. Gallery heading still static "deluxe king suite gallery".
- all-rooms dialog (component `a9d40053-f1b0-f862-ee0a-4f021e1933a9`): all 10 trigger and 10 view-more links now point to `/rooms/<slug>`. Room template carousel instance `11717bc2-0e89-aeb8-91f6-efbc30a4cb05` links 1 to 6 likewise.
- Learning: a component instance cannot be a before/after anchor for builder or move; to place native sections between instances, build or move everything with `append` into main in the final order.

### F26 Rooms quiz CMS (seeded 2026-10-27 by `scripts/api/webflow/seed-rooms-quiz.mjs`)

- Collection "🧭 Quiz Options" (slug `quiz-options`) `6ae08d40ba5f0d2f0a4a2720`. Fields: name `808e173f264830b6ed018d3c90d65a18`, slug `289e90b6bfbcc456505e226faa3d32f0`, `step` (Option) `91064fea8f4a9beaeba1a64cc6bc3740` (1 `581366eedce00805d8984d8766da77ff`, 2 `a28640cc8069cf99db3a38dcf7f50a68`, 3 `1d02c361d42d1692a1b4e21aafb3116b`), `sort-order` `cdf2eecffd244da5ec3f27434adc52e0`, `image` `66a64f4dab349c192adbdab5df4dd4ad`, `image-alt` `65f0fdd072f1b3e6179908646766d55e`.
- Options (step, slug, id): 1 `just-me` `6ae08d43d10e48eb412d6267`, 1 `two-guests` `6ae08d43de9eaf36732e21bc`, 1 `3-4-guests` `6ae08d44464dcf3894123f33`, 1 `5-plus-guests` `6ae08d45464dcf3894123f55`; 2 `couples-getaway` `6ae08d46d4c3570609eedffe`, 2 `business-trip` `6ae08d4708ed329144e52816`, 2 `family-and-friends` `6ae08d483e922b99a5ff2f7d`, 2 `celebration` `6ae08d49d10e48eb412d64b7`, 2 `extended-stay` `6ae08d4a23c5bb5e2a1bc008`; 3 `spaciousness` `6ae08d4b1a8a089e0f1cd45d`, 3 `elevator-proximity` `6ae08d4c23c5bb5e2a1bc027`, 3 `courtyard-view` `6ae08d4d1a8a089e0f1cd564`, 3 `street-view` `6ae08d4ebd513d73ad401b9c`, 3 `quiet` `6ae08d50eb2c3f9058584469`. Step 2 and 3 photos are stand-ins.
- Rooms field "Quiz options" (MultiReference, slug `quiz-options`) `d0dcbfaba0affa064faba51f030413ac`. All 12 rooms carry placeholder tags (one guest option, three stay types, three features); exact-match coverage 76/100. Re-running the seed keeps existing tags unless `--retag`.
- CMS Nest v1 (fetch mode, nest id `room-quiz-options`). Real attribute vocabulary is in `docs/solutions/integration-issues/finsweet-cms-nest-v1-two-modes-collection-page-links.md`; the plan's `template-reference` value does not exist.
  - Rooms Template: hidden section `01af678d-a2fa-4f60-9501-7d9df7b60976` (class `hide`, aria-hidden) > Collection List `5175e6c5-231e-741a-9ce7-48fcf3db33d4` (`fs-cmsnest-collection="room-quiz-options"`), item `5175e6c5-231e-741a-9ce7-48fcf3db33d6` > link `2949bf4e-a27a-644f-1a96-2521be3e0493` (collectionPage Quiz Options). The list source must be the current room's "Quiz options" field; the MCP only accepts `{ collectionId }`, so that binding is a Designer click.
  - /rooms head code: CMS Nest v1 script (page only, no Finsweet v2 on the site).
  - /rooms results list `725bdff0-11b3-1c54-dcc9-99db1369bb4a` carries `fs-cmsnest-element="list"`; card link `39e088cc-6f4c-d00a-b8ca-bbf1ed98b10e` now links to the current Room (collectionPage); nest target `71cb44fd-04db-ca35-a93e-62698a099f03` (div.hide, `fs-cmsnest-element="nest-target"`, `fs-cmsnest-collection`, `data-rooms-quiz-tags`) is a sibling of the card link in the item.
  - /rooms source list: wrapper div.hide `7f69b66c-ef7c-18e5-3020-38ec3b289e99` in room-grid section > Collection List `6f0594eb-00fc-cffd-2ced-da4108663fb4` (all Quiz Options by sort-order, `fs-cmsnest-collection`), item link `8d1cf724-2eaa-c6f1-0001-0b7d7dc4cad2` (collectionPage, `data-rooms-quiz-tag` bound to slug, tabindex -1).
  - Quiz Options template page `6ae08d40ba5f0d2f0a4a2726` (`/quiz-options/<slug>`) exists only because CMS Nest matches by collection-page href; it has no content.
- /rooms quiz (U3): one section `37e7cbfd-796d-5ae3-e245-a854145db313` (`section_rooms-collection-quiz is-first`, `id="rooms-quiz"`, `data-rooms-quiz`); old step 2 and 3 sections deleted. Panels (`rooms-collection-quiz_component`, `data-rooms-quiz-step`, `data-hover-swap`): 1 `9561e3f5-7a68-04cb-ab92-8ae96c361c7b` (static `is-active`), 2 `885eb602-0d38-74db-b7c7-632cea7fd318`, 3 `cffd7e40-0708-8fea-b46e-04623f500eea`.
  - Option lists (Quiz Options, filter step, sort sort-order; DynamoList `rooms-collection-quiz_options` + `data-hover-swap-list`, item `rooms-collection-quiz_option`, link `button is-chamfer is-outline-light is-fill` with text = name, `data-rooms-quiz-option` and `data-hover-swap-trigger` = slug, `role="button"`, `aria-pressed`): step 1 `52cda1e6-190d-8601-34ef-93adccfb028d` (link `3c7d22f0-75a1-5380-f616-746176d747d5`), step 2 `40969629-c5ba-426b-2bb5-0f07831525d8` (link `704335c9-442b-c169-a2c2-71fa94ec2410`), step 3 `cf2de1f5-2082-71d9-97aa-741c3b4c46a7` (link `1ce7a1f7-6e65-0d7c-e767-8e93a3939a2d`).
  - Image lists in each figure after the static `default` photo (image `rooms-collection-quiz_image is-swap`, asset and alt bound, `data-hover-swap-media` = slug): step 1 `3062ebe5-eed9-fde5-ab10-3c6440854c91`, step 2 `94f5c85b-fa09-0e4e-600a-562e7391db61`, step 3 `88a507a7-0185-f7c2-a44e-f11ddd91a0d3`. Default photos: `d2b97da6-6145-c06f-5f19-b1be18e3169d`, `26678e9a-9127-5add-a0b7-508caf263a3c`, `1e534516-9292-8d7d-349c-1f62227bec9b`.
  - Back links (`data-rooms-quiz-back`, href `#rooms-quiz`): step 2 `b7f4e4d8-b93a-c90a-76d3-afc4341bad81`, step 3 `b88113b9-73bf-8a70-97f6-6144b96bbcfb`.
  - Results: recommendations section `c5c1a105-992b-654c-3d9f-a3a9045cf733` and room grid section `03d3505a-0d06-3884-3244-9b478b261ab9`, both `data-rooms-quiz-results` with a `hide` combo. Lines (paragraph `... hide`): closest `9c0c9fac-ca89-17c0-abcb-99fd2bfbe694`, empty `6574fa50-244d-5d62-49a0-35c815d55a25`, loading `be456d7d-6457-d7e3-3226-ab7f7208df2b`. Restart link `b83e9bd8-a13f-92ff-c04e-14f4d9e8f67e` (`data-rooms-quiz-restart`, href `#rooms-quiz`). Results list no longer filters or limits (all rooms, sort-order).
  - Styles: `.rooms-collection-quiz_component` base display none, `.is-active` combo `16bbc320-5982-e341-0f74-d7f30fedacaa` display grid; selected option `.button.is-chamfer.is-outline-light.is-fill.is-active` `4a1c7551-7483-df1f-6d78-ffb76948eb61`; `hide` combos `6e04deff-76bd-a899-4f06-7ef367d7c1da` (recommendations), `b5eddcf7-c06d-4623-2a2c-0b639edcb305` (room grid), `601a2a08-0936-c562-d96b-b949518d1385` (text lines); `rooms-collection-quiz_footer` gained a 2rem column gap.
- Placeholder rooms (remove before client launch): `placeholder-single-1` `6ae08d571a8a089e0f1cda3f`, `placeholder-single-2` `6ae08d59d66c0afeb4159345`. Staged, go live with the next site publish.

### F17, F21 chamfer and link-bar styles (planned writes, not applied)

| Style | id |
|---|---|
| `offers-slider-split_button` | `8d006641-252d-cc03-ed49-d95c8f86284a` |
| `overlay-detail-panel-modal_button` | `8816daef-d51a-a212-020c-d04c879804ff` |
| `overlay-detail-panel-modal_item-button` | `b5e2d69e-0d6b-5d39-bbf8-96d8e212d575` |
| `history-timeline_label` | `87c3f212-f16b-f06d-13ac-4e64a2547fd1` |
| `history-timeline_label-wrap` | `d6d8a0e0-81ee-c7f7-5e58-b44e23f59bb3` |
| `history-timeline_label-text` | `f2edd435-cb9b-9c04-6bf1-a17fdf287336` |
| `tab-pills-intro_tab` | `a0f252cd-42cd-bd83-f47f-c05fe5f71e06` |
| `tab-pills-intro_tabs` | `bba7b479-c595-d4f4-9895-256ede9aeaaa` |
| `venue-card-fullbleed_tab` | `206db50e-bd3e-ec81-c1dc-cc52c47347a6` |
| `venue-card-fullbleed_tabs` | `2bdfd4ef-9b8d-1489-27e0-262ba21b4d0a` |

### F22, F29 modal scroll styles

- `overlay-detail-panel-modal_component` `3b753a7a-b6c6-f84b-98f9-73ee58aafc18`: base overflow-y auto, overscroll-behavior contain.
- `room-list-hover-preview_component` `1432cf08-3b60-1b4c-d199-78937eb8cace`: base overflow-y auto, overscroll-behavior contain.
- Overlay Detail Panel Modal Dark variant `569f778f-307a-cdc2-95c3-95b18a7c2c5c`: `overlay-detail-panel-modal_figure` is main `height: calc(100vh - 6.5rem)` (aspect-ratio auto, order 0), medium `height: auto` (aspect-ratio 681 / 796).
- F39 Dark variant `overlay-detail-panel-modal_bar` (style id: resolve with `get_styles`, not yet cached): `left` is main `calc(14.5rem + (100% - 19rem) * 0.56049)` (was 57%), medium `2rem` (was 1rem), small `1.25rem` (new). Top 2.375rem and right 4.5rem unchanged. Aligns back link with the text column.

### F20 History landmark

| Resource | ID | Notes |
|---|---|---|
| Gallery Mosaic Captioned instance | `52f28a89-ecc8-606e-0a16-c341dda479e1` | on History; component `560e1b31-d612-0921-8773-8f9de2e2b06f` |
| Mosaic props Image 1 to 4 | `d41c4a29-3938-b380-5444-aac22708c480`, `39b3e286-5782-b9e9-4a6e-c3f97c32c205`, `9de150c6-324d-e6a3-8fa2-28b7ded767ab`, `020d0f17-9e6d-702f-fafa-8231b89df59a` | History values: Zuma, succulent, fitness, pool |
| Mosaic props Caption 1 to 4 | `f46dfd48-84cd-7791-03be-917c0c122971`, `484377f3-e3fe-d378-4dbb-ad6bb3a1709a`, `937cab3d-dd52-1f15-fe41-b6a78a259809`, `b220cf9b-f331-de64-6225-593713f3516c` | placeholder copy |
| Mosaic props Heading / Show Heading / Feature Title / Show Feature Title | `3aab8783-f8f3-e498-0599-7ddbcbf5d1e9` / `128a7ba8-2116-e014-5718-97f9541d1218` / `9b94a9b9-d271-9268-3a20-e7d3e831c400` / `e90568d5-57ae-46a2-6566-0f6b14ce903b` | |
| `section_history-landmark` | `895e47cc-0d7b-ef01-e840-7b3654d0461a` | `data-history-collapse`, distance 3 |
| Landmark images Zuma / succulent / fitness / pool | `3ef9a39e-de20-3580-942d-76515eab48dd` (data-eager) / `c73a6076-9465-122a-092d-cb68c9f9d79e` / `d4f0a5c7-86f6-a1a0-0d62-0dff0ad69075` / `b26846ca-c610-66ad-5b17-45d6208a931b` | |
| Assets Zuma / succulent / fitness / pool | `6ad66ff45794075272b9663f` / `6ad66fe91ce40a5a6239b8ad` / `6ad6700eb28c9b39f95d814d` / `6ad66ffdba96f2e53726bd55` | |

### F23 Site Nav toggle

- Toggle link `a.site-nav_toggle[data-nav="open"]` `fc94d1a2-3399-4de0-e836-0233a6c86ce2` in Site Nav component `fc94d1a2-3399-4de0-e836-0233a6c86cdf`; static aria-label "Open navigation menu" (navToggle overwrites it at init).
- Hamburger icon embed `.site-nav_icon` `fc94d1a2-3399-4de0-e836-0233a6c86ce3` (inline SVG, three rect bars).

### F24 form placeholders

| Style | Selector | ID |
|---|---|---|
| `u-sr-only` (global utility) | `.u-sr-only` | `fabcef92-13f0-1e0a-8c66-80b9531dbd43` |
| `u-sr-only` (combo on newsletter label) | `.cta-booking-newsletter_label.u-sr-only` | `d3438645-65e8-2613-aed8-4c8bf806e497` |
| `is-placeholder` (combo on input) | `.form-split-script-contact_input.is-placeholder` | `7acbad24-1434-a2c3-48f9-8dcfd4b4a774` |
| `form-split-script-contact_input` (existing) | `.form-split-script-contact_input` | `1fe11f28-e110-59a9-ea43-beac74d77b3d` |
| `cta-booking-newsletter_label` (existing) | `.cta-booking-newsletter_label` | `3d9e555d-c4d8-2f60-f9a0-d06b1d661c65` |

Contact select `c6518e72-8838-a8a1-906b-60929af12d99` carries custom attribute `id="contact-assist"`.

## Feedback batch 3

### F41 Rooms template enlarge image (planned, ids pending Designer write)
- Page 🛏️ Rooms Template `6adf8f780ea92c0983eddac0`, collection `6adf8f780ea92c0983eddaac`, image field `card-and-hero-image` (`c468cf9d6abf07ad5f096b97840956ee`).
- New section `section_venue-card-fullbleed` (arts structure with `is-bleed` combos) goes after native description section `9bf83316-7b0a-5325-0fcb-b74684ca546d`. Record new element ids here after the write.
- Hide (do not delete) instances `9e24d43f-9036-d8f7-8de6-59dc2b6a0d14` (image-inset-single) and `4ce1de35-7611-04ea-4c15-d9c7fa602d24` (Hero Fullbleed Centered Left).
