/**
 * Offers Slider Split (Q008)
 *
 * Crossfading split slider: text panel left, image right, one offer per
 * slide, with prev/next arrows and a zero-padded "02 / 05" counter.
 *
 * DOM contract (the Webflow component "Offers Slider Split"):
 *   .swiper_slider[data-offers-slider]          root (scopes every query)
 *     .swiper.offers                             Swiper container
 *       .swiper-wrapper > .swiper-slide          one per offer
 *     (a Collection List may wrap the slides: .w-dyn-list > .w-dyn-items > .w-dyn-item.swiper-slide)
 *     [data-offers-slider-controls]              hidden (class `hide`) when there is one slide; zero slides: no-op
 *       [data-offers-slider-prev]                link block, previous slide
 *       [data-offers-slider-current]             current slide number
 *       [data-offers-slider-total]               slide count
 *       [data-offers-slider-next]                link block, next slide
 *   data-slide-mask="off"                      on the root: no text or image mask, plain crossfade
 *
 * Intro (B1), once when the slider scrolls into view: the image opens from
 * its right edge and, a beat apart, the eyebrow and slide copy line-mask in
 * and the slide's button, arrows and counter fade in.
 *
 * Slides hidden through a component visibility prop are not rendered, so
 * the total always matches the slides on the page. Uses its own `offers`
 * type class, so swiperSliders() leaves these wrappers alone.
 */

import { createLineMaskTimeline, type LineMaskTimeline } from '$utils/lineMaskReveal'

interface OffersSwiperInstance extends SwiperInstance {
  realIndex: number
  activeIndex: number
  slides: HTMLElement[]
}

const padNumber = (value: number) => String(value).padStart(2, '0')

// Image window: lands with the text mask (lineMaskReveal, power3.out 0.9s plus staggers).
const IMAGE_DURATION = 1.2
const IMAGE_EASE = 'power3.out'
const CLOSED = { next: 'inset(0% 0% 0% 100%)', prev: 'inset(0% 100% 0% 0%)' }
const OPEN = 'inset(0% 0% 0% 0%)'
// Outgoing copy clears before the incoming heading rises far enough to overlap it (~120ms).
const TEXT_FADE_DURATION = 0.15
// B1 intro (Stephen 19 Nov): image, copy, then button and controls start almost together,
// each a beat after the last ("all happen almost at the same time, just with a slight delay").
const INTRO_COPY_AT = 0.1
const INTRO_STAGGER = 0.1
const INTRO_FADE_AT = 0.35
const INTRO_FADE_DURATION = 0.8

