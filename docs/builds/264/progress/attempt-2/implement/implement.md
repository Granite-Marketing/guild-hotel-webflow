status: complete

# Implement: spec #264 (code lane)

- #265 (M6, M12): merge 4818152; both proven in existing code; tests added: tests/visual/scroll-length-toolbar.spec.ts
- #266 (M21, M22): merge fee688b; both proven in existing stickyCta; tests added: tests/visual/sticky-cta-m21.spec.ts (+ fixtures)
- #267 (M23): merge b8994fe; fix: pre-hide zoom fail-safe in reveal-prehide.css; tests added: tests/visual/hero-on-load.spec.ts (+ fixtures)
- #268 (M4, M16, M30, M39): merge d3953d1; fix: collage tiles stagger one by one (M4), newsletter fields fade staggered inside the fade column (M30); M16, M39 proven; tests added: tests/visual/scroll-reveals-268.spec.ts (+ fixtures)
- #269 (M19, M18): merge ecc202e; fix: tabDropdown double-tap race (only the latest open/close finishes); M18 proven; tests added: double-tap, mid-animation and rise specs in tab-dropdown.spec.ts, selector-visibility spec in scroll-enlarge-snap.spec.ts
- #270 (M11a, M26, M31b): merge 3751d09; fix: focusRing outline set with important (M11a), George Marston tilt -5deg phones only, desktop level (M26); M31b proven; tests added: tests/visual/focus-tilt-directions-270.spec.ts (+ fixtures)

Checks on the merged branch: pnpm check clean; pnpm test:factory 38/38; 56 Playwright specs pass across the new and related suites.

Known: older specs failing on the untouched base (sticky-cta.spec.ts, three scroll-enlarge-snap specs, one rooms-quiz spec) were not edited; follow-up #284.

Assumptions: none new; all timing values are unchanged existing ones except the M4 collage stagger (0.2s per tile, 0.5s cap) and newsletter field stagger (0.1s), recorded in ASSUMPTIONS.md.

## Fix round 2

- Gate feedback: working tree had uncommitted changes. Cause: the ticket merges left `dist/` one build behind `src/`, so validation's `pnpm build` rewrote it. Fix: committed the rebuilt bundle (34469c9); a second `pnpm build` leaves the tree clean. `pnpm check` passes. No source or test changes.
