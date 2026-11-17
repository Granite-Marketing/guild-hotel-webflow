head: d51c36eba8312ee17e418ed311936c50d1cf0daf
round: 1

## Actionable findings
- P1 #1 /dining/dining-gardenterrace phone dining-dining-gardenterrace-phone-frames-1-2500ms.png M21 docked Reserve button not demonstrated: the selectors `[class*=reserve]` and `[class*=sticky]` were found: false in every frame, and the scroll frame to "Other dining options" timed out, so docking, centring and the M22 hide could not be measured fix: re-capture with the real Reserve button and "Other dining options" selectors and confirm fade-in docked at centre after a short scroll and hidden at the section
- P1 #2 /dining/dining-zuma phone dining-dining-zuma-phone-frames-1-1000ms.png M18/M19 subnav selectors (`.tab-pills-intro_bar`, `[class*=subnav]`) not found on Zuma or Solana Coffee, so venue selector timing and the menu open/close animation are unmeasured fix: re-capture with the true subnav selector, scrolling through the scroll-mask slider
- P2 #3 /rooms/cozy-courtyard-king desktop rooms-cozy-courtyard-king-desktop-frames-1-500ms.png M16 the measured `main figure` is the full-screen hero (opacity 1, no transform in all frames), so the gallery scale and fade was not shown fix: re-capture with the gallery photo selector
- P2 #4 / phone home-phone-frames-1-0ms.png M4 collage tile measured at x -35 (35px outside the viewport) while fading 0.19 to 1 over 1s; the fade works for one tile but the one-by-one order and containment inside the hexagon frame were not measured fix: measure the second and third tile
- P2 #5 /legal-corporate/corporate desktop legal-corporate-corporate-desktop.png M39 desktop scroll frame timed out, and on phone the figure fades (0.22 to 1) with transform none in every frame, so no scale is visible fix: confirm the scale-in on phones against the new bundle
- P2 #6 all routes capture note: the capture ran against the published Webflow staging site (`the-guild-hotel-c34e71.webflow.io`), not a build of this branch, so it shows the live bundle, not necessarily the diff fix: ship the bundle to staging, then re-capture

## Not captured
- /dining/dining-gardenterrace scroll frame (Other dining options): frames error, scrollIntoViewIfNeeded timed out
- /legal-corporate/corporate desktop frames: scrollIntoViewIfNeeded timed out
- /history: no frames requested; still shots only, tilt not measured numerically

## Kept local
- none

