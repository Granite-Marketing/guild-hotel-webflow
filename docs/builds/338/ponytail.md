verdict: ship

What this change does: It adds a Day and Night content switch. Nav buttons swap text, image, video and link on tagged elements, with a half-second crossfade. The choice is kept in a one-year cookie, and a small head snippet plus CSS hides tagged elements so day content never flashes on a night load. Hero and line-mask text reveals now go through a small registry so changed text re-splits cleanly.

Must fix: none found.

Should fix:

1. **Switching can reveal text early or clear other modules' opacity** (`src/utils/dayNight.ts`, setMode)
   - What this is: After the swap, every tagged element fades to opacity 1, then its inline opacity and visibility are cleared.
   - Problem: If a tagged element is still waiting for its scroll reveal (hidden by another module), pressing Night or Day shows it early, then wipes the reveal's own state.
   - Fix: Only fade and clear elements that are currently visible, or restore each element's own opacity instead of clearing it.
   - If we skip it: Below-the-fold headings can pop in on a switch. Only a visual glitch, no data loss.

2. **Head CSS can miss an element that has one empty night attribute** (`docs/reference/site-head/day-night.css`)
   - What this is: The hide rule skips any element where at least one night attribute is empty.
   - Problem: An element with `data-night-text="Late"` and `data-night-src=""` is not hidden, so on a night load its day text can flash before the swap.
   - Fix: Tag elements with only the attributes they use, or note this in the Designer guide.
   - If we skip it: A brief day flash on mixed-attribute elements.

3. **Night video leaves `position: relative` behind** (`dayNight.ts`, swapVideo)
   - Problem: Switching back to Day removes the player but keeps the inline position change, so day is not restored exactly.
   - Fix: Remember and restore the old inline position like the other attributes.
   - If we skip it: Rarely visible, only if the frame relied on static positioning.

Nice to have: none.

Lean: no cuts worth making. The registry and the head snippet are both needed.

Not checked: the built `dist` bundle is not in this PR (rebuild is deferred to release), so the live site shows nothing until release. I did not run the browser tests.
