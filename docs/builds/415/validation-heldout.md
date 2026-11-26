head: ee3754a4f92a44da1fa3afb54ef1a416c27947a9
verdict: pass
attempt: 1

Known-red on base: none (base factory tests pass). HEAD factory tests: 93 pass. Held-out run: 23 checks, 23 pass. One held-out check was rewritten after the latest fix: a row whose target still shows old text now counts as differs even when the new text sits on another element (correct per criterion); the check now puts the new text on the target itself.

| Done-when | Check | Result | Failure message |
|---|---|---|---|
| #416 map and summary beside catalogue, all 20 docs | copy-map.json/md present; docs list equals the 20 source docs; every doc has rows | pass | |
| #416 row fields | every row has page, doc, line, kind (from allowed set), target, current, new text, status; props carry instance and property id; CMS rows carry item and field | pass | |
| #416 C1 first version | Homepage first version row has the "Spirited History" version in alternates; fixture with "or" keeps first as new text | pass | |
| #416 writer notes | 100+ notes recorded (handwriting, Cutline on photo, stopping here, stats, Next text block); none became new text; fixture drops them; script headings flagged | pass | |
| #416 heading case | "KEY FEATURES" and "A LANDMARK REIMAGINED" kept as in doc | pass | |
| #416 rooms by name | 9 matched, names equal; unmatched listed in md | pass | |
| #416 venue, dining, legal own CMS items | 4+ collections, 20+ distinct items, Zuma and Meetings-Modals rows have CMS items | pass | |
| #416 shared fixed text | fixed rows shared exactly when the catalogue says the component is on more than one page; fixture with a two-page component lists both pages; 73 shared rows listed | pass | Real data: all 14 fixed rows sit in single-page components, so none is shared; consistent with the catalogue |
| #416 no copy yet and held | 118 no-copy-yet rows; held pages are /contact plus the four wellness sub-pages | pass | |
| #416 low confidence to confirm | no change row under 0.5 confidence lacks needsConfirm; 50+ rows to confirm each with a reason | pass | |
| #416 tests in factory command | pnpm test:factory runs 87 tests, all pass | pass | |
| #417 compare ignoring case/whitespace | fixtures: "WELCOME   home" and lowercase heading both done | pass | |
| #417 done/missing/differs with counts by page | statuses [done, done, differs, missing], counts per page, report md has per-page sections; committed check covers all 815 rows | pass | |
| #417 CMS item page, listing, unchecked with reason | itemPath preferred, listing fallback, none gives unchecked with reason | pass | |
| #417 never writes to Webflow | CLI runs on saved pages; source has no webflow API host, write method or token | pass | |
| #417 fixture tests | tests/factory/copy-check.test.mjs runs in the factory command | pass | |
| new tests fail before the change | both new test files import lib modules that do not exist on base | pass | |
