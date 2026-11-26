head: ee3754a4f92a44da1fa3afb54ef1a416c27947a9
round: 2

## Actionable findings
- P2 #3 scripts/api/webflow/copy-check.mjs:18 Staging URL duplicated from catalogue.mjs:15, kept in sync only by a comment (autofix: manual) fix: export STAGING from lib/catalogue-helpers.mjs and import it in catalogue.mjs and copy-check.mjs.
- P3 #4 tests/factory/copy-map.test.mjs:568 Real-data tests pin exact catalogue item names and counts, so a catalogue refresh turns the factory suite red with no code change (autofix: manual) fix: keep the structural assertions and drop the hardcoded item-name list.
- P3 #5 scripts/api/webflow/lib/copy-map.mjs:771 Bare `usedFor(config.templatePage)` (and line 779) is called only for its side effect (autofix: manual) fix: add a one-line comment or rename to a registerPage helper.
- P3 #6 scripts/api/webflow/lib/copy-check.mjs:24 Header says the any-element done fallback runs "only for rows with no target", but line 88 also runs it when a row names a tag and section that cannot be located (no current-text match, no slot match, no positional match) (autofix: safe_auto) fix: reword lines 24-25 to "no target located (none named, or the named one not found)".

## Previous round
- #1 resolved: copy-check.mjs:80-88 drops the up-front any-element done; done now needs the winning candidate (current-text match or new text on the target's tag and section, ties going to the current-text element) to show the new text; the any-element match survives only when nothing is located. New tests cover the Guild-Neighborhood shape, the nearer-old-text tie, the updated slot with old text elsewhere, case-only, and the no-target fallback (copy-check.test.mjs:48-90; 23 of 23 pass).
- #2 resolved: copy-check.mjs:88 fallback scans `usable`, and candidates are built from `usable` (line 80); test at copy-check.test.mjs:85 shows a clone with the new text yields missing / differs.
- #3 unresolved: copy-check.mjs and catalogue.mjs are not in the delta; the staging constant is still duplicated.
- #4 unresolved: copy-map.test.mjs is not in the delta.
- #5 unresolved: copy-map.mjs is not in the delta.

## Spec
none. The #417 line "compares each row's target with its new text" is now met for every row with a locatable target; the #417 test line (done, missing, differs, lowercased heading done) still holds, and no existing test was edited, only new tests added.

## Standards
none. No em dashes, no new dependency, full descriptive identifiers in the new helpers (showsCurrent, showsNew, onTargetSlot), still pure functions with no Webflow writes.

## Verdict
ready: both round-1 fix-first findings are resolved with tests, and what remains is P2/P3 housekeeping the delta did not touch.
