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

- **Bundle release**: v1.3.13, commit `c81f2a6f1fb2bc0ad03b05a84642de244bcee0db` (live on staging footer and head site.css, 2026-11-20); content of the head and footer blocks in `site-scripts.md`.
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
| History 16px test | `6afb30142bc6eae4d68d3cd5` | `/history-16px-test` | #182 (2026-11-16): duplicate of History for Omar to judge 16px paragraphs; page-scoped style embed `454b5178-a9de-b68c-6291-006fac76573b` first in main; head has robots noindex. Omar chose 16px (rolled out site-wide 2026-11-16). Set to draft 2026-11-17 on Stephen's yes (off staging); the API cannot delete pages, so delete it in the Designer. |
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
| Packages | `6afc5759981249dd386c4008` | `/packages` | M41 (2026-11-17), Stephen's duplicate of /blog; lists read 🎁 Packages (see the M41 section) |

Static pages created by Q004 on 2026-10-19 (slugs approved by Stephen: the four `-collection` Figma pages use clean slugs). CMS template pages (dining-*, legal, corporate, happenings-*, blog-*) are created with their collections in Q027 to Q030; add their rows then.

### CMS template pages

| Template | Page ID | Path | Collection | Notes |
|---|---|---|---|---|
| `🍴 Dinings Template` | `6ad67d7416e13e66c2b76107` | `/dining/<slug>` | `6ad67d7316e13e66c2b760d7` | Assembled by Q027 (2026-10-20), Body `6ad67d7416e13e66c2b7610f`. Instances: Site Nav `f8cbdfba-9844-bc56-4c18-4675d35c9641`, Hero `726f3724-5fec-e4c7-caa6-8f1195d5abdd` (Burgundy Button, inside the Olive look list), Hero Blue `98f5b6bf-a866-2fe1-7766-749f61bd2129` (Blue Button, inside the Navy look list, same CMS bindings), Split Olive `e0471a1c-0f53-a890-8460-fbddb329850e` (switched to Blue by W02), Split Stagger Left `b43a49ce-0bbb-f743-2fa7-b3250bb8db7c`, Image Trio Text `58d5c5a8-7e22-04a2-886d-09b8d27c59b1`, Gallery `42e6505b-83c4-c38b-82a8-e3aeecc0e1db`, faq-accordion `d1d32ffd-235e-839e-a309-b4fd1b93056b`, CTA `ce35b1a4-354e-eb34-3eea-404aa24ce152`, Footer `ee2f5942-bd9e-9131-52f5-c656c6e42e49`. Native sections: text-columns-info `7b75f1cc-caa9-0b17-844e-273e78e72f7c`, image-pair-text `d72e46c9-866b-1c48-800a-72b64c23e60a`, quote-band-dark `273f2b41-4042-4829-651a-50c1e5beeb62`, card-stagger-header-left `86d57348-f224-7d1f-8ca3-1011769f1eb2` |
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
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | Relume starter global styles embed. Also holds the `<style data-paragraph-size>` embed `642ce024-597a-077a-4751-83d60f9e31e6` (#182, desktop body text 16px, hero stays 18px; source `docs/reference/site-head/paragraph-size.css`). |
| Footer Links | `14efd120-8e4c-efe3-75b9-396e4792ed73` | Q013 site footer, no props; built on `🧱 footer-links` (2026-10-20). Dining column gap (F35): the CMS list wrapper `6d849dd0-bd96-3cdd-c3ba-77644e482bf8` and the static "in-room dining" `ul.footer-links_list` are separate flex children of `footer-links_column` (row-gap 2rem, 1.25rem at max-width 767px), so the gap after the last CMS item is 32px (20px mobile) instead of the 12px list gap. Fix is combo class `is-after-cms` on the static ul only: margin-top -1.25rem, -0.5rem at max-width 767px. Ul element id not cached yet. |
| CTA Booking Newsletter | `916e4ffc-007b-3572-a686-946c6645b2e8` | Q012, no props; instance on `🧱 cta-booking-newsletter` |
| faq-accordion | `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7` | **Deleted 2026-11-23.** Q015, built on `/build-faq-accordion` (2026-10-20), no props |
| Hero Fullbleed Centered | `f91dcf8c-5c66-6cf4-32b6-a2f2427f7bfa` | Q014 shared page hero, built on `/build-hero-fullbleed-centered`; 15 props (9 content, 6 Show booleans), plus the auto-created Variant prop `69451566-4154-e6c8-a0db-695c14d9c0af`; variants (V01) Text Dark `c5755984-9207-f25b-c049-f99910c92943`, Left `75108921-8bef-ba10-2260-5af2990c9e7d`; (V02) Blue Button `e8c11cfd-fe49-cdf5-9556-32d89df58988`, Burgundy Button `81c5f9ea-386b-7949-fba8-9ed7d1d78407` |
| script-intro-centered | `bdff66b3-92d9-e1e3-dbc0-86a28e384c9b` | Q016, group Sections, built on `/build-script-intro-centered` (2026-10-20); 9 props (6 content, 3 Show booleans), plus the auto-created Variant prop `a756475a-6061-cff6-3f67-57b297c53d34`; variants (V02) Tall `ac455635-ebdb-afce-1b26-c3754520f0b3`, Wide `16b2e029-4d87-68f1-ffc1-4a8294038434`, Bottom `211f09b3-312a-f072-e7c4-4e0894618a51` |
| Gallery Mosaic Captioned | `560e1b31-d612-0921-8773-8f9de2e2b06f` | Q018 four-tile gallery, built on `/build-gallery-mosaic-captioned` (2026-10-20); 12 props (6 text, 4 image, 2 Show booleans). Figures carry no reveal (static, 2026-11-16); feature header `...b076` has `data-reveal=text-mask`, figcaptions `...b079`, `...b080`, `...b087`, `...b08e` have `data-reveal=text-mask` plus `data-line-mask=text` (2026-11-17). |
| Map Feature | `8e90ff20-1ed1-43a7-edce-89b7ea10c487` | Q019, built on `/build-map-feature` (2026-10-20); 22 props (Content, Button, Visibility, Places, Image groups); `is-image-bg` and `is-centered` are the separate components below (V02); no Variant prop |
| Map Feature Image Bg | `5d830b69-6507-7d04-4828-069b2539cffb` | V02 separate component for `is-image-bg` (meetings, neighborhood, legal, corporate), duplicated from Map Feature; same 22 props; is-image-bg combos on section, content, header, aside, figure and image; h4 heading. Build page instance `d9b87af6-78b5-9dd0-a286-370ebce38039`. F13 map contract (2026-10-21): figure `5d830b69-6507-7d04-4828-069b2539d01f` (`data-map`, `data-map-home`, `data-map-key`), items `...d007`, `...d00d`, `...d013`, `...d019` (`data-map-item`); Place Link defaults are directions URLs with coordinates |
| Map Feature Centered | `d6e2f6bc-b2b0-8951-1f0a-59832380519b` | V02 separate component for `is-centered` (history/08), duplicated from Map Feature; same 22 props; is-centered combos on content, header, aside, figure and image; h2 heading. Build page instance `0f348b0e-cc20-7b7b-6826-e2535397a490` |
| Split image text light | `663131a8-3362-867e-25ef-28b6d3d209a2` | Q017, built on `/build-split-image-text-light` (2026-10-20); 17 props (7 content, 2 image, 8 visibility booleans), plus the auto-created Variant prop `aa420cb8-91f6-452f-84c8-06d3561e68b6`; variants (V02) Olive `654bb362-ab8e-2b17-8c1c-352117770874`, Blue `f30ba1e7-28c4-ef9f-30bc-31294c23f46d`, Tan `9cd3f054-0bc5-3e71-98b6-562cb8361ab0`, Compact `a6df7398-8cb4-0616-9847-2ba4833207db`, Edge `473c3237-6d5f-b4e2-46df-945ff89461a7`, Stagger Left `5fb6b74c-56cc-c3c2-eef8-32b240b619e7`, Stagger Mid `8dcc8de6-914e-f2a6-a0b5-5f95af173bdf`, Wide `45de7441-0ac3-59ed-e7fb-5c6524848b2d`; the old reference sections stay on the build page until deleted |
| Image Trio Text | `eae1d08c-c012-be1b-bafe-4ca88d995c14` | Q020, built on `/build-image-trio-text` (2026-10-20); 16 props (Header, CTA, Images, Items groups); base layout only, no variants (V02: the card layouts are the two components below) |
| Image Trio Text Left | `46897c76-730a-1978-c362-54be3e026510` | V02 separate component for `is-left` (legal/03, corporate/03), duplicated from Image Trio Text; same 16 props (defaults: cards shown, paragraph and CTA hidden); `is-left` combos on section, header, list and figures; heading-style-h4; no image stack collapse attributes; instance `8d67aba1-ae7a-8fbb-3aef-cff2a91d79d4` on the build page |
| Image Trio Text Left Offset | `f6f42b26-759f-d2b6-03de-516393880a37` | V02 separate component for `is-left` + `is-offset` (legal/11, corporate/11), duplicated from Image Trio Text Left; same 16 props and defaults; `is-offset` on items 1 and 3; heading-style-h3; instance `933ea046-66a9-f832-470a-173bbc09d721` on the build page |
| form-split-script-contact | `2f0cac24-8156-b0d7-520c-f5128139d6b0` | **Deleted 2026-11-23.** Q022, built on `/build-form-split-script-contact` (2026-10-20); 7 props (Heading, Paragraph, 5 Show booleans); default content is the guidelines/06 photoshoot form; Variant prop `75def639-20c3-2cee-b8b1-a6ef470ca15c`; variant (V02) Tall `c284c9dc-42be-882d-5aca-03608bebfc95` (is-tall); build page instance `7f9cb9e6-00d1-cbae-8e6e-18b2be87916b` (Tall); the old is-tall reference section stays until deleted ; (Q043) variant Contact `cb87b4cf-bba7-94cc-e25e-670072dbadea` (caps heading, no tilt, form wrapper hidden, nav padding); Details props: Detail 1 Label `6b80f13f-54de-a84d-1868-3c15d4089407`, Detail 1 Value `64dae5d6-0db2-6243-c764-23db7aa41612`, Show Detail 2/3/4 `e04adbbb-4eb0-bfba-32f1-ad941f1f9eb9` / `90cf7380-5dd5-14da-2ab2-eee49d5c099b` / `30fe4f6e-5bbe-a5e0-2431-d2c785b94b88`, Detail 2 Label/Value `62b0c303-17d4-81c3-a914-e958b5e184cb` / `9fc3c652-b880-489a-6765-1d62a5f10897`, Detail 3 `d8fe5367-69d6-2197-284b-f2af7584f03d` / `0f9918b7-313c-c102-35ba-104b39e870d1`, Detail 4 `7efa54c1-edff-5e45-43a1-e48beb141f38` / `01c718c2-b810-b13d-aca9-4d61c810431e` |
| Venue Card Fullbleed | `bbccdbb5-db17-02a1-a0cc-43ce0f5da371` | **Deleted 2026-11-23.** Q021 static base card, built on `/build-venue-card-fullbleed` (2026-10-20); 15 props (5 content and button, 4 image, 6 Show booleans), plus the auto-created Variant prop `610e37db-a68b-e1aa-27de-a2d2456aa054`; variant (V02) Media Center `024eaaa9-a9b9-c251-8d00-f211d30965d2`; the multi-panel snap groups stay plain sections on the build page |
| Venue Card Fullbleed Tall | `f8269db7-7b82-27f1-dd64-8dd069d633f6` | V02 separate component for `is-tall` (home/11), duplicated from Venue Card Fullbleed; same 15 props; h1 heading, regular text, outline CTA |
| Venue Card Fullbleed Left | `100e1eab-d304-3568-6d93-6fa936f8c0af` | V02 separate component for `is-left` (home/15), duplicated from Venue Card Fullbleed; same 15 props; h2 heading, medium text, outline CTA, static three-row venue list (no list props yet). F06 (2026-10-21): media tabs. Item `…c0b4` has `data-media-tabs`; figures `…c0b5` (prop-bound boardroom), `559f6448-d2ff-8497-7763-aabde5918261` (courtyard, asset `6ad66fee735773f253407335`), `2e53a0c6-7eb9-f3dc-52d9-45aa16832941` (conference center stand-in, asset `6ad670147e3d6550932e0fac`) carry `data-media-tabs-media`; panels (class `venue-card-fullbleed_panel` `a41c021c-41c9-68e5-4fd6-d684ddaa01bb`) `80112891-99cf-d68f-d9ca-1bdd16daaf5f` (prop-bound header and CTA), `8f2d493e-5eb5-98f0-f33e-9cca384ed63e`, `1da783d0-0c08-3767-c092-04d1b145ffa0` (static copy) carry `data-media-tabs-panel`; list `63054506-…a388` `data-media-tabs-list`; rows `6ba9cb8d-…`, `0f3effe9-…`, `88857a0f-…` `data-media-tabs-tab`. Mobile centring (2026-11-04): panel headers `…c0b8`, `9766c859-…`, `34b54711-…` use combo `venue-card-fullbleed_header.is-tabs` (`d2327101-80e9-0cd7-b188-ea38e12a93c0`; left on desktop, centred below 768px) instead of `is-left`, which Arts still uses |
| Article Card Staggered | `155bf09c-0bd4-9e9a-db53-4a8060b48cf1` | **Deleted 2026-11-23.** Q025 single base card, group Shared, built on `/build-article-card-staggered` (2026-10-20); 13 props (6 content, 1 image, 6 Show booleans), plus the auto-created Variant prop `62353da2-b5b1-62cb-98d1-9cdfea8519aa`; variant (V02) Right `c725504c-7f06-39a0-276e-18f876c7c43f` (is-right); build page instances `a4ddd96d-c1a5-8a07-a324-8f4f442598d2` (Right) and `85fd20ac-fa12-6fe4-53e8-ad6c67e7cef4` (Right with the culture header); W02 p8 props Show Logo `be7c8f28-4b60-1b27-f827-9b294d0bb21c`, Logo `db9c3157-4710-720b-c63a-1ce5bcf6b919`, Section ID `b2aa84c0-47f4-c6f1-7044-5007c4bdc021` (root domId) |
| Article Card Staggered Tall | `658f6b02-60da-4e60-799a-540b8a036180` | V02 separate component for `is-tall` (neighborhood/09), duplicated from Article Card Staggered; is-tall combos on component, header, list, item, figure and text; 21 props (the 13 above plus Card 2 and Card 3 groups, not yet bound because cards 2 and 3 are not built); build page instance `7aa25459-b902-f0ca-d12a-a0f9f3ea68e1` |
| image-inset-single | `3eeb97fa-6550-7845-31ee-e997e4b8f2f1` | Q024, group Sections, built on `/build-image-inset-single` (2026-10-20); 2 props (image, image alt), plus the auto-created Variant prop `06d2aef1-4186-3b9f-f515-37143ac1d739`; variant (V02) Small `ed48680f-16db-4226-7dda-8e89d4535148` (is-small); build page instance `466dca97-60e6-0693-8a07-8f408d11bf66` (Small); the is-small reference section stays until deleted |
| tab-pills-intro | `30192280-e01e-6f0a-638c-42d4686bee29` | Q023, group Sections, built on `/build-tab-pills-intro` (2026-10-20); 12 props (Content, Tabs, Visibility groups); default content is press/02; plus the auto-created Variant prop `c5950a24-1677-5228-3720-ece49247f526`; variant (V02) Media `9bd0d616-a2cc-7ffb-c508-bf993eecf81b` (is-media); build page instances `f6c5908b-212a-12d4-c1b3-d94548ce797d` (Media, wellness) and `4718f2e5-5b79-b06a-5408-0516c6d84a9f` (Media, meetings); the old is-media reference sections stay until deleted |
| timeline-scatter-images | `144b7315-3604-2419-b046-c09d180f1163` | Q026, group Sections, built on `/build-timeline-scatter-images` (2026-10-20); 6 props (Heading, Show Heading, Caption 1 to 4); no slot, items fixed; `is-tall` is the separate component below (V02); no variants |
| timeline-scatter-images Tall | `33e949df-43c2-4806-b73e-d403ed483051` | **Deleted 2026-11-23.** V02 separate component for `is-tall` (neighborhood/07), duplicated from timeline-scatter-images; same 6 prop ids, defaults are the neighborhood/07 copy; is-tall on section, header, heading (h3), list and captions (eyebrow caps); items is-xlarge alternating is-inset and is-end; build page instance `44318675-d385-7bfe-151a-2014c7d5b255` |
| Site Nav | `fc94d1a2-3399-4de0-e836-0233a6c86cdf` | Q005 shared navbar and full-screen menu, group Global, built on `/build-site-nav` (2026-10-20). Props: Book link `f6c9cf45-4dfc-02ea-be81-50f6e2ecee62` (url, default `#book`), Variant `454e7f56-bf51-5074-566c-b5cbae95cdd5` (base = light text; Dark `08083309-2be0-2228-878a-7f1c05773f43`) |
| Offers Slider Split | `96c19058-a54d-49c3-9568-d7aee87662b0` | **Deleted 2026-11-23.** Q008 slider, group Sliders, built on `/build-offers-slider-split` (2026-10-20). Variant prop `d176b097-92cb-1f48-49bb-d3e451881938`: Base, Blue `1993beed-24b7-3024-c815-349d23e9e282`, Tan `33c1374c-e0f0-7e2f-88ab-e318ee666728`. 32 content props (ids in `docs/figma/build-plans/Q008/plan.json`). Runtime `src/utils/offersSliderSplit.ts` |
| Overlay Detail Panel Modal | `44cccc51-37cb-2526-e426-133987071983` | Q006 dialog on the modals.ts contract, group Modals, built on `/build-overlay-detail-panel-modal` (2026-10-20). Variant prop `58627a5c-9ee5-3e05-ba7c-32f2cfa464f4`: Base, Dark `569f778f-307a-cdc2-95c3-95b18a7c2c5c`, Image Bg `72048989-461a-61a0-ac02-cfc3ae7b6e5c`, Burgundy `0e56f707-a8b4-d396-c73a-900ce080b5db`, Centered `34ca996d-2f65-a59e-6eb0-09dd065e4534`. 54 props incl. Dialog id `e23b2bf6-a467-9c5a-00e4-8cca4596b704` (ids in `docs/figma/build-plans/Q006/plan.json`) |
| Booking Menu | `6c8187bb-b662-164c-29a2-e084f027a1a1` | M2 (2026-11-03), group Modals, no props. Root `div.booking-menu_component` (display contents) holding two Overlay Detail Panel Modal instances: Burgundy, Dialog id `book` (items: book a stay `#book`, reserve a table `#book-table`, host an event `#book`, book an appointment `#book`); Image Bg, Dialog id `book-table` (Show list off, Show venues on, Back link `#book`). One instance per page, last child of `.page-wrapper`; ids in the M2 section below |
| Room List Hover Preview | `a9d40053-f1b0-f862-ee0a-4f021e1933a9` | **Deleted 2026-11-23.** Q007 all-rooms dialog (DOM id `all-rooms`, static, no props), group Modals, built on `/build-room-list-hover-preview` (2026-10-20). Instances: build page, and `/rooms` `80f767d6-0090-5ef7-fde4-878985946d8c` (last child of the Body, where the Q007 placeholder was). Runtime: modals, galleryFilter, roomListHoverPreview |
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
  - Results: recommendations section `c5c1a105-992b-654c-3d9f-a3a9045cf733` and room grid section `03d3505a-0d06-3884-3244-9b478b261ab9`, both `data-rooms-quiz-results` with an `is-hidden` combo (was `hide` until 2026-11-10; crawlable hiding, CSS in the bundled `rooms-quiz-crossfade.css`). Lines (paragraph `... is-hidden`): closest `9c0c9fac-ca89-17c0-abcb-99fd2bfbe694`, empty `6574fa50-244d-5d62-49a0-35c815d55a25`, loading `be456d7d-6457-d7e3-3226-ab7f7208df2b`. Restart link `b83e9bd8-a13f-92ff-c04e-14f4d9e8f67e` (`data-rooms-quiz-restart`, href `#rooms-quiz`). Results list no longer filters or limits (all rooms, sort-order).
  - Styles: `.rooms-collection-quiz_component` base display none, `.is-active` combo `16bbc320-5982-e341-0f74-d7f30fedacaa` display grid; selected option `.button.is-chamfer.is-outline-light.is-fill.is-active` `4a1c7551-7483-df1f-6d78-ffb76948eb61`; `is-hidden` combos (empty in the Designer) `9703684e-85ed-e682-6238-90868db9d05c` (recommendations), `555ebcc0-a180-89f6-be88-ced5cc5abf27` (room grid), `095e0525-df23-bb9b-f172-e25f12a0219d` (text lines); the old `hide` combos `6e04deff-76bd-a899-4f06-7ef367d7c1da` (recommendations), `b5eddcf7-c06d-4623-2a2c-0b639edcb305` (room grid), `601a2a08-0936-c562-d96b-b949518d1385` (text lines) are now unused; `rooms-collection-quiz_footer` gained a 2rem column gap.
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

### Nav Book Now hexagon hover trial (2026-11-12)
- HtmlEmbed `277538b8-2f97-d35d-7ca5-d9dff2ae3bce` (class `site-nav_embed`) in Site Nav component `fc94d1a2-3399-4de0-e836-0233a6c86cdf`, after the menu styles embed `fc94d1a2-3399-4de0-e836-0233a6c86d13`. Holds minified `docs/reference/site-head/nav-book-hover.css` (`<style data-nav-book-hover>`). Published to webflow.io only. To drop the trial, delete this one embed.

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

### Home dining panels from CMS (2026-10-27)
- Home `section_venue-card-fullbleed` panels are a Collection List on 🍴 Dinings: wrapper `77a63678-1591-7ff3-17ff-5d7a15d75b81`, item `77a63678-1591-7ff3-17ff-5d7a15d75b83` (`venue-card-fullbleed_item`, `data-scroll-enlarge-snap-item`), image `f152b4eb-3d6c-0ff7-462a-af2d7a65c4ba`, heading `e026d879-cce2-3f83-1ef0-38b639235ee4`, tagline `29b0e878-fee1-5676-9c8b-35b10fff2eb1`, logo figure `e3541f21-3813-8213-bb12-5bb5e2b095cb`, logo image `07673065-760f-5a87-ebbb-831e67bbb0f6`, link `176a1756-4e98-7fef-e880-5d86f84de991` (cmsItemLinks, path `dining`). Sorted by Sort order ascending.
- Dinings fields: Home card image `646717a6cc09a61c694ee8156cfc628f`, Home card tagline `686388c181e8cf098aadd212d9589d4f`, Home card logo `94eda87f196c97bcc9ac64ae4a6e354a`, Show home card logo `728aa903f38fdb2fd76c4d8ec6d8180f`, Show home card name `3cff2fa4df9f58a2471d0886c314f6ff` (keep it the opposite of the logo switch).
- New item Solana Coffee `6ae0b8acc0da5ad663ec3476` (sort 5).
- Hidden static panels to delete by hand: `44176885-8e8b-207a-b8f8-643151dc2c23`, `2bf38960-f15b-0c2e-a653-9c2ff43c655e`, `58021a4a-2282-3da9-d6f3-6cd255426a90`, `477fc8ce-2d4b-2299-a281-ba587a51697e`, `82c90605-c3b2-ea18-1c0c-666ddb6d32f7`.

## M2 booking menu and mobile nav (2026-11-03)

Plan and specs: `docs/figma/build-plans/M2/`.

- Overlay Detail Panel Modal new props: Back link `a362365a-5601-7320-50fc-6eaa6d70cb26` (link, default `#`, bound to `_back` href; `_back` aria-label now "Back"), Show venues `da8f191f-7eee-30ce-1d52-753dd7d8c684` (boolean, default off).
- Overlay Detail Panel Modal new elements: Dinings Collection List wrapper `c4082697-d6e2-06ad-844b-26c351ecc6de` (list `...6df` class `_list`, item `...6e0` class `_item`, visibility bound to Show venues), item image `34a13abd-c79f-2de5-4cf8-a742962bdc8c`, title `dd5d6ddd-25fc-a569-da39-8cb9c8833e67`, text `5136e3c0-ba19-3b19-9bc1-9d1de79052c8`, reserve link `5cc287c7-f1f6-3f39-d6e2-516e425407d1` (`#`); stamp figure `b76fed49-4b7b-0e36-4d1c-fbf5afbb015d` (class `_stamp` `671b7104-fb98-9da4-8d23-658880173e30`, asset `6ad74da46b56ff1d7223e4d7`); wordmark embed `fa68ef71-3fc3-4d7b-ed7f-b255fc909bf1` (class `_wordmark` `32c47de1-791d-6ccd-1036-64ba096a1b11`).
- Designer only (the Data API reports "No source connected" and "Element is not inside a CMS context" inside a component definition): Collection List sort by Sort order ascending; bind image to Home card image, title to Name, text to Home card tagline.
- Variant styles at medium (and the panel, item and item figure again at small): Burgundy `0e56f707-a8b4-d396-c73a-900ce080b5db` bottom sheet, Image Bg `72048989-461a-61a0-ac02-cfc3ae7b6e5c` tall sheet.
- Class `booking-menu_component` `cda611a6-1b1a-56d5-4d55-22b1816b6fc1`.
- Booking Menu instances (page: element): Home `6ad64060ae8eac6d7b7c4241`: `68c1f6bb-0b8c-c6dc-8ca9-460bcc79cd09`; Blog: `13df46b0-90d2-78e7-464a-ec0d0801613b`; Happenings: `29b27bdd-ff1d-9eca-e53c-7ca25544264a`; Accessibility: `7c7fa480-f222-a2f1-1c58-66a9aca165c5`; Happenings & Stories Template: `0fb73488-0c28-8e71-656c-679624e8007a`; Post Categories Template: `18fbda13-c92f-9102-b3c0-81d94a8dc211`; Legal Corporates Template: `a2eb465e-3f72-87b5-4cf8-0030ff12c98d`; Dinings Template: `64c4880e-dcff-9db9-0db8-5e617a5d15df`; Rooms Template: `42936cd8-03b3-cafa-a1b4-b57996ca854c`; Neighborhood: `33ca2dff-0f67-ceed-01db-f7bbc7464c5a`; Meetings: `95f265b6-2da7-0398-8d83-00659101d06b`; Contact: `da3b4e68-a877-7966-e7e6-11e8fd7c40e1`; Privacy Policy: `77289c70-ab78-7695-68c9-4157c0b5a5b7`; Wellness: `12063b00-0e46-065b-1400-660bcbc4a5e9`; Arts: `b462261a-5cd9-1d8b-f6e5-d4b317da0650`; Gallery: `d6698e38-7d2e-db34-5588-94d538c52fa1`; Press: `7095c929-8cd5-d3fa-11ad-bdc5197e53cb`; Rooms: `8771eeee-c0b0-7ff5-2a68-829174a5cb59`; Guidelines: `c0ea796a-1561-c90e-2dc0-234ed7314b92`; Dining: `6aa9e796-749d-0ef7-71b0-25f2f6dfa6d0`; History: `dc1619b4-198b-6cfb-f845-27adf57a76a4`. Not placed: 404 (page unreadable through the Data API), Password, drafts, Quiz Options and Map Places templates.
- Site Nav new elements: `site-nav_modes-divider` `64b2b9ca-7b70-8683-5e69-8b2b11f86a15` (class `79f331d1-a0f1-4f78-1b6c-012d93c26aaa`), menu Book pill footer `site-nav_menu-cta` `09d441fd-3b6e-5517-00e6-28095c572eba` (class `8b72faf7-53e5-acd8-41d3-3124f6b19eed`) with link `b72137a6-3a79-1db5-50e4-8ce5b19b0199` (`button is-chamfer`, href bound to Book link). Class `site-nav_mode-label` `90621de8-b337-c7a2-326e-e6aff66ead91` on the day and night spans.
- Site Nav medium rules: `site-nav_bar` grid `1fr auto 1fr`, `site-nav_start` display contents, `site-nav_logo` order 1, `site-nav_modes` shown (order 2, row-reverse), `site-nav_end` hidden, labels hidden, divider shown; `site-nav_menu-nav` flex-direction column at every size.


### M6 mobile selectors (2026-11-03)
- Dinings Template `text-columns-info_footer` `ef08e59e-e1c8-4fa5-2e4a-441796698213`; "browse the menu" `52aa9b80-c93e-4cba-93d4-a8b9a21a9bc0`; "discover {name}" link block `eeea8d64-cd44-b37b-cbe1-36d7c4f43bd8` (href = `venue-site-link`, hidden until a "is set" condition is added), name span `ace5e8eb-31d5-3a08-081e-747b03cb5dbc`.
- Dinings field ids: Name `70ed532b8264438896ea60b6c714cb42`, Venue site link `f3d113ca4d82d0432a5b95ea45788c6d`.
- Style ids: `article-card-staggered_component` `1dfea01d-7b6b-d601-1af4-f839882d2c25`, its `is-right` combo `2b5ed087-cb62-4c51-49f1-90ece5e3967f`, `article-card-staggered_header.is-right` `abc99c11-07dd-a77d-609b-1fc1dfa80dc0`, `gallery-all_grid` `8038febe-99b0-d824-f8b3-4583200cc6e2`, `text-columns-info_link` `55f0dad8-f633-e2e9-9636-ec48766ef19d`.
- Feedback round 1: Overlay Detail Panel Modal prop Item 2 arrow `fdd9647a-7a7b-2c2a-6570-e5fdbf8b8f58` (boolean, default off, on in Booking Menu's Book Now instance); chevron embed `7db7c2d6-1db6-69d4-c57a-a0deaa632c7d` after the item 2 button, class `overlay-detail-panel-modal_item-arrow` `9fb123fc-e2a7-5ac6-f091-882ae05ba5a8` (shown only on the Burgundy variant, desktop and mobile).

## Hexagon scroll masks end full screen (2026-11-03)

Every `[data-scroll-enlarge-snap]` mask (home, dining, meetings, arts venue cards; wellness `tab-pills-intro` media) starts as the chamfered frame and ends at 100vw x 100vh on every breakpoint; `scrollEnlargeSnap` closes the chamfer as it opens. Styles (staging): `venue-card-fullbleed_stage.is-media-center` height 100vh (was 100svh), padding 0 (main and tiny); `venue-card-fullbleed_media.is-media-center.is-bleed` (arts) clip-path none removed so it starts chamfered, small 88% at 3/4; `tab-pills-intro_stage.is-media` height 100vh, padding 0 (main, small, tiny); `tab-pills-intro_frame.is-media` small 88% at 3/4 (tiny 4/5 override removed). Style IDs: stage combo `8d9bc185-0676-9ed8-2396-cee11cdc9481`, media combo `222996c4-543f-4453-e0e8-4e54d8816d10`, arts media combo `33776d90-b58b-d828-a1c6-61bd592d8f12`, arts stage combo `53bc5f3e-2c60-daa9-9f50-d3103ce3d7ce` (now redundant), wellness stage `7edab01b-3803-2197-e5de-84992e1f2da5`, wellness frame `d3cf047c-ac62-a9de-1101-dd72866c98ee`.

### Art CMS collection (2026-11-03)

Plan: `docs/figma/build-plans/ART-CMS/plan.md`.

- Collection "🖼️ Art Collection" (singular "🖼️ Art Piece", slug `art`) `6aea1e6d64c7d7b0d10c4012`. Fields: name `84fa6469a81cfd589939edf96044d6af`, slug `b213e9858baff670033abcf16e7cd52f`, `category` (Option) `0bd419969a18943fe61f5555ca0f076f` (Painting `46019741ea026965bb38daabdd574ce4`, Photography `d1b486ba72b33bbd4b1ae8723efb8f5e`, Sculpture `a8cd9d3fc544db60b35dfe6b8f9537d0`, Artists `ab98460e5525b70acda1162d698245d1`), `image` `75f824edc8b79ecadb308213e4191504`, `image-alt` `9de8650770412b88f80fa29296240576`, `artist-name` (display name "Byline", text includes "by ...") `8af62c3e4e85f84ee4c5f0a1a9ff3ff7`, `artist` (Reference to this collection) `6f5b6d91583e668c4383590cff5c6270`, `caption` `d4cc155c801af29b34a6dc89e5ac4a07`, `description` `aead1451e80d910e2fe7f29f30413ccf`, `tile-size` (Option) `13fb4cc1ba1939fb8c3e2ea6bf41cbbf` (Standard `6a228d964a43332e28e8aa95ad771212`, Narrow `35578f5fa1dec9cd55f6e553ec946717`, Wide `8d5470fea34443a9ce57cf0c897128b9`), `sort-order` `ef04d9c4338c2194c7339ea5bb38eaaa`.
- Items (sort, slug, id): 1 `oceano` `6aea1fc63a51b55c6214feea`; 2 `eva-struble` `6aea1f9c14b32bd4a05d8268`; 3 `copper-field` `6aea1fc63a51b55c6214feec`; 4 `shelf-studies` `6aea1fc63a51b55c6214feee`; 5 `reclining-form` `6aea1fc63a51b55c6214fef0`; 6 `portrait-c-1920` `6aea1fc63a51b55c6214fef2`; 7 `yellow-interior` `6aea1fc63a51b55c6214fef4`; 8 `the-reading-room` `6aea1fc63a51b55c6214fef6`; 9 `cornerstone` `6aea1fc63a51b55c6214fef8`; 10 `after-hours` `6aea1fc63a51b55c6214fefa`. Only oceano and eva-struble carry real copy; 3 to 10 are dummy copy (Stephen, 2026-11-03).
- Component "Art Detail Modal" `4e402659-32e2-fddb-7dd9-6c1d17f58318` (group Modals): duplicate of Overlay Detail Panel Modal minus the venues Collection List, because Webflow refuses a component holding a Collection List inside a Collection List. Dark variant `073d0fa4-94a1-acf2-2fc3-603a8075367f` (Variant prop `073d0fa4-94a1-acf2-2fc3-603a8075367e`). Extra prop "Artist dialog id" `62e4dd14-c690-dbaf-aa26-eda0aedf9fbe` feeds `data-modal-open` on the eyebrow link `4e402659-32e2-fddb-7dd9-6c1d17f5832e`. Other prop ids match the source component.
- /arts grid: Collection List `d709e584-55e2-e281-c915-c0c5b0cc9fbd` (sort-order ascending), list `...9fbe` (`gallery-all_grid`), item `...9fbf` (`gallery-all_item`, `data-gallery-filter-item` = Category, `data-tile-size` = Tile size), link `36494e5c-2028-b96e-4926-d30708a327bf` (`data-modal-open` = Slug, `aria-label` = Image alt, href `#`), image `c3e039ac-c5e0-b902-2f3d-852e13540c3c`. Tile size CSS embed `d1cc5f31-965c-8ffa-4861-f440a909d6a1`. Old static grid `e9601f7e-0e0b-a08f-c519-ed9e04531c85` hidden (visibility off).
- /arts dialogs (children of `.page-wrapper` after the Booking Menu): artists list `438c4fed-c368-cd52-7ca7-433ffb192360` (filter Category = Artists), item `...2362`, Art Detail Modal `baf1e5a6-f6b4-afd6-5e1a-4d6904b050ec`; artworks list `5e96290c-aa6f-40b6-f65c-7f1d25333877` (filter Category != Artists), item `...7879`, Art Detail Modal `12203225-e1c0-00dc-027f-a3cec9537d14` (Artist dialog id = Artist > Slug). The ten static Q041 dialogs are still on the page (ids in `docs/figma/build-plans/Q041/build.md`); no trigger opens them; delete in the Designer once approved.
- Home art trail: Collection List `fb3de0d7-4fc4-f208-ee77-41404293a566` inside `home-art-stories_media` `ba005e8c-320c-eaf7-387f-5fd7dae49519`, item `...a568` holds trail link `cf95f345-0c95-f8a3-8071-b31ed7a6fab9` (`data-cms-link-path="arts"`, `data-cms-link-anchor`, `data-cms-link-slug` = Slug, href `/arts` fallback) and image `31ce028f-780f-fabd-80c2-7e100860d6ff`. Old static trail links `b5e4c3ae-…`, `93e53b26-…`, `ef6aae9d-…` hidden.
- Art modal gap (Stephen, 2026-11-03): combo `.overlay-detail-panel-modal_content.is-art` `b7372605-8540-0775-e536-a11e8ea49a65`, medium and below `padding-top: 0`, applied only to the content element `4e402659-32e2-fddb-7dd9-6c1d17f58327` inside Art Detail Modal. Stacked image-to-title gap 104px to 40px (mobile Figma is about 34px). Desktop is side by side and already matches the Figma (160px vs about 145px), so it is unchanged.

Correction (2026-11-03, Stephen): full screen is mobile only. Desktop is back to its pre-PR 129 state: `venue-card-fullbleed_stage.is-media-center` main padding removed (base 1.25rem/2.5rem applies), padding 0 at small; `tab-pills-intro_stage.is-media` main padding 1.25rem; arts `is-bleed` media clip-path none at main (as before), chamfer polygons at small (2.25rem) and tiny (1rem). `scrollEnlargeSnap` closes the chamfer only below 768px.

## Bottom menu standard (2026-11-03)

Neighborhood anchors for the category menu (links `#dining`, `#arts`, `#beyond-downtown`, `#services` resolved nowhere before): `section_neighborhood-corporate` `27d33c91-12c5-fda1-b47b-d48cba90eb77` has DOM id `services`; component instances cannot take an id, so plain div wrappers hold them: `#arts` `db393c4c-b55f-32c1-5bc7-7215d68af2cd` (Offers Slider Split, arts & culture), `#beyond-downtown` `eae82305-f35e-70a9-9813-0c1d0c775766` (timeline-scatter-images Tall), `#dining` `8ae457cb-4758-3a37-d270-ed267afe0a2b` (Article Card Staggered Tall).

## M7 mobile parity (2026-11-03)

- Map Feature Image Bg (`5d830b69-6507-7d04-4828-069b2539cffb`) variant **Stacked** `a6eedfb4-4763-3aa6-88c1-4e4d7fd40feb` (small: `map-feature_component` full-bleed with padding-top for the map); Variant prop `46987a8f-669e-92a1-2b93-034c8cf33e23`. Meetings instance `4e3db501-831b-1b5b-afc1-4940b78cd846` uses Stacked.
- timeline-scatter-images Tall (`33e949df-43c2-4806-b73e-d403ed483051`) variant **Stagger** `6a92abad-32b0-27fd-e4b6-5a5ebcbe05fb` (small: item max-width 87%); Variant prop `8c239c8f-35ae-dcfa-c80c-fdba806412de`. Neighborhood instance `f0bc6eb9-7e60-97a9-6b5c-90074ec14682` uses Stagger.
- Variant ids written at small: Overlay Detail Panel Modal Centered `34ca996d-2f65-a59e-6eb0-09dd065e4534`; form-split-script-contact Tall `c284c9dc-42be-882d-5aca-03608bebfc95`; split-image-text-light Stagger Mid `8dcc8de6-914e-f2a6-a0b5-5f95af173bdf` and Wide `45de7441-0ac3-59ed-e7fb-5c6524848b2d`.

### Gallery and arts mobile fixes (2026-11-04)

- `gallery-all_scroller` `905de9f4-435c-b977-9471-955e27bed58d` (small: overflow-x auto, overflow-y hidden). On /gallery: new wrapper `03a5c029-e4e1-f9b6-6249-7e27b2fc1cd5` around grid `e51108a2-f6cb-cedd-a0df-94e6133b040c` (section `491dcc4a-ded6-d478-3c57-c03ccedf4070`). On /arts: the CMS wrapper `d709e584-55e2-e281-c915-c0c5b0cc9fbd`.
- Arts mobile mosaic sizes live in the arts tile embed `d1cc5f31-965c-8ffa-4861-f440a909d6a1` (max-width 767px block).
- Art Detail Modal `is-art` combos (small only): `_panel` `a91ff8df-07eb-fe4f-b26a-f345e4dff72a`, `_bar` `27d7a61f-849a-10af-ab87-577f030c1040`, `_back` `be807ebd-4535-46e7-e2a7-a8678dddf180`, `_back-icon` `e337637e-a703-4ae4-a88a-0f5f71c6f3f1`, `_back-label` `dfd3c147-05ed-2da2-3131-dd55fbef865e`, `_layout` `748b456c-043b-f3d1-b765-76564f4af375`, `_header` `0287b837-d987-d7fc-1f1a-3e059f833602`, `_figure` `56568eb9-0f4d-c021-89d2-a0b2299f47b7`, `_body` `149569c9-2a63-16e5-3b1d-8866afc908b9`, `_caption` `2e204a2e-63a3-0dfd-a983-fa0562b01212`, `_eyebrow-link` `fb321fb0-7112-5ca5-5a67-5f7f1ec44c4a`; `_content.is-art` (existing) gained small display contents.
- Dining-only variants (mobile fix, 2026-11-04): Split image text light "Olive Dining" `42c9f9a1-d85c-7fa8-47d7-f5d9df7eaa79` (Dinings Template intro instance `0f87c04b-e622-8542-b5b9-e63fcb77ed4b`), Image Trio Text "Dining" `0d31b24e-acf0-8dd5-cf1f-9e3e1163cd12`, Gallery Mosaic Captioned "Dining" `76af03c7-cd03-42c9-a8b6-104e98388a6c`, Map Feature "Dining" `0a163214-6dd2-ca63-86b5-432c1c1678d5` (/dining instance `afb2623e-14c5-c312-4886-1066ab5e3f8f`). Combo `text-style-eyebrow-caps.is-info-title` `f24ce554-adee-7c9f-39d6-bcff410ae599` on the text-columns-info titles.
## Mobile fix variants (2026-11-04, audit A)

Page-only component variants created so mobile fixes stay on one page:

| Component | Variant | ID | Used on |
|---|---|---|---|
| Image Trio Text | Home | `45b71a39-9a72-e800-bd67-7e1967d510de` | home wellness |
| Map Feature | Home | `a65a3b03-fb07-bd94-4702-0e0a50312c90` | home neighborhood |
| Split image text light | Olive Home | `50d0d660-fa88-c432-96fa-679fbe31a938` | home west coast |
| Offers Slider Split | Home Press | `f84b5e41-318b-031e-bf40-a39878fb30b4` | home offers, press offers |
| Card Carousel Header Left | Contact | `d0c45960-92d6-af25-7b58-b128d8a0affe` | contact |
| Card Carousel Header Left | Press | `49cffb92-bfd3-18d8-c68b-64f96a7dd632` | press |
| tab-pills-intro | Press | `59a1b413-f64f-13c3-5d27-710cb741a3c0` | press |
| Article Card Staggered | Press Left | `0902c2b4-6d7a-a4a3-2fc7-34782f6e7bcd` | press (left cards) |
| form-split-script-contact | Press | `69366689-4811-652d-211d-fe0e9582a917` | press enquiries |
## Global mobile fixes (2026-11-04)

| Style | ID | Notes |
|---|---|---|
| `form-split-script-contact_fieldset-heading` | `3d2174f9-a106-8e5d-8577-d46957ec2c0f` | Added to form group h4s (form-split-script-contact component elements `…d6cc`, `…d6db`; contact page `07a35c59-be98-d419-110c-e66052bd7c2f`) |
| `.form-split-script-contact_fieldset-heading.heading-style-h4` | `13152a87-41ec-4358-beb2-e328ba0473bd` | small only: 20px / 27px / -0.05em |
| `article-card-staggered_title` | `a3bd4e23-634c-b64c-76d9-4ca808906bc4` | Article Card Staggered component title `…8d02`; happenings and blog page card titles |
| `.article-card-staggered_title.text-style-eyebrow-caps` | `5aad4fe4-7022-4c79-74de-dff7d8c787d9` | small only: 14px / 16.8px |
| `.button.is-chamfer.is-outline.is-dark-mobile` | `8eb972af-c72a-f8fd-8065-9a927dde8571` | home art stories button `c646bb3c-5d24-a68c-9c40-b1bfae796408`; mobile-only dark fill |
| `rooms-collection-quiz_heading` | `e60cac7e-2e25-e9f7-abde-70ff6e920453` | rooms quiz h2s `231e48de-…`, `868313c8-…`, `c1a1b751-…`; combo with h4 `f661ec5f-0e9b-039f-f6e1-deac7a912e25` |
| script-intro-centered variants | Large Heading `e4bd4c20-6499-56f7-64db-9fa47a4a1f40`, Small Heading `a23a1a12-25dc-a914-6611-89f4d3beedb4` | room template and guidelines instances |
| Hero Fullbleed Centered variant | Short Mobile `54ea4c9c-7c59-c93a-98e3-4eb98a1b7ff2` | guidelines and Legal Corporates template heroes, 660px below 768 |
## History George Marston slider (2026-11-04)

- Split image text light (`663131a8-3362-867e-25ef-28b6d3d209a2`) main figure now holds `split-image-text-light_slider-wrap swiper_slider` `0468e9b4-e9d7-0ec7-7299-cc3943e8a027` > `_slider swiper default` `925a803d-f674-f939-fd20-e97b1d293041` > `_slides swiper-wrapper` `8094e204-4bf3-175d-c367-136b65d10393` > three `_slide swiper-slide` (`cc8bf6b0-10ed-9f7d-bfe9-f88807675c65` holds the Image prop image, `18587711-f792-cb77-7bba-2fcb49b38788`, `b75076fc-5b78-1823-0e0c-2f2642544725`), plus `_pagination swiper-pagination` `6df850c5-73eb-9662-1824-5e0c47d6c3d0`.
- Props (group Slider): Slide 2 image `06e1bc70-82a9-6a23-5b00-2d708fccdba4`, Slide 3 image `97f2b880-47b9-c51a-fc79-baee10d6e06f`, Slider visible `c6dc2733-40e7-4e4e-3cc9-046885f44ccb` (default false; shows slides 2 and 3 and the dashes). On only for History instance `9e330597-a057-06fa-a371-cf4db3c7d72c`, whose slides 2 and 3 repeat the Marston portrait `6ad67007cf42363c3ffe3d61` until real images exist.
- Dash styles live in the Global Styles `style-overrides` embed (Swiper CSS variables plus `.split-image-text-light_pagination .swiper-pagination-bullet-active` width), because the style API rejects custom properties and Swiper's CDN CSS loads after the site CSS.
- `split-image-text-light_stamp` small: absolute, left 69.4%, width 46.4%, margin-top 92.7% (of the article width, so it tracks the portrait's aspect ratio); `section_split-image-text-light` small: overflow-x clip.

## History mobile image parity (2026-11-04)

Small-breakpoint (below 768px) sizes matched to the mobile Figma (`14:11113`), measured at 390px. Patterns: full 350x480 (`is-full`, `is-wide`, `is-small`); left 266.5x315 = 76.1% (`is-founding-square`, `is-ymca-square`, `is-large`); right 175x226 = 50% + margin-left auto (`is-portrait is-founding-portrait`, `is-opening-square`); 244x200 = 69.7% (`is-portrait is-opening-portrait` left; `is-large is-ymca-large` and new `is-small is-future-small` `44143ec6-4850-8e50-ab41-8af9b0116aff` right, on 2026 detail figure `06504f20-0896-0fd7-b70a-8532dc2faa01`). `history-timeline_figure` small gets overflow hidden (without it the lazy image's natural height overrode the aspect ratio). Timeline list, item and row gaps 7.5rem at small, `is-founding-wide` margin-top -2.5rem (Figma 80px between 01 and 02). `map-feature_figure is-centered` small: 100% wide, 350 / 199. `gallery-mosaic-captioned_figure` and `is-wide` small: 13 / 16 (390x480, all 7 instances).
- Year badges and labels (small only): the sticky `history-timeline_label-wrap` is hidden below 768px; four static badges `history-timeline_label is-static` (`41a5179b-cebc-dbb2-515c-30feef825cf1`; 24px, -0.1em, 36px tall, 6px chamfer, 40px from the image top, `is-founding` `198ed572-37bc-959d-33ad-52e6fa390e00` 58px) sit in the 1924 building, 1924-1970 portrait, 2019 wide and 2026 wide figures (`f8124f7f-37b7-6585-77b1-a96b96004876`, `d332098e-7fb3-f6ab-66ca-8bd6d84c56ed`, `219da847-684c-686f-ea74-53d4681e7ed9`, `2f443a4f-c2bb-4826-bed2-8c5685aee7c5`), hidden on desktop. Year eyebrows `history-timeline_year` (`75e5f12f-ad1d-d996-9c83-68c0f6837de3`, 12px, display none above 767px) open each item header (`eaa56c61-66a7-6c47-6d43-c72044102523`, `52cc5729-2c5f-c566-0fca-41836cf6d693`, `ee95dcd9-c8fb-81bf-a3f9-253ef5c2aa20`, `99af6a24-547b-99ac-1f24-c9df5916cf13`).
- Mobile type: family classes added before the utilities, sizes on the full combo chain so they outrank them: `history-timeline_heading heading-style-h4 text-weight-normal` 18/27, `history-timeline_title heading-style-h2 text-weight-normal` 18/21.6, `history-timeline_range-text text-style-eyebrow` 12/18, `history-oasis_heading heading-style-h4 text-weight-normal` 18/21.6; `history-timeline_text` and `history-oasis_text` 16/20; oasis left aligned. Section spacing: `section_history-oasis` margin-top -4.5rem, padding-bottom 5rem; `section_history-timeline` padding 5rem / 7.5rem.

### Gallery canvas (2026-11-10, unpublished until the release carrying `galleryCanvas`)

Plan: `docs/plans/2026-11-10-001-feat-gallery-canvas-plan.md`. Layout CSS ships in `site.css` (`docs/reference/site-head/gallery-canvas.css`); Designer holds only attributes, the control pill and class names.

- Styles: `gallery-all_controls` `22f42074-72c0-3155-b228-03224ae12221`, combo `tab-pills-intro_tabs.is-canvas-controls` `97c3831c-0fa7-3e03-99ea-b5fd97c05b52`, `gallery-all_zoom` `67c401b6-5242-1176-05ce-1c6b1045dd5f`, `gallery-all_joystick` `25e58c92-52e6-0589-f5f3-66025747ed19`, `gallery-all_joystick-knob` `00b57fb7-a88a-cf24-562e-b09286dd69c5`.
- /gallery section `491dcc4a-…` got `data-gallery-canvas` and `data-eager`. Controls `815fd992-eee5-cb63-fe7c-a9d669351544` (pill `a76da63c-0f18-051e-3501-3ca07f1b2ae8`, joystick `90f2159e-eb4e-b215-e1cb-ef16bb1125da`, knob `19ed531f-5688-1140-09c5-d0ef976c1891`, zoom `609f879a-1658-769b-7636-5e5fe03fef3c`; links out `5f164d13-4b66-efb7-0b33-5909ba98c86c`, reset `c55c9b93-08f4-f3a9-0ea7-80f2c5594ccb`, in `01537319-9fa3-d150-af0c-0d7b4ece18a0`, href `#`).
- /arts section `24baf9eb-…` got `data-gallery-canvas` and `data-eager`. Controls `2c39e5cc-277e-7ca3-e305-4aefc897803d` (pill `f0e6ab54-48fa-a5ee-e0df-2cf59a3d2982`, joystick `102edc90-da9b-d7b8-fea6-15a376413e36`, knob `44c6ae09-b2b0-bf67-c326-9ddea6a488b0`, zoom `ea29f328-8bc9-76d1-4ab9-41531e3d67e7`; links out `c34c5912-a8c3-6d9a-7e12-e0e709165655`, reset `3d95835d-323a-fc61-75cc-9170a1d35797`, in `c7a3240c-e60f-fa23-591a-2845db8fc6c6`).
- Removed the /arts tile-size embed `d1cc5f31-965c-8ffa-4861-f440a909d6a1`. Its code, for rollback: `.gallery-all_item[data-tile-size="Narrow"]{width:14.25rem}` `.gallery-all_item[data-tile-size="Wide"]{width:30.3125rem}`; below 767px `.section_gallery-all.is-dark .gallery-all_grid{width:1344px;column-gap:18px;row-gap:18px}`, items `254.4x295.8px`, Narrow `162.2px`, Wide `346.5px`.
- Still to do at release: footer tags for `gsap@3.15.0` Draggable and InertiaPlugin before the bundle tag.

### Gallery and arts seed (2026-11-10)

- Collection "📸 Gallery Photos" (singular "📸 Gallery Photo", slug `gallery-photo`) `6af3531acf4b88863f651db9`. Fields: name `40f5791368cd447996dd1ec86fa8076a`, slug `7dfd0ae9d43393bce939dc1287c4b9ba`, `image` (required) `d78b5d2567a03b7dcdc34bea932e95ca`, `image-alt` `dee2c5a0760f95855e3dcf8593f41f61`, `category` (Option) `0d0beb373da9a79311f499c757fc7316` (Design `3e8d8971f4edae3761af1b3c17171772`, Wellness `4e0d256b9c4978d8cce3da3fff00fad8`, Dining `334a7215f11313d04333b393b56ec959`, Rooms `a2c07b3dc0b24aec7a33f27220b8e75f`, Guests `1fc98218f6ef0a70158c8176ae37f934`, Amenities `a33bfce20399e313a19d746eb9306ddb`), `sort-order` `c16baba88e384fb59545764801a5cb90`. 35 items `gallery-photo-1` to `-35`, each a different library photo, mixed by category.
- /gallery Collection List `7c2aed59-770f-d223-45a1-3475154461ba` (`gallery-all_scroller`, source Gallery Photos, sort-order ascending), list `...61bb` (`gallery-all_grid`), item `...61bc` (`gallery-all_item`, `data-gallery-filter-item` bound to Category), image `22189d96-1fbc-b628-b302-344db6a922b1` (`u-image`, asset and alt bound). Old static wrapper `03a5c029-e4e1-f9b6-6249-7e27b2fc1cd5` deleted (2026-11-10, Stephen approved). Template page "📸 Gallery Photos Template" `6af3531acf4b88863f651dee` stays: template pages cannot be deleted or drafted through the API (400), and its item pages return 404 and are not in the sitemap.
- Art Collection: 25 dummy pieces added (sort-order 11 to 35, artist-name "by the guild collection", photos not used by the first 10), 35 in total.
- Home art trail Collection List `fb3de0d7-4fc4-f208-ee77-41404293a566`: limit 10 (sort-order ascending), so the homepage loads the first 10 pieces only.
- Each Collection List shows at most 100 items; the /arts grid and its dialogs list hit that cap at 100 art pieces. Load-more or auto-loading is deferred.
- Component "Gallery Canvas Styles" `51c17234-82ff-8a78-73f9-94810497ec9a` (group Embeds): one HTML embed with the minified `docs/reference/site-head/gallery-canvas.css`, so the Designer shows the canvas layout. Instances: /gallery first child of section `491dcc4a-ded6-d478-3c57-c03ccedf4070`, /arts `7d71ed9f-3a5c-0c3b-e8fe-fa30281c21a0` first child of section `24baf9eb-aff0-c360-f1f8-f888bded5884`. The CSS left `dist/site.css` in v1.2.10. Convention: `docs/solutions/conventions/designer-visible-css-embed-component.md`.

## Button system (2026-11-12)

- Site Nav component `fc94d1a2-3399-4de0-e836-0233a6c86cdf`, embed `3639f68c-0d1e-0355-fd6d-d61a7593a03d` holds `<style data-button-system>` (minified `docs/reference/site-head/button-system.css`).
- Combo styles created: `.button.is-chamfer.is-dark.is-outline` `8993f494-c263-4e55-0364-509c609ad5cc`, `...is-dark.is-outline.is-dark-mobile` `04702217-1132-4bbe-4f8b-e0cc6d1a10c3`, `.button.is-chamfer.is-outline.is-fill` `a02f8aad-81bc-447d-4046-dcd8cd3ab3a7`.

### Corporate/Legal template spacing (Trello Corporate/LegalTemplate-Desktop, 2026-11-12)

- script-intro-centered variant Legal Corporate `53add6a3-3c55-e4ed-2f36-460edae2cb76`: `script-intro-centered_heading` max-width 47rem (medium 38rem), margin-left/right auto (two-line break after "focus,", same pattern as the Bottom variant); `padding-section-xlarge` padding 11rem to 9rem (main only).
- Card Carousel Header Left variant Legal Corporate `69ec3688-574e-61b2-83e0-6c45e105cc09` (duplicate of Base): `section_card-carousel-header-left` padding-top 2rem main (medium 7rem, small 6rem kept as Base). Template instance `a801d156-90c7-64a8-7607-c16886341a7c` uses it. FAQ to "More of the Guild" gap at 1440: 439px to 256px.

### #186/#188 Site Nav menu images

- Site Nav component `fc94d1a2-3399-4de0-e836-0233a6c86cdf`: menu `...6cf4` (`data-hover-swap`), list `...6cf9` (`data-hover-swap-list`), figure `...6cf5`, default image `...6cf6` (`data-hover-swap-media="default"`, asset `6ad6700aba96f2e53726c671`).
- Menu images (`site-nav_menu-image is-swap`, key: element id, asset id): rooms `f6c8fcb6-8dd4-60fa-9203-71d7e358450d` `6ad66ff96684c3e22ea4e1af`; dining `8c234f4e-0fa2-d969-829e-c07cb2c7643a` `6ad66ffa6684c3e22ea4e2ca`; wellness `a5c195a6-5ef4-4f64-c292-08e84674be23` `6ad67000240d911fb18d77af`; happenings `85d489bd-2a58-7756-af6e-f9294f68c48a` `6ad6701b6684c3e22ea4f00f`; history `c8db0c45-618f-2b75-7ac6-ef7e03f6576f` `6ad6700aba96f2e53726c671`; meetings `fcb26226-7112-036c-0e7e-634d3408c374` `6ad66fef6684c3e22ea4dc76`; neighborhood `74656b33-6d89-1aa5-77e8-89f6a3871a6d` `6ad66ffe58367429abb48c84`; arts `872a443c-b04b-422d-3289-1a4bd38fdc2e` `6ad670147e3d6550932e0fac`; gallery `588ce461-c0a4-b8ed-d84e-ad30fdbdd26f` `6ad67015134731ad1b928187`; blog `7751ee52-cfe9-6227-b91b-11bc68023bf0` `6ad66ff96684c3e22ea4e1af`; contact `53dba91f-ad2a-d5fc-3f2b-2d3154a71e55` `6ad6701a28c5dc695c82c539`.
- Image props (group Menu images, default = asset above): Default `1bc32968-80df-5d5c-cf72-5234fcd92fd6`, Stay `2b71b432-dbdf-7b47-074c-ecc8b62279e3`, Dine `bd3d2aac-36c1-d4a9-ab3c-ac41978d469c`, Wellness `b08361f6-2d82-d692-7e48-57034ec9f29f`, Happenings `548e3697-d576-1460-3af6-0cac36519f11`, Our History `b2bf4c18-4bfb-1882-e854-cc986cfadf5a`, Meetings & Events `e91b4fb2-be70-b2cf-1cab-5c3a66e4b697`, Neighborhood `958d7688-e42f-5ea2-1fa7-78e8af68e38d`, Art `278e5326-f29e-8768-afc8-01c9c202c5cb`, Gallery `84885921-7b89-d22f-a5cf-5df09b191c8e`, Blog `ae75ab36-d05c-cbb2-12b7-d66c147d1892`, Contact `d893e6a8-a816-d8a9-4fc1-b32efd028b0f`. Image `assetId` is bound to each.
- Styles: `site-nav_menu-image` `b2ae28c1-b54d-f2c6-975e-4e4087facf4b` (now absolute, inset 0), combo `site-nav_menu-image.is-swap` `0e3336f3-b4d7-9f97-e4b6-48edc45c938a`.

## Press collection (2026-11-16, #181)

`📰 Press` (slug `press-item`) `6afb2abe0f4d8650f6774820`, created through the Data API to replace the five hand-placed Article Card Staggered instances on /press. Left and right alternation comes from CSS on the list, not from per-item data.

Fields (slug: id): `name` (article title) 0e46547820f605e99380132f24d35a2b, `slug` 99b4090843faf2b750d005fab8776dbf, `publication` (PlainText, required) 3050155dcdbcab181b86167917ed612a, `external-url` (Link, required) 220f80cd24b47f6a23dfb1fdfc382956, `image` (Image) 41732b3109069e580d9ca6ece2314f06, `logo` (Image) db231d8144faf15aa5d9d4fe835adba2, `order` (Number, sort ascending) 3243cd1e205c48536b3e4656eec32274, `press-category` (Reference to Press Categories, required) 376cecea332874074444310c7d676cfb.

Items (published 2026-11-16; `external-url` values are placeholder publication homepages until Omar sends article links): national-geographic `6afb2acdeba5601304223750` (order 1, Press), forbes `6afb2acdeba5601304223752` (2, Press), there-san-diego `6afb2acdeba5601304223754` (3, Press), global-grasshopper `6afb2acdeba5601304223756` (4, Design), architectural-digest `6afb2acdeba5601304223758` (5, Community).

/press single list (2026-11-16, #181 final): one section `96794fc4-6dae-0d3f-aa7e-04e41178e72b` (`section_article-card-staggered`, `data-press-list`) > `padding-global` > `container-large` > Collection List `a140acfe-439a-4c6c-0592-2b21dcd07ce9` (source Press, sort Order ascending), item `a140acfe-439a-4c6c-0592-2b21dcd07ceb` (`article-card-staggered_component is-cms`; attributes `data-press-item`, `data-press-category` = Press Category: Slug, `data-press-category-order` = Press Category: Order). In each item: category header `6f0ef27d-d4aa-529f-0637-58957141228f` (`article-card-staggered_header`, `data-press-heading`, DOM id = Press Category: Slug; h2 `efe53c93-0638-c92d-bfdd-2ca1f5dc2132` = Press Category: Name) and card link `48389540-7110-a203-4bfd-f789bed728ee` (`article-card-staggered_item is-link`, href = External URL, `target="_blank"`, `rel="noopener"`). The `pressCategories` module (runtime-modules.md) groups items by category order, keeps the first heading per category and rebuilds the subnav tabs. Combo `is-cms` `2fe5a239-9ee2-6766-6450-22a228c17e8e`: 3rem top and bottom padding, `:nth-child(even)` aligned right. The three per-category sections, the Category option field and the "Press Section Styles" embed instance were removed; the component definition `e77687b2-205a-6e4f-e22b-b43f671f9e23` is unused. Known gap: on phones the even cards keep the publication line and the base eyebrow size.

`🏷️ Press Categories` (slug `press-category`) `6afb3561e46519364ff54c39`: fields `name` 262d60527759350c9025b85adeb719bd, `slug` (the page anchor) 7ccef46d45d4114041df7cff6559b5ec, `order` (Number) c6af895139bdcf06d1a9c236f2ada149. Items: press `6afb3562ab0a1a377965b293` (1), design `6afb3562ab0a1a377965b295` (2), community `6afb3562ab0a1a377965b297` (3). Press items reference it through `press-category` (Reference, required) 376cecea332874074444310c7d676cfb.

### M41 Packages collection (2026-11-17, #246)

- Collection "🎁 Packages" (singular "🎁 Package", slug `packages`) `6afc5ac0f547318572484bb6`, created through the Data API as a copy of 📰 Happenings & Stories (the Blog collection). Same fields, except Category is optional here (required on Blog) because no Packages category exists in 🏷️ Post Categories yet.
- Fields: name `d4f8a358ea52be372502f83b2d3d6934`, slug `50b0c7a3e9dff29839c5badaf075a135`, `date` `6617b2f977dee9cbb66fe99c1fe0c60a`, `hero-image` `7ed4662a1ea1b38b4f00802ad5d36f91`, `excerpt` `f21b41ecec69a8ac2b792ec1d677da0b`, `body` (RichText) `b67e60a1cac65c5bee29ba380079a8a3`, `body-highlight` `22de5893d67b6800ce4b9b947bede6f4`, `category` (Reference to Post Categories, optional, empty on all items) `e7fdae9ddc219ef903c73e5ca404e19c`, `topic` (Option) `d2d60380fc929173561617806480fcaa` (dining `7e597e7246955d65ba876b2c9a7ee032`, culture `d3a9017fe31881cdab5bbe0534d09c67`, conferences `c98b69b1193764a5226168e94bc33773`), `inset-image` `4561658e29a43402a10201ffe14e446b`, `highlight-image` `ab9fdefc07d130aea306713f0fcae591`.
- Template page "🎁 Packages Template" `6afc5ac0f547318572484bda` (path `/packages/<slug>`), built through the MCP on 2026-11-17 to match the Happenings & Stories template.
- Dummy items (placeholder copy, ready to publish; live from the 2026-11-17 site publish): romance-at-the-guild `6afc5ad1beefd93d9ef64fec` (dining), spa-and-stay `6afc5ad1beefd93d9ef64fee` (culture), culture-weekend `6afc5ad1beefd93d9ef64ff0` (culture), meetings-made-simple `6afc5ad1beefd93d9ef64ff2` (conferences). Images reuse the Blog items' files (same fileIds, no re-import).
- /packages lists (topic groups keep the /blog element ids; source 🎁 Packages, filter Topic, sort Date descending; the Blog category filter is gone): dining `bee9c2ca-2288-5ed8-aa78-38d08bc4a5e5`, culture `deb440fa-91ce-0ff1-fc30-d7579fe6746e`, conferences `e29221f4-8ae7-7ea7-9b66-d32845dd30b6`. Card links carry `data-cms-link-path="packages"` plus `data-cms-link-slug` bound to Slug (cmsItemLinks). To repoint a list headlessly: clear every binding inside the item first ("Cannot change source: the list's item template contains bindings"), then set `source`, then filters and bindings.
- Packages Template elements: page-wrapper `73dceb19-48e8-1a53-96bc-96f36f592e1b`, main `1f9e3588-a728-522e-36ec-44f91945ef3c`. Instances: Site Nav `8476dd44-551b-48e6-2792-e2cce27d1a91`, Global Styles `63152fb6-94e9-9004-a6c6-02f02a67c583`, Hero `4735e491-d0f4-6634-0367-1c464057d916` (Image, Eyebrow, Heading, Text bound to hero-image, topic, name, excerpt), image-inset-single `dc8e5553-3942-798c-5642-40ff9eb10f5d` (inset-image), Split image text light `9208c743-5882-e764-6f5f-8cc6689355c7` (body-highlight, highlight-image), Card Carousel `167a434b-332c-3971-614c-b6c8c8313b49`, Offers Slider Split `39020737-ad10-4e65-a35e-432805feba86`, CTA `fb1c8b44-b7d2-1a85-f0a9-11afaa85d4b7`, Footer `8fee9ac8-7da5-5f47-a16f-8e858e03c9fe`, Booking Menu `01ccc450-5739-b149-a377-66092572366f`. Native: article body section `06e56b0b-3dfe-bdcc-2f8a-8d598241610f` (date `0e855457-968b-a45e-e18e-3d617e176ff9`, body RichText `f234796b-57b6-25c3-8bda-1871d526127d`, learn more button to /packages `30053856-d284-ff59-a640-a93b6a484b18`); more packages section `163d1682-4756-103c-13f3-f06d8600e9a3`, Collection List `bc87bd65-93d5-d320-2958-abbbf036c98e` (limit 2, excludes current item by name), card link `2a9789b7-438e-b1ae-07d3-ae8a3ca8cd73`.
- Nav and footer: Site Nav menu link "packages" `85c56e77-78d0-790a-8dcf-6d3f40e89ac0` (after blog, `data-hover-swap-trigger="packages"`), hover image `67f804f7-05ae-965c-b611-6e079fd6f294` (static asset `6ad67015134731ad1b928187`, no prop yet). Footer Links "packages" link `14efd120-8e4c-efe3-75b9-396e4792edb5` now points at the Packages page.
- Empty-group CSS embeds (/packages `fb7823b2-4f49-25e7-6a24-7f5a901b8bd3`, /blog same id, /happenings `e1278dda-645e-595d-cd90-59765c8845d5`) now hide a topic section or tab only when its list has no items (`:has(.w-dyn-empty):not(:has(.w-dyn-item))`). The old rule matched in the Designer canvas, which always renders the empty state, so all three topic sections vanished there (2026-11-17).
- Packages Template SEO title and description copy the Happenings & Stories template (`{name} | The Guild Hotel`, excerpt), set through the Data API.

### Mobile feedback Designer fixes (2026-11-17, spec #229, tickets #236 to #245)

- Hero Fullbleed Centered: new variant "Centred Mobile" `01657e35-c8ea-ba29-677a-6c81e6c66f74` (content centred vertically below 768px), used only by the /rooms hero `bc0c1393-1d0f-8b55-c877-9b1e69e1ce9e`. All other Hero variants carry `min-height: 100svh` at small and tiny (was 800px; `54ea4c9c`, Corporate and Guidelines, was 660px).
- Gallery Canvas Styles embed (`51c17234-82ff-8a78-73f9-94810497ec9a`): adds `[data-gallery-canvas] .gallery-all_scroller{height:100svh}` below 768px; source `docs/reference/site-head/gallery-canvas.css`.
- Footer on phones: `cta-booking-newsletter_background` and `footer-links_background` are `position: fixed` at small inside `clip-path: inset(0)` sections (one pinned photo). Logos carry `data-eager`: Bonvoy `916e4ffc-007b-3572-a686-946c6645b308` (CTA Booking Newsletter), Tribute `14efd120-8e4c-efe3-75b9-396e4792edf9` (Footer Links).
- /arts grid Collection List `d709e584-55e2-e281-c915-c0c5b0cc9fbd` filter: Category does not equal Artists (`ab98460e5525b70acda1162d698245d1`). "artists" filter pill `3bbb8f3c-b08a-b180-a1ff-f7a9f73c4335` hidden.
- Corporate (Legal Corporates template `6ad67d74943352af06e37850`): class `feature-grid-dark-eyebrow_item-figure` `7bbeeb1f-adbe-334e-2285-7d27568ea16e` (hidden, shown below 768px, 16:9); one figure per Why teams row: `4551885b-e040-c02e-c7d8-e1f6a2f7f1b8`, `1e3a715b-486c-417b-ad7a-6656bd602902`, `619ed5eb-991a-bfd3-1cbb-2f1358f2f3d8`, `71788480-e177-c580-e931-0f4dcd103d76`, `e00c70cf-900b-7a80-9e20-86deae984a0b`, `6744e780-4312-4975-a0b5-5c700a48092b`, `9336d21e-51af-99c0-a858-3014e9dac513`, `ff606105-a464-5985-3cf9-5920c36136a3`. Divider-list style embed `de3674bd-e3a6-880b-b87c-68dc17e286b2` first in main; source `docs/reference/site-head/divider-list.css`.
- Contact map: embed `7e7fef04-c344-f9dd-6c99-0eb34b5f0f43` (class `form-split-script-contact_map` `cf171dd7-6206-4ced-474e-448da98d85ea`) inside the form-split-script-contact component's media figure; shown, with the photo hidden, only on the Contact variant `cb87b4cf-bba7-94cc-e25e-670072dbadea`.
- MCP note: `data_element_tool > set_style` failed site-wide on 17 Nov ("styles not found" even for existing classes); `update_style`, `set_variant_styles`, the element and WHTML builders all worked.

## Animation walk 19 Nov (Designer reveals)

Per-element `data-reveal` attributes (tracker: `docs/feedback/animation-walk-2026-11-19.md`). Component ids: Split image text light `663131a8-3362-867e-25ef-28b6d3d209a2` (content `...209aa` no longer carries text-mask; header `...209ab` and body `...209b0` do; link `...209b6` fade-only), Image Trio Text `eae1d08c-c012-be1b-bafe-4ca88d995c14` (link `...c3c`), Venue Card Fullbleed Tall `f8269db7-7b82-27f1-dd64-8dd069d633f6` (header `...33ff`, button `...3406`), faq-accordion `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7` (answers `accordion_content`), Map Feature Image Bg `5d830b69-6507-7d04-4828-069b2539cffb` (Directions `ff5ebdf1-bb36-d950-0ecc-86368ab96a23`), form-split-script-contact `2f0cac24-8156-b0d7-520c-f5128139d6b0` (submit `...d6eb`, links `...d6c3`/`...d6c5`, labels carry `data-line-mask="text"`), script-intro-centered back link `bdff66b3-92d9-e1e3-dbc0-86a28e384ca0`, timeline-scatter-images `144b7315-3604-2419-b046-c09d180f1163`, image-inset-single `3eeb97fa-6550-7845-31ee-e997e4b8f2f1` (figure `...f2f4`), Article Card Staggered Tall `658f6b02-60da-4e60-799a-540b8a036180`.
- History H1 gradient: class `history-landmark_overlay` `edef6f1c-ce1d-9f09-bc19-fb2fc4684aad`, element `aa9994fa-b18e-e95d-a316-5bcb2c5e9ef6` inside the first (bleed) landmark figure `bf9b65df-380d-f0da-5599-f560b6d1ad3a`.
- Rooms Template description: header `f96b454a-7d02-75a8-e8b2-a645bd863eac`, floorplan link `69ec8908-accd-8089-82fd-c3a0d22dfb5c`, list `a405d4da-4daa-cfce-60cc-89b4fa3fd099`.
- Dinings Template: portrait figure `d090b441-07c7-69cb-9d08-5acd464e9d53`, its paragraph `a5a1d6b8-7e43-a9da-1aa5-590894ae628b`.

## Softer corners and touch gallery (19 Nov, v1.3.9)

- Corner cut is 7px (`.4375rem`) everywhere: classes `tab-pills-intro_tabs` (also height `2.3125rem`, padding `1.5rem`, gap `2.5rem`), `venue-card-fullbleed_tabs` (same), `button.is-chamfer`, `overlay-detail-panel-modal_item-button`; the Site Nav button-system embed `3639f68c-0d1e-0355-fd6d-d61a7593a03d` (`--cx`, `--cy`, `--btn-chamfer`); Gallery Canvas Styles embed; `tabDropdown.ts`.
- New classes `gallery-all_enter` `a20cccf0-fec6-b6f7-4be8-c50f123eb8d7`, `gallery-all_exit` `7722cac1-cfe1-e35a-225b-9789232dbdd4`.
- /gallery: exit `7aca6344-c99e-55f1-66b9-4d4caa1e46e2` (in controls), enter `9b617733-4961-550e-36f4-585fd421d692` (last child of the section); filter nav `1387fa6c-e0ed-7c6a-c5c5-d0d3b650c5ea` has `data-tab-dropdown-hint`.
- /arts: exit `77c88254-2b9b-f9f5-1551-a203447cd8dd`, enter `48510a81-5d78-6f05-147d-0a1fec4e9148`; filter nav `6dd7c4ec-52e2-1812-8f32-19a3645bc3ce`.
- Subnavs (19 Nov, Stephen): no underline on the active tab on desktop; `border-bottom-color` removed from combos `tab-pills-intro_tab.is-active` `e70e42de-0283-762a-59e6-825143e633af` and `venue-card-fullbleed_tab.is-active` `6de4beaf-e3ed-f84b-a768-44b8cfa14edb`. The phone dropdown label keeps its underline.
- Joystick elements removed from /gallery and /arts (Stephen, 19 Nov); the ids `90f2159e-…`, `19ed531f-…`, `102edc90-…`, `44c6ae09-…` above no longer exist.

## CMS and components spec #317, Designer tickets (2026-11-20)

- **❓ FAQs** collection `6b00284dcf7ddb2b615e8b7c` (slug `faqs`, #325): Question (name) `35aabccee3c90080b51096f3c5f5cc99`, Answer (RichText) `8bada67023cdc4d3df27b266ddf8cfa6`, Sort order (Number, `sort-order`) `f77d98b8a3df6ee8bf2719a30db26e23`. Seeded with the six faq-accordion questions (items `6b002865fb7e3ab87c801c69` to `...c73`). faq-accordion Collection List `850a0454-d3d4-68ea-924c-25819e44e0af` (list `...e0b0`, item `...e0b1`).
- **Legal Rich Text Styles** component `7078c6ea-16c9-d700-35be-37d4efe7f1ef` (group Embeds, #329): style embed for `static-template-privacy-policy_rich-text` children, source `docs/reference/site-head/legal-rich-text.css`. Instances: Accessibility `d0bf0cb7-1426-a128-8e03-000070a8e3e7`, Privacy Policy `d75c8945-f7b9-9f76-185a-81c3088e13db`. Rich text elements: Accessibility `17ade4d6-7c18-4065-248a-fc99b80c375f`, Privacy Policy `8f7c8ff8-cfa2-2f88-03c5-51f52050881f`. Class `static-template-privacy-policy_rich-text` `7ae18d2d-b26b-fd23-6d4a-e24af812fd4c`.
- **FAQ on Home** (#325): Home's faq-accordion instance was unlinked into a page-level section with a CMS Collection List (`0c979cd0-38fc-e636-b029-8ce73afc731f`, item `...7321`, answer RichText `ffc9c44b-eba2-01ab-96e0-f0bfbd72eeaa` bound to Answer). The MCP cannot turn an element holding a bound Collection List into a component, so the "FAQ Accordion" component is created by hand in the Designer, then swapped onto the other pages.
- **Split image text slider** `95fd2679-0bdb-80ea-f808-0a8a4bdc261d` (#322, H2): duplicate of Split image text light for /history (slides 2 and 3, dots and stamp always on; props Variant, Heading, Body, Body 2, Image, Slide 2 image, Slide 3 image). History instance `2b234118-d291-89d2-d0a8-89e4deb2caaa`. Split image text light lost Eyebrow, Image visible, Body 2, Stamp and slider props.
- **form-split-script-contact** prop Section ID `313202aa-3827-a147-8028-b130b086d676` (root domId); /meetings form instance `bf2d85be-cad9-4f76-7939-f3ae9f16f6a0` = `request-for-proposal` (M1, empty div deleted).
- **Card Carousel Card** `b922fe43-151c-9949-7a57-00b9cadaf0f1` (#323, Y4): props Image `1afe6268-eddc-dc07-534a-cd97c11f81c6`, Image Alt `f5a9d899-b27e-52b5-1610-ea969292317c`, Label `b550ca88-5559-7f65-9f41-bf84cdf75780`, Link `77879c85-8389-e63f-1cfa-9a6f4001b62c`. Card Carousel Header Left slot "Cards" `74acb491-b8c1-d101-2f20-8ff6eafa9b4d`, stagger embed `601322fd-cb9a-43f3-cf54-d66c0e653768` (heights by position 3n+1 tall, 3n mid). Card 1 to 6 props removed.
- **Gallery Mosaic Item** `bd6bed74-9450-e2b0-283a-efaf6bf33425` (#323, Y3): props Image `188a466e-517d-5c89-7efe-1c7264581d50`, Image Alt `1b26142d-ae4a-fe0e-1454-1de7b0ea13fc`, Caption `178535ff-e79e-11c6-b372-ba18b4b0b08c`. Gallery Mosaic Captioned slot "Items" `5a8d5874-0d8d-63a1-3793-a7fc6806cd65`, layout embed `e602e6ad-1169-42cf-d45b-2974a502394f` (pairs, every third and a last orphan full width, numbers by CSS counter).
- **Scatter Image Item** `5d1646a5-9b19-12e7-99a1-ccf03bc50f6d` (#323, G1): props Image `9e5ab227-7363-1f89-7d0d-a9b9e0244bcf`, Image Alt `c3143877-f5a4-1365-c345-8a7b08ac21c7`, Caption `45bf8076-280c-c889-ebc4-f851f027b32c`. timeline-scatter-images slot "Items" `cdf6eeeb-dc70-98fc-4672-1f10b7524a69`, layout embed `96e5a0be-d6db-ab52-88a5-490bde95f28e` (4n pattern small, large right, xsmall inset, medium centre).
- **Article Card Tall Item** `e1b3f20f-32ae-6a0e-152e-8f6755746b38` (#323, N3): props Image `44f983a7-9761-ffcc-2892-86c4ea6699aa`, Image Alt `7e077e4f-9a98-5593-df20-6e6f08dfd7fa`, Heading `43488e1d-d3af-2bc8-63be-a90945c187b0`, Text `f5bc36db-23ff-40e8-2b02-29303c1b7997`. Article Card Staggered Tall slot "Cards" `75aa870c-a284-b773-0fe1-521d001c0d9b`.
- **Corporate & Services** `aa184bec-1546-99d0-45ba-1eda6f3bbde9` (#323, N2), /neighborhood instance `327a6f34-e59b-e99f-40fb-31eb3c615846`, slot "Cards" `ba835446-3393-219a-6c40-e20a1b3692bd`; **Corporate Services Card** `9ced70f0-b656-37f9-427f-1d27978c0981` (Image `fc37a194-9021-6b40-d8a9-9fc554d7026b`, Image Alt `f8a8e0cc-46de-4e94-bfa7-479ec4b54e80`, Title `50c41ceb-41ed-41f3-628c-42868f48543a`, Text `a0497df0-1856-c25b-6589-2709393cc613`).
- **Key Features** `f8d2c379-fdf7-4264-4080-6fae138c9250` (#323, M2), /meetings instance `e1af0259-ff5b-078f-d23b-4edac20df0fc`, slot "Cards" `f7945008-2f4a-c55d-fdb5-1dbe432694b5`; **Key Features Card** `2e6a3d5b-7f61-0a65-4e52-0a425c1672db` (Image `8ee90093-39f4-86cc-2a62-41a022acbbd7`, Image Alt `1afcfb74-472f-3b88-74b2-f0ce80f1ae7b`, Heading `3d936657-10de-6580-d017-b42b0aee917d`, slot "Features" `fd1c0369-41a2-f6d1-7c7c-1cd59e9daf52`); **Key Features Item** `a15947f0-ba83-110b-efc2-2b4af185e8d3` (Text `fb980053-8e11-8c4e-f860-f5e007b7c89e`).
- **Slot gotcha**: a component slot publishes as an unclassed `<div>` around its items, so each slot-holding block has a style embed with `<list> > div:not([class]) { display: contents }` so grids, flex gaps and nth-child rules see the items.
- **🏛️ Meeting Venues** `6b0036f73a65bcfa50f491e9` (#327, M3): Name `981f9ab0cb4dd2ab5deb125f6f7d4790`, Slug `3379204f3179adeda2005ab8bbbdae81`, Card - Image `c132197b9c45898b7daccf59252253c7`, Card - Intro `5bb75ffded8442667f1ed42b2a6b7bda`, Pop-up - Image `bfc53d5c467aa527e26d6cc8be6a8a57`, Pop-up - Text `b7f0a39b63128ebbd204c58bd34d5156`, Pop-up - Layout Options `43be41bb99f1f43f28a6ef1653964b51`, Pop-up - Floorplan Link `075d62cc98dbbb43f6324cae40f8a06a`, Pages - Meetings `1ffcb148508b11e78c1e5fbf9bd341fd`, Pages - Legal & Corporate `367e789bcd921cdf8a72f927f8a8f9ef`, Sort order `fec7f04d7a1e5bccdae42dfc281d7884`, Features - 1..5 Title/Text/Image (slugs `features---N-title|text|image`). /meetings: panels list `f6e1448a-3508-42cc-cdb5-8fd511c27863`, tabs list `5a27ec27-2dbe-c995-48b3-8c54a0ba4d92`, pop-ups list `d8e7be81-88f3-09a2-f770-ad74bcc04336` (Art Detail Modal `e8037524-624f-7cfe-5ecf-bb9755c47235`). Legal template: panels `7ead32bb-b0af-cf18-0c1c-10bdba33bc25`, tabs `26f0427d-4041-08c2-347c-d59ed4ce7cb7`, pop-ups `3418b6fc-e0d2-6959-6294-02753085214e` (modal `2e13bf88-accf-0453-4655-372c37d02f41`).
- **🏖️ Beyond Downtown Places** `6b003ce85ffdb768a6e73915` (#327, N4): Name `ac53efb4895b679e94a32a89bfd0b705`, Slug `bd615a61118e9127705effa6b942654f`, Card - Image `c20824ea90c5545bbd984f35fc0669ba`, Pop-up - Text `308010497de7a57775e3b2103f6aef1b`, Pop-up - Learn More Link `c07d66741b6060390f7e1d93e1e426e2`, Pop-up - Gallery `b8b34da828d433f0d61eb52249bce05d`, Sort order `c841314d63ccd6780390adca7577820c`. /neighborhood: the timeline-scatter-images Tall instance was unlinked into a page section; places list `1b2762bc-468e-297a-13c3-8a946427a416`, alternation embed `f1f5eab6-08c2-21af-2287-b6ab5724e512`, pop-ups list `c4ac5dcc-141e-a874-54e0-38c06fe1a18e` (modal `bef77131-831d-1a5d-f0d3-0f2e625eb1df`, Centered).
- **/rooms all-rooms pop-up** (#327): Room List Hover Preview instance unlinked into page elements; links list `7d1dd11c-292f-8a6d-5af1-d82e0db2407f`, previews list `952ee685-ca8d-d43c-1679-43bf51b9ed9d` (Rooms, placeholder quiz rooms filtered out). Room hrefs come from `cmsItemLinks` (`data-cms-link-slug` + `data-cms-link-path="rooms"`): a "current item" link cannot be set headless.
- **u-display-contents** class `7b440aba-2735-e88d-83b1-8d677769a417`: on Collection List wrappers and lists that must not break the parent layout.
- MCP gotcha: Collection List settings writes (filters, sort) fail with "[Conflict] ... component map" once the list holds elements moved out of an unlinked component; configure the list first, then move content in.
- **Room template CMS** (#331, 2026-11-20): Rooms fields `room-description---text` "Room Description - Text" `a3bfb63db1218df83d21181e1c3fa98a` (bound to the description paragraph), `room-description---details` "Room Description - Details" (RichText) `39bca1f4c0b30f5db9f97c0423a90e4b` (rich text `31cffbc8-d7f7-008b-fef5-fbb8f3d2e0cf`, class `rooms-individual-description_list`), `amenities` "Amenities - Items" (MultiReference to Amenities) `2c60a3c7ed6efe52311e86dc43e6ca85`. Field names now follow "Section - Field"; groups Card, Room page, Quiz.
- **🛎️ Amenities** collection `6b0041e06d88d6d2996cc777` (slug `amenities`): name `15b9e10818b3c19505454ecfa8feaf07` (a line break in the name shows as two lines), sort-order `aeb182d1a218e5e2094fbaf74032771f`. 8 items seeded (`6b0041eecde8e8a891d05444` to `...05452`).
- Room template amenities list: wrapper `347e499d-b2eb-1604-3437-a0c470a52f7a` (`u-display-contents`), list `...f7b` (`rooms-individual-amenities_grid`), item `...f7c` (`rooms-individual-amenities_column`), name `d1e379a8-3241-4f8f-b11c-8307f2ca9523`. Source is the whole Amenities collection: a headless write cannot set a multi-reference source (`source` accepts only `{ collectionId }`), so the Designer must switch Source to "Amenities - Items" for per-room ticks.
- Room template Discover Other Rooms: Collection List `dfda5e29-183d-80bd-b954-04302cc9fa2d` in the Card Carousel "Cards" slot, filter Name not equal to the current room's Name (bind `{sourceType: "cms", collectionId: Rooms, fieldId: name}`; the `page` name key is the template page's name and does not exclude) plus the two placeholder rooms; card unlinked to elements, link via cmsItemLinks. To edit list settings move it out of the slot first (slot lists reject filter writes), and move it back by inserting a temporary div into the slot and moving the list before it.
- **Room Template Styles** embed component `77695709-bc70-2a66-8f8d-f8a27baaa513` (group Styles): numbered detail rows and amenities grid dividers.
- Collection List `sort` writes now fail on the Room template with "[Conflict] ... component map" even on a fresh list; lists there use CMS default order.
- **🖼️ Media** collection `6b00441f4488d60a1aa27565` (slug `media`): Image `712d17990b01844c74a5580fa12d1fb8` (`media---image`), Video Link `2ba9e27995b4fcf73ed0004c4e2616c0`, Alt Text `483238d8461ef74ad411fb7d4f3f5d26`, Caption `b4cf6e819f77c13d116fbc79b13f99e9`, Sort Order `a5a30e30431b028568aca7d03e54257d`. Items: Room gallery 1 to 4 `6b00444ccf09bdc58c840f0b`, `...0f0d`, `...0f0f`, `...0f11`; Dining gallery 1 to 4 `6b00457271a28209f01dd179`, `...d17b`, `...d17d`, `...d17f`.
- "Gallery - Media" multi-references: Dinings `da5164b319a8df459c6ca1f38a3b0ef9`, Rooms `ea17ca1cb529ca7c22a11562f3e23b4d` (slug `gallery---media` on both).
- Room template gallery list `8a3efe46-8967-b065-e42b-92f36e08530f` in the Gallery Mosaic Captioned "Items" slot (item `...5311`, Gallery Mosaic Item instance `bdb59464-fb2a-8293-537d-7cc9ab52b552` bound to Media image, alt, caption). Source is all Media (no filter: Room template list settings writes conflict).
- Dining template gallery list `068354fe-130c-db37-03fd-26518a86699c` in the gallery slot (item `...699e`, instance `40c8bf04-1882-668d-3f0d-d102b049d4eb`), source Media, sort Media Sort Order, temporary filter excluding the four Room gallery items. Both lists should switch Source to "Gallery - Media" in the Designer (headless writes accept only `{ collectionId }`).
- Gallery Mosaic Captioned layout embed `e602e6ad-1169-42cf-d45b-2974a502394f` now counts CMS items (`.w-dyn-item:nth-child(3n)`) and flattens Collection List wrappers with `display: contents`.
- Dinings new fields (#330): Intro - Heading `ea39631051896b1870f885e15ee4fe02`, Intro - Text `1c58e01fa801b00536c294304b59ec04`, Intro - Caption `99b5fc0e6099140b72f09125762a8afe` (bound to both split instances and the info aside `4e75d99f-f49c-0995-1575-09244d7c0e0f`), Info - Dress Code `9928d568cdb0a134b3c22bb9c95ceeb9`, Info - Hours `281e995655ee6a92c3b3077389864acf`, Explore - Text `7da291d55f4666da3cbeb2df49e526cb`, Explore - Image `5c1f347166052bec62bd04c2217bd62c`, Image Pair - Image 1 `3eb64cf9bf937d28384ed61bbc3b3c41`, Image Pair - Image 2 `5b8efcf8e25143933a4516224f5dc305`, Image Pair - Text `194789420cb51315920bcccac7590d86`, Booking - Reserve Link `b2a76ac8e38ce0e770321d0b67088e33` (bound to both hero Button Link props; empty on every venue). Deleted: Other dining label 1 to 3, Show card Zuma / Garden Terrace / Lobby Bar / Pool Lounge. All Dinings fields renamed "Section - Field". Removed the switch-driven Other dining stagger section `86d57348-...`; the CMS carousel `1d7740a7-80b5-cfe9-bf61-92b121baa8e4` (heading and intro now bound) stays.
- Reserve a table pop-up venue rows live in the Overlay Detail Panel Modal component (`44cccc51-...`); a headless bind there fails with "not inside a CMS context", so the reserve link must be bound in the Designer.
- **Video props** (#324): Hero Fullbleed Centered "Video Link" `75d42a84-dcfa-181f-f117-8fe20dea11d6` (group Background) on the figure `f91dcf8c-...-7bfb` as `data-video-link`; Gallery Mosaic Item "Video Link" `4301866b-8aea-0230-bb89-72922318f6c7` on its root figure (bound to Media - Video Link in the room and dining gallery lists). History 1924 frame `283c3db0-146b-a9d0-27ae-9a09e01e9e8d` carries a static `data-video-link=""` (edit in Designer > Custom attributes).
- **🔖 Topics** `6b004916ae933f3d6c917f37` (name `00eda88c37069573e5c9fdef9fea0dff`, slug `6121b6974e3b39886454ff62fcc9d572`, Sort Order `7c209bb769ff082dce266a4397e5c67d`; items dining `6b0049255eeab5545e6bc6a5`, culture `...c6a7`, conferences `...c6a9`). "Card - Topic" reference: Happenings & Stories `101bc574a26dc6f44acb63f556b40042`, Packages `3781b9f8bcdbacfc34435b74840cb713`. Referenced fields bind as `"<refFieldId>:::<fieldId>"`.
- /blog, /happenings, /packages (#326): the first topic section is now the only one, with `data-category-list`; its item carries `data-category-item`, `data-category` (Topic slug), `data-category-order` (Topic Sort Order); the topic header (moved into the item) has `data-category-heading`, h2 bound to Topic name. Lists: /blog `bee9c2ca-...a5e5` (filter Category = blog), /happenings `c706a153-ad4f-e4b8-e4f2-72ba26467fc5` (Category = happenings), /packages `bee9c2ca-...a5e5` (no filter). tab-pills-intro tab bar `30192280-...-bee35` has `data-category-tabs`.
- **🏷️ Art Categories** `6b004a9fa6412b2e1b0da166` (name `287ad92cc888684f3088dfba7740dc55`, slug `62af711fdfcad546291ebe92a3e8c827`, Sort Order `51465338cf2d434427e7822444b4237c`), Art Collection "Card - Category" `c5f18e1c77a4b9059f7482c551d64fc1`. **🏷️ Gallery Categories** `6b004aa45539170e389006b5` (name `44259109cf64b8d641f40e95af123959`, slug `9a55cde416046ff3475b22f1cff460b3`, Sort Order `56b8ae787f72e6697df594ae8266efe2`), Gallery Photos "Card - Category" `f654122590fb89fbe5294025eb14d4bb`. Tab lists: /arts `02ee90f2-fc69-2099-6950-42d4b74bbbd0` (tab `38fac2f0-77a0-f158-5cf7-3d16c8929dc6`), /gallery `4a292a0f-a278-2cba-af58-35d855453de5` (tab `a813da26-2c4a-25be-579a-a92e5e76b072`), all `u-display-contents`, after the static All tab.
- **Day and night props** (#340 to #343, 2026-11-20). Night images use a hidden `img[data-night-image]` (class `hide`) beside the day image, bound to the "Night - Image" prop or field; `dayNight` copies it onto the day image.
  - Hero Fullbleed Centered (`f91dcf8c-...`): Night - Image `21b09566-03fd-0051-818f-6f35c27f5fb9` (hidden img `26d0e02c-5366-d771-0f5b-30fd9b89f5b3`), Night - Video `97c44009-a084-4f44-6102-e721f79d0785` (figure `data-night-video`), Night - Heading `2c401db1-96d5-7fbc-68c2-7ea0e151ac56`, Night - Text `baa35ef7-438f-843a-8a49-37cf6cbaa4d1`, Night - Button Text `32288b4b-153b-10c9-5dd3-899cd39ec703`, Night - Button Link `2ed09e14-1566-f905-edf9-168537ceca08`. Samples: Home hero and /neighborhood hero (lobby lounge image, "after dark" headings).
  - Split image text light (`663131a8-...`): Night - Image `22f24909-4cb8-d01f-dda8-1c461c55affe` (hidden img `5ced9f2a-7406-348c-b4fe-2903818176c9`), Video `54038270-...`, Heading `000e7667-...`, Text `cd062d2f-...`, Button Text `78558e6b-...`, Button Link `e982fcea-...`.
  - Venue Card Fullbleed Tall (`f8269db7-...`): Night - Image `56b4192c-b197-c8ee-3c9a-e6791c20a872` (hidden img `0e3b2199-97a0-6bce-f7c6-290a9ce9cfbe`), Video `253ea9c9-...`, Heading `d181cbd9-...`, Text `41bfdd2d-...`, Button Text `c2815958-...`, Button Link `fce9ab5f-...`.
  - Art Detail Modal (`4e402659-...`): Night - Image `a8711651-ed04-7e53-8bf6-136d38fb7ce8` (hidden img `acdadfd2-4df9-bb81-e663-f1560e402896`), Night - Text `520e4417-a7d9-c437-41a5-0e7c9f4244fd`; /neighborhood place pop-ups bind them to Beyond Downtown "Night - Pop-up Image" `aa85a47b649d59806df94fb0de4f196c` and "Night - Pop-up Text" `699284ab472b2ba0e49cbe87396321d5` (sample on Coronado Beach `6b003cfd3733141610dc12a3`).
  - Article Card Tall Item (`e1b3f20f-...`): Night - Image `74ac4aba-b27c-c7a1-af6e-2f1244b585ec` (hidden img `09c2828d-0d7c-4d1d-f975-58f30d8fd0f8`), Heading `a6d0d9d1-...`, Text `5fef58a9-...`.
  - Dinings fields: Night - Home Card Image `bf1e0c9ecd32e63d6fcbcc434ba78092`, Heading `5d576926c88d961d6a6df2491f1d95bb`, Tagline `b8f0662e9f48ab7accc2b0896e2f26e0` (Home card list: hidden img `1cd047e6-a350-83bf-0582-f355d01a9d39`, heading/tagline attributes).
  - Rooms fields: Night - Hero Image `23109efec94a92a80e230f8715b208c5`, Hero Heading `d629e628291943c712b171a20715aca4`, Hero Text `a3ff806809e9f8ea7d6c6d92a7e7b0bc` (bound to the template hero's night props; sample on Cozy King), Night - Feature Image `77f12fccda41916e838fed0f7b82d989`, Feature Video `ee34198bd3a330f597899917bcd2174c`, Feature Text `ac216030075509bb58ac61533d456d01` (template full-width block: hidden img `609b470f-6acc-f182-419d-1124228ec64a`, figure `761e97e3-...`, paragraph `a2999053-...`).
  - Meeting Venues fields (renamed 2026-11-25, ids and slugs unchanged): Card - Image (Night) `83d296657a74fadf02bfe93d42657d07`, Card - Name (Night) `c6fa6f2fbe0cd757ee3bf19be68f50e5`, Card - Intro (Night) `1c59d1061731508c03db2ec051726f62` (/meetings panels: hidden img `08e3f6e5-c092-f45a-30e4-874f136ebc5f`; sample on Lobby Terrace).
  - /dining static venue cards (Lobby Bar, Pool Lounge, Garden Terrace): static `data-night-text`/`data-night-href`/`data-night-video` attributes and hidden night images `0593f856-...`, `4a21160a-...`, `461421b1-...` (edit in Designer > Custom attributes / image); sample night tagline on Garden Terrace.
- **FAQ Accordion** component `3a5f8147-3133-e200-3968-9ef6aac9f0b6` (#325; made by Stephen from the Home FAQ section, renamed; props Text "faqs" and Title, both single-line). Replaced the old `faq-accordion` (`064f3089-...`, now unused) on all 19 pages; swap method: unlink the old instance (it keeps its place), insert the new instance before the unlinked block, remove the block (the API rejects inserts anchored on an instance).
- **🏷️ Offers** collection `6b0056f7a2110448c9442119` (#328): Name `465597bebf09e3541715bee6ba61a97b` (slide heading), Slide - Text `d1c7b87a10bf6ad506de851f8d1b9876`, Slide - Image `f81c57f953a333609558afdd35d3042f`, Slide - Link `098bc69bfc4905b027e32e155cb75a5f`, Slide - Sort Order `c37cfb4805b46985995a78339d302455`, Slide - Slider (Option) `98656026dc765e98e2fab101672b21d3` (Offers & Packages `aeb7507fa3c407e50b8bec057bd54626`, Retail `a2f3d8292fc286686e7e79dad9296bf7`, Arts & Culture `89969b32683d89022fe73dc95ccf18e2`). Seeded with the 5 Home offers slides and 5 Home retail slides.
- Home Offers & Packages slider unlinked (block `a5660ddd-9800-ec8a-c973-bd44cf6dfba3`); slides are a Collection List `c64274f6-4749-19cd-d25b-a4b055365397` (wrapper `u-display-contents`, list `...5398` = `offers-slider-split_slides swiper-wrapper`, item `...5399` = `offers-slider-split_slide swiper-slide`), filter Slide - Slider = Offers & Packages, sort Slide - Sort Order. Waits on Stephen's Create component ("Offers Slider", filter as a "Slider" property).
- Night - Text props rebuilt as multi-line text props (plain string props have no line setting): Hero `86753272-8614-a075-f9e4-f37b9b151c1a`, Split `858c6171-3e04-be31-36e1-15b742ca1404`, Venue Card Tall `4d023148-db3e-68a2-a0f0-c97151354bf7`, Art Detail Modal `66c06093-dcad-41b3-24df-7a536e5e1d77`, Article Card Tall Item `68056cc1-8542-d901-2fe5-fbef8d23a4ba` (replace the ids listed above for these five).
- **Dining look (D1, 2026-11-20):** Dinings option field "Split Section - Look" `077299153af1ebe690650bf12ebabb52` (slug `split-section---look`; Navy `ff50ddda79b375a682e44ce91720134f`, Olive `071d1d1dd1c93a5e15798ec7c9dfb8d2`) replaces the deleted `split-navy` / `split-olive` switches. An option field cannot drive visibility or variants headlessly, so the Dinings Template wraps each look in a one-item Collection List filtered to the current venue (Name equals the template item's Name, bound as a CMS field; the `page` name key matches nothing) and the look: Navy list `84ef6103-2a18-23a7-b68a-590133c39327` (item `...c39329`: Hero Blue `98f5b6bf-...` + blue split wrapper `b593bcb7-...`), Olive list `01c882e3-2331-2a0c-03f6-d8fc4182e930` (item `...e932`: Hero `726f3724-...` + olive split wrapper `0cb03fde-...`). Empty states hidden.
- **Gallery Mosaic Captioned** layout embed `e602e6ad-1169-42cf-d45b-2974a502394f` (component `560e1b31-...`): the mobile first CMS photo has `aspect-ratio:auto` beside its 156.9vw min-height; with the 13/16 ratio the min-height forced a 497px-wide figure at 390.
- **/rooms room grid night (#342):** Rooms fields Night - Card Image `61f3dbfa04564c796c335b848d6660f5`, Night - Card Heading `3fadc8d310e6709750dd0c5536d55b7b`; card heading `19aa26fc-43c4-960d-7991-0baacc8c69c5` carries `data-night-text`, hidden night image `2f002229-651a-7634-8133-b27eadd1c6e8` in the card figure. Sample on Cozy King.
- **Offers sliders (#328, 2026-11-20):** "Offers Slider" `d5df6734-af17-07ac-88ae-84551d59f46c` (Stephen's, burgundy, filter fixed to Offers & Packages) replaced the old Offers Slider Split on all 17 offers pages (history `0ad66eaf-...`, dining `adab6a56-...`, rooms `56d548f9-...`, room-detail-static `0fe11f04-...`, gallery `33e9bc07-...`, arts `a2452872-...`, wellness `be32371a-...`, meetings `371907d9-...`, neighborhood `c852c4c9-...`, packages `1b0563aa-...`, blog `824afb6c-...`, happenings `a2d5134a-...`, Packages template `c716cc16-...`, Rooms template `5c0064c3-...`, Happenings & Stories template `8120c399-...`, Post Categories template `d3a58eba-...`, Legal Corporates template `61118ef3-...`). The old Offers Slider Split now has 0 instances. No cream variant: the design's "is-cream" crops only show the cream section above.
- Home Retail slider unlinked to a page section `30b825d4-bcde-7241-ae17-8d5c1209c9c0` (Blue combos), slides from Collection List `ea9cd4c0-72ff-5bd9-7d6b-732ff8cba2a7` (Offers, Slide - Slider = Retail). Neighborhood Arts & Culture slider section `08ea048e-084e-c41b-fc6b-201460a62bfb` (Tan combos), list `503d5aa4-09bd-e9df-ecda-4ee5b9b65556` (Slide - Slider = Arts & Culture). Offers items arts-culture-1..5 `6b0062886bc16bce69fc3171`..`...3179` (link /arts); offer-1..5 link /packages; retail-1..5 have no link (no retail page). Turning either section into a component is a Designer click: the API refuses any element holding a CMS list.
- **Jump targets:** Custom Element (DOM div) wrappers replaced by plain Div Blocks with the same ID: neighborhood `dining` `c00139a3-c35c-822e-d8f9-32872d59db38`, `arts` `fb5d19cb-cb57-1ac3-3eb6-edc2cddcf175`, `beyond-downtown` `f056e991-68b8-e1bb-03fe-e7d2c6c711d1`; guidelines `photoshoot-request` `dd11b04a-7bab-2c4d-6ff3-6fd326cea8da`; contact `faqs` `a42046c5-7862-1639-86f3-b8f3bde19f22`. Remaining DOM div with an id: the /rooms all-rooms dialog `80f767d6-...` (a dialog root, not a wrapper).
- **Reserve a Table (K1):** the `book-table` pop-up inside Booking Menu `6c8187bb-b662-164c-29a2-e084f027a1a1` is unlinked (block `...a1a7`, Image Bg combos) and holds only the bar (back, wordmark, close), the image and the Dinings list `f2b614be-7770-d21d-cc48-a993ba813e6f` (reserve link `...e78`); the hidden Item 1 to 5 list, eyebrows, caption, extras and footer are removed. CMS settings inside a component definition cannot be written headlessly ("No source connected" / "not inside a CMS context").
- Beyond Downtown duplicates `oceanside-2` and `coronado-beach-2` deleted (Stephen approved).
- **Jump targets, no wrappers (Stephen, 2026-11-20):** IDs sit on the sections. Section ID props (type id, group Settings, bound to the root element's DOM id): Article Card Staggered Tall `3b1ddd85-fc24-7642-394a-2bcf15722817`, FAQ Accordion `445f9633-151a-cb55-b01f-a98876d176b4` (form-split-script-contact already had `313202aa-3827-a147-8028-b130b086d676`). Values: neighborhood Article Card Staggered Tall `dining`, Arts & Culture section `arts`, Beyond Downtown section `beyond-downtown`; guidelines form `photoshoot-request`; contact FAQ Accordion `faqs`. The Div Block wrappers and empty anchors are gone.
- Image Bg 40, 49, 59, 68, 77, 86 (Booking Menu Reserve a Table buttons): tablet background-image restored after unlink truncated it (see docs/solutions/integration-issues/webflow-unlink-truncates-url-values.md).

## Review fixes (2026-11-20, docs/specs/*/review-2026-11-20.md)

- **tab-pills-intro CMS tabs:** the four typed tab links and props (Tab 1 to 4 label and link, Show tab 4) are removed. The nav `30192280-...-bee35` now holds slot **Tabs** `ec7822f5-868d-0a35-c82c-ccd043ca1a22`. Each instance puts a categories Collection List (wrapper, list and item `u-display-contents`) in it, item link `tab-pills-intro_tab text-style-eyebrow-caps`, text = category Name, attribute `data-category-tab` = category Slug (`categoryListing` sets `href="#slug"`, drops tabs with no items, marks the first active). Lists: Packages `2d7f8141-429d-028c-9f02-fa7f1d6183c5` (🔖 Topics, Sort Order), Blog `215abaca-feef-d400-04c3-37d1d813c9e0` (Topics), Happenings `36c8001c-a437-188f-4c09-0fcbdc6c4015` (Topics), Press `f348872b-a648-c8ed-5e19-d3c918416434` (🏷️ Press Categories, Order). Post Categories template slot left empty (template pages 404, no category list there).
- Filling an empty slot headlessly: `data_component_builder` `insert_in_slot` (slot name) a temporary Div, build and configure the list elsewhere on the page (slot lists reject settings writes), `move_element` it before the Div, remove the Div.
- tab-pills-intro defaults are neutral ("Section heading", "Short intro for this page.", "Categories"); script-intro-centered backLinkUrl default cleared (`#`), label default "back"; Rooms template instance keeps "back to rooms" with a page link.
- Press Categories orders now unique: Reviews 1, Lists 2, F&B 3, Design 4, Community 5. Combo `article-card-staggered_component.is-cms` lost its `:nth-child(even)` margins; `staggerCards` now places Press cards and restarts left at every category (v1.3.20).
- Dining template gallery list `068354fe-...699c` filters cleared (source is already each venue's Gallery - Media). Room amenities `347e499d-...f7a` and room gallery `8a3efe46-8967-b065-e42b-92f36e08530f` already read each room's own references (proved by trimming Cozy Queen and Lobby Bar, then restored). Every room has the same 8 amenities and 4 media entered, so pages look alike until editors change them.
- History timeline: all 13 `history-timeline_figure` elements carry `data-video-link` (empty); paste a video URL in the element's attribute to swap the image for a looping video (`mediaVideo`).

## X1 component split (2026-11-20, review item X1)

Layout variants became their own components (group as source, same prop ids as Split image text light, no variants, Caption/Footer/CTA and unused Night button props removed; Heading and Body defaults cleared). Classes stay in the `split-image-text-light_*` family; each layout is a combo.

| Component | ID | Instances | Layout combos |
|---|---|---|---|
| Split Image Text Edge | `82aba62a-5075-5840-0ddc-ad171238ba74` | Rooms template x2, `/room-detail-static` x2 | `container-large is-full` `e8abbcae-d558-a750-7fb0-184882b3b07e`, `_media is-edge` `8b8151d1-3e24-970b-d958-fa35e5682417`, `_content is-edge` `1e14b4a6-c1c1-bcbe-4c4f-080c678b5002` |
| Split Image Text Edge Large | `cf4debe5-17ee-5d74-1d63-85f7a7d28e2d` | Arts `40725dea-61be-f473-19fa-a0382b2e6503` | `padding-global padding-section-large is-edge-large` `4ff0534f-acf4-9b6c-c1d6-3aff09f61bd8`, `_media is-edge-large` `e172b921-255a-2042-a4cc-f43b1a9c1f9c`, `_media is-secondary is-edge-large-second` `c7693583-87fb-d588-5de6-6f9b732eec0d`, `_content is-edge-large` `62033c24-1eab-be9a-88f4-dfe94efd2707`, heading chain `is-edge-large` `d67b1754-2e29-9a8d-7abc-27b50acbcab1`, body chain `is-edge-large` `1bc4f915-3fd5-3465-7e29-062fc1c0dcce` |
| Split Image Text Wide | `a48dd3f0-bfb7-118f-393d-35b9b7172598` | Neighborhood (little italy) `9ff7cd1d-14b1-b02b-ad23-119ec0c50771` | `_component is-wide-split` `2bff8ce3-2624-d7e3-138f-a41ec3d70d32`, `_media is-wide-split` `96ad805c-78ed-2f3a-a172-d9931f55f5e6`, `_media is-secondary is-wide-second` `bff6c6d9-3889-28ed-540a-a6c746ac06fc`, `_content is-wide-split` `67652272-e630-ee9f-0193-68ea9493746c` |
| Split Image Text Stagger Left | `3aa55379-f563-3fcc-0ac1-238e5e97daea` | Dining template `40860f7f-87ef-97df-94ef-b7a5261cd5b6` | section `3c73dbb1-80da-e6cc-6c9f-30ffde79eda5`, `_component` `afc54018-18f8-b765-f757-26d25c3f1d11`, `_media` `55307b09-ee7d-8ae9-7f80-ac5d6aad2f38`, `_content` `488f746c-e10e-a7d2-ba12-39967cf8fe68`, heading chain `77a63d40-72e5-ee35-7d37-f0bf40c6cd7f` (all `is-stagger-left`) |
| Split Image Text Stagger Mid | `58a0955b-a9bf-26d0-20b4-0b05cd68cb38` | Neighborhood (gaslamp quarter) `d1a05b2f-7ee8-cb39-21a3-34b0c8b95b77` | `_component` `662e6429-ecc4-691b-617e-5bbab3c12fc3`, `_media` `045ce469-665b-92cf-c539-127fdebd1057`, `_content` `c8151077-4b9e-a44a-66f9-ca578518f3ba` (all `is-stagger-mid`) |
| Split Image Text Compact | `c619214e-e99f-0fd3-58f0-40934ca0f917` | Packages template `381c4d11-331d-b94e-841d-735b1b96fcc1`, Happenings template `09444f65-aa0f-3142-1720-266d92a56510` | `container-large is-compact` `ede04ff1-73f1-1896-3752-4f0223ccb7c2`, `_component` `060af736-14a2-aa4f-4ac8-cbd4e813a3e6`, `_media` `1b16b663-130b-1134-f677-a43f7926af33`, `_content` `bc72cfd0-431e-9b2c-404e-543c82863425` (all `is-compact`) |

- Rooms template new Edge instances `90d46d8d-eb1d-b9b0-a56b-2a524cb2d6bc`, `8bc48eb2-4325-ca87-3c8b-d72b497e1e16`; `/room-detail-static` `6f948212-6bd0-cff2-f287-a54b2fdba3b0`, `bc0cf7d0-27db-1e9f-6b4c-dac7c31ea407`.
- Split image text light (`663131a8-...`) keeps 4 instances: Home (Olive Home), Neighborhood (Neighborhood Downtown), Dining template (Blue, Olive Dining). Its Edge, Edge Large, Wide, Stagger Left, Stagger Mid and Compact variants now have no instances; they stay until Stephen decides.
- The room page second-Edge mobile rule now targets `.is-edge` in `mobile-variant-overrides.css` (v1.3.21); the Compact rules left the `data-story-mobile` head block.

### X1 form split (2026-11-20)

form-split-script-contact became five single-purpose components (group Sections). Field and detail labels are fixed text inside each component (no numbered props); only Photoshoot and Request for Proposal keep the Section ID prop (`313202aa-3827-a147-8028-b130b086d676`). Form names are unchanged ("Photoshoot Request" on every form, as before).

| Component | ID | Page instance | Combo (`is-…`) |
|---|---|---|---|
| Form Photoshoot Request | `ae6ed4a3-2655-8c61-7d36-a87b4dd8d607` | /guidelines `63afbeba-7b83-26b8-4f12-924e4e36fb03` (Section ID `photoshoot-request`) | `is-photoshoot` header `0e3ce68a-117d-da93-dffc-04f69f10b003`, heading `5f0b01f2-fdac-0bc1-55cd-5ad8aceb8841` |
| Form Request for Proposal | `07b1c49f-a979-a3d8-a93a-820f2f02b379` | /meetings `e11d6d47-01b3-9352-8de0-b00e8109f765` (Section ID `request-for-proposal`) | `is-proposal` section `10f173a6-13c3-bf0f-3b07-82d644b28a21`, header `dc6784b0-ba7c-c8bb-16c8-4544ab6fc2e8`, heading `5f7d9d65-7138-75a3-2ee8-1bf40542ff43`, footer `5d2f13c5-98c9-59ba-fa9f-762b4f82c438` |
| Form Legal Corporate Proposal | `ac4f1278-12f1-0748-8e90-ad316983a2a1` | Legal Corporates template `c29b6bfa-964a-7935-6603-7198d47a1d82` | `is-corporate` header `6c9c5123-385a-5132-0c5c-a1aec77ac7fa`, heading `a362cc9b-aa21-46cc-431d-a0b15284bb5c`, fieldsets `2de1320f-a0c2-89d6-d368-f3ed033fa771` |
| Form Press Enquiries | `06c49a08-f7ed-6064-538f-ea093f14b321` | /press `1ec73577-aa75-9258-ea03-07caad145b2a` | `is-press` section `c7b4cfec-b045-693a-395e-adf357d1c0d5` (emailLinks.ts hook, v1.3.22), header, heading, details, detail, form-block, fieldsets, footer |
| Contact Details Map | `dcfc7720-8c7b-8825-2cfe-e1f230373a34` | /contact `9b9f25b9-498c-bb3d-7f2b-eac0e03748aa` | `is-contact` section `955049f8-aa8e-9d6f-a588-f5f7114013ce`, content, header, heading `bc3c29e6-84e4-bbff-0688-eff706553cc8`, details, detail, links, link, media, map |

- form-split-script-contact (`2f0cac24-...`) was deleted on 2026-11-23 (see below).

### X1 Booking Menu Panel (2026-11-21)

- **Booking Menu Panel** `2fbda863-9fc6-56a5-3f2d-8bb94ef82de3` (group Modals): the Book menu dialog (`id="book"`), image and four fixed links (book a stay, reserve a table with chevron, host an event, book an appointment). No props, no variants. Lives in Booking Menu (`6c8187bb-...`) as instance `5cb00adb-d995-aa35-4ff5-e54d287f5027`, before the native `book-table` dialog.
- Combo `is-booking` on component `75a0b24f-1486-8433-1ab8-88a38488d758`, panel `4fcead1a-6bf7-f4c0-6d77-9dbd4b5f6daa`, bar, close, layout, figure, content, stamp, body, list, item, item-content, item-button `9456c186-9751-f041-b2cc-f54b2eff334c` (hover opacity 1), item-arrow (Burgundy variant styles).
- `.is-booking` joins the Burgundy exclusion in the button system (Site Nav `<style data-button-system>` embed `3639f68c-0d1e-0355-fd6d-d61a7593a03d` and `src/utils/buttonHover.ts`, v1.3.23).
- Overlay Detail Panel Modal (`44cccc51-...`) now only has the ten static Q041 art dialogs on /arts, which nothing opens (Art Detail Modal replaced them). Kept for Stephen to decide.

### X1 Art Detail Modal split (2026-11-21)

Art Detail Modal `4e402659-32e2-fddb-7dd9-6c1d17f58318` kept its four layout variants (Dark, Image Bg, Burgundy, Centered) for three different layouts. It is now three components:

- **Art Detail Modal** (arts only, the old Dark layout): variants deleted, footer, eyebrow, subheading, extras and list elements removed, unused props removed (numbered Item props, show switches, button, extras). Props left: Dialog id, Artist dialog id, Heading, Eyebrow, Show caption, Caption, Show eyebrow link, Image, Image alt, Text, Back link, Night - Image, Night - Text. Instances on /arts: artists `baf1e5a6-f6b4-afd6-5e1a-4d6904b050ec`, artworks `12203225-e1c0-00dc-027f-a3cec9537d14`.
  - Combo `is-art-piece`: component `23f536d2-d6db-ec89-13a9-640f8556bd77`, heading `463721c6-b492-1cf3-d877-c33433223188`, and on `_X.is-art`: panel `7e610c40-fe83-7224-8228-0e412b27d109` (small padding-top 24px, the value the old variant actually rendered), bar `b7b783f4-13a8-104b-f0fc-260ea27da318`, back-icon `b147fdb8-d414-2d02-e18b-2b202f4f4f1a`, back-label `6ab0297b-bbb5-dd96-dcf8-a93a605c8852`, layout `9ac24913-1c10-4e5f-f116-ab4955674bbe`, figure `bc48fe3f-a933-6ae4-4abe-819f91c33047`, content `edc37586-c6d3-cb46-491a-1d24cac76d14`, header `653a61c3-e0ae-3c6f-6820-d6b4fb4cc1bd`, body `ace0c4b8-262c-0e45-671f-a133d00069d8`.
- **Venue Detail Modal** `bf7623e5-058f-ec80-12e2-20bb187eaf9c` (meeting venue pop-ups): /meetings instance `ed76bffa-830f-341f-6c58-b7ad76dcf64b` (in pop-ups list `d8e7be81-...`), Legal & Corporate template instance `707f801f-f221-feec-8316-719db9f97197` (in `3418b6fc-...`). Keeps the Item 1 to 5 props because they bind to the numbered "Features - 1..5" Meeting Venues CMS fields (E6); making them a list needs a CMS restructure.
- **Place Detail Modal** `bc4e93ef-32a2-4b37-1d8d-dd918cbef423` (neighbourhood place pop-ups): /neighborhood instance `d46bdb62-823d-2684-f5df-69fcae78a98b`. Combo `is-place`: close `6fa0a5dc-42c6-8606-f260-9c8568f9a3aa`, heading `de448844-9ae0-96a7-1d9f-400592ac1807`, column `7bbfcc57-9ed2-b870-5f69-09b7e6045d40`, footer `3cae3069-eebb-35da-72cf-be1cb8a06444`, and on `_X.is-art`: content `c4d2f1b6-8305-db94-0c51-772c0f7250bf`, header `b37f4e50-3d05-2c64-3370-2cb488154ef5`, body `e064c63d-80f0-7dcc-0348-57c3c34bddfc`.
- The old instances `e8037524-...` (/meetings) and `2e13bf88-...` (Legal template) are removed. The `[class*="603a80753681"]` (old Art Burgundy) exclusion in the button system no longer matches anything; harmless, drop it on the next button-system edit.

### Unused components deleted (2026-11-23, Stephen: "Yes, delete all eight")

Each had 0 instances, and a scan of every page and component definition found no references. All other components kept their instance counts. Shared classes were not touched.

- faq-accordion `064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7` (FAQ Accordion `3a5f8147-...` is the live one)
- form-split-script-contact `2f0cac24-8156-b0d7-520c-f5128139d6b0`
- Offers Slider Split `96c19058-a54d-49c3-9568-d7aee87662b0`
- Venue Card Fullbleed, base `bbccdbb5-db17-02a1-a0cc-43ce0f5da371` (Tall and Left stay)
- Article Card Staggered, base `155bf09c-0bd4-9e9a-db53-4a8060b48cf1` (Tall stays)
- timeline-scatter-images Tall `33e949df-43c2-4806-b73e-d403ed483051` (base stays)
- Room List Hover Preview `a9d40053-f1b0-f862-ee0a-4f021e1933a9`
- Press Section Styles `e77687b2-205a-6e4f-e22b-b43f671f9e23`

Kept because still used: Split image text light (4), Overlay Detail Panel Modal (10 static dialogs on /arts that nothing opens).

## Names after the remodelling rollout (2026-11-25)

Display names only: every field, prop and variant keeps its id, and every field keeps its slug. Where older lines above use an old name, this table wins. Record: `docs/specs/cms-components/final-review-2026-11-25-fixes-webflow.md`.

### CMS fields

| Collection | Field id | Slug | Was | Now |
|---|---|---|---|---|
| 🍴 Dinings | `63c651cf987f786c0a9bbdadc6d59653` | `sort-order` | Card - Sort Order | Settings - Sort Order |
| 🍴 Dinings | `077299153af1ebe690650bf12ebabb52` | `split-section---look` | Split Section - Look | Settings - Page Colour |
| 🍴 Dinings | `bf1e0c9ecd32e63d6fcbcc434ba78092` | `night---home-card-image` | Night - Home Card Image | Home Card - Image (Night) |
| 🍴 Dinings | `5d576926c88d961d6a6df2491f1d95bb` | `night---home-card-heading` | Night - Home Card Heading | Home Card - Name (Night) |
| 🍴 Dinings | `b8f0662e9f48ab7accc2b0896e2f26e0` | `night---home-card-tagline` | Night - Home Card Tagline | Home Card - Tagline (Night) |
| 📰 Happenings & Stories | `3d27986165618c5d45dcff873530a2ae` | `category` | Post - Category | Settings - Category |
| 📰 Happenings & Stories | `101bc574a26dc6f44acb63f556b40042` | `card---topic` | Card - Topic | Settings - Topic |
| 📰 Happenings & Stories | `b31d639e86a84543aeb8dcb1aa2fcba6` | `topic` | Post - Topic | Settings - Topic Label |
| 📰 Happenings & Stories | `ad0c2566ded18b287e0d7f5313169e44` | `date` | Post - Date | Settings - Date |
| 📍 Map Places | `e2c905ef609b7282c8e1318e89b98aeb` | `order` | Place - Sort Order | Settings - Sort Order |
| 🛏️ Rooms | `5222d3966cb63053995ca2802f43b030` | `sort-order` | Card - Sort Order | Settings - Sort Order |
| 🛏️ Rooms | `baf9f2feb60cdb165cfee8e651be218a` | `room-type` | Card - Room Type | Settings - Room Type |
| 🛏️ Rooms | `2842d7cc5d042dfa315c7f6d43af4bba` | `show-in-recommendations-grid` | Card - Show In Recommendations | Settings - Show In Recommendations |
| 🛏️ Rooms | `c468cf9d6abf07ad5f096b97840956ee` | `card-and-hero-image` | Hero - Card And Hero Image | Room - Image |
| 🛏️ Rooms | `61f3dbfa04564c796c335b848d6660f5` | `night---card-image` | Night - Card Image | Room - Image (Night, Card) |
| 🛏️ Rooms | `23109efec94a92a80e230f8715b208c5` | `night---hero-image` | Night - Hero Image | Room - Image (Night, Hero) |
| 🛏️ Rooms | `77f12fccda41916e838fed0f7b82d989` | `night---feature-image` | Night - Feature Image | Room - Image (Night, Feature) |
| 🛏️ Rooms | `3fadc8d310e6709750dd0c5536d55b7b` | `night---card-heading` | Night - Card Heading | Card - Name (Night) |
| 🛏️ Rooms | `d629e628291943c712b171a20715aca4` | `night---hero-heading` | Night - Hero Heading | Hero - Name (Night) |
| 🛏️ Rooms | `a3ff806809e9f8ea7d6c6d92a7e7b0bc` | `night---hero-text` | Night - Hero Text | Hero - Intro (Night) |
| 🛏️ Rooms | `ee34198bd3a330f597899917bcd2174c` | `night---feature-video` | Night - Feature Video | Feature - Video (Night) |
| 🛏️ Rooms | `ac216030075509bb58ac61533d456d01` | `night---feature-text` | Night - Feature Text | Feature - Text (Night) |
| 🧭 Quiz Options | `91064fea8f4a9beaeba1a64cc6bc3740` | `step` | Quiz - Step | Settings - Quiz Step |
| 🧭 Quiz Options | `cdf2eecffd244da5ec3f27434adc52e0` | `sort-order` | Quiz - Sort Order | Settings - Sort Order |
| 🖼️ Art Collection | `ef04d9c4338c2194c7339ea5bb38eaaa` | `sort-order` | Card - Sort Order | Settings - Sort Order |
| 🖼️ Art Collection | `0bd419969a18943fe61f5555ca0f076f` | `category` | Art - Type | Settings - Type |
| 🖼️ Art Collection | `c5f18e1c77a4b9059f7482c551d64fc1` | `card---category` | Card - Category | Settings - Category |
| 📸 Gallery Photos | `c16baba88e384fb59545764801a5cb90` | `sort-order` | Photo - Sort Order | Settings - Sort Order |
| 📸 Gallery Photos | `f654122590fb89fbe5294025eb14d4bb` | `card---category` | Card - Category | Settings - Category |
| 📸 Gallery Photos | `0d0beb373da9a79311f499c757fc7316` | `category` | Photo - Category | Settings - Category (Old) |
| 📰 Press | `3243cd1e205c48536b3e4656eec32274` | `order` | Card - Sort Order | Settings - Sort Order |
| 📰 Press | `376cecea332874074444310c7d676cfb` | `press-category` | Card - Category | Settings - Category |
| 🏷️ Press Categories | `c6af895139bdcf06d1a9c236f2ada149` | `order` | Category - Sort Order | Settings - Sort Order |
| 🎁 Packages | `3781b9f8bcdbacfc34435b74840cb713` | `card---topic` | Card - Topic | Settings - Topic |
| 🎁 Packages | `d2d60380fc929173561617806480fcaa` | `topic` | Package - Topic | Settings - Topic Label |
| 🎁 Packages | `6617b2f977dee9cbb66fe99c1fe0c60a` | `date` | Package - Date | Settings - Date |
| ❓ FAQs | `f77d98b8a3df6ee8bf2719a30db26e23` | `sort-order` | FAQ - Sort Order | Settings - Sort Order |
| 🏛️ Meeting Venues | `fec7f04d7a1e5bccdae42dfc281d7884` | `sort-order` | Card - Sort Order | Settings - Sort Order |
| 🏛️ Meeting Venues | `1ffcb148508b11e78c1e5fbf9bd341fd` | `pages---meetings` | Pages - Meetings | Settings - Show On Meetings |
| 🏛️ Meeting Venues | `367e789bcd921cdf8a72f927f8a8f9ef` | `pages---legal-corporate` | Pages - Legal & Corporate | Settings - Show On Legal & Corporate |
| 🏖️ Beyond Downtown Places | `c841314d63ccd6780390adca7577820c` | `sort-order` | Card - Sort Order | Settings - Sort Order |
| 🏖️ Beyond Downtown Places | `aa85a47b649d59806df94fb0de4f196c` | `night---pop-up-image` | Night - Pop-up Image | Card - Image (Night, Pop-up) |
| 🏖️ Beyond Downtown Places | `699284ab472b2ba0e49cbe87396321d5` | `night---pop-up-text` | Night - Pop-up Text | Pop-up - Text (Night) |
| 🛎️ Amenities | `aeb182d1a218e5e2094fbaf74032771f` | `sort-order` | Sort order | Settings - Sort Order |
| 🖼️ Media | `a5a30e30431b028568aca7d03e54257d` | `media---sort-order` | Media - Sort Order | Settings - Sort Order |
| 🔖 Topics | `7c209bb769ff082dce266a4397e5c67d` | `sort-order` | Sort Order | Settings - Sort Order |
| 🏷️ Art Categories | `51465338cf2d434427e7822444b4237c` | `sort-order` | Sort Order | Settings - Sort Order |
| 🏷️ Gallery Categories | `56b8ae787f72e6697df594ae8266efe2` | `sort-order` | Sort Order | Settings - Sort Order |
| 🏷️ Offers | `c37cfb4805b46985995a78339d302455` | `slide---sort-order` | Slide - Sort Order | Settings - Sort Order |
| 🏷️ Offers | `98656026dc765e98e2fab101672b21d3` | `slide---slider` | Slide - Slider | Settings - Slider |
| 🏛️ Meeting Venues | (pilot, earlier on 25 Nov) | `night---card-image`, `night---card-heading`, `night---card-intro` | Night - Card Image, Heading, Intro | Card - Image (Night), Card - Name (Night), Card - Intro (Night) |

Every collection has its folders in the order of the table in `final-review-2026-11-25-webflow.md`; Settings is first wherever a general setting exists.

### Component night props (moved out of the Night group)

| Component | Prop id | Was | Now | Group |
|---|---|---|---|---|
| Hero Fullbleed Centered | `21b09566-03fd-0051-818f-6f35c27f5fb9` | Night - Image | Image (Night) | Background |
| Hero Fullbleed Centered | `97c44009-a084-4f44-6102-e721f79d0785` | Night - Video | Video Link (Night) | Background |
| Hero Fullbleed Centered | `2c401db1-96d5-7fbc-68c2-7ea0e151ac56` | Night - Heading | Heading (Night) | Content |
| Hero Fullbleed Centered | `32288b4b-153b-10c9-5dd3-899cd39ec703` | Night - Button Text | Button Text (Night) | Button |
| Hero Fullbleed Centered | `2ed09e14-1566-f905-edf9-168537ceca08` | Night - Button Link | Button Link (Night) | Button |
| Hero Fullbleed Centered | `86753272-8614-a075-f9e4-f37b9b151c1a` | Night - Text | Text (Night) | Content |
| Split image text light | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split image text light | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split image text light | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split image text light | `78558e6b-1567-5f43-15bd-3b714afa4d7c` | Night - Button Text | CTA label (Night) | Content |
| Split image text light | `e982fcea-d4f2-0b76-93e5-c907566942a7` | Night - Button Link | CTA (Night) | Content |
| Split image text light | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Venue Card Fullbleed Tall | `56b4192c-b197-c8ee-3c9a-e6791c20a872` | Night - Image | Image (Night) | Image |
| Venue Card Fullbleed Tall | `253ea9c9-f8e5-381c-ca71-6f529ab829e6` | Night - Video | Video (Night) | Image |
| Venue Card Fullbleed Tall | `d181cbd9-dbf9-2625-3bec-af376cf95ca4` | Night - Heading | Heading (Night) | Content |
| Venue Card Fullbleed Tall | `c2815958-c118-e5ce-3fd8-fcb5693033e4` | Night - Button Text | Button Label (Night) | Button |
| Venue Card Fullbleed Tall | `fce9ab5f-4abb-969e-751f-e7a86dd985ee` | Night - Button Link | Button Link (Night) | Button |
| Venue Card Fullbleed Tall | `4d023148-db3e-68a2-a0f0-c97151354bf7` | Night - Text | Text (Night) | Content |
| Art Detail Modal | `a8711651-ed04-7e53-8bf6-136d38fb7ce8` | Night - Image | Image (Night) | Media |
| Art Detail Modal | `66c06093-dcad-41b3-24df-7a536e5e1d77` | Night - Text | Text (Night) | Body |
| Article Card Tall Item | `74ac4aba-b27c-c7a1-af6e-2f1244b585ec` | Night - Image | Image (Night) | none |
| Article Card Tall Item | `a6d0d9d1-1eee-4564-8303-2a573be959bb` | Night - Heading | Heading (Night) | none |
| Article Card Tall Item | `68056cc1-8542-d901-2fe5-fbef8d23a4ba` | Night - Text | Text (Night) | none |
| Split Image Text Edge | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Edge | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Edge | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Edge | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Split Image Text Edge Large | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Edge Large | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Edge Large | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Edge Large | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Split Image Text Wide | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Wide | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Wide | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Wide | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Split Image Text Stagger Left | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Stagger Left | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Stagger Left | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Stagger Left | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Split Image Text Stagger Mid | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Stagger Mid | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Stagger Mid | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Stagger Mid | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Split Image Text Compact | `22f24909-4cb8-d01f-dda8-1c461c55affe` | Night - Image | Image (Night) | Images |
| Split Image Text Compact | `54038270-27b7-6232-ae84-437b289ac64d` | Night - Video | Video (Night) | Images |
| Split Image Text Compact | `000e7667-74c5-858a-16c3-0d2698038cb0` | Night - Heading | Heading (Night) | Content |
| Split Image Text Compact | `858c6171-3e04-be31-36e1-15b742ca1404` | Night - Text | Body (Night) | Content |
| Venue Detail Modal | `a8711651-ed04-7e53-8bf6-136d38fb7ce8` | Night - Image | Image (Night) | Media |
| Venue Detail Modal | `66c06093-dcad-41b3-24df-7a536e5e1d77` | Night - Text | Text (Night) | Body |
| Place Detail Modal | `a8711651-ed04-7e53-8bf6-136d38fb7ce8` | Night - Image | Image (Night) | Media |
| Place Detail Modal | `66c06093-dcad-41b3-24df-7a536e5e1d77` | Night - Text | Text (Night) | Body |

### Variants (names only)

| Component | Variant id | Was | Now |
|---|---|---|---|
| Hero Fullbleed Centered | `1eb6c0d5-60d0-db3a-5e94-41f3cf7f9625` | Home | Mobile Short Button Label |
| Gallery Mosaic Captioned | `76af03c7-cd03-42c9-a8b6-104e98388a6c` | Dining | Mobile Lower Heading |
| Map Feature | `a65a3b03-fb07-bd94-4702-0e0a50312c90` | Home | Mobile Full Bleed |
| Map Feature | `0a163214-6dd2-ca63-86b5-432c1c1678d5` | Dining | Mobile Full Bleed 2 |
| Split image text light | `755a49f7-834d-0950-117b-678866226119` | Neighborhood Downtown | Mobile Text First |
| Image Trio Text | `45b71a39-9a72-e800-bd67-7e1967d510de` | Home | Mobile Left Aligned |
| Image Trio Text | `0d31b24e-acf0-8dd5-cf1f-9e3e1163cd12` | Dining | Mobile Left Aligned 2 |
| script-intro-centered | `0fb367ce-08e1-818d-cb19-a30723516b7e` | Arts | Mobile Tight Heading |
| script-intro-centered | `4395a28c-f653-e0ab-3acd-2e573bc7345a` | Neighborhood | Mobile Medium Heading |
| script-intro-centered | `53add6a3-3c55-e4ed-2f36-460edae2cb76` | Legal Corporate | Short Padding, Wide Heading |
| script-intro-centered | `7a7cf0d6-246e-60d6-f246-c8de364be62f` | History | Short Bottom Padding |
| script-intro-centered | `a23a1a12-25dc-a914-6611-89f4d3beedb4` | Small Heading | Mobile Small Heading |
| script-intro-centered | `e4bd4c20-6499-56f7-64db-9fa47a4a1f40` | Large Heading | Tight Padding, Mobile Large Heading |
| script-intro-centered | `ac455635-ebdb-afce-1b26-c3754520f0b3` | Tall | Extra Bottom Space |
| script-intro-centered | `211f09b3-312a-f072-e7c4-4e0894618a51` | Bottom | Image Below |
| tab-pills-intro | `59a1b413-f64f-13c3-5d27-710cb741a3c0` | Press | Mobile Small Heading, Wide Pill |
| Map Feature Image Bg | `a6eedfb4-4763-3aa6-88c1-4e4d7fd40feb` | Stacked | Mobile Stacked |
| Card Carousel Header Left | `69ec3688-574e-61b2-83e0-6c45e105cc09` | Legal Corporate | Desktop Tight Top |
| Card Carousel Header Left | `d0c45960-92d6-af25-7b58-b128d8a0affe` | Contact | Short Bottom Padding |

Split image text light `50d0d660-fa88-c432-96fa-679fbe31a938` (Olive Home) and `42c9f9a1-d85c-7fa8-47d7-f5d9df7eaa79` (Olive Dining) keep their names: "Olive" is already taken by an unused variant.

### Added in the review fixes

- Global Styles embed "hide when empty" `8e647df2-82d2-101a-ab51-f4e8893040b9`: press logo box, dining menu link, pop-up floorplan link, slider button, artwork byline, 404 button label.
- tab-pills-intro embed `dc689a59-9bf2-33be-7a81-aad0e8ea4d73`: the empty slot wrapper no longer takes a gap.
- Art Detail Modal plain byline span `f3f22d50-245e-889b-4369-75a40e53fd8e` (bound to Eyebrow).
- Contact Details Map links: address `ccf57e65-54d5-efdb-28f3-6aded36f5b17`, phone `ec978391-5397-c667-29a0-83de7fe7b6cc`, info `ec978391-5397-c667-29a0-83de7fe7b6d0`, sales `55f792b7-582f-eecf-bff0-86b8c0550930`, billing `0c7c1481-b356-b75d-8c15-3c6cf2a20ba6` (class `text-style-link`).
- Combos: `venue-card-fullbleed_tabs.is-compact` `e6028591-638b-e2c4-28d9-43c018fbb543`, `venue-card-fullbleed_tab.text-style-eyebrow-caps.is-compact` `978e64ef-eea1-29d2-a687-deb1de79214d` (legal template tabs).
- Form Legal Corporate Proposal root has DOM id `request-for-proposal`; Venue Detail Modal button `bf7623e5-058f-ec80-12e2-20bb187eaff2` has `data-modal-close`.
- Removed: Arts `0e92d885-...` (second Gallery Canvas Styles), Gallery `3d0bee30-...` (second Global Styles), Booking Menu empty header `f2b614be-...e07`, three hidden Footer Links items (`...edbf`, `...edc2`, `...edc8`).
- Form names: Photoshoot Request, Meetings Proposal Request, Legal and Corporate Proposal Request, Press Enquiry.
