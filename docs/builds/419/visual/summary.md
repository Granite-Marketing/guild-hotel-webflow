## Visual review

Visual capture: 2 of 3 pages captured, visual round 2 of 2. Verdict: ready.

| Route | Width | Verdict | Image |
|---|---|---|---|
| `/` | 390 | ok | `home-phone.png` (local) |
| `/` | 1440 | ok | `home-desktop.png` (local) |
| `/rooms` | 390 | ok | `rooms-phone.png` (local) |
| `/rooms` | 1440 | ok | `rooms-desktop.png` (local) |
| `/tests/visual/fixtures/heading-tags-420.html` | - | not captured: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404) |  |

**Findings:** none

**Not captured:** /tests/visual/fixtures/heading-tags-420.html: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404). The paragraph-title cases (pop-up name, room hover reveal, quiz focus) are not judged visually; the Playwright spec covers them.

**Kept local:** none

Images marked local stay on the build machine, in visual run `run-4` of this build.
