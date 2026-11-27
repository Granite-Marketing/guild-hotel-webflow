verdict: ship

What this change does: Three small runtime changes let SEO change a heading tag (h2, h3, p) without breaking pop-up names, room card hover reveal or the rooms quiz focus. Each now finds its element by class first, then falls back to the old h-tag lookup. It also adds a read-only heading check script that compares staging pages with the SEO sheet, with tests and saved page fixtures. Load assumed: one person running the script by hand, and a normal web visitor for the site code.

Must fix: none.

Should fix: none.

Nice to have:

1. **The crawl stops quietly at 400 pages** (`scripts/api/webflow/heading-check.mjs`, `discoverPaths`, `MAX_PAGES`)
   - **What this is:** The check finds every page by following links, up to 400 pages.
   - **Problem:** If the site ever grows past 400, pages after that are never checked and the report does not say so. A page that answers with an error is also skipped without a note.
   - **Fix:** Print one line when the limit is hit.
   - **If we skip it:** A report could look complete when it is not. The site is far below 400 pages today.

2. **The same "class first, tag second" lookup is written three times** (`src/utils/modals.ts`, `roomGridHoverReveal.ts`, `roomsQuiz.ts`)
   - **What this is:** Each file has its own pair of selectors and its own `a ?? b` lookup.
   - **Problem:** Nothing is wrong today. The copies are tiny and each file stands alone, so a shared helper would add more than it saves.
   - **Fix:** Leave as is.
   - **If we skip it:** Nothing.

Checked: the selectors against the live markup in the catalogue (the quiz class sits on the panel h2, so it picks the same element as before), all callers of the changed lookups, and the matching logic edge cases (no candidates, no fitting section, repeated text).

Verdict: Ship.
Lean: -0 lines worth cutting. The 35 build record files under `docs/builds/419/` are the pipeline's normal output.
Not checked: staging run against the real sheet; I did not run the tests or the browser.
