head: 0e607c66de155acd45513a309fc966f5053a874d
round: 1

## Actionable findings
- P1 #1 src/utils/splitRegistry.ts:24 splitRegistry manually calls revert() on autoSplit SplitText instances, against CLAUDE.md "Never call `.revert()` manually when `autoSplit: true`" (autofix: manual) fix: swap the text without a manual revert and let autoSplit re-split (or recreate via a path that never reverts an autoSplit instance); prove no duplicate lines after Night, Day, Night and after a resize with the fixture hero
- P2 #2 docs/reference/site-head/day-night.css:2 Head CSS does not hide an element that has one non-empty and one empty night attribute (e.g. night text plus empty night link), so day content flashes on a night load (autofix: gated_auto) fix: one comma-separated selector per attribute, each `[data-night-x]:not([data-night-x=""])`, matching the module's `.some()` rule; add a mixed empty/non-empty fixture element to the no-flash test
- P2 #3 src/utils/dayNight.ts:219 Crossfade `overwrite: true` kills other modules' pending reveal tweens on tagged elements and the closing `clearProps: 'opacity,visibility'` (line 237) wipes their hidden start state (autofix: gated_auto) fix: use `overwrite: 'auto'` (or kill only the module's own fade) and fade back to each target's pre-fade opacity instead of clearProps; add a fixture with a tagged element that also has a pending scroll reveal
- P2 #4 src/utils/dayNight.ts:228 Fade-in waits on every tagged image, so an offscreen lazy image holds the visible content hidden for the full 1.2s IMAGE_WAIT_MS and the switch runs well past half a second (autofix: gated_auto) fix: await only images intersecting the viewport (or force swapped images eager), optionally lower IMAGE_WAIT_MS
- P2 #6 src/utils/dayNight.ts:226 No `ScrollTrigger.refresh(true)` after a switch, though a swap changes text length and image size; CLAUDE.md: "For a deliberate, discrete content-size change ... call `ScrollTrigger.refresh(true)` inline" (autofix: gated_auto) fix: call `ScrollTrigger.refresh(true)` once after the content is applied (after image wait, both the faded and the reduced-motion path)
- P2 #7 docs/reference/runtime-modules.md:1306 The no-flash head snippet only ships if someone pastes `day-night-head.js` into the site head; nothing registers or checks it, so the "no day flash on a night load" criterion fails on the live site until then (autofix: manual) fix: register the snippet through the Webflow scripts API with a script (or ship a preflight check that proves it is in the head) instead of a paste instruction
- P3 #5 src/utils/dayNight.ts:209 Pressing the other button mid-crossfade snaps targets to full opacity (finishNow clearProps at line 200) before the new fade-out (autofix: gated_auto) fix: in finishNow only `gsap.killTweensOf(targets)` and let the next tween start from the current opacity
- P3 #8 src/utils/dayNight.ts:131 swapVideo writes inline position and size styles from JS (lines 131, 140) and leaves the day media playing under the night player without waiting for it to be ready (autofix: gated_auto) fix: move overlay rules to day-night.css under `[data-night-player]`, pause day video while night plays, fade in on the player's ready promise
- P3 #9 package.json:13 `test:factory` change to `--experimental-strip-types` is unrelated to the day and night spec (autofix: advisory) fix: keep only if the build gate needs it and say so in the PR body, else split it out
- P3 #10 tests/visual/day-night.spec.ts:230 Line-mask check after a switch reads the text only, not that the lines animate; scriptReveal re-split is untested (line 194) (autofix: manual) fix: sample transforms of the masked heading's lines after Night and assert movement then rest; add a scriptReveal heading to the fixture

## Spec
- "DN1: on a night load no day text or image is visible before the night content appears": partial. The head CSS hole (#2) lets mixed-attribute elements flash day, and the live path depends on a head paste nothing performs (#7). The test inlines CSS and snippet, so it does not prove the shipped path.
- "DN4: content crossfades in about half a second": partial. Fade-out, swap, fade-in can stretch to about 1.45s with an offscreen lazy image (#4); the timing test measures only a heading.
- "DN1: pressing Night swaps text, image, video and button link": video is laid over the day media rather than swapped; day media keeps playing underneath (#8).
- "DN1: the hero text reveal and line masks still animate correctly after a switch, with no duplicated lines": met in the fixture for the hero, text-only for line masks (#10), and built on a manual revert the repo forbids (#1). scrollTextReveal and swiperSliders split text is not tracked (documented as "do not tag").
- Constraint "a one-year cookie on the site's domain": host-only cookie (no Domain), documented; fine unless www and the bare domain both serve.
- Behaviour nobody asked for: package.json test script change (#9); is-day class, data-night-sizes and the 3s CSS fail-safe are small and defensible.
- DN2, DN3 and the reload/next-page cookie criteria look implemented and tested.

## Standards
- CLAUDE.md SplitText rule "Never call `.revert()` manually when `autoSplit: true`" broken at src/utils/splitRegistry.ts:24 (#1, P1).
- CLAUDE.md ScrollTrigger.refresh rule (discrete content-size change calls `refresh(true)`) not followed after a switch (#6).
- CLAUDE.md / gsap-module-conventions rule 5 (state through classes, not inline styles from JS): inline styles in swapVideo (#8), judgement call.
- gsap-module-conventions rule 4 (toggle only the non-default class): dayNight.ts:178-179 toggles both is-night and is-day; judgement call, no finding.
- Complies: autoAlpha, named export called first in Webflow.push, bundled day-night.css scoped to runtime state (designer-visible-css rule 5), head snippet 125 characters under the 2,000-character inline cap.

## Build vs buy lens
none (no approved libraries declared; the cookie read/write and attribute swap are a few lines with no library equivalent in the canon)

## Verdict
fix-first: one P1 convention break (manual revert on autoSplit SplitText) and P2 gaps that undermine the no-flash and half-second crossfade criteria on the live site.
