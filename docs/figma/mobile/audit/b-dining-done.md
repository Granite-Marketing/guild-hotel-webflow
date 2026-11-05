# Audit B: Dining, done (2026-11-04)

Every change is at the 767px breakpoint (some also at 479px), or sits in a new dining-only variant copied from the original. Desktop and tablet are unchanged: a CSS diff of the published stylesheet before and after shows no rule change at or above 768px for these classes, and the new variants match the variants they were copied from. The 1440px section order and heights for gardenterrace were checked. Published to the webflow.io staging subdomain only. No `src/` change, no changeset.

Scoping: a crawl of all 34 staging pages showed which classes and variants appear only on dining pages. Dining-only classes (`text-columns-info`, `image-pair-text`, `quote-band-dark`, `card-stagger-header-left`) and dining-only variants (Hero Blue Button and Burgundy Button, Split Stagger Left and Blue, script-intro Wide) were edited in place. Shared components got a dining-only variant, and the dining instances were switched to it: Split "Olive Dining", Image Trio Text "Dining", Gallery Mosaic Captioned "Dining" and Map Feature "Dining" (ids in `docs/reference/webflow-ids.md`). The details titles got a new combo, `text-style-eyebrow-caps.is-info-title`, which has no desktop styles. Anything that needs a global class is in `shared-queue.md` in the integration checkout.

Before images are the audit's `img/dining-*-live.jpg` (Figma is `-figma.jpg`). After images are `img/after-*.jpg`, taken at 390px on staging after the final publish.

## Venue template (gardenterrace, lobbybar, poollounge, zuma)

All four pages were re-measured after publishing; every value in this table matches on all four.

| row | action | result at 390 / notes |
|---|---|---|
| G1 | fixed | FAQ moved after "other dining options" in the template (that section is hidden on desktop, so the desktop order is the same) |
| G2, G3 | fixed | Hero footer is absolute at the bottom of the hero (bottom -2rem), button padding 2.2rem: 194 x 36 at y 780, and stickyCta docks it 28px from the bottom of the screen |
| G4, G5, Z3 | fixed | follow G3: title y 694 (Zuma 674) |
| G6, G8, G13 | match | |
| G7, G9, G10 | fixed | Olive Dining and Blue variants: padding 64 / 96, image to heading gap 64, heading 24 / 26.4 / -1.2 |
| G11 | skipped | Figma repeats the section 03 lead text as placeholder copy. Adding it would show the same text twice and change desktop |
| G12 | skipped | the link is hidden under the body text in Figma (not visible in the render) |
| G14 to G17 | fixed | details padding-top 120, lead paragraph first and 350 wide, gap 80, titles 20 / 27 / -1 (`is-info-title`) |
| G18 to G20 | match | |
| G21 | fixed | links have 36px tap targets with an 8px gap |
| G22 | skipped | content: `venue-site-link` is empty on these items |
| G23, G24 | fixed | Stagger Left image 350 x 316; links to image gap 80 |
| G25 to G27 | fixed | heading 20 / 27 / -1, heading to text gap 16, image to heading gap 120 |
| G28, G30, G33, G35 | fixed | image-pair gaps all 120 |
| G29 | skipped | 1px difference (245 vs 244) |
| G31, G32 | fixed | paragraph before image 03, 16 / 20, 289 wide |
| G34, G40, G47, G50 | match | |
| G36 to G39 | fixed | Trio Dining: padding 96 / 96, heading 28 / 28 / -1.4 left, paragraph gap 16, link 14 / 18 / -0.7 left with a 36px target and 24 gap |
| G41 | skipped | progress scale is set at runtime by image stack collapse; the difference is 3% |
| G42 | skipped | the bottom "enquire" button repeats the G39 link |
| G43 to G46 | fixed | Gallery Dining: image 1 is 390 x 612, images 2 to 4 are 390 x 480 |
| G48, L1, Z8 | fixed (style) | heading 28 / 28 / -1.4, 40px from the top. Text stays "gallery": the venue names are CMS content that also shows on desktop |
| G49 | fixed | captions 14 / 16.8 / -0.42 |
| G51 | fixed | padding 96 / 64 |
| G52 | queued | uses the global `heading-style-h2` |
| G53, G54, G58 | match | |
| G55, G56, L3, L4 | fixed | card heights are set by position (first 437, second 306.5, last 403.2), so the result no longer depends on the photo's own shape |
| G57, G59 | fixed | label letter-spacing -1, card padding-bottom 24 |
| G60 to G62 | queued | `faq-accordion` is used on 26 pages |
| G63 to G65 | match | |
| L2 | fixed | the poollounge image (slider) box is also 350 x 316 (it uses the Stagger Left variant) |
| L5 | skipped | focal point of a landscape photo; content, not CSS |
| Z1, Z2 | fixed | Zuma logo 240 x 58.3 at x 75, top 300 |
| Z4 to Z7 | fixed | quote band padding 120 / 20, quote 18 / 21.6 and 350 wide, gap 48, press logo 160 wide |

## /dining collection

| row | action | result / notes |
|---|---|---|
| C1, C2, C31 | skipped | a line break would also change desktop on a shared hero or slider |
| C3, C4, C8, C29, C30, C33 | match | |
| C5, C7, C9 | fixed | script-intro Wide: padding 160 / 160, heading to body gap 32 (the body sits 68px higher than in Figma until C6 lands) |
| C6, C20 | queued | `text-style-script.is-large` is global |
| C10 to C17 | queued | `venue-card-fullbleed` is native on 7 pages and uses global text, display and button classes |
| C18, C23, C32 | queued | global `button` size |
| C19, C22, C24, C25 | fixed | Map Dining: padding-top 96, map flush with the section bottom |
| C21 | fixed | text max-width 16rem, so it wraps onto two lines |
| C26 to C28 | queued | FAQ, as G60 to G62 |
| C34 | queued | `offers-slider-split` is shared site-wide |

## Screenshots (390px, after)

- gardenterrace: `after-gt-1` hero, `-2` intro, `-3` details, `-4` image pair, `-5` group dining, `-6` gallery, `-7` other dining, `-8` FAQ. The explore split between details and the image pair has no screenshot of its own; its measured values are in the table.
- Zuma: `after-zuma-1` hero, `after-zuma-2` quote band.
- /dining: `after-coll-1` script intro, `after-coll-2` neighborhood map.
