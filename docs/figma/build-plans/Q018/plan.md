# Q018 build plan: gallery-mosaic-captioned

Shared component, one variant (base), 10 instances. Build once on `/meetings` (page `6ad66fd96684c3e22ea4d417`) from `meetings-collection/09-meetings-events-gallery`, convert to a Webflow component, then insert instances; only content differs. Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q018/generate.mjs` (fills instances from the snapshot specs, validates the plan, writes the CSS and HTML) and `node docs/figma/build-plans/Q018/screenshot.mjs`.

## Layout

A full-bleed, four-tile mosaic on the cream section background: a wide tile, two half tiles, a wide tile, with 1px cream gaps. A small caps gallery heading overlays the first tile 2.5rem from its top-left corner (9 of 10 instances; history has none). Each tile has a numbered caption pinned 2.5rem from its bottom-left corner. All tiles are #D9D9D9 placeholders in Figma; no image fills exist yet.

## Tree

- `section.section_gallery-mosaic-captioned`
  - `header.gallery-mosaic-captioned_header` (optional, prop `headingVisible`)
    - `h2.gallery-mosaic-captioned_heading.heading-style-h4.text-weight-normal` (prop `heading`)
  - `div.gallery-mosaic-captioned_grid`
    - `figure.gallery-mosaic-captioned_figure.is-wide`
      - `img.gallery-mosaic-captioned_image` (prop `image1`)
      - `header.gallery-mosaic-captioned_feature-header` (optional, prop `featureTitleVisible`, off by default)
        - `h3.gallery-mosaic-captioned_feature-title.heading-style-h2.text-weight-normal` (prop `featureTitle`)
      - `figcaption.gallery-mosaic-captioned_caption.text-size-regular.text-style-caps-caption-16`
        - `span.gallery-mosaic-captioned_caption-index` "1"
        - `span` (prop `caption1`)
    - `figure.gallery-mosaic-captioned_figure` (image2, caption2, index "2")
    - `figure.gallery-mosaic-captioned_figure` (image3, caption3, index "3")
    - `figure.gallery-mosaic-captioned_figure.is-wide` (image4, caption4, index "4")

## Classes

- Family (11): `section_gallery-mosaic-captioned`, `_header`, `_heading`, `_grid`, `_figure`, `is-wide` (combo on `_figure`), `_image`, `_feature-header`, `_feature-title`, `_caption`, `_caption-index`.
- Reused: `heading-style-h4` (H4-CAPS 24/28.8), `heading-style-h2` (H2-CAPS 40/40), `text-size-regular`, `text-weight-normal`.
- Proposed shared, for K01: `text-style-caps-caption-16`, the combo the `figma/tokens.json` mapping suggests for CAPS-CAPTION-16 (16/19.2, -0.03em, lowercase Sackers). 242 uses site-wide.
- Variables: `color-neutral-100` (#F4EFDF, background and feature title), `color-neutral-900` (#262118, heading), `color-accent` (#29310C, captions, per D01), `font-style-heading`.

## Variants

Only `base`. Content differences are props:

| Instance | heading | featureTitle |
|---|---|---|
| meetings-collection/09 | MEETINGS & EVENTS gallery | "A Landmark Reimagined" (hidden, see questions) |
| history/07 | none | none |
| rooms-individual/09 | deluxe king suite gallery | none |
| neighborhood/11 | neighborhood gallery | none |
| dining-zuma/08, dining-gardenterrace/07, dining-lobbybar/07, dining-poollounge/07 | zuma gallery (identical) | none |
| legal/13, corporate/13 | corporate gallery (identical) | none |

All 10 share the same four lorem captions.

## Responsive

- Desktop: two-column grid; wide tiles span both columns at 1600 / 995, half tiles 8 / 9.
- Tablet: same grid; header and caption insets drop to 2rem.
- Mobile landscape and portrait: one column, wide tiles 4 / 5, half tiles 1 / 1, insets 1.25rem.

## Open questions

1. Feature title: meetings-collection/09 has a 40px cream "A Landmark Reimagined" (288:4026) that is visible in Figma but drawn under the first tile, so no crop shows it. The plan keeps it as an optional element, off by default. Should it show?
2. Images: all 40 tile images are placeholders, so no Webflow asset ids exist. Who supplies them, and should the dining and legal/corporate instances take them from CMS (Q027, Q028) instead of component props?
3. Captions are lorem ipsum everywhere. Keep as placeholders or leave empty?
4. dining-gardenterrace, dining-lobbybar and dining-poollounge headings read "zuma gallery" (copied from dining-zuma). Confirm the real headings.
5. The superscript digit treatment (0.625em, raised 0.5em) is read from the crop; the REST override for the digit is empty.

## Deviations

- No `padding-global` or container: the grid is full bleed and the heading and captions sit 2.5rem from the tile edge, so they carry their own offsets.
- Caption bottom offset is 2.5rem on every tile; Figma has 2rem on the first tile only.
- #D9D9D9 placeholder is a literal on `_figure` (no variable); it only shows until images are set.
- Tile heights use aspect-ratio, so the section scales with width (about 2602px tall at 1440 against 2892px in the 1600 frame).
- Below 768px the grid stacks to one column; Figma has no mobile frame.

## Compare notes

A Sonnet subagent compared every preview screenshot with its crop. The preview uses Copperplate in place of Sackers Heavy Gothic (not available locally), so glyph width and weight differ.

**meetings-collection/09 ([crop](../../../../figma/pages/meetings-collection/sections/09-meetings-events-gallery/section.webp), preview-base-1440.png)**
- Matches: tile layout (wide, two halves, wide); row proportions within 1px; 1px cream gaps including the vertical one at 50%; placeholder and cream colours; heading top-left at 40px; captions bottom-left, olive, bottom-aligned for one and two lines; superscript digits.
- Differs: captions wrap later (the stand-in font is about 9% narrower than Sackers; the 37.75rem max-width is the Figma text box, so the real font should wrap where the crop does). Heading about 6% narrower, same cause. Captions first sat about 16px high and the digit was tight to the text; fixed by raising the digit with `top` instead of `vertical-align` (which grew the line box) and a 0.5em gap.

**rooms-individual/09 ([crop](../../../../figma/pages/rooms-individual/sections/09-deluxe-king-suite-gallery/section.webp), preview-base-heading-only-1440.png)**
- Matches: same grid as above; heading at the same top-left offset over the first tile. The crop's 130px cream band above the grid belongs to the previous section (slicer slack). neighborhood/11, dining-*/0x and legal/corporate/13 have the same structure, checked by spec: heading 40px from the first tile's top-left in all 9 instances with a heading.
- Differs: font stand-in effects only, as above.

**history/07 ([crop](../../../../figma/pages/history/sections/07-1-etiam-imperdiet-sodales-dui-a/section.webp), preview-base-no-heading-1440.png)**
- Matches: no heading, first tile at the top, layout and proportions. The crop's trailing cream band belongs to the next section.
- Differs: font stand-in caption wrapping, as above.

**Feature title (preview-base-feature-title-1440.png, no crop)**: legible, centred, clear of caption 1 (about 40px at 1440, 50px at 390).

**390 previews (no reference)**: single column, no overflow or overlap, captions readable at a 1.25rem inset.

The thin dark lines at the top and bottom edges of some screenshots are the neighbouring preview labels, not a border on the section.

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- Class list `gallery-mosaic-captioned_caption text-size-regular text-style-caps-caption-16` is now `gallery-mosaic-captioned_caption text-style-caps-caption-16`.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).

## Build (2026-10-20)

Built through the Data API on `🧱 gallery-mosaic-captioned` (`6ad712c63e506fddaa973910`, `/build-gallery-mosaic-captioned`) and converted to the component `Gallery Mosaic Captioned` (`560e1b31-d612-0921-8773-8f9de2e2b06f`). The page holds one instance with the meetings-collection/09 defaults. The read-back matches the plan tree, tags, classes and copy, except for the following:

- **Five empty combos created** (approved by Stephen) so the planned stacks apply: `.gallery-mosaic-captioned_heading.heading-style-h4`, `.gallery-mosaic-captioned_heading.heading-style-h4.text-weight-normal`, `.gallery-mosaic-captioned_feature-title.heading-style-h2`, `.gallery-mosaic-captioned_feature-title.heading-style-h2.text-weight-normal`, `.gallery-mosaic-captioned_caption.text-style-caps-caption-16`. No standalone class was created and no class styles changed.
- **12 props, all bound:** Heading, Feature Title and Caption 1 to 4 (text), Image 1 to 4 (image), Show Heading (on) and Show Feature Title (off). The two visibility props are booleans bound to the visibility setting, because `create_prop` has no visibility type.
- **No image assets:** the plan has none, so the four tiles show Webflow's placeholder image.
- **No `loading=lazy` attribute** on the images; Webflow images are lazy by default.
- **Rich text styling:** none needed.
