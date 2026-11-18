status: done
approach: six independent tickets, each a Sonnet implementer in its own worktree (.claude/worktrees/t<n>, branch t<n>-264) running tdd; lead merges each into the build branch serially, then pnpm check.

- [x] read spec and tickets: docs/builds/264/issue.md (no blocking edges; all six on the frontier)
- [x] node_modules linked from build-228 checkout (same lockfile; install blocked headless)
- [x] worktrees created: .claude/worktrees/t265..t270
- [x] #265 scroll steadiness (M6, M12): 4818152
- [x] #266 dining reserve button (M21, M22): fee688b
- [x] #267 hero load animation (M23): b8994fe
- [x] #268 scroll reveals (M4, M16, M30, M39): d3953d1
- [x] #269 subnav and venue selector (M19, M18): ecc202e
- [x] #270 focus rings, tilt, directions (M11a, M26, M31b): 3751d09
- [x] merge all into build branch: 3751d09
- [x] pnpm check, implement.md, report, cleanup: docs/builds/264/implement.md, reports/implement.md, follow-up #284
- [x] fix gate feedback: committed rebuilt dist (34469c9); rebuild is reproducible, tree clean
