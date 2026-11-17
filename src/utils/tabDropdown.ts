/**
 * Tab Dropdown (M6, mobile Figma parity)
 *
 * Below 768px a tab pill bar collapses into a compact selector: a 220x40
 * chamfered pill with the active label and a menu icon. Tapping it opens the
 * full tab list upward from the pill, with a close X in the pill row
 * (Figma "selector open", dining-collection). Desktop is unchanged: the panel
 * is `display: contents` and the toggle is hidden at 768px and up.
 *
 * DOM contract (existing markup, no Designer change):
 *   .tab-pills-intro_tabs | .venue-card-fullbleed_tabs   the bar
 *     a.*_tab                                   tabs; whichever module owns the
 *                                               bar (stickyTabs, galleryFilter,
 *                                               scrollEnlargeSnap) keeps toggling
 *                                               `is-active` on them
 *
 * The module wraps the tabs in [data-tab-dropdown-panel], appends a
 * button[data-tab-dropdown-toggle] and marks the bar [data-tab-dropdown];
 * the stylesheet below is keyed off those attributes, so without the bundle
 * the bar falls back to the full pill row. `is-open` on the bar shows the
 * list. The bar keeps a fixed 40px box and the panel grows upward out of it,
 * so a ScrollTrigger pin (stickyTabs) and the following layout never move.
 *
 * Opening (M19) grows the panel's height from the pill row to its full height
 * with easing, then staggers the links in; closing reverses it. The panel is
 * absolute inside the fixed 40px bar, so the page height never changes and no
 * ScrollTrigger refresh is needed. `aria-expanded` flips at once; `is-open`
 * stays until a close finishes (`is-closing` marks that window) so the list is
 * visible while it collapses. Links stay clickable throughout, and reduced
 * motion opens and closes instantly.
 *
 * Order: before the scroll engine, since it shortens the bars on mobile.
 */

const BARS = '.tab-pills-intro_tabs, .venue-card-fullbleed_tabs'
const OPEN_CLASS = 'is-open'
const CLOSING_CLASS = 'is-closing'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const OPEN_SECONDS = 0.45
const CLOSE_SECONDS = 0.3
const LINK_SECONDS = 0.35
const LINK_STAGGER = 0.06

// Figma: 16x8 menu glyph (three 0.8px lines) and a 10x10 hairline X.
const MENU_ICON =
  '<svg data-tab-dropdown-menu width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"><path d="M0 .4h16M0 4h16M0 7.6h16" stroke="currentColor" stroke-width=".8"/></svg>'
const CLOSE_ICON =
  '<svg data-tab-dropdown-close width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" stroke-width=".8"/></svg>'

// shortcut: CSS ships in the bundle instead of the Designer because the open
// state styles children of a JS-built panel, which Designer classes cannot
// express; move it to the site head block if the head ever gets a CSS file.
// Values from Figma mobile (pill 220x40, 12px chamfer, 24px side inset, 40px
// option rows with 10px list padding, 14/18 caps at -0.05em, inactive 0.62).
// text-box trims the line box to the caps so labels centre on the letters, not
// the font's taller ascent (Sackers Gothic sat ~3.5px low). Its cap-height
// metric is ~3px taller than the drawn capitals, so the label's -3px top
// margin and the rows' 13/16 padding put the visible letters on centre.
const STYLES = `
[data-tab-dropdown-panel]{display:contents}
[data-tab-dropdown-toggle]{display:none}
@media (max-width:767px){
 :is(.tab-pills-intro_tabs,.venue-card-fullbleed_tabs)[data-tab-dropdown]{display:block;width:13.75rem;max-width:none;height:2.5rem;padding:0;overflow:visible;background:none;clip-path:none}
 :is(.venue-card-fullbleed_tabs,.tab-pills-intro_tabs.is-media)[data-tab-dropdown]{left:50%;right:auto;bottom:1.25rem;transform:translateX(-50%)}
 [data-tab-dropdown-panel]{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:max-content;min-width:100%;display:flex;flex-direction:column;padding:0 1.5rem;background-color:var(--_primitives---colors--burgundy);color:var(--_primitives---colors--neutral-lightest);clip-path:polygon(.75rem 0,calc(100% - .75rem) 0,100% .75rem,100% calc(100% - .75rem),calc(100% - .75rem) 100%,.75rem 100%,0 calc(100% - .75rem),0 .75rem)}
 [data-tab-dropdown-panel]>*{font-size:.875rem;line-height:1.125rem;letter-spacing:-.05em}
 [data-tab-dropdown-panel]>a{display:none;padding:.8125rem 0 1rem;border:0;opacity:.62;text-box:trim-both cap alphabetic}
 [data-tab-dropdown-panel]>a.is-active{opacity:1}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]{padding-top:.625rem;overflow:hidden}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]>a{display:block}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]>a:nth-last-child(2){margin-bottom:.625rem}
 [data-tab-dropdown-toggle]{display:flex;align-items:center;justify-content:space-between;gap:2.5rem;height:2.5rem;margin:0;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer}
 [data-tab-dropdown-label]{white-space:nowrap;margin-top:-.1875rem;padding-bottom:.25rem;border-bottom:1px solid currentColor;text-box:trim-both cap alphabetic}
 [data-tab-dropdown-close],[data-tab-dropdown].is-open:not(.is-closing) [data-tab-dropdown-menu]{display:none}
 [data-tab-dropdown].is-open:not(.is-closing) [data-tab-dropdown-close]{display:block}
}`

