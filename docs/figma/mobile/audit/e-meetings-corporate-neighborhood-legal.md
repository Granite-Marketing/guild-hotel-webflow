# Mobile measured audit E: meetings, corporate, neighborhood, legal (390px)

Method: Figma `figma/mobile/nodes.json.gz` (frames 26:3216 meetings, 26:3218 neighborhood, 27:9031 legal, 757:14158 corporate, plus the "Detail Panel" state frames 776:11888, 962:17816, 776:12005) vs staging https://the-guild-hotel-c34e71.webflow.io at 390x844 after a slow scroll. Live y and h are document px. Figma values are relative to the frame. Nav, CTA newsletter and footer skipped. Read-only; no Webflow writes. This replaces `compare/e-meetings-neighborhood-legal.md`, which was eyeballed and is wrong in places (the live selector pill, submit button and map exist; legal/corporate images are 1:1).

Conventions: "offset" = distance from the section top. `lc` = text-transform lowercase on both sides (matches, not listed). All fixes are below 768px.

Not comparable by pixels: `section_venue-card-fullbleed` is a pinned scroll-enlarge stage; its start state is a chamfer clip-path and ends at 100vw x 100vh. Rows for it use the settled "is-active" card.

Counts (table rows incl. matches): meetings 59, neighborhood 60, legal 59, corporate 6 own rows plus all legal rows that repeat.

## Shared findings (apply to several pages; fix once, see "Fixes by class family")

| id | element | live class | property | Figma | live | fix |
|---|---|---|---|---|---|---|
| G1 | every chamfer button (discover more, book your space, submit your request, learn more) | `.button.is-chamfer`, `.offers-slider-split_button`, `.overlay-detail-panel-modal_button` | font-size / line-height / letter-spacing | 14px / 18px / -0.7px | 16px / 16px / normal | font-size 14px, line-height 18px, letter-spacing -0.05em |
| G1 | same | same | height, padding | 36px, padding 4px 25px | 37px | height 36px, padding 4px 25px |
| G1 | same | same | width (fluid from label) | discover more 168, book your space 184, submit your request 217, learn more 141 | 191.4, 211.8, 252.1, 159.1 | follows from G1 type change; no fixed width |
| G2 | offers pagination arrows | `.offers-slider-split_arrow` | box | 36x36 target, 24x18 icon, row y +36 | 30x14 | width 36px, height 36px (section grows 804 vs 783, Figma 804 matches after fix) |
| G3 | section vertical padding | `.padding-global.padding-section-large` | padding-top / bottom | 120px on feature-grid, split-sticky, packages, corporate and dining cards, beyond-downtown | 40px / 40px | 120px / 120px, but see per-block rows: key-features top is 0 and bottom 96, map is 40 |
| G4 | script headings | `.text-style-script`, `.script-intro-centered_heading` | font-size / lines | per page, see rows | per page | per page |

## meetings

Live order: hero, venue-card (intro + 4 stage cards + selector pill), form, map-feature is-image-bg (Stacked), features, gallery, offers, FAQ, CTA. Figma order matches.

