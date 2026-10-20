# V01: component variants probe

The builds made each visual variant (for example the dark-text hero, `is-left`, the blue and burgundy buttons) as a plain reference section on its build page, because a component instance cannot switch combo classes. Page builds need to pick a variant per instance. This probe finds out whether Webflow component variants, through the MCP's `data_component_variants_tool`, can do that.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

Data API tools only; never use `designer_tool`. Work only on Q014's component, Hero Fullbleed Centered (id in `docs/reference/webflow-ids.md`), and its build page `/build-hero-fullbleed-centered`.

## Questions to answer

1. Can `data_component_variants_tool` create a variant on an existing component, and what can differ between variants: classes and combos on inner elements, element visibility, text, images?
2. Can a component instance on a page select a variant through the Data API (`data_component_builder` or instance settings)?
3. Do props keep working per instance when a variant is selected?
4. Does creating a variant change existing instances or their content?
5. Is the result the same when read back, and in the Designer?

## Steps

1. Read the tool schemas and the Q014 plan (`docs/figma/build-plans/Q014/plan.json`, `variants`) and the existing reference sections on the build page.
2. Present a plan to Stephen: create two variants on Hero Fullbleed Centered, `is-text-dark` and `is-left`, matching the reference sections, then place one instance of each on the build page. Wait for his yes.
3. Run it, read everything back, and ask Stephen to look in the Designer (or check on staging if he allows a webflow.io publish, as in the Q020 visual check note).
4. Leave the variants in place if they work. If they fail, remove only what this probe created, after Stephen's yes.

## Write

Add a "Component variants (V01)" section to `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md` answering each question with evidence, ending with a one-line verdict: "per-instance variants through the Data API: yes / partly / no", plus the recommended route for the other components with reference-section variants (Q014, Q017, Q019, Q020, Q021, Q023, Q024, Q025, Q026).

## Definition of done

- All five questions answered from real calls.
- Verdict and route written.
- PR against main.
