status: done
approach: round 3: tickets already merged; fix the held-out Offers slider arrow flake (slides covering the controls after a change), restore the protected bundle, re-run specs and pnpm check.
- [x] restore dist/index.js rebuilt by the validator to base: working tree only, no commit needed
- [x] reproduce the arrow flake: scratch fixture without Swiper CSS, clicks intercepted by slides
- [x] fix: isolate the slider's stacking context: 11a8b07
- [x] offers, media-video, press specs x2 and pnpm check: 62 passed, check clean
- [x] implement.md round 3 section and report: docs/builds/317/implement.md
- [x] fix gate feedback: dist/index.js (rebuilt by a run step after commit) restored to HEAD, which equals base 6e81090; tree clean, pnpm check clean
