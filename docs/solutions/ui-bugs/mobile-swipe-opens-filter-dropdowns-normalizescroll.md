---
title: "Swiping a horizontal filter row opens dropdowns under ScrollSmoother normalizeScroll"
date: "2026-10-12"
category: "ui-bugs"
module: "filter panels (custom toggles)"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "medium"
root_cause: "wrong_api"
resolution_type: "code_fix"
symptoms:
  - "Swiping the horizontally scrolling mobile filter row opens whichever dropdown the finger lifts on"
  - "Intermittent, more likely right after a filter has been applied"
  - "Never reproduces on desktop"
tags: [mobile, touch, swipe, dropdown, normalizescroll, scrollsmoother, scrollsmoother-only, gsap, click, filter-panels]
---

> Applies when a project opts into ScrollSmoother; the default is Lenis. The travel guard below is still a cheap defence for any tap target inside a nested horizontal scroller.

# Swiping a horizontal filter row opens dropdowns under ScrollSmoother normalizeScroll

## Problem

On mobile, a listing page's filter toggles sat in a horizontally scrolling row. Swiping the row to reach the later toggles opened a dropdown, so the user could not browse the options without panels popping open.

## Symptoms

- A horizontal swipe that ends on a toggle opens that toggle's panel.
- Intermittent; most noticeable after a filter has just been applied.
- Desktop (mouse) never shows it.

## What Didn't Work

- **Webflow's Dropdown element.** It opens from its own touch handling, which fires after a swipe ends on the toggle. There is no setting to turn that off.
- **A plain `<button>` listening for `click`.** Browsers normally do not fire `click` after a scroll gesture, which fixed most cases, but not all.

## Solution

Ignore any click that ends a touch which travelled more than 10px, whatever the browser decided:

```ts
const TAP_SLOP_PX = 10
const touchGesture = { startX: 0, startY: 0, travelled: 0 }

// capture + passive: unaffected by normalizeScroll's preventDefault
document.addEventListener('touchstart', (event) => {
  const [touch] = event.touches
  touchGesture.startX = touch.clientX
  touchGesture.startY = touch.clientY
  touchGesture.travelled = 0
}, { capture: true, passive: true })

document.addEventListener('touchmove', (event) => {
  const [touch] = event.touches
  const distance = Math.hypot(touch.clientX - touchGesture.startX, touch.clientY - touchGesture.startY)
  touchGesture.travelled = Math.max(touchGesture.travelled, distance)
}, { capture: true, passive: true })

const isSwipe = () => touchGesture.travelled > TAP_SLOP_PX

toggle.addEventListener('click', () => {
  if (isSwipe()) return
  // open / close panel
})
```

Put the same guard on the outside-click close handler, so a swipe does not close an open panel either. Mouse and keyboard clicks never follow a `touchmove`, so `travelled` stays 0 for them.

## Why This Works

The project created ScrollSmoother with `normalizeScroll: { allowNestedScroll: true }`. On touch devices normalizeScroll takes over `touchmove` and is meant to hand gestures on nested scroll areas back to the browser. When it does not (seen intermittently, likely while layout settles after a filter render), it prevents the native horizontal scroll. To the browser the gesture never scrolled, so it is a tap, and `click` fires on the element under the finger. Measuring the finger's travel yourself does not depend on how the browser or GSAP classified the gesture.

## Prevention

- Any tap target inside a nested horizontal scroller on a page with normalizeScroll needs a travel guard; do not rely on "click never fires after a scroll".
- Use a `<button>` for filter toggles rather than Webflow's Dropdown element.
- Track touches on `document` with `capture: true, passive: true` so the listener sees every gesture and cannot block or slow scrolling.
- Test on a real phone after applying a filter; simulated clicks in a desktop browser cannot reproduce this.

## Related

- [gsap-module-conventions.md](../conventions/gsap-module-conventions.md): rule 9, `allowNestedScroll`
- [finsweet-cmsfilter-double-flash-back-to-all.md](../integration-issues/finsweet-cmsfilter-double-flash-back-to-all.md): same filter panels
