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
 * Lenis measures `document.body`, not the default `document.documentElement`:
 * Webflow's base CSS sets `html { height: 100% }`, so the html box never
 * grows, Lenis' content ResizeObserver never fires and its scroll limit goes
 * stale after lazy images, pin spacers or CMS content load (F18: the footer
 * could not be reached). Every ScrollTrigger refresh also calls
 * `lenis.resize()`, so the limit follows the same refresh layers.
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
  instance = new Lenis({ wrapper: window, content: document.body })

  gsapInstance.registerPlugin(scrollTrigger)

  instance.on('scroll', scrollTrigger.update)

  gsapInstance.ticker.add((time: number) => {
    instance?.raf(time * 1000)
  })

  gsapInstance.ticker.lagSmoothing(0)

  scrollTriggerRefresh(document.body)

  // Keep Lenis' scroll limit in step with every refresh (load, pageshow,
  // body resize, pin creation). Runs from the refresh event, never from a
  // scroll handler, so it cannot lock scroll.
  scrollTrigger.addEventListener('refresh', () => instance?.resize())
}

/** Height a fixed `[data-nav="header"]` covers at the top of the viewport. */
const fixedNavOffset = () => {
  const header = document.querySelector<HTMLElement>('[data-nav="header"]')
  if (!header || getComputedStyle(header).position !== 'fixed') return 0
  const bar = header.querySelector<HTMLElement>('.site-nav_bar') ?? header
  return Math.max(0, bar.getBoundingClientRect().bottom)
}

export const lenisEngine: SmoothScrollEngine = {
  name: 'Lenis',
  init: () => lenisGsap(gsap, ScrollTrigger),
  stop: () => lenis.stop(),
  start: () => lenis.start(),
  scrollTo: (target: HTMLElement) => {
    const offset = -fixedNavOffset()
    if (instance) instance.scrollTo(target, { offset })
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
  },
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
