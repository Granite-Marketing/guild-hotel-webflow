---
title: "Pinned full-bleed image is short and stutters on iOS Safari only"
date: "2026-11-04"
category: "ui-bugs"
module: "src/utils/historyStickyYear.ts (collapse gallery)"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "medium"
root_cause: "wrong_api"
resolution_type: "code_fix"
symptoms:
  - "On iPhone Safari the pinned image gets stuck and skips once the gallery images come together"
  - "Once open, the full-screen image stops partway down the screen, leaving a black band through the bottom caption"
  - "Chrome, including Chrome devtools iPhone emulation, looks correct"
tags: [ios, safari, mobile, viewport, innerHeight, 100vh, ignoreMobileResize, scrolltrigger, pin, clip-path, simulator]
---

# Pinned full-bleed image is short and stutters on iOS Safari only

## Problem

The history page's collapse gallery (four images slide into one, then a clip mask opens that card to full screen while the section is pinned) worked in Chrome but on iPhone Safari it stuttered at the pin and the opened image did not reach the bottom of the screen.

## Symptoms

- Stuck, skippy scroll once the images stack, then the open phase is not smooth.
- A black band (the section background) under the full-screen image, cutting through the bottom caption.
- Not reproducible in Chrome devtools device emulation: it has no collapsing Safari toolbar.

## What Didn't Work

- Checking in Chrome devtools at iPhone size. It reported the image and section at exactly the viewport height, because emulation has no dynamic toolbar.
- The first fix (v1.1.24, PR 136) sized the image from a `100vh` probe instead of `window.innerHeight` and fixed the stutter, but a smaller gap remained on the real phone: the image still only matched the shorter of section and viewport, not the tallest.

## Solution

All in `setupCollapseGallery` in `src/utils/historyStickyYear.ts`:

1. Measure the large viewport with an absolutely positioned `100vh` probe appended to the section, not `window.innerHeight`. Use it for the visible height and the pin length.
2. Size the open image (and the clip's open inset) to cover the tallest of the section, the `100vh` probe and the current window, centred on where the card sits:

```ts
const bleedHeight = () => {
  const coverBottom = Math.max(root.offsetHeight, viewportProbe.offsetHeight, window.innerHeight)
  return 2 * coverBottom - visibleHeight()
}
```

3. Add `anticipatePin: 1` to the pinned ScrollTrigger and `force3D: true` on the cards' x/y tween, so the pin engages a frame early under native iOS scroll and the cards stay on GPU layers while the clip-path opens.

Shipped as v1.1.24 (PR 136) and v1.1.25 (PR 137).

## Why This Works

`scrollTriggerRefresh` sets `ScrollTrigger.config({ ignoreMobileResize: true })`, so nothing re-measures when Safari's toolbar hides. `window.innerHeight` read at refresh time is the small viewport (toolbar showing); after the toolbar collapses, the screen is taller than every pixel size computed from it. In iOS Safari `100vh` is the large viewport and does not change with the toolbar, so a `100vh` probe gives a stable, full height. Covering the tallest candidate removes the remaining gap: the section's overflow clips any overshoot, so oversizing is harmless while undersizing shows the background.

## Prevention

- Any JS that sizes something to "the screen" on mobile must not use `window.innerHeight` alone while `ignoreMobileResize` is on. Measure a `100vh` element, or cover the max of the candidates.
- When the fix is "fill the screen", oversize to the tallest candidate and let the section's overflow clip; never take the minimum.
- Verify iOS-only reports in the iOS Simulator (Mobile Safari), not Chrome emulation. In Claude Desktop the iOS Simulator tool can open the staging URL, drag through the pinned section and screenshot each phase, including with the toolbar expanded (tap the bottom bar) and collapsed.
- The simulator confirms layout, not smoothness: frame rate depends on the Mac, so a real-device check is still needed for stutter.

## Related

- `docs/solutions/integration-issues/scrolltrigger-mobile-premature-animations.md` (why `ignoreMobileResize` is on)
- `CONCEPTS.md` "Mask reveal"
