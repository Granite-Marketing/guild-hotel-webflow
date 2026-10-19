/**
 * Fixture entry for gallery-filter.html: sets the Figma section crops as
 * placeholder images, then runs the modules the Gallery and Arts pages use.
 * Production calls them inside Webflow.push from src/index.ts; the fixture
 * has no Webflow.js, so it calls them directly once the CDN globals exist.
 */

import { galleryFilter } from '../../../src/utils/galleryFilter'
import { modals } from '../../../src/utils/modals'
import artCollection from '../../../figma/pages/arts/sections/01-art-collection/section.webp'
import artsInset from '../../../figma/pages/arts/sections/03-section/section.webp'
import artsFeature from '../../../figma/pages/arts/sections/04-etiam-imperdiet-sodales-dui-a-vestibulum/section.webp'
import guildCollection from '../../../figma/pages/arts/sections/05-the-guild-collection/section.webp'
import galleryHero from '../../../figma/pages/gallery/sections/01-gallery/section.webp'
import artsArtist from '../../../figma/pages/arts/sections/12-arts-artist/section.webp'
import artsModal from '../../../figma/pages/arts/sections/13-arts-modal/section.webp'

const placeholders = [
  artCollection,
  artsInset,
  artsFeature,
  guildCollection,
  galleryHero,
  artsModal,
  artsArtist,
]

document.querySelectorAll<HTMLImageElement>('img[data-placeholder]').forEach((image) => {
  image.src = placeholders[Number(image.dataset.placeholder) % placeholders.length]
})

gsap.registerPlugin(ScrollTrigger)
galleryFilter()
modals()