| block | element | live class (combo) | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| 01 hero | h1, p, bg | `.hero-fullbleed-centered_heading.heading-style-h2` | all | y644 h60 fs28 lh30 ls-1.4; p y728 h40 | identical | none (Figma "book" CTA at y732 overlaps the description in the frame; absent live; ignore) |
| 02 intro | heading | `.meetings-collection-venues_heading` | font-size / line-height | 30.67px / 36.8px | 44px / 52.8px | 30.67px / 36.8px |
| 02 intro | heading | same | rotation | -7.4deg | none | rotate -7.4deg |
| 02 intro | heading | same | x, w, lines | x20 w357 (rot), 2 lines | x32 w326, 3 lines | width 350px, padding-inline 0 |
| 02 intro | paragraph | `.venue-card-fullbleed_intro p` | x, w, line-height, lines | x20 w350 lh20, 5 lines h100 | x32 w326 lh20.8, 6 lines h124.8 | width 350px, line-height 20px |
| 02 intro | section | `.venue-card-fullbleed_intro` | padding top/bottom | 160 / 160 (section 570) | heading offset 56, media starts offset 363 | padding 160px 20px |
| 03 preview | chamfer photo strip | `.venue-card-fullbleed_media.is-media-center` (start state) | shape | 265x193 landscape chamfer, centered x62.5, strip 217 tall, then card 04 | start clip is 311x457 portrait (inset 39.4 L/R, 193.2 T/B, ar 3/4) | start polygon inset 62.5px L/R, 24px below; or ar 265/193 |
| 04 card | title | `.heading-style-display` | font-size / line-height / letter-spacing | 28px / 28px / -1.4px | 40px / 40px / normal | 28px / 28px / -0.05em |
| 04 card | title, p | `.heading-style-display`, card p | width / x | w310 x40 | title w280-347, p w342 x23.8 | max-width 310px, margin-inline auto |
| 04 card | paragraph | card p | font-size / line-height | 16px / 20px | 18px / 28.8px | 16px / 20px |
| 04 card | p to button gap | card p, `.button.is-chamfer` | gap | 24 | 32 (after transform settles) | gap 24px |
| 04 card | button | `.button.is-chamfer` | G1 | 168x36 fs14 | 191.4x37 fs16 | G1 |
| 05 pill | selector | `button.text-style-eyebrow-caps` in `.venue-card-fullbleed_stage` | width / x | 260 / x65 | 215.5 / x87.3 (width follows label) | width 260px, margin-inline auto |
| 05 pill | selector | same | bottom offset in stage | 40 | 20 | bottom 40px |
| 06 form | script heading | `.text-style-script` in `.form-split-script-contact_header.is-rotated` | font-size / line-height | 38.87px / 46.6px | 44px / 52.8px | 38.87px / 46.6px |
| 06 form | script heading | same | rotation | -7.5deg | -6deg | rotate -7.5deg |
| 06 form | script heading | same | x, w, lines, align | x29 w326, 1 line, centered | x9 w359, 3 lines (h141.6), start | width 326px, text-align center, white-space nowrap or smaller type so 1 line |
| 06 form | section | `.padding-global.padding-section-large` | padding-top | 120 | 40 (+8 header) | 120px |
| 06 form | group heading | `.heading-style-h4` | line-height / letter-spacing | 27px / -1px | 24px / normal | 27px / -0.05em |
| 06 form | heading to first field | form group gap | gap | 24 (field y +51 from heading top) | field +56 | gap 24px |
| 06 form | group to group | form groups | gap | 64 | 91 | gap 64px |
| 06 form | last field to submit | fields to button | gap | 56 | 86 | gap 56px |
| 06 form | submit | `input.button.is-chamfer.is-dark` | G1, width | 217x36 centered | 252.1x37 centered | G1 |
| 06 form | field text | `.form-split-script-contact_input` | font-size (label/placeholder) | 14px / 20px | 16px / 19.2px | 14px / 20px |
| 07 map | card | `.map-feature_content.is-image-bg` | height | 630 | 662 | follows rows below |
| 07 map | heading | `.heading-style-h4` in map card | font-size / lh / ls | 24px / 26.4px / -1.2px | 20px / 24px / normal | 24px / 26.4px / -0.05em |
| 07 map | intro p | `.map-feature_text.text-size-medium` | font-size / lh | 20px / 26px | 16px / 20px | 20px / 26px |
| 07 map | heading to p | gap | gap | 27 | 23 (75 offset vs 79) | gap 27px |
| 07 map | p to first item | `.map-feature_item` | gap | 35 | 27 | 35px |
| 07 map | item name | `.map-feature_text.text-style-eyebrow-caps` | letter-spacing | 0 | -0.54px | 0 |
| 07 map | walk text, Directions | `.map-feature_text`, `.map-feature_link` | font-size / lh | 20px / 26px (row h14) | 16px / 20px (row h20) | 20px / 26px, row height 14px |
| 07 map | item pitch | `.map-feature_item` | h | 97 (1 line), 119 (2 lines) | 103.6, 125.2 | follows walk row fix (-6.6) |
| 07 map | pins | `.map_pin` | size / count / places | 48x48, 3, at (157,90) (330,443) (79,572) of map | 36x36, 4, clustered at (135,300-360) (275,220) | size 48px; reposition map center/zoom |
| 09 features | section | `.meetings-collection-features` | padding-block | 120 | 64 | 120px |
| 09 features | heading | `.meetings-collection-features_heading` | lh / ls / h | 26.4px / -1.2px / 52 | 28.8px / normal / 57.6 | 26.4px / -0.05em |
| 09 features | heading to p | gap | gap | 20 | 32 | 20px |
| 09 features | p | `.meetings-collection-features_text` | line-height | 20px | 20.8px | 20px |
| 09 features | button to first card | gap | gap | 64 | 48 | 64px |
| 09 features | button | `.button.is-chamfer.is-dark` | G1 | 184x36 fs14 | 211.8x37 fs16 | G1 |
| 09 features | card image (x3) | `.meetings-collection-features_figure` | aspect / h | 350x360 (0.972) | 350x437.5 (ar 484/596 = 0.812), 350x525 on card 3 | aspect-ratio 350/360 (-17% off) |
| 09 features | card heading | `.meetings-collection-features_card-heading` | fs / lh / ls | 20px / 27px / -1px | 16px / 19.2px / -0.48px | 20px / 27px / -0.05em |
| 09 features | heading to list | gap | gap | 20 | 12 (+4 li pad) | 20px |
| 09 features | list item | `.meetings-collection-features_item` | lh / pitch | 20px / 33 | 20.8px / 37.8 | line-height 20px, padding-block 4px 8px |
| 10 gallery | figures | `.gallery-mosaic-captioned_figure` (is-wide) | h | 612, 480, 480, 480 | 487.5 (4/5), 390 (1/1), 390 (1/1), 487.5 (4/5) | aspect 390/612 on first; 4/5 on 2, 3 and 4; section 2055 not 1758 |
| 10 gallery | heading | `.gallery-mosaic-captioned_heading.heading-style-h4` | fs / lh / ls / y | 28px / 28px / -1.4px / offset 41 | 20px / 24px / normal / offset 20 | 28px / 28px / -0.05em, top 41px |
| 10 gallery | caption | `.gallery-mosaic-captioned_caption` | fs / lh / ls | 14px / 16.8px / -0.42px | 16px / 19.2px / -0.48px | 14px / 16.8px / -0.03em |
| 11 offers | eyebrow, title, image, p, pager | `.offers-slider-split_*` | y, size | match (offset 80, 114, 182, 612; 350x390) | match | none |
| 11 offers | button, arrows | G1, G2 | | | | G1, G2 |
| 12 FAQ | eyebrow | `p` above `.heading-style-h2` | fs / lh / ls | 12px / 18px / -0.36px | 18px / 21.6px / -0.54px | 12px / 18px / -0.03em |
| 12 FAQ | heading | `.heading-style-h2.text-weight-normal` | fs / lh / ls | 28px / 28px / -1.4px | 30px / 30px / -1.5px | 28px / 28px / -0.05em |
| 12 FAQ | first question offset | `.accordion_question` | y | offset 252 | offset 264 | follows heading fix; section 1140 vs 1152 |
| panel | back arrow | `.overlay-detail-panel-modal_back` | size | 36x36 target at x20 y26 | 24x24 at x16 | 36x36 target, left 20px |
| panel | submit | `.overlay-detail-panel-modal_button` | G1 | 217x36 | 252.1x37 | G1 |
| panel | media | `.overlay-detail-panel-modal_figure` | slides, progress | 3 slides in swipe, 1px progress 128/222 at y573.5, media block 508 tall | single image, no progress, 440 tall | add progress line (1px, 2 segments) and 68px below the image |
| panel | title | `.overlay-detail-panel-modal_heading` | y | 636 (panel-relative) | 568 | follows media block (+68) |
| panel | subheadings (details, layout options) | `.overlay-detail-panel-modal_subheading` | fs / lh / ls | 20px / 27px / -1px | 24px / 28.8px / normal | 20px / 27px / -0.05em |
| panel | title to details, list to layout options | gaps | gap | 56, 56 | 48, 48 | 56px, 56px |
| panel | footnote | `.overlay-detail-panel-modal_link`, `_note` | fs / lh / ls | 12px / 18px / -0.36px, w228 | 14px / 16.8px / -0.42px, w350 | 12px / 18px / -0.03em |
| panel | bottom padding | `.overlay-detail-panel-modal_panel` | padding-bottom | 96 | 48 | 96px |

