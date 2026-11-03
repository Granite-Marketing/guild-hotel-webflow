# Group E: meetings-collection, neighborhood, legal, corporate

Method and caveats. Figma mobile (390px) vs live staging at 390px, 2x. Sizes are estimates from scaled screenshots (about +/-10%), converted to CSS px.

Capture caveat (affects all four pages): the live full-page screenshots are not clean. Sections with the scroll-enlarge pin (`section_venue-card-fullbleed`) render as empty cream space, and the capture repeats the hero partway down the page. Result: only the top half of each live page is visible. Sections after the first third of each page (meetings: gallery, offers, FAQ, CTA, footer; neighborhood: dining articles, map, gallery, offers, FAQ, CTA; legal and corporate: venue cards, map, packages, form, gallery, offers, FAQ, CTA) could NOT be compared visually. Where a row says "DOM" it comes from the live HTML, not from pixels. Recommend a re-capture with pin spacers disabled before sign-off.

## meetings-collection

Live sections in order: section_hero-fullbleed-centered, section_venue-card-fullbleed, section_form-split-script-contact, section_map-feature is-image-bg, section_meetings-collection-features, section_gallery-mosaic-captioned, section_offers-slider-split, section_faq-accordion, section_cta-booking-newsletter.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component (header) | Figma header: hamburger left, wordmark centered, moon/sun day-night toggle right. Live: hamburger, wordmark, text "BOOK NOW" at right; toggle not visible (it exists in DOM as site-nav_modes). | high |
| 2 | section_hero-fullbleed-centered | Title about 8% wider on live (Figma "MEETINGS & EVENTS" spans ~287px, live ~310px), so heading and subcopy are larger than Figma. Same 2-line wrap. | low |
| 3 | section_venue-card-fullbleed (intro header) | Figma script heading "Intimate spaces for celebration & collaboration" is tilted (rotated), 2 lines, wide (~330px), roughly 30px. Live: 3 lines, centered, not rotated, ~40px. | med |
| 4 | section_venue-card-fullbleed (cards) | Figma shows three stacked full-bleed cards (title ~22px caps, copy, cream chamfer "DISCOVER MORE" button) and a floating maroon chamfer selector pill "COUNCIL BOARDROOM" with a menu icon. Live has no selector pill anywhere in the DOM; cards are a pinned scroll-enlarge stage. Missing sticky venue pill. | high |
| 5 | section_form-split-script-contact | Figma "Request for Proposal" script is one tilted line (~34px, about 270px wide). Live wraps to 2 lines, smaller and not tilted enough. | med |
| 6 | section_form-split-script-contact | Field labels: Figma ~10px caps, row pitch ~50px, textarea is a single row. Live labels ~12-13px, row pitch ~58px, "Additional details" is a tall textarea (~100px). Fieldset headings ("CONTACT INFORMATION") slightly narrower tracking on Figma. | med |
| 7 | section_form-split-script-contact | Submit button: Figma centered; live right-aligned. | med |
| 8 | section_map-feature | Figma map is full-bleed (390px wide) and ~650px tall. Live map is inset ~32px each side, ~240px tall, with zoom controls visible. Brown "Steps from key legal addresses" card: Figma full-bleed with ~32px inner padding; live card inset to match the map. | high |
| 9 | section_map-feature | Figma card heading ~16px, rows tight (~48px pitch); live heading slightly smaller, row pitch ~58px. | low |
| 10 | section_meetings-collection-features | Figma figures are ~1:1 placeholders at 296px wide; live first figure (wedding image) is ~4:5 (296x370). Heading and button match. | low |
| 11 | section_gallery-mosaic-captioned | Figma: heading "MEETINGS & EVENTS GALLERY" top-left over four stacked full-bleed images (~390x480) with dark gradient and numbered caps captions. Not captured live. | med (unverified) |
| 12 | section_offers-slider-split | Figma: maroon block, eyebrow, 1-line title, image, copy, "DISCOVER MORE", pager "02 / 05". Not captured live. | unverified |
| 13 | section_faq-accordion, section_cta-booking-newsletter, footer | Figma shows first item open with chevron-up, 6 items. Not captured live; DOM structure matches (eyebrow, h2, accordion items). | unverified |
| 14 | overlay-detail-panel-modal (state frame "Detail Panel") | DOM only. Figma: back arrow only (no label) and a dark chamfer "SUBMIT YOUR REQUEST" button top right; no close X. Live: arrow plus "back" label and a separate close X, no submit button. Figma image sits full width with a progress line below, then title, "DETAILS", a numbered text list (1 510 SQ FT, 2 ..., 5 Capacity: 50+), "LAYOUT OPTIONS" as a 2-column grid, floorplan link, footnote. Live has layout options as one `<br>`-separated column and an item list built from figures with images. | high |

