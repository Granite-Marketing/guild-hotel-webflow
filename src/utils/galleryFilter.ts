/**
 * Gallery filter: category tags (the sticky subnav pill) filter a gallery
 * grid, with a fade-out, reflow, fade-in transition.
 *
 * DOM contract (set in Webflow Designer, see docs/reference/runtime-modules.md):
 *   - Root:   `[data-gallery-filter]` on the section (one per gallery; several
 *             per page are independent)
 *   - Tag:    `[data-gallery-filter-tag="design"]` on each tag button or link.
 *             `all` (or an empty value) shows every item.
 *   - Item:   `[data-gallery-filter-item="design, rooms"]` on each grid item;
 *             one or more comma-separated categories. CMS-bound category
 *             names work: values are compared lowercased, spaces as hyphens.
 *   - Empty:  `[data-gallery-filter-empty]`, optional, gets `is-active` when
 *             no item matches.
 *
 * Hidden items get the template `hide` class (display: none); the active tag
 * gets `is-active` and `aria-pressed="true"`. Stickiness of the tag bar is
 * plain CSS (`position: sticky`), which Lenis supports.
 *
 * Detail modals (Arts page) need no code here: put `data-modal-open="{slug}"`
 * on the item and follow the CMS pattern in docs/reference/modal-setup.md;
 * `modals()` handles open, close and focus.
 */

const HIDDEN_CLASS = 'hide'
const ACTIVE_CLASS = 'is-active'
const SHOW_ALL = 'all'

const normaliseCategory = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-')

const parseCategories = (value: string | null) =>
  (value ?? '').split(',').map(normaliseCategory).filter(Boolean)

export const galleryFilter = () => {
  const roots = document.querySelectorAll<HTMLElement>('[data-gallery-filter]')
  if (!roots.length) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

  roots.forEach((root) => {
    const tags = Array.from(
      root.querySelectorAll<HTMLElement>('[data-gallery-filter-tag]'),
    )
    const items = Array.from(
      root.querySelectorAll<HTMLElement>('[data-gallery-filter-item]'),
    )
    if (!tags.length || !items.length) return

    const emptyState = root.querySelector<HTMLElement>('[data-gallery-filter-empty]')
    const itemCategories = new Map(
      items.map((item) => [
        item,
        parseCategories(item.getAttribute('data-gallery-filter-item')),
      ]),
    )

    // Guards stale onComplete callbacks when tags are clicked in quick succession.
    let transitionId = 0

    const tagCategory = (tag: HTMLElement) =>
      normaliseCategory(tag.getAttribute('data-gallery-filter-tag') ?? '') || SHOW_ALL

    const matches = (item: HTMLElement, category: string) =>
      category === SHOW_ALL || (itemCategories.get(item) ?? []).includes(category)

    const setActiveTag = (activeTag: HTMLElement) => {
      tags.forEach((tag) => {
        const isActive = tag === activeTag
        tag.classList.toggle(ACTIVE_CLASS, isActive)
        tag.setAttribute('aria-pressed', String(isActive))
      })
    }

    const applyVisibility = (category: string) => {
      let visibleCount = 0
      items.forEach((item) => {
        const isMatch = matches(item, category)
        item.classList.toggle(HIDDEN_CLASS, !isMatch)
        if (isMatch) visibleCount += 1
      })
      emptyState?.classList.toggle(ACTIVE_CLASS, visibleCount === 0)
      root.setAttribute('data-gallery-filter-active', category)
    }

    // Grid height changed: re-measure every trigger below the gallery.
    const showMatches = (category: string) => {
      applyVisibility(category)
      ScrollTrigger.refresh(true)
    }

    const scrollRootIntoView = () => {
      if (root.getBoundingClientRect().top >= 0) return
      root.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' })
    }

    const filterTo = (category: string) => {
      transitionId += 1
      const currentTransition = transitionId
      gsap.killTweensOf(items)

      if (reducedMotion.matches) {
        gsap.set(items, { autoAlpha: 1, y: 0 })
        showMatches(category)
        scrollRootIntoView()
        return
      }

      const outgoing = items.filter(
        (item) => !item.classList.contains(HIDDEN_CLASS) && !matches(item, category),
      )
      const incoming = items.filter(
        (item) => item.classList.contains(HIDDEN_CLASS) && matches(item, category),
      )

      const revealIncoming = () => {
        if (currentTransition !== transitionId) return
        showMatches(category)
        gsap.set(outgoing, { autoAlpha: 1, y: 0 })
        scrollRootIntoView()
        gsap.fromTo(
          incoming,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.04 },
        )
      }

      if (!outgoing.length) {
        revealIncoming()
        return
      }

      gsap.to(outgoing, {
        autoAlpha: 0,
        y: -12,
        duration: 0.25,
        ease: 'power1.in',
        onComplete: revealIncoming,
      })
    }

    const initialTag =
      tags.find((tag) => tag.classList.contains(ACTIVE_CLASS)) ??
      tags.find((tag) => tagCategory(tag) === SHOW_ALL) ??
      tags[0]
    setActiveTag(initialTag)
    applyVisibility(tagCategory(initialTag))

    tags.forEach((tag) => {
      tag.addEventListener('click', (event) => {
        event.preventDefault()
        if (tag.classList.contains(ACTIVE_CLASS)) return
        setActiveTag(tag)
        filterTo(tagCategory(tag))
      })
    })
  })
}
