/**
 * Modals: accessible dialog open/close.
 *
 * DOM contract (set in Webflow Designer):
 *   - Trigger:    `[data-modal-open="{id}"]`, value matches a modal's id
 *   - Modal:      `[role="dialog"]` with a native `id` attribute
 *   - Close:      `[data-modal-close]`
 *   - Overlay:    `[data-modal-overlay]`, optional global backdrop
 *                 (individual modals can opt out with `data-modal-no-overlay`)
 *
 * Additional ways in, no extra attributes needed:
 *   - Keyboard:   Enter and Space open a `[data-modal-open]` trigger that is
 *                 not a native button or link (e.g. a div timeline item).
 *                 Such triggers get `tabindex="0"` and `role="button"` at
 *                 init if they have none.
 *   - Hash link:  any `a[href="#{id}"]` whose id is a dialog opens it through
 *                 the same path, also from inside another open dialog (see
 *                 "Dialog stack"). A `[data-modal-close]` whose href names
 *                 another dialog is a "back" link: it steps to that dialog
 *                 (the one beneath in the stack, else it replaces the
 *                 current one).
 *   - Page load:  `location.hash` naming a dialog id opens that dialog, and
 *                 so does a later `hashchange` to one. A hash naming any
 *                 other element re-scrolls to it after window load, so lazy
 *                 images above it cannot leave the page short.
 *   - Close and scroll: a `[data-modal-close]` with `href="#{section-id}"`
 *                 pointing at a non-dialog element closes the dialog, then
 *                 scrolls to that element and moves focus there.
 *
 * Dialog stack: opening a dialog from a trigger inside an open dialog pushes
 * it. The dialog beneath loses `is-open` (hidden, `aria-hidden="true"`) but
 * stays in the stack. Back, close, ESC and overlay click pop the top dialog:
 * the one beneath is shown again and focus returns to the trigger inside it
 * that opened the popped dialog. A dialog opened from the page closes to the
 * page as before (scroll lock released, focus to the page trigger). Opening a
 * dialog that is already in the stack pops down to it; opening from outside
 * the top dialog (hashchange, page load) replaces the whole stack. Page scroll
 * stays locked and the overlay stays open while any dialog is in the stack.
 *
 * Open state is expressed via the `is-open` class; CSS handles visibility,
 * animation, and easing via Webflow combo classes.
 *
 * Page-scroll lock: the active smooth-scroll engine (Lenis by default, see
 * `$utils/smoothScroll`) is stopped on open and resumed on close. A stopped
 * Lenis still cancels wheel and touch events, so every dialog gets
 * `data-lenis-prevent` at init: the page engine ignores wheel and touch
 * inside a dialog. No body styles are touched.
 *
 * Dialog smooth scroll (every modal with scrollable content): on open the
 * dialog's scroll container gets its own Lenis instance, driven by
 * `gsap.ticker` and destroyed on close. The scroll container is:
 *   1. `[data-modal-scroll]` inside the dialog, when present (opt-in
 *      override for a dialog whose inner panel scrolls);
 *   2. else the dialog itself when its computed overflow-y is auto/scroll;
 *   3. else the first descendant whose overflow-y is auto/scroll;
 *   4. else none, and the dialog keeps native behaviour.
 * The dialog Lenis excludes its own root from the `data-lenis-prevent`
 * check, so the attribute above does not block it. The container's own box
 * is fixed, so a ResizeObserver on its children calls `resize()` when
 * content grows, and lazy images inside the dialog are promoted to eager on
 * open. Touch stays native (no syncTouch). Under
 * `prefers-reduced-motion: reduce`, or with no Lenis global, the dialog
 * scrolls natively.
 *
 * Under ScrollSmoother the dialog and overlay must live OUTSIDE
 * `#smooth-content` in the Designer; this script does not reparent them.
 *
 * Focus management: the script finds modals via `getElementById`, so triggers
 * and dialogs can live anywhere in the DOM.
 */

