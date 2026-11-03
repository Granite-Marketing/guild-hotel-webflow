# Group D: press, happenings-collection, blog-collection, happenings-indiv, blog-indiv

Figma mobile (390px, node specs from `figma/mobile/nodes.json.gz`) vs live staging at 390px. Live sizes marked "~" are measured from the screenshot (line pitch and glyph width), not from computed CSS. Skipped: CMS copy and image content, animation timing. Figma frames are grey placeholders, so image crop is judged only by box size and aspect.

Notes on the inputs:
- The live screenshots end with a duplicated hero strip and a clipped footer on press (full-page capture artifact of the fixed nav). Footer comparisons use the other four pages, which captured the footer fully.
- Figma pages have no "state" frames for these five sections (no open selector, no open nav), so the mobile category selector and nav menu are compared closed only.

## press

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Figma bar: hamburger left, wordmark centered, moon / sun theme toggle right. Live: hamburger left, wordmark centered, "BOOK NOW" text link right, no theme toggle. | high |
| 2 | section_hero-fullbleed-centered | Hero Figma 800px tall (390x800 frame) with a "BOOK" CTA slot reserved at y 732 under the copy; live is 100svh (~844px) and shows no CTA row. Title Figma 28px uppercase, description 16px; live title ~28px but description ~18px with looser leading (~29px pitch vs 20px), and it wraps into the Webflow badge area. | low |
| 3 | section_tab-pills-intro (pill) | Figma: closed dropdown selector, 220x40 maroon chamfered pill, centered, straddling the hero / intro boundary (y 784), showing only the active label "PRESS" underlined plus a hamburger icon on the right (Selection row 196px wide). Live: full-width (~320px) pill inside the intro section showing a tab row "PRESS  DESIGN" with dim inactive labels, no hamburger icon, no overlap with the hero. | high |
| 4 | section_tab-pills-intro (copy) | Figma intro script heading 53px Morello, 2 lines, ~336px wide; live ~44px, narrower. Body Figma 16px / 20px leading, live ~18px / 23px leading and centered with narrower measure (4 lines vs 3). | med |
| 5 | section_article-card-staggered | Figma mobile layout is staggered: cards 305px wide, alternating left (x 20) and right-indented (x 65) with a 96px gap and the section label ("PRESS" 24px, "DESIGN" 24px) indented to match the card. Live stacks every card full width (326px) flush left, no stagger, labels flush left at 16-18px. | high |
| 6 | article-card-staggered_content | Card title Figma 14px uppercase, 305px wide, no source line. Live title ~16px uppercase wrapping to 2 lines and adds an extra outlet line (e.g. "National Geographic") under it. Live image box ~326x230 (about 7:5) vs Figma 305x200 (about 3:2). Logo plate sits inside the image in both. | med |
| 7 | section_form-split-script-contact | "Press Enquiries" script Figma 42px, ~264px wide, left-ish with 43px indent; live ~38px and flush left to the grid. Body paragraph Figma 16px / 20px (4 lines), live ~18px / 23px (5 lines). | low |
| 8 | form-split-script-contact_fieldset-header / fields | Form labels Figma 14px uppercase with a hairline under each, 50px row pitch; live labels ~16px, 58px pitch. "DETAILS" is a plain single row in Figma (same as other fields); live renders a ~85px tall textarea. "CONTACT INFORMATION" Figma 20px, live ~22px. | med |
| 9 | form-split-script-contact_footer | Submit button Figma left aligned (x 20), 167px label, 14px; live right aligned, larger (~16px label, ~250px wide pill). | med |
| 10 | section_offers-slider-split | Figma: image sits inside the maroon block (350x390, 20px gutter) between the title and the description; eyebrow "OFFERS & PACKAGES" 12px, title 28px ("WELLNESS STAYCATION"), pager "02 / 05" 12px under the button, block 804px tall. Live: no image inside the maroon block (large empty band where it should be), the slide image renders as a separate full-bleed 390px wide photo below the block, with no side gutter; eyebrow ~16px, title ~30px, pager ~16px. | high |
| 11 | section_card-carousel-header-left | Heading "MORE OF THE GUILD" Figma 28px left aligned, body 16px / 20px. Live heading ~28px but body ~18px; live adds prev / next arrows under the copy (Figma has none on mobile, swipe only). Card Figma 310x436 portrait with 20px gutter, next card peeks at x 350; live card ~256x360 with a larger gap. Card label Figma 20px, live ~14px. | high |
| 12 | section_faq (accordion) | Eyebrow "FAQS" 12px, title 28px: close. Question text Figma 18px with chevron in a 40px column, 2 lines max; live ~20px, wraps to 3 lines. Answer Figma 16px / 20px, live ~18px / 23px. Open item chevron: Figma shows an up-chevron on the expanded row, live shows a down-chevron on the open row. Row gap Figma ~40px between dividers, live ~28px. | med |
| 13 | section_cta-booking-newsletter | Figma: "Book your escape" 53px script, centered; then "Stay in the loop"; email is a full-width underline with the "JOIN US" button centered below it. Live: a short horizontal rule between the two blocks (not in Figma); email underline ~180px wide with JOIN US inline on the same row, larger (~42px script heading in the first block looks ~12% smaller than Figma). Marriott Bonvoy block sits inside the CTA on live, Figma separates it with a full-width hairline. | high |
| 14 | site-nav_menu-footer | Footer nav Figma: Bonvoy logo ~160px wide, 12px caption, hairline, then headings 18px and links 13px at 44px row pitch, a "LINKS" group, hairline, big centered "TRIBUTE PORTFOLIO" (letter-spaced ~28px), centered copyright and credit lines (12px). Live: headings ~16px, links ~12px at ~29px pitch (much tighter), all left aligned, no hairlines, "TRIBUTE PORTFOLIO" small (~18px) and left aligned, copyright and credit left aligned and larger (~13px) with "STUDIO CIRCA" underlined. Live link set also differs (adds Blog, Happenings, Solana Coffee, Garden Terrace; Figma has neither). | high |

