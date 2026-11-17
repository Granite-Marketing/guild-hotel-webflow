# Spec: Mobile feedback, code fixes (builder)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/228
Snapshot: 2026-11-17 13:44

### Intent

Fix each in code, without Webflow Designer changes (the Designer work runs in parallel in the companion Webflow spec and must not collide). Built on the T14 with /spec-build. Changes ship to staging in the companion spec's release ticket.

### Done-when

- #230: Diagnosis in the PR: what moved the page and why, with evidence
- #230: No jump scrolling into the footer on Home and Rooms at 390 and 1440
- #230: No jump when opening or closing FAQ items
- #230: Existing refresh rules in CLAUDE.md still hold, or the PR explains a needed change
- #230: `pnpm check`, `pnpm test:factory` and `pnpm build` pass
- #231: Button fully visible on first load at 1440 and 390, no scroll needed
- #231: Docks while scrolling, hides when Other dining options enters view, returns when scrolling back up
- #231: Cause of the hidden state written in the PR
- #231: `pnpm check`, `pnpm test:factory` and `pnpm build` pass
- #232: Hero image scales in on load on every image hero; image never leaves its frame; reduced motion shows it still
- #232: Room gallery images use the restored scale and fade; PR names the commit it restores from
- #232: Hero text mask unchanged
- #232: `pnpm check`, `pnpm test:factory` and `pnpm build` pass
- #233: FAQ rows reveal staggered on every page with the FAQ accordion
- #233: RFP fields fade in without movement
- #233: Home collage images fade in one by one on mobile
- #233: Corporate row images scale and fade in on mobile (once the Webflow ticket adds them)
- #233: Fade-only option documented in the module header and runtime modules reference
- #233: Reduced motion shows everything at once
- #233: `pnpm check`, `pnpm test:factory` and `pnpm build` pass
- #234: Open and close animate on Solana Coffee and Rooms at 390
- #234: Links still clickable as soon as they show; keyboard and screen reader behaviour unchanged
- #234: Reduced motion opens and closes instantly
- #234: `pnpm check`, `pnpm test:factory` and `pnpm build` pass
- #235: No focus ring after a tap or click in the quiz, room list and Meetings modal
- #235: Tab key still shows a visible ring on every control
- #235: Tilted headings get clearance on phones; untilted headings get none
- #235: Directions links open in a new tab
- #235: `pnpm check`, `pnpm test:factory` and `pnpm build` pass

### Constraints

- Scroll jumps are diagnose-first: reproduce on staging at 390 and 1440, then inspect the accordion's ScrollTrigger refresh and the smooth-scroll height recalculation. Fix the root cause once in shared code; keep the CLAUDE.md refresh rules unless the diagnosis proves they cause it, and say so in the PR.
- Sticky CTA: fix the first-load stacking or starting state so the button shows in the hero before any scroll; its end section becomes "Other dining options". It was raised before, so record why the earlier fix did not hold.
- Hero image scale-in: scale only, no opacity, image stays inside its frame, runs alongside the existing hero text mask, reduced motion shows it still.
- Room gallery: restore the earlier scale and fade from git history rather than writing a new animation.
- New reveals go through the scroll reveal module's code-applied reveals on shared component classes, so no Designer attributes are needed: text mask for FAQ rows, a new fade-only option (no rise) for form fields and the Home collage on mobile, and the existing image fade (scale and fade) for Corporate row images on mobile. Document the fade-only option in the module header and the runtime modules reference.
- Subnav dropdown: animate the existing tab dropdown's open and close (eased height, then staggered links); reduced motion is instant.
- Focus: show focus rings for keyboard use only, and never on elements the scripts focus programmatically. If this needs CSS in a Designer embed, the paste is part of the companion release ticket.
- Script tilt spacing applies on phones too (the module currently skips untilted phone headings; tilted ones must get clearance).
- Directions links get a new tab and noopener wherever the map module builds them.

- A good test checks behaviour a visitor sees, not internals.
- The gate is `pnpm check`, `pnpm test:factory` and `pnpm build`. Add a small assert-based self-check or a Playwright fixture page under `tests/visual/fixtures` where behaviour can run outside Webflow (fade-only reveal, focus-visible handling, sticky CTA end section, tilt spacing), following the existing fixtures.
- Live verification at 1440 and 390 happens in the companion spec's release ticket.

### Entry points

_No response_

### Non-goals

- Any Webflow Designer or CMS change (the companion Webflow spec).
- Releasing a bundle version or editing the Webflow footer tag.
- Items waiting on Omar: animation speed (M1), Meetings tabs on mobile (M5b), gallery drag (M33), opening gallery images (M35).

### Tickets

