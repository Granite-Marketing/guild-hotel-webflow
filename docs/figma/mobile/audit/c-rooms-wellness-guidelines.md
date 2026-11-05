# Mobile audit C: rooms-collection, rooms-individual, wellness-collection, guidelines (390px)

Measured Figma node boxes (`figma/mobile/nodes.json.gz`) against live staging (Playwright, 390x844, scrolled once so reveals fired). All positions are page-relative; "y in section" = distance from section top. Global nav, CTA newsletter and footer skipped. Images in `img/` as `<page>-<n>-<block>-figma.jpg` and `-live.jpg`.

Measured pages: `/rooms` (quiz revealed by clicking through, so recommendations and room grid were measured), `/rooms/cozy-king` (rooms-individual), `/wellness` (pinned stack sampled at 19 scroll positions, settled values below), `/guidelines`.

Notes on method limits:
- Rooms-collection and rooms-individual script headings are vector outlines in Figma. Size inferred from the rooms-individual heading, which is real text (Morello 56.4px / 67.7px line height) and renders at the same width as the rooms-collection one (about 2.04x the live 28px).
- Figma "Room 4" card uses a 32px inset (two-line title); only the 24px inset of Rooms 1 to 3 is tabled.
- Same blocks repeat on several pages (offers, FAQ, map). They are tabled once under rooms-collection and referenced elsewhere; the measured numbers were identical on `/wellness`, `/rooms/cozy-king` and `/guidelines`.