## happenings-collection

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same as press 1: Figma has theme toggle on the right, live shows "BOOK NOW" and no toggle. | high |
| 2 | section_hero-fullbleed-centered | Same as press 2. Title Figma 28px, description 16px; live description ~18px. Hero 800px vs ~844px. | low |
| 3 | section_tab-pills-intro (pill) | Figma: closed 220x40 selector showing "DINING" + hamburger, overlapping hero bottom. Live: ~210px wide, ~90px tall two-line pill showing "DINING" (dim) stacked over "CULTURE" (active, underlined); third tab ("CONFERENCES") is not visible; no hamburger; sits inside the intro section. | high |
| 4 | section_tab-pills-intro (copy) | Script heading Figma 56px (2 lines, ~330px wide); live ~45px. Body Figma 16px / 20px, live ~18px / 23px. Figma has more space (32px) between body and pill. | med |
| 5 | section_article-card-staggered | Same stagger issue as press 5: Figma alternates cards left (x 20) and right (x 65), 305px wide, 96px gap, section labels ("DINING", "CULTURE") 24px offset with the cards. Live is single column full width (326px), labels ~16px. | high |
| 6 | article-card-staggered_content | Figma card has title 14px + description 16px, description capped at 244px wide (4 lines). Live title ~16px, description ~18px full width (2 lines), ~326x230 image vs Figma 305x200. | med |
| 7 | article-card-staggered_header is-group | Figma section label 24px with heavy weight; live ~17px and tighter. Figma gap between label and image 16px, live ~24px. | low |
| 8 | section_offers-slider-split | Same as press 10: image missing inside the maroon block, rendered as a separate full-bleed photo underneath; eyebrow and title larger on live; pager larger. | high |
| 9 | section_card-carousel-header-left | Same as press 11: live adds arrows; card width ~256 vs 310; body ~18px vs 16px; card label ~14px vs 20px. | high |
| 10 | section_faq | Same as press 12: question ~20px (3 lines) vs 18px (2 lines); answer ~18px vs 16px; open chevron direction differs. | med |
| 11 | section_cta-booking-newsletter | Same as press 13: extra short rule on live, inline email + JOIN US on live vs stacked in Figma. | high |
| 12 | site-nav_menu-footer | Same as press 14: tighter link pitch, left aligned, no hairlines, small left-aligned "TRIBUTE PORTFOLIO", link set differs. | high |

## blog-collection

