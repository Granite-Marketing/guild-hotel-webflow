# Guild Hotel build: wave 3 runbook (variants, CMS templates, pages)

**To a fresh session reading this:** you are the orchestrator for wave 3. Everything in `docs/figma/HANDOVER.md` still applies (facts, hard rules, preflight, worktree setup line, dispatch loop, model routing, keeping lean), as do the wave 2 lessons recorded in `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`. This file adds the wave 3 entries and their order. When every entry in section 3 is `done`, run R01 (the release) per `HANDOVER.md`.

Last updated: 2026-10-20.

## 1. Where things stand

- All 15 shared components (Q012 to Q026) are built on their own draft build pages through the Data API, verified and merged. Their ids are in `docs/reference/webflow-ids.md`.
- Visual variants were built as plain reference sections, not switchable options. V01 proved that Webflow component variants work through the Data API for **styles only**: an instance picks one by setting its Variant prop (`set_component_instance_prop_values`, `type: "string"`, value = the variant id). Text, images and visibility stay on props and Show booleans.
- CMS: `🍴 Dinings`, `🧑‍⚖️ Legal Corporates`, `🏷️ Post Categories` (listing template) and `📰 Happenings & Stories` (posts, with a Category reference) exist. Model: `docs/figma/decisions.md`, CMS model.
- Open follow-ups for Stephen and for agents: `docs/figma/follow-ups.md`.

## 2. Rules added for wave 3

1. **Data API only for agents.** No `designer_tool`, no `data_whtml_builder`. Page deletes, rich text child styling and visual checks stay with Stephen in the Designer; staging (webflow.io only, never a custom domain) may be published for a visual check only with Stephen's yes in that session.
2. **One writer per page or component.** A V02 session touches only its own component and build page; a page session touches only its own page; a CMS template session touches only its own template page.
3. **No new standalone class names** except a page session's one-off sections, which use a class family named after the section (`section_<page>-<section>`). Create the empty combos a stack needs, with query and re-query, as in `docs/figma/prep/Q-parallel-build.md`.
4. **When unsure whether something is a variant or its own item, make it its own item** (Stephen, 2026-10-19). If a variant changes structure that props cannot cover, make a separate component, named after the variant.
5. **The orchestrator verifies and merges every PR.** Sessions open PRs and never ask Stephen to merge. Each Webflow write still needs Stephen's yes in the session that makes it.
6. Up to four sessions at a time across all tracks.

## 3. Entries

| Entry | What | Depends on | Brief |
|---|---|---|---|
| V02-Q0xx (one per component below) | Turn that component's reference-section variants into real Webflow component variants, and repoint its reference instances | V01 and the component | `docs/figma/prep/V02-variant-conversion.md` |
| M01 | Stephen picks a lane for Q005 to Q011 (section 5) | none | none (decision) |
| Q027 to Q030 | CMS template pages, bound to the live collections | their components' V02, C01, C02 | `docs/figma/prep/T-cms-template.md` |
| Q031 to Q044 | Pages, assembled from component instances plus one-off sections | their components' V02 | `docs/figma/prep/PG-page-build.md` |

V02 entries exist for every component with reference-section variants: Q014 (button colours left after V01), Q016, Q017, Q019, Q020, Q021, Q022, Q023, Q024, Q025, Q026. Q012, Q013, Q015 and Q018 have no variants, so pages that use only those need no V02.

## 4. Order of work

1. **First message to Stephen:** the M01 choice (section 5), and whether staging publishes for visual checks are allowed in general this wave.
2. **V02, four at a time**, most-used components first: Q021, Q014, Q017, Q016, then Q019, Q020, Q025, Q023, then Q022, Q024, Q026. Prompt: "Execute `docs/figma/prep/V02-variant-conversion.md` for entry Q0xx", plus the worktree setup line.
3. **As soon as all of a page's components have their V02 done**, that page (or CMS template) becomes ready. Fill free slots with ready entries in this order: Q031 Home, Q027 to Q030, then the remaining pages in queue order. Prompt: "Execute `docs/figma/prep/PG-page-build.md` for entry Q0xx" (or `T-cms-template.md`).
4. **Verification** (Sonnet subagent per PR, live read-back): V02 compares each variant's styles with the old reference-section combo values; pages and templates compare the page's section order, instance variants and props with the page brief, and list one-off sections built.
5. **After all pages:** the build pages and reference sections are deleted by Stephen in the Designer (listed in `follow-ups.md`), then R01.

## 5. Q005 to Q011: options for M01

| Entry | What |
|---|---|
| Q005 | Navbar and menu |
| Q006 | Modal: overlay-detail-panel-modal (8 instances, 5 variants) |
| Q007 | Modal: room-list-hover-preview (1 instance) |
| Q008 | Slider: offers-slider-split (17 instances, 4 variants) |
| Q009 | Slider: card-carousel-header-left (10 instances, 2 variants) |
| Q010 | Gallery: gallery-mosaic-captioned, the 2 of 12 instances that need Designer work |
| Q011 | Needs a lane decision |

- **A. Stephen builds them in the Designer** (the original plan). Most control; slowest; pages leave empty slots for them meanwhile.
- **B. Agents build them natively through the Data API on the existing runtime contracts (recommended).** The navbar uses the nav toggle module, modals use the `modals.ts` DOM contract (`docs/reference/modal-setup.md`), sliders use the Swiper contract (`docs/reference/swiper-slider-setup.md`). These need only elements, classes and data attributes, which wave 2 showed the Data API handles. One plan session per entry, then a build session, as in wave 2. Interactions (IX2) are not used.
- **C. React code components through DevLink** (`webflow-code-components` lane, `docs/reference/hybrid-lane-routing.md`). Best for heavy interactivity; adds a build and import step and a second styling system.

Q011 takes whichever lane Stephen picks for the group unless he says otherwise. Until M01 is answered, pages leave a marked placeholder where these sit and list it in `follow-ups.md`.
