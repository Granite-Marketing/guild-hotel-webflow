---
title: "\"Too fast\" on a scrubbed scroll animation: make it timed, don't retune the scrub"
date: "2026-11-10"
category: "design-patterns"
module: "src/utils/imageStackCollapse.ts"
component: "frontend_stimulus"
problem_type: "best_practice"
severity: "low"
applies_when:
  - "Client feedback says a scroll animation is too fast, too sensitive or jumpy"
  - "The animation is scrubbed (its progress is tied to scroll position)"
tags: [scrolltrigger, scrub, toggle-actions, image-stack-collapse, feedback]
---

# "Too fast" on a scrubbed scroll animation: make it timed, don't retune the scrub

## Context

The homepage image trio collapse (see [feedback-section-name-to-wrong-animation.md](../workflow-issues/feedback-section-name-to-wrong-animation.md)) was scrubbed: the images moved exactly as fast as the reader scrolled. The client called it "too sensitive". Lengthening the scroll distance or raising `scrub` (tried on the enlarge-snap stacks in round 2) only stretches or lags the same motion; a flick of the trackpad still plays it in a fraction of a second.

## Guidance

When the complaint is speed or sensitivity, change the kind of animation: play a fixed-length timeline when the section crosses a start point, and reverse it when the reader scrolls back above.

```ts
gsap.timeline({
  scrollTrigger: { trigger: stack, start: 'top 55%', toggleActions: 'play none none reverse', invalidateOnRefresh: true },
})
```

`imageStackCollapse.ts` does this since v1.1.64 (`COLLAPSE_SECONDS = 1.6`). Its end values are functions, so `invalidateOnRefresh` re-measures the offsets after a resize.

The `end` position and `data-image-stack-collapse-end` are still read but do nothing under `toggleActions`; tune `start` and the duration instead.

## When not to

Keep scrub where the motion should feel attached to the scroll (pinned enlarge, parallax). Ask which feel the client wants before swapping.
