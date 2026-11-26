/**
 * Fixture entry for scroll-enlarge-snap-video.html (#428): a hexagon scroll
 * mask whose panels carry video links, run in src/index.ts order
 * (scrollEnlargeSnap, then mediaVideo). `{VIDEO}` becomes a local file URL;
 * the tests read boxes and transforms, not playback.
 */

import { mediaVideo } from '$utils/mediaVideo'
import { scrollEnlargeSnap } from '$utils/scrollEnlargeSnap'
import { smoothScroll } from '$utils/smoothScroll'

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
  'wellness-in-room': wellnessInRoom,
  'wellness-fitness': wellnessFitness,
  'wellness-dining': wellnessDining,
  'wellness-events': wellnessEvents,
}

document.querySelectorAll<HTMLImageElement>('img[data-fixture-image]').forEach((image) => {
  image.src = images[image.dataset.fixtureImage ?? ''] ?? ''
})
document.querySelectorAll<HTMLElement>('[data-video-link="{VIDEO}"]').forEach((frame) => {
  frame.dataset.videoLink = `${location.origin}/fixture-clip.mp4`
})

window.Webflow ||= [] as unknown as WebflowQueue
window.Webflow.push(() => {
  smoothScroll.init()
  scrollEnlargeSnap()
  mediaVideo()
  window.fixtureReady = true
})

// No Webflow.js on a fixture page: drain the queue once the DOM is ready.
const run = () => window.Webflow?.forEach((callback) => callback())
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run)
else run()
