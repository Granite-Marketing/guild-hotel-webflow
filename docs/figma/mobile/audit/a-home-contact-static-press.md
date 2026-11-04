# Mobile audit A: home, contact, static-template (privacy-policy), press (390px)

Sources: Figma `figma/mobile/nodes.json.gz` (frames 557:14491 home, 27:7672 contact, 27:5158 static, 25:3216 press; coords relative to frame, px). Live: staging, Playwright chrome 390x844, slow scroll pass, then getBoundingClientRect in document coords at scrollY 0 (GSAP word/logo translate offsets removed where noted). All fixes are below-768px values. Images: `img/<page>-<n>-figma.jpg` and `-live.jpg` (home-1..14, press-1..5, contact-1..4, static-1; home-4 and home-5 are viewport shots of the pinned dining stage).

Conventions: "h" height, "pad" padding, fs/lh/ls = font-size/line-height/letter-spacing. Figma buttons are all 14/18, ls -0.7px, 36px high, 25px side padding. Live buttons are 16/16, ls 0, 37px high, 24px padding, except the hero button (14px).

Figma facts the page frame tells us that the live build ignores (read before the tables):
- Home Art & Stories in the page frame has 4 inset tiles (160x228) inside the 350x852 backdrop. Live renders the 7-tile bleeding trail that matches state frame `557:16298` ("2"). See home-10.
- Home Retail and Offers sections show a pagination row (arrows 36x36 plus "02 / 05"). Live hides it on home (`offers-slider-split_controls.hide`), shows it on press at a different size.
- Dining thumbnail before the pin is a 265x193 landscape chamfer 48px under the heading. Live starts from a 311x458 portrait mask 193px under the heading.

---

## Global blocks (measured on home)

| Block | Element | Live class | Property | Figma | Live | Fix (below 768px) |
|---|---|---|---|---|---|---|
| G1 nav bar | bar | `site-nav_bar` | height | 64 total (12 pad + 40 + 12), items centred at y32 | 56, items centred at y28 | height 64px; items centre y32 (padding 12px 20px, inner 40px) |
| G2 nav | menu icon | `site-nav_toggle` / `site-nav_icon` svg | size, x, y | 22x10 lines (x27, y27), 36px hit target at x20 | 28x12 at x20 y22 | svg 22x10; hit area 36x36 at x20, glyph offset 7px from hit edge |
| G3 nav | wordmark | `site-nav_logo` svg | size, x, y | 186x12 at x102 y26 | 192x13 at x99 y22 | width 186px, height 12px, centred, top = 26px |
| G4 nav | moon icon | `site-nav_mode` svg | size, x, y | 12x12 at x320 y26 | 16x16 at x317 y20 | 12x12, x320, vertically centred in 64px bar |
| G5 nav | sun icon | `site-nav_mode.is-active` svg | size, x, y | 14x14 at x355 y25 | 16x16 at x354 y20 | 14x14, x355 |
| G6 nav | divider | `site-nav_modes-divider` | x, height | x344, h16, 0.5px | x343, h16, 1px | x344, width 0.5px |
| G7 cta-booking-newsletter | lettering "Book your escape" | `cta-booking-newsletter_header` h2 `text-style-script` | size | 300x68 image lettering at x45 | 287x53 text, 44px/52.8 | header height 68px (script 44px stays; add 15px block height or swap to the Figma lettering asset) |
| G8 cta | lettering "Stay in the loop" | same | size | 300x73 | 267x53 | header height 73px |
| G9 cta | book now button position | `cta-booking-newsletter_actions` | y from block top | +92 (lettering 68 + gap 24) | +77 | follows G7 (+15px) |
| G10 cta | email field | `cta-booking-newsletter_input` | height | 26 | 37 (pad 8/0/12) | height 26px, padding-bottom 0 |
| G11 cta | column 1 to column 2 | `cta-booking-newsletter_columns` | block height | 128 (68+24+36) | 114 | follows G7; gap stays 96px |
| G12 cta | button font and width | `button.is-chamfer.is-text-burgundy` | fs/lh/ls, h, label colour | 14/18, -0.7px, 36h, label #262118 | 16/16, 0, 37h, label #4a1217 | 14px/18px, ls -0.7px, height 36px, label colour #262118 |
| G13 cta | Bonvoy line | `.text-style-caption-tracked` in `cta-booking-newsletter_brand` | fs/lh/ls | 12/18, ls 0.6px, 2 lines (h36) | 14/14, ls 0.7px (h28) | 12px/18px, ls 0.6px |
| G14 cta | Bonvoy logo | `cta-booking-newsletter_logo-wrapper` | size | 160x46 | 160x47 | none (within 4px) |
| G15 footer-links | link lists | `footer-links_list-item` (Hotel col) | item count | 8 (rooms to contact) | 9 (adds "blog") | content: remove "blog" or confirm with design |
| G16 footer-links | experience list | `footer-links_list-item` | item count | 7 | 8 (adds "happenings") | content: remove "happenings" or confirm |
| G17 footer-links | dining list | `footer-links_list.w-dyn-items` | order and items | zuma, lobby bar, lobby terrace, pool lounge, in-room dining | solana coffee, pool lounge, lobby bar, garden terrace, zuma, in-room dining | CMS sort: zuma first; Solana Coffee not in Figma list (content) |
| G18 footer-links | link pitch | `footer-links_link` | height | 36, gap 8 (pitch 44) | 35.6, gap 8 (pitch 43.6) | min-height 36px (accumulates 3px over 8 rows, minor) |
| G19 footer-links | copyright and credit | `footer-links_text.text-style-caption` | fs/lh | 12/18 | 14/15 | 12px/18px, fw 400 |
| G20 footer-links | copyright to credit pitch | `footer-links_legal`, `footer-links_credit` | pitch | 42 (18+24) | 39 (15+24) | follows G19 |
| G21 footer-links | column headings, links, logo | `footer-links_column-heading`, `_link`, `_logo` | fs, size | 18/21.6, 13/15.6 ls 0.65, 270x56 | same | none (matches) |

