# Q031 staging verification (Home, published staging)

URL: https://the-guild-hotel-c34e71.webflow.io/ (curl count of section_home-art-stories = 1 on first try).
Screenshots: staging-1600.jpg (1600x14813), staging-390.jpg (390x10614), full page after slow scroll.

## Pass list
- Body order of main's 14 children matches the expected order exactly at both 1600 and 390 (hero dark variant, script-intro, split-image-text-light variant, venue-card-fullbleed, image-trio-text, venue-card-fullbleed, map-feature, placeholder, home-art-stories, venue-card-fullbleed, placeholder, faq-accordion, cta-booking-newsletter, footer-links).
- No horizontal scroll at 390 (scrollWidth 390).
- Section 9 art-stories: h2 56px at 1600 (40px at 390), eyebrow 18px, main image loaded (naturalWidth 1080), all 4 trail images loaded (1080, 1080, 1080, 1425), trail images stacked at top-left of media as expected with JS off.
- Section 9 matches Figma 14: heading, eyebrow, outline "discover more" button, chamfered large image (1520x1568 at 1600, aspect about 0.97, Figma crop scales to about 1520x1567).
- 01 hero: heading, copy, "book your stay" button, nav (day/night, logo, book now) match Figma in position and colour.
- 02 script intro: building drawing, tilted script heading, body copy match Figma; background cream matches.
- 15 meetings & events: heading, subline, discover more button, accordion rows (Council Boardroom, Courtyard, Conference Center) match.
- 16 offers placeholder (Q008) renders as dashed grey placeholder text, as intended.
- 18 CTA booking/newsletter: scripts, buttons, divider, Bonvoy logo and caption match.
- 19 footer: five link columns and bottom row (copyright, Tribute Portfolio, Studio Circa) match Figma positions.

## Mismatches
- 03 split image text (olive): 
  - Image has `src=""` (empty), shows a broken-image icon on a grey block. Only genuinely broken img on the page.
  - "uncover our history" link computes colour rgb(38,33,24), dark on the olive background, nearly invisible. Figma shows cream underlined text.
  - Layout: Figma has cream bands above and below the olive block, with the image overhanging the olive band at the bottom (image 485x625 at 0.75 scale, olive band shorter than image). Staging is a full olive block (730px tall), no cream bands, image 515x661 inside it, no overhang. Text column sits further right (x 925 vs Figma about 945 at 1600 scale, close) and body text is larger than Figma (about 18px vs about 16px).
- 17 FAQ: all six items render expanded (answer visible); Figma shows only the first open and others collapsed with chevron up on the open one. Likely JS accordion not enabled; chevrons are all down. Item spacing is looser than Figma.
- 18 CTA: email input has no visible "*EMAIL" label or placeholder (Figma shows "*EMAIL" above the underline).
- 11/16 and 07/13 placeholders: not compared to Figma beyond text (expected to be placeholders).
- Page total height is 14813 while main's last section ends at 14764; about 49px extra after the footer (not investigated).
- Webflow "Made in Webflow" badge visible bottom-right (ignored).

## Measurements
- Section tops/heights at 1600 (px): hero 0/900, script 900/1187, split 2087/730, venue-card 2817/1041, image-trio 3858/1205, venue-card tall 5063/1579, map 6642/1335, placeholder 7977/188, art-stories 8165/1971, venue-left 10136/920, placeholder 11056/188, faq 11244/1890, cta 13134/930, footer 14064/700.
- Art-stories at 1600: h2 56px, eyebrow 18px, main image 1520x1568 at x=40; trail images each 328x467 at x=40 (same spot, JS off). At 390: h2 40px, eyebrow 18px, main image 350x467, trail images 176x251.
- Image check after scroll: 28 imgs, 1 with naturalWidth 0: the split-image-text-light image with empty src. All others loaded (an earlier no-scroll pass showed lazy images unloaded, which cleared after scrolling).

## Console errors
- Cloudflare challenge request failed (hagen.challenges.cloudflare.com), "Connecting to 'data:,' violates CSP" x3, "Fetch API cannot load data:," and two "%c%d font-size:0" log lines. All come from Webflow/Cloudflare bot-challenge scripts under Playwright, not from site code. No site JS errors.


## Placeholder images filled (2026-10-20)

Stand-in library photos (not the final design images), set through the Data API and checked on webflow.io staging: no grey placeholder remains. Added images use `u-image`.

- Olive split (`90b79982-e297-c0b3-51ca-2126deb935d0`) Image: `6ad67007cf42363c3ffe3d61`.
- home/13 retail placeholder replaced with Offers Slider Split, Blue variant (`30b825d4-bcde-7241-ae17-8d5c1209c9c0`): eyebrow and label "retail", heading "shops at the guild", Image 1 `6ad67011134731ad1b928045`, slides 2 to 5 hidden.
- home/16 offers placeholder replaced with Offers Slider Split, Base (`a5660ddd-9800-ec8a-c973-bd44cf6dfba3`): images `6ad66feb58367429abb4835f`, `6ad67000240d911fb18d77af`, `6ad67004134731ad1b927d6c`, `6ad66ffdba96f2e53726bd55`, `6ad6701a28c5dc695c82c539`.
