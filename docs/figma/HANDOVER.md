# Guild Hotel build: handover

Start here in any new session. This page says where the build stands, what to read, and which work can run in parallel. Detail lives in the linked files; keep this page short and current.

Last updated: 2026-10-19.

## State

- **Design source:** Figma file `7KV5sqOiFIoei8gxhptDOU` (GUILD-WEB-NEW), version `2412078996349254008`, snapshotted into `figma/` with 8 REST calls. Build sessions never call `api.figma.com`; see `figma/README.md`.
- **Webflow:** site `6ad6405eae8eac6d7b7c41a3` holds only the Relume style guide. No project pages, components or CMS collections exist yet. IDs: `docs/reference/webflow-ids.md`.
- **Plan:** `docs/plans/2026-10-19-001-feat-figma-snapshot-cache-plan.md` (units U1 to U7 done).
- **Factory:** the snapshot pipeline and the component reuse gate are merged into the factory (Granite-Marketing/webflow-mcp-starter#2), so future clients start with them.

## Read before building

| File | Why |
|---|---|
| `docs/figma/build-queue.md` | 44 entries in dependency order; one brief per agent entry in `docs/figma/briefs/` |
| `docs/figma/components.md` | 45 components, their `is-` variants, optional elements, duplicates and near-identical merges |
| `docs/figma/inventory.md` | Every section with lane (agent, manual, needs-decision) and crop link |
| `docs/figma/cms-proposal.md` | Proposed collections for the four CMS template groups (approval needed) |
| `CLAUDE.md` + `build-component` Step 0.25 | One class family per component; variants are `is-` modifiers or utilities |

## Rules that hold for every session

- One Webflow change plan per session, shown in chat; no Designer or Data API write without a yes.
- One class family per component. Five similar blocks with five class families is a failed build.
- After a build, update `docs/reference/style-inventory.md` and `docs/reference/webflow-ids.md` in the same commit.
- If the design changes: `pnpm figma:snapshot` (one call when unchanged), then `figma:slice`, `figma:inventory`, `figma:queue`.

## Waiting on Stephen

1. **Q002 fonts:** upload Sackers Heavy Gothic, Gatch Test and Morello to Webflow.
2. **Brand colour roles:** confirm primary `#29310C`, secondary `#F26849`, accent `#906E58` (assigned by frequency) before Q001 applies them.
3. **Near-identical check:** the three "Check these" pairs in `docs/figma/components.md`; same block means add the same `name` in `figma/inventory.overrides.json`.
4. **Q011 lane decision:** the two 417x1032 component sets on Legal and Corporate.
5. **Manual builds:** Q005 navbar, Q006 and Q007 modals, Q008 and Q009 sliders (two slider types), Q010 gallery.

## Running work in parallel

The Webflow Designer MCP drives the one Designer window the companion app is connected to. Two sessions editing the Designer at once will fight over the open page, so **Designer work runs one session at a time**. Data API, REST and local code work can run alongside it.

| Wave | Entries | Runs as | Parallel with |
|---|---|---|---|
| 0 | Q002, colour roles, near-miss check, Q011 | Stephen | everything |
| 1 | Q001 token sync, then Q004 create pages | one Designer session | Q003 asset upload (REST, own session); CMS collection setup from `cms-proposal.md` (Data API, own session, after approval) |
| 2 | Q012 to Q026 shared components, most-reused first | one Designer session at a time, one entry per session | animation modules (below); Stephen's manual builds in the Designer only when no agent session is building |
| 3 | Q027 to Q030 CMS templates | one Designer session each, serial | animation modules |
| 4 | Q031 to Q044 pages | one Designer session each, serial | animation modules; SEO and alt text prep (`/update-seo`, `/asset-metadata`) |

**Code-only work that parallelises freely**, each in its own worktree session: GSAP modules in `src/utils/` for the animation notes in `figma/animations/*.md` (Home image trail, scroll-enlarge hero, image stack collapse, History sticky year, gallery filter). Each needs only the notes, crops and the DOM contract its component's brief defines; ship through `webflow-deploy`.

## Starting a session

Give the new session the brief path and nothing else, for example: "Run `docs/figma/briefs/Q001-token-sync.md`." Every brief carries its inputs, the reuse gate, the approval rule, its definition of done and the subagent instructions.
