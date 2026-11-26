status: complete

- #420: merge 5e931b5 (ticket commit 18b09fb). Tests added: tests/visual/heading-tags-420.spec.ts (6 Playwright tests on fixture tests/visual/fixtures/heading-tags-420.html: paragraph pop-up title, data-modal-title precedence, room grid hover with a p name, rooms quiz focus on a p heading, script reveal on h2/h3/p and not a div, line mask on h2/h3/p and a marked div).
  Red run: src reverted to 69c1992 (plus h3 removed from the scriptReveal and lineMaskReveal selectors for the two confirm-only tests), `npx playwright test tests/visual/heading-tags-420.spec.ts --project=chromium`: 6 of 6 failed (aria-labelledby "" vs "paragraph-title", hover shift 0, tabindex "" vs "-1", h3 not revealed or split).
- #421: merge 056e2e3 (ticket commit bcf8a39) plus fix 167d068 (match by section as well as text). Tests added: tests/factory/heading-check.test.mjs (17 tests, fixtures in tests/factory/fixtures/heading-check/): pass, fail, not found, repeated text in page order, section decides between repeated texts, learned section, wrapped and bare logo, p row excluded from counts, two-page tab, shared-part diff and absent part, no-Webflow-write source scan, end-to-end on saved pages.
  Red run: test file run before the module existed (failed on the missing module); the two section tests run against the text-only matcher (both failed), and the learning test re-run with learning disabled (failed, MUTATION comment).
- First staging run (read only): docs/builds/419/heading-check-first-run.md (164 passed, 365 failed, 159 not found, as expected before tag changes).
- Verification: preflight + `pnpm check` pass, `pnpm build:check` passes, `pnpm test:factory` 131 of 131, new Playwright spec 6 of 6, no em dashes in the diff. ESLint has no flat config in this repo, so it could not run.
- Existing rooms-quiz.spec.ts:74 fails the same on main and on this branch (taken as one of the known #251/#284 failures); not changed.
- Assumptions: docs/builds/419/ASSUMPTIONS.md rows 1 to 5.
