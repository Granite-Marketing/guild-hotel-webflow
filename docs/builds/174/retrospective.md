# Retrospective: guild-hotel-webflow-build-174-spec-in-progress-feedback-code-fixes-bui#174 (2026-11-16)

tokens_or_cost: 1307k tokens across 376 tool calls in 3 session(s) (out 5251, cache read 1279k, cache write 22k, $19.82 spent so far (transcripts, subagents included), headless runs reported $5.76); stages: review 179, implement 160, validate 26, pr 11
cost_by_stage: $19.82 = implement $8.99 (sonnet-5-5 4.79+opus-5-5 4.20), review $8.43 (sonnet-5-5 4.29+opus-5-5 4.14), validate $1.27 (opus-5-5 0.89+sonnet-5-5 0.38), pr $0.65 (opus-5-5 0.42+sonnet-5-5 0.23), ? $0.47 (sonnet-5-5 0.47); run total $5.76, gap $-14.06
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (20 file(s), 999 changed line(s); full panel: 20 files > 3; 999 lines > 80)
validate_attempts: 0   review_rounds: 1   escalations: 0   follow-ups: 2
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Implement needed a second attempt (fix round 2): all four tickets were merged and validated, but the rebuilt dist bundle was not committed (git log shows a rebuild commit and a revert of it). Root cause: the dist-commit step is not part of ticket merge.
- Review round 1 was fix-first with 8 findings (4 P2, 4 P3): modal Back path lost overlay state and scroll position, a readyState check that CLAUDE.md forbids in map.ts, the outline variable only correct at 1px, one stale doc row. Residuals filed as issue 206.
- Review was the largest single cost after implement ($8.43), with a 20-file panel.

## What a hook, rule, KB entry, or skill change would have prevented
- Evidence: map.ts:293 readyState check flagged by review (P2 #3), though CLAUDE.md says "no readyState checks".
  promote-to: hook (grep gate in the implement stage for readyState, onLayoutReady and window helpers in src/utils for Webflow repos)
- Evidence: implement fix round 2 was only the uncommitted dist bundle.
  promote-to: skill (spec-build: after merging tickets in a repo whose manifest has a committed build output, run the build and commit dist before the implement gate)
- Evidence: review P2 #4, "one variable" criterion held only at 1px because stops were hard-coded.
  promote-to: rule (a ticket asking for a single shared variable must be verified at a non-default value, e.g. 2px, in its fixture)
- Evidence: review P2 #1 and #2, stack pop path missed state the push path set.
  promote-to: rule (stack or history features: write push and pop symmetry tests, covering every piece of state set on push)

## What worked and should stay
- Blind validator passed first time (0 attempts, $1.27) with 21 of 23 criteria checked, the other 2 correctly flagged as live-site only.
- Diagnosis doc, before/after screenshots at 1x and 2x, and honest assumption rows (jump-back not reproduced).
- Follow-ups filed instead of absorbed.
