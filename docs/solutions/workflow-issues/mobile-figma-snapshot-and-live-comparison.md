---
title: "Snapshotting a mobile handoff file and comparing it with the live site"
date: "2026-11-03"
category: "workflow-issues"
module: "scripts/api/figma/snapshot-mobile.mjs, figma/mobile/"
component: "tooling"
problem_type: "workflow_issue"
severity: "medium"
applies_when:
  - "A client delivers mobile designs in a separate Figma file after the desktop build"
  - "Checking a built Webflow site against Figma page by page at 390px"
tags: [figma, snapshot, mobile, playwright, visual-comparison, render-limits]
---

# Snapshotting a mobile handoff file and comparing it with the live site

## Context

The mobile designs arrived in a second Figma file (THE GUILD - HANDOFF (Internal), `J39OO1f7mLYOYZqVc8Mghw`) that mixes desktop and mobile sections plus a UI KIT page. The existing snapshot pipeline (`scripts/api/figma/snapshot.mjs` and friends) hardcodes the `figma/` folder and discovers only 1600px-wide desktop frames, so pointing it at the new file would overwrite the desktop snapshot and find no mobile pages.

## Guidance

**Snapshot.** `scripts/api/figma/snapshot-mobile.mjs` is a separate, small script that writes to `figma/mobile/`: it keeps the `— MOBILE` sections, both NAV sections (booking menu states) and the UI KIT sections, saves the full-depth nodes as `nodes.json.gz`, renders each visible child frame as JPG, and writes `index.json` (frame id, section, kind `page` / `state` / `ui-kit`, scale, file). It made 6 Figma calls in total. Run it once per handoff version; build sessions read `figma/mobile/` and never call Figma.

**Size.** At 2x the 47 renders were 111MB. Recompressing with `sips -s formatOptions 60` brought them to 32MB with text still legible at 390px.

**Render limits.** The script picks the largest scale that keeps each render under 25 megapixels, but Figma also clamps the long edge to 16384px: wellness (390 by 8983) is recorded at scale 2 but came back 712 by 16384, about 1.83x. Never compute crop coordinates from `index.json`'s `scale`; derive it from the actual image width:

```python
scale = image.width / 390   # not frame["scale"]
```

**Live captures.** Playwright's bundled browsers were not installed, so use the system Chrome with `chromium.launch({ channel: 'chrome' })`. Capture pages one at a time: 24 pages in parallel failed with "Unable to capture screenshot" and timeouts. Use `waitUntil: 'load'`, not `networkidle`; the contact page's map never goes idle. Scroll each page through once before the full-page shot so scroll-triggered reveals fire.

**Comparison.** Split the work by page groups across Sonnet subagents. Have each cut both tall images into matching chunks with PIL, compare section by section, and write one markdown file under `docs/figma/mobile/compare/` that ends with a "Shared components" list keyed by class family. That list is what turns 24 page diffs into a handful of component workstreams.

## Why This Matters

Most mobile mismatches came from a few shared causes (gutter, base type, a few components). Comparing page by page but reporting by class family is what made it possible to fix the site in seven parallel workstreams instead of 24 page passes.

## When to Apply

Whenever a second Figma file or a mobile pass arrives after a build already exists. Reuse `snapshot-mobile.mjs` by changing its page and section filters rather than extending the desktop pipeline.

## Examples

- Wrong crop: assuming 2x for a tall render cuts the wrong band; the home render was 386px wide (scale 1, then clamped), so a 2x crop landed a full section too low.
- Right crop: `im.crop((0, y1 * s, im.width, y2 * s))` with `s = im.width / 390` showed the full-bleed venue cards that confirmed the mobile Figma has no cream frame.
