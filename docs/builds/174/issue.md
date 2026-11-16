# Spec: In Progress feedback, code fixes (builder)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/174
Snapshot: 2026-11-16 15:55

### Intent

Fix each in code, without touching any Webflow Designer structure (Designer work runs in parallel in the companion Webflow spec and must not collide). The fixes ship to staging in a later release ticket of the companion spec.

### Done-when

- #176: Diagnosis written to the PR: what blocked scroll, what moved the page, evidence
- #176: Scroll responds from first input during load on Home, Corporate, Neighborhood, Meetings (checked after release)
- #176: No jump back after load
- #176: Hero text reveal plays once without flicker
- #176: No stutter scrolling over each map
- #176: `pnpm check`, `pnpm test:factory`, `pnpm build` pass
- #177: Attribute read for fade, text-mask, image-mask, image-fade
- #177: Missing or invalid value behaves exactly as today
- #177: Self-check or fixture covers parsing (number, missing, invalid)
- #177: Documented beside `data-reveal-delay` in the module header and runtime modules reference
- #177: Gates pass
- #178: Dialog stack: open from inside a dialog pushes, Back/close pops to the previous one
- #178: Grid-opened dialog closes to the page as today
- #178: ESC and click-outside follow the stack
- #178: Focus returns to the previous dialog's trigger
- #178: Fixture or self-check covers a two-level chain
- #178: Modal setup reference updated
- #178: Gates pass
- #179: One outline thickness variable used by every outlined state
- #179: Meetings one-off removed
- #179: Fixture screenshots at 1x and 2x show clean diagonals (attach before/after)
- #179: Button system reference updated
- #179: Gates pass

### Constraints

- Page load and scroll is diagnose-first: record a cold load on staging, find what blocks scroll and what moves the page back (suspects: init that waits for every image before smooth scroll and ScrollTriggers start; scroll restoration; anchor or "scroll to end" correction; Google Maps capturing wheel events). Fix the root cause once in shared code. Keep the eager-image and ScrollTrigger rules in CLAUDE.md unless the diagnosis proves they cause this, in which case raise it before changing them.
- Reveal start: new optional attribute `data-reveal-start="<number>"` read by the scroll reveal module for every mode. The number is the viewport percentage from the top at which the element's top triggers the reveal (`60` means `top 60%`). Absent or invalid falls back to the current default start (`top 90%`). Reveals still play once. Document beside `data-reveal-delay` in the module header and in the runtime modules reference.
- Modal back chain: the modal script keeps a stack of open dialogs. Opening a dialog from inside another pushes; Back or close in the top dialog returns to the one beneath it; close from a grid-opened dialog closes to the page as today. ESC and click-outside follow the same rule. Focus returns to the trigger in the previous dialog.
- Button outlines: change only the shared button stylesheet that is minified into the Site Nav embed. One outline thickness for every outlined chamfer button (the Meetings one-off goes). Diagonals render crisp at 1x and 2x; if the clip-path ring cannot be made crisp, switch the ring to an SVG stroke. Pasting the minified CSS into the embed is a Designer step in the companion spec, not part of this build.

- A good test checks behaviour a visitor sees, not internals.
- The repo has no unit-test seam for runtime modules; the gate is `pnpm check`, `pnpm test:factory` and `pnpm build`. Each ticket adds a small assert-based self-check or Playwright fixture page under `tests/visual/fixtures` where the behaviour can run outside Webflow (reveal start parsing, modal stack, button CSS rendering at 1x and 2x), following the existing fixtures.
- Live verification on staging happens in the companion spec's release ticket.

### Entry points

_No response_

### Non-goals

