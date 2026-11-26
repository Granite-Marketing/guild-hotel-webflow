## Summary

Closes #419
Closes #420
Closes #421

**What was built.** Scripts and pop-ups no longer depend on a title being an h1 to h6: pop-up titles, room card names and quiz panel headings are found by their role first, with the old heading lookup as fallback, so the SEO team can change tags freely. A new read-only heading check compares each of the 19 sheet tabs with the staging pages (tags, H1/H2/H3 counts, uncovered headings) and flags pages whose shared parts differ from the homepage.

## Go through with Stephen before merge

1. Any other pop-up whose title becomes a paragraph needs `data-modal-title` added in the Designer; is that fine for the Designer tickets?
2. Room grid and quiz titles are found by their current heading classes, falling back to h2 or h3. Keep those classes when the tags change?
3. The heading check matches rows by sheet section as well as text. OK as the matching rule?
4. Shared parts are the footer links, booking and newsletter band, offers slider and FAQ. Should a page that simply lacks a part (the 404, four dining venues without the offers slider) count as a difference?
5. Template rows match on the example text, and rows proposed as `p` are left out of the proposed counts. Fine?

## Known residuals

- P3 `docs/reference/modal-setup.md:31`: the new title attribute is prose only, not a table row.
- P3 `scripts/api/webflow/heading-check.mjs:57`: copies copy-check's page loader and the where-used crawl.
- P3 `scripts/api/webflow/heading-check.mjs:47`: crawl stops at 400 pages silently and the command always exits 0.

Staged for your decision: [#458](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/458).

## Follow-ups filed

[#458](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/458)

## Visual review

Visual capture: 2 of 3 pages captured, visual round 2 of 2. Verdict: ready.

| Route | Width | Verdict | Image |
|---|---|---|---|
| `/` | 390 | ok | `home-phone.png` (local) |
| `/` | 1440 | ok | `home-desktop.png` (local) |
| `/rooms` | 390 | ok | `rooms-phone.png` (local) |
| `/rooms` | 1440 | ok | `rooms-desktop.png` (local) |
| `/tests/visual/fixtures/heading-tags-420.html` | - | not captured: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404) |  |

**Findings:** none

**Not captured:** /tests/visual/fixtures/heading-tags-420.html: Playwright fixture served by the test web server, not by the staging site the capture uses (HTTP 404). The paragraph-title cases (pop-up name, room hover reveal, quiz focus) are not judged visually; the Playwright spec covers them.

**Kept local:** none

Images marked local stay on the build machine, in visual run `run-4` of this build.

## How it was validated

Typecheck, factory tests (139 pass, 0 fail) and bundle build pass; held-out criteria 13 of 13 pass; new Playwright tests fail on the old code.

## Post-deploy monitoring

No additional operational monitoring required: the heading check never writes to Webflow, and the script changes only fall back to the old lookup.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
