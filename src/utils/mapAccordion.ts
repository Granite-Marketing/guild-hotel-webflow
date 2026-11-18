/**
 * Map Accordion (Stephen 18 Nov, #294)
 *
 * Below 768px a map's place list shows one place open at a time, so the section
 * stays short and the map stays in view: the open row keeps its walk time and
 * Directions, the others fold to their names. Tapping a row opens it; tapping a
 * map pin opens its row too (map.ts marks that row `is-active`). The first row
 * starts open. Desktop is unchanged.
 *
 * Opt in with `data-map-accordion` on the `[data-map]` element (the Map Feature
 * figure). Rows are the section's `[data-map-item]`s; everything after a row's
 * first child (its name) folds.
 */

const MOBILE_QUERY = '(max-width: 767px)'
const OPEN_CLASS = 'is-open'
const DURATION = 0.4

export const mapAccordion = () => {
  const root = document.querySelector<HTMLElement>('[data-map][data-map-accordion]')
  const section = root?.closest('section')
  if (!section) return
  const items = Array.from(section.querySelectorAll<HTMLElement>('[data-map-item]'))
  if (items.length < 2) return

  const details = (item: HTMLElement) => Array.from(item.children).slice(1) as HTMLElement[]
  const allDetails = items.flatMap(details)

  gsap.matchMedia().add(MOBILE_QUERY, () => {
    let openIndex = -1

    const openAt = (index: number, instant = false) => {
      if (index === openIndex || index < 0) return
      openIndex = index
      items.forEach((item, itemIndex) => {
        const open = itemIndex === index
        item.classList.toggle(OPEN_CLASS, open)
        item.setAttribute('aria-expanded', String(open))
        gsap.to(details(item), {
          height: open ? 'auto' : 0,
          autoAlpha: open ? 1 : 0,
          duration: instant ? 0 : DURATION,
          ease: 'power2.inOut',
          overwrite: true,
          // The section changes height once, so triggers below re-measure.
          onComplete: open && !instant ? () => ScrollTrigger.refresh(true) : undefined,
        })
      })
    }

    gsap.set(allDetails, { overflow: 'hidden' })
    openAt(0, true)

    const onClick = (event: MouseEvent) => {
      const target = event.target as Element
      const item = target.closest<HTMLElement>('[data-map-item]')
      // The Directions link keeps its own job.
      if (!item || target.closest('a')) return
      openAt(items.indexOf(item))
    }
    section.addEventListener('click', onClick)

    // A pin tap marks its row active in map.ts; open that row.
    const observer = new MutationObserver(() => openAt(items.findIndex((item) => item.classList.contains('is-active'))))
    items.forEach((item) => observer.observe(item, { attributes: true, attributeFilter: ['class'] }))

    return () => {
      observer.disconnect()
      section.removeEventListener('click', onClick)
      items.forEach((item) => {
        item.classList.remove(OPEN_CLASS)
        item.removeAttribute('aria-expanded')
      })
      gsap.set(allDetails, { clearProps: 'height,opacity,visibility,overflow' })
    }
  })
}
