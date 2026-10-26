/**
 * Media Tabs
 *
 * A row list that works as tabs: the active row switches a stacked panel
 * (background media plus a content block). Built for the Guild home
 * Meetings & Events section (feedback F06), with full ARIA tabs semantics.
 * Since F16 tabs switch on click and keyboard only, never on hover, and the
 * panel copy swaps with a sequenced mask: the outgoing copy masks out, then
 * the incoming copy masks in. Panels never cross-fade, so two copies are
 * never on screen together.
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
 *                                     background image for that tab. Media
 *                                     still crossfades.
 *     [data-media-tabs-panel]         one per tab, stacked on top of each
 *                                     other in the Designer (same grid cell
 *                                     or absolute). The content block.
 *       [data-media-tabs-content]     optional; scopes the masked targets.
 *                                     Defaults to the panel itself.
 *
 * Masked targets in each panel: headings, paragraphs, `.button`s and any
 * `[data-line-mask]` element, skipping targets nested in another target.
 * Text is split with SplitText (lines,words, overflow hidden on the lines,
 * autoSplit); buttons and other elements move inside a clip wrapper.
 *
 * The first tab is active on load. The active tab, media and panel get
 * `is-active`; the tab gets aria-selected="true" and tabindex="0", the
 * others -1 (roving tabindex). Arrow keys move between tabs and activate
 * them; Home and End jump to the first and last. Inactive panels are set to
 * autoAlpha 0 (never tweened), so they never intercept clicks.
 *
 * prefers-reduced-motion: nothing is split and panels swap instantly.
 */

const ROOT_SELECTOR = '[data-media-tabs]'
const ACTIVE_CLASS = 'is-active'
const FADE_DURATION = 0.6
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'])
const TARGET_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, .button, [data-line-mask]'
const HIDDEN_BELOW = 110
const HIDDEN_ABOVE = -110
const OUT_DURATION = 0.45
const OUT_STAGGER = 0.03
const IN_DURATION = 0.9
const IN_STAGGER = 0.06

let instanceCount = 0

/**
 * One masked target. `groups` are the sets of elements that move together:
 * the words of each line for text (rebuilt on every split), or the element
 * itself for a clipped block.
 */
type MaskTarget = { groups: HTMLElement[][] }

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

  // The media stack uses z-index 0/1 to crossfade, so lift the content
  // above it; otherwise the active image covers the tab rows.
  const panelLayer = panels[0].parentElement
  if (media.length && panelLayer && getComputedStyle(panelLayer).position !== 'static') {
    panelLayer.style.zIndex = '2'
  }

  // The first tab is active on load; splits read this to place their words.
  let activeIndex = 0
  let initialised = false
  let switchTimeline: GsapTimeline | null = null
  const reducedMotion = window.matchMedia(REDUCED_MOTION).matches

  const panelTargets: MaskTarget[][] = panels.map((panel, panelIndex) =>
    reducedMotion ? [] : prepareMaskTargets(panel, () => panelIndex === activeIndex),
  )

  /** Every moving group of a panel, in DOM order. */
  const panelGroups = (index: number) => panelTargets[index].flatMap((target) => target.groups)
  const groupElements = (index: number) => panelGroups(index).flat()

  const showPanelOnly = (index: number) => {
    panels.forEach((panel, panelIndex) =>
      gsap.set(panel, {
        autoAlpha: panelIndex === index ? 1 : 0,
        zIndex: panelIndex === index ? 1 : 0,
      }),
    )
  }

  const settle = (index: number) => {
    showPanelOnly(index)
    panels.forEach((_, panelIndex) => {
      const elements = groupElements(panelIndex)
      if (elements.length) {
        gsap.set(elements, { yPercent: panelIndex === index ? 0 : HIDDEN_BELOW })
      }
    })
  }

  const activate = (index: number, animate: boolean) => {
    if (initialised && index === activeIndex) return
    initialised = true
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

    // A rapid second switch starts from a clean, settled state.
    switchTimeline?.progress(1).kill()
    switchTimeline = null

    const shouldAnimate = animate && !reducedMotion
    if (media.length) crossfade(media, index, previous, shouldAnimate)

    if (!shouldAnimate) {
      settle(index)
      return
    }

    const outgoingGroups = panelGroups(previous)
    const incomingGroups = panelGroups(index)
    const outgoingElements = outgoingGroups.flat()
    const incomingElements = incomingGroups.flat()
    const timeline = gsap.timeline()

    outgoingGroups.forEach((group, groupIndex) => {
      timeline.to(
        group,
        { yPercent: HIDDEN_ABOVE, duration: OUT_DURATION, ease: 'power3.in' },
        groupIndex * OUT_STAGGER,
      )
    })

    const swapAt = outgoingGroups.length
      ? OUT_DURATION + (outgoingGroups.length - 1) * OUT_STAGGER
      : 0
    timeline.set(panels[previous], { autoAlpha: 0, zIndex: 0 }, swapAt)
    timeline.set(panels[index], { autoAlpha: 1, zIndex: 1 }, swapAt)
    if (incomingElements.length) {
      timeline.set(incomingElements, { yPercent: HIDDEN_BELOW }, swapAt)
    }

    incomingGroups.forEach((group, groupIndex) => {
      timeline.to(
        group,
        { yPercent: 0, duration: IN_DURATION, ease: 'power3.out' },
        swapAt + groupIndex * IN_STAGGER,
      )
    })

    // Park the outgoing copy below its mask, ready for its next entrance.
    if (outgoingElements.length) {
      timeline.set(outgoingElements, { yPercent: HIDDEN_BELOW }, swapAt)
    }

    switchTimeline = timeline
  }

  activate(0, false)

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      // Rows built as link blocks must not navigate; they are tabs.
      event.preventDefault()
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

