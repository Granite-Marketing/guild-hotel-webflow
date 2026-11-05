# Audit B: Dining (390px, Figma mobile vs live staging)

Method: Figma values from `figma/mobile/nodes.json.gz` (frames 14:15167 collection, 27:5985 zuma, 867:15481 gardenterrace, 867:15943 lobbybar, 867:16352 poollounge), live values from Playwright (Chrome, 390x844, scrolled once) on `/dining` and `/dining/dining-{zuma,gardenterrace,lobbybar,poollounge}`. All y values are document coordinates; "block-relative" means measured from the block's top. Global nav, CTA newsletter and footer are skipped (other audit). Read-only: nothing was changed in Webflow. Screenshots: `img/dining-<page>-<n>-{figma,live}.jpg` (gt = gardenterrace).

Shape note: every image in all five Figma frames is a plain rect (no chamfer vectors or masks on photos), and no live photo has a clip-path. Only buttons are chamfered, and those match. The one chamfer difference is the initial scroll-enlarge frame on the collection (see D-C10).

Known fact for every page: a "reserve a table" button is `position: relative` in the hero at rest and is switched to `position: fixed` by script after scroll (verified: static at y 732, fixed at viewport y 732 after scrolling).

---

## dining-gardenterrace (template for lobbybar and poollounge)

Live section order: hero, split-image-text-light (intro), text-columns-info, split-image-text-light (explore), image-pair-text, image-trio-text, gallery-mosaic-captioned, faq-accordion, card-stagger-header-left, (cta-newsletter). Figma order: hero, intro, details, explore, group dining, material gallery, other dining options, FAQ.

Page-level: Figma "Other dining options" comes BEFORE the FAQ; live has the FAQ first, then "other dining options" (D-G1). Total height through the end of FAQ plus other dining: Figma 9250 vs live 7919 (-1331).

### 01 Hero (Figma y0-800, live y0-800) images: `dining-gt-1-*`

| # | block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|---|
| G1 | hero | page order | main children | order | other dining then FAQ | FAQ then other dining | reorder sections (swap) in Dinings Template |
| G2 | hero | reserve button (fixed state, after scroll) | `a.button.is-chamfer.is-wide` in `hero-fullbleed-centered_footer` | width / viewport top | 194 x 36 at y 780 (bottom 28px of 844) | 173.5 x 37 at y 732 (bottom 76px) | width: 194px; fixed bottom: 28px |
| G3 | hero | reserve button (resting) | same | y / flow | y 780, straddles hero bottom by 16px, not in flow | y 732 in flow, inside hero | take footer out of flow at rest: position absolute, top calc(100% - 20px) of hero |
| G4 | hero | h1 title | `hero-fullbleed-centered_heading heading-style-h2` | y | 694 | 634 (-60, CTA in flow) | fixed by G3 (header must end at 768, bottom pad 32) |
| G5 | hero | description | `hero-fullbleed-centered_text text-size-large` p | y | 748 | 688 (-60) | fixed by G3 |
| G6 | hero | h1 and p size | same | font | 28/30 -1.4 center, 16/20 | 28/29.96 -1.4 center, 16/20 | none (match) |

### 02 Restaurant introduction (Figma y800-1806 h1006, live y800-1569.5 h769.5) images: `dining-gt-2-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G7 | intro | section | `section_split-image-text-light` > `padding-global padding-section-large` | padding-top / bottom | 64 / 96 | 40 / 40 | padding-top 64px, padding-bottom 96px |
| G8 | intro | image | `split-image-text-light_media` img.u-image | box | 350x450 at y 864 | 350x449.5 at y 840 | y differs by padding only; size matches |
| G9 | intro | image to heading gap | `split-image-text-light_component` | gap | 64 | 32 | row-gap 64px |
| G10 | intro | heading | `split-image-text-light_heading heading-style-h4` | font-size / line-height / letter-spacing | 24 / 26.4 / -1.2 (2 lines, h 52) | 20 / 24 / normal (2 lines, h 48) | font-size 24px, line-height 26.4px, letter-spacing -1.2px (intro variant only) |
| G11 | intro | second paragraph "Nam in massa..." | missing | present | 16/20, 5 lines, 40px below first paragraph | absent from intro (appears later as aside, G17) | add second `p` to `split-image-text-light_body` (Figma shows the same text twice: here and as section 03 lead) |
| G12 | intro | "uncover our history" link | missing | present in frame (36px target, 14/18 -0.7, left) at y 1582, overlaps body, not visible in the render | absent | confirm with Stephen whether hidden; no change proposed |
| G13 | intro | body / heading to body gap | `split-image-text-light_body text-size-medium` | font / gap | 16/20 left, gap 40 | 16/20 left, gap 40 | none (match) |

