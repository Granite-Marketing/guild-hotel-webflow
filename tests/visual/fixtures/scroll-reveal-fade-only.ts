/** Fixture entry for scroll-reveal-fade-only.html: runs the real scrollReveal module. */

import { scrollReveal } from '../../../src/utils/scrollReveal'

gsap.registerPlugin(ScrollTrigger)
scrollReveal()
document.documentElement.classList.add('reveal-ready')
;(window as unknown as { fixtureReady: boolean }).fixtureReady = true
