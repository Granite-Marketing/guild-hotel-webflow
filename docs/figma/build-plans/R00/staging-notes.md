# R00 staging check (injected scripts)

The site scripts are not live yet (see `docs/figma/follow-ups.md`, R00). To check the bundle against the real staging DOM, Playwright intercepted each staging page and inserted the head and footer code from `docs/reference/site-scripts.md`, with the bundle at the commit-pinned URL (`1e3e1429`, identical to `dist/index.js`). Chromium, 1440x900; nav also at 390x844. Nothing on Webflow changed.

| Check | Page | Result | Evidence |
|---|---|---|---|
| navToggle | `/` | PASS | `is-nav-open` and `aria-expanded="true"` on click, Escape closes, at 1440 and 390 |
| navToggle | `/build-site-nav` | expected FAIL | page footer still carries an inline navToggle copy, so two bindings cancel each click; goes away when the page footer block is emptied |
| galleryFilter | `/gallery` | PASS | 10 items; each tag filters (2, 2, 2, 2, 1, 1), active tag gets `is-active` and `aria-pressed`, "all" restores 10 |
| historyStickyYear | `/history` | PASS | badge steps 1924, 1924-1970, 2019, 2026 while scrolling |
| history collapse | `/history` | PASS | four items converge, scale to about 4.4 and fill the viewport across the pin |
| accordion | `/`, `/gallery` | PASS | six headers each; open sets `is-active` and max-height, opening another closes the first |
| scrollEnlargeSnap (A01) | `/` | PASS | one pin; media frame grows 1129x637 to 1360x860; active item steps through the list |
| imageStackCollapse (A02) | `/` | PASS | three item centres converge from 197, 720, 1243 to 720 |
| imageTrailHover (A03) | `/` | PASS | up to three trail items become `is-active` on mouse move |
| Lenis and ScrollTrigger | `/` | PASS | `html.lenis`, two triggers, wheel scroll moves the page |
| offersSliderSplit | `/build-offers-slider-split` | PASS | three sliders; counters 01 / 05, 02, 05; next and prev step the counter |
| imageHoverScale | `/rooms` | FAIL | module initialises, but `.rooms-collection-room-grid_overlay` (absolute, pointer events on) covers the figure, so it never gets `mouseenter`; a synthetic `mouseenter` gives `scale(1.05)` |

No console errors from site code, the bundle or the CDN scripts on any tested page. Not checked: 390px for the non-nav modules, and scrollEnlargeSnap tabs (none on Home).

Screenshots: `s2-gallery-filtered.png`, `s3-history-year-2.png`, `s5-A01-snap-0.75.png`, `s6-offers-0-next.png`.