- #230 Scroll jumps near the footer and when FAQ items open or close (open)
- #231 Sticky "Reserve a table": visible on first load, hides at Other dining options (open)
- #232 Image animations: hero image scale-in, room gallery scale and fade restored (open)
- #233 Scroll reveals on more blocks: FAQ rows, RFP form fields, Home collage, Corporate row images (open)
- #234 Subnav dropdown opens with an eased height and staggered links (open)
- #235 Keyboard-only focus rings, script tilt spacing on phones, Directions in a new tab (open)

### Spec (as filed)

## Problem Statement

Omar's mobile review video (17 November 2026, relayed by Stephen) includes fixes that live in the custom-code bundle: the page jumps near the footer and when FAQ items open or close; the dining "Reserve a table" button hides in the hero until you scroll and stays up too long; several blocks have no reveal or lost one the client liked; the mobile subnav opens with no motion; tapping in the Rooms quiz and modals leaves focus outlines that look broken; tilted script headings get no spacing on phones; and map Directions links do not open in a new tab.

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Solution

Fix each in code, without Webflow Designer changes (the Designer work runs in parallel in the companion Webflow spec and must not collide). Built on the T14 with /spec-build. Changes ship to staging in the companion spec's release ticket.

## User Stories

1. As a visitor on a phone, I want the page to scroll smoothly into the footer, so that the site feels finished.
2. As a visitor, I want opening or closing an FAQ answer not to jolt the page, so that I keep my place.
3. As a diner, I want "Reserve a table" visible as soon as a dining page loads, so that I can book without hunting for it.
4. As a diner, I want the floating "Reserve a table" button to step aside once other dining options appear, so that it does not cover them.
5. As a visitor, I want hero images to settle gently into place on load, so that the page opens with some life.
6. As the client, I want the room gallery's earlier scale and fade animation back, so that the room pages feel as they did when I approved them.
7. As a visitor, I want FAQ questions to reveal as I scroll, so that the FAQ matches the rest of the site.
8. As a visitor on the Request for Proposal page, I want the form fields to fade in calmly, so that the form appears without distracting movement.
9. As a visitor on a phone, I want the Home collage images to appear one by one, so that the section feels composed.
10. As a visitor on a phone, I want the Corporate row images to scale and fade in, so that the list feels alive without disorienting motion.
11. As a visitor on a phone, I want the subnav menu to open with an eased height and staggered links, so that it feels polished.
12. As a touch or mouse user, I want no focus outline after tapping a quiz option or modal control, so that the interface does not look broken.
13. As a keyboard user, I want a visible focus ring on every control, so that I can still see where I am.
14. As a visitor on a phone, I want tilted script headings to clear the content around them, so that nothing overlaps.
15. As a visitor, I want Directions links to open in a new tab, so that I keep the hotel site open.

## Implementation Decisions

- Scroll jumps are diagnose-first: reproduce on staging at 390 and 1440, then inspect the accordion's ScrollTrigger refresh and the smooth-scroll height recalculation. Fix the root cause once in shared code; keep the CLAUDE.md refresh rules unless the diagnosis proves they cause it, and say so in the PR.
- Sticky CTA: fix the first-load stacking or starting state so the button shows in the hero before any scroll; its end section becomes "Other dining options". It was raised before, so record why the earlier fix did not hold.
- Hero image scale-in: scale only, no opacity, image stays inside its frame, runs alongside the existing hero text mask, reduced motion shows it still.
- Room gallery: restore the earlier scale and fade from git history rather than writing a new animation.
- New reveals go through the scroll reveal module's code-applied reveals on shared component classes, so no Designer attributes are needed: text mask for FAQ rows, a new fade-only option (no rise) for form fields and the Home collage on mobile, and the existing image fade (scale and fade) for Corporate row images on mobile. Document the fade-only option in the module header and the runtime modules reference.
- Subnav dropdown: animate the existing tab dropdown's open and close (eased height, then staggered links); reduced motion is instant.
- Focus: show focus rings for keyboard use only, and never on elements the scripts focus programmatically. If this needs CSS in a Designer embed, the paste is part of the companion release ticket.
- Script tilt spacing applies on phones too (the module currently skips untilted phone headings; tilted ones must get clearance).
- Directions links get a new tab and noopener wherever the map module builds them.

## Testing Decisions

- A good test checks behaviour a visitor sees, not internals.
- The gate is `pnpm check`, `pnpm test:factory` and `pnpm build`. Add a small assert-based self-check or a Playwright fixture page under `tests/visual/fixtures` where behaviour can run outside Webflow (fade-only reveal, focus-visible handling, sticky CTA end section, tilt spacing), following the existing fixtures.
- Live verification at 1440 and 390 happens in the companion spec's release ticket.

## Out of Scope

- Any Webflow Designer or CMS change (the companion Webflow spec).
- Releasing a bundle version or editing the Webflow footer tag.
- Items waiting on Omar: animation speed (M1), Meetings tabs on mobile (M5b), gallery drag (M33), opening gallery images (M35).

