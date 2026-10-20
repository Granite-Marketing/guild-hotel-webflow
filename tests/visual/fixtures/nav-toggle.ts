/**
 * Fixture entry for nav-toggle.html: initialises the Lenis engine the way the
 * bundle does, then runs navToggle. `?lock=off` removes data-nav-lock from the
 * header first, to cover the default (mobile-only) lock behaviour.
 * Built in memory by the Playwright spec.
 */

import { navToggle } from '../../../src/utils/navToggle'
import { smoothScroll } from '../../../src/utils/smoothScroll'

if (new URLSearchParams(window.location.search).get('lock') === 'off') {
  document.querySelector('[data-nav="header"]')?.removeAttribute('data-nav-lock')
}

smoothScroll.init()
navToggle()
