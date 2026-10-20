/**
 * Card Carousel Header Left (Q009)
 *
 * Free-width card slider: heading, text and prev/next arrows on the left,
 * a row of staggered link cards running off the right edge. Each arrow
 * click moves one card; the arrows dim at either end.
 *
 * DOM contract (the Webflow component "Card Carousel Header Left"):
 *   .swiper_slider[data-card-carousel]        root (scopes every query)
 *     .swiper.cards                            Swiper container
 *       .swiper-wrapper > .swiper-slide        one per card (width from CSS)
 *     [data-card-carousel-prev]                link block, previous card
 *     [data-card-carousel-next]                link block, next card
 *
 * Card widths and gaps come from the family CSS (22.25rem plus a 2rem right
 * margin; 16rem plus 1rem below 768px). Swiper runs with
 * `slidesPerView: 'auto'` and `spaceBetween: 0`, so it measures each slide
 * including that margin and the gap stays responsive. When every
 * card fits, Swiper locks and the arrows get `hide`. Cards hidden through a
 * Show card prop are not rendered. Uses its own `cards` type class, so
 * swiperSliders() leaves these wrappers alone.
 */

export const cardCarouselHeaderLeft = () => {
  const carousels = document.querySelectorAll<HTMLElement>('[data-card-carousel]')
  if (!carousels.length) return

  carousels.forEach((carousel) => {
    const container = carousel.querySelector<HTMLElement>('.swiper.cards')
    if (!container) return

    const previousButton = carousel.querySelector<HTMLElement>('[data-card-carousel-prev]')
    const nextButton = carousel.querySelector<HTMLElement>('[data-card-carousel-next]')

    new Swiper(container, {
      slidesPerView: 'auto',
      spaceBetween: 0,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      a11y: {
        prevSlideMessage: 'Previous card',
        nextSlideMessage: 'Next card',
      },
      navigation: {
        prevEl: previousButton,
        nextEl: nextButton,
        disabledClass: 'is-disabled',
        lockClass: 'hide',
      },
    })
  })
}
