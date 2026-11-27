head: 167d068c9df4914d1a0659cc9ebbd0ae4e36853e
round: 1

## Actionable findings
- P1 #1 scripts/api/webflow/lib/heading-check.mjs:131 A row passes against a same-text element in another section: bestFit can be 0 and is still accepted, so "Book now" in the footer passes a "Rooms" row (autofix: manual) fix: when the page has any element whose section fits the row's label (learned or shared word), reject fit-0 candidates and report not found (or failed, "found in another section"); keep the fit-0 fallback only when no element on the page fits at all; add a test with the text only in another section.
- P1 #2 scripts/api/webflow/heading-check.mjs:97 Shared-part check reports "No page differs" when the homepage baseline is missing (home null, or a part has no keys), and lib/heading-check.mjs:193 ignores classes present on only one side (autofix: manual) fix: report "baseline missing, comparison not done" per part and count it in summarise; in diffSharedParts also list class keys found only on the page or only on the homepage; add tests for both.
- P2 #3 scripts/api/webflow/heading-check.mjs:77 Template tabs load only paths[0] (/rooms/guild-city-level-loft) but the template row matches on its example ("Cozy Queen"), so the room H1 row can never pass (first run shows "failed, found P") (autofix: gated_auto) fix: for template tabs pick the listed path whose slug matches the first template row's example text, falling back to paths[0]; use the same pick at line 87 and in docs/reference/heading-check.md.
- P2 #4 src/utils/modals.ts:84 One comma selector returns the first match in document order, so an h1 to h6 before the marked title wins; docs and the ticket promise class or data attribute first, headings as fallback. Same at src/utils/roomGridHoverReveal.ts:28 and src/utils/roomsQuiz.ts:41 (autofix: gated_auto) fix: two lookups, e.g. modal.querySelector('[data-modal-title], .overlay-detail-panel-modal_heading') ?? modal.querySelector('h1, h2, h3, h4, h5, h6'), same shape at roomGridHoverReveal.ts:45 and roomsQuiz.ts:103/128/282; add a fixture case with a heading before the marked title in tests/visual/fixtures/heading-tags-420.html.
- P3 #5 docs/reference/modal-setup.md:31 `data-modal-title` is only in a prose bullet, not a row of the attribute table at lines 20-24 (autofix: manual) fix: add an optional row "Dialog title (any tag) | `data-modal-title` on the title element".
- P3 #6 scripts/api/webflow/heading-check.mjs:57 loadPages copies copy-check's worker pool and lines 45-55 re-implement where-used's crawl (autofix: manual) fix: give copy-check's loadPages a loader argument and export the crawl from where-used.mjs, then call both here.
- P3 #7 scripts/api/webflow/heading-check.mjs:47 The crawl stops at 400 pages without a warning and the CLI exits 0 whatever the result (autofix: manual) fix: note in the report when the queue was not empty at the cap; set process.exitCode = 1 when rows fail, are not found, pages fail to load or shared parts differ.

## Spec
- #421 "Each row is passed ... or failed with the tag found, or not found" and "matches each row to its element by section and text": partial, see #1 (section is a ranking, not a requirement, so wrong-section matches pass) and #3 (room tab H1 row checked on the wrong room).
- #421 "reporting any page whose footer, booking and newsletter band, offers slider or FAQ tags differ from the homepage's": partial, see #2; parts are also keyed on four hard-coded `section_` class names, so a renamed class silently drops that part from the comparison.
- #420 "the title is found by its role in the pop-up's markup (class or data attribute), with the current heading lookup kept as a fallback": implemented as a single selector, so the role lookup is not first when a heading precedes it (#4).
- #420 "Each case has a Playwright test on a fixture page beside the existing modal, room and rooms quiz specs": one new spec and fixture next to them rather than a case in each existing spec; acceptable placement. Rooms quiz spec (#251, #284) untouched, as required.
- #420 "Typecheck and the bundle build pass": `pnpm check` clean; build not run in review (validator's job).
- #421 tests: pass, fail, not found, repeated text, wrapped logo, counts and uncovered list are covered and run in `pnpm test:factory` (131 pass). Real sheet parses to 19 tabs and 681 rows. Never-writes-to-Webflow is guarded by a source-scan test.
- No behaviour nobody asked for beyond support tooling (CLI flags, link crawl, docs).

## Standards
- CLAUDE.md "Shared changes reach every page": `data-modal-title` and the two new class contracts are not in docs/reference/where-used.md. No page uses the attribute yet, so this is due with the Designer tickets, not here; flagged so it is not missed.
- CLAUDE.md module pattern, naming, GSAP and visibility rules: honoured in the three src/utils edits. No em dashes in new copy or error strings.
- CLAUDE.md "Record learnings": the tag-independence rule went into docs/reference/runtime-modules.md, not docs/solutions/; acceptable as a reference doc.
- No .changeset in the diff for the src/utils edits; release is out of scope for review but needed before staging (CLAUDE.md deploy).

## Build vs buy lens
none. The CSV reader (lib/heading-check.mjs parseCsv) is hand-rolled, but no CSV library is approved or already in the repo, so it is not a library-covered capability.

## Verdict
fix-first, because two confirmed P1s let the heading check report green while staging is wrong (wrong-section matches pass, and a missing homepage baseline reads as "No page differs").