## References
- M4 m4-loom-home-art-collage.webp vs home-phone.png, home-phone-frames-1-0ms.png, home-phone-frames-1-400ms.png, home-phone-frames-1-1000ms.png, home-phone-frames-1-2000ms.png: differs (finding #4, unproven)
- M4 m4-figma-art-collage-contained.webp vs home-phone.png: differs (finding #4, containment not shown)
- M6 m6-loom-faq-footer-skip.webp vs home-phone-frames-2-0ms.png, home-phone-frames-2-500ms.png, home-phone-frames-2-1500ms.png: match as far as a still can show (no jump measurable)
- M11a m11-loom-quiz-focus-ring.webp vs rooms-phone-focus-1.png: match (the keyboard focus ring shows on the menu button; no ring seen after a tap in stills)
- M12 m12-loom-faq-items.webp vs rooms-phone-frames-1-0ms.png, rooms-phone-frames-1-500ms.png, rooms-phone-frames-1-1500ms.png: differs (the item fades 0.14 to 1 but the question text measured opacity 1 and transform none in all frames, so no line mask was seen; finding #7)
- M16 m16-loom-room-gallery-animation.webp vs rooms-cozy-courtyard-king-desktop-frames-1-0ms.png, rooms-cozy-courtyard-king-desktop-frames-1-500ms.png, rooms-cozy-courtyard-king-desktop-frames-1-1500ms.png: differs (finding #3)
- M18 m18-loom-zuma-subnav-reference.webp vs dining-dining-zuma-phone.png, dining-dining-zuma-phone-frames-1-0ms.png, dining-dining-zuma-phone-frames-1-1000ms.png: judged by newer words: venue selector shows only once the slider image is fully open; unmeasured (finding #2)
- M19 m19-loom-subnav-menu-open.webp vs dining-solana-coffee-phone-frames-1-0ms.png, dining-solana-coffee-phone-frames-1-500ms.png, dining-solana-coffee-phone-frames-1-1500ms.png: differs (finding #2)
- M21 m21-loom-reserve-button-hidden.webp vs dining-dining-gardenterrace-phone-frames-1-0ms.png, dining-dining-gardenterrace-phone-frames-1-500ms.png, dining-dining-gardenterrace-phone-frames-1-1500ms.png, dining-dining-gardenterrace-phone-frames-1-2500ms.png: judged by newer words: hidden at load is seen (no button in the top shots); fade-in docking unmeasured (finding #1)
- M22 m22-loom-sticky-reserve-end.webp vs dining-dining-gardenterrace-phone.png: differs (finding #1)
- M23 m23-loom-hero-image-scale.webp vs happenings-phone-frames-1-0ms.png, happenings-phone-frames-1-300ms.png, happenings-phone-frames-1-800ms.png, happenings-phone-frames-1-1500ms.png: match (hero image scale 1.0096 down to 1.0001 inside an unmoved frame, opacity 1; desktop 1.028 to 1 in happenings-desktop-frames-1-*)
- M26 m26-loom-history-script-tilt.webp vs history-phone.png: judged by newer words: -5deg on phones; not measured numerically (still too small to read)
- M30 m30-loom-rfp-form-fields.webp vs meetings-phone-frames-1-0ms.png, meetings-phone-frames-1-500ms.png, meetings-phone-frames-1-1500ms.png: match (field opacity 0.12 to 1, y shifts 1px only, no slide)
- M39 m39-loom-corporate-why-teams.webp vs legal-corporate-corporate-phone-frames-1-0ms.png, legal-corporate-corporate-phone-frames-1-500ms.png, legal-corporate-corporate-phone-frames-1-1500ms.png: differs (finding #5; fades but no scale)
- M39 m39-figma-why-teams-image.webp vs legal-corporate-corporate-phone.png: match (120x90 image at right edge, x 250 to 370)

## Verdict
fix-first

Stills named (all captured, none had overflow above 0 or console errors; fine at a glance unless a finding names them):
- home-phone.png: fine at a glance, no overflow, no console errors
- home-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-1-400ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-1-1000ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-1-2000ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-2-0ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-2-500ms.png: fine at a glance, no overflow, no console errors
- home-phone-frames-2-1500ms.png: fine at a glance, no overflow, no console errors
- home-desktop.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-1-400ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-1-1000ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-1-2000ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-2-0ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-2-500ms.png: fine at a glance, no overflow, no console errors
- home-desktop-frames-2-1500ms.png: fine at a glance, no overflow, no console errors
- rooms-phone.png: fine at a glance, no overflow, no console errors
- rooms-phone-focus-1.png: fine at a glance, no overflow, no console errors
- rooms-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- rooms-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- rooms-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- rooms-desktop.png: fine at a glance, no overflow, no console errors
- rooms-desktop-focus-1.png: fine at a glance, no overflow, no console errors
- rooms-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- rooms-desktop-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- rooms-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-phone.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-desktop.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-desktop-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- rooms-cozy-courtyard-king-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-phone.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-phone-frames-1-1000ms.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-desktop.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-dining-zuma-desktop-frames-1-1000ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-phone.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-desktop.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-desktop-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- dining-solana-coffee-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-phone.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-phone-frames-1-2500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-desktop.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-desktop-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- dining-dining-gardenterrace-desktop-frames-1-2500ms.png: fine at a glance, no overflow, no console errors
- happenings-phone.png: fine at a glance, no overflow, no console errors
- happenings-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- happenings-phone-frames-1-300ms.png: fine at a glance, no overflow, no console errors
- happenings-phone-frames-1-800ms.png: fine at a glance, no overflow, no console errors
- happenings-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- happenings-desktop.png: fine at a glance, no overflow, no console errors
- happenings-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- happenings-desktop-frames-1-300ms.png: fine at a glance, no overflow, no console errors
- happenings-desktop-frames-1-800ms.png: fine at a glance, no overflow, no console errors
- happenings-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- history-phone.png: fine at a glance, no overflow, no console errors
- history-desktop.png: fine at a glance, no overflow, no console errors
- meetings-phone.png: fine at a glance, no overflow, no console errors
- meetings-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- meetings-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- meetings-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- meetings-desktop.png: fine at a glance, no overflow, no console errors
- meetings-desktop-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- meetings-desktop-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- meetings-desktop-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- legal-corporate-corporate-phone.png: fine at a glance, no overflow, no console errors
- legal-corporate-corporate-phone-frames-1-0ms.png: fine at a glance, no overflow, no console errors
- legal-corporate-corporate-phone-frames-1-500ms.png: fine at a glance, no overflow, no console errors
- legal-corporate-corporate-phone-frames-1-1500ms.png: fine at a glance, no overflow, no console errors
- legal-corporate-corporate-desktop.png: fine at a glance, no overflow, no console errors
