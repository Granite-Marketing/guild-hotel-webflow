# {{LIBRARY_NAME}}

Client-owned React code-component library for Webflow. This repository contains everything required to preview, test, maintain, bundle, and import the components. It does not contain the private factory, agent skills, prompts, or generation orchestration used to create the initial project.

## Requirements

- Node.js 22.13 or newer
- pnpm 11.9 (pinned by `packageManager`)
- A Webflow workspace API token for DevLink imports

## Commands

```bash
pnpm install
pnpm dev
pnpm devlink:configure
pnpm devlink:import:development
```

`pnpm dev` opens the local Vite preview. Run `pnpm devlink:configure` interactively once to establish the Webflow library identity and review the trust prompt. After that, the development, production, and CI commands use non-interactive canonical DevLink commands. Importing a library never publishes the Webflow site.

## Project records

- `project/blueprint.json` records initial page composition, SEO intent, and CMS/property bindings.
- `project/tokens.json` records Figma source values and approved Webflow overrides.
- `project/drift/` is reserved for generated, read-only comparison reports.

The generated client repository also owns the maintenance commands needed to inspect and reconcile its Webflow site. Capture the current Webflow state in `project/drift/raw-webflow-state.json`, including explicit coverage for every domain, then run:

```bash
pnpm project:snapshot
pnpm project:drift
```

The comparison never reconciles silently. Review `project/drift/report.md`, record decisions in `project/drift/resolutions.json`, and run `pnpm project:resolve` to produce a non-mutating resolution plan. Use `pnpm project:blueprint` to compile the initial or updated page plan against the current same-site snapshot; it writes the reviewable `project/assembly-plan.json` receipt and performs no Webflow mutation.

Webflow becomes the operational source of truth after initial assembly. Pull and compare before maintenance work; never reconcile differences silently.

## Component rules

- Prefer section-level components.
- Expose content, slots, and curated variants through Webflow props.
- Use semantic Tailwind utilities backed by Webflow variables.
- Keep animation inside the component with React/GSAP; do not use Webflow Interactions.
- Preserve semantic HTML, keyboard access, reduced motion, and SSR unless explicitly documented otherwise.
- Run the full release check before importing a new library version.
- Approve staging explicitly and pass an exact version to the guarded production import.
