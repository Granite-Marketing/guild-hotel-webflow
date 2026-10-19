# X01: Data API builder probe

Find out whether components can be built without the Webflow Designer open, so later builds can run in parallel. This is a probe: small, reversible, and every write needs Stephen's yes in this session first.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

Do not call `designer_tool` or any tool that needs the Designer. Another session may be using the Designer; do not ask Stephen to close it.

## Questions to answer

1. Can `data_element_builder`, `data_whtml_builder` and `data_component_builder` add elements to a page while the Designer is closed or on another page? Which one fits a nested section with classes best?
2. Can they create a class with styles at each breakpoint, and a combo class (`is-` modifier)?
3. What happens when a class name already exists: reuse, error, or a duplicate such as `name 2`?
4. What happens when two calls create the same new class at about the same time (two parallel tool calls)?
5. Can they convert a section to a component, and add a component instance to another page?
6. Can they set custom attributes, image assets by id, and link settings?
7. Does a Designer session that is open at the same time see the changes, and does it overwrite them on its next save?

## Steps

1. Read the builder tool schemas and `webflow_guide_tool` notes. List what each claims to support.
2. Present the plan to Stephen: one draft page `x01-probe` (not in the nav), classes prefixed `x01-probe_`, the exact calls, and the cleanup. Wait for his yes.
3. Run the probe. Record each call and its result.
4. Read the result back through the Data API, and publish to staging only if Stephen agrees.
5. Clean up: delete the probe page and the `x01-probe_` classes, after Stephen's yes for the deletion.

## Write

`docs/solutions/integration-issues/webflow-data-api-builders-without-designer.md` with frontmatter (module, tags, problem_type), answering each question with evidence. End with a one-line verdict: "parallel Data API builds: yes / partly / no", and what must stay on the Designer.

## Definition of done

- All seven questions answered from real calls, not from documentation alone.
- Probe page and classes removed, or Stephen chose to keep them.
- PR against main with the verdict in the first line of the description.
