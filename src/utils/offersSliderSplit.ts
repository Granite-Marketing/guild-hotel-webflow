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
 *     [data-offers-slider-controls]              hidden when there is one slide
 *       [data-offers-slider-prev]                link block, previous slide
 *       [data-offers-slider-current]             current slide number
 *       [data-offers-slider-total]               slide count
 *       [data-offers-slider-next]                link block, next slide
 *
 * Slides hidden through a component visibility prop are not rendered, so
 * the total always matches the slides on the page. Uses its own `offers`
 * type class, so swiperSliders() leaves these wrappers alone.
 */

interface OffersSwiperInstance extends SwiperInstance {
  realIndex: number
}

const padNumber = (value: number) => String(value).padStart(2, '0')

export const offersSliderSplit = () => {
  const sliders = document.querySelectorAll<HTMLElement>('[data-offers-slider]')
  if (!sliders.length) return

  sliders.forEach((slider) => {
    const container = slider.querySelector<HTMLElement>('.swiper.offers')
    if (!container) return

    const slideCount = container.querySelectorAll('.swiper-slide').length
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

    new Swiper(container, {
      loop: true,
      speed: 800,
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
        init: updateCounter,
        slideChange: updateCounter,
      },
    })
  })
}
