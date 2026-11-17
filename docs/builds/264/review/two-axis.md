# Two-axis review, build 264 round 1 (base 48c0e74, head d51c36e)

## Standards
No hard violations of CLAUDE.md or the GSAP conventions in src/ (autoAlpha used, no inline display, no ScrollTrigger.refresh in handlers, clean naming, timeline scoped per bar).
Doc drift (CLAUDE.md "Record learnings"; runtime-modules.md is where each module's DOM contract lives):
1. docs/reference/runtime-modules.md:674 still says collage tiles fade "as each reaches the trigger line"; does not mention COLLAGE_STEP stagger, the visibility:hidden skip, or newsletter fields staggering inside a Designer `fade` (insideFade).
2. docs/reference/runtime-modules.md:1304 (tabDropdown M19) does not mention the latest-timeline-only guard / tab clearProps on reopen (minor).
3. runtime-modules.md:676 fail-safe text does not mention the new hero zoom clear (minor).
Judgement calls: visibility:hidden skip in mobileReveals is an undocumented heuristic; insideFade is a one-row Designer coupling; many fixed waitForTimeout sleeps in new specs (flakiness risk, no rule against it).

## Spec
(a) Missing or partial
- M12 "the open item's chevron lines up with the closed ones": nothing in the diff or the tree addresses chevron alignment; only faq-chevron.css (M5 un-rotate) exists. The feedback doc itself says "Confirm on live and align if real".
- M23 "reduced motion respected": reveal-prehide.css zoom (1.12) is not gated on prefers-reduced-motion; heroImageScale returns early so reduced-motion users see the photo held zoomed then snap to 1 when reveal-ready lands.
- M21/M22: implemented by existing stickyCta.ts + index.ts:181-187; diff adds tests only.
- M6, M19, M18, M31b, M26, M11a, M16 (ROOM_PAGE_IMAGE_FADE), M39, M30, M4: covered by diff or existing code.
(b) Scope creep: 3s hero-zoom fail-safe (defensible); visibility:hidden skip in mobileReveals.
(c) Possibly wrong
- M4: page-wide `shown++` counter delays every tile after the third by 0.5s after its own trigger.
- M26: scriptTiltSpace.ts:16 comment "tilted on phones too" is stale now desktop is level.
- M30 newsletter relies on the Designer `fade` never sliding (not enforced in code).
- dist/index.js restored to base: TS fixes ship only with the release rebuild.

Summary: Standards 3 doc-drift items, Spec 2 partial items; worst is the M12 chevron alignment having no evidence of a fix.
