## Summary

All 41 items of the 17 Nov mobile feedback round, delivered through six tickets: FAQ and footer scroll, dining reserve button, hero zoom on load, scroll fades (collage, room gallery, forms, corporate rows), subnav menu and venue selector, and small fixes (focus ring, George Marston tilt, Directions links).

Closes #264
Closes #265
Closes #266
Closes #267
Closes #268
Closes #269
Closes #270

## Go through with Stephen before merge

1. Do the Home collage tiles fading in 0.2s apart feel right on a phone?
2. Is the 0.1s newsletter field stagger subtle enough?
3. Keep the subnav link rise (about 4px) and the hero zoom (1.12 settling over 1.8s), or adjust after seeing staging?
4. The scroll section's footer jump, FAQ line mask, hero zoom and subnav easing are proven in code only, not in a live browser. Glance at staging on a phone.
5. The script changes ship only when the release rebuilds the bundle (see #286).

## Known residuals

- P2 FAQ open-item chevron alignment (M12) is unverified, faq-chevron.css:2.
- P2 Hero zoom ignores reduced motion before the bundle loads, reveal-prehide.css:12.
- Five P3 polish items. All 12 findings: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/290

## Follow-ups filed

- https://github.com/Granite-Marketing/guild-hotel-webflow/issues/284
- https://github.com/Granite-Marketing/guild-hotel-webflow/issues/286
- https://github.com/Granite-Marketing/guild-hotel-webflow/issues/290

## Visual review

Visual capture: 10 of 10 pages captured, visual round 1 of 2. Verdict: ready.

| Route | Width | Verdict | Image |
|---|---|---|---|
| `/` | 390 | P3 | `home-phone.png` (local) |
| `/` | 1440 | ok | `home-desktop.png` (local) |
| `/rooms` | 390 | ok | `rooms-phone.png` (local) |
| `/rooms` | 1440 | ok | `rooms-desktop.png` (local) |
| `/rooms/cozy-courtyard-king` | 390 | ok | `rooms-cozy-courtyard-king-phone.png` (local) |
| `/rooms/cozy-courtyard-king` | 1440 | P2 | `rooms-cozy-courtyard-king-desktop.png` (local) |
| `/dining/dining-zuma` | 390 | P2 | `dining-dining-zuma-phone.png` (local) |
| `/dining/dining-zuma` | 1440 | ok | `dining-dining-zuma-desktop.png` (local) |
| `/dining/solana-coffee` | 390 | ok | `dining-solana-coffee-phone.png` (local) |
| `/dining/solana-coffee` | 1440 | ok | `dining-solana-coffee-desktop.png` (local) |
| `/dining/dining-gardenterrace` | 390 | P2 | `dining-dining-gardenterrace-phone.png` (local) |
| `/dining/dining-gardenterrace` | 1440 | ok | `dining-dining-gardenterrace-desktop.png` (local) |
| `/happenings` | 390 | ok | `happenings-phone.png` (local) |
| `/happenings` | 1440 | ok | `happenings-desktop.png` (local) |
| `/history` | 390 | P3 | `history-phone.png` (local) |
| `/history` | 1440 | ok | `history-desktop.png` (local) |
| `/meetings` | 390 | ok | `meetings-phone.png` (local) |
| `/meetings` | 1440 | ok | `meetings-desktop.png` (local) |
| `/legal-corporate/corporate` | 390 | ok | `legal-corporate-corporate-phone.png` (local) |
| `/legal-corporate/corporate` | 1440 | ok | `legal-corporate-corporate-desktop.png` (local) |

**Findings:** P2 #1 /dining/dining-gardenterrace phone dining-dining-gardenterrace-phone-frames-1-0ms.png M21/M22 unproven: the Reserve button and the "Other dining options" scroll were never found by the capture (found: false at 0, 500, 1500 and 2500 ms), so docking, centring and hiding cannot be judged; the hero shows no button at load, which matches "hidden at load" fix: verify on a published build with a scroll past the hero.; P2 #2 /dining/dining-zuma phone dining-dining-zuma-phone-frames-1-1000ms.png M18/M19 unproven: the subnav pill was not found at load (found: false), so the "only once the slider image is fully open" rule and the eased menu open could not be measured; no pill shows at the top of the page, consistent with M18 fix: verify the pill after a scroll past the mask section and the menu open on a published build.; P2 #3 /rooms/cozy-courtyard-king desktop rooms-cozy-courtyard-king-desktop-frames-1-1500ms.png M16 unproven: the room gallery photos were not reached by the capture (only the full-bleed hero figure measured, no change); scale and fade on gallery images not shown fix: add a gallery selector and scroll target.; P3 #4 / phone home-phone-frames-2-0ms.png M6 and M12 on Home: FAQ questions held opacity 1 and no transform in every frame, so the row-by-row line mask is not visible in this capture, and the footer scroll jump cannot be seen in stills fix: judge in the browser on a published build.; P3 #5 /history phone history-phone.png M26: the tall full-page shot is too small to read the tilt and the space around George Marston fix: crop to the heading at 390 wide.

**Not captured:** none

**Kept local:** none

Images marked local stay on the build machine, in visual run `run-3` of this build.

## How it was validated

Typecheck, factory tests and production build pass (attempt 2). 14 of 14 held-out Done-when checks pass (source-level; no browser run).

## Post-deploy monitoring

After the release rebuild, check the Home, Rooms, dining and corporate pages on a phone for the new scroll animations.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
