## Round 1
- ce-code-review ran full depth with in-process adversarial (no peer CLI installed), all agents on sonnet; alternatives: cross-model peer; why: no codex/grok/antigravity CLI and build guard requires sonnet; landed: docs/builds/415/review/ce-code-review.json
- Case-insensitive done for case-only changes not raised as a finding; alternatives: P2 finding; why: spec Done-when explicitly says ignore case, changing it would change what counts as passing; landed: review.md ## Spec
- Low-confidence alternates without needsConfirm dismissed; alternatives: P2; why: head rows are flagged and alternates are never published; landed: review/two-axis.md
- STAGING duplication marked manual not gated_auto; alternatives: gated_auto; why: fix touches catalogue.mjs:15, a line the diff does not touch; landed: review.md #3
- Swiper-clone done scan split out as its own P2 gated_auto; alternatives: fold into #1; why: one-word fix on a touched line; landed: review.md #2

## Round 2
- #1 judged resolved; alternatives: unresolved because the any-element fallback still runs when a named target cannot be located; why: the round-1 fix text asked exactly for that fallback on rows with no locatable target; landed: docs/builds/415/review.md ## Previous round
- Comment at copy-check.mjs:24-25 saying the fallback is "only for rows with no target" raised as P3 safe_auto; alternatives: no finding; why: the code also falls back for rows whose named target is not found, so the comment overstates the guarantee, and it is a touched line; landed: docs/builds/415/review.md #6
- #3, #4, #5 recorded unresolved at their original severities (P2 manual, P3, P3); alternatives: drop; why: the delta did not touch them and the format requires re-listing; landed: docs/builds/415/review.md ## Actionable findings
