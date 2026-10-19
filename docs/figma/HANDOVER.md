# Guild Hotel build: orchestrator runbook

**Wave 2 is current:** if any entry X01, C01, P012 to P026 or K01 in the ledger is not `done`, run `docs/figma/HANDOVER-wave2.md`, which builds on this file.

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

1. `git -C ~/guild-hotel-webflow fetch && git -C ~/guild-hotel-webflow pull`: `main` must contain `docs/figma/queue-status.json`. Sessions start from `main`, so they cannot see briefs that are not merged. If it is missing, find the open snapshot PR (`gh pr list --repo Granite-Marketing/guild-hotel-webflow`), ask Stephen to merge it (or merge it yourself if he has allowed merges), and do not dispatch until it is on `main`.
2. Ask Stephen once, in your first message: "May I merge PRs that pass verification without asking each time?" Record the answer in `docs/figma/decisions.md`. Then read `docs/figma/queue-status.json`. Any entry `in-progress` from a previous orchestrator: find its session (`list_sessions`) or branch and PR (`gh pr list`), then set it to `review`, `done` or back to `todo` from the evidence.
3. Webflow MCP: `data_sites_tool > get_site` for the site above must succeed. For Designer work, the Designer must be open with the companion app connected; if a Designer call fails, ask Stephen to open it and continue with non-Designer work meanwhile.
4. Confirm `~/guild-hotel-webflow/.env` and `~/guild-hotel-webflow/assets/asset-manifest.json` exist (existence only).

## 4. Worktree setup line (put in every session brief you send)

> In your worktree root, before anything else: `ln -sf ~/guild-hotel-webflow/.env .env; [ -e assets ] || ln -s ~/guild-hotel-webflow/assets assets; pnpm install --frozen-lockfile`. Source `.env` for keys; never print it.

## 5. Dispatch loop

Repeat until every ledger entry is `done`:

