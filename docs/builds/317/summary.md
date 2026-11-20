## Summary

**What was built:** three code changes. Press now runs on a shared category listing module (one heading and tab per category with items). Media frames, including the hero and frames inside CMS lists, accept a video link and fall back to the image when it is empty or motion is reduced. The Offers slider works with any slide count (1 slide hides arrows and counter, 3 slides cycle).

Closes #317
Closes #318
Closes #319
Closes #320

## Go through with Stephen before merge

1. Should the designer round add the category attributes to Blog, Happenings and Packages? This build only switched Press.
2. Is a still (non-zooming) hero video fine? The video sits over the image and the hero zoom runs on the image underneath.
3. Should a one-slide Offers slider look any different from "arrows and counter hidden"?
4. Confirm on staging once the CMS-based Offers slider is built: the slider adds its wrapper class to the list's items wrapper.

## Known residuals

Nine review findings are left unfixed (two P2, seven P3), staged for your decision in [#354](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/354):
- P2 offers slider: an empty CMS list shows arrows and a placeholder counter (hidden before).
- P2 media video: the video covers the image straight away, hiding the hero zoom on load.
- P2 runtime reference doc lacks the new video module and slider rules.
- P3: two category lists on one page share one tab bar; every video loads at once; inline overflow on frames; no YouTube/Vimeo test; duplicate 390 Press test; import style.

## Follow-ups filed

- [#348](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/348) rebuild the script bundle at release (new behaviour does not ship until then)
- [#354](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/354) review residuals

## Visual review

Visual capture: 5 of 5 pages captured, visual round 1 of 2. Verdict: ready.

The capture ran against deployed staging, not this branch, because the bundle ships at release. New behaviour is covered by the Playwright specs; recheck /press, /history and / on staging after release.

## How it was validated

All 11 Done-when lines pass in held-out checks (28 of 28 Playwright tests at 390 and 1440, fixtures not live pages). Type check, factory tests and build pass.

## Post-deploy monitoring

After the bundle release, publish and check /press, /history, / and /dining/solana-coffee on staging.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
