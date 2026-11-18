head: d51c36eba8312ee17e418ed311936c50d1cf0daf
round: 1

## Actionable findings
- P2 #1 /dining/dining-gardenterrace phone dining-dining-gardenterrace-phone-frames-1-0ms.png M21/M22 unproven: the Reserve button and the "Other dining options" scroll were never found by the capture (found: false at 0, 500, 1500 and 2500 ms), so docking, centring and hiding cannot be judged; the hero shows no button at load, which matches "hidden at load" fix: verify on a published build with a scroll past the hero.
- P2 #2 /dining/dining-zuma phone dining-dining-zuma-phone-frames-1-1000ms.png M18/M19 unproven: the subnav pill was not found at load (found: false), so the "only once the slider image is fully open" rule and the eased menu open could not be measured; no pill shows at the top of the page, consistent with M18 fix: verify the pill after a scroll past the mask section and the menu open on a published build.
- P2 #3 /rooms/cozy-courtyard-king desktop rooms-cozy-courtyard-king-desktop-frames-1-1500ms.png M16 unproven: the room gallery photos were not reached by the capture (only the full-bleed hero figure measured, no change); scale and fade on gallery images not shown fix: add a gallery selector and scroll target.
- P3 #4 / phone home-phone-frames-2-0ms.png M6 and M12 on Home: FAQ questions held opacity 1 and no transform in every frame, so the row-by-row line mask is not visible in this capture, and the footer scroll jump cannot be seen in stills fix: judge in the browser on a published build.
- P3 #5 /history phone history-phone.png M26: the tall full-page shot is too small to read the tilt and the space around George Marston fix: crop to the heading at 390 wide.

## Not captured
- none

## Kept local
- none