## rooms-collection (`/rooms`)

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | all | `section_hero-fullbleed-centered` | height, title 28/30, desc 16/20, y 674/728 | match | match | none |
| 02 intro | script heading | `script-intro-centered_heading text-style-script is-large` | font-size / line-height | ~56px / ~67px (est., 2 lines, box 320x160) | 28px / 33.6px (box 326x107.7) | font-size: 3.5rem; line-height: 4.2rem (this page only, see families) |
| 02 intro | heading y in section | same | y | 120 | 99.7 | follows from size, re-measure |
| 02 intro | heading to paragraph | `script-intro-centered_paragraph` | gap | 32 | 27.8 | margin-top: 2rem |
| 02 intro | paragraph y | same | y | 311.8 | 235.2 | follows from heading |
| 02 intro | paragraph to stamp | `script-intro-centered_image` | gap | 32 | 64 | margin-top: 2rem |
| 02 intro | stamp | same | w x h, y | 134.9 x 134.9, y 403.8 | 128 x 128, y 359.2 | width: 134.9px; height: 134.9px |
| 02 intro | section height | `section_script-intro-centered` | height | 658.6 | 607.2 | result of the above |
| quiz | section height | `section_rooms-collection-quiz` | height | 800 | 966.2 (566 content + 400 image) | min-height: 800px on `rooms-collection-quiz_content`, content centred vertically |
| quiz | image figure | `rooms-collection-quiz_figure` | present | absent (no photo in Figma step) | 390 x 400 building photo under the quiz | display: none below 768px, or confirm with client (Figma has none) |
| quiz | counter "01 / 03" | `rooms-collection-quiz_counter text-style-caption` | font-size / lh / ls / y | 12 / 18 / -0.36 / 56 | 14 / 15 / normal / 64 | font-size: 0.75rem; line-height: 1.125rem; letter-spacing: -0.03em; margin-top 56px |
| quiz | title | `rooms-collection-quiz_content h2.heading-style-h4` | font-size / lh / ls / y | 28 / 28 / -1.4 / 90 | 20 / 24 / normal / 103 | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em |
| quiz | option buttons | `a.button.is-chamfer.is-outline-light.is-fill` | w x h, x | 250 x 48, x 70 | 326 x 56, x 32 | width: 250px; min-height: 48px; margin-inline: auto |
| quiz | option pitch | same | gap | 12 | 20 | gap: 0.75rem on `rooms-collection-quiz_options` |
| quiz | option label | span in button | font-size / lh / ls | 14 / 18 / -0.7 | 16 / 16 / normal | font-size: 0.875rem; line-height: 1.125rem; letter-spacing: -0.05em |
| quiz | option chamfer | same (stretched bg image) | chamfer size | 11 x 11 on 48 high | ~28 visible on 56 high (clip polygon says 11 x 12) | background-size: 100% 100% off; use fixed-size chamfer caps like Figma |
| quiz | first button y | same | y in section | 299 | 175 | buttons block centred in 800px section |
| quiz | "see all the rooms" | `rooms-collection-quiz_link text-style-caps-caption-16` | font-size / lh / ls / y | 14 / 18 / -0.7 / 708 | 16 / 19.2 / -0.48 / 507 | font-size: 0.875rem; line-height: 1.125rem; letter-spacing: -0.05em; pin to bottom, 92 from section end |
| recommendations (revealed) | title | `rooms-collection-recommendations_heading heading-style-h2` | font-size / ls | 28 / -1.4 | 30 / -1.5 | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em |
| recommendations | title to paragraph | `rooms-collection-recommendations_text` | gap | 16 | 40 | margin-top: 1rem |
| recommendations | paragraph y | same | y in section | 196 | 226 | follows gap |
| recommendations | links | `rooms-collection-recommendations_link text-style-eyebrow-caps` | arrangement | stacked column, centred, 36 high, 8 gap | one row, 43.2 high | flex-direction: column; row-gap: 0.5rem; min-height: 36px |
| recommendations | link label | same | font-size / lh / ls | 14 / 18 / -0.7 | 18 / 21.6 / -0.54 | font-size: 0.875rem; line-height: 1.125rem; letter-spacing: -0.05em |
| recommendations | section | `section_rooms-collection-recommendations` | height, bottom pad | 464, 96 | 433.2, 64 | padding-bottom: 6rem |
| room grid (revealed) | card | `rooms-collection-room-grid_card` | w x h, aspect | 390 x 540 (0.722) | 390 x 606.8 (0.643) | aspect-ratio: 390 / 540 on `_image` or height: 540px |
| room grid | card gap | `rooms-collection-room-grid_item` | gap | 2 | 0 | row-gap: 2px |
| room grid | content inset | `rooms-collection-room-grid_heading`, details, button | x | 24 | 20 | padding-inline: 1.5rem |
| room grid | card title | `rooms-collection-room-grid_heading heading-style-h3` | line-height / y from card top | 26.4 / 374 | 24 / 463.7 | line-height: 1.1; bottom-anchored |
| room grid | title to meta gap | detail row | gap | 15.6 | 27.8 | margin-top: 1rem |
| room grid | meta row | `rooms-collection-room-grid_detail text-style-eyebrow` | font-size / lh, icon | 14 / 15, 24px icon + 12 gap | 18 / 26.1, no icons | font-size: 0.875rem; line-height: 15px; add guests and size icons (24px) |
| room grid | button | `p.button.is-chamfer` | w x h, label | 130 x 36, 14/18/-0.7 | 144.9 x 37, 16/16/normal | label font-size: 0.875rem; min-height: 36px |
| room grid | bottom pad | content | gap button to card bottom | 32 | 8.9 | padding-bottom: 2rem |
| map | heading | `map-feature .text-style-script is-large` | font-size / lh | 44.4 / 44.4 | 32 / 38.4 | font-size: 2.78rem; line-height: 1 |
| map | heading y | same | y in section | 96 | 40.6 | padding-top: 6rem on `map-feature_component` |
| map | paragraph | `map-feature_text` | lines, y | 2 lines (40 high), y 205.8 | 1 line (20 high), y 118.4 | max-width ~ 300px so it wraps like Figma; margin-top 1.5rem |
| map | button | `a.button.is-chamfer.is-outline` | w x h, label | 168 x 36, 14/18/-0.7 | 191.4 x 37, 16/16/normal | label font-size: 0.875rem; min-height: 36px |
| map | button to map | `map-feature_image` | gap | 24 | 32 | margin-top: 1.5rem |
| map | map image | same | x, w x h | -81, 552 x 559 | -81, 552 x 559 | match |
| map | bottom | section | gap map to section end | 11 | 40 | padding-bottom: 0 on `section_map-feature` |
| map | section height | `section_map-feature` | height | 900 | 820.4 | result |
| offers | button | `offers-slider-split_button` | w x h, label | 168 x 36, 14/18/-0.7 | 191.4 x 37, 16/16/normal | label font-size: 0.875rem; min-height: 36px |
| offers | slider init | `offers-slider-split_slider swiper offers` | state | pager "02 / 05" shown | Swiper NOT initialised on `/rooms` (class list lacks `swiper-fade swiper-initialize`; no controls rendered) | JS: init order with the quiz script; verify `swiperSliders()` runs on this page |
| offers | pager row | `offers-slider-split_controls` | height, arrow | 36 high, arrows 36x36 targets, glyph 24x18 | 14 high, svg 30x14 (on `/wellness`, `/rooms/cozy-king`) | min-height: 36px; arrow width/height: 36px; svg 24x18 |
| offers | pager label y | same | y of "02" | section +739 | section +729 (wellness) | follows 36px row |
| offers | section height | `section_offers-slider-split` | height | 804 | 763 here, 783 on wellness | result |
| FAQ | eyebrow "faqs" | `section_faq-accordion` first `p` | font-size / lh / ls | 12 / 18 / -0.36 | 18 / 21.6 / -0.54 | font-size: 0.75rem; line-height: 1.125rem; letter-spacing: -0.03em |
| FAQ | title | `section_faq-accordion h2.heading-style-h2` | font-size / lh / ls | 28 / 28 / -1.4 | 30 / 30 / -1.5 | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em |
| FAQ | eyebrow to title | same | gap | 12 | 16 | margin-top: 0.75rem |
| FAQ | section height | `section_faq-accordion` | height | 1140 | 1151.6 | result of the above (rows, dividers and open state match: question 18/21.6, pitch 113, open 249) |

