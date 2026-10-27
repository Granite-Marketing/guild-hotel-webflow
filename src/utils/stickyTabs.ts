/**
 * Sticky Tabs (F36, F44)
 *
 * Pins the topic tab bar to the bottom of the viewport, 2rem above the bottom
 * edge like the gallery and arts sticky tag bars (`.gallery-all_tags-wrapper`
 * is `sticky; bottom: 2rem`), on /happenings, /blog and /press while the card
 * sections scroll, highlights the section in view, and makes tab clicks land
 * just under the fixed site nav.
 *
 * DOM contract:
 *   nav.tab-pills-intro_tabs[data-sticky-tabs="true"]   the bar; the value comes
 *                                                from the "Sticky tabs" component prop (set per page in the
 *                                                Designer; other pages never pin)
 *     a[href="#id"]                              one per section; the target
 *                                                element id must exist
 *   .section_article-card-staggered              card sections; the last one
 *                                                after the bar ends the pin
 *
 * Why not CSS sticky: the nav lives inside a component instance whose frame
 * wrapper is only as tall as the bar, so sticky would hold for zero distance.
 * A ScrollTrigger pin (pinSpacing: false) keeps layout unchanged.
 *
 * Active state: `is-active` and `aria-current="true"` move to the link whose
 * section is under the bar; the first tab stays active before the first one.
 * Order: after staggerCards(), scrollEnlargeSnap(), swiperSliders() and
 * gsapBasicAnimations(), so positions are measured on final layout.
 */

import { lenis } from '$utils/lenisGsap'

const navBottom = () => {
  const header = document.querySelector<HTMLElement>('[data-nav="header"]')
  const bar = header?.querySelector<HTMLElement>('.site-nav_bar') ?? header
  return Math.max(0, bar?.getBoundingClientRect().bottom ?? 0)
}

const BOTTOM_GAP_REM = 2
const bottomGap = () =>
  BOTTOM_GAP_REM * parseFloat(getComputedStyle(document.documentElement).fontSize)

type TabEntry = { link: HTMLAnchorElement; target: HTMLElement }

export const stickyTabs = () => {
  const bars = document.querySelectorAll<HTMLElement>('[data-sticky-tabs="true"]')
  if (!bars.length) return

  bars.forEach((tabs) => {
    const links = [...tabs.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    const entries = links
      .map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
      .filter((entry): entry is TabEntry => entry.target !== null)
    if (!entries.length) {
      console.warn('[stickyTabs] no tab target resolves', tabs)
      return
    }

    const sections = [...document.querySelectorAll<HTMLElement>('.section_article-card-staggered')].filter(
      (section) => tabs.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    // Empty or display:none groups (for example the hidden conferences group
    // on /happenings) have no layout, so they must not end the pin. Resolved
    // on every refresh because CMS lists and tabs can change what renders.
    const isRendered = (section: HTMLElement) =>
      section.offsetParent !== null && section.offsetHeight > 0
    const fallbackSection = entries[entries.length - 1].target
    const lastSection = () =>
      [...sections].reverse().find(isRendered) ?? [...entries].reverse().find((e) => isRendered(e.target))?.target ?? fallbackSection
    // Area covered by the fixed nav at the top; the bar sits at the bottom.
    const clearance = () => navBottom()

    ScrollTrigger.create({
      trigger: tabs,
      start: () => `bottom bottom-=${bottomGap()}`,
      // Absolute scroll position (not endTrigger) so the rendered last
      // section is re-resolved on every refresh. The pin releases when the
      // last section's bottom reaches the bar's bottom, so the bar rests
      // flush at the section end like the sticky gallery bars.
      end: () =>
        lastSection().getBoundingClientRect().bottom + window.scrollY - (window.innerHeight - bottomGap()),
      pin: tabs,
      pinSpacing: false,
      invalidateOnRefresh: true,
    })

    const setActive = (active: HTMLAnchorElement) => {
      links.forEach((link) => {
        const on = link === active
        link.classList.toggle('is-active', on)
        if (on) link.setAttribute('aria-current', 'true')
        else link.removeAttribute('aria-current')
      })
    }

    entries.forEach(({ link, target }) => {
      ScrollTrigger.create({
        trigger: target,
        start: () => `top top+=${clearance() + 1}`,
        end: () => `bottom top+=${clearance() + 1}`,
        onToggle: (self: ScrollTriggerInstance) => {
          if (self.isActive) setActive(link)
        },
      })
    })

    // Capture phase on the bar so Webflow's own anchor scroll never also runs.
    tabs.addEventListener(
      'click',
      (event) => {
        const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
        const entry = entries.find((item) => item.link === link)
        if (!link || !entry) return
        event.preventDefault()
        event.stopPropagation()
        const offset = -clearance()
        const immediate = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (lenis.raw) lenis.raw.scrollTo(entry.target, { offset, immediate })
        else {
          window.scrollTo({
            top: entry.target.getBoundingClientRect().top + window.scrollY + offset,
            behavior: immediate ? 'auto' : 'smooth',
          })
        }
        history.replaceState(null, '', link.hash)
        setActive(link)
      },
      true,
    )
  })
}
