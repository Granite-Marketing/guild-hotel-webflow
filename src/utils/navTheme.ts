/**
 * Nav Theme
 *
 * The fixed Site Nav is cream (light text) for photos and dark sections.
 * Over light sections it switches to the dark text colour, and while a
 * section edge passes under the bar the switch happens exactly at that edge
 * (half light, half dark), in both scroll directions. Ported from the NGA
 * project (feedback F01).
 *
 * Technique: a fixed overlay holding a dark-coloured clone of the nav bar
 * sits over the real bar. A `mask-image` gradient, recomputed every
 * animation frame, reveals the clone only where the bar overlaps a light
 * background. The clone is aria-hidden, inert and ignores pointer events,
 * so the real nav keeps every click and keyboard interaction.
 *
 * Light areas are found automatically, so no Designer attributes are
 * needed:
 *   - a `section` whose background colour is light (luminance > 0.5)
 *     counts as light; one with a dark background counts as dark. A
 *     transparent section takes the colour of its nearest opaque ancestor
 *     (in the end the body);
 *   - a figure or video at least 60% of the viewport wide counts as dark
 *     (a photo keeps the cream nav), using its visible clip-path area.
 *     Map artwork (any class containing "map") is not a photo;
 *   - `[data-header-theme="dark"]` forces the dark nav over an element and
 *     `[data-header-theme="white"]` forces the cream nav (NGA contract).
 * Darker areas are subtracted from lighter ones.
 *
 * Skipped when the header already uses the Dark variant (dark text). The
 * clone hides while the full-screen menu is open (`is-nav-open`) and snaps
 * back with a fresh mask when it closes, so it never flashes.
 */

const HEADER_SELECTOR = '[data-nav="header"]'
const BAR_SELECTOR = '.site-nav_bar'
const DARK_COLOR = 'var(--_primitives---colors--neutral-darkest, #262118)'
const OPEN_CLASS = 'is-nav-open'
const LIGHT_LUMINANCE = 0.5
const PHOTO_MIN_WIDTH = 0.6
const PHOTO_SELECTOR = 'figure, video'
const NOT_PHOTO_SELECTOR = '[class*="map"], [class*="map"] *'

interface Interval {
  start: number
  end: number
}

type Rgba = { red: number; green: number; blue: number; alpha: number }

export const navTheme = () => {
  const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
  const bar = header?.querySelector<HTMLElement>(BAR_SELECTOR)
  if (!header || !bar) return
  if (isDarkColor(getComputedStyle(header).color)) return

  const overlay = document.createElement('div')
  overlay.setAttribute('aria-hidden', 'true')
  overlay.inert = true
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '101',
    pointerEvents: 'none',
    color: DARK_COLOR,
  })
  document.body.appendChild(overlay)

  const buildClone = () => {
    const clone = bar.cloneNode(true) as HTMLElement
    clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
    clone.querySelectorAll('[data-nav], [data-nav-mode]').forEach((element) => {
      element.removeAttribute('data-nav')
      element.removeAttribute('data-nav-mode')
    })
    clone.querySelectorAll<HTMLElement>('a, button, [tabindex], [role="button"]').forEach(
      (element) => element.setAttribute('tabindex', '-1'),
    )
    overlay.replaceChildren(clone)
  }
  buildClone()

  // Mirror state changes on the real bar (for example the day/night mode).
  new MutationObserver(() => {
    buildClone()
    lastGradient = ''
  }).observe(bar, { attributes: true, attributeFilter: ['class'], subtree: true })

  let lightAreas: HTMLElement[] = []
  let darkAreas: HTMLElement[] = []
  let photos: Array<{ element: HTMLElement; clipHost: HTMLElement | null }> = []

  const classifyAreas = () => {
    lightAreas = []
    darkAreas = []
    document.querySelectorAll<HTMLElement>('section, [data-header-theme]').forEach((element) => {
      if (header.contains(element)) return
      const forced = element.dataset.headerTheme
      if (forced === 'dark') return void lightAreas.push(element)
      if (forced === 'white') return void darkAreas.push(element)
      const background = effectiveBackground(element)
      if (!background) return
      if (luminance(background) > LIGHT_LUMINANCE) lightAreas.push(element)
      else darkAreas.push(element)
    })
    photos = Array.from(document.querySelectorAll<HTMLElement>(PHOTO_SELECTOR))
      .filter(
        (element) =>
          !header.contains(element) &&
          !overlay.contains(element) &&
          !element.matches(NOT_PHOTO_SELECTOR),
      )
      .map((element) => ({ element, clipHost: findClipHost(element) }))
  }
  classifyAreas()

  let navHeight = bar.offsetHeight
  let lastGradient = ''

  const bandInterval = (top: number, bottom: number): Interval | null => {
    const start = Math.max(0, Math.min(top, navHeight))
    const end = Math.max(0, Math.min(bottom, navHeight))
    return end > start ? { start, end } : null
  }

  const updateMask = () => {
    if (header.classList.contains(OPEN_CLASS)) return

    const light: Interval[] = []
    lightAreas.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const interval = bandInterval(rect.top, rect.bottom)
      if (interval) light.push(interval)
    })

    const dark: Interval[] = []
    darkAreas.forEach((element) => {
      const rect = element.getBoundingClientRect()
      const interval = bandInterval(rect.top, rect.bottom)
      if (interval) dark.push(interval)
    })
    const minPhotoWidth = window.innerWidth * PHOTO_MIN_WIDTH
    photos.forEach(({ element, clipHost }) => {
      const rect = element.getBoundingClientRect()
      if (rect.top > navHeight || rect.bottom < 0 || rect.width < minPhotoWidth) return
      let top = rect.top
      let bottom = rect.bottom
      if (clipHost) {
        const clipped = visibleVerticalRange(clipHost, clipHost.getBoundingClientRect())
        if (!clipped) return
        top = Math.max(top, clipped.top)
        bottom = Math.min(bottom, clipped.bottom)
      }
      const interval = bandInterval(top, bottom)
      if (interval) dark.push(interval)
    })

    const gradient = buildMaskGradient(subtractIntervals(light, dark), navHeight)
    if (gradient === lastGradient) return
    lastGradient = gradient
    overlay.style.maskImage = gradient
    overlay.style.setProperty('-webkit-mask-image', gradient)
  }

  // Hide the clone while the full-screen menu is open; on close, recompute
  // the mask before showing it again so its first frame is correct.
  new MutationObserver(() => {
    if (header.classList.contains(OPEN_CLASS)) {
      overlay.style.visibility = 'hidden'
      return
    }
    lastGradient = ''
    updateMask()
    overlay.style.visibility = ''
  }).observe(header, { attributes: true, attributeFilter: ['class'] })

  updateMask()

  const tick = () => {
    updateMask()
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)

  window.addEventListener(
    'resize',
    () => {
      navHeight = bar.offsetHeight
      classifyAreas()
      lastGradient = ''
    },
    { passive: true },
  )
  // Content can change size or appear after load (CMS, Finsweet).
  window.addEventListener('load', classifyAreas, { once: true })
}

