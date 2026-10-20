# Q005 to Q011: plan and build an interactive element

Your prompt names one entry, Q005 to Q011 (navbar, modals, sliders, the remaining gallery instances, and Q011). Stephen chose agent builds for these (M01, `docs/figma/decisions.md`). Plan it, check the plan locally, then build it.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Lane

- Native Webflow elements and classes, driven by the existing runtime modules, not IX2 interactions: the nav toggle module (`docs/reference/runtime-modules.md`), the modal contract (`docs/reference/modal-setup.md`, `src/utils/modals.ts`), the Swiper contract (`docs/reference/swiper-slider-setup.md`).
- Build through the Data API by default (`docs/figma/prep/Q-parallel-build.md` rules and the gotchas in `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`). Use the Designer MCP only for a step the Data API cannot do, and only if no other session holds the Designer; say so in the PR.
- If an element needs runtime code that does not exist yet, add it in `src/utils/` per `CLAUDE.md` (module pattern, wired in `src/index.ts`) with a Playwright fixture, in the same PR.

## Steps

1. Read the entry in `docs/figma/build-queue.md` and `docs/figma/components.md`, the reference crops under `figma/pages/`, and `figma/animations/<page>.md`.
2. Write a plan in `docs/figma/build-plans/Q0xx/` in the shape of `docs/figma/prep/P-build-plan.md` (plan.json, plan.md, preview.html, screenshots), reusing classes from `docs/reference/style-inventory.md`. New classes use one family named after the element.
3. Present the writes to Stephen in this session (classes, elements, component, data attributes, any code) and wait for his yes.
4. Build on its own draft build page (`🧱 <element>`, slug `build-<element>`), create the component, read back, and publish to webflow.io staging for a visual check if useful (allowed this wave, per decisions.md).
5. Add Designer-only items and the visual check to `docs/figma/follow-ups.md`; cache ids in `docs/reference/webflow-ids.md`.

## Definition of done

- Plan, build and component exist and match on read-back; runtime behaviour checked on staging or in a fixture.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge).
