# Retrospective: wonderful-robinson-406348-build-427-spec-hexagon-panel-video-from-dropbox-fo#427 (2026-11-26)

tokens_or_cost: 15203k tokens across 182 tool calls in 4 session(s) (out 34k, cache read 14861k, cache write 308k, $6.62 spent so far (transcripts, subagents included), headless runs reported $2.59); stages: implement 86, review 42, validate 32, visual 12, pr 10
cost_by_stage: $6.62 = implement $2.59 (opus-5-5 2.59), review $2.22 (opus-5-5 1.48+sonnet-5-5 0.73), validate $0.74 (opus-5-5 0.59+sonnet-5-5 0.15), pr $0.45 (sonnet-5-5 0.23+opus-5-5 0.22), ? $0.38 (sonnet-5-5 0.38), visual $0.23 (sonnet-5-5 0.17+opus-5-5 0.06); run total $2.59, gap $-4.03
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (8 file(s), 370 changed line(s); full panel: 8 files > 3; 370 lines > 80)
validate_attempts: 1   review_rounds: 1   escalations: 0   follow-ups: 3
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Validation: passed first attempt (7 of 7). No failed round.
- Review round 1: verdict ready with two P3s (panel text could zoom if the video link sits on the whole panel; init order undocumented). No fix round was needed.
- Visual round 1: capture hit staging, which has no panel with a video link, so the new behaviour was never seen on screen.
- Review: the cross-model peer check was blocked by the permission classifier; a local Sonnet reviewer stood in.

## What a hook, rule, KB entry, or skill change would have prevented
- The visual stage captured a page with no video panel, so it proved nothing for the main change (visual-review-round-1.md). promote-to: skill. Have the visual stage detect "no fixture in the captured page" and capture the branch's own fixture page, or skip itself with a clear note.
- Designer work (video fields, footer links) was not covered by any ticket and became follow-up #433 after the build (followups.md). promote-to: skill. to-tickets should add a Designer ticket whenever a spec needs new props or fields.
- Review stage tried sending code to an outside model and was blocked (review report). promote-to: rule. Drop the cross-model lens in spec-build review unless pre-approved, saving the retry.
- Flaky older test failed about half the runs on main too (#432). promote-to: kb. Note known-flaky tests so builds do not spend time diagnosing them.

## What worked and should stay
- One ticket, one pass: validate passed first time, 9 new tests failed on old code as they should.
- Filing out-of-scope items as follow-ups (#432, #433, #437) instead of absorbing them.
- Rejecting a spurious reduced-motion finding with a logged reason.
