/**
 * Fixture entry for offers-slider-split.html: sets the Figma retail crop as
 * the placeholder image, then runs the offers slider module. Swiper is an
 * ambient global from the CDN tag, as on the site.
 */

import { offersSliderSplit } from '../../../src/utils/offersSliderSplit'
import retailImage from '../../../figma/pages/home/sections/13-retail/section.webp'

document.querySelectorAll<HTMLImageElement>('img[data-placeholder]').forEach((image) => {
  image.src = retailImage
})

offersSliderSplit()
