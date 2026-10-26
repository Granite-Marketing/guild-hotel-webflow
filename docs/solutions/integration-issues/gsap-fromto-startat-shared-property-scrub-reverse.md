---
title: "GSAP fromTo startAt reverts a shared property to its pre-state on scrub reverse"
date: "2026-10-26"
category: "integration-issues"
module: "historyStickyYear collapse gallery"
component: "frontend_stimulus"
problem_type: "integration_issue"
severity: "medium"
status: "resolved"
root_cause: "wrong_api"
resolution_type: "code_fix"
symptoms:
  - "A clip-path mask flashes fully open for a moment when scrubbing back and forth over its start"
  - "Works on the first pass, so it looks intermittent"
  - "Computed clip-path reads none while opacity is above 0"
tags:
  - gsap
  - scrolltrigger
  - scrub
  - clip-path
  - fromTo
---

## Problem

The History landmark mask (F20) had two `fromTo` tweens on the same layer in
one scrubbed timeline, both touching `clipPath`:

```ts
.fromTo(layer, { autoAlpha: 0, clipPath: cardInset }, { autoAlpha: 1, immediateRender: false }, 1)
.fromTo(layer, { clipPath: cardInset }, { clipPath: 'inset(0px)', immediateRender: false }, 1.2)
```

Scrolling forward past 1.2, back below 1, then forward into 1 to 1.2 left
the layer visible with `clip-path: none`: the whole full-bleed photo showed
unmasked until the second tween took over.

## Root cause

With `immediateRender: false`, each `fromTo` records the element's
pre-state when it first renders. Reversing the playhead below a tween's start
reverts its `startAt` to that recorded pre-state, which for `clipPath` was
`none`. On the next forward pass the first tween re-applied `autoAlpha` but
not its `startAt` clip, so the layer showed unclipped.

## Fix

Give each property exactly one tween, and let the tweens that own visual
state write their from-state at build time:

```ts
gsap.set(layer, { clipPath: cardInset() })
timeline
  .fromTo(layer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05, immediateRender: false }, 1)
  .fromTo(layer, { clipPath: cardInset }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.2, immediateRender: true }, 1)
```

- One property per tween: no second tween can revert the property another
  tween owns.
- `immediateRender: true` (plus an explicit `gsap.set` before the timeline)
  means any reverse below the start lands on the card inset, never `none`.
- Keep `invalidateOnRefresh: true` with function-based from values so the
  inset recomputes on resize.

## Prevention

- In a scrubbed timeline, never let two tweens share a property on the same
  target. Split mixed tweens (`autoAlpha` plus `clipPath`) into one tween
  per property.
- Test scrub reversals, not only one forward pass: drive the scroll
  0.5, 0.32, 0.38 a few times and assert that whenever the element is
  visible its clip is not `none` (`tests/visual/history-sticky-year.spec.ts`).
