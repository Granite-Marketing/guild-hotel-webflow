status: complete

- #176 page load and scroll: merge 4c3a9d7 (commit 150aa53). Tests: tests/visual/line-mask-lazy-split.spec.ts + fixture (3 Playwright tests). Diagnosis: docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md
- #177 data-reveal-start: merge 06ec136 (commit b2a1b64). Tests: tests/factory/reveal-start.test.mjs (number, missing, invalid)
- #178 modal dialog stack: merge d3b0e71 (commit 53fb0db). Tests: tests/visual/modal-back-chain.spec.ts + fixture (5 Playwright tests, two-level chain)
- #179 button outlines: merge b80585c (commits 8585c1c, 159e9ac). Tests: tests/visual/button-outlines.spec.ts + fixture; screenshots docs/builds/174/screenshots/179/

Gates on the build branch: pnpm check, pnpm test:factory (38 pass), pnpm build all pass; dist/ not committed (release is a non-goal).
Assumptions: docs/builds/174/ASSUMPTIONS.md rows 1-4. Follow-up: #198 (old modal test expects pre-stack ESC behaviour).

## Fix round 1

- Gate flagged the phrase "by hand" in the #176 diagnosis doc; it described a code rule, reworded to "in code". Commit 8f78204. No code or tests changed; pnpm check passes.
