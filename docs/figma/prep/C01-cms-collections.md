# C01: CMS collections and seed items

Create the CMS collections from the approved `docs/figma/cms-proposal.md` through the Data API, and seed one item per template page with the copy from the Figma snapshot. The CMS template entries (Q027 to Q030) then only bind fields in the Designer.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

Do not call `designer_tool` or any tool that needs the Designer.

## Steps

1. Read `docs/figma/cms-proposal.md` and the C01 row in `docs/figma/decisions.md` (Stephen's approval and any field edits; the edits win).
2. List the live collections (`data_cms_tool`). Stop and report if any proposed collection already exists.
3. Present the exact writes to Stephen: collections, fields with types and slugs, and the items with their values (from the snapshot specs under `figma/pages/<page>/`). Rename fields from `s<section>-<role>` to readable names, keeping a map in the PR. Wait for his yes.
4. Create collections and fields, then items as drafts. Images: use the Webflow asset ids from Q003 (`figma/assets.json`); write each image field once only (see `docs/solutions/conventions/webflow-cms-image-emission.md`).
5. Cache every collection and field id in `docs/reference/webflow-ids.md`.
6. Update the Q027 to Q030 notes in your PR description: which field binds to which section element.

## Definition of done

- Every approved collection, field and item exists live, read back and matching the plan.
- IDs cached in `docs/reference/webflow-ids.md`; the field name map is in `docs/figma/build-plans/cms-fields.md`.
- Items left as drafts; nothing published.
- PR against main.
