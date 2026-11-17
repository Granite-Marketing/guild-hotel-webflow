/**
 * Sticky CTA
 *
 * Keeps a call-to-action button in view while the page scrolls: once the
 * button's own spot rises above its docked position it is fixed to the
 * bottom centre of the viewport, and it hides as the closing sections (the
 * booking CTA and the site footer, or a caller's own end section) come in,
 * so it never covers them.
 * Built for "Reserve a Table" on the Dinings template (feedback F10).
 *
 * DOM contract: `[data-sticky-cta]` on the button. The button on the
 * Dinings template lives inside the shared Hero component, where an
 * attribute would reach every page, so index.ts passes a selector scoped to
 * that template's page id instead.
 *
 * The button's parent keeps the button's height while it is docked, so the
 * layout above never jumps. The docked state is a `data-sticky-cta-docked`
 * attribute and the `is-stuck` class plus inline `!important` styles
 * (re-applied on every refresh), not plain GSAP styles: the hero's line mask
 * also animates this button and rewrites its inline style, which left it
 * below the fold (M21). Hiding uses
 * autoAlpha so a hidden button cannot be clicked.
 *
 * Centring is GSAP `xPercent`, not CSS `translate`: GSAP folds a CSS
 * translate into its own transform, so both applied and pushed the docked
 * button left of centre after a refresh.
 */

const DEFAULT_SELECTOR = '[data-sticky-cta]'
const STUCK_CLASS = 'is-stuck'
const DOCK_GAP = 24
/** F105: on desktop the docked button settles this close to the bottom once the page scrolls. */
const DESKTOP_GAP = 16
const DOCKED_ATTRIBUTE = 'data-sticky-cta-docked'
const END_SELECTOR = '.section_cta-booking-newsletter, .section_footer-links'

/** Inline, with `important`, so the hero line mask rewriting this button's style cannot undo the dock. */
const DOCK_STYLES: Array<[string, string]> = [
  ['position', 'fixed'],
  ['left', '50%'],
  ['z-index', '90'],
]
export const stickyCta = (selector = DEFAULT_SELECTOR, endSelector = END_SELECTOR) => {
  const button = document.querySelector<HTMLElement>(selector)
  if (!button) return
  const holder = button.parentElement
  if (!holder) return

  const endSection = document.querySelector<HTMLElement>(endSelector)
  // The fixed button only stacks inside its ancestors' layers (the hero
  // component is z-index 2), so later sections with z-indexed images covered
  // it. Lift the outermost z-indexed ancestor while docked.
  let layer: HTMLElement | null = null
  for (let el = holder; el && el !== document.body; el = el.parentElement as HTMLElement) {
    if (getComputedStyle(el).zIndex !== 'auto') layer = el
  }
  let isStuck = false
  // Docked distance from the viewport bottom. When the button starts in the
  // first screen, it docks exactly where it sits, so it never jumps.
  let dockGap = DOCK_GAP
  const isDesktop = window.matchMedia('(min-width: 768px)').matches
  let settled = false
  const bottomGap = () => (isDesktop && settled ? DESKTOP_GAP : dockGap)

  const measureDock = () => {
    const naturalBottom = holder.getBoundingClientRect().bottom + window.scrollY
    const gapAtTop = window.innerHeight - naturalBottom
    // One pixel under its own spot, so a first-screen button is docked from
    // load instead of being clipped by the hero edge until the first scroll.
    dockGap = gapAtTop > 0 ? Math.max(0, gapAtTop - 1) : isDesktop ? DESKTOP_GAP : DOCK_GAP
  }

  const holdSpace = () => {
    holder.style.minHeight = ''
    holder.style.minHeight = `${button.offsetHeight}px`
  }
  holdSpace()

  const setBottom = (px: number) => button.style.setProperty('bottom', `${px}px`, 'important')

  const applyDock = () => {
    button.classList.add(STUCK_CLASS)
    button.setAttribute(DOCKED_ATTRIBUTE, '')
    DOCK_STYLES.forEach(([property, value]) => button.style.setProperty(property, value, 'important'))
    setBottom(bottomGap())
    gsap.set(button, { xPercent: -50 })
    if (layer) layer.style.zIndex = '90'
  }

  const setStuck = (stuck: boolean) => {
    if (stuck === isStuck) return
    isStuck = stuck
    if (stuck) {
      applyDock()
    } else {
      button.classList.remove(STUCK_CLASS)
      button.removeAttribute(DOCKED_ATTRIBUTE)
      DOCK_STYLES.forEach(([property]) => button.style.removeProperty(property))
      button.style.removeProperty('bottom')
      gsap.set(button, { xPercent: 0 })
      if (layer) layer.style.zIndex = ''
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
    // onToggle does not fire again when the trigger stays active through a
    // refresh, so re-apply the docked state here.
    onRefresh: (self: ScrollTriggerInstance) => {
      holdSpace()
      isStuck = false
      setStuck(self.isActive)
    },
    onToggle: (self: ScrollTriggerInstance) => setStuck(self.isActive),
  })

  // F105: a first-screen button docks where it sits, then eases down once
  // the visitor has scrolled half a screen.
  if (isDesktop) {
    ScrollTrigger.create({
      start: () => window.innerHeight / 2,
      end: 'max',
      onToggle: (self: ScrollTriggerInstance) => {
        settled = self.isActive
        if (!isStuck) return
        const current = parseFloat(getComputedStyle(button).bottom) || 0
        const tween = { px: current }
        gsap.to(tween, { px: bottomGap(), duration: 0.4, ease: 'power2.out', onUpdate: () => setBottom(tween.px) })
      },
    })
  }

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
