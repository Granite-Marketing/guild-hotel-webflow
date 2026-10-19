# Hybrid build routing

This private factory supports two intentional Webflow delivery lanes. Choose once for each component family and record the choice in the client blueprint.

## React code-component lane

Use this lane for detailed Figma/Relume sections, project-owned animations, curated editor controls, and components that benefit from local Vite review. React source, structure, styles, and animation internals live in the generated client repository. DevLink imports the component library; Webflow MCP places instances and configures exposed values where the connected capability matrix allows it.

Do not fall back to native element construction when a React placement action is unavailable. Report a manual Designer step instead.

## Native Webflow lane

Use this lane when a client must freely restructure the DOM in Designer or when the component is intentionally built from native Webflow elements and classes. The existing `build-component` skill and CDN/jsDelivr runtime remain the authority for this lane.

## Decision rule

Choose React when visual fidelity, repeatability, tested interactions, or a stable semantic contract matters more than free structural editing. Choose native Webflow when future Designer users must change the component's hierarchy or class composition without source code.

Both lanes can coexist on a site. They must not share animation ownership: code components use local React/GSAP lifecycle; native elements use the existing global runtime. Webflow Interactions are not used.
