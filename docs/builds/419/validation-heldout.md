head: 8b2642875d83b5ddfe0920d8a0d23531ae3ff90c
verdict: pass
attempt: 1

| Done-when | Check | Result | Failure message |
|---|---|---|---|
| #420 dialog title paragraph named by role, heading fallback | Playwright spec, 6 of 6 pass; dialog tests fail on old code | pass | |
| #420 room grid hover reveal with paragraph name | Playwright spec test 3 passes (fails on old code) | pass | |
| #420 rooms quiz focuses paragraph heading | Playwright spec test 4 passes (fails on old code) | pass | |
| #420 script reveal and line mask on div/p/h2/h3 | Playwright tests 5 and 6 pass; they also pass on old code (already true: modules already include p) | pass | |
| #420 Playwright tests beside existing specs; #251/#284 untouched | tests/visual/heading-tags-420.spec.ts added; no existing spec in diff | pass | |
| #420 typecheck and bundle build | pnpm check exit 0; pnpm build:check wrote .build-check/index.js | pass | |
| #421 matching by section and text, repeated texts in order | held-out node test 1: 2 of 2 pass (passed/failed statuses, repeated Stay) | pass | |
| #421 passed/failed with tag found/not found, wrapped logo | held-out node test: statuses passed, failed(foundTag h2), passed, not-found; logo row matched | pass | |
| #421 H1/H2/H3 counts and uncovered list | counts.h1.found == 1; uncovered contains "Extra" | pass | |
| #421 shared parts diff vs homepage | diffSharedParts returned 1 entry, part "footer" | pass | |
| #421 never writes to Webflow | shell check: 0 write markers in 4 files; script registered in package.json | pass | |
| #421 tests with fixtures run in factory command | pnpm test:factory: 139 pass, 0 fail | pass | |
| new tests fail before the change | old-code run: 4 of 6 Playwright tests fail, heading-check test fails on missing module; the 2 passing are already-true guards | pass | |
