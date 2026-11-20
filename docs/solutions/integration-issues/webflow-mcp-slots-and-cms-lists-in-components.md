---
module: webflow-designer
tags: [webflow, mcp, component-slots, collection-list, components]
problem_type: integration-issue
date: 2026-11-20
---

# Webflow MCP: slots wrap their items, and CMS lists cannot go into components

## Slots publish a wrapper div

A component slot (`ComponentSlot`) publishes as an unclassed `<div>` around whatever an editor drops in it. A grid, a flex gap or an `:nth-child` rule on the slot's parent then sees one child (the wrapper), not the items.

Fix: in the component's style embed, `.<parent-class> > div:not([class]) { display: contents; }`, and write position rules as descendant selectors (`.grid .item:nth-child(3n)`), not child selectors. Used on Gallery Mosaic Captioned, Card Carousel Header Left, timeline-scatter-images, Article Card Staggered Tall, Corporate & Services and Key Features (spec #317).

## Collection Lists inside component definitions

Through the MCP (headless or Designer bridge), a Collection List created inside a component definition takes a `source` but never becomes a CMS context: `sort` fails with "No source connected" and field bindings fail with "Element is not inside a CMS context". `transform_element_to_component` also refuses an element that holds a bound Collection List.

Workarounds:
- Build and bind the list on a page (page-level lists work headless), then create the component in the Designer by hand (right-click, Create component), or keep the section page-level.
- Plain content components (slots, props) are fully scriptable.

Also: a newly created collection is usable headless at once; the Designer canvas may need a reload before its panels show it.