Static page footer in Figma uses compact CTA buttons (Book now 128 wide, Join us 110 wide, centred) where home uses 350 full width. Home is canonical here; the static Figma frame is inconsistent, no change.

---

## Home

| Block | Element | Live class | Property | Figma | Live | Fix (below 768px) |
|---|---|---|---|---|---|---|
| 1 hero | CTA label | `hero-fullbleed-centered_button` | label and width | "book", 140x36 | "book your stay", 170x36 | content label to "book" (width 140) or accept; font ok (14/18 ls -0.7) |
| 1 hero | nav overlay | see G1-G6 | | | | see G1-G6 |
| 2 script-intro | section padding | `section_script-intro-centered` / `padding-section-xlarge` + `_component` | pad-top, pad-bottom | 160 / 160 | 120 (80+40) / 120 | padding-top 160px, padding-bottom 160px (section 772 high) |
| 2 | script image | `script-intro-centered_image` | size | 280x161 | 272x157 | width 280px, height 161px |
| 2 | script heading | `script-intro-centered_heading.text-style-script.is-large` | fs/lh | 31.3/37.6, rotate -7.4deg | 28/33.6, rotate -7.4deg | font-size 31px, line-height 37.6px |
| 2 | heading to paragraph | `script-intro-centered_text` | y offset from section top | +532 | +440 | follows padding fix (+40 top) and fs (+8) |
| 3 west-coast | section pad | `section_split-image-text-light` / `padding-section-large` | pad-top, pad-bottom | 64 / 96 | 40 / 40 | padding-top 64px, padding-bottom 96px |
| 3 | media to content gap | `split-image-text-light_component` | gap | 64 | 32 | gap 64px |
| 3 | title | `split-image-text-light_heading.heading-style-h4` | fs/lh/ls, h | 24/26.4, -1.2px, h52 | 20/24, normal, h48 | font-size 24px, line-height 26.4px, letter-spacing -1.2px |
| 3 | link | `button.is-link.text-style-caps-caption-16` | fs/lh/ls, h | 14/18, -0.7px, h36 | 16/16, -0.48px, h24 | 14px/18px, ls -0.7px, min-height 36px |
| 3 | media | `split-image-text-light_media` | size, aspect | 350x450 | 350x450 | none |
| 4 dining intro | heading | `venue-card-fullbleed_intro h2.heading-style-h4` | fs/lh/ls, x, w | 24/26.4, -1.2px, x20 w350 | 20/24, normal, x32 w326 | font-size 24px, lh 26.4px, ls -1.2px; intro padding-inline 20px |
| 4 | heading top | `venue-card-fullbleed_intro.u-top-increased` | pad-top | 120 | 112 | padding-top 120px |
| 4 | heading to thumbnail | `venue-card-fullbleed_intro` bottom to media | gap | 48 (heading bottom 2658, thumb 2706) | 193 (mask top at media top + 193) | start clip top inset 48px (not 193px), see next row |
| 4 | thumbnail size and shape | `venue-card-fullbleed_media.is-media-center` clip-path | visible box | 265x193 landscape (aspect 1.37) chamfer ~12px, x62 | 311x458 portrait (aspect 0.68), chamfer 16px, x39 | start polygon: left/right inset 62.5px, top inset 48px, bottom inset 603px (844-48-193), chamfer 12px |
| 4 | space below thumb | stage | gap | 24 pad then card | thumb is mid-stage, 235px blank below it | stage pinned only after thumb reaches viewport; gap below thumb 24px |
| 5 dining cards | card order | `venue-card-fullbleed_item` (CMS) | order | Zuma, Lobby Bar, Pool Lounge, Garden Terrace, Solana | Zuma, Lobby Bar, Garden Terrace, Pool Lounge, Solana | CMS: swap Garden Terrace and Pool Lounge |
| 5 | description | `venue-card-fullbleed_text.text-size-large` | fs/lh, w | 16/20, w310 | 18/28.8, w277 (Zuma) w220 (Lobby) | font-size 16px, line-height 20px, max-width 310px |
| 5 | header to button gap | `venue-card-fullbleed_header` / `_footer` | gap | logo to text 32, text to button 24 | 24, 32 | header gap 32px, footer margin-top 24px |
| 5 | Zuma logo | `venue-card-fullbleed_logo-wrapper` | size | 240x58 | 240x58 | none |
| 5 | Lobby Bar logo | `venue-card-fullbleed_logo-wrapper` | size | 280x88 | 240x76 | width 280px (aspect 3.18 kept) |
| 5 | Pool Lounge logo | same | size | 280x61 | 240x52 | width 280px |
| 5 | Garden Terrace and Solana title | `h3.heading-style-display` | fs/lh/ls, lines | 28/28, -1.4px, single line | 40/40, normal, 2 lines | font-size 28px, line-height 28px, ls -1.4px |
| 5 | button | `button.is-chamfer` | fs/lh/ls, w | 14/18 -0.7px, 168x36 | 16/16 0, 191x37 | G12 pattern: 14px/18px, -0.7px, 36px |
| 5 | block vertical position | content block top | y in 844 card | Zuma +335, Lobby +322, Pool +326, Garden +342 | Zuma +318, Lobby +309, Garden +307 | follows type fixes, keep centred |
| 6 wellness | section pad | `section_image-trio-text` / `padding-section-large` | pad-top, pad-bottom | 96 / 96 | 40 / 40 | padding-block 96px (section 928) |
| 6 | alignment | `image-trio-text_header`, `_heading`, `_paragraph` | text-align | left | center | text-align left; header align-items start |
| 6 | title | `image-trio-text_heading.heading-style-h3` | fs/lh/ls | 28/28, -1.4px | 24/24, -1.2px | font-size 28px, lh 28px, ls -1.4px |
| 6 | link | `image-trio-text_link.text-style-eyebrow-caps` | fs/lh/ls, align, h | 14/18, -0.7px, left, 36 hit | 18/21.6, -0.54px, centred, 22 | 14px/18px, ls -0.7px, align left, min-height 36px |
| 6 | spacing | desc to link, link to gallery | gaps | 24, 36 | 32, 32 | header gap 24px, link to list 36px |
| 6 | gallery slides | `image-trio-text_item` | size, aspect | 350x440 (0.795) | 350x441 (0.794) | none |
| 6 | progress bar fill | `image-trio-text_progress-fill` | width | 128 (of 350) | 117 | none (1/3 of track is 117; Figma 128 is a design placeholder) |
| 7 rooms | content position | `venue-card-fullbleed_content` (is-tall) | vertical alignment | bottom anchored: block ends 48 above bottom | centred (block top +249, bottom gap 250) | justify-content flex-end, padding 64px 20px 48px |
| 7 | section height | `venue-card-fullbleed_stage.is-tall` | h | 736 | 720 | min-height 736px |
| 7 | heading | `h2.heading-style-h1` | fs/lh/ls, lines | 28/28, -1.4px, 1 line | 40/40, normal, 2 lines | font-size 28px, line-height 28px, ls -1.4px |
| 7 | heading to text, text to button | `venue-card-fullbleed_header.is-tall` | gap | 24, 24 | 32, 32 | header gap 24px, footer gap 24px |
| 7 | button | `button.is-chamfer.is-outline-light` | size | 160x36, 14/18 | 182x37, 16/16 | G12 pattern |
| 8 neighborhood | section pad | `section_map-feature` / `padding-section-large` | pad-top, pad-bottom | 96 / 11 (map ends 11px above section end) | 40 / 40 | padding-top 96px, padding-bottom 11px |
| 8 | script heading | `map-feature_header h2.text-style-script.is-large` | fs/lh | 44.4/44.4, rotated | 32/38.4, rotated | font-size 44px, line-height 44px |
| 8 | spacing | heading to text, button to map | gaps | 24, 24 | ~9 (rotated box), 32 | component gap 24px; button to map 24px |
| 8 | map image | `map-feature_image` | size | 552x559 at x-81 | 552x559 at x-81 | none |
| 8 | button | `button.is-chamfer.is-outline` | size | 168x36 | 191x37 | G12 pattern |
| 9 retail | controls | `offers-slider-split_controls.hide` | visibility | arrows 36x36 at x97 and x257, "02 / 05" 12/14 gap 16, y +728 | display none | show on mobile (remove `hide` below 768) |
| 9 | section pad bottom | `offers-slider-split_item` | pad-bottom | 40 (controls row sits inside) | 70, no controls | padding-bottom 40px once controls shown |
| 9 | section height | `section_offers-slider-split` | h | 804 | 763 | follows controls (+52 row, -30 pad) |
| 9 | button | `offers-slider-split_button` | size, fill | 168x36, #262118, label #b2c5d5 | 191x37, #262118, label #b2c5d5 | G12 size pattern |
| 9 | description lines | `offers-slider-split_text` | lines | 2 ("...tailors / a collection just for us.") | 1 (h20) | max-width 260px so it wraps to 2 lines (h40), then CTA offset +20 matches Figma |
| 10 art | section pad | `section_home-art-stories` | pad-top, pad-bottom | 96 / 96 | 64 / 40 | padding-top 96px, padding-bottom 96px |
| 10 | title | `home-art-stories_header h2.heading-style-h1` | fs/lh/ls | 28/28, -1.4px | 40/40, normal | font-size 28px, line-height 28px, ls -1.4px |
| 10 | subtitle | `home-art-stories_header p.text-style-eyebrow` | fs/lh/ls, h | 14/16.8, -0.42px, 2 lines h34 | 18/26.1, normal, h52 | 14px/16.8px, ls -0.42px, fw 400 |
| 10 | header to button, button to media | `home-art-stories_component` | gaps | 24, 40 | 40, 60 | header to footer gap 24px, footer to media 40px |
| 10 | button | `button.is-chamfer.is-outline` | style | filled #262118, label #f4efdf | outline (transparent, dark border) | switch to `is-dark` fill: background #262118, colour #f4efdf, no border |
| 10 | backdrop image | `home-art-stories_figure` | size, shape | 350x852 at x20, chamfer ~20 | 350x852 at x20, chamfer 20 | none |
| 10 | tiles count and position | `home-art-stories_trail-item` | tile boxes (rel. backdrop) | 4 tiles 160x228 at (46,50), (162,155), (28,443), (153,596), all inside backdrop | 7 tiles 160x228 at (-35,17), (62,115), (142,271), (230,405), (128,544), (23,658), (-57,772), 3 bleed out of the backdrop | below 768px render 4 tiles at the Figma offsets (hide items 5-7; set left/top as listed). If state frame "2" is the intended design, confirm with Stephen: live matches it exactly |
| 10 | tile corners | `home-art-stories_trail-figure` clip | chamfer | ~12 | 12 | none |
| 10 | z-order | trail items | stacking | tile 1 below tile 2; tile 3 below tile 4 | DOM order, later above | none if 4-tile layout keeps DOM order |
| 11 meetings (reworked) | section height | `venue-card-fullbleed_stage.is-left` / `_media.is-left` | h | 800 | 728 (8 stage pad + 720) | min-height 800px, remove 8px top pad |
| 11 | heading | `venue-card-fullbleed_header.is-tabs h2.heading-style-h2` | fs/lh/ls | 28/28, -1.4px | 30/30, -1.5px | font-size 28px, line-height 28px, ls -1.4px |
| 11 | heading to list | content flow | gap | 377 (list anchored to bottom) | 295 | list and button bottom-anchored: content `justify-content: space-between`, padding-bottom 40px; with 800px height the gap becomes 377px |
| 11 | list rows | `venue-card-fullbleed_list-link` | h, border | 56 + 1px dividers, rows 390 wide | 57, divider inset 20 (x20 w350) | height 56px; dividers full width: negative margin -20px each side |
| 11 | row labels | `.heading-style-h3` in list-link | fs/lh/ls | 20/27, -1px | 24/24, -1.2px | font-size 20px, line-height 27px, ls -1px |
| 11 | list to button | `venue-card-fullbleed_footer.is-tabs` | gap, size | 24, 168x36 | 23, 191x37 | button G12 pattern |
| 12 offers | section height | `section_offers-slider-split` | h | 804 | 763 | as row 9 |
| 12 | controls | `offers-slider-split_controls.hide` | visibility | arrows + "02 / 05" shown, counter cream 12/14 | hidden | as row 9 |
| 12 | button | `offers-slider-split_button` | size, label colour | 168x36, label #262118 | 191x37, label #4a1217 | G12 pattern, label colour #262118 |
| 12 | description lines | `offers-slider-split_text` | lines | 2 | 1 | as row 9 |
| 13 faq | eyebrow | `.text-style-eyebrow-caps` in `faq-accordion_header` | fs/lh/ls | 12/18, -0.36px | 18/21.6, -0.54px | font-size 12px, line-height 18px, ls -0.36px |
| 13 | title | `h2.heading-style-h2.text-weight-normal` | fs/lh/ls, weight | 28/28, -1.4px | 30/30, -1.5px, fw 400 | font-size 28px, line-height 28px, ls -1.4px |
| 13 | eyebrow to title | `faq-accordion_header` | gap | 12 | 16 | gap 12px |
| 13 | chevron | `accordion_icon` svg | size, x | 10x5 at x346 (left of 24px box) | 24x24 box at x346, glyph ~18 wide centred | svg width 10px height 5px, aligned left in the 24px box; open state uses up chevron |
| 13 | items | `accordion_item`, `accordion_question` | pitch, fs | 113 closed, 249 open, 18/21.6 | 113, 249, 18/21.6 | none |
| 13 | section height | `section_faq-accordion` | h | 1140 | 1152 | follows title/eyebrow fixes (-12px) |

