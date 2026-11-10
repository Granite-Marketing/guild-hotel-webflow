---
title: "Site-head CSS ships two ways: bundled files and inline head blocks"
date: "2026-11-10"
category: "workflow-issues"
module: "docs/reference/site-head, src/site.css"
component: "development_workflow"
problem_type: "workflow_issue"
severity: "medium"
applies_when:
  - "Adding or editing a CSS rule in docs/reference/site-head/"
  - "A released CSS fix does not show on staging"
tags: [site-head, css, release, jsdelivr, webflow-custom-code]
---

# Site-head CSS ships two ways: bundled files and inline head blocks

## Context

Every file in `docs/reference/site-head/` looks the same, but they reach the live site by two different routes:

- **Bundled.** Files imported by `src/site.css` (for example `meetings-button.css`, `hover-follow-text.css`) are built into `dist/site.css` and ship when the jsDelivr version tag in the head changes.
- **Inline.** `button-hover.css`, `history-divider.css`, `faq-chevron.css` and `story-mobile.css` are pasted into the site head as `<style data-…>` blocks (see `docs/reference/site-scripts.md`). They are not imported by `src/site.css`, so a release never carries them. They change only when the head itself is rewritten with that file's new contents.

In the November 2026 round, the "Book your space" even-outline rule went into `button-hover.css` because it is the button file. The release built, tagged and published, and staging showed no change. The rule had to move to the bundled `meetings-button.css` (released in v1.1.54).

## Guidance

- Before editing a site-head file, run `grep <file> src/site.css`. A match means it is bundled; no match means it is inline.
- Put new rules in a bundled file (create one and import it from `src/site.css` if none fits). Edit an inline file only to change that block, and then rewrite the head block from the file's full contents in the same release.
- If a CSS fix does not show after a release, check the delivery path before debugging selectors.

## Prevention

The real fix is one delivery path: import the inline files into `src/site.css` and drop their head blocks. That is owner work (it changes what the head carries and needs a staging check of the button hover), so it is noted here rather than done.
