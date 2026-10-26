---
title: "Lenis stops short of the page end: stale limit from html height 100%"
date: "2026-10-26"
category: "integration-issues"
module: "lenisGsap"
component: "src/utils/lenisGsap.ts, src/utils/modals.ts"
tags: [lenis, scrolltrigger, resizeobserver, webflow, modal, footer]
problem_type: "ui_bug"
severity: "high"
root_cause: "Lenis watches its content element with a ResizeObserver to recompute its scroll limit. With the window wrapper the default content is document.documentElement, and Webflow's base CSS sets html { height: 100% }, so the html box stays at viewport height while the page grows. The observer never fires and the limit stays at its first measurement."
date_resolved: "2026-10-26"
---

## Symptom

Feedback F18 (Guild Hotel, v1.1.7): on desktop wheel or trackpad, the page
stops before the footer; the copyright row is cut off. On `/` at 1440x900
Lenis stalled at scrollY 18142 against a true max of 18191. Touch scroll is
native and unaffected.

## Cause

- Lenis 1.3.x measures `content = document.documentElement` by default and
  observes it for size changes.
- Webflow sets `html { height: 100% }`; the site does not load Lenis' CSS
  (`html.lenis { height: auto }`). `documentElement.offsetHeight` stays at
  the viewport height while `scrollHeight` grows from lazy images, pin
  spacers (created after the engine) and CMS content.
- `scrollTriggerRefresh(document.body)` refreshed ScrollTrigger on body
  growth, but nothing told Lenis to `resize()`.

## Fix

```ts
instance = new Lenis({ wrapper: window, content: document.body })
// ...
scrollTriggerRefresh(document.body)
scrollTrigger.addEventListener('refresh', () => instance?.resize())
```

Body has no fixed height, so Lenis' own observer now fires; the refresh
listener also syncs the limit on load, pageshow and pin creation. It runs
from the refresh event, not from a scroll handler, so it cannot lock scroll.

Do not add Lenis' `.lenis.lenis-stopped { overflow: clip }` rule as a
workaround: it changes the modal page lock and hides the scrollbar.

## Modal variant of the same bug

A dialog Lenis (`modals.ts`, F22/F29) uses wrapper = content = the dialog,
which is `position: fixed; inset: 0`. Its box never resizes, so the same
stale limit appears when images inside the dialog load after open. The fix
there: observe the dialog's children with a ResizeObserver that calls
`resize()`, and promote the dialog's lazy images to eager before adding
`is-open`.
