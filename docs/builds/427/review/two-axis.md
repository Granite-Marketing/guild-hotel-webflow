# Two-axis review, round 1 (head 6abfd13)

## Standards
No hard violations. Module pattern, naming, GSAP rules (CLAUDE.md "Custom Code Delivery", gsap-module-conventions.md) conform; cross-module import is a plain TS import as CLAUDE.md allows; docs updated in the same commit.
Judgement calls:
1. Init order undocumented: scrollEnlargeSnap.ts itemSettleTarget relies on mediaVideo() running after scrollEnlargeSnap() (src/index.ts 132 then 140); runtime-modules.md promises each module's required init order but the new mediaVideo lines do not state it.
2. embedVideo.ts:4 doc-comment line overlong (cosmetic, skip).
3. Issue-number comment tags are consistent with the repo.
4. Docs do not say the panel item must clip the scaled frame's overflow.

## Spec
(a) Link reader: every Done-when shape covered by tests/factory/video-link.test.mjs; YouTube, Vimeo, file pinned unchanged. pnpm test:factory 62/62, pnpm check clean.
Partial (lead re-checked, not a defect): reviewer claimed reduced motion scales the frame on a panel with a link; under reduced motion the timeline jumps to rest (scale 1) for frame and image alike, so the visible result is unchanged.
(b) Not asked for, harmless: dl.dropbox.com host; Playwright fixture and spec (extra coverage); exported FRAME_SELECTOR and hasVideoLink (needed).
(c) Possibly wrong: the settle scales the whole [data-video-link] frame; item.contains(frame) is true when the frame is the item itself, so a misplaced attribute scales the panel content and shares the element with the clipPath tween. Frame-level styling (border, radius) would also scale.