import { smoothScroll } from '$utils/smoothScroll'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

// The dialog title is found by role (data attribute, or the pop-up's own title class), so the SEO tag can change under it;
// any heading is the fallback, looked up only when no marked title exists (one comma selector would let an earlier heading win).
const TITLE_SELECTOR = '[data-modal-title], .overlay-detail-panel-modal_heading'
const TITLE_FALLBACK_SELECTOR = 'h1, h2, h3, h4, h5, h6'
const HASH_SCROLL_TIMEOUT = 5000
const SCROLLABLE_OVERFLOW = ['auto', 'scroll']
const NATIVE_ACTIVATION_SELECTOR = 'a[href], button, input, select, textarea, summary'

export const modals = () => {
  const modalElements = document.querySelectorAll<HTMLElement>('[role="dialog"]')
  if (!modalElements.length) return

  const overlayElement = document.querySelector<HTMLElement>('[data-modal-overlay]')

  // Let a dialog scroll inside itself while the page engine is stopped.
  modalElements.forEach((modal) => modal.setAttribute('data-lenis-prevent', ''))

  interface StackEntry {
    modal: HTMLElement
    /** The element that opened this dialog (null for hash and page load). */
    trigger: HTMLElement | null
  }
  const stack: StackEntry[] = []
  const topEntry = () => stack[stack.length - 1] ?? null
  const topModal = () => topEntry()?.modal ?? null

  let modalLenis: LenisInstance | null = null
  let modalResizeObserver: ResizeObserver | null = null
  const modalTick = (time: number) => modalLenis?.raf(time * 1000)

  modalElements.forEach((modal) => {
    if (!modal.id) return

    const titleElement =
      modal.querySelector<HTMLElement>(TITLE_SELECTOR) ?? modal.querySelector<HTMLElement>(TITLE_FALLBACK_SELECTOR)
    if (titleElement) {
      if (!titleElement.id) titleElement.id = `${modal.id}-title`
      modal.setAttribute('aria-labelledby', titleElement.id)
    }

    const descriptionElement = modal.querySelector<HTMLElement>(
      '.w-richtext, [role="document"], p',
    )
    if (descriptionElement) {
      if (!descriptionElement.id) descriptionElement.id = `${modal.id}-desc`
      modal.setAttribute('aria-describedby', descriptionElement.id)
    }
  })

  // Non-native triggers (divs, spans) need to be reachable and announced.
  document.querySelectorAll<HTMLElement>('[data-modal-open]').forEach((trigger) => {
    if (trigger.matches(NATIVE_ACTIVATION_SELECTOR)) return
    if (!trigger.hasAttribute('tabindex')) trigger.setAttribute('tabindex', '0')
    if (!trigger.hasAttribute('role')) trigger.setAttribute('role', 'button')
  })

  function getDialog(id: string | null | undefined): HTMLElement | null {
    if (!id) return null
    const element = document.getElementById(id)
    return element && element.getAttribute('role') === 'dialog' ? element : null
  }

  /** The element id named by an `href="#id"`, or null for `#`, empty or other URLs. */
  function hashTarget(href: string | null): string | null {
    if (!href || !href.startsWith('#') || href.length < 2) return null
    try {
      return decodeURIComponent(href.slice(1))
    } catch {
      return href.slice(1)
    }
  }

  function getFocusableElements(root: HTMLElement): HTMLElement[] {
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
      (element) => !element.hasAttribute('disabled') && element.offsetParent !== null,
    )
  }

  function isScrollable(element: HTMLElement): boolean {
    return SCROLLABLE_OVERFLOW.includes(getComputedStyle(element).overflowY)
  }

  /** The element that scrolls a dialog's content, or null when nothing does. */
  function getScrollContainer(modal: HTMLElement): HTMLElement | null {
    const override = modal.querySelector<HTMLElement>('[data-modal-scroll]')
    if (override) return override
    if (isScrollable(modal)) return modal
    return (
      Array.from(modal.querySelectorAll<HTMLElement>('*')).find((element) =>
        isScrollable(element),
      ) ?? null
    )
  }

  /** Load a dialog's lazy images now, resizing the dialog Lenis as each lands. */
  function loadModalImages(modal: HTMLElement) {
    modal.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((image) => {
      image.loading = 'eager'
      if (!image.complete) {
        image.addEventListener('load', () => modalLenis?.resize(), { once: true })
      }
    })
  }

  /** Give the open dialog its own Lenis. The page engine is already stopped. */
  function startModalScroll(modal: HTMLElement) {
    stopModalScroll()

    const scroller = getScrollContainer(modal)
    if (!scroller) return
    // Every open starts at the top (the close fade keeps the old position).
    scroller.scrollTop = 0

    if (typeof Lenis === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    modalLenis = new Lenis({
      wrapper: scroller,
      content: scroller,
      eventsTarget: scroller,
      autoRaf: false,
    })
    gsap.ticker.add(modalTick)

    // The scroller's box is fixed (inset 0), so its size never changes when
    // content grows; watch the children instead.
    modalResizeObserver = new ResizeObserver(() => modalLenis?.resize())
    Array.from(scroller.children).forEach((child) => modalResizeObserver?.observe(child))
  }

  function stopModalScroll() {
    gsap.ticker.remove(modalTick)
    modalResizeObserver?.disconnect()
    modalLenis?.destroy()
    modalResizeObserver = null
    modalLenis = null
  }

  function showModal(modal: HTMLElement) {
    modal.classList.add('is-open')
    modal.setAttribute('aria-hidden', 'false')
  }

  function hideModal(modal: HTMLElement) {
    modal.classList.remove('is-open')
    modal.setAttribute('aria-hidden', 'true')
  }

  function openModal(
    modal: HTMLElement,
    trigger: HTMLElement | null,
    { replaceTop = false }: { replaceTop?: boolean } = {},
  ) {
    if (topModal() === modal) return

    // Already in the stack (a back link to the dialog beneath): pop down to it.
    const existingIndex = stack.findIndex((entry) => entry.modal === modal)
    if (existingIndex !== -1) {
      popTo(existingIndex + 1, { restoreFocus: true })
      return
    }

    const top = topEntry()
    if (top && replaceTop) {
      // A back link to a dialog that is not beneath: swap the top dialog and
      // keep its return target.
      const returnTrigger = top.trigger
      popTo(stack.length - 1, { restoreFocus: false, keepPageLock: true })
      pushModal(modal, returnTrigger, trigger)
      return
    }

    if (top && trigger && top.modal.contains(trigger)) {
      pushModal(modal, trigger, trigger)
      return
    }

    // Opened from outside the top dialog (hashchange): replace the stack.
    if (top) closeAll({ restoreFocus: false, keepPageLock: true })
    pushModal(modal, trigger, trigger)
  }

  function pushModal(
    modal: HTMLElement,
    returnTrigger: HTMLElement | null,
    expandedTrigger: HTMLElement | null,
  ) {
    const below = topEntry()
    if (below) hideModal(below.modal)

    stack.push({ modal, trigger: returnTrigger })

    // Start image downloads before the open fade so the content is in place
    // by the time the dialog is visible.
    loadModalImages(modal)

    showModal(modal)
    if (expandedTrigger?.hasAttribute('data-modal-open')) {
      expandedTrigger.setAttribute('aria-expanded', 'true')
    }

    const overlayEnabled = overlayElement && !modal.hasAttribute('data-modal-no-overlay')
    if (overlayEnabled) {
      overlayElement.classList.add('is-open')
      overlayElement.setAttribute('aria-hidden', 'false')
    } else if (overlayElement) {
      overlayElement.classList.remove('is-open')
      overlayElement.setAttribute('aria-hidden', 'true')
    }

    // Stop the page engine so page scrolling halts, then give the dialog's
    // scroll container its own smooth scroll.
    smoothScroll.stop()
    startModalScroll(modal)

    // Defer focus until the open transition has finished: focusing while the
    // modal is mid-slide can cause the browser's focus-into-view request to
    // scroll the underlying page. Deferring lets the focusable settle inside
    // the viewport before focus runs.
    focusAfterTransition(modal)
  }

  function focusAfterTransition(modal: HTMLElement) {
    const computed = getComputedStyle(modal)
    const duration = parseSecondsList(computed.transitionDuration)
    const delay = parseSecondsList(computed.transitionDelay)
    const waitMs = Math.max(50, (duration + delay) * 1000 + 50)
    window.setTimeout(() => {
      if (topModal() !== modal) return
      const focusable = getFocusableElements(modal)
      const firstFocusable = focusable[0] ?? modal
      firstFocusable.focus({ preventScroll: true })
    }, waitMs)
  }

  function parseSecondsList(value: string): number {
    return Math.max(
      0,
      ...value.split(',').map((v) => {
        const trimmed = v.trim()
        if (trimmed.endsWith('ms')) return parseFloat(trimmed) / 1000
        if (trimmed.endsWith('s')) return parseFloat(trimmed)
        return 0
      }),
    )
  }

  /**
   * Pop dialogs until `depth` remain. Reveals the dialog beneath (focus to the
   * trigger inside it that opened the popped one) or, at depth 0, returns to
   * the page.
   */
  function popTo(
    depth: number,
    { restoreFocus = true, keepPageLock = false }: { restoreFocus?: boolean; keepPageLock?: boolean } = {},
  ) {
    if (stack.length <= depth) return

    let lastTrigger: HTMLElement | null = null
    while (stack.length > depth) {
      const entry = stack.pop() as StackEntry
      hideModal(entry.modal)
      if (entry.trigger?.hasAttribute('data-modal-open')) {
        entry.trigger.setAttribute('aria-expanded', 'false')
      }
      lastTrigger = entry.trigger
    }

    const remaining = topEntry()
    if (remaining) {
      showModal(remaining.modal)
      startModalScroll(remaining.modal)
      if (restoreFocus) focusTriggerAfterTransition(remaining.modal, lastTrigger)
      return
    }

    if (overlayElement) {
      overlayElement.classList.remove('is-open')
      overlayElement.setAttribute('aria-hidden', 'true')
    }

    if (keepPageLock) return
    stopModalScroll()
    smoothScroll.start()

    if (restoreFocus) lastTrigger?.focus({ preventScroll: true })
  }

  /** Focus a trigger inside a re-shown dialog once its transition has settled. */
  function focusTriggerAfterTransition(modal: HTMLElement, trigger: HTMLElement | null) {
    const computed = getComputedStyle(modal)
    const waitMs = Math.max(
      50,
      (parseSecondsList(computed.transitionDuration) + parseSecondsList(computed.transitionDelay)) *
        1000 +
        50,
    )
    window.setTimeout(() => {
      if (topModal() !== modal) return
      const target = trigger && modal.contains(trigger) ? trigger : getFocusableElements(modal)[0]
      ;(target ?? modal).focus({ preventScroll: true })
    }, waitMs)
  }

  function closeModal({ restoreFocus = true }: { restoreFocus?: boolean } = {}) {
    popTo(stack.length - 1, { restoreFocus })
  }

  function closeAll(options: { restoreFocus?: boolean; keepPageLock?: boolean } = {}) {
    popTo(0, options)
  }

  /** Close, then scroll to a page section and move focus there. */
  function closeAndScrollTo(section: HTMLElement) {
    closeAll({ restoreFocus: false })
    smoothScroll.scrollTo(section)
    if (!section.matches(FOCUSABLE_SELECTOR)) section.setAttribute('tabindex', '-1')
    section.focus({ preventScroll: true })
  }

  function openFromTrigger(trigger: HTMLElement) {
    const modal = getDialog(trigger.getAttribute('data-modal-open'))
    if (modal) openModal(modal, trigger)
  }

  // Links whose href names a dialog, and close controls whose href names a
  // page section: handled in the capture phase and stopped there, because
  // Webflow.js scrolls same-page `#` links itself (clear of the nav) from its
  // own document click handler, after ours has settled, and pushes the hash.
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as HTMLElement | null)?.closest<HTMLElement>('a[href^="#"]')
      const targetId = hashTarget(link?.getAttribute('href') ?? null)
      if (!link || !targetId) return

      const targetDialog = getDialog(targetId)
      if (targetDialog) {
        event.preventDefault()
        event.stopPropagation()
        openModal(targetDialog, link, { replaceTop: link.matches('[data-modal-close]') })
        return
      }

      if (!topModal() || !link.matches('[data-modal-close]')) return
      const section = document.getElementById(targetId)
      if (!section) return
      event.preventDefault()
      event.stopPropagation()
      closeAndScrollTo(section)
    },
    true,
  )

  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null
    const trigger = target?.closest<HTMLElement>('[data-modal-open]')
    if (trigger) {
      event.preventDefault()
      openFromTrigger(trigger)
      return
    }

    // Dialog and section hrefs were handled in the capture phase above.
    const closeButton = target?.closest<HTMLElement>('[data-modal-close]')
    if (closeButton && topModal()) {
      event.preventDefault()
      closeModal()
    }
  })

  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null
    const isActivationKey = event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar'
    if (
      isActivationKey &&
      target?.matches('[data-modal-open]') &&
      !target.matches(NATIVE_ACTIVATION_SELECTOR)
    ) {
      event.preventDefault()
      openFromTrigger(target)
      return
    }

    const activeModal = topModal()
    if (!activeModal) return

    if (event.key === 'Escape') {
      event.preventDefault()
      closeModal()
      return
    }

    if (event.key === 'Tab') {
      const focusable = getFocusableElements(activeModal)
      if (!focusable.length) {
        event.preventDefault()
        return
      }
      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]
      const currentFocus = document.activeElement as HTMLElement | null

      if (event.shiftKey && currentFocus === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus({ preventScroll: true })
      } else if (!event.shiftKey && currentFocus === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus({ preventScroll: true })
      }
    }
  })

  const initialHash = hashTarget(window.location.hash)
  const initialDialog = getDialog(initialHash)
  if (initialDialog) openModal(initialDialog, null)

  // A page-load hash naming a section: the browser jumps before the lazy
  // images above it load, which leaves the page short. Load those images,
  // then scroll there again once the page has settled (below the nav).
  const initialSection = !initialDialog && initialHash ? document.getElementById(initialHash) : null
  if (initialSection) {
    const imagesAbove = Array.from(document.images).filter(
      (image) => image.compareDocumentPosition(initialSection) & Node.DOCUMENT_POSITION_FOLLOWING,
    )
    imagesAbove.forEach((image) => {
      image.loading = 'eager'
    })
    const imagesLoaded = Promise.all(
      imagesAbove
        .filter((image) => !image.complete)
        .map(
          (image) =>
            new Promise<void>((resolve) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener('error', () => resolve(), { once: true })
            }),
        ),
    )
    const pageLoaded = new Promise<void>((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', () => resolve(), { once: true })
    })
    const timeout = new Promise<void>((resolve) => window.setTimeout(resolve, HASH_SCROLL_TIMEOUT))
    Promise.race([Promise.all([imagesLoaded, pageLoaded]), timeout]).then(() => {
      ScrollTrigger.refresh()
      smoothScroll.scrollTo(initialSection)
    })
  }

  // Back/forward or a typed hash that names a dialog opens it.
  window.addEventListener('hashchange', () => {
    const dialog = getDialog(hashTarget(window.location.hash))
    if (dialog) openModal(dialog, null)
  })
}