/** The first opaque background colour on the element or its ancestors. */
const effectiveBackground = (element: HTMLElement): Rgba | null => {
  let node: HTMLElement | null = element
  while (node) {
    const color = parseColor(getComputedStyle(node).backgroundColor)
    if (color && color.alpha >= 0.5) return color
    node = node.parentElement
  }
  return null
}

/** The element itself or its nearest ancestor that has a clip-path. */
const findClipHost = (element: HTMLElement): HTMLElement | null => {
  let node: HTMLElement | null = element
  while (node && node !== document.body) {
    if (getComputedStyle(node).clipPath !== 'none') return node
    node = node.parentElement
  }
  return null
}

/**
 * The element's visible vertical range in viewport coordinates, narrowed by
 * an `inset()` or `polygon()` clip-path (as used by the mask reveals).
 */
const visibleVerticalRange = (element: HTMLElement, rect: DOMRect) => {
  const clipPath = getComputedStyle(element).clipPath
  if (!clipPath || clipPath === 'none') return { top: rect.top, bottom: rect.bottom }

  const inset = clipPath.match(/^inset\((.*)\)$/)?.[1]
  if (inset) {
    const values = inset.split(/\s+(?![^(]*\))/).map((value) => resolveLength(value, rect.height))
    const topInset = values[0] ?? 0
    const bottomInset = values[2] ?? topInset
    return { top: rect.top + topInset, bottom: rect.bottom - bottomInset }
  }

  const polygon = clipPath.match(/^polygon\((.*)\)$/)?.[1]
  if (polygon) {
    const ys = polygon
      .split(',')
      .map((point) => point.trim().split(/\s+(?![^(]*\))/)[1])
      .map((value) => resolveLength(value, rect.height))
    if (!ys.length) return null
    return { top: rect.top + Math.min(...ys), bottom: rect.top + Math.max(...ys) }
  }

  return { top: rect.top, bottom: rect.bottom }
}

/** Resolves `12px`, `50%` and `calc(100% - 12px)` against a length. */
const resolveLength = (value: string | undefined, length: number) => {
  if (!value) return 0
  const calc = value.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/)
  if (calc) return length - parseFloat(calc[1])
  if (value.endsWith('%')) return (parseFloat(value) / 100) * length
  return parseFloat(value) || 0
}

const subtractIntervals = (bases: Interval[], cuts: Interval[]): Interval[] => {
  if (!cuts.length) return bases
  const result: Interval[] = []
  bases.forEach((base) => {
    let segments = [base]
    cuts.forEach((cut) => {
      const next: Interval[] = []
      segments.forEach((segment) => {
        if (cut.end <= segment.start || cut.start >= segment.end) {
          next.push(segment)
          return
        }
        if (cut.start > segment.start) next.push({ start: segment.start, end: cut.start })
        if (cut.end < segment.end) next.push({ start: cut.end, end: segment.end })
      })
      segments = next
    })
    result.push(...segments)
  })
  return result
}

const buildMaskGradient = (intervals: Interval[], navHeight: number) => {
  if (!intervals.length) return 'linear-gradient(transparent, transparent)'

  const sorted = [...intervals].sort((first, second) => first.start - second.start)
  const stops: string[] = []
  let cursor = 0
  sorted.forEach(({ start, end }) => {
    if (start > cursor) stops.push(`transparent ${cursor}px`, `transparent ${start}px`)
    stops.push(`black ${Math.max(start, cursor)}px`, `black ${end}px`)
    cursor = Math.max(cursor, end)
  })
  if (cursor < navHeight) stops.push(`transparent ${cursor}px`, `transparent ${navHeight}px`)
  return `linear-gradient(to bottom, ${stops.join(', ')})`
}

const parseColor = (value: string): Rgba | null => {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return null
  const [red, green, blue, alpha = 1] = match[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number)
  return { red, green, blue, alpha }
}

const luminance = ({ red, green, blue }: Rgba) => {
  const channel = (value: number) => {
    const normalised = value / 255
    return normalised <= 0.03928 ? normalised / 12.92 : ((normalised + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

const isDarkColor = (value: string) => {
  const color = parseColor(value)
  return color ? luminance(color) <= LIGHT_LUMINANCE : false
}