Home sections with no issues beyond the global ones: hero heading and text (28/30, 16/20 match), neighborhood image, script image aspect (1.739 vs 1.736).

---

## Contact

| Block | Element | Live class | Property | Figma | Live | Fix (below 768px) |
|---|---|---|---|---|---|---|
| 1 details | page title position | `form-split-script-contact_header.is-rotated h1` | y | 184 (64 nav + 120 pad) | 112 (rotated) | section padding-top 184px; remove rotation (see next) |
| 1 | page title style | `text-style-script` h1 | fs/lh/ls, case, rotation | 28/30, -1.4px, lowercase, left, colour #29310c, no rotation | 30/30, -1.5px, uppercase, rotate -6deg, black | font-size 28px, line-height 30px, ls -1.4px, rotate 0, colour #29310c |
| 1 | title to first label | `form-split-script-contact_content` | gap | 64 | 44 | gap 64px after header |
| 1 | detail labels | `form-split-script-contact_detail-label.text-style-caps-caption-16` | fs/lh/ls, colour | 12/18, -0.36px, #2b2927 | 16/19.2, -0.48px, ink | font-size 12px, line-height 18px, ls -0.36px, colour #2b2927 |
| 1 | label to value | `form-split-script-contact_detail` | gap | 12 | 10 | gap 12px |
| 1 | value | `form-split-script-contact_detail-value` | colour | #29310c | #262118 | colour #29310c |
| 1 | group spacing | `form-split-script-contact_details` | gap | 32 | 24 | gap 32px |
| 1 | details to social | | gap | 64 | 36 | margin-top 64px |
| 1 | social links | `form-split-script-contact_links` / `_link` | layout, fs/lh | stacked, 14/20 ls 0, row gap 12 | inline row (x20, x154), 16/19.2 ls -0.48 | flex-direction column, gap 12px, font-size 14px, line-height 20px, ls 0, colour #2b2927 |
| 1 | media | `form-split-script-contact_media` | size, aspect | 350x350 (1.0), grey #b7b7b7 placeholder | 350x281 (1.247, `ar 905/726`) | aspect-ratio 1 / 1, height 350px |
| 1 | media to next section | `section_form-split-script-contact` | pad-bottom | 120 | 40 | padding-bottom 120px |
| 2 form | heading | `form-split-script-contact_fieldset-header h3.heading-style-h4` | fs/lh/ls, colour | 24/26.4, -1.2px, #2b2927 | 20/24, normal | font-size 24px, line-height 26.4px, ls -1.2px |
| 2 | heading to first field | `form-split-script-contact_fieldset` | gap | 32 | 32 | none |
| 2 | fields | `form-split-script-contact_field` | h, pitch | 26, 50 | 26, 50 | none |
| 2 | consent checkbox | `form-contact-fields_checkbox-input` | size, x | 18x18 at x20 | 16x16 at x32 | size 18px, margin-left 0 |
| 2 | consent text | `form-contact-fields_checkbox .w-form-label` | x, fs/lh, lines | x50 w320, 14/20, single text 2 lines, ink #262118, fw 400 | x60 w230, 14/15, fw 900, "privacy policy" split into a separate link line (h17) | gap 12px from box (text at x50), font-size 14px, line-height 20px, width 320px; inline the policy link in the same paragraph |
| 2 | consent to button | `form-contact-fields_footer` | gap | 56 | 24 | gap 56px |
| 2 | submit | `input.button.is-chamfer.is-dark` | size | 202x36, 14/18 -0.7px, "send your message" | 234x37, 16/16 | G12 pattern (width ~202) |
| 2 | section pad-bottom | `section_form-contact-fields` | pad-bottom | 120 | ~48 (form ends 1471, next at 1519) | padding-bottom 120px |
| 3 more of the guild | section pad | `section_card-carousel-header-left` | pad-top, pad-bottom | 56 / 56 (+24 card pad) | 96 / 64 | padding-top 56px, padding-bottom 56px; card `_link` padding-bottom 24px |
| 3 | card label | `card-carousel-header-left_label` | ls | -1px | -0.6px | letter-spacing -1px |
| 3 | cards | `card-carousel-header-left_figure` | sizes | 310x437, 310x307, 310x403, gap 20 | same | none |
| 3 | section height | | h | 788 | 812 | follows pad fix |
| 4 faq | see home 13 | `section_faq-accordion` | | | | same fixes as home 13 |
| 5 support cta | heading | `cta-script-centered-dark_heading` | fs/lh | 45.4/54.5, 2 lines | 44/52.8, 2 lines | font-size 45px, line-height 54.5px |
| 5 | paragraph alignment | `cta-script-centered-dark_text p` | text-align | left | center | text-align left |
| 5 | paragraph to button | `cta-script-centered-dark_footer` | gap | 32 | 64 (gap 48 + pad-top 16) | footer padding-top 0, component gap 32px |
| 5 | section pad-top | `section_cta-script-centered-dark` | pad-top | 80 | 72 (32+40) | padding-top 80px total |
| 5 | button | `button.is-chamfer.is-wide` | size | 165x36, 14/18 | 194x37, 16/16 | G12 pattern, remove `is-wide` stretch below 768 |
| 5 | section height | | h | 496 | 495 | none |

