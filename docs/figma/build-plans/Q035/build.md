# Q035 build record: /meetings (meetings-collection)

Page `6ad66fd96684c3e22ea4d417`, Body `6ad66fd96684c3e22ea4d41d`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q035](../../briefs/Q035-page-meetings-collection.md). Read-back of the Body matches this order; the page was published to webflow.io staging. Staging check: [staging-notes.md](staging-notes.md).

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the hero) | `9e6df89d-bcd4-34fc-77d7-54336de8849a` | Book link default `#book` |
| 01 | meetings & events at the guild | Hero Fullbleed Centered, Text Dark (`c5755984-9207-f25b-c049-f99910c92943`) | `8c8972a9-62cb-24d1-7e3f-8b9e1749dd49` | Heading "meetings & events at the guild"; Text "In hac habitasse platea dictumst. Etiam dapibus augue tortor"; Show Image off (Figma has a grey slot) |
| 02 to 05 | intro + venue snap group (council boardroom, lobby terrace, 1 america plaza) | plain section, `section_venue-card-fullbleed` family plus the one-off `meetings-collection-venues_*` intro classes | `2cb11b3d-0750-ebda-a4a0-c587267e8b92` | A01: root `data-scroll-enlarge-snap`, stage and media `is-media-center`, three `-item` panels, `-image` + `data-eager` on the two photos, `-content`, three `-tab` links in `nav.venue-card-fullbleed_tabs` (aria-label "Meeting spaces"). Intro: `header.venue-card-fullbleed_intro` with script h2 "Intimate spaces\nfor celebration & collaboration" and the paragraph. Panels: council boardroom (no image, `#D9D9D9` media background shows), lobby terrace (`6ad6700eb28c9b39f95d814d`), 1 america plaza (`6ad66fe91ce40a5a6239b8ad`). The council boardroom "discover more" carries `data-modal-open="council-boardroom"`, `aria-haspopup="dialog"`, `aria-expanded="false"`; the other two buttons have no link |
| 06 | request for proposal | form-split-script-contact, Tall (`c284c9dc-42be-882d-5aca-03608bebfc95`) | `bf2d85be-cad9-4f76-7939-f3ae9f16f6a0` | Heading "Request for Proposal"; form is the component's default fields (see deviations) |
| 07 | steps from key legal addresses | Map Feature Image Bg | `4e3db501-831b-1b5b-afc1-4940b78cd846` | Heading, Text from the snapshot; Show Button off, Show List on, Show Pins on; four places are the component defaults (same as the snapshot); Image `6ad6701edd7f0762ee12bb55`, alt "Map of downtown San Diego marking the courthouses near the hotel" |
| 08 | key features of our spaces | one-off `section_meetings-collection-features` | `649c3bd4-26f5-c381-89ae-deee4507de85` | sticky intro (h2, paragraph, `button is-chamfer` "book your space" to `/contact`); three cards (Event Services, AV Capabilities, Hotel Amenities), each an empty grey `figure` with `data-image-placeholder`, an h3 and a `ul` of the snapshot items |
| 09 | meetings & events gallery | Gallery Mosaic Captioned | `b0782e5f-4cbe-5a06-83e4-4fec128d2185` | defaults are the meetings content (heading, four captions); Show Feature Title off; no images (Figma tiles are grey) |
| 10 | offers & packages | Offers Slider Split, Base | `7da5a987-7622-8e1a-2129-1529cf86f78b` | defaults (slide 2 "wellness staycation" matches the crop's active slide) |
| 11 | faqs | faq-accordion | `66f0d86e-b9bb-3e26-27b7-615f3b75cc39` | no props |
| 12 | book your escape | CTA Booking Newsletter | `ade29635-4e34-db55-e6e0-a22278706595` | no props |
| 13 | the hotel | Footer Links | `f1efe0ec-e274-a68e-6de7-6ebf40ba86d1` | no props |
| 14 | meetings overlay | Overlay Detail Panel Modal, Base | `5258d9df-4105-14ec-ecf6-fbfe6c46c699` | Dialog id `council-boardroom`; Image `6ad67016f8bf4846e80a023a`, alt "The council boardroom set for a meeting"; other props are the component defaults (the meetings content) |

## Classes created

Two one-off families, no combos (see `docs/reference/style-inventory.md`, Q035 rows):

- `meetings-collection-venues_heading` (script font variable, 5rem / 3.75rem medium / 2.75rem small, `white-space: pre-line`) and `meetings-collection-venues_text` (37.5rem, 1.25rem). They live inside the shared venue snap root, which has no script heading class of its own.
- `section_meetings-collection-features` / `meetings-collection-features_*` (14 classes): `_component` (two-column grid with a 30.25rem card column, one column from medium), `_intro` (sticky at 8rem, static from medium), `_header`, `_heading` (Sackers 1.5rem), `_text`, `_footer`, `_list`, `_card`, `_figure` (484 / 596, #d9d9d9), `_card-header`, `_card-heading` (Sackers 1rem), `_items`, `_item` (1px rule, none on the last child).

## Deviations from the brief

- Hero is Text Dark, not base: `docs/figma/build-plans/Q014/plan.json` lists meetings-collection/01 as `is-text-dark`.
- Sections 02 to 05 are one plain snap section, not a tab-pills-intro instance plus three Venue Card Fullbleed instances. The A01 module needs the intro frame, the panels and the tabs inside one root, and components cannot repeat panels (Q021-OQ2 default and Q021-OQ4, same approach as Home and Dining). The tab-pills-intro Media variant is not used on this page.
- Tabs read the panel names (council boardroom, lobby terrace, 1 america plaza); Figma tabs read "council boardroom, terrace, conference center" (Q021-OQ7 precedent).
- 08 is a one-off section: Q017 moved meetings-collection/08 out of split-image-text-light as a unique item.
- 06: the Tall variant is applied, but the form fields are the component's photoshoot fields, not the RFP fields (contact information and event details). Slots cannot be set through the API (Q022 follow-up).
- 10 and 14 are the live Q008 and Q006 components, not placeholders. No Q007 or Q009 element is in this page's brief, so no placeholders were needed.
- "book your space" links to `/contact`; the RFP form section has no DOM id because it is a component instance.

## Fill placeholder images (2026-10-20)

Stand-in library photos so staging shows no grey slot on `/meetings`. The picks are loose (no exact match to the slot); replace them when the real imagery arrives. No uploads, no new classes. No `section_placeholder` (Q008, Q009) was on this page, so nothing was swapped.

| Slot | Element | Change | Asset |
|---|---|---|---|
| 01 hero | `8c8972a9-62cb-24d1-7e3f-8b9e1749dd49` | Image set, Show Image on, Variant Text Dark to Base (light text over the photo) | `6ad66fef6684c3e22ea4dc76` |
| 02 to 05 council boardroom panel | new `figure.venue-card-fullbleed_figure` `06e48a3d-a306-75a0-abdc-f5f43ce9ffbf` prepended in item `9151f20b-df16-06c1-c1ef-9bca836385f7`; Image `d3c26e33-66a9-79ea-f9f5-405b1cec6250` (`venue-card-fullbleed_image`, `data-scroll-enlarge-snap-image`, `data-eager`), same structure as the other two panels | `6ad6701cf08ff78c37d862e1` |
| 08 Event Services figure | Image `01f390c5-4497-3d79-2e80-8da3581b0517` (`u-image`) in `47318079-3d68-8fb6-ad93-0ff2f48124c8` | `6ad6701a28c5dc695c82c539` |
| 08 AV Capabilities figure | Image `aa15996c-f473-4701-f37b-e7cabde56c2d` (`u-image`) in `5d3b2871-1902-e4c8-7dc2-76846f033766` | `6ad66ffdba96f2e53726bd55` |
| 08 Hotel Amenities figure | Image `1fe05fb4-a601-39b8-436c-6840efd3ca2a` (`u-image`) in `442aa855-cc6a-71b0-5476-34ef58288d6e` | `6ad66fee735773f253407335` |
| 09 gallery Image 1 | `b0782e5f-4cbe-5a06-83e4-4fec128d2185` | override of the default, so it does not repeat an offers slide | `6ad66ffe58367429abb48c84` |
| 09 gallery Image 4 | same instance | override of the default, same reason | `6ad6701b6684c3e22ea4f00f` |

Images 2 and 3 of the gallery, the offers slider (10), the map (07) and the dialog (14) already had photos and were left as they are. The three feature figures keep their `data-image-placeholder` attribute as a marker for the real photo.

Staging check (Playwright, 1440, scrolled to the end): 25 visible images, none broken, no visible figure without an `img`, hero text computes `rgb(244, 239, 223)`. The five dialog item images are lazy inside the closed dialog, so they do not load until it opens.
