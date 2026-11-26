head: 07e76320addcd9c9f963b8ac641939618ab45d93
round: 1

## Actionable findings
- P1 #1 scripts/api/webflow/lib/copy-check.mjs:64 Copy check reports done when the new text sits in any element on the page, not the row's target (autofix: manual) fix: in locateOnPage resolve the target first (by current text, then by tag/section/liveOrder) and return done only when that element's text equals newText; when the text is only elsewhere return differs (or a distinct "elsewhere" status the loop does not count as done), keep the any-element match only for rows with no locatable target, and add a fixture test where the new text is on another element while the target still shows old text (today Guild-Neighborhood:55 reads done while its h2 still says "dining around the guild").
- P2 #2 scripts/api/webflow/lib/copy-check.mjs:64 The done match scans `elements`, so slider clones count, contrary to the header comment "clones made by the slider are never used" (autofix: gated_auto) fix: use `usable` instead of `elements` on line 64.
- P2 #3 scripts/api/webflow/copy-check.mjs:18 Staging URL duplicated from catalogue.mjs:15, kept in sync only by a comment (autofix: manual) fix: export STAGING from lib/catalogue-helpers.mjs and import it in catalogue.mjs and copy-check.mjs.
- P3 #4 tests/factory/copy-map.test.mjs:568 Real-data tests pin exact catalogue item names and counts, so a catalogue refresh turns the factory suite red with no code change (autofix: manual) fix: keep the structural assertions (matched + unmatched = 14, nothing created, held rows are the five C3 pages by path) and drop the hardcoded item-name list.
- P3 #5 scripts/api/webflow/lib/copy-map.mjs:771 Bare `usedFor(config.templatePage)` (and line 779) is called only for its side effect of registering the page for the "no copy yet" sweep (autofix: manual) fix: add a one-line comment or rename to a registerPage helper so it is not deleted as dead code.

## Spec
- All Done-when lines for #416 and #417 are met in code and in the committed outputs, except the #417 line "compares each row's target with its new text": the done test does not look at the target (finding #1), so the report can show a row done that is not.
- Case-only changes (about 40 rows, e.g. "discover more" to "Discover More") read done with nothing written. This follows the spec's wording ("ignoring case and whitespace differences (the CSS lowercases headings)"), so it is not raised as a finding; Stephen should know the live loop will skip them.
- Behaviour beyond the spec: "shared" also flags CMS template rows (sharedReason "template"), and "unchecked" covers joined, duplicate, second-version, not-on-site, no-copy-yet and held rows (545 rows, each with a reason), not only CMS rows with no page. Both are reasonable; the counts mix meanings.
- The three rows below the confirm threshold without needsConfirm are second-version alternates whose head rows are flagged; not a gap.

## Standards
- No canon or CLAUDE.md violation found: no em dashes in code, tests or outputs; no new dependency (Playwright already present); browser runs headless; no Webflow writes (guarded by a test); full descriptive identifiers in the new modules.
- Judgement call only: the duplicated staging constant (finding #3).

## Build vs buy lens
none (Playwright is reused for page loading; doc parsing is bespoke to the client's export format and no approved library covers it).

## Verdict
fix-first: the copy check can report a row done while its own element still shows the old text, and the live ticket loops on that status to decide what is uploaded.
