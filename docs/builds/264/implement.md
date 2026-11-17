status: complete

- #265 (M6, M12): merge 4818152; tests: scroll-length-toolbar.spec, scroll-enlarge-snap.spec additions
- #266 (M21, M22): merge fee688b; tests: sticky-cta-m21.spec
- #267 (M23): merge b8994fe; tests: hero-on-load.spec
- #268 (M4, M16, M30, M39): merge d3953d1; tests: scroll-reveals-268.spec
- #269 (M19, M18): merge ecc202e; tests: tab-dropdown.spec, scroll-enlarge-snap.spec (M18)
- #270 (M11a, M26, M31b): merge 3751d09; tests: focus-tilt-directions-270.spec

Assumptions: rows 1-3 in docs/builds/264/ASSUMPTIONS.md.

## Fix round 2

- Gate feedback: diff touched protected dist/index.js. Restored it to base 48c0e74 in d51c36e. The bundle rebuild moves to release: follow-up https://github.com/Granite-Marketing/guild-hotel-webflow/issues/286.
- pnpm check passes.
