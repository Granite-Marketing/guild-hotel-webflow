# Q039 build record: /press

Page `6ad66fd5735773f253406642`, Body `6ad66fd5735773f253406673`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q039](../../briefs/Q039-page-press.md). Every section is a component instance, appended to the Body in order. Published to webflow.io staging only.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the hero) | `a0bd1537-003b-0e74-9517-515e8817d8c9` | defaults |
| 01 | press | Hero Fullbleed Centered, base | `954ba09c-c585-377c-a4e3-a643bbd37f21` | defaults are the press copy; Image is the default facade photo `6ad66fed15beaf9a7285e5c8` |
| 02 | a room for every stay | tab-pills-intro, base | `a0cf1b8c-6599-1aeb-0aad-3babaa7eef51` | defaults are the press/02 copy (tabs press, design, community) |
| 03 | National Geographic | Article Card Staggered, base | `3e96a282-bedc-102f-9c38-4fc3df9447cb` | Eyebrow "The best San Diego hotels for every kind of traveler"; Text "National Geographic"; Image `6ad66fef6684c3e22ea4dc76` |
| 04 | Forbes | Article Card Staggered, Right (`c725504c-7f06-39a0-276e-18f876c7c43f`) | `e8ad8eea-36b0-e261-3a89-c3a0bbab98f8` | Eyebrow "The 12 Best Hotels In San Diego \| The Guild Hotel"; Text "Forbes"; Image `6ad670147e3d6550932e0fac` |
| 05 | There San Diego | Article Card Staggered, base | `03ddae8f-8414-620d-45dd-74de35e49019` | Eyebrow "The Guild Hotel Kicks Off New Cocktail Exploration Series Featuring Batch 22"; Text "There San Diego"; Image `6ad6701b6684c3e22ea4f00f` |
| 06 | design / Global Grasshopper | Article Card Staggered, Right | `dc6a30c0-f4d9-1c9a-fecb-b4ed693c7db9` | Show Header on, Heading "design"; Eyebrow "Top 20 Cool and Unusual Hotels in San Diego 2022"; Text "Global Grasshopper"; Image `6ad66feb58367429abb4835f` |
| 07 | Architectural Digest | Article Card Staggered, base | `3b6f4191-473b-a623-267f-68dbfe290a44` | Eyebrow "Here Are the Must-See San Diego Hotels on Our Radar"; Text "Architectural Digest"; Image `6ad6701a28c5dc695c82c539` |
| 08 | press enquiries | form-split-script-contact, base | `4d9cd303-a520-4f77-54c4-d40f1e244df2` | Heading "Press Enquiries"; Show Paragraph on (default copy matches); Show Details on (email, press@theguildhotel.com) |
| 09 | offers & packages | Offers Slider Split, Base | `08ba98cb-4e73-8f2f-cf82-95a4a0cd939a` | defaults (all five slides carry library photos) |
| 10 | more of the guild | Card Carousel Header Left, Base | `38b333ce-daa8-1aed-489f-f7a62cd23b21` | defaults (six cards with library photos) |
| 11 | faqs | faq-accordion | `d9c33fc8-fe56-f028-9b83-f8a86dad1ca0` | no props |
| 12 | book your escape | CTA Booking Newsletter | `52c8df75-7bf3-a29f-bdce-158fef2bd370` | no props |
| 13 | the hotel | Footer Links | `64ef670f-ec28-a2e3-1928-29026e69ac73` | no props |

## Classes created

None. The page uses only existing component class families.

## Deviations from the brief

- **03 to 07 reuse Article Card Staggered (Q025) instead of a new `press-card-staggered` family.** The press cards are the same block (figure, eyebrow caption, staggered left and right, optional section header like "culture"), so a second family would break the one-class-family rule. Variants: base for 03, 05, 07 and Right for 04, 06. The brief's 05 "is-media-left" and 06 "is-media-right" are the same alternation.
- **Section boundaries:** the Figma crops cut through cards. The 06 crop's left caption ("...Batch 22") belongs to the 05 card, and "design" is the header of the 06 card.
- **Press logos are not shown.** Figma draws each card as a grey box with a press logo. Per Stephen's instruction ("real images from the asset library, never grey placeholders"), each card figure holds a hotel photo from the library instead, and the card's text line names the publication. The National Geographic, Forbes and Architectural Digest logos exist only as Figma SVGs (not uploaded); There San Diego and Global Grasshopper are uploaded PNGs (`6ad6700415beaf9a7285f1c8`, `6ad6701dba96f2e53726d23d`) but the card has no logo slot. See follow-ups.
- **No Q006 modal and no placeholders.** The press page has no overlay section in Figma, and Q008 and Q009 are the live components, so nothing is a placeholder.
- **08 form fields** are the component's default photoshoot fields, not the press fields (organization, expected publish date). Slots cannot be set through the API (Q022 follow-up).

## Staging check (2026-10-20)

`https://the-guild-hotel-c34e71.webflow.io/press`, checked in a browser at 1440x900 and 390x844:

- Body order matches the table above; five `data-wf--article-card-staggered--variant` roots read base, right, base, right, base.
- At 1440 the cards sit at x 152 to 896 and 616 to 1360, alternating; at 390 every card spans 32 to 358. No horizontal overflow at either width.
- 24 images, all library photos, none with an empty `src`, all loaded once lazy loading was forced (the pane was hidden, so lazy images had not been requested).
- Offers Slider Split initialises (Swiper fade). Card Carousel Header Left does not: the live bundle v1.1.1 does not include `cardCarouselHeaderLeft()`; this is the open Q009 release follow-up, not a page issue.
- No Figma visual compare beyond layout and alternation; the cards intentionally differ (photos instead of logos).
