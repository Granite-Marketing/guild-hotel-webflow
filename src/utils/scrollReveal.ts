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
 *   data-reveal="fade-only"   fade only: opacity 0 to 1, no rise, no text mask,
 *                             no zoom (form fields, collage images)
 * Optional data-reveal-delay="0.2" (seconds) staggers neighbours.
 * Optional data-reveal-start="60" (0 to 100) sets where the reveal starts:
 * the viewport percentage from the top at which the element's top triggers
 * it (`top 60%`), for every mode. Missing or invalid keeps `top 90%`.
 *
 * Shared component blocks in AUTO_REVEALS get their mode in code, so every
 * page and CMS template using the component reveals without a Designer
 * attribute. A Designer data-reveal wins, and blocks inside modules that run
 * their own text or image animation are left to that module.
 *
 * STAGGERED_REVEALS tags repeated rows in code with a per-row delay (0.1s a
 * row, capped at 0.5s): each FAQ question line-masks in with its row's
 * divider fading in (M12), and the contact and Request for Proposal form
 * groups and fields fade in with `fade-only` (M30). They skip the `form`
 * guard on purpose; fields never contain other reveals.
 *
 * MOBILE_REVEALS run only below 768px (gsap.matchMedia, undone on resize past
 * it, so desktop is untouched): Home "Art & Stories" collage images fade in
 * one by one (`fade-only`, M4) and Corporate "Why teams choose the Guild"
 * row images scale and fade in (`image-fade`, M39). Rows without the image
 * (not added yet) simply match nothing.
 *
 * Timing (scroll reveal timing card, 2026-11-12): starts at `top 90%` and
 * runs about 20% shorter, eased out, so copy settles before mid-screen
 * under Lenis.
 *
 * Reduced motion shows everything at once. Runs after the DOM-mutating
 * modules, like the other ScrollTrigger reveals.
 */

import { prepareLineMaskReveal } from '$utils/lineMaskReveal'
import { parseRevealStart } from '$utils/revealStart'

const EASE = 'power3.out'
const HERO_SELECTOR = '.hero-fullbleed-centered_component'
/** The shared line mask runs 0.9s per line; 1.25x makes it about 20% shorter. */
const TEXT_MASK_SPEED = 1.25

// Keep in sync with the first-screen pre-hide in docs/reference/site-head/reveal-prehide.css.
const AUTO_REVEALS: Record<string, string[]> = {
  'text-mask': [
    '.hero-fullbleed-centered_component',
    '.venue-card-fullbleed_intro > :not([data-script-reveal])',
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
  ],
  // History images mask in (#189).
  'image-mask': ['.history-timeline_figure'],
}

const MOBILE_QUERY = '(max-width: 767px)'
const STAGGER_STEP = 0.1
const STAGGER_MAX = 0.5

/**
 * Repeated rows: each entry tags its elements, delayed by position among the
 * `group` siblings that match. ASSUMPTION: the form fields reveal on every
 * `form-split-script-contact` form (Request for Proposal and the other
 * contact forms share the component).
 */
const STAGGERED_REVEALS: { mode: string; selector: string; group: string }[] = [
  { mode: 'text-mask', selector: '.faq-accordion_list .accordion_question', group: '.faq-accordion_list' },
  { mode: 'fade-only', selector: '.faq-accordion_list .accordion_item', group: '.faq-accordion_list' },
  { mode: 'fade-only', selector: '.form-split-script-contact_fieldset-header', group: '.form-split-script-contact_fieldsets' },
  { mode: 'fade-only', selector: '.form-split-script-contact_field', group: '.form-split-script-contact_fieldset' },
  // Stephen 17 Nov: every form fades its fields in, not only the contact and RFP forms.
  { mode: 'fade-only', selector: '.form-contact-fields_footer', group: '.form-contact-fields_form' },
  { mode: 'fade-only', selector: '.cta-booking-newsletter_form > :is(label, input)', group: '.cta-booking-newsletter_form' },
]

/**
 * Mobile-only reveals. ASSUMPTION: the Corporate row images (added by the
 * parallel Webflow ticket) are a figure inside each hover row; the selector
 * matches `_item-figure` or any figure inside the row item, and does nothing
 * until they exist.
 */
const MOBILE_REVEALS: { mode: string; selector: string }[] = [
  { mode: 'fade-only', selector: 'main .home-art-stories_trail-figure' },
  { mode: 'image-fade', selector: 'main .feature-grid-dark-eyebrow_item-figure, main .feature-grid-dark-eyebrow_item figure' },
]

/** Modules that animate their own copy or media; the nav sits outside main. */
const OWNED_MODULES = [
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
]
const OWNED = ['[data-reveal]', ...OWNED_MODULES, 'form'].join(', ')
const OWNED_BY_MODULE = OWNED_MODULES.join(', ')

/**
 * M16: room detail gallery photos get the earlier scale and fade again
 * (restored from e5ed47c, image-fade on the Gallery Mosaic figures). Only on
 * room pages, marked by the room description section.
 */
const ROOM_PAGE_MARKER = '.rooms-individual-description_component'
// The photo itself: its figure also holds a text-masked caption, and a block holding a tagged child is skipped.
const ROOM_PAGE_IMAGE_FADE = ['.gallery-mosaic-captioned_figure > img']

