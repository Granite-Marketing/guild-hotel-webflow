/**
 * Fixture entry for gallery-canvas.html: fills both boards with placeholder
 * photos of mixed aspect ratios (SVG with width and height, so each image has
 * a natural size), then runs the modules the Gallery and Arts pages use.
 * Production calls them inside Webflow.push from src/index.ts.
 */

import '../../../docs/reference/site-head/gallery-canvas.css'
import { galleryCanvas } from '../../../src/utils/galleryCanvas'
import { galleryFilter } from '../../../src/utils/galleryFilter'
import { modals } from '../../../src/utils/modals'

// Wide and thin alternation, like the Figma rows.
const ASPECTS: Array<[number, number]> = [
  [3, 4], [2, 3], [4, 3], [3, 4], [16, 10], [2, 3], [1, 1], [3, 2], [3, 4], [4, 3],
]
const TONES = ['#8a6f55', '#5c4a3a', '#a58a68', '#6e5b47', '#7d6a52']

const placeholder = (index: number) => {
  const [width, height] = ASPECTS[index % ASPECTS.length]
  const scale = 300
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}"><rect width="100%" height="100%" fill="${TONES[index % TONES.length]}"/><text x="50%" y="50%" fill="#f4efdf" font-family="sans-serif" font-size="120" text-anchor="middle" dominant-baseline="middle">${index + 1}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const GALLERY_CATEGORIES = ['design', 'wellness', 'dining', 'rooms', 'guests']
const ARTS_CATEGORIES = ['painting', 'photography', 'sculpture']

const galleryGrid = document.querySelector('[data-photos="gallery"]')
for (let index = 0; index < 24; index += 1) {
  const figure = document.createElement('figure')
  figure.className = 'gallery-all_item'
  figure.setAttribute('data-gallery-filter-item', GALLERY_CATEGORIES[index % GALLERY_CATEGORIES.length])
  figure.innerHTML = `<img src="${placeholder(index)}" alt="Gallery photo ${index + 1}" />`
  galleryGrid?.append(figure)
}

const artsGrid = document.querySelector('[data-photos="arts"]')
for (let index = 0; index < 10; index += 1) {
  const item = document.createElement('div')
  item.setAttribute('role', 'listitem')
  item.className = 'gallery-all_item w-dyn-item'
  item.setAttribute('data-gallery-filter-item', ARTS_CATEGORIES[index % ARTS_CATEGORIES.length])
  item.innerHTML = `<a href="#" class="gallery-all_link" data-modal-open="art-1" aria-haspopup="dialog" aria-label="Art piece ${index + 1}"><img src="${placeholder(index + 3)}" alt="" /></a>`
  artsGrid?.append(item)
}

gsap.registerPlugin(ScrollTrigger)
galleryFilter()
galleryCanvas()
modals()