Figma blog-collection is structurally identical to happenings-collection (same copy placeholders, same sections, 8386px tall).

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Theme toggle (Figma) vs "BOOK NOW" (live), as press 1. | high |
| 2 | section_hero-fullbleed-centered | Same as press 2. Figma title "BLOG" 28px / description 16px; live description ~18px. | low |
| 3 | section_tab-pills-intro (pill) | Figma: single-row closed selector "DINING" + hamburger (220x40). Live: ~360px wide, ~90px tall pill showing the tabs as two rows ("DINING  CULTURE" over active "CONFERENCES"); wider than the content gutter, no hamburger, no hero overlap. | high |
| 4 | section_tab-pills-intro (copy) | Script heading Figma 56px vs live ~45px; body 16px vs ~18px. | med |
| 5 | section_article-card-staggered | Staggered left / right-indented 305px cards in Figma; live single full-width column. Section labels indented with cards in Figma. | high |
| 6 | article-card-staggered_content | Card title 14px vs ~16px; description capped at 244px in Figma (4 lines) vs full width ~18px live (4 lines, different wrap); image 305x200 vs ~326x230. | med |
| 7 | section_offers-slider-split | Image missing inside maroon block on live (separate full-bleed photo below), larger eyebrow / title / pager. | high |
| 8 | section_card-carousel-header-left | Live adds arrows; cards ~256x360 vs 310x436; label ~14px vs 20px; body ~18px vs 16px. | high |
| 9 | section_faq | Question ~20px vs 18px (3 lines vs 2); answer ~18px vs 16px; chevron direction on open row. | med |
| 10 | section_cta-booking-newsletter | Extra rule on live; inline email + JOIN US vs stacked. | high |
| 11 | site-nav_menu-footer | Footer spacing, alignment, hairlines, wordmark size and link set differ as in press 14. | high |

## happenings-indiv

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Theme toggle (Figma) vs "BOOK NOW" (live). | high |
| 2 | section_hero-fullbleed-centered | Figma: two-line uppercase title "LOCALS NIGHT AT RODEO BAR" 28px, description 16px, no eyebrow, "BOOK" CTA slot. Live: adds a small eyebrow category label ("DINING") above the title, title in mixed case / small caps ~34px (larger than Figma 28px, with tighter leading), description ~18px. | med |
| 3 | section_article-body (header) | Figma header: "THE GUILD, A TRIBUTE PORTFOLIO HOTEL" 18px, one block, no date. Live wraps the same title at ~17px and adds a date line "NOVEMBER 6, 2026" at ~20px under it (not in Figma); header gap to body Figma 24px, live ~40px. | med |
| 4 | section_article-body (copy) | Figma body 16px / 20px, one long paragraph running full width; live ~18px / 23px in two paragraphs. Figma "LEARN MORE" button overlaps the last lines of text (design overlap, button at 20px from left, ~160px wide); live places it centered below the copy with proper spacing (keep live behavior, flag Figma overlap to designer). | low |
| 5 | section_image-inset-single | Figma media block is 350x200 but rendered ~244px wide, left aligned, grey; live image is full container width (326x230ish). Figma places this image before the second paragraph and the next image after it. Live stacks both images back to back (umbrella, lounge) then the second paragraph, so the order differs. | high |
| 6 | section_split-image-text-light | Figma second image is right aligned (x 126 to 370, 244x200), staggered against the first; live shows it full width and flush left. Paragraph between is 16px in Figma vs ~18px with 5 lines on live. | med |
| 7 | section_split-card-pair-captioned | "MORE AROUND TOWN" heading Figma 28px, centered, with 32px gap and tile start immediately below at full bleed; live heading ~26px, tight above the tiles (~18px gap, Figma ~32px). Tile titles Figma 20px uppercase, tracked, left aligned at 24px from left, vertically ~1/4 up from bottom; live uses mixed case ~22px ("Historical tours") with 1.0 leading, wrapping to 2 lines on long titles, sitting ~10px above the bottom. | med |
| 8 | section_card-carousel-header-left | Live adds arrows under the copy (Figma none); card ~256x360 vs 310x436; label ~14px vs 20px. | high |
| 9 | section_offers-slider-split | Image missing inside maroon block (renders below as separate full-bleed photo); eyebrow / title / pager larger on live. | high |
| 10 | section_cta-booking-newsletter | Extra rule on live; inline email + JOIN US vs stacked in Figma; Bonvoy block and hairline separation differ. | high |
| 11 | site-nav_menu-footer | Same as press 14. | high |

## blog-indiv