### 03 Dining details (Figma y1806-2912 h1106, live text-columns-info y1569.5-2124.7 h555.2) images: `dining-gt-2-*` (lower half)

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G14 | details | section | `section_text-columns-info` > `padding-section-medium` | padding-top | 120 | 32 | padding-top 120px |
| G15 | details | lead paragraph "Nam in massa" | `text-columns-info_aside` | order | first element (y 120, 350 wide, 16/20) | last element (after links, y 417 block-relative, 344 wide with 6px top padding) | move aside above the list; remove 6px padding-top; width 350 |
| G16 | details | aside to list gap | `text-columns-info_component` | gap | 80 | 48 (grid row-gap) | row-gap 80px |
| G17 | details | titles "dress code", "hours of operation" | `text-columns-info_header h3.text-style-eyebrow-caps` | font | 20 / 27 / -1 | 18 / 21.6 / -0.54 | font-size 20px, line-height 27px, letter-spacing -1px |
| G18 | details | title to text gap | `text-columns-info_item` | gap | 16 | 16 | none (match) |
| G19 | details | item gap | `text-columns-info_list` | row-gap | 72 | 72 | none (match) |
| G20 | details | body text | `text-columns-info_text` | font | 16/20 | 16/20 | none (match) |
| G21 | details | links | `text-columns-info_link` (in `_footer`) | tap target height | 36 (label offset +9) | 18 | padding 9px 0 on link (height 36); link gap 8px |
| G22 | details | second link "discover zuma" | `eeea8d64...` link block | present | present on all 4 frames (placeholder text "discover zuma") | hidden (no `venue-site-link`) | content decision, no CSS |
| G23 | details | image after links (Figma 03 image, 350x316) | `split-image-text-light_media` of explore split | aspect | 350x316 (1.108) | 350x230.1 (1.521) | `aspect-ratio: 350 / 316` on the explore split figure (variant 5fb6b74c) |
| G24 | details | links to image gap | between `_footer` and image | gap | 80 | 84.6 (below aside) | follows G15 |

### 04 Explore the space (Figma y2912-4275 h1363, live: explore split + image-pair-text y2124.7-3436.2 h1311.5) images: `dining-gt-3-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G25 | explore | heading "explore the space" | `split-image-text-light_heading` (explore variant) | font | 20 / 27 / -1 | 20 / 24 / normal | line-height 27px, letter-spacing -1px |
| G26 | explore | heading to text gap | `split-image-text-light_header` / `_content` gap | gap | 16 | 40 | content row-gap 16px for this variant |
| G27 | explore | image 350x316 to heading gap | `split-image-text-light_component` | gap | 120 (section pad-top 120) | 32 | row-gap 120px for this variant |
| G28 | explore | text to portrait image gap | between `_body` and `image-pair-text_figure` | gap | 120 | 80 (40 + 40 section padding) | image-pair-text padding-top 80px (total 120) |
| G29 | explore | portrait image 02 | `image-pair-text_figure` | box | 244x334 at x20 | 245x335.4 at x20 | width 244px (1px, optional) |
| G30 | explore | image 02 to paragraph gap | `image-pair-text_component` | gap | 120 | 32 (grid gap) | row-gap 120px |
| G31 | explore | stacking order | `image-pair-text_content` | order | paragraph "Curabitur" THEN image 03 (right) | image 03 THEN paragraph | order: paragraph first (flex `order`) |
| G32 | explore | paragraph "Curabitur" | `image-pair-text_text` | font / width | 16/20, 289 wide (h 80, 4 lines) | 20/26, 350 wide (h 104, 4 lines) | font-size 16px, line-height 20px, max-width 289px |
| G33 | explore | paragraph to image 03 gap | `image-pair-text_content` | gap | 120 | 48 | row-gap 120px |
| G34 | explore | image 03 | `image-pair-text_figure.is-portrait` | box | 175x226 at x195 (right edge 370) | 175x226 at x195 | none (match) |
| G35 | explore | section bottom | `image-pair-text` padding-bottom | padding | 120 | 40 | padding-bottom 120px |

