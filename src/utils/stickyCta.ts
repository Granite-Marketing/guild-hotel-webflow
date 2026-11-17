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
 * attribute styled by a stylesheet this module injects (plus the `is-stuck`
 * class for any Designer styling), not inline GSAP styles: the hero's line
 * mask also animates this button and re-renders its inline style, which wiped
 * the docked position and left the button below the fold (M21). Hiding uses
 * autoAlpha so a hidden button cannot be clicked.
 *
 * With `dockFromLoad`, a button whose own spot is below the first screen (a
 * hero taller than the viewport, as on phones) docks from load, so it is
 * visible before any scroll.
 */

const DEFAULT_SELECTOR = '[data-sticky-cta]'
const STUCK_CLASS = 'is-stuck'
const DOCK_GAP = 24
/** F105: on desktop the docked button settles this close to the bottom once the page scrolls. */
const DESKTOP_GAP = 16
const DOCKED_ATTRIBUTE = 'data-sticky-cta-docked'
const BOTTOM_VARIABLE = '--sticky-cta-bottom'
const STYLE_ID = 'sticky-cta-style'
const END_SELECTOR = '.section_cta-booking-newsletter, .section_footer-links'

const injectStyle = () => {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement('style')
  style.id = STYLE_ID
  // Individual `translate` keeps the centring off `transform`, which the line mask animates.
  style.textContent = `[${DOCKED_ATTRIBUTE}]:not(#_){position:fixed;left:50%;bottom:var(${BOTTOM_VARIABLE},${DOCK_GAP}px);translate:-50% 0;z-index:90}`
  document.head.appendChild(style)
}

export interface StickyCtaOptions {
  /**
   * Dock from load even when the button's own spot is below the first screen
   * (a hero taller than the viewport). For a hero button; leave off for a
   * button far down the page, which should dock only as it nears the screen.
   */
  dockFromLoad?: boolean
}

export const stickyCta = (selector = DEFAULT_SELECTOR, endSelector = END_SELECTOR, options: StickyCtaOptions = {}) => {
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
  // The button's own spot starts below the first screen (tall hero).
  let belowFold = false
  const bottomGap = () => (isDesktop && settled ? DESKTOP_GAP : dockGap)

  const measureDock = () => {
    const naturalBottom = holder.getBoundingClientRect().bottom + window.scrollY
    const gapAtTop = window.innerHeight - naturalBottom
    belowFold = options.dockFromLoad === true && gapAtTop <= 0
    // One pixel under its own spot, so a first-screen button is docked from
    // load instead of being clipped by the hero edge until the first scroll.
    dockGap = gapAtTop > 0 ? Math.max(0, gapAtTop - 1) : isDesktop ? DESKTOP_GAP : DOCK_GAP
  }

  const holdSpace = () => {
    holder.style.minHeight = ''
    holder.style.minHeight = `${button.offsetHeight}px`
  }
  holdSpace()
  injectStyle()

  const applyDock = () => {
    button.classList.add(STUCK_CLASS)
    button.setAttribute(DOCKED_ATTRIBUTE, '')
    button.style.setProperty(BOTTOM_VARIABLE, `${bottomGap()}px`)
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
      button.style.removeProperty(BOTTOM_VARIABLE)
      if (layer) layer.style.zIndex = ''
    }
  }

  // Docked once the button's natural bottom edge rises above the dock line.
  ScrollTrigger.create({
    trigger: holder,
    start: () => {
      measureDock()
      // Below the fold the natural spot is never seen, so dock from load (one pixel before the top, as progress 0 is not active).
      return belowFold ? -1 : `bottom bottom-=${dockGap}`
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
        if (isStuck) gsap.to(button, { [BOTTOM_VARIABLE]: `${bottomGap()}px`, duration: 0.4, ease: 'power2.out' })
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
