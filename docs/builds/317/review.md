head: 11a8b07ce498d8791045faf83e7757fdda07c2f0
round: 1

## Actionable findings
- P2 #1 src/utils/offersSliderSplit.ts:65 Zero slides now leaves arrows and the placeholder counter visible; base hid controls for any count under 2 (autofix: gated_auto) fix: drop the early `if (slideCount === 0) return` (or move it below the total label and `slideCount < 2` hide branch) and update the empty-list spec in tests/visual/offers-slider-split.spec.ts:200 to expect hidden controls.
- P2 #2 src/utils/mediaVideo.ts:46 Video or iframe is laid over the image before it plays, so the hero zoom on load is hidden and YouTube shows its chrome flash; contradicts docs/solutions/design-patterns/hero-background-video-youtube-vimeo-poster.md (autofix: manual) fix: append the player at opacity 0 and reveal it after `player.ready` with a ~4s fallback, so the image and heroImageScale stay visible until playback.
- P2 #3 docs/reference/runtime-modules.md:42 Wired-modules table has no mediaVideo row, and the offersSliderSplit section (:1324) does not document Collection List wrapping, the JS-added `swiper-wrapper` class, `isolation: isolate` or zero-slide handling (autofix: manual) fix: add the mediaVideo row and extend the offersSliderSplit DOM contract.
- P3 #4 src/utils/categoryListing.ts:71 Page-level tab bar fallback means two lists without an in-root tab bar overwrite each other's tabs, contradicting the documented "several lists on one page" (autofix: manual) fix: fall back to the document tab bar only when exactly one list root exists, and add a two-list test.
- P3 #5 src/utils/mediaVideo.ts:34 Every video frame preloads `auto` and autoplays at init, including long Collection Lists (autofix: manual) fix: keep preload none/metadata and play/pause with an IntersectionObserver near the viewport.
- P3 #6 src/utils/mediaVideo.ts:28 `overflow: hidden` is now forced inline on every frame (legacy Dinings and hero included), a style the Designer cannot show (autofix: manual) fix: set position/overflow via a Webflow class on the frame, or limit the inline overflow to frames that lack it.
- P3 #7 tests/visual/media-video.spec.ts:1 Only an mp4 link is tested; the YouTube/Vimeo iframe branch the ticket names has no case (autofix: manual) fix: add a fixture frame with a YouTube link asserting an iframe covers the frame box.
- P3 #8 tests/visual/press-categories.spec.ts:148 The 390 Press test duplicates the existing Press assertions (autofix: manual) fix: fold 390 into the existing Press test via the viewport loop.
- P3 #9 src/utils/pressCategories.ts:11 Relative import `'./categoryListing'` where every module uses the `$utils/` alias (autofix: manual) fix: import from `$utils/categoryListing`.

## Spec
- "#318: B1: Press looks and behaves as before the change at 390 and 1440 on /press": runtime equivalence holds (same selectors and logic via the thin wrapper); only a 390 duplicate test was added, no staging evidence in the diff.
- "accepts the same links as the existing embed-video handling (file, YouTube, Vimeo)": implemented through embedVideo, tested for mp4 only (#7).
- "#319: Y2: the hero frame accepts the same video link and the hero image scale on load still runs": the animation runs but sits under the opaque video, so a visitor does not see it (#2).
- "#319: Y1: existing Dinings section videos still play at 1440 on /dining/solana-coffee": covered by a synthetic legacy fixture only (element and box, not playback).
- "#320: O1: with 1 slide no arrows or counter show": met; the zero-slide case regressed and the new spec pins the regression (#1).
- Not asked for: `overflow: hidden` on every frame and copying object-fit instead of the old fixed cover (#6); `isolation: isolate` on the slider (a real z-index fix, keep it but document it); package.json and tsconfig tooling changes.
- Looks wrong: multi-list tab bar fallback (#4); frames take the first `img` as poster; frames in Collection List items loaded after init (pagination, load more) get no video.

## Standards
- docs/reference/runtime-modules.md is the runtime contract doc CLAUDE.md points to ("Each module's DOM contract and its required init order are in docs/reference/runtime-modules.md"); mediaVideo is missing from its table and the offers contract changes are undocumented (#3).
- CLAUDE.md "The Designer must show what ships": inline `position`/`overflow` on frames (#6) and `isolation` on the slider container are runtime-only styles; judgement call, not a hard break.
- Module pattern, clean naming, no window helpers, one Webflow.push call, no inline display:none: all followed.

## Build vs buy lens
none (no approved libraries declared; the diff reuses the existing embedVideo and Swiper CDN global).

## Verdict
fix-first: the Offers slider regresses on an empty Collection List (arrows and stale counter show where they were hidden before), and the hero video hides the on-load zoom the Done-when says must still run.
