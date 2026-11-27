---
title: "Per-item heading tag: one element that is a heading in one place and plain text in another"
date: "2026-11-27"
category: "conventions"
module: "Designer: CMS lists and components (spec #419, ticket #422)"
component: "tooling"
problem_type: "convention"
severity: "medium"
applies_when:
  - "An SEO plan asks for the same element to be a heading on one item or page and a paragraph on another"
  - "A CMS list item's title must be H3 for one item and p for the rest"
  - "A component instance's title must be a heading on one page and a paragraph on another"
---

# Per-item heading tag

## The problem

Webflow lets a heading's tag be set by a component "Tag property" or a conditional, but only between H1 and H6. It cannot turn a heading into a paragraph. Every clash in the SEO sheet (#419) is heading versus paragraph, so the tag setting alone cannot do it.

## The pattern

Two copies of the title, side by side, same classes, same text binding, each shown by its own condition:

1. The heading (H3 or whatever the row asks), visibility bound to a switch that means "heading".
2. A Paragraph with exactly the same classes, text bound to the same field or prop, visibility bound to the opposite switch.

Webflow leaves an element whose visibility is bound to an off switch or prop **out of the published HTML** (no `w-condition-invisible` copy), so search engines see only the one that is shown. Proven on the homepage retail slider on 27 Nov 2026: one `h3`, four `p`, no hidden copies, screenshots pixel-identical before and after at 390 and 1440.

### On a CMS list

- Visibility can only be bound to a switch being **on**, never off. So it takes two switches, kept opposite, like the home dining cards' "Show Logo" and "Show Name":
  - `Settings - Title as heading` (on: the heading shows)
  - `Settings - Title as text` (on: the paragraph shows)
- Put both in the collection's Settings field group, with help text telling editors to keep them opposite.
- Set both on every existing item, or the title disappears (both off shows nothing).

Offers collection (`6b0056f7a2110448c9442119`): `settings---title-as-heading` `a7dcb32b86ae5575eee3e23fc1f1730c`, `settings---title-as-text` `16bcd7c9013c9861c068e9df9ed59f0e`. `shops at the guild` (retail-1) has heading on; every other offer has text on.

### On a component used on several pages (no CMS)

Two boolean props on the component ("Title as heading", "Title as text"), each bound to one copy's visibility; set them per instance. Static props have no CMS limits, so the Webflow MCP can do the whole thing.

## Tool limits (Webflow MCP 2.2)

- A CMS field cannot be bound to anything inside a **component definition** ("Element is not inside a CMS context"), even with the component open in the Designer.
- An element holding a bound Collection List cannot be turned into a component through the MCP (`transform_element_to_component` refuses). The Designer's Create component button can.
- So for a CMS list inside a component: unlink the instance, bind on the page, then press Create component in the Designer (one click). The retail slider is a plain homepage section until that click is made.
- `data_element_builder` refuses CMS bindings in `settings` at creation; create the element first, then `set_settings` the bindings.

## Check it

- `curl` the published page and count tags on the class: only the expected tag per item, and no `w-condition-invisible`.
- Screenshot the block before and after at 390 and 1440. Site-wide tag styles (All H3, All Paragraphs) can shift spacing under the same class.
- `pnpm heading-check` for the sheet rows.
