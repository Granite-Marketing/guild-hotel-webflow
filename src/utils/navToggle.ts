/**
 * Nav Toggle
 *
 * Opens and closes a mobile nav menu with accessible state, a staggered item
 * fade, and page scroll paused while the menu is open on mobile.
 *
 * DOM contract:
 *   [data-nav="header"]          header element; gets `is-nav-open`
 *     [data-nav="open"]          hamburger toggle (button or div)
 *     [data-nav="menu"]          the menu panel (aria-controls target)
 *       [data-nav="list"]        lists whose children fade in/out
 *       a[data-nav="link"]       links that close the menu when clicked
 *
 * Visuals live in CSS keyed off `.is-nav-open` on the header (menu
 * visibility, header background, blur, hamburger morph). The class is added
 * at open and removed when the close fade finishes, so CSS transitions on
 * the header run after the items have faded.
 *
 * Scroll: below the mobile breakpoint the active engine is paused on open
 * (`smoothScroll.stop()`) and resumed in the close timeline's onComplete,
 * so the page cannot scroll behind a full-screen menu. Add
 * `data-nav-lock="always"` to the header when the menu is full screen at
 * every width. Escape and any `[data-nav="link"]` click close the menu.
 */

import { smoothScroll } from '$utils/smoothScroll'

const OPEN_CLASS = 'is-nav-open'
const MOBILE_QUERY = '(max-width: 991px)'
const OPEN_LABEL = 'Open navigation menu'
const CLOSE_LABEL = 'Close navigation menu'

export const navToggle = () => {
  const toggle = document.querySelector<HTMLElement>('[data-nav="open"]')
  const header = document.querySelector<HTMLElement>('[data-nav="header"]')
  if (!toggle || !header) return

  const menu = document.querySelector<HTMLElement>('[data-nav="menu"]')
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('[data-nav="link"]')
  const navLists = Array.from(document.querySelectorAll<HTMLElement>('[data-nav="list"]'))

  if (toggle.tagName !== 'BUTTON') {
    toggle.setAttribute('role', 'button')
    if (!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', '0')
  }
  toggle.setAttribute('aria-label', OPEN_LABEL)
  toggle.setAttribute('aria-expanded', 'false')
  if (menu) {
    if (!menu.id) menu.id = 'nav-menu'
    toggle.setAttribute('aria-controls', menu.id)
  }

  let isAnimating = false
  let scrollWasStopped = false

  const locksAtEveryWidth = header.dataset.navLock === 'always'
  const shouldLockScroll = () => locksAtEveryWidth || window.matchMedia(MOBILE_QUERY).matches
  const isOpen = () => header.classList.contains(OPEN_CLASS)
  const menuItems = () => navLists.flatMap((list) => Array.from(list.children))

  const open = () => {
    header.classList.add(OPEN_CLASS)
    if (shouldLockScroll()) {
      smoothScroll.stop()
      scrollWasStopped = true
    }
    toggle.setAttribute('aria-expanded', 'true')
    toggle.setAttribute('aria-label', CLOSE_LABEL)

    const items = menuItems()
    if (items.length) {
      gsap.fromTo(
        items,
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' },
      )
    }
  }

  const close = () => {
    if (isAnimating) return
    isAnimating = true
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-label', OPEN_LABEL)

    const timeline = gsap.timeline({
      onComplete: () => {
        header.classList.remove(OPEN_CLASS)
        if (scrollWasStopped) {
          smoothScroll.start()
          scrollWasStopped = false
        }
        isAnimating = false
      },
    })

    const items = menuItems()
    if (items.length) {
      timeline.to(items, { autoAlpha: 0, y: 8, duration: 0.35, ease: 'power2.in' }, 0)
    }
  }

  const handleToggle = (event?: Event) => {
    // A link toggle (href="#") must not jump the page or change the URL.
    event?.preventDefault()
    if (isAnimating) return
    if (isOpen()) close()
    else open()
  }

  toggle.addEventListener('click', handleToggle)
  toggle.addEventListener('keydown', (event) => {
    if (toggle.tagName === 'BUTTON') return
    // Enter on a link already fires click; only Space needs handling there.
    if (event.key === 'Enter' && toggle.tagName === 'A') return
    if (event.key === 'Enter' || event.key === ' ') {
      handleToggle(event)
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) close()
  })

  navLinks.forEach((link) =>
    link.addEventListener('click', () => {
      if (isOpen()) close()
    }),
  )
}
