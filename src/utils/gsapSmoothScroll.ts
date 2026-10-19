/**
 * GSAP ScrollSmoother engine (opt-in alternative to Lenis).
 *
 * To adopt: change the export in `src/utils/smoothScroll.ts` to
 *   export { scrollSmootherEngine as smoothScroll } from '$utils/gsapSmoothScroll'
 * add the ScrollSmoother CDN tag after ScrollTrigger in Webflow Site
 * Settings, and work through the swap checklist in
 * docs/reference/runtime-modules.md first.
 *
 * ScrollSmoother shares ScrollTrigger's scroll model, so there is no
 * separate cache to sync. It does impose a DOM structure:
 *   - The page's main wrapper carries `id="smooth-content"`. ScrollSmoother
 *     wraps it in `#smooth-wrapper` and translates it every frame.
 *   - Anything that must stay fixed to the viewport (nav, modals and their
 *     overlay, the Webflow badge) lives OUTSIDE `#smooth-content`. A
 *     transformed ancestor re-bases `position: fixed`.
 *   - Inside `#smooth-content`, CSS `position: fixed` and `position: sticky`
 *     break; use `[data-pin]` (scrollPin.ts) instead.
 *
 * Touch: smoothTouch false keeps native momentum. normalizeScroll with
 * allowNestedScroll lets nested overflow areas (modals, filter rows) scroll.
 * normalizeScroll can turn a blocked swipe into a click; see filterPanels.ts
 * for the travel-distance guard.
 *
 * Pausing: stop()/start() call `paused(true|false)`. A paused smoother stops
 * processing scroll events, which releases a modal's own overflow-y:auto.
 * Do not add body.style.top or a no-scroll class on top of this: under
 * normalizeScroll that double-shifts the page.
 */

import type { SmoothScrollEngine } from '$utils/smoothScroll'
import { scrollTriggerRefresh } from '$utils/scrollTriggerRefresh'

let smootherInstance: ScrollSmootherInstance | null = null

export const getSmoother = (): ScrollSmootherInstance | null => smootherInstance

export const gsapSmoothScroll = () => {
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(ScrollSmoother)

  // iOS fallback: if touch jitter is reported, gate creation behind
  //   if (ScrollTrigger.isTouch === 1) { scrollTriggerRefresh(document.body); return }
  // so touch devices scroll natively. stop()/start() become no-ops there,
  // and modals, [data-pin] and [data-eager] keep working.
  smootherInstance = ScrollSmoother.create({
    smooth: 1.2,
    effects: true,
    smoothTouch: false,
    normalizeScroll: { allowNestedScroll: true },
  })

  // Under ScrollSmoother the body is height-locked to the viewport, so the
  // refresh ResizeObserver must watch the transformed content wrapper.
  const smoothContent = document.getElementById('smooth-content')
  if (!smoothContent) {
    console.warn('[gsapSmoothScroll] #smooth-content missing: height-change refreshes will not fire')
  }
  scrollTriggerRefresh(smoothContent ?? document.body)
}

export const scrollSmootherEngine: SmoothScrollEngine = {
  name: 'ScrollSmoother',
  init: gsapSmoothScroll,
  stop: () => {
    smootherInstance?.paused(true)
  },
  start: () => {
    smootherInstance?.paused(false)
  },
  scrollTop: () => smootherInstance?.scrollTop() ?? window.scrollY,
  describe: (): Record<string, string | number | boolean> =>
    smootherInstance
      ? {
          active: true,
          scrollTop: smootherInstance.scrollTop(),
          velocity: smootherInstance.getVelocity(),
          progress: smootherInstance.progress,
          paused: smootherInstance.paused(),
          smoothWrapper: !!document.getElementById('smooth-wrapper'),
          smoothContent: !!document.getElementById('smooth-content'),
        }
      : { active: false },
}
