/**
 * Accordion: toggles accordion items with accessibility attributes.
 * Targets .accordion_header / .accordion_content elements.
 *
 * On load the first item is open (`is-active`, `aria-expanded="true"`) and
 * every other header is closed (`aria-expanded="false"`). Headers respond to
 * click, Enter and Space; Space is prevented so the page does not scroll.
 */

/** Extra room below the measured content so the open state never clips. */
const OPEN_HEIGHT_PADDING = 9 * 14

export const accordion = () => {
  const accordionTriggers = document.querySelectorAll<HTMLElement>('.accordion_header')

  if (!accordionTriggers.length) return

  function openHeight(contentWrapper: HTMLElement): string | null {
    const content = contentWrapper.querySelector<HTMLElement>('.accordion_content')
    if (!content) return null
    return `${content.offsetHeight + OPEN_HEIGHT_PADDING}px`
  }

  // Re-apply the open height when an open item's content resizes (late
  // images, font swap). Closed items are ignored.
  const headerByContent = new Map<Element, HTMLElement>()
  const contentObserver =
    typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const header = headerByContent.get(entry.target)
            if (!header || header.getAttribute('aria-expanded') !== 'true') return
            const contentWrapper = header.nextElementSibling as HTMLElement | null
            const height = contentWrapper ? openHeight(contentWrapper) : null
            if (contentWrapper && height && contentWrapper.style.maxHeight !== height) {
              contentWrapper.style.maxHeight = height
            }
          })
        })

  function setOpen(item: HTMLElement, isOpen: boolean) {
    item.setAttribute('aria-expanded', isOpen ? 'true' : 'false')
    item.classList.toggle('is-active', isOpen)
    const contentWrapper = item.nextElementSibling as HTMLElement | null
    if (!contentWrapper) return
    contentWrapper.style.maxHeight = isOpen ? (openHeight(contentWrapper) ?? '0px') : '0px'
  }

  function toggleAccordion(item: HTMLElement) {
    accordionTriggers.forEach((otherItem) => {
      if (otherItem !== item) setOpen(otherItem, false)
    })
    setOpen(item, item.getAttribute('aria-expanded') !== 'true')
  }

  function isNativeButton(element: HTMLElement): boolean {
    return element.tagName === 'BUTTON'
  }

  function isNativeLink(element: HTMLElement): boolean {
    return element.tagName === 'A' && element.hasAttribute('href')
  }

  accordionTriggers.forEach((item, index) => {
    const contentWrapper = item.nextElementSibling as HTMLElement | null
    if (!contentWrapper) return

    const accordionId = `accordion-${index}`
    const accordionTargetId = `accordion-target-${index}`

    item.id = accordionId
    item.setAttribute('aria-controls', accordionTargetId)

    contentWrapper.id = accordionTargetId
    contentWrapper.setAttribute('aria-labelledby', accordionId)

    const content = contentWrapper.querySelector<HTMLElement>('.accordion_content')
    if (content && contentObserver) {
      headerByContent.set(content, item)
      contentObserver.observe(content)
    }

    if (!isNativeButton(item) && !isNativeLink(item)) {
      if (!item.hasAttribute('tabindex')) item.setAttribute('tabindex', '0')
      if (!item.hasAttribute('role')) item.setAttribute('role', 'button')
    }

    setOpen(item, index === 0)

    item.addEventListener('click', (event) => {
      event.preventDefault()
      toggleAccordion(item)
    })

    item.addEventListener('keydown', (event) => {
      // Native buttons already click on Enter and Space; links click on Enter.
      // Only the header itself: a nested input or link keeps its own keys.
      if (event.target !== item || isNativeButton(item)) return
      const isSpace = event.key === ' ' || event.key === 'Spacebar'
      const isEnter = event.key === 'Enter'
      if (isSpace || (isEnter && !isNativeLink(item))) {
        event.preventDefault()
        toggleAccordion(item)
      }
    })
  })
}
