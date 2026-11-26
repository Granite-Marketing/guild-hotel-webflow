---
module: webflow-data-api
tags: [webflow, data-api, copy-upload, designer, mcp]
problem_type: integration-issue
date: 2026-11-26
---

# The Data API cannot write page text on the primary locale

## Problem

`POST /v2/pages/{page_id}/dom` (update static content) needs a `localeId`, and for this site's only locale (the primary) it answers `400 The provided locale must be a secondary locale.` Leaving `localeId` out is a validation error. So static page text and component instance props cannot be changed through the Data API on a site without localization; only CMS items can.

## What works

- CMS text fields: `PATCH /v2/collections/{id}/items` (staged; a site publish puts them live).
- Page text and props: the Webflow MCP with the Designer open. Element ids are `{ component: <pageId>, element: <Data API node id> }`, so node ids from `GET /v2/pages/{id}/dom` can be used directly:
  - `data_element_tool > set_text` for text nodes
  - `data_component_props_tool > set_component_instance_prop_values` with `type: "string"` for text props
- `scripts/api/webflow/copy-upload.mjs` reads the page through the Data API, decides each write (write, already live, or drifted), and with `COPY_PLAN=<file>` saves the plan for the Designer; `--log-plan` logs it once applied.

## Watch for

- The copy check can report "differs" for a line that is live when the same placeholder text sits in a second copy of the block on the page (tabs, mobile copies). Check the page text directly before calling it a miss.
