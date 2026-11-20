# Two-axis review (round 1, base 6e81090, head 11a8b07)

## Standards
- Hard (contract doc): docs/reference/runtime-modules.md:42-52 wired-modules table has a categoryListing row but no mediaVideo row (sectionVideo never had one either); the offersSliderSplit section (:1324) is not updated for Collection List wrapping, zero-slide no-op, `isolation: isolate`, or JS-added `swiper-wrapper` class. Only the source header documents them.
- Judgement: mediaVideo.ts:31-32 sets `position: relative` and `overflow: hidden` inline on the frame; CLAUDE.md "The Designer must show what ships" prefers Webflow classes or an embed. offersSliderSplit.ts:117 inline `isolation` (gsap-module-conventions prefers class toggles).
- Judgement: offersSliderSplit.ts:71 adds `swiper-wrapper` from JS to Webflow-owned DOM; prefer the class set in the Designer, at least document it.
- Nit: pressCategories.ts imports `'./categoryListing'`; every other module uses the `$utils/` alias.
- Checked clean: module pattern, naming, no window helpers, single Webflow.push call, no inline display:none.

## Spec
(a) Missing or partial
- #318 "Press looks and behaves as before ... at 390 and 1440 on /press": only a 390 Press test added (duplicate of existing assertions); no staging check evidenced.
- #319 "accepts the same links as the existing embed-video handling (file, YouTube, Vimeo)": only an mp4 is tested.
- #319 "Existing Dinings section videos still play at 1440 on /dining/solana-coffee": only a synthetic legacy fixture, which checks the element and box, not playback.
(b) Not asked for
- package.json `--experimental-strip-types` and tsconfig include narrowing (tooling).
- mediaVideo forces `overflow: hidden` on every frame (legacy Dinings and hero included) and copies object-fit instead of the old fixed `cover`.
- offersSliderSplit zero slides now returns early and leaves controls visible (base hid them); the new test pins that.
(c) Looks wrong
- categoryListing.ts:71 page-level tab bar fallback: two lists without in-root tabs overwrite each other, contradicting "Several lists on one page are supported".
- mediaVideo takes the first `img` in the frame for poster and crop.
- mediaVideo runs once at init; Collection List items loaded later (pagination, load more) get no video.

Summary: Standards 1 hard + 3 judgement; Spec 3 partial, 3 unasked, 3 doubtful. Worst: zero-slide offers regression and the hero zoom hidden under the video.
