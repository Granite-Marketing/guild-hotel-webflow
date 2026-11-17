/**
 * Fixture entry for sticky-cta.html: runs stickyCta the way index.ts does for
 * the Dinings template (end at "Other dining options"). A line-mask style
 * tween on the button's own transform runs alongside, as the hero reveal does.
 * Built in memory by the Playwright spec.
 */

import { stickyCta } from '../../../src/utils/stickyCta'

const button = document.querySelector<HTMLElement>('[data-reserve]')
if (button) gsap.fromTo(button, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: 'power3.out' })

stickyCta(
  '[data-reserve]',
  '.section_card-carousel-header-left, .section_cta-booking-newsletter, .section_footer-links',
  { dockFromLoad: true },
)
