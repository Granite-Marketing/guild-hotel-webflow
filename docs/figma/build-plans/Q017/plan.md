# Q017 build plan: split-image-text-light

One Webflow component, built on Home (`home/03-west-coast-hospitality-since-1924`), used by 18 sections on 11 pages. `meetings-collection/08` (the brief's `is-tall`) is excluded and built as a unique item in its page entry (Stephen's rule: when unsure between a variant and a unique item, make it unique). Machine-readable plan: `plan.json`. Preview: `preview.html` (generated with `node docs/figma/build-plans/Q017/render-preview.mjs --shots`, which also validates the plan and retakes the screenshots).

## Class family

`section_split-image-text-light` with `split-image-text-light_*` elements. The component is a 12-column grid (`column-gap: 2rem`); every layout difference is a combo on the element that moves, because Webflow combos cannot style children from the section.

- Section combos (colour): `is-olive` (color-accent), `is-tan` (color-brand-906e58), `is-blue` (color-brand-00263e). Text colour is set on the section and inherited.
- Media combos: `is-start-1`, `is-end`, `is-end-half`, `is-wide`, `is-secondary`, `is-overlap`, `is-chamfer`.
- Content combos: `is-start-2`, `is-start-4`, `is-start-7`, `is-start-9`, `is-bottom`, `is-below`, `is-wide-text`.
- Header combo: `is-outdent`.
- Reused: `padding-global`, `padding-section-large` / `-medium`, `container-large`, `heading-style-h1` / `-h3` / `-h4`, `text-weight-normal`, `text-size-medium`, `text-size-regular`, `button`, `is-link`.
- Proposed shared (for K01): `container-full`, `text-style-caps-caption-16`, `text-style-eyebrow-caps`, `text-style-script`.

At tablet (991px) the grid becomes a flex column, so the grid placement combos stop mattering; each combo that sets `align-self` or a margin resets it at tablet.

## Tree

- `section` .section_split-image-text-light (+ colour combo)
  - `div` .padding-global .padding-section-large
    - `div` .container-large (or .container-full)
      - `article` .split-image-text-light_component
        - `figure` .split-image-text-light_media (+ placement combos)
          - `img` .split-image-text-light_image
        - `figure` .split-image-text-light_media .is-secondary (optional)
          - `img` .split-image-text-light_image
        - `div` .split-image-text-light_content (+ placement combos)
          - `header` .split-image-text-light_header (optional)
            - `p` .split-image-text-light_eyebrow .text-size-regular .text-style-eyebrow-caps (optional)
            - `h2` .split-image-text-light_heading .heading-style-h4 .text-weight-normal (h3 for arts; h1 + text-style-script for history)
          - `div` .split-image-text-light_body .text-size-medium
            - `p` body, `p` body 2 (optional)
          - `footer` .split-image-text-light_footer (optional)
            - `a` .button .is-link .text-style-caps-caption-16
        - `p` .split-image-text-light_caption .text-size-medium (optional)
        - `figure` .split-image-text-light_stamp (optional, history) > `img`

## Variants

| Variant | Section combo | Element combos | Instances |
|---|---|---|---|
| base | none | layout per instance: edge, split, stagger, wide (see below) | 10 |
| olive | `is-olive` | media `is-overlap` (image hangs 87px below the band) | 4 |
| blue | `is-blue` | media `is-overlap` | 1 |
| tan | `is-tan` | media `is-start-1 is-chamfer`, content `is-start-7 is-wide-text`, header `is-outdent`, heading h1 + `text-style-script`, stamp shown | 1 |
| compact | none | `padding-section-medium`, `container-full`, media `is-end-half`, content `is-start-2 is-bottom is-wide-text` | 2 |

Base layouts: edge (rooms x2, arts: media columns 1 to 5, second image top right bleeding into the gutter, text bottom right), split (neighborhood downtown: the olive geometry on cream, plus a caption under the image), stagger (dining explore-the-space x4 and gaslamp: wide image top right, text in a second row), wide (little italy: large square left, second image right, text bottom right).

Per-instance class overrides, hidden slots and copy are in `plan.json` under `instances`.

## Compare notes (Sonnet subagent, previews at 1440 and 390 against each crop)

Fonts fall back in the preview (Sackers, Gatch and Morello are not installed), so wrapping and line pitch differ everywhere; body line pitch runs about 26px against about 23px in the crops.

- **base** (`rooms-individual/06`): pass. Same three elements; text left edge at 51% in both; secondary image at about 75% and near the section top in both. Differs: the primary image is wider (2% to 41% against 2.5% to 35%) because it spans grid columns 1 to 5. 390 stacks image, offset second image, text.
- **olive** (`home/03`): pass. Image hangs about 87px below the band (crop about 78px); text starts at about 59% in both; heading, body and CTA gaps match. Differs: image left edge at 13% against 10.6%; image top 156px below the band top against about 140px. 390 stacks cleanly inside the band.
- **compact** (`happenings-indiv/04`): pass. Image 51% to 97.8% against 51% to 97.5% with the same aspect; text bottom-aligned at 10% against 9%. Differs: text column about 30% wide against 32%.
- **tall** (`meetings-collection/08`): compared and passed on the first pass, then removed from this component as a unique item; no preview kept.
- **tan** (`history/04`): failed on the first pass (stamp too large and over the text, heading not overlapping the photo). Fixed: stamp 12rem, 5rem below the media at desktop and static in the flow at tablet and below; header outdent changed to a third of the content width plus gap, so the script heading reaches the photo edge. Second Sonnet compare: pass. Script heading overlaps the photo edge, stamp sits at the photo's lower right below the body, colours and two-paragraph rhythm match; 390 stacks photo, heading, body, stamp with nothing covering text. Still differs: body wraps to 7 lines against 4 (fallback font about 18px against about 15px equivalent); stamp extends about 80px below the photo against about 20px (tune by eye in the Designer once Morello and Gatch load); the slider dashes under the photo are not built (open question).
- **blue** (`dining-zuma/02`): pass. Image hangs about 87px below the band (crop about 78px); image spans the same 152px to 734px; text left edge at 845px against 850px.

## Open questions

See `openQuestions` in `plan.json`; the same list is in the PR description.

## Deviations from the brief

See `deviations` in `plan.json`. Main ones: no `is-media-left` or `is-1-image` classes (they would be empty); compact is realised by utility swaps and element combos, not a section combo; tall is excluded as a unique item; grey placeholder rectangles are kept as image slots although the brief says 0 images.

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- Class list `split-image-text-light_eyebrow text-size-regular text-style-eyebrow-caps` is now `split-image-text-light_eyebrow text-style-eyebrow-caps`.
- Class list `heading-style-h1 text-style-script (replaces heading-style-h4)` is now `text-style-script is-large (replaces heading-style-h4)`.
- Class list `split-image-text-light_heading heading-style-h1 text-weight-normal text-style-script` is now `split-image-text-light_heading text-style-script is-large`.
- Script heading overrides (tan variant) use `text-style-script is-large`; line height is 1.2 (80/96) instead of the measured 1.
- Section colour modifiers `is-tan` and `is-blue` need the new Colors/Tan and Colors/Navy variables.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).
