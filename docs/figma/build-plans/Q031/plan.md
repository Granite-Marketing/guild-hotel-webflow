# Q031 page build: Home (`/`)

Page `6ad64060ae8eac6d7b7c4241`, built through the Data API on 2026-10-20 (no Designer calls). Brief: [Q031](../../briefs/Q031-page-home.md). Staging check: [staging-notes.md](staging-notes.md).

## Structure

The Home page keeps its Relume shell: `.page-wrapper` holds the Site Nav (first child), the Global Styles embed and `main.main-wrapper`. Every section is a child of `main.main-wrapper`, in Figma order.

| # | Figma section | Built as | Variant / key props |
|---|---|---|---|
| top | navbar | Site Nav instance `3ba98bea-6614-0262-5796-6402e75682d5` | base (light text), Book link default `#book` |
| 01 | the bold, handsome heart of san diego | Hero Fullbleed Centered `da3f4079-5f27-aa23-aac1-78021605338d` | Text Dark (`c5755984-9207-f25b-c049-f99910c92943`); heading, text, Show Button on, "book your stay" to `#book`; Show Image off (Figma has a grey video slot) |
| 02 | a century of stories | script-intro-centered `87352ce5-fd3a-7afe-ee2c-97a1b8236605` | Tall (`ac455635-ebdb-afce-1b26-c3754520f0b3`); heading with `\n`, paragraph, image `6ad74da48e7763c5db93ef04` (building drawing), Show image on |
| 03 | west coast hospitality since 1924 | Split image text light `90b79982-e297-c0b3-51ca-2126deb935d0` | Olive (`654bb362-ab8e-2b17-8c1c-352117770874`); heading, body, CTA "uncover our history" to `/history`, Footer visible on; Image left as the component placeholder (no photo in the design) |
| 04 to 09 | venue snap group | plain section `4a733393-7548-adae-8107-467135b73aa3`, `section_venue-card-fullbleed` family, copied from the Q021 build page | A01 attributes: root `data-scroll-enlarge-snap` + `-step="80"`, stage, media, five `-item` panels (Zuma, The Lobby Bar, Pool Lounge, lobby terrace, solana coffee), `-image` + `data-eager` on each photo, `-content`; buttons to `/dining` |
| 10 | wellness | Image Trio Text `198035b5-531d-6c8f-eb55-96c98cf978e4` | heading "wellness", CTA to `/wellness`, images `6ad66fe91ce40a5a6239b8ad`, `6ad66ffdba96f2e53726bd55`, `6ad6700eb28c9b39f95d814d`. A02 attributes live in the component definition (`data-image-stack-collapse` on the list, `-item` on the three figures) |
| 11 | rooms & suites | Venue Card Fullbleed Tall `39e7c9d9-15d4-79cb-6afd-d7ffa879c070` | heading, text, "explore more" to `/rooms`, image `6ad66ff96684c3e22ea4e1af` |
| 12 | the neighborhood | Map Feature `16944622-4a22-7395-90d8-90b9e812eb65` | defaults for copy, button to `/neighborhood`, image `6ad74983c0f141bdb6fd4115` |
| 13 | retail | `section_placeholder` `7eb8fe57-ba83-8a6e-d660-571684e99f08` (`data-placeholder="Q008"`) | Q008 offers-slider-split, is-blue + is-media-right + is-1-image |
| 14 | art & stories | one-off `section_home-art-stories` `91e5eca6-97ff-463d-47aa-f39a681bd193` | h2 `heading-style-h1`, eyebrow `text-style-eyebrow`, outline CTA to `/arts`; A03 zone `data-image-trail-hover` on `_media`, four `data-image-trail-hover-item` links (to `/arts`) with images `6ad670091ce40a5a6239c71f`, `6ad66ff8c71aabce9a919022`, `6ad67010c5b9d15c77b328c8`, `6ad6700ecf42363c3ffe40c4`; main image `6ad6701cf08ff78c37d862e1` with `data-eager` |
| 15 | meetings & events | Venue Card Fullbleed Left `960a6a94-af0f-4d37-2b17-d580606eec45` | heading, text, "discover more" to `/meetings`, image `6ad67016f8bf4846e80a023a`; venue list is the component's static three rows |
| 16 | offers & packages | `section_placeholder` `8ad8bace-1158-6e46-eb9b-7457fe72f87e` (`data-placeholder="Q008"`) | Q008 offers-slider-split, base |
| 17 | faqs | faq-accordion `c073acce-fcbf-f721-42aa-49f8cbb465c8` | no props |
| 18 | book your escape | CTA Booking Newsletter `269b5935-34d2-b183-1fea-e96ccdab3777` | no props |
| 19 | the hotel | Footer Links `27ebef28-e5d4-e999-ebdc-f78809f2b6a5` | no props |

A04 (history sticky year) and A05 (gallery filter) have no Home sections.

## Classes created

Only the one-off family `section_home-art-stories` / `home-art-stories_*` (10 classes, no combos; see `docs/reference/style-inventory.md`). Everything else reuses existing classes. Breakpoints: section padding 5rem / 2rem at medium and 4rem / 1.25rem at small; media 3 / 4 with a smaller chamfer at small; trail items 11rem at small.

## Deviations from the brief

- Hero is Text Dark, not base: `docs/figma/build-plans/Q014/plan.json` lists home/01 as `is-text-dark`, and the crop has dark text on a light grey slot.
- Image Trio Text is the base component, not `is-media-left + is-multi-image`: Q020 maps home/10 to base and the Left components belong to legal and corporate.
- The one-off family is `section_home-art-stories` (wave 3 rule 3), not the brief's `section_heading-wide-image-cta`.
- Venue 04 to 09 is a plain section, not instances: Webflow components cannot repeat panels (Q021-OQ4).
- Trail images link to `/arts`, not `/arts#{slug}`: the Arts CMS collection and its anchors do not exist yet.
- Link props take url mode only, so page links are relative urls (`/history`, `/dining`, ...), not page-id links.

## Read-back

`get_all_elements` after the build: nav first in `.page-wrapper`, then the 14 children of `main.main-wrapper` in the order above, every prop override as planned, all classes applied (no dropped stacks), every A01 and A03 attribute present, A02 attributes present in the Image Trio Text definition.
