# Retrospective: guild-hotel-webflow-build-419-spec-heading-structure-for-seo-from-the-#419 (2026-11-26)

tokens_or_cost: 1758k tokens across 345 tool calls in 2 session(s) (out 5737, cache read 1723k, cache write 29k, $13.82 spent so far (transcripts, subagents included), headless runs reported $2.89); stages: review 176, implement 64, fix 38, visual 28, validate 27, pr 12
cost_by_stage: $13.82 = review $6.79 (sonnet-5-5 3.75+opus-5-5 3.04), implement $2.89 (sonnet-5-5 1.49+opus-5-5 1.39), fix $1.86 (opus-5-5 1.86), validate $1.03 (opus-5-5 0.66+sonnet-5-5 0.37), pr $0.46 (sonnet-5-5 0.27+opus-5-5 0.19), visual $0.40 (sonnet-5-5 0.28+opus-5-5 0.12), ? $0.40 (sonnet-5-5 0.40); run total $2.89, gap $-10.93
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (20 file(s), 905 changed line(s); full panel: 20 files > 3; 905 lines > 80)
validate_attempts: 0 (status counter; validate passed on first report)   review_rounds: 2   escalations: 0   follow-ups: 1 (#458, 3 P3 residuals)
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 5   follow-ups: 1   escalations: 0

## What cost attempts or rounds
- Review round 1 returned fix-first: two P1s in the heading check (a row passed against same-text in another section; a missing homepage baseline read as "No page differs") and two P2s (template tabs loaded the wrong room; one comma selector let an earlier heading beat the marked title). Root cause: the implement stage built to the happy path of each Done-when line and the validator's held-out checks did not probe the negative cases (wrong section, missing baseline).
- Review is 49% of spend ($6.79 of $13.82), double implement ($2.89); the fix round ($1.86) cost almost as much as the build of two tickets.

## What a hook, rule, KB entry, or skill change would have prevented
- promote-to: skill. Spec tickets for a "checker" tool should list the negative cases in Done-when (wrong section, missing baseline, wrong example page) so implement writes tests for them. Evidence: review-round-1.md findings #1, #2, #3 all negative-path gaps; the fixes added tests that "fail on the old code".
- promote-to: rule. "Role first, fallback second" lookups use two ordered `querySelector` calls, never one comma selector (a comma selector returns document order). Evidence: review-round-1.md #4, fixed in b02015c across modals.ts, roomGridHoverReveal.ts, roomsQuiz.ts.
- promote-to: skill. Reports from a check script must distinguish "nothing differs" from "could not compare"; tell implement to give every comparison an explicit "baseline missing" state. Evidence: review-round-1.md #2, fixed in 8b26428.
- promote-to: drop. Three P3 items (docs table row, duplicated crawl code, CLI exit code) went to follow-up #458; no pattern yet.

## What worked and should stay
- Two tickets (#420, #421) built on separate branches and merged cleanly (056e2e3, 5e931b5).
- Round-2 review confined to fix commits, closed all four real findings, and found nothing new.
- Fix tests were written to fail on the old code, so the fix is proven, not claimed.
- Assumptions table surfaced the five product choices (lookup classes, matching rule, what counts as a differing page) for merge instead of blocking.
