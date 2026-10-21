# Wave 4 status (overnight run, 2026-10-20)

What the orchestrator did while Stephen slept, and what is left for him. Fix details per batch: `docs/figma/build-plans/W02/`.

## 1. Merge these PRs (the permission checker blocked the orchestrator from merging)

All four were verified by a Sonnet subagent. Suggested order:

1. **PR 98, R01 release v1.1.2.** Tag `v1.1.2` is pushed and jsDelivr serves it. Enables `cardCarouselHeaderLeft()` and `roomListHoverPreview()`.
2. **PR 97, W01 punch list** (`docs/figma/punch-list.md`). Its line 46 says the two modules are not enabled; that is stale once PR 98 merges.
3. **PR 100, runtime fixes** (accordion first-open, aria-expanded and Space; modal `#id` links, page-load hash, Enter and Space on div triggers, close-and-scroll). Then release v1.1.3 with the `webflow-deploy` skill and bump the footer again.
4. **PR 99, W03 and W04 docs** (QA findings, cleanup checklist, W02 notes, id and style inventory updates, `u-logo` rule in CLAUDE.md).

Likely conflicts are parallel edits to `docs/figma/follow-ups.md` and `docs/reference/webflow-ids.md`: keep both sides.

## 2. Footer script (blocked for the orchestrator)

Site Settings > Custom Code > Footer: change the bundle tag from `@v1.1.1` to `@v1.1.2` (after PR 100 and its release, to `@v1.1.3`). Lenis and Swiper stay as they are; Webflow already loads GSAP 3.15. Then publish to webflow.io only.

```html
<script src="https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@v1.1.2/dist/index.js"></script>
```

Until then the card carousels and the /rooms hover preview do not run on staging.

## 3. What changed on staging (published to webflow.io only, verified live)

- **QA fixes (from the W03 baseline):** history year pills, form labels on five pages (component props), readable gallery and timeline captions, tab rows wrap at 390, Neighborhood cards 2 and 3 and its pill bar, Dinings template navy split and no DRESS CODE overlap, per-venue hero photos (new `hero-image` field), wrong stand-in photos replaced, press section header, post article heading and button.
- **Punch list group (b), components:** accordion border token, split image size and CTA colour, new split variant Edge Large (arts/05), history stamp, form h1 option and social link props, venue images eager, CTA email label, footer links to real pages, map feature tan, overlay eyebrow link props.
- **Punch list group (b), CMS templates:** Zuma wordmark and British Vogue logo via new Dinings fields, menu link field, Legal bullet lists, post inset and highlight images as CMS fields.
- **Punch list group (b), pages:** alt text on Home, Rooms, Dining, Gallery and Wellness photos, hidden lorem offer slides, Meetings RFP anchor, Neighborhood corporate link and dialog photo, Arts byline link, press publication logos.
- **Shared styles:** six duplicate image classes merged into `u-image`, four logo classes into the new `u-logo`. A live regression sweep of 25 URLs found no change in any image or logo.

QA report (final pass, version 2 of the same link): https://claude.ai/artifact/7vaBYeN3pEneR54FJm64tX. Broken sections went from 10 to 2 and drift from 44 to 18 across 24 URLs; the two broken ones are the Post Categories pages, which need the Designer filter below. Remaining items: `docs/figma/qa-findings-final.md`.

## 4. Designer steps for Stephen

From the W02 batches (the full group (a) list is in `docs/figma/punch-list.md`):

- [ ] **Post Categories list filter:** Post Categories Template > posts list Collection List `a5c0e5b3-38b1-7fef-1453-daeccc3d156e` > Settings > Filter > Category is Current Post Category. Without it, every category page lists every post.
- [ ] **Collection page links:** Happenings & Stories Template card link `bcf99744-d3ed-d1a5-4a9f-c5cf373c5aff` and Post Categories card link `a4d6f938-3965-0d25-f0f8-3d055912b2df` > Settings > Link > Collection page > current item.
- [ ] **FAQ props:** faq-accordion component > bind each `accordion_question` text to Question N and each answer paragraph to Answer N (props exist; the API binding call was blocked).
- [ ] **Hero heading tag:** Hero Fullbleed Centered heading > Settings > Tag > bind > new prop "Heading tag" (default H1).
- [ ] **Script Intro Centered, Bottom variant:** set the wrapper padding top and bottom to 7.375rem (variant styles cannot be written through the API).
- [ ] **Form placeholders (optional):** form-split-script-contact > each of the 11 inputs > Placeholder (they are hidden by `is-labelled` for now).
- [ ] **Legal bullet lists (optional):** delete the empty paragraph under each Left Offset bullet list if it adds space.
- [ ] **Cleanup:** `docs/figma/cleanup-checklist.md` (20 build pages, 2 probe pages, then Style Manager > Clean up).

## 5. Known gaps

- Press and Legal forms submit under the photoshoot field names (input `name` cannot vary per instance).
- Library has no beach photos; "oceanside" and "Coronado Beach" slots use pool and cocktail photos.
- Each Dinings item still lists itself under "other dining options" (needs a collection list filter, or a decision on static cards).
- Rooms quiz module and room card hover reveal need new code and the D-quiz decision.
- Press `#community` has no section in Figma.
- Group (c) content and group (d) decisions in the punch list are untouched.
