---
title: "Splitting a layout variant into its own component without a visual change"
date: "2026-11-20"
category: "workflow-issues"
module: "webflow-designer"
problem_type: "workflow_issue"
tags: [webflow, mcp, variants, components, combo-classes, site-head]
---

# Splitting a layout variant into its own component

Learned on X1 (Split image text light into six components).

## Method that worked

1. Read the variant's real CSS from the published stylesheet (`w-variant-<id>` selectors), not `get_variant_styles` per class: one fetch covers every class and breakpoint.
2. Write each layout's overrides into named combos (`_media is-edge`). A combo has higher specificity than the variant's `:where()` rule, so it also wins over base rules at smaller breakpoints. Restate the base value at a lower breakpoint wherever the variant did not override it there.
3. `duplicate_component`, apply the combos, delete the copied variants, remove props and elements the layout never uses. Prop ids survive duplication, so instance values copy across by the same id.
4. Swap each instance (below), publish, confirm `lastPublished` moved, compare before and after screenshots pixel by pixel.

## Gotchas

- **Instances cannot be anchors.** `insert_component_instance` and `move_element` refuse `before`/`after` a component instance. Append the new instance to the parent, then move it before or after the nearest plain section (a Block, not an instance). Live `main > *` order shows where that is.
- **Head and bundled CSS can target variant ids.** `grep -rn <variantId> docs/reference/site-head src` before splitting. Those rules stop matching after the swap. Move them into combos where the rule is a plain style; keep only structural selectors (sibling `~`, `:has`) in CSS, retargeted to the new combo.
- **A combo name used twice in one chain matches twice.** `_media is-secondary is-wide-split` also matches `.split-image-text-light_media.is-wide-split` (the main image combo), because the element carries both class tokens. Give the second element its own name (`is-wide-second`).
- **Not every variant rule rendered.** Two variant rules in the stylesheet (a component margin, a body nudge at 650px) did not show in the old render. Trust the before screenshot: inject the candidate CSS with Playwright (`addStyleTag`) and diff against the before shot before writing it to Webflow.
- **Removing a prop bakes its default into the element.** Text props become fixed text (and the input `aria-label` too), which is how numbered props become native elements: set each prop's default to the page's value, then `remove_prop`. Booleans bake too: a visibility switch whose default was off leaves its element hidden. Turn those elements back on with `set_visibility` before publishing.
- **Check duplicated element ids before styling.** Ids in a duplicate follow the source's offsets, but a removed or reordered element shifts them by one. Query the tree and match each id to its base class before `set_style`; one off-by-one put the layout combo on the close icon and the figure combo on the layout.
- **An existing combo can beat the variant.** A variant rule is `:where()`, so an older combo on the same element (`_panel.is-art`, small padding 24px) won over the variant's padding-top. Copying the variant value into the new, more specific combo then changes the render. Diff the after-shot and take the value the old page actually showed.