### 05 Group dining and events (Figma y4275-5219 h944, live image-trio-text y3436.2-4217.6 h781.4) images: `dining-gt-4-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G36 | group | section | `section_image-trio-text` > `padding-section-large` | padding-top / bottom | 96 / 96 | 40 / 40 | 96px / 96px |
| G37 | group | heading | `image-trio-text_heading heading-style-h3` | font / align | 28 / 28 / -1.4, left, 2 lines (h 56) | 24 / 24 / -1.2, center, 1 line | font-size 28px, line-height 28px, letter-spacing -1.4px, text-align left |
| G38 | group | paragraph | `image-trio-text_paragraph` | align / gap | left, gap 16 after heading | center, gap 24 | text-align left; header row-gap 16px |
| G39 | group | enquire link | `image-trio-text_link text-style-eyebrow-caps` | font / align / height | 14 / 18 / -0.7, left (x20), target 36, gap 24 above | 18 / 21.6 / -0.54, centered (x152.9), h 21.6, gap 32 | font-size 14px, line-height 18px, letter-spacing -0.7px, align flex-start, padding 9px 0 |
| G40 | group | gallery slides | `image-trio-text_figure` | box | 350x440 | 350x440.8 | none (match) |
| G41 | group | progress | `image-trio-text_progress-fill` | width | 128 of 350 (36.6%) | 116.7 (scaleX 0.3333) | initial scaleX 0.366 (or 128px) |
| G42 | group | bottom CTA | missing | element | chamfer button "enquire" 115x36 centered, 28 below progress | absent | add `.button.is-chamfer` footer below progress (or confirm duplicate of G39) |

### 06 Material details 1-4 / gallery (Figma y5219-7274 h2055, live gallery-mosaic-captioned y4217.6-5975.6 h1758) images: `dining-gt-5-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G43 | gallery | image 1 | `gallery-mosaic-captioned_figure.is-wide` | size / aspect | 390x612 (0.637) | 390x487.5 (0.800) | aspect-ratio 390 / 612 on first figure |
| G44 | gallery | image 2 | `gallery-mosaic-captioned_figure` (default) | size / aspect | 390x480 (0.8125) | 390x390 (1.000), 23% off | aspect-ratio 390 / 480 |
| G45 | gallery | image 3 | same | size / aspect | 390x480 | 390x390 | aspect-ratio 390 / 480 |
| G46 | gallery | image 4 | `.is-wide` | size / aspect | 390x480 (0.8125) | 390x487.5 (0.800) | aspect-ratio 390 / 480 |
| G47 | gallery | gap | `gallery-mosaic-captioned_grid` | row-gap | 1 | 1 | none (match) |
| G48 | gallery | title | `gallery-mosaic-captioned_heading heading-style-h4` | text / font / top | "garden terrace gallery" 28 / 28 / -1.4, 2 lines (h 56), 40 from top | "gallery" 20 / 24 / normal, 20 from top | font-size 28px, line-height 28px, letter-spacing -1.4px, top 40px; text per venue (content) |
| G49 | gallery | captions | `gallery-mosaic-captioned_caption text-style-caps-caption-16` | font | 14 / 16.8 / -0.42 | 16 / 19.2 / -0.48 (index 10px) | font-size 14px, line-height 16.8px, letter-spacing -0.42px |
| G50 | gallery | caption offset | `_caption` | bottom / left | 20 / 20 | 20 / 20 | none (match) |

### 07 Other dining options (Figma y7274-8110 h836, live card-stagger-header-left y7127.2-7919.2 h792) images: `dining-gt-6-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G51 | other | section | `section_card-stagger-header-left` > `padding-section-large` | padding-top / bottom | 96 / 64 | 40 / 40 | 96px / 64px |
| G52 | other | heading | `heading-style-h2` in `_header` | font / lines | 28 / 28 / -1.4, 1 line (h 28) | 30 / 30 / -1.5, 2 lines (h 60) | font-size 28px, line-height 28px, letter-spacing -1.4px (wraps once to 1 line) |
| G53 | other | text | `card-stagger-header-left_text` | font | 16/20, 3 lines | 16/20, 3 lines | none (match) |
| G54 | other | card 1 image | `card-stagger-header-left_figure` img | box | 310x437.1 | 310x437 | none (match) |
| G55 | other | card 2 image | same, 2nd card | box | 310x306.5 (1.011) | 310x465 (0.667), 34% off | figure height 306.5px, img height 100% object-fit cover (img natural 390x585 overrides aspect-ratio) |
| G56 | other | card 3 image | same, 3rd card | box | 310x403.2 (0.769) | 310x437 (0.709) | figure height 403.2px |
| G57 | other | card label | `card-stagger-header-left_label` | letter-spacing | -1 (20/27) | -0.6 (20/27) | letter-spacing -1px |
| G58 | other | card gap / x | `_list` | gap | 20, cards 310 wide | 20, 310 | none (match) |
| G59 | other | card bottom pad | `_card` | padding-bottom | 24 | 0 on cards 1 and 3 | padding-bottom 24px |

