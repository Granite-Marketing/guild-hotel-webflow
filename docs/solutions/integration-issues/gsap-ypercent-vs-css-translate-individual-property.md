---
title: "GSAP yPercent silently no-ops when the CSS rest state uses the translate individual property"
date: "2026-06-04"
category: "integration-issues"
module: "GSAP animations on Designer-styled elements"
component: "frontend_stimulus"
problem_type: "integration_issue"
severity: "high"
status: "resolved"
root_cause: "wrong_api"
resolution_type: "code_fix"
symptoms:
  - "A ScrollTrigger fires but the element tweened to yPercent: 0 does not move"
  - "Inline style ends up as transform: translate(0px, 43.4664px): absolute px, not percent"
  - "Element drifts on viewport resize"
  - "Resizing from desktop into mobile leaves the element hidden until a page refresh"
  - "Adding transform: translateY(115%) while the Designer Move is still set pushes it to 230%"
tags:
  - gsap
  - scrolltrigger
  - webflow-designer
  - css-translate
  - ypercent
  - matchmedia
  - transform-shorthand
---

# GSAP yPercent silently no-ops when the CSS rest state uses the translate individual property

## Problem

A scroll animation swaps two stacked logos inside a nav brand link: the wordmark slides up and out, the icon slides up into the slot it vacated. The icon's rest position (parked 115% below the slot) was set with Webflow Designer's **2D & 3D transforms > Move: 0px, 115%, 0px**. GSAP's tween to `yPercent: 0` produced no movement, and crossing the desktop breakpoint at runtime left the icon stuck off-screen until a hard refresh. The same applies to any element whose rest transform is set in the Designer and then animated by GSAP.

## Symptoms

- The element stays at its rest position although ScrollTrigger fires.
- DevTools shows inline `transform: translate(0px, 43.4664px)`: pixels, not the percent the tween targeted.
- Hand-typed percent compensation works at one viewport and breaks on resize.
- Crossing the breakpoint leaves GSAP's inline `transform` in place, hiding the element on mobile.
- Adding `transform: translateY(115%)` as a custom property while the Designer Move is still set puts the element at 230%: both apply.

## What Didn't Work

1. Symmetric `yPercent` values for both elements: both ended hidden.
2. Asymmetric `yPercent: -101` / `0`: correct intent, but the tween to `0` was a no-op because GSAP already believed `yPercent` was 0.
3. Hand-typed `transform` compensation in DevTools: only right at the test viewport.
4. `transform: translateY(115%)` as a custom property with the Designer Move still active: `translate` and `transform` composed.
5. `gsap.set(el, { yPercent: 115 })` behind a one-shot `if (window.matchMedia(...).matches) return`: fixed desktop, but the guard never re-ran on resize, so GSAP's inline styles survived into mobile.

## Solution

Four parts, each addressing a separate contributor.

### 1. Put the CSS rest state on `transform`, not `translate`

On the element's class, **Style panel > Custom properties**:

```
translate: none
transform: translateY(115%)
```

`translate: none` cancels the Designer Move panel's `translate: 0px 115% 0px`. `transform` re-expresses the same rest position on the property GSAP writes to.

### 2. Pre-declare GSAP's rest state in percent

```ts
gsap.set(element, { y: 0, yPercent: 115 })
```

This tells GSAP the current state before it reads the computed matrix and stores pixels.

### 3. `invalidateOnRefresh: true` on the ScrollTrigger

Re-reads from/to values on every `ScrollTrigger.refresh()` so percent units resolve against the current element height.

### 4. Wrap the whole setup in `gsap.matchMedia`

```ts
export const brandLogoSwap = () => {
  const wrapper = document.querySelector<HTMLElement>('.nav_brand-link')
  const wordmark = document.querySelector<HTMLElement>('.nav_logo.is-wordmark')
  const icon = document.querySelector<HTMLElement>('.nav_logo.is-icon')
  if (!wrapper || !wordmark || !icon) return

  const mm = gsap.matchMedia()

  mm.add({ isDesktop: '(min-width: 992px)' }, () => {
    gsap.set(wrapper, { overflow: 'clip', position: 'relative' })
    gsap.set(icon, { y: 0, yPercent: 115 })

    const timeline = gsap.timeline()
    timeline
      .to(wordmark, { yPercent: -114, duration: 0.4, ease: 'power2.inOut' }, 0)
      .to(icon, { yPercent: 0, duration: 0.4, ease: 'power2.inOut' }, 0)

    ScrollTrigger.create({
      start: 100,
      animation: timeline,
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    })
  })
}
```

When the query stops matching, `gsap.matchMedia` kills the tweens and ScrollTriggers created inside the callback and removes the inline styles they wrote, so the Designer's mobile stylesheet takes over with no manual cleanup.

## Why This Works

**`translate` and `transform` are separate properties that compose.** The CSS `translate`, `rotate` and `scale` individual properties apply on top of the `transform` shorthand. The Designer Move panel writes `translate`; GSAP writes `transform`. A perfect `yPercent: 0` still leaves the element 115% down because `translate` is untouched.

**GSAP reads the computed matrix in pixels.** On first touch, GSAP's CSSPlugin reads `getComputedStyle(el).transform`, which is always a resolved matrix (`matrix(1, 0, 0, 1, 0, 43.4664)`). It cannot know that 43.4664px came from 115%, so it stores `y: 43.4664px, yPercent: 0`. A tween to `yPercent: 0` is then already satisfied. Pre-declaring with `gsap.set` replaces that cache with explicit percent values.

**`gsap.matchMedia` is the only safe breakpoint scope.** A one-shot guard never tears down. See rule 6 in [gsap-module-conventions.md](../conventions/gsap-module-conventions.md).

**`invalidateOnRefresh` keeps percent honest on resize.** Without it the tween keeps targeting the pixel values resolved at creation.

## Prevention

- **Never use the Designer's "2D & 3D transforms > Move" on an element GSAP animates.** Set rest transforms as a custom property (`transform: translateY(115%)`), or add `translate: none` if the Move setting cannot be removed.
- **Pair every breakpoint-scoped GSAP animation with `gsap.matchMedia`.**
- **When inheriting a percent rest state from CSS, pre-declare it** with `gsap.set({ y: 0, yPercent: N })` before any tween touches the element.
- **Add `invalidateOnRefresh: true`** to any ScrollTrigger whose tween uses percent units on a responsively sized element.
- **Check in DevTools after the animation runs:** `translate(0%, 0%)` (percent) is correct; `translate(0px, <baked>px)` means GSAP is in pixel mode and will drift.

## Related

- [gsap-module-conventions.md](../conventions/gsap-module-conventions.md): rule 6, the `gsap.matchMedia` keyed-object form
- [flex-item-shrinks-when-sibling-appears.md](../ui-bugs/flex-item-shrinks-when-sibling-appears.md): a different nav brand bug (flex sibling reflow) found in the same release cluster
