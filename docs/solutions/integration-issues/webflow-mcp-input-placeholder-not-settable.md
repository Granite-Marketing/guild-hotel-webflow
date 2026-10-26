---
title: Webflow MCP cannot set a form input's placeholder
category: integration-issues
date: 2026-10-21
tags: [webflow, mcp, forms, placeholder, input, designer-api]
problem_type: integration_issue
component: webflow_mcp
module: data_element_tool
related:
  - integration-issues/webflow-mcp-element-builder-textblock-text-ignored.md
---

# Webflow MCP cannot set a form input's placeholder

## Problem

On a `FormTextInput` (inside a component, scoped with `scope_component_id`):

- `data_element_tool > set_attributes` with `placeholder` fails with
  `OPERATION_FAILED: An internal error occurred`.
- `data_element_settings_tool > set_settings` with key `placeholder` fails with
  `Setting "placeholder" is not applicable to this element`.
- `get_settings` lists only `domId`, `visibility`, `name`, `required` and `type` for the
  input. Placeholder is not exposed.

The published HTML still renders `placeholder=""`, so the value lives in a setting the
MCP does not surface.

## Workaround

- Set the placeholder by hand in the Designer (input settings, Placeholder field), or
- Design around it with styles only. For the Guild newsletter (F07, 2026-10-21) the
  `<label>` became an inline prefix on the input's underline. See
  `docs/figma/feedback/2026-10-21-styles-f02-f07-f11-f14.md`.

Do not hide a label in favour of a placeholder until the placeholder is confirmed in the
published HTML. Otherwise a publish by anyone ships an unlabelled field.

The input's `::placeholder` state can still be styled through `data_style_tool`
(`pseudo: "placeholder"`).

## Runtime route (F24, 2026-10-26)

A Designer placeholder is also identical across component instances, while the
Photoshoot Request component's label text is prop-driven per page. So the site
sets placeholders at runtime: `src/utils/formPlaceholders.ts` copies each form
label's text into its control's placeholder (or a select's `option[value=""]`),
removes `is-labelled` from the control, and adds `u-sr-only` to the label. A
select with an empty value gets `is-placeholder`. The label only leaves the
visual flow once the placeholder exists, so the rule above still holds: without
JS the visible label remains. Contract: `docs/reference/runtime-modules.md`
(formPlaceholders).
