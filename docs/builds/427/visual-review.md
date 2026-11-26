head: 6abfd13ace207e9f3eecc61b8f4b33f627832a0e
round: 1

## Actionable findings
- P2 #1 / desktop home-desktop-frames-1-0ms.png the capture ran against the published staging site, which has no panel carrying `data-video-link` (measure found: false at every frame, phone and desktop), so the video-panel behaviour (video covers frame, scales with image) is not judged by this capture; image-only panels look normal. fix: publish this branch's bundle with a test panel that has a Dropbox link, then re-capture; the branch's own fixture test covers it meanwhile.

## Not captured
- none

## Kept local
- none

## References
- V1 v1-hexagon-panel-zuma-1440.webp vs home-desktop.png, home-desktop-frames-1-0ms.png, home-desktop-frames-1-500ms.png, home-desktop-frames-1-1500ms.png: differs (finding #1, image-only Zuma panel shown, no video panel to compare; image panel fills its frame and looks as the sketch's frame does)
- V1 phone pair: home-phone.png, home-phone-frames-1-0ms.png, home-phone-frames-1-500ms.png, home-phone-frames-1-1500ms.png: fine (image-only panel fills frame, no overflow, no console errors)

## Verdict
- home-desktop.png: fine (full page, no overflow, no console errors; panel image-only)
- home-phone.png: fine
- home-desktop-frames-1-0ms.png, home-desktop-frames-1-500ms.png, home-desktop-frames-1-1500ms.png: fine for image-only panel; video not judged
- home-phone-frames-1-0ms.png, home-phone-frames-1-500ms.png, home-phone-frames-1-1500ms.png: fine for image-only panel; video not judged
ready
