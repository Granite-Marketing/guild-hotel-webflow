---
title: "Homepage \"Wellness\" animation feedback means the image trio collapse, not the enlarge-snap stack"
date: "2026-11-10"
category: "workflow-issues"
module: "src/utils/imageStackCollapse.ts, src/utils/scrollEnlargeSnap.ts"
component: "development_workflow"
problem_type: "workflow_issue"
severity: "medium"
applies_when:
  - "Client feedback names a section (\"Wellness section image animation\") rather than an effect"
  - "A page has more than one scroll-driven image animation"
tags: [feedback, animation, image-stack-collapse, scroll-enlarge-snap, wellness, homepage]
---

# Homepage "Wellness" animation feedback means the image trio collapse, not the enlarge-snap stack

## Context

Trello card Homepage-Desktop item 6a asked for the "Wellness section image animation slower, too sensitive". The homepage has two scroll-driven image animations, and both can pass for "the wellness one":

- **Image trio collapse** (`imageStackCollapse`): the Image Trio Text component on the homepage (webflow-ids: "Image Trio Text | Home | home wellness"). It starts as three images side by side and slides them into one stack. This is the one the client meant.
- **Enlarge-snap stack** (`scrollEnlargeSnap`): the pinned full-bleed panels. On the homepage these are the Dinings venue cards; on `/wellness` it is the `tab-pills-intro` media.

The animation feedback session read "wellness" as the enlarge-snap stack and changed it in three releases (v1.1.60, v1.1.62, v1.1.63) before Stephen sent a screenshot of the three-image row. The trio collapse got the real fix in v1.1.64 (a timed 1.6s collapse that reverses on scroll up), and v1.1.65 put both enlarge-snap stacks back to their pre-round-2 settings. The full record is items 2 and 9 to 13 in `docs/feedback/animations-trello.md`.

## Guidance

- When feedback names a section rather than an effect, find the section's element in `docs/reference/webflow-ids.md` (the component table names the page and section) and check which `data-` attribute it carries before touching a module.
- If the section has, or sits next to, more than one scroll animation, ask Stephen which one with a screenshot of each, before the first release.
- If he says a fix "still feels the same" after a release, check first that the right animation changed; tuning the wrong one again only hides the miss.
