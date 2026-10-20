# CMS template: build a collection template page

Your prompt names one entry, Q027 to Q030. Build that collection's template page through the Data API and bind it to the collection's fields.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Read first

1. `docs/figma/briefs/Q0xx-cms-*.md` for the sections, and the ledger notes for Q029 and Q030, which re-scope them: Q029 is the `🏷️ Post Categories` template, a listing page with a collection list of posts filtered by the current category; Q030 is the `📰 Happenings & Stories` post detail template. The brief's collection names (`cms-*`) are out of date.
2. `docs/figma/decisions.md` (CMS model, CMS labels), `docs/figma/build-plans/cms-fields.md` and the collection and field ids in `docs/reference/webflow-ids.md`.
3. `docs/figma/prep/PG-page-build.md`: build the template the same way as a page (instances plus one-off sections, same rules).
4. CMS bindings: `CLAUDE.md`, Webflow MCP notes (`data_element_settings_tool > set_settings` with `binding` for text and `value_binding` for attributes; the attributes write replaces the full list).

## Steps

1. Find the collection's template page (Webflow creates one per collection) and cache its id.
2. Plan the sections as in `PG-page-build.md`, plus every binding: which element or prop binds to which field. Collection lists: source collection, filter (for example Category equals current item), sort, limit.
3. Present the plan to Stephen and wait for his yes. Build, bind, then read back.
4. Publish nothing. Add the visual check (with a sample item) to `docs/figma/follow-ups.md`.

## Definition of done

- Template sections present in order; every planned binding set and read back.
- Ids cached; follow-ups added.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge).
