/**
 * Scroll Reveal (desktop feedback, Trello "General Text/Image Scroll Animation")
 *
 * One attribute any block can opt into from the Designer; each plays once
 * when the block scrolls into view:
 *   data-reveal="fade"        soft dissolve: fades in while rising 2rem, eased
 *   data-reveal="text-mask"   line mask: each line's words rise from behind
 *                             their own edge (headings, paragraphs, buttons
 *                             and figures inside, or the element itself)
 *   data-reveal="image-mask"  mask reveal: the block opens upward from its
 *                             bottom edge while the media inside settles
 *                             from a slight zoom
 * Optional data-reveal-delay="0.2" (seconds) staggers neighbours.
 *
 * Reduced motion shows everything at once. Runs after the DOM-mutating
 * modules, like the other ScrollTrigger reveals.
 */

import { prepareLineMaskReveal } from '$utils/lineMaskReveal'

const START = 'top 85%'
const EASE = 'power3.out'

export const scrollReveal = () => {
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!elements.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  elements.forEach((element) => {
    const delay = Number(element.dataset.revealDelay) || 0
    const kind = element.dataset.reveal

    if (kind === 'fade') {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: '2rem' },
        { autoAlpha: 1, y: 0, duration: 1.2, delay, ease: EASE, scrollTrigger: { trigger: element, start: START, once: true } },
      )
      return
    }

    if (kind === 'text-mask') {
      const reveal = prepareLineMaskReveal(element)
      ScrollTrigger.create({
        trigger: element,
        start: START,
        once: true,
        onEnter: () => gsap.delayedCall(delay, reveal.play),
      })
      return
    }

    if (kind === 'image-mask') {
      const media = element.querySelector<HTMLElement>('img, video, iframe')
      const timeline = gsap.timeline({ delay, scrollTrigger: { trigger: element, start: START, once: true } })
      timeline.fromTo(element, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.inOut' })
      if (media) timeline.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.8, ease: EASE }, 0)
      timeline.set(element, { clearProps: 'clipPath' })
    }
  })
}
