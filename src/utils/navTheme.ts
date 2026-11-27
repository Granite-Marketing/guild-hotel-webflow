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
 *   - a figure, video or loose image (not inside a figure, at least 120px,
 *     not an SVG) at least 60% of the viewport wide counts as dark
 *     (a photo keeps the cream nav), using its visible clip-path area.
 *     Map artwork (any class containing "map") is not a photo;
 *   - a narrower photo (half of a split section, a card) also keeps the
 *     cream nav, across its own width only (Stephen, 26 Nov: all photos white;
 *     replaces the P-E3 tone sampling);
 *   - `[data-header-theme="dark"]` forces the dark nav over an element and
 *     `[data-header-theme="white"]` forces the cream nav (NGA contract).
 * Darker areas are subtracted from lighter ones.
 *
 * When the header uses the Dark variant (dark text, as on /contact) the
 * roles swap (F51): the clone is cream and shows wherever the dark clone
 * would not, so the nav still turns cream over dark sections and photos. The
 * clone hides while the full-screen menu is open (`is-nav-open`) and snaps
 * back with a fresh mask when it closes, so it never flashes.
 */

const HEADER_SELECTOR = '[data-nav="header"]'
const BAR_SELECTOR = '.site-nav_bar'
const DARK_COLOR = 'var(--_primitives---colors--neutral-darkest, #262118)'
const LIGHT_COLOR = 'var(--_primitives---colors--neutral-lightest, #f4efdf)'
const OPEN_CLASS = 'is-nav-open'
const LIGHT_LUMINANCE = 0.5
const PHOTO_MIN_WIDTH = 0.6
// Loose images (the scattered timeline photos) count too; icons are filtered by size and SVG.
const PHOTO_SELECTOR = 'figure, video, img:not(figure img)'
const LOOSE_IMAGE_MIN_SIZE = 120
const NOT_PHOTO_SELECTOR = '[class*="map"], [class*="map"] *'
/** How long the mask keeps updating after the last scroll, input or animation start (ms); covers the 3s tab move. */
const ACTIVE_TAIL_MS = 3500
const WAKE_EVENTS = ['scroll', 'wheel', 'touchmove', 'keydown', 'pointerover', 'pointerdown', 'click'] as const
/**
 * An area whose cached band is further than this from the bar (in viewport
 * heights) is skipped without reading its rect. The margin covers reveal
 * transforms; anything pinned, sticky or fixed is always read live.
 */
const BAND_MARGIN = 1

interface Interval {
  start: number
  end: number
}

/** A narrow dark photo under the bar: the columns it spans and its vertical interval. */
interface DarkBlock {
  left: number
  right: number
  interval: Interval
}

type Rgba = { red: number; green: number; blue: number; alpha: number }

