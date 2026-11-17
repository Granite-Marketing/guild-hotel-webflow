/** Fixture entry for hero-on-load.html: runs the real scrollReveal and heroImageScale in src/index.ts order. */

import { heroImageScale } from '../../../src/utils/heroImageScale'
import { scrollReveal } from '../../../src/utils/scrollReveal'

gsap.registerPlugin(ScrollTrigger)
scrollReveal()
heroImageScale()
document.documentElement.classList.add('reveal-ready')
;(window as unknown as { fixtureReady: boolean }).fixtureReady = true
