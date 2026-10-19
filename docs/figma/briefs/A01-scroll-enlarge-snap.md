# A01: Scroll-enlarge image that snaps into text and image transitions

Code-only animation module. Runs in its own worktree in parallel with Designer builds; it never touches the Webflow Designer.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

## Goal

The initial smaller image enlarges on scroll until it becomes full width; then, as the user scrolls, it snaps with text and image transitions.

## Inputs

- Animation notes: `figma/animations/home.md`, `figma/animations/dining-collection.md`, `figma/animations/meetings-collection.md`, `figma/animations/wellness-collection.md`
- Reference sections (by page and section number; folders are `figma/pages/<page>/sections/NN-*`): `home/05`, `dining-collection/03`, `meetings-collection/02`, `wellness-collection/02`. View each `section.webp`; read the matching `spec.json` for geometry.
- Component catalogue: `docs/figma/components.md` (the class family this module attaches to).
- Conventions: `CLAUDE.md` Custom Code Delivery, `docs/reference/runtime-modules.md`, `docs/solutions/conventions/gsap-module-conventions.md`, `docs/reference/swiper-slider-setup.md` (SplitText rules).

## Build

1. Write `src/utils/scrollEnlargeSnap.ts` following the module pattern in `CLAUDE.md` (selector-presence guard, CDN globals, `autoAlpha`, class toggles, no inline display).
2. Define the DOM contract as data attributes (for example `data-scroll-enlarge-snap`, `data-scroll-enlarge-snap-item`) so Designer builds can opt in without class coupling. Document it in `docs/reference/runtime-modules.md` under a new heading.
3. Wire it into `src/index.ts` inside `Webflow.push` (commented out until a page uses it, with a one-line note).
4. Add a local preview: a static HTML fixture under `tests/visual/fixtures/scroll-enlarge-snap.html` using the section crop images as placeholders, served by `pnpm dev`, and a Playwright check that the animation reaches its end state on scroll or hover.
5. Respect `prefers-reduced-motion`: show the end state with no animation.

## Done when

- `pnpm check` and `pnpm build` pass; the Playwright check passes.
- The DOM contract is documented, and the matching component brief(s) are noted in `docs/figma/queue-status.json` (`notes`) so the Designer session adds the attributes.
- Work is committed on your branch with a PR opened against `main`; do not release a version (the orchestrator batches releases).
