# Group B: Dining (mobile 390, Figma vs live staging)

Method: Figma renders (index.json page frames) vs `figma/mobile/.live/<slug>.jpg`, plus `nodes.json.gz` specs. Figma values are CSS px at 390 wide. Live sizes are estimated from the screenshot (about +/- 2px). The full-page live captures include fixed/sticky artefacts (nav and hero repeated near the bottom); those are capture noise and are ignored.

Note on the three template pages (gardenterrace, lobbybar, poollounge): their Figma frames are identical in structure (olive split section, no quote band), and the live pages are identical in structure, so the same differences apply to all three. They are listed once in full under dining-gardenterrace and cross-referenced below.

## dining-collection

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Figma bar: hamburger left, wordmark centered (194px slot), day/night icon pair (moon, divider, sun; 64px target) right. Live: hamburger, wordmark shifted off center, and a small "BOOK NOW" text link instead of the day/night toggle. No theme toggle on live. (Booking menu itself is a separate unbuilt task, see nav-mobile frames.) | high |
| 2 | section_hero-fullbleed-centered | Title "A TASTE OF THE GUILD": Figma 28px, single line. Live wraps to two lines ("A TASTE OF THE / GUILD"), so live is larger (about 32-34px) or narrower box. | med |
| 3 | section_hero-fullbleed-centered | Description: Figma 16/20, centered, two short lines. Live about 18/26, wraps and runs into the Made-in-Webflow badge area, so it looks heavier and taller. | low |
| 4 | section_hero-fullbleed-centered | Figma hero is 800px tall (390x800), CTA is a "SOLANA COFFEE" pill with a hamburger glyph at the bottom (venue selector trigger). Live hero is full viewport height (about 845px) and shows no selector pill in the hero. | med |
| 5 | venue-card-fullbleed_tabs | Figma "selector open" state: maroon chamfered panel (220px wide) listing ZUMA, THE LOBBY BAR, POOL LOUNGE, GARDEN TERRACE, SOLANA COFFEE (active, underlined) with an X close control, opened from the hero pill. Live has a plain inline `<nav>` of five `href="#"` links and no collapsed pill, panel or close button on mobile. Not visible in the screenshot, so needs a live check. | high |
| 6 | section_venue-card-fullbleed | Full-page capture shows about 10,000px of empty cream where the five 390x844 venue panels should be (the section is a pinned scroll-enlarge-snap stage, so the capture cannot show it). Cannot compare crop, wordmark size, copy size or button position for the five panels. Figma panels: full-bleed photo, centered wordmark, description, DISCOVER MORE pill. Needs a viewport-by-viewport check at 390px. | high |
| 7 | section_script-intro-centered | Script heading: Figma sets it on two lines ("First sips, small bites" / "& big nights out.", 320px box, Morello lettering). Live wraps to three lines ("First sips, small / bites / & big nights out.") because the script is larger. | med |
| 8 | section_script-intro-centered | Body: Figma 16/20. Live about 17/23, a little taller leading and larger; plus a large dead gap (about 100px) between body and the chamfered image. | low |
| 9 | section_map-feature | Matches closely (44px script title left, 16/20 copy, outline chamfer button, pannable 552px map). Only difference: live map starts slightly higher with less padding above the heading. | low |
| 10 | section_faq-accordion | Figma: eyebrow 12px, title 28/28, question 18/22 caps in a 56px target, answer 16/20, 1px dividers. Live question text and heading look about 15-20% larger/wider-tracked, so questions wrap to 3 lines ("IS AN ACCESSIBLE VERSION OF THIS ROOM AVAILABLE?") where Figma wraps to 2. Answer leading looks taller (about 23-24 vs 20). | med |
| 11 | section_offers-slider-split swiper_slider | Figma order: eyebrow "OFFERS & PACKAGES" (12px), title "SAVE ON 5+ NIGHTS" (28px), 350x390 padded image, text, DISCOVER MORE, arrows "02 / 05". Live: image is not visible in the slide, leaving a blank gap of about 100px between eyebrow and title; a full-bleed Zuma image sits below the section instead of inside it. Pager arrows are lower-contrast. | high |
| 12 | section_cta-booking-newsletter | Figma: BOOK NOW is a full-width (350px) cream pill; email field full width with JOIN US as a full-width pill beneath it. Live: BOOK NOW is a small centered pill (about 150px), email field and JOIN US sit on one row, with a thin divider between the two blocks. | med |
| 13 | section_cta-booking-newsletter | Marriott Bonvoy block: Figma has a divider rule below it before the footer links; live has no divider and the "EARN MARRIOTT BONVOY POINTS" line is larger. | low |
| 14 | section_footer-links | Link size: Figma about 10px caps; live about 12px. Figma column order/content differs (DINING lists Zuma, Lobby Bar, Lobby Terrace, Pool Lounge, In-Room Dining; no Blog or Happenings). Live adds Blog and Happenings and a different venue order. Likely content, flag only. | low |
| 15 | section_footer-links | "TRIBUTE PORTFOLIO" mark and copyright: Figma large (about 24px) and centered, legal lines centered. Live smaller, left-aligned, and "BRAND & WEBSITE BY STUDIO CIRCA" is an underlined link. | med |

