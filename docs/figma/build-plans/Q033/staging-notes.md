# Q033 staging check: /rooms

Checked https://the-guild-hotel-c34e71.webflow.io/rooms with Playwright chromium at 1600, 1440 and 390 wide. Screenshots: `staging-1600.jpg`, `staging-1440.jpg` (both converted from PNG, over 4MB) and `staging-390.png`. Figma crops compared at 1600.

## Pass

- Body order is correct at all widths: site nav, hero, script-intro-centered, three quiz sections, recommendations, room grid, map-feature, placeholder (Q008), faq-accordion, cta-booking-newsletter, footer-links, placeholder `#all-rooms` (Q007).
- Hero heading "rooms & suites" and subline present; nav matches Figma (hero image area is the grey placeholder in both).
- Intro: script heading, body copy and stamp image render and match.
- Quiz 1-3: burgundy left panel, counters 01/03, 02/03, 03/03, headings, "see all the rooms" link and right-hand images all present and unbroken. Option buttons fill the 326px column at 1600, 1440 and 390. Selected option is cream filled with burgundy text and a chamfer clip-path; the others are outlined chamfered pills.
- Recommendations: heading, copy and the two links match.
- Room grid: 2x2 image cards, titles readable over a bottom gradient, "view more" pill present, no broken images.
- Map: heading, copy, button and map image match.
- CTA and footer: match, including Bonvoy logo, email line and Join us pill.
- No horizontal scroll at 390 (scrollWidth 390 = clientWidth 390). No broken images at any width.

## Mismatches (Figma vs staging)

1. FAQ accordion: staging shows all six answers expanded and every question underlined (default link underline on `a.accordion_header`). Figma shows only the first open, the other five collapsed as single rows with no underline. Section is 1890px tall vs about 1195px in Figma. Either the accordion JS did not initialise or the closed state is not the default.
2. Quiz option buttons are too small at desktop: 37px tall with 16px text. Figma is about 70px tall with 20px (H5-caps) text and about 90px pitch. Quiz heading and counter sit slightly higher than Figma (about 2px) but the heading size (24px) is right.
3. Quiz section height: 900px (quiz 2 and 3) and 1008px (quiz 1) vs Figma 900 and 1009/980. Quiz 1 is fine; the buttons being small leaves a large empty gap between the heading and the options and between options and link.
4. Room grid: staging shows "4 guests / 52 m2 size" meta and "view more" on all four cards. In Figma only the hovered card shows the meta and button, the others show the title only. Cards are 900px tall at 1600 (Figma crop 1998px includes about 80px of cream padding above and below); staging has no top padding in that band but 80px section padding is present below, so check the section padding.
5. Room grid image crops differ slightly from Figma (card 1 and 2 object-position shifts; the pendant lamp and window are cropped differently).
6. Script intro height: 1068px at 1440 and 1600 vs 856 in Figma. The heading and body sit about 90px lower and there is about 200px of extra cream space at the bottom.
7. Hero: 900px tall vs 1009 in Figma (viewport-height vs fixed). Heading is about 4px lower.
8. Map: the "We've lived here for a century" line wraps to two lines (about 190px column); Figma keeps it to one line (about 260px column). Discover more button is 10px lower as a result.
9. CTA email field: Figma shows the "*EMAIL" label inside the underline field; staging shows an empty line with no label (placeholder or label missing).
10. Footer link columns: the first columns are 1px lower and the "Experience" column items are spaced about 1px tighter than Figma; negligible.
11. Mobile (390): hero subline is partly covered by the "Made in Webflow" badge (badge is staging-only). Room card meta and button use a large size and the meta "4 guests / 52 m2 size" runs wide; no Figma mobile frame to compare.

## Measurements

- 1440 / 1600 section tops and heights (1600): hero 900, intro 1068, quiz1 1008, quiz2 900, quiz3 900, recommendations 494, room grid 1920, map 1335, placeholder 188, FAQ 1890, CTA 979, footer 700, placeholder all-rooms 188. Total page height 12470 at 1600, 12290 at 1440, 11258 at 390.
- Quiz option: width 326px, height 37px, padding 9px 24px, font-size 16px at all three widths. Selected: background rgb(244, 239, 223), colour rgb(74, 18, 23), clip-path polygon with 12px chamfer. Unselected: transparent, cream text (classes `button is-chamfer is-outline-light`); outline is not visible via border (border 0) so it is drawn by a pseudo-element or background.
- Quiz heading 24px (matches Figma H4-caps 24). Figma option text is 20px.
- h1 font-size: 40px at 1440/1600, 30px at 390.
- 390: quiz option column x 32 to 358 (326px); no overflow.
- Room cards: 4 `rooms-collection-room-grid_card` anchors, 900px tall each at 1600 (no explicit square ratio).

## Console

- No errors from the site's own code, no failed requests, no 404s.
- `OTS parsing error: Size of decompressed WOFF 2.0 is less than compressed size`: one font file is rejected by the browser (appears at all widths). Worth finding which font (probably a custom upload) and re-uploading.
- `%c%d font-size:0;color:transparent NaN` error and warning: Webflow/runtime logging noise.
- `Connecting to 'data:,' violates the Content Security Policy` (x3) and `Fetch API cannot load data:,`, plus `[Cloudflare Turnstile] Error: 600010`: Cloudflare Turnstile in the newsletter form on the staging domain; not a page defect.
- `GL Driver Message ... GPU stall due to ReadPixels` and `No available adapters`: headless Chromium WebGL warnings (hero WebGL), not a defect.

## Fix after the check
- Quiz option buttons: `rooms-collection-quiz_option` is now `display: grid` with `min-height: 4.375rem` (3.5rem small), so the inline-flex chamfer button stretches. Re-measured on staging at 1600: 70px tall. Text stays 16px.
