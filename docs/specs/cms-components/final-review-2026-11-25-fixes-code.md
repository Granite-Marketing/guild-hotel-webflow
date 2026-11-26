# Final review fixes, round 1, Lane A: code (2026-11-25)

Brief: [fixes](final-review-2026-11-25-fixes.md), Lane A. Every fault was reproduced on https://the-guild-hotel-c34e71.webflow.io (bundle v1.3.23) with headless Playwright, then proven by loading staging with this branch's built `index.js` and `site.css` swapped in by request interception. No version bump, tag, publish, Webflow or CMS change. The Webflow lane published at 21:24, 21:54 and 22:22 during this work; every failing comparison was re-run back to back before and after.

## Webflow changes this branch needs (not made here)

1. **Button Styles embed in Site Nav** (`<style data-button-system>`): paste the minified `docs/reference/site-head/button-system.css` (`npx esbuild docs/reference/site-head/button-system.css --minify --target=chrome100`, 8.8 KB). It retargets the Retail and Arts & Culture slider colours to `.blue` and `.tan` and drops the dead variant id `0e56f707`. Until then the bundle carries the two colour lines (`offers-slider-buttons.css`); delete that file after the paste.
2. Nothing else. Every other fix ships in the bundle.

## Items

| Row | What was wrong | Fix | Proof | Left |
|---|---|---|---|---|
| W-R1 | Retail and Arts & Culture slider buttons were cream with burgundy: the colour rules keyed on two deleted variant ids; the sections now carry `blue` and `tan`. | Rules scoped to `.section_offers-slider-split.blue` / `.tan` (button-system.md rows 17, 18), in the embed source and, until it is pasted, in the bundle. | At all five widths: Retail fill `#262118`, label `#b2c5d5`; Arts fill cream, label tan `#906e58`. Hover wipe checked from timed frames (0 to 600ms). Retail buttons are now hidden by the Webflow lane while their links are empty; checked by forcing them visible. | Embed paste above. `blue` and `tan` are machine-made class names (W-R5); if they are renamed, update these two selectors. |
| W-R3 | George Marston was tilted 7.4 degrees on phones. Cause: the slider's Tan variant style sets `transform: rotate(-7.38deg)` below 768px, and our -5 degree rule keyed on the old component's variant id, so it and the spacing never applied. | Rule and `scriptTiltSpace` keyed on `[data-wf--split-image-text-slider--variant]` (survives a variant rename or a new id); `rotate: -5deg; transform: none` below 768px. | 1440, 991, 800: level, unchanged. 650 and 390: -5deg, transform none, 25/38px and 15/26px clearance; the paragraph sat 5px into the heading at 650, now 45px clear. Fixture test updated. | The Tan variant's transform could be removed in Webflow; harmless as is. |
| W-R4 | Five variant ids in code matched nothing (checked against 23 published pages). | `0e56f707` removed from `buttonHover.ts` and the embed source; `9cd3f054` replaced (R3); `1993beed`, `33c1374c` replaced (R1). `72048989` left as asked. | `git grep` shows only `72048989` left; layout sweep shows no other change. | Embed paste above. |
| P-E3 | Dark nav on dark photos narrower than 60% of the screen (Garden Terrace gallery, Neighborhood split photos, Press cards). | `navTheme` keeps the mask clone but splits the bar into columns at a narrow photo's edges: over a clearly dark photo (70% of pixels below 0.2 luminance, 90% below 0.4, read once from its smallest file) the nav is cream across that photo only. Day and night click, menu open and close keep working (v1.3.17 fix kept). New test `nav-theme.spec.ts`. | Readability sweep: 14 pages, 5 widths, every 180px, share of nav letters with contrast under 2:1. At 1440, stops with unreadable letters 209 to 163; the cited Garden Terrace and Neighborhood views fixed (screens and timed scroll frames). Smaller gains at 991 and 800, none at 650 and 390 (photos there are mostly over 60% wide, already handled). | One photo got worse: the Petco Park press card (dark with a pale sky strip), logo reads less well over the sky. Light photos on dark sections keep cream text (out of this row). A tone per strip of the photo would fix both; not done (a design choice about colour flips inside one photo). |
| P-E7 | On a touch phone the gallery's filter, zoom and exit pills (z-index 1001) covered an open artwork pop-up. | Pills hidden while a dialog is open (`gallery-canvas-runtime.css`, bundle). | 390 touch: hidden while open, back when closed, Exit still works. | |
| P-B8 | At 650 and 390 the pinned venue frame's spacer (pulled up half a screen) caught taps on the copy above, e.g. "view floorplan" on rooms. | `pin-spacer` of those stages gets `pointer-events: none` (stage children keep theirs). | Tap target now the link at 650 and 390; frame and tabs still hit on rooms, dining, wellness, meetings, arts. 1440 to 800 unchanged. | The link itself is still `#` (content). |
| P-F6 | The head snippet's `<script data-day-night>` got `role=button`, `tabindex`, `aria-pressed`. | Buttons selected by value (`="day"`, `="night"`). | Live: script tag keeps only its attribute. Test added in `day-night.spec.ts`. | |
| P-F5 | On a night load Day looked pressed for about 0.5 to 1.7s. | `day-night.css` (bundle): before `night-ready`, Night shows at full strength and Day dimmed. | Sampled every 100ms at 1440 and 390: Night pressed from the first frame with `is-night`. | `aria-pressed` still says Day until the bundle runs (about 1s); fixing that needs the head snippet in Webflow, not asked. |
| P-E21 | `.fade-in`/`.slide-in` not found on every page; `scrollEnlargeSnap` warning on the four listings. | Presence guards; the snap warning only when a section has items but no frame. | Console clean of both on all pages checked. | |
| P-E20 | Empty paragraphs in the Legal and Corporate package cards made the line mask warn ("GSAP target not found"). | No `gsap.set` on an empty line list. | Warning gone on both pages. | The empty paragraphs are content (Webflow). |
| P-E10 | With a mouse in a window under 768px the gallery filter shrank to a 32px sliver. | Filter bar width set like the touch bar (`gallery-canvas-runtime.css`). | 650 and 390: 586px and 326px, dropdown opens, picking a filter works on /gallery and /arts. | Scrolling past, the bar passes over the nav as before, now wider (mouse in a narrow window only). |