export const tabDropdown = () => {
  const bars = document.querySelectorAll<HTMLElement>(BARS)
  if (!bars.length) return

  const style = document.createElement('style')
  style.setAttribute('data-tab-dropdown-style', '')
  style.textContent = STYLES
  document.head.append(style)

  bars.forEach((bar, barIndex) => {
    const tabs = [...bar.querySelectorAll<HTMLAnchorElement>(':scope > a')]
    if (!tabs.length) return

    const panel = document.createElement('div')
    panel.setAttribute('data-tab-dropdown-panel', '')
    panel.id = `tab-dropdown-${barIndex}`
    panel.append(...tabs)

    const toggle = document.createElement('button')
    toggle.type = 'button'
    toggle.setAttribute('data-tab-dropdown-toggle', '')
    toggle.setAttribute('aria-expanded', 'false')
    toggle.setAttribute('aria-controls', panel.id)
    toggle.className = tabs[0].className.replace(/\S+_tab\b|\bis-active\b/g, '').trim()
    toggle.innerHTML = `<span data-tab-dropdown-label></span>${MENU_ICON}${CLOSE_ICON}`
    const label = toggle.querySelector<HTMLElement>('[data-tab-dropdown-label]')!
    panel.append(toggle)

    bar.append(panel)
    bar.setAttribute('data-tab-dropdown', '')

    const syncLabel = () => {
      const active = tabs.find((tab) => tab.classList.contains('is-active')) ?? tabs[0]
      label.textContent = active.textContent
    }
    syncLabel()
    new MutationObserver(syncLabel).observe(panel, { subtree: true, attributeFilter: ['class'] })

    const reducedMotion = window.matchMedia(REDUCED_MOTION)
    const animated = [panel, ...tabs]
    const clearInline = () => gsap.set(animated, { clearProps: 'height,paddingTop,opacity,visibility,transform' })
    let expanded = false

    const setOpen = (open: boolean) => {
      if (open === expanded) return
      expanded = open
      toggle.setAttribute('aria-expanded', String(open))
      gsap.killTweensOf(animated)

      if (reducedMotion.matches) {
        clearInline()
        bar.classList.remove(CLOSING_CLASS)
        bar.classList.toggle(OPEN_CLASS, open)
        return
      }

      if (open) {
        // Box heights are content-box, so animate the padding with the height.
        const metrics = () => {
          const { height, paddingTop } = getComputedStyle(panel)
          return { height: parseFloat(height), paddingTop: parseFloat(paddingTop) }
        }
        const wasOpen = bar.classList.contains(OPEN_CLASS)
        const start = wasOpen ? metrics() : { height: toggle.offsetHeight, paddingTop: 0 }
        gsap.set(panel, { clearProps: 'height,paddingTop' })
        bar.classList.remove(CLOSING_CLASS)
        bar.classList.add(OPEN_CLASS)
        const full = metrics()
        const linkOpacity = tabs.map((tab) => Number(getComputedStyle(tab).opacity))
        gsap
          .timeline({ onComplete: clearInline })
          .fromTo(panel, start, { ...full, duration: OPEN_SECONDS, ease: 'power3.out' })
          .fromTo(
            tabs,
            { autoAlpha: 0, yPercent: 60 },
            {
              autoAlpha: (index: number) => linkOpacity[index],
              yPercent: 0,
              duration: LINK_SECONDS,
              ease: 'power2.out',
              stagger: LINK_STAGGER,
            },
            OPEN_SECONDS * 0.4,
          )
        return
      }

      if (!bar.classList.contains(OPEN_CLASS)) return
      bar.classList.add(CLOSING_CLASS)
      gsap
        .timeline({
          onComplete: () => {
            bar.classList.remove(OPEN_CLASS, CLOSING_CLASS)
            clearInline()
          },
        })
        .to(tabs, {
          autoAlpha: 0,
          yPercent: 60,
          duration: LINK_SECONDS * 0.6,
          ease: 'power2.in',
          stagger: { each: LINK_STAGGER / 2, from: 'end' },
        })
        .to(panel, { height: toggle.offsetHeight, paddingTop: 0, duration: CLOSE_SECONDS, ease: 'power2.inOut' }, '>-0.1')
    }

    toggle.addEventListener('click', () => setOpen(!expanded))
    // Capture phase: stickyTabs stops tab clicks from propagating past the bar.
    bar.addEventListener(
      'click',
      (event) => {
        if ((event.target as Element).closest('a')) setOpen(false)
      },
      true,
    )
    document.addEventListener('click', (event) => {
      if (!bar.contains(event.target as Node)) setOpen(false)
    })
    bar.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape' || !expanded) return
      setOpen(false)
      toggle.focus()
    })
  })
}
