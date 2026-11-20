verdict: ship

What this change does: It turns the Press category grouping into a shared module (`categoryListing.ts`) that any listing can use through generic attributes. It adds `mediaVideo.ts`, which plays a video over any frame with a video link and replaces the old Dinings-only module. It also lets the offers slider work with 3 slides, 1 slide, or slides inside a Collection List. Press and Dinings keep their old markup working. The rest of the PR is build notes under `docs/builds/`.

Must fix: nothing found.

Should fix:
1. **Two listings on one page share one tab bar** (`src/utils/categoryListing.ts`, tab bar lookup near the end)
   - What this is: The module claims several lists per page work. If a list has no tab bar inside it, it falls back to the first tab bar on the page.
   - Problem: Two lists with one outside tab bar each rebuild the same bar, so the second list erases the first list's tabs. Heading ids can also repeat across lists.
   - Fix: Say in the header comment that a tab bar must sit inside its list (and drop the page-wide fallback), or support one list per page only.
   - If we skip it: Fine today, since only Press uses it. It bites the first time a second listing goes on a page with a shared tab bar.

Nice to have:
2. **Tab bar fallback is a quiet guess** (same file)
   - What this is: A missing tab bar inside the list silently picks any bar on the page.
   - Problem: A wrong match is hard to spot.
   - Fix: Same as 1, which deletes one line.
   - If we skip it: No effect today.

Checked and fine: Press attributes map one to one onto the shared module; an empty video link and reduced motion both leave the image alone; the legacy Dinings marker still works; the video copies the image's crop; the offers slider returns early on zero slides, hides controls on one, and the stacking fix keeps arrows clickable; the tsconfig and `test:factory` changes match the Node 22 in use.

Lean: -2 lines possible.
Not checked: live pages at 390 and 1440 (the pipeline's own visual review covers that).