const tagSharedBlocks = () => {
  if (document.querySelector(ROOM_PAGE_MARKER)) {
    AUTO_REVEALS['image-fade'] = [...AUTO_REVEALS['image-fade'], ...ROOM_PAGE_IMAGE_FADE]
  }
  Object.entries(AUTO_REVEALS).forEach(([mode, selectors]) => {
    document.querySelectorAll<HTMLElement>(selectors.map((selector) => `main ${selector}`).join(', ')).forEach((element) => {
      if (element.closest(OWNED) || element.querySelector('[data-reveal]')) return
      element.dataset.reveal = mode
    })
  })
}

const tagStaggeredRows = () => {
  STAGGERED_REVEALS.forEach(({ mode, selector, group }) => {
    document.querySelectorAll<HTMLElement>(`main ${selector}`).forEach((element) => {
      // Like tagSharedBlocks, but forms are fair game (their fields are the point) and a row may hold its own tagged children.
      if (element.dataset.reveal || element.closest(OWNED_BY_MODULE) || element.parentElement?.closest('[data-reveal]')) return
      const siblings = Array.from(element.closest(group)?.querySelectorAll(selector) ?? [])
      const index = Math.max(0, siblings.indexOf(element))
      element.dataset.reveal = mode
      // An FAQ question is a plain div, which the line mask only splits when marked as its own target (M12).
      if (mode === 'text-mask') element.setAttribute('data-line-mask', 'text')
      if (!element.dataset.revealDelay) element.dataset.revealDelay = String(Math.min(index * STAGGER_STEP, STAGGER_MAX))
    })
  })
}

const playImageFade = (element: HTMLElement, delay: number, start: string) => {
  const media = element.matches('img, video, iframe') ? element : element.querySelector<HTMLElement>('img, video, iframe')
  const timeline = gsap.timeline({ delay, scrollTrigger: { trigger: element, start, once: true } })
  // Round 3: quick, clear fade with only a slight settle.
  timeline.fromTo(element, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7, ease: 'power1.out' })
  if (media) timeline.fromTo(media, { scale: 1.04 }, { scale: 1, duration: 0.9, ease: 'power2.out' }, 0)
  // Hand the media's transform back to CSS so hover zooms (#185) apply.
  if (media) timeline.set(media, { clearProps: 'transform' })
}

const playFadeOnly = (element: HTMLElement, delay: number, start: string) => {
  gsap.fromTo(
    element,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.8, delay, ease: 'power1.out', scrollTrigger: { trigger: element, start, once: true } },
  )
}

const mobileReveals = () => {
  const mediaQueries = gsap.matchMedia()
  mediaQueries.add(MOBILE_QUERY, () => {
    MOBILE_REVEALS.forEach(({ mode, selector }) => {
      document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        // Hidden rows (collage tiles past the mobile layout) have no box to reveal.
        if (!element.getClientRects().length || element.closest('[data-reveal]')) return
        const start = parseRevealStart(element.dataset.revealStart)
        if (mode === 'image-fade') playImageFade(element, 0, start)
        else playFadeOnly(element, 0, start)
      })
    })
  })
}

export const scrollReveal = () => {
  tagSharedBlocks()
  tagStaggeredRows()
  const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  mobileReveals()
  if (!elements.length) return

  elements.forEach((element) => {
    const delay = Number(element.dataset.revealDelay) || 0
    const start = parseRevealStart(element.dataset.revealStart)
    const kind = element.dataset.reveal

    if (kind === 'fade') {
      gsap.fromTo(
        element,
        // A block holding a form only fades: form fields never slide (Stephen 17 Nov), e.g. the newsletter column.
        { autoAlpha: 0, y: element.querySelector('form') ? 0 : '2rem' },
        { autoAlpha: 1, y: 0, duration: 1, delay, ease: EASE, scrollTrigger: { trigger: element, start, once: true } },
      )
      return
    }

    if (kind === 'text-mask') {
      const reveal = prepareLineMaskReveal(element, TEXT_MASK_SPEED)
      // The hero copy plays on load with the hero image zoom (M23), never on scroll: on phones it sits below `top 90%` and waited for a scroll (M20, M21).
      if (element.matches(HERO_SELECTOR)) {
        gsap.delayedCall(delay, reveal.play)
        return
      }
      ScrollTrigger.create({
        trigger: element,
        start,
        once: true,
        onEnter: () => gsap.delayedCall(delay, reveal.play),
      })
      return
    }

    if (kind === 'fade-only') {
      playFadeOnly(element, delay, start)
      return
    }

    if (kind === 'image-fade') {
      playImageFade(element, delay, start)
      return
    }

    if (kind === 'image-mask') {
      const media = element.querySelector<HTMLElement>('img, video, iframe')
      const timeline = gsap.timeline({ delay, scrollTrigger: { trigger: element, start, once: true } })
      timeline.fromTo(element, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'power4.out' })
      if (media) timeline.fromTo(media, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: EASE }, 0)
      timeline.set(element, { clearProps: 'clipPath' })
      if (media) timeline.set(media, { clearProps: 'transform' })
    }
  })
}
