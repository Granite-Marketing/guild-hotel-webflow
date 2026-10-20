# Designer cleanup checklist (W04)

For Stephen, in the Webflow Designer. The Data API cannot delete pages, so these are manual. Checked against the live site on 2026-10-20 (`list_pages` on site `6ad6405eae8eac6d7b7c41a3`, and the published HTML of every real page).

## Before you start

- [ ] Site Settings > Backups > Create backup, named "pre-cleanup 2026-10-20".
- Components are site-level: deleting a build page does not delete the component built on it. Every component already has an instance on a real page.

## 1. Delete the build pages (20)

Pages panel (P) > hover the page > cog > Delete page. Deleting a page also deletes the old reference sections left on it, so there is no separate step for those.

| Done | Page | Id | Slug |
|---|---|---|---|
| [ ] | 🧱 cta-booking-newsletter | `6ad712be4a1db356ac74034b` | `/build-cta-booking-newsletter` |
| [ ] | 🧱 footer-links | `6ad712c0de3165cd9f83bb50` | `/build-footer-links` |
| [ ] | 🧱 hero-fullbleed-centered | `6ad712c2faaaa1926dd00419` | `/build-hero-fullbleed-centered` |
| [ ] | 🧱 faq-accordion | `6ad712c2faaaa1926dd004e3` | `/build-faq-accordion` |
| [ ] | 🧱 script-intro-centered | `6ad712c471aebc47c94f1c20` | `/build-script-intro-centered` |
| [ ] | 🧱 split-image-text-light | `6ad712c53e506fddaa973858` | `/build-split-image-text-light` |
| [ ] | 🧱 gallery-mosaic-captioned | `6ad712c63e506fddaa973910` | `/build-gallery-mosaic-captioned` |
| [ ] | 🧱 map-feature | `6ad712c79096987033862a20` | `/build-map-feature` |
| [ ] | 🧱 image-trio-text | `6ad712c8f7fb71b6e78048f9` | `/build-image-trio-text` |
| [ ] | 🧱 venue-card-fullbleed | `6ad712c8f7fb71b6e780492e` | `/build-venue-card-fullbleed` |
| [ ] | 🧱 form-split-script-contact | `6ad712c99096987033862bfc` | `/build-form-split-script-contact` |
| [ ] | 🧱 tab-pills-intro | `6ad712caa15308564d06f1a8` | `/build-tab-pills-intro` |
| [ ] | 🧱 image-inset-single | `6ad712cc8669ab49cd2c7290` | `/build-image-inset-single` |
| [ ] | 🧱 article-card-staggered | `6ad712cd74b1a594d93c88aa` | `/build-article-card-staggered` |
| [ ] | 🧱 timeline-scatter-images | `6ad712cefaaaa1926dd00d80` | `/build-timeline-scatter-images` |
| [ ] | 🧱 site-nav | `6ad769cad74aa30b7c564578` | `/build-site-nav` |
| [ ] | 🧱 offers-slider-split | `6ad77f7b41c3b044b01140a4` | `/build-offers-slider-split` |
| [ ] | 🧱 card-carousel-header-left | `6ad78814d14363c9008ddeff` | `/build-card-carousel-header-left` |
| [ ] | 🧱 overlay-detail-panel-modal | `6ad7885b7f5d5d50523f997f` | `/build-overlay-detail-panel-modal` |
| [ ] | 🧱 room-list-hover-preview | `6ad7b5d7fc756e91b34c370c` | `/build-room-list-hover-preview` |

Before deleting `🧱 overlay-detail-panel-modal` and `🧱 room-list-hover-preview`, open each and confirm nothing on it is the only copy of a modal a real page opens (the `/rooms` all-rooms dialog is its own instance `80f767d6-0090-5ef7-fde4-878985946d8c`, so it is safe).

## 2. Delete the probe pages (2)

| Done | Page | Id | Slug |
|---|---|---|---|
| [ ] | X01 Probe | `6ad67d5fba7363623522fef3` | `/x01-probe` |
| [ ] | X01 Probe B | `6ad67d608726a8a445349dc0` | `/x01-probe-b` |

## 3. Keep these

- Style Guide (`/style-guide`, draft): the factory requires it.
- Starter Components (`/starter-components`, draft): source for navbar and form elements the MCP cannot build.
- 404 and Password: system pages.

## 4. Styles

Do these after the page deletes, because deleting pages orphans their classes.

- [ ] **Duplicate `section_placeholder`.** Two global styles share the name: `34766799-7ade-616b-875e-1e8d19002c96` (grey fill, 5rem padding, from Q040) and `9333d82a-f287-e5ad-35b6-253c516b6c05` (dashed border, 4rem padding, from Q036). No published page uses either any more (every Q007 to Q009 slot is built). Style panel > Style Manager > search `section_placeholder` > delete both, or let step 5 remove them.
- [ ] **Clean up unused styles.** Style Manager (Style panel > the brush and list icon) > Clean up (top of the panel) > review the list > Remove. This removes every class and combo no element uses, which covers the empty combos the build sessions left behind and the classes that only lived on the build and probe pages.
  - Check the list before removing: the bundle adds `is-active`, `is-open`, `is-overflowing`, `is-video-ready` and `hide` at runtime, and Swiper adds `swiper-*` classes. Untick any of those combos if they appear.
- [ ] Publish to the webflow.io subdomain only, then spot check Home, Rooms and Gallery.
