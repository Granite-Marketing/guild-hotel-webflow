## Summary

Six mobile feedback code fixes for the Guild Hotel site, built against the spec.

- Scroll jump near the footer and on FAQ toggles: caused by the browser's own scroll anchoring when two FAQ items change height at once (page moved 252px in a fixture, same with and without Lenis). Fixed by pausing anchoring during each toggle.
- Sticky "Reserve a table": cause of the hidden state was the 800px phone hero pushing the button below the fold, so it did not dock until about 300px of scroll. It now docks on load.
- Hero image scale-in on every image hero, and room gallery image fade restored from commit e5ed47c (v1.1.60).
- Fade reveals for FAQ rows, RFP fields, Home collage and Corporate rows; animated subnav open and close; no focus ring after a tap, tilted heading clearance on phones, Directions links open in a new tab.

## Go through with Stephen before merge

1. Does the FAQ still feel steady on an iPhone? Safari has no scroll anchoring, so a jump there needs a further fix.
2. Is "Other dining options" (the card carousel after the dining content) the right section to hide the button at?
3. Is the hero zoom (112% to 100% over 1.8s) the right amount and speed?
4. Is the room gallery image fade from v1.1.60 the gallery Omar meant?
5. Corporate row images: confirm the Webflow ticket uses the "Why teams choose the Guild" feature figure. This line is unverifiable until those images exist.
6. Fine for every form on the shared contact form component to fade in, not only RFP?
7. Does the subnav timing feel right (0.45s open, 0.06s link stagger, 0.3s close)?
8. Should the George Marston heading stay level on desktop (as M26 says) or keep its earlier tilt? Phones use -2.56deg.
9. Does any focus ring still show after a tap on the live site? The script hides it, no site CSS needed.

## Known residuals

10 review findings left unfixed, staged for your decision in [#255](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/255). The two P2s: fade-only reveals hide form fields and FAQ rows from keyboard and screen readers until scrolled to (`scrollReveal.ts:214`), and a quick double tap on the mobile subnav toggle can leave it collapsed while reporting open (`tabDropdown.ts:169`). The rest are P3 (iOS scroll-jump unproven, focus-ring edge cases, collage stagger, Directions `rel` overwrite, test gaps).

## Follow-ups filed

- [#251](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/251) rooms-quiz spec fails on main
- [#252](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/252) rebuild dist after merge (dist deliberately not rebuilt here)
- [#255](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/255) review residuals

## How it was validated

`pnpm check` clean, `pnpm test:factory` 38/38, `pnpm build` ok. Held-out criteria: all pass except one unverifiable (Corporate images); the live footer check was fixture-only.

## Post-deploy monitoring

After release, check an iPhone: FAQ toggles near the footer on Home and Rooms, the sticky button on load, and the subnav.

Closes #228
Closes #230
Closes #231
Closes #232
Closes #233
Closes #234
Closes #235

🤖 Generated with [Claude Code](https://claude.com/claude-code)
