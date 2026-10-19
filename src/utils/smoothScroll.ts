/**
 * Smooth Scroll facade: the one place that picks the scroll engine.
 *
 * Every module that needs to pause page scroll (modals, navToggle) or read
 * the scroll position (debugOverlay) imports `smoothScroll` from here, never
 * from an engine file directly. Swapping engines is a one-line change below:
 *
 *   Lenis (default):
 *     export { lenisEngine as smoothScroll } from '$utils/lenisGsap'
 *
 *   GSAP ScrollSmoother (opt-in, see docs/reference/runtime-modules.md for
 *   the Designer structure checklist before switching):
 *     export { scrollSmootherEngine as smoothScroll } from '$utils/gsapSmoothScroll'
 *
 * `src/index.ts` calls `smoothScroll.init()` once, so it follows the swap
 * automatically.
 */

export interface SmoothScrollEngine {
  /** Engine label shown in the debug overlay. */
  name: string
  /** Create the engine and its ScrollTrigger refresh layers. Call once. */
  init: () => void
  /** Pause page scroll (modal or mobile nav open). */
  stop: () => void
  /** Resume page scroll. */
  start: () => void
  /** Current scroll offset in pixels. */
  scrollTop: () => number
  /** Engine-specific state for the debug overlay. */
  describe: () => Record<string, string | number | boolean>
}

export { lenisEngine as smoothScroll } from '$utils/lenisGsap'
