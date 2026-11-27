---
title: "Smooth-scroll jitter: a perpetual rAF loop that reads layout, and clearProps transform at the end of an image zoom"
date: "2026-11-27"
category: "integration-issues"
module: "src/utils/navTheme.ts, src/utils/scrollReveal.ts, src/utils/lineMaskReveal.ts"
component: "Lenis, GSAP, SplitText"
problem_type: "performance_issue"
tags: [lenis, raf, layout-thrash, getboundingclientrect, compositor-layer, will-change, clearprops, splittext, requestidlecallback, jitter]
severity: "medium"
status: "resolved-pending-staging-check"
related: "docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md"
---

# Smooth-scroll jitter (2026-11-27)

## Why it matters under Lenis

Lenis moves the page from JavaScript on the main thread. Native scrolling runs on the compositor and hides main-thread work; Lenis does not. Any main-thread work during a scroll frame shows as a stutter.

## Gotcha 1: a perpetual `requestAnimationFrame` loop that reads layout

`navTheme` recomputed its mask in a rAF loop that never stopped: about 54 `getBoundingClientRect` calls, plus `getComputedStyle` and `checkVisibility` per frame, forever, on every page. The reads land after GSAP and Lenis have written transforms, so each frame forces a layout, and the loop ran even with the page idle.

Fix pattern:
- Run the loop only while something can move: wake it on `scroll`, `wheel`, `touchmove`, `keydown`, `pointerover`, `pointerdown`, `click`, resize, load and `ScrollTrigger` `refresh`, keep it going for a tail long enough for the longest triggered animation (3.5s here, the tab move caps at 3s), then stop.
- Cache each area's document band on `ScrollTrigger` `refresh` and skip areas more than a viewport from where they matter. Never cache anything pinned, sticky or fixed (or inside `.pin-spacer`), and never cache an element with no height at measure time (closed tabs): read those live.
- Do not call `ScrollTrigger.refresh()` from the loop (CLAUDE.md).

## Gotcha 2: `clearProps: 'transform'` at the end of an image zoom repaints the photo

A GSAP `scale` tween gives the media its own compositor layer (force3D auto). At the end GSAP drops to a 2D matrix and `clearProps: 'transform'` removes it, so the layer is torn down and the whole photo is repainted into its parent mid-scroll: a hitch right as the reveal ends.

Fix pattern: set `will-change: transform` when the reveal starts (timeline `onStart`, never at load: one full-size layer per waiting photo costs phone memory; keep the waiting start state 2D with `force3D: false` too) and tween with `force3D: true`, keep it through `clearProps` (so the CSS hover zoom still applies), and remove it only when the element is next out of view (an `IntersectionObserver`), where the repaint cannot be seen. `clipPath` tweens repaint on every frame anyway, so their `clearProps` adds no spike.

## Gotcha 3: splits that land mid-scroll

Lazy SplitText (from the 2026-11-16 freeze fix) split text as it approached, so the split's layout work landed during scroll. Split the queued text when the browser is idle after `load`, one block per `requestIdleCallback` with at least 10ms left and no scroll in the last 250ms (`setTimeout` fallback for Safari), and keep the observer as the fallback. One block at a time keeps the load-time freeze from returning. Unrendered blocks (closed dialogs) are left for their first show or play.

## Measuring

`node scripts/perf-scroll.mjs [--bundle dist/index.js] [--throttle 4]` loads staging headless at 1440x900 and 390x844, optionally swaps in a local bundle, and prints p95 frame time and frames over 33ms during a wheel scroll, plus rAF work and layout reads per second with the page idle.
