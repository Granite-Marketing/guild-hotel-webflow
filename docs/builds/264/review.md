head: d51c36eba8312ee17e418ed311936c50d1cf0daf
round: 1

## Actionable findings
- P2 #4 docs/reference/site-head/faq-chevron.css:2 M12 open-item chevron alignment has no fix or verification in the tree (autofix: manual) fix: screenshot the live FAQ at 390 and 1440 with one item open; if the open chevron sits right of the closed ones, add a rule here (e.g. pin `.accordion_header.is-active .accordion_icon` to the same right edge/width as closed rows) and record the result.
- P2 #5 docs/reference/site-head/reveal-prehide.css:12 Pre-bundle hero zoom ignores reduced motion, so the photo holds at 1.12 then snaps to 1 (M23 "reduced motion respected") (autofix: gated_auto) fix: wrap lines 11-13 in `@media (prefers-reduced-motion: no-preference) { ... }` and rebuild dist/site.css.
- P3 #1 docs/reference/site-head/reveal-prehide.css:12 3s zoom fail-safe causes a pop if the bundle lands after 3s (photo at 1, then reset to 1.12 by heroImageScale.ts:35) (autofix: manual) fix: in heroImageScale skip the zoom when performance.now() > 3000 (fail-safe already fired).
- P3 #2 src/utils/scrollReveal.ts:242 Collage stagger counter is page-wide, so every tile after the third waits 0.5s after its own trigger (autofix: advisory) fix: use ScrollTrigger.batch or stagger only tiles that trigger together.
- P3 #3 src/utils/tabDropdown.ts:120 Comment misstates GSAP (kill() does not fire onComplete; the hazard was killTweensOf emptying the old timeline so it completed) (autofix: gated_auto) fix: reword the comment.
- P3 #6 docs/reference/runtime-modules.md:674 Module doc stale: no COLLAGE_STEP stagger, visibility:hidden skip, or newsletter insideFade; line 1304 lacks the tabDropdown latest-timeline guard (autofix: gated_auto) fix: update both paragraphs.
- P3 #7 src/utils/scriptTiltSpace.ts:16 Comment "tilted on phones too" is stale now George Marston is level on desktop (autofix: gated_auto) fix: say "tilted on phones only (M26)".

## Spec
- M12 "the open item's chevron lines up with the closed ones": not addressed in the diff or existing code (only the M5 un-rotate rule exists); see #4.
- M23 "reduced motion respected": partial; the CSS pre-zoom applies to reduced-motion users; see #5. Text mask on load is implemented (scrollReveal.ts:276 plays the hero on a delayedCall).
- M21/M22: implemented by existing stickyCta.ts and src/index.ts:181-187; this diff adds tests only.
- M6, M18, M19, M11a, M26, M31b, M4, M16, M30, M39: covered by the diff or existing code (scrollEnlargeSnap.ts stable stage height and venue gate, tabDropdown double-tap guard, focusRing !important, phone-only -5deg tilt, directionsLinks noopener, scrollReveal staggered/mobile reveals).
- Not asked for: 3s hero-zoom fail-safe and the visibility:hidden skip in mobileReveals (both defensible).
- dist/index.js is at base, so the TS fixes (focusRing, scrollReveal, tabDropdown) ship only with the release rebuild; dist/site.css is rebuilt.

## Standards
- No hard violations of CLAUDE.md Custom Code Delivery or GSAP module conventions (autoAlpha, class toggles, no refresh in handlers, clean naming). typecheck passes.
- CLAUDE.md "Runtime modules: each module's DOM contract ... are in docs/reference/runtime-modules.md": not kept in sync for scrollReveal and tabDropdown; see #6.
- Judgement: new Playwright specs lean on fixed waitForTimeout sleeps (flakiness risk, no rule broken).

## Build vs buy lens
none (no approved libraries declared; GSAP/ScrollTrigger already used for all animation, no hand-rolled equivalents).

## Verdict
fix-first: two P2 gaps against named Done-when lines (M12 chevron alignment unverified, M23 reduced motion) are cheap to close; the rest is P3 polish.
