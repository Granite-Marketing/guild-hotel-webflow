# Q012 to Q026: build a shared component through the Data API

Your prompt names one entry, Q0xx. Build its component from the approved plan in `docs/figma/build-plans/Q0xx/`, on that entry's own draft build page, through the Data API. Up to four of these sessions run at the same time, so stay inside your page and your component's class family. Stephen chose this route on 2026-10-20 (`docs/figma/decisions.md`).

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Read first

1. `docs/figma/build-plans/Q0xx/plan.json` and `plan.md`: what to build. The plan wins over the generated brief where they differ.
2. `docs/figma/briefs/Q0xx-*.md`: the instances and reference crops. Ignore its "Target" page; you build on your build page.
3. `docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md`: the X01 findings and gotchas.
4. `docs/reference/webflow-ids.md`: your build page id (`build-<component>`, created by K02).

## Rules

- Do not call `designer_tool`, and do not ask for the Designer. Work only on your own build page.
- **Never create a new standalone class name.** K02 created every named class in the plans; if one is missing, stop and report it in the PR. Two sessions creating the same new name at once is the clash X01 saw.
- **Do create the empty combos your class stacks need.** The Data API applies a stack such as `heading-style-h2 text-weight-normal` or `footer-links_link text-style-caption-tracked` only if that combo already exists; otherwise it drops the classes ("One or more styles not found"). Q013 and Q015 hit this on 2026-10-20. Query first, then `create_style` with `parent_style_names` and no properties, two-class level before three-class level. `create_style` errors on a duplicate rather than renaming, so on "already exists" re-query and reuse. Never use WHTML for this, and never add properties to a shared class or combo. Include the combos in the writes you present to Stephen, read them back, and list every one in the PR.
- Use a unique `agent_id` for your session, and the same one on every call.
- Build with `data_element_builder` using the plan's existing classes. Do not use `data_whtml_builder`, because it renames classes. Set images with asset ids from `plan.json`, and set page links with `data_element_settings_tool` `static_link` (the builder drops page links).
- Present the element writes and the component conversion to Stephen in this session, then wait for his yes. Deviate from the plan only where the API forces you to, and record each deviation in the plan's `deviations` and the PR.
- Leave rich text child styling and page deletes to Stephen in the Designer. List any that are needed in the PR.

## Steps

1. Build the base section on your build page, then one section per variant with its combo modifier.
2. Convert the base to a Webflow component named after the plan's `component`, with the plan's `props`.
3. Read back with `data_element_tool > get_all_elements` and `query_styles`, and diff against the plan's tree and classes.
4. Publish nothing. For the visual check, ask Stephen to look at the build page in the Designer or on staging. If he can't, a Sonnet subagent compares whatever preview is reachable with the plan's preview PNGs and the reference crops, and the PR says which.
5. Cache the component id in `docs/reference/webflow-ids.md`. Append to `docs/reference/style-inventory.md` only if a class's live styles changed.

## Definition of done

- The component and every variant exist on the build page, matching the plan's tree and classes on read-back.
- The component id is cached.
- No standalone class was created by this session; every empty combo it created is listed in the PR.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge) with the deviations, any visual differences, and the Designer-only follow-ups.
