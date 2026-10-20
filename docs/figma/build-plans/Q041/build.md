# Q041 build record: /arts

Page `6ad66fd7ba96f2e53726a2eb`, Body `6ad66fd7ba96f2e53726a2f3`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q041](../../briefs/Q041-page-arts.md). Every image slot holds a real photo from the asset library; no grey slots and no placeholder sections.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the photo hero) | `871cea3d-c025-027f-98dc-d3199027d86b` | Book link default `#book` |
| 01 | art collection | Hero Fullbleed Centered, base | `751143d3-d97f-3311-549b-5016f05578f1` | Heading, Text; Image `6ad670147e3d6550932e0fac` (own imageRef); logo, eyebrow and button off |
| 02 | an art collection through a curator's eyes | script-intro-centered, base | `4ea2f711-b714-c3f3-e3f9-0712ff7c81bf` | heading (with `\n`), paragraph; image and back link off |
| 03 | inset image | image-inset-single, base | `06790a4a-2694-bff2-71ce-0239bb16aa94` | image `6ad66fff134731ad1b927c11` (own imageRef), alt |
| 04 | etiam imperdiet sodales | Hero Fullbleed Centered, Left (`75108921-8bef-ba10-2260-5af2990c9e7d`) | `8c21e1d4-1ce5-9e81-e8ed-39ddc83d9201` | Eyebrow only; Image `6ad66fff134731ad1b927c11` (own imageRef) |
| 05 | the guild collection | Split image text light, Edge (`473c3237-6d5f-b4e2-46df-945ff89461a7`) | `2bd736ea-7778-4574-83a1-7c008e47cf8b` | Heading, Body; Image `6ad66ffb8d039779ba7cb0a7`, Second image `6ad6701cf08ff78c37d862e1`; footer, caption, stamp, eyebrow off |
| 06 | gallery | one-off on the Q040 `section_gallery-all` family + `is-dark` | `24baf9eb-aff0-c360-f1f8-f888bded5884` | 10 photo tiles, A05 filter tags (all, painting, photography, sculpture, artists), each tile opens its dialog. Schema: [gallery-schema.py](gallery-schema.py) |
| 07 | more of the guild | Card Carousel Header Left, base | `ff0b7c50-9c36-73be-1917-feb68b9f5ab9` | Labels rooms, dining, wellness with photos; cards 4 to 6 off; heading and text are the defaults |
| 08 | offers & packages | Offers Slider Split, base | `94593f48-bde4-28f3-dba3-48534be2b6bd` | Heading 1 and Text 1 "wellness staycation" copy; 5 slides with photos |
| 09 | faqs | faq-accordion | `9b08d254-8b07-09c2-712a-51e1bc9c58b3` | no props |
| 10 | book your escape | CTA Booking Newsletter | `55358a1f-ce84-5de5-0b80-2cc7c25c5587` | no props |
| 11 | the hotel | Footer Links | `67c487b4-5f6c-84aa-4a04-c35b21cb4199` | no props |
| 12 | arts artist | Overlay Detail Panel Modal, Dark (`569f778f-307a-cdc2-95c3-95b18a7c2c5c`) | `1cda090e-4233-5cb3-2b1b-fc179e084188` | Dialog id `artist-eva-struble`; heading, text, portrait `6ad67002c159d4564be772e7` |
| 13 | arts modal | Overlay Detail Panel Modal, Dark | `285066ec-e924-16d7-e000-731e947102cb` | Dialog id `artwork-oceano`; ‘oceano’, by eva struble, caption, text, painting `6ad66ffb8d039779ba7cb0a7` |
| 13b | draft artwork dialogs | Overlay Detail Panel Modal, Dark, x8 | `7499f787-1406-8316-3f16-9d312f300896`, `4f5a37c1-c8c5-11da-6f0e-0c11341a78d6`, `961da8e9-7c04-2a79-baea-b263a603ce6d`, `5886ffa9-16dd-7591-8ac8-7980dd8c90c8`, `6d876517-1561-b2a4-5fdd-0373192bb6e1`, `7e7e7949-ea19-5092-d086-77fff91beae4`, `ffa3e9cd-0baa-105c-4f52-3b88cead0a98`, `9a7bafd9-6915-a3d0-28b9-ebbe1c505fcf` | Dialog ids `artwork-03` to `artwork-10`; image = the tile's photo; draft copy (artwork title, by artist name, year / dimensions / medium, lorem) until the real catalogue exists |

## Gallery and dialog wiring

- Root `section.section_gallery-all.is-dark[data-gallery-filter]`; each `figure.gallery-all_item` (with `is-narrow` or `is-wide` for the mosaic rhythm) carries `data-gallery-filter-item="<category>"`.
- Inside each figure, `a.gallery-all_link` carries `data-modal-open="<dialog id>"`, `aria-haspopup="dialog"`, `aria-expanded="false"`, an `aria-label`, and `href="#"` (written after the build with `set_settings` key `link`, because builder `set_link` drops hash URLs). A first pass used `href="#<dialog id>"`, which made Webflow's anchor scroll jump the page by the nav height; a bare `#` does not. Tiles open by click, tap and keyboard.
- Tags are TextLinks `tab-pills-intro_tab text-style-eyebrow-caps` (`is-active` on "all"), `role="button"`, `aria-pressed`, `href="#art-<tag>"`; `galleryFilter` prevents the default.
- Tile to dialog: 1 painting `artwork-oceano`, 2 artists `artist-eva-struble`, 3 to 10 `artwork-03` to `artwork-10` (categories photography, painting, photography, sculpture, painting, photography, sculpture, painting).

## Deviations from the brief

- 05 uses the Split Edge variant, not base: `docs/figma/build-plans/Q017/plan.json` maps arts/05 to the edge layout, and the crop shows two images.
- 06, 07, 08, 12 and 13 are the live Q040 family and Q009, Q008 and Q006 components, not placeholders (Q007 is not on this page).
- 06 reuses `section_gallery-all` with a new `is-dark` combo instead of a new gallery-mosaic-captioned family; the Arts crop is the same mosaic as gallery/02 on a dark fill. The Figma rows bleed off both edges; the build wraps centred like `/gallery`.
- The Figma has one artwork dialog; the page has one per tile (ten in all), as the A05 contract asks. Only Oceano and the artist have real copy.
- Arts categories (painting, photography, sculpture, artists) are not in the Figma; they are working tags for the filter.
