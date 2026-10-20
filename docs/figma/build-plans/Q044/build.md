# Q044 build record: /neighborhood

Page `6ad66fdb02cc199b55b926ba`, Body `6ad66fdb02cc199b55b926c5`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q044](../../briefs/Q044-page-neighborhood.md). The read-back of the Body matches this order, and the webflow.io staging publish carries every section below.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (cream text over the grey hero, as in the crop) | `e112c675-550d-773b-3bbc-9c1d4e6641cc` | Book link default `#book` |
| 01 | a city at your fingertips | Hero Fullbleed Centered, Text Dark (`c5755984-9207-f25b-c049-f99910c92943`) | `57b7e684-0c95-ca21-52d4-e91a0015c652` | Heading, Text from the snapshot; Show Image off (grey slot) |
| 02 | the best of san diego is | script-intro-centered, base | `1ef1d38f-c658-4106-317c-fcbe729251c1` | heading "The best of\nSan Diego is right here", paragraph from the snapshot; no image |
| 03 | downtown san diego | Split image text light, base | `7beae137-d05e-b30d-6126-373af489e6db` | defaults (the component default copy is this section); Caption visible on |
| 04 | gaslamp quarter | Split image text light, Stagger Mid (`8dcc8de6-914e-f2a6-a0b5-5f95af173bdf`) | `749c991b-ed39-0c04-c273-4f0f7648a96c` | Heading, Body |
| 05 | little italy | Split image text light, Wide (`45de7441-0ac3-59ed-e7fb-5c6524848b2d`) | `f85756aa-10b5-f49b-d8eb-53ae035c4441` | Heading, Body, Second image visible on |
| 06 | arts & culture downtown san diego | Offers Slider Split, Tan (`33c1374c-e0f0-7e2f-88ab-e318ee666728`) | `08ea048e-084e-c41b-fc6b-201460a62bfb` | Eyebrow and Section label "arts & culture downtown san diego", Heading 1 "the midway museum", Text 1 |
| 07 | beyond downtown san diego | timeline-scatter-images Tall (separate component, no variant) | `f0bc6eb9-7e60-97a9-6b5c-90074ec14682` | defaults (neighborhood/07 copy); items 1 and 3 ("Coronado Beach") open the 16 dialog |
| 08 | corporate & services | one-off `section_neighborhood-corporate` | `27d33c91-12c5-fda1-b47b-d48cba90eb77` | h2 heading, four article cards (empty #d9d9d9 figures with `data-image-placeholder`, h3 title, paragraph), footer with caption and `button is-chamfer is-text-burgundy` "corporate & legal packages" to `/meetings` |
| 09 | dining around the guild | Article Card Staggered Tall (separate component) | `81ccf045-59c6-11a6-486f-47b0cb3a75e9` | defaults (neighborhood/09 copy) |
| 10 | steps from key legal addresses | Map Feature Image Bg (separate component) | `c40253a1-eb58-02fb-eb4c-40974203441e` | Heading, Text, Show Button off, Show List and Show Pins on, Image `6ad6701edd7f0762ee12bb55`, Image Alt; place rows are the defaults (same four courthouses) |
| 11 | neighborhood gallery | Gallery Mosaic Captioned | `f7f67522-9d9b-cabf-d552-4a7a18ca2785` | Heading, Caption 1 to 4; no images (grey slots) |
| 12 | offers & packages | Offers Slider Split, Base | `b7305468-0f20-6e93-7a03-29c30a9efebc` | defaults |
| 13 | faqs | faq-accordion | `a98e47d8-37dc-b5b0-779d-4753a25ac7f3` | no props |
| 14 | book your escape | CTA Booking Newsletter | `6011c1a8-e5cb-aa76-0865-5eb1e1b3eed4` | no props |
| 15 | the hotel | Footer Links | `a9634aaa-afec-4562-e1a4-7cd479560b18` | no props |
| 16 | neighborhood overlay | Overlay Detail Panel Modal, Centered (`34ca996d-2f65-a59e-6eb0-09dd065e4534`) | `5a5a2a39-3e0a-b36f-7614-212aef7532bd` | Dialog id `coronado-beach`, Heading "coronado beach", Text, button "learn more", Image `6ad67011134731ad1b928045` (placeholder photo); eyebrow, caption, subheading, extras and list off |

## Classes

One one-off family, `section_neighborhood-corporate` / `neighborhood-corporate_*` (12 classes, no combos): the text styles sit on the family classes (heading H3-CAPS, title EYEBROW-CAPS, caption CAPS-CAPTION-16, text Paragraph) instead of stacked utilities. Breakpoints: component side inset 0 from medium; one column, smaller gaps, 1.625rem heading and stacked footer from small. Everything else reuses existing classes (`padding-global padding-section-large`, `button is-chamfer is-text-burgundy`).

## Modal wiring

`modals.ts` opens a dialog on a click anywhere inside `[data-modal-open]`. The timeline items have no link, so `data-modal-open="coronado-beach"`, `aria-haspopup="dialog"` and `aria-expanded="false"` were added to items 1 and 3 (both captioned "Coronado Beach") in the `timeline-scatter-images Tall` definition. Neighborhood is the only page that uses Tall. Checked on staging: a click opens `#coronado-beach` (`is-open`, `aria-hidden="false"`), Escape closes it.

## Deviations from the brief

- Q008 (06, 12) and Q006 (16) are the live components, not placeholders. No section on this page needs a placeholder (no Q007 element in the brief).
- Hero is Text Dark, not base: `docs/figma/build-plans/Q014/plan.json` maps neighborhood/01 to `is-text-dark` (dark text on a grey slot).
- The one-off family is `section_neighborhood-corporate` (wave 3 rule 3), not the brief's `section_image-grid-text-dark`.
- The corporate CTA links to `/meetings`: the Legal Corporates collection has a template only (`/legal-corporate/<slug>`), no listing page.
- Gallery captions drop the leading numerals of the Figma text ("1 Etiam ..."), as in the Q018 plan.
- Article Card Staggered Tall renders the cards its definition has; cards 2 and 3 depend on the V02-Q025 follow-up.
- The timeline items are not keyboard focusable, so the dialog opens by mouse or touch only.
