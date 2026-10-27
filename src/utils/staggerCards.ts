/**
 * Stagger Cards (F36)
 *
 * Alternates CMS article cards left/right continuously across every category
 * group on the page (Figma HAPPENINGS-COLLECTION / BLOG-COLLECTION: L, R, L
 * then R, L). CSS `:nth-child` restarts in each Collection List, so the
 * alternation is done here.
 *
 * DOM contract:
 *   .article-card-staggered_component.is-cms-item   each CMS card, in DOM order
 *   .article-card-staggered_header.is-group         group label, inside the
 *                                                   same <section> as its cards
 *
 * Result: odd positions (2nd, 4th, ...) get `is-right`; each group header
 * gets `is-right` when its first card (or, for an empty group, the card that
 * would come next) sits on the right. Hidden cards are not counted.
 * The Designer no longer carries an `:nth-child(2n)` rule on `is-cms-item`.
 */

const CARD = '.article-card-staggered_component.is-cms-item'
const GROUP_HEADER = '.article-card-staggered_header.is-group'

export const staggerCards = () => {
  const cards = [...document.querySelectorAll<HTMLElement>(CARD)].filter(
    (card) => getComputedStyle(card).display !== 'none',
  )
  if (!cards.length) return

  cards.forEach((card, index) => card.classList.toggle('is-right', index % 2 === 1))

  document.querySelectorAll<HTMLElement>(GROUP_HEADER).forEach((header) => {
    const section = header.closest('section')
    const firstCard = section ? cards.find((card) => section.contains(card)) : undefined
    let isRight: boolean
    if (firstCard) {
      isRight = firstCard.classList.contains('is-right')
    } else {
      // Empty group: sit on the side the next card after this header takes.
      const precedingCards = cards.filter(
        (card) => header.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_PRECEDING,
      ).length
      isRight = precedingCards % 2 === 1
    }
    header.classList.toggle('is-right', isRight)
  })
}
