---
module: buttonHover
tags: [buttons, hover, css, audit]
problem_type: convention
last_updated: "2026-11-12"
---

# Button system (Trello Desktop-CTA-Buttons)

One rule for every chamfer button on the site: a button is **filled** or **outlined** at rest, and on hover it wipes to the **inverse** (filled drains to an outline, outlined fills), with the same wipe, duration and easing everywhere and the label rolling to the legible ink.

## Audit (live staging, 1440, 2026-11-12)

Crawled 23 pages (every static page plus one item per CMS template) with Playwright, hovering each visible button. "Hover" is the state after the wipe finishes.

| # | Where | Element and classes | Rest | Hover today | Follows the rule? |
|---|---|---|---|---|---|
| 1 | Footer CTA, every page | `a.button.is-chamfer.is-text-burgundy.is-wide.is-small` "Book now" | cream fill, burgundy label | cream outline, cream label | yes |
| 2 | Footer CTA, every page | `input.button.is-chamfer.is-text-burgundy.is-small` "Join us" | cream fill, burgundy label | burgundy fill, cream label | **no** (stays filled; different from its pair) |
| 3 | Home hero | `a.button.is-chamfer.is-wide.hero-fullbleed-centered_button` (variant 1eb6c0d5) "Book your stay" | cream fill, dark label | cream outline | yes |
| 4 | Dining Lobby Bar, Zuma heroes | `a.button.is-chamfer.is-wide.hero-fullbleed-centered_button` (variants 81c5f9ea burgundy, e8c11cfd blue) "Reserve a table" | burgundy or blue fill, cream label | cream fill, coloured label | **no** (stays filled) |
| 5 | Venue cards, room list, tab pills (Home, Dining, Rooms, Wellness, Meetings, Corporate) | `a.button.is-chamfer` "Discover more", "View more" | cream fill, dark label | cream outline | yes |
| 6 | Rooms grid cards | `p.button.is-chamfer` "View more" (shows on card hover) | cream fill | cream outline | yes |
| 7 | Mobile menu | `a.button.is-chamfer` "Book" | cream fill | cream outline | yes |
| 8 | Contact dark CTA | `a.button.is-chamfer.is-wide` "Read our FAQs" | cream fill | cream outline | yes |
| 9 | Neighborhood corporate | `a.button.is-chamfer.is-text-burgundy` "Corporate & legal packages" | cream fill, burgundy label | cream outline | yes |
| 10 | Home venue cards | `a.button.is-chamfer.is-outline-light` "Explore more" | cream outline | cream fill, dark label | yes |
| 11 | Rooms quiz options | `a.button.is-chamfer.is-outline-light.is-fill` (+ `is-active` when chosen) | cream outline (chosen: cream fill, burgundy label) | cream fill | yes |
| 12 | Map feature (Home, Rooms, Dining), Home art stories | `a.button.is-chamfer.is-outline` (+ `is-dark-mobile`) "Discover more" | dark outline | dark fill, cream label | yes |
| 13 | Meetings features, Corporate split | `a.button.is-chamfer.is-dark` "Book your space" | dark fill, cream label | Meetings: cream with 2px dark outline (one-off CSS). Corporate: burgundy fill | **no** (one-off on Meetings, stays filled on Corporate) |
| 14 | Forms: Contact, Press, Meetings, Guidelines, Corporate | `input.button.is-chamfer.is-dark` (some with a component variant) "Submit your request", "Send your message" | dark fill, cream label | burgundy fill | **no** (stays filled) |
| 15 | Article body (Happenings template) | `a.button.is-chamfer.is-burgundy` "Learn more" | burgundy fill, cream label | cream fill, burgundy label | **no** (stays filled) |
| 16 | Offers slider, 13 pages | `a.offers-slider-split_button` (own class family) "Discover more" | cream fill, burgundy label | burgundy fill on a burgundy section, so it reads as plain text (the Loom example) | **no** |
| 17 | Offers slider, Home Blue variant | `a.offers-slider-split_button` (variant 1993beed) | dark fill, light blue label | light blue fill | **no** |
| 18 | Offers slider, Neighborhood Tan variant | `a.offers-slider-split_button` (variant 33c1374c) | cream fill, tan label | tan fill | **no** |
| 19 | Venue detail modal (Meetings, Neighborhood, Corporate) | `a.overlay-detail-panel-modal_button` | dark fill, cream label | burgundy fill | **no** (own class family) |
| 20 | Venue detail modal | `a.overlay-detail-panel-modal_item-button` "Reserve" (base, cream fill; variant 72048989 cream outline) | cream fill or cream outline | burgundy fill, or cream fill | base **no**, outline variant yes (own class family) |
| 21 | 404, Room Detail placeholder | `a.button` (Relume default) "Go Home" | black square fill, white label | no change | **no** (not a chamfer button) |
| - | Desktop nav | `a.site-nav_book` "Book now" | plain text | chamfer fill (approved F57, `nav-book-hover.css`) | out of scope: text at rest, not filled or outlined |
| - | Text links | `a.button.is-link` "Uncover our history" | underlined text | underline redraw | out of scope: not a filled or outlined button |
| - | Modal tabs | `overlay-detail-panel-modal_item-button` variants 0e56f707 / 073d0fa4 | text tabs | opacity | out of scope: tabs, already opted out of the button hover |

