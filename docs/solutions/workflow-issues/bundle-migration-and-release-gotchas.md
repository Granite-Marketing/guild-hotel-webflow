---
title: "Porting legacy scripts into the single bundle, and release gotchas"
date: "2026-04-20"
last_refreshed: "2026-10-19"
category: "workflow-issues"
module: "src/index.ts, bin/build.js, .changeset"
component: "development_workflow"
problem_type: "workflow_issue"
severity: "medium"
applies_when:
  - "Moving per-script Webflow loaders or legacy IIFE scripts into src/utils/"
  - "Cutting a release with changesets and shipping it through jsDelivr"
tags: [bundle, esbuild, migration, splittext, changesets, jsdelivr, release, webflow-custom-code]
---

# Porting legacy scripts into the single bundle, and release gotchas

## Context

The starter's architecture (one `src/index.ts`, one footer `<script src>`, modules inside `Webflow.push`) is documented in `CLAUDE.md`. It replaced a legacy setup on a production project: about 25 standalone IIFE scripts, each registered through the Webflow MCP as an inline polling loader, each with its own dedup guard, `readyState` gate, `typeof gsap` guard and cross-module coordination queue. Every deploy meant `delete_all_site_scripts` plus re-registering every loader at a new version, because Webflow stacks registrations (see [webflow-scripts-api.md](../../reference/webflow-scripts-api.md)).

That scaffolding existed to compensate for N scripts loading independently and async. A single bundle placed after the CDN tags has none of those races. This note keeps the lessons that apply to any project making the same move or shipping a release.

## Guidance

### 1. A migration strips scaffolding only; it never rewrites feature logic

Remove the IIFE wrapper, `'use strict'`, `typeof` CDN guards, `window.__loadedScripts` dedup guards, `readyState` gates, layout-ready queues and per-script `registerPlugin` calls. Keep everything else byte for byte: animation shapes, SplitText options, ScrollTrigger config, timing and easing.

The regression that taught this: the first bundle release "modernised" a sticky heading reveal while porting it, adding `mask: 'lines'`, `autoSplit: true` and an `onSplit` callback to what had been:

```ts
const split = new SplitText(heading, { types: 'words, lines' })
gsap.set(split.lines, { overflow: 'hidden' })
gsap.set(split.words, { y: '110%' })
```

`mask: 'lines'` added a second inline-block layer per line and short phrases wrapped onto a new line. Two patch releases went into restoring the developer's original. If in doubt, `git log -p` the legacy file and port it verbatim.

### 2. SplitText's option is plural `types:`

`new SplitText(el, { type: 'words' })` is silently ignored. Use `types: 'words, lines'`. Check this on every ported call.

### 3. `pnpm changeset version` does not tag

With `"commit": false` in `.changeset/config.json`, `changeset version` bumps `package.json` and the changelog and stops. Tag manually:

```bash
pnpm changeset            # pick patch / minor / major
pnpm changeset version    # bumps files; no commit, no tag
pnpm run build && pnpm run check
git add -A && git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push && git push --tags
```

### 4. Curl the jsDelivr tag before editing the Webflow footer

```bash
curl -sI https://cdn.jsdelivr.net/gh/<org>/<repo>@vX.Y.Z/dist/index.js | head -1
```

Wait for `200` before changing the footer URL. Pushing the tag alone changes nothing on the live site: Webflow keeps serving whichever version the footer `<script src>` names until you edit it and publish.

### 5. Never reintroduce coordination primitives

If a module seems to need a layout-ready event or a shared queue, inline the dependency instead (`await document.fonts.ready`, or `ScrollTrigger.refresh(true)` right after the DOM mutation). Cross-module calls are normal imports.

## Related

- [webflow-scripts-api.md](../../reference/webflow-scripts-api.md): why the MCP script-registration route was retired
- [gsap-module-conventions.md](../conventions/gsap-module-conventions.md): rule 7, the SplitText line-mask pattern
- `CLAUDE.md` > Custom Code Delivery: the module pattern and deploy line
