---
title: "Webflow publishes every radio as name=\"radio\", so separate radio groups collide"
date: "2026-10-12"
category: "integration-issues"
module: "forms and Finsweet CMS Filter radios"
component: "frontend_stimulus"
problem_type: "integration_issue"
severity: "medium"
root_cause: "config_error"
resolution_type: "code_fix"
symptoms:
  - "Picking a radio in one filter group unchecks the selected radio in another group"
  - "Finsweet still filters by both (both appear in the URL query) while only one looks selected"
  - "Published HTML shows name=\"radio\" on every radio; the Designer group name is only in data-name"
tags: [webflow, radio, group-name, data-name, finsweet, cms-filter, forms, mcp]
---

# Webflow publishes every radio as name="radio", so separate radio groups collide

## Problem

A listing filter had several single-select radio groups (category, status, location, sort). Picking a radio in one group unchecked the radio in another, because the browser saw them all as one group. Finsweet kept filtering by both, so the visible selection and the actual filter disagreed.

## Symptoms

- Category selected, then a location picked: the category visually unchecks, but the URL reads `?category=Residential&country=France`.
- In published HTML every radio has the same `name`:

  ```html
  <input type="radio" data-name="category" name="radio" ...>
  <input type="radio" data-name="country"  name="radio" ...>
  <input type="radio" data-name="status"   name="radio" ...>
  ```

## What Didn't Work

- **Setting the radio's Group Name (`groupName` setting) through the Webflow MCP.** It saved and showed in the Designer, but published only as `data-name`. `name` stayed `radio` (the input's Name field, default "Radio").

## Solution

Restore the real group name at runtime from `data-name`, as the first step of the filter module inside `Webflow.push`:

```ts
const restoreRadioGroups = () => {
  document
    .querySelectorAll<HTMLInputElement>('input[type="radio"][data-name]')
    .forEach((radio) => {
      radio.name = radio.dataset.name ?? radio.name
    })
}
```

Scope the selector to the filter form (for example `[fs-cmsfilter-element="filters"] input[type="radio"][data-name]`) if other forms on the page rely on their published names. Browsers read `name` live for grouping, so changing it after Finsweet has initialised is safe.

## Why This Works

Browsers group radios by `name` within a form. Webflow writes the Designer "Group Name" to `data-name` and the input's Name field to `name`. Every radio built by copying another keeps the default Name "Radio", so they all collide. Copying `data-name` into `name` gives each group its own name again.

## Prevention

- After building radios (Designer or MCP), check the published HTML for distinct `name` values per group, not just the Designer's Group Name.
- The Designer-side alternative is setting each radio's Name field to the group name. The runtime restore still guards against new radios copied from old ones.
- This affects any Webflow form with more than one radio group, not only Finsweet filters.

## Related

- [finsweet-cms-filter.md](../../reference/finsweet-cms-filter.md): single-select radio filter setup
- [finsweet-cms-filter-webflow-setup.md](finsweet-cms-filter-webflow-setup.md): attribute wiring and active state
