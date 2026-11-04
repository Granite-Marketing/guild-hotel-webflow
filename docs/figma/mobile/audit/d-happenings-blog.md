# Mobile audit D: happenings-collection, blog-collection, happenings-indiv, blog-indiv (390px)

Figma: `figma/mobile/nodes.json.gz` frames 27:4456 (happenings-collection), 27:4772 (blog-collection), 27:5350 (happenings-indiv), 27:5615 (blog-indiv). Live: staging /happenings, /blog, /happenings-stories/locals-night-at-rodeo-bar, /happenings-stories/best-san-diego-hotels-for-every-traveler, Playwright chrome 390x844, scrolled once, settled state. All y values are document px; "Figma" values are relative to the frame. Skipped: global nav, CTA newsletter, footer. Images are plain rectangles in both (no chamfer) on all four pages; only buttons and the category pill are chamfered, and those match.

Content-only differences (not styling, ignored): Figma shows 5 stories (3 dining, 2 culture), live CMS has 1 to 2 per topic; Figma carousel has 3 cards, live has 6 slides; offers counter 02/05 vs 01/05; hero and title copy.

Offers, More of the Guild and FAQ are shared blocks. Measured on happenings-collection; blog-collection, happenings-indiv and blog-indiv carry the same values (spot-checked: button 191.4x37, arrows 30x14, labels -0.6px on all four).

## happenings-collection (Figma 390x8394, live 390x7309)

Order matches Figma: hero, intro + pill, stories, offers, more of the guild, faq.

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | CTA "book" | `section_hero-fullbleed-centered` (absent) | element | 140x36 chamfer button, icon 24x18 + label 14/18/-0.7, x125 y732 (overlaps description in Figma) | not rendered | low: Figma overlap looks like an unused slot; confirm with Stephen, otherwise add below description |
| intro | heading | `tab-pills-intro_heading` `text-style-script` `is-large` | font-size | 56px | 32px | font-size: 56px |
| intro | heading | same | line-height | 67.2px | 38.4px | line-height: 67.2px |
| intro | heading box | same | height | 174px (x30 w330, 2 lines) | 76.8px (x105 w180) | min-height: 174px; width 330 |
| intro | pill y | `tab-pills-intro_frame` / `_tabs` | y | 1224 (424 below section top) | 1128.8 (328.8) | follows from the heading fix (+97.2 gives 1226) |
| intro to stories | gap pill bottom to first group label | `tab-pills-intro_stage` + `article-card-staggered_header.is-group` | gap | 42px | 80px (stage pad-bottom 40 + section pad-top 16 + header pad-top 24) | `tab-pills-intro_stage` padding-bottom: 2px |
| stories | group label | `article-card-staggered_header` > `h2.heading-style-h4` | font-size / line-height / letter-spacing | 24px / 26.4px / -1.2px | 20px / 24px / normal | font-size: 24px; line-height: 26.4px; letter-spacing: -1.2px |
| stories | label to image gap | `article-card-staggered_component` pad-top 32 | gap | 24px | 32px | `article-card-staggered_header.is-group` margin-bottom: -8px |
| stories | card title | `article-card-staggered_content` > `h3.text-style-eyebrow-caps` | font-size / line-height / letter-spacing | 14px / 16.8px / -0.42px | 18px / 21.6px / -0.54px | font-size: 14px; line-height: 16.8px; letter-spacing: -0.42px |
| stories | gap last card to next group label | `section_article-card-staggered` (pad 16) + header pad-top 24 + card pad-bottom 32 | gap | 120px | 88px | `section_article-card-staggered` padding-bottom: 48px |
| stories | card image | `article-card-staggered_figure` `u-image` | size, aspect, shape | 305x200, 1.525, plain rect | 305x200, 1.525, plain rect | ok |
| stories | stagger x | `article-card-staggered_component` | x | 20 / 65 alternating, labels follow first card | same | ok |
| stories | card to card gap | same | gap | 96px | 96px | ok |
| stories | description | `article-card-staggered_text` p | size, width | 16/20, w244 | 16/20, w244 | ok |
| offers | eyebrow, heading, image | `offers-slider-split_overlay/_heading/_figure` | y, size | 80 / 114 / 182 from top, image 350x390 | identical | ok |
| offers | CTA | `offers-slider-split_button` | label | 14px / 18px / -0.7px with 24x18 arrow icon left of label | 16px / 16px / normal, no icon | font-size: 14px; letter-spacing: -0.7px; line-height: 18px; add arrow icon |
| offers | CTA | same | size | 168x36 | 191.4x37 | follows from label size; padding to land 168x36 |
| offers | arrows | `offers-slider-split_arrow` | size | 36x36 hit area, icon 24x18 | 30x14 | width: 36px; height: 36px |
| offers | pagination row | `offers-slider-split_controls` | width, gap | 196px (x97 to 293), gap arrow to counter 16px | 178.9px (x105.5 to 284.4), gap 20px | gap: 16px; follows arrow size |
| offers | section height | `section_offers-slider-split` | height | 804px | 783px | follows arrow height (+22 gives 805) |
| more of the guild | card label | `card-carousel-header-left_label` | letter-spacing | -1px | -0.6px | letter-spacing: -1px |
| more of the guild | section height | `section_card-carousel-header-left` | height | 836px (slider viewport 508) | 812px (slider 484) | `card-carousel-header-left_slider` padding-bottom: 24px |
| more of the guild | cards, heading, text | same | x, w, h, gap | 310 wide, heights 437/307/403, gap 20, heading 28/28/-1.4, text 16/20 | identical | ok |
| faq | eyebrow | `faq-accordion_header` > `text-style-eyebrow-caps` | font-size / line-height / letter-spacing | 12px / 18px / -0.36px | 18px / 21.6px / -0.54px | font-size: 12px; line-height: 18px; letter-spacing: -0.36px |
| faq | title | `faq-accordion_header` > `h2.heading-style-h2` | font-size / line-height / letter-spacing | 28px / 28px / -1.4px | 30px / 30px / -1.5px | font-size: 28px; line-height: 28px; letter-spacing: -1.4px |
| faq | eyebrow to title | `faq-accordion_header` gap | gap | eyebrow top to title top 30px | 37.6px | gap: 12px |
| faq | chevron | `accordion_icon` | x | glyph 10x5 at x346 to 356 (centre 351) | 24x24 box at x346, glyph centred at 358 | glyph centre 7px left (icon box width 10 or padding-right 14) |
| faq | question, answer, row pitch | `accordion_question` / `accordion_content` | size | 18/21.6, 16/20, pitch 113 | identical | ok |

