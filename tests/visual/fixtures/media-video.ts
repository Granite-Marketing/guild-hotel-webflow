/**
 * Fixture entry for media-video.html: runs heroImageScale() and mediaVideo()
 * the way src/index.ts does. `{VIDEO}` in attributes becomes a local file URL.
 */

import { heroImageScale } from '../../../src/utils/heroImageScale'
import { mediaVideo } from '../../../src/utils/mediaVideo'

const videoUrl = `${location.origin}/dist/media/placeholder-video.mp4`
document.querySelectorAll<HTMLElement>('[data-video-link],[data-section-video]').forEach((element) => {
  for (const name of ['data-video-link', 'data-section-video']) {
    if (element.getAttribute(name) === '{VIDEO}') element.setAttribute(name, videoUrl)
  }
})

heroImageScale()
mediaVideo()
