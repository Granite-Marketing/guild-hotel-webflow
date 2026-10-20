# Q008 staging check (the-guild-hotel-c34e71.webflow.io/build-offers-slider-split)

Method: Playwright, static pass (1440x900, 390x844) then runtime pass (Swiper 12 CDN plus esbuild iife of src/utils/offersSliderSplit.ts injected). Screenshots: staging-<base|blue|tan>-<1440|390>.png, staging-runtime-1440.png (base after one next click), staging-runtime-blue-1440.png, staging-runtime-tan-1440.png.

## Static pass (no Swiper, no bundle)
- All 3 instances render at 1440 as 900px tall sections. Only slide 1 visible per instance. No horizontal overflow at 1440 or 390.
- Left half 720px wide, figure 720x900 at x=720, figure background rgb(217,217,217) on base and tan (grey placeholder); blue shows the photo (720px wide, natural 1712px).
- Total label reads 05 on Blue until JS runs (placeholder text); JS corrects it to 02. Expected, not a bug.

## Computed styles
| Variant | Section bg | Heading | Button bg / text | Eyebrow / body colour |
|---|---|---|---|---|
| Base | rgb(74,18,23) burgundy | 40px, cream rgb(244,239,223) | cream / rgb(74,18,23) | cream |
| Blue | rgb(178,197,213) | 30px, rgb(38,33,24) | rgb(38,33,24) / rgb(178,197,213) | rgb(38,33,24) |
| Tan | rgb(144,110,88) | 30px, cream | cream / rgb(144,110,88) | cream |
- All three variant overrides apply (background, heading size, button colours, text colours). No surprises. Body text 20px / 26px line-height on all at 1440, 18px / 23.4px at 390. Counter 14px; prev arrow opacity 0.4 (disabled look), next 1.
- At 390 heading is 32px (base) and 26px (blue, tan).
- Font renders as Sackers Gothic (not a fallback).

## Layout vs Figma (1440 staging vs crops scaled by 1600/1200 = 1.333)
- Base: PASS. Panel colour, cream text, eyebrow top centre (y=42-64, centre x=360), button (191x37, cream bg burgundy text, y 497-534; Figma centre y 515 vs ours 515), controls at y~858 (Figma 857). Heading 40px, width 416 (Figma ~415). Minor: Figma heading centre y~403 vs ours 387 (about 16px higher) and body y~457 vs ours 452; button identical, so the heading to body gap in Figma is about 10px smaller than ours is large. Visual impact small.
- Blue: PASS. Light-blue panel, dark text, dark button with light-blue label, photo fills right half on slide 1 (720x900). Controls and eyebrow match. Not in the component: the cream cross logo overlay centred on the Figma photo (Figma shows it at about x=1170,y=565 of the crop); absent on staging. Confirm whether the logo is meant to be part of the component.
- Tan: PASS with one difference. Colours, eyebrow, heading 30px, button (cream, tan text) match. Body text wraps to 4 lines in a 506px box (104px tall); Figma wraps to 3 lines, so Figma text box is about 540px wide (~34px wider). This pushes the heading up (y 333) compared with Figma (heading centre ~393 vs ours 348 in 1440 terms, because the block is taller and centred). Consider widening the text max-width to about 540px (33.75rem) for the long-copy case.
- Eyebrow on tan at 1440 is one line (382px wide), as in Figma.

## 390 pass
- Content stacks above the figure: content area 544px tall (y 0-544), figure 390x288 below (y 544-832); section 832px.
- Controls at y=497-512, centred (x 106-285), inside the content area with no overlap on text (tan body ends about y=313, button y 339-376, controls start 497).
- Tan eyebrow wraps to 2 lines (43px tall) with no collision. Buttons 191x37 centred. PASS on all three.

## Runtime pass (1440)
- Base: total 05, current 01 on init. Next click gives current 02, heading "save on 5+ nights" -> "wellness staycation". PASS.
- Blue: total 02 (corrected from 05), current 01. Next gives 02, heading "fashionphile" -> "wellness staycation". Photo present in the active slide 1 (720px wide), slide 2 has no image so the grey placeholder shows. PASS.
- Tan: total 05, current 01. Next gives 02, heading "the midway museum" -> "wellness staycation". PASS.
- Loop mode plus fade works; no console-visible errors in the run (the script threw none). Slide 2 content on all three is the same placeholder ("wellness staycation").

## After the check

- Header max-width raised from 31.625rem to 33.75rem (540px) after this check, so the tan body wraps to 3 lines as in Figma. Not re-published; the next staging publish picks it up.
- The cream cross logo on the retail photo (home/13) is not built. It is likely part of the Fashionphile artwork; if it is an overlay, add it as a follow-up.
