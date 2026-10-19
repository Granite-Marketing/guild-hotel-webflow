/**
 * Fixture entry for scroll-enlarge-snap.html (served by `pnpm dev`).
 * Section crops stand in for the real venue photography.
 */

import { scrollEnlargeSnap } from '$utils/scrollEnlargeSnap'
import { smoothScroll } from '$utils/smoothScroll'

import homeZuma from '../../../figma/pages/home/sections/05-dress-up-for-the-rich-worldly/section.webp'
import homeLobbyBar from '../../../figma/pages/home/sections/06-cocktail-classics-and-drinks-for-connaisseurs/section.webp'
import homePool from '../../../figma/pages/home/sections/07-our-new-pool-serves-up-san/section.webp'
import homeTerrace from '../../../figma/pages/home/sections/08-lobby-terrace/section.webp'
import homeSolana from '../../../figma/pages/home/sections/09-solana-coffee/section.webp'
import wellnessInRoom from '../../../figma/pages/wellness-collection/sections/03-in-room-wellness/section.webp'
import wellnessFitness from '../../../figma/pages/wellness-collection/sections/04-fitness-center/section.webp'
import wellnessDining from '../../../figma/pages/wellness-collection/sections/05-mindful-dining/section.webp'
import wellnessEvents from '../../../figma/pages/wellness-collection/sections/06-wellness-events/section.webp'

declare global {
  interface Window {
    fixtureReady?: boolean
  }
}

const images: Record<string, string> = {
  'home-zuma': homeZuma,
  'home-lobby-bar': homeLobbyBar,
  'home-pool': homePool,
  'home-terrace': homeTerrace,
  'home-solana': homeSolana,
  'wellness-in-room': wellnessInRoom,
  'wellness-fitness': wellnessFitness,
  'wellness-dining': wellnessDining,
  'wellness-events': wellnessEvents,
}

document.querySelectorAll<HTMLImageElement>('img[data-fixture-image]').forEach((image) => {
  image.src = images[image.dataset.fixtureImage ?? ''] ?? ''
})

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  smoothScroll.init()
  scrollEnlargeSnap()
  window.fixtureReady = true
})

// No Webflow.js on a fixture page: drain the queue once the DOM is ready.
const run = () => window.Webflow?.forEach((callback) => callback())
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run)
else run()
