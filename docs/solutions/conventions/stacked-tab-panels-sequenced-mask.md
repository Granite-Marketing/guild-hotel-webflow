---
title: "Stacked tab panels: sequence mask-out and mask-in, never crossfade text"
date: "2026-10-26"
category: "conventions"
module: "src/utils/mediaTabs.ts"
problem_type: "convention"
severity: "low"
tags: [gsap, splittext, tabs, mask-reveal]
applies_when:
  - "Panels share one grid cell (or are absolute) and swap on a tab change"
---

## Problem

Feedback F16: Meetings & Events tab panels crossfaded. The incoming panel
faded in over the outgoing one while its children also slid up, so both
copies were on screen at once. With panels of identical layout (and here
identical copy) this read as a doubled, ghosted heading and button.

## Rule

- Never tween `autoAlpha` on stacked text panels. Show only the active panel
  with `gsap.set({ autoAlpha: 1, zIndex: 1 })`; all others `autoAlpha: 0`,
  `zIndex: 0`, so inactive CTAs cannot be clicked.
- Swap copy as one timeline: outgoing words and buttons go to
  `yPercent: -110` behind their masks, then the panels swap with `set`, then
  incoming targets rise from `yPercent: 110`. Park the outgoing targets at
  110 for their next entrance.
- Masks: SplitText `lines,words` with `autoSplit`, overflow hidden on the
  lines (never `mask: 'lines'`); non-text targets inside a clip wrapper.
  `onSplit` reads the current active index so a re-split places fresh words
  correctly.
- Before a new switch, `timeline.progress(1).kill()` the running one so a
  rapid click starts from a settled state.
- Tabs switch on click and keyboard only; hover switching was removed.
- Media behind the panels may still crossfade: images do not double-read.
