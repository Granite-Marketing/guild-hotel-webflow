# Implement report: build 317 (fix round 3)

- All three tickets (shared category listing with Press moved onto it, video on media frames, Offers slider for any slide count) are merged on the build branch with their Playwright specs.
- The last validation found the Offers arrows sometimes did nothing. Cause found and reproduced: after a slide change the slides could stack above the arrows and catch the click. One-line fix; the slider now keeps its layers to itself.
- All Offers, media video and Press checks pass on two runs each; type check passes.
- At merge: the published script bundle is unchanged (protected); the new behaviour ships when the release rebuilds it (issue #348). Four product assumptions are listed for merge.
- Round 4: the gate stopped on a leftover rebuilt script bundle in the working folder. Put back the committed copy; no code changed, type check passes.
