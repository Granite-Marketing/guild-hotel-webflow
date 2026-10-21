# Changelog

## 1.1.5

### Patch Changes

- 68b01ee: History sticky year label fades out while a timeline text block passes under it, so the 1924 pill never covers the body copy.

## 1.1.4

### Patch Changes

- b49211f: Add navContrast (scroll-aware nav text colour), roomGridHoverReveal (/rooms card details on hover) and hoverFollowImage (legal/04 hover photo).

## 1.1.3

### Patch Changes

- Runtime fixes from wave 4: the FAQ accordion opens its first item on load, keeps aria-expanded in sync, re-measures open panels when content grows (late images), and supports Space as well as Enter. Dialogs now open from `#id` links (including from inside another dialog), from the URL hash on load and on hashchange, and from Enter or Space on non-link triggers; a close control with an `href="#section"` closes and scrolls to that section.

## 1.1.2

### Patch Changes

- Enable cardCarouselHeaderLeft (Q009) and roomListHoverPreview (Q007) in the bundle entry.

## 1.1.1

### Patch Changes

- Wire offersSliderSplit (Q008) in slot C after swiperSliders, so the Offers Slider Split crossfades and counts on staging. Mark the R00 modules as wired in runtime-modules.md.

## 1.1.0

### Minor Changes

- fd919f5: Back-port NGA learnings: opt-in runtime modules behind a scroll-engine facade (Lenis default, ScrollSmoother swap), eagerImages and refresh layers, the context-aware alt-text pipeline with safe defaults, MCP 2.1 notes and new solution docs. Remove NGA content scripts.
- R00 early staging release: enable scrollEnlargeSnap (A01), imageStackCollapse (A02), imageTrailHover (A03), historyStickyYear (A04), galleryFilter (A05) and imageHoverScale alongside the navToggle and accordion modules already wired, so the built Home, History, Rooms and Gallery pages run their interactions on staging.

This file tracks releases of your project once you've used this template to bootstrap it.

The starter ships at `0.0.0`. When you cut your first changeset and tag a release, entries will be appended here automatically by `changesets/changelog-git`.
