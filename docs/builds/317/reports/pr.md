# PR stage report: build 317

- Opened the pull request for the three tickets: shared category listing (Press moved onto it), video on media frames, Offers slider for any slide count.
- All 11 Done-when lines pass on fixtures (28 of 28 browser tests, 390 and 1440). Live staging was not loaded, because the script bundle ships at release (issue 348).
- Review found 9 smaller points (including empty-list slider controls and hero video hiding the zoom); they are filed as a residuals issue (354), not fixed here.
- At merge: go through the four product assumptions listed in the PR, then publish and recheck /press, /history and / on staging after release.
