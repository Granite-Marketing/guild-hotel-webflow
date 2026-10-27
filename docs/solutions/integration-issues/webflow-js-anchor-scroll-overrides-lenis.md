---
title: "Webflow.js re-scrolls same-page # links after our Lenis scroll"
date: "2026-10-27"
category: "integration-issues"
module: "modals.ts, roomsQuiz.ts, lenisGsap.ts"
problem_type: integration_issue
component: frontend_stimulus
symptoms:
  - "A link with href=\"#section\" scrolls to the right place, then about a second later jumps by the nav height"
  - "The URL gains #section even though our click handler calls preventDefault()"
  - "Only links whose href names an element id are affected; href=\"#\" links are not"
root_cause: wrong_api
resolution_type: code_fix
severity: medium
tags: [webflow, lenis, anchor-scroll, hash-link, stoppropagation, fixed-nav, modals, scroll-offset]
---

# Webflow.js re-scrolls same-page # links after our Lenis scroll

## Problem
On /rooms (F26 rooms quiz, PR #118 and PR #120), "back to the quiz" links with `href="#rooms-quiz"` were meant to land the quiz flush at the viewport top. Our handler called `preventDefault()` and scrolled with Lenis, but the page then settled 92px short, which is the fixed nav's height. The previous section showed through the transparent nav.

## Symptoms
- The scroll looked right at first. A frame log showed `scrollY` reaching the target (1969) at about 1.2s, then snapping to 1876 at about 1.4s.
- The address bar showed `/rooms#rooms-quiz` even though our handler prevented the default action.
- `href="#"` option links in the same section never moved.

## What Didn't Work
- **Blaming our own nav offset.** `smoothScroll.scrollTo` subtracts the fixed nav height. Adding `data-scroll-flush` (offset 0) fixed the results scroll but not the restart scroll.
- **Blaming `ScrollTrigger.refresh(true)`.** The deferred refresh fires as the scroll settles, which matched the timing. Switching to a synchronous `refresh()` changed nothing.
- **Trusting `preventDefault()`.** Webflow.js does not check `event.defaultPrevented`.

## Solution
Webflow.js binds its own smooth anchor scroll to same-page `#id` links as a delegated document click handler. That handler scrolls to the target clear of any fixed header and pushes the hash. It is registered before our bundle, so ours cannot run first at the document level. The click must never reach it.

The proof was in the browser: with an element-level listener calling `stopPropagation()`, the quiz landed at 0. Without it, the quiz landed at 92.

**Element-owned links:** stop propagation at the element. See `src/utils/roomsQuiz.ts:212`.

```ts
restart.addEventListener('click', (event) => {
  event.preventDefault()
  // Webflow.js scrolls `#rooms-quiz` links itself, clear of the nav, after
  // this scroll settles; keep the click from reaching its document handler.
  event.stopPropagation()
  // ...our own smoothScroll.scrollTo(root)
})
```

**Delegated handlers on document:** a bubble-phase listener on `document` cannot beat Webflow's handler, which is also on `document` and registered earlier. Handle the case in the capture phase and stop it there. See `src/utils/modals.ts:300`.

```ts
document.addEventListener('click', (event) => {
  const closeButton = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-modal-close]')
  if (!closeButton || !activeModal) return
  const targetId = hashTarget(closeButton.getAttribute('href'))
  if (!targetId || getDialog(targetId)) return
  const section = document.getElementById(targetId)
  if (!section) return
  event.preventDefault()
  event.stopPropagation()
  closeAndScrollTo(section)
}, true)
```

Stopping propagation in the capture phase at `document` also stops our own bubble-phase handler, so the capture listener has to do the whole job itself.

## Why This Works
Our scroll and Webflow's scroll both run, one after the other. Webflow's runs last and wins, so the page ends 92px off. `preventDefault()` only blocks the browser's native jump. Stopping propagation keeps the event from reaching Webflow's jQuery handler, so only our scroll happens and no hash is pushed.

## Prevention
- Any same-page `href="#id"` link that our runtime scrolls must stop propagation, at the element or in a capture-phase document listener. If you want full control, prefer `href="#"` with the target in a data attribute.
- **Diagnosing a jump:** log `scrollY` every frame across the click. A correct landing followed by a late jump of exactly the nav height means two scrollers ran. The Webflow fingerprint is the hash appearing in the URL despite `preventDefault()`.
- **Verifying on staging:** drive the real site headlessly; the fixture pages do not load Webflow.js. To test an unpublished bundle against the live page, reroute the CDN URL with `page.route('**/guild-hotel-webflow@*/dist/index.js', …)`.
- **Full-height sections** that should sit under a transparent fixed nav carry `data-scroll-flush`, so `smoothScroll.scrollTo` uses offset 0 (`src/utils/lenisGsap.ts:80`).

## Related Issues
- `docs/solutions/integration-issues/scrollsmoother-modal-paused-scroll-lock.md` covers modal scroll locking under a smooth-scroll engine.
- Contract notes: `docs/reference/runtime-modules.md` (navTheme and roomsQuiz sections).
