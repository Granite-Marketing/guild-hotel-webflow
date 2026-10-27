---
title: "History landmark: one full-size image behind a moving mask, never scaled"
date: "2026-10-27"
last_updated: "2026-10-27"
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
  - "The image scales up while the mask opens and looks soft at full bleed"
tags:
  - gsap
  - scrolltrigger
  - clip-path
  - history
  - mask-reveal
---

## Problem

The History "A Landmark Reimagined" section collapses a row of four gallery
cards into one, then opens the first card to full bleed. Stephen's model of
the effect: the image is always full size; the card is only a mask (a window)
onto it; the window moves to the middle and then grows. Four builds missed
that model (F20, F37, F45, F48 in `docs/figma/feedback/`), and each round he
rejected the result as "swapping the image" or "scaling the image".

## Symptoms

- A visible recrop or jump just before the mask opens (F37 and F45: a JS clone
  at a different framing was crossfaded over the card).
- After the clone was removed, the image grew from card size to full bleed
  and looked soft at full size (F45 scale lockstep: the card's small srcset
  source was scaled about 4.5x).

## What Didn't Work

- **Clone crossfade (F37):** a second, full-bleed copy faded in over the card.
  Two framings, so the picture changed before the mask moved.
- **Clip window plus image scale in lockstep (F45):** to keep the static card
  framing at frame 1, the img scaled from 1 to `max(vw/fw, vh/fh)` while the
  clip opened. No swap, but it is a zoom, and the browser had picked a small
  source for the card, so quality collapsed. This doc previously argued
  "clip-only cannot work"; that premise was wrong. It assumed frame 1 must
  match the Designer's card framing. Stephen wanted the opposite: frame 1 is
  simply the part of the full-size photo the window shows.

## Solution

One img, laid out at the full-bleed frame size from init and centred on its
card, which clips it (`src/utils/historyStickyYear.ts:204`, `layoutBleedImage`):
absolute position, `width: vw`, `height: min(root height, vh)`,
`object-fit: cover`, offset so its centre sits on the card centre. The figure
is `overflow: visible` (`:222`) and starts at `clip-path: inset(0px)`, so the
card is a window onto the big photo. The timeline only moves the cards (x/y)
and then tweens the figure's `clipPath` to a negative inset that reaches the
viewport edges (`:198`, `:264`). The img never scales. `sizes = '100vw'`
(`:219`) makes the browser fetch the full-width source, and the layout
re-runs on ScrollTrigger `refreshInit` (`:224`) so a resize keeps it right.
Shipped in v1.1.14 (F48), merged to main via PR 117.

## Why This Works

The visible pixels at any scroll position are a sub-rectangle of one static,
full-resolution image, so nothing can recrop, swap or soften. Moving the card
moves the window and the image together (the img is the card's child), and
opening the clip only reveals more of the same pixels. Each property is still
tweened on exactly one element (`clipPath` on the figure, `x`/`y` on the
items), so the F20 shared-property scrub-reverse flash stays fixed (see
`gsap-fromto-startat-shared-property-scrub-reverse.md`).

## Prevention

- For any "mask reveal" request on this site, the default reading is: the
  media is at its final size and only a clip-path animates. Never scale the
  media to fake the reveal, and never swap in a second copy. Stephen states
  this rule repeatedly (F37 "only the clip path should animate", F48 "I don't
  want the image to scale").
- When the start state looks like a whole, small photo, that is a sign the
  img is still at card size: check that the img box equals the full-bleed
  frame in every frame (Playwright: `img.getBoundingClientRect()` is
  `vw x vh` at card, mid and full).
- Size the source for the final frame (`sizes="100vw"` or eager full-width
  source), not for the card the user first sees.
- When feedback rejects a build twice for the same reason, ask for or draw the
  intended model (Stephen had to supply a box diagram) before the third build.