## neighborhood

Live sections in order: hero-fullbleed-centered, script-intro-centered, split-image-text-light (x3), tab-pills-intro, offers-slider-split (variant, Midway Museum), timeline-scatter-images is-tall, neighborhood-corporate, article-card-staggered, map-feature is-image-bg, gallery-mosaic-captioned, offers-slider-split, faq-accordion, cta-booking-newsletter.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same header diff as meetings row 1 (toggle vs "BOOK NOW"). | high |
| 2 | section_hero-fullbleed-centered | Title "A CITY AT YOUR FINGERTIPS" slightly larger on live (about +8%). Hero height comparable (~800-840px). | low |
| 3 | section_script-intro-centered | Figma script is 2 lines, tilted, ~30px; live is 3 lines ("The best of / San Diego is / right here"), ~40px. Body copy 6 lines in Figma at ~13px vs 6-7 lines at ~15px live. | med |
| 4 | section_tab-pills-intro | Figma: a collapsed maroon chamfer pill "DINING" with menu icon, placed right after the intro (before Downtown San Diego); it behaves as a sticky selector. Live: expanded 4-tab pill (DINING, ARTS, BEYOND DOWNTOWN, SERVICES) in 2 rows, positioned AFTER the Little Italy block. Wrong position and wrong (expanded) form. | high |
| 5 | section_split-image-text-light (x3) | Figma: images are staggered (alternating left ~230px, right ~210px wide, ~70-78% of width, near square) and each text block is indented to align under its image. Live: every image is full column width (~296px) and ~4:3 or portrait, text left-aligned, no stagger. | high |
| 6 | section_split-image-text-light (Downtown San Diego) | Figma places heading + first paragraph above the first image; live puts image first, then heading. Figma body ~12-13px, live ~15px. | med |
| 7 | section_offers-slider-split (Midway Museum) | Figma order: eyebrow, title (one line, caps ~20px), image (296px, near portrait), copy, button, pager. Live: eyebrow, title, copy, button, pager, then image appears below the pager. Live title wraps/looks smaller. | med |
| 8 | section_timeline-scatter-images | Figma "BEYOND DOWNTOWN SAN DIEGO": 4 near-square images alternating left/right, captions left small caps. Live: images full width landscape (~296x195), captions centered, no stagger. | med |
| 9 | section_neighborhood-corporate | Figma: heading left-aligned on 2 lines ("CORPORATE / & SERVICES"), near-square images, caption + 12px body. Live: heading centered on one line, landscape ~16:9 images (~276x170), 14px body. | med |
| 10 | section_article-card-staggered | Figma: heading "DINING AROUND THE GUILD" + intro, then near-square images with small caps captions "DINING 1/2" and body. Live heading and text match; images only partly visible. | low (partial) |
| 11 | section_map-feature | Not captured live. Figma shows the card overlaid on a full-bleed map (map visible above and below the card, ~700px tall). Live component (seen on meetings) renders map above and card below, both inset. See Shared components. | high (inferred) |
| 12 | section_gallery-mosaic-captioned, offers, faq, cta, footer | Not captured live. | unverified |
| 13 | overlay-detail-panel-modal variant centered (state frame "Coronado Beach") | DOM only. Figma: back arrow top-left (no label), centered ~26px title, centered body, dark chamfer "LEARN MORE" button, then full-width image and progress line. Live: arrow plus "back" label and a close X, image sits before content in DOM. Also missing "LEARN MORE" button if not authored in the dialog. | high |

