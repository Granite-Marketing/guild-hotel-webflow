## Visual review

Visual capture: 1 of 1 pages captured, visual round 1 of 2. Verdict: ready.

| Route | Width | Verdict | Image |
|---|---|---|---|
| `/` | 390 | P2 | `home-phone.png` (local) |
| `/` | 1440 | P2 | `home-desktop.png` (local) |

**Findings:** P2 #1 / desktop home-desktop-frames-1-0ms.png the capture ran against the published staging site, which has no panel carrying `data-video-link` (measure found: false at every frame, phone and desktop), so the video-panel behaviour (video covers frame, scales with image) is not judged by this capture; image-only panels look normal. fix: publish this branch's bundle with a test panel that has a Dropbox link, then re-capture; the branch's own fixture test covers it meanwhile.

**Not captured:** none

**Kept local:** none

Images marked local stay on the build machine, in visual run `run-1` of this build.
