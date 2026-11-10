---
title: "Hover panel and text above a follow photo: raise the panel and children, not the item"
date: "2026-11-10"
category: "ui-bugs"
module: "src/utils/hoverFollowImage.ts, docs/reference/site-head/hover-follow-text.css"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "low"
applies_when:
  - "Text must sit above an image that follows the cursor over a list"
  - "A pseudo-element panel needs to sit between a photo and the text"
tags: [z-index, stacking-context, hover-follow-image, pseudo-element, corporate]
---

# Hover panel and text above a follow photo: raise the panel and children, not the item

## Problem

On the Corporate "why teams choose" list a photo follows the cursor (`z-index: 10`) and covered the hovered item's text. It took four releases (v1.1.53 to v1.1.57) to get the photo, a dark chamfered panel and the text in the right order:

1. The list had `z-index: 1`, a stacking context, so nothing inside it could rise above the photo. Fix: `z-index: auto` on the list.
2. Raising the whole item (`isolation: isolate` plus a delayed `z-index` transition) put the text above the photo but also the item's divider line, which then drew across the photo.
3. Sizing the panel with `inset: 0` covered the item's grid min-height, a tall empty box below short text.

## Solution

- Leave the item unraised. Only `.is-active::before` (the panel) gets `z-index: 11` and `.is-active > *` (the text) gets `position: relative; z-index: 12`. The divider stays under the photo.
- `hoverFollowImage` measures the first and last child and sets `--hover-panel-top` and `--hover-panel-height`, so the panel wraps the text, not the cell.
- Order on hover: the photo shows, the panel fades in after 0.2s, then the text masks in line by line. Masks are rebuilt with SplitText on every hover and reverted on leave; each line clip has `.12em` padding (cancelled by a negative margin) so descenders are not cut.

## Prevention

To put part of an element above an overlay, raise only that part. Check every ancestor between the two for a `z-index` or `isolation` that creates a stacking context.