export const offersSliderSplit = () => {
  const sliders = document.querySelectorAll<HTMLElement>('[data-offers-slider]')
  if (!sliders.length) return

  sliders.forEach((slider) => {
    const container = slider.querySelector<HTMLElement>('.swiper.offers')
    if (!container) return

    // Slides come from whatever the page holds. A Collection List nests them
    // (.w-dyn-list > .w-dyn-items > .w-dyn-item), so the slides' own parent is
    // the Swiper wrapper and the element above it is the Swiper container.
    const slideElements = container.querySelectorAll<HTMLElement>('.swiper-slide:not(.swiper-slide-duplicate)')
    const slideCount = slideElements.length
    if (slideCount === 0) return
    const slidesParent = slideElements[0].parentElement
    const swiperElement =
      slidesParent && slidesParent !== container && !slidesParent.classList.contains('swiper-wrapper')
        ? (slidesParent.parentElement ?? container)
        : container
    if (swiperElement !== container) slidesParent?.classList.add('swiper-wrapper')
    const controls = slider.querySelector<HTMLElement>('[data-offers-slider-controls]')
    const previousButton = slider.querySelector<HTMLElement>('[data-offers-slider-prev]')
    const nextButton = slider.querySelector<HTMLElement>('[data-offers-slider-next]')
    const currentLabel = slider.querySelector<HTMLElement>('[data-offers-slider-current]')
    const totalLabel = slider.querySelector<HTMLElement>('[data-offers-slider-total]')

    if (totalLabel) totalLabel.textContent = padNumber(slideCount)

    if (slideCount < 2) {
      controls?.classList.add('hide')
      controls?.setAttribute('aria-hidden', 'true')
      return
    }

    const updateCounter = (swiper: OffersSwiperInstance) => {
      if (currentLabel) currentLabel.textContent = padNumber(swiper.realIndex + 1)
    }

    // Animation feedback (Trello Offers & Packages): each offer's copy masks
    // in line by line; the leaving offer's copy masks out as it fades. On for
    // every offers slider; data-slide-mask="off" on the root opts one out.
    const reveals = new Map<HTMLElement, LineMaskTimeline>()
    const masked = slider.dataset.slideMask !== 'off'
    if (masked) container.querySelectorAll<HTMLElement>('.swiper-slide').forEach((slide) => {
      const content = slide.querySelector<HTMLElement>('[class*="_content"]')
      if (content) reveals.set(slide, createLineMaskTimeline(content))
    })
    let inView = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const eyebrow = slider.querySelector<HTMLElement>('.offers-slider-split_eyebrow')
    const eyebrowReveal = masked && eyebrow ? createLineMaskTimeline(eyebrow) : null
    const showActive = (swiper: OffersSwiperInstance) => {
      const active = swiper.slides[swiper.activeIndex]
      reveals.forEach((reveal, slide) => (slide === active ? inView && reveal.play() : reveal.reverse()))
    }

    // Image mask (Trello Offers & Packages): Swiper switches instantly and
    // the slides' visibility is owned here. The incoming slide sits on top
    // and its still image opens through a clip-path window (next from the
    // right edge, prev from the left); slides underneath stay visible until
    // the window is fully open, so the background never shows.
    const visibleSlides = new Set<HTMLElement>()
    let topLayer = 1
    // The rising slide z-index stays inside the slider, so slides never cover
    // the arrows and counter, with or without Swiper's own stylesheet.
    container.style.isolation = 'isolate'
    const applyVisibility = (instance: OffersSwiperInstance) => {
      instance.slides.forEach((slide) => {
        slide.style.opacity = visibleSlides.has(slide) ? '1' : '0'
      })
    }
    const revealImage = (instance: OffersSwiperInstance, direction: 'next' | 'prev') => {
      const incoming = instance.slides[instance.activeIndex]
      if (!incoming) return
      // Outgoing copy fades out early so two headings never overlap; its image stays underneath.
      visibleSlides.forEach((slide) => {
        if (slide === incoming) return
        const content = slide.querySelector<HTMLElement>('[class*="_content"]')
        if (content) gsap.to(content, { autoAlpha: 0, duration: TEXT_FADE_DURATION, ease: 'power2.out', overwrite: true })
      })
      const incomingContent = incoming.querySelector<HTMLElement>('[class*="_content"]')
      if (incomingContent) gsap.set(incomingContent, { autoAlpha: 1, overwrite: true })
      topLayer += 1
      incoming.style.zIndex = String(topLayer)
      visibleSlides.add(incoming)
      applyVisibility(instance)
      const figure = incoming.querySelector<HTMLElement>('.offers-slider-split_figure')
      const settle = () => {
        if (instance.slides[instance.activeIndex] !== incoming) return // a newer reveal cleans up
        visibleSlides.clear()
        visibleSlides.add(incoming)
        applyVisibility(instance)
      }
      if (!figure || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return settle()
      gsap.fromTo(
        figure,
        { clipPath: CLOSED[direction] },
        { clipPath: OPEN, duration: IMAGE_DURATION, ease: IMAGE_EASE, overwrite: true, onComplete: settle },
      )
    }
    const maskEvents = masked
      ? {
          // Runs after the fade effect's own setTranslate, so this wins.
          setTranslate: applyVisibility,
          slideNextTransitionStart: (instance: OffersSwiperInstance) => revealImage(instance, 'next'),
          slidePrevTransitionStart: (instance: OffersSwiperInstance) => revealImage(instance, 'prev'),
        }
      : {}

    let intro: ReturnType<typeof gsap.timeline> | null = null
    const swiper = new Swiper(swiperElement, {
      loop: true,
      // Masked: no Swiper fade, the visuals above run the change.
      speed: masked ? 0 : 800,
      effect: 'fade',
      fadeEffect: { crossFade: true },
      slidesPerView: 1,
      grabCursor: true,
      a11y: {
        prevSlideMessage: 'Previous offer',
        nextSlideMessage: 'Next offer',
      },
      navigation: {
        prevEl: previousButton,
        nextEl: nextButton,
      },
      on: {
        ...maskEvents,
        init: (instance: OffersSwiperInstance) => {
          updateCounter(instance)
          const first = instance.slides[instance.activeIndex]
          if (masked && first) {
            visibleSlides.add(first)
            applyVisibility(instance)
          }
        },
        slideChange: (instance: OffersSwiperInstance) => {
          if (intro && intro.progress() < 1) intro.progress(1)
          updateCounter(instance)
          showActive(instance)
        },
      },
    }) as OffersSwiperInstance

    const startCopy = () => {
      inView = true
      if (!eyebrowReveal) return showActive(swiper)
      eyebrowReveal.play()
      // The slide copy follows the eyebrow, one after another (B1).
      gsap.delayedCall(INTRO_STAGGER, () => showActive(swiper))
    }
    // Paused until the slider is in view; a slide change before it ends finishes it at once (slideChange).
    const firstSlide = swiper.slides[swiper.activeIndex]
    const firstFigure = firstSlide?.querySelector<HTMLElement>('.offers-slider-split_figure')
    const fadeIns = [firstSlide?.querySelector<HTMLElement>('.offers-slider-split_footer'), controls].filter(
      (element): element is HTMLElement => Boolean(element),
    )
    if (masked && !reducedMotion && firstFigure) {
      gsap.set(firstFigure, { clipPath: CLOSED.next })
      gsap.set(fadeIns, { autoAlpha: 0 })
      intro = gsap
        .timeline({ paused: true, onComplete: () => gsap.set(fadeIns, { clearProps: 'opacity,visibility' }) })
        .to(firstFigure, { clipPath: OPEN, duration: IMAGE_DURATION, ease: IMAGE_EASE }, 0)
        .call(startCopy, [], INTRO_COPY_AT)
        .to(fadeIns, { autoAlpha: 1, duration: INTRO_FADE_DURATION, ease: 'power1.out' }, INTRO_FADE_AT)
    }

    ScrollTrigger.create({
      trigger: slider,
      start: 'top 70%',
      once: true,
      onEnter: () => (intro ? intro.play() : startCopy()),
    })
  })
}
