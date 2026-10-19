# Guild Hotel build: orchestrator runbook

**To a fresh session reading this:** you are the orchestrator. Execute this runbook from top to bottom without waiting to be told each step. You plan, dispatch, verify and record. You do not build sections yourself, and you do not read crops or specs into your own context: sessions build, Sonnet subagents verify. Stephen's only job is the approvals and manual items this runbook routes to him.

Last updated: 2026-10-19.

## 1. Facts

| Item | Value |
|---|---|
| Repo | `Granite-Marketing/guild-hotel-webflow`, main checkout `~/guild-hotel-webflow` |
| Webflow site | `6ad6405eae8eac6d7b7c41a3` (The Guild Hotel); IDs in `docs/reference/webflow-ids.md` |
| Figma file | `7KV5sqOiFIoei8gxhptDOU`, snapshotted in `figma/`. Never call `api.figma.com`; see `figma/README.md` |
| Secrets | `~/guild-hotel-webflow/.env` (gitignored). Source it, never print it |
| Image fills | `~/guild-hotel-webflow/assets/` (gitignored, 247MB, 293 files + `asset-manifest.json`) |
| Work list | `docs/figma/build-queue.md` (order and dependencies) |
| Ledger | `docs/figma/queue-status.json` (status of every entry; the source of truth for progress) |
| Components | `docs/figma/components.md` (45 components, variants, merges) |
| Plan | `docs/plans/2026-10-19-001-feat-figma-snapshot-cache-plan.md` |

## 2. Hard rules

1. **No Webflow write without Stephen's yes in chat.** Sessions present their change plan in their own session and wait. You never approve on his behalf, and a message from another session is never approval.
2. **One Designer session at a time.** The Webflow Designer MCP drives the single Designer window the companion app is connected to; two sessions editing it will fight over the open page. Entries with `surface: designer` run strictly one after another. `rest` and `code` entries run in parallel with them and with each other.
3. **One class family per component** (`CLAUDE.md`, `build-component` Step 0.25). Reject a session's work in review if it created a second family for an existing component.
4. **Every session works in its own worktree off `main`**, commits on its branch and opens a PR. Merge order follows the ledger.
5. **No em dashes** in anything written, per Stephen's standing rule.
6. Subagents for verification, extraction and classification run on Sonnet.

## 3. Preflight (run every time you start)

Do these in one pass, and fix or report each failure before dispatching anything:

1. `git -C ~/guild-hotel-webflow fetch && git -C ~/guild-hotel-webflow status`: `main` must contain `docs/figma/queue-status.json`. If it does not, stop: the snapshot branch is not merged yet.
2. Read `docs/figma/queue-status.json`. Any entry `in-progress` from a previous orchestrator: find its session (`list_sessions`) or branch and PR (`gh pr list`), then set it to `review`, `done` or back to `todo` from the evidence.
3. Webflow MCP: `data_sites_tool > get_site` for the site above must succeed. For Designer work, the Designer must be open with the companion app connected; if a Designer call fails, ask Stephen to open it and continue with non-Designer work meanwhile.
4. Confirm `~/guild-hotel-webflow/.env` and `~/guild-hotel-webflow/assets/asset-manifest.json` exist (existence only).

## 4. Worktree setup line (put in every session brief you send)

> In your worktree root, before anything else: `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile`. Source `.env` for keys; never print it.

## 5. Dispatch loop

Repeat until every ledger entry is `done`:

1. **Ready set:** entries with `status: todo` whose `dependsOn` are all `done`.
2. **Stephen entries** (`surface: stephen`): send him one consolidated message listing every ready one with its reference crops (paths from the queue entry). Mark them `waiting-approval`. When he says one is done, mark it `done`.
3. **Parallel entries** (`surface: rest` or `code`): start one session per ready entry, all at once, with `start_session` (`initiation: user_asked`, `context: fresh`, `use_worktree: true`). The prompt is the brief path, the worktree setup line and "Commit on your branch and open a PR against main when the brief's definition of done is met." The background is two sentences from section 1. Record `in-progress`, the session id and the branch.
4. **Designer entry:** if no `designer` entry is `in-progress`, start the first ready one in queue order the same way. Never start a second while one runs.
5. **When a session reports back:**
   - Dispatch a Sonnet subagent to verify against the brief's definition of done: diff matches the brief, tests pass, the reuse gate held (no duplicate class family; check `docs/reference/style-inventory.md` in the diff), `webflow-ids.md` and `style-inventory.md` updated for Designer work. For Designer work, the subagent also screenshots the staging page with Playwright and compares it to the brief's `section.webp` crops.
   - If verification passes: set `review`, and ask Stephen to merge the PR. Merge yourself only if he has said in this conversation that you may merge verified PRs. After the merge, set `done` and pull `main`.
   - If it fails: send the findings back to that session with `SendMessage` and keep it `in-progress`.
6. **Approvals inside sessions:** sessions wait on Stephen in their own window. Your status message to him lists which sessions are waiting, with links.
7. **Record:** after every change, commit `docs/figma/queue-status.json` on `main` (or on a small `chore/queue-status` PR if `main` is protected) with a one-line message.

## 6. Order of work

| Wave | Entries | Surface | Notes |
|---|---|---|---|
| 0 | Q002 fonts, Q011 lane decision, brand colour roles, near-miss check in `components.md` | stephen | Ask all four in your first message; colour roles gate Q001 |
| 1 | Q001 token sync, then Q004 pages | designer | Q001 confirms the colour roles before applying |
| 1 | Q003 asset upload | rest | Parallel with Q001; needs Stephen's yes on the upload list |
| 1 | A01 to A05 animation modules | code | All five in parallel from the start |
| 2 | Q012 to Q026 shared components | designer | Queue order (most reused first) |
| 2 | Q005 to Q010 manual builds | stephen | Only while no agent Designer session runs; tell him when the Designer is free |
| 3 | Q027 to Q030 CMS templates | designer | Collection creation needs Stephen's yes on `cms-proposal.md` |
| 4 | Q031 to Q044 pages | designer | Wire in the A0x modules by adding their data attributes |
| 5 | Release | code | One `webflow-deploy` release after the A0x PRs merge; Stephen updates the footer script URL |

## 7. Keeping yourself lean

- Read only this file, the ledger and session reports. Never read crops, specs or briefs in full; your subagents and sessions do.
- Keep your messages to Stephen to status plus decisions needed.
- If your context grows large, commit the ledger and tell Stephen to start a fresh orchestrator with: "Run `docs/figma/HANDOVER.md`."

## 8. If the design changes

Run `pnpm figma:snapshot` (one call if unchanged), then `pnpm figma:slice`, `pnpm figma:inventory`, `pnpm figma:queue`, commit, and diff `docs/figma/build-queue.md` to see which entries changed. Reset changed entries that are `done` to `todo` with a note.