---

## Static-template (privacy-policy)

| Block | Element | Live class | Property | Figma | Live | Fix (below 768px) |
|---|---|---|---|---|---|---|
| 1 article | top offset | `section_static-template-privacy-policy` | pad-top (title y) | title y184 (64 nav bar + 120 pad) | y128 | padding-top 184px (live nav is 56 fixed, so content starts 72 below nav) |
| 1 | title | `h1.heading-style-h2` | fs/lh/ls, colour | 28/30, -1.4px, #29310c | 30/30, -1.5px, ink | font-size 28px, line-height 30px, ls -1.4px, colour #29310c |
| 1 | block heading | `h2.heading-style-h5` | colour | #29310c | ink | colour #29310c |
| 1 | body text | `static-template-privacy-policy_text` | fs/lh | 16/20 | 18/23.4 | font-size 16px, line-height 20px |
| 1 | list text | `static-template-privacy-policy_list li` | fs/lh | 16/20 | 18/23.4 | font-size 16px, line-height 20px |
| 1 | heading to body gap | `static-template-privacy-policy_block` | gap | 24 | 40 | gap 24px |
| 1 | block to block gap | `static-template-privacy-policy_content` | gap | 56 | 64 | gap 56px |
| 1 | paragraph gap | `static-template-privacy-policy_body` | gap | one text node, paragraph break only | 26 | gap 20px (one line height) |
| 1 | section pad-bottom | `section_static-template-privacy-policy` | pad-bottom | 120 | 56 | padding-bottom 120px |
| 1 | footer CTA | see Global G7-G13 | | | | |

