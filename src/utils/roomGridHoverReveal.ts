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
 * F72: at rest the name drops to the card's bottom inset (the space the
 * hidden details would take), so it sits as far from the bottom as from the
 * left; it rises back as the details fade up.
 *
 * F73: an optional `video[data-hover-video]` in the card (bound to the Rooms
 * "Hover video" field) loads on first hover, fades in over the image and
 * plays while hovered. An empty field removes it, so the image stays.
 *
 * Webflow shows the details by default, so without this module (or on touch
 * devices, where there is no hover) every card keeps its details visible.
 */

const CARD_SELECTOR = '.rooms-collection-room-grid_card'
const TARGET_SELECTOR = '.rooms-collection-room-grid_details, footer'
const DURATION = 0.45
// Optical nudge (px): the name's line box keeps descender room below the caps, so an
// exact 40px bottom inset reads as higher than the 40px left one.
const OPTICAL_NUDGE = 6

export const roomGridHoverReveal = () => {
  const cards = document.querySelectorAll<HTMLElement>(CARD_SELECTOR)
  if (!cards.length) return
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  cards.forEach((card) => {
    const targets = card.querySelectorAll<HTMLElement>(TARGET_SELECTOR)
    if (!targets.length) return

    gsap.set(targets, { autoAlpha: 0, yPercent: 30 })

    const heading = card.querySelector<HTMLElement>('h2, h3')
    const header = heading?.parentElement
    const content = header?.parentElement
    // Distance from the name to the content bottom, ignoring the current shift.
    const restShift = () =>
      heading && header && content
        ? content.getBoundingClientRect().bottom -
          (heading.getBoundingClientRect().bottom - Number(gsap.getProperty(header, 'y'))) +
          OPTICAL_NUDGE
        : 0
    const video = card.querySelector<HTMLVideoElement>('video[data-hover-video]')
    const videoUrl = video?.dataset.hoverVideo?.trim()
    if (video && !videoUrl) video.remove()
    const playVideo = () => {
      if (!video || !videoUrl) return
      if (!video.src) video.src = videoUrl
      video.muted = true
      video.play().then(
        () => {
          if (hovered) video.style.opacity = '1'
        },
        () => {},
      )
    }
    const stopVideo = () => {
      if (!video || !videoUrl) return
      video.style.opacity = ''
      video.pause()
    }

    let hovered = false
    // Cards start hidden (quiz results), so measure whenever the card gets a size.
    if (header) {
      new ResizeObserver(() => {
        if (!hovered) gsap.set(header, { y: restShift })
      }).observe(card)
    }

    const reveal = () => {
      hovered = true
      playVideo()
      if (header) gsap.to(header, { y: 0, duration: DURATION, ease: 'power2.out', overwrite: true })
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
      hovered = false
      stopVideo()
      if (header) gsap.to(header, { y: restShift, duration: DURATION, ease: 'power2.inOut', overwrite: true })
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
