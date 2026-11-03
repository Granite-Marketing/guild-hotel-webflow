# M4 sliders and carousels: Webflow style changes

Applied and published to staging on 2026-11-03. Workstream M4 of `docs/plans/2026-11-03-001-feat-mobile-figma-parity-plan.md`. Every change is on the mobile landscape breakpoint (767px and below, cascades to portrait) of an existing class, so desktop and tablet do not change. No new classes, no DOM changes, no runtime code changes. Values come from `figma/mobile/nodes.json.gz` (press frame `25:3216`, dining-zuma frame `27:5985`).

## section_offers-slider-split

Image moves inside the maroon card between title and description by flattening the content and header wrappers into the item's flex column and ordering the children. The absolute overlay (eyebrow top, pager bottom) now spans the full slide.

| Class | Property: value |
| --- | --- |
| `offers-slider-split_item` | display: flex; flex-direction: column; padding: 7.125rem 1.25rem 4.375rem |
| `offers-slider-split_content` | display: contents |
| `offers-slider-split_header` | display: contents |
| `offers-slider-split_heading` (base, plus the Blue and Tan variant overrides) | font-size: 1.75rem; order: 1 |
| `offers-slider-split_figure` | order: 2; min-height: 0; aspect-ratio: 350 / 390; margin: 2.5rem 0 |
| `offers-slider-split_text` | order: 3; font-size: 1rem; line-height: 1.25 |
| `offers-slider-split_footer` | order: 4; margin-top: 1.5rem |
| `offers-slider-split_overlay` | height: auto; bottom: 0; padding: 5rem 1.25rem 2.5rem |
| `offers-slider-split_eyebrow` | font-size: .75rem; line-height: 1.5 |
| `offers-slider-split_counter` | font-size: .75rem; line-height: 1.17; column-gap: 1rem |

## section_card-carousel-header-left

| Class | Property: value |
| --- | --- |
| `section_card-carousel-header-left` (Base only) | padding-top: 6rem; padding-bottom: 4rem |
| `card-carousel-header-left_component` | row-gap: 3.5rem |
| `card-carousel-header-left_controls` | display: none (swipe only, as in Figma) |
| `card-carousel-header-left_header` | row-gap: 1.5rem |
| `card-carousel-header-left_heading` | font-size: 1.75rem |
| `card-carousel-header-left_text` | font-size: 1rem; line-height: 1.25 |
| `card-carousel-header-left_slide` and `.swiper-slide` combo | width: 19.375rem; margin-right: 1.25rem |
| `card-carousel-header-left_figure` | height: 19.1875rem (307) |
| `card-carousel-header-left_figure.is-tall` | height: 27.3125rem (437) |
| `card-carousel-header-left_figure.is-mid` | height: 25.1875rem (403) |
| `card-carousel-header-left_label` | font-size: 1.25rem; line-height: 1.35; margin-top: 1.25rem |

## section_card-stagger-header-left (Dinings Template "Other dining options")

The section instance `86d57348-f224-7d1f-8ca3-1011769f1eb2` carries `hide` at every size. Figma mobile shows it as a swipe row of 310 x 437 cards with no stagger.

| Class | Property: value |
| --- | --- |
| `card-stagger-header-left_component` | row-gap: 3.5rem |
| `card-stagger-header-left_header` | row-gap: 1.5rem |
| `card-stagger-header-left_text` | font-size: 1rem; line-height: 1.25 |
| `card-stagger-header-left_list` | column-gap: 1.25rem |
| `card-stagger-header-left_card` | flex-basis: 19.375rem |
| `card-stagger-header-left_card:nth-child(odd)` | margin-top: 0 |
| `card-stagger-header-left_figure` | aspect-ratio: 310 / 437 |
| `card-stagger-header-left_link` | row-gap: 1.25rem |
| `card-stagger-header-left_label` | font-size: 1.25rem; line-height: 1.35 |

Visibility: `hide` removed from the section. To keep desktop unchanged, `section_card-stagger-header-left` has display: none on desktop and display: block at 767px and below.

## Known remaining differences

- The stagger heading uses the global `heading-style-h2` (30px on mobile, Figma 28px), so "Other dining options" wraps to two lines. Not changed here: the class is shared site-wide.
- Offers slides with a single offer (rooms) hide the pager, which leaves about 50px of extra bottom space.
- Fade slides share the tallest slide's height, so a slide with a one-line title has a little extra space above the pager.
