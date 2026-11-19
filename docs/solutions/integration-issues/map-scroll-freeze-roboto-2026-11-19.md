---
title: "Scroll freeze past the Google map: Google's Roboto font load re-split every SplitText"
date: "2026-11-19"
category: "integration-issues"
module: "src/utils/map.ts"
component: "src/utils/lineMaskReveal.ts"
problem_type: "performance_issue"
tags: [google-maps, roboto, font-loading, splittext, autosplit, scroll-freeze, long-task, lenis, scrolltrigger]
severity: "medium"
status: "resolved"
related: "page-load-scroll-freeze-2026-11-16.md"
---

# Scroll freeze past the Google map (2026-11-19)

## Symptom

Scrolling past the map on Meetings, Neighborhood and Corporate, the page froze briefly, then ScrollTrigger caught up. Intermittent: only the first time on a page load, and only when Google's font was not already cached.

## Cause

When the Maps API builds the map it inserts `https://fonts.googleapis.com/css?family=Roboto...` into `<head>` (via `head.insertBefore`). The Roboto load fires `document.fonts` `loadingdone`, and SplitText `autoSplit` re-splits every live instance on the page in one task, followed by a `ScrollTrigger.refresh`.

Measured on staging v1.3.6, Meetings, headless Chromium 1440x900, real (CDP) wheel input across the map: `fonts loadingdone [..., Roboto]`, then a 662 ms long task and a 667 ms frame in which the page jumped 330 px, then a refresh.

Not the cause: the map iframe, Lenis' wheel handling, or the cooperative gesture overlay (the overlay is cheap once the font is gone).

## Fix

`map.ts` `blockGoogleFonts()` wraps `document.head.insertBefore` and drops every Google Fonts stylesheet link (Roboto, Google Sans, and a Google Sans Text subset for the keyboard-shortcut arrows). Roboto styles only Google's controls (zoom buttons, the "use ⌘ + scroll" overlay, attribution), which fall back to Arial. Map labels are raster tiles and are unaffected.

## Prevention

Any third-party embed that loads a web font after init (maps, chat widgets, video players) re-splits every `autoSplit` instance. Block or preload that font at load, never let it arrive mid-scroll.

## Measured after (staging pages, fixed bundle swapped in, new headless Chromium 1440x900, real wheel input across the map)

| Page | Worst frame before | Worst frame after | Font load during scroll |
|---|---|---|---|
| Meetings | 700 to 795 ms | 0 to 275 ms | gone |
| Neighborhood | 1908 ms | 166 to 183 ms | gone |
| Corporate | 58 ms (Roboto cached that run) | 75 to 91 ms | none |

What is left is Google's own map build (its `main.js`, `common.js`, `controls.js`, split into 60 to 150 ms tasks in this slower sandbox) and general page work (a ScrollTrigger refresh and lazy splits) that is not tied to the map. The home page `section_map-feature` has no live map and no font load; its 100 to 140 ms frames are the same general page work.

The local preview cannot show the map: the browser key is referrer-restricted to the Webflow domain (`RefererNotAllowedMapError` on localhost), so the map only shows on staging.
