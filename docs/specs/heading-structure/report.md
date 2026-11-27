# Heading structure round report (spec #419, 27 Nov 2026)

Tickets #422 (per-item pattern), #423 (shared parts) and #424 (pages) applied on staging and published. Full row-by-row result: `heading-check-2026-11-27.md` (the heading check against the SEO sheet, run after the last publish).

## Result

- 688 sheet rows: **563 pass** in the heading check (164 before this round). Every other row is correct on the page but the checker cannot match it, or the page changed since the sheet was written (both listed below). No row is left to do.
- Every page has exactly one H1. The checked pages keep their text and look: before and after screenshots at 390 and 1440 are pixel-identical for every changed block. The only differences were the live Google map tiles on Contact and the moving background behind the Zuma logo.
- Console clean on 15 pages, plus 404 and accessibility (the only console lines are Cloudflare's form captcha, not site code). Pop-ups open with their titles still announced, the FAQ opens and closes, and the rooms quiz and grid load.
- The scripts that used heading tags were released first (v1.3.30) and staging loads that version.

| Page | Pass | H1 | H2 found / sheet | H3 found / sheet |
|---|---|---|---|---|
| Arts | 65 of 69 | 1 | 5 / 5 | 6 / 6 |
| Blog | 26 of 29 | 1 | 7 / 7 | 9 / 9 |
| Contact | 17 of 18 | 1 | 2 / 2 | 6 / 6 |
| Corporate | 37 of 57 | 1 | 11 / 11 | 20 / 20 |
| Dining venue pages | 22 of 26 | 1 | 6 / 6 | 12 / 11 |
| Dining | 21 of 28 | 1 | 4 / 4 | 11 / 11 |
| Gallery | 20 of 22 | 1 | 3 / 3 | 6 / 6 |
| Guidelines | 19 of 21 | 1 | 5 / 5 | 6 / 6 |
| Happenings | 26 of 29 | 1 | 6 / 7 | 9 / 9 |
| History | 29 of 32 | 1 | 9 / 9 | 10 / 10 |
| Homepage | 38 of 47 | 1 | 11 / 11 | 15 / 15 |
| Meetings | 31 of 43 | 1 | 7 / 7 | 12 / 12 |
| Neighborhood | 38 of 44 | 1 | 12 / 12 | 13 / 11 |
| Packages | 28 of 30 | 1 | 7 / 7 | 10 / 10 |
| Press | 41 of 67 | 1 | 4 / 4 | 30 / 30 |
| Privacy, Accessibility | 9 of 10 each | 1 | 2 / 2 | 0 / 0 |
| Room pages | 24 of 27 | 1 | 7 / 7 | 6 / 6 |
| Rooms | 41 of 53 | 1 | 5 / 5 | 22 / 22 |
| Wellness | 22 of 26 | 1 | 3 / 3 | 10 / 10 |

Counts that differ: Happenings has one H2 fewer (the empty "conferences" category is not shown), the venue pages have one more H3 (Solana Coffee's fourth venue card), and Neighborhood has two more H3s (Corporate & services now lists four places, all H3).

## Designer steps (done by Stephen, 27 Nov)

Webflow's tools cannot bind a CMS field to an element inside a component. Stephen added the paragraph titles in the Offers Slider and the Arts & Culture Slider, and made the homepage retail slider a component again. Claude then removed the old H2s, deleted the empty "Retail Slider (old, unused)" component, published and checked: one H3 and four p on the retail slider, p for every offer and arts card title, and pixel-identical screenshots.

## How the tags were changed

- Webflow can only switch a heading between H1 and H6, so each "change to p" or "change p to H2" swapped in a new element with the same classes, text or binding, attributes and IDs, and removed the old one.
- Webflow cannot turn a box into a heading, so "change div to H3" rows (FAQ questions, homepage meeting tab names) and "wrap logo in H3" rows put the element inside an H3 that adds no layout of its own (`u-display-contents`).
- Per-item switch (offer cards): two opposite switches on Offers, "Title as heading" and "Title as text". See `docs/solutions/conventions/per-item-heading-tag.md`.
- Per-page switch (script-intro-centered): two opposite props, "Heading as heading" (default on) and "Heading as text". The Rooms template sets text, so the room pages' intro line is a p (row 2) while every other page keeps its H2.

## Rows that differ from the sheet

The site has changed since the sheet was written (20 Nov), mostly through the copy upload (#415). Where a row no longer fits, the page was left as it is now:

- **Corporate & services (Neighborhood), rows asking for second copies as p:** the section now has four different places and no repeated cards, so all four stay H3.
- **Venue pages, "other dining options" second copy (row 19):** there is only one such section now. It stays H2, and its venue names were changed from p to H3, as rows 9 to 11 expect.
- **Homepage, dining slideshow second copy (lobby terrace, solana coffee):** that copy no longer exists, so there is nothing to change.
- **Happenings, "conferences" category H2:** the category has no items, so the page does not show it.
- **"Keep, update text" rows and copy changes:** the tags are as the sheet says, but the checker reports "not found" where the wording changed in the copy upload (for example hero and intro lines, "Fitness Centre" for "fitness center", press article titles). Decision H3: wording follows the content docs.

## Checker mix-ups (correct on the page)

- Footer "dining" label (one row per page): the label is a p. The checker matches the "dining" link in the same footer first.
- Homepage "wellness" H2, corporate meeting space names H3, dining "garden terrace" and "solana coffee" H3: correct. The checker matched a nav link or tab with the same text first.
- Logo rows (homepage and Dining: Zuma San Diego, Lobby Bar, Pool Lounge): the logo sits inside an H3. The checker matched the venue photo, which has the same alt text, first.
- Pop-up rows (Venue, Place, Artwork, Artist pop-ups): every pop-up title and subheading is a p. Pop-ups sit outside page sections, so the checker cannot match them to the sheet's section.
- Press category labels and the rooms hover list: these are p. The checker attributes the text to the category tabs or to no section.

## Questions from the sheet's designer notes, for the SEO team

1. Homepage dining slideshow second copy: "Could you confirm what this second copy is (mobile layout or leftover)?" It is gone on staging, so only one copy carries the H3s. The name question still stands: "Lobby Bar" in the slideshow, "lobby terrace" as a meetings venue.

## Suggested H1 wording, for Kevin (not applied, decision H3)

| Page | H1 now | SEO team's suggestion |
|---|---|---|
| Homepage | the bold, handsome heart of san diego | The Guild Hotel: the bold, handsome heart of San Diego |
| Rooms | rooms & suites | Rooms & suites at The Guild Hotel, San Diego |
| History | Bold Promise, Bright Future | Our history since 1924: bold promise, bright future |
| Neighborhood | a city at your fingertips | Downtown San Diego: a city at your fingertips |
| Happenings | happenings | Happenings at The Guild Hotel |
| Blog | blog | The Guild Hotel blog, or Stories from The Guild |
| Packages | Packages | Hotel packages at The Guild, or Packages and offers at The Guild Hotel |
| Press | press | Press and media, or The Guild Hotel in the press |
| Gallery | gallery | Photo gallery of The Guild Hotel |
| Dining venue pages | zuma san diego, lobby bar, ... | Adding "at The Guild" could help (content team decision) |
