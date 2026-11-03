---
title: "Release tags collide when parallel workstream branches each cut a version"
date: "2026-11-03"
category: "workflow-issues"
module: ".changeset, package.json, Webflow site footer"
component: "development_workflow"
problem_type: "workflow_issue"
severity: "high"
applies_when:
  - "Several sessions or worktrees build features on separate branches off one integration branch"
  - "More than one of those branches changes src/ and needs a bundle release"
tags: [changesets, release, jsdelivr, parallel-sessions, worktrees, integration-branch, webflow-footer]
---

# Release tags collide when parallel workstream branches each cut a version

## Context

The mobile parity work (PR 134, sub-PRs 122 to 133) ran seven workstreams in parallel, each in its own worktree branched from `claude/client-feedback-implementation-c8b545`. The booking menu branch (PR 123) ran `changeset version` and tagged `v1.1.18` on its own branch. The selectors branch (PR 127) also changed `src/` and could not tag: the next free number was already taken by a bundle that did not contain its code, and tagging its own `v1.1.19` would have served a bundle without the booking menu. Later the art CMS branch (PR 130) tagged `v1.1.20` on its branch, which blocked the scroll-mask branch (PR 129) the same way.

Two side effects showed up:

- A tag cut from a feature branch only contains that branch. Pointing the footer at it drops every other branch's code from staging.
- The staging footer was still on `v1.1.17` when we checked, so `v1.1.18` had never gone live at all. A tag existing is not evidence that it shipped.

## Guidance

Feature branches commit a changeset and never run `changeset version` or tag. Releases are cut only from the integration branch, after merging:

```bash
# on the integration branch, after merging the feature PRs
pnpm changeset version          # consumes every pending changeset, bumps once
pnpm run build                  # rebuild dist/ from the merged src/
git commit -am "chore(release): vX.Y.Z"
git tag vX.Y.Z && git push && git push origin vX.Y.Z
curl -s -o /dev/null -w "%{http_code}\n" \
  https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@vX.Y.Z/dist/index.js
```

When merging feature branches, resolve `dist/index.js` conflicts by taking either side and rebuilding; never hand-merge the minified file.

If a feature branch already tagged, check the new tag contains what is live before bumping the footer:

```bash
git merge-base --is-ancestor v<live> v<new> && echo "safe to bump"
```

Then bump the footer (`data_scripts_tool` > `set_site_freeform_code`, see `docs/reference/site-scripts.md`), publish to the webflow.io subdomain only, and curl a staging page to confirm it names the new tag.

## Why This Matters

The bundle is one file served by tag, so a release is all-or-nothing. A tag cut from any branch other than the one holding every merged feature silently removes features from staging, and the next session to release has to guess which number is free. One release point keeps version numbers linear and makes "what is live" answerable from a single branch.

## When to Apply

Any time two or more parallel sessions touch `src/`. Write it into each session brief: "commit a changeset, do not version or tag; the orchestrator releases from the integration branch". Style-only workstreams (Webflow Designer changes, no `src/` change) need no release and are unaffected.

## Examples

Before: PR 123 tags `v1.1.18` on its branch; PR 127 reports "not tagged, M2 already holds v1.1.18 on its own branch"; the footer stays on `v1.1.17`.

After: PRs 122 to 127 merge into the integration branch, one `changeset version` produces `v1.1.19` containing both features, the footer moves from `v1.1.17` to `v1.1.19`, and the staging HTML confirms `guild-hotel-webflow@v1.1.19`.

Related: `docs/solutions/workflow-issues/bundle-migration-and-release-gotchas.md` (changesets does not tag; curl jsDelivr before the footer).
