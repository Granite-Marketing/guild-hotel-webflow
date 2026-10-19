---
title: "GSAP module conventions for the Webflow bundle"
date: "2026-05-28"
last_refreshed: "2026-10-19"
category: "conventions"
module: "src/utils (all GSAP modules)"
component: "frontend_stimulus"
problem_type: "convention"
severity: "low"
applies_when:
  - "Building a new GSAP-based module in src/utils/"
  - "Adding an overlay UI (modal, nav menu, drawer, lightbox)"
  - "Making an element's look depend on what it overlaps during scroll"
  - "Writing responsive animations that differ between desktop and mobile"
  - "Showing or hiding elements from JS"
tags:
  - gsap
  - scrolltrigger
  - splittext
  - matchmedia
  - autoalpha
  - module-pattern
  - webflow-bundle
  - scrollsmoother
---

# GSAP module conventions for the Webflow bundle

## Context

These rules came out of a batch of client-reported bugs on a production Webflow build using the single-bundle pattern from `CLAUDE.md` (one `src/index.ts`, feature modules in `src/utils/`, CDN globals inside `Webflow.push`). The bugs were: page scroll bleeding through the nav overlay, a floating button flashing between dark and light while scrolling, invisible elements eating clicks, and "footer" detection picking up the wrong element. Each rule below is the pattern that fixed one of them.

Rules 1 to 8 apply whichever scroll engine the project uses. Rules 9 and 10 apply only when a project opts into ScrollSmoother (the default is Lenis).

## Guidance

### 1. Pause page scroll for overlay UIs, resume after the close animation

Any UI that takes over the viewport (modal, nav menu, drawer, lightbox) pauses page scroll on open and resumes it in the close animation's `onComplete`, never before. Go through the engine facade so the module works under Lenis and ScrollSmoother alike:

```ts
import { smoothScroll } from '$utils/smoothScroll'

const openNav = () => {
  smoothScroll.stop()
  navWrapper.classList.add('is-open')
  gsap.to(navWrapper, { autoAlpha: 1, duration: 0.3 })
}

const closeNav = () => {
  gsap.to(navWrapper, {
    autoAlpha: 0,
    duration: 0.3,
    onComplete: () => {
      navWrapper.classList.remove('is-open')
      smoothScroll.start()
    },
  })
}
```

Resuming before the close animation finishes causes a visible scroll jump. Without the pause the page scrolls behind the overlay on touch devices. `modals.ts` follows the same contract.

### 2. Scroll-aware theming: track intersections in a Set, evaluate once per frame

When an element's look depends on which content it overlaps (a floating button that turns dark over white sections), create one ScrollTrigger per section, record active intersections in a `Set`, and evaluate in a debounced `requestAnimationFrame`:

```ts
const activeSections = new Set<HTMLElement>()
let evaluatePending = false

const evaluate = () => {
  evaluatePending = false
  button.classList.toggle('is-dark', activeSections.size > 0)
}

const scheduleEvaluate = () => {
  if (evaluatePending) return
  evaluatePending = true
  requestAnimationFrame(evaluate)
}

lightSections.forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: () => `top ${getButtonCenter()}`,
    end: () => `bottom ${getButtonCenter()}`,
    onToggle: (self) => {
      if (self.isActive) activeSections.add(section)
      else activeSections.delete(section)
      scheduleEvaluate()
    },
  })
})
```

Adjacent triggers fire `onToggle` at slightly different subpixel positions within one frame. Toggling the class directly in each callback (`onEnter: add`, `onLeave: remove`) makes the element flash between states. Gate with `gsap.matchMedia()` below breakpoints where the logic does not apply.

### 3. `autoAlpha`, not `opacity`, to hide elements

```ts
gsap.to(element, { opacity: 0 })   // wrong: invisible but still clickable
gsap.to(element, { autoAlpha: 0 }) // right: also sets visibility: hidden
```

At 0, `autoAlpha` sets `visibility: hidden`, so the element stops intercepting clicks. Invisible-but-clickable elements produce bugs where the user clicks hidden UI and nothing visible responds.

### 4. Toggle only the non-default class

When an element has a default state, toggle only the opposite class so a detection failure falls back to the default:

```ts
button.classList.toggle('is-dark', isOverLightSection) // right

button.classList.remove('is-light')                    // wrong: two classes,
button.classList.add('is-dark')                        // both can end up absent
```

### 5. Show and hide with classes, never inline `display`

Modules add or remove an `is-active` (or similar) class. They never write `style.display = 'none'`. Visibility, transitions and responsive behaviour live in Webflow combo classes; inline styles override them and take that control away from the Designer.

