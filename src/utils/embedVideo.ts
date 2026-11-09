/**
 * Embed video: turns a CMS video link into a muted, looping, silent
 * background player. Clients paste whatever they have, so it accepts a
 * direct file (.mp4, .webm, .mov), a YouTube link (watch, youtu.be, shorts,
 * embed) or a Vimeo link (vimeo.com/123, unlisted vimeo.com/123/hash, player
 * URLs). YouTube and Vimeo play in a chrome-free iframe scaled to cover the
 * frame like object-fit: cover.
 */

type Source = { kind: 'file'; url: string } | { kind: 'youtube'; id: string } | { kind: 'vimeo'; id: string; hash?: string }

export type EmbeddedVideo = {
  element: HTMLElement
  play: () => void
  pause: () => void
  // Resolves once the player can show moving frames (iframes: shortly after load).
  ready: Promise<void>
}

// YouTube draws its title and spinner for a moment after load; wait it out before showing.
const IFRAME_SETTLE_MS = 900
const VIDEO_RATIO = 16 / 9

export const parseVideoUrl = (raw: string): Source | null => {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  const host = url.hostname.replace(/^www\.|^m\./, '')
  const parts = url.pathname.split('/').filter(Boolean)
  if (host === 'youtu.be' && parts[0]) return { kind: 'youtube', id: parts[0] }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = url.searchParams.get('v') ?? (['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : undefined)
    return id ? { kind: 'youtube', id } : null
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const index = parts.findIndex((part) => /^\d+$/.test(part))
    if (index < 0) return null
    const hash = url.searchParams.get('h') ?? (parts[index + 1] && /^[0-9a-f]+$/i.test(parts[index + 1]) ? parts[index + 1] : undefined)
    return { kind: 'vimeo', id: parts[index], hash }
  }
  return { kind: 'file', url: url.href }
}

const iframeSrc = (source: Exclude<Source, { kind: 'file' }>) =>
  source.kind === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${source.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${source.id}&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&enablejsapi=1`
    : `https://player.vimeo.com/video/${source.id}?background=1&autoplay=1&muted=1&loop=1&dnt=1${source.hash ? `&h=${source.hash}` : ''}`

// Iframes cannot use object-fit, so size the 16:9 player to cover its frame and centre it.
const coverFrame = (iframe: HTMLIFrameElement, frame: HTMLElement) => {
  const fit = () => {
    const { width, height } = frame.getBoundingClientRect()
    const wide = width / height > VIDEO_RATIO
    Object.assign(iframe.style, {
      width: `${wide ? width : height * VIDEO_RATIO}px`,
      height: `${wide ? width / VIDEO_RATIO : height}px`,
    })
  }
  new ResizeObserver(fit).observe(frame)
  fit()
}

export const embedVideo = (raw: string, frame: HTMLElement): EmbeddedVideo | null => {
  const source = parseVideoUrl(raw)
  if (!source) return null

  if (source.kind === 'file') {
    const video = document.createElement('video')
    Object.assign(video, { muted: true, loop: true, playsInline: true, preload: 'none' })
    video.src = source.url
    const ready = new Promise<void>((resolve) => video.addEventListener('playing', () => resolve(), { once: true }))
    return { element: video, play: () => void video.play().catch(() => {}), pause: () => video.pause(), ready }
  }

  const iframe = document.createElement('iframe')
  iframe.src = iframeSrc(source)
  iframe.allow = 'autoplay; fullscreen; picture-in-picture'
  iframe.tabIndex = -1
  iframe.title = ''
  Object.assign(iframe.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '0',
    pointerEvents: 'none',
  })
  coverFrame(iframe, frame)
  const post = (message: object) =>
    iframe.contentWindow?.postMessage(JSON.stringify(message), source.kind === 'youtube' ? 'https://www.youtube-nocookie.com' : 'https://player.vimeo.com')
  const command = (action: 'play' | 'pause') =>
    source.kind === 'youtube' ? post({ event: 'command', func: `${action}Video`, args: '' }) : post({ method: action })
  const ready = new Promise<void>((resolve) =>
    iframe.addEventListener('load', () => window.setTimeout(resolve, IFRAME_SETTLE_MS), { once: true }),
  )
  return { element: iframe, play: () => command('play'), pause: () => command('pause'), ready }
}
