# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | `data-reveal-start` values outside 0 to 100, or with a unit like `60%`, count as invalid and fall back to today's `top 90%`. | The spec says invalid keeps the default; a plain number is the documented format. | Should `60%` also be accepted as 60? |
| 2 | Button diagonals were made crisp by tuning the existing outline ring, not by switching to an SVG stroke; measured diagonal thickness now matches the straight edges (about 1.95 vs 2.0 device px at 2x). | An SVG background cannot read the single thickness setting, so it would need a second hard-coded width. | Happy with the before/after screenshots, or do you want the SVG version anyway? |
| 3 | The Meetings "Book your space" thicker outline was no longer in the shared stylesheet, so removing the one-off meant only adding the single thickness setting and a note. | Nothing left to delete in code. | If the Meetings button still looks thicker live, it is a Designer-side class to remove in the companion spec. |
| 4 | The page "jump back up" could not be reproduced in a headless browser; the fix targets the freezes that most likely cause it. | Diagnosis doc lists the evidence. | Check on staging after release; if the jump persists, open a follow-up. |
