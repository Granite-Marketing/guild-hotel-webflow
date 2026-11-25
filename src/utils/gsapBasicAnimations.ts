/**
 * GSAP Basic Animations
 *
 * Batch scroll-reveal animations for .slide-in and .fade-in elements.
 */

export const gsapBasicAnimations = () => {
  // GSAP warns in the console about a selector that matches nothing.
  if (document.querySelector('.slide-in')) {
    gsap.set('.slide-in', { y: 25, opacity: 0 })
    ScrollTrigger.batch('.slide-in', {
      start: 'top 90%',
      end: 'bottom 20%',
      onEnter: (batch: Element[]) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }),
    })
  }

  if (document.querySelector('.fade-in')) {
    gsap.set('.fade-in', { opacity: 0 })
    ScrollTrigger.batch('.fade-in', {
      start: 'top 90%',
      end: 'bottom 20%',
      onEnter: (batch: Element[]) => gsap.to(batch, { opacity: 1, duration: 0.8, ease: 'power3.out' }),
    })
  }
}
