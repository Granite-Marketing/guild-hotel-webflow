# P0xx: build plan for a shared component

Your prompt names one entry, Q0xx. You write the build plan for it; a later Designer session applies the plan. You never write to Webflow and never call Designer tools.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. Put notes for the orchestrator in your PR description. No em dashes in anything you write.

## Read first

1. `docs/figma/briefs/Q0xx-*.md`: the component, its variants, reference crops, instances and token mapping.
2. `docs/figma/decisions.md`: D01 colour roles and D02 merges override the brief and `figma/tokens.json`.
3. `docs/reference/style-inventory.md`: existing classes. Reuse before creating.
4. `CLAUDE.md` class naming, `docs/reference/component-patterns.md` (semantic wrappers), `docs/reference/breakpoints.md`.
5. The snapshot for each reference section under `figma/pages/<page>/sections/<section>/` (crop, spec). Never call `api.figma.com` or the Figma MCP.
6. `assets/asset-manifest.json` and `figma/assets.json` for the Webflow asset id of every image.

## Write

Everything goes in `docs/figma/build-plans/Q0xx/`:

- `plan.json`: the machine-readable plan, shape below.
- `plan.md`: a short human summary: the tree as an indented list, the class family, each variant's differences, open questions, and the compare notes per crop.
- `preview.html` and `preview.css`: a static page that renders the base and every variant using only the classes in `plan.json`, with CSS generated from the plan's style values (not hand-tuned separately). Reference images by their local `assets/` path.
- `preview-<variant>-1440.png` and `preview-<variant>-390.png`: Playwright screenshots of the preview.

`plan.json` shape:

```json
{
  "entry": "Q0xx",
  "component": "venue-card-fullbleed",
  "buildOn": { "page": "home", "pageId": "...", "section": "home/04-..." },
  "reusedClasses": ["padding-global", "container-large", "heading-style-h2"],
  "familyClasses": [
    { "name": "venue-card-fullbleed_content", "styles": { "desktop": {}, "tablet": {}, "mobileLandscape": {}, "mobilePortrait": {} } }
  ],
  "proposedShared": [
    { "name": "text-style-eyebrow-caps", "why": "eyebrow used by 6 components", "styles": { "desktop": {} } }
  ],
  "variables": ["color-neutral-100", "font-style-heading"],
  "tree": [
    { "tag": "section", "classes": ["section_venue-card-fullbleed"], "attributes": {}, "children": [] }
  ],
  "variants": [
    { "modifier": "is-left", "on": "section_venue-card-fullbleed", "styleDeltas": { "desktop": {} }, "crop": "figma/pages/.../section.webp" }
  ],
  "props": [ { "name": "heading", "type": "text", "element": "venue-card-fullbleed_heading" } ],
  "assets": [ { "slot": "background", "webflowAssetId": "...", "local": "assets/..." } ],
  "instances": [ { "page": "home", "section": "home/05-...", "variant": "base", "content": {} } ],
  "openQuestions": [],
  "deviations": []
}
```

Style values use rem and the variable names from the token mapping. Every image sits in a figure wrapper, every heading in a header wrapper, every CTA in a footer wrapper. Data attributes for the A01 to A05 modules go in `attributes` where an instance uses one (see `docs/reference/runtime-modules.md`).

## Definition of done

- `plan.json` validates against the shape above, and every class in `tree` is in `reusedClasses`, `familyClasses` or `proposedShared`.
- The preview renders the base and every variant in the brief, at 1440 and 390 wide.
- A Sonnet subagent has compared each preview screenshot with its reference crop, and `plan.md` records what matches and what does not, per crop.
- No Webflow writes were made.
- Committed on your branch, PR opened against main, with open questions listed in the PR description.