Rows of the other lane: none found in Lane A.

## Checks

- `pnpm run check`, `pnpm test:factory` (41/41), `node --test tests/scripts` (6/6), `pnpm run build` (same bytes as the tested build; `dist/` left out).
- `pnpm test:figma`: 83/84, the failing brief check fails on main too.
- Playwright: 208 passed, 10 failed, 4 skipped. The same 10 fail on main (gallery canvas, hero image scale, history sticky year, rooms quiz, sticky CTA).
- Other pages: element-by-element layout and style dump of 20 pages at 5 widths, before twice and after once; only the changes above, the rest was staging drift from the Webflow lane, confirmed by back-to-back runs.
- Console: remaining warnings are the WOFF font decode and a Google Maps WebGL message, both also without this branch.

## Round 2 (2026-11-26)

From the independent check (`final-review-2026-11-26-check.md`). Bundle only; no release, tag, Webflow or CMS change.

| Row | Was | Now | Proof | Left open |
|---|---|---|---|---|
| P-E3 | The dark logo and Book now sat on dark photos (Garden Terrace 4550 and 9800, /press 4900 and 6300, /neighborhood 3150 at 1440, contrast about 1.0 to 1.5). The rule judged a narrow photo by one tone for the whole picture. | `navTheme` reads each narrow photo as a 48-column tone grid (once, from its smallest file) and every frame judges the strip right behind each nav group (menu and day/night, logo, Book now), through the photo's object-fit. A group turns cream only while that strip's median is dark (below 0.16 to switch, back above 0.23), only while the photo covers the group's full height, and judges 24px above and below the text, so details and photo edges never flash it. Mask clone, the wide-photo rule (60% and wider stays cream), the day/night clone rebuild and menu open and close are unchanged. Test added in `nav-theme.spec.ts` (a dark photo with a pale top strip). | Staging with the built bundle swapped in, 6 pages (the 3 cited plus /, /dining, /rooms), 5 widths, every 150px, animations on; contrast measured from screenshots on the logo and Book now letters (nav shown versus hidden). Stops under 2:1 at 1440: 54 before, 28 after (under 1.5:1: 33 to 13). Every cited view fixed: Garden Terrace 4650 logo 1.06 to 13.8, 9900 Book now 1.25 to 11.1; /press 4950 logo 2.4 to 6.0; /neighborhood 3150 1.27 to 17.5. 991 and 800: 2 stops better each; 650 and 390: no change (no narrow dark photos left there). Two stops slightly worse, both borderline (/neighborhood 9750 and 12600 at 1440, now 1.9). Scroll test at reading speed (1440, 991, 390): no colour change that reverts within 3 frames, same as live; day/night click mirrored in the clone. | What is left at every width is the opposite case, the cream nav over pale photos that span 60% or more of the screen or sit in dark sections (for example /rooms quiz at 991 and 800, /press cards at 991 and 800, /neighborhood rooms at 650). That is the wide-photo rule the brief said to keep. |
| P-E3 taste | Petco Park press card: dark photo with a pale sky strip. | Dark logo over the sky, cream once the stadium reaches the bar (each nav group decides on its own strip). Chosen because dark letters on a pale sky read far better than cream ones. | Screens at 1440 through the card. | |
| P-F5 | On a night load Day still said "pressed" to screen readers for about 1s at 1440 after first paint. | The pressed state (and `is-active`) is set from the cookie as soon as the bundle runs, before `Webflow.push` (`dayNightPressed`). | Night cookie, 3 loads each: at 1440 correct 0.19 to 0.24s after first paint (live 0.98 to 1.18s); at 390 0.11 to 0.41s (live 0.25 to 0.28s, about the same). | Exactly from first paint needs the head snippet to set it too, which means one line in Webflow's head code (not touched). |

Checks: see below.

### Round 2 checks

- `pnpm run check`, `pnpm test:factory` (41/41), `node --test tests/scripts/*.test.mjs` (6/6), `pnpm run build` (`dist/` left out of the commit, as in round 1).
- Playwright: 209 passed, 10 failed, 4 skipped; the same 10 as round 1 fail on main too (gallery canvas, hero image scale, history sticky year, rooms quiz, sticky CTA).

## Round 3 (26 Nov): all photos keep the white menu

Stephen, 26 Nov: "photos should be white", then "Yes, all photos white". This overrides the P-E3 rounds 1 and 2 tone sampling: every photo under the bar, wide or narrow, dark or pale, keeps the cream nav (narrow ones across their own width only). Tone grid and per-group strip code removed from `navTheme.ts`; `nav-theme.spec.ts` updated.
