# Spec: Mobile feedback round, all 41 items (17 Nov)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/264
Snapshot: 2026-11-17 18:15

### Intent

One round, two lanes. Code tickets are built headless and checked on real staging pages with the build's own bundle swapped in. Designer tickets (label `designer`) run as one Webflow Designer session on Stephen's Mac, approved by the same yes, each checked live with the capture, compare and iterate loop. Every item has its own acceptance line starting with its id; read that item's own section of `docs/feedback/mobile-2026-11-17.md`, never the doc as a whole.

Starting point: most items were already attempted. Code work from the first pass is in PR #256 (fixes since the review are on that branch). Webflow changes from the first pass are live on staging. For each item: check the live result against the item first; fix only what fails; never rebuild what already passes.

Refs: docs/feedback/images/2026-11-17/refs.json

### Done-when

- #265: M6: No scroll jump scrolling into the footer on Home and Rooms, or when FAQ items open or close, at 390 and 1440 (including the iOS toolbar case: the scroll section's length must not change when the toolbar hides). (read M6 in `docs/feedback/mobile-2026-11-17.md`)
- #265: M12: Each FAQ question line-masks in on scroll, staggered row by row, with its divider; the open item's chevron lines up with the closed ones. (read M12 in `docs/feedback/mobile-2026-11-17.md`)
- #266: M21: Phones: hidden at load, fades in docked at the bottom and centred after a short scroll, hidden again back at the top; never cropped; no empty gap in the hero. Desktop: fully visible in the hero on first load, then docks. (read M21 in `docs/feedback/mobile-2026-11-17.md`)
- #266: M22: The docked button hides once "Other dining options" comes into view, on phones and desktop. (read M22 in `docs/feedback/mobile-2026-11-17.md`)
- #267: M23: On every full-bleed image hero, desktop and phone: the image starts slightly larger and settles to normal size on load (scale only, inside its frame), with the copy's text mask playing on load too; no flash of the full-size image before it starts; reduced motion respected. (read M23 in `docs/feedback/mobile-2026-11-17.md`)
- #268: M4: Home Art & Stories collage on phones: images fade in one by one on scroll. (read M4 in `docs/feedback/mobile-2026-11-17.md`)
- #268: M16: Room page gallery photos scale and fade in on scroll, desktop and phone. (read M16 in `docs/feedback/mobile-2026-11-17.md`)
- #268: M30: Every form's fields fade in on scroll, staggered, with no slide: contact, Request for Proposal, photoshoot and the newsletter form near the footer. (read M30 in `docs/feedback/mobile-2026-11-17.md`)
- #268: M39: Corporate "Why teams choose the Guild" row images on phones scale and fade in on scroll, no mask. (read M39 in `docs/feedback/mobile-2026-11-17.md`)
- #269: M19: The subnav menu opens with an eased height and its links rise only slightly, staggered; closing reverses; a quick double tap never leaves it closed while reporting open. (read M19 in `docs/feedback/mobile-2026-11-17.md`)
- #269: M18: On scroll-mask sections the venue selector shows only once the slider's image is fully open, never from the top of the page, on phones and desktop (Stephen 17 Nov). (read M18 in `docs/feedback/mobile-2026-11-17.md`)
- #270: M11a: No focus ring after a tap or click anywhere (Rooms quiz, room list, Meetings modal back arrow); keyboard Tab still shows one. (read M11a in `docs/feedback/mobile-2026-11-17.md`)
- #270: M26: George Marston tilts -5deg on phones with clear space above and below; desktop stays level. (read M26 in `docs/feedback/mobile-2026-11-17.md`)
- #270: M31b: Every Directions link opens in a new tab with rel noopener. (read M31b in `docs/feedback/mobile-2026-11-17.md`)

### Constraints

- Code lane: `src/utils/` modules and `docs/reference/site-head/*.css` (bundled into `dist/site.css`). Reuse existing modules (scrollReveal, lineMaskReveal, stickyCta, tabDropdown, heroImageScale, scrollEnlargeSnap, focusRing, scriptTiltSpace).
- Designer lane: Webflow classes and combo classes per CLAUDE.md; custom CSS only in a Designer-visible embed.
- Each item closes as: proven (with what was checked), not done (with the reason), or differs from what was asked (one line for Stephen). Nothing is added that no item asks for.

Every item is checked on staging at 390 and 1440 (plus 991, 800 and 650 where desktop changes), against its notes and images. Motion items are judged from timed frames and measurements.

### Entry points

_No response_

### Non-goals

