status: complete

- #416 copy map: merge 6625916; tests tests/factory/copy-map.test.mjs (27 tests: doc parsing, page matching, shared/held/notes, rooms by name, CMS items, real-docs checks). Red runs: planted notes-become-copy offender (8 tests red) and disabled shared check (shared test red), both carry MUTATION comments.
- #417 copy check: merge 39eb242; tests tests/factory/copy-check.test.mjs (17 tests: done, differs, missing, lowercased heading done, whitespace, CMS item page, listing fallback, unchecked with reason, excluded rows, report counts, browser extraction on fixtures, no-write guard). Red runs: planted Webflow PATCH call in the CLI (guard test 15 red), disabled joinedInto skip (exclusion test 11 red).
- Naming cleanup: 07e7632.
- Real runs committed: copy-map.json/.md (815 rows: 289 change, 51 same, 13 second version, 339 not on site, 118 no copy yet, 5 held; 73 shared rows on 12 elements; 160 to confirm) and copy-check.json/.md (done 91, differs 92, missing 87, unchecked 545).
- Checks: pnpm test:factory 87 pass, pnpm check green, build-preflight green, no eslint config in repo, no em dashes in the diff.
- Assumptions: docs/builds/415/ASSUMPTIONS.md rows 1 to 7.
