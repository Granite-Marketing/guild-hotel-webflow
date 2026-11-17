head: 0e6664f3735b9521cf439114f826b50e1518baf8
verdict: pass
attempt: 1

| Done-when | Check | Result | Failure message |
|---|---|---|---|
| #230 Diagnosis in the PR | 1-docs.sh (notes/230.md has Diagnosis and evidence) | pass | |
| #230 No jump into footer Home/Rooms 390 and 1440 | pw h.spec 230 anchoring pause + builder accordion-scroll spec (4 pass); live Home/Rooms footer not reachable | pass (fixture only, live check unverifiable) | |
| #230 No jump opening/closing FAQ | pw h.spec 230 (overflow-anchor none then restored, aria-expanded swap) | pass | |
| #230 Refresh rules hold | 1-docs.sh (notes state refresh(true) unchanged) | pass | |
| #230/#231/#232/#233/#234/#235 check, test:factory, build | pnpm check clean; test:factory 38/38; build ok | pass | |
| #231 Button visible on load 390 and 1440 | pw h.spec 231 | pass | |
| #231 Docks, hides at Other dining options, returns | pw h.spec 231 | pass | |
| #231 Cause written | 1-docs.sh (notes/231.md) | pass | |
| #232 Hero scales in, stays framed, reduced motion still | pw h.spec 232 (2 tests) | pass | |
| #232 Room gallery restored, names commit | 1-docs.sh (e5ed47c, gallery-mosaic figure in scrollReveal) | pass (code marker only) | |
| #232 Hero text mask unchanged | 1-docs.sh (0 removed text-mask lines) | pass | |
| #233 FAQ staggered | pw h.spec 233 (delays 0,0.1,0.2) | pass | |
| #233 RFP fields fade only | pw h.spec 233 (fade-only, opacity 0 to 1, no transform) | pass | |
| #233 Home collage fades on mobile | pw h.spec 233 (390 yes, 1440 stays visible) | pass | |
| #233 Corporate row images mobile | selector present in MOBILE_REVEALS; images not yet in DOM | unverifiable (depends on Webflow ticket) | |
| #233 Fade-only documented | 1-docs.sh | pass | |
| #233 Reduced motion shows all | pw h.spec 233 | pass | |
| #234 Open/close animate at 390 | pw h.spec 234 | pass | |
| #234 Links clickable, a11y unchanged | pw h.spec 234 (pointer-events, aria-expanded flips) | pass | |
| #234 Reduced motion instant | pw h.spec 234 | pass | |
| #235 No ring after tap/click; Tab shows ring | pw h.spec 235 | pass | |
| #235 Tilt clearance phones only when tilted | pw h.spec 235 (390 and 1440) | pass | |
| #235 Directions new tab | pw h.spec 235 | pass | |
