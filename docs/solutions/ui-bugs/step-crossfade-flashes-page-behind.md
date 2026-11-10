---
title: "Step crossfade flashes the page behind: stack steps in one grid cell and fade the next in over the current"
date: "2026-11-10"
category: "ui-bugs"
module: "src/utils/roomsQuiz.ts, docs/reference/site-head/rooms-quiz-crossfade.css"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "low"
applies_when:
  - "Swapping between full-width steps, panels or slides with a fade"
tags: [crossfade, grid, rooms-quiz, gsap, autoalpha, scrolltrigger-refresh]
---

# Step crossfade flashes the page behind: stack steps in one grid cell and fade the next in over the current

## Problem

The /rooms quiz faded the current step out, then the next step in (v1.1.45). Halfway through, both steps were partly transparent, so the section background showed through: a visible flash between questions. Fading both at once in normal flow also jumps the layout, since the two steps sit one below the other.

## Solution (v1.1.52)

- CSS puts every step in the same grid cell (`grid-area: 1/1` on a `display: grid` section), so the entering step overlaps the current one instead of stacking below it.
- `showStep` adds `is-entering` to the next step (making it display) and fades it from `autoAlpha: 0` at `zIndex: 1` over the current step, which stays fully opaque underneath. Only on complete does it swap `is-active` and clear the inline props.
- It starts with `gsap.killTweensOf` and `clearProps` on every step, so a fast double click cannot leave two steps half faded.

## Related gotcha

Restarting the quiz hides the results, and the resulting `ScrollTrigger.refresh(true)` runs once the scroll settles, which can move the quiz after the scroll to it has landed. The restart handler listens for one `scrollEnd` and scrolls to the quiz top again if it is more than 2px off.

## Prevention

Crossfade by fading the incoming element in over an opaque outgoing one; never fade both. For text panels, sequence a mask out then in instead ([stacked-tab-panels-sequenced-mask.md](../conventions/stacked-tab-panels-sequenced-mask.md)).
