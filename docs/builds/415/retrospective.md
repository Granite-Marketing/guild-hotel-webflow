# Retrospective: guild-hotel-webflow-build-415-spec-copy-upload-from-the-client-s-conte#415 (2026-11-26)

tokens_or_cost: 1210k tokens across 341 tool calls in 2 session(s) (out 3971, cache read 1181k, cache write 26k, $15.54 spent so far (transcripts, subagents included), headless runs reported $6.31); stages: review 179, implement 103, validate 37, fix 13, pr 9
cost_by_stage: $15.54 = review $6.41 (sonnet-5-5 3.53+opus-5-5 2.88), implement $6.31 (sonnet-5-5 4.78+opus-5-5 1.52), validate $1.29 (opus-5-5 0.65+sonnet-5-5 0.64), fix $0.75 (opus-5-5 0.75), pr $0.41 (sonnet-5-5 0.22+opus-5-5 0.18), ? $0.37 (sonnet-5-5 0.37); run total $6.31, gap $-9.23
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (21 file(s), 45433 changed line(s); full panel: 21 files > 3; 45433 lines > 80; risky content `assert.deepEqual(offences("await fetch('https://api.webflow.com/v2/pages/1', { m`)
validate_attempts: 2   review_rounds: 2   escalations: 0   follow-ups: 1
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Review round 1 (P1): the copy check marked a row done when the new text sat in any element on the page, not the row's own target (Guild-Neighborhood:55 read done while its heading still showed the old text). Root cause: the done test ignored the target; slider clones also counted. Fixed in the fix stage ($0.75), round 2 clean.
- Validation needed a second pass: one held-out check was stale after the review fix (target with old text now "differs"). Root cause: validator ran against code that the fix stage then changed semantics of.
- Review was the largest stage ($6.41) because 45k changed lines (committed catalogue and map outputs) forced the full panel.

## What a hook, rule, KB entry, or skill change would have prevented
- Evidence: round 1 P1 above. promote-to: rule. Any status checker ("done/missing/differs") must be tested with a fixture where the expected text exists elsewhere while the target is stale.
- Evidence: round 1 P1 and P3 #4 (real-data tests pin catalogue item names). promote-to: rule. Tests that read committed generated data assert structure, not exact names or counts.
- Evidence: review mode note (45433 lines). promote-to: skill. spec-build review sizing should exclude generated output files so the panel is chosen by hand-written lines.
- Evidence: P2 #3 duplicated staging URL (follow-up #444). promote-to: drop (minor, filed).

## What worked and should stay
- Splitting the spec into #416 and #417 with merge commits per ticket; both landed with 93 tests and 17 of 17 Done-when passing.
- The blind reviewer caught a real logic flaw the builder's own tests missed.
- Assumptions table gave Stephen concrete merge questions with numbers.
