/**
 * Script Tilt Space (desktop feedback, Meetings)
 *
 * Tilted script headings (rotation from docs/reference/site-head/script-tilt.css)
 * grow taller than their box once rotated, so a long line runs into the text
 * below. Each one gets top and bottom margin equal to the height the tilt adds,
 * half its width times the sine of the angle (plus descender room below), so short and long headings both
 * clear their neighbours. Untilted headings (phones) get no margin.
 */

const SELECTOR = '.tab-pills-intro_heading.text-style-script, .meetings-collection-venues_heading'

// Script descenders (the long f, p, y) hang below the line box; a quarter of the font size covers them.
const DESCENDER_ROOM = 0.25

const tiltMargins = (heading: HTMLElement) => {
  const style = getComputedStyle(heading)
  const angle = parseFloat(style.rotate)
  if (!Number.isFinite(angle) || angle === 0) return ['', '']
  const tilt = (heading.offsetWidth / 2) * Math.abs(Math.sin((angle * Math.PI) / 180))
  return [`${Math.round(tilt)}px`, `${Math.round(tilt + parseFloat(style.fontSize) * DESCENDER_ROOM)}px`]
}

export const scriptTiltSpace = () => {
  const headings = document.querySelectorAll<HTMLElement>(SELECTOR)
  if (!headings.length) return

  const apply = (heading: HTMLElement) => {
    const [top, bottom] = tiltMargins(heading)
    heading.style.marginTop = top
    heading.style.marginBottom = bottom
  }
  // Width changes with font swap and viewport resize; the rotation flips at 768px.
  const observer = new ResizeObserver((entries) => entries.forEach((entry) => apply(entry.target as HTMLElement)))
  headings.forEach((heading) => {
    apply(heading)
    observer.observe(heading)
  })
}
