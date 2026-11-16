# Implement: build 174

status: complete

| Ticket | Merge commit | Tests added |
|---|---|---|
| #176 scroll freeze on load | 4c3a9d7 | fixture spec for first-input scroll and single hero reveal; diagnosis doc |
| #177 data-reveal-start | 06ec136 | tests/factory/reveal-start.test.mjs (number, missing, invalid) |
| #178 dialog stack | d3b0e71 | fixture spec for a two-level modal chain (push, pop, ESC, click outside, focus return) |
| #179 outline thickness | b80585c | fixture thickness check at 1x and 2x, before/after screenshots |

Assumptions: rows 1 to 4 in docs/builds/174/ASSUMPTIONS.md.

## Fix round 2

- Gate failed on an uncommitted rebuilt bundle. A fresh `pnpm build` reproduces it, so it is committed (e5ec9bc). `pnpm check` and `pnpm build` pass; held-out validation verdict was pass.
