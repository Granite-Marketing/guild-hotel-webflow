---
title: "Page load and scroll freeze: every line-mask text block was split at load, and again on every font load"
date: "2026-11-16"
category: "integration-issues"
module: "src/utils/lineMaskReveal.ts, src/utils/map.ts"
component: "src/index.ts"
problem_type: "performance_issue"
tags: [splittext, autosplit, line-mask, lenis, scrolltrigger, main-thread, long-task, hero-reveal, google-maps, load, scroll-freeze]
severity: "high"
status: "resolved-pending-staging-check"
related: "Trello In Progress 2026-11-16 (card 8.3 map stutter, 'Page load and scroll'), spec #174, ticket #176"
---

# Page load and scroll freeze (2026-11-16)

## Summary

One root cause behind all four symptoms (page does not scroll while loading, hero text reveal looks poor, map stutter): the main thread was blocked for several seconds at a time by SplitText. `lineMaskReveal` split **every** text block on the page (60 to 80 per page, 18 of them inside closed dialogs) during `Webflow.push`, and SplitText `autoSplit` then re-split **all of them again** on each font load event. Lenis was live early; it simply could not run.

## What blocked scroll

Not the load event, not image loading, not anything waiting on `window.load`. Lenis is created inside `Webflow.push` at DOMContentLoaded (about 1.5 to 3 s on staging), well before `load` (6 to 27 s). The rest is the main thread:

| Page (staging v1.2.25) | Long tasks before the fix | Source |
|---|---|---|
| Neighborhood | 6.0 s at 1.7 s, 8.6 s at 8.5 s | init, then re-split wave |
| Meetings | 4.6 s at 1.5 s, 5.7 s at 7.5 s | same |
| Home | 6.2 s at 2.0 s, 8.2 s at 8.5 s | same |

Lenis' wheel listener is non-passive, so the browser waits for the main thread before it scrolls. During a long task the page does not move, and wheel events queued meanwhile are coalesced or dropped. Measured with a wheel every 200 ms from the start of the load (headless Chromium, 1440x900, 4 Mbps, 100 ms latency): the page moved to about 100px natively before the bundle ran, then did not move again until 8.6 s (Meetings), 14.6 s (Home) and 17.9 s (Corporate).

Profile of the blocking tasks (CPU profile, bundle built without minification and served in place of the footer tag): inclusive time in `createLineMaskTimeline` > `new SplitText(... autoSplit: true)` > `onSplit` > `rebuild`, called from `modalTextMask` (3.1 s, all closed dialogs), `scrollReveal` (1.3 s), `offersSliderSplit` (1.0 s), `scrollEnlargeSnap`, `historyStickyYear`. Self time is SplitText (`fe`, `se`), GSAP `Sd` and native `getBoundingClientRect`: each split forces a layout after the previous element's DOM change, about 85 ms each on a long page.

Instance counts, counted by wrapping `SplitText`:

| Page | SplitText instances | `onSplit` calls | In closed dialogs / hidden |
|---|---|---|---|
| Home | 70 | 141 | n/a |
| Neighborhood | 83 | 186 | 26 |
| Meetings | 59 | 119 | 26 |

`onSplit` runs about twice per instance: the first split, and the `autoSplit` re-split after fonts load (site fonts at about 3.3 s).

`rebuild()` also rebuilt the whole timeline on every `onSplit`, so a container with many parts did the same work again for each re-split.

## What moved the page

I could not reproduce a visible jump back up in headless Chromium, so this part is a diagnosis from code and traces, not a recording of the symptom.

What the traces show:

- Nothing in the bundle sets `history.scrollRestoration` or scrolls on load (`anchorScroll` acts on clicks only; the `scrollTo` calls in `modals`, `roomsQuiz`, `stickyTabs` and `scrollEnlargeSnap` run on user action).
- The only writer of scroll position during load is ScrollTrigger's refresh: `window.scrollTo(0,0)` then a restore to the saved position, three `scrollTo` calls per refresh, in one task, so no frame shows the 0. Observed 5 refresh bursts over a 40 s Neighborhood load (initial, load, and ResizeObserver refreshes after height changes), the restore always returned the saved value (for example `[0,3150]`).
- With the bundle delayed 5 s and the page scrolled to 3150 natively first, Lenis initialised at 3150 and continued from there with no drop.

Most likely cause of the visitor's "jumps back up": the freeze. During a multi-second block the user keeps wheeling or drags the scrollbar; wheel input is dropped or coalesced, then Lenis resumes from its own last position (its internal target is stale against any native scroll that happened meanwhile) while ScrollTrigger refreshes reset and restore the position as the page height changes under a re-split wave. Removing the freeze removes the window in which these can disagree: the long tasks fall from 6 to 9 s to about 1.5 s, and the load-time re-split wave shrinks to the near-screen blocks.

Not verified: the exact jump on a real GPU browser with a trackpad. This is the item to check on staging after release.

## Why the hero reveal flickers or replays

The hero (`.hero-fullbleed-centered_component`) is auto-tagged `text-mask`, hidden by `reveal-prehide.css` until `html.reveal-ready`, which `index.ts` adds at the end of the `Webflow.push` callback. Measured on staging, state of the hero over time:

