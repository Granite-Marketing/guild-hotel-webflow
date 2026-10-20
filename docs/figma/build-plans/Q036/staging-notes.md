# Q036 staging check: /history (read-only, 2026-10-20)

Screenshots: staging-1440.png (5.2MB, 1440x20929), staging-390.png (1.5MB). Page loaded with ?v=1, scrolled slowly first.

## Per-section verdict
01 hero: ok. Grey fill, "A Bold Promise" + tagline at bottom centre, nav overlay present.
02 script intro: ok. Script heading renders, cream bg.
03 centred image stack: ok. Grey image, heading and two paragraphs centred.
04 George Marston split (tan): ok, with one gap. Portrait, script name and text fine; the round stamp badge seen in the Figma crop is not visible on staging.
05 timeline: ok. Title, 1924/2026 labels, grey images, text blocks all present, no overlap.
06 A Landmark Reimagined: ok. Black bg, exactly 900px (100vh at 1440) and 844 at 390; four grey tiles, caption.
07 gallery mosaic: ok layout (full, half, half, full). Tiles show a broken-image icon in the top-left corner (img without a loaded src); grey boxes expected, icon is cosmetic.
08 map feature: ok. Heading, copy, map illustration.
09 placeholder: ok (expected dashed grey box, Q009 text).
10 FAQ: issue (minor). All six answers are expanded and question text is underlined; Figma crop shows the same open state for item 1 only. Confirm the accordion initial state and underline are intended.
11 placeholder: ok (expected, Q008 text).
12 CTA booking: ok. Two-column Book your escape / Stay in the loop, Marriott Bonvoy line, bg photo.
13 footer: ok. Link columns, copyright, Tribute Portfolio, Studio Circa.
Order matches Figma 01 to 13. No invisible text, no overlaps.

## Checks
- [data-history-sticky-year-item] count: 4. [data-history-collapse-item] count: 4.
- Sticky badge: the 1924 badge stays fixed at viewport centre (y=450 at 900 tall) across the whole of section 05 (scroll 0 to 100%), so CSS sticky works.
- Badge text does NOT change: stayed "1924" at every scroll step (never 1924-1970, 2019, 2026). Consistent with src/index.ts, where historyStickyYear() is still commented out (slot G). Published scripts on page are only jquery and webflow.js (no custom footer bundle seen in script srcs; may be injected inline).
- Console errors (1440): only a Cloudflare CSP "data:," connect-src block (Webflow/Cloudflare noise) and two "NaN" font-size:0 logs. No app errors. 390 run showed none beyond the same class.
- Overflow at 390: scrollWidth 390 = clientWidth 390, no horizontal scroll, no widest offender. 1440 also clean.
- Section heights at 390: hero 844, landmark 844 (both 100vh), timeline 5422.
