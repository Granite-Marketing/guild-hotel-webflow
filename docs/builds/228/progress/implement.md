status: done
approach: six independent tickets built in parallel by Sonnet implementers in nested worktrees, merged into the build branch one by one; dist rebuilt once at the end

- [x] env: node_modules symlinked from main checkout (same lockfile); pnpm check and test:factory green on base
- [x] #230 scroll jumps
- [x] #231 sticky CTA
- [x] #232 hero scale-in and room gallery restore
- [x] #233 scroll reveals
- [x] #234 subnav dropdown
- [x] #235 focus rings, tilt spacing, directions
- [x] rebuild dist, pnpm check/test:factory/build on integration branch
- [x] implement.md, report, cleanup
- [x] fix gate feedback: dist restored to base in 0e6664f; rebuild filed as #252
