head: 8b2642875d83b5ddfe0920d8a0d23531ae3ff90c
round: 2

## Actionable findings
- P3 #5 docs/reference/modal-setup.md:31 `data-modal-title` is still only a prose bullet, not a row of the attribute table (autofix: manual) fix: add an optional row "Dialog title (any tag) | `data-modal-title` on the title element".
- P3 #6 scripts/api/webflow/heading-check.mjs:57 loadPages still copies copy-check's worker pool and lines 45-55 still re-implement where-used's crawl (autofix: manual) fix: give copy-check's loadPages a loader argument and export the crawl from where-used.mjs, then call both here.
- P3 #7 scripts/api/webflow/heading-check.mjs:47 The crawl still stops at 400 pages without a warning and the CLI exits 0 whatever the result (autofix: manual) fix: note in the report when the queue was not empty at the cap; set process.exitCode = 1 when rows fail, are not found, pages fail to load, baselines are missing or shared parts differ.

## Previous round
- #1 resolved: lib/heading-check.mjs:183-184 returns not-found (with otherSection) when bestFit is 0 and some element fits the label; learnSections (line 155) no longer learns a label a page section already names; tests at heading-check.test.mjs:372-409 cover the reject, the anti-learning case and the no-fit fallback.
- #2 resolved: missingBaselines (lib:194) feeds sharedParts.baselineMissing (heading-check.mjs:60,73), summarise counts it, renderReport prints "baseline missing, comparison not done" and drops "No page differs."; diffSharedParts (lib:214) now walks the union of class keys and shows "none" on the missing side; tests at 418-445.
- #3 resolved: templatePath/checkedPaths (lib:228-247) pick the slug-matching path, used at heading-check.mjs:49 and :57; on the real sheet the room tab resolves to /rooms/cozy-queen and the dining tab to /dining/dining-zuma; docs/reference/heading-check.md updated.
- #4 resolved: two lookups with fallback in modals.ts:268-269, roomGridHoverReveal.ts:295-296 and roomsQuiz.ts:314-315 (used at 324, 333, 342); fixture now puts a heading before each marked element and the spec asserts the marked one wins.
- #5 unresolved: docs/reference/modal-setup.md not in the delta.
- #6 unresolved: heading-check.mjs loadPages and crawl unchanged.
- #7 unresolved: crawl cap and exit code unchanged.

## Spec
none. The delta closes the partial #421 lines from round 1 (section and text matching, template tab page, shared-part baseline) and the #420 role-first lookup. Heading-check tests 25/25 pass and `pnpm check` is clean; the rooms quiz spec for #251/#284 is untouched.

## Standards
none. Module pattern and naming kept in the three src/utils edits; no em dashes in new copy or report strings.

## Verdict
ready, because both P1s and both P2s are resolved with tests and only three P3 polish items remain.
