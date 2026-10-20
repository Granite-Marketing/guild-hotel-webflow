# Q032 build record: /dining (dining-collection)

Page `6ad66fd476d24ed37ac4c5cb`, Body `6ad66fd476d24ed37ac4c5d1`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q032](../../briefs/Q032-page-dining-collection.md). Read-back of the Body matches this order, and the webflow.io staging publish carries every section below.

| # | Figma section | Built as | Element id | Values |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the hero) | `e255fa70-22ee-606f-76ab-b1f20c55fb40` | Book link default `#book` |
| 01 | a taste of the guild | Hero Fullbleed Centered, Text Dark (`c5755984-9207-f25b-c049-f99910c92943`) | `29267093-71d0-9eb4-2aa9-bae9ed679930` | Heading "a taste of the guild"; Text "A world of invention, craft and sophisticated pleasures"; Show Image off (Figma has a grey slot) |
| 02 | first sips, small bites | script-intro-centered, Wide (`16b2e029-4d87-68f1-ffc1-4a8294038434`) | `0eb649ed-7511-a106-dee2-58bcdf31b6f0` | heading "First sips, small bites\n& big nights out."; paragraph from the snapshot; no image |
| 03 to 08 | venue snap group (zuma, lobby bar, pool lounge, garden terrace, solana coffee) | plain section, `section_venue-card-fullbleed` family, copied from the dining-collection reference section on `/build-venue-card-fullbleed` | `8201c246-9bf3-89c6-44f7-4dab6896e523` | A01: root `data-scroll-enlarge-snap`, stage and media `is-media-center`, five `-item` panels, `-image` + `data-eager` on each photo, `-content`, five `-tab` links in `nav.venue-card-fullbleed_tabs`. Buttons link to the `🍴 Dinings` items: `/dining/dining-zuma`, `/dining/dining-lobbybar`, `/dining/dining-poollounge`, `/dining/dining-gardenterrace`; solana coffee has no item, so its button has no link |
| 09 | the neighborhood | Map Feature (base) | `afb2623e-14c5-c312-4886-1066ab5e3f8f` | defaults (same copy as home/12), Image `6ad74983c0f141bdb6fd4115`, Button Link `/neighborhood` |
| 10 | faqs | faq-accordion | `12db1847-eb85-ca4f-4dd0-13f43cbe9b96` | no props |
| 11 | offers & packages | Offers Slider Split, Base | `5645d5e3-13d8-4805-6b52-83c140f9419e` | defaults (slide 1 "save on 5+ nights"), per `docs/figma/build-plans/Q008/plan.md` |
| 12 | book your escape | CTA Booking Newsletter | `b4f4584e-ce36-6850-ccce-971f8f8712e0` | no props |
| 13 | the hotel | Footer Links | `a18e0838-14a2-59b5-5838-34d47ad9b456` | no props |

## Classes

None created. Every class is from the shared families (`venue-card-fullbleed_*`, `button is-chamfer`, `heading-style-display`, `text-size-large`, `text-style-eyebrow-caps`).

## Deviations from the brief

- Hero is Text Dark, not base: `docs/figma/build-plans/Q014/plan.json` lists dining-collection/01 as `is-text-dark` (dark text on a grey slot).
- script-intro is the Wide variant: Q016 maps this section's `is-wide` text modifier to Wide.
- Sections 03 to 08 are one plain section, not six Venue Card Fullbleed instances: Webflow components cannot repeat panels (Q021-OQ4), and the A01 module needs all panels inside one root. Same approach as Home (Q031).
- The fourth tab reads "garden terrace" (Figma tab: "lobby terrace") to match the panel heading and the `dining-gardenterrace` CMS item.
- Tab links have no href: they are A01 scroll triggers (`data-scroll-enlarge-snap-tab`), and a `#` url write was dropped by the builder.
- Offers slider is the live Q008 component, not a placeholder.
- No Q006, Q007 or Q009 element appears in this page's brief, so no placeholders were needed.
- The brief's "bind the list to the collection" is met with static links to each item: the A01 snap group needs fixed panels, and a Collection List cannot be placed inside the five-panel structure headlessly.
