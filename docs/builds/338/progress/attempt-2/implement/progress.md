status: done
approach: one Sonnet implementer builds ticket #339 (tdd) in a nested worktree; lead merges, runs pnpm check, writes artefacts. Fix round 2: restore node_modules and make the factory test script load TypeScript on Node 22.

- [x] read spec and ticket graph (single ticket #339): docs/builds/338/issue.md
- [x] create ticket worktree t339 from build branch: .claude/worktrees/t339
- [x] implement #339 via tdd (Sonnet implementer): 657a412, 21ef9fe
- [x] merge t339 into build branch: a1dee59
- [x] pnpm check on build branch: passes at a1dee59 (run in t339 node_modules, identical tree)
- [x] clean up worktree and branch: removed t339
- [x] write implement.md, report: docs/builds/338/implement.md, reports/implement.md
- [x] fix gate feedback: node_modules cloned from a sibling worktree with the identical lockfile (install denied headless); test:factory gets --experimental-strip-types for Node 22.16; dist refreshed; check, test:factory 38/38 and build green: 71b17d2
