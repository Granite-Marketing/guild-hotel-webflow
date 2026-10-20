# Page build: assemble a page from component instances

Your prompt names one page entry (Q031 to Q044). Build that page top to bottom through the Data API: shared sections as component instances, one-off sections natively.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Read first

1. `docs/figma/briefs/Q0xx-page-*.md`: the page order and which section is which component. Its "Build lane" and "Target: create page first" lines are out of date: the page exists (id in `docs/reference/webflow-ids.md`) and you build through the Data API, not the Designer.
2. `docs/figma/HANDOVER-wave3.md` section 2 (rules) and `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md` (all gotchas).
3. For each component on the page: `docs/figma/build-plans/Q0xx/plan.json` (props, `variantIds`, instances) and its id in `webflow-ids.md`.
4. `docs/reference/runtime-modules.md` for the data attributes of the A01 to A05 animation modules, and `figma/animations/<page>.md`.

## Steps

1. Read the page as it is now. It should be empty or hold only a placeholder; stop and report if it holds real content.
2. For each section in page order, write down: component and variant, or one-off. For instances: every prop value, from the snapshot copy (`figma/pages/<page>/sections/<section>/`), and images by Webflow asset id (`figma/assets.json`). For one-off sections: the element tree with a `section_<page>-<section>` class family, reusing shared classes.
3. Leave a marked placeholder section (`section_placeholder`, with a text note) for any Q005 to Q011 element (navbar, modals, sliders) that does not exist yet.
4. Present the full plan to Stephen in this session: section order, instances with variants and prop values, one-off sections with their new classes, and data attributes. Wait for his yes.
5. Insert instances with `data_component_builder`, set props and the Variant prop, build one-off sections with `data_element_builder` (create their classes first with `data_style_tool`), set page links with `static_link`, and add the animation data attributes.
6. Read the page back and diff it against your plan. Add "visual check of /<slug>" and any Designer-only items to `docs/figma/follow-ups.md`.

## Images

Every image slot, instance image prop and figure gets a real photo from the site asset library (`data_assets_tool` list, `figma/assets.json`). The exact match does not matter; a grey box or `placeholder.svg` is never acceptable (Stephen, 2026-10-20). If a figure has no `img`, add one.

## Definition of done

- Every section of the page brief is present in order, as an instance (with the right variant and props) or a one-off section.
- No new standalone classes outside the page's one-off section families.
- Read-back matches the plan; follow-ups added.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge).
