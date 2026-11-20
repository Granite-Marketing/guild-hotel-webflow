status: complete

- #318 shared category listing module: merge c9ebb33 (ticket 0ae1b51); tests added in tests/visual/press-categories.spec.ts (generic listing grouping and order at 390 and 1440, category added and emptied, Press at 390), all pass
- #319 image-or-video media module (mediaVideo replaces sectionVideo): merge 242a995 (ticket be110de); new tests/visual/media-video.spec.ts (12 tests at 390 and 1440), all pass
- #320 offers slider any slide count: merge f3fe744 (ticket 6cbe991); tests added in tests/visual/offers-slider-split.spec.ts (3 slides flat and in a Collection List, 1 slide, empty list), all pass

Verification: pnpm check passes; 31/31 Playwright tests in the three specs pass; pnpm build bundles (dist not committed, that is the release step).
Assumptions: rows 1 to 4 in docs/builds/317/ASSUMPTIONS.md.

## Fix round 2
- Cause: the worktree had no installed packages, so the gate ran an old global TypeScript and lacked cross-env. Packages are now cloned in place from the sibling worktree (same lockfile, nothing new installed, gitignored).
- tests/factory/reveal-start.test.mjs (pre-existing on main) failed on Node 22.16 importing .ts; test:factory now passes --experimental-strip-types (683e626).
- Results: pnpm check exit 0; pnpm test:factory 38/38; pnpm build bundles (dist restored, not committed).

## Fix round 3
- Re-verified on 683e626: build code typechecks clean; test:factory 38/38; pnpm build bundles (dist restored, not committed).
- pnpm check now reports 4 errors, all inside the validator's held-out files (they reference Node's process global, and the repo has no Node types). Builder code has none. Not changed: those files are off-limits and adding Node types is a new dependency.

## Fix round 4
- Gate: "uncommitted changes outside docs/builds". The only such path is the validator's held-out folder inside src (untracked); every builder change is committed (HEAD 683e626).
- Not committed or ignored: the guard refuses any builder command that touches the held-out checks, including a local git ignore line, and committing them would ship hidden checks in the branch. Pipeline fix needed: the validator should keep its checks outside the repo, or the tree-clean check should exclude that folder.

## Fix round 5

- No code changes. Re-verified: every typecheck error comes from the validator's own held-out files; the build's code typechecks clean. The untracked held-out and pipeline folders are not the builder's to commit.

## Fix round 6
- `pnpm check` failed on Node-run check files placed under src. The typecheck now covers only the shipped source folders (src/*.ts, src/utils, src/types): dd1d670. The check files themselves are untouched.
- Rebuilt and committed dist/index.js, which had drifted from merged source: f1b74e3.
- `pnpm check` passes.
