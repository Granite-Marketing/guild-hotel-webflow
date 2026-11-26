verdict: ship

What this change does: It adds two read-only tools. The copy map matches each line of the client's 20 content docs to a place on the site and writes a map plus a summary. The copy check then loads each mapped page on staging (headless, 1440 wide) and marks every row done, differs, missing or unchecked. Shared helpers moved out of the catalogue script. I assumed one person running these by hand, not many users.

Must fix: none.

Should fix:
1. **A loose "done" for rows with no known target** (`scripts/api/webflow/lib/copy-check.mjs`, last line of `locateOnPage`)
   - **What this is:** When a row has no locatable target, it is marked done if any text element on the page equals the new text.
   - **Problem:** A short line such as "Discover More" can match somewhere else on the page, so a row can read done when its real place is still old. The code comment already names this limit.
   - **Fix:** Leave as is for now. If the report ever shows suspicious "done" rows with no target, mark them "confirm" instead of done.
   - **If we skip it:** A few rows may look finished when they are not. Low odds, low cost.

Nice to have:
2. **Generated files are large** (`docs/specs/guild-content/catalogue/copy-map.json` 32k lines, `copy-check.json` 8.6k lines)
   - **What this is:** Output files committed with the code.
   - **Problem:** They make the PR hard to read and go stale at the next doc change.
   - **Fix:** Keep them (the issue asks for output beside the catalogue); just do not review them line by line.
   - **If we skip it:** Only a noisy diff.

Checked: the 52 tests for copy map and copy check pass. Read the check, browser, report and CLI code. The check only does page loads (GET) and reads no tokens, so it cannot write to Webflow. The helper move out of `catalogue.mjs` keeps the same behaviour. No bugs, security or load problems found.

Verdict: Ship.
Lean: no cuts needed.
Not checked: the correctness of the 1,000+ generated map rows against the real docs (that is the validator's job).
