# React code-component contract

Every exported Webflow code component is a meaningful section or interactive unit. Internal primitives stay private to the component library until they have a real independent editing use case.

## Structure and accessibility

- Use semantic elements for their real roles and keep heading level configurable by page context.
- Generate IDs per instance with React `useId`; never hard-code reusable IDs.
- Wrap heading, media, and CTA regions consistently so spacing and responsive behavior remain predictable.
- Use native controls first. Add keyboard, focus, and ARIA behavior only where native semantics do not supply it.
- Declare alt text, empty content, long content, loading, and error behavior wherever those states apply.

## Webflow declaration

- Keep the React implementation and `.webflow.tsx` declaration together.
- Expose curated text, links, media, slots, variants, and bounded numeric choices.
- Use supported prop types so the user can bind CMS fields in Designer.
- Do not expose arbitrary CSS strings unless an exception is documented in the component folder.
- Enable SSR unless a component has a documented platform reason not to.

## Styling

- Use semantic Tailwind utilities generated from the approved token ledger.
- Webflow variables use an explicit `--wf-*` mapping; local fallbacks use `--factory-*` names so aliases cannot become circular.
- Use `wf-tablet`, `wf-mobile-landscape`, and `wf-mobile-portrait` max-width variants. Ordinary Tailwind min-width breakpoints are not substitutes for Webflow's desktop-first cascade.
- Do not rely on Webflow site classes inside the component's Shadow DOM.

## Animation

- Use locally installed `gsap` and `@gsap/react` in the React lane.
- Scope `useGSAP` to the component root and let its context clean up on unmount.
- Access browser globals only inside effects.
- Under reduced motion, render the final readable state without entrance or scrub animation.
- Never create Webflow Interactions.

## Required evidence

- Type check and production Vite build.
- Fixture matrix at every canonical Webflow breakpoint.
- Duplicate-instance ID check.
- Keyboard and automated accessibility checks.
- Reduced-motion and animation-cleanup checks.
- Assertion-bearing visual regression after the project's first approved baseline.
- DevLink bundle and development-library import smoke test.
