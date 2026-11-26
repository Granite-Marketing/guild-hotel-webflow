# Review, round 2 (delta)

- The serious problem from round 1 is fixed: the copy check now marks a line as done only when the line's own spot on the page shows the new words, not when the words appear somewhere else. Slider copies no longer count either. New tests prove both, and all copy-check tests pass.
- Nothing in the fix broke a Done-when line or a house rule.
- Left over, all minor and untouched by the fix: the staging address is written in two places, some tests will go red if the catalogue is refreshed, one helper call needs a comment, and one code comment overstates when the loose "anywhere on the page" match is used.
- Verdict: ready to merge.
