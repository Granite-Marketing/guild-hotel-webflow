# Q038 build record: /rooms-individual (rooms-individual)

Page `6ad66fd5f8bf4846e809dc45` ("Room Detail"), Body `6ad66fd5f8bf4846e809dc4b`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q038](../../briefs/Q038-page-rooms-individual.md). The page was empty before the build; read-back of the Body matches this order. Published to webflow.io staging (another session's site-wide publish included it; a curl of the staging URL shows both one-off families and the Compact carousel variant).

Every visible image is a real library photo; no grey slot or placeholder asset is used.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the hero) | `3a319475-59df-03b6-2cb2-074542c6b895` | Book link default `#book` |
| 01 | deluxe king suite | Hero Fullbleed Centered, base | `66ffec7f-8b0f-ba15-21ac-026af9a92f87` | Heading "deluxe king suite"; Text from the snapshot; Image `6ad66ff96684c3e22ea4e1af` (green suite), alt "Deluxe king suite with dark green walls, a king bed and a velvet bench"; Show Image on |
| 02 | back to rooms | script-intro-centered, base | `e8e75d1f-eda5-5012-067c-05fbf90f25f2` | heading "A room\nfor every stay"; Show back link on ("back to rooms", `/rooms`); Show paragraph off; Show image off |
| 03 | room description | one-off `section_rooms-individual-description` | `7ad80bc0-af55-b835-268c-36e3dab054fc` | article > header (h2 "room description", paragraph) + footer (`button is-link text-style-caps-caption-16` "view floorplan", `#`); `ul` (aria-label "Room details") of six `li` with a `sup` number and a span |
| 04 | (inset image) | image-inset-single, base | `0b8d7566-0056-301f-d55f-b16269188a14` | defaults are this section's image (`6ad67019735773f25340899e`) and alt |
| 05 | Etiam imperdiet caption | Hero Fullbleed Centered, Left (`75108921-8bef-ba10-2260-5af2990c9e7d`) | `239c9fec-4e90-680c-b1bf-42aae822a26e` | Image `6ad67004134731ad1b927d6c` (arched window room), alt set; Show Eyebrow on with the snapshot caption; heading, text and button off |
| 06 | Morbi gravida (1) | Split image text light, Edge (`473c3237-6d5f-b4e2-46df-945ff89461a7`) | `f925f142-2ae2-3007-673a-2de45c05c9b6` | Body from the snapshot; Image `6ad66ff0f8bf4846e809ead6`, Second image `6ad67017fb3a14e0db41143b` (both visible); header, eyebrow, body 2, footer, caption and stamp off |
| 07 | in room amenities | one-off `section_rooms-individual-amenities` | `ad096836-4e41-c124-0c68-cc019ce19997` | header (h2, paragraph); grid of four `ul` columns, two `li` each, in Figma reading order |
| 08 | Morbi gravida (2) | Split image text light, Edge | `e6abc543-ec75-f8ef-6fa6-ad3f77802aad` | same copy and visibility as 06; Image `6ad66feb58367429abb4835f`, Second image `6ad67001f08ff78c37d85427` |
| 09 | deluxe king suite gallery | Gallery Mosaic Captioned | `da42553c-e74d-8910-5f54-e3aaa256fb5c` | Heading "deluxe king suite gallery"; captions are the component defaults (same as the snapshot); Images `6ad67017fb3a14e0db41143b`, `6ad66feb58367429abb4835f`, `6ad67001f08ff78c37d85427`, `6ad6701a28c5dc695c82c539` |
| 10 | discover other rooms | Card Carousel Header Left, Compact (`c59c2441-38e4-6521-05ae-61ab04e20bf2`) | `c98b16ae-2f15-3981-4b02-af57eb8b0dfa` | Heading and Section label "discover other rooms"; Text is the default (same as the snapshot); cards Cozy King, Guild City Level Loft, Guild Loft Suite, Guild Corner Loft Suite, Two Bedroom Loft Suite, Guild Double, all to `/rooms`, each with a room photo |
| 11 | the neighborhood | Map Feature (base) | `2710757e-e74b-1c9c-892c-067e3061d99c` | defaults (same as home/12); map image `6ad66fed1ce40a5a6239b98e` |
| 12 | offers & packages | Offers Slider Split, Base | `3b35124d-dad3-c57d-56ee-33b5191309f9` | defaults, each slide with its library photo |
| 13 | faqs | faq-accordion | `a54e77fb-1a03-8530-1a9b-dc5c80524115` | no props |
| 14 | a landmark reimagined | CTA Booking Newsletter | `7353f227-0eb8-5374-2c2c-41be2a988aad` | no props |
| 15 | the hotel | Footer Links | `42a6a774-29ab-45b6-de05-fb8db69e924c` | no props |

