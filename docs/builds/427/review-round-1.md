head: 6abfd13ace207e9f3eecc61b8f4b33f627832a0e
round: 1

## Actionable findings
- P3 #1 src/utils/scrollEnlargeSnap.ts:440 Settle target becomes the whole panel when data-video-link sits on the item or a wrapper that holds the panel content (`item.contains(frame)` is true for the item itself) (autofix: gated_auto) fix: settle the frame only when `frame !== item` and `!frame.querySelector('[data-scroll-enlarge-snap-content]')`, else fall back to the image.
- P3 #2 docs/reference/runtime-modules.md:505 Hexagon panel note does not state that scrollEnlargeSnap must init before mediaVideo, which the settle relies on (autofix: safe_auto) fix: add one sentence to the new hexagon-panel bullet naming the required order (scrollEnlargeSnap, then mediaVideo, as in src/index.ts).

## Spec
- All #428 Done-when lines met. Link reader covers the scl/fi share link with dl=0, dl=1, raw=1, the old /s/ link and direct dl.dropboxusercontent.com links, keeping rlkey and dropping dl, raw, st (tests/factory/video-link.test.mjs, sample link included). YouTube, Vimeo and file links pinned unchanged. pnpm test:factory 62/62 and pnpm check pass (reviewer run); build:check not re-run here.
- "the video covers the frame and scales from the same start size to normal size with the image": implemented by scaling the frame; Playwright spec asserts start 1.2 and rest 1 at 390 and 1440, and blank/broken links keep the image-only move.
- Not asked for, harmless: dl.dropbox.com host support; extra Playwright fixture and spec.
- Reduced motion: checked; the timeline rests at scale 1 so frame vs image scaling looks the same, and mediaVideo injects no video. Not a defect.

## Standards
- No canon or CLAUDE.md violations. Module pattern, clean naming, GSAP rules and docs-in-same-commit all hold. Only judgement calls: init order undocumented (finding #2), cosmetic overlong comment at src/utils/embedVideo.ts:4.

## Build vs buy lens
- none. URL handling uses the platform URL API; no approved library covers more.

## Verdict
ready: every Done-when line is met and the two findings are low-risk hardening and a doc sentence.
