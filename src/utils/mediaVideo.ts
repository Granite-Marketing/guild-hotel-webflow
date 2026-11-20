/**
 * Media Video (Y1, Y2, Y3; generalises the F106 Dinings section video)
 *
 * Any media frame can show a video instead of its image. The frame carries
 * `data-video-link="{url}"`, bound to a CMS link field or a component text
 * prop (so it works inside components, Collection List items and on plain
 * elements, the hero frame included). When the link is set, a muted, looping,
 * playsinline video covers the frame with the image's own object-fit and
 * object-position; the image stays underneath as poster and fallback and is
 * never moved or replaced (heroImageScale keeps animating it).
 *
 * An empty or blank link changes nothing. Reduced motion keeps the image.
 * Links: file (.mp4, .webm, .mov), YouTube, Vimeo (see embedVideo.ts).
 *
 * Legacy markup (Dinings): a hidden `[data-section-video="{url}"]` marker
 * sits just before the section; its first image's parent is the frame.
 */

import { embedVideo } from '$utils/embedVideo'

const FRAME_SELECTOR = '[data-video-link]'
const LEGACY_MARKER_SELECTOR = '[data-section-video]'

const coverFrame = (frame: HTMLElement, image: HTMLImageElement, url: string) => {
  const player = embedVideo(url, frame)
  if (!player) return
  if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative'
  frame.style.overflow = 'hidden'

  const video = player.element
  if (video instanceof HTMLVideoElement) {
    const imageStyle = getComputedStyle(image)
    video.autoplay = true
    video.preload = 'auto'
    video.poster = image.currentSrc || image.src
    Object.assign(video.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: imageStyle.objectFit === 'fill' ? 'cover' : imageStyle.objectFit,
      objectPosition: imageStyle.objectPosition,
    })
  }
  video.setAttribute('aria-hidden', 'true')
  frame.append(video)
  player.play()
}

export const mediaVideo = () => {
  const frames = document.querySelectorAll<HTMLElement>(FRAME_SELECTOR)
  const markers = document.querySelectorAll<HTMLElement>(LEGACY_MARKER_SELECTOR)
  if (!frames.length && !markers.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  frames.forEach((frame) => {
    const url = frame.dataset.videoLink?.trim()
    const image = frame.querySelector<HTMLImageElement>('img')
    if (!url || !image || frame.querySelector('video, iframe')) return
    coverFrame(frame, image, url)
  })

  markers.forEach((marker) => {
    const url = marker.dataset.sectionVideo?.trim()
    const image = marker.nextElementSibling?.querySelector<HTMLImageElement>('img')
    const frame = image?.parentElement
    if (!url || !image || !frame || frame.querySelector('video, iframe')) return
    coverFrame(frame, image, url)
  })
}
