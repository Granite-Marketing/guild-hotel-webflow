---
title: "Webflow MCP element builder ignores set_text on TextBlock"
date: "2026-10-08"
category: "integration-issues"
module: "webflow-mcp"
component: "tooling"
problem_type: "integration_issue"
severity: "low"
root_cause: "wrong_api"
resolution_type: "workflow_improvement"
symptoms:
  - "Boxes built with data_element_builder show 'This is some text inside of a div block.' instead of the requested label"
  - "data_element_builder reports success for the TextBlock children"
  - "data_element_tool set_text on the TextBlock fails with 'This element doesn't support text'"
tags:
  - webflow-mcp
  - element-builder
  - text-block
  - designer
---

# Webflow MCP element builder ignores set_text on TextBlock

## Problem

Building a guide page with `data_element_builder` (Webflow MCP 2.1), every label created as `{ type: "TextBlock", set_text: { text: "w-full (16:9)" } }` rendered Webflow's default text, "This is some text inside of a div block." The build call returned success.

## Symptoms

- Every TextBlock label showed the default text in the Designer.
- `Heading` and `Paragraph` elements in the same call kept their `set_text` values.
- Afterwards, `data_element_tool` > `set_text` on the TextBlock (a `Block` with a `String` child) returned "This element doesn't support text".

## What Didn't Work

- `set_text` on the TextBlock after creation: rejected, because the MCP treats a TextBlock as a plain Block.

## Solution

Use `Paragraph` (or `Heading`) for any element that needs text from the builder:

```json
{ "type": "Paragraph", "set_text": { "text": "w-full (16:9)" } }
```

To fix existing boxes: `remove_element` the TextBlocks, then append a Paragraph with `set_text` to each parent. Verify with `query_elements` (`children_depth: 2`) that each `String` child holds the intended text.

## Why This Works

The builder applies `set_text` only to element types it treats as text-capable (heading, paragraph, button, links). A TextBlock is created as a div with a default string child, so the option is dropped without an error.

## Prevention

- Never use `TextBlock` in `data_element_builder` schemas when text matters; use `Paragraph`.
- After any builder call that sets text, read the tree back (`query_elements` with `children_depth`) before reporting the page done. A success response does not mean the text applied.
- Nesting is no longer limited to 3 levels: one builder call created a 6-level section (section, padding wrapper, container, header, heading and paragraph). Any 3-level note predates MCP 2.1.