Figma blog-indiv is identical to happenings-indiv (same placeholders, 6771px tall). Live differs only in CMS content.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Theme toggle (Figma) vs "BOOK NOW" (live). | high |
| 2 | section_hero-fullbleed-centered | Live adds eyebrow category label ("CULTURE") above the title; title ~34px mixed case vs Figma 28px uppercase; description ~18px vs 16px. | med |
| 3 | section_article-body (header) | Live adds a date line ("NOVEMBER 14, 2026") not in Figma; header title wraps at a different width (Figma "THE GUILD, A TRIBUTE PORTFOLIO / HOTEL" in 2 lines across full width at 18px; live wraps after "A TRIBUTE"). | med |
| 4 | section_article-body (copy) | Body ~18px vs 16px; Figma single paragraph with the button overlapping text; live two paragraphs with the button centered below. | low |
| 5 | section_image-inset-single / section_split-image-text-light | Figma image 1 narrower (244px) left aligned, paragraph, then image 2 right aligned (244x200). Live shows both images full width back to back, then the paragraph (order and stagger differ). | high |
| 6 | section_split-card-pair-captioned | "MORE AROUND TOWN" heading left aligned in Figma (blog-indiv), centered on live; tile labels uppercase 20px in Figma vs mixed case ~22px on live. | med |
| 7 | section_card-carousel-header-left | Live adds arrows; card size and label size differ (see press 11). | high |
| 8 | section_offers-slider-split | Image missing inside maroon block; separate full-bleed image below on live. | high |
| 9 | section_cta-booking-newsletter | Extra rule; inline email + JOIN US on live. | high |
| 10 | site-nav_menu-footer | Footer link pitch, alignment, hairlines, wordmark size differ. | high |

## Shared components

Differences that repeat on three or more of the five pages. Fixing the component fixes all pages.

| Class family | Difference (Figma vs live) | Severity |
|---|---|---|
| site-nav_component | Figma mobile bar has a moon / sun theme toggle at the right; live shows "BOOK NOW" text and no toggle (Book Now is meant to open the booking sheet, see the nav-mobile frames). | high |
| site-nav_menu-footer (footer) | Figma: link pitch 44px, headings 18px, links 13px, hairlines above the link grid and above the wordmark, "TRIBUTE PORTFOLIO" ~28px centered, centered copyright (12px). Live: pitch ~29px, headings ~16px, links ~12px, no hairlines, wordmark ~18px left aligned, copyright and credit left aligned ~13px. Link set differs (live adds Blog, Happenings, Solana Coffee, Garden Terrace; verify with the content owner). | high |
| section_cta-booking-newsletter | Short divider rule between "Book your escape" and "Stay in the loop" exists only on live; newsletter email field + JOIN US are inline on live vs stacked (full-width underline, button centered below) in Figma; Marriott Bonvoy block is separated by a hairline in Figma. | high |
| section_offers-slider-split | Slide image should sit inside the maroon block with 20px gutters (350px wide) between title and description; live drops it outside as a full-bleed photo below the block and leaves an empty band inside. Eyebrow 12px / title 28px / pager 12px in Figma vs ~16 / ~30 / ~16px live. | high |
| section_card-carousel-header-left | Live shows prev / next arrows under the intro copy; Figma has none on mobile. Card 310x436 in Figma vs ~256x360 live; card label 20px vs ~14px; body 16px vs ~18px. | high |
| section_tab-pills-intro | Mobile category selector: Figma is a closed 220x40 dropdown (active label + hamburger) overlapping the hero edge; live is a taller pill (up to ~360px wide, two rows) with all tabs and no hamburger. Intro heading 53 to 56px in Figma vs ~44px live; body 16px vs ~18px. | high |
| section_article-card-staggered | Staggered left / right-indented 305px cards (96px gap, labels indented with the card) in Figma; live single full-width column. Card title 14px vs ~16px, description capped at 244px vs full width, image 305x200 vs ~326x230. | high |
| section_hero-fullbleed-centered | Hero 800px in Figma vs 100svh (~844px) live; description ~18px live vs 16px Figma; on indiv pages live adds an eyebrow category and a larger mixed-case title. | low / med |
| section_faq (press, happenings-collection, blog-collection) | Questions ~20px (3 lines) vs 18px (2 lines); answers ~18px vs 16px; open row chevron points down on live, up in Figma. | med |
| Body copy sitewide | Figma body is 16px / 20px leading everywhere; live body is ~18px / 23px on intro, card, article, form and carousel copy. Likely a single base text size token to correct. | med |
