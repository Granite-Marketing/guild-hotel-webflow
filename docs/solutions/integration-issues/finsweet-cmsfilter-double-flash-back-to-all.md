---
title: "Finsweet CMS Filter v1 double flash when going back to \"all\""
date: "2026-10-12"
category: "integration-issues"
module: "Finsweet CMS Filter listing pages"
component: "frontend_stimulus"
problem_type: "integration_issue"
severity: "medium"
root_cause: "config_error"
resolution_type: "config_change"
symptoms:
  - "Going from a narrow filter back to \"all\" flashes twice"
  - "Tiles appear blank after the fade-in, then the images pop in"
  - "On mobile it persists for radio and \"all\" clicks but never for range sliders"
tags: [finsweet, cms-filter, fs-cmsfilter-duration, flicker, image-decode, thumbnails, mobile, scrollsmoother]
---

# Finsweet CMS Filter v1 double flash when going back to "all"

## Problem

On a project listing page, clearing a filter back to "all" flashed twice: the list faded out and in, then tiles showed blank and their images popped in. It took two separate causes and two fixes; the second only showed on phones.

## Symptoms

- Desktop and mobile: blank tiles for a moment after the list fades back in on "all".
- Mobile only, after the image fix: radio picks and "all" clicks still looked like a double flash. Moving a range slider back to its ends re-showed exactly the same items with no glitch.

## What Didn't Work

- **Blaming Finsweet for rendering twice.** Measured with a `renderitems` listener and `document.getAnimations()`: one render, one fade-out and one fade-in per click. Finsweet runs once.
- **Coalescing ScrollTrigger refreshes.** Each filter change fired several `ScrollTrigger.refresh` calls (one per list instance plus a backup MutationObserver) and one per image load. Batching them to one refresh per frame, with image loads debounced, was worth keeping but did not remove the flash.
- **Holding the list until images decode, on its own.** Keeping the list at opacity 0 until the first tiles decode, while Finsweet's own fade still ran, still looked glitchy: "the flash is trying to flash, but it's being held."

## Solution

1. **Small images for listing tiles.** CMS images imported through the API have no `srcset`, so every tile loaded a 2560 to 4000px original (1 to 4MB). Finsweet removes filtered-out items from the DOM, the browser drops their decoded bitmaps, and on "all" they decode again in 200 to 500ms, well after Finsweet's 100ms fade-in. A dedicated thumbnail field (1600px WebP, about 100 to 290KB) now feeds the tile. See [cms-listing-thumbnail-field-webp.md](../design-patterns/cms-listing-thumbnail-field-webp.md). This fixed desktop.
2. **Turn off Finsweet's fade and fade in once yourself.** On every list wrapper (grid and row views):

   ```html
   <div fs-cmsfilter-element="list" fs-cmsfilter-duration="0" ...>
   ```

   Finsweet then swaps items instantly. The module supplies the only transition: set the list to opacity 0, wait for the leading tiles to decode (with a timeout cap, 700ms here), then run a single 200ms fade-in:

   ```ts
   const revealAfterDecode = async (list: HTMLElement, leadingCount = 6, timeoutMs = 700) => {
     gsap.set(list, { opacity: 0 })
     const images = [...list.querySelectorAll<HTMLImageElement>('img')].slice(0, leadingCount)
     const decodes = images.map((image) => image.decode().catch(() => undefined))
     await Promise.race([Promise.all(decodes), new Promise((resolve) => setTimeout(resolve, timeoutMs))])
     gsap.to(list, { opacity: 1, duration: 0.2, clearProps: 'opacity' })
   }
   ```

   This fixed mobile.

## Why This Works

Finsweet's default animation is fade-out, swap, fade-in: two visible opacity changes. On mobile the open filter panel was a 50vh overlay above the grid. Sliders keep the panel open, so most of the transition happens behind it. Radio and "all" clicks close the panel instantly, exposing the full out-and-in on a grid whose content changes heavily. That reads as a double flash. With `fs-cmsfilter-duration="0"` there is one transition, and it starts only once the tiles can paint.

## Prevention

- Start any Finsweet v1 list that sits under an overlay or sticky filter UI with `fs-cmsfilter-duration="0"` and do one fade-in yourself.
- Never bind full-size CMS images to listing tiles. API-imported images get no `srcset`; use a dedicated thumbnail field.
- When filtering "looks broken" in a hidden or background browser tab, check `document.visibilityState`. Hidden tabs pause Web Animations, so Finsweet's rendering queue never resolves and the list never re-renders. Finish animations (`document.getAnimations().forEach((animation) => animation.finish())`) or test in a visible tab.
- Finsweet still has the list at `display: none` when `renderitems` fires, so nothing can be measured in that callback.
- ScrollSmoother only (applies when a project opts into ScrollSmoother; the default is Lenis): `offsetParent` is `null` for everything inside ScrollSmoother's fixed wrapper, so test visibility with `element.getClientRects().length`.

## Related

- [finsweet-cms-filter.md](../../reference/finsweet-cms-filter.md): attribute reference, including `fs-cmsfilter-duration`
- [finsweet-cms-filter-webflow-setup.md](finsweet-cms-filter-webflow-setup.md): attribute wiring and active state
- [webflow-cms-image-emission.md](../conventions/webflow-cms-image-emission.md): why API-imported CMS images have no `srcset`
- [mobile-swipe-opens-filter-dropdowns-normalizescroll.md](../ui-bugs/mobile-swipe-opens-filter-dropdowns-normalizescroll.md): same filter panels, touch issue
