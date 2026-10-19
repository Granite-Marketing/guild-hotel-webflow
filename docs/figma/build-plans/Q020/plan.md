# Q020 build plan: image-trio-text

One component, built once on Home (`home/10-wellness`), used by 9 sections on 7 pages. Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html) with [preview.css](preview.css), both regenerated and checked by `node docs/figma/build-plans/Q020/generate-preview.mjs --shots` (CSS comes from the plan's style values; the script fails if any class in the tree or the preview is not declared in the plan).

## Class family

`section_image-trio-text` plus `image-trio-text_*` elements. Reused: `padding-global`, `padding-section-large`, `heading-style-h3`, `heading-style-h4`, `text-size-regular`, `text-size-medium`, `text-weight-normal`, `text-rich-text`. Proposed shared: `text-style-eyebrow-caps` (reuse Q001's if it exists). No `container-large` (see deviations).

## Tree

- `section.section_image-trio-text` (`is-left` modifier)
  - `div.padding-global.padding-section-large`
    - `div.image-trio-text_component` (flex column, centred)
      - `header.image-trio-text_header`
        - `h2.image-trio-text_heading` + `heading-style-h3` or `heading-style-h4` + `text-weight-normal`
        - `p.image-trio-text_paragraph` + `text-size-medium` (optional)
      - `div.image-trio-text_list` (`data-image-stack-collapse` on base instances)
        - `article.image-trio-text_item` x3 (`is-offset` on items 1 and 3 for the staggered layout)
          - `figure.image-trio-text_figure` (`data-image-stack-collapse-item` on base instances; grey #D9D9D9 fallback)
            - `img.image-trio-text_image`
          - `div.image-trio-text_item-content` (optional, is-left only)
            - `header.image-trio-text_item-header`
              - `h3.image-trio-text_item-heading` + `text-size-regular text-weight-normal text-style-eyebrow-caps`
            - `div.image-trio-text_item-text` (Rich Text) + `text-rich-text text-size-medium`
      - `footer.image-trio-text_footer` (optional)
        - `a.image-trio-text_link` + `text-size-regular text-weight-normal text-style-eyebrow-caps`

The DOM keeps the header first. In the base layout the list has `order: -1`, so the images sit above the text; `is-left` resets it to `0`, so the heading sits above the cards.

## Variants

| Variant | Instances | Differences |
|---|---|---|
| base | 4 dining `group-dining-events` | Full-bleed trio (list `107.0625vw`, gap `1.875vw`, figure 551/694) bleeding past both edges, centred text below, underlined CTA. Mobile: list `190vw`, so one image is centred with its neighbours peeking. |
| `is-media-left is-multi-image` (brief name) | `home/10-wellness` | Same classes as base, with real photos and `heading-style-h3`. No combo classes are created. |
| `is-left` | legal and corporate `key-features` | Accent colour, heading on top, contained 3-column cards (figure 485/562, gap 2rem) with left-aligned eyebrow title and body. One column from 767px down. |
| `is-left` + item `is-offset` | legal and corporate `tailored-corporate-packages` | Outer cards `margin-top: 11.25rem` (6rem on tablet, 0 on mobile). Bulleted Rich Text bodies. Not in the brief. |

## Assets

home/10-wellness: `6ad66fe91ce40a5a6239b8ad`, `6ad66ffdba96f2e53726bd55`, `6ad6700eb28c9b39f95d814d` (all uploaded). The other 8 instances have grey placeholders only. Per KTD10, plan a manual Designer step for image placement unless MCP placement works.

## Compare notes per crop

A Sonnet subagent compared each 1440 preview with its 1600-wide crop. The preview is 0.9 of Figma width: rem-based type and gaps do not scale with it, so the text reads about 10% larger relative to the images. The fallback fonts (Copperplate, Avenir Next) also widen the text.

- **base** (`dining-zuma/07`). Matches: three slots, outer two bled at the edges, about 30px gaps, about 694px tall, cream background, centred heading, paragraph and underlined CTA in order. Differs: the paragraph wraps to 4 lines instead of 3 (fallback font plus scale). Heading-to-paragraph and paragraph-to-CTA gaps read about 12 to 15px larger, mostly from the larger line height. The top padding differs in the crop only, because the crop includes the neighbouring section.
- **multi-image** (`home/10-wellness`). Matches: layout, proportions, bleed, text order. Differs: the middle photo is cropped tighter than in Figma (the face sits at the left edge and the hair is cut off). Figma probably applies an image crop transform that the exported asset does not carry. The Designer session should check `object-position` or use Figma's crop. Text spacing differs as in base.
- **is-left** (`legal/03`). Matches well: side margin, 3 equal columns about 485px wide, about 33px gap, about 563px image height, label below the image, accent colour. Differs: the body fills the full column, while Figma wraps it at 378px (see deviations). The label-to-body gap reads about 11px larger, mostly from line height.
- **is-left + is-offset** (`legal/11`). Matches: the middle card is raised and the outer cards lowered, with equal image heights, labels and bullets. Differs: the stagger is about 20px larger at 1440, because rem does not scale with the 0.9 width. The header-to-card gap is about 11px smaller (Figma 56px, plan 40px). The bullet indent is about 31px vs 16px in Figma, so the nested list `padding-left` set in the Designer should be about 1rem, not the 1.75rem the preview stand-in uses. Bullets wrap to two lines.
- **390 previews**. All four are sensible, with no horizontal overflow. Base and multi-image show a centred image with partial neighbours. The is-left layouts stack to one column, and the stagger is removed.

## Open questions

See `openQuestions` in plan.json. In short: variant switching (recommend Webflow component variants), how the per-instance heading size is set, a placeholder colour variable for #D9D9D9, whether the grey cards are photo slots, the em dashes in the legal copy (replaced with commas), `text-style-eyebrow-caps` ownership against Q001, and which size `heading-style-h3` carries (30 vs 32).

## Deviations

See `deviations` in plan.json. In short: no combo classes for the wellness variant, a new `is-offset` item modifier, no `container-large`, vw units for the bleed, a 40px header gap where legal/11 has 56px, `padding-section-large` throughout, Rich Text for the bullet lists, and no body max-width.
