verdict: ship

What this change does: PR 256 fixes six mobile feedback items in the site's browser code. It stops page jumps in FAQ items, docks the dining button from load, restores the hero and room gallery image animations, adds fade and staggered reveals, animates the tab dropdown, and removes tap focus rings. It also opens Directions links in a new tab. I assumed a marketing site with many visitors but light per-page work.

Must fix: none found.

Should fix:
1. Corporate row images rely on a guessed selector (`src/utils/scrollReveal.ts`, `MOBILE_REVEALS`)
   - What this is: Mobile reveal for images the Webflow ticket has not added yet.
   - Problem: The selector is a guess (`_item-figure` or any `figure` in the row). If the real markup differs, nothing animates and nothing warns.
   - Fix: Check it against the live row once the Webflow ticket lands. The assumption is already logged in ASSUMPTIONS.md.
   - If we skip it: The Corporate mobile item stays silently undone.
2. Built file not refreshed (`dist/`)
   - What this is: The build commit restored `dist/` to the base version, so the rebuild is left for release.
   - Problem: Merging alone changes nothing live. The jsDelivr bundle only picks this up after a release build and a footer URL bump.
   - Fix: Run the normal release steps right after merge.
   - If we skip it: Stephen sees no change on the site and thinks the fixes failed.
3. Focus ring logic has browser tests only through fixtures (`src/utils/focusRing.ts`)
   - What this is: It sets inline `outline: none` after any non-keyboard focus.
   - Problem: It overrides the browser's own `:focus-visible` judgement, so a case like a screen reader moving focus with no key press hides the ring. The tests cover tap, click and Tab, not that case.
   - Fix: Accept it, or only quiet the ring on `pointerdown` targets and drop the global default.
   - If we skip it: Rare loss of the ring for assistive tech users.

Nice to have:
4. `tagStaggeredRows` and `tagSharedBlocks` in `scrollReveal.ts` do near-identical tagging. They differ only in the guard for forms. Merging them would save about 10 lines but adds a flag; leave it.

Verdict: Ship.
Lean: -10 lines possible.
Not checked: the rest of the `tabDropdown` diff beyond the open path, and a real device run. I did not run the tests or the live site.
