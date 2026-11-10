---
title: "Animated link underline: draw it on an inline span round the text, not on the link"
date: "2026-11-10"
category: "ui-bugs"
module: "src/utils/underlineHover.ts, docs/reference/site-head/underline-hover.css"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "low"
applies_when:
  - "Replacing text-decoration with an animated background line"
  - "An underline sits too far below the text, or runs under padding, on some links or in Safari"
tags: [underline, hover, safari, background-line, box-decoration-break, button-hover]
---

# Animated link underline: draw it on an inline span round the text, not on the link

## Problem

The Trello "underline redraw" hover swaps `text-decoration` for a 1px `background` line that wipes out and back in. Drawn on the `<a>` itself (v1.1.58), the line followed the link box, not the text: it ran under side padding on the rooms quiz links, sat at the wrong width in Safari, and dropped well below the words on phones wherever the link was a padded block or a flex item. A second attempt (v1.1.60) added `background-origin: content-box` and a `--ul-y` offset; it fixed Safari's width but not the mobile distance.

## Root cause

A background line is positioned against the element's box. On a block, flex or padded `<a>`, that box depends on padding, line height and layout, not on the font's baseline, so no single offset fits every link.

## Solution (v1.1.61)

`underlineHover()` wraps each underlined link's text in `span[data-underline]` (inline), and the CSS draws the line on that span at `calc(100% - .07em)`. An inline box is exactly the text's line box, so the line hugs the glyphs whatever the link's own box does.

- `box-decoration-break: clone` keeps every wrapped line underlined.
- Links are found by computed `text-decoration-line`, and the old decoration is removed with `!important` on `[data-underline-host]` and its descendants.
- For `[data-btn]` links the span goes inside the roll label's visible child, and `:has([data-underline])` hides the duplicate roll copy, so an underlined button only redraws its line.

## Prevention

Any decoration drawn with a background (underlines, highlights) belongs on an inline element wrapping the text, never on the link or button box.
