# Two-axis review (granite `review` skill), fixed point 8900bfdd101d400547cd4ec1439597d0517a0572

## Standards

No hard violations. Checked root CLAUDE.md, CONCEPTS.md, ~/granite/knowledge/tech-conventions.md and the global rules (no CONTRIBUTING.md, no docs/adr).

- Em dashes: none in new scripts, tests, fixtures or generated outputs (U+2014 written as a JSON escape).
- New dependencies: none; Playwright comes from the existing `@playwright/test`.
- Headless: `lib/copy-check-browser.mjs:9` launches `headless: true`.
- Webflow mutation: none; `tests/factory/copy-check.test.mjs:201` guards against non-GET and Webflow API calls.
- Clean naming: no short identifiers in the new modules (short names in catalogue.mjs are pre-existing).
- Judgement calls: `copy-check.mjs:18` duplicates the staging URL constant from `catalogue.mjs:15` (kept in sync by a comment only); generated outputs committed beside the catalogue, matching existing practice.

## Spec

OK against the outputs: 20 docs listed; every non-blank line is a row, note or alternate; rows carry page/doc/line/targetKind/target/currentText/newText/status; no writer's note in any newText; doc case kept; rooms matched/unmatched both ways; 5 held rows (Contact + 4 Wellness); tests run under `test:factory` (glob tests/factory/*.test.mjs), 46 tests pass.

(a) Missing or partial
1. "Low-confidence matches are marked for a person to confirm": 3 rows below 0.75 lack needsConfirm (Guild-Dining-Collection:4, Guild-Meeting-Collection:8, Guild-Rooms-SubPages:7). Lead check: all three are "second version listed" alternates that inherit the head row's confidence; each head row is needsConfirm=true and alternates are never published. Dismissed.
2. "marked shared, with every page": no real component-fixed row is shared (each fixed text sits on one page); covered by fixture tests.

(b) Not asked for
1. catalogue.mjs helpers moved into lib/catalogue-helpers.mjs (harmless refactor, GET-only script unchanged in behaviour).
2. `shared: true` also applied to CMS template rows (sharedReason "template", 73 shared rows mix two meanings).
3. "unchecked" used for joined, duplicate, second-version, not-on-site, no-copy-yet and held rows, each with a reason (545 rows), beyond the CMS-only case the spec names.

(c) Implemented but possibly wrong
1. `lib/copy-check.mjs:64` marks done when any element on the page equals the new text, not the row's target (confirmed false pass: Guild-Neighborhood:55).
2. The same line scans `elements`, not `usable`, so slider clones count toward done despite the header comment.
3. Case-insensitive compare means case-only changes (about 40 rows) read done with nothing written. This is the spec's own wording ("ignoring case ... the CSS lowercases headings"), so it is noted, not raised.
4. The differs fallback by tag/section/liveOrder is fragile after layout shifts.

Summary: Standards 0 hard, 2 judgement; Spec 1 real defect (done false pass), rest notes. Worst: copy check false "done".
