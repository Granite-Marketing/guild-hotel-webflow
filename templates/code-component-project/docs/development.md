# Component development

Run `pnpm dev` to review components locally. The preview must show every meaningful variant, long and empty content where supported, and the canonical Webflow widths: desktop, 991px tablet, 767px mobile landscape, and 479px mobile portrait.

Each exported component is a meaningful section or interactive unit. Keep implementation primitives internal until they have independent reuse. A component folder contains the React implementation, `.webflow.tsx` declaration, and preview fixtures or tests.

## Required contract

- Semantic section/article/header/figure/footer structure where those roles apply.
- A caller-controlled heading level and valid hierarchy.
- Unique IDs per instance; never hard-code an ID in a reusable component.
- Keyboard access and visible focus for interactive controls.
- Curated Webflow props with supported CMS-bindable types.
- Long, empty, error, and loading states where the component can encounter them.
- SSR-safe initial render. Access `window` or `document` only in effects.
- GSAP through `useGSAP`, scoped to the component and automatically cleaned up.
- A readable final state under `prefers-reduced-motion: reduce`.
- Semantic Tailwind utilities generated from `project/tokens.json`.

Webflow code components render in isolated roots. Do not rely on React context crossing component roots or on Webflow site classes styling component internals. Webflow variables and inherited/tag styles are the supported bridge.

After the style guide and fixture matrix are approved, create the first four visual baselines with `pnpm test:visual:update`, review every image, and commit them. Until approved baselines exist, the full release check is expected to fail rather than silently skip visual regression coverage.

## Webflow maintenance data

The client repository includes its own deterministic, read-only maintenance tools under `scripts/project/`; it does not require access to the private factory. At the start of a maintenance session:

1. Capture the site's pages, variables, CMS collections, scripts, and library identity in `project/drift/raw-webflow-state.json`. Mark each coverage domain `complete`, `incomplete`, or `unavailable`; missing coverage fails closed.
2. Run `pnpm project:snapshot` and `pnpm project:drift`.
3. Review both `project/drift/report.json` and its Markdown companion. Never accept or restore changes automatically.
4. Record a decision for each reported path in `project/drift/resolutions.json`, then run `pnpm project:resolve`. The result is a plan only; a person still approves any mutation.

For initial assembly, compile `project/blueprint.json` with `pnpm project:blueprint`. It requires a capability matrix and current-state snapshot bound to the same Webflow site. If the site is genuinely empty, call the underlying script with `--assume-empty` explicitly.

## DevLink import and component registration

- The library id in `webflow.json` is minted by the first interactive `webflow devlink import` run; `--no-input` fails with "Library manifest does not have an id" until then. Run the first import in a real terminal. The CLI reads only `WEBFLOW_API_TOKEN` — export the workspace token under that name.
- After every CLI run, restore `library.globals` in `webflow.json` to a relative path before committing; CLI 2.1.1 rewrites it to an absolute path.
- **Components staging page (required bootstrap).** Workspace-shared library components are not registered on a site until each component type is placed once by hand. After installing the library in the Designer, create a draft page (for example `/components`) and drag one instance of every exported component onto it. This mints the site-level component ids that all programmatic work depends on — `insert_component_instance`, `data_component_props_tool` prop values, and CMS bindings via the Webflow MCP. Keep the page a draft, and drag any newly added component type onto it after each future import.
- A site-scoped import (`WEBFLOW_LIBRARY_TARGET=site` with `WEBFLOW_SITE_ID`) would remove the manual bootstrap, but Webflow phase-gates it (404 "Code components are rolling out in phases" as of 2026-07-17). Re-test periodically.

## Design tokens in Webflow variables (early setup step)

Do this right after the token ledger is approved, before component placement:

1. Create the variable collections the ledger maps to (`Colors`, `Typography`, `Layout`) and one variable per token via the Webflow MCP variable tool.
2. Webflow generates CSS custom property names as `--_<collection>---<variable>` (e.g. `--_colors---color-primary`) — these never match the ledger's `--wf-*` names that components consume. Install a bridge in the site's head custom code aliasing each `--wf-*` name to its Webflow cssName, and keep it in sync with `project/tokens.json`.
3. Custom properties inherit across shadow boundaries, so the bridge reaches code-component internals; after it is installed, editing a Webflow variable restyles components live.
4. A Webflow style-guide page is optional visibility, not the source of truth — variables plus the ledger are.
