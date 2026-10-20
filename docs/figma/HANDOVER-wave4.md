# Guild Hotel build: wave 4 runbook (release, punch list, polish)

**To a fresh session reading this:** you are the orchestrator for wave 4. Read this file, then `docs/figma/HANDOVER.md` sections 1, 2, 4, 5, 7 and 8 (facts, hard rules, worktree setup line, dispatch loop, model routing, keeping lean). Waves 1 to 3 are done. Their runbooks (`HANDOVER-wave2.md`, `HANDOVER-wave3.md`) are background only; don't re-run them.

Last updated: 2026-10-20.

## 1. Where things stand

- **Built on webflow.io staging** (https://the-guild-hotel-c34e71.webflow.io), all through the Webflow Data API:
  - All 14 static pages: Home, Dining, Rooms, Wellness, Meetings, History, Guidelines, Rooms individual, Press, Gallery, Arts, Static template, Contact, Neighborhood.
  - All 4 CMS templates: `🍴 Dinings`, `🧑‍⚖️ Legal Corporates`, `🏷️ Post Categories` (listing) and `📰 Happenings & Stories` (post detail).
  - Every image slot holds a real library photo (stand-ins; the exact photo is not yet right).
- **Components:** 15 shared components with real Webflow component variants, the Site Nav, the Overlay Detail Panel Modal, the Offers Slider Split, the Card Carousel Header Left and the Room List Hover Preview. Ids are in `docs/reference/webflow-ids.md`.
- **Runtime:**
  - Bundle v1.1.1 is live through jsDelivr, with the CDN globals in the site footer (`docs/reference/site-scripts.md`).
  - A staging check passed for the navbar, Lenis, A01 to A05, the FAQ accordion and the offers slider.
  - Not yet in the bundle: `cardCarouselHeaderLeft()` (Q009) and the Q007 hover-preview module, so the card carousels and the room hover preview don't run on staging yet.
- **Ledger:** `docs/figma/queue-status.json`. Everything is `done` except R01 and the Q010/Q011 entries noted in section 3.
- **Open items:** `docs/figma/follow-ups.md` holds about 240 unticked lines, appended page by page. Wave 4 starts by turning them into a punch list.

## 2. Standing instructions from Stephen (verbatim, 2026-10-20)

- "Stop asking me questions unless you need to and just build, publsih do whatever, this isn't client facing yet"
- "Keep going without asking me unless it's a real blocker."
- "Make sure they use real images from the asset library, never grey placeholders."
- "If you're unsure whether something should be a component variant versus a unique item, just make it a unique item." (2026-10-19)
- On staging (decisions.md, Staging wave 3): publish to the webflow.io subdomain freely; **never publish to a custom domain**. The target is 80 to 90 percent completion, with edge cases logged rather than chased.

Quote these in every session prompt so sessions don't stop for approvals. Each session still respects the permission checker: when a call is blocked, the session logs it and moves on. Never route a blocked action through another session.

## 3. Entries for wave 4

| Entry | What | Brief or notes |
|---|---|---|
| R01 | Release v1.1.2: enable `cardCarouselHeaderLeft()` and the Q007 hover module in `src/index.ts`, plus anything follow-ups marks "needs enabling". Update `docs/reference/site-scripts.md` for Webflow's GSAP 3.15 rewrite. Swap the footer bundle URL to the new tag. | Follow `docs/figma/prep/R00-early-release.md`. Expect the tag push and the footer edit to be blocked by the permission checker. If they are, hand Stephen the exact commands (R00 did: `git -C ~/guild-hotel-webflow push origin v1.1.2`, then edit the footer `<script src>` tag). |
| W01 | Punch list: one Sonnet subagent reads `docs/figma/follow-ups.md` and writes `docs/figma/punch-list.md`. It dedupes, drops ticked or stale lines (check each against staging or the live site where cheap), and groups the rest: (a) Stephen in the Designer, with click paths; (b) agent-fixable, grouped by page or component; (c) real content needed (copy, photos, links); (d) decisions. Each line names its page or component and ids. | New. Orchestrator merges the PR. |
| W02-* | Agent fix batches from punch list group (b): one session per page or component, four at a time. Each fixes only its own page or component and ticks its lines. | Prompt: "Fix the punch-list items for <page> in `docs/figma/punch-list.md`", plus the rules in section 2 and the worktree setup line. |
| W03 | Visual QA report: Playwright screenshots of every page and template at 1440 and 390, against the Figma section crops (`figma/pages/<page>/sections/*/section.webp`). Then the `qa-report` skill builds one HTML report, published as an Artifact for Stephen. | New. Run after W02. |
| W04 | Cleanup list for Stephen. The Data API can't delete pages, so this is a checklist of exactly what to delete in the Designer: every `🧱 build-*` page (list them from `docs/reference/webflow-ids.md`), the x01-probe pages, the old reference sections on build pages, the duplicate `section_placeholder` style, and empty unused combos. | New. Last. |
| Q010 | Covered: `gallery/02` and `arts/06` were built as the `section_gallery-all` filter grid (Q040, Q041). | Mark `done` with that note. |
| Q011 | Two Figma component sets sit beside the legal and corporate pages, not on them (`legal/set-319-1298`, `corporate/set-2034-2891`). | Mark `done` with "no build: design-file sets beside the canvas". Raise it only if W03 shows something missing on those templates. |

## 4. How to run it

1. **Preflight** (`HANDOVER.md` section 3). Then mark Q010 and Q011 done as above.
2. **Start R01 and W01 together.**
3. When the W01 punch list merges, start the W02 batches four at a time, most-visited pages first: Home, Rooms, Dining, then the rest. CMS templates last.
4. **After W02:** run W03, then W04. Send Stephen the QA report link and the cleanup checklist.

## 5. Mechanics that worked (keep doing them)

- **Starting sessions:** only from Stephen's own message in this chat. On automated turns, end with a one-click button (`wrap_up` with actions) naming the next batch. Quote his "keep filling slots" instruction in each prompt.
- **Verify every PR before merging:** one Sonnet subagent per 2 to 4 PRs, read-only, checking against the brief's definition of done plus a live read-back or staging check. The orchestrator merges; sessions never ask Stephen to merge.
- **Merge conflicts:** almost always parallel appends to `docs/figma/follow-ups.md`, `docs/reference/webflow-ids.md`, `docs/reference/style-inventory.md` or the solutions doc.
  - Resolve by keeping both sides: check the branch out in a detached worktree under your scratchpad, merge `origin/main`, take both hunks, check any JSON parses, push, and wait about 12 seconds for GitHub to recompute mergeability before squash-merging.
  - After merging, grep those files for conflict markers and duplicate headings.
- **Ledger:** commit `queue-status.json` on main after every change.
- **Zsh gotcha:** quote `"origin/$B:path"` refs. A bare `$B:s...` triggers zsh's `:s` modifier.

## 6. Known limits (don't fight these)

- **The Data API can't:**
  - delete pages;
  - set input placeholders;
  - set collection-list filters or collection-page links;
  - style rich text children;
  - rename CMS collections.
  These are Designer steps for Stephen, written into the punch list with click paths.
- **The permission checker has blocked:**
  - repo visibility changes;
  - release tag pushes;
  - site footer script edits;
  - some staging publishes and component-variant writes.
  When that happens, give Stephen the exact command or paste-in, and carry on.
- **Snap groups** (Home, Dining, Wellness, Meetings) are plain sections with `data-scroll-enlarge-snap`, not component instances. This is accepted. Converting them would need a panels slot (Designer) or a dedicated component.

## 7. Kick-off line for Stephen

Start a new session in `~/guild-hotel-webflow` and send: "Run `docs/figma/HANDOVER-wave4.md`."
