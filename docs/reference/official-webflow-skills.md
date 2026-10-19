# Official Webflow skills policy

Six official Webflow skills are installed only in this private factory. Their pinned upstream revision and install paths are recorded in `vendor/webflow-skills-manifest.json`.

Installed skills:

- `webflow-code-component:component-audit`
- `webflow-code-component:pre-deploy-check`
- `webflow-code-component:troubleshoot-deploy`
- `webflow-cli:troubleshooter`
- `webflow-mcp:accessibility-audit`
- `webflow-mcp:safe-publish`

Current Webflow developer documentation is authoritative when copied skill text differs. In particular, generated projects target Node.js 22.13 or later and use canonical `webflow devlink import` / `webflow devlink bundle` commands. The legacy `webflow library share` / `bundle` aliases may appear in upstream skills but are not the factory contract.

These skills are never copied into generated client repositories. Client repositories contain project source, checks, release commands, and maintenance documentation without factory orchestration.

Reference-only candidates for later evaluation are `component-scaffold`, `site-audit`, `link-checker`, `asset-audit`, `cms-best-practices`, `cms-collection-setup`, `bulk-cms-update`, and `review-comments`.