## References
- M4 m4-loom-home-art-collage.webp vs home-phone-frames-1-0ms.png, home-phone-frames-1-400ms.png, home-phone-frames-1-1000ms.png, home-phone-frames-1-2000ms.png: match (bug gone: opacity 0.21, 0.86, 1, 1 so images fade in; collage sits inside the frame)
- M4 m4-figma-art-collage-contained.webp vs home-phone.png, home-phone-frames-1-1000ms.png: match (images sit inside the hexagon frame)
- M6 m6-loom-faq-footer-skip.webp vs home-phone-frames-2-0ms.png, home-phone-frames-2-500ms.png, home-phone-frames-2-1500ms.png, home-desktop-frames-2-1500ms.png: match (positions identical in every frame, no jump; finding #4 for the unseen footer case)
- M11a m11-loom-quiz-focus-ring.webp vs rooms-phone.png, rooms-phone-focus-1.png: match (ring shows only on keyboard focus of the menu control; no ring on the unfocused page)
- M12 m12-loom-faq-items.webp vs rooms-phone-frames-1-0ms.png, rooms-phone-frames-1-500ms.png, rooms-phone-frames-1-1500ms.png, rooms-desktop-frames-1-1500ms.png: match (rows fade 0.17, 0.91, 1; question line mask itself not visible, finding #4)
- M16 m16-loom-room-gallery-animation.webp vs rooms-cozy-courtyard-king-desktop-frames-1-0ms.png, rooms-cozy-courtyard-king-desktop-frames-1-500ms.png, rooms-cozy-courtyard-king-desktop-frames-1-1500ms.png: differs (finding #3, unproven, not a seen fault)
- M18 m18-loom-zuma-subnav-reference.webp vs dining-dining-zuma-phone-frames-1-0ms.png, dining-dining-zuma-phone-frames-1-1000ms.png: judged by newer words: pill shows only once the slider image is fully open (finding #2)
- M19 m19-loom-subnav-menu-open.webp vs dining-solana-coffee-phone-frames-1-0ms.png, dining-solana-coffee-phone-frames-1-500ms.png, dining-solana-coffee-phone-frames-1-1500ms.png: differs (finding #2, unproven)
- M21 m21-loom-reserve-button-hidden.webp vs dining-dining-gardenterrace-phone-frames-1-0ms.png, dining-dining-gardenterrace-phone-frames-1-500ms.png, dining-dining-gardenterrace-phone-frames-1-1500ms.png, dining-dining-gardenterrace-phone-frames-1-2500ms.png: judged by newer words: hidden at load on phones, fade-in after a short scroll (finding #1)
- M22 m22-loom-sticky-reserve-end.webp vs dining-dining-gardenterrace-phone.png, dining-dining-gardenterrace-desktop.png: differs (finding #1, unproven)
- M23 m23-loom-hero-image-scale.webp vs happenings-phone-frames-1-0ms.png, happenings-phone-frames-1-300ms.png, happenings-phone-frames-1-800ms.png, happenings-phone-frames-1-1500ms.png: match (image scale 1.035, 1.025, 1.013, 1.000 at full opacity; frame fixed at 390 wide)
- M26 m26-loom-history-script-tilt.webp vs history-phone.png: judged by newer words: tilt -5deg on phones (finding #5, tilt not legible at this size)
- M30 m30-loom-rfp-form-fields.webp vs meetings-phone-frames-1-0ms.png, meetings-phone-frames-1-500ms.png, meetings-phone-frames-1-1500ms.png, meetings-desktop-frames-1-1500ms.png: match (fields fade 0.12, 0.91, 1 with no vertical slide: y 409 to 410)
- M39 m39-loom-corporate-why-teams.webp vs legal-corporate-corporate-phone-frames-1-0ms.png, legal-corporate-corporate-phone-frames-1-500ms.png, legal-corporate-corporate-phone-frames-1-1500ms.png: match (row images inline at the right, fade 0.23, 0.96, 1, no mask)
- M39 m39-loom-figma-why-teams-image.webp vs legal-corporate-corporate-phone.png, legal-corporate-corporate-phone-frames-1-1500ms.png: match (text left and image at the right edge, following the Figma frame)

## Verdict
ready

- home-phone.png: fine
- home-desktop.png: fine
- home-desktop-frames-1-0ms.png: fine
- home-desktop-frames-1-400ms.png: fine
- home-desktop-frames-1-1000ms.png: fine
- home-desktop-frames-1-2000ms.png: fine
- home-desktop-frames-2-0ms.png: fine
- home-desktop-frames-2-500ms.png: fine
- rooms-desktop.png: fine
- rooms-desktop-focus-1.png: fine
- rooms-desktop-frames-1-0ms.png: fine
- rooms-desktop-frames-1-500ms.png: fine
- rooms-cozy-courtyard-king-phone.png: fine
- rooms-cozy-courtyard-king-phone-frames-1-0ms.png: fine
- rooms-cozy-courtyard-king-phone-frames-1-500ms.png: fine
- rooms-cozy-courtyard-king-phone-frames-1-1500ms.png: fine
- rooms-cozy-courtyard-king-desktop.png: fine
- dining-dining-zuma-phone.png: fine
- dining-dining-zuma-desktop.png: fine
- dining-dining-zuma-desktop-frames-1-0ms.png: fine
- dining-dining-zuma-desktop-frames-1-1000ms.png: fine
- dining-solana-coffee-phone.png: fine
- dining-solana-coffee-desktop.png: fine
- dining-solana-coffee-desktop-frames-1-0ms.png: fine
- dining-solana-coffee-desktop-frames-1-500ms.png: fine
- dining-solana-coffee-desktop-frames-1-1500ms.png: fine
- dining-dining-gardenterrace-desktop-frames-1-0ms.png: fine
- dining-dining-gardenterrace-desktop-frames-1-500ms.png: fine
- dining-dining-gardenterrace-desktop-frames-1-1500ms.png: fine
- dining-dining-gardenterrace-desktop-frames-1-2500ms.png: fine
- happenings-phone.png: fine
- happenings-desktop.png: fine
- happenings-desktop-frames-1-0ms.png: fine
- happenings-desktop-frames-1-300ms.png: fine
- happenings-desktop-frames-1-800ms.png: fine
- happenings-desktop-frames-1-1500ms.png: fine
- history-desktop.png: fine
- meetings-phone.png: fine
- meetings-desktop.png: fine
- meetings-desktop-frames-1-0ms.png: fine
- meetings-desktop-frames-1-500ms.png: fine
- legal-corporate-corporate-desktop.png: fine
- No overflow (overflow_px 0) and no console errors on any page. Capture ran against the published staging site, so unreleased bundle changes may not be live; the P2 items need re-checking after release.
