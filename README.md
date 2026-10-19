# Webflow MCP Factory

Granite Marketing's private factory for building and maintaining Webflow projects. It supports two explicit delivery lanes:

- **React code components:** generate a standalone client repository, review components locally in Vite, import a versioned library through Webflow DevLink, and assemble supported page state through MCP.
- **Native Webflow:** retain the established Figma-to-Webflow element pipeline and the TypeScript bundle delivered through jsDelivr with CDN-loaded animation libraries.

This repository is private intellectual property. Do not give clients this repository or create their project with GitHub's “Use this template” action. Generate a client-safe repository instead.

## Create a React code-component project

```bash
pnpm install
pnpm create:client ../client-project "Client component library"
```

The generator validates the project name and destination, copies only the client template, replaces structured project metadata, scans the result for private paths and credentials, and initializes independent git history. The generated repository contains its React source, GSAP animations, Vite preview, design-token ledger, site blueprint, tests, release metadata, rollback tooling, and maintenance guides. It does not contain Granite's skills, prompts, orchestration, or factory scripts.

Read `docs/reference/hybrid-lane-routing.md` before choosing a lane. Use the private `webflow-code-components` skill for the React route and `build-component` for intentionally native Webflow elements.

## Factory verification

```bash
pnpm test:factory
pnpm check
pnpm build
```

The factory tests cover project generation, IP/credential boundaries, official-skill pinning, token generation, blueprint compilation, read-only drift reporting, and client-owned release contracts.

## Official Webflow skills

Only six official skills are installed under `.claude/skills/`: component audit, pre-deploy check, deployment troubleshooting, CLI troubleshooting, accessibility audit, and safe publish. Their upstream revision and compatibility policy live in `vendor/webflow-skills-manifest.json` and `docs/reference/official-webflow-skills.md`.

Current Webflow documentation is authoritative. Generated projects use Node.js 22.13 or newer and canonical `webflow devlink bundle` / `webflow devlink import` commands even when an upstream skill still names a legacy alias.

## Repository map

```text
.
├── .claude/skills/                    private native, React, and selected official skills
├── docs/reference/                    shared build philosophy and factory policies
├── docs/solutions/                    durable cross-project learnings
├── scripts/factory/                   private generation, validation, and drift tooling
├── templates/code-component-project/ complete client-owned React project template
├── scripts/api/                       existing Figma/Webflow REST utilities
├── src/                               existing native Webflow TypeScript runtime
└── tests/                             factory and native visual tests
```

## Native runtime

The existing native lane remains supported. `src/index.ts` bundles the modules in `src/utils/` into `dist/index.js`; project sites load the versioned file through jsDelivr and continue loading GSAP/Swiper/Lenis globals through their configured CDNs. See `deployments.md` and `CLAUDE.md`.

Lenis is the default scroll engine; GSAP ScrollSmoother is a one-line swap in `src/utils/smoothScroll.ts`. Only `eagerImages`, the scroll engine, modals, Swiper, accordion, basic animations and `currentYear` are wired by default. The other modules (nav toggle, background video, Finsweet filter panels and refresh, scroll text reveal, image hover, view switcher, scroll pin, debug overlay) are opt-in from `src/index.ts`. DOM contracts and init order: `docs/reference/runtime-modules.md`.

Context-aware alt text: `pnpm alt:*` scripts and the `/asset-metadata` skill, documented in `docs/reference/alt-text-pipeline.md`. Paid generation needs `--yes`; CMS image writes need a verified one-item probe because each one permanently drops srcset.

## Core rules

- Build and approve the style guide before page components.
- Figma initializes tokens; documented Webflow overrides become the approved runtime values.
- Never use Webflow Interactions.
- Never reconcile local and Webflow state silently. Inspect, diff, decide, then mutate.
- Do not claim Webflow can reconstruct imported React implementation source.
- Production library updates are explicit and versioned; no project follows “latest” automatically.
