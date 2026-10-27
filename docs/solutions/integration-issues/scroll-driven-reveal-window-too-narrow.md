---
title: "Scroll-driven triggered reveal skipped while scrolling (F33)"
date: "2026-10-27"
category: "integration-issues"
module: "src/utils/scrollEnlargeSnap.ts"
tags: [gsap, scrolltrigger, scrub, lenis, mask-reveal]
problem_type: "animation-timing"
severity: "medium"
---

# Panel mask text skipped while scrolling

## Symptom

On Home, /dining, /meetings and /wellness the panel text mask-in only played
when the user stopped scrolling and let snap land. Scrolling at a normal
pace (about 1250px/s) made panels flash in and out; panel 0 never revealed.
/arts (single item) was fine.

## Root cause

No second animation system was involved: the pages have no Webflow IX2
(`data-w-id`), no `.slide-in`/`.fade-in`, no `data-animation-*`, and
heroTextReveal / scrollTextReveal are not wired. The bug was inside
`scrollEnlargeSnap.ts`:

- Each panel's content window was short in timeline units (panel 0 about
  0.02 step, middle panels about 0.32 step, about 0.3s of scrolling) while a
  reveal needs about 1.2 to 1.3s.
- Content was driven by raw `self.progress` in the ScrollTrigger `onUpdate`,
  but the visible wipe is scrubbed (`scrub: 0.6` plus the Lenis tail), so
  content started and left on scroll position, not on what the user saw. The
  reverse (1.6x on a half-played timeline) read as a skip.
- Panel 0's reveal point coincided with the next wipe start.

Not causes: `play()` per frame (the index-unchanged early return prevents
it), SplitText `onSplit` rebuilds (only on font swap or resize).

## Fix

- Explicit schedule: `shownAt[i] = 1 + i * (WIPE_DURATION + DWELL)`; the next
  wipe starts `WIPE_DURATION` before the next `shownAt`, so each panel dwells
  for `DWELL` steps.
- Content index is computed from `timeline.time()` in the timeline's own
  `onUpdate` (the ScrollTrigger `onUpdate` misses scrub catch-up).
- `SETTLE` (0.3s) delayed call before `play()`, killed if the panel changes.
- `createLineMaskTimeline` `play()`/`reverse()` are idempotent per direction.

## Rules

- Drive triggered reveals from the scrubbed timeline time, never raw scroll
  progress.
- Give every snapped panel a dwell at least as long as its reveal's share of
  scroll.
- Gate `play()` with a short settle delay so pass-through scrolling does not
  start reveals that are immediately reversed.
