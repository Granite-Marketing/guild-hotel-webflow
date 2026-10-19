/**
 * Current Year
 *
 * Sets the text of every `[data-current-year]` element (and the legacy
 * `#current-year` id) to the current year. Used in footer copyright lines.
 *
 *   <span data-current-year>2026</span>
 */

export const currentYear = () => {
  const yearElements = document.querySelectorAll<HTMLElement>(
    '[data-current-year], #current-year',
  )
  if (!yearElements.length) return

  const year = String(new Date().getFullYear())
  yearElements.forEach((element) => {
    element.textContent = year
  })
}
