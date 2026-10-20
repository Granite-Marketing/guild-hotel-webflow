# Q033 build record: /rooms (rooms-collection)

Page `6ad66fd5f8bf4846e809dbee`, Body `6ad66fd5f8bf4846e809dbf6`. Built 2026-10-20 through the Data API (no Designer). Read-back of the Body matches this order.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| 0 | nav overlay | Site Nav instance, base (light text over the hero) | `8ec3e07a-61a8-c9d7-373e-39d22f606a43` | Book link default `#book` |
| 1 | 01-rooms-suites | Hero Fullbleed Centered, base | `bc0c1393-1d0f-8b55-c877-9b1e69e1ce9e` | Heading "rooms & suites"; Text "Our rooms and suites pair historic character with generous, modern comfort throughout."; Show Image off (Figma has a grey placeholder) |
| 2 | 02-a-room-for-every-stay | script-intro-centered, variant Bottom `211f09b3-312a-f072-e7c4-4e0894618a51` | `9c8cfe26-daae-2315-9c76-9bc687bd7e39` | heading "A room\nfor every stay"; paragraph default (same copy); image stamp `6ad74da46b56ff1d7223e4d7`, alt "The Guild Hotel postmark stamp, San Diego, Nov 3 1924"; Show image on |
| 3 | 03-01 | one-off `section_rooms-collection-quiz is-first`, id `rooms-quiz`, `data-quiz-step="1"` | `37e7cbfd-796d-5ae3-e245-a854145db313` | 01 / 03, "who's checking in?", 4 options (two guests selected), image `6ad66fed15beaf9a7285e5c8` |
| 4 | 04-02 | one-off `section_rooms-collection-quiz`, step 2 | `8ee033fd-3d8e-64ff-3db4-5ab699224a40` | 02 / 03, 5 options (couples getaway selected), image `6ad6701a28c5dc695c82c539` |
| 5 | 05-03 | one-off `section_rooms-collection-quiz`, step 3 | `92c76b4d-0c64-0010-30f7-12194ceaaf05` | 03 / 03, 5 options (spaciousness selected), image `6ad66feb58367429abb4835f` |
| 6 | 06-our-recommendations-for-your-stay | one-off `section_rooms-collection-recommendations` | `c5c1a105-992b-654c-3d9f-a3a9045cf733` | h2, paragraph, links "back to the quiz" (`#rooms-quiz`) and "see all rooms" (`#all-rooms`) |
| 7 | 07-deluxe-king-suite | one-off `section_rooms-collection-room-grid` | `03d3505a-0d06-3884-3244-9b478b261ab9` | 4 cards linking to `/rooms-individual`: deluxe king suite (`6ad67001f08ff78c37d85427`), deluxe king suite (`6ad67004134731ad1b927d6c`), premium twin room (`6ad66ff0f8bf4846e809ead6`), guild corner loft suite (`6ad67019735773f25340899e`); images `data-hover-scale="1.05"` |
| 8 | 08-the-neighborhood | Map Feature (base) | `1f100d47-23d3-23de-41b1-38832580269d` | defaults (same as home/12) plus Image `6ad74983c0f141bdb6fd4115`, Button Link `/neighborhood` |
| 9 | 09-offers-packages | `section_placeholder`, `data-placeholder="Q008"` | `59d68938-40d7-80ac-41d8-9d75f8ab5766` | offers-slider-split `is-cream` not built yet |
| 10 | 10-faqs | faq-accordion | `18694874-5041-fb8a-7aa6-67f37311263b` | no props |
| 11 | 11-book-your-escape | CTA Booking Newsletter | `e21dcc38-c709-3e9d-8c9b-787a6e4307ad` | no props |
| 12 | 12-the-hotel | Footer Links | `f58ef24a-8ca7-f871-52b4-e7de8726b11c` | no props |
| 13 | 13-all-rooms | `section_placeholder`, `data-placeholder="Q007"`, id `all-rooms` | `ddf20115-a908-c0e2-fded-3f0f85f6dc2a` | room-list-hover-preview not built yet |

Animation: no `figma/animations/rooms-collection.md` exists, so the only data attributes are `data-hover-scale` on the room card images (imageHoverScale, opt-in), plus `data-quiz-step` / `data-quiz-option` hooks for a future quiz module. New classes: `docs/reference/style-inventory.md`, Q033 rows. Follow-ups: `docs/figma/follow-ups.md`, Q033 lines.