Matches (no issue): layout options 2 columns (167 + 167, gap 16, column-count 2), list rows 49 pitch, body p 16/20, title 28/30/-1.4, image 350x440, hero, offers geometry.

## neighborhood

Live order: hero, script intro, split-image-text-light x3, tab-pills-intro (collapsed), offers (Midway), timeline-scatter Tall, neighborhood-corporate, article-card-staggered Tall, map-feature is-image-bg (overlay), gallery, offers, FAQ, CTA. Figma order: hero, intro, [selector pill floating at y1224], Downtown, Gaslamp, Little Italy, offers, beyond downtown, corporate and services, dining, location map, gallery, offers, FAQ.

| block | element | live class (combo) | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| 01 hero | all | `.hero-fullbleed-centered_*` | | y644 fs28 lh30 | identical | none |
| 02 intro | heading | `.script-intro-centered_heading.text-style-script.is-large` | font-size / lh | 33.62px / 40.3px | 28px / 33.6px | 33.62px / 40.3px |
| 02 intro | heading | same | width, lines | w350 (rot bbox 327.7), 2 lines | w326, 3 lines (h107.7) | width 350px |
| 02 intro | heading to p | gap | gap | 32 | 27.8 | 32px |
| 02 intro | section | `.script-intro-centered_component` + `.padding-section-xlarge` | height | 513 (p y offset 273) | 475 (p offset 235) | follows heading fix |
| 03 pill | selector | `.tab-pills-intro_frame` (collapsed) | position in flow | at intro bottom, y1224 (before Downtown), fixed selector | after Little Italy, y3421, `position: relative` inside static stage | move the section to follow the intro, keep size 220x40 (already matches) |
| 04 Downtown | order | `.split-image-text-light_component` | stacking | copy (h + p), image, caption | image, heading, p, caption | reorder: copy first |
| 04 Downtown | image | `.split-image-text-light_media` | w / h / ar | 266.5x315 (0.846), x20 | 350x449.5 (ar 647/831 = 0.778), x20 | width 266.5px, aspect-ratio 266.5/315 (8% off) |
| 04 Downtown | heading | `.split-image-text-light_heading.heading-style-h4` | fs / lh / ls | 24px / 26.4px / -1.2px | 20px / 24px / normal | 24px / 26.4px / -0.05em |
| 04 Downtown | heading to p | gap | gap | 20 | 40 | 20px |
| 04 Downtown | p to caption, image gaps | component gap | gap | 96 | 32 | 96px |
| 04 Downtown | section top | `.padding-section-large` | padding-top | 0 | 40 | 0 |
| 05 Gaslamp | image | `.split-image-text-light_media` (variant) | size / x | 244x200 at x126 | 245x200.8 at x125 | none |
| 05 Gaslamp | image to copy | gap | gap | 96 | 32 | 96px |
| 05 Gaslamp | heading | `.split-image-text-light_heading` | fs / lh / ls | 24px / 26.4px / -1.2px | 20px / 24px / normal | 24px / 26.4px / -0.05em |
| 05 Gaslamp | heading to p | gap | gap | 20 | 40 | 20px |
| 05 Gaslamp | section | `.padding-section-large` | padding-block | 96 / 96 | 40 / 40 (section 477 vs 634) | 96px 0 |
| 06 Little Italy | order | `.split-image-text-light_component` | stacking | img1 (244x200 x20), copy, img2 | img1, img2, copy | move img2 after copy |
| 06 Little Italy | img2 | `.split-image-text-light_media` | size / x | 350x410 (0.854) at x20 | 262.5x262.5 (1:1) at x107.5 | width 100%, aspect-ratio 350/410, margin-left 0 (17% aspect off) |
| 06 Little Italy | gaps | component gap | gap | 96 | 32 | 96px |
| 07 offers (Midway) | geometry | `.offers-slider-split_*` | y, size | match (80, 114, 182, 612, button 716) | match | none |
| 07 offers | button, arrows, height | G1, G2 | | 844 | 823 | G1, G2 |
| 08 beyond downtown | padding | `.padding-section-large` (timeline-scatter Tall) | padding-block | 120 / 120 | 40 / 40 | 120px |
| 08 beyond downtown | heading | `.timeline-scatter-images_heading.is-tall` | lh | 26.4px | 24px | 26.4px |
| 08 beyond downtown | heading to first image | gap | gap | 24 | 32 | 24px |
| 08 beyond downtown | image | `.timeline-scatter-images_image` | w / h / ar | 305x200 (1.525) | 304.5x214.5 (1.42) | aspect-ratio 305/200 (7% off) |
| 08 beyond downtown | item gap | `.timeline-scatter-images_item` | gap | 96 (pitch 329) | 32 (pitch 279.3) | 96px |
| 08 beyond downtown | alternation | | x | 20 / 65 / 20 / 65 | same | none |
| 09 corporate and services | padding | `.padding-section-large` | padding-block | 120 | 40 | 120px |
| 09 corporate and services | heading | `.neighborhood-corporate_heading` | fs / lh / ls / lines | 24px / 26.4px / -1.2px, 2 lines ("corporate /& services") | 26px / 26px / -1.3px, 1 line | 24px / 26.4px / -0.05em, max-width 160px or br |
| 09 corporate and services | heading to first item | gap | gap | 64 | 40 | 64px |
| 09 corporate and services | item gap | `.neighborhood-corporate_item` | gap | 64 (pitch 556) | 40 (pitch 537.2) | 64px |
| 09 corporate and services | title | `.neighborhood-corporate_title` | ls | 0 | -0.54px | 0 |
| 09 corporate and services | title to p | gap | gap | 20 | 12 | 20px |
| 09 corporate and services | p | `.neighborhood-corporate_text` | fs / lh | 16px / 20px | 18px / 23.4px | 16px / 20px |
| 09 corporate and services | caption | `.neighborhood-corporate_caption` | fs / lh / ls | 12px / 18px / -0.36px | 16px / 19.2px / -0.48px | 12px / 18px / -0.03em |
| 09 corporate and services | divider before button | | element | 1px line at 24 above button | absent | add border-top 1px, gap 24 |
| 09 corporate and services | button | `.button.is-chamfer.is-text-burgundy` | G1, w, x | w276 left (label 226 + 50) | w325.3 left | G1, no stretch |
| 10 dining | padding | `.article-card-staggered_component.is-tall` + `.padding-section-small` | padding-block | 120 / 120 | 48 / 48 | 120px |
| 10 dining | heading | `.heading-style-h4` | fs / lh / ls | 24px / 26.4px / -1.2px | 20px / 24px / normal | 24px / 26.4px / -0.05em |
| 10 dining | p to first item | gap | gap | 64 | 40 | 64px |
| 10 dining | card title | `.text-style-caps-caption-16` | fs / lh / ls | 18px / 21.6px / 0 | 16px / 19.2px / -0.48px | 18px / 21.6px / 0 |
| 10 dining | title to p | gap | gap | 20 | 16 | 20px |
| 10 dining | card gap | `.article-card-staggered_item.is-tall` | gap | 64 (pitch 536) | 48 (pitch 513.2) | 64px |
| 11 map | card | `.map-feature_content.is-image-bg` | x, w | x18 w354, text x50 w290 | card x20 w350, text x52 w286 | margin-inline 18px |
| 11 map | heading | `.heading-style-h4` | fs / lh / ls | 24px / 26.4px / -1.2px | 20px / 24px / normal | 24px / 26.4px / -0.05em |
| 11 map | intro p | `.map-feature_text.text-size-medium` | fs / lh | 20px / 26px, h92 | 16px / 20px, h80 | 20px / 26px |
| 11 map | p to first item | gap | gap | 35 | 27 | 35px |
| 11 map | walk, directions, name | same as meetings rows 07 | | | | same as meetings 07 map |
| 11 map | card h / map h | | h | card 656, map 729 | card 682, map 802 | follows row fixes |
| 11 map | pins | `.map_pin` | size / count | 68x68, 2 | 36x36, 4 | 68px; 2 visible |
| 12 gallery, offers, FAQ | | | | | | same as meetings rows 10 to 12 |
| panel (Coronado Beach, centered) | back arrow | `.overlay-detail-panel-modal_back` | size | 36 target, x20 y24 | 24x24 at x16 y32 | 36x36 target, top 24px |
| panel | close X | `.overlay-detail-panel-modal_close` | presence | none | 40x40 at x334 | hide below 768px (Figma has back only) |
| panel | title y | `_heading` | y | 96 | 88 | follows bar fix |
| panel | p to button | gap | gap | 32 | 48 | 32px |
| panel | button | `.overlay-detail-panel-modal_button` | G1 | 141x36 | 159.1x37 | G1 |
| panel | button to image | gap | gap | 56 | 40 | 56px |
| panel | progress | | presence | 1px 128/222 at 24 below image, 44 tall row | absent | add |
| panel | bottom padding | `_panel` | padding-bottom | 96 | 48 | 96px |

