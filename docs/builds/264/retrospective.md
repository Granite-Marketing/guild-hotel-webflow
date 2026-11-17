# Retrospective: guild-hotel-webflow-round-build-264-spec-mobile-feedback-round-all-41-items-#264 (2026-11-17)

tokens_or_cost: 1760k tokens across 267 tool calls in 2 session(s) (out 7283, cache read 1726k, cache write 27k, $12.99 spent so far (transcripts, subagents included), headless runs reported $3.83); stages: implement 142, visual 44, review 38, validate 31, pr 12
cost_by_stage: $12.99 = implement $6.96 (opus-5-5 4.08+sonnet-5-5 2.88), review $2.66 (opus-5-5 2.21+sonnet-5-5 0.46), validate $1.37 (opus-5-5 0.90+sonnet-5-5 0.47), visual $1.03 (sonnet-5-5 0.70+opus-5-5 0.33), pr $0.61 (opus-5-5 0.35+sonnet-5-5 0.26), ? $0.35 (sonnet-5-5 0.35); run total $3.83, gap $-9.16
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (21 file(s), 747 changed line(s); full panel: 21 files > 3; 747 lines > 80)
validate_attempts: 0   review_rounds: 1   escalations: 0   follow-ups: 3
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Review round 1 verdict was fix-first: M12 chevron alignment had no fix or check in the tree, and M23 pre-bundle zoom ignored reduced motion. Root cause: the done-when lines were not each mapped to a concrete change or test during implement (review-round-1.md #4, #5).
- Validation passed 14 of 14 but only by reading source; no browser run. Visual capture ran against staging where the unreleased bundle is not live, so 9 items (M6, M18, M19, M21, M22, M16, M12 mask, M26) were unprovable (reports/validate.md, reports/visual.md).
- Three follow-ups filed: stale Playwright specs on main (#284), dist rebuild at release (#286), review residuals (#290).

## What a hook, rule, KB entry, or skill change would have prevented
- promote-to: skill. Implement stage should list every Done-when item with its change or test before finishing, so gaps like M12 are caught before review (evidence: review-round-1.md P2 #4).
- promote-to: rule. Any animation touching pre-bundle CSS must wrap in `prefers-reduced-motion: no-preference` when the Done-when says reduced motion is respected (evidence: review-round-1.md P2 #5).
- promote-to: skill. Visual stage for Webflow repos with a protected dist/ should capture from a local build of the branch, not published staging, or its capture proves nothing for unreleased code (evidence: reports/visual.md, 9 items unprovable).
- promote-to: kb. Module docs (runtime-modules.md) go stale whenever a runtime module changes; ticket template should name the doc to update (evidence: review-round-1.md P3 #6).

## What worked and should stay
- Per-ticket merge into the build branch, with specs added per ticket, gave a clean history.
- Restoring dist/ to base and filing the rebuild as a release follow-up avoided a protected-path conflict.
- Total cost $12.99 for 14 items across 5 tickets, one review round, zero validate retries.
