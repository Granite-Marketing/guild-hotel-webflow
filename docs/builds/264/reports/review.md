# Review, build 264 round 1

The changes are small and clean: no rule breaks, the typecheck passes, and most of the 14 feedback items are covered by this branch or by code already live.

Two gaps need fixing before merge:
1. FAQ (M12): nothing shows that the open item's arrow was lined up with the closed ones. It needs checking on the live site and a fix if it is off.
2. Hero zoom (M23): visitors who turn off motion still see the photo start zoomed and then snap to normal size.

Five small polish items: a slow-connection pop on the hero, a slight lag on the lower collage photos, and three out-of-date notes.

Note at merge: the script changes go live only when the release rebuilds and publishes the bundle.

Verdict: fix first. Detail: docs/builds/264/review.md
