# Spec: Copy upload from the client's content docs (26 Nov)

Issue: https://github.com/Granite-Marketing/guild-hotel-webflow/issues/415
Snapshot: 2026-11-26 17:55

### Intent

A copy map ties every line of every content doc to the element it replaces on staging: static page text, a component instance's prop, text fixed inside a component, or a CMS item's field. The copy goes live on staging from that map, a copy check compares the live site to the map line by line, and one report lists what is done, what is missing and every deviation, ready to share with Omar.

Stephen's words and decisions: `docs/specs/guild-content/notes.md` (C1 to C4). Sources: `docs/specs/guild-content/source/` (docs exported verbatim 26 Nov, tracker). Staging map: `docs/specs/guild-content/catalogue/`.

### Done-when

- #416: Running the copy map writes a machine-readable map and a readable per-page summary beside the catalogue, one row per doc line, for all 20 docs in the source folder.
- #416: Each row names the page (or CMS item), the doc and line, the target kind (page text, component prop on an instance, text fixed in a component, CMS item field, not on site), the target's identity, the current staging text, the new text and a status.
- #416: C1: where a doc gives two versions ("or"/"Or" between lines), the first version is the new text and every other version is recorded on that row for the deviations list.
- #416: Writer's notes are never new text: bracketed notes such as "(handwriting)", "(stats)", "(Next text block)", plus "Cutline on photo" labels and "stopping here" lines; they are recorded as notes, and "(handwriting)" marks the block's script heading.
- #416: Headings keep the doc's normal case.
- #416: Rooms: each of the doc's room sections maps to the room CMS item of the same name; doc rooms with no item and items with no doc section are listed, not created.
- #416: Meeting venue pop-ups, dining venue items, and legal and corporate items each map to their own CMS item.
- #416: A row whose target is text fixed inside a component used on more than one page is marked shared, with every page that component appears on.
- #416: Staging text on a mapped page with no doc line is listed as "no copy yet"; Contact and the four Wellness sub-pages are listed as held (C3).
- #416: Low-confidence matches are marked for a person to confirm, never silently chosen.
- #416: Tests with small doc and catalogue fixtures cover: first version chosen, writer's notes dropped, shared fixed text flagged, unmatched lines listed, room matching by name. They run in the factory test command.
- #417: Given the copy map, the check loads each mapped page on staging headless at 1440 and compares each row's target with its new text, ignoring case and whitespace differences (the CSS lowercases headings).
- #417: Each row gets done, missing (target not found) or differs (found, different text), and the report lists rows by page with counts.
- #417: CMS item rows are checked on the item's own page where one exists, otherwise on the listing that shows the item; rows with neither are listed as unchecked, with the reason.
- #417: The check never writes to Webflow.
- #417: Tests against saved page fixtures cover done, missing, differs and a lowercased heading counted as done. They run in the factory test command.

### Constraints

- **Copy map (code).** Reads the exported docs and the staging catalogue and writes a reviewable map, one row per doc line: page, doc and line, target kind (page text, component prop on an instance, text fixed in a component, CMS item field, not on site), the target's identity, current text, new text, and a status (change, same, second version listed, not on site, no copy yet, held). Matching is by page, then by the element's position and role in the section, with the current staging text as a hint; low-confidence matches are marked for a person to confirm rather than guessed.
- **Doc reading rules.** Bold lines are headings or labels; plain lines under them are body. "or"/"Or" between lines marks a second version (C1). Writer's notes in brackets and stage directions are dropped and recorded. "(handwriting)" marks the script-font heading of that block.
- **Shared text.** A line whose target is text fixed inside a component used on more than one page is not written blindly: the map shows every page affected and the row needs a decision (make it a prop, or accept the shared change), listed in the report.
- **Copy check (code).** Crawls staging headless and compares each map row's target to its new text (normalised for case and whitespace, since the CSS lowercases). Output per row: done, missing, differs, plus a summary per page.
- **Writing to staging (live ticket).** Page text, instance props and component text through the Webflow Data API in batches per page, CMS item fields through the CMS API (text fields only, never image fields), then publish staging and run the copy check until every changeable row is done. The tracker's "Uploaded by Dev" column is view-only to us; the report lists which pages are done so Omar can tick them.
- **Read-only first.** The catalogue script is GET-only. Nothing writes to Webflow until the live ticket, which this spec's yes approves.

- A good test feeds a small doc and a small catalogue fixture and checks the map rows a person would expect: right target kind, first version chosen, writer's notes dropped, shared fixed text flagged, unmatched lines listed.
- The copy check is tested against saved live page fixtures for done, missing and differs, including lowercased headings.
- Prior art: the factory tests under the repo's test folder and the existing parse-copy script.
- The live ticket is proven on staging at 390 and 1440 with the capture, compare and iterate loop on every block whose copy changed.

