head: 0e607c66de155acd45513a309fc966f5053a874d
round: 1

## Actionable findings
- P2 #339 / desktop+phone home-desktop.png:1 The staging nav Day and Night buttons do not carry the `data-day-night` attribute, so both focus selectors were "not found" and the switch could not be pressed or seen focused on staging; DN1/DN2 pressed-state is not demonstrable in captures. fix: tag the nav buttons in the Designer (a Designer ticket, outside the code diff) and re-capture with a Night click.
- P3 #339 / phone dining-phone.png:1 Script headline "First sips, small bites & big nights" shows cut off ("small bit, & big n") in the full-page capture; same on rooms ("A room for eve"), and "The Neigh" on all pages. Looks like a full-page-capture mid-reveal state of the line mask, not caused by the switch, but it cannot be ruled out without a post-switch capture. fix: re-capture after Night is pressed and confirm the reveal completes with no duplicated lines.

## Not captured
- /tests/visual/fixtures/day-night-a.html: fixture page only exists in the repo test folder, not served by staging
- /tests/visual/fixtures/day-night-b.html: same, dropped from the spec (the Playwright spec covers fixtures)

## Kept local
- none

## Verdict
fix-first is not warranted: the captures show the pages render with this build's bundle (no overflow, no console errors) but none of the Done-when switch behaviours (swap, cookie, crossfade, re-split) are visible in static captures, so they are not proven visually. Verdict: ready

- home-desktop.png: fine, no overflow, no console errors, no night swap visible (day mode)
- home-phone.png: fine, day mode
- dining-desktop.png: fine; DAY and NIGHT buttons visible in nav, day pressed state not distinguishable at this scale
- dining-phone.png: see P3 (script headline clipped)
- rooms-desktop.png: fine apart from P3 headline clip
- rooms-phone.png: fine apart from P3 headline clip
