## Round 2
- Restore dist/index.js to base 6e81090 instead of keeping the rebuilt bundle; alternatives: git revert f1b74e3; why: gate says dist is protected, checkout from base is exact and keeps later commits; landed: build branch commit
## Round 3
- Fix the held-out Offers flake by setting `isolation: isolate` on the `.swiper.offers` container; alternatives: reset slide z-index to 1/2 each change, hide controls until init; why: reproduced that incrementing slide z-index escapes the slider when Swiper's stylesheet does not give it a stacking context, so slides cover the arrows; one line contains every case; landed: 11a8b07
## Round 4
- Clear the dirty-tree gate by discarding the working-tree rebuild of dist/index.js rather than committing it; alternatives: commit the rebuilt bundle; why: Round 2 decision keeps dist at base (rebuild ships at release), HEAD already equals base; landed: working tree only
