/**
 * Section Video (desktop feedback F106, Dinings template)
 *
 * A section can show a looping video in place of its first image when the
 * CMS item has one: a hidden `[data-section-video="{url}"]` marker (bound to
 * the Dinings "Section video" field) sits just before the section. When the
 * URL is set, a muted, looping video is laid over the section's first image,
 * which stays underneath as the poster and fallback. An empty field changes
 * nothing. Reduced motion keeps the image.
 */

export const sectionVideo = () => {
  const markers = document.querySelectorAll<HTMLElement>('[data-section-video]')
  if (!markers.length) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  markers.forEach((marker) => {
    const url = marker.dataset.sectionVideo?.trim()
    const image = marker.nextElementSibling?.querySelector<HTMLImageElement>('img')
    const frame = image?.parentElement
    if (!url || !image || !frame) return

    if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative'
    const video = document.createElement('video')
    Object.assign(video, { src: url, muted: true, loop: true, autoplay: true, playsInline: true })
    video.poster = image.currentSrc || image.src
    video.setAttribute('aria-hidden', 'true')
    Object.assign(video.style, {
      position: 'absolute',
      inset: '0',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    })
    frame.append(video)
  })
}