Count: 44 issues (5 are "match" rows, not counted: 39 issues).

## rooms-individual (`/rooms/cozy-king`)

Hero, map, offers and FAQ identical to rooms-collection (same fixes). Further blocks:

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | all | `section_hero-fullbleed-centered` | height, title, desc | 800, 28/30, 16/20 | match | none |
| 02 intro | back link | `script-intro-centered_back-link text-style-caps-caption-16` | y in section | 48 | 122.4 | margin-top 0 inside container (container offset 80 plus 42 extra) |
| 02 intro | back link label | span | font-size / lh / ls | 16 / 12 / -0.8 | 16 / 19.2 / -0.48 | letter-spacing: -0.05em; line-height: 12px |
| 02 intro | back icon | `script-intro-centered_back-icon` | w x h | 24 x 18 | 12 x 12 | width: 24px; height: 18px |
| 02 intro | script heading | `script-intro-centered_heading text-style-script is-large` | font-size / lh / box | 56.4 / 67.7 / 350 x 197.4 | 28 / 33.6 / 326 x 107.7 | font-size: 3.5rem; line-height: 4.2rem |
| 02 intro | heading y | same | y in section | 148 | 187.7 | follows back link |
| 02 intro | heading to "room description" | `rooms-individual-description_heading` | gap | 64 | 147.8 | script section padding-bottom 0, description padding-top 4rem |
| description | heading | same | font-size / lh / ls | 20 / 27 / -1 | 24 / 28.8 / normal | font-size: 1.25rem; line-height: 27px; letter-spacing: -0.05em |
| description | heading to text | `rooms-individual-description_text` | gap | 24 | 32 | margin-top: 1.5rem |
| description | text | same | line-height | 20 | 20.8 | line-height: 20px |
| description | order | `rooms-individual-description_content` | stack | title, text, list, "view floorplan" last | title, text, "view floorplan", list | move the link after the list (order: 3) |
| description | floorplan link | `a.button.is-link text-style-caps-caption-16` | font-size / lh / ls | 14 / 18 / -0.7, underlined, w 350 | 16 / 16 / -0.48, w 142.6 | font-size: 0.875rem; line-height: 1.125rem; letter-spacing: -0.05em |
| description | list rows | `rooms-individual-description_list` | pitch, text x | 49, x 20 | 41.8, x 28 (35.5 text) | row padding-block: 0.75rem; remove 8px indent |
| description | list text | list `span` | line-height | 20 | 20.8 | line-height: 20px |
| media (pinned) | start state | `venue-card-fullbleed_media` clip | box | 316 x 213 at x 37, plain rect | 311.2 x 457.6 at x 39.4, chamfer 16 | clip-path start: inset to 316 x 213; plain rect |
| media | settled | same | height | 612 | 844 | height: 612px (settled frame), or 100vh if Stephen prefers full viewport |
| media | caption | `venue-card-fullbleed_content` words | font-size / lh / ls | 14 / 16.8 / -0.42, left 20, bottom 20 | 18 / 21.6 / -0.54, left 20, bottom ~18.6 | font-size: 0.875rem; line-height: 1.2; letter-spacing: -0.03em |
| 04 details | image 1 | `section_split-image-text-light img.u-image` (first) | x, w x h, aspect | x 195, 175 x 226 (0.774) | x 20, 350 x 449.5 (0.779) | width: 175px; margin-left: auto (right aligned) |
| 04 details | image 2 | second `img.u-image` | x, w x h, aspect | x 20, 266.5 x 315 (0.846) | x 107.5, 262.5 x 262.5 (1.0) | width: 266.5px; aspect-ratio: 266.5 / 315; margin-right: auto |
| 04 details | order | `container-large w-variant-473c...` | stack | img 1, paragraph, img 2 | img 1, img 2, paragraph | paragraph between the two images |
| 04 details | gaps | same | gap | 96 / 96 | 32 / 32 | row-gap: 6rem |
| 04 details | section pad / height | `section_split-image-text-light` | top, bottom, height | 120, 120, 1073 | 40, 40, 956 | padding-block: 7.5rem |
| amenities | heading | `rooms-individual-amenities_heading` | align, lh | left, 26.4 | centre, 24 | text-align: left; line-height: 1.1 |
| amenities | intro | `rooms-individual-amenities_text` | align, lh | left, 20 | centre, 20.8 | text-align: left; line-height: 20px |
| amenities | list items | `rooms-individual-amenities_item` | align, size, pitch | left, 14 / 16.8 / -0.42, pitch 66 (1-line) | centre, 16 / 19.2 / -0.48, 88 high, pitch 92 | text-align: left; font-size: 0.875rem; line-height: 16.8px; padding-block: 1rem; 1px dividers |
| amenities | section pad | `section_rooms-individual-amenities` | top, bottom | 0, 120 | 64, 64 | padding-bottom: 7.5rem; padding-top: 0 (details section supplies 120) |
| 06 details | image 1 | second `section_split-image-text-light` first img | w x h | 266.5 x 315 (0.846), x 20 | 350 x 449.5 (0.779), x 20 | width: 266.5px; aspect-ratio: 266.5 / 315 |
| 06 details | image 2 | second img | w x h, x | 350 x 350, x 20 | 262.5 x 262.5, x 107.5 | width: 100%; aspect-ratio: 1 |
| 06 details | order, gaps, pad | same | order, 96 gaps, 120 pad | img, p, img | img, img, p; gaps 32; pad 40 | per variant, see 04 |
| gallery (mosaic) | image 1 | `gallery-mosaic-captioned_figure.is-wide` img | h | 612 | 487.5 | aspect-ratio: 390 / 612 |
| gallery | images 2 and 3 | `gallery-mosaic-captioned_figure` img | h | 480 | 390 | aspect-ratio: 390 / 480 |
| gallery | image 4 | `is-wide` img | h | 480 | 487.5 | aspect-ratio: 390 / 480 (so `is-wide` cannot be one ratio: image 1 vs 4 differ) |
| gallery | title | `gallery-mosaic-captioned_heading heading-style-h4` | font-size / lh / ls / y | 28 / 28 / -1.4, y 41 inside image 1 | 20 / 24 / normal, y 20 | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em; top: 2.5rem |
| gallery | captions | span in figure | font-size / lh / ls | 14 / 16.8 / -0.42 | 16 / 19.2 / -0.48 | font-size: 0.875rem; line-height: 1.2; letter-spacing: -0.03em |
| gallery | section height | `section_gallery-mosaic-captioned` | height | 2055 | 1758 | result |
| discover other rooms | padding top | `section_card-carousel-header-left` | padding-top | 96 | 64 | padding-top: 6rem |
| discover other rooms | card label | `card-carousel-header-left_label` | letter-spacing | -1 (-0.05em) | -0.6 | letter-spacing: -0.05em |
| discover other rooms | cards | `card-carousel-header-left_link` / image | w x h | 310; images 437 / 307 / 403 | 310; images 437 / 307 / 403 | match (staggered heights correct) |

