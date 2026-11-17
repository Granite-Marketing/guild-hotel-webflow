# Implement decisions

- node_modules symlinked from the main checkout instead of pnpm install; alternatives: install (blocked by hook); why: identical lockfile, no new deps; landed: local only, excluded via info/exclude
- All six tickets run in parallel (no blocking relations in the spec); alternatives: serialize shared-file tickets; why: overlaps (scrollReveal.ts, runtime-modules.md, index.ts) are small and resolved at merge; landed: this stage
- Implementers do not commit dist/; the lead rebuilds dist once after all merges; alternatives: each ticket commits dist; why: dist is minified output that conflicts on every merge; landed: final commit
- #231 injected stylesheet replaced with inline !important styles re-applied on refresh; alternatives: keep stylesheet; why: CLAUDE.md forbids bundle CSS; landed: 8db6262
- rooms-quiz.spec.ts:74 failure left alone and filed; alternatives: fix in this build; why: fails identically on main 179be6a, out of scope; landed: #251

## Round 2
- dist/ restored to base and not committed in this build; replaces "the lead rebuilds dist once after all merges"; alternatives: none (gate); why: dist is a protected path; landed: 0e6664f, follow-up #252
