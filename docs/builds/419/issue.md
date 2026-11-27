# Spec: Heading structure for SEO, from the SEO team's sheet (26 Nov)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/419
Snapshot: 2026-11-26 20:14

### Intent

Every row of the SEO sheet is applied verbatim on staging, with the same classes so the pages look the same. Shared parts are changed once. Where one shared element needs different tags on different items or pages, a per-item tag setting is added that editors control. Before any tag changes, the site's scripts stop depending on heading tags, so nothing that finds a heading breaks. A heading check reads staging and proves every row.

Stephen's words and decisions: `docs/specs/heading-structure/notes.md` (H1 to H4). Sheet export: `docs/specs/heading-structure/source/`. Every row joined to its live element, with the five clashes marked: `docs/specs/heading-structure/element-map.md`.

### Done-when

- #420: Pop-ups: a dialog whose title is a paragraph (no h1 to h6) still gets its accessible name from that title; the title is found by its role in the pop-up's markup (class or data attribute), with the current heading lookup kept as a fallback.
- #420: Room grid hover reveal: works the same when the card's name is a paragraph instead of an h2 or h3.
- #420: Rooms quiz: each panel's heading still receives focus when it is a paragraph instead of an h2 or h3.
- #420: Script reveal and line mask keep working on an element that changes between div, p, h2 and h3 (they already include p; confirm a div turned h3 is picked up as intended).
- #420: Each case has a Playwright test on a fixture page beside the existing modal, room and rooms quiz specs. The two rooms quiz tests already failing on main (#251, #284) are not this ticket's to fix and must not be changed.
- #420: Typecheck and the bundle build pass.
- #421: For each of the 19 tabs, the check loads the tab's page on staging headless (room pages: one room; venue pages: one venue; Privacy & Accessibility: both pages) and matches each row to its element by section and text, ignoring case and punctuation; repeated texts match in page order.
- #421: Each row is passed (the element's tag equals the proposed tag; "p" means a paragraph; "Wrap logo in H3" means an H3 containing the logo with its alt text) or failed with the tag found, or not found.
- #421: Per page it reports H1, H2 and H3 counts against the tab's proposed counts, and lists every h1 to h3 on the page that no row covers.
- #421: It also checks every other room and venue page and the pages with no tab (404, accessibility, each package, post, legal and corporate item) for the shared parts' tags, reporting any page whose footer, booking and newsletter band, offers slider or FAQ tags differ from the homepage's.
- #421: The check never writes to Webflow.
- #421: Tests against a small sheet fixture and saved page fixtures cover pass, fail, not found, repeated text and a wrapped logo. They run in the factory test command.

### Constraints

- **Scripts first (code).** Modules that find a heading by tag (pop-up title for screen readers, room grid hover reveal, rooms quiz focus) find it by its class or a data attribute instead, so a tag change cannot break them. Released to staging before any tag changes.
- **Heading check (code).** Reads the sheet export and crawls staging headless; matches each row to its element by page, section and text, and reports pass (tag as proposed) or fail, plus per-page counts and every element whose tag is not in the sheet. Rich text headings (privacy, accessibility) are checked by their text.
- **Per-item tag pattern (Designer).** Webflow cannot bind a heading's tag to a CMS field. The pattern to prove: inside the component, the heading and a paragraph with the same class, bound to the same text, each shown by a visibility prop; on CMS lists the prop is bound to a new switch field ("Title as heading"). It is proven only if the hidden one is absent from the published HTML, not just hidden. If the Designer offers a tag prop that does this directly, use it instead. The chosen pattern goes into the repo's solutions docs.
- **Shared parts (Designer).** Each shared element changed once in its component, same class.
- **Pages and templates (Designer).** Every remaining row, tab by tab, verbatim, using the per-item pattern where the element map marks a clash.
- **Same look is checked, not assumed.** Webflow's site-wide tag styles can change size or spacing when the tag changes under a class. Each changed element is screenshotted before and after at 390 and 1440 and any difference is fixed on the class.