Count: 33 issues.

## wellness-collection (`/wellness`)

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | all | `section_hero-fullbleed-centered` | box, title, desc | 800, 28/30, 16/20 | match | none |
| intro | heading | `tab-pills-intro_heading text-style-script is-large` | font-size / lh / box | 36.7 / 44.1 / 358 x 132.4 (3 lines) | 32 / 38.4 / 350 x 76.8 (2 lines) | font-size: 2.3rem; line-height: 2.76rem |
| intro | top padding | `tab-pills-intro` first `padding-global` | y of heading | 160 | 48 | padding-top: 10rem |
| intro | bottom padding | same | gap paragraph to panels | 160 | 48 | padding-bottom: 10rem |
| intro | paragraph | `p` | 16/20, gap 32 | match | match | none |
| intro | height | block | height | 544.4 | 264.8 | result |
| panels | arrangement | `pin-spacer` / `tab-pills-intro_stage` | layout | 4 stacked 844px panels, 3376 total | pinned wipe stack, 5148 spacer | design intent differs; confirm with Stephen (not changing) |
| panels | start frame | `tab-pills-intro_frame is-media` clip | box | 265 x 193.1, x 62.5, chamfered | 343.2 x 457.6, x 23.4, y 193.2, chamfer 24 | clip start inset: 62.5px sides, ~325px top and bottom (265 x 193) |
| panels | settled frame | same | box | 390 x 844 | 390 x 844 | match (clip opens to full rect) |
| panels | title | `venue-card-fullbleed_header h3.heading-style-display` | font-size / lh / lines | 28 / 28 / 1 line (w 310, x 40) | 40 / 40 / 2 lines (w 220, x 84.6) | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em |
| panels | title y | same | y from panel top | 346 | 306.5 | follows content centring |
| panels | description | `venue-card-fullbleed_text text-size-large` | font-size / lh, w, x | 16 / 20, w 310, x 40 | 18 / 28.8, w 291.7, x 49.1 | font-size: 1rem; line-height: 20px; max-width: 310px |
| panels | title to description | same | gap | 32 | 24 | margin-top: 2rem |
| panels | button | `venue-card-fullbleed_footer a.button.is-chamfer` | y, w x h, label | y 478, 168 x 36, 14/18/-0.7 | y 500.1, 191.4 x 37, 16/16/normal | label font-size: 0.875rem; min-height: 36px |
| panels | tab pill (extra) | `div` clip chamfer, `button.text-style-eyebrow-caps` | present | absent | 246 x 40 at x 72, 60 from panel bottom | confirm: not in Figma |
| offers | button / pager / slide copy | `offers-slider-split_*` | see rooms-collection | 168x36 and 36px pager | 191.4x37 and 14px pager | same fixes |
| offers | image, heading, copy, button y | `offers-slider-split_image` etc. | positions | 182 / 114 / 612 / 676 | 182 / 114 / 612 / 676 | match |
| FAQ | eyebrow, title, gap | `section_faq-accordion` | see rooms-collection | 12 / 28 | 18 / 30 | same fixes |

