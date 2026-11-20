head: 6d07800be577d7a3dde5374de81546e513eb6a6f
round: 2

## Actionable findings
- P2 #2 docs/reference/site-head/day-night.css:2 Head CSS still skips an element with one non-empty and one empty night attribute (the `:not(...)` list excludes it if any attribute is empty), so it flashes day on a night load (autofix: gated_auto) fix: one selector per attribute, each `[data-night-x]:not([data-night-x=""])`, matching the module's `.some()` rule; add a mixed empty/non-empty fixture element to the no-flash test
- P2 #3 src/utils/dayNight.ts:225 Crossfade still uses `overwrite: true` (also line 236) and ends with `clearProps: 'opacity,visibility'` (line 239), killing other modules' pending reveal tweens and their hidden start state (autofix: gated_auto) fix: `overwrite: 'auto'` or kill only the module's own fade, and fade back to each target's pre-fade opacity instead of clearProps
- P2 #4 src/utils/dayNight.ts:230 Fade-in still waits on every tagged image up to IMAGE_WAIT_MS 1200 (line 46), so an offscreen lazy image stretches the switch well past half a second (autofix: gated_auto) fix: await only images in the viewport (or force swapped images eager) and lower IMAGE_WAIT_MS
- P2 #6 src/utils/dayNight.ts:228 Still no `ScrollTrigger.refresh(true)` after content is applied, though a swap changes text length and image size (CLAUDE.md ScrollTrigger.refresh rule) (autofix: gated_auto) fix: call `ScrollTrigger.refresh(true)` once after applyContent on both the faded and reduced-motion paths
- P2 #7 docs/reference/runtime-modules.md:1306 No-flash head snippet still ships only as a paste instruction; nothing registers or checks it on the live site (autofix: manual) fix: register it through the Webflow scripts API with a script, or ship a preflight that proves it is in the head
- P3 #5 src/utils/dayNight.ts:202 finishNow still clearProps targets to full opacity before the next fade-out when a button is pressed mid-crossfade (autofix: gated_auto) fix: only `gsap.killTweensOf(targets)` and let the next tween start from current opacity
- P3 #8 src/utils/dayNight.ts:133 swapVideo still writes inline position and size styles from JS (also line 142) and leaves day media playing under the night player (autofix: gated_auto) fix: move overlay rules to day-night.css under `[data-night-player]`, pause day video while night plays
- P3 #9 package.json:13 `test:factory` `--experimental-strip-types` change still unrelated to the spec (autofix: advisory) fix: keep only if the gate needs it and say so in the PR body, else split it out
- P3 #10 tests/visual/day-night.spec.ts:255 New test checks masked lines after a switch and resize by text only, still not that the lines animate; no scriptReveal heading in the fixture (autofix: manual) fix: sample transforms of the masked heading's lines after Night and assert movement then rest; add a scriptReveal heading to the fixture

## Previous round
- #1 resolved: src/utils/splitRegistry.ts:52-66 changes text inside SplitText's own `onRevert` during `instance.split()`; no manual `revert()` remains (grep finds no releaseSplit/rebuildSplit callers), and tests/visual/day-night.spec.ts:239 covers Night, Day, Night plus a resize with no duplicate lines
- #2 unresolved: day-night.css not in the delta; selector unchanged
- #3 unresolved: dayNight.ts:225/236 `overwrite: true` and :239 clearProps unchanged
- #4 unresolved: dayNight.ts:230 still awaits all tagged images, IMAGE_WAIT_MS 1200
- #5 unresolved: dayNight.ts:202 finishNow clearProps unchanged
- #6 unresolved: no ScrollTrigger.refresh anywhere in dayNight.ts
- #7 unresolved: runtime-modules.md:1306 still a paste instruction
- #8 unresolved: dayNight.ts:133 and :142 inline styles unchanged
- #9 unresolved: package.json:13 unchanged
- #10 unresolved: new test adds a text-only line check after resize; no animation sampling or scriptReveal fixture

## Spec
- No Done-when line broken by the delta. "Hero text reveal and line masks still animate correctly after a switch, with no duplicated lines" is strengthened (convention-compliant re-split, restart of non-scroll animations, resize test). DN1 no-flash and DN4 half-second remain partial for the round 1 reasons (#2, #4, #7).

## Standards
none (delta introduced no violations; it removes the CLAUDE.md "never call `.revert()` manually when `autoSplit: true`" break; `pnpm check` passes)

## Verdict
fix-first: the P1 is resolved with no regressions, but five P2s from round 1 (#2, #3, #4, #6, #7) were not touched and still undermine the no-flash and half-second criteria.
