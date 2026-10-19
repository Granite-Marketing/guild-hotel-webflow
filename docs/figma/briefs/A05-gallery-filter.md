# A05: Gallery and Arts filter with sticky subnav tags and detail modal

Code-only animation module. Runs in its own worktree in parallel with Designer builds; it never touches the Webflow Designer.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. Put notes for the orchestrator in your PR description.

## Goal

Gallery layout with a category filter driven by sticky subnav tags; on Arts, clicking a piece opens a detail modal.

## Inputs

- Animation notes: `figma/animations/gallery.md`, `figma/animations/arts.md`
- Reference sections (by page and section number; folders are `figma/pages/<page>/sections/NN-*`): `gallery/02`, `arts/06`. View each `section.webp`; read the matching `spec.json` for geometry.
- Component catalogue: `docs/figma/components.md` (the class family this module attaches to).
- Conventions: `CLAUDE.md` Custom Code Delivery, `docs/reference/runtime-modules.md`, `docs/solutions/conventions/gsap-module-conventions.md`, `docs/reference/swiper-slider-setup.md` (SplitText rules).

## Build

1. Write `src/utils/galleryFilter.ts` following the module pattern in `CLAUDE.md` (selector-presence guard, CDN globals, `autoAlpha`, class toggles, no inline display).
2. Define the DOM contract as data attributes (for example `data-gallery-filter`, `data-gallery-filter-item`) so Designer builds can opt in without class coupling. Document it in `docs/reference/runtime-modules.md` under a new heading.
3. Wire it into `src/index.ts` inside `Webflow.push` (commented out until a page uses it, with a one-line note).
4. Add a local preview: a static HTML fixture under `tests/visual/fixtures/gallery-filter.html` using the section crop images as placeholders, served by `pnpm dev`, and a Playwright check that the animation reaches its end state on scroll or hover.
5. Respect `prefers-reduced-motion`: show the end state with no animation.

## Done when

- `pnpm check` and `pnpm build` pass; the Playwright check passes.
- The DOM contract is documented, and your PR description names the components (from `docs/figma/components.md`) whose Designer builds must add the data attributes.
- Work is committed on your branch with a PR opened against `main`; do not release a version (the orchestrator batches releases).