### 08 FAQ (Figma y8110-9250 h1140, live y5975.6-7127.2 h1151.6) images: `dining-gt-7-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| G60 | faq | eyebrow "faqs" | `faq-accordion_header` `div.text-style-eyebrow-caps` | font | 12 / 18 / -0.36 | 18 / 21.6 / -0.54 | font-size 12px, line-height 18px, letter-spacing -0.36px |
| G61 | faq | title | `heading-style-h2` in `faq-accordion_header` | font | 28 / 28 / -1.4 (h 56) | 30 / 30 / -1.5 (h 60) | font-size 28px, line-height 28px, letter-spacing -1.4px |
| G62 | faq | header gap | `faq-accordion_header` | row-gap | 12 | 16 | row-gap 12px |
| G63 | faq | question | `accordion_question heading-style-h4` | font | 18 / 21.6 / 0, 310 wide | 18 / 21.6 / normal, 310 | none (match) |
| G64 | faq | item pitch | `accordion_item` | height | 73 + 40 gap (113 closed, 249 open) | 113 closed, 249 open | none (match) |
| G65 | faq | answer | `accordion_content` | font | 16/20 | 16/20 | none (match) |

### lobbybar and poollounge differences from gardenterrace

Figma frames are structurally identical (only title text and gallery title differ). Live structure identical. Every G-row applies, except:

| # | page | element | property | Figma | live | fix |
|---|---|---|---|---|---|---|
| L1 | lobbybar, poollounge | gallery title | height | 1 line (h 28) for "lobby bar gallery" / "pool lounge gallery" | "gallery", 20/24 | same fix as G48; title wraps to 1 line here |
| L2 | poollounge | intro and explore images | element | single image | swiper (`split-image-text-light_slider-wrap swiper_slider`), boxes 350x449.5 and 350x230.1 | box sizes identical to gardenterrace; apply G23 aspect to the slider box too |
| L3 | lobbybar | other dining cards | stagger | 437.1 / 306.5 / 403.2 | 437 / 465 / 437 as gardenterrace | same fix as G55, G56 |
| L4 | poollounge | other dining cards | stagger | 437.1 / 306.5 / 403.2 | 437 / 437 / 465: the tall card is the 3rd, on gardenterrace it is the 2nd (image natural ratio, not a rule) | same fix as G55, G56 (fixed heights remove the dependency) |
| L5 | all three | hero image | aspect | cover on 390x800 | cover on 390x800 (natural 1365x2048, 1439x1780, 1280x855) | none; landscape source on poollounge is cropped heavily, check focal point |

---

## dining-zuma (differences from the template; every G-row also applies)

Live adds `section_quote-band-dark` (Figma "05 Press quote"). Zuma Figma: y4275 quote, 4732.4 group dining. Images: `dining-zuma-1-*` (hero), `dining-zuma-2-*` (quote).

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| Z1 | hero | zuma logo | `hero-fullbleed-centered_logo-wrapper` + `u-logo` | size | 240 x 58.3 | 224 x 54.4 (-6.7%) | width 240px |
| Z2 | hero | zuma logo | same | position | x 75, top 300 | x 83, top 372.8 (centred at 400, translate -27) | top 300px, transform translateX(-50%) only |
| Z3 | hero | title / description | `hero-fullbleed-centered_heading` / `_text` | y | 674 / 728 (2-line description, h 40) | 614 / 668 | fixed by G3 (same 60px cause) |
| Z4 | quote | band | `section_quote-band-dark` | height / padding | 457.4 / 120 top and bottom, 20 sides | 472 / 96 top and bottom, 32 sides | padding 120px 20px; height follows |
| Z5 | quote | quote text | `quote-band-dark_quote` | font / width | 18 / 21.6 / 0, 350 wide, h 132 | 20 / 28 / normal, 326 wide, h 168 | font-size 18px, line-height 21.6px, width 350px |
| Z6 | quote | gap quote to logo | `quote-band-dark_component` | row-gap | 48 | 56 | row-gap 48px |
| Z7 | quote | press logo | `quote-band-dark_figure` img | size | 160 x 37.4 | 212 x 56 (+32%) | width 160px, height auto |
| Z8 | gallery | title | `gallery-mosaic-captioned_heading` | text | "zuma gallery" 1 line | "gallery" | as G48 |