## Further Notes

Companion spec: #229. Scope additions (new animations beyond the quote) are logged in `docs/scope-additions.md`.

#### Ticket #230: Scroll jumps near the footer and when FAQ items open or close

## Parent

#228

## What to build

Scrolling to the footer (after the FAQ) and opening or closing an FAQ item no longer makes the page jump, on phones and desktop. Diagnose first: reproduce on current staging (390 and 1440, smooth scroll on), check how the accordion refreshes ScrollTrigger and how the smooth-scroll engine recalculates page height, then fix the cause once in shared code (M6).

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] Diagnosis in the PR: what moved the page and why, with evidence
- [ ] No jump scrolling into the footer on Home and Rooms at 390 and 1440
- [ ] No jump when opening or closing FAQ items
- [ ] Existing refresh rules in CLAUDE.md still hold, or the PR explains a needed change
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

#### Ticket #231: Sticky "Reserve a table": visible on first load, hides at Other dining options

## Parent

#228

## What to build

On dining detail pages the "Reserve a table" button shows in the hero on first load without scrolling (today it hides behind the next layer until you scroll; raised before, so find why the earlier fix did not hold), still docks to the bottom as you scroll, and hides once "Other dining options" comes into view instead of at the footer (M21, M22).

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] Button fully visible on first load at 1440 and 390, no scroll needed
- [ ] Docks while scrolling, hides when Other dining options enters view, returns when scrolling back up
- [ ] Cause of the hidden state written in the PR
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

#### Ticket #232: Image animations: hero image scale-in, room gallery scale and fade restored

## Parent

#228

## What to build

Full-bleed image heroes: the image settles from slightly larger to its normal size on load (scale only, no opacity), alongside the existing hero text mask, desktop and mobile (M23, scope addition). Room detail gallery images: restore the earlier scale and fade animation that was swapped for a text mask; find the original in git history and reinstate it, desktop and mobile (M16).

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] Hero image scales in on load on every image hero; image never leaves its frame; reduced motion shows it still
- [ ] Room gallery images use the restored scale and fade; PR names the commit it restores from
- [ ] Hero text mask unchanged
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

#### Ticket #233: Scroll reveals on more blocks: FAQ rows, RFP form fields, Home collage, Corporate row images

## Parent

#228

## What to build

Through the scroll reveal module's code-applied reveals (no Designer attributes needed): each FAQ question reveals with the text mask, staggered, plus its divider (M12); Request for Proposal form fields fade in staggered with no slide and no text mask, which needs a fade-only option (M30); on mobile the Home "Art & Stories" collage images fade in one by one (M4); Corporate "Why teams choose the Guild" row images scale and fade in on mobile, no mask (M39). Desktop behaviour of the collage and Corporate rows is unchanged.

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] FAQ rows reveal staggered on every page with the FAQ accordion
- [ ] RFP fields fade in without movement
- [ ] Home collage images fade in one by one on mobile
- [ ] Corporate row images scale and fade in on mobile (once the Webflow ticket adds them)
- [ ] Fade-only option documented in the module header and runtime modules reference
- [ ] Reduced motion shows everything at once
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

#### Ticket #234: Subnav dropdown opens with an eased height and staggered links

## Parent

#228

## What to build

The mobile subnav selector (dining pages and every page using it) opens by growing its height with easing, then its links come in with a staggered text reveal; closing reverses it. Reduced motion opens instantly (M19, scope addition).

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] Open and close animate on Solana Coffee and Rooms at 390
- [ ] Links still clickable as soon as they show; keyboard and screen reader behaviour unchanged
- [ ] Reduced motion opens and closes instantly
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

#### Ticket #235: Keyboard-only focus rings, script tilt spacing on phones, Directions in a new tab

## Parent

#228

## What to build

Focus outlines show only for keyboard use: tapping or clicking in the Rooms quiz, the room list dialog and the Meetings modal (back arrow) shows no ring, and headings the scripts focus never show one; keyboard users still get the ring (M11a, M28). The script tilt spacing module also handles phones, so the History "George Marston" heading (tilted on mobile only by the Webflow ticket) clears the slider and paragraph (M26). Every map "Directions" link opens in a new tab with noopener (M31b).

Decisions, client wording and screenshots: `docs/feedback/mobile-2026-11-17.md` (items M1 to M41) and `docs/feedback/images/2026-11-17/`.

## Acceptance criteria

- [ ] No focus ring after a tap or click in the quiz, room list and Meetings modal
- [ ] Tab key still shows a visible ring on every control
- [ ] Tilted headings get clearance on phones; untilted headings get none
- [ ] Directions links open in a new tab
- [ ] `pnpm check`, `pnpm test:factory` and `pnpm build` pass

