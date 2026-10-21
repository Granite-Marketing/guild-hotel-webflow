/**
 * Sticky CTA
 *
 * Keeps a call-to-action button in view while the page scrolls: once the
 * button's own spot rises above its docked position it is fixed to the
 * bottom centre of the viewport, and it hides as the closing sections (the
 * booking CTA and the site footer) come in, so it never covers them.
 * Built for "Reserve a Table" on the Dinings template (feedback F10).
 *
 * DOM contract: `[data-sticky-cta]` on the button. The button on the
 * Dinings template lives inside the shared Hero component, where an
 * attribute would reach every page, so index.ts passes a selector scoped to
 * that template's page id instead.
 *
 * The button's parent keeps the button's height while it is docked, so the
 * layout above never jumps. The docked state is inline `position: fixed`
 * (plus the `is-stuck` class for any Designer styling); hiding uses
 * autoAlpha so a hidden button cannot be clicked.
 */

const DEFAULT_SELECTOR = '[data-sticky-cta]'
const STUCK_CLASS = 'is-stuck'
const DOCK_GAP = 24
const END_SELECTOR = '.section_cta-booking-newsletter, .section_footer-links'

export const stickyCta = (selector = DEFAULT_SELECTOR) => {
  const button = document.querySelector<HTMLElement>(selector)
  if (!button) return
  const holder = button.parentElement
  if (!holder) return

  const endSection = document.querySelector<HTMLElement>(END_SELECTOR)
  let isStuck = false
  // Docked distance from the viewport bottom. When the button starts in the
  // first screen, it docks exactly where it sits, so it never jumps.
  let dockGap = DOCK_GAP

  const measureDock = () => {
    const naturalBottom = holder.getBoundingClientRect().bottom + window.scrollY
    const gapAtTop = window.innerHeight - naturalBottom
    dockGap = gapAtTop > 0 ? gapAtTop : DOCK_GAP
  }

  const holdSpace = () => {
    holder.style.minHeight = ''
    holder.style.minHeight = `${button.offsetHeight}px`
  }
  holdSpace()

  const setStuck = (stuck: boolean) => {
    if (stuck === isStuck) return
    isStuck = stuck
    button.classList.toggle(STUCK_CLASS, stuck)
    if (stuck) {
      gsap.set(button, {
        position: 'fixed',
        left: '50%',
        bottom: dockGap,
        xPercent: -50,
        zIndex: 90,
      })
    } else {
      gsap.set(button, { clearProps: 'position,left,bottom,zIndex,transform' })
    }
  }

  // Docked once the button's natural bottom edge rises above the dock line.
  ScrollTrigger.create({
    trigger: holder,
    start: () => {
      measureDock()
      return `bottom bottom-=${dockGap}`
    },
    end: 'max',
    onRefreshInit: () => setStuck(false),
    onRefresh: holdSpace,
    onToggle: (self: ScrollTriggerInstance) => setStuck(self.isActive),
  })

  if (!endSection) return

  // Out of the way while the closing sections are on screen.
  ScrollTrigger.create({
    trigger: endSection,
    start: 'top bottom',
    end: 'max',
    onToggle: (self: ScrollTriggerInstance) =>
      gsap.to(button, { autoAlpha: self.isActive ? 0 : 1, duration: 0.3, overwrite: 'auto' }),
  })
}
