# Q034 build record: /wellness (wellness-collection)

Page `6ad66fd7735773f253406791`, Body `6ad66fd7735773f253406797`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q034](../../briefs/Q034-page-wellness-collection.md). Read-back of the Body matches this order, and the page was published to webflow.io staging.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base | `f5839724-f105-8ec4-18d3-b1250c58e1e5` | Book link default `#book` |
| 01 | wellness at the guild | Hero Fullbleed Centered, Text Dark (`c5755984-9207-f25b-c049-f99910c92943`) | `3e956e4d-d614-d864-aba1-1215e9dfa212` | Heading "wellness at the guild"; Text "In hac habitasse platea dictumst. Etiam dapibus augue tortor"; Show Image off (Figma has a grey slot) |
| 02 to 06 | intro plus in-room wellness, fitness center, mindful dining, wellness events | plain A01 snap section, `section_tab-pills-intro` family with the `is-media` combos (copied from the wellness reference section on `/build-tab-pills-intro`), four `venue-card-fullbleed_item` panels inside the frame | `f64fcd45-012b-7142-15ab-9a7c976b1b8e` | root `data-scroll-enlarge-snap`, stage `-stage`, frame `-media`; each panel `-item`, image `-image` + `data-eager`, content `-content`; four `-tab` links in `nav.tab-pills-intro_tabs` (first `is-active`). Panel images: `6ad67000240d911fb18d77af`, `6ad6700eb28c9b39f95d814d`, `6ad66fe91ce40a5a6239b8ad`, `6ad66ffdba96f2e53726bd55`. Panel headings h3 `heading-style-display`, text `venue-card-fullbleed_text text-size-large`, "discover more" `button is-chamfer` with no link |
| 07 | offers & packages | Offers Slider Split, Base | `7710b922-9655-d111-9c84-f89bd4bb5d0a` | Heading 1 "wellness staycation", Text 1 from the snapshot; other slides default |
| 08 | faqs | faq-accordion | `b604dfc7-d91d-bf13-cea2-eb186c775ffb` | no props |
| 09 | book your escape | CTA Booking Newsletter | `93056cc4-7f09-395c-9099-760ea69aeb10` | no props |
| 10 | the hotel | Footer Links | `47e5c9cc-2c97-668f-9f23-97b7a1a77c6e` | no props |

## Classes

None created. Every class is from the shared families (`tab-pills-intro_*` with `is-media`, `venue-card-fullbleed_*`, `button is-chamfer`, `heading-style-display`, `text-size-large`, `text-size-medium`, `text-style-script`, `text-style-eyebrow-caps`).

## Deviations from the brief

- Hero is Text Dark, not base: `docs/figma/build-plans/Q014/plan.json` lists wellness-collection/01 as `is-text-dark` (#262118 text on a grey slot), same as Q032.
- Sections 02 to 06 are one plain section, not a tab-pills-intro instance plus four Venue Card Fullbleed instances. The Figma animation (Wellness-Col-Animation-1) is the A01 `scrollEnlargeSnap` module, which needs the intro frame and all panels inside one root; tab-pills-intro has no panels slot (slots cannot be made headlessly) and Webflow cannot place elements inside an instance. Same approach as Home (Q031) and Dining (Q032), and as Q021-OQ2 and the P023 interface note describe.
- The "discover more" buttons have no link: there are no wellness detail pages yet.
- Offers slider is the live Q008 component, not a placeholder. No Q006, Q007 or Q009 element is in this page's brief, so no placeholders were needed.
