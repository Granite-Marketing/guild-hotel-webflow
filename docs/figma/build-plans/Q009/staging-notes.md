# Q009 staging verification: Card Carousel Header Left

## Method
Playwright (chromium, @playwright/test) against https://the-guild-hotel-c34e71.webflow.io/build-card-carousel-header-left at 1440x900 and 390x844. Section screenshots per instance. Runtime pass injected Swiper 12 CSS/JS from jsDelivr plus an esbuild iife of src/utils/cardCarouselHeaderLeft.ts (globalName `cc`) and called `cc.cardCarouselHeaderLeft()`. No page errors.

## Static pass
| Check | 1440 | 390 |
|---|---|---|
| Base section height | 965.6 | 767.4 |
| Compact section height | 807.6 | 767.4 |
| Base padding-top | 215px | 80px |
| Compact padding-top | 136px | 64px |
| First card x / width | 687 / 356 | 20 / 256 |
| Figure heights cards 1-3 | 502, 352, 463 | 360, 256, 332 |
| Heading | 40px / 40px lh, Sackers Gothic, 900 | 32px / 32px lh, Sackers Gothic, 900 |
| Label | 18px Sackers Gothic, rgb(41,49,12) | 16px, rgb(41,49,12) |
| Horizontal overflow | scrollWidth 1440 | scrollWidth 390 |

- Compact root has class `w-variant-c59c2441-38e4-6521-05ae-61ab04e20bf2`; base does not.
- Base has 6 cards (rooms, dining, wellness, meetings & events, arts, history). Compact has 3 (cozy king, guild city level loft, guild loft suite); cards 4 to 6 are absent from the DOM.
- Card 1 image in compact renders (naturalWidth 1712, 356x502 at 1440, 256x360 at 390).
- Base images: none (placeholders, as designed).

## Runtime pass
- Start: prev arrow has `is-disabled`, next does not (both instances, both widths).
- Click next: first slide moves -388px at 1440 and -272px at 390 (exact). Prev loses `is-disabled`.
- 390: slider x=20, width 370 (to the right viewport edge, no overflow, scrollWidth 390). Arrows visible at x=20 and x=70, sit under the header text above the cards.
- Screenshots: staging-runtime-1440.png (base after one next click), staging-runtime-390.png.

## Layout vs Figma
- Base 1440: heading, text, arrow row and card positions (687, 1075), figure sizes and label placement match the Figma crop. Figma crop is 1600 wide so card 3 peeks in at the right; at 1440 card 3 starts at x=1463 (off screen), which is expected, not a defect.
- Paragraph sits about 6px lower than in the crop (text top about 301 vs 295 in the crop) and the arrow row about 2px lower (743 vs 741). Minor.
- Compact 1440: matches Figma layout. The staging card 1 shows a photo where the Figma crop shows a grey placeholder (intended per props).
- Figma crop arrow colours both dark; staging shows prev dimmed at start (expected is-disabled state).
- "Made in Webflow" badge appears in screenshots (staging only).

## Issues
None blocking. Minor: paragraph about 6px lower than Figma at 1440 (heading to text gap).