- Questions for Omar, held: M1 (animation speed), M5b (Meetings tabs on mobile), M33 (gallery drag), M35 (opening gallery images), and the M25 Marston or Marsden spelling.
- The scroll sections as a gesture-driven slider (#257): its own work.

### Tickets

- #265 Scroll steadiness: footer and FAQ (open)
- #266 Dining Reserve a table button (open)
- #267 Hero image and copy animate on load (open)
- #268 Scroll reveals (open)
- #269 Subnav and venue selector (open)
- #270 Focus rings, tilt, directions (open)

### Spec (as filed)

## Problem Statement

Omar's mobile review (17 November) produced 41 feedback items, recorded with Stephen's decisions in `docs/feedback/mobile-2026-11-17.md` and screenshots in `docs/feedback/images/2026-11-17/`. The first pass built some items wrong on the live site and left others unchecked. This round finishes every item and proves each one on staging.

## Solution

One round, two lanes. Code tickets are built headless and checked on real staging pages with the build's own bundle swapped in. Designer tickets (label `designer`) run as one Webflow Designer session on Stephen's Mac, approved by the same yes, each checked live with the capture, compare and iterate loop. Every item has its own acceptance line starting with its id; read that item's own section of `docs/feedback/mobile-2026-11-17.md`, never the doc as a whole.

Starting point: most items were already attempted. Code work from the first pass is in PR #256 (fixes since the review are on that branch). Webflow changes from the first pass are live on staging. For each item: check the live result against the item first; fix only what fails; never rebuild what already passes.

Refs: docs/feedback/images/2026-11-17/refs.json

## Stephen's later words (override the doc and older rules)

- M20: every mobile hero is `svh` with its button fully on screen (replaces the old vh-only rule, removed from CLAUDE.md).
- M21: on phones the Dining "Reserve a table" button is hidden at load and fades in docked at the bottom, centred, after a short scroll; it never crops or covers the copy and leaves no gap in the hero. Desktop: visible in the hero on load, then docks.
- M23: hero copy and the image zoom play on load, never on scroll; no flash before the animation (the image never shows at full size first).
- M30: every form's fields fade in, no slide (contact, Request for Proposal, photoshoot, newsletter), not only the RFP page.
- Venue selector (Dining and other scroll-mask sections): shows only once the slider's image is fully open, on phones too, never from the top of the page. The old Dining "show from the first screen" rule is removed.
- M19: the subnav links rise only slightly (subtle), staggered.
- M26: George Marston tilts -5deg on phones; desktop stays level as M26 says.
- M8: the footer background's scale-in must be smooth, no jitter.

## Implementation Decisions

- Code lane: `src/utils/` modules and `docs/reference/site-head/*.css` (bundled into `dist/site.css`). Reuse existing modules (scrollReveal, lineMaskReveal, stickyCta, tabDropdown, heroImageScale, scrollEnlargeSnap, focusRing, scriptTiltSpace).
- Designer lane: Webflow classes and combo classes per CLAUDE.md; custom CSS only in a Designer-visible embed.
- Each item closes as: proven (with what was checked), not done (with the reason), or differs from what was asked (one line for Stephen). Nothing is added that no item asks for.

## Testing Decisions

Every item is checked on staging at 390 and 1440 (plus 991, 800 and 650 where desktop changes), against its notes and images. Motion items are judged from timed frames and measurements.

## Out of Scope

- Questions for Omar, held: M1 (animation speed), M5b (Meetings tabs on mobile), M33 (gallery drag), M35 (opening gallery images), and the M25 Marston or Marsden spelling.
- The scroll sections as a gesture-driven slider (#257): its own work.

## Further Notes

Taste items Stephen will judge by eye: subnav link travel (M19), tilt angle (M26), hero zoom speed (M23).

#### Ticket #265: Scroll steadiness: footer and FAQ

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M6: No scroll jump scrolling into the footer on Home and Rooms, or when FAQ items open or close, at 390 and 1440 (including the iOS toolbar case: the scroll section's length must not change when the toolbar hides). (read M6 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M12: Each FAQ question line-masks in on scroll, staggered row by row, with its divider; the open item's chevron lines up with the closed ones. (read M12 in `docs/feedback/mobile-2026-11-17.md`)

#### Ticket #266: Dining Reserve a table button

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M21: Phones: hidden at load, fades in docked at the bottom and centred after a short scroll, hidden again back at the top; never cropped; no empty gap in the hero. Desktop: fully visible in the hero on first load, then docks. (read M21 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M22: The docked button hides once "Other dining options" comes into view, on phones and desktop. (read M22 in `docs/feedback/mobile-2026-11-17.md`)

#### Ticket #267: Hero image and copy animate on load

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M23: On every full-bleed image hero, desktop and phone: the image starts slightly larger and settles to normal size on load (scale only, inside its frame), with the copy's text mask playing on load too; no flash of the full-size image before it starts; reduced motion respected. (read M23 in `docs/feedback/mobile-2026-11-17.md`)

#### Ticket #268: Scroll reveals

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M4: Home Art & Stories collage on phones: images fade in one by one on scroll. (read M4 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M16: Room page gallery photos scale and fade in on scroll, desktop and phone. (read M16 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M30: Every form's fields fade in on scroll, staggered, with no slide: contact, Request for Proposal, photoshoot and the newsletter form near the footer. (read M30 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M39: Corporate "Why teams choose the Guild" row images on phones scale and fade in on scroll, no mask. (read M39 in `docs/feedback/mobile-2026-11-17.md`)

#### Ticket #269: Subnav and venue selector

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M19: The subnav menu opens with an eased height and its links rise only slightly, staggered; closing reverses; a quick double tap never leaves it closed while reporting open. (read M19 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M18: On scroll-mask sections the venue selector shows only once the slider's image is fully open, never from the top of the page, on phones and desktop (Stephen 17 Nov). (read M18 in `docs/feedback/mobile-2026-11-17.md`)

#### Ticket #270: Focus rings, tilt, directions

## Parent

#264

## What to build

Check each item on staging first; fix only what fails. Each item closes as proven, not done (with the reason), or differs from what was asked (one line for Stephen).

## Acceptance criteria

- [ ] M11a: No focus ring after a tap or click anywhere (Rooms quiz, room list, Meetings modal back arrow); keyboard Tab still shows one. (read M11a in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M26: George Marston tilts -5deg on phones with clear space above and below; desktop stays level. (read M26 in `docs/feedback/mobile-2026-11-17.md`)
- [ ] M31b: Every Directions link opens in a new tab with rel noopener. (read M31b in `docs/feedback/mobile-2026-11-17.md`)

