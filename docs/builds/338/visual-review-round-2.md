head: 6d07800be577d7a3dde5374de81546e513eb6a6f
round: 2

## Actionable findings
- P2 #338 / phone+desktop home-phone.png day and night buttons not found on the home page by selector [data-day-night]; they are visible in the nav on /dining and /rooms. fix: confirm the home nav carries the Day and Night buttons with data-day-night attributes before release.
- P3 #338 /dining phone+desktop dining-phone.png headings such as "The Neigh" and "A room for ever" look cut off in the full-page shot; likely the scroll text reveal caught mid-animation in a tall capture, not a switch defect. fix: none unless it reproduces in a viewport screenshot.
- P3 #338 / all pages The staging site capture cannot press Night, so the Done-when switch, cookie, crossfade and reveal-after-switch lines are not visible in these shots; they rest on the repo's fixture tests. fix: none for this round.

## Not captured
- /tests/visual/fixtures/day-night-a.html: fixture page lives only in the repo test folder and is not served by the staging site the capture loads

## Kept local
- none

## Verdict
ready

- home-phone.png: fine, day content, no overflow, no console errors
- home-desktop.png: fine, no overflow, no console errors
- dining-phone.png: fine apart from the P3 above; nav shows Day and Night controls, no overflow
- dining-desktop.png: fine, Day pressed state shown in nav, no overflow
- rooms-phone.png: fine, no overflow, no console errors
- rooms-desktop.png: fine, Day and Night in nav, day content shown on first visit
