verdict: ship

What this change does: The last code changes in this PR are small. It tightens the focus ring (no ring after a tap), staggers the Home collage images one by one on phones, lets the newsletter fields stagger inside their fade, and stops a quick double tap on the subnav from leaving it closed while reporting open. Most of the rest of the PR is build notes and visual test pages.

Must fix: nothing.

Should fix:
1. Subnav comment is wrong (`src/utils/tabDropdown.ts`, near `let timeline`)
   - What this is: The new comment says a killed animation still fires its finish step.
   - Problem: In GSAP a killed timeline does not fire its finish step. The kill calls are what fix the double tap, so the behaviour is right, but the comment misleads the next reader.
   - Fix: Reword the comment to say the old timeline is killed so it cannot finish and close a reopened menu.
   - If we skip it: Nothing breaks. Someone may later delete the kill call because of the comment.

Nice to have:
2. Collage delay is capped at 0.5s (`STAGGER_MAX`) with a 0.2s step, so from the fourth tile on every tile shares the same delay. If the collage has more than 3 to 4 visible tiles on phones, the "one by one" look flattens. Check on a real phone; raise the cap for the collage only if it shows.

Checked: the diff of `src/utils/` and the CSS against origin/main; the guard changes (hidden tiles, nested fades) cover the empty and nested cases. Tests are visual fixtures only; no unit test fails if the double-tap guard is removed.

Verdict: Ship.
Lean: -0 lines possible.
Not checked: the minified `dist/site.css` was not read line by line, and nothing was run in a browser.
