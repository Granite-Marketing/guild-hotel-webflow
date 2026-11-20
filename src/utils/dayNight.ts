/**
 * Day and Night content switch (spec #338, ticket #339)
 *
 * Owns the mode. Day is the default (DN2); Night is chosen with the nav
 * buttons and remembered in a one-year cookie (DN1), so every page and later
 * visit shows the same mode. Only content changes, never colours or layout.
 *
 * Nav buttons: any element with `data-day-night="day"` or `="night"`. They get
 * `aria-pressed`, the `is-active` class on the pressed one, and keyboard
 * support (Enter and Space) if they are not native buttons.
 *
 * Switchable elements carry the night value in an attribute; an empty or
 * missing value leaves that part on day (DN3):
 *   data-night-text    heading, paragraph or button label text (plain text)
 *   data-night-src     <img> source; data-night-srcset and data-night-sizes
 *                      swap with it. With no night srcset the day srcset is
 *                      removed, so the browser cannot keep the day picture.
 *   data-night-video   a frame element: a muted looping player (embedVideo,
 *                      the spec #317 media module) is laid over the day media
 *   data-night-href    link target of an <a>
 * The day values are remembered on the element (`data-day-*`), so switching
 * back restores them exactly.
 *
 * Root element: `is-day` or `is-night`, and `night-ready` once a night load
 * has been swapped. The head snippet (docs/reference/site-head/day-night-head.js)
 * adds `is-night` before first paint and day-night.css hides tagged elements
 * until `night-ready`, so the day copy never flashes.
 *
 * Crossfade (DN4): the changing elements fade out (0.25s), swap, and fade in
 * (0.25s) through GSAP autoAlpha. Reduced motion swaps instantly. Text that
 * SplitText has split is released before the swap and split again after
 * (`$utils/splitRegistry`), so lines never duplicate and the reveal replays.
 *
 * Run this first in Webflow.push, before any module that splits text.
 */

import { embedVideo } from '$utils/embedVideo'
import { rebuildSplit, releaseSplit } from '$utils/splitRegistry'

type Mode = 'day' | 'night'

const COOKIE = 'guild-mode'
const ONE_YEAR = 60 * 60 * 24 * 365
const HALF_FADE = 0.25
const IMAGE_WAIT_MS = 1200
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const BUTTON_SELECTOR = '[data-day-night]'
const TAGGED_SELECTOR = '[data-night-text], [data-night-src], [data-night-srcset], [data-night-video], [data-night-href]'
const IMAGE_ATTRIBUTES = ['src', 'srcset', 'sizes'] as const

const readMode = (): Mode => (new RegExp(`(?:^|; )${COOKIE}=night(?:;|$)`).test(document.cookie) ? 'night' : 'day')

