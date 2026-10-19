---
title: "Swiper sliders inside CMS-Nest-injected content: re-init in the cmsnest callback, scope pagination per-instance"
date: "2026-07-13"
category: "integration-issues"
component: "Swiper 11, Finsweet Attributes CMS Nest v1, Webflow"
tags: [swiper, finsweet, cms-nest, fsattributes, pagination, modal, injected-content, re-init, observer]
severity: "medium"
root_cause: "Swiper is initialized once on page load, but CMS Nest injects the slider markup AFTER load, so the injected `.swiper` elements never receive a `new Swiper()`. Re-running the init without a per-element guard double-inits page sliders; re-running it with a global pagination selector binds every modal to the first pagination bar; initializing on a `display:none` modal computes zero-width layout."
problem_type: "integration_issue"
status: "resolved"
resolution_type: "code_fix"
symptoms:
  - "Slider markup (`.swiper`, `.swiper-wrapper`, `.swiper-slide`) is present with correct classes but slides just stack — no Swiper behavior"
  - "After re-initializing, slider moves but has no pagination, no loop, none of the original config"
  - "All modal sliders share/fight over one pagination bar"
  - "Slider is mis-sized on first open because the modal was hidden when Swiper was created"
---

# Swiper sliders inside CMS-Nest-injected content

## Problem

A slider lives inside CMS-Nest-injected markup (e.g. a per-item modal). The HTML is
correct — right `.swiper` / `.swiper-wrapper` / `.swiper-slide` classes — but the slides
just stack. Nothing animates.

## Root cause

`SwiperSliders()` (the init) runs on page load / `Webflow.push`. **CMS Nest injects the
modal markup *after* that**, so at init time the injected `.swiper` elements don't exist
yet and never get a `new Swiper()`. Same class of bug as any JS that runs on
`DOMContentLoaded` against content that arrives later.

## Solution

Re-run the Swiper init in CMS Nest's completion callback, via the `fsAttributes` queue
(CMS Nest v1 resolves a `cmsnest` loading promise when nesting finishes):

```js
const SwiperSliders = () => {
  document.querySelectorAll('.swiper.default').forEach((el) => {
    if (el.swiper) return;                 // (1) skip already-initialized sliders
    new Swiper(el, {
      // ── ALL of your original options must be here, verbatim ──
      loop: true,
      slidesPerView: 1,
      // speed, effect, autoplay, spaceBetween, breakpoints, …

      pagination: {                        // (2) scope controls to THIS slider
        el: el.querySelector('.swiper-pagination'),
        clickable: true,
      },
      // navigation: { nextEl: el.querySelector('.swiper-next'), prevEl: el.querySelector('.swiper-prev') },

      observer: true,                      // (3) re-measure when the hidden modal opens
      observeParents: true,
    });
  });
};

SwiperSliders();                           // initial on-load run

window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push(['cmsnest', () => SwiperSliders()]);  // re-run after injection
```

### The three things that each break it if omitted

1. **`if (el.swiper) return`** — the callback re-runs the whole init, so without this guard
   the *page-level* sliders get initialized a second time. Skipping any element that
   already has a live `.swiper` instance means only the freshly-injected modal sliders get
   built.
2. **`el.querySelector('.swiper-pagination')`, not the global string `'.swiper-pagination'`**
   — every injected slider contains its own `.swiper-pagination`. A global selector binds
   every instance to the *first* match, so the dots break or all modals share one bar.
   Resolve pagination/navigation elements *relative to each slider element*.
3. **`observer: true, observeParents: true`** — modals are `display:none` until opened. A
   Swiper created on a zero-width element computes broken widths/pagination. `observer`
   makes it re-measure automatically when the modal becomes visible. (Fallback if still
   mis-sized: call `el.swiper.update()` on modal open.)

**Also non-obvious:** the re-init `new Swiper()` needs the *full original config*. Adding
only `observer`/`observeParents` yields a slider with no pagination, no loop, no styles —
those come from your options, which must be duplicated (or, cleaner, shared) into this
call. `observer`/`observeParents` are additions, not the whole config.

## Placement & ordering

- Lives in the **footer custom code** (or the bundle), right after `SwiperSliders` is
  defined. Do **not** register it in both inline code and the bundle — that pushes the
  callback twice.
- **Swiper bundle must load before this** (`Swiper` must be defined).
- **Order relative to the `cmsnest.js` script tag does not matter** — `fsAttributes` is a
  queue; you push a callback and CMS Nest drains it whenever it loads.
- `SwiperSliders` must be defined before the callback fires (it fires async, after
  nesting) — defining it just above the `push` guarantees that.

## Prevention

- Any init (Swiper, GSAP, SplitText, custom listeners) that targets CMS-Nest-injected
  content must run **again** in the `fsAttributes.push(['cmsnest', cb])` callback — the
  on-load pass can't see injected DOM.
- Make re-runnable inits idempotent (`if (el.swiper) return`, or destroy-before-recreate).
- Scope per-instance controls (pagination, navigation) to the element, never a global
  selector, whenever more than one instance can exist.

## Related

- [`finsweet-cms-nest-v1-two-modes-collection-page-links.md`](./finsweet-cms-nest-v1-two-modes-collection-page-links.md) — the CMS Nest mechanism that injects this content
- `docs/reference/swiper-slider-setup.md` — base Swiper class structure and per-type config