Count: 15 issues.

## guidelines (`/guidelines`)

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | section | `section_hero-fullbleed-centered` | height | 660 | 800 | min-height: 660px (this page only) |
| hero | title / desc | same | 28/30 y from bottom 156, 16/20 | match | match | none |
| intro | heading | `script-intro-centered_heading text-style-script is-large` | font-size / lh / box | 26.9 / 32.3 / 320.6 x 103.9 (3 lines) | 28 / 33.6 / 330.3 x 141.1 (4 lines) | font-size: 1.68rem; line-height: 2.02rem |
| intro | heading y | same | y in section | 120 | 99.9 | follows |
| intro | paragraph y / gap | `script-intro-centered_paragraph` | y, gap from heading | 256.4, 32.6 | 268.8, 27.8 | margin-top: 2rem |
| intro | section | `section_script-intro-centered` | height | 476.4 | 488.8 | result |
| process | top image | `section_guidelines-process` | present | grey 350 x 316 image at y 120 (Figma placeholder) | absent | add figure `guidelines-process_figure` 350 x 316 or confirm removal with client |
| process | heading | `guidelines-process_heading` | font-size / lh / ls | 28 / 28 / -1.4 | 20 / 24 / normal | font-size: 1.75rem; line-height: 1; letter-spacing: -0.05em |
| process | intro | `guidelines-process_intro` | font-size / lh / h | 16 / 20 / 60 | 18 / 23.4 / 93.6 | font-size: 1rem; line-height: 20px |
| process | heading to intro | same | gap | 20 | 24 | margin-top: 1.25rem |
| process | intro to first item | `guidelines-process_text` | gap | 96 | 49 | margin-top: 6rem |
| process | item text | `guidelines-process_text` | font-size / lh / x / w | 16 / 20 / x 20 / w 350 | 18 / 23.4 / x 28 / w 336 | font-size: 1rem; line-height: 20px; remove 8px indent |
| process | number | `guidelines-process_number` (sup) | size | 16px glyph (¹) | 10px sup | font-size: 1rem (superscript glyph) |
| process | item pitch | list | pitch, 4-line item | 132.5 | 146.6 | follows font and spacing (32 between item and divider) |
| process | section height | section | height | 1598.5 | 1150.7 | result |
| mosaic | heading | `timeline-scatter-images_heading heading-style-h4` | font-size / lh / align | 24 / 26.4 / -1.2, left | 20 / 24 / normal, centre | font-size: 1.5rem; line-height: 1.1; letter-spacing: -0.05em; text-align: left |
| mosaic | heading to image 1 | `timeline-scatter-images_image` | gap | 120 | 32 | row-gap: 7.5rem |
| mosaic | image gaps | figure to figure | gap | 120 | 32 | row-gap: 7.5rem |
| mosaic | image 1 | `timeline-scatter-images_image` 1 | x, w x h, aspect | x 20, 266.5 x 315 (0.846) | x 20, 245 x 320.7 (0.764) | width: 266.5px; aspect-ratio: 266.5 / 315 |
| mosaic | image 2 | image 2 | x, w x h, aspect | x 103.5, 266.5 x 315 (0.846) | x 72.5, 297.5 x 225.4 (1.32) | width: 266.5px; aspect-ratio: 266.5 / 315; margin-left: auto |
| mosaic | image 3 | image 3 | x, w x h, aspect | x 20, 350 x 316 (1.108) | x 20, 245 x 440.8 (0.556) | width: 100%; aspect-ratio: 350 / 316 |
| mosaic | image 4 | image 4 | x, w x h, aspect | x 126, 244 x 200 (1.22) | x 72.5, 245 x 245 (1.0) | width: 244px; aspect-ratio: 244 / 200; margin-left: auto |
| mosaic | image 5 | `guidelines-feature_figure` | x, w x h, aspect | x 20, 350 x 480 (0.729) | x 16, 358 x 447.5 (0.8) | margin-inline: 20px; aspect-ratio: 350 / 480 |
| mosaic | image numbers 01 to 05 | `timeline-scatter-images` figure | present | 28/30 centred label in each image | absent | add numbered label or confirm they are placeholder only |
| mosaic | captions | `timeline-scatter-images_caption`, `guidelines-feature_caption` | font-size / lh / ls / inset | 12 / 18 / -0.36, left 16, bottom 16 | 16 / 19.2 / -0.48, left 20, bottom 20 | font-size: 0.75rem; line-height: 1.125rem; letter-spacing: -0.03em; inset 16px |
| mosaic | section pad | `section_timeline-scatter-images` | top / bottom | 64 / 64 | 40 / 40 | padding-block: 4rem |
| mosaic | z-order | all | overlap | none | none | match |
| form | section | `section_form-split-script-contact` | height | 1020.8 | 1046.8 | result |
| form | title | `text-style-script` in `form-split-script-contact_header is-rotated` | y in section, box | 64, x 35 w 320 | 14.9, x 14.5 w 323.6 (overlaps section above by 25) | remove negative offset: margin-top so title top = 64 |
| form | group headings | `heading-style-h4` | font-size / lh / ls | 20 / 27 / -1 | 20 / 24 / normal | line-height: 27px; letter-spacing: -0.05em |
| form | heading to first field | `form-split-script-contact_input` | gap | 51 | 56 | margin-top: 3.2rem |
| form | group 1 to group 2 | group heading | gap | 64 | 91 | row-gap: 4rem |
| form | last field to button | `input.button.is-chamfer.is-dark` | gap | 56 | 86 | margin-top: 3.5rem |
| form | submit button | same | w x h, label | 217 x 36, 14/18/-0.7, left | 252.1 x 37, 16/16/normal | label font-size: 0.875rem; min-height: 36px |
| form | fields | `form-split-script-contact_input` | h, pitch | 26, 50 | 26, 50 | match |
| FAQ | eyebrow, title, gap | `section_faq-accordion` | see rooms-collection | 12 / 28 | 18 / 30 | same fixes |

