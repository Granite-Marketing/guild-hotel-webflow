/**
 * Anchor Scroll (animation feedback, Trello "Subnav": make it global)
 *
 * Every same-page `#section` link scrolls with the calm eased jump the
 * subnav uses (anchorScrollOptions through the smooth scroll engine, clear of the
 * fixed nav), instead of Webflow.js's quick default. Capture phase on the
 * document, so Webflow's own anchor scroll never also runs. Links that name
 * a dialog are left to modals.ts (registered first, it marks the event
 * handled); sticky subnav bars keep their own handler and offset.
 */

import { smoothScroll } from '$utils/smoothScroll'

export const anchorScroll = () => {
  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link || link.closest('[data-sticky-tabs="true"], [role="dialog"], [data-rooms-quiz-back], [data-rooms-quiz-restart]')) return
      const href = link.getAttribute('href') ?? ''
      if (href.length < 2) return
      const target = document.getElementById(decodeURIComponent(href.slice(1)))
      if (!target || target.getAttribute('role') === 'dialog') return
      event.preventDefault()
      event.stopPropagation()
      smoothScroll.scrollTo(target)
    },
    true,
  )
}
