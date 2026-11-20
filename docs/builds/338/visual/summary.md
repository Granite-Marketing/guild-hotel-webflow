## Visual review

Visual capture: 3 of 4 pages captured, visual round 2 of 2. Verdict: ready.

| Route | Width | Verdict | Image |
|---|---|---|---|
| `/` | 390 | P2 | `home-phone.png` (local) |
| `/` | 1440 | P2 | `home-desktop.png` (local) |
| `/dining` | 390 | P2, P3 | `dining-phone.png` (local) |
| `/dining` | 1440 | P2, P3 | `dining-desktop.png` (local) |
| `/rooms` | 390 | ok | `rooms-phone.png` (local) |
| `/rooms` | 1440 | ok | `rooms-desktop.png` (local) |
| `/tests/visual/fixtures/day-night-a.html` | - | not captured: fixture page lives only in the repo test folder and is not served by the staging site the capture loads |  |

**Findings:** P2 #338 / phone+desktop home-phone.png day and night buttons not found on the home page by selector [data-day-night]; they are visible in the nav on /dining and /rooms. fix: confirm the home nav carries the Day and Night buttons with data-day-night attributes before release.; P3 #338 /dining phone+desktop dining-phone.png headings such as "The Neigh" and "A room for ever" look cut off in the full-page shot; likely the scroll text reveal caught mid-animation in a tall capture, not a switch defect. fix: none unless it reproduces in a viewport screenshot.; P3 #338 / all pages The staging site capture cannot press Night, so the Done-when switch, cookie, crossfade and reveal-after-switch lines are not visible in these shots; they rest on the repo's fixture tests. fix: none for this round.

**Not captured:** /tests/visual/fixtures/day-night-a.html: fixture page lives only in the repo test folder and is not served by the staging site the capture loads

**Kept local:** none

Images marked local stay on the build machine, in visual run `run-4` of this build.