1. **Ready set:** entries with `status: todo` whose `dependsOn` are all `done`. You are the only writer of the ledger; sessions report through their PR description.
2. **Stephen entries** (`surface: stephen`): send him one consolidated message listing every ready one: decisions (D01, D02) with the proposal, manual builds with their reference crops (paths from the queue entry), plus any session waiting on his approval. Mark them `waiting-approval`. Record decision answers in `docs/figma/decisions.md` and pass them in the prompts of the entries that depend on them. When he says an entry is done, mark it `done`.
3. **Parallel entries** (`surface: rest` or `code`): start one session per ready entry, all at once, with `start_session` (`initiation: user_asked`, `context: fresh`, `use_worktree: true`, `source_branch: main`, plus the entry's `model` and `effort` from the ledger). The prompt is the brief path, the worktree setup line and "Commit on your branch and open a PR against main when the brief's definition of done is met." The background is two sentences from section 1. Record `in-progress`, the session id and the branch.
4. **Designer entry:** if no `designer` entry is `in-progress` or `review`, and Stephen is not using the Designer, start the first ready one in queue order the same way. Never start a second while one runs. Each time the Designer lane frees up and Stephen has manual Designer builds ready (Q005 to Q010), ask him whether he wants the Designer now; hold the next agent Designer start until he says it is free. Designer PRs carry only doc updates (the build is on the live site), so merging them promptly keeps the lane moving.
5. **When a session reports back:**
   - Dispatch a Sonnet subagent to verify against the brief's definition of done: diff matches the brief, tests pass, the reuse gate held (no duplicate class family; check `docs/reference/style-inventory.md` in the diff), `webflow-ids.md` and `style-inventory.md` updated for Designer work. For Designer work, the subagent also screenshots the staging page with Playwright and compares it to the brief's `section.webp` crops.
   - If verification passes: set `review`, and ask Stephen to merge the PR. Merge yourself only if he has said in this conversation that you may merge verified PRs. After the merge, set `done` and pull `main`.
   - If it fails: send the findings back to that session with `SendMessage` (if delivery fails, ask Stephen to paste them into that session) and keep it `in-progress`.
6. **Approvals inside sessions:** sessions wait on Stephen in their own window. Your status message to him lists which sessions are waiting, with links.
7. **Record:** after every change, commit `docs/figma/queue-status.json` (and `docs/figma/decisions.md`) on `main` with a one-line message, or on a small `chore/queue-status` PR if `main` is protected.

## 6. Order of work

| Wave | Entries | Surface | Notes |
|---|---|---|---|
| 0 | D01 colour roles, D02 near-identical pairs, Q002 fonts | stephen | Ask all three in your first message, with the merge question; D01 gates Q001, D02 gates every build |
| 1 | Q001 token sync, then Q004 pages | designer | Q001 confirms the colour roles before applying |
| 1 | Q003 asset upload | rest | Parallel with Q001; the session produces the upload list and needs Stephen's yes, so flag it in your status message |
| 1 | A01 to A05 animation modules | code | All five in parallel from the start |
| 2 | Q012 to Q026 shared components | designer | Queue order (most reused first) |
| 2 | Q005 to Q011 manual builds and lane decision | stephen | Only while no agent Designer session runs; see dispatch step 4 |
| 3 | Q027 to Q030 CMS templates | designer | Collection creation needs Stephen's yes on `cms-proposal.md` |
| 4 | Q031 to Q044 pages | designer | Wire in the A0x modules by adding their data attributes |
| 5 | R01 release | code | One `webflow-deploy` release after the A0x PRs and the pages; Stephen updates the footer script URL |

## 7. Model and effort routing

Match the model to the job: judgment and planning get the strongest model, mechanical and verification work gets the cheaper ones. The ledger carries a `model`, `effort` and `modelReason` for every entry; pass them to `start_session` (`model`, `effort`). A session can never run a stronger model or higher effort than you, so run the orchestrator on the strongest model at `xhigh`. If a model id is refused, fall back one step (Fable to Opus, Haiku to Sonnet) and note it in the ledger.

| Role | Model | Effort | Why |
|---|---|---|---|
| Orchestrator (you): planning, dispatch, review decisions | Fable 5.1 (`claude-fable-5-1`), else Opus 5.5 | xhigh | Planning slot; and a session cannot run above your effort, so you need the highest any entry uses |
| Shared components with 4+ variants or 20+ instances, A04, A05 | Opus 5.5 | xhigh | The class family every page reuses; hard animation logic |
| Other shared components, CMS templates, Q001, Q004, A01 to A03 | Opus 5.5 | high | Structural decisions with a visual target |
| Pages with page-specific sections | Opus 5.5 | medium | Mostly composition plus a few new blocks |
| Pages that only place existing components, Q003 asset upload | Sonnet 5.5 (`claude-sonnet-5-5`) | medium | Mechanical, fully specified |
| Verification, screenshot compare, diff-vs-brief checks, extraction, classification | Sonnet 5.5 subagents | default | Standing rule: verification runs on Sonnet |
| Bulk lookups, ID listing, file inventories | Haiku 5.5 (`claude-haiku-5-5`) subagents | default | Cheapest; no judgment needed |

Inside every session, the brief already tells it to delegate research, extraction and verification to Sonnet subagents in parallel and keep planning and core implementation in the session. Escalate an entry's model one step (and note it in `modelReason`) if its session fails verification twice; downgrade a page to Sonnet once all its components exist.

## 8. Keeping yourself lean

- Read only this file, the ledger and session reports. Never read crops, specs or briefs in full; your subagents and sessions do.
- Run checks as Sonnet subagents in parallel (one per session report), and Haiku subagents for lookups such as listing PRs or branches.
- Keep your messages to Stephen to status plus decisions needed.
- If your context grows large, commit the ledger and tell Stephen to start a fresh orchestrator with: "Run `docs/figma/HANDOVER.md`."

## 9. If the design changes

Run `pnpm figma:snapshot` (one call if unchanged), then `pnpm figma:slice`, `pnpm figma:inventory`, `pnpm figma:queue`, commit, and diff `docs/figma/build-queue.md` to see which entries changed. Reset changed entries that are `done` to `todo` with a note.
