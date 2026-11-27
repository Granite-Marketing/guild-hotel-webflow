# SEO review of staging, 27 Nov 2026

Read-only check of `the-guild-hotel-c34e71.webflow.io` against the SEO team's heading sheet (`source/*.csv`). Headless Chromium, 1440 wide, all headings and images read after scrolling the page. Heading wording follows the content docs; only tags are judged against the sheet.

Coverage: 46 live pages (18 static pages, 12 rooms, 5 dining venues, 4 packages, 6 happenings stories, plus the legal page, which the sheet does not list). Not covered: the `/quiz-options/*` links in the rooms quiz return 404 (see section 4). No `/sitemap.xml` exists on staging (404), so the page list comes from the sheet plus links found on the site.

## 1. Heading problems by page

Clean across all 46 pages: exactly one H1, no skipped levels (no H2 to H4), and the same visible text is never tagged differently on two pages of the same template. The only same-text, different-tag cases are the expected ones: a room, venue, package or story name is H1 on its own page and H3 in lists elsewhere.

Most of the sheet's tag changes are in place (footer, booking and newsletter labels are no longer headings; offers slider is H2 on every page; FAQ questions are H3; room grid, wellness tabs and venue lists are H3). Rows where live still differs from the sheet or breaks its rules:

| Page | Problem |
|---|---|
| `/` (home) | 3 empty H3s (the dining slideshow logos for Zuma, Lobby Bar, Pool Lounge). The sheet says wrap the logo in an H3 with the alt text as heading text; live has the H3 with no text at all. |
| `/dining` | Same 3 empty H3s (Zuma, Lobby Bar, Pool Lounge logos). |
| `/rooms` | Hidden duplicates in the grid: "deluxe king suite" twice and "guild corner loft suite" twice (the second is the CMS room of the same name), plus "premium twin room", which has no room page. Hidden H2 "OUR RECOMMENDATIONS" sits next to the sheet's visible "our recommendations for your stay" row. Breaks "each heading only once". |
| `/history` | H2 "A Landmark Reimagined" is hidden at 1440 (hidden headings still count for Google). |
| `/wellness` | H3 "Fitness Centre" differs from the sheet's "fitness center" (spelling, content team to settle). |
| `/neighborhood` | H3 "dining 1", "dining 2", "dining 3" are placeholder text. Convention Center, Superior Court and Hall of Justice titles are typed in capitals. |
| All 12 room pages | H2 "deluxe king suite gallery" on every room, including the other 11 (wrong room name from the sheet's own sample text and copied through). H2 "room description" is a label, not a section title. |
| `/dining/solana-coffee` | Gallery H2 is just "gallery", the other four venues say "<venue> gallery". |
| `/legal-corporate/corporate` and `/legal` | Not in the sheet for legal. Both have the same structure; the "council boardroom" and three other pop-up venue names are H3s (hidden). The sheet marks pop-ups p; matching by text is ambiguous with the visible Meetings list, so check in the Designer. |
| 404 page | No H1, and one H3 only. |
| Typed case (sheet rule 6) | Headings typed in all capitals: 26 across 14 pages (examples: "KEY FEATURES", "WHY TEAMS CHOOSE THE GUILD", "MEETINGS AND EVENTS AT THE GUILD", "EXCITEMENT AT YOUR DOORSTEP", "ART & STORIES", "THE GUILD GALLERY", "GUILD PRESS ROOM", "THE GUILD OPENS ITS DOORS"). Headings typed in all lowercase: 235 across all 46 pages (many are the repeated section labels), including the H1 on 13 pages: Home, Rooms, Wellness, Happenings, Contact, Guidelines, Privacy, Accessibility and the 5 dining venues. |
| Missing spaces in heading text | "Stay a littlelonger" (Packages), "Proud stewardsof city spirit" (History), "Thank you for choosingthe Guild Hotel..." (Guidelines). A line break with no space between words; Google may read these as joined words. |
| `/press` | 30 H3s: article headlines plus quote fragments ("A real respite from the crowds...", "...military history of the city..."). Not in the sheet. A long list of quotes as H3 is noise; the SEO team should say if they want it. |
| `/contact`, `/guidelines`, `/press`, `/privacy-policy`, `/accessibility` | Not in the sheet's tag tables (no proposed tags), so nothing to compare. |
| Every page except privacy, accessibility and packages items | The same 6 room FAQ questions ("How many guests can stay in this room?", "Will my room look exactly like the photos?"...) sit as hidden H3s on Home, Dining, Press, Contact, Guidelines and so on. Repeated across ~40 pages, and wrong for non-room pages. |

## 2. Titles and descriptions

Titles: none missing, none duplicated, one over 60 characters.
- Over 60: "The best San Diego hotels for every kind of traveler | The Guild Hotel" (70), a happenings story.
- Generic, with no place or keyword: Corporate, Legal, Happenings, Packages, Blog (22 to 28 characters). The sheet proposes better titles for Rooms, Dining, Wellness and others, and those are live.
- Room pages use only the room name ("Cozy Queen | The Guild Hotel"), no "San Diego" or "room".

Descriptions: none missing on real pages, none over 160 (longest 154). Problems:
- Duplicates (2 groups of exact duplicates):
  - `/rooms/placeholder-single-1` and `/placeholder-single-2` ("Placeholder room for the rooms quiz. Remove before launch.").
  - Happenings stories: 4 stories share "Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non." (locals-night-at-rodeo-bar, historical-tours, autumn-at-spa-adolphus, whats-on-in-san-diego-this-autumn, where the last repeats it twice); 2 stories share "Praesent id ipsum enim..." (guide-to-dining, best-san-diego-hotels). All 6 are lorem ipsum.
- Placeholder wording live: all 4 package items ("A placeholder package for two...").
- Too short to be useful (under 40 characters): all 12 rooms (18 to 36 characters, taglines such as "Perfectly Intimate", "A Queen with a view"), Corporate (41), Garden Terrace (44). Rooms are the page type most likely to be searched by name, so these matter.
- Dining venue descriptions are also taglines (44 to 79 characters), not descriptions.
- Rooms, Dining venues, Happenings stories and Packages items are the CMS-driven ones; fix in the CMS fields.

## 3. Images missing alt

No `<img>` is missing the alt attribute (0 of 2,622 across the crawl). The gap is images with empty alt (`alt=""`), which tells search and screen readers "decorative". Counts below leave out map tiles, spacers and the 10 photos that repeat on almost every page (shared offers/footer-area images, empty alt on all 10).

| Page | Visible content images with empty alt | Examples |
|---|---|---|
| `/press` | 24 (48 incl. hidden duplicates) | article thumbnails "521587504.jpg", "large_The_13_Best_Hotels...", "DSC0650-1.webp" |
| `/neighborhood` | 15 | area and dining photos from the CMS (`6b00457271a28209f01dd173...`, `6aea1fc6...`) |
| `/meetings` | 1 visible (26 hidden spacer SVGs, ignore) | |
| `/` | 5 | offers and retail slider photos |
| `/dining` and 5 venue pages | 1 on `/dining`, 4 to 5 on each venue page | the "other venues" and "more of the guild" cards |
| `/packages` and 4 package items | 3 on the list, 4 on each item | cards in the offers slider |
| `/history` | 1 | `guild-history-s...` image |
| 12 room pages | 1 each | `arrow-back.svg` (a back arrow, decorative is fine) |
| `/wellness` | 2, hidden | tab images |
| 404 page | 1 | `page-not-found.svg` |

The 10 shared images are the biggest single fix: one change in the shared component covers every page. Google Maps tile images on Meetings, Corporate, Legal and Neighborhood have empty alt and cannot be fixed (third-party embed).

## 4. Other launch SEO gaps

1. **Canonical tag: missing on all 46 pages.** Webflow adds it on the custom domain when set; confirm it does after the domain is connected.
2. **og:image: missing on all 46 pages.** Social shares will show no picture. Set a default in Site Settings and a per-page image for rooms, dining and stories.
3. **og:title and og:description: missing on `/happenings`, `/packages` and `/blog`** (the other 43 have them).
4. **JSON-LD / schema: none on any page.** A hotel should have `Hotel` (or `LodgingBusiness`), `Restaurant` for Zuma and the other venues, `FAQPage` for the FAQ, and `BreadcrumbList`. Needs a decision on who writes it.
5. **No sitemap on staging** (`/sitemap.xml` returns 404). Webflow auto-generates it on the live domain only if enabled in Site Settings; check it is on, and that the placeholder pages are excluded.
6. **Staging is blocked from search** (`robots.txt` says `Disallow: /`), as expected. Check this is lifted on the live domain.
7. **Quiz option pages return 404** (14 `/quiz-options/*` links on the rooms page, e.g. `/quiz-options/couples-getaway`; one tested, all assumed the same). Likely a CMS collection with no template page, or links to a collection that should not be public. Broken internal links at launch.
8. **Placeholder content still live:** 2 placeholder rooms (`/rooms/placeholder-single-1`, `-2`, description says "Remove before launch"), 4 placeholder packages, 6 lorem ipsum happenings stories, "dining 1/2/3" headings on Neighborhood, "deluxe king suite gallery" on every room. All indexable the moment the site goes live.
9. **404 page** has no H1 and no description (fine for noindex, but it should have an H1 "Page not found").
10. `<html lang="en">` is set on all pages. No issue.

## 5. Things only the client or SEO team can decide

1. Remove or hide the placeholder rooms, packages and stories before launch, or give them real content (and unique descriptions).
2. Write real meta descriptions for the 12 rooms, 5 venues, 4 packages, 6 stories and Corporate and Legal (an SEO team job, about 150 characters each).
3. Which image is the default for social shares, and which per page type.
4. Whether to add schema (Hotel, Restaurant, FAQ) and who owns it.
5. Whether the FAQ should be the same six room questions on every page, or page-specific. The sheet keeps them as H3 everywhere; the questions themselves are about rooms and wrong on Contact, Press and Dining.
6. Typed case for headings: the sheet asks for normal case with CSS lowercase, but live headings are typed in a mix of lowercase and capitals. A content decision, since changing the text changes what shows if the design relies on it.
7. Whether the Press page's 30 quote and headline H3s should stay as headings.
8. Rooms gallery heading wording (the placeholder "deluxe king suite gallery" repeated on all rooms) and the "room description" label heading.
9. Spelling: "Fitness Centre" (live) vs "fitness center" (sheet); US or UK spelling site-wide.
10. Whether "premium twin room" and the second "deluxe king suite" on Rooms are real rooms. They have no pages.
