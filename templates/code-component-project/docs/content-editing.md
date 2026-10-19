# Content editing in Webflow

Use Webflow Designer or Editor for day-to-day content changes. You do not need MCP or local development tools to:

- edit exposed text, links, images, and variants;
- edit CMS items and values bound to component props;
- reorder or duplicate imported component instances;
- update page SEO fields that are owned in Webflow.

Do not paste CSS values into content props unless a component explicitly documents a bounded override. Brand colors, type sizes, spacing, and containers are controlled through approved Webflow variables and the project token ledger.

Before a developer changes source, they should compare current Webflow state with the last approved snapshot. Differences are never reconciled silently.