Issue count: 21 rows with a fix (2 low confidence: hero CTA slot, chevron offset).

## blog-collection (Figma 390x8392, live 390x7542)

Same structure and same rows as happenings-collection, with these differences. Everything not listed below is identical to the table above (including all stories, offers, guild and faq rows).

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | title | `hero-fullbleed-centered_heading` | y, size | "blog" 28/30/-1.4 at y674, desc y728 | identical | ok |
| intro | heading | `tab-pills-intro_heading` | font-size / line-height | 54.66px / 65.6px (box x28 w334 h172) | 32px / 38.4px | font-size: 56px; line-height: 67.2px (Figma happenings uses 56/67.2; the 54.66 here is a Figma scaling slip, one class serves both) |
| intro | heading box | same | height | 172px | 76.8px | min-height: 174px |
| stories | group sections | `section_article-card-staggered` x3 (dining, culture, conferences) | structure | one stagger sequence across all groups | each group is its own section, alternating start x (20, 65, 20) | ok visually; parity relies on the group count, so an empty group must stay `display: none` (it is, via the empty-group embed) |

Issue count: 20 (the happenings-collection set, with the intro heading values at 54.66 vs 56).

## happenings-indiv (Figma 390x6771, live 390x6753)

Order matches Figma: hero, article, more around town, more of the guild, offers.

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| hero | topic eyebrow | `hero-fullbleed-centered_header` > `text-style-eyebrow-caps` | element | absent | "dining" 18/21.6/-0.54 at y598.5 above the title | display: none below 768px (title still lands at 644 as in Figma) |
| hero | title, desc | `hero-fullbleed-centered_heading/_text` | y, size | y644 h60, desc y728, 28/30/-1.4, 16/20 | identical | ok |
| hero | CTA "book" | absent | element | 140x36 at y732 (overlaps description) | not rendered | low, see happenings-collection |
| article | section top padding | `section_article-body` > `padding-global.padding-section-large` | padding-top | 120px (title y920) | 40px (title y840) | padding-top: 120px |
| article | date eyebrow | `article-body_eyebrow` | element | absent | "November 6, 2026" 20/24 at y891 | display: none below 768px |
| article | title to body gap | `article-body_component` | gap | 24px (title 920, body 988) | 40px | gap: 24px |
| article | body copy | `article-body_rich-text` p | font-size / line-height | 16px / 20px | 18px / 23.4px | font-size: 16px; line-height: 20px |
| article | button | `article-body_footer` `a.button.is-burgundy` | label, size | 160x36, label 14/18/-0.7, centred at x115 (overlaps text in Figma) | 159.1x37, label 16px | label 14px / -0.7px, see offers CTA; overlap is a Figma artefact |
| article | copy to image 1 gap | `article-body` pad-bottom 40 + `section_image-inset-single` pad 16 | gap | 96px | 56px (button bottom 1328.5 to image 1384.5) | `section_image-inset-single` padding-top: 56px |
| article | image 1 | `image-inset-single_figure` (variant ed48680f, Small) + `u-image` | size, aspect | 244x200 (1.22), x20 left aligned | 350x246.5 (1.42), x20 | width: 244px; aspect-ratio: 244 / 200 (aspect is 16% off) |
| article | image 1 to text | `section_image-inset-single` to `split-image-text-light_body` | gap | 96px, text sits between the two images | image 2 follows image 1 at 48px, text after both | reorder (see next row) |
| article | image 2 and text order | `section_split-image-text-light` (variant a6df7398) | stacking order | image 1, text, image 2 | image 1, image 2, text | `split-image-text-light_component` flex-direction: column-reverse (text above image) |
| article | image 2 | `split-image-text-light_media` + `u-image` | size, x | 244x200, x126 to 370 (right aligned) | 350x246.5, x20 | width: 244px; margin-left: auto; aspect-ratio: 244 / 200 |
| article | text, image 2, heading gaps | `split-image-text-light_component` gap 32; section pad 40 and margin -8 | gap | 96 (image 1 to text), 96 (text to image 2), 120 (image 2 to heading) | 32 (image to text), 32 (text to next section) | gap: 96px; `section_split-image-text-light` padding-bottom: 88px |
| article | image caption | `Optional image caption` | element | "@username" 12/18/-0.36, x+16, inside bottom of image (hidden in render) | absent | low: only add if the CMS has a caption field |
| more around town | heading | `split-card-pair-captioned_header` > `h2.heading-style-h2` | font-size / line-height / letter-spacing | 28px / 28px / -1.4px | 30px / 30px / -1.5px | font-size: 28px; line-height: 28px; letter-spacing: -1.4px |
| more around town | heading to cards | `split-card-pair-captioned_header` | gap | 32px below heading (cards at +60 from heading top) | 40px (cards at +70) | padding-bottom: 32px |
| more around town | card | `split-card-pair-captioned_card` | size | 390x435 (0.8966), flush, no gap | 390x438.8 (ar 8/9), flush | aspect-ratio: 390 / 435 (3.8px, under threshold, optional) |
| more around town | card title | `split-card-pair-captioned_title` | font-size / line-height / letter-spacing / inset | 20px / 27px / -1px, x24, bottom inset 32 | 24px / 24px / -1.2px, x20, bottom inset 20 | font-size: 20px; line-height: 27px; letter-spacing: -1px; padding-inline: 24px; bottom: 32px |
| more of the guild | label, section height | shared, see happenings-collection | letter-spacing, height | -1px, 836 | -0.6px, 812 | same fixes |
| offers | CTA, arrows, controls, section height | shared, see happenings-collection | see above | 168x36, 36x36, 196 row, 804 | 191.4x37, 30x14, 178.9, 783 | same fixes |

