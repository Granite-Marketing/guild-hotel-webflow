/**
 * Fixture entry for day-night-a.html and day-night-b.html: runs the real
 * dayNight, buttonHover, heroTextReveal and line mask modules in the
 * src/index.ts order (day and night first, before anything splits text).
 */

import { buttonHover } from '../../../src/utils/buttonHover'
import { dayNight } from '../../../src/utils/dayNight'
import { heroTextReveal } from '../../../src/utils/heroTextReveal'
import { createLineMaskTimeline } from '../../../src/utils/lineMaskReveal'

gsap.registerPlugin(ScrollTrigger)
dayNight()
buttonHover()
heroTextReveal()
const masked = document.querySelector<HTMLElement>('[data-fixture-mask]')
if (masked) createLineMaskTimeline(masked).play()
;(window as unknown as { fixtureReady: boolean }).fixtureReady = true
