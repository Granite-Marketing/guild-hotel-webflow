# V02: convert a component's reference sections into component variants

Your prompt names one entry, Q0xx. Its component was built with each visual variant as a plain reference section on its build page. Turn those into real Webflow component variants so a page instance can pick one.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Read first

1. The "Component variants (V01)" section and the other gotchas in `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`.
2. `docs/figma/build-plans/Q0xx/plan.json` (`variants`, `deviations`) and the reference sections on your build page.
3. `docs/figma/HANDOVER-wave3.md` section 2 (rules).

## Steps

1. For each `is-` variant in the plan, decide: can it be expressed as **style differences only** on the component's elements? If yes, it becomes a component variant. If it changes structure (more images, different element order) beyond what existing props and Show booleans cover, make it a separate component named after the variant, and say so in the PR. When unsure, make it a separate component.
2. Present the plan to Stephen in this session: variants to create (name, which elements, which properties at which breakpoints, copied from the combo values), any separate components, and how each reference instance is repointed. Wait for his yes.
3. Create the variants with `set_variant_styles`, copying the combo values exactly. Place one instance per variant on your build page with its Variant prop set, next to the old reference section. Leave the old reference sections and combos in place.
4. Read back each variant's styles and diff them against the old combo values. Update the component description, which still says the variants are reference sections.
5. Record the variant ids in `docs/reference/webflow-ids.md`, and a `variantIds` map in the plan. Add "visual check of the variant instances" and "delete the old reference sections" to `docs/figma/follow-ups.md`.

## Definition of done

- Every plan variant is either a live component variant or a documented separate component.
- Variant styles match the old combo values on read-back.
- Ids recorded; follow-ups added.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge).
