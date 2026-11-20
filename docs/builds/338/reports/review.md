# Review round 2 (delta)

- The one serious issue from round 1 is fixed: night/day text changes now go through SplitText's own re-split, no manual revert, and a new test covers Night, Day, Night plus a resize. No regressions found; typecheck passes.
- The fix commits touched nothing else, so the five medium findings from round 1 are still open: a day flash for elements with one empty night value, the crossfade cancelling other reveal animations, slow switches waiting on offscreen images, no scroll-position refresh after a swap, and the head snippet having no install path on the live site.
- Four small findings also remain (mid-fade snap, video overlay styles, unrelated test script change, line-mask test checks text only).
- Verdict: fix-first. The no-flash and half-second crossfade criteria stay partial until the medium items are addressed.