## legal

Figma frame 27:9031 "LEGAL" (hero 660, 12 blocks). Live order: hero, script intro, image-trio-text is-left (key features), feature-grid-dark-eyebrow, split-sticky-text-stacked-images, venue-card-fullbleed, map-feature is-image-bg, image-trio-text is-left (packages), form, gallery, offers, FAQ, CTA.

| block | element | live class (combo) | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| 01 hero | section | `.section_hero-fullbleed-centered` | height | 660 | 800 | height 660px (legal and corporate templates only) |
| 01 hero | title, p | `.hero-fullbleed-centered_heading` | y | 504 / 588 | 644 / 728 | follows height (offset from bottom 156 matches) |
| 02 intro | heading | `.script-intro-centered_heading.text-style-script.is-large` | fs / lh | 37.2px / 44.6px | 28px / 33.6px | 37.2px / 44.6px |
| 02 intro | heading | same | w, lines | w350, 2 lines | w326, 3 lines | width 350px |
| 02 intro | section | | height | 504.3 | 455 | follows heading fix |
| 03 key features | section | `.padding-global.padding-section-large` | padding-top / bottom | 0 / 96 | 40 / 40 | 0 / 96px |
| 03 key features | heading | `.image-trio-text_heading.heading-style-h4` | lh / ls | 27px / -1px | 24px / normal | 27px / -0.05em |
| 03 key features | image | `.image-trio-text_figure.is-left` | size | 350x350 | 350x350 | none |
| 03 key features | title | `.image-trio-text_item-heading` | ls | 0 | -0.54px | 0 |
| 03 key features | title to p | gap | gap | 12 | 16 | 12px |
| 03 key features | item gap | `.image-trio-text_item` | gap | 64 (pitch 528) | 48 (pitch 515.6) | 64px |
| 04 why teams | padding | `.padding-global.padding-section-large` | padding-block | 120 | 40 | 120px |
| 04 why teams | heading | `.feature-grid-dark-eyebrow_heading` | lh / ls / h | 26.4px / -1.2px / 52 | 28.8px / normal / 57.6 | 26.4px / -0.05em |
| 04 why teams | heading to grid | gap | gap | 96 | 48 | 96px |
| 04 why teams | eyebrow | `.feature-grid-dark-eyebrow_eyebrow` | fs / lh / ls | 12px / 18px / -0.36px | 16px / 19.2px / -0.48px | 12px / 18px / -0.03em |
| 04 why teams | text | `.feature-grid-dark-eyebrow_text` | fs / lh | 16px / 20px | 18px / 23.4px | 16px / 20px |
| 04 why teams | item pitch | `.feature-grid-dark-eyebrow_item` | h | 114 (1-line), 134 (2-line) | 154.9 fixed | item padding so pitch = 50 + 64 (+20 per extra line) |
| 04 why teams | reading order | `.feature-grid-dark-eyebrow_column` | order | location, setting, connectivity, privacy, outdoors, dining, group stays, rewards | location, outdoors, setting, dining, connectivity, group stays, privacy, rewards | `display: contents` on columns with `order`, or reorder the CMS list |
| 04 why teams | logo | `.feature-grid-dark-eyebrow_logo` | size | 167x48.1 | 128x37.5 | width 167px |
| 04 why teams | logo to caption | gap | gap | 24 | 16 | 24px |
| 04 why teams | caption | `.feature-grid-dark-eyebrow_caption` | fs / lh / ls | 12px / 18px / -0.36px | 14px / 16.8px / +0.7px | 12px / 18px / -0.03em |
| 05 focused work | padding | `.padding-global.padding-section-large` | padding-block | 120 | 40 | 120px |
| 05 focused work | heading | `.split-sticky-text-stacked-images_heading` | lh / ls | 26.4px / -1.2px | 28.8px / normal | 26.4px / -0.05em |
| 05 focused work | heading to p | gap | gap | 20 | 24 | 20px |
| 05 focused work | p | `.split-sticky-text-stacked-images_text` | fs / lh | 16px / 20px | 18px / 23.4px | 16px / 20px |
| 05 focused work | button | `.button.is-chamfer.is-dark` | G1 | 184x36 | 211.8x37 | G1 |
| 05 focused work | button to first image | gap | gap | 64 | 68 | 64px |
| 05 focused work | image | `.split-sticky-text-stacked-images_figure` | size / ar | 350x350 at x20 | 342x419.9 (ar 360/442) at x28 | width 350px, margin-inline 0, aspect-ratio 1/1 (18% off) |
| 05 focused work | item title | `.split-sticky-text-stacked-images_title` | fs / lh / ls | 18px / 21.6px / 0 | 16px / 19.2px / -0.48px | 18px / 21.6px / 0 |
| 05 focused work | image to title, title to p | gaps | gap | 20, 20 | 24, 16 | 20px, 20px |
| 05 focused work | item text | `.split-sticky-text-stacked-images_item-text` | fs / lh | 16px / 20px | 18px / 23.4px | 16px / 20px |
| 05 focused work | item gap | `.split-sticky-text-stacked-images_item` | gap | 64 (pitch 516) | 56 (pitch 581.9) | 64px |
| 06 venue cards | title, p, button | `.heading-style-display`, p, `.button.is-chamfer` | | same as meetings rows 04 | | same as meetings 04 |
| 06 venue cards | pill | `button.text-style-eyebrow-caps` | w / x | 260 / x65 | 260 / x65 | none |
| 06 venue cards | pill | same | bottom offset | 40 | 20 | bottom 40px |
| 07 map | all | `.map-feature_*.is-image-bg` | | same as neighborhood rows 11 | | same as neighborhood 11 |
| 08 packages | padding | `.padding-global.padding-section-large` | padding-block | 120 | 40 | 120px |
| 08 packages | heading | `.image-trio-text_heading.heading-style-h3` | align / lh | left / 26.4px | center / 24px | text-align left, line-height 26.4px |
| 08 packages | heading to first item | gap | gap | 64 | 32 | 64px |
| 08 packages | image | `.image-trio-text_figure.is-left` | h | 350x360 (0.972) | 350x350 (1:1) | aspect-ratio 350/360 (2.9%, borderline) |
| 08 packages | image to title | gap | gap | 24 | 20 | 24px |
| 08 packages | title | `.image-trio-text_item-heading` | ls | 0 | -0.54px | 0 |
| 08 packages | title to list | gap | gap | 20 | 0 (+4 li pad) | 20px |
| 08 packages | list | `.image-trio-text_item-text li` | x / pitch | x20 flat lines pitch 20 | x40 (indented) pitch 24 | padding-left 0, margin 0, line-height 20px |
| 08 packages | item gap | `.image-trio-text_item` | gap | 64 | 48 | 64px |
| 08 packages | order | CMS | order | War Room, Executive Floor Buyout, Extended Stay | Executive Floor Buyout, War Room, Extended Stay | content order (CMS), flag only |
| 09 form | padding | | padding-top | 0 (follows packages pad 120) | 40 | 0 |
| 09 form | script heading | `.text-style-script` in `.is-rotated` header | fs / lh | 36.1px / 43.3px | 44px / 52.8px | 36.1px / 43.3px |
| 09 form | script heading | same | rotation, x, w, lines | -7.5deg, x45 w300, left, 2 lines (h81) | -6deg, x9 w359, 3 lines (h141.6) | rotate -7.5deg, width 300px, margin-left 25px |
| 09 form | contact labels | `.form-split-script-contact_detail-label` | fs / lh / ls | 12px / 18px / -0.36px | 16px / 19.2px / -0.48px | 12px / 18px / -0.03em |
| 09 form | contact details | detail wrappers | pitch / gap | pitch 82, label to value 12 | pitch 73, 10 | gap 12px, group gap 32px |
| 09 form | details to form | gap | gap | 64 | 47.5 | 64px |
| 09 form | group heading | `.heading-style-h4` | lh / ls | 27px / -1px | 24px / normal | 27px / -0.05em |
| 09 form | submit | `input.button.is-chamfer.is-dark` | G1 | 217x36 left | 252.1x37 left | G1 |
| 09 form | fields | `.form-split-script-contact_input` | pitch / h / fs | 50 / 26 / 14px label | 50 / 26 / 16px | font-size 14px |
| 10 gallery | | `.gallery-mosaic-captioned_*` | | same as meetings row 10 | | same as meetings 10 |
| 11 offers | block | `.section_offers-slider-split` | presence | absent between gallery and FAQ | present (783) | structural: needs a yes before removing from the legal-corporate template (it also shows on desktop) |
| 12 FAQ | | `.accordion_*`, `.heading-style-h2` | | same as meetings row 12 | | same as meetings 12 |
| panel (Council Boardroom) | all | `.overlay-detail-panel-modal_*` | | identical to meetings panel (776:12005 equals 776:11888) | | same as meetings panel rows |

