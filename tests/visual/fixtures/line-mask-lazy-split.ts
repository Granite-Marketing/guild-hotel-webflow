/**
 * Fixture entry for line-mask-lazy-split.html: wires every `[data-fixture-reveal]`
 * block the way scrollReveal.ts does (one-shot line mask, ScrollTrigger at
 * `top 90%`, once), so the spec can check what a visitor gets while the
 * page is still loading.
 */

import { prepareLineMaskReveal } from '../../../src/utils/lineMaskReveal'

declare global {
  interface Window {
    fixtureInitMs?: number
    fixtureReady?: boolean
    fixturePlays?: Record<string, number>
  }
}

const started = performance.now()
gsap.registerPlugin(ScrollTrigger)
window.fixturePlays = {}

document.querySelectorAll<HTMLElement>('[data-fixture-reveal]').forEach((block) => {
  const reveal = prepareLineMaskReveal(block)
  const id = block.dataset.fixtureReveal ?? ''
  ScrollTrigger.create({
    trigger: block,
    start: 'top 90%',
    once: true,
    onEnter: () => {
      window.fixturePlays![id] = (window.fixturePlays![id] ?? 0) + 1
      reveal.play()
    },
  })
})

window.fixtureInitMs = performance.now() - started
window.fixtureReady = true
