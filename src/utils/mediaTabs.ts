/**
 * Media Tabs
 *
 * A row list that works as tabs: the active row switches a stacked panel
 * (background media plus a content block). Built for the Guild home
 * Meetings & Events section (feedback F06), modelled on Editoria's
 * experiences hover switcher, with full ARIA tabs semantics added.
 *
 * DOM contract (attributes, so Designer classes stay free):
 *
 *   [data-media-tabs]                 section root (the guard selector)
 *     [data-media-tabs-list]          optional; the rows' wrapper, gets
 *                                     role="tablist"
 *       [data-media-tabs-tab]         one per row, in panel order. Use a
 *                                     <button> or a link block; the module
 *                                     adds role, tabindex and aria-*.
 *     [data-media-tabs-media]         optional; one per tab, stacked (for
 *                                     example absolute figures). The
 *                                     background image for that tab.
 *     [data-media-tabs-panel]         one per tab, stacked on top of each
 *                                     other in the Designer (same grid cell
 *                                     or absolute). The content block
 *                                     (and the media, when it is not a
 *                                     separate -media element).
 *       [data-media-tabs-content]     optional; its children slide in when
 *                                     the panel becomes active. Defaults
 *                                     to the panel itself.
 *
 *   data-media-tabs-hover="false"     on the root: switch on click/keys
 *                                     only. Default: hover also switches
 *                                     on devices with a fine pointer.
 *
 * The first tab is active on load. The active tab, media and panel get `is-active`;
 * the tab gets aria-selected="true" and tabindex="0", the others -1
 * (roving tabindex). Arrow keys move between tabs and activate them;
 * Home and End jump to the first and last. Inactive panels are hidden with
 * autoAlpha, so they never intercept clicks.
 *
 * prefers-reduced-motion: panels swap instantly with no tweens.
 */

const ROOT_SELECTOR = '[data-media-tabs]'
const ACTIVE_CLASS = 'is-active'
const FADE_DURATION = 0.6
const TEXT_OFFSET = '1.5rem'
const HOVER_QUERY = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

let instanceCount = 0

export const mediaTabs = () => {
  const roots = document.querySelectorAll<HTMLElement>(ROOT_SELECTOR)
  if (!roots.length) return

  roots.forEach((root) => setupTabs(root))
}

const setupTabs = (root: HTMLElement) => {
  const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-tab]'))
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-panel]'))
  const media = Array.from(root.querySelectorAll<HTMLElement>('[data-media-tabs-media]'))
  if (!tabs.length || tabs.length !== panels.length) {
    console.warn('[mediaTabs] needs one -panel per -tab', root)
    return
  }
  if (media.length && media.length !== tabs.length) {
    console.warn('[mediaTabs] needs one -media per -tab when -media is used', root)
    return
  }

  instanceCount += 1
  const idPrefix = `media-tabs-${instanceCount}`
  const list = root.querySelector<HTMLElement>('[data-media-tabs-list]')
  list?.setAttribute('role', 'tablist')

  tabs.forEach((tab, index) => {
    const tabId = tab.id || `${idPrefix}-tab-${index}`
    const panelId = panels[index].id || `${idPrefix}-panel-${index}`
    tab.id = tabId
    panels[index].id = panelId
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-controls', panelId)
    panels[index].setAttribute('role', 'tabpanel')
    panels[index].setAttribute('aria-labelledby', tabId)
  })

  let activeIndex = -1

  const activate = (index: number, animate: boolean) => {
    if (index === activeIndex) return
    const previous = activeIndex
    activeIndex = index

    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index
      tab.classList.toggle(ACTIVE_CLASS, isActive)
      tab.setAttribute('aria-selected', String(isActive))
      tab.tabIndex = isActive ? 0 : -1
    })
    ;[...panels, ...media].forEach((element) =>
      element.classList.toggle(
        ACTIVE_CLASS,
        panels[index] === element || media[index] === element,
      ),
    )

    const shouldAnimate = animate && !window.matchMedia(REDUCED_MOTION).matches
    if (media.length) crossfade(media, index, previous, shouldAnimate)
    crossfade(panels, index, previous, shouldAnimate)
    if (shouldAnimate) slideInContent(panels[index])
  }

  activate(0, false)

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      // Rows built as link blocks must not navigate; they are tabs.
      event.preventDefault()
      activate(index, true)
    })
    tab.addEventListener('mouseenter', () => {
      if (root.dataset.mediaTabsHover === 'false') return
      if (!window.matchMedia(HOVER_QUERY).matches) return
      activate(index, true)
    })
    tab.addEventListener('keydown', (event) => {
      const target = targetIndex(event.key, index, tabs.length)
      if (target === null) return
      event.preventDefault()
      tabs[target].focus()
      activate(target, true)
    })
  })
}

const targetIndex = (key: string, current: number, count: number): number | null => {
  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}

const contentChildren = (panel: HTMLElement): HTMLElement[] => {
  const content = panel.querySelector<HTMLElement>('[data-media-tabs-content]') ?? panel
  return Array.from(content.children) as HTMLElement[]
}

/** Fades the new element in over the old one, then hides the old one. */
const crossfade = (
  elements: HTMLElement[],
  index: number,
  previous: number,
  animate: boolean,
) => {
  const incoming = elements[index]
  gsap.killTweensOf(elements)

  if (!animate) {
    elements.forEach((element, elementIndex) =>
      gsap.set(element, {
        autoAlpha: elementIndex === index ? 1 : 0,
        zIndex: elementIndex === index ? 1 : 0,
      }),
    )
    return
  }

  elements.forEach((element, elementIndex) => {
    if (elementIndex !== index && elementIndex !== previous) {
      gsap.set(element, { autoAlpha: 0, zIndex: 0 })
    }
  })
  if (previous >= 0) gsap.set(elements[previous], { zIndex: 0 })
  gsap.set(incoming, { zIndex: 1 })

  gsap.fromTo(
    incoming,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: FADE_DURATION,
      ease: 'power2.out',
      onComplete: () => {
        if (previous >= 0 && previous !== index) gsap.set(elements[previous], { autoAlpha: 0 })
      },
    },
  )
}

const slideInContent = (panel: HTMLElement) => {
  const text = contentChildren(panel)
  if (!text.length) return
  gsap.killTweensOf(text)
  gsap.fromTo(
    text,
    { autoAlpha: 0, y: TEXT_OFFSET },
    { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.1 },
  )
}
