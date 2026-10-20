# R00: early bundle release for staging

The pages carry the runtime data attributes (navbar, A01 to A05, accordion, hover scale), but no module runs on staging: several modules are still commented out in `src/index.ts`, and the site footer loads no bundle. R00 ships a first release so staging behaves like the design. The final release (R01) still happens after all pages.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.

Session setup, before anything else: in your worktree root run `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile` (both links are gitignored; source `.env` for keys and never print it). Do not edit `docs/figma/queue-status.json`; the orchestrator owns it. No em dashes in anything you write.

## Steps

1. In `src/index.ts`, enable every module the built pages use: navToggle, scrollEnlargeSnap (A01), imageStackCollapse (A02), imageTrailHover (A03), historyStickyYear (A04), galleryFilter (A05), the accordion module and imageHoverScale, plus any others that `docs/figma/follow-ups.md` lists as "needs enabling". Keep the init order in `docs/reference/runtime-modules.md`. Each module already has a selector-presence guard, so pages without its markup are unaffected.
2. Check which CDN globals the modules need (GSAP, ScrollTrigger, SplitText, Lenis, Swiper) against `docs/reference/runtime-modules.md` and `src/types/gsap.d.ts`.
3. Run `pnpm run check`, `pnpm run build` and every Playwright spec. Fix any failures.
4. Release with the `webflow-deploy` skill: changeset, version, build, commit, tag, push. Curl the jsDelivr URL for the new tag until it serves.
5. Add the site-wide scripts through the Data API scripts tool (`data_scripts_tool`; limits are in `docs/reference/webflow-scripts-api.md`): the CDN globals first, then the bundle `<script src>` for the new tag, in the footer. Remove any page-level test code a build left behind (for example the inline navToggle on the navbar build page) once the site script is in.
6. Publish to webflow.io staging only (never a custom domain), then check on staging that the navbar opens, the gallery filter filters, the history year sticks, the FAQ accordion toggles, and A01 to A03 run on Home, with no console errors from site code.
7. Record the release tag and script ids in `docs/reference/webflow-ids.md`, tick the matching items in `docs/figma/follow-ups.md`, and add new findings.

## Definition of done

- Tag released and served by jsDelivr; site footer loads it with its globals.
- Staging checks in step 6 pass, or each failure is listed in follow-ups.
- PR against main (the orchestrator verifies and merges it; do not ask Stephen to merge).
