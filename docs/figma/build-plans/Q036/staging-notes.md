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


## Placeholder images filled (2026-10-20)

Stand-in library photos (not the final design images), set through the Data API and checked on webflow.io staging: no grey placeholder remains. Added images use `u-image`.

- Hero (`39f63008-e245-a805-3e0b-fd98f3dd4087`): Image `6ad6700aba96f2e53726c671`, Show Image on, Variant switched from Text Dark to Base so the text reads over the photo.
- history-oasis figure: `6ad66ffb8d039779ba7cb0a7`.
- Timeline figures, in order (1924 wide, 1924 building, 1924 detail, 1924 portrait, 1924-1970 portrait, postcard, detail, 2019 wide, portrait, detail, 2026 wide, interior, detail): `6ad670147e3d6550932e0fac`, `6ad6701edd7f0762ee12bb55`, `6ad6701cf08ff78c37d862e1`, `6ad67002c159d4564be772e7`, `6ad67011134731ad1b928045`, `6ad66fef6684c3e22ea4dc76`, `6ad66ff96684c3e22ea4e1af`, `6ad67015134731ad1b928187`, `6ad66feb58367429abb4835f`, `6ad66fff134731ad1b927c11`, `6ad66fee735773f253407335`, `6ad66ffa6684c3e22ea4e2ca`, `6ad6701a28c5dc695c82c539`.
- Landmarks 1 to 4: `6ad66fe91ce40a5a6239b8ad`, `6ad6700eb28c9b39f95d814d`, `6ad66ffdba96f2e53726bd55`, `6ad66ff45794075272b9663f`.
- Gallery Mosaic (`52f28a89-ecc8-606e-0a16-c341dda479e1`) Images 1 to 4: `6ad6700aba96f2e53726c671`, `6ad66fed15beaf9a7285e5c8`, `6ad67019735773f25340899e`, `6ad67016f8bf4846e80a023a`.
- history/09 placeholder replaced with Card Carousel Header Left, Compact (`1d8e9af5-d4ac-dcff-bd4f-79d0619e921f`); card 6 relabelled "gallery" (`/gallery`), since this is the history page.
- history/11 placeholder replaced with Offers Slider Split, Base (`53cc018f-978c-1710-cd20-8c5b24c1cae0`) with five library photos.
