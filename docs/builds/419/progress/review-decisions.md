## Round 1
- ce-code-review ran full depth with six Sonnet reviewers; adversarial in-process; alternatives: cross-model peer; why: no different-provider CLI installed, and the build rule pins Sonnet; landed: docs/builds/419/review/ce-code-review.json
- #1 and #2 rated P1 (manual); alternatives: P2; why: each lets the check go green while a Done-when line is unmet; landed: docs/builds/419/review.md
- #3 and #4 gated_auto; why: fixes stay on lines the diff touches; landed: docs/builds/419/review.md
- where-used gap logged as Standards note, not a finding; why: no page uses data-modal-title until the Designer tickets; landed: docs/builds/419/review.md Standards
- Could not restore 18 fixture PNGs under docs/figma/build-plans/Q006-Q009 rewritten by a reviewer's pnpm test:factory run (git checkout denied by the permission classifier); reported, not worked around; landed: docs/builds/419/reports/review.md
## Round 2
- #5, #6, #7 (P3) re-listed as unresolved, verdict ready; alternatives: fix-first; why: only P3s remain, none leave a Done-when line unmet; landed: docs/builds/419/review.md
- Ran only the heading-check test file and tsc, not pnpm test:factory; alternatives: full factory run; why: round 1's full run dirtied the tree and a reviewer may not edit; landed: docs/builds/419/progress/review.md
