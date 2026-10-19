/**
 * ScrollTrigger Refresh Layers (engine-neutral)
 *
 * ScrollTrigger caches every trigger's start/end in pixels. Its built-in
 * autoRefreshEvents cover window resize and load, but not DOM-driven height
 * changes (CMS hydration, late images without reserved aspect ratio,
 * accordion expand, SplitText resplits) or bfcache restores. Any of those
 * leaves triggers below the change firing early or late.
 *
 * Called once by the active scroll engine during init:
 *   - Lenis:          scrollTriggerRefresh(document.body)
 *   - ScrollSmoother: scrollTriggerRefresh(#smooth-content), because under
 *                     ScrollSmoother the body is height-locked to the
 *                     viewport and never resizes.
 *
 * Layers:
 *   1. ScrollTrigger.config({ ignoreMobileResize: true }): the mobile URL
 *      bar showing/hiding is not a layout change, so do not refresh on it.
 *   2. window load: refresh once every eager image has landed.
 *   3. pageshow with event.persisted: bfcache restores fire neither
 *      DOMContentLoaded nor load.
 *   4. ResizeObserver on the content element, height-only, collapsed into
 *      one refresh per animation frame.
 *
 * Every call is ScrollTrigger.refresh(true): the safe form defers until
 * momentum scroll settles. Never call a bare refresh() from a scroll
 * handler, gsap.ticker callback or lenis.on('scroll'); that locks scroll.
 */

export const scrollTriggerRefresh = (contentElement: HTMLElement) => {
  ScrollTrigger.config({ ignoreMobileResize: true })

  window.addEventListener('load', () => ScrollTrigger.refresh(true), { once: true })

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) ScrollTrigger.refresh(true)
  })

  let refreshPending = false
  let lastHeight = contentElement.offsetHeight
  const contentResizeObserver = new ResizeObserver(() => {
    const height = contentElement.offsetHeight
    if (height === lastHeight || refreshPending) return
    lastHeight = height
    refreshPending = true
    requestAnimationFrame(() => {
      refreshPending = false
      ScrollTrigger.refresh(true)
    })
  })
  contentResizeObserver.observe(contentElement)
}
