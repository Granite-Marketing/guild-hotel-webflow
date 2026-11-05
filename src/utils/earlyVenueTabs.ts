/**
 * Early venue tabs (mobile review 2026-11-05, Dining)
 *
 * On phones the venue selector pill lives at the bottom of the pinned venue
 * stage, so it only appears once that stage pins. The Dining mobile Figma
 * shows it docked at the bottom of the screen from the first screen. Until
 * the stage pins, this docks the pill at the same bottom spot; once the
 * stage pins the pill is already there, so the handover does not move it.
 *
 * The stage carries a transform while pinned, and `position: fixed` inside a
 * transformed ancestor scrolls with the page, so while docked the pill moves
 * to <body> and returns to its place (marked by a comment node) on handover.
 *
 * DOM contract: the bar is `.venue-card-fullbleed_tabs` inside
 * `[data-scroll-enlarge-snap]`; index.ts scopes the call to the page.
 */

const BAR_SELECTOR = '[data-scroll-enlarge-snap] .venue-card-fullbleed_tabs'

export const earlyVenueTabs = (scope = '') => {
  const bar = document.querySelector<HTMLElement>(`${scope} ${BAR_SELECTOR}`.trim())
  if (!bar) return
  const section = bar.closest<HTMLElement>('[data-scroll-enlarge-snap]')
  if (!section || !bar.parentElement) return

  const home = document.createComment('early-venue-tabs')
  bar.parentElement.insertBefore(home, bar)
  let docked = false

  const dock = (next: boolean) => {
    if (next === docked) return
    docked = next
    if (next) {
      document.body.appendChild(bar)
      // Same spot as the pinned stage's own bar (tabDropdown: bottom 1.25rem, centred).
      gsap.set(bar, { position: 'fixed', top: 'auto', bottom: '1.25rem', zIndex: 80 })
    } else {
      home.parentNode?.insertBefore(bar, home)
      gsap.set(bar, { clearProps: 'position,top,bottom,zIndex' })
    }
  }

  // Docked from the top of the page until the stage reaches the top and pins.
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    onRefresh: (self: ScrollTriggerInstance) => dock(window.scrollY < self.start),
    onLeaveBack: () => dock(true),
    onEnter: () => dock(false),
  })
  dock(window.scrollY < section.getBoundingClientRect().top + window.scrollY)
}
