---
module: webflow-designer
tags: [webflow, mcp, unlink, variants, publish]
problem_type: integration-issue
date: 2026-11-20
---

# Unlinking a variant instance can truncate url() values and silently block publishing

**Symptom.** After `unlink_component_instance` on an instance using a non-base variant, every site publish returns 202 but `lastPublished` never changes and staging keeps the old build. The Designer's Publish button shows: `CSS error in rule ".overlay-detail-panel-modal_item-button.image-bg-40": Unexpected token BadString("https;")`.

**Cause.** Unlinking turns the variant's styles into generated combo classes ("Image Bg 40", "Blue 3"). A `background-image: url("https://...")` value was cut to `url("https`, which is invalid CSS, and Webflow refuses to publish any site with an invalid style. The API reports nothing.

**Fix.** Read the variant's own value with `get_variant_styles` and write it back on each generated combo at the same breakpoint (`update_style` with `parent_style_names`). Query every generated combo at all breakpoints (`query_styles` name_path `["", "<Variant> "]` with `include_breakpoints`): property filters only look at the base breakpoint, so they miss these.

**Prevent.** After any unlink, check that the next publish actually moves `lastPublished` before telling anyone it is live.