- A good test checks behaviour a visitor or reader gets: a pop-up still has its accessible name when its title is a paragraph; the hover reveal and quiz still work with a paragraph card title.
- Existing Playwright specs and fixture pages for modals, room grid and rooms quiz are the prior art; add the paragraph-title case to each.
- The heading check is tested against saved live page fixtures and a small sheet fixture.
- Designer tickets are proven with the heading check on staging plus before and after screenshots at 390 and 1440.

### Entry points

_No response_

### Non-goals

- Wording changes (copy spec #415). Meta titles and descriptions (PR #408). Styling changes. Pages with no tab, beyond what shared parts change on them.

### Tickets

- #420 Scripts stop finding headings by their tag (open)
- #421 Heading check: compare staging with the SEO sheet (open)

### Spec (as filed)

## Problem Statement

The SEO team reviewed staging and found the heading outline unclear: most pages carry 14 to 35 H2s (Arts has 61), because slider cards, repeated offers, pop-ups, the booking and newsletter band and the footer labels are all headings, while real items such as event spaces and FAQ questions are plain text. Their sheet gives, page by page, each element's current tag, the proposed tag and why (681 rows over 19 tabs). Many of those elements are shared parts, so changing one on one page changes it everywhere, and a few shared elements need different tags in different places.

## Solution

Every row of the SEO sheet is applied verbatim on staging, with the same classes so the pages look the same. Shared parts are changed once. Where one shared element needs different tags on different items or pages, a per-item tag setting is added that editors control. Before any tag changes, the site's scripts stop depending on heading tags, so nothing that finds a heading breaks. A heading check reads staging and proves every row.

Stephen's words and decisions: `docs/specs/heading-structure/notes.md` (H1 to H4). Sheet export: `docs/specs/heading-structure/source/`. Every row joined to its live element, with the five clashes marked: `docs/specs/heading-structure/element-map.md`.

## Stephen's later words (override older rules)

- H1: replicate the SEO team's sheet verbatim, including rows where a shared element needs a different tag in one place.
- H3: no wording changes here; "Keep, update text" rows keep the content docs' wording (copy spec #415, C2).

## User Stories

1. As a search engine, I want one H1 per page, an H2 per main section and H3s for the items inside, so that I can read the page's outline.
2. As a screen reader user, I want to jump between real sections and items, not slider cards and footer labels.
3. As the SEO team, I want every row of our sheet applied exactly as written.
4. As Stephen, I want each shared part (footer, booking and newsletter band, offers slider, FAQ, card carousel, hero) changed once, so that every page that uses it is fixed together.
5. As Stephen, I want every page a shared change touches listed, including pages with no tab in the sheet (404, accessibility, package, post, legal and corporate items).
6. As an editor, I want a setting on the items that need it (offer cards, corporate services cards, meeting tab items, venue page "other dining options") to choose heading or paragraph, so that one element can be an H3 in one place and a paragraph in another.
7. As Stephen, I want the per-item pattern proven on one element and written down before it is used everywhere.
8. As a visitor, I want every page to look exactly the same after the tags change.
9. As a visitor, I want pop-up titles still announced, the room grid hover and the rooms quiz still working after headings become paragraphs or the reverse.
10. As Stephen, I want hidden copies (second slideshow copies, tab panels, mobile copies) tagged as the sheet says, since Google reads them.
11. As Stephen, I want the venue logo cards (Zuma, Lobby Bar, Pool Lounge) wrapped in H3s whose text is the logo's alt text.
12. As Stephen, I want a heading check that reads staging and marks every sheet row passed or failed, with H1, H2 and H3 counts per page against the sheet's proposed counts.
13. As Stephen, I want rows that cannot be done as written listed with the reason, never quietly changed.
14. As Kevin, I want the sheet's suggested H1 wording listed for my decision.

## Implementation Decisions

- **Scripts first (code).** Modules that find a heading by tag (pop-up title for screen readers, room grid hover reveal, rooms quiz focus) find it by its class or a data attribute instead, so a tag change cannot break them. Released to staging before any tag changes.
- **Heading check (code).** Reads the sheet export and crawls staging headless; matches each row to its element by page, section and text, and reports pass (tag as proposed) or fail, plus per-page counts and every element whose tag is not in the sheet. Rich text headings (privacy, accessibility) are checked by their text.
- **Per-item tag pattern (Designer).** Webflow cannot bind a heading's tag to a CMS field. The pattern to prove: inside the component, the heading and a paragraph with the same class, bound to the same text, each shown by a visibility prop; on CMS lists the prop is bound to a new switch field ("Title as heading"). It is proven only if the hidden one is absent from the published HTML, not just hidden. If the Designer offers a tag prop that does this directly, use it instead. The chosen pattern goes into the repo's solutions docs.
- **Shared parts (Designer).** Each shared element changed once in its component, same class.
- **Pages and templates (Designer).** Every remaining row, tab by tab, verbatim, using the per-item pattern where the element map marks a clash.
- **Same look is checked, not assumed.** Webflow's site-wide tag styles can change size or spacing when the tag changes under a class. Each changed element is screenshotted before and after at 390 and 1440 and any difference is fixed on the class.

## Testing Decisions

- A good test checks behaviour a visitor or reader gets: a pop-up still has its accessible name when its title is a paragraph; the hover reveal and quiz still work with a paragraph card title.
- Existing Playwright specs and fixture pages for modals, room grid and rooms quiz are the prior art; add the paragraph-title case to each.
- The heading check is tested against saved live page fixtures and a small sheet fixture.
- Designer tickets are proven with the heading check on staging plus before and after screenshots at 390 and 1440.

## Out of Scope

- Wording changes (copy spec #415). Meta titles and descriptions (PR #408). Styling changes. Pages with no tab, beyond what shared parts change on them.

## Further Notes

- Blocked by the copy spec's live ticket #418, so copy and tags never edit the same page at once (H4).

#### Ticket #420: Scripts stop finding headings by their tag

## Parent

#419

## What to build

The site's scripts stop finding headings by their tag, so the SEO tag changes (H2 to p, div to H3) cannot break them. Read `docs/specs/heading-structure/notes.md` first.

## Acceptance criteria

- [ ] Pop-ups: a dialog whose title is a paragraph (no h1 to h6) still gets its accessible name from that title; the title is found by its role in the pop-up's markup (class or data attribute), with the current heading lookup kept as a fallback.
- [ ] Room grid hover reveal: works the same when the card's name is a paragraph instead of an h2 or h3.
- [ ] Rooms quiz: each panel's heading still receives focus when it is a paragraph instead of an h2 or h3.
- [ ] Script reveal and line mask keep working on an element that changes between div, p, h2 and h3 (they already include p; confirm a div turned h3 is picked up as intended).
- [ ] Each case has a Playwright test on a fixture page beside the existing modal, room and rooms quiz specs. The two rooms quiz tests already failing on main (#251, #284) are not this ticket's to fix and must not be changed.
- [ ] Typecheck and the bundle build pass.

## Blocked by

None (can start immediately)

#### Ticket #421: Heading check: compare staging with the SEO sheet

## Parent

#419

## What to build

A heading check that reads the SEO sheet export and staging, and marks every sheet row passed or failed, so the Designer tickets can loop until done and the report can prove it.

## Acceptance criteria

- [ ] For each of the 19 tabs, the check loads the tab's page on staging headless (room pages: one room; venue pages: one venue; Privacy & Accessibility: both pages) and matches each row to its element by section and text, ignoring case and punctuation; repeated texts match in page order.
- [ ] Each row is passed (the element's tag equals the proposed tag; "p" means a paragraph; "Wrap logo in H3" means an H3 containing the logo with its alt text) or failed with the tag found, or not found.
- [ ] Per page it reports H1, H2 and H3 counts against the tab's proposed counts, and lists every h1 to h3 on the page that no row covers.
- [ ] It also checks every other room and venue page and the pages with no tab (404, accessibility, each package, post, legal and corporate item) for the shared parts' tags, reporting any page whose footer, booking and newsletter band, offers slider or FAQ tags differ from the homepage's.
- [ ] The check never writes to Webflow.
- [ ] Tests against a small sheet fixture and saved page fixtures cover pass, fail, not found, repeated text and a wrapped logo. They run in the factory test command.

## Blocked by

None (can start immediately)

