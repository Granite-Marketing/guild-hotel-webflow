verdict: ship

What this change does: Editors can paste any Dropbox share link as a panel video link. The link reader turns it into a direct file link, so a plain video player can play it. In the hexagon scroll mask, a panel with a working video link now settles (scales from 1.2 to 1) as a whole frame, so the image and the video move together. Panels with no link, a blank link or a broken link behave as before.

Must fix: none.

Should fix: none.

Nice to have:
1. **Visual test needs the internet** (`tests/visual/scroll-enlarge-snap-video.spec.ts`)
   - What this is: The new browser test loads GSAP and Lenis from jsDelivr.
   - Problem: On a machine or CI run without network it fails for a reason unrelated to the code. The repo's other fixture tests do the same, so this is normal here.
   - Fix: None needed now.
   - If we skip it: A rare false red on offline runs.

2. **Small coupling** (`src/utils/scrollEnlargeSnap.ts:L55`)
   - What this is: The scroll mask now imports the frame selector and link check from `mediaVideo.ts`.
   - Problem: Two files now share one rule on purpose, which is right, since both must agree on what counts as a video frame. No bug.
   - Fix: None. Keep as is.

What I checked: all nine Dropbox link shapes, the look-alike domain guard (`notdropbox.com` stays untouched), YouTube/Vimeo/plain-file results unchanged, blank and broken links keep the image-only move, and the `DROPBOX_HOSTS` constant is only used at call time, so declaring it after the function is safe. Docs-only files in the PR were skimmed.

Verdict: Ship.
Lean: nothing to cut.
Not checked: real playback of a live Dropbox link (the test never plays a video).
