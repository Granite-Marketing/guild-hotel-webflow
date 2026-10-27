# Changelog

## 1.1.12

### Patch Changes

- 4209031: F26 rooms quiz: new `roomsQuiz` module (one step at a time, back links, CMS-driven room matches through Finsweet CMS Nest, closest-match and empty fallbacks); `hoverImageSwap` resets a step's photo when the quiz hides that step.

## 1.1.11

### Patch Changes

- 67bba6f: F36: stickyTabs ends the pin at the last rendered card section, ignoring hidden or empty groups. F33: scrollEnlargeSnap reverses every panel still revealed when leaving, so copy always masks out.

## 1.1.10

### Patch Changes

- stickyTabs (F36): only bars with data-sticky-tabs="true" pin, so the attribute can be bound to a component prop that is empty by default.

## 1.1.9

### Patch Changes

- fa4c3f7: F34: button hover fill from the bottom with a label roll (needs the matching site head CSS).
- fa4c3f7: Panel mask text (F33): panel copy now follows the scrubbed timeline instead of raw scroll position, every panel has a real dwell window, and a short settle delay stops a pass-through from starting a reveal that is reversed half-way.
- fa4c3f7: History landmark: the pinned image keeps full size and only its clip-path animates (F37); optional `data-history-collapse-caption` overlay.
- fa4c3f7: Listings (F36): CMS article cards alternate left/right across category groups (`staggerCards`), and the topic tab bar pins under the nav on /happenings, /blog and /press with scrollspy and offset anchor clicks (`stickyTabs`).

## 1.1.8

### Patch Changes

- 81cc407: cmsItemLinks (F30): Happenings and Blog listing cards link to their post pages from bound slug attributes.
- 81cc407: F24: form labels become screen-reader only; the label text is shown as the placeholder on the line.
- 81cc407: hoverImageSwap for the rooms quiz (F25): hovering or focusing a "Who's checking in?" option swaps the right-hand photo.
- 81cc407: History: the sticky year label no longer fades over timeline text (F19, reverts the v1.1.5 avoidance). The landmark mask opens on the same image at the card's framing and scales uniformly to full bleed, with one GSAP property per tween so scrubbing back and forth never flashes the unmasked photo (F20).
- 81cc407: Panel mask reveals (F15, F28): panel copy masks in as one timeline after the media mask completes and reverses on the way back, with an end hold so the pin does not hand over too quickly; single-item sections supported.
- 81cc407: mediaTabs (F16): tabs switch on click and keyboard only, and panel copy masks out before the incoming copy masks in, with no cross-fade.
- 81cc407: navToggle (F23): the hamburger morphs to an X on open and back on close, with aria-expanded and Open menu / Close menu labels.
- 81cc407: Smooth scroll inside every modal (own Lenis per open dialog, destroyed on close), eager images in dialogs, and Lenis measures the body and resizes on every ScrollTrigger refresh so the footer is always reachable (F18, F22, F29).

## 1.1.7

### Patch Changes

- Map: rows come from the Map Places CMS collection (`data-map-coordinates`), and each row's Directions link is pointed at Google Maps directions. List rows show a pointer, and the map starts wider (zoom 15, override with `data-map-zoom`).

## 1.1.6

### Patch Changes

- Feedback batch 1 (2026-10-21): navTheme nav colour switching replaces navContrast (F01); scroll mask reveals with once-only line mask-in on the home Zuma section and the History landmark gallery (F03, F09); later start for the home Wellness trio (F04); hard-coded media tabs for home Meetings and Events (F06); sticky Reserve a Table on the Dinings template (F10); venue dialogs scroll inside themselves (F12); list-linked Google map for the legal courthouses, keyed from data-map-key (F13).

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