---

## dining-collection (Figma frame 14:15167, h10830.7; live /dining)

Images: `dining-coll-0-*` (script intro), `dining-coll-1-*` (first venue panel), `dining-coll-2-*` (neighborhood), `dining-coll-3-*` (offers).

### Hero (Figma y0-800, live y0-800)

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| C1 | hero | description | `hero-fullbleed-centered_text` p | lines | 2 lines ("A world of invention, craft / and sophisticated pleasures"), h 40 | 1 line (339.9 wide), h 20 | add line break after "craft" |
| C2 | hero | title | `hero-fullbleed-centered_heading` | y | 674 | 694 (+20, follows C1) | follows C1 |
| C3 | hero | section selector pill | `venue-card-fullbleed_tabs` | box | 220x40 at x85, y784 | 220x40 at x85, y784 | none (match) |
| C4 | hero | title / description font | same | font | 28/30 -1.4, 16/20 | 28/29.96 -1.4, 16/20 | none (match) |

### 02 Script intro (Figma y800-1447.6 h647.6, live y800-1315.2 h515.2) images: `dining-coll-0-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| C5 | intro | section padding | `section_script-intro-centered` > `padding-section-xlarge` | padding-top / bottom | 160 / 160 | 80 + 40 (article) = 120 / 120 | padding-top and bottom 160px total |
| C6 | intro | script heading | `script-intro-centered_heading text-style-script is-large` | box | lettering 307x117.6 at y +166.6, 2 lines | rotated box 326x107.7 at y +99.7 (-67), 28 / 33.6 | font-size about +10% (28 to 30), top offset +167 (follows C5) |
| C7 | intro | heading to body gap | `script-intro-centered_component` | row-gap | 32 | 48 | row-gap 32px |
| C8 | intro | body | `script-intro-centered_paragraph` | font | 16/20 center, 350 wide, 8 lines (h 160) | 16/20 center, 350, h 160 | none (match) |
| C9 | intro | body y | same | y (block-relative) | 327.6 | 235.2 (-92.4) | follows C5 and C7 |

### Venue panels (5 stacked 390x844 panels in Figma; live is one pinned stage `venue-card-fullbleed_stage` 390x844, settled state measured per item, viewport coordinates, panel top = 0) images: `dining-coll-1-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| C10 | panels | initial masked frame | `venue-card-fullbleed_media.is-media-center` | clip-path inset | 350 wide (20 inset), 193 shown | polygon inset 39.4 each side (311 wide), top 193.2 | initial inset 20px (small: 88% at 3/4 gives 39.4) |
| C11 | panels | description (all 5) | `venue-card-fullbleed_text text-size-large` p | font | 16 / 20 / 0, 310 wide, 2 lines (h 40) | 18 / 28.8 / normal, 220-303 wide, 2-3 lines (h 57.6 to 86.4) | font-size 16px, line-height 20px, width 310px (padding 40) |
| C12 | panels | zuma logo | `venue-card-fullbleed_logo-wrapper` img.u-logo | size / y | 240x58.3, top 335 | 240x58.3, top 317.8 to 381.8 (logo moves with copy height) | top 335px (follows C11) |
| C13 | panels | lobby bar logo | same | size / y | 280x88.1, top 322 | 240x75.8, top 309 (-14%) | width 280px |
| C14 | panels | pool lounge logo | same | size / y | 280x60.8, top 326 | 240x52.4, top 306 (-14%) | width 280px |
| C15 | panels | garden terrace and solana title | `heading-style-display` in `_header` | font | 28 / 28 / -1.4, 1 line (h 28), top 342 | 40 / 40 / normal, 2 lines (h 80), top 307 | font-size 28px, line-height 28px, letter-spacing -1.4px |
| C16 | panels | description y (zuma / lobby / pool / garden) | `_text` | top | 425 / 442 / 418 / 402 | 400 / 409 / 383 / 411 | follows C11 and C17 |
| C17 | panels | button y (zuma / lobby / pool / garden, solana) | `venue-card-fullbleed_footer` | top | 489 / 486 / 506 / 466 | 490 / 498 / 501 / 500.5 | align per Figma: content block vertically centred; remove min-heights so copy height drives position |
| C18 | panels | button | `a.button.is-chamfer` | size | 168 x 36 | 191.4 x 37 | width 168px, height 36px |

