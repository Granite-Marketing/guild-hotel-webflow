/**
 * Lenis + GSAP wiring: default smooth-scroll engine for the bundle.
 *
 * Lenis is loaded as a CDN ambient global (declared in `src/types/gsap.d.ts`).
 * Other modules do not import from this file directly: they import
 * `smoothScroll` from `$utils/smoothScroll`, which re-exports `lenisEngine`
 * below. Swapping to ScrollSmoother is then a one-line change in that facade.
 *
 * Under Lenis the document itself scrolls, so native `position: sticky` and
 * `position: fixed` keep working and `document.body` grows with content.
 * The engine-neutral ScrollTrigger refresh layers therefore observe the body.
 *
 * Do not combine Lenis with ScrollTrigger.normalizeScroll: they fight over
 * touch input.
 */

import type { SmoothScrollEngine } from '$utils/smoothScroll'
import { scrollTriggerRefresh } from '$utils/scrollTriggerRefresh'

let instance: LenisInstance | null = null

/** Raw handle kept for projects that already import `lenis` directly. */
export const lenis = {
  get raw(): LenisInstance | null {
    return instance
  },
  stop(): void {
    instance?.stop()
  },
  start(): void {
    instance?.start()
  },
}

export const lenisGsap = (
  gsapInstance: GsapInstance,
  scrollTrigger: ScrollTriggerStatic,
): void => {
  instance = new Lenis({})

  gsapInstance.registerPlugin(scrollTrigger)

  instance.on('scroll', scrollTrigger.update)

  gsapInstance.ticker.add((time: number) => {
    instance?.raf(time * 1000)
  })

  gsapInstance.ticker.lagSmoothing(0)

  scrollTriggerRefresh(document.body)
}

export const lenisEngine: SmoothScrollEngine = {
  name: 'Lenis',
  init: () => lenisGsap(gsap, ScrollTrigger),
  stop: () => lenis.stop(),
  start: () => lenis.start(),
  scrollTop: () => instance?.scroll ?? window.scrollY,
  describe: (): Record<string, string | number | boolean> =>
    instance
      ? {
          active: true,
          scroll: instance.scroll,
          targetScroll: instance.targetScroll,
          velocity: instance.velocity,
          isScrolling: instance.isScrolling,
        }
      : { active: false },
}
