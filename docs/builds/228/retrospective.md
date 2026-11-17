# Retrospective: guild-hotel-webflow-build-228-spec-mobile-feedback-code-fixes-builder#228 (2026-11-17)

tokens_or_cost: 702k tokens across 422 tool calls in 3 session(s) (out 2537, cache read 689k, cache write 10k, $19.79 spent so far (transcripts, subagents included), headless runs reported $6.24); stages: implement 202, review 186, validate 22, pr 12
cost_by_stage: $19.79 = review $8.99 (opus-5-5 4.58+sonnet-5-5 4.41), implement $8.66 (sonnet-5-5 5.18+opus-5-5 3.48), validate $1.12 (opus-5-5 0.62+sonnet-5-5 0.50), pr $0.60 (opus-5-5 0.34+sonnet-5-5 0.26), ? $0.42 (sonnet-5-5 0.42); run total $6.24, gap $-13.55
lane: spec   variant: b   packs: none   review_cap: 3   review_mode: full (30 file(s), 1378 changed line(s); full panel: 30 files > 3; 1378 lines > 80)
validate_attempts: 0   review_rounds: 1   escalations: 0   follow-ups: 3
supervisor: on   runs: 0   skipped: 0   unusable: 0   notes: 0   routine: 0   assumptions: 0   follow-ups: 0   escalations: 0

## What cost attempts or rounds
- Implement round 2: dist/ was rebuilt and committed (a6ee4b8), then restored to base (0e6664f) because it is a protected path. One wasted rebuild; rebuild deferred to #252.
- #231 sticky button: the first fix (injected stylesheet) broke the CLAUDE.md rule against bundle CSS and was redone with inline styles (8db6262); notes/231.md records why earlier attempts did not hold.
- Review round 1: verdict fix-first, 2 P2 (fade-only reveals hide form fields and FAQ rows from keyboard users; subnav reopen race leaves aria-expanded wrong) and 8 P3. Filed as residuals in #255, not fixed in this build.

## What a hook, rule, KB entry, or skill change would have prevented
- promote-to: rule. Evidence: dist rebuilt then restored (0e6664f). Tickets in repos where dist/ is protected should say "do not commit dist/" up front.
- promote-to: rule. Evidence: #231 stylesheet fix redone (8db6262). Builder briefs for Webflow repos should state "no injected CSS in the bundle; use inline styles or a Designer embed" as a ticket constraint.
- promote-to: rule. Evidence: review P2 #3, #5. Briefs for reveal and animation tickets should state "animate opacity, not autoAlpha, on form fields and interactive rows" and "kill the parent timeline on interrupt".
- promote-to: kb. Evidence: ASSUMPTIONS row 1 and review P3 #8: scroll anchoring fixes do nothing on iOS Safari; a real-iPhone live check is needed for any scroll-jump fix.
- promote-to: skill. Evidence: validate and review notes: most new visual specs load GSAP/Lenis from jsDelivr and are not in `test:factory`, so the gate does not run them. Make the visual specs self-contained.

## What worked and should stay
- Six tickets built in parallel with small merge conflicts; per-ticket notes (notes/230.md to 235.md) gave the reviewers real diagnosis evidence.
- Validate passed first try with held-out browser checks (0 attempts lost).
- Out-of-scope failure (rooms-quiz spec, fails on main) filed as #251 instead of absorbed.
