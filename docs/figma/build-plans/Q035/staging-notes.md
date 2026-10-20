# Q035 staging check: /meetings

Page: https://the-guild-hotel-c34e71.webflow.io/meetings. Captured with Playwright chromium at 1600x900, 1440x900 and 390x844 (staging-1600.jpg, staging-1440.jpg, staging-390.jpg in this folder). Figma comparison was made visually and by measurement against the 02, 03 and 08 section crops; 04 and 05 were not opened separately.

## Pass

- Published HTML contains `section_meetings-collection-features` on the first fetch. Body order matches the brief: Site Nav (base variant), hero (text-dark, heading "meetings & events at the guild"), venue-card-fullbleed with `data-scroll-enlarge-snap`, form-split-script-contact (tall), map-feature is-image-bg, meetings-collection-features, gallery-mosaic-captioned, offers-slider-split, faq-accordion, cta-booking-newsletter, footer-links, then the `#council-boardroom` dialog.
- Venue section has three `data-scroll-enlarge-snap-content` panels, the intro heading and the tabs nav with three tabs (council boardroom, lobby terrace, 1 america plaza).
- No horizontal overflow at 390 (scrollWidth 390), 1440 or 1600.
- Intro frame, chamfered corners, maroon tabs pill, script heading and paragraph match the 02 crop closely. Heading is 80px Morello Pen at 1600.
- Features section: figure width (484px) and height (596px) at 1600 match the Figma proportions, grey placeholder fill, bullet lists with hairline dividers, sticky intro on the left.
- Council boardroom panel (white text, "Nullam scelerisque..." copy, discover more button) matches the 03 layout.

## Mismatches

1. "book your space" button in the features intro renders as plain text with no dark chamfered pill background. Figma shows a dark olive filled chamfer button with light text.
2. Card headings (Event Services, AV Capabilities, Hotel Amenities) render in mixed-case small caps at 16px. Figma shows small uppercase tracked eyebrow text, visibly smaller.
3. List items are 20px with about 8px left padding, and are slightly larger and indented compared with the Figma lists, which sit flush with the figure edge and look about 16px. Confirm in Figma values.
4. The third tab shows as "| AMERICA PLAZA": the leading "1" renders like a vertical bar in the eyebrow font. Figma used different tab labels (terrace, conference center), so this is a font glyph issue to check.
5. The 03 Figma crop has a small dark square thumbnail at the bottom left of the panel. Staging has no such element on the council boardroom panel.
6. Staging panels are grey (#7f7f7f overlay) while Figma uses light grey (#d9d9d9) placeholders. Expected while images are missing, but the council boardroom panel has no image by design.
7. Venue section total height is 4032px at both 1600 and 1440 and 3739px at 390, so snap scroll length is long. Not a Figma mismatch, but worth a feel check.
8. Features section height is 3335px at 1600 and 2714px at 390. At 390 the three figures are 431px tall each, which makes the mobile stack long.

## Behaviour

- scroll-enlarge-snap runs. Media frame grows from 1262px to 1520px wide while scrolling, and the active item and tab change from council boardroom to lobby terrace to 1 america plaza (is-active on both the item and the tab).
- Council boardroom "discover more" (`[data-modal-open="council-boardroom"]`) is only visible when the panel is in view (opacity 1 near scrollY 2400 at 1600). When clicked there, `#council-boardroom` gets `is-open`, aria-hidden false, visibility visible, opacity 1, 1600x900, and the trigger gets aria-expanded true. ESC closes it: class is-open removed, aria-hidden true, visibility hidden.
- Offers slider initialises: `swiper`, `swiper-fade`, `swiper-wrapper`, `swiper-slide`, `swiper-slide-visible` and `swiper-slide-next` classes are present.
- FAQ: the accordion has no `aria-expanded` or details elements, so open or closed state could not be read from attributes. Needs a visual check in the screenshot.
- Hero heading 40px Sackers Gothic, colour rgb(38,33,24). Venue heading colour rgb(41,49,12).

## Console

- Warnings: GSAP target `.slide-in` not found and `.fade-in` not found. These classes are not on this page.
- Errors: Cloudflare Turnstile related. CSP blocks `data:,` connections, Turnstile error 600010, and a postMessage origin warning. These come from the form's Turnstile widget in the headless browser.
- Other: "No available adapters", a WOFF2 OTS parsing error (one font file decompresses smaller than compressed, worth checking which font), `%c%d font-size:0` log lines, and WebGL ReadPixels GPU stall notices.
- No uncaught page errors from site code.

## Fix after the check
- Mismatch 1: "book your space" now uses the existing `button is-chamfer is-dark` combo (the base chamfer is cream on cream). Published HTML confirmed.
- Mismatch 2: `meetings-collection-features_card-heading` and `_heading` now set `text-transform: lowercase` (Figma text case LOWER), so the caps font renders evenly.
