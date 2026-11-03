---
title: "Relayed fix briefs must state breakpoint scope, or desktop gets changed too"
date: "2026-11-03"
category: "workflow-issues"
module: "Orchestrator briefs to parallel sessions (mobile parity, PR 129 and PR 132)"
component: "development_workflow"
problem_type: "workflow_issue"
severity: "high"
applies_when:
  - "Passing a client or reviewer fix from the orchestrator session to a workstream session"
  - "A fix is reported from one viewport (phone screenshot) on a component that renders at every size"
tags: [orchestration, session-briefs, breakpoints, mobile, scroll-mask, scope, regression]
---

# Relayed fix briefs must state breakpoint scope, or desktop gets changed too

## Context

During the mobile parity work, Stephen reported from phone screenshots that the hexagon scroll masks should open to full width and height, then widened it: "This is for all the hexagonal sections NOT just the homepage". The orchestrator's brief to the workstream session added its own generalisation: end fully open "on mobile and desktop alike unless a desktop Figma frame clearly shows otherwise". The session did exactly that (PR 129), so desktop lost the chamfered hexagon frame on Home, Dining, Meetings, Wellness and Arts. Stephen caught it on staging. The fix (PR 132) restored the pre-PR 129 desktop state and gated the change to below 768px.

Earlier in the same run a smaller version happened on the booking menu: "Text should be centre aligned" was relayed as horizontal centring, when the desktop Figma has left-aligned options in a vertically centred list.

## Guidance

When relaying a fix to another session:

1. **Quote the user's words verbatim**, then add only facts you checked (Figma node, page, current staging value). Do not add scope the user did not state.
2. **State the breakpoint scope explicitly**, every time: "below 768px only, desktop must not change" or "all sizes". A report from a phone screenshot defaults to mobile only.
3. **Never write "unless the Figma shows otherwise" as a scope rule.** It makes the receiving session decide scope from a design check it may skip. Decide scope yourself, checking the desktop Figma frame before sending.
4. **Turn an ambiguous word into a design reference.** For "centred", say which axis and point at the Figma frame that shows it.
5. Ask the receiving session to verify both 390px and 1440px on every affected page and to report desktop as unchanged.

Durable result now in `CLAUDE.md`: hexagon scroll masks open to full screen on mobile only, and full-screen sizes use `vh`/`vw`, never `svh`/`svw`.

## Why This Matters

Workstream sessions follow the brief literally; they have no access to the original conversation. An over-broad clause in a relay becomes a site-wide regression on the client's staging site, and costs a second PR, a second release (`v1.1.22`) and the user's trust.

## When to Apply

Every relayed fix, especially one-line feedback sent from a phone screenshot, and any change to a component shared across pages and breakpoints (scroll masks, nav, bottom menus, hero).

## Examples

Before (sent): "end fully open at 100vw by 100vh ... on mobile and desktop alike unless a desktop Figma frame clearly shows otherwise."

After (correct): "Stephen's words: '...'. Scope: below 768px only. Desktop keeps the chamfered hexagon frame and must not change. Verify 390px full screen and 1440px hexagon on Home, Dining, Meetings, Wellness and Arts."

Related: `docs/solutions/workflow-issues/parallel-branch-release-tag-collisions.md` (the same parallel-session setup).