const writeMode = (mode: Mode) => {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${COOKIE}=${mode}; max-age=${ONE_YEAR}; path=/; SameSite=Lax${secure}`
}

const nightValue = (element: HTMLElement, name: string) => element.getAttribute(`data-night-${name}`)?.trim() ?? ''

/** A missing attribute is remembered as `none`, a value as `v:<value>`, so restoring is exact. */
const remember = (element: HTMLElement, key: string, value: string | null) => {
  const name = `data-day-${key}`
  if (element.hasAttribute(name)) return
  element.setAttribute(name, value === null ? 'none' : `v:${value}`)
}

const restoreAttribute = (element: HTMLElement, attribute: string, key = attribute) => {
  const stored = element.getAttribute(`data-day-${key}`)
  if (stored === null) return
  if (stored === 'none') element.removeAttribute(attribute)
  else element.setAttribute(attribute, stored.slice(2))
}

/** The node whose text is the label: the roll label's main span, a lone text-only child, or the element itself. */
const textHost = (element: HTMLElement): HTMLElement => {
  const label = element.querySelector<HTMLElement>('[data-btn-label]')
  if (label?.firstElementChild) return label.firstElementChild as HTMLElement
  const ownText = Array.from(element.childNodes).some((node) => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim())
  const onlyChild = element.children.length === 1 ? (element.children[0] as HTMLElement) : null
  return !ownText && onlyChild && !onlyChild.children.length && onlyChild.textContent?.trim() ? onlyChild : element
}

const plainText = (html: string) => {
  const holder = document.createElement('div')
  holder.innerHTML = html
  return holder.textContent ?? ''
}

const swapText = (element: HTMLElement, mode: Mode) => {
  const text = nightValue(element, 'text')
  if (!text) return
  if (mode === 'day' && !element.hasAttribute('data-day-html')) return
  releaseSplit(element) // plain text again, so the content below is the real one
  const host = textHost(element)
  remember(element, 'html', host.innerHTML)
  const dayHtml = element.getAttribute('data-day-html')!.slice(2)
  const label = element.querySelector<HTMLElement>('[data-btn-label]')
  if (label?.children.length) {
    // The roll label keeps its two spans (the second is the aria-hidden copy).
    const value = mode === 'night' ? text : plainText(dayHtml)
    Array.from(label.children).forEach((span) => (span.textContent = value))
  } else if (mode === 'night') {
    host.textContent = text
  } else {
    host.innerHTML = dayHtml
  }
  rebuildSplit(element)
}

const swapImage = (element: HTMLElement, mode: Mode) => {
  if (!(element instanceof HTMLImageElement)) return
  const night = { src: nightValue(element, 'src'), srcset: nightValue(element, 'srcset'), sizes: nightValue(element, 'sizes') }
  if (!night.src && !night.srcset) return
  if (mode === 'day') {
    IMAGE_ATTRIBUTES.forEach((attribute) => restoreAttribute(element, attribute))
    return
  }
  IMAGE_ATTRIBUTES.forEach((attribute) => remember(element, attribute, element.getAttribute(attribute)))
  if (night.src) element.setAttribute('src', night.src)
  // Never leave the day srcset behind: with no night srcset the browser would keep choosing the day picture.
  if (night.srcset) element.setAttribute('srcset', night.srcset)
  else element.removeAttribute('srcset')
  if (night.sizes) element.setAttribute('sizes', night.sizes)
}

const swapVideo = (element: HTMLElement, mode: Mode) => {
  const url = nightValue(element, 'video')
  if (!url) return
  element.querySelectorAll('[data-night-player]').forEach((player) => player.remove())
  if (mode === 'day') return
  if (getComputedStyle(element).position === 'static') element.style.position = 'relative'
  const player = embedVideo(new URL(url, location.href).href, element)
  if (!player) return
  const video = player.element
  video.dataset.nightPlayer = ''
  video.setAttribute('aria-hidden', 'true')
  if (video instanceof HTMLVideoElement) {
    video.autoplay = true
    video.preload = 'auto'
    Object.assign(video.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', objectFit: 'cover' })
  }
  element.append(video)
  player.play()
}

const swapHref = (element: HTMLElement, mode: Mode) => {
  const href = nightValue(element, 'href')
  if (!href) return
  if (mode === 'night') {
    remember(element, 'href', element.getAttribute('href'))
    element.setAttribute('href', href)
  } else {
    restoreAttribute(element, 'href')
  }
}

const hasNightContent = (element: HTMLElement) =>
  ['text', 'src', 'srcset', 'video', 'href'].some((name) => nightValue(element, name))

const applyContent = (element: HTMLElement, mode: Mode) => {
  swapText(element, mode)
  swapImage(element, mode)
  swapVideo(element, mode)
  swapHref(element, mode)
}

const imageReady = (image: HTMLImageElement) =>
  image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const done = () => resolve()
        image.addEventListener('load', done, { once: true })
        image.addEventListener('error', done, { once: true })
        window.setTimeout(done, IMAGE_WAIT_MS)
      })

const syncControls = (mode: Mode) => {
  document.documentElement.classList.toggle('is-night', mode === 'night')
  document.documentElement.classList.toggle('is-day', mode === 'day')
  document.querySelectorAll<HTMLElement>(BUTTON_SELECTOR).forEach((button) => {
    const pressed = button.dataset.dayNight === mode
    button.setAttribute('aria-pressed', String(pressed))
    button.classList.toggle('is-active', pressed)
  })
}

export const dayNight = () => {
  let mode = readMode()
  let inFlight: { targets: HTMLElement[] } | null = null

  const switchable = () => Array.from(document.querySelectorAll<HTMLElement>(TAGGED_SELECTOR)).filter(hasNightContent)

  // Night load: swap before anything splits or paints, then lift the head CSS hide.
  if (mode === 'night') switchable().forEach((element) => applyContent(element, 'night'))
  syncControls(mode)
  document.documentElement.classList.add('night-ready')

  const finishNow = (targets: HTMLElement[]) => {
    gsap.killTweensOf(targets)
    gsap.set(targets, { clearProps: 'opacity,visibility' })
  }

  const setMode = (next: Mode) => {
    if (next === mode) return
    mode = next
    writeMode(next)
    syncControls(next)
    const targets = switchable()
    if (inFlight) finishNow(inFlight.targets)
    inFlight = null

    if (window.matchMedia(REDUCED_MOTION).matches || !targets.length) {
      targets.forEach((element) => applyContent(element, next))
      return
    }

    const flight = { targets }
    inFlight = flight
    gsap.to(targets, {
      autoAlpha: 0,
      duration: HALF_FADE,
      ease: 'none',
      overwrite: true,
      onComplete: () => {
        if (inFlight !== flight) return
        targets.forEach((element) => applyContent(element, next))
        const images = targets.filter((element): element is HTMLImageElement => element instanceof HTMLImageElement)
        void Promise.all(images.map(imageReady)).then(() => {
          if (inFlight !== flight) return
          gsap.to(targets, {
            autoAlpha: 1,
            duration: HALF_FADE,
            ease: 'none',
            overwrite: true,
            onComplete: () => {
              if (inFlight === flight) inFlight = null
              gsap.set(targets, { clearProps: 'opacity,visibility' })
            },
          })
        })
      },
    })
  }

  document.querySelectorAll<HTMLElement>(BUTTON_SELECTOR).forEach((button) => {
    if (button.matches('button, a[href]')) return
    button.setAttribute('role', 'button')
    if (!button.hasAttribute('tabindex')) button.tabIndex = 0
  })

  const modeOf = (event: Event): Mode | null => {
    const button = (event.target as Element | null)?.closest<HTMLElement>(BUTTON_SELECTOR)
    const value = button?.dataset.dayNight
    return value === 'day' || value === 'night' ? value : null
  }

  document.addEventListener('click', (event) => {
    const next = modeOf(event)
    if (!next) return
    event.preventDefault()
    setMode(next)
  })
  document.addEventListener('keydown', (event) => {
    const next = modeOf(event)
    if (!next || (event.key !== 'Enter' && event.key !== ' ')) return
    // Native buttons already turn Enter and Space into a click.
    if ((event.target as Element).closest('button')) return
    event.preventDefault()
    setMode(next)
  })
}
