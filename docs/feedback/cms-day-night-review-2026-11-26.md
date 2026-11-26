# CMS, day/night and components review, 26 November 2026

Running list for Stephen's screenshot review before launch (1 Dec). Each item is checked live on staging against Figma (and at 991, 800, 650, 390) before it moves to Done. A session's "fixed" report is not evidence.

Status: `open` → `fixing` → `check` (fix shipped, awaiting live compare) → `done` (Stephen confirmed).

## Pages

| # | Page / block | Issue | Status | Fix / version |
|---|---|---|---|---|
| R1 | Home, Book your escape / Stay in the loop (`section_venue-card-fullbleed`, newsletter) | At some widths (seen at 1059 in the Designer) the email field and its label run right up to the centre divider line. Needs padding or a break so it never touches. | check | Block is `cta-booking-newsletter` (same component on every page). Gap from line to email: 68 at 1440, 0 from 1168 to 992, 32 below 991. Cause: desktop grid has no column gap; the 991 breakpoint already sets 2rem. Fixed: `column-gap: 2rem` on the base style of `cta-booking-newsletter_columns`. Live gap from line to email: 84 (1440), 39 (1260), 32 from 1168 to 800; stacked at 650 and 390 as before. |
| R2 | Meetings gallery, Rooms gallery, sitewide | Gallery rule: a photo on its own row is full width; a photo with a neighbour is half width. Meetings photos 3 and 4 break it (each shows full width). Fix wherever the gallery layout is used. | check | Component Mosaic Captioned (`section_gallery-mosaic-captioned`): Meetings, Neighborhood, Corporate, 5 dining pages, 12 room pages (4 photos: 720, 720, 1440, 1440 at 1440); History (3 photos, correct). Cause: embed CSS makes every 3rd photo full width. Fix: only the last photo, when the count is odd, spans both columns (`:last-child:nth-child(odd)`, plain and CMS rules). Gallery and Arts use another gallery, unaffected. Fixed in the layout embed. Live: Meetings, Neighborhood, a room page 720/720/720/720 at 1440 (495 at 991, 400 at 800, one column at 650 and 390); History 720/720/1440. |
| R3 | Pages with the press-style repeating left/right layout | Group title indented from the cards. Stephen thinks it may already be fixed (P-E1, 25 Nov). Verify on every page that uses it. | check | Already fixed. Press, Blog, Happenings, Packages: heading and first card share the same left edge (0px difference) at 1440, 991, 800, 650, 390. |

## CMS

| # | Collection / page | Issue | Status | Fix / version |
|---|---|---|---|---|
| R4 | 📸 Gallery Photos | Delete leftover fields such as "Settings - Category (Old)". If the API cannot, list them for Stephen to delete. | check | Deleted through the API 26 Nov (no binding, 204). It was the only "(Old)" field in any collection. |

## Components (Designer props panel and live)

| # | Component | Issue | Status | Fix / version |
|---|---|---|---|---|
| R5 | History, George Marston carousel (Trello [History-Marston Carousel](https://trello.com/c/), Omar 19 Nov) | Omar: the carousel shows 3 slides but the props only give image 1, image 2, then "slide image 2/3"; confusing. Stephen: use a component slot for slides so editors are not limited to 3. | check | Plan: a "Split Image Slide" component (Image, Image Alt) in a "Slides" slot inside the slider's wrapper; remove Slide 2/3 props; rebuild the 3 /history slides as instances. Code: lift slides out of the slot's wrapper div before Swiper starts (as `cardCarouselHeaderLeft.ts` does); no loop below 3 slides. Only /history uses it (Tan). Done v1.3.28 ([#413](https://github.com/Granite-Marketing/guild-hotel-webflow/pull/413)): new "Split Image Slide" component, "Slides" slot, old image props removed, 3 slides on /history. Live at 1440 and 390: Swiper running, 3 slides, 3 dots, no page errors. |
| R6 | Hexagon CTA shapes (Trello "Hexagonal Shapes SVGs + Arts/Gallery Mobile") | Omar sent SVGs: CTA fill and outline (7px chamfer, 159x35) and sub-nav base (622x35). Check our button and sub-nav shapes match; use the SVGs only if they do not. | check | Already match: every chamfer button and every filter menu (tab pills on Gallery, Arts, Press, Blog, Happenings) cuts 7px corners on a 37px bar, the same as the SVGs, at 1440 and 390. No change. Closes the wait on #191. |

## Decisions

- R2: Stephen's rule (alone = full width, with a neighbour = half) overrides the Figma mosaic's fixed two-half-one-full rhythm (client feedback beats design).
