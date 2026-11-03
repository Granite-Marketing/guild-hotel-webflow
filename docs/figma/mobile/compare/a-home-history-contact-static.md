# Group A: home, history, contact, static-template (mobile 390px, Figma vs live staging)

Method: Figma renders and live 2x screenshots (figma/mobile/.live) cut into matching chunks and compared by content. Figma pixel values are approximate (read from 2x renders). Live sections are named by class family from the live DOM. Nav-mobile state frames (hero, menu, booking sheet, table sheet) reviewed too; the live menu overlay was not in the screenshots, so only the bar is compared.

Screenshot caveat: on live home the three `section_venue-card-fullbleed` blocks (Zuma, Lobby Bar, Pool Lounge, Garden Terrace, Solana) and on live history the `section_gallery-mosaic-captioned` captions rendered blank or empty in the full-page capture (roughly 5000px of empty cream on home). Treated as scroll-reveal not triggered, but re-verify in a real scroll test.

## home

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | nav bar (all pages) | Figma bar: hamburger left, centered wordmark, moon/sun theme toggle right, no Book button. Live: no theme toggle, adds text "BOOK NOW" top right. | high |
| 2 | nav menu / booking sheet (not built) | Figma has a Book entry in the menu overlay, plus a booking sheet (Book a stay / Reserve a table / Host an event / Book an appointment) and a full-screen venue picker (back arrow, close, venue image + name + blurb + RESERVE outline button). Not present on live. See Shared components. | high |
| 3 | section_hero-fullbleed-centered | Hero is taller in Figma (full 844 viewport, text block anchored near bottom, heading ~18px, body ~14px). Live heading ~20px, body ~15px with looser leading, and the CTA is pushed to the very bottom and clipped. Figma CTA label is "BOOK", small chamfered pill centered; live label "BOOK YOUR ..." wider and cut off. | med |
| 4 | section_script-intro-centered | Figma script heading sits 2 lines at ~26px; live is 3 lines at ~34px (wraps "A century of / stories meets / a new hospitality"). Live body paragraph is larger (~16px vs ~13px) and wraps to 5 lines vs 4. More vertical padding above in live. | med |
| 5 | section_split-image-text-light | Same stacking (image, heading, copy, text link). Live image is a real portrait with tighter heading-to-image gap; Figma gap larger (~40px). Live body ~15px vs Figma ~13px. | low |
| 6 | section_venue-card-fullbleed (x3, dining) | Figma: intro heading "AN UNEXPECTED RESORT DINING EXPERIENCE" with a small chamfered Zuma thumb, then five full-bleed 100vw cards (Zuma, The Lobby Bar, Pool Lounge, Garden Terrace, Solana Coffee), each with name/wordmark, one-line blurb and DISCOVER MORE pill, ~420px tall. Live: intro heading then a large chamfered Zuma image (taller, ~215px at half scale vs 95px) and then the cards render blank in capture. Intro image size and chamfer differ. | high |
| 7 | section_image-trio-text (wellness) | Figma: text first (WELLNESS heading left-aligned, body left, DISCOVER MORE underlined link), then one portrait image with a progress bar underneath. Live: three-image swipe strip first, then centered text with larger body, underlined link centered. Order and alignment flip. | high |
| 8 | section_venue-card-fullbleed (rooms) | Figma "ROOMS & SUITES" single-line heading ~22px, outline EXPLORE MORE. Live heading wraps to two lines at ~32px and is larger; image crop shows different framing. | med |
| 9 | section_map-feature | Figma: script heading "The Neighborhood" centered, 2-line centered copy, centered outline button, then map bleeds edge to edge. Live: heading and copy left-aligned, button left, map inset with side padding (not full bleed). | med |
| 10 | section_offers-slider-split (variant, Fashionphile/retail) | Figma: blue panel with RETAIL eyebrow, FASHIONPHILE title, image, one-line blurb, dark DISCOVER MORE, then prev/next with "02 / 05" counter. Live: eyebrow and title "SHOPS AT THE GUILD" separated by a large gap, image comes after text block, no slider counter or arrows visible. Counter and arrows missing. | high |
| 11 | section_home-art-stories | Figma: centered ART & STORIES, caption, dark DISCOVER MORE, then a chamfered collage with overlapping tiles (state frame shows ~8 overlapping tiles). Live: same header (title slightly bigger, ~28px vs 22px) with outline button instead of dark filled button, and a single flat image in the chamfer instead of the overlapping collage. | med |
| 12 | section_venue-card-fullbleed (meetings) | Figma: centered MEETINGS & EVENTS, subtitle, a list of 3 venue rows (COUNCIL BOARDROOM active, COURTYARD, CONFERENCE CENTER) with hairlines, then DISCOVER MORE below the list. Live: title left-aligned, button above the list, list order differs (button before rows). | med |
| 13 | section_offers-slider-split | Figma: dark red card with OFFERS & PACKAGES eyebrow, heading, grey image placeholder, blurb, light button, arrows with "02 / 05". Live: image is placed in a separate strip after the text card (below, not inside), counter shows "01 / 05", text block centered with large empty gap below the button. | med |
| 14 | section_faq-accordion | Figma first item open with up-chevron, item spacing ~56px between rows. Live first item open but chevron points down (state icon not rotated), tighter row spacing, titles wrap to 3 lines on narrower text column (Figma 2 lines, 20px side padding vs live 32px). | med |
| 15 | section_cta-booking-newsletter | Figma: Book Now button is full width (350px) and Join Us is full width, stacked under the email line. Live: Book Now is a narrow centered pill, a short divider appears between blocks, email and Join Us sit inline on one row. | high |
| 16 | footer (within CTA section) | See Shared components (footer). | high |