### 6. `gsap.matchMedia()` keyed-object form for responsive animations

Use the keyed form when desktop and mobile animations differ in structure, not just values. It matches `src/types/gsap.d.ts` and reverts every tween, ScrollTrigger and inline style created inside the callback when the query stops matching:

```ts
const mm = gsap.matchMedia()
mm.add(
  { isDesktop: '(min-width: 992px)', isMobile: '(max-width: 991px)' },
  (context) => {
    const { isMobile } = context.conditions
    if (isMobile) {
      gsap.from(heading, { y: 20, autoAlpha: 0 })
      return
    }
    // desktop: SplitText reveal, pins
  },
)
```

A one-shot `if (window.matchMedia(...).matches) return` guard only runs at init. It never tears down when the viewport later crosses the breakpoint. See [gsap-ypercent-vs-css-translate-individual-property.md](../integration-issues/gsap-ypercent-vs-css-translate-individual-property.md) for a worked example.

### 7. SplitText word reveal: mask lines manually, never `mask: 'lines'`

```ts
new SplitText(heading, {
  types: 'words, lines',
  autoSplit: true,
  onSplit: (self) => {
    gsap.set(self.lines, { overflow: 'hidden' })
    gsap.set(self.words, { y: '110%' })
    return gsap.to(self.words, { y: '0%', stagger: 0.1 })
  },
})
```

`mask: 'lines'` wraps each line in an extra inline-block with `overflow: hidden`, so there are two nested inline-block layers. That changes inline width and whitespace handling enough that short phrases wrap onto a second line. Setting `overflow: hidden` on `self.lines` gives the same clip with no layout side effect. Keep `autoSplit: true` per `CLAUDE.md`. The option is plural `types:`; singular `type:` is silently ignored.

### 8. Target the site footer by class, never by tag

```ts
document.querySelector('footer')                // wrong: first CTA wrapper in DOM order
document.querySelector<HTMLElement>('.footer')  // right: the site footer
```

The starter's semantic rules put a `<footer>` element on every CTA wrapper (see [component-patterns.md](../../reference/component-patterns.md)), so the tag selector matches the first CTA in the page.

### Mirror overlays snap, they do not fade

If a module clones a live element into a masked overlay (for example a recoloured copy of the header over dark sections), show and hide the clone instantly. A fade exposes the underlying element's own transition during the fade window, which reads as a flash. Prepare the clone's state (mask, colour, transform) before setting `display = ''`, and give any `requestAnimationFrame` or `gsap.ticker` loop that skips work while frozen a reset sentinel so it recomputes on the first tick after the freeze lifts. Test on a page where the theming branch actually fires.

## ScrollSmoother only

Applies when a project opts into ScrollSmoother; the default is Lenis.

### 9. `allowNestedScroll` for inline scrollable containers

When elements inside `#smooth-content` need their own scroll (a horizontal filter bar, a scrollable list), configure normalizeScroll with `allowNestedScroll`:

```ts
ScrollSmoother.create({ normalizeScroll: true })                         // nested scroll breaks
ScrollSmoother.create({ normalizeScroll: { allowNestedScroll: true } })  // nested scroll works
```

normalizeScroll intercepts every scroll gesture, including those on nested scrollers. Even with this flag, tap targets inside a horizontal scroller can receive a click at the end of a swipe; see [mobile-swipe-opens-filter-dropdowns-normalizescroll.md](../ui-bugs/mobile-swipe-opens-filter-dropdowns-normalizescroll.md).

### 10. Pause the smoother itself for overlays

Under ScrollSmoother, `smoothScroll.stop()` maps to `smoother.paused(true)`. Do not fall back to body-offset scroll locks or wheel/touchmove blockers; they double-shift the page under normalizeScroll. Overlays must also live outside `#smooth-content` in the Designer. See [scrollsmoother-modal-paused-scroll-lock.md](../integration-issues/scrollsmoother-modal-paused-scroll-lock.md).

## Related

- [scrollsmoother-modal-paused-scroll-lock.md](../integration-issues/scrollsmoother-modal-paused-scroll-lock.md): investigation behind rules 1 and 10
- [scrollsmoother-vs-lenis-cache-divergence.md](../integration-issues/scrollsmoother-vs-lenis-cache-divergence.md): when a project should pick ScrollSmoother
- [bundle-migration-and-release-gotchas.md](../workflow-issues/bundle-migration-and-release-gotchas.md): the SplitText regression behind rule 7
- [runtime-modules.md](../../reference/runtime-modules.md): the smooth-scroll facade and engine swap
