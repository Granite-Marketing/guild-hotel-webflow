/**
 * Footer Background Photo (M8, Stephen 18 Nov)
 *
 * On phones the booking CTA and the footer links each hold the same photo.
 * They read as one plain, static image that scrolls with the page: no zoom,
 * no parallax. Each section's image is sized to the two sections' combined
 * height, and the footer's copy is shifted up by the CTA's height, so the two
 * halves meet without a seam. CSS: docs/reference/site-head/footer-photo.css.
 */

export const footerBackgroundPhoto = () => {
  const cta = document.querySelector<HTMLElement>('.section_cta-booking-newsletter')
  const footer = document.querySelector<HTMLElement>('.section_footer-links')
  if (!cta || !footer) return

  const root = document.documentElement
  const measure = () => {
    root.style.setProperty('--footer-photo-offset', `${cta.offsetHeight}px`)
    root.style.setProperty('--footer-photo-h', `${cta.offsetHeight + footer.offsetHeight}px`)
  }
  measure()
  new ResizeObserver(measure).observe(cta)
  new ResizeObserver(measure).observe(footer)
}
