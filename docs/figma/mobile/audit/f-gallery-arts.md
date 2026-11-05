# Mobile measured audit: gallery, arts (390px)

Figma frames (all 390 wide): gallery `27:7039` (h 6430), arts `27:7344` (h 9296, render scale 1.763 not 2), ARTS-MODAL artist `943:1654` (390x763), ARTS-MODAL artwork `954:16857` (390x896). Live: staging `/gallery` (h 7432) and `/arts` (h 10981), Chrome 390x844, scrolled once, measured at rest. Modals opened live (`#oceano` artwork, `#eva-struble` artist). Skipped: nav, CTA newsletter, footer. Figma coordinates are relative to the frame; live are document coordinates. Image placeholders in Figma (#b7b7b7 rectangles) are boxes only, so content is not compared. Figma images are plain rectangles (no chamfer or mask) everywhere, including the venue film. Screenshots: `img/gallery-{1..4}-*.jpg`, `img/arts-{1..6}-*.jpg`.

Correction to `docs/figma/mobile/compare/f-gallery-arts.md`: the live pages have moved on. The category pill, the offers image inside the maroon block, the stacked newsletter form and the card widths now match. The stray `image-inset-single` and second hero on arts exist only inside hidden dialogs (0x0), not in the page flow.

## gallery

Section order matches (hero, gallery-all, offers, more of the guild, faq, cta, footer).

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | overlay | `hero-fullbleed-centered_overlay` | background | #000 @ 0.5 | rgba(0,0,0,0.4) | background: rgba(0,0,0,0.5) |
| hero | heading, text, section 800 | `hero-fullbleed-centered_*` | all | 28/30 -1.4 center y674, 16/20 y728, h800 | identical | none |
| gallery-all | section height | `section_gallery-all` | height | 844 (y800 to 1644) | 1796 (+952) | consequence of the rows below |
| gallery-all | mosaic arrangement | `gallery-all_grid` | layout | 2 horizontal swipe rows (clip, overflow), 5 tiles each, rows y20 and y432 in section | 1 vertical flex-wrap column grid, 10 tiles in 6 rows | display: grid; grid-auto-flow: column; grid-template-rows: repeat(2, 391.5px); overflow-x: auto; scrollbar hidden |
| gallery-all | tile height | `gallery-all_item` | height | 391.5 | 224 | height: 391.5px |
| gallery-all | tile widths, row 1 | `gallery-all_item` (+`.is-narrow`, `.is-wide`) | width (aspect) | 336.7 (.86), 214.7 (.548), 458.6 (1.171), 336.7, 214.7; visible: tile 2 at x0-187, tile 3 at x209.7-390 | 185 (.826) or 390 (1.741) | default width 336.7px; `.is-narrow` 214.7px; `.is-wide` 458.6px (aspect .86 / .548 / 1.171) |
| gallery-all | tile widths, row 2 | same | width, x | 336.7 at x-271 (visible 0-66), 458.6 at x88.5 (visible to 390), 458.6, 214.7, 458.6 | 185 at x0/205, 390 at x0, 185 at x102.5 | same as above; row 2 track starts 116px left of row 1 (offset, not mirror) |
| gallery-all | horizontal gap | `gallery-all_grid` | column-gap | 22.9 | 20 | column-gap: 22.9px |
| gallery-all | row gap | `gallery-all_grid` | row-gap | 20.8 | 20 | row-gap: 20.8px |
| gallery-all | first tile top | `section_gallery-all` | padding-top (y of tile 1) | 20 (y820) | 12 (y812) | padding-top: 20px |
| gallery-all | category pill | `tab-pills-intro_tabs.is-scroll` | box, label, shape | 220x40, ALL 14/18 -0.7, burgundy chamfer 12 | 220x40, 14/18 -0.7, chamfer 12, sticky bottom 16 | none (Figma y1524 is a sticky-state snapshot) |
| gallery-all | swipe category row | (hidden children `tab-pills-intro_tab`) | presence | frame at y800 h76 with 7 labels 12/18 -0.4 present in tree but not painted in render | not shown | none |
| offers | section height | `section_offers-slider-split` | height | 804 | 783 (slide 763 when copy is 1 line) | see arrows and button rows |
| offers | pagination arrows | `offers-slider-split_arrow` | box | 36x36 target, glyph 24x18; row 196 wide | 30x14, glyph 28.5x12; row 178.9 wide | width: 36px; height: 36px; display: flex; align/justify center |
| offers | pagination row bottom | `offers-slider-split_controls` | y (top same 729 vs 728) / h | h36 | h14 | follows arrow height; section then 804 |
| offers | button | `offers-slider-split_button` | size | 168x36 | 191.4x37 | height: 36px; width: auto (follows label) |
| offers | button label | `offers-slider-split_button` span | font | 14/18 ls -0.7 | 16/16 ls normal | font-size: 14px; line-height: 18px; letter-spacing: -0.7px |
| offers | slide copy | `offers-slider-split_text` | height | 40 (2 lines) so button y676 | slide 1 has 20 (1 line), button y656; slide heights 763 vs 783 | content length only; lock `offers-slider-split_item` min-height: 804px so slides do not jump |
| offers | eyebrow, heading, figure | `offers-slider-split_eyebrow/_heading/_figure` | y, size | eyebrow y80 12/18, h2 y114 28/28 -1.4, figure y182 350x390 | y80, y114, 350x390, same type | none (eyebrow ls -0.36 vs -0.4, ignore) |
| more of the guild | slide height | `card-carousel-header-left_slide` | height | 508.1 / 377.5 / 474.2 (figure + 20 gap + 27 label + 24 bottom pad) | 484 / 354 / 450 | padding-bottom: 24px (section 812 becomes 836) |
| more of the guild | label | `card-carousel-header-left_label` | letter-spacing | -1 | -0.6 | letter-spacing: -1px |
| more of the guild | cards, copy | `card-carousel-header-left_*` | size | 310 wide, figures 437/307/403, gap 20, heading 28/28, text 16/20 | identical | none; arrows hidden in both |
| faq | eyebrow "faqs" | `faq-accordion_header .text-style-eyebrow-caps p` | font | 12/18 ls -0.4 | 18/21.6 ls -0.54 | font-size: 12px; line-height: 18px; letter-spacing: -0.4px |
| faq | title | `faq-accordion_header h2.heading-style-h2` | font | 28/28 ls -1.4 (h56, 2 lines) | 30/30 ls -1.5 (h60) | font-size: 28px; line-height: 28px; letter-spacing: -1.4px |
| faq | header gap, height | `faq-accordion_header` | gap, height | 12, 86 | 16, 97.6 | gap: 12px |
| faq | chevron | `accordion_icon` svg path | size, x | 10x5 at x346-356 | 15x7.5 at x350.5-365.5 | svg width: 10px; height: 5px; align left in the 24px box |
| faq | items | `accordion_header`, `accordion_content` | pitch, text | question 18/21.6, answer 16/20, item 113 pitch, divider 1px | identical | none |

Gallery issue count: 20 (hero 1, gallery-all 8, offers 6, cards 2, faq 4 minus overlaps; rows marked none are matches).

## arts

Section order matches (hero, intro, venue film, collection, artworks, more of the guild, offers, faq, cta, footer). Hero identical to gallery hero (same overlay 0.4 vs 0.5 issue).

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| intro | section height | `section_script-intro-centered` | height | 458.4 | 415.2 | follows heading size |
| intro | script heading | `script-intro-centered_heading.text-style-script.is-large` | font | Morello 35.48/42.6, rot -7.4, rotated box 328x126 | 28/33.6, rot -7.4, rotated box 326x108 | font-size: 35.5px; line-height: 42.6px |
| intro | paragraph y | `script-intro-centered_text` | y in section | 278.4 | 235.2 | follows heading (gap 32 in Figma, heading box 126 tall) |
| intro | paragraph color | `script-intro-centered_paragraph` | color | #262118 | #29310c | color: #262118 |
| intro | paragraph | same | font, align | 16/20 center w350 h60 | identical | none |
| venue film | contained state shape | `venue-card-fullbleed_media.is-bleed` | clip-path | plain rectangle | chamfered octagon polygon (16px cuts) | clip-path: inset(0) start state |
| venue film | contained state size | same | box | 316x213, x37 (landscape 1.48) | 343 wide, 457.6 tall at x23-367 (portrait .75), centred in 844 stage | start clip inset: top/bottom 315.5px, left/right 37px |
| venue film | full-bleed size | same | box | 390x612 (aspect .637), block 849 incl. 24 gap | 390x844 pinned for 100vh, pin-spacer 2110 (1266 scroll) | below 768: stage height 612px, or keep 100vh by decision (vh preference); needs Stephen call |
| venue film | caption font | `venue-card-fullbleed_header .text-style-eyebrow-caps p` | font | 14/16.8 ls -0.4, 3 lines, w350 | 18/21.6 ls -0.54, 4 lines, w321.7 | font-size: 14px; line-height: 16.8px; letter-spacing: -0.4px; max-width: 350px |
| venue film | caption offset | `venue-card-fullbleed_content` | bottom pad | 20 from image bottom | 40 | padding-bottom: 20px |
| collection | section padding | `section_split-image-text-light` .padding-global | top/bottom | 120/120 | 40/40 | padding-top/bottom: 120px |
| collection | block order | `split-image-text-light_component` | order | img1, heading + text, img2 | img1, img2, heading + text | img2 order: 3 (after content) |
| collection | gaps | `split-image-text-light_component` | gap | 96 | 32 | gap: 96px |
| collection | image 1 | `split-image-text-light_media` | box | 266.5x315 at x20 (.846), left aligned | 350x449.5 at x20 (.779) | width: 76.1%; aspect-ratio: 266.5 / 315 |
| collection | image 2 | `split-image-text-light_media.is-secondary` | box | 175x226 at x195-370 (.774), right aligned | 262.5x262.5 at x107.5-370 (1.0) | width: 50%; aspect-ratio: 175 / 226; margin-left: auto |
| collection | heading | `split-image-text-light_heading` | font, color | 28/28 ls -1.4, #29310c | 24/24 ls -1.2, #262118 | font-size: 28px; line-height: 28px; letter-spacing: -1.4px; color: #29310c |
| collection | body | `split-image-text-light_body p` | font, color, gap | 16/20, #29310c, heading to text 24 | 16/20, #262118, 32 | color: #29310c; header-to-body gap: 24px |
| collection | section height | same | height | 1125 | 1020 | follows rows above |
| artworks | section height | `section_gallery-all.is-dark` | height | 1277.2 | 1800 (+523) | consequence of rows |
| artworks | mosaic arrangement | `gallery-all_grid` | layout | 4 horizontal swipe rows, 5 tiles each, rows at y20, 333.8, 647.6, 961.4 | vertical grid, 10 tiles in 6 rows | same as gallery: grid-auto-flow: column; grid-template-rows: repeat(4, 295.8px) |
| artworks | tile height | `gallery-all_item` | height | 295.8 | 224 | height: 295.8px |
| artworks | tile widths | `gallery-all_item` (+is-narrow/is-wide) | width (aspect) | 254.4 (.86), 162.2 (.548), 346.5 (1.171); row 1 visible: 0-245 and 263-390; row 2: 0-182 and 200-390; row 3: 0-63, 81-244, 261-390; row 4 = row 2 | 185 or 390 | default 254.4px; is-narrow 162.2px; is-wide 346.5px |
| artworks | gaps | `gallery-all_grid` | row-gap, column-gap | 18 / 18 | 20 / 20 | gap: 18px |
| artworks | top and bottom pad | `section_gallery-all.is-dark` | padding | 20 / 20 | 24 / 24 | padding-block: 20px |
| artworks | tile count | `gallery-all_item` | count | 20 placeholders (5 x 4) | 10 CMS items | content; confirm 10 is intended (2 tiles per row shown each way) |
| artworks | category pill | `tab-pills-intro_tabs.is-scroll` | presence | not in Figma arts frame | present (all, painting, photography, sculpture, artists), 220x40 | confirm with Stephen; if Figma is law, `display: none` below 768 on arts only |
| more of the guild | slide height, label | `card-carousel-header-left_*` | as gallery | 508.1, label ls -1 | 484, ls -0.6 | same fix as gallery |
| offers | pagination, button | `offers-slider-split_*` | as gallery | 36 targets, button 168x36 14/18 | 30x14, 191x37 16/16 | same fix as gallery |
| faq | header, chevron | `faq-accordion_*`, `accordion_icon` | as gallery | 12/18, 28/28, gap 12, chevron 10x5 | 18/21.6, 30/30, gap 16, 15x7.5 | same fix as gallery |

Arts issue count: 25 (intro 4, venue film 5, collection 9, artworks 8, plus shared offers, cards, faq counted once on gallery).

## arts modals

Opened live at 390x844: `#oceano` (`.overlay-detail-panel-modal_component`, `is-open`, position fixed, 390x844, panel 390 wide, scrolls with overflow-y auto) and `#eva-struble`. Both full screen like Figma. Static `artwork-oceano`/`artist-eva-struble` also exist; the CMS ones above are the opened ones.

| block | element | live class | property | Figma (artwork 954:16857 / artist 943:1654) | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| modal | stacking order | `overlay-detail-panel-modal_layout` | order | back, heading (+by line, caption), image, body | back, image, heading (+by line, caption), body | `_figure` order: 2 (after `_header`/`_content` head); needs the header split out of `_content`, or `_layout` as grid with header before figure |
| modal | panel padding | `overlay-detail-panel-modal_panel` | padding | 24 top, 20 sides, 24 bottom | 72 top, 20 sides, 48 bottom | padding: 24px 20px 24px |
| modal | back control box | `overlay-detail-panel-modal_back` | size | 66x36 target at y24, label y31-49 | 67.4x19.2 at y24, label y24-43 | min-height: 36px; align-items: center |
| modal | back label | `_back-label` | font | 14/18 ls -0.7 | 16/19.2 ls -0.48 | font-size: 14px; line-height: 18px; letter-spacing: -0.7px |
| modal | back icon | `_back-icon` | size | 24x18 arrow | 16x16 | width: 24px; height: 18px |
| modal | back to heading | `_bar` to heading | gap | back target bottom 60 to heading 116 (56) | n/a, heading y552 after image | gap: 56px |
| modal | heading | `_heading` | font, y | 28/30 ls -1.4, y116 | 28/30 ls -1.4, y552 (follows image) | none beyond order |
| modal | by line | `_eyebrow-link` | font, icon | 16/19.2 ls -0.5, underlined, NE arrow icon after text (frame 154.6 wide) | 16/19.2 ls -0.48, underlined, no arrow (135.8 wide) | add arrow icon, gap 2px |
| modal | heading to by line | `_header` | gap | 8 (heading y116, by y154) | 12 | gap: 8px |
| modal | caption | `_caption` | font | 14/16.8 ls -0.4, y205 (32 below by line) | 16/19.2 ls -0.48 (12 below by line) | font-size: 14px; line-height: 16.8px; letter-spacing: -0.4px; margin-top: 20px (gap 32 total) |
| modal | image box | `_figure`, `_image` | size, aspect | 350x409.1 (.856) | 350x440 (aspect-ratio 350 / 440, .795), +7% tall | aspect-ratio: 350 / 409.1 |
| modal | image y | `_figure` | y | 271 (artwork), 178 (artist) | 72 | follows order change |
| modal | image to body | `_layout` / `_content` | gap | 32 | 40 (artwork), 48 header-to-body (artist) | gap: 32px |
| modal | body | `_text` | font, color, h | 16/20 #f4efdf, h160 (artwork) / 120 (artist) | 16/20 #f4efdf, h160 / 120 | none |
| modal | panel height | `_panel` | height | 896 (artwork), 763 (artist) | 919.6 (artwork), 860 (artist) | follows the fixes above (all three savings: 48 top, 24 bottom, 31 image) |
| modal | overlay | `_backdrop` | visibility | none in frame (full-screen panel) | rgba(38,33,24,0.6) behind panel, panel covers it | none |

Modal issue count: 14.

## Fixes by class family

| class or combo | property | current -> target | pages affected | shared-component risk |
|---|---|---|---|---|
| `gallery-all_grid` | layout | vertical flex grid -> 2 (gallery) or 4 (arts) swipe rows via grid-auto-flow: column, overflow-x auto; gap 22.9/20.8 (gallery), 18/18 (arts) | gallery, arts, any other CMS gallery-all | high; arts needs rows 295.8 and a modifier (e.g. is-dark) for the smaller row height |
| `gallery-all_item`, `.is-narrow`, `.is-wide` | width, height | 185/390 x 224 -> 336.7/214.7/458.6 x 391.5 (gallery); 254.4/162.2/346.5 x 295.8 (arts) | gallery, arts | high; the `.is-wide` full-bleed meaning changes |
| `section_gallery-all` | padding-top | 12 -> 20 (gallery); `.is-dark` 24 -> 20 (arts) | gallery, arts | low |
| `hero-fullbleed-centered_overlay` | background | rgba(0,0,0,0.4) -> 0.5 | gallery, arts, every hero | medium; check other hero Figma frames |
| `offers-slider-split_arrow` | width, height | 30x14 -> 36x36 | gallery, arts, offers on other pages | medium |
| `offers-slider-split_button` span | font | 16/16 normal -> 14/18 -0.7; height 37 -> 36 | gallery, arts, offers elsewhere; possibly shared `.button` | high if `.button` is the shared base |
| `offers-slider-split_item` | min-height | none -> 804 | gallery, arts | low |
| `card-carousel-header-left_slide` | padding-bottom | 0 -> 24 | gallery, arts, cards elsewhere | medium |
| `card-carousel-header-left_label` | letter-spacing | -0.6 -> -1 | gallery, arts | low |
| `faq-accordion_header` eyebrow p | font | 18/21.6 -0.54 -> 12/18 -0.4 | gallery, arts, every faq | medium; check other Figma frames first |
| `faq-accordion_header h2` | font | 30/30 -1.5 -> 28/28 -1.4 | gallery, arts, every faq | medium |
| `faq-accordion_header` | gap | 16 -> 12 | gallery, arts, every faq | low |
| `accordion_icon` svg | size | 15x7.5 -> 10x5 | all accordions | medium |
| `script-intro-centered_heading.is-large` | font | 28/33.6 -> 35.5/42.6 | arts, other script intros | medium |
| `script-intro-centered_paragraph` | color | #29310c -> #262118 | arts (verify others) | low |
| `venue-card-fullbleed_media.is-bleed` | clip-path (start), stage height | octagon 343x458 -> rect 316x213 inset 37; full-bleed 844 -> 612 (decision) | arts, other venue-card pages | high |
| `venue-card-fullbleed_header .text-style-eyebrow-caps` | font, width, bottom | 18/21.6 -0.54, 321.7 wide, 40 -> 14/16.8 -0.4, 350, 20 | arts, other venue cards | medium |
| `section_split-image-text-light` | padding, gap, order | 40 / 32 -> 120 / 96; secondary media after content | arts, other split sections | high |
| `split-image-text-light_media`, `.is-secondary` | width, aspect | 350 (.779), 262.5 (1.0) -> 266.5 (.846), 175 (.774) | arts | medium |
| `split-image-text-light_heading` | font, color | 24/24 -1.2 #262118 -> 28/28 -1.4 #29310c | arts | medium |
| `split-image-text-light_body p` | color | #262118 -> #29310c | arts | low |
| `overlay-detail-panel-modal_*` | order, padding, gaps, fonts, image aspect | see modal table | arts modals; same component on rooms, dining dialogs | high; scope by combo `w-variant-073d0fa4...` or add `is-artwork` |