/**
 * Splits a panel's text and clips its other targets. `isActive` is read on
 * every split (autoSplit re-splits on font load and resize), so the fresh
 * words sit in view for the active panel and below the mask for the rest.
 */
const prepareMaskTargets = (panel: HTMLElement, isActive: () => boolean): MaskTarget[] => {
  const scope = panel.querySelector<HTMLElement>('[data-media-tabs-content]') ?? panel
  return findTargets(scope).map((element) => {
    const target: MaskTarget = { groups: [] }

    if (isText(element)) {
      new SplitText(element, {
        type: 'lines,words',
        autoSplit: true,
        onSplit: (self) => {
          const lines = self.lines ?? []
          // Clip on the lines themselves, never `mask: 'lines'`.
          gsap.set(lines, { overflow: 'hidden' })
          target.groups = lines
            .map((line) => Array.from(line.children) as HTMLElement[])
            .filter((words) => words.length)
          const words = target.groups.flat()
          if (words.length) gsap.set(words, { yPercent: isActive() ? 0 : HIDDEN_BELOW })
        },
      })
      return target
    }

    wrapInClip(element)
    target.groups = [[element]]
    gsap.set(element, { yPercent: isActive() ? 0 : HIDDEN_BELOW })
    return target
  })
}

const findTargets = (scope: HTMLElement) => {
  const candidates = Array.from(scope.querySelectorAll<HTMLElement>(TARGET_SELECTOR))
  return candidates.filter(
    (candidate) =>
      !candidates.some((other) => other !== candidate && other.contains(candidate)),
  )
}

const isText = (element: HTMLElement) =>
  element.dataset.lineMask === 'text' || TEXT_TAGS.has(element.tagName)

/**
 * Puts a non-text element inside a block that clips it. A wrapper (not
 * overflow on the element itself) keeps a chamfered button's shape intact.
 */
const wrapInClip = (element: HTMLElement) => {
  const parent = element.parentElement
  if (!parent || parent.dataset.mediaTabsClip !== undefined) return
  const clip = document.createElement('div')
  clip.dataset.mediaTabsClip = ''
  const display = getComputedStyle(element).display
  clip.style.display = display.startsWith('inline') ? 'inline-block' : 'block'
  clip.style.overflow = 'hidden'
  parent.insertBefore(clip, element)
  clip.appendChild(element)
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

/** Fades the new media in over the old one, then hides the old one. */
const crossfade = (
  elements: HTMLElement[],
  index: number,
  previous: number,
  animate: boolean,
) => {
  const incoming = elements[index]
  gsap.killTweensOf(elements)

  if (!animate || previous === index) {
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
  gsap.set(elements[previous], { zIndex: 0 })
  gsap.set(incoming, { zIndex: 1 })

  gsap.fromTo(
    incoming,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: FADE_DURATION,
      ease: 'power2.out',
      onComplete: () => gsap.set(elements[previous], { autoAlpha: 0 }),
    },
  )
}