---

## Press

| Block | Element | Live class | Property | Figma | Live | Fix (below 768px) |
|---|---|---|---|---|---|---|
| 1 hero | all | `hero-fullbleed-centered_*` | size, fs | title y674 28/30, text y728 16/20 | identical | none |
| 1 category selector | position | `tab-pills-intro_frame` / `_tabs` | y | 784 (straddles hero bottom, 16px above hero end) | 1129 (below intro text in its own 120px stage) | pin the selector at hero bottom: top 784px (hero height minus 16px) or document where the GSAP pin ends; remove the extra 120px `tab-pills-intro_stage` block |
| 1 | selector size | `tab-pills-intro_tabs` | size | 220x40 | 220x40 | none |
| 1 intro | heading | `tab-pills-intro_heading.text-style-script.is-large` | fs/lh | 53.4/64.1, 2 lines "A room / for every stay", colour #29310c | 32/38.4, 163x77 | font-size 53px, line-height 64px, colour #29310c, force break after "A room" |
| 1 | heading to paragraph | `tab-pills-intro_header` | gap | 32 | 32 (header to text) | none after heading height fix |
| 1 | intro section height | `section_tab-pills-intro` | h | 515 (120 + 275 + 120) | 409 incl 120 stage | after stage removal pad-bottom 120px |
| 2 articles | section title | `article-card-staggered_header h2.heading-style-h4` | fs/lh/ls | 24/26.4, -1.2px | 20/24, normal | font-size 24px, line-height 26.4px, ls -1.2px |
| 2 | caption | `article-card-staggered_content h3.text-style-eyebrow-caps` | fs/lh/ls | 14/16.8, -0.42px | 18/21.6, -0.54px | font-size 14px, line-height 16.8px, ls -0.42px |
| 2 | publication line | `article-card-staggered_text p` | presence | not in Figma | 16/20 "National Geographic" etc. (h20 + gap 16) | display none below 768px |
| 2 | item pitch | `article-card-staggered_list` | media top to next media top | 346 (250 + 96) | 391 (295 + 96) | follows caption and publication fixes |
| 2 | card width, stagger | `article-card-staggered_component` | w, x | 305, x20 / x65 alternating | 305, x20 / x65 | none |
| 2 | media | `article-card-staggered_figure` | size | 305x200 | 305x200 | none |
| 2 | logo size | `article-card-staggered_logo` | size | 145x43 (NatGeo) | 143x42 | none |
| 3 enquiries | section pad-top | `section_form-split-script-contact` | pad-top | 120 | 40 | padding-top 120px |
| 3 | script heading | `form-split-script-contact_header h2.text-style-script` | fs/lh | 42/50.4, rotated | 44/52.8 | font-size 42px, line-height 50.4px |
| 3 | heading to paragraph | `form-split-script-contact_content` | gap | 32 | 36 | gap 32px |
| 3 | email label | `form-split-script-contact_detail-label` | fs/lh/ls | 14/16.8, -0.42px | 16/19.2, -0.48px | font-size 14px, line-height 16.8px, ls -0.42px |
| 3 | label to value | `form-split-script-contact_detail` | gap | 12 | 10 | gap 12px |
| 3 | fieldset heading | `form-split-script-contact_fieldset-header h3` | fs/lh/ls | 20/27, -1px | 20/24, normal | line-height 27px, ls -1px |
| 3 | fields | `form-split-script-contact_field` | count, h | 7 incl details, h26 pitch 50 | 7, h26 pitch 50 | none |
| 3 | field groups | `form-split-script-contact_fieldset` | structure | 1 group with 6 fields then details | 2 groups (4 + 3), gap 64 | merge into one group (gap 24) or accept; 40px extra height |
| 3 | submit | `input.button.is-chamfer.is-dark` | size | 217x36, 14/18 | 252x37, 16/16 | G12 pattern |
| 3 | form to section end | `section_form-split-script-contact` | pad-bottom | 120 | 40 | padding-bottom 120px |
| 4 offers | section height | `section_offers-slider-split` | h | 804 | 783 (763 + 20 controls) | pagination row 36px high with 16px gap, padding-bottom 40px |
| 4 | controls | `offers-slider-split_controls` | size | arrows 36x36 at x97 and x257, counter 92 wide (x149-241), centred y +746 | arrows 30x14 at x106 and x254, counter 79 wide, y +736 | arrow width/height 36px, counter gap 16px, centred at 746px from section top |
| 4 | button | `offers-slider-split_button` | size | 168x36 | 191x37 | G12 pattern |
| 5 more of the guild | pad | `section_card-carousel-header-left` | pad-bottom | 64 + 24 card pad | 64 | `_link` padding-bottom 24px |
| 5 | label | `card-carousel-header-left_label` | ls | -1px | -0.6px | letter-spacing -1px |
| 5 | cards and gaps | `_figure.is-tall`, `.is-mid` | size | 310x437, 310x307, 310x403, gap 20 | same | none |
| 6 faq | all | `section_faq-accordion` | | | | same as home 13 |
| 7 cta/footer | all | | | | | see Global |

