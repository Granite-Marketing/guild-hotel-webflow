Checked all Done-when lines for the six mobile fixes against the code, with 10 browser checks and a document check.
Result: all pass. `pnpm check`, `pnpm test:factory` (38 of 38) and `pnpm build` pass.
Two limits. The footer and FAQ jump fix (#230) is proved on a test page in Chrome only, not on the live Home and Rooms pages or on iPhone Safari, which the builder's own notes flag for a live check after release.
The Corporate row images (#233) cannot be checked until the Webflow ticket adds those images; the code is ready for them.
The room gallery restore (#232) is confirmed by the code only, not by a rendered room page.
No implementation gaps found. Held-out checks are in the run folder outside the repo.
Note: the working copy already had unstaged changes to the built files before validation, which I left as they were.
