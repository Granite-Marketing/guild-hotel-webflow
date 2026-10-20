# K02: create shared classes, class families and build pages

K01 is merged. Before the shared components are built in parallel through the Data API, you create every class those builds need, so no build session ever creates a class. Parallel class creation is unsafe: X01 found that `create_style` errors on a duplicate, and the WHTML builder silently renames to `name-1` (`docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`).

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

Use the Data API tools only (`data_style_tool`, `data_variable_tool`, `data_pages_tool`). Do not call `designer_tool`.

## Steps

1. Read `docs/figma/build-plans/shared-classes.json`, every `docs/figma/build-plans/Q0xx/plan.json` (`familyClasses`, `variants`) and the K01 PR (#28) notes on live corrections and new variables.
2. Read the live styles and variables. Build the full list of writes, in order: new variables and live corrections, then shared classes, then each plan's class family with its combo modifiers, with styles at every breakpoint the plan gives.
3. Create one draft build page per entry (Q012 to Q026), named `🧱 <component>` with slug `build-<component>`. Keep them out of the nav. Each parallel build session works only on its own page.
4. Present the full list to Stephen in this session and wait for his yes. Then apply it. Skip any class that already exists with the same styles; stop and report any that exists with different styles.
5. Read everything back with `query_styles` and `include_breakpoints`, and diff it against the plans.
6. Regenerate `docs/reference/style-inventory.md` from the live styles, and cache the build page ids in `docs/reference/webflow-ids.md`.

## Definition of done

- Every class referenced by any plan's tree exists live, with styles matching the plan at each breakpoint.
- 15 draft build pages exist, with ids cached.
- style-inventory.md is regenerated.
- PR against main listing every class created, every class skipped, and any mismatch.