### 09 Neighborhood (Figma y5980.8-6880.8 h900, live map-feature y7476.2-8296.6 h820.4) images: `dining-coll-2-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| C19 | map | section | `section_map-feature` > `padding-section-large` | padding-top | 96 | 40 | padding-top 96px |
| C20 | map | script title | `map-feature_header h2.text-style-script is-large` | font | 44.4 / 44.4, 2 lines (box 313x85.7) | 32 / 38.4 (box 226x69) | font-size 44px, line-height 44px (-28% now) |
| C21 | map | text | `map-feature_text text-size-medium` | lines | 2 lines (h 40) | 1 line (h 20) | add line break after "century;" |
| C22 | map | text y | same | y (block-relative) | 205.7 | 118.4 | follows C19, C20 |
| C23 | map | button | `a.button.is-chamfer.is-outline` | size | 168 x 36 at y +269.7 | 191.4 x 37 at y +152.4 | width 168px, height 36px |
| C24 | map | map figure | `map-feature_figure` | box | 552x559 at x -81, y +329.7 | 552x559 at x -81, y +221.4 | size and x match; y follows C19 to C22 |
| C25 | map | section bottom | `section_map-feature` | padding-bottom | about 11 (map clipped to section) | 40 | padding-bottom 0 (map near flush) |

### FAQ (Figma y6880.8-8020.8 h1140, live y8296.6-9448.2 h1151.6)

Same measurements and fixes as G60 to G62 (eyebrow 18 vs 12, title 30 vs 28, header gap 16 vs 12). Rows C26 to C28.

### Offers and packages (Figma y8020.8-8824.8 h804, live y9448.2-10231.2 h783) images: `dining-coll-3-*`

| # | block | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|---|
| C29 | offers | eyebrow | `offers-slider-split_eyebrow` | font / y | 12/18 -0.36, +80 | 12/18 -0.36, +80 | none (match) |
| C30 | offers | heading, image | `offers-slider-split_heading`, `_figure` | box | heading y +114, image 350x390 at y +182 | y +114, 350x390 at +182 | none (match) |
| C31 | offers | description | `offers-slider-split_text` | lines | 2 lines (h 40) | 1 line (h 20) | add line break after "for" |
| C32 | offers | button | `offers-slider-split_button` | size / y | 168 x 36 at +676 | 191.4 x 37 at +656 | width 168px, height 36px |
| C33 | offers | pagination | `offers-slider-split_controls` | y | +728, arrows 36 target, "02 / 05" 12 | +729, arrows 30x14, "01 / 05" 12 | none (match, +1) |
| C34 | offers | section height | `offers-slider-split_item` | padding-bottom | 804 total | 783 | item padding-bottom 70 to 91 (or 40 under controls) |

---

## Fixes by class family

All values apply below 768px only.