**Mechanisms in use today:** four stylesheets (`button-hover.css` fill layer, `button-outline-hover.css` cream-fill-to-ring, `meetings-button.css` one-off, `nav-book-hover.css`), two outline techniques (stretched SVG background for `is-outline` / `is-outline-light`, clip-path ring for the cream buttons), and three class families (`button`, `offers-slider-split_button`, `overlay-detail-panel-modal_*button`).

## Contract (approved by Stephen 2026-11-12)

```
button is-chamfer [colour] [is-outline] [size]
```

- **Shape:** `button is-chamfer` on every button (anchor, paragraph or submit input).
- **Colour modifier (one):** names the button colour (the fill when filled, the stroke and label when outlined) and its contrast label.

  | Modifier | Button colour | Label on the fill |
  |---|---|---|
  | none | cream | off-black |
  | `is-text-burgundy` | cream | burgundy |
  | `is-dark` | off-black | cream |
  | `is-burgundy` | burgundy | secondary |
  | `is-blue` | blue | secondary |

  Component variants that only recolour a button (hero Lobby Bar and Zuma, offers Blue and Tan) keep their variant and map to a colour pair in the CSS, as `button-hover.css` already does.
- **State modifier:** none = filled at rest; `is-outline` = outlined at rest. `is-outline-light` folds into `is-outline` (cream is the default colour); today's dark `is-outline` becomes `is-outline is-dark`.
- **Sizes and layout, unchanged:** `is-small`, `is-wide`, `is-fill`. Selection state, unchanged: `is-active` on the quiz options shows the filled state.
- **Hover:** filled drains to a 1px outline, label to the outline colour; outlined fills from the bottom, label to the contrast colour. `--btn-dur` .45s and `--btn-ease` everywhere, label roll on every anchor (submit inputs swap colour, they cannot hold spans).
- **Outline colour:** the button colour, except burgundy and blue buttons (article body, Lobby Bar and Zuma heroes), which sit on photos and outline in their light label colour so the outline stays legible.
- **CSS:** one stylesheet, `docs/reference/site-head/button-system.css`, minified into the `<style data-button-system>` embed inside the Site Nav component (Designer-visible). It replaces `button-hover.css` (site head), `button-outline-hover.css` and `meetings-button.css` (bundle). No pseudo-elements: the element keeps a static chamfer clip-path and its background holds the ring and a fill layer whose height animates, so anchors and inputs share one technique. Every paint rule carries `:not(#_)` so Webflow combo and variant colours cannot override it.

### Migration

- Footer "Join us" (2): same classes as "Book now" minus `is-wide`; behaves the same once the input supports the drain.
- Offers slider (16 to 18): `offers-slider-split_button` replaced by `button is-chamfer is-text-burgundy`; Blue and Tan variants keep their colours through the component variant. Class `offers-slider-split_button` deleted.
- Venue modal (19, 20): `overlay-detail-panel-modal_button` becomes `button is-chamfer is-dark` (Overlay Detail Panel Modal and Art Detail Modal). The Reserve button keeps `overlay-detail-panel-modal_item-button`, because the same element's component variants also drive the text tabs and its show and hide; the CSS treats it as cream with a burgundy label (outlined in variant 72048989) and leaves the tab variants alone.
- Outline buttons (10 to 12): `is-outline-light` to `is-outline`; dark `is-outline` to `is-outline is-dark`. `is-dark-mobile` is checked and kept only if it still does something.
- 404 "Go Home" (21): not migrated. It sits inside Webflow's 404 utility block, which the API cannot read, and the 404 page has no Site Nav, so it would not load the button CSS anyway.
- Meetings "Book your space" (13): loses its one-off CSS; becomes dark fill to dark 1px outline (was 2px).
- `src/utils/buttonHover.ts`: selector shrinks to `.button` once the other families are gone.
- Nav Book Now stays on `nav-book-hover.css`: it is text at rest, so folding it in would change how it looks.

### Where each class lives (Webflow)

- Offers Slider Split: 5 slide links, `button is-chamfer is-text-burgundy`. Blue and Tan variant colours come from the section variant class in the CSS.
- Map Feature, Map Feature Image Bg, Map Feature Centered: `button is-chamfer is-dark is-outline`.
- Venue Card Fullbleed Tall (1) and Left (3): `button is-chamfer is-outline`.
- Home art stories link: `button is-chamfer is-dark is-outline is-dark-mobile` (filled below 768px).
- Rooms quiz options (3 template links, one per step): `button is-chamfer is-outline is-fill`.
- New combo styles: `.button.is-chamfer.is-dark.is-outline`, `...is-dark.is-outline.is-dark-mobile`, `.button.is-chamfer.is-outline.is-fill`. `is-outline` lost its SVG background.
