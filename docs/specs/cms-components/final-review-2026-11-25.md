# Final review: CMS, components and anything still not right (2026-11-25)

Read-only. Nothing on the site, in the CMS or in the code changes until Stephen approves the merged list.

## Stephen's words

- "Is the split done? We still have things that look like this where some of the variants don't even look like they change anything. You've made variants for pages for some reason and not for functionality."
- "We should also be able to control text sizes and container width for the titles using data attributes. I think that might do better than small, med large or we can have them in conjunction as fine control. These are just suggestions - not a go ahead."
- "The larger part of what I wanna do is a final review for CMS, components and just anything that still isn't right."
- "If the components do have a mobile version then i can see why they still exist. So let's not nuke those yet if there are genuine differences. I'm just not sure about naming it for specific pages - maybe something like 'Split Image Tablet Stacked'."

## Decisions

1. A variant with a genuine difference at any breakpoint stays for now, including one that only changes tablet or phone. This replaces the earlier suggestion to swap page variants for shared controls.
2. No variant is named after a page. Rename it for what it does, and say the breakpoint when the change is only there (for example "Tablet Stacked"). Names are proposals until Stephen approves them.
3. Title size and width controls are an idea to assess, not approved work.
4. Nothing is deleted, renamed or rebound during the review.
5. Approved by Stephen 2026-11-25, to apply after the review confirms the pairs: night fields and props are named `<day name> (Night)`. Where the day value is the item Name, use the block's name (`Card - Name (Night)`). Every collection gets folders (Webflow field groups), with each night field directly under its day field, and folders and fields in the order they appear on the page ("Can you order CMS fields? Like put things in chronological order?"). Replaces DN5 in the day and night spec.
   - Stephen, 2026-11-25, go-ahead: "Please do, cause fields in chronological order and then putting night next to it is perfect. I then also like having settings in the CMS at the top of the collection unless it's specific for a certain field. If it's general eg sort order or category top of CMS collection items."
6. Still open: night fields with no clear day field (Rooms Feature fields, Beyond Downtown pop-up image).

## What is known

The published stylesheet on 15 main pages showed 18 of 33 sampled variants with no desktop rules of their own, only tablet and phone rules. Room, dining, legal, corporate, post and package templates were not crawled, so "unused" is not proven for any variant. `Split image text light` still has 14 variants for 4 instances, `Split image text slider` 14 for 1, and 10 old `Overlay Detail Panel Modal` instances sit on /arts.

## Lane A: pages and content (T14, no Webflow tools)

Staging: https://the-guild-hotel-c34e71.webflow.io. Compare against `figma/` and the specs (`notes.md` here, `docs/specs/day-night/notes.md`), treating the 20 Nov reviews as claims to re-check, not evidence. Client and Stephen feedback beats Figma.

Every static page and at least two live items per CMS template (find the URLs by crawling links, the sitemap is incomplete), at 390, 650, 800, 991 and 1440:

- wrong-page, placeholder, lorem or repeated copy; dead, empty or `#` links; broken or missing media and alt text; misaligned headings, overflow, clipped text;
- CMS lists, tabs, filters, sliders and pop-ups: open, select, close and count them;
- day and night in both modes, including first load and the nav colour change;
- console and page errors.

For every component variant found on a page (`w-variant-<id>` classes), render it and Base with the same content at all five widths and state what visibly differs at which width. Follow `docs/solutions/workflow-issues/splitting-variant-components.md`: trust the render, not the stylesheet. Include all templates.

## Lane B: Webflow settings (one linked session on the Mac, read-only)

Through the Webflow MCP, read every component's settings, variants, props and instances, and every CMS collection, field and item:

- variants: id, instances, pages, what they change per breakpoint; duplicates and no-effect variants; a proposed functional name for each page-named one;
- components: unused, duplicated purpose, jumbo, numbered or dead props, hand-typed content that belongs in the CMS, typed links, wrong single or multi-line prop type, Custom Elements, IDs on wrappers;
- CMS: unused or empty fields, unclear labels, hard-coded lists that should be collections, missing references, items lacking required content (Reserve links, night content, videos);
- folders and order: for each collection, the folders and the field order inside them, following the page from top to bottom, after a Settings folder at the top for general settings (sort order, category, which pages show the item); a setting that belongs to one field or block stays beside it; Name and Slug cannot go in a folder;
- title size and width controls: which components would need them, the fixed steps actually used today, whether a prop can drive a data attribute, and whether the Designer canvas shows it. Assess only.

## Output, both lanes

One table, one row per finding: page or component, what is wrong, evidence, width, suggested action (keep, rename, merge, fix, ask), lane for the fix (code, Designer, content). Then: Not checked, and Looks fine. No fixes.
Lane A writes `final-review-2026-11-25-pages.md`, Lane B `final-review-2026-11-25-webflow.md`, both in this folder, each on its own branch and PR, not merged. The coordinating session merges both into one list for Stephen.