## corporate

Frame 757:14158 is named "LEGAL Mobile 391" and is the corporate page. Same blocks as legal. Live heights: intro 435, rest equal to legal. All legal rows apply (hero 660, intro, key features, why teams, focused work, venue cards, map, packages, form, gallery, FAQ, extra offers block, panel). Only the differences:

| block | element | live class (combo) | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| 01 hero | section | `.section_hero-fullbleed-centered` | height | 660 | 800 | same as legal 01 |
| 02 intro | heading | `.script-intro-centered_heading` | h / lines | Figma frame 504.3 (same as legal) | live 435 (shorter p, 5 lines) | same type fix as legal 02; p length is CMS copy |
| 04 why teams | item pitch | `.feature-grid-dark-eyebrow_item` | h | 2-line items, pitch 150 (Figma section 1632) | 154.9 | same as legal 04 (pitch rule 50 + line count) |
| 09 form | section | `.section_form-split-script-contact` | padding-top / bottom | 64 / 64 (section 1238) | 0 + 40 (section 1156) | padding-block 64px |
| 09 form | script heading | `.text-style-script` | fs / lh / x / w | 38.5px / 46.2px, x35 w320, left, rot -7.5deg | 44px / 52.8px, x9 w359, -6deg | 38.5px / 46.2px, width 320px, margin-left 15px, rotate -7.5deg |
| 09 form | p | | gap to contacts | 64 (183.1 to 327.1 incl. p 80) | like legal | same as legal 09 |

