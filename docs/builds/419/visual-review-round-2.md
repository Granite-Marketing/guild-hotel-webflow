head: 8b2642875d83b5ddfe0920d8a0d23531ae3ff90c
round: 2

## Actionable findings
- none

## Not captured
- /tests/visual/fixtures/heading-tags-420.html: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404). The paragraph-title cases (pop-up name, room hover reveal, quiz focus) are not judged visually; the Playwright spec covers them.

## Kept local
- none

## Verdict
ready

- home-phone.png: fine (no overflow, no console errors; staging serves the published bundle, so the changed scripts are not visibly exercised)
- home-desktop.png: fine
- rooms-phone.png: fine (quiz panel "Who's checking in?" renders and is laid out; focus behaviour not judgeable from a static shot)
- rooms-desktop.png: fine
- Capture was downscaled to fit the viewer, so fine detail was judged at section level only. No focus shots were requested (no focus selectors).
