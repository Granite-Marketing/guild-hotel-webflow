status: complete

Integration branch: build/228-spec-mobile-feedback-code-fixes-builder (dist rebuilt in a6ee4b8)

- #230 merge 5c9497b (ticket e5a4ba7): tests/visual/accordion-scroll.spec.ts + fixtures/accordion-scroll.{html,ts}; diagnosis in docs/builds/228/notes/230.md
- #231 merge 8a58e23 + 5a56849 (tickets 4cdf0df, 8db6262): tests/visual/sticky-cta.spec.ts + fixtures/sticky-cta.{html,ts}; cause in notes/231.md
- #232 merge c6b6096 (ticket c18e437): tests/visual/hero-image-scale.spec.ts + fixtures/hero-image-scale.{html,ts}; restores from e5ed47c (notes/232.md)
- #233 merge e020ba9 (ticket 281ce16): tests/visual/scroll-reveal-fade-only.spec.ts + fixtures/scroll-reveal-fade-only.{html,ts}; notes/233.md
- #234 merge c04aab0 (ticket 6fd1958): tests/visual/tab-dropdown.spec.ts + fixtures/tab-dropdown.{html,ts}; notes/234.md
- #235 merge 7cf282d (ticket 92bae70): tests/visual/mobile-code-fixes-235.spec.ts + fixtures/mobile-code-fixes-235.{html,ts}; notes/235.md

Gates on the merged branch: pnpm check pass, pnpm test:factory 38/0, pnpm build pass, new Playwright specs all pass.
Pre-existing failure on main (not this build): rooms-quiz.spec.ts:74, filed as #251.
Assumptions: rows 1 to 9 in docs/builds/228/ASSUMPTIONS.md.

## Fix round 1
- Gate: dist/ is a protected path. dist/index.js and dist/site.css restored to main in 0e6664f; rebuild and release filed as #252. pnpm check passes.
