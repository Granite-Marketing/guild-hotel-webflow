# Two-axis review (fixed point 0c9b237, spec docs/builds/338/issue.md)

## Standards

Hard violations
1. src/utils/splitRegistry.ts:24 `release: () => instance.revert()` on SplitText instances that heroTextReveal, lineMaskReveal and scriptReveal all create with `autoSplit: true`. CLAUDE.md and gsap-module-conventions rule 7: "Never call `.revert()` manually when `autoSplit: true`." Rebuild (line 26) then creates a second instance on the same element. Either record the exception in the conventions doc or swap text without reverting.
2. src/utils/dayNight.ts:131 and :140 set inline styles from JS (`style.position = 'relative'`, `Object.assign(video.style, {...})`). Not `display`, so not a literal breach of "never set inline display: none from JS", but against the class-driven spirit; judgement call leaning to violation. Move overlay rules to day-night.css under `[data-night-player]`.

Judgement calls
3. dayNight.ts:178-179 toggles both `is-night` and `is-day`; rule 4 says toggle only the non-default class. Nothing uses `is-day`.
4. dayNight() has no selector-presence guard (CLAUDE.md module pattern); always adds `night-ready` and two document listeners. Harmless; a guard would need care since night-ready must still be set.
5. inFlight bookkeeping / finishNow / IMAGE_WAIT_MS are defensive plumbing; CLAUDE.md "no dedup guards" targets load-order guards, so judgement only.
6. day-night.css bundled via src/site.css, scoped to `html.is-night:not(.night-ready)` (runtime state the Designer never shows): complies with designer-visible-css rule 5.
7. Head snippet is 125 characters, under the 2,000-character inline cap: complies.
8. runtime-modules.md documents the contract and init order; states scrollTextReveal and swiperSliders do not use trackSplit (night text on those would duplicate lines).

Complies: autoAlpha, descriptive names, named export called once from Webflow.push, no window helpers, reduced motion handled, no refresh inside scroll handlers.

## Spec

(a) Missing or partial
1. "DN1: on a night load no day text or image is visible before the night content appears": docs/reference/site-head/day-night.css:2 `:not([data-night-text=""], [data-night-src=""], ...)` excludes an element if ANY night attribute is empty, so a button with night text but empty night link (the usual CMS shape) is never hidden and flashes day. Tests (day-night.spec.ts:167-192) only cover all-filled or all-empty elements.
2. "night video link ... swap": dayNight.ts:126-144 lays a player over the frame but does not hide or pause the day media and does not wait for the player; test only checks a `<video src>` exists (spec.ts:103). Partial.
3. "a one-year cookie on the site's domain": dayNight.ts:55 sets no Domain, so host-only (documented in runtime-modules.md). Quiet gap if www and bare domain both serve.
4. "On a later switch, the swap re-splits cleanly ... Hero image scale and the scroll reveals still run": scrollTextReveal and swiperSliders not tracked; no check of hero image scale.
5. No-flash depends on day-night.css loading (bundled stylesheet) and on the head JS being pasted into the site head; the test inlines both, so it does not prove the shipped path.

(b) Scope creep
- package.json:13 `test:factory` now uses `--experimental-strip-types` (commit 71b17d2): unrelated to the switch.
- data-night-sizes, is-day, is-active, 3s CSS fail-safe: small and defensible.
- splitRegistry + trackSplit edits: needed for the re-split requirement.

(c) Implemented but looks wrong
1. dayNight.ts:209 finishNow clears opacity/visibility on a mid-fade press, so targets snap to full opacity before the next fade.
2. dayNight.ts:219-241 is fade-out, swap, fade-in (a dip to 0), and can add up to 1.2s of image wait (IMAGE_WAIT_MS), running well past "about half a second"; test (spec.ts:239-269) measures only the heading.
3. dayNight.ts:96 day-html capture after releaseSplit relies on ordering; low risk, untested on the day-back path for split elements.
4. dayNight.ts:257-262 preventDefault on any [data-day-night] click, including anchors; fine but untested.

Summary: Standards 2 hard + 6 judgement; Spec 5 partial, 1 real scope creep, 4 questionable implementations. Worst: the head CSS hole that lets day content flash on a night load.