| class or combo | property | current -> target | pages affected | shared-component risk |
|---|---|---|---|---|
| `hero-fullbleed-centered_footer` + `.button.is-wide` | width, fixed bottom, rest position | 173.5 -> 194; bottom 76 -> 28; in flow -> absolute straddling hero bottom | all 5 | high: hero used on every page; scope with the venue hero combo or the `.is-wide` button |
| `hero-fullbleed-centered_logo-wrapper` | width, top | 224 -> 240; 372.8 -> 300 | zuma | low, venue only |
| `hero-fullbleed-centered_text` | line break | 1 line -> 2 lines | collection | low, content |
| `split-image-text-light` (intro variant 654bb362 / f30ba1e7) | padding-top / bottom, gap | 40/40 -> 64/96; 32 -> 64 | 4 venue pages | medium: shared with other pages unless variant-scoped |
| `split-image-text-light_heading` | font, line-height, letter-spacing | intro: 20/24/normal -> 24/26.4/-1.2; explore: 20/24/normal -> 20/27/-1 | 4 venue pages | medium: component shared (history, rooms); use variant |
| `split-image-text-light_component` (explore variant 5fb6b74c) | row-gap, header gap | 32 -> 120; 40 -> 16 | 4 venue pages | medium: variant-scoped |
| explore figure (variant 5fb6b74c) | aspect-ratio | 873/574 -> 350/316 | 4 venue pages | low: variant-scoped |
| `text-columns-info_aside` | order, padding, width | last -> first; 6px top -> 0; 344 -> 350 | 4 venue pages | low |
| `text-columns-info_component` | row-gap, padding-top | 48 -> 80; 32 -> 120 | 4 venue pages | medium: shared with other pages using text-columns-info |
| `text-columns-info_header h3.text-style-eyebrow-caps` | font | 18/21.6/-0.54 -> 20/27/-1 | 4 venue pages | high: `text-style-eyebrow-caps` is global; scope to `text-columns-info_header` |
| `text-columns-info_link` | padding | 0 -> 9px 0 (36 target) | 4 venue pages | low |
| `image-pair-text_*` | gaps, order, text font | gap 32/48 -> 120; text 20/26 -> 16/20, width 289; text before image 03 | 4 venue pages | medium: used on other pages (check wellness, rooms) |
| `image-trio-text_heading`, `_paragraph`, `_header` | font, align, gap | 24/24/-1.2 center -> 28/28/-1.4 left; gap 24 -> 16 | 4 venue pages | medium |
| `image-trio-text_link` | font, align | 18/21.6/-0.54 center -> 14/18/-0.7 left | 4 venue pages | medium: uses global eyebrow-caps style |
| `image-trio-text_progress-fill` | initial scale | 0.333 -> 0.366 | 4 venue pages | low |
| `image-trio-text` | padding-top / bottom | 40/40 -> 96/96 | 4 venue pages | medium |
| `gallery-mosaic-captioned_figure` (+ `.is-wide`) | aspect-ratio | 4/5, 1/1, 1/1, 4/5 -> 390/612, 390/480, 390/480, 390/480 | 4 venue pages | medium: component used on gallery page; scope to venue pages |
| `gallery-mosaic-captioned_heading` | font, top | 20/24/normal at 20 -> 28/28/-1.4 at 40 | 4 venue pages | medium |
| `gallery-mosaic-captioned_caption` | font | 16/19.2/-0.48 -> 14/16.8/-0.42 | 4 venue pages | medium: shared with gallery page |
| `card-stagger-header-left_figure` | fixed height per nth-child, img height | aspect 310/437 with natural img override -> 437.1 / 306.5 / 403.2, img 100% cover | 4 venue pages | medium: used on press, home? check |
| `card-stagger-header-left` `heading-style-h2` | font | 30/30/-1.5 -> 28/28/-1.4 | 4 venue pages | medium: `heading-style-h2` global; scope to `_header` |
| `card-stagger-header-left_label` | letter-spacing | -0.6 -> -1 | 4 venue pages | low |
| `card-stagger-header-left` padding | padding-top / bottom | 40/40 -> 96/64 | 4 venue pages | medium |
| `faq-accordion_header` eyebrow | font | 18/21.6/-0.54 -> 12/18/-0.36 | 4 venue pages + collection | high: FAQ shared by rooms, wellness, etc. (check those pages' Figma first) |
| `faq-accordion_header` `heading-style-h2` | font, row-gap | 30/30/-1.5 -> 28/28/-1.4; 16 -> 12 | 4 venue pages + collection | high: same as above |
| `quote-band-dark_*` | padding, font, logo | 96/32 -> 120/20; 20/28 -> 18/21.6; logo 212 -> 160; gap 56 -> 48 | zuma | low |
| `script-intro-centered` | padding, row-gap, heading size | 80+40 -> 160; 48 -> 32; 28 -> 30 | collection | low |
| `venue-card-fullbleed_text`, `_logo-wrapper`, `heading-style-display`, `a.button` | font, widths, button size | 18/28.8 -> 16/20; logos 240 -> 280 (lobby, pool); display 40 -> 28; button 191.4x37 -> 168x36 | collection | medium: also drives home panels; use panel combo |
| `map-feature` | padding, script size, break, button | pad-top 40 -> 96; script 32 -> 44; button 168x36 | collection | medium: map-feature on neighborhood page |
| `offers-slider-split_button` / text | button size, line break | 191.4x37 -> 168x36; 1 line -> 2 | collection | medium: shared with other offers sliders |