Count: 33 issues.

## Fixes by class family

| class or combo | property | current -> target | pages affected | shared-component risk |
|---|---|---|---|---|
| `.button` (`is-chamfer`, `is-outline`, `is-outline-light`, `is-fill`, `is-dark`) and `.offers-slider-split_button`, `.venue-card-fullbleed_footer .button` | label font-size / line-height / letter-spacing | 16px / 16px / normal -> 14px / 18px / -0.7px (-0.05em) | all four, every CTA | High: global button, check every page; also fixes width (191.4 -> 168) |
| same | height | 37px -> 36px | all | same |
| `.section_faq-accordion` eyebrow `p` | font-size / line-height / letter-spacing | 18 / 21.6 / -0.54 -> 12 / 18 / -0.36 | all four | Component used on every FAQ page |
| `.section_faq-accordion h2` | font-size / letter-spacing / gap above | 30 / -1.5 / 16 -> 28 / -1.4 / 12 | all four | same |
| `.offers-slider-split_controls`, `_arrow` | height / arrow hit area / svg | 14px / 30x14 -> 36px / 36x36 / 24x18 | rooms, wellness, rooms-individual | Offers slider component, all pages using it |
| `.offers-slider-split_slider` on `/rooms` | Swiper init | not initialised -> initialised | rooms | JS order with `roomsQuiz` |
| `.text-style-script.is-large` inside `script-intro-centered_heading` | font-size / line-height | 28 / 33.6 -> rooms 56 / 67 ; room 56.4 / 67.7 ; guidelines 26.9 / 32.3 | rooms, rooms-individual, guidelines | Shared by home/history intros: scope with page or combo class |
| `.script-intro-centered_paragraph`, `_image` | margin-top, size | 27.8 / 64 / 128px -> 32 / 32 / 134.9px | rooms | Used by other intro pages; page combo |
| `.rooms-collection-quiz_*` | counter, title, buttons, link, min-height | see rooms table | rooms | Page-only, low |
| `.rooms-collection-quiz_figure` | display | block -> none (or confirm) | rooms | Page-only |
| `.rooms-collection-recommendations_*` | title, gap, links layout, label | see rooms table | rooms | Page-only |
| `.rooms-collection-room-grid_*` | card aspect 390/540, inset 24, gap 2, meta icons, bottom pad 32 | see rooms table | rooms | Page-only (CMS list) |
| `.map-feature_*` and its `.text-style-script` | heading 44.4/44.4, top pad 96, copy 2 lines, map gap 24, bottom 0 | see rooms table | rooms, rooms-individual | Component shared with neighborhood; scope via page |
| `.section_hero-fullbleed-centered` | height | 800 -> 660 | guidelines only | Page combo, others stay 800 |
| `.tab-pills-intro_*`, `.venue-card-fullbleed_*` | intro padding 160, panel title 28, copy 16/20, gaps, start clip 265 x 193 | see wellness table | wellness (venue-card also on rooms-individual media) | Venue-card pinned component is shared with dining and rooms-individual; use `is-media` / `is-media-center` combos |
| `.venue-card-fullbleed_stage.is-media-center.is-bleed` | settled height / start clip / caption | 844 -> 612; 311 x 457 chamfer -> 316 x 213 rect; 18/21.6 -> 14/16.8 | rooms-individual | Combo-scoped |
| `.script-intro-centered_back-link` / `_back-icon` | y, label lh, icon | 122 / 19.2 / 12px -> 48 / 12 / 24x18 | rooms-individual | Page-only |
| `.rooms-individual-description_*` | heading 20/27/-1, gap 24, lh 20, link order and size, row pitch 49 | see room table | rooms-individual | Page-only |
| `.section_split-image-text-light` (two variants) | image sizes, order, gaps 96, padding 120 | see room table | rooms-individual | Component shared; needs two distinct variants (04 right small + left big, 06 left + full) |
| `.rooms-individual-amenities_*` | alignment left, 14/16.8/-0.42, dividers, paddings | see room table | rooms-individual | Page-only |
| `.gallery-mosaic-captioned_*` | image heights 612/480/480/480, title 28, caption 14/16.8 | see room table | rooms-individual (check meetings) | Shared with other gallery pages, scope with page combo |
| `.card-carousel-header-left` (variant `w-variant-c59c...`) | padding-top 96, label letter-spacing -0.05em | 64 / -0.6 -> 96 / -1 | rooms-individual | Shared carousel |
| `.guidelines-process_*` | heading 28/-1.4, 16/20 copy, 8px indent removed, gaps 96 | see guidelines table | guidelines | Page-only |
| `.timeline-scatter-images_*`, `.guidelines-feature_*` | image widths, aspects, offsets, gaps 120, captions 12/18, heading 24 left | see guidelines table | guidelines | Page-only |
| `.form-split-script-contact_*` | title y, row gaps 64 / 56, heading lh 27, button 36 | see guidelines table | guidelines (also contact page variants) | Component shared; scope with `is-contact` combos |

## Summary counts

rooms-collection 39, rooms-individual 33, wellness-collection 15, guidelines 33 (hero, FAQ, offers, map repeats counted once per page).