- Any Webflow Designer change (elements, classes, attributes, CMS, embeds).
- Releasing a new bundle version or editing the Webflow footer tag.
- The filter menu shape (waits on the client's SVG) and the meetings form questions.

### Tickets

- #176 Page load and scroll: no freeze, no jump back, no map stutter (open)
- #177 Reveal start setting: data-reveal-start (open)
- #178 Modal Back returns to the previous modal (open)
- #179 Hexagon button outlines: crisp diagonals, one thickness (open)

### Spec (as filed)

## Problem Statement

The client's In Progress Trello cards (Guild-Dev-QA board, reviewed with Stephen 2026-11-16) include four fixes that live entirely in the custom-code bundle or the button stylesheet: pages that cannot be scrolled while they load and then jump back up (with stuttering over Google maps), no way to tune when a scroll reveal starts from Webflow, a modal Back button that drops you to the gallery grid instead of the modal you came from, and hexagon button outlines whose diagonals look soft and stair-stepped and whose thickness differs between buttons.

Decisions, screenshots and client wording: `docs/feedback/in-progress-2026-11-16.md` and `docs/feedback/images/2026-11-16/`.

## Solution

Fix each in code, without touching any Webflow Designer structure (Designer work runs in parallel in the companion Webflow spec and must not collide). The fixes ship to staging in a later release ticket of the companion spec.

## User Stories

1. As a visitor, I want to scroll the page from my first wheel or touch input while it loads, so that the site never feels frozen.
2. As a visitor, I want the page to stay where I scrolled to once it finishes loading, so that I am never thrown back up.
3. As a visitor, I want the hero text reveal to play cleanly once on load, so that the first impression looks finished.
4. As a visitor, I want to scroll past a map without a pause or stutter, so that the page feels smooth on Corporate, Neighborhood and Meetings.
5. As a Webflow editor, I want to set when a reveal starts with one number on the element, so that I can tune timing in Webflow without a code change.
6. As a Webflow editor, I want elements without that number to behave exactly as today, so that nothing else on the site moves.
7. As a visitor browsing art, I want Back in a modal opened from another modal to return to the modal I came from, so that I can follow an artist link and come back to the artwork.
8. As a visitor, I want Back in a modal opened from the grid to still close to the grid, so that the normal case is unchanged.
9. As a visitor, I want every hexagon button outline to have crisp, even diagonals on standard and retina screens, so that the buttons look refined.
10. As the client, I want every outlined hexagon button to use one stroke thickness, so that the Meetings "Book your space" button matches the rest.

## Implementation Decisions

- Page load and scroll is diagnose-first: record a cold load on staging, find what blocks scroll and what moves the page back (suspects: init that waits for every image before smooth scroll and ScrollTriggers start; scroll restoration; anchor or "scroll to end" correction; Google Maps capturing wheel events). Fix the root cause once in shared code. Keep the eager-image and ScrollTrigger rules in CLAUDE.md unless the diagnosis proves they cause this, in which case raise it before changing them.
- Reveal start: new optional attribute `data-reveal-start="<number>"` read by the scroll reveal module for every mode. The number is the viewport percentage from the top at which the element's top triggers the reveal (`60` means `top 60%`). Absent or invalid falls back to the current default start (`top 90%`). Reveals still play once. Document beside `data-reveal-delay` in the module header and in the runtime modules reference.
- Modal back chain: the modal script keeps a stack of open dialogs. Opening a dialog from inside another pushes; Back or close in the top dialog returns to the one beneath it; close from a grid-opened dialog closes to the page as today. ESC and click-outside follow the same rule. Focus returns to the trigger in the previous dialog.
- Button outlines: change only the shared button stylesheet that is minified into the Site Nav embed. One outline thickness for every outlined chamfer button (the Meetings one-off goes). Diagonals render crisp at 1x and 2x; if the clip-path ring cannot be made crisp, switch the ring to an SVG stroke. Pasting the minified CSS into the embed is a Designer step in the companion spec, not part of this build.

## Testing Decisions

- A good test checks behaviour a visitor sees, not internals.
- The repo has no unit-test seam for runtime modules; the gate is `pnpm check`, `pnpm test:factory` and `pnpm build`. Each ticket adds a small assert-based self-check or Playwright fixture page under `tests/visual/fixtures` where the behaviour can run outside Webflow (reveal start parsing, modal stack, button CSS rendering at 1x and 2x), following the existing fixtures.
- Live verification on staging happens in the companion spec's release ticket.

## Out of Scope

- Any Webflow Designer change (elements, classes, attributes, CMS, embeds).
- Releasing a new bundle version or editing the Webflow footer tag.
- The filter menu shape (waits on the client's SVG) and the meetings form questions.

## Further Notes

Companion spec: Webflow fixes (In Progress feedback 2026-11-16), worked in linked sessions one at a time.

#### Ticket #176: Page load and scroll: no freeze, no jump back, no map stutter

Part of #174

## What to build

A cold page load on staging scrolls from the visitor's first input, never jumps back up once loading finishes, plays the hero text reveal once and cleanly, and scrolls past the Google map on Corporate, Neighborhood and Meetings without a pause. Diagnose first (record a load, note when scroll goes live and what moves the page), then fix the root cause once in shared code.

Decisions and screenshots: `docs/feedback/in-progress-2026-11-16.md`, `docs/feedback/images/2026-11-16/`.

## Acceptance criteria

- [ ] Diagnosis written to the PR: what blocked scroll, what moved the page, evidence
- [ ] Scroll responds from first input during load on Home, Corporate, Neighborhood, Meetings (checked after release)
- [ ] No jump back after load
- [ ] Hero text reveal plays once without flicker
- [ ] No stutter scrolling over each map
- [ ] `pnpm check`, `pnpm test:factory`, `pnpm build` pass

#### Ticket #177: Reveal start setting: data-reveal-start

Part of #174

## What to build

Any `[data-reveal]` element can carry `data-reveal-start="<number>"`: the reveal fires when the element's top reaches that percentage of the viewport from the top (`60` = `top 60%`). Absent or invalid keeps today's `top 90%`. Works for every reveal mode, still plays once.

Decisions and screenshots: `docs/feedback/in-progress-2026-11-16.md`, `docs/feedback/images/2026-11-16/`.

## Acceptance criteria

- [ ] Attribute read for fade, text-mask, image-mask, image-fade
- [ ] Missing or invalid value behaves exactly as today
- [ ] Self-check or fixture covers parsing (number, missing, invalid)
- [ ] Documented beside `data-reveal-delay` in the module header and runtime modules reference
- [ ] Gates pass

#### Ticket #178: Modal Back returns to the previous modal

Part of #174

## What to build

Opening a dialog from a link inside another dialog (artwork, then its artist) and pressing Back returns to the artwork dialog, not the gallery grid. A dialog opened from the page still closes to the page. ESC and click-outside follow the same rule; focus returns to the trigger in the previous dialog.

Decisions and screenshots: `docs/feedback/in-progress-2026-11-16.md`, `docs/feedback/images/2026-11-16/`.

## Acceptance criteria

- [ ] Dialog stack: open from inside a dialog pushes, Back/close pops to the previous one
- [ ] Grid-opened dialog closes to the page as today
- [ ] ESC and click-outside follow the stack
- [ ] Focus returns to the previous dialog's trigger
- [ ] Fixture or self-check covers a two-level chain
- [ ] Modal setup reference updated
- [ ] Gates pass

#### Ticket #179: Hexagon button outlines: crisp diagonals, one thickness

Part of #174

## What to build

Every outlined chamfer button (at rest or on hover) draws its outline with crisp, even diagonals at 1x and 2x and one shared stroke thickness, including the Meetings 'Book your space' button (no one-off). Change only the shared button stylesheet; switch the ring to an SVG stroke if the clip-path ring cannot be made crisp. Pasting into the Site Nav embed is ticket 'Put the new button styling live'.

Decisions and screenshots: `docs/feedback/in-progress-2026-11-16.md`, `docs/feedback/images/2026-11-16/`.

## Acceptance criteria

- [ ] One outline thickness variable used by every outlined state
- [ ] Meetings one-off removed
- [ ] Fixture screenshots at 1x and 2x show clean diagonals (attach before/after)
- [ ] Button system reference updated
- [ ] Gates pass