## history

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | nav bar | Same as home: Figma has theme toggle and no Book Now text; live has Book Now text. | high |
| 2 | section_hero-fullbleed-centered | Figma title "A BOLD PROMISE" ~20px with 2-line subhead near bottom of 844 frame. Live title ~24px, subhead larger with 3 lines and clipped under the Webflow badge area; text block sits ~20px higher. | low |
| 3 | section_script-intro-centered | Figma 2-line script ~26px; live 3 lines ~36px, more top padding (~60px extra). | med |
| 4 | section_history-oasis | Figma: image, heading and body all left-aligned, body ~13px. Live: heading and body centered, body ~16px, 6 wrapped lines vs 5. Heading wraps to 3 lines in live vs 2. Alignment is wrong. | high |
| 5 | section_split-image-text-light (George Marston) | Figma: photo with circular date stamp overlapping bottom-right of photo and a 3-dot slider indicator beneath photo; body ~14px. Live: no slider dots, stamp sits at the bottom of the section below body copy instead of overlapping the photo, body ~18px. | high |
| 6 | section_history-timeline (intro) | Figma: quote "ONCE OPENED, NEVER CLOSED" left of a small heading ~13px, body centered ~13px; 1924 and 2026 labels at far edges. Live: quote in large mixed-case display font (~28px, 2 lines), body ~15px, labels larger. Type treatment mismatched. | med |
| 7 | section_history-timeline (entries) | Figma entries: year pill (1924, 1924-1970, 2019, 2026) overlaid on the top of the entry image, small year label above each title, staggered image widths (full width, then ~70%, alternating left/right alignment). Text is left-aligned ~13px. Live: only the 2026 pill shows (others missing), no small year label above titles, images stagger left only (never right-aligned), body ~17px with larger line height (26px vs 20px). | high |
| 8 | section_history-landmark | Figma: heading A LANDMARK REIMAGINED ~20px centered, 2x2 image grid, centered caption. Live: heading in mixed small caps display ("A Landmark Reimagined") at similar size but different casing/font style, grid same. Gap above caption larger in live. | low |
| 9 | section_gallery-mosaic-captioned | Figma: four stacked full-bleed 390x~400 captioned images with superscript numbers and uppercase caption at bottom. Live: captions render, uppercase, but caption type is larger (~12px vs 10px) and sits higher; first image blank in capture. Re-verify. | med |
| 10 | section_map-feature | Figma: heading DISCOVER THE PROPERTY (all caps ~20px), text left/center. Live: heading in mixed-case small caps ("Discover the Property"), body centered, larger gap before map. | med |
| 11 | section_card-carousel-header-left | Figma: heading left, body left, no arrows shown, first card ~310px wide with next card peeking. Live: arrows added below the intro, first card narrower (~256px), labels smaller. | low |
| 12 | section_faq-accordion | Same as home: chevron direction wrong on open item, tighter side padding differences (20px Figma vs 32px live), titles wrap to 3 lines. | med |
| 13 | section_offers-slider-split | Figma: image inside the red card, "02 / 05" counter. Live: counter "01 / 05", image outside card below. | med |
| 14 | section_cta-booking-newsletter | Same as home (stacked full-width buttons in Figma, narrow pill and inline email/Join Us in live; divider). | high |

