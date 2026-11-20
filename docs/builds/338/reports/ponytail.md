Ponytail read PR 368 and says ship. No must-fix problems.
Three small should-fix items, all visual edge cases:
1. Pressing Day/Night can show a not-yet-revealed heading early.
2. An element with one empty night value can flash day text on a night load.
3. Night video leaves an inline position style behind when switching back.
Nothing applied; the dist rebuild is still deferred to release, so the site does not change until then.
Full review: docs/builds/338/ponytail.md, also posted on the PR.
