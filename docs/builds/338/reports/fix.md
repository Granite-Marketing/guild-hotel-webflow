# Fix stage, round 1 (#338)

Applied the one blocking finding: the text switch no longer undoes the split text animation by hand, which the repo's rules forbid.

- How it works now: when Night or Day changes a split heading, the animation library re-splits it itself and the new text is written at the right moment inside that step. A later screen resize keeps the night text instead of bringing the day words back.
- The hero reveal still replays after a switch; scroll reveals keep whatever state the scroll position gives them.
- New check: Night, Day, Night, then a window resize, at phone and desktop widths: every line appears once with the right text. All 20 day and night checks pass, plus the existing line mask and hero checks.
- The P2 and P3 findings were not touched; they stay as residuals for you to decide on.

Nothing new to decide at merge from this stage.
