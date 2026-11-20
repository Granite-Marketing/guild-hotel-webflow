# Retrospective: peaceful-satoshi-8f0eaf-build-338-spec-day-and-night-content-switch-20-nov#338 (2026-11-20)

tokens_or_cost: 98519k tokens across 646 tool calls in 5 session(s) (out 176k, cache read 97802k, cache write 541k, $134.07 spent so far (transcripts, subagents included), headless runs reported $2.05); stages: review 257, implement 210, visual 68, fix 50, validate 47, pr 14
cost_by_stage: $134.07 = implement $94.15 (opus-5-5 90.54+sonnet-5-5 3.62), review $17.36 (opus-5-5 12.05+sonnet-5-5 5.32), ? $9.66 (sonnet-5-5 9.66), fix $4.25 (opus-5-5 4.25), validate $4.15 (opus-5-5 3.75+sonnet-5-5 0.40), visual $3.14 (opus-5-5 2.54+sonnet-5-5 0.59), pr $1.35 (opus-5-5 1.00+sonnet-5-5 0.35); run total $2.05, gap $-132.01
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (19 file(s), 765 changed line(s); full panel: 19 files > 3; 765 lines > 80)
validate_attempts: 0   review_rounds: 2   escalations: 0   follow-ups: 2
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 6   follow-ups: 2   escalations: 0

## What cost attempts or rounds
- Implement attempt 1 failed its gate: the builder rebuilt `dist/index.js` and `dist/site.css`, which are protected; round 2 restored them to main and filed #358. Root cause: the repo's own rules say to rebuild dist, the gate says never.
- Review round 1 found one P1: a manual `.revert()` on an autoSplit SplitText, forbidden by the repo CLAUDE.md. Fix round cost $4.25 and round 2 confirmed it. Root cause: the rule sits deep in CLAUDE.md and the builder did not apply it.
- Implement was $94 of $134 (70%), mostly one long Opus session; the ticket was a single module plus fixtures.
- Review left 5 P2 and 4 P3 unfixed (12 residuals, issue #367), including the no-flash head CSS hole and crossfade timing with lazy images; these are Done-when lines the review marked partial.

## What a hook, rule, KB entry, or skill change would have prevented
- Evidence: implement attempt 1 gate failure on dist. Tell the implement stage up front that `dist/` is read-only and the rebuild is a release follow-up. promote-to: skill
- Evidence: review round 1 P1 on manual revert. Add the repo's hard "never" rules (SplitText revert, ScrollTrigger.refresh in handlers) as a short checklist in the implement prompt for Webflow repos. promote-to: skill
- Evidence: review P2 #7 and ASSUMPTIONS rows 1 and 2: head snippet and nav attributes need live-site registration, left as paste instructions. A preflight script that checks the head snippet and attributes would make the "no hand steps" rule hold. promote-to: rule
- Evidence: visual review could not press Night on staging, so it proved nothing about the switch. Visual stage should run the fixture pages the Playwright spec uses, as well as staging. promote-to: skill (same as the #317 candidate)
- Evidence: $9.66 of cost has no stage label ("?"). Label every session so cost_by_stage adds up. promote-to: hook

## What worked and should stay
- Held-out validator passed 7 of 7 first try (0 validate attempts).
- Blind review caught the revert rule break that implement missed.
- Fix stage was small and targeted ($4.25) and added a regression test (Night, Day, Night, resize).
- Residuals were filed as one issue, not absorbed.
