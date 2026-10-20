# Q008 build plan: offers-slider-split

One Webflow component, **Offers Slider Split** (`96c19058-a54d-49c3-9568-d7aee87662b0`, group Sliders), for all 17 instances on 15 pages. Built through the Data API on `🧱 offers-slider-split` (`/build-offers-slider-split`, page `6ad77f7b41c3b044b01140a4`) on 2026-10-20, with no Designer calls. Machine-readable record: `plan.json`. Schema generator for the section: `build-schema.py`.

## Design read

A full-bleed two-column band, 900px tall at 1600 (56.25rem): a colour panel on the left with the eyebrow at the top, heading, text and a chamfered "discover more" button centred, and a prev arrow, `02 / 05` counter and next arrow at the bottom; a grey image slot (or a photo) on the right. One slide per offer. The cream bands above and below some crops belong to the neighbouring sections.

## Runtime

New module `src/utils/offersSliderSplit.ts` (not wired: R00 owns `src/index.ts`). Swiper with `effect: 'fade'`, crossfade, loop, 800ms, navigation on the arrow link blocks, and a zero-padded counter. Its own type class `offers` keeps `swiperSliders()` away from these wrappers. A single slide hides the controls with `hide`. Fixture and spec: `tests/visual/fixtures/offers-slider-split.{html,ts}`, `tests/visual/offers-slider-split.spec.ts` (4 tests, passing).

DOM contract: `.swiper_slider[data-offers-slider]` > `.swiper.offers` > `.swiper-wrapper` > `.swiper-slide`; controls `[data-offers-slider-controls]` with `[data-offers-slider-prev]`, `[data-offers-slider-current]`, `[data-offers-slider-total]`, `[data-offers-slider-next]`.

Without Swiper or the bundle (staging today) the classes still show the first slide only: the slides sit in a flex row inside an `overflow: hidden` container.

## Tree

- `section` .section_offers-slider-split .swiper_slider `[data-offers-slider]` `aria-roledescription="carousel"` `aria-label` (Section label prop)
  - `div` .offers-slider-split_slider .swiper .offers
    - `div` .offers-slider-split_slides .swiper-wrapper
      - `div` .offers-slider-split_slide .swiper-slide `[data-offers-slide="1..5"]` (slides 2 to 5: Show slide N)
        - `article` .offers-slider-split_item (two-column grid, 56.25rem; one column from medium)
          - `div` .offers-slider-split_content
            - `header` .offers-slider-split_header > `h2` .offers-slider-split_heading, `p` .offers-slider-split_text
            - `footer` .offers-slider-split_footer > `a` .offers-slider-split_button
          - `figure` .offers-slider-split_figure `[data-image-placeholder]` > `img` .offers-slider-split_image (Show image N)
  - `div` .offers-slider-split_overlay (absolute over the left half; full width, 40rem tall from medium)
    - `p` .offers-slider-split_eyebrow
    - `div` .offers-slider-split_controls `[data-offers-slider-controls]`
      - `a` .offers-slider-split_arrow .is-prev `[data-offers-slider-prev]` > embed SVG
      - `div` .offers-slider-split_counter > `span[data-offers-slider-current]`, `span` "/", `span.offers-slider-split_total[data-offers-slider-total]`
      - `a` .offers-slider-split_arrow `[data-offers-slider-next]` > embed SVG

## Variants

Component variants (styles only, set on each element's first class):

| Variant | id | Instances | Styles |
|---|---|---|---|
| Base | `base` | 13 + 2 (`is-cream`) | burgundy panel, cream text, cream button with burgundy label, heading 2.5rem |
| Blue | `1993beed-24b7-3024-c815-349d23e9e282` | home/13-retail | section `#b2c5d5` + dark text; button dark with `#b2c5d5` label; heading 1.875rem (1.625rem small) |
| Tan | `33c1374c-e0f0-7e2f-88ab-e318ee666728` | neighborhood/06 | section Colors/Tan; button label tan; heading 1.875rem (1.625rem small) |

## Props (33 including Variant)

Section: Eyebrow, Section label (aria-label), CTA label (shared by all slides). Per slide 1 to 5: Heading N, Text N, Link N (url), Image N, Show image N (default off, so the grey slot shows). Slides 2 to 5: Show slide N (default on). Variant `d176b097-92cb-1f48-49bb-d3e451881938`.

## Instance map for page sessions

| Instance | Variant | Props to set |
|---|---|---|
| home/16, dining-collection/11, history/11 | Base | defaults (slide 1 "save on 5+ nights") |
| wellness-collection/07, meetings-collection/10, press/09, gallery/03, arts/08, neighborhood/12, happenings-collection/08, blog-collection/08, happenings-indiv/07, blog-indiv/07 | Base | Heading 1 / Text 1 = slide 2 defaults ("wellness staycation"), or leave defaults |
| rooms-collection/09, rooms-individual/12 (`is-cream`) | Base | as above |
| home/13-retail | Blue | Eyebrow and Section label "retail", Heading 1 "fashionphile", Text 1, Image 1 `6ad67011134731ad1b928045` (as string), Show image 1 on |
| neighborhood/06 | Tan | Eyebrow and Section label "arts & culture downtown san diego", Heading 1 "the midway museum", Text 1 |

Set the Variant prop with `set_component_instance_prop_values`, `type: "string"`, value = variant id. The build page has one instance per variant.

## Deviations

- `is-cream` is not a variant: its crop shows the same burgundy panel; the cream is the neighbouring section's background. Both instances use Base.
- `is-media-right` and `is-1-image` are not classes: the media is always on the right, and the photo is the Image 1 prop with Show image 1.
- Heading size (h2-caps vs h3-caps) follows the variant (Blue and Tan use the h3 size), not a per-instance utility class; a variant cannot swap classes and an instance cannot change them.
- The button is a family class (`offers-slider-split_button`) with the `button is-chamfer` values copied, because a variant style on `button` loses to the `.button.is-chamfer` combo (V02 gotcha). Same chamfer, same type.
- Figma shows only one slide per instance (counter 02 / 05). Slides 3 to 5 repeat slides 1 and 2 as placeholder copy until the client supplies the offers.
- `swiper_slider`, `swiper`, `offers`, `swiper-wrapper`, `swiper-slide` exist only as empty combos in this family (functional hooks), not standalone styles.
