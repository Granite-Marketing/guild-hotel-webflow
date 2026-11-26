## Round 1
- ce-code-review ran full depth with in-process adversarial (no peer CLI installed), all agents on sonnet; alternatives: cross-model peer; why: no codex/grok/antigravity CLI and build guard requires sonnet; landed: docs/builds/415/review/ce-code-review.json
- Case-insensitive done for case-only changes not raised as a finding; alternatives: P2 finding; why: spec Done-when explicitly says ignore case, changing it would change what counts as passing; landed: review.md ## Spec
- Low-confidence alternates without needsConfirm dismissed; alternatives: P2; why: head rows are flagged and alternates are never published; landed: review/two-axis.md
- STAGING duplication marked manual not gated_auto; alternatives: gated_auto; why: fix touches catalogue.mjs:15, a line the diff does not touch; landed: review.md #3
- Swiper-clone done scan split out as its own P2 gated_auto; alternatives: fold into #1; why: one-word fix on a touched line; landed: review.md #2
