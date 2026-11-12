/**
 * Script Reveal (animation feedback, Trello "Script Reveal")
 *
 * Handwritten script headings (Morello Pen) write themselves in when they
 * scroll into view: each line is uncovered left to right, like a pen stroke,
 * one line after another. Found by computed font, so new script headings
 * need nothing in the Designer. Each gets [data-script-reveal], which
 * lineMaskReveal skips so a tagged container does not mask it twice.
 * Headings inside modules that run their own reveal (enlarge snap, history
 * landmark), the nav and dialogs are left alone.
 */

const SCRIPT_FONT = 'morello'
const SKIP = '[data-scroll-enlarge-snap], [data-history-collapse], [role="dialog"], .nav_component, .w-nav, .swiper'
// Negative insets leave room for swashes that reach past the line box.
const HIDDEN = 'inset(-30% 100% -30% -10%)'
const SHOWN = 'inset(-30% -10% -30% -10%)'

const isScript = (element: HTMLElement) =>
  getComputedStyle(element).fontFamily.toLowerCase().includes(SCRIPT_FONT)

export const scriptReveal = () => {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6, p')).filter(
    (element) => isScript(element) && !element.closest(SKIP),
  )
  if (!headings.length) return
  headings.forEach((heading) => (heading.dataset.scriptReveal = ''))
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  headings.forEach((heading) => {
    new SplitText(heading, {
      type: 'lines',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.lines,
          { clipPath: HIDDEN },
          {
            clipPath: SHOWN,
            // Script Reveal card (2026-11-12): slower and eased; plays on enter, reverses when scrolled back above.
            duration: 2,
            ease: 'power2.out',
            stagger: 0.5,
            scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none reverse' },
          },
        ),
    })
  })
}
