## Summary

Closes #427
Closes #428

**What was built.** Any Dropbox link the client pastes (share link with dl=0, dl=1 or raw=1, old /s/ links, direct links) now becomes the direct video file wherever the site takes video links. A video in a hexagon scroll mask panel covers the image frame and settles in with the image; panels with a blank or broken link look exactly as today. YouTube, Vimeo and plain file links are unchanged.

## Go through with Stephen before merge

1. Fine to keep other Dropbox link parameters as they are (only dl, raw and st are dropped), and to treat dl.dropbox.com and bare dropbox.com as Dropbox too?
2. A video panel scales its whole image frame, not the image alone. Happy with this, given the frame always fills the panel in the Designer?

## Known residuals

Three P2/P3 review findings are staged for your decision, not queued to build: [#437](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/437).

## Follow-ups filed

1. [#432](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/432): flaky older panel test (also flaky on main)
2. [#433](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/433): Designer work for video link fields and footer links
3. [#437](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/437): review residuals

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

## How it was validated

7 of 7 held-out criteria passed. Type check, factory tests (62) and build check pass. 9 new Dropbox tests fail on the old code, as they should. Real Dropbox playback was not tested against a live file.

## Post-deploy monitoring

No additional operational monitoring required: nothing changes on the live site until the Designer work in #433 adds video links to panels.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
