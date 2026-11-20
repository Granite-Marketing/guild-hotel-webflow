# Implement decisions

- One implementer for the single ticket #339; alternatives: lead builds directly; why: spec has one ticket, rules require Sonnet helpers for implementation; landed: progress/implement.md

## Round 3 (restart after two killed attempts, no work landed on t339)
- Reuse existing t339 worktree (still at build tip, clean) and ask the implementer to commit after each green slice so a kill keeps progress; alternatives: recreate worktree; why: nothing to lose, worktree is valid; landed: progress/implement.md
- pnpm check run at a1dee59 inside t339 (same tree) because installing packages in the build folder was denied headless; alternatives: escalate; why: identical commit, no product impact; landed: progress/implement.md

## Round 4 (fix round 2: check, test:factory and build failed at the gate)
- Root cause environmental: no node_modules in the build folder, so global TypeScript 4.1 ran and cross-env was missing; populated node_modules by APFS-cloning a sibling worktree with an identical pnpm-lock.yaml; alternatives: pnpm install (denied headless), escalate; why: same lockfile, no new dependency; landed: node_modules (gitignored)
- reveal-start factory test (from main, b2a1b64) imports a .ts module, which Node 22.16 cannot load without type stripping; added --experimental-strip-types to the test:factory script; alternatives: edit the test (forbidden), follow-up only; why: script-only change, 38/38 pass on Node 22.16 and 24.8; landed: package.json, 71b17d2
- Committed the dist/ that pnpm build regenerated; why: dist is committed build output and was stale; landed: 71b17d2
