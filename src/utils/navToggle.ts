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
 * visibility, header background, blur). The class is added at open and
 * removed when the close fade finishes, so CSS transitions on the header run
 * after the items have faded.
 *
 * Toggle icon: when the toggle holds an SVG with exactly three `rect` bars
 * (the Guild hamburger, viewBox 0 0 37 16), GSAP morphs them into an X on
 * open (top and bottom bars rotate about the viewBox centre, middle bar
 * fades) and reverses immediately on close, in step with `aria-expanded`.
 * Under prefers-reduced-motion the icon snaps. Any other toggle content is
 * left alone. Labels: "Open menu" / "Close menu".
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
const OPEN_LABEL = 'Open menu'
const CLOSE_LABEL = 'Close menu'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
// Centre of the hamburger's 37x16 viewBox; the X geometry below assumes it.
const ICON_ORIGIN = '18.5 8'
const ICON_CROSS_BAR = { x: 8.5, y: 7, width: 20, height: 2 }

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

  // Sort by y: the Webflow embed's DOM order is middle, bottom, top.
  const iconBars = Array.from(toggle.querySelectorAll<SVGRectElement>('svg rect')).sort(
    (first, second) => Number(first.getAttribute('y') ?? 0) - Number(second.getAttribute('y') ?? 0),
  )
  let iconTimeline: GsapTimeline | null = null
  if (iconBars.length === 3) {
    const [topBar, middleBar, bottomBar] = iconBars
    iconTimeline = gsap
      .timeline({ paused: true, defaults: { duration: 0.35, ease: 'power2.inOut' } })
      .to(topBar, { attr: ICON_CROSS_BAR, rotation: 45, svgOrigin: ICON_ORIGIN }, 0)
      .to(bottomBar, { attr: ICON_CROSS_BAR, rotation: -45, svgOrigin: ICON_ORIGIN }, 0)
      .to(middleBar, { autoAlpha: 0, duration: 0.2 }, 0)
  }
  const setIcon = (toOpen: boolean) => {
    if (!iconTimeline) return
    if (window.matchMedia(REDUCED_MOTION).matches) iconTimeline.progress(toOpen ? 1 : 0).pause()
    else if (toOpen) iconTimeline.play()
    else iconTimeline.reverse()
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
    setIcon(true)

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
    setIcon(false)

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
