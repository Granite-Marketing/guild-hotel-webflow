---
title: "Sitewide body text size is set on each component class, not one shared class"
date: "2026-11-12"
category: "conventions"
module: "Webflow styles, body typography"
problem_type: "convention"
component: "frontend"
severity: "medium"
applies_when:
  - "The client asks to change paragraph or body text size across the site"
  - "Any sitewide change to a typography value (size, line height, tracking) that components copy onto their own classes"
tags: [typography, font-size, webflow-styles, query-styles, text-size-medium, text-size-large]
---

# Sitewide body text size is set on each component class, not one shared class

## Context

Trello card "Paragraphs-Desktop" asked for body paragraphs to drop from 20px to 18px on desktop. Changing `text-size-medium` alone would have changed a fraction of the site: when each component family was built, its paragraph class got its own `font-size: 1.25rem; line-height: 1.3` copied from the Figma Paragraph style (see the `_text` rows in `docs/reference/style-inventory.md`). On 2026-11-12 the desktop body size lived on 27 component classes plus the utilities `text-size-medium` and `text-size-large`.

The first pass updated the 27 component classes and `text-size-medium`, published, and measured. The home page still had 11 paragraphs at 20px. The hero intros (`hero-fullbleed-centered_text`) and the venue cards (`venue-card-fullbleed_text`) wrap their paragraphs in `text-size-large`, which was also 1.25rem. A second change to `text-size-large` fixed them.

## Guidance

Treat a sitewide typography change as a query, not a single class edit:

1. Find every class carrying the value, with the Webflow MCP `data_style_tool` `query_styles`, filtering on the property and value (for example `font-size` containing `1.25rem`), with `include_breakpoints` so you see the per-breakpoint overrides.
2. Drop headings and quotes from the list (`heading-style-h5`, `heading-style-h6`, `h6`, `blockquote`, `text-style-quote`, eyebrow classes). Keep every paragraph, list item and rich text body class, plus the `text-size-*` utilities.
3. Update the base breakpoint only. The small breakpoint (below 768px) already sets its own size (1rem / 1.25 on these classes), so it stays as it is. Medium inherits the new desktop value.
4. Publish to staging, then measure. Read the computed `font-size` of every non-empty `main p` on several page types (home, a collection page, a CMS template) and group the elements by size. Any element still at the old value names the class you missed: walk up to its parent to find the utility or family class that sets it.

## Why This Matters

A partial change looks finished in a spot check and leaves mixed paragraph sizes across pages. The client then reports the same card again. The measurement step is what catches the classes the query missed, because utilities like `text-size-large` can sit on a wrapper rather than the paragraph itself, and the paragraph then inherits a size that no paragraph class declares.

## When to Apply

- A request to resize body text, paragraphs or descriptions sitewide.
- A request to change line height or letter spacing for body copy everywhere.
- Before trusting `docs/reference/style-inventory.md` for a current value: its rows record build-time values and can lag behind later edits.

## Examples

Measuring after the first pass (computed `font-size` of non-empty `main p`, staging, 1440 wide):

```js
// run in the page console
const sizes = {}
document.querySelectorAll('main p').forEach((p) => {
  if (!p.textContent.trim()) return
  const size = getComputedStyle(p).fontSize
  sizes[size] = (sizes[size] || 0) + 1
})
sizes // home after pass 1: { 14px: 1, 18px: 28, 20px: 11 }; after text-size-large: { 14px: 1, 18px: 39 }
```

Listing the stragglers' wrappers:

```js
[...document.querySelectorAll('main p')]
  .filter((p) => getComputedStyle(p).fontSize === '20px')
  .map((p) => p.parentElement.className)
// ["hero-fullbleed-centered_text text-size-large", "venue-card-fullbleed_text text-size-large is-media-center", ...]
```

Stronger fix not done here: put the body size in a Webflow size variable and bind every paragraph class to it, so a future change is one variable edit. That changes every component class, so it belongs with the planned style cleanup rather than a feedback fix.

## Related

- `docs/reference/style-inventory.md`: per-family classes; several `_text` rows still list 1.25rem from the build.
- `docs/reference/breakpoints.md`: `text-size-*` utilities go on a wrapper, which is why a paragraph can inherit its size from a class it does not carry.
