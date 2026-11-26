status: complete

- #428: commit 6abfd13 (built on the build branch directly, one ticket). Tests added: `tests/factory/video-link.test.mjs` (22 cases: every Dropbox shape incl. the spec's sample link, look-alike domain guard, unchanged YouTube/Vimeo/file values, blank links); `tests/visual/scroll-enlarge-snap-video.spec.ts` with fixture `scroll-enlarge-snap-video.{html,entry.ts}` (390 and 1440: video panel starts at the image start size with the video on the image, settles to normal size, blank and broken links keep the image-only move).

Red runs:
- factory test against unchanged `embedVideo.ts`: 9 Dropbox cases failed, the 12 unchanged-behaviour cases passed (proving they match today's output).
- look-alike guard: planted `hostname.endsWith("dropbox.com")`, the guard test went red.
- browser test: planted `return image` (pre-#428 behaviour), "a video panel starts at the image start size" failed at 390 and 1440.
- blank/broken guard: planted "settle the frame whenever it has the attribute", "blank and broken links keep the image-only panel" failed at 390 and 1440.

Checks: build-preflight, `pnpm check`, `pnpm test:factory` (62 pass), `pnpm build:check` pass. The repo has no ESLint or Prettier config, so no lint ran. Existing `scroll-enlarge-snap.spec.ts` and `media-video.spec.ts` pass except one timing test that is flaky on main too (follow-up #432).

Assumptions: rows 1 and 2 in ASSUMPTIONS.md. Designer work in the spec with no ticket (panel bindings, footer links): follow-up #433. Live pages are unchanged until that Designer work and a bundle release, so the 390/1440 check ran on the fixture.
