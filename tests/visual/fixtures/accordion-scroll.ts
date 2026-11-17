/**
 * Fixture entry for accordion-scroll.html: the Lenis engine and the accordion
 * as the bundle wires them, plus a scrubbed footer trigger like the live
 * footer scale reveal. `window.__refreshCount` counts ScrollTrigger refreshes.
 * Built in memory by the Playwright spec.
 */

import { accordion } from '../../../src/utils/accordion'
import { smoothScroll } from '../../../src/utils/smoothScroll'

declare global {
  interface Window {
    __refreshCount: number
  }
}

window.__refreshCount = 0
ScrollTrigger.addEventListener('refresh', () => {
  window.__refreshCount += 1
})

accordion()
if (new URLSearchParams(location.search).get('engine') !== 'none') smoothScroll.init()
gsap.fromTo(
  '.footer_scale',
  { scale: 0.8 },
  {
    scale: 1,
    ease: 'none',
    scrollTrigger: { trigger: '.section_footer-links', start: 'top bottom', end: 'bottom bottom', scrub: true },
  },
)
gsap.fromTo(
  '.cta_reveal',
  { autoAlpha: 0, y: 40 },
  { autoAlpha: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: '.cta_reveal', start: 'top 85%' } },
)
