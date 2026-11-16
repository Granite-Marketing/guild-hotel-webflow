head: b1fcb66811669f62a7959436fe92683870cceda1
round: 1

## Actionable findings
- P2 #1 src/utils/modals.ts:346 Popping to a dialog does not restore its overlay state (autofix: gated_auto) fix: move the overlay on/off block from pushModal into applyOverlay(modal) and call it in popTo's `if (remaining)` branch; add a mixed overlay / data-modal-no-overlay chain to tests/visual/fixtures/modal-back-chain.html
- P2 #2 src/utils/modals.ts:349 Back to the previous dialog resets its scroll to the top, so the trigger focus returns to can be off-screen (autofix: gated_auto) fix: save scroller.scrollTop in the StackEntry on push and restore it in popTo (or give startModalScroll a resetScroll option, false from popTo)
- P2 #3 src/utils/map.ts:293 warmUpApi uses a readyState check, which CLAUDE.md "Custom Code Delivery" forbids ("no readyState checks") (autofix: manual) fix: drop the readyState branch and schedule from a plain window `load` listener or requestIdleCallback only, or document the exception in docs/reference/runtime-modules.md
- P2 #4 docs/reference/site-head/button-system.css:27 `--ring` hard-codes 2px/1px/.3px/.7px offsets, so the diagonal bands do not follow --btn-outline-width ("one outline thickness variable used by every outlined state" holds only at 1px) (autofix: gated_auto) fix: express the stops in terms of var(--r), e.g. calc(50% - 2*var(--r)), calc(50% - var(--r)), calc(50% + var(--r) - .3px), calc(50% + var(--r) + .7px), and check the fixture at 2px
- P3 #5 docs/reference/button-system.md:30 Table row 13 still says "Meetings: cream with 2px dark outline (one-off CSS)", contradicting the new outline-thickness bullet (autofix: gated_auto) fix: update row 13 to the shared outline (no one-off) and its hover column
- P3 #6 src/utils/modals.ts:245 Page trigger keeps aria-expanded="false" after a back-link replace (autofix: gated_auto) fix: in the replaceTop branch call pushModal(modal, returnTrigger, returnTrigger)
- P3 #7 src/utils/modals.ts:418 Hash back-link branches (pop-to-existing, replaceTop) and hashchange replace-stack have no fixture coverage (autofix: manual) fix: add an `a[href="#artwork"][data-modal-close]` back link and a non-beneath back link to modal-back-chain.html with specs asserting overlay, lock and focus
- P3 #8 src/utils/lineMaskReveal.ts:116 Text split after ScrollTriggers exist has no refresh and no evidence that a split is height-neutral (CLAUDE.md "Late layout shifts") (autofix: manual) fix: assert document scrollHeight is unchanged across a split in tests/visual/line-mask-lazy-split.spec.ts, or call ScrollTrigger.refresh(true) once after a batch of late splits that changes height

## Spec
- #176 "Diagnosis written to the PR": the diagnosis exists in docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md; it still has to be carried into the PR body at the PR stage.
- #176 "No jump back after load": partial. The doc says the jump back could not be reproduced and attributes it to the freeze; no fix targets it directly. Staging check is owed in the companion release ticket (the doc's status is "resolved-pending-staging-check").
- #176 "Scroll responds from first input", "Hero text reveal plays once without flicker", "No stutter scrolling over each map": code fix is in shared code (lineMaskReveal lazy split, map warm-up); verification is after release by design. Note heroTextReveal, scriptReveal and scrollTextReveal still autoSplit-resplit on the Maps font load, so they are the next suspect if staging still stutters.
- #177: complete. All four modes call parseRevealStart; tests/factory/reveal-start.test.mjs covers number, missing and invalid; documented in the module header and runtime-modules.md. The scrollReveal wiring itself is not exercised by a fixture (the lazy-split fixture copies it by hand).
- #178: stack push/pop, grid-opened close to page, ESC, click-outside and focus return are implemented and covered by tests/visual/modal-back-chain.spec.ts; modal-setup.md updated. Findings #1, #2, #6 are gaps in the pop path.
- #179 "One outline thickness variable used by every outlined state": partial, see #4.
- #179 "Meetings one-off removed": the shared stylesheet had no Meetings rule at the base either, so the removal is a docs claim; button-system.md row 13 still describes it (#5).
- #179 "Fixture screenshots at 1x and 2x show clean diagonals": attached; before and after look nearly identical by eye at 2x, the improvement rests on an ink-per-length measurement. Leave the crispness call to the visual review.
- Unrequested behaviour: back link to a dialog not beneath swaps the top dialog (replaceTop); a hashchange to a dialog replaces the whole stack; Maps API script is now fetched after load on every map page even if the visitor never reaches the map (no map load is billed).

## Standards
- CLAUDE.md "Custom Code Delivery" module pattern ("no readyState checks"): broken at src/utils/map.ts:293 (#3).
- CLAUDE.md "Late layout shifts": lazy split adds a possible post-trigger layout change with no stated guarantee (#8).
- Judgement call, not a finding: lineMaskReveal.ts module-level split queue with queueMicrotask batching is close to the banned "onLayoutReady queues" but is a deferred-work queue, not a layout-ready gate.
- Compliant: SplitText usage (autoSplit, type, no mask:'lines', no revert), smoothScroll stop/start, is-open toggling, no em dashes, solutions doc frontmatter, CLAUDE.md eager-image and ScrollTrigger rules untouched.
- Gates: `pnpm check` clean, `pnpm test:factory` 38/38 (reviewer did not run `pnpm build`, which writes dist/).

## Build vs buy lens
none (no approved libraries declared; nothing hand-rolled that a library in the canon covers)

## Verdict
fix-first: two confirmed modal-stack bugs on the Back path (#1 overlay, #2 scroll position), a CLAUDE.md module-pattern violation (#3) and a partial "one thickness variable" (#4) are small, local fixes worth making before the PR.
