# Two-axis review (granite `review` skill), base 33bd764...HEAD b1fcb66

## Standards
Hard violation:
1. src/utils/map.ts:293 `warmUpApi` checks `document.readyState === 'complete'` then falls back to a `load` listener. CLAUDE.md "Custom Code Delivery": "No polling loaders, no dedup guards, no readyState checks, no onLayoutReady queues". Fix: schedule the idle callback directly from the module (or a plain `load` listener without the readyState branch), or document the exception in docs/reference/runtime-modules.md.

Judgement calls:
2. src/utils/lineMaskReveal.ts:75-76,116,186 module-level split queue + queueMicrotask batching: nearest thing to the banned "onLayoutReady queues", but it is a deferred-work queue, not on window. Arguably fine.
3. src/utils/lineMaskReveal.ts lazy split: CLAUDE.md "Late layout shifts". Splitting after ScrollTriggers exist could change heights; no ScrollTrigger.refresh(true) after a late split and no note saying splits are height-neutral.
4. SplitText call compliant (autoSplit, type 'lines,words', no mask:'lines', overflow hidden on lines, no revert).
5. src/utils/map.ts:258 inline cast of window for requestIdleCallback: style only.

Compliant: modals.ts keeps smoothScroll stop/start contract and is-open toggling; data-reveal-start documented; no em dashes, svh/svw or br; new solutions doc has frontmatter (`status` field non-standard); before/after screenshots and visual specs present.

## Spec
Gates: `pnpm check` clean, `pnpm test:factory` 38/38 (pnpm build not run: it writes dist/).

(a) Missing or partial
1. #176 "Diagnosis written to the PR": written to docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md, not yet a PR body (PR stage pending). Covers scroll block (SplitText main-thread storm), hero flicker, map stutter, evidence.
2. #176 "No jump back after load": inferred only; the doc says the jump back could not be reproduced; diagnosis from code and traces. Staging check owed (by design, companion release ticket).
3. #179 "Fixture screenshots at 1x and 2x show clean diagonals": before-2x and after-2x look nearly identical by eye; the evidence is an ink-per-length measurement.

(b) Scope creep
1. src/types/gsap.d.ts:43 time() setter type (minor, supports new code).
2. src/utils/map.ts warmUpApi adds a Maps script fetch on every map page after load (justified under #176).
3. src/utils/modals.ts replaceTop / hashchange-replaces-stack semantics not asked for.

(c) Implemented but looks wrong
1. #179 "One outline thickness variable used by every outlined state": docs/reference/site-head/button-system.css:27 `--ring` hard-codes 2px/1px/.3px/.7px offsets around var(--r); diagonals do not scale with --btn-outline-width.
2. #179 "Meetings one-off removed": no Meetings rule exists in the shared stylesheet before or after; docs/reference/button-system.md:30 (table row 13) still says "Meetings: cream with 2px dark outline (one-off CSS)", contradicting the new outline bullet.
3. #177 correct: all four modes call parseRevealStart; tests cover number/missing/invalid; docs at module header and runtime-modules.md.
4. #178 stack reads correctly with a fixture; focusTriggerAfterTransition guard can skip focus restore on a fast second Back.

Summary: Standards 1 hard + 4 judgement; Spec 3 partial, 3 creep, 2 wrong. Worst: modal stack overlay/scroll state on pop (from ce-code-review) and the readyState rule break.
