# Guild build decisions

Answers to ledger decision entries (D01, D02 and any later ones), recorded by the orchestrator with the date. Sessions read this file; it overrides proposals in `figma/tokens.json` and `docs/figma/components.md`.

| Entry | Date | Decision |
|---|---|---|
| Merging | 2026-10-19 | The orchestrator may merge PRs that pass verification without asking each time. Webflow writes still need Stephen's yes. |
| D01 | 2026-10-19 | Use the `figma/tokens.json` mapping: `color-primary` #A48E59, `color-secondary` #FBF5DE, `color-accent` #29310C; #CB3629 and #4A1217 get their own variables. The older set in the ledger title (#29310C / #F26849 / #906E58) is rejected. |
| D02 | 2026-10-19 | All five near-identical pairs in `docs/figma/components.md` "Check these" stay separate components: split-image-text-light / image-pair-text, gallery-captioned-grid-numbered / timeline-scatter-images, gallery-mosaic-captioned / timeline-scatter-images, split-image-text-light / image-text-centered-stack, split-image-text-dark / image-text-centered-stack. No overrides needed. |
| Q002 | 2026-10-19 | Stephen confirms Sackers Heavy Gothic, Gatch Test and Morello are uploaded to the site. |
| C01 | 2026-10-19 | `docs/figma/cms-proposal.md` approved as written (4 collections). C01 still presents the exact writes before creating anything. |
| X01 | 2026-10-19 | Probe approved: one draft page `x01-probe` and `x01-probe_` classes, deleted afterwards. The session still asks before each write and before cleanup. |