## contact

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | nav bar | Same as home (toggle missing, Book Now text extra). | high |
| 2 | section_form-split-script-contact | Page title: Figma "CONTACT US" in extended bold, dark green, ~28px, placed ~160px below the bar. Live: thin regular weight black, ~44px, only ~70px below the bar. Side gutters: Figma 20px, live 32px. | high |
| 3 | section_form-split-script-contact (details) | Figma labels (ADDRESS, GENERAL ENQUIRIES...) small ~10px, grey-black; live labels ~13px, green, bolder. Body lines ~17px both, spacing tighter in live (~24px vs ~40px between groups). | med |
| 4 | section_form-split-script-contact (social) | Figma: INSTAGRAM and FACEBOOK stacked vertically as underlined links. Live: inline side by side. | med |
| 5 | section_form-split-script-contact (image) | Figma: square grey placeholder ~350px, inset with 20px margin; live shows a photo inset 32px, shorter aspect (~3:3.2). Content only, aspect slightly different. | low |
| 6 | section_form-contact-fields | Figma: single-line inputs for all fields including "SPECIAL REQUIREMENTS" (one line with underline). Live: SPECIAL REQUIREMENTS is a tall multi-line textarea (~120px). Labels in Figma ~12px, live ~14px. Rows tighter in Figma (~42px) than live (~48px). | med |
| 7 | section_form-contact-fields (consent) | Figma: checkbox left, label text wraps to 2 lines next to the box with PRIVACY POLICY in the label body (uppercase ~11px). Live: checkbox inset, label wraps below and PRIVACY POLICY shown as underlined link on line 2, with misaligned indent. | low |
| 8 | section_form-contact-fields (submit) | Figma: SEND YOUR MESSAGE button ~170px wide chamfered, text ~11px. Live: button slightly wider with larger tracking (~190px). | low |
| 9 | section_card-carousel-header-left | Figma: heading MORE OF THE GUILD ~22px, 3-line body, no arrows visible, first card ~260px wide with next card peeking. Live: heading ~28px, arrows (prev greyed, next dark) added below body, cards ~215px wide with more height. | med |
| 10 | section_faq-accordion | Figma first item open with up-chevron and ~56px row padding; live first item open with down-chevron, rows tighter (~44px), titles wrap to 3 lines due to narrower column. | med |
| 11 | section_cta-script-centered-dark | Figma: script heading left-aligned, body left-aligned, button centered. Live: all centered, with body ~18px vs Figma 14px. | med |
| 12 | section_cta-booking-newsletter | Same as home. | high |

## static-template

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | nav bar | Same as home. Figma also keeps the wordmark centered with no right control. | high |
| 2 | section_static-template-privacy-policy (title) | Figma H1 "PRIVACY POLICY" ~28px extended bold, ~150px below the bar (generous top space). Live H1 ~28px similar weight but sits ~100px higher (starts ~120px below bar vs ~270px in Figma at 2x). Side gutter: Figma 20px, live 32px. | high |
| 3 | section_static-template-privacy-policy (H2) | Figma H2 ~14px, tracking wide, 2 lines (full text wraps "...PORTFOLIO / HOTEL"). Live H2 ~15px wraps differently ("A TRIBUTE / PORTFOLIO HOTEL") because of the wider gutter. | low |
| 4 | section_static-template-privacy-policy (body) | Figma body ~16px, line-height ~20px at half scale (~33px at 2x, about 1.4). Live body ~19px with line-height ~1.5 (about 39px at 2x), so every paragraph is 2 to 3 lines longer. Paragraph gaps (blank line) similar. | high |
| 5 | section_static-template-privacy-policy (list) | Figma bullet list: small bullets ~16px from the left edge, text indented ~40px, tight rows (~33px). Live bullets indented ~72px with text indented ~113px (2x scale), rows ~45px. List indent roughly double and row spacing too loose. | med |
| 6 | section_static-template-privacy-policy (H2 spacing) | Figma gap before each H2 ~80px and after ~36px; live gap before ~56px and after ~50px. | low |
| 7 | section_cta-booking-newsletter | Same as home. | high |

