/**
 * Stagger Cards (F36; restart per category 2026-11-20)
 *
 * Alternates CMS article cards left/right, restarting at every category so
 * each category's first card, and its heading, sits on the left (Stephen,
 * 2026-11-20: headings must align the same on every category; this replaces
 * Figma's continuous L, R, L then R, L run). CSS `:nth-child` cannot do it:
 * the grouping is built at runtime by categoryListing.
 *
 * DOM contract:
 *   .article-card-staggered_component.is-cms-item   each CMS card, in DOM order
 *   .article-card-staggered_header.is-group         category heading, either inside
 *                                                   the first card of its category
 *                                                   (single list) or in the same
 *                                                   <section> as its cards
 *
 * Result: 2nd, 4th, ... card of each category gets `is-right`; headings never do.
 * Hidden cards are not counted. Order: after categoryListing().
 */

const CARD = '.article-card-staggered_component.is-cms-item'
const GROUP_HEADER = '.article-card-staggered_header.is-group'
// A card holding its category heading starts a category (single-list pages; Press uses its own attribute).
const CATEGORY_START = `${GROUP_HEADER}, [data-category-heading], [data-press-heading]`

export const staggerCards = () => {
  const cards = [...document.querySelectorAll<HTMLElement>(CARD)].filter(
    (card) => getComputedStyle(card).display !== 'none',
  )
  if (!cards.length) return

  let position = 0
  let previousSection: Element | null = null
  cards.forEach((card) => {
    const section = card.closest('section')
    if (card.querySelector(CATEGORY_START) || section !== previousSection) position = 0
    previousSection = section
    card.classList.toggle('is-right', position % 2 === 1)
    position += 1
  })

  document.querySelectorAll<HTMLElement>(GROUP_HEADER).forEach((header) => header.classList.remove('is-right'))
}
