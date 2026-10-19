# Guild Hotel build: wave 2 runbook (prepare in parallel, build one at a time)

**To a fresh session reading this:** you are the orchestrator for wave 2. Execute this runbook from top to bottom. Everything in `docs/figma/HANDOVER.md` still applies (facts, hard rules, preflight, worktree setup line, dispatch loop, model routing, keeping lean); this file only adds the wave 2 entries and the order to run them in. When every entry in section 4 is `done`, go back to `HANDOVER.md` section 5 for the CMS templates and pages (Q027 onward).

Last updated: 2026-10-19.

## 1. Why this wave exists

After wave 1, everything left in the ledger except decisions runs on the Webflow Designer, and the Designer takes one session at a time (`HANDOVER.md` rule 2). Building Q012 to Q026 straight through would be 15 long serial sessions. Wave 2 moves the slow part (reading the design, deciding the element tree and class family, working out the CSS, checking it visually) into parallel worktree sessions that never touch Webflow. The Designer lane then only applies plans that have already been checked.

Three tracks run side by side:

| Track | Entries | Surface | Runs in parallel with |
|---|---|---|---|
| Plans | P012 to P026, then K01 | code (no Webflow writes) | everything |
| Designer | Q001, then Q012 to Q026 from approved plans | designer (serial) | plans, X01, C01 |
| Side work | X01 Data API probe, C01 CMS collections | rest | everything |

## 2. Rules added for wave 2

1. **Plan sessions never write to Webflow and never call Designer tools.** Reads through the Data API are allowed; `docs/reference/style-inventory.md` is the default source for existing styles.
2. **Each plan owns one class family**, named after its component (`section_venue-card-fullbleed`, `venue-card-fullbleed_*`). A plan may reuse existing classes freely. Any new class outside its own family (a generic divider, a shared eyebrow style) goes in the plan's `proposedShared` list, never into the tree as if it existed. K01 settles those across all plans.
3. **A plan is approved when its PR is merged.** The Designer session for that component still presents the writes and waits for Stephen's yes in its own window (`HANDOVER.md` rule 1); the plan makes that yes quick, it does not replace it.
4. **Designer sessions follow the plan.** They deviate only where Webflow forces it, and list each deviation in their PR description and in the plan's `deviations` section.

## 3. First message to Stephen

Send one message with everything wave 2 needs from him, in addition to anything still open from `HANDOVER.md` (merge permission, D01, D02, Q002):

- D01 and D02 answers (plans start when both are recorded in `docs/figma/decisions.md`).
- Yes or no on `docs/figma/cms-proposal.md` as the collection list for C01 (he may edit fields first).
- Yes to X01 creating one probe page and one probe class on the live site, and deleting both afterwards.
- Whether the Designer is free for Q001 now.

## 4. Entries

All entries are in `docs/figma/queue-status.json` with `model`, `effort` and `brief`. Prep briefs live in `docs/figma/prep/` (hand-written; `pnpm figma:queue` does not touch them). Plans are written to `docs/figma/build-plans/<Q id>/`.

| Entry | What | Depends on | Surface |
|---|---|---|---|
| P012 to P026 | Build plan for the matching Q entry, checked against its crops with a local HTML preview | D01, D02 | code |
| K01 | Reconcile all plans: one name per shared class, live variable names from Q001, D02 merges honoured | P012 to P026, Q001 | code |
| X01 | Probe whether the Data API builders work with the Designer closed, and how class creation behaves when two sessions create classes | none (needs Stephen's yes) | rest |
| C01 | Create the CMS collections and fields from the approved `cms-proposal.md`, and seed items with the snapshot copy | Stephen's yes on the proposal | rest |
| Q012 to Q026 | Existing entries; now also depend on their P entry and K01 | as before, plus P0xx, K01 | designer |
| Q027 to Q030 | Existing entries; now also depend on C01, so they bind fields instead of creating collections | as before, plus C01 | designer |

## 5. Order of work

1. **Now:** X01 and C01 as soon as Stephen says yes. Q001 on the Designer as soon as D01 is answered (it is the only Designer entry ready).
2. **When D01 and D02 are recorded:** start P012 to P026, all at once, one session each, using the dispatch rules in `HANDOVER.md` section 5 step 3. The prompt is: "Execute `docs/figma/prep/P-build-plan.md` for entry Q0xx", plus the worktree setup line and the PR line.
3. **As each P PR comes in:** a Sonnet subagent checks it against the definition of done in `P-build-plan.md` (preview screenshot exists for every variant, the compare notes cover each crop, no class outside the family appears in the tree unless it is in `style-inventory.md` or `proposedShared`). Stephen merges, or you merge if he allowed it.
4. **When all P entries and Q001 are done:** start K01. Its PR is the last review before anything is built; ask Stephen to look at `docs/figma/build-plans/shared-classes.md` in particular.
5. **After K01 merges:** run Q012 to Q026 on the Designer in queue order. Add to each prompt: "Apply the approved plan in `docs/figma/build-plans/Q0xx/`. Create the shared classes from `docs/figma/build-plans/shared-classes.md` first if they do not exist yet." Drop each Q entry's effort one step (xhigh to high, high to medium) and note "plan approved" in `modelReason`; raise it back if the session fails verification once.
6. **If X01 reports that the Data API builders work with the Designer closed**, do not change step 5 on your own. Report the result to Stephen with the proposal in section 6 and wait for his decision; record it in `decisions.md`.

## 6. If X01 passes

The proposal to put to Stephen: one session (call it K02) creates every class in `shared-classes.md` and every class family from the plans, with no elements, so no later session creates a class. After that, Q entries whose plans need no new classes can be built through the Data API in parallel worktree sessions, each on its own page, at most four at once. Anything that X01 shows the Data API cannot do (component conversion, interactions, some settings) stays on the Designer lane, serial.

## 7. Verification for wave 2

- **P entries:** a Sonnet subagent opens `preview.html` in Playwright at 1440x900 and 390x844 and compares it with each variant's `section.webp` crop. Pass if structure, spacing rhythm and type scale match; exact pixels are not expected (fonts may fall back).
- **K01:** a Sonnet subagent greps every plan's tree for class names and confirms each is in `style-inventory.md`, `shared-classes.md` or that plan's own family.
- **Q012 to Q026:** as in `HANDOVER.md` section 5 step 5, plus a diff of the live class list for the component against the plan.
- **X01 and C01:** a Sonnet subagent reads back the live state through the Data API and compares it with the session's report.
