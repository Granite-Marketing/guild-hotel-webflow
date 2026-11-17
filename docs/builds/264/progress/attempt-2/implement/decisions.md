# Implement decisions

- Run all six tickets in parallel; alternatives: serialise tickets touching scrollReveal; why: tickets have no blocking edges, conflicts are resolved at merge by the lead; landed: progress/implement.md
- Reuse node_modules from the build-228 checkout via symlink; alternatives: pnpm install (blocked by headless guard); why: package.json and pnpm-lock.yaml are identical to 347f932; landed: ./node_modules symlink (gitignored)
- Skip open PRs #261 (gesture slider, a non-goal) and #260 (designer docs) in this headless stage; alternatives: merge them first; why: #261 is out of scope per spec, merging client PRs is an external side effect outside an implement stage; landed: this log

## Round 2

- Commit the regenerated dist/index.js and dist/site.css; alternatives: revert them to the committed copies; why: committed dist lagged the merged sources (a fresh pnpm build reproduces the dirty copy byte for byte), so the rebuilt bundle is the correct one to ship; landed: 34469c9
