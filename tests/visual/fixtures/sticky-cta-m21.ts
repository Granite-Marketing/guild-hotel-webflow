/**
 * Fixture entry for sticky-cta-m21.html: stickyCta wired as index.ts wires the
 * Dinings template (phoneShowAfter 120, ends at "Other dining options").
 * The hero is one screen tall with the button inside the first screen.
 */

import { stickyCta } from '../../../src/utils/stickyCta'

stickyCta(
  '[data-reserve]',
  '.section_card-carousel-header-left, .section_cta-booking-newsletter, .section_footer-links',
  { phoneShowAfter: 120 },
)