## legal

Live sections in order: hero-fullbleed-centered, script-intro-centered, image-trio-text is-left, feature-grid-dark-eyebrow, split-sticky-text-stacked-images, venue-card-fullbleed, map-feature is-image-bg, image-trio-text is-left, form-split-script-contact, gallery-mosaic-captioned, offers-slider-split, faq-accordion, cta-booking-newsletter.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same header diff (toggle vs "BOOK NOW"). | high |
| 2 | section_hero-fullbleed-centered | Hero title and subtitle sizes match within ~5%. Subtitle in Figma is 2 lines; live subtitle is clipped by the Webflow badge in capture (ignore). | low |
| 3 | section_script-intro-centered | Figma "Refined focus, unmatched convenience." is 2 tilted lines (~28px, ~330px wide). Live is 3 lines (~38px), narrower. Body copy 5 lines Figma vs 6 lines live (larger font live). | med |
| 4 | section_image-trio-text is-left (Key Features) | Figma images ~1:1 at ~340px wide; live ~1.25:1 landscape at ~300px wide, so images are narrower and shorter. Label "KEY FEATURES" centered in both. Caption heading ~11px caps Figma vs similar live. | low |
| 5 | section_feature-grid-dark-eyebrow | Figma row pitch ~127px, live ~150px (about 20% taller rows). Heading "WHY TEAMS CHOOSE THE GUILD" centered 2 lines in both. | low |
| 6 | section_feature-grid-dark-eyebrow (Bonvoy block) | Matches (eyebrow text, logo, "EARN MARRIOTT BONVOY POINTS"). | none |
| 7 | section_split-sticky-text-stacked-images | Figma heading is 3 lines (~16px) and body ~12px; live heading wraps to 4 lines (larger, ~19px). Stacked images: Figma ~1:1; live ~4:5 portrait. | med |
| 8 | section_venue-card-fullbleed | Not captured live (pinned stage, blank). Figma: four full-bleed cards (LARGE CONFERENCE CENTER, COUNCIL BOARDROOM, ONE COLUMBIA PLACE, SMALL CONFERENCE CENTER), title + copy + "DISCOVER MORE" centered. Live DOM has the same four cards and four dialogs. No floating selector pill in live (Figma meetings page has one; legal Figma does not). | unverified |
| 9 | section_map-feature | Not captured. Figma: full-bleed map ~700px with brown card floating over it (inset ~32px). See Shared components. | high (inferred) |
| 10 | section_image-trio-text is-left (Tailored Corporate Packages) | Not captured. Figma: heading left 2 lines, then 1:1 images with bold heading and bullet list. Live DOM: first item has `is-offset`; Figma shows no offset. | low (unverified) |
| 11 | section_form-split-script-contact | Not captured. Figma: tilted one-line script, intro paragraph, three small contact details (concierge email, 24/7 phone, address) stacked, then 9 fields (First/Last, Email, Phone, Law firm, Team size, Check-in, Check-out, Special requirements), submit button left-aligned. Live DOM has the same fields; alignment and field label size not verified. | unverified |
| 12 | section_offers-slider-split | EXTRA on live: Figma legal has no offers/packages slider between gallery and FAQ. Live renders `section_offers-slider-split swiper_slider`. | high |
| 13 | section_gallery-mosaic-captioned, faq-accordion, cta, footer | Not captured live. Figma gallery heading "CORPORATE GALLERY". | unverified |
| 14 | overlay-detail-panel-modal (state frame "Council Boardroom") | Same as meetings row 14: Figma has back arrow plus dark "SUBMIT YOUR REQUEST" button, no X, numbered spec list, 2-column layout options. Live has back label plus X, no submit button, single column layout options. | high |