## Shared components

### nav (header)
- Theme toggle (moon and sun icons) in Figma right of wordmark; absent in live. Live shows "BOOK NOW" text link where Figma has nothing. Affects all pages in this group.
- Not built: Book Now flow described by the client. Figma shows (a) menu overlay with BOOK pill, (b) booking sheet (maroon, rounded top corners, round stamp, close X, items BOOK A STAY / RESERVE A TABLE / HOST AN EVENT / BOOK AN APPOINTMENT), (c) full-page venue picker (back arrow, close X, wordmark, venue cards with image, name, blurb, outlined RESERVE button; vertical scroll). Live has no equivalent mobile booking sheet or picker. This is a new build task (Back returns to the sheet).

### footer / section_cta-booking-newsletter
- Figma: BOOK NOW and JOIN US buttons are full width (350px), stacked under a labelled email line; no short divider line between Book and newsletter. Live: narrow centered Book Now pill, thin divider between blocks, and email plus Join Us pill share one row.
- Figma footer link columns: THE HOTEL (Rooms, History, Amenities, Services, Corporate, Gallery, Press, Contact), EXPERIENCE (Wellness, Dining, Neighborhood, Meetings & Events, Services, ResortPass, Packages), DINING (Zuma San Diego, The Lobby Bar, The Lobby Terrace, Pool Lounge, In-Room Dining), SOCIAL (Instagram, Facebook, TikTok), LINKS. Live adds BLOG and HAPPENINGS and lists dining as Solana Coffee, Pool Lounge, Lobby Bar, Garden Terrace, Zuma San Diego, In-Room Dining (different order and labels, "Lobby Terrace" vs "Garden Terrace"). Content mismatch; confirm with client which is canonical.
- Figma has a full-width hairline between Bonvoy block and link columns, and again above the Tribute Portfolio logo; live has neither.
- Figma Tribute Portfolio logo is large (~290px wide) and centered with copyright and credit centered; live logo is ~150px wide, left-aligned, copyright and credit left-aligned and credit has "STUDIO CIRCA" underlined.
- Footer link type ~11px in Figma vs ~13px live; row spacing ~44px Figma vs ~29px live (live is much denser).
- Footer side padding: 20px Figma vs 32px live.

### section_faq-accordion
- Open item chevron: Figma up-chevron, live down-chevron on the open row.
- Figma row padding ~56px with 20px page gutter (titles wrap to 2 lines); live ~44px with 32px gutter (titles wrap to 3 lines).

### section_offers-slider-split
- Figma shows "02 / 05" with arrows inside the card and the image within the card; live shows "01 / 05" and the image outside the card. Applies to home (both uses) and history.

### section_card-carousel-header-left
- Live adds prev/next arrows under intro (Figma shows none in its static frame). Live heading larger (~28px vs ~22px) and cards narrower.

### Global gutter and type scale
- Figma content gutter is 20px; live pages (contact, history, static template, FAQ, text sections) use ~32px. Live body copy is generally ~2px larger than Figma (about 15 to 18px vs 13 to 16px) with line-height around 1.5 vs 1.4, which causes extra wrapped lines on every text section. Likely a base mobile font-size and padding-global token mismatch (single fix in utility classes would resolve many rows).
- Script headings (script-intro, history timeline) render ~30 percent larger in live, causing 3-line wraps vs Figma 2 lines.

### Centered vs left alignment
- history-oasis, map-feature, cta-script-centered-dark and image-trio-text are left aligned in Figma but centered in live (or the reverse for map-feature and image-trio-text). Check each section's mobile text-align combo class.
