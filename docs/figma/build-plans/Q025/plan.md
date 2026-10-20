# Q025 build plan: article-card-staggered

Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), generated from `plan.json` by `node docs/figma/build-plans/Q025/render-preview.mjs`; screenshots by `node docs/figma/build-plans/Q025/capture-preview.mjs`.

Build on `neighborhood` (page id `6ad66fdb02cc199b55b926ba`) from `neighborhood/09-dining-around-the-guild`, then insert instances on happenings-collection and blog-collection.

## Tree

- `section` `section_article-card-staggered` (cream `color-neutral-100`, text `color-accent`)
  - `div` `padding-global` `padding-section-small`
    - `div` `container-large`
      - `article` `article-card-staggered_component` (+ `is-right` or `is-tall`)
        - `header` `article-card-staggered_header` (optional, visibility prop)
          - `h2` `heading-style-h4` `text-weight-normal` (H4-CAPS on neighborhood; `heading-style-h3` for "culture")
          - `div` `article-card-staggered_intro` `text-size-medium` (optional) > `p`
        - `div` `article-card-staggered_list` (slot or Collection List)
          - `div` `article-card-staggered_item` (repeats)
            - `figure` `article-card-staggered_figure` > `img` `u-image`
            - `header` `article-card-staggered_content`
              - `h3` `text-style-eyebrow-caps` (optional, collection cards)
              - `h3` `text-style-caps-caption-16` (optional, neighborhood cards)
              - `div` `article-card-staggered_text` `text-size-medium` > `p`

## Class family

`section_article-card-staggered`, `article-card-staggered_component`, `_header`, `_intro`, `_list`, `_item`, `_figure`, `_content`, `_text`.

Proposed shared (for K01): `text-style-eyebrow-caps` (1.125rem), `text-style-caps-caption-16` (1rem), both Sackers Heavy Gothic, line-height 1.2, letter-spacing -0.03em, lowercase.

Reused: `padding-global`, `padding-section-small`, `container-large`, `heading-style-h3`, `heading-style-h4`, `text-weight-normal`, `text-size-medium`, `u-image`.

## Variants

| Modifier | Where | Differences |
|---|---|---|
| base | collection 03, 05, 07 | Single column card, max-width 46.5rem, inset 4.5rem from the container's left edge; figure 744/524; title-to-image gap 1.5rem; cards 6.25rem apart in a list |
| `is-right` (new, not in brief) | collection 04, 06 | Component `margin-left: auto`, so the card sits flush right. Stacks left on mobile landscape and below |
| `is-tall` | neighborhood 09 | Component becomes a grid (`1fr 30.25rem`): header left with 2.625rem top offset, list right. Square figures, 2rem image-to-title gap, 5rem between cards, text full width, extra 4rem padding top and bottom. Stacks to one column at 767px |

Optional elements (header, intro, eyebrow, caption, image) are content, not variants: they hide when empty. The header gets 4.5rem top padding in base so "culture" sits further from the card above, as in Figma.

## Open questions

1. Collection pages: one instance with a Collection List (alternate left and right by an even-item rule) or five static sections as Figma draws them? The plan follows Figma; a CMS list is the recommendation.
2. The list holds 1 or 3 cards. Use a component slot if the MCP supports it (X01), otherwise reuse the class family without a component, or insert items per instance.
3. Heading size swaps between `heading-style-h4` and `heading-style-h3`. Component props cannot swap classes: use two optional headings or a component variant.
4. Should the neighborhood header stick while cards scroll? Nothing in the animation notes says so; the plan leaves it static.
5. Card images are Figma placeholders (#D9D9D9). Source of real images: CMS image field on collection pages, manual upload for neighborhood.

## Compare notes (Sonnet subagent, preview at 1440 and 390 vs crops)

| Crop | Verdict | Matches | Differs |
|---|---|---|---|
| happenings-collection 03, 05, 07 (base) | Pass | Image 744 x 524 (1.42), left edge at 10.6% of width as in Figma, right half empty, image-to-title gap about 35px, card pitch about 98px vs 94px | Title-to-paragraph gap about 5px looser; paragraph wraps one word earlier (fallback font); background read as slightly warmer by eye |
| happenings-collection 04 (is-right) | Pass | Image flush right in the container, caption stack and type scale as base | Right edge about 40px further in than Figma (container deviation, expected) |
| happenings-collection 06 (is-right with "culture") | Pass after fix | Heading left-aligned to the image, about 45px above it, size relative to title matches | Space above "culture" was about 80px short; fixed by 4.5rem header top padding |
| Sequence 03 to 07 | Pass | Alternation L, R, L, R, L; card pitch about 733px vs 726px | Same "culture" spacing, fixed |
| neighborhood 09 (is-tall) | Pass | Two columns, intro top-left, three square images right starting at about 61% of width (Figma 59%), card pitch ratio 1.46 vs 1.44 | Image width 33.5% vs 30% of page; intro wraps to three lines (fallback font, Figma breaks deliberately after "tortor."); heading-to-intro gap reads about 10px loose; container moves intro right of Figma's x 42 (expected) |
| 390 wide (all) | Pass after fix | Single column, 2rem gutters, no overflow, is-tall intro stacks above cards | Card gaps were inconsistent (35px base); fixed with 1rem component padding at mobile landscape and below |

Not adjusted on purpose: the type-driven differences come from fallback fonts, since Sackers Heavy Gothic and Gatch Test are not available locally. Recheck these after the build, with the real fonts.

## Deviations

See `deviations` in `plan.json`: the added `is-right` modifier, the container-large inset, the standalone text-style classes, the `is-tall` padding on the component, and the placeholder figure fill.

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- `u-image` is not on the live site; it is a shared class to create.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).
