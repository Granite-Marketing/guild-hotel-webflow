---
title: "History landmark: one element, clip window and image scale in lockstep"
date: "2026-10-27"
category: "integration-issues"
module: "historyStickyYear collapse gallery"
component: "frontend_stimulus"
problem_type: "integration_issue"
severity: "medium"
status: "resolved"
root_cause: "logic_error"
resolution_type: "code_fix"
symptoms:
  - "The image visibly changes framing just before the landmark mask opens"
tags:
  - gsap
  - scrolltrigger
  - clip-path
  - history
---

## Problem

F45. A JS clone of the Zuma image (cover scale 1.0, a 4.5x zoom in the card
window) was crossfaded over the real card (cover scale 0.222). The two
framings differ 4.5x, so the picture changed before the mask moved.

## Why clip-only cannot work

With one image at a fixed scale, the card-sized window is necessarily the
zoomed crop, never the card framing. To keep the card framing at frame 1 the
image must scale from card scale to cover scale while the window opens.

## Fix

No clone. On the real figure, tween `clipPath` from `inset(0px)` to
`inset(-Ypx -Xpx)` (X = (vw - fw) / 2, Y = (vh - fh) / 2; the figure is
overflow visible, the root is overflow clip). On its img, tween `scale` from 1
to `K = max(vw/fw, vh/fh)` with the same duration and ease at the same
timeline position. When K = vw/fw the window width is fw * scale, so the image
box always covers the window; height-limited K (mobile) covers too. Each
property is tweened once on one element, so the F20 shared-property flash
cannot return. Supersedes the F37 no-scale rule and the F09 copy.