### Entry points

_No response_

### Non-goals

- Heading tags (the heading structure spec, which runs after this one).
- Writing night copy or choosing night photos; no night copy exists in the docs.
- Wellness sub-pages (on hold) and Contact (empty doc), C3.
- Creating or deleting rooms or other CMS items; meta titles and descriptions (open PR #408).
- Images and alt text.

### Tickets

- #416 Copy map: match every content doc line to its staging element (open)
- #417 Copy check: compare staging with the copy map (open)

### Spec (as filed)

## Problem Statement

The client has written and proofread the copy for 20 pages and page groups of The Guild's new site (homepage, collections, dining venues, meeting venue pop-ups, 14 rooms, legal and corporate), but staging still shows design-stage text. Only History and Press are marked uploaded. Nobody can say, line by line, which element each piece of copy belongs in, whether a line lives in a shared component (so changing it changes every page), or what is still missing once it is in.

## Solution

A copy map ties every line of every content doc to the element it replaces on staging: static page text, a component instance's prop, text fixed inside a component, or a CMS item's field. The copy goes live on staging from that map, a copy check compares the live site to the map line by line, and one report lists what is done, what is missing and every deviation, ready to share with Omar.

Stephen's words and decisions: `docs/specs/guild-content/notes.md` (C1 to C4). Sources: `docs/specs/guild-content/source/` (docs exported verbatim 26 Nov, tracker). Staging map: `docs/specs/guild-content/catalogue/`.

## Stephen's later words (override older rules)

- C1: where a doc gives two versions of a line, the first goes live and the rest are listed for Omar. Day and night copy follows the Figma tags only (`CONCEPTS.md`, Day and night).
- C2: the content docs' wording wins over the SEO sheet's suggested H1 wording.
- C3: Contact (empty doc) and the four Wellness sub-pages (on hold) are left as they are and flagged.

## User Stories

1. As Stephen, I want every line of every content doc matched to one element on staging, so that I can see exactly what will change before anything is written.
2. As Stephen, I want each match to say where the text lives (page, component prop, text fixed in a component, CMS field), so that a change to a shared part is never a surprise.
3. As Stephen, I want lines that would change text fixed inside a shared component flagged with every page that component is on, so that one page's copy does not overwrite another's.
4. As Stephen, I want lines with no matching element listed as "not on site", so that missing sections are visible.
5. As Stephen, I want staging text with no doc copy listed as "no copy yet", so that placeholder text is not mistaken for client copy.
6. As Stephen, I want the first version of every two-version line used and the others listed (C1).
7. As Stephen, I want the writer's notes ("(handwriting)", "(stats)", "Cutline on photo", "stopping here") never published as copy.
8. As Stephen, I want headings typed in normal case as written, so that the CSS does the lowercasing.
9. As Omar, I want the 14 rooms' copy on the matching room items, so that no room shares another room's text.
10. As Omar, I want rooms in the doc with no room item, and room items with no doc copy, listed rather than created or deleted.
11. As Omar, I want the meeting venue pop-ups, dining venue pages and legal and corporate items to carry their own copy.
12. As Stephen, I want the copy written to staging through the Webflow API where it can be, so that it can run on the T14 without the Designer.
13. As Stephen, I want image fields never rewritten while copy goes in, so that no picture loses its responsive sizes.
14. As Stephen, I want a copy check that reads the live site and marks every map line done, missing or different.
15. As Stephen, I want longer or shorter copy checked on the page at phone and desktop widths, so that no block overflows or breaks its layout.
16. As Stephen, I want one report: done, not done (with the reason), differs from the doc, and the deviations list for Omar (second versions, missing night copy, sample night content still showing, held pages, empty Contact doc, SEO H1 suggestions for Kevin).
17. As Stephen, I want the copy map and check to be rerunnable, so that a later doc update can be pushed the same way.

## Implementation Decisions

- **Copy map (code).** Reads the exported docs and the staging catalogue and writes a reviewable map, one row per doc line: page, doc and line, target kind (page text, component prop on an instance, text fixed in a component, CMS item field, not on site), the target's identity, current text, new text, and a status (change, same, second version listed, not on site, no copy yet, held). Matching is by page, then by the element's position and role in the section, with the current staging text as a hint; low-confidence matches are marked for a person to confirm rather than guessed.
- **Doc reading rules.** Bold lines are headings or labels; plain lines under them are body. "or"/"Or" between lines marks a second version (C1). Writer's notes in brackets and stage directions are dropped and recorded. "(handwriting)" marks the script-font heading of that block.
- **Shared text.** A line whose target is text fixed inside a component used on more than one page is not written blindly: the map shows every page affected and the row needs a decision (make it a prop, or accept the shared change), listed in the report.
- **Copy check (code).** Crawls staging headless and compares each map row's target to its new text (normalised for case and whitespace, since the CSS lowercases). Output per row: done, missing, differs, plus a summary per page.
- **Writing to staging (live ticket).** Page text, instance props and component text through the Webflow Data API in batches per page, CMS item fields through the CMS API (text fields only, never image fields), then publish staging and run the copy check until every changeable row is done. The tracker's "Uploaded by Dev" column is view-only to us; the report lists which pages are done so Omar can tick them.
- **Read-only first.** The catalogue script is GET-only. Nothing writes to Webflow until the live ticket, which this spec's yes approves.

## Testing Decisions

- A good test feeds a small doc and a small catalogue fixture and checks the map rows a person would expect: right target kind, first version chosen, writer's notes dropped, shared fixed text flagged, unmatched lines listed.
- The copy check is tested against saved live page fixtures for done, missing and differs, including lowercased headings.
- Prior art: the factory tests under the repo's test folder and the existing parse-copy script.
- The live ticket is proven on staging at 390 and 1440 with the capture, compare and iterate loop on every block whose copy changed.

## Out of Scope

- Heading tags (the heading structure spec, which runs after this one).
- Writing night copy or choosing night photos; no night copy exists in the docs.
- Wellness sub-pages (on hold) and Contact (empty doc), C3.
- Creating or deleting rooms or other CMS items; meta titles and descriptions (open PR #408).
- Images and alt text.

## Further Notes

- Day and night: only the Dining page title pair sits in a tagged block; it is listed, not used as night copy (C1).
- The heading structure spec is blocked by this spec's live ticket.

#### Ticket #416: Copy map: match every content doc line to its staging element

## Parent

#415

## What to build

A rerunnable copy map: every line of every exported content doc matched to the staging element it replaces, with where that text lives and what will change. Read `docs/specs/guild-content/notes.md` (decisions C1 to C3 and the doc reading notes) before starting. Inputs are the committed exports and catalogue; no network calls.

## Acceptance criteria

- [ ] Running the copy map writes a machine-readable map and a readable per-page summary beside the catalogue, one row per doc line, for all 20 docs in the source folder.
- [ ] Each row names the page (or CMS item), the doc and line, the target kind (page text, component prop on an instance, text fixed in a component, CMS item field, not on site), the target's identity, the current staging text, the new text and a status.
- [ ] C1: where a doc gives two versions ("or"/"Or" between lines), the first version is the new text and every other version is recorded on that row for the deviations list.
- [ ] Writer's notes are never new text: bracketed notes such as "(handwriting)", "(stats)", "(Next text block)", plus "Cutline on photo" labels and "stopping here" lines; they are recorded as notes, and "(handwriting)" marks the block's script heading.
- [ ] Headings keep the doc's normal case.
- [ ] Rooms: each of the doc's room sections maps to the room CMS item of the same name; doc rooms with no item and items with no doc section are listed, not created.
- [ ] Meeting venue pop-ups, dining venue items, and legal and corporate items each map to their own CMS item.
- [ ] A row whose target is text fixed inside a component used on more than one page is marked shared, with every page that component appears on.
- [ ] Staging text on a mapped page with no doc line is listed as "no copy yet"; Contact and the four Wellness sub-pages are listed as held (C3).
- [ ] Low-confidence matches are marked for a person to confirm, never silently chosen.
- [ ] Tests with small doc and catalogue fixtures cover: first version chosen, writer's notes dropped, shared fixed text flagged, unmatched lines listed, room matching by name. They run in the factory test command.

## Blocked by

None (can start immediately)

#### Ticket #417: Copy check: compare staging with the copy map

## Parent

#415

## What to build

A copy check that reads staging (headless) and marks every copy map row done, missing or different, with a per-page summary, so the live ticket can loop until done and the final report can prove it.

## Acceptance criteria

- [ ] Given the copy map, the check loads each mapped page on staging headless at 1440 and compares each row's target with its new text, ignoring case and whitespace differences (the CSS lowercases headings).
- [ ] Each row gets done, missing (target not found) or differs (found, different text), and the report lists rows by page with counts.
- [ ] CMS item rows are checked on the item's own page where one exists, otherwise on the listing that shows the item; rows with neither are listed as unchecked, with the reason.
- [ ] The check never writes to Webflow.
- [ ] Tests against saved page fixtures cover done, missing, differs and a lowercased heading counted as done. They run in the factory test command.

## Blocked by

- #416