Issue count: 20 rows with a fix (2 optional or low: hero CTA slot, image caption; 1 within tolerance: card aspect).

## blog-indiv (Figma 390x6771, live 390x6706)

Identical to happenings-indiv in Figma (same placeholders) and live (same classes and values), with these differences.

| block | element | live class | property | Figma | live | fix (below 768px) |
|---|---|---|---|---|---|---|
| more around town | heading | `split-card-pair-captioned_header` > `h2.heading-style-h2` | text-align, x | left, x20 w350 (blog-indiv only) | center | text-align: left; padding-left: 20px; blog-indiv only, but Figma happenings-indiv is centred, so this needs a decision (shared class, two designs) |
| hero | eyebrow, title wrap | `hero-fullbleed-centered_header` | content | title 2 lines at y644 | eyebrow plus 3-line title (89.9px) pushes title to y594 | hide eyebrow as above; the 3-line wrap is CMS copy length |
| article | whole block | as happenings-indiv | all | as happenings-indiv | as happenings-indiv | same fixes (live article is 521.7px tall, copy shorter) |

Issue count: 21 (the happenings-indiv set plus the heading alignment).

## Fixes by class family

| class or combo | property | current -> target | pages affected | shared-component risk |
|---|---|---|---|---|
| `tab-pills-intro_heading` (`text-style-script` `is-large`) | font-size, line-height, min-height | 32px, 38.4px, auto -> 56px, 67.2px, 174px | happenings, blog | press also uses `section_tab-pills-intro`; press Figma intro is 53px script, so scope with a page-level combo or verify press first |
| `tab-pills-intro_stage` | padding-bottom | 40px -> 2px | happenings, blog | press (same section); check press stack spacing |
| `article-card-staggered_header.is-group` > `h2.heading-style-h4` | font-size, line-height, letter-spacing, margin-bottom | 20px, 24px, normal, 0 -> 24px, 26.4px, -1.2px, -8px | happenings, blog | press uses it (labels "press" and "design" are 24px in Figma too, so likely a fix there as well) |
| `article-card-staggered_content` `h3.text-style-eyebrow-caps` | font-size, line-height, letter-spacing | 18px, 21.6px, -0.54px -> 14px, 16.8px, -0.42px | happenings, blog | press; `text-style-eyebrow-caps` is also the footer heading and FAQ eyebrow, so target the descendant combo only |
| `section_article-card-staggered` | padding-bottom | 16px -> 48px | happenings, blog | press |
| `hero-fullbleed-centered_header` > `text-style-eyebrow-caps` | display | block -> none | happenings-indiv, blog-indiv | other pages with a hero eyebrow (dining, rooms) keep it; use a page-scoped combo |
| `section_article-body` `padding-global.padding-section-large` | padding-top | 40px -> 120px | indiv pages | legal and corporate templates may reuse `section_article-body`; check |
| `article-body_eyebrow` | display | block -> none | indiv pages | none known |
| `article-body_component` | gap | 40px -> 24px | indiv pages | as above |
| `article-body_rich-text` p | font-size, line-height | 18px, 23.4px -> 16px, 20px | indiv pages | as above |
| `section_image-inset-single` (Small variant) `image-inset-single_figure` | width, aspect-ratio, padding-top | 350, 744 / 524, 16px -> 244px, 244 / 200, 56px | indiv pages | Small variant only; other pages use the default variant |
| `section_split-image-text-light` (variant a6df7398) | flex-direction, media width and margin-left, gap, padding-bottom | column, 350, 0, 32, 40 -> column-reverse, 244, auto, 96, 88 | indiv pages | the variant is used on other templates; confirm the variant is indiv-only |
| `split-card-pair-captioned_header` h2 | font-size, line-height, letter-spacing, padding-bottom, text-align | 30px, 30px, -1.5px, 40px, center -> 28px, 28px, -1.4px, 32px, center (left on blog-indiv) | indiv pages (plus any page using the section) | shared `heading-style-h2`, so change only the descendant combo |
| `split-card-pair-captioned_title` | font-size, line-height, letter-spacing, inset | 24px, 24px, -1.2px, 20 / 20 -> 20px, 27px, -1px, 24 / 32 | indiv pages | none known |
| `offers-slider-split_button` | font-size, letter-spacing, line-height, icon | 16px, normal, 16px, none -> 14px, -0.7px, 18px, 24x18 arrow | all four pages | all `a.button.is-chamfer` labels are 16px vs Figma 14px (article-body button too), so this is a global `button` label token; high blast radius, change once and re-check every page |
| `offers-slider-split_arrow`, `_controls` | width, height, gap | 30x14, 20px -> 36x36, 16px | all four pages | homepage and other pages with the offers slider |
| `card-carousel-header-left_label` | letter-spacing | -0.6px -> -1px | all four pages | every page with the carousel |
| `card-carousel-header-left_slider` | padding-bottom | 0 -> 24px | all four pages | every page with the carousel |
| `faq-accordion_header` `text-style-eyebrow-caps` | font-size, line-height, letter-spacing, gap | 18px, 21.6px, -0.54px, 16px -> 12px, 18px, -0.36px, 12px | happenings, blog | every FAQ page; descendant combo only |
| `faq-accordion_header` h2 | font-size, line-height, letter-spacing | 30px, 30px, -1.5px -> 28px, 28px, -1.4px | happenings, blog | every FAQ page |
| `accordion_icon` | glyph position | centre x358 -> x351 | happenings, blog | every accordion |

## Images

`docs/figma/mobile/audit/img/`: `happenings-collection-1-intro-cards`, `happenings-collection-2-offers-cta`, `happenings-indiv-1-article`, `happenings-indiv-2-around-town` (each `-figma.jpg` and `-live.jpg`). blog pages repeat the same layouts, so no extra crops.