export const navTheme = () => {
  const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
  const bar = header?.querySelector<HTMLElement>(BAR_SELECTOR)
  if (!header || !bar) return
  // Dark variant: the clone is cream and fills the complement of the light areas.
  const darkBase = isDarkColor(getComputedStyle(header).color)

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
    color: darkBase ? LIGHT_COLOR : DARK_COLOR,
  })
  document.body.appendChild(overlay)

  const buildClone = () => {
    const clone = bar.cloneNode(true) as HTMLElement
    // The bar carries the inverse mask (F59); a clone that copied it would hide exactly where it should show.
    clearMask(clone)
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
    wake()
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
          !element.matches(NOT_PHOTO_SELECTOR) &&
          !(element instanceof HTMLImageElement && /\.svg(\?|$)/i.test(element.currentSrc || element.src)),
      )
      .map((element) => ({ element, clipHost: findClipHost(element) }))
    measureBands()
  }
  // Each area's document band at the last measure; null means it moves with the viewport (pinned, sticky, fixed).
  const bands = new Map<HTMLElement, Interval | null>()
  const measureBands = () => {
    bands.clear()
    const liveCache = new Map<Element, boolean>()
    const movesWithViewport = (element: Element | null): boolean => {
      if (!element || element === document.body) return false
      const cached = liveCache.get(element)
      if (cached !== undefined) return cached
      const position = getComputedStyle(element).position
      const live =
        position === 'fixed' || position === 'sticky' || element.classList.contains('pin-spacer') || movesWithViewport(element.parentElement)
      liveCache.set(element, live)
      return live
    }
    const scrollY = window.scrollY
    ;[...lightAreas, ...darkAreas, ...photos.map(({ element }) => element)].forEach((element) => {
      if (movesWithViewport(element)) return void bands.set(element, null)
      const rect = element.getBoundingClientRect()
      // Not laid out yet (a closed tab, a hidden slide): it could appear anywhere, so keep reading it live.
      bands.set(element, rect.height ? { start: rect.top + scrollY, end: rect.bottom + scrollY } : null)
    })
  }
  /** False only for an area whose cached band is well clear of the bar, so its rect is not read this frame. */
  const mayBeUnderBar = (element: HTMLElement) => {
    const band = bands.get(element)
    if (!band) return true
    const margin = window.innerHeight * BAND_MARGIN
    const scrollY = window.scrollY
    return band.end > scrollY - margin && band.start < scrollY + navHeight + margin
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
      if (!mayBeUnderBar(element)) return
      const rect = element.getBoundingClientRect()
      const interval = bandInterval(rect.top, rect.bottom)
      if (interval) light.push(interval)
    })

    const dark: Interval[] = []
    darkAreas.forEach((element) => {
      if (!mayBeUnderBar(element)) return
      const rect = element.getBoundingClientRect()
      const interval = bandInterval(rect.top, rect.bottom)
      if (interval) dark.push(interval)
    })
    const barWidth = overlay.clientWidth
    const darkBlocks: DarkBlock[] = []
    const minPhotoWidth = window.innerWidth * PHOTO_MIN_WIDTH
    photos.forEach(({ element, clipHost }) => {
      if (!mayBeUnderBar(element)) return
      const rect = element.getBoundingClientRect()
      if (element instanceof HTMLImageElement && Math.min(rect.width, rect.height) < LOOSE_IMAGE_MIN_SIZE) return
      const wide = rect.width >= minPhotoWidth
      if (rect.top > navHeight || rect.bottom < 0) return
      let top = rect.top
      let bottom = rect.bottom
      if (clipHost) {
        const clipped = visibleVerticalRange(clipHost, clipHost.getBoundingClientRect())
        if (!clipped) return
        top = Math.max(top, clipped.top)
        bottom = Math.min(bottom, clipped.bottom)
      }
      const interval = bandInterval(top, bottom)
      if (!interval) return
      if (wide) {
        dark.push(interval)
        return
      }
      // Whole pixels, so neighbouring columns never leave a seam.
      const left = Math.max(0, Math.round(rect.left))
      const right = Math.min(barWidth, Math.round(rect.right))
      if (right > left && isShown(element)) darkBlocks.push({ left, right, interval })
    })

    // One column per stretch between photo edges; a single full-width column when no narrow photo is under the bar.
    const edges = [...new Set([0, barWidth, ...darkBlocks.flatMap(({ left, right }) => [left, right])])].sort((first, second) => first - second)
    const fullBar = [{ start: 0, end: navHeight }]
    const columns = edges.slice(1).map((right, index) => {
      const left = edges[index]
      const blocks = darkBlocks.filter((block) => block.left <= left && block.right >= right)
      const lightVisible = subtractIntervals(light, [...dark, ...blocks.map(({ interval }) => interval)])
      const shown = darkBase ? subtractIntervals(fullBar, lightVisible) : lightVisible
      return { left, right, shown }
    })
    const mask = (inverse: boolean) =>
      columns
        .map(({ left, right, shown }) => {
          const gradient = buildMaskGradient(inverse ? subtractIntervals(fullBar, shown) : shown, navHeight)
          return `${gradient} ${left}px 0 / ${right - left}px 100% no-repeat`
        })
        .join(', ')
    const overlayMask = mask(false)
    if (overlayMask === lastGradient) return
    lastGradient = overlayMask
    setMask(overlay, overlayMask)
    // F59: hide the real bar where the clone shows, so its antialiased edges
    // never peek out around the clone as a faint outline.
    setMask(bar, mask(true))
  }

  // Hide the clone while the full-screen menu is open; on close, recompute
  // the mask before showing it again so its first frame is correct.
  new MutationObserver(() => {
    if (header.classList.contains(OPEN_CLASS)) {
      overlay.style.visibility = 'hidden'
      clearMask(bar)
      return
    }
    lastGradient = ''
    updateMask()
    overlay.style.visibility = ''
  }).observe(header, { attributes: true, attributeFilter: ['class'] })

  updateMask()

  // Only while something can move under the bar: a perpetual rAF loop that reads layout fights Lenis for the main
  // thread (docs/solutions/integration-issues/lenis-main-thread-jitter-2026-11-27.md). Every scroll, input or
  // animation start wakes it; it runs on for ACTIVE_TAIL_MS so eased reveals and tab moves (up to 3s) finish
  // with a correct mask, then stops until the next wake.
  let activeUntil = 0
  let running = false
  const tick = () => {
    updateMask()
    if (performance.now() < activeUntil) requestAnimationFrame(tick)
    else running = false
  }
  const wake = () => {
    activeUntil = performance.now() + ACTIVE_TAIL_MS
    if (running) return
    running = true
    requestAnimationFrame(tick)
  }
  wake()
  WAKE_EVENTS.forEach((type) => window.addEventListener(type, wake, { passive: true, capture: true }))

  // Cached document bands, refreshed whenever ScrollTrigger re-measures the page.
  ScrollTrigger.addEventListener('refresh', () => {
    measureBands()
    lastGradient = ''
    wake()
  })

  window.addEventListener(
    'resize',
    () => {
      navHeight = bar.offsetHeight
      classifyAreas()
      lastGradient = ''
      wake()
    },
    { passive: true },
  )
  // Content can change size or appear after load (CMS, Finsweet).
  window.addEventListener(
    'load',
    () => {
      classifyAreas()
      wake()
    },
    { once: true },
  )
}

const setMask = (element: HTMLElement, mask: string) => {
  element.style.setProperty('-webkit-mask', mask)
  element.style.setProperty('mask', mask)
}

const clearMask = (element: HTMLElement) => {
  element.style.removeProperty('-webkit-mask')
  element.style.removeProperty('mask')
}

/** Stacked tabs and hover images are in the layout but not on show. */
const isShown = (element: HTMLElement) =>
  element.checkVisibility?.({ checkOpacity: true, checkVisibilityCSS: true }) ?? true

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
  // D1: a mask finishing its open writes tiny values in exponent form (7.5e-05px); missing them flashed the nav for a frame.
  const calc = value.match(/^calc\(\s*100%\s*-\s*([\d.eE+-]+)px\s*\)$/)
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
