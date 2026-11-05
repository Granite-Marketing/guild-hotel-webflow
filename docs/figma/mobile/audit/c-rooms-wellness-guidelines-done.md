# Mobile fixes C: rooms, room template, wellness, guidelines (done)

Source rows: `c-rooms-wellness-guidelines.md`. Every Designer change is on the `small` breakpoint (767px and down), with a `tiny` override removed where one blocked it. Published to the webflow.io staging subdomain on 2026-11-04. No bundle code changed.

Checks:
- Desktop at 1440px: every element box inside `main` matches its pre-fix box on all four pages, with 0 differences.
- Mobile at 390px: re-measured after the final publish. The values are in the "after" column below.

Before images: the audit's `img/<page>-<n>-<block>-live.jpg`. After images: `img/after-c-<block>.jpg`.

Actions:
- fixed: changed in Webflow.
- queued: the class is shared with pages outside this group. A row was added to `shared-queue.md` in the integration checkout for the global session.
- skipped: not changed, with the reason given.

## rooms-collection (`/rooms`)

| row | action | after (390px) |
|---|---|---|
| 02 intro script heading, heading y, paragraph gap, stamp gap and size | queued | `text-style-script`, `script-intro-centered_paragraph` and `_image` are shared with home, history, arts, dining and neighborhood |
| quiz section height 800 | fixed | `rooms-collection-quiz_content` min-height 50rem; section 800 |
| quiz image figure | fixed | hidden below 768px. Figma has no photo, so this was a judgement call. |
| quiz counter 12 / 18 / -0.03em, y 56 | fixed | 12px, y 56 |
| quiz title 28 / 28 | queued | the h2 has only the global `heading-style-h4` class |
| quiz option buttons 250 x 48 at x 70, gap 12 | fixed | 250 x 48 at x 70, pitch 60 |
| quiz option label 14 / 18, chamfer | queued | global `.button` label size. The chamfer follows the global button. |
| quiz first button y 299 | fixed | 301 |
| "see all the rooms" 14 / 18 / -0.05em, y 708 | fixed | 14px, y 708 |
| recommendations title 28 / 28 / -0.05em | fixed | `rooms-collection-recommendations_heading` |
| recommendations title to paragraph 16 | fixed | header row-gap 1rem |
| recommendations links stacked, 36 high, 8 gap, 14 / 18 | fixed | column, dividers hidden, min-height 2.25rem |
| recommendations padding-bottom 96 | fixed | 6rem |
| room grid card 390 x 540 | fixed | aspect-ratio 390 / 540 |
| room grid card gap 2 | fixed | row-gap 0.125rem |
| room grid content inset 24, bottom 32 | fixed | left and right 1.5rem, bottom 2rem |
| room grid title line-height 1.1, title to meta 16 | fixed | header row-gap 1rem |
| room grid meta 14 / 15 | fixed | 0.875rem / 0.9375rem |
| room grid meta icons (guests, size) | skipped | needs icon assets and a new element in the CMS card. The text values match Figma. |
| room grid button 130 x 36 | queued | global `.button` |
| map: heading, padding, text wrap, gaps, bottom | queued | `map-feature_*` is shared with home, dining, history and neighborhood |
| offers: button, pager row | queued | `offers-slider-split_*` is on 13 pages |
| offers: Swiper not initialised on /rooms | skipped, not a bug | the /rooms offers instance holds one slide, so `offersSliderSplit` hides the controls by design. Add offers to that instance to get the "02 / 05" pager. |
| FAQ eyebrow, title, gap | queued | `section_faq-accordion` is global |

## rooms-individual (`/rooms/<slug>` template)

| row | action | after (390px) |
|---|---|---|
| back link y 48 | fixed | `script-intro-centered_back` margin-top -4.5rem. The back link is used only on the room template. |
| back link label lh 12 / -0.05em | fixed | |
| back icon 24 x 18 | fixed | 24 x 18 |
| script heading 56.4 / 67.7 | queued | global script type (see rooms) |
| heading y 148 | fixed | 145 (follows the back link) |
| heading to "room description" 64 | fixed | 64. The description section has padding-top 0 and margin-top -2.25rem. |
| description heading 20 / 27 / -0.05em | fixed | |
| heading to text 24 | fixed | 24 |
| description text line-height 20 | fixed | 1.25 |
| order: list before "view floorplan" | fixed | content is `display: contents` below 768px, with list order 1 and footer order 2 |
| floorplan link 14 / 18 | queued | global `.button.is-link` |
| list rows pitch 49, x 20 | fixed | pitch 49, x 20 |
| list text line-height 20 | fixed | |
| media start state 316 x 213 plain rect, settled 612 | skipped | Stephen's standing decision: hexagon masks start chamfered and open to full screen (100vh) on mobile (CLAUDE.md) |
| media caption 14 / 16.8 | queued | `venue-card-fullbleed_content.is-bleed` is shared with arts |
| 04 details image 1 175 x 226 at x 195 | fixed | 175 x 226 at x 195 (variant `473c...`, used only on the room template) |
| 04 details image 2 266.5 x 315 at x 20 | fixed | 266.5 x 315 at x 20 (`is-secondary` combo, used only on the room template) |
| 04 details order image, paragraph, image | fixed | content order 1, secondary order 2 |
| 04 details gaps 96, padding 120, height 1073 | fixed | gaps 96 and 96, height 1073 |
| amenities heading and intro left aligned, lh 1.1 / 20 | fixed | |
| amenities items left, 14px, 1px dividers, pitch 66 | fixed | padding 1.5rem; one-line items 66, two-line items 83 |
| amenities padding 0 / 120 | fixed | |
| 06 details: image 1 266.5 x 315, image 2 350 square | partly fixed | gaps, padding and order now match Figma. Both split instances share one component variant, and the `is-secondary` combo overrides variant styles, so the 06 block shows the 04 image sizes. A distinct 06 layout needs a second variant plus the secondary sizing moved off the combo. Left as a follow-up. |
| gallery heights, title, captions | queued | `gallery-mosaic-captioned_*` is shared with history, meetings and neighborhood |
| discover other rooms padding-top 96, label -0.05em | queued | the carousel variant is shared with history |

