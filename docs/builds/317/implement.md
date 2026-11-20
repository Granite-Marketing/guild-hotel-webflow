# Implement: build 317

status: complete

- #318 shared category listing module, Press migrated: merge c9ebb33; tests: tests/visual/press-categories.spec.ts
- #319 media frame video (frames, hero, CMS items): merge 242a995; tests: tests/visual/media-video.spec.ts
- #320 Offers slider counts any number of slides: merge f3fe744; tests: tests/visual/offers-slider-split.spec.ts

Assumptions: rows 1 to 4 in docs/builds/317/ASSUMPTIONS.md.

## Fix round 2

- Gate: the diff touched the protected dist/index.js. Restored it to the base version (a6ff183). The rebuilt bundle ships at release; follow-up https://github.com/Granite-Marketing/guild-hotel-webflow/issues/348.
- pnpm check passes.

## Fix round 3

- Held-out: Offers arrows sometimes did not advance. Cause: each slide change raised the slide's stacking order with nothing containing it, so slides could cover the arrows. The slider now contains its own stacking (11a8b07). Offers, media video and Press specs pass twice over; pnpm check passes.

## Fix round 4

- Gate: tree not clean. The script bundle had been rebuilt in the working tree after the last commit. Restored it to the committed copy, which matches base; tree clean outside docs/builds, pnpm check passes. No code change.