## dining-zuma

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same as dining-collection #1 (no day/night toggle, BOOK NOW text link, wordmark off center). | high |
| 2 | section_hero-fullbleed-centered | Reserve-a-table CTA: Figma is a "fixed mobile CTA" at the hero bottom (194x36, 14px label), blue (about #4A9BD0) for Zuma. Live is a maroon pill. Wordmark placement is similar (Figma 240x58 at y=300). | med |
| 3 | section_hero-fullbleed-centered | Hero height: Figma 800px; live about 845px (full viewport). Heading/description sizes match closely (28px / 16px in Figma). | low |
| 4 | section_split-image-text-light (first) | Navy block with inset image matches (350 wide image, 14px inset). Heading "CONTEMPORARY JAPANESE DINING AT THE GUILD HOTEL": similar; live heading tracking looks wider. Body 16/20 in Figma vs about 17/24 live. | low |
| 5 | section_text-columns-info | Body text too large: Figma 16/20 for the intro paragraph, "Dress code" and "Hours of operation" copy. Live renders them at about 20/26 (about 25% bigger), so these blocks run about 40% taller. Also "Curabitur at magna diam" paragraph is the same oversize. | high |
| 6 | section_text-columns-info | Links: Figma shows two stacked underlined links, "BROWSE THE MENU" and "DISCOVER ZUMA" (small, about 10px). Live shows only "BROWSE THE MENU", larger (about 14px). | med |
| 7 | section_split-image-text-light (second) / section_image-pair-text | Figma "Explore the space" uses staggered portrait images: image 02 about 244px wide left, image 03 about 244x334 offset right, with copy between. Live stacks images at full content width (350px) and landscape/square crops, losing the stagger. | med |
| 8 | section_quote-band-dark | Quote: Figma 18/22 caps, blue (about #4A9BD0) on navy, British Vogue logo 160px, band 457px tall. Live quote about 20px, tracking looks wider, band similar height. Colour matches. | low |
| 9 | section_image-trio-text | "Group dining & events": Figma heading, copy and ENQUIRE link are left-aligned (350px column); live is centered. Figma gallery is a three-image swipe viewport (440px tall) with a 1/3 progress line beneath; live shows peeking neighbours and no visible progress line. | med |
| 10 | section_gallery-mosaic-captioned | Figma label "ZUMA GALLERY" on the first image (venue-specific); live label is just "GALLERY". Captions: Figma 10-11px caps with superscript index; live about 13px. Figma image heights 612 then 3x480; live about 480 each (first looks shorter). | low |
| 11 | section_card-stagger-header-left hide | Figma shows "OTHER DINING OPTIONS" (28px, left) with a left-aligned horizontal swipe carousel (508px tall cards, peeking next card "POOL..."). The live section carries the `hide` class and is not rendered at all. | high |
| 12 | section_faq-accordion | Same as dining-collection #10 (live questions larger, 3-line wraps). First item open in both. | med |
| 13 | section_cta-booking-newsletter | Same as dining-collection #12-13 (button widths, stacked vs inline join row, divider). | med |
| 14 | section_footer-links | Same as dining-collection #14-15. | med |

## dining-gardenterrace

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same as dining-collection #1. | high |
| 2 | section_hero-fullbleed-centered | Figma hero: title "GARDEN TERRACE" with a small italic sub-line (placeholder "Charlotte Rothschild Pine Apple") above a 16/20 description, then maroon RESERVE A TABLE pill (fixed CTA at hero bottom). Live has no sub-line; description about 18/26; CTA is maroon (matches colour). Hero 800px vs about 845px live. | low |
| 3 | section_split-image-text-light | Olive-green block with inset image matches; heading and body slightly larger live (body about 17/24 vs 16/20). | low |
| 4 | section_text-columns-info | Same oversize body as dining-zuma #5 (about 20/26 live vs 16/20 Figma) and missing the second link; here Figma only has BROWSE THE MENU, which is present but larger (14px vs 10px). | high |
| 5 | section_image-pair-text | Same stagger loss as dining-zuma #7. | med |
| 6 | (no quote band) | Figma has no quote band on this page and neither does live (matches). | low |
| 7 | section_image-trio-text | Same as dining-zuma #9 (centered vs left-aligned heading/copy/ENQUIRE; no visible progress line). | med |
| 8 | section_gallery-mosaic-captioned | Figma label "GARDEN TERRACE GALLERY"; live "GALLERY". Caption size larger live. | low |
| 9 | section_card-stagger-header-left hide | "Other dining options" carousel in Figma; hidden (`hide`) on live. | high |
| 10 | section_faq-accordion | Same as dining-collection #10. | med |
| 11 | section_cta-booking-newsletter | Same as dining-collection #12-13. | med |
| 12 | section_footer-links | Same as dining-collection #14-15. | med |

## dining-lobbybar

Structure identical to dining-gardenterrace in both Figma and live. Page-specific notes follow; everything else matches the gardenterrace table.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same as dining-collection #1. | high |
| 2 | section_hero-fullbleed-centered | Figma title "LOBBY BAR" with italic sub-line placeholder; live "LOBBY BAR" without sub-line, description about 18/26 vs 16/20. CTA maroon in both. | low |
| 3 | section_text-columns-info | Body about 20/26 live vs 16/20 Figma (see gardenterrace #4). | high |
| 4 | section_image-pair-text | Stagger lost (see zuma #7). | med |
| 5 | section_image-trio-text | Heading/copy/ENQUIRE centered live vs left in Figma; no progress line. | med |
| 6 | section_card-stagger-header-left hide | "Other dining options" hidden on live. | high |
| 7 | section_gallery-mosaic-captioned | Label "GALLERY" vs Figma "<VENUE> GALLERY". | low |
| 8 | section_faq-accordion, section_cta-booking-newsletter, section_footer-links | Same as dining-collection #10, #12-15. | med |

## dining-poollounge

Structure identical to dining-gardenterrace in both Figma and live. Page-specific notes follow.

| # | Live section class | Difference (Figma vs live) | Severity |
|---|---|---|---|
| 1 | site-nav_component | Same as dining-collection #1. | high |
| 2 | section_hero-fullbleed-centered | Figma title "POOL LOUNGE" with italic sub-line placeholder; live without sub-line; description about 18/26 vs 16/20. | low |
| 3 | section_text-columns-info | Body about 20/26 live vs 16/20 Figma. | high |
| 4 | section_image-pair-text | Stagger lost (see zuma #7). | med |
| 5 | section_image-trio-text | Centered vs left-aligned heading/copy/ENQUIRE; no progress line. | med |
| 6 | section_card-stagger-header-left hide | "Other dining options" hidden on live. | high |
| 7 | section_gallery-mosaic-captioned | Label "GALLERY" vs Figma "<VENUE> GALLERY". | low |
| 8 | section_faq-accordion, section_cta-booking-newsletter, section_footer-links | Same as dining-collection #10, #12-15. | med |

## Shared components

Keyed by class family; these repeat across all five pages.

| Class family | Repeated difference | Severity |
|---|---|---|
| site-nav_component | Mobile bar lacks the day/night icon pair and centered wordmark; shows a "BOOK NOW" text link instead. Booking menu (Book a stay, Reserve a table, Host an event, Book an appointment, then the full-page venue picker with back) is not built. | high |
| section_card-stagger-header-left (`hide`) | "Other dining options" carousel designed for all four venue pages is hidden on live. | high |
| section_text-columns-info | Body copy about 20/26 on live vs 16/20 in Figma; link type about 14px vs 10px; Zuma's second link "DISCOVER ZUMA" missing. | high |
| section_hero-fullbleed-centered | Hero about 845px vs 800px; description larger (about 18/26 vs 16/20); title can wrap to two lines; CTA is a "fixed mobile CTA" in Figma (blue on Zuma) and a maroon pill on live. | med |
| section_image-pair-text / section_image-trio-text | Figma staggered 244px portrait images and left-aligned "Group dining & events" with a progress line; live is full-width and centered, no progress line. | med |
| section_gallery-mosaic-captioned | Label should read "<VENUE> GALLERY"; captions larger on live. | low |
| section_faq-accordion | Question text and leading about 15-20% larger on live, causing extra wraps. | med |
| section_cta-booking-newsletter | Figma full-width BOOK NOW and stacked full-width email/JOIN US; live small centered pill and inline join row with a divider. | med |
| section_footer-links | Smaller centered Tribute Portfolio and legal block in Figma vs left-aligned smaller block on live; link type about 10px vs 12px; link lists differ (content). | med |
| section_offers-slider-split | Slide image missing inside the slide (dining-collection only, but the component is shared with other pages). | high |
| section_venue-card-fullbleed | Cannot be verified from the full-page capture (pinned stage); selector dropdown from Figma "selector open" is not present as a collapsed pill and panel on mobile. | high |
