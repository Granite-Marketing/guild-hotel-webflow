# Q009 build plan: card-carousel-header-left

One Webflow component, **Card Carousel Header Left** (`f5403de4-dabb-14c3-ecf8-c945d0a8e22e`, group Sliders), for all 10 instances on 10 pages. Built through the Data API on `🧱 card-carousel-header-left` (`/build-card-carousel-header-left`, page `6ad78814d14363c9008ddeff`) on 2026-10-20, with no Designer calls. Machine-readable record: `plan.json`. Schema generator for the section: `build-schema.py`.

## Design read

A cream band. Left column (40px inset, 647px wide at 1600): an H2-CAPS heading, a 20px body paragraph, and prev and next arrows at the bottom of the column. Right: a row of link cards running off the right edge, 356px wide with a 32px gap, top aligned, with staggered image heights (502, 352, 463, repeating) and an EYEBROW-CAPS label 12px under each image. Base (8 identical instances) is about 965px tall; Compact (history/09, rooms-individual/10) is the same layout with less vertical padding (about 810px).

## Runtime

New module `src/utils/cardCarouselHeaderLeft.ts` (not wired: R00 owns `src/index.ts`). Swiper with `slidesPerView: 'auto'`, `spaceBetween: 0` (the gap is the slide's CSS margin, which Swiper measures), 700ms, navigation on the arrow link blocks with `disabledClass: 'is-disabled'` and `lockClass: 'hide'`. Its own type class `cards` keeps `swiperSliders()` away from these wrappers. Fixture and spec: `tests/visual/fixtures/card-carousel-header-left.{html,ts}`, `tests/visual/card-carousel-header-left.spec.ts` (6 tests, passing).

DOM contract: `.swiper_slider[data-card-carousel]` > `.swiper.cards` > `.swiper-wrapper` > `.swiper-slide`; arrows `[data-card-carousel-prev]`, `[data-card-carousel-next]` anywhere inside the root.

Without Swiper or the bundle (staging today) the classes still lay the cards out in a clipped flex row, with dead arrows.

## Tree

- `section` .section_card-carousel-header-left .swiper_slider `[data-card-carousel]` `aria-roledescription="carousel"` `aria-label` (Section label prop)
  - `div` .card-carousel-header-left_component (flex row; column from medium)
    - `div` .card-carousel-header-left_content (40.4375rem, column, space-between; full width from medium)
      - `header` .card-carousel-header-left_header > `h2` ._heading (Heading), `p` ._text (Text)
      - `div` ._controls `[data-card-carousel-controls]`
        - `a` ._arrow .is-disabled `[data-card-carousel-prev]` > embed SVG
        - `a` ._arrow `[data-card-carousel-next]` > embed SVG
    - `div` ._slider .swiper .cards
      - `div` ._slides .swiper-wrapper
        - `div` ._slide .swiper-slide `[data-card-carousel-slide="1..6"]` (cards 4 to 6: Show card N)
          - `a` ._link (Link N)
            - `figure` ._figure (+ `is-tall` on cards 1 and 4, `is-mid` on 3 and 6) `[data-image-placeholder]` > `img` ._image (Image N, Show image N)
            - `p` ._label (Label N)

## Variants

| Variant | id | Instances | Styles |
|---|---|---|---|
| Base | `base` | press/10, gallery/04, arts/07, contact/03, happenings-collection/09, blog-collection/09, happenings-indiv/06, blog-indiv/06 | section padding 13.4375rem top and bottom (7rem medium, 5rem small) |
| Compact | `c59c2441-38e4-6521-05ae-61ab04e20bf2` | history/09, rooms-individual/10 | section padding 8.5rem (5rem medium, 4rem small), set at every breakpoint so the base breakpoint rules do not win |

## Props (31 including Variant)

Content: Heading, Text, Section label (aria-label). Cards 1 to 6: Label N, Link N (url), Image N, Show image N (default off, so the grey slot shows). Cards 4 to 6: Show card N (default on). Variant `18d9c152-511a-0623-e95e-f0df74c21512`.

## Instance map for page sessions

| Instance | Variant | Props to set |
|---|---|---|
| press/10, gallery/04, arts/07, contact/03, happenings-collection/09, blog-collection/09, happenings-indiv/06, blog-indiv/06 | Base | defaults ("more of the guild"; rooms, dining, wellness, meetings & events, arts, history) |
| history/09 | Compact | defaults |
| rooms-individual/10 | Compact | Heading and Section label "discover other rooms"; Label 1 to 3 "cozy king", "guild city level loft", "guild loft suite"; Link 1 to 3 to the room pages; Show card 4 to 6 off, or more rooms |

Set the Variant prop with `set_component_instance_prop_values`, `type: "string"`, value = variant id. The build page has one Base instance and one Compact instance with the rooms props and a photo on card 1.

## Placeholders on built pages

| Page | Element | Section | Variant |
|---|---|---|---|
| `/history` (`6ad66fd276d24ed37ac4c52f`) | `8829d2d2-6596-bb48-7469-cb63d779021a` (`section_placeholder`, `data-placeholder="Q009"`) | history/09-more-of-the-guild | Compact |
| `/gallery` (`6ad66fd65794075272b95584`) | `2b4ad8af-eb33-7b35-11cd-f93c3882180f` (`section_placeholder`, `data-placeholder="Q009"`) | gallery/04-more-of-the-guild | Base |
| Dinings Template (`6ad67d7416e13e66c2b76107`) | `86d57348-f224-7d1f-8ca3-1011769f1eb2` (`section_card-stagger-header-left`, `data-placeholder="Q009"`) | "other dining options", a Q027 static stand-in | Base with dining labels, or keep the stand-in |

Replacing them is a follow-up (`docs/figma/follow-ups.md`). Press, arts, contact, rooms-individual and the happenings and blog pages are not assembled yet; their sessions place the instance directly.

## Deviations

- Compact is padding only; the crops show the same cards, type and stagger.
- rooms-individual content is props. A CMS-bound "other rooms" list is a later option once the Rooms collection drives that template.
- Six cards (Figma shows three and a half); cards 4 to 6 carry placeholder labels and can be hidden.
- The card stagger is fixed by card position (`is-tall`, base, `is-mid`, repeating). A variant cannot swap classes, so per-instance stagger changes would need new combos.
- The gap is the slide's CSS margin; `spaceBetween` stays 0 in the module, because a non-zero value doubled the gap in the fixture.
- `.card-carousel-header-left_slider.swiper` carries `margin: 0` on the sides: Swiper's CSS sets auto side margins on `.swiper`, which stopped the slider from stretching when the layout stacks, so it grew to the full card row (1632px at 390) and Swiper locked.
- The slide width also sits on `.card-carousel-header-left_slide.swiper-slide`, because Swiper's `.swiper-slide { width: 100% }` loads after the Webflow CSS.
