/**
 * Room grid hover reveal (Q033, /rooms section 03): each room card shows
 * only its name until hovered or focused; then the guests and size line and
 * the "view more" pill fade up (Figma rooms-collection card 4).
 *
 * DOM contract (built in Webflow, no attributes needed):
 *   .rooms-collection-room-grid_card            hover and focus target (a link)
 *     .rooms-collection-room-grid_details       guests and size line
 *     footer                                    "view more" pill
 *
 * Webflow shows the details by default, so without this module (or on touch
 * devices, where there is no hover) every card keeps its details visible.
 */

const CARD_SELECTOR = '.rooms-collection-room-grid_card'
const TARGET_SELECTOR = '.rooms-collection-room-grid_details, footer'
const DURATION = 0.45

export const roomGridHoverReveal = () => {
  const cards = document.querySelectorAll<HTMLElement>(CARD_SELECTOR)
  if (!cards.length) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  cards.forEach((card) => {
    const targets = card.querySelectorAll<HTMLElement>(TARGET_SELECTOR)
    if (!targets.length) return

    gsap.set(targets, { autoAlpha: 0, yPercent: 30 })

    const reveal = () => {
      gsap.to(targets, {
        autoAlpha: 1,
        yPercent: 0,
        duration: DURATION,
        stagger: 0.06,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const conceal = () => {
      gsap.to(targets, {
        autoAlpha: 0,
        yPercent: 30,
        duration: DURATION,
        ease: 'power2.inOut',
        overwrite: true,
      })
    }

    card.addEventListener('mouseenter', reveal)
    card.addEventListener('mouseleave', conceal)
    card.addEventListener('focusin', reveal)
    card.addEventListener('focusout', conceal)
  })
}
