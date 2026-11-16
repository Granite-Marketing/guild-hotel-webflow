# Implement decisions

- Run all four tickets in parallel in one frontier; alternatives: sequential; why: issue lists no blocking relations and they touch separate files (modals.ts, scrollReveal.ts, button-system.css, scroll/load modules); landed: progress/implement.md
- Do not commit dist/ changes; alternatives: commit rebuilt bundle; why: dist/** is a protected path and releasing a bundle is a non-goal; `pnpm build` is run as a gate only; landed: implementer briefs
- #176 diagnosis lives in a committed doc `docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md` for the pr stage to quote; alternatives: PR body only; why: no PR exists yet in this stage, decisions belong in committed docs; landed: t176 brief
- Symlink node_modules from the main checkout into the build tree and each worktree; alternatives: pnpm install (denied headless); why: same lockfile at same commit; symlink removed before finish; landed: worktree setup
- #179 sent back to switch the diagonals to an SVG stroke, keeping current chamfer geometry (rem for filled, % for outlined); alternatives: accept the clip-path tweak; why: implementer reported only slightly smoother, Done-when needs clean diagonals and the spec names SVG as the fallback; landed: t179
- Existing test runtime-keys-and-hash 'hash link inside an open dialog' contradicts the #178 stack; left unedited, filed follow-up #198; alternatives: edit the test; why: tests are the contract and not a gate here (Playwright is not in the manifest gates); landed: issue #198
- Accepted #179 clip-path tune instead of SVG (replaces the send-back entry above); alternatives: insist on SVG; why: measured diagonal thickness matches edges, screenshots look even, SVG would break the one-variable rule; recorded as assumption 2; landed: b80585c

## Round 2

- Reword "never reverted by hand" to "never reverted in code" in the #176 diagnosis doc; alternatives: add a check or ASSUMPTIONS row; why: it described a code rule (SplitText autoSplit), not a human step, so the wording was the only problem; landed: 8f78204