---

## Fixes by class family

| Class or combo | Property | Current -> target (below 768px) | Pages affected | Shared-component risk |
|---|---|---|---|---|
| `button.is-chamfer` and all combos (`is-outline`, `is-outline-light`, `is-dark`, `is-text-burgundy`, `is-wide`), `offers-slider-split_button` | font-size / line-height / letter-spacing | 16/16/0 -> 14px/18px/-0.7px | all pages with buttons (home, press, contact, every other page) | High. Global; width becomes label + 50, so check every button row. Hero button already 14px |
| same | height, padding-inline | 37 / 24 -> 36px / 25px | all | same |
| `button.is-chamfer.is-text-burgundy`, `offers-slider-split_button` (offers 2) | label colour | #4a1217 -> #262118 | home, press | Low. Newsletter and offers buttons only |
| `home-art-stories` button (`is-outline`) | variant | outline -> filled dark `is-dark` (bg #262118, colour #f4efdf) | home | Low |
| `site-nav_bar` | height | 56 -> 64px | all pages | High. Every page offset changes by 8px; fixed nav overlays hero anyway |
| `site-nav_toggle`, `site-nav_logo`, `site-nav_mode` svgs | size, x, y | 28x12 -> 22x10; 192x13 -> 186x12; 16 -> 12 (moon), 14 (sun) | all pages | Medium. Check desktop uses separate sizes |
| `cta-booking-newsletter_header` / `.text-style-script` | block height | 53 -> 68 (book) and 73 (stay) | all pages with the footer CTA | High (shared footer) |
| `cta-booking-newsletter_input` | height | 37 -> 26px | all | High |
| `cta-booking-newsletter_brand .text-style-caption-tracked` | fs/lh/ls | 14/14/0.7 -> 12px/18px/0.6px | all | High |
| `footer-links_text.text-style-caption` | fs/lh | 14/15 -> 12px/18px | all | High |
| `footer-links` Hotel, Experience, Dining lists | items, order | 9 / 8 / Solana-first -> 8 / 7 / Zuma-first | all | Medium (CMS and content) |
| `faq-accordion_header .text-style-eyebrow-caps` | fs/lh/ls | 18/21.6/-0.54 -> 12px/18px/-0.36px | home, press, contact, rooms and others | High (shared FAQ) |
| `faq-accordion_header h2.heading-style-h2` | fs/lh/ls | 30/30/-1.5 -> 28px/28px/-1.4px | all FAQ pages | High |
| `faq-accordion_header` | gap | 16 -> 12px | all FAQ pages | Medium |
| `accordion_icon svg` | size | 24x24 glyph -> 10x5 chevron | all FAQ pages | High |
| `offers-slider-split_controls`, `_arrow`, `_counter` | display, size | hidden (home) / 30x14 -> shown, 36x36, counter 12/14 gap 16 | home (2 sections), press, any offers section | Medium |
| `offers-slider-split_item` | pad-bottom, height | 70 -> 40px; 763 -> 804 | home, press | Medium |
| `offers-slider-split_text` | max-width | none -> 260px (2 lines) | home | Low |
| `venue-card-fullbleed_text.text-size-large` | fs/lh | 18/28.8 -> 16px/20px | home dining and meetings; dining pages | Medium |
| `venue-card-fullbleed_header` / `_footer` (is-media-center) | gap | 24 / 32 -> 32px / 24px | home dining | Low |
| `venue-card-fullbleed_logo-wrapper` | width | 240 -> 280px (lobby, pool only) | home dining | Low |
| `h3.heading-style-display` in `venue-card-fullbleed_header` | fs/lh/ls | 40/40/0 -> 28px/28px/-1.4px | home dining (garden, solana) | Medium (check dining collection) |
| `venue-card-fullbleed_media.is-media-center` clip-path start | polygon | 311x458 portrait at +193 -> 265x193 at +48, chamfer 12px | home | Medium (GSAP animation start values) |
| `venue-card-fullbleed_intro` | heading fs/lh/ls, padding | 20/24/0, pad 112/32 -> 24px/26.4px/-1.2px, pad 120/20 | home | Low |
| `venue-card-fullbleed_content` (is-tall) | alignment, padding | centred -> flex-end, 64/20/48/20 | home rooms; other is-tall uses | Medium |
| `venue-card-fullbleed_stage.is-left` / `_media.is-left` | height | 728 -> 800px | home meetings | Low |
| `venue-card-fullbleed_list-link` and `.heading-style-h3` | h, fs/lh/ls, divider width | 57, 24/24/-1.2, inset 20 -> 56px, 20px/27px/-1px, full bleed | home meetings (and any is-tabs reuse) | Low |
| `venue-card-fullbleed_header h2` (is-tall / is-tabs) | fs/lh/ls | 40 / 30 -> 28px/28px/-1.4px | home rooms, meetings | Medium |
| `home-art-stories_header` | h2 and p type, gaps, section padding | 40/40, 18/26.1, pad 64/40 -> 28/28/-1.4, 14/16.8/-0.42, pad 96/96, gaps 24/40 | home | Low |
| `home-art-stories_trail-item` | count and offsets | 7 -> 4 at (46,50), (162,155), (28,443), (153,596) | home | Low; confirm intent first |
| `image-trio-text_header` and children | text-align, type, link | center, 24/24, 18/21.6 -> left, 28/28/-1.4, 14/18/-0.7 | home wellness | Low |
| `image-trio-text` section padding | pad | 40 -> 96px | home | Low |
| `section_map-feature` | pad, heading size | 40/40, 32px -> 96/11, 44px | home neighborhood | Medium (map-feature may be reused on other pages) |
| `section_script-intro-centered` and `_image`, `_heading` | pad, size, fs | pad 120, 272x157, 28/33.6 -> pad 160, 280x161, 31/37.6 | home; other pages using script-intro | Medium |
| `section_split-image-text-light` and heading | pad, gap, fs, link | 40/40 gap 32, 20/24, link 16 -> 64/96, gap 64, 24/26.4/-1.2, link 14/18 | home; history and others | Medium |
| `card-carousel-header-left_label` | ls | -0.6 -> -1px | press, contact, others | Low |
| `section_card-carousel-header-left` | padding | 96/64 -> per page (contact 56/56, press 96/64) + card pad 24 | contact, press | Low (use page combo) |
| `article-card-staggered_header h2`, `_content h3`, `_text p` | fs/lh/ls, display | 20/24; 18/21.6; p shown -> 24/26.4/-1.2; 14/16.8/-0.42; p hidden | press (also happenings, blog duplicates) | Medium |
| `tab-pills-intro_*` | selector position, stage, heading size | below intro, 120 stage, 32px -> at hero bottom 784, no stage, 53px | press (also happenings, blog) | Medium |
| `form-split-script-contact_*` | pad-top/bottom, heading, label type, gaps, social stack, media aspect | see Contact and Press tables | contact, press | Medium (shared variant `w-variant-cb87b4cf...` on contact) |
| `form-contact-fields_*` | checkbox size/x, label type, footer gap | see Contact table | contact | Low |
| `cta-script-centered-dark_*` | text-align, footer gap, button | see Contact table | contact (and others using this section) | Low |
| `static-template-privacy-policy_*` | pad, title, body fs, gaps | see Static table | privacy-policy, accessibility | Low |

---

Issue counts (rows with a mismatch, excluding "none" rows): global 19, home 63, contact 27, static 9, press 24.
