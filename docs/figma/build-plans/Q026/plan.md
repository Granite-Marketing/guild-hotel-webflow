# Q026 build plan: timeline-scatter-images

Shared gallery component, 2 instances: `guidelines/04-work-from-our-collaborators` (base, build here first, page `6ad66fd44c7f57894534ada5`) and `neighborhood/07-beyond-downtown-san-diego` (`is-tall`). Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q026/generate-preview.mjs` (CSS comes only from `plan.json`).

## Tree

- `section.section_timeline-scatter-images` (+ `is-tall`)
  - `div.padding-global.padding-section-large`
    - `div.timeline-scatter-images_component`
      - `header.timeline-scatter-images_header` (+ `is-tall`), optional
        - `h2.timeline-scatter-images_heading` (+ `is-tall`) + `heading-style-h4` (base) or `heading-style-h3` (tall) + `text-weight-normal`
      - `div.timeline-scatter-images_list` (+ `is-tall`), `role="list"`, component slot
        - `figure.timeline-scatter-images_item` + size + offset + optional `is-lift`, `role="listitem"` (repeated)
          - `div.timeline-scatter-images_image-wrap` + the same size modifier
            - `img.u-image.timeline-scatter-images_image` (no images yet; placeholders only)
          - `figcaption.timeline-scatter-images_caption` (+ `is-tall`) + `text-size-regular` + `text-style-caps-caption-16` (base) or `text-style-eyebrow-caps` (tall)

## Class family

`section_timeline-scatter-images`, `timeline-scatter-images_component`, `_header`, `_heading`, `_list`, `_item`, `_image-wrap`, `_image`, `_caption`.

Reused: `padding-global`, `padding-section-large`, `heading-style-h3`, `heading-style-h4`, `text-weight-normal`, `text-size-regular`, `u-image`.

Proposed shared (for K01): `text-style-caps-caption-16` and `text-style-eyebrow-caps`, both combos on `text-size-regular`, names taken from `figma/tokens.json`.

Variables: `color-neutral-100` (section), `color-accent` (base heading, captions), `color-neutral-900` (tall heading), `font-style-heading`. The `#d9d9d9` placeholder fill has no variable.

## How the layout works

The list is a flex column. Each item positions itself with three kinds of item modifiers, all percentages of the list width so the scatter scales with the viewport:

| Kind | Modifier | Item desktop | Image-wrap aspect | 767 and below |
|---|---|---|---|---|
| Size | `is-xsmall` | width 17% | 259 / 466 | 70% |
| Size | `is-small` | width 23.4% | 356 / 466 | 70% |
| Size | `is-medium` | width 30.7% | 1 / 1 | 70% |
| Size | `is-large` | width 40.5% | 615 / 466 | 85% |
| Size | `is-xlarge` | width 48.9% | 744 / 524 | 100% |
| Offset | `is-inset` | margin-left 8.5% | | 0 |
| Offset | `is-center` | margin-left 42.6% | | 15% |
| Offset | `is-end` | margin-left auto | | auto |
| Overlap | `is-lift` | margin-top -16% | | 0 |

The size modifier goes on both the item (width) and its image-wrap (aspect ratio), so no element has a fixed width and height.

## Variants

- **Base** (guidelines): heading absolutely positioned, centred, level with the first image top; captions overlay the image bottom left (1.25rem inset); row gap 2.375rem; items `is-small` / `is-large is-end is-lift` / `is-xsmall is-inset` / `is-medium is-center is-lift`.
- **is-tall** (neighborhood): header back in flow, left aligned with an 8.5% inset and 2rem below; heading colour `color-neutral-900`; captions static below the image (1rem gap); row gap 3.125rem; items alternate `is-xlarge is-inset` / `is-xlarge is-end`.
- Mobile (767 and below, not in Figma): base heading drops into flow above the list; lifts reset; widths shrink per the table; row gap 2rem.

## Build notes

- Create each item modifier on a scratch element that holds only `timeline-scatter-images_item` plus that one modifier (same for image-wrap), then stack them on the real items. Styling a three-class chain directly creates a selector for that exact chain only.
- `is-tall` goes on the section, header, heading, list and every caption of the tall instance; the section combo carries no styles.
- Set tags in the Designer: `section`, `header`, `h2`, `figure` (item), `figcaption` (caption).
- No runtime module attributes: none of A01 to A05 fits a static scattered or zig-zag gallery.
- Component props: heading text, header visibility, list as a slot.

## Open questions

1. Image source: both instances are grey placeholders and `figma/assets.json` has nothing for either section. Who supplies the photos, and should the guidelines list become a CMS collection list (collaborator UGC) instead of static slot items?
2. The brief says base text is left aligned, but the spec has the heading centred (`textAlignHorizontal: CENTER`). The plan centres it.
3. Scroll reveal: no animation notes exist. Add the global `.fade-in` / `.slide-in` to items, or leave static?
4. Keep the `#d9d9d9` placeholder fill until photos land, or drop it?

## Deviations

- Edge gutter is `padding-global` 2rem; Figma uses 40px at 1600.
- One `is-lift` value (-16%) for both base overlaps; Figma lifts are 17.8% and 14.5%, so items 2 and 4 land about 25px off.
- One 3.125rem gap in `is-tall`; Figma has 50, 50 and 117px. The 117px gap is treated as drift.
- `padding-section-large` (7rem) top and bottom; crops show 99 to 133px.

## Compare notes per crop

From a Sonnet comparison of each preview screenshot with its crop (pixel deltas at 1600 scale).

### base 1440 vs `guidelines/04-work-from-our-collaborators`

- Matches: same four-box scatter in the same order; box left edges within 4px of Figma (1600 scale); widths and heights within 4px, so aspect ratios hold; background, placeholder and text colours; heading centred and level with the first box; captions inside the box, bottom left, 20px inset.
- Does not match: vertical rhythm is looser, box tops 9, 42, 50 and 32px lower than Figma (single `is-lift` value plus the 2.375rem row gap); heading about 16px right of Figma's centre and 9px low; heading wider than Figma (fallback font).

### is-tall 1440 vs `neighborhood/07-beyond-downtown-san-diego`

- Matches: 2x2 zig-zag, box x ranges within 4px, about 97px column overlap kept; box 748x527 vs 744x524; captions below the image, left aligned, 16 to 20px under it; heading left aligned to box 1; box 1 top within 1px; colours.
- Does not match: uniform item pitch (623px) vs Figma 612, 612, 679, so box 4 is 32px high (the deliberate drop of Figma's 117px gap); heading about 8px high with a tighter gap to box 1; captions read heavier (fallback font); bottom padding about 167px vs 128px.

### base 390 and is-tall 390 (no Figma mobile design)

- Base: no overflow; heading wraps to two centred lines; single column alternating between the left edge and an indent, aspect ratios vary as on desktop, captions stay inside their boxes. Keeps the scatter character. Minor: the `is-xsmall` box is tall (about 411px) at 70% width.
- is-tall: no overflow; full-width column of images in order with captions below each. The zig-zag collapses to one column, as planned.
