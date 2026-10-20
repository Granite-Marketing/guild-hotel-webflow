# Q007 build record: room-list-hover-preview

One Webflow component, **Room List Hover Preview** (`a9d40053-f1b0-f862-ee0a-4f021e1933a9`, group Modals), for the single Figma instance `rooms-collection/13-all-rooms`. Built through the Data API on `🧱 room-list-hover-preview` (`/build-room-list-hover-preview`, page `6ad7b5d7fc756e91b34c370c`, not draft) on 2026-10-20, with no Designer calls. Generator: `build-schema.py` (element schema, room data and photo choice).

## Lane and runtime

A static full-screen dialog on the existing contracts, plus one new module:

- `modals()` (wired): root `[role="dialog"]`, `id="all-rooms"`, `aria-modal`, `aria-hidden`, `tabindex="-1"`, `aria-label="All rooms"`, `data-modal-no-overlay`. Close controls: "close" (top of the list column) and "back to the quiz", both `[data-modal-close]`.
- `galleryFilter()` (wired): `data-gallery-filter` on the root, tags all / rooms / suites (`data-gallery-filter-tag` all, room, suite), items `data-gallery-filter-item` room or suite.
- `roomListHoverPreview()` (new, `src/utils/roomListHoverPreview.ts`, **not wired**; R01 enables it in slot D after `modals()`): `data-room-preview` root, `data-room-preview-trigger` links, `data-room-preview-panel` previews. See `docs/reference/runtime-modules.md`.

Fixture and spec: `tests/visual/fixtures/room-list-hover-preview.{html,ts}` (staging markup and published CSS), `tests/visual/room-list-hover-preview.spec.ts`. 6 tests pass: hidden until opened, reference room shown first, ten real CDN photos, hover and focus switch the preview, the tabs filter (4 suites, 6 rooms, 10 all) and keep a listed room active, close, back and Escape close it with focus returned, and the 390 layout. Screenshots: `fixture-1440.png`, `fixture-390.png`.

## Tree

- `div` `_component` (fixed, burgundy, cream text, scrolls) `[role=dialog]#all-rooms`
  - `div` `_layout` (two columns; one from 991px, media first)
    - `div` `_content`
      - `div` `_bar` > `a` `_close` "close"
      - `div` `_main` > `nav` `_tabs` (3 `a` `_tab`), `ul` `_list` > 10 `li` `_item` > `a` `_link` (to `/rooms-individual`)
      - `footer` `_footer` > `a` `_back` "back to the quiz"
    - `div` `_media` (sticky 100vh; 50vh from 991px)
      - 10 x `article` `_preview` > `figure` `_figure` > `img` `_image`; `div` `_details` > `header` `_header` (`h3` `_heading`, `ul` `_specs` > 2 `li` `_spec`), `footer` `_preview-footer` > `a` `button is-chamfer` "view more"

## Rooms

| Key | Category | Specs | Photo asset |
|---|---|---|---|
| cozy-queen | room | 2 guests, 20 m² | `6ad67004134731ad1b927d6c` |
| cozy-king | room | 2 guests, 22 m² | `6ad66feb58367429abb4835f` |
| cozy-courtyard-queen (initial) | room | 4 guests, 52 m² (Figma) | `6ad67017fb3a14e0db41143b` (Figma image) |
| cozy-courtyard-king | room | 2 guests, 26 m² | `6ad66ff0f8bf4846e809ead6` |
| city-level-below-ground | room | 2 guests, 30 m² | `6ad66ff96684c3e22ea4e1af` |
| guild-city-level-loft | suite | 3 guests, 45 m² | `6ad67001f08ff78c37d85427` |
| guild-loft-suite | suite | 4 guests, 55 m² | `6ad6701a28c5dc695c82c539` |
| guild-corner-loft-suite | suite | 4 guests, 60 m² | `6ad67001f08ff78c37d85427` |
| guild-double | room | 4 guests, 32 m² | `6ad66ff0f8bf4846e809ead6` |
| two-bedroom-loft-suite | suite | 6 guests, 85 m² | `6ad66ff96684c3e22ea4e1af` |

Specs and categories other than cozy courtyard queen are stand-ins (follow-up). Every photo is a real room photo from the site library; no grey placeholders.

## Page changes

- `/rooms`: removed the Q007 `section_placeholder` (`ddf20115-…`, id `all-rooms`) and appended the instance `80f767d6-0090-5ef7-fde4-878985946d8c` in the same position (last child of the Body). The four "see all rooms" links (quiz steps 1 to 3 `2d94c64b-…`, `ef667276-…`, `e1ee711a-…`, recommendations `d3290fd2-…`) now carry `data-modal-open="all-rooms"`, `aria-haspopup="dialog"`, `aria-expanded="false"` and `href="#"`. No other page had a Q007 placeholder (all pages scanned through the page DOM API).
- `rooms-collection-room-grid_overlay`: added `pointer-events: none` (R00 follow-up: image hover on the room cards).

## Deviations

- No props or variants: one static instance, so the content lives in the definition.
- The Figma shows the site nav over the dialog; the dialog covers it and has its own "close" link.
- No guests and size icons (text only, as on the Q033 room cards).
- `_item` sets no `display` so `galleryFilter`'s `hide` wins (see the Q007 gotchas in `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`).
