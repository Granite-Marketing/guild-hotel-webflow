# Mobile measured audit brief (390px vs mobile Figma)

Stephen's words: "run through EVERY block and make sure alignment, shapes, sizes are correct. There's too many inconsistencies. Pay attention to the mosaic type layouts with floaty images and how some elements change on mobile." Earlier: "Visually, it's okay, but spacing, sizing, and the fine details are just being completely missed."

The earlier comparison (`docs/figma/mobile/compare/`) eyeballed screenshots. This audit MEASURES. Read-only on Webflow: no Designer or Data API writes, no publishing, no commits.

## Method, per page, per block (top-level section), at 390px

1. Figma: `figma/mobile/nodes.json.gz` (gzip JSON, page frames under `nodes[*].document`; find the frame id in `figma/mobile/index.json`). For each section-level child record, relative to the frame: section box and padding; every image or figure (x, y, w, h, aspect ratio, corner shape: chamfer vectors/masks vs plain rect); headings and text (x, w, font size, line height, letter spacing, text-align, case); buttons (x, w, h, fill/outline); dividers; and the vertical gaps between consecutive elements. For mosaic or collage layouts (floating, offset, overlapping images) record every image's x, y, w, h and z-order.
2. Live: Playwright with `@playwright/test` and `chromium.launch({ channel: 'chrome' })`, viewport 390x844, staging https://the-guild-hotel-c34e71.webflow.io. Write scripts inside the repo dir (so the package resolves) and delete them after. Scroll the page through once slowly so reveals fire, then for each block read getBoundingClientRect (document coordinates) and computed font-size, line-height, letter-spacing, text-align, clip-path, aspect-ratio and object-fit of the matching elements, plus their class lists. Measure pinned or animated sections in their settled state.
3. Flag: any size, position or gap difference over 4px; image aspect over 3% off; any font-size or line-height difference; any alignment difference; a shape difference (chamfer vs plain); an element present in one and missing in the other; an element whose mobile arrangement differs from Figma (stacking order, slider vs grid, visibility).
4. For each block with problems save `docs/figma/mobile/audit/img/<page>-<n>-figma.jpg` and `-live.jpg` (JPEG quality 60, 390 wide; Figma crop scale = render image width / 390, render in `figma/mobile/renders/<section>/`).

## Output

`docs/figma/mobile/audit/<file>.md`: per page, a table: block | element | live class (with combo) | property | Figma | live | fix (property: value below 768px). Then "Fixes by class family": class or combo | property | current -> target | pages affected | shared-component risk. Terse and exact, no em dashes. Desktop is correct and must not change, so every fix is a below-768px value.

Return a summary under 12 lines: issue count per page, the 5 worst, the file path.
