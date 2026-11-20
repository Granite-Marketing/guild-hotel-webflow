## Round 1
- ce-code-review runs full spine (hard_block_full: size_band large) with the adversarial lens in-process on Sonnet, no cross-model peer; alternatives: start Codex/other-provider peer; why: build-stage rule requires every dispatched reviewer on Sonnet and sending client code to another provider is an unattended external side effect; landed: /tmp/compound-engineering-501/ce-code-review/20261120-130814-3f8637b0
- roster: correctness, project-standards, testing, maintainability, adversarial, julik-frontend-races, learnings, all model sonnet; alternatives: fewer lenses; why: 328 exec lines, DOM event/animation races, gsap solutions corpus exists; landed: same run dir
- added #6 (no ScrollTrigger.refresh after swap) and #7 (head snippet has no install path) as P2 beyond ce-code-review's set; alternatives: leave as learnings notes; why: both are CLAUDE.md or pipeline rules (refresh rule; no hand steps) and #7 blocks a Done-when line on live; landed: docs/builds/338/review.md
- verdict fix-first; alternatives: ready; why: P1 convention break plus P2s against the no-flash and half-second criteria; landed: docs/builds/338/review.md

## Round 2
- #1 resolved via split() + onRevert hook; alternatives: unresolved pending runtime proof; why: no manual revert remains, typecheck passes, new resize test covers duplicates; landed: docs/builds/338/review.md
- verdict fix-first; alternatives: ready; why: P2s #2 #3 #4 #6 #7 untouched by the delta; landed: docs/builds/338/review.md
