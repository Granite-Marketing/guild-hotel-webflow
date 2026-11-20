# Implement: spec #338

status: complete

- #339 day and night switch: merge a1dee59 (commits 657a412 tests, 21ef9fe module); tests added: tests/visual/day-night.spec.ts (9 tests x 390 and 1440 = 18, all pass); hero-on-load, line-mask-lazy-split and scroll reveal specs re-run green. `pnpm check` passes.

Assumptions recorded in docs/builds/338/ASSUMPTIONS.md: rows 1 to 6 (head snippet registration, nav button attributes, cookie scope, crossfade timing, pressed class, unsupported split modules).

## Fix round 2

- Gate failures came from the build folder missing its installed packages, not from the day and night code. Packages restored from a sibling worktree with the identical lockfile.
- `test:factory` now runs with `--experimental-strip-types` so the existing reveal-start test loads its TypeScript module on Node 22.16. Commit 71b17d2 (also refreshes dist/).
- Verified: `pnpm check` passes, `pnpm test:factory` 38/38, `pnpm build` succeeds.
