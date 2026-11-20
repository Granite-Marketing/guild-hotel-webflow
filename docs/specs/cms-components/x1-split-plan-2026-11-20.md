# X1: split layout-changing components (plan, 2026-11-20)

Stephen's rule: similar single-purpose components are fine; variants only for small changes (colour, alignment, one or two elements shown or hidden). Classes stay shared.

## Inventory

| Component | Instances | Variants | Layout variants (split out) | Keep as variants |
|---|---|---|---|---|
| Split image text light | 14 | 14 | Edge, Edge Large, Wide (second image), Stagger Left, Stagger Mid, Compact | Base, Olive, Olive Home, Olive Dining, Blue, Tan, Arts Collection, Neighborhood Downtown (to confirm colour-only) |
| Hero Fullbleed Centered | 25 | 9 | Left, Home, Dining, Centred Mobile, Short Mobile (to confirm) | Base, Text Dark, Blue Button, Burgundy Button |
| Overlay Detail Panel Modal | 33 | 5, 60 props | Venue detail (image, text, numbered Item 1 to 5 become a slot of a Detail Item component), Book menu list | Base, Dark, Image Bg, Burgundy, Centered (colour) |
| Art Detail Modal | 5 | 5, 63 props | Art piece, Artist | colour variants |
| form-split-script-contact | 5 | 6, 43 props | Contact form, Proposal form (Tall), Guidelines form, Press contact (details only), Corporate | none |

Unused with numbered props (ask Stephen before deleting): faq-accordion, Offers Slider Split, Venue Card Fullbleed, Article Card Staggered, timeline-scatter-images Tall, Room List Hover Preview, Press Section Styles.

## Method per new component

1. Duplicate the source component under its new name.
2. Read the chosen variant's styles (`get_variant_styles` per breakpoint) and write them as named combo classes on the duplicate's elements; check every `url(...)` value survives (see `docs/solutions/integration-issues/webflow-unlink-truncates-url-values.md`).
3. Remove the other variants and the props the layout does not use; numbered repeats become a slot.
4. Swap each instance: insert the new component before it, copy its prop values, remove the old one.
5. Publish, confirm `lastPublished` moved, check 390, 650, 800, 991 and 1440 against Figma, console, and the props panel.
6. Post the before and after list on #322.

Estimate: one long session per component; Split image text light first as the pilot.
