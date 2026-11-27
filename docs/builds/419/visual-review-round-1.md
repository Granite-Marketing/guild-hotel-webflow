head: 167d068c9df4914d1a0659cc9ebbd0ae4e36853e
round: 1

## Actionable findings
- none

## Not captured
- /tests/visual/fixtures/heading-tags-420.html: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404). The pop-up title, room grid hover and quiz focus cases are interactions on that fixture and are judged by the Playwright spec, not by these screenshots.

## Kept local
- none

## Verdict
ready

- home-phone.png: fine (no overflow, no console errors; changed behaviour is not visible in a static shot)
- home-desktop.png: fine
- rooms-phone.png: fine (quiz panel renders; heading focus not shown in a static shot)
- rooms-desktop.png: fine