- Before: hidden at 1.4 s, visible with every word still masked (110%) at 9.5 s (Corporate) or 7.4 s (Meetings), then the reveal ran as a single frame at 19.8 s / 13.3 s: the animation clock kept running through the block (`gsap.ticker.lagSmoothing(0)`), so the whole reveal was already over by the time a frame could draw. It reads as a blank hero and then a snap.
- The CSS fail-safe (`reveal-failsafe`, 3 s) can show the hero before the bundle has finished splitting it when init takes longer than 3 s; the later split then hides and replays it. On Neighborhood the hero became visible at 4.2 s while init was still blocked.
- After a re-split mid-reveal, `rebuild()` recreated all tweens and restored `progress()`, so a long re-split wave stretched a single reveal across the freeze.

After the fix the first-screen text is split in the first microtask after init (before paint) and the reveal runs as a normal multi-frame animation (18 frames recorded on Meetings, starting at 2.9 s; before, 1 frame at 13.3 s).

## Why maps stutter

The map never swallowed the wheel. Measured over the map on Meetings and Neighborhood with a window-level wheel listener: every wheel event reaches the window in capture and bubble phases, none is `defaultPrevented`, and the page moved by exactly the wheel distance (`gestureHandling: 'cooperative'`). So the candidate fixes (make Lenis ignore the map, or pointer-events after a click) are not needed.

The stutter is the first-view cost, and mostly a SplitText storm:

1. The Maps API loads when the figure is 400px from the screen: script fetch and compile appears as 100 to 350 ms frames while scrolling toward the map.
2. Building the map makes Google add its Roboto font. That fires `document.fonts` `loadingdone` (recorded at 12.4 s: `Roboto` together with the site fonts), and SplitText `autoSplit` re-splits every instance on the page. Before the fix that was one 7.1 to 8.1 s long task with the map at the top of the screen (CPU profile: SplitText, GSAP `Sd`, `getBoundingClientRect`, plus 0.3 s of Google `controls.js`).

## Fix

All in shared code:

1. `src/utils/lineMaskReveal.ts`:
   - Lazy split. Text is split in one batch after the calling module returns (positions read first, then splits) only if it is within one viewport of the screen; the rest waits on one shared `IntersectionObserver` with one viewport of margin. `play()` and `reverse()` split anything still unsplit before running. Blocks that are not rendered (closed dialogs, inactive slides) split on first play or first show.
   - Re-splits that land together rebuild the timeline once, in a microtask, not once per `onSplit`. A part that joins late keeps the playhead time, a re-split keeps progress.
2. `src/utils/map.ts`: after `load` and an idle moment, fetch the Maps API script (`importLibrary('maps')` and `'core'`; no map is created, so no map load is billed). The map is still built near the viewport.

Not changed on purpose: eager images (`data-eager`), the `ScrollTrigger.refresh(true)` layers, and SplitText `autoSplit` (never reverted in code), per CLAUDE.md. None of them caused this: `window.load` is not on the scroll path, and the refresh layers did not move the position (above).

## Measured after (same staging pages, my bundle served in place of the footer tag, same throttling)

| Check | Before | After |
|---|---|---|
| SplitText instances (Neighborhood / Meetings) | 83 / 59 | 23 / 17 |
| Long tasks, Neighborhood | 6.0 s + 8.6 s | 1.5 s + 1.2 s |
| Long tasks, Meetings | 4.6 s + 5.7 s | 1.6 s + 0.9 s |
| First scroll stall after the first wheel | Home 14.6 s, Corporate 17.9 s, Meetings 8.6 s | Home 2.0 s, Corporate 3.6 s, Neighborhood 1.7 s, Meetings 0.8 s |
| Long task with the map on screen (Meetings) | 7.1 to 8.1 s | 2.1 s |
| Hero reveal frames (Meetings) | 1 frame at 13.3 s | 18 frames from 2.9 s |

The sandbox CPU is slower than a laptop, so absolute times will be shorter for a visitor; the ratios are the evidence. What is left is the first-screen split (about 1.4 s here) and the resplit of the remaining near-screen blocks after font loads. Options if staging still shows a hitch: time-slice the near-screen splits across idle callbacks, or end one-shot reveals once they have played (needs a CLAUDE.md exception for the SplitText revert rule).

## Verification

- `tests/visual/line-mask-lazy-split.spec.ts` (fixture `tests/visual/fixtures/line-mask-lazy-split.html`): the page scrolls on the first wheel while an image is still loading, only first-screen text is split at load (at most 6 of 31 blocks; failed before the change), a block is split before it scrolls into view, and each reveal plays once and stays shown. The first test passed on the old code too, which confirms that scroll was never gated on `load`: it was the main thread.
- Existing specs `scroll-enlarge-snap` (3 tests) and `history-sticky-year` (1 test) fail identically with and without this change (checked on the unmodified `lineMaskReveal.ts`).
- Staging check after release (ticket's acceptance): Home, Corporate, Neighborhood and Meetings scroll from the first input; no jump back; hero reveal once; no pause crossing the map.

## Prevention

- A module that creates one SplitText per block must not create them all up front. Split what is near the screen and the rest on approach or on play.
- Anything that loads a font after init (Google Maps, embeds) re-splits every live `autoSplit` instance, so the cost scales with how many exist, not with what the visitor can see.