## Fixes by class family

| class or combo | property | current -> target (below 768px) | pages affected | shared-component risk |
|---|---|---|---|---|
| `.button.is-chamfer` (+ `.offers-slider-split_button`, `.overlay-detail-panel-modal_button`, `input.button`) | font-size / line-height / letter-spacing / height | 16 / 16 / normal / 37 -> 14 / 18 / -0.05em / 36 | all four, every page with a chamfer CTA | high: site-wide button; check other agents' pages and desktop is untouched |
| `.offers-slider-split_arrow` | width / height | 30x14 -> 36x36 | meetings, neighborhood (x2), legal, corporate | medium (all offers sliders); fixes section height 783 -> 804 |
| `.padding-global.padding-section-large` | padding-block | 40 -> 120 | neighborhood (beyond downtown, corporate), legal/corporate (why teams, focused work, packages, form) | high: used by every section; scope with a combo (`is-mobile-120`) instead of changing the base |
| `.script-intro-centered_heading.is-large` | font-size / line-height / width | 28 / 33.6 / 326 -> neighborhood 33.62 / 40.3 / 350, legal 37.2 / 44.6 / 350 | neighborhood, legal, corporate | low (per-page via CMS combo) |
| `.meetings-collection-venues_heading` | font-size / line-height / rotation / width | 44 / 52.8 / none / 326 -> 30.67 / 36.8 / -7.4deg / 350 | meetings | low |
| `.form-split-script-contact_header.is-rotated .text-style-script` | font-size / rotation / width / align | 44 / -6deg / 359 / start -> meetings 38.87, legal 36.1, corporate 38.5; -7.5deg; one line; legal and corporate left, meetings center | meetings, legal, corporate | medium (shared with contact page, check) |
| `.form-split-script-contact_*` | gaps, group gap, button | group gap 91 -> 64, last field to button 86 -> 56, heading lh 27 / ls -1px, input font 14px | meetings, legal, corporate (contact page shares) | medium |
| `.venue-card-fullbleed_item` h3 `.heading-style-display` and p | font-size / lh / width | 40/40, 18/28.8, w342 -> 28/28/-1.4px, 16/20, w310 | meetings, legal, corporate (also home, dining, arts) | high: shared venue-card component |
| `.venue-card-fullbleed_stage` pill (`button.text-style-eyebrow-caps`) | width / bottom | auto, 20 -> 260px, 40px | meetings, legal, corporate | medium |
| `.venue-card-fullbleed_media.is-media-center` start clip | polygon | 311x457 portrait -> 265x193 landscape strip, 217 tall including 24 padding | meetings (venue preview) | high: animation mask, shared with home/dining/arts |
| `.map-feature_content.is-image-bg` (+ `.map-feature_text`, `_item`, `_item-row`, `_link`) | fs / lh / ls / gaps | heading 20/24 -> 24/26.4/-0.05em; p 16/20 -> 20/26; walk 16/20 -> 20/26 (row h14); item name ls -0.54 -> 0; p to item 27 -> 35; card x20 w350 -> x18 w354 (overlay variant) | meetings (stacked), neighborhood, legal, corporate | medium (one component, variant Stacked on meetings) |
| `.map_pin` | size | 36 -> 48 (meetings), 68 (neighborhood, legal) | all four | low |
| `.meetings-collection-features_*` | padding, aspect, heading, list | pad 64 -> 120; figure ar 484/596 -> 350/360; card heading 16/19.2 -> 20/27/-0.05em; list pitch 37.8 -> 33; button to card gap 48 -> 64 | meetings | low (page-specific) |
| `.gallery-mosaic-captioned_*` | figure aspect, heading, caption | figures 487.5/390/390/487.5 -> 612/480/480/480; heading 20/24 -> 28/28/-0.05em at top 41; caption 16/19.2/-0.48 -> 14/16.8/-0.42 | all four | medium (gallery shared with other pages) |
| `.accordion_*` FAQ eyebrow and `.heading-style-h2` | fs / lh / ls | eyebrow 18/21.6/-0.54 -> 12/18/-0.36; h2 30/30/-1.5 -> 28/28/-1.4 | all four | medium (FAQ shared) |
| `.split-image-text-light_*` | order, image size, gaps, heading | Downtown 350x449.5 -> 266.5x315, copy before image; Gaslamp gap 32 -> 96; Little Italy img2 262.5 square right -> 350x410 left after copy; heading 20/24 -> 24/26.4/-0.05em, h to p 40 -> 20 | neighborhood | low (neighborhood-only variants) |
| `.tab-pills-intro` section (collapsed pill) | position in page | after Little Italy -> directly after intro | neighborhood | low |
| `.timeline-scatter-images_*.is-tall` | pad, heading, aspect, gap | pad 40 -> 120, heading lh 24 -> 26.4, image ar 1.42 -> 1.525, item gap 32 -> 96, heading gap 32 -> 24 | neighborhood | low |
| `.neighborhood-corporate_*` | pad, heading, p, caption, gaps, divider, button | pad 40 -> 120; heading 26/26 -> 24/26.4/-0.05em, 2 lines; p 18/23.4 -> 16/20; item gap 40 -> 64; title ls -0.54 -> 0; title to p 12 -> 20; caption 16 -> 12/18; divider added; button not stretched | neighborhood | low |
| `.article-card-staggered_*.is-tall` | pad, heading, title, gaps | pad 48 -> 120; heading 20/24 -> 24/26.4; title 16/19.2/-0.48 -> 18/21.6/0; title to p 16 -> 20; card gap 48 -> 64; p to item 40 -> 64 | neighborhood | low |
| `.image-trio-text_*.is-left` | pad, heading, title ls, gaps, list | key features pad 40/40 -> 0/96; gap 48 -> 64; title ls -0.54 -> 0; title to p 16 -> 12; packages heading left, gap 32 -> 64, list x40 -> x20 pitch 24 -> 20 | legal, corporate | low |
| `.feature-grid-dark-eyebrow_*` | pad, type, pitch, order, logo | pad 40 -> 120; heading gap 48 -> 96; eyebrow 16 -> 12/18; text 18/23.4 -> 16/20; pitch 154.9 -> 114+; column order; logo 128 -> 167; caption 14/+0.7 -> 12/-0.36 | legal, corporate | low |
| `.split-sticky-text-stacked-images_*` | pad, type, image, gaps | pad 40 -> 120; p 18/23.4 -> 16/20; image 342x419.9 at x28 -> 350x350 at x20; title 16 -> 18/21.6/0; item text 18 -> 16/20; item gap 56 -> 64 | legal, corporate | low |
| `.section_hero-fullbleed-centered` (legal-corporate template) | height | 800 -> 660 | legal, corporate | medium (hero component shared; scope to template combo) |
| `.section_offers-slider-split` on legal-corporate template | presence | present -> absent per Figma | legal, corporate | structural, needs approval (desktop too) |
| `.overlay-detail-panel-modal_*` | back, close, media, headings, gaps, padding | back 24 -> 36 target; close hidden (centered variant); progress line added with 68 below image (meetings variant); subheading 24/28.8 -> 20/27/-0.05em; gaps 48 -> 56; footnote 14 -> 12/18; padding-bottom 48 -> 96; centered variant p to button 48 -> 32, button to image 40 -> 56 | meetings, legal, corporate (council boardroom etc), neighborhood (coronado beach) | medium (one modal component, both variants) |

## Notes and caveats

- Not verified: neighborhood offers bg colour (Figma #906e58 tan vs live unmeasured), figcaption type in beyond-downtown, venue card vertical centering while pinned, field label vs placeholder rendering on form (live labels are sr-only; Figma shows the label text inside each 26px field at 14px).
- Live captures of `section_venue-card-fullbleed` and `.map_pin` were measured in the settled scroll position; clip/transform values are start-state for non-active cards.
- Crops in `docs/figma/mobile/audit/img/`: `meetings-1..5`, `neighborhood-1..4`, `legal-1..5`, `corporate-1..3`, each as `-figma.jpg` and `-live.jpg` (Figma renders are capped at 16384px tall, so crops are downscaled: scale 1.09 meetings, 0.90 neighborhood, 0.80 legal and corporate). Live crops include the fixed nav bar overlay.
  1: meetings venue card, 2: meetings map, 3: meetings features, 4: meetings form, 5: meetings gallery; neighborhood 1: intro + split sections, 2: beyond downtown, 3: corporate and services, 4: map; legal 1: hero + intro, 2: key features, 3: why teams, 4: focused work, 5: packages; corporate 1: hero + intro, 2: why teams, 3: form.