## wellness-collection (`/wellness`)

| row | action | after (390px) |
|---|---|---|
| intro heading 36.7 / 44.1 | queued | `tab-pills-intro_heading` is shared with blog, press and happenings |
| intro top and bottom padding 160 | fixed | `tab-pills-intro_component.is-media` padding 10rem; the tiny override was removed. Heading y 160. |
| panels arrangement (stacked vs pinned) | skipped | the pinned wipe is the approved desktop and mobile interaction (audit also says not changing) |
| panels start frame 265 x 193 | skipped | Stephen's standing decision on hexagon scroll masks (consistent chamfered start, full screen on mobile) |
| panels title, description, gap, button | queued | `venue-card-fullbleed_*` is shared with dining, home and meetings |
| panels tab pill (not in Figma) | skipped | Stephen made the burger pill the standard for every mobile bottom menu (v1.1.23) |
| offers, FAQ | queued | see rooms |

## guidelines (`/guidelines`)

| row | action | after (390px) |
|---|---|---|
| hero min-height 660 | queued | the hero component is used on 14 pages. This page needs a variant. |
| intro heading 26.9 / 32.3, paragraph gap | queued | global script type, shared paragraph |
| process top image (grey placeholder in Figma) | skipped | Figma placeholder with no photo supplied |
| process heading 28 / 28 / -0.05em | fixed | 28px |
| process intro 16 / 20 | fixed | 60 high, as in Figma |
| heading to intro 20 | fixed | header row-gap 1.25rem |
| intro to first item 96 | fixed | grid row-gap 6rem; gap now 100 |
| item text 16 / 20 | fixed | |
| item 8px indent | skipped | the indent is the inline superscript number before the text, which matches Figma's numbered items |
| number glyph size | skipped | the 10px superscript renders like Figma's superscript glyph |
| mosaic heading 24 / 26.4 / -0.05em, left | fixed | x 20, y 64 |
| heading to image 1 and image gaps 120 | fixed | 120 each |
| image 1 266.5 x 315 at x 20 | fixed | 266.5 x 315 at x 20 |
| image 2 266.5 x 315 at x 103.5 | fixed | 266.5 x 315 at x 103.5 |
| image 3 350 x 316 at x 20 | fixed | 350 x 316 at x 20 |
| image 4 244 x 200 at x 126 | fixed | 244 x 200 at x 126 |
| image 5 350 x 480 at x 20 | fixed | 350 x 480 at x 20 |
| image numbers 01 to 05 | skipped | Figma placeholder labels |
| captions 12 / 18 / -0.03em, inset 16 | fixed | 12px |
| mosaic section padding 64 | fixed | heading y 64 |
| form title, gaps, headings, submit | queued | `form-split-script-contact_*` is shared with press, meetings and contact |
| FAQ | queued | see rooms |

## Webflow changes (for reference)

All of these are `small` breakpoint unless marked:
- `rooms-collection-quiz_content`, `_figure`, `_counter`, `_options`, `_option`, `_link`.
- `rooms-collection-recommendations_heading`, `_header`, `_links`, `_divider`, `_link`, and `section_rooms-collection-recommendations`.
- `rooms-collection-room-grid_card`, `_list`, `_content`, `_heading`, `_header`, `_detail`.
- `script-intro-centered_back`, `_back-link`, `_back-icon`.
- `section_rooms-individual-description` and `rooms-individual-description_component`, `_content`, `_heading`, `_header`, `_text`, `_footer`, `_list`, `_item`.
- `section_rooms-individual-amenities` and `rooms-individual-amenities_component`, `_header`, `_heading`, `_text`, `_column`, `_item`.
- Split image text light variant `473c3237-6d5f-b4e2-46df-945ff89461a7` (Edge): `_media` and `_content` variant styles.
- `split-image-text-light_media.is-secondary` combo (tiny width removed).
- `tab-pills-intro_component.is-media` (tiny padding removed).
- `guidelines-process_heading`, `_header`, `_intro`, `_component`, `_item`.
- `section_timeline-scatter-images` and `timeline-scatter-images_header`, `_heading`, `_list`, `_caption`.
- `timeline-scatter-images_item` combos `is-small`, `is-large`, `is-xsmall`, `is-medium`, `is-center`.
- `timeline-scatter-images_image-wrap` combos `is-small`, `is-large`, `is-xsmall`, `is-medium`.
- `guidelines-feature_caption`, `_component`, `_figure`.
