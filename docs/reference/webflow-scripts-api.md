# Webflow Scripts API and Custom Code Limits

How Webflow's custom-code surfaces behave, for anyone tempted to manage scripts through the MCP or API. The starter ships custom code as one bundle in a footer `<script src>` (see `CLAUDE.md` > Custom Code Delivery), which avoids nearly everything below. Read this before reaching for `data_scripts_tool`.

## Recommended route

- **Bundle:** one `<script src="https://cdn.jsdelivr.net/gh/<org>/<repo>@vX.Y.Z/dist/index.js">` in **Site Settings > Custom Code > Footer**, after the CDN tags (GSAP, ScrollTrigger, SplitText, Swiper, Lenis).
- **CDN tags and small inline config:** pasted directly into the site head or footer slot.
- **Data too large for a slot** (e.g. JSON-LD for a listing page): imported into the bundle and injected at runtime. See [json-ld-listing-schema-from-bundle.md](../solutions/design-patterns/json-ld-listing-schema-from-bundle.md).

## Custom code slot limit: 10,000 characters

Page-level custom-code slots (page head, page before-body) hold at most **10,000 characters**, which is the limit a generated listing schema hit. Webflow has changed slot limits before and site-level slots may allow more, so check the character counter under the slot rather than assuming headroom. Count everything already in the slot plus the `<script>` wrappers. Anything that does not fit comfortably goes in the bundle.

## Releasing: a new tag changes nothing until the footer URL changes

jsDelivr serves a new git tag as soon as it resolves, but Webflow keeps serving the version named in the footer `<script src>`. The live site updates only when you edit that URL and publish.

1. Tag and push (`pnpm changeset version` does not tag; see [bundle-migration-and-release-gotchas.md](../solutions/workflow-issues/bundle-migration-and-release-gotchas.md)).
2. Confirm jsDelivr has the tag before touching Webflow:

   ```bash
   curl -sI https://cdn.jsdelivr.net/gh/<org>/<repo>@vX.Y.Z/dist/index.js | head -1   # expect HTTP 200
   ```

3. Edit the version in the footer `<script src>`, then publish.

Pointing the footer at a tag that jsDelivr has not resolved yet breaks every script on the live site until it does.

## `data_scripts_tool` (Webflow MCP) behaviour

Measured in a spike on a test site. Relevant if a project registers scripts through the MCP or Data API rather than pasting into Site Settings.

### Actions

| Action | Purpose |
|---|---|
| `add_inline_site_script` | Register an inline script (`sourceCode`, max 2000 chars) |
| `list_registered_scripts` | List every registered script on the site |
| `list_applied_scripts` | List scripts applied to the site (404 if none) |
| `get_page_script` | Get scripts applied to one page |
| `upsert_page_script` | Apply registered scripts to a page by id |
| `delete_all_site_scripts` | Remove every site-level application |
| `delete_all_page_scripts` | Remove every application on a page |

### Rules

- **Inline only, 2000-character cap.** There is no action for an external `<script src>`. Webflow hosts the inline code on its own CDN. The workaround is a loader stub that creates a `<script>` element pointing at jsDelivr, but dynamically created scripts ignore `defer` ordering, so stubs need polling for CDN globals. That cost is why the starter uses a footer `<script src>` instead.
- **Register, then apply.** `add_inline_site_script` returns an `id`; `upsert_page_script` (or the site-level equivalent) applies it. There is no one-call inject.
- **`displayName` is 1 to 50 alphanumeric characters.** Hyphens and underscores are rejected ("must be between 1 and 50 alphanumeric characters"). Use camelCase (`animationsLoader`, not `animations-loader`). The name is slugified into the script `id` (`"Loader Test"` becomes `loader_test`).
- **Bump the version to re-register.** A duplicate `displayName` + `version` pair is rejected, even for a path-only change. Registrations accumulate; there is no delete for a single registration.
- **`delete_all_*` clears applied references only.** Registered scripts persist after `delete_all_site_scripts`, so you still cannot re-register the same `displayName` + `version`. Both delete actions return 404 "Custom code block not found" when nothing is applied; that is not an error.
- **`upsert_page_script` replaces every script on the page.** Sending one script removes all others. Always read, merge, write:
  1. `get_page_script`
  2. merge the new script into the returned array
  3. `upsert_page_script` with the full combined set
- **Site and page applications are independent.** Removing a script from a page does not remove its site-level application; both render in published HTML.
- **Registration fields:** `sourceCode` (required, max 2000), `version` (required, semver), `displayName` (required, rules above), `location` (`header` or `footer`), `canCopy` (copies on site duplication), `attributes` (key/value pairs on the script tag; available at registration and at application).
- **Applications stack across deploys.** Every `add_inline_site_script` applied anew adds another copy, so a per-deploy registration flow means `delete_all_site_scripts` plus re-registering every loader at a new version, every time.

## Related

- [webflow-ids.md](webflow-ids.md): cache page and script ids; verify them before any `upsert_page_script`
- [webflow-id-caching-strategy.md](../solutions/integration-issues/webflow-id-caching-strategy.md)
- [runtime-modules.md](runtime-modules.md): what the bundle runs, in order
