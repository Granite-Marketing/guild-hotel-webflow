/**
 * Footer Background Scale (M8, mobile feedback 17 Nov)
 *
 * On phones the footer shows one continuous photo: the booking CTA and the
 * footer links each hold the same fixed, full-screen image, so together they
 * read as one. Both settle from a slight zoom to normal size in one smooth
 * tween as the booking CTA comes into view, so the photo never jitters or
 * shows a seam. Desktop and reduced motion are left still.
 */

const SECTION = '.section_cta-booking-newsletter'
const IMAGES = '.cta-booking-newsletter_background-image, .footer-links_background-image'
const START_SCALE = 1.1

export const footerBackgroundScale = () => {
  const section = document.querySelector<HTMLElement>(SECTION)
  const images = Array.from(document.querySelectorAll<HTMLElement>(IMAGES))
  if (!section || !images.length) return

  gsap.matchMedia().add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(
      images,
      { scale: START_SCALE },
      { scale: 1, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } },
    )
  })
}