## corporate

Same live sections as legal, in the same order. Figma corporate frame is structurally the same as legal; copy differs ("RETREAT FOR CORPORATE TEAMS", "Designed for focused work & productive teams"), which is CMS copy. All legal rows 1 to 14 apply with these deltas:

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same header diff (toggle vs "BOOK NOW"). | high |
| 2 | section_script-intro-centered | Figma 2 tilted lines (~28px); live 3 lines (~38px). | med |
| 3 | section_image-trio-text is-left | Figma ~1:1 images, live ~1.25:1 and narrower. | low |
| 4 | section_feature-grid-dark-eyebrow | Live rows ~20% taller than Figma. | low |
| 5 | section_split-sticky-text-stacked-images | Figma heading 3 lines; live 4 lines ("DESIGNED FOR / FOCUSED WORK & / PRODUCTIVE TEAMS" wraps larger). Images 1:1 vs ~4:5. | med |
| 6 | section_offers-slider-split | Extra on live (absent from Figma corporate). | high |
| 7 | section_map-feature | Figma card floats over full-bleed map; live component renders map above card, inset (inferred). | high |
| 8 | venue cards, packages, form, gallery, faq, cta | Not captured live (see capture caveat). | unverified |
| 9 | overlay-detail-panel-modal | Same panel diff as legal row 14. | high |

## Shared components

- site-nav (site-nav_component): Figma mobile has a day/night toggle (moon/sun) at the right and no "BOOK NOW"; live shows "BOOK NOW" and hides the toggle. Applies to all four pages.
- section_script-intro-centered and script headings (text-style-script, form-split-script-contact_header is-rotated, venue-card-fullbleed_intro heading): Figma scripts are wide, 1 to 2 lines, tilted, ~28-34px; live wraps to 3 lines at ~38-40px with less tilt. Body copy under them is ~13px in Figma vs ~15px live. Seen on meetings, neighborhood, legal, corporate.
- section_map-feature is-image-bg: Figma legal, corporate and neighborhood put a brown card floating over a full-bleed map (~700px tall); meetings Figma has a full-bleed map with the card below it. Live renders a ~240px inset map with the card below, inset by ~32px, on every page. Needs a mobile variant (full-bleed, taller, card overlap).
- overlay-detail-panel-modal (Detail Panel): Figma mobile shows a back arrow only, no close X, a dark chamfer CTA ("SUBMIT YOUR REQUEST" on meetings and legal, "LEARN MORE" on neighborhood), numbered spec list and 2-column layout options. Live has "back" label plus X, no CTA, single-column layout options. Applies to meetings, neighborhood, legal, corporate.
- section_venue-card-fullbleed: Figma meetings includes a floating maroon selector pill with a menu icon; live has none. Pinned scroll-enlarge stage renders blank in the capture; verify the mobile behaviour manually.
- section_form-split-script-contact: Figma submit centered (meetings) or left (legal), tighter field pitch (~50px vs ~58px) and smaller labels (~10px vs ~12-13px); live submit is right-aligned, textarea is tall.
- section_offers-slider-split: Figma legal and corporate omit it; live includes it. Figma neighborhood and meetings include it. On neighborhood, the image order inside the first slider differs (Figma image above copy, live below pager).
- section_tab-pills-intro: Figma collapsed sticky pill "DINING +icon" directly after the intro; live expanded 4-tab pill after the third split block.
- section_split-image-text-light, section_timeline-scatter-images, section_neighborhood-corporate, section_image-trio-text: Figma uses staggered, near-square images (1:1) with indented text; live uses full-width landscape or portrait images with left-aligned text.
