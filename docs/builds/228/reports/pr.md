# PR stage
Opened the pull request for the six mobile feedback code fixes (#230 to #235), all pass the checks (`pnpm check`, `pnpm test:factory` 38/38, `pnpm build`).
At merge you go through 9 assumptions (timings, which gallery, desktop tilt) and 1 unverifiable item (Corporate row images wait on the Webflow ticket).
The iPhone scroll-jump fix is unproven on Safari; test on a real iPhone at release.
10 review findings (2 P2, 8 P3) are left unfixed, staged as a decision issue.
`dist` is deliberately not rebuilt here; a follow-up rebuilds it after merge.
