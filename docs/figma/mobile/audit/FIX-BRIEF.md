# Mobile fix brief (from the measured audit)

Stephen's words: "run through EVERY block and make sure alignment, shapes, sizes are correct. There's too many inconsistencies. Pay attention to the mosaic type layouts with floaty images and how some elements change on mobile. You have my permission to fix them all and use your best judgement." And: "I expect to wake up to every block being actioned." Desktop "is excellent" and must not change.

## Rules

- Work autonomously; do not ask questions. Use best judgement and note decisions in your report.
- Every fix is a below-768px value (Webflow breakpoint `small`, which cascades to `tiny`; check `tiny` overrides too). Never change `main`/`medium` values. Verify 1440px is pixel-unchanged for every page you touch.
- Source of truth: the mobile Figma (`figma/mobile/nodes.json.gz`, renders in `figma/mobile/renders/`), measured, not eyeballed. Your audit file lists the issues; re-measure before and after each fix.
- Ownership. Page sessions change only class families used by their own pages. If a fix needs a global or cross-page class (`button*`, `heading-style-*`, `text-size-*`, `text-style-*`, `padding-*`, `container-*`, `site-nav*`, `cta-booking-newsletter*`, `footer-links*`, `faq-accordion*`, or any class you find on pages outside your group), do not change it: append a row to `docs/figma/mobile/audit/shared-queue.md` in the integration checkout `/Users/sanindo/guild-hotel-webflow/.claude/worktrees/client-feedback-implementation-c8b545` (class, breakpoint, property, current -> target, pages, source audit row). The global session owns those. Prefer adding an `is-` combo for a page-specific difference over editing a shared base class.
- Mosaic and collage layouts (floating, offset, overlapping images): match every image's width, height, x offset and overlap from Figma. Where mobile Figma restructures a block (slider instead of grid, stacked instead of side by side, hidden element), implement that.
- Designer: other sessions use the Designer at the same time. Style edits via `data_style_tool` need no page switch; prefer them. Before any element edit, `get_current_page`; switch only to your own pages and keep element edits quick. Use the Webflow MCP session id you get from `start`.
- Images: use `aspect-ratio` plus `object-fit: cover` on the existing wrapper; never re-import CMS images.
- No new JS unless a block truly needs it. If you change `src/`: commit a changeset, do not version or tag, PR into `claude/client-feedback-implementation-c8b545`.
- Publish to the webflow.io staging subdomain only (`publishToWebflowSubdomain: true`, `customDomains: []`), at most once every few minutes; other sessions publish too.
- Conventions: `CLAUDE.md` (vh not svh, one class family per component, no em dashes).

## Done when

Every row in your audit file is fixed, queued as shared, or explained as not fixable. Write `docs/figma/mobile/audit/<your-file>-done.md` in your worktree with: row, action (fixed / queued / skipped + why), and a 390px before/after screenshot pair per block (`img/after-*.jpg`). Commit it on your branch and open a PR into `claude/client-feedback-implementation-c8b545` (docs plus any src). Report in under 10 lines.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.
