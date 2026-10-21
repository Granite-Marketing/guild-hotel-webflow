# Changelog

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
