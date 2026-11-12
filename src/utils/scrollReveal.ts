/**
 * Scroll Reveal (desktop feedback, Trello "General Text/Image Scroll Animation")
 *
 * One attribute any block can opt into from the Designer; each plays once
 * when the block scrolls into view:
 *   data-reveal="fade"        soft dissolve: fades in while rising 2rem, eased
 *   data-reveal="text-mask"   line mask: each line's words rise from behind
 *                             their own edge (headings, paragraphs, buttons
 *                             and figures inside, or the element itself)
 *   data-reveal="image-mask"  mask reveal: the block opens upward from its
 *                             bottom edge while the media inside settles
 *                             from a slight zoom
 *   data-reveal="image-fade"  soft image: the block fades in while the media
 *                             inside settles from a slight (1.04) zoom
 * Optional data-reveal-delay="0.2" (seconds) staggers neighbours.
 *
 * Shared component blocks in AUTO_REVEALS get their mode in code, so every
 * page and CMS template using the component reveals without a Designer
 * attribute. A Designer data-reveal wins, and blocks inside modules that run
 * their own text or image animation are left to that module.
 *
 * Timing (scroll reveal timing card, 2026-11-12): starts at `top 90%` and
 * runs about 20% shorter, eased out, so copy settles before mid-screen
 * under Lenis.
 *
 * Reduced motion shows everything at once. Runs after the DOM-mutating
 * modules, like the other ScrollTrigger reveals.
 */

import { prepareLineMaskReveal } from '$utils/lineMaskReveal'

const START = 'top 90%'
const EASE = 'power3.out'
/** The shared line mask runs 0.9s per line; 1.25x makes it about 20% shorter. */
const TEXT_MASK_SPEED = 1.25

// Keep in sync with the first-screen pre-hide in docs/reference/site-head/reveal-prehide.css.
const AUTO_REVEALS: Record<string, string[]> = {
  'text-mask': [
    '.hero-fullbleed-centered_component',
    '.venue-card-fullbleed_intro',
    '.venue-card-fullbleed_content',
    '.image-trio-text_header',
    '.image-trio-text_footer',
    '.image-trio-text_item-content',
    '.home-art-stories_footer',
    '.rooms-individual-description_content',
    '.rooms-individual-amenities_header',
    '.feature-grid-dark-eyebrow_header',
    '.feature-grid-dark-eyebrow_footer',
    '.split-sticky-text-stacked-images_content',
    '.split-sticky-text-stacked-images_item',
    '.form-split-script-contact_paragraph',
    '.form-split-script-contact_details',
    '.map-feature_header',
    '.map-feature_aside',
    '.map-feature_item',
    '.meetings-collection-features_card-header',
    '.meetings-collection-features_footer',
    '.neighborhood-corporate_header',
    '.neighborhood-corporate_title',
    '.neighborhood-corporate_content',
    '.neighborhood-corporate_footer',
    '.article-card-staggered_header',
    '.article-card-staggered_intro',
    '.article-card-staggered_content',
    '.card-carousel-header-left_header',
    '.cta-booking-newsletter_header',
    '.cta-booking-newsletter_actions',
    '.cta-script-centered-dark_text',
    '.cta-script-centered-dark_footer',
    '.faq-accordion_header',
    '.guidelines-process_header',
    '.guidelines-process_item',
    '.history-timeline_header',
    '.history-timeline_range',
    '.history-timeline_item-header',
    '.history-timeline_text',
    '.image-pair-text_content',
    '.split-card-pair-captioned_header',
    '.split-card-pair-captioned_title',
    '.static-template-privacy-policy_header',
    '.static-template-privacy-policy_body > *',
    '.tab-pills-intro_text',
    '.text-columns-info_header',
    '.text-columns-info_item',
    '.text-columns-info_aside',
    '.timeline-scatter-images_header',
    '.timeline-scatter-images_caption',
    '.article-body_header',
    '.article-body_rich-text > :is(p, h2, h3, h4)',
    '.utility_form-block',
  ],
  'image-fade': [
    '.article-card-staggered_figure',
    '.guidelines-feature_figure',
    '.image-inset-single_figure',
    '.image-pair-text_figure',
    '.image-trio-text_figure',
    '.neighborhood-corporate_figure',
    '.split-card-pair-captioned_figure',
    '.split-sticky-text-stacked-images_figure',
    '.timeline-scatter-images_image-wrap',
    '.form-split-script-contact_media',
    '.history-timeline_figure',
  ],
}

/** Modules that animate their own copy or media; the nav sits outside main. */
const OWNED = [
  '[data-reveal]',
  '[data-scroll-enlarge-snap-content]',
  '[data-history-collapse]',
  '[data-offers-slider]',
  '[data-image-stack-collapse]',
  '[data-rooms-quiz]',
  '[data-hover-image-item]',
  '[data-room-preview]',
  '[role="dialog"]',
  '[data-modal-reveal]',
  '.swiper',
  'form',
].join(', ')

const tagSharedBlocks = () => {
  Object.entries(AUTO_REVEALS).forEach(([mode, selectors]) => {
    document.querySelectorAll<HTMLElement>(selectors.map((selector) => `main ${selector}`).join(', ')).forEach((element) => {
      if (element.closest(OWNED) || element.querySelector('[data-reveal]')) return
      element.dataset.reveal = mode
    })
  })
}

export const scrollReveal = () => {
  tagSharedBlocks()
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!elements.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  elements.forEach((element) => {
    const delay = Number(element.dataset.revealDelay) || 0
    const kind = element.dataset.reveal

    if (kind === 'fade') {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: '2rem' },
        { autoAlpha: 1, y: 0, duration: 1, delay, ease: EASE, scrollTrigger: { trigger: element, start: START, once: true } },
      )
      return
    }

    if (kind === 'text-mask') {
      const reveal = prepareLineMaskReveal(element, TEXT_MASK_SPEED)
      ScrollTrigger.create({
        trigger: element,
        start: START,
        once: true,
        onEnter: () => gsap.delayedCall(delay, reveal.play),
      })
      return
    }

    if (kind === 'image-fade') {
      const media = element.querySelector<HTMLElement>('img, video, iframe')
      const timeline = gsap.timeline({ delay, scrollTrigger: { trigger: element, start: START, once: true } })
      // Round 3: quick, clear fade with only a slight settle.
      timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' })
      if (media) timeline.fromTo(media, { scale: 1.04 }, { scale: 1, duration: 0.9, ease: 'power2.out' }, 0)
      return
    }

    if (kind === 'image-mask') {
      const media = element.querySelector<HTMLElement>('img, video, iframe')
      const timeline = gsap.timeline({ delay, scrollTrigger: { trigger: element, start: START, once: true } })
      timeline.fromTo(element, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.out' })
      if (media) timeline.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: EASE }, 0)
      timeline.set(element, { clearProps: 'clipPath' })
    }
  })
}