## Classes created

Two one-off families, no combos (see `docs/reference/style-inventory.md`, Q038 rows):

- `section_rooms-individual-description` / `rooms-individual-description_*` (10 classes): section (5rem / 10.5rem left, 8.5rem right; 2rem sides from medium, 1.25rem small), `_component` (grid 24.5rem and 38.5rem columns, space-between; one column from medium), `_content`, `_header`, `_heading` (Sackers 1.5rem), `_text` (1.25rem / 1.3), `_footer`, `_list` (2.5rem top offset to line up with the paragraph, 0 from medium), `_item` (1px rule, none on last-child), `_number` (superscript 0.625rem).
- `section_rooms-individual-amenities` / `rooms-individual-amenities_*` (8 classes): section (14rem / 10rem), `_component` (centred column, 5.5rem gap), `_header` (31.5rem, centred), `_heading` (H3-CAPS values, 1.875rem), `_text`, `_grid` (4 columns, 88rem; 2 from medium, 1 from small), `_column` (`ul`, 1px left rule except first-child, none from medium), `_item` (CAPS-CAPTION-16 values, 6.9rem min height, 1px bottom rule except last-child, `pre-line` for the two-line items).

## Deviations from the brief

- One-off families are named `section_rooms-individual-description` and `section_rooms-individual-amenities` (wave 3 rule: `section_<page>-<section>`), not the brief's `text-spec-list-split` and `amenities-grid-centered` (each has one instance site-wide).
- 05 uses the Hero Left variant: Q014 folded `is-image-bg` and `is-1-image` into the Image prop; Left is the only image variant.
- 06 and 08 use the Split Edge variant, matching Q017's `layout: "edge"` for both instances; the snapshot has no image, so both use room photos.
- 10 and 12 are the live Q009 and Q008 components, not placeholders. 12 uses Base: Q008 folded `is-cream` into Base.
- No Q006 overlay or Q007 hover preview appears in this page's Figma frame, so neither is placed and no placeholder was needed.
- Images: the snapshot has grey slots for 01, 06, 08, 09 and 10; each now holds a real room photo from the library (exact match not required). 05 uses a different room photo from 04 so the two neighbouring sections do not repeat the card image.
- "view floorplan" links to `#`; no floorplan asset or page exists yet.
- The page has no animation spec (`figma/animations/` has no rooms-individual file), so no animation attributes were added.

## Staging check (2026-10-20, Sonnet subagent, read-only)

- 31 images, none empty or placeholder; the only grey fills sit behind loaded carousel images. Section order matches the table. No console errors. No horizontal overflow at 390; both one-off sections stack to one column.
- Offers slider initialises. **The card carousel does not**: the live bundle (v1.1.1) has no `cardCarouselHeaderLeft()` (existing follow-up: enable it in the next release).
- After the check, the description text column was widened to 24.5rem (it wrapped to 6 lines against 5 in Figma) and the amenities rows tightened to 6.9rem (grid was about 255px tall against 221px), then staging was republished.
