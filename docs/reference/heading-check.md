# Heading check

Reads the SEO team's sheet export (`docs/specs/heading-structure/source/`, one CSV per tab) and the staging site, and marks every sheet row passed, failed or not found. Built for spec #419; the Designer tickets loop on it until every row passes.

## Run it

```
pnpm heading-check                      # report on screen
pnpm heading-check --out report.md      # report to a file
pnpm heading-check --fixtures <dir> --sheets <dir>   # saved pages and a sheet folder instead of staging
```

It is read only: headless page loads and link crawling (GET) are the only network use. It makes no Webflow API calls and reads no tokens. A test fails if its sources gain an API host, token read or write verb. A full run takes about three minutes.

## What it reports

1. Per row: **passed** (the element holding the row's text has the proposed tag; `p` means a paragraph; "Wrap logo in H3" means an H3 that contains the logo image, found by its alt text), **failed** with the tag found, or **not found** (with the section the text was seen in, when it is only in a section that does not fit the row).
2. Per page: H1, H2 and H3 found against the tab's proposed counts. Rows proposed as `p` do not count as headings. Privacy and Accessibility share one tab: a row named "<page> page" counts for that page only, the rest for both.
3. Per page: every h1 to h3 that no row covers.
4. Shared parts: every other room and venue page, plus every crawled page with no tab (404, accessibility, packages, posts, legal and corporate items), compared with the homepage for the footer, the booking and newsletter band, the offers slider and the FAQ. A page is listed when a part is missing, a class in it uses other tags than on the homepage, or a class appears on only one side (shown as "none" on the other). A part the homepage does not have, or every part when the homepage does not load, is reported as "baseline missing, comparison not done" and counted in the summary, never as "no page differs".

## How rows are matched

- By section and text, ignoring case and punctuation. Among elements with a row's text, the one whose page section (its `section_` class) fits the row's sheet section wins: first the page section learned from that sheet section's rows whose text appears once, then a shared word of three letters or more ("Footer" and `section_footer-links`). A label is learned only when no page section shares a word with it. When some element on the page sits in a section that fits the row, a same-text element in a section that does not fit is never taken (the row is not found); only when nothing on the page fits the label does the match use text and page order alone. Repeated texts in the same section match in page order.
- Repeated texts match in page order: each row takes the next unused element after the previous match.
- Logo rows (`Zuma (logo, alt text "Zuma San Diego")`) match on the alt text. Template rows (`[room name], e.g. Cozy Queen`) match on the example, so a template tab is checked on the listed page whose last path segment is the example's slug (`Cozy Queen` gives `/rooms/cozy-queen`), else the one sharing most words with it, fewest extra words first (`zuma san diego` gives `/dining/dining-zuma`), else the first listed path. The tab's other pages go to the shared-part check.
- Pages are loaded at 1440 wide and scrolled once so lazy content renders. Hidden copies (second slideshow copies, tab panels) are in the page and are matched like any other element, as the sheet expects.

## Files

- `scripts/api/webflow/heading-check.mjs`: command line, page discovery, report assembly.
- `scripts/api/webflow/lib/heading-check.mjs`: pure logic (sheet parsing, matching, counts, shared-part diff).
- `scripts/api/webflow/lib/heading-check-browser.mjs`, `heading-check-report.mjs`: in-page collector and markdown report.
- `tests/factory/heading-check.test.mjs` with `tests/factory/fixtures/heading-check/`: run by `pnpm test:factory`.

Known limits: a sheet row whose text was changed on staging (the copy spec #418 rewrote some) shows as not found, which is the right signal until the sheet or the page is brought back in line.
