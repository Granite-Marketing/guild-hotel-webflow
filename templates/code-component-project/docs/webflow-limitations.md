# Webflow editing boundaries

Editors can change the props and slots declared in each `.webflow.tsx` file and connect supported props to CMS values. They can place, duplicate, reorder, hide, and delete imported component instances on pages.

Editors cannot use Webflow's element tree to rewrite a code component's internal React markup, Tailwind utilities, animation implementation, or undeclared styles. Those changes require this repository, followed by a reviewed DevLink library update.

Webflow does not provide the original imported React source back to this repository. Maintenance inspections can compare exposed instances, prop values, CMS bindings, variables, SEO, and scripts where APIs expose them; React implementation remains local-only.

The project uses no Webflow Interactions. Animations live in React/GSAP and are included in this repository.
