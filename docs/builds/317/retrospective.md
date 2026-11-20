# Retrospective: peaceful-satoshi-8f0eaf-build-317-spec-cms-and-component-cleanup-every-pag#317 (2026-11-20)

tokens_or_cost: 158944k tokens across 741 tool calls in 10 session(s) (out 191k, cache read 158147k, cache write 606k, $106.82 spent so far (transcripts, subagents included), headless runs reported $8.11); stages: implement 406, validate 145, review 145, visual 28, pr 17
cost_by_stage: $106.82 = implement $67.94 (opus-5-5 61.84+sonnet-5-5 6.10), validate $20.42 (opus-5-5 19.08+sonnet-5-5 1.34), review $9.59 (opus-5-5 5.91+sonnet-5-5 3.68), ? $5.86 (sonnet-5-5 5.86), visual $1.68 (opus-5-5 1.50+sonnet-5-5 0.18), pr $1.34 (opus-5-5 1.05+sonnet-5-5 0.28); run total $8.11, gap $-98.72
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (15 file(s), 770 changed line(s); full panel: 15 files > 3; 770 lines > 80; deletes src/utils/sectionVideo.ts)
validate_attempts: 0   review_rounds: 1   escalations: 0   follow-ups: 2
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Implement ran 6 fix rounds ($67.94, two thirds of spend). Round 1-2: no `node_modules` in the worktree, so a global old TypeScript ran and gates failed for environment reasons, not code.
- Round 3: held-out Offers test flaked; root cause slides stacked above arrows; one-line `isolation: isolate` fix.
- Rounds 3-6: `pnpm check` failed on the validator's held-out Node files under `src`; builder may not touch them; resolved by narrowing tsconfig include.
- Rounds 2, 4, 6: rebuilt `dist/index.js` repeatedly dirtied the tree; dist is protected and ships at release, so it was restored to base, then re-committed once drifted.

## What a hook, rule, KB entry, or skill change would have prevented
- Worktrees start with no dependencies, which caused the round 1-2 gate failures. Seed `node_modules` from a sibling worktree with an identical lockfile at worktree creation. promote-to: hook
- Held-out validator files sit inside `src` and break the builder's typecheck and tree-clean gate (rounds 3-6). Write held-out checks outside the repo tree or in an ignored folder. promote-to: skill
- The gate and the protected `dist/` rule collide: tests need a rebuild, the rebuild dirties the tree (rounds 2, 4, 6). Have the gate build into a scratch dir or ignore `dist/` in the dirty-tree check. promote-to: hook
- Visual stage captured deployed staging, not the branch, so the new behaviour was never seen visually. For code-only specs, skip visual capture or point it at a local fixture page. promote-to: skill
- Cost report gap of -$98.72 between transcripts and headless runs: the figure is not reliable for judging a build. promote-to: drop

## What worked and should stay
- Three tickets built in parallel with no blocking edges; each merged cleanly.
- Blank-slate validator found a real flaky bug (z-index stacking) that the builder's own tests missed.
- Review caught two real defects (empty-list controls, hero video hiding the zoom) and filed the rest as one residuals issue (#354) instead of absorbing scope.
