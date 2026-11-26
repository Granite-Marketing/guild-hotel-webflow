# Copy upload: Stephen's words and decisions (26 Nov 2026)

Source: the client's content tracker (Guild-WebsiteContent sheet) and its linked Google Docs, exported verbatim on 26 Nov into `source/`. The staging map of every page, component and CMS field is in `catalogue/` (`node scripts/api/webflow/catalogue.mjs`, read-only).

## Stephen's request

> "Catalogue all the pages we have, as well as all the copy, and try and make sure we can match it to the existing elements that exist on that page."

> "Create a processing system to go through and update the copy, double-check that it's done, and flag anything that's still missing."

> "We might not have all the day and night content ... but we should try and push as much of this content out as possible."

> "We should have a look and see if there are any elements that are just going to be repeated everywhere, and if there are elements which are currently inside of a component that may have different content."

## Decisions

- **C1. Two versions of a line.** Several docs give a line twice ("A Century of Stories ... or A Spirited History ..."). Stephen: "first version, and then list the rest. We'll share that with Omar once we finish, and just say, 'Hey, we did the night and day versions based on what we had inside of Figma. Here are the deviations that we have.'" So: the first version goes live; every second version is listed for Omar. Only the Dining page title pair sits in a day and night block (see `CONCEPTS.md`, Day and night); it is listed too, not used as night copy, since Figma decides which blocks switch.
- **C2. H1 wording.** Stephen: "We'll go with the content doc here because that's the actual copy. The SEO is purely for changing the tags." The SEO sheet's suggested H1 wording (8 pages, "to agree with Kevin") is not used; it is listed in the report for Kevin.
- **C3. Missing copy.** Contact's doc is empty and the four Wellness sub-pages are on hold: leave those pages' copy as it is and flag them.
- **C4. Order.** Two specs, copy first, then headings (spec in `docs/specs/heading-structure/`), so the two never edit the same page at once. Copy can run on the T14 through the Webflow Data API; the Designer is not needed for copy.
- **C5. Rows to confirm (26 Nov, before merging #445).** The copy map left 160 rows as best guesses. Stephen: "Use browser driving to help make your best guess and if things are incorrectly placed then we can come back to it." So the upload decides each one itself by looking at the live staging page in a headless browser, writes its pick into the map, and lists the picks in the report; misplaced lines get fixed in a later round.
- **C6. Text fixed on CMS templates (26 Nov).** 12 spots on the room, dining and legal templates show the same text on every item, but the docs give each item its own line. Stephen: "Yes, use CMS, we didn't know which content was dynamic and not during setting this up." So each spot gets its own CMS text field, filled per item from the docs, and the template text is bound to it in the Designer. This overrides the "shared rows are not written" line in #418's plan.
- **C7. City Level Loft (26 Nov).** The doc's "City Level Loft" is the "Guild City Level Loft" room item. Stephen: "Match them yes".
- **C8. Accepted as built (26 Nov).** Site-wide parts (nav, footer, FAQ, offers), pop-ups, forms, empty-list text and timeline years stay out of the "no copy yet" list; a short repeated line such as "Discover More" may read done from another spot on the page; the check ignores heading tags; writer's notes and second versions are notes, not rows.

## What the docs contain (26 Nov)

- 20 docs with copy; Guild-Contact is empty. Homepage and Dining-Collection end with the writer's note "stopping here", so lower sections of those pages have no new copy.
- No night copy in any doc. Night fields stay as they are; the sample night content added by spec #338 is listed in the report as stand-in.
- Writer's notes are not copy: "(handwriting)", "(stats)", "(Next text block)", "Cutline on photo", "Room Description" style labels, "As instructed, stopping here". The handwriting note marks the script-font heading.
- Rooms-SubPages covers 14 rooms in one doc; the site has 12 room items (two placeholders per the SEO launch pack). Rooms in the doc with no CMS item, and items with no doc copy, are flagged, not created or deleted.
