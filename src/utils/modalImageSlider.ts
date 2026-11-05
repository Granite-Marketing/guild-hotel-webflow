/**
 * Modal Image Slider (mobile review 2026-11-05, Meetings)
 *
 * The venue detail modal's top image is a swipeable slider on every width
 * (Figma Meetings-Overlay). Every <img> inside `.overlay-detail-panel-modal_figure`
 * becomes a slide; the dots under it (a progress line on phones, dashes over
 * the image on desktop, CSS in docs/reference/site-head/modal-slider.css)
 * show and pick the current slide.
 *
 * Only venue modals (the ones with layout options) get a slider.
 */

const FIGURE_SELECTOR = '[role="dialog"]:has(.overlay-detail-panel-modal_extras) .overlay-detail-panel-modal_figure'

export const modalImageSlider = () => {
  const figures = Array.from(document.querySelectorAll<HTMLElement>(FIGURE_SELECTOR))
  if (!figures.length) return

  // shortcut: each modal has one venue photo today, so the other venues' photos stand in as
  // extra slides; once real galleries exist, add the images inside each figure in Designer and
  // delete this borrowing.
  const venueImages = figures
    .map((figure) => figure.querySelector<HTMLImageElement>('img'))
    .filter((image): image is HTMLImageElement => Boolean(image))

  figures.forEach((figure) => {
    const own = Array.from(figure.querySelectorAll<HTMLImageElement>('img'))
    if (!own.length) return
    const borrowed =
      own.length > 1
        ? []
        : venueImages.filter((image) => image !== own[0]).map((image) => image.cloneNode(true) as HTMLImageElement)
    const images = [...own, ...borrowed]

    const slider = document.createElement('div')
    slider.className = 'swiper overlay-detail-panel-modal_slider'
    const wrapper = document.createElement('div')
    wrapper.className = 'swiper-wrapper'
    images.forEach((image) => {
      const slide = document.createElement('div')
      slide.className = 'swiper-slide'
      image.loading = 'lazy'
      slide.append(image)
      wrapper.append(slide)
    })
    slider.append(wrapper)

    const dots = document.createElement('div')
    dots.className = 'overlay-detail-panel-modal_slider-dots'
    const buttons = images.map((_, index) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'overlay-detail-panel-modal_slider-dot'
      button.setAttribute('aria-label', `Show image ${index + 1} of ${images.length}`)
      dots.append(button)
      return button
    })

    figure.classList.add('is-slider')
    figure.append(slider, dots)

    const markActive = (index: number) =>
      buttons.forEach((button, buttonIndex) => {
        button.classList.toggle('is-active', buttonIndex === index)
        button.setAttribute('aria-current', String(buttonIndex === index))
      })

    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      speed: 600,
      grabCursor: true,
      // The modal is hidden at init; re-measure when it opens.
      observer: true,
      observeParents: true,
      on: { slideChange: (instance: SwiperInstance) => markActive(instance.activeIndex) },
    })
    buttons.forEach((button, index) => button.addEventListener('click', () => swiper.slideTo(index)))
    markActive(0)
  })
}
