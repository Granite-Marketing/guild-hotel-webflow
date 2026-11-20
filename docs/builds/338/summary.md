## ⚠️ Action required before merge

- Register the no-flash head snippet `docs/reference/site-head/day-night-head.js` as a site head script when the bundle ships. Check: `curl -s "$WEBFLOW_SITE_URL" | grep -c guild-mode`. Run by the release step.
- Add `data-day-night="day"` and `data-day-night="night"` to the existing nav Day and Night buttons in the Designer. Check: `curl -s "$WEBFLOW_SITE_URL" | grep -c 'data-day-night='`. Done in the Designer ticket that binds the night fields.

## Summary

Adds a day and night content switch. Pressing Night swaps text, image, video and button link on tagged blocks and Day restores them. The choice is remembered in a cookie, first visits show day, empty night values keep day content, and the swap crossfades in about half a second (instant with reduced motion). Hero text reveals and line masks re-split cleanly after a switch.

## Go through with Stephen before merge

1. Is a host-only cookie (`guild-mode`, one year) acceptable for launch? www and the bare domain keep separate choices.
2. Happy with the crossfade speed (0.25 s out, 0.25 s in)?
3. Keep `is-active` on the pressed nav button as the styling hook?
4. Text animated by scroll text reveal or sliders must not carry night attributes. Does any tagged block use those animations and need follow-up?
5. Register the head snippet with the next bundle release?
6. Fine to add the button attributes in the Designer ticket?

## Known residuals

Review left 5 medium (P2) and 5 small (P3) findings unfixed, such as a day flash for elements with one empty night value, the crossfade cancelling other reveal tweens, and slow switches waiting on offscreen images. Listed in [issue 367](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/367) for you to decide on.

## Follow-ups filed

- [Rebuild dist bundle to include the switch](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/358)
- [Review residuals](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/367)

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

## How it was validated

7 of 7 held-out Done-when criteria passed (13 browser checks at 390 and 1440 wide, on fixture pages). Type check, factory tests and build all pass.

## Post-deploy monitoring

No additional operational monitoring required: the switch does nothing until the bundle is released and the nav buttons are tagged.

Closes #338
Closes #339

🤖 Generated with [Claude Code](https://claude.com/claude-code)
