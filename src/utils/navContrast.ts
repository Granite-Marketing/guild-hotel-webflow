/**
 * Nav contrast: the fixed Site Nav uses cream text, which disappears over
 * the cream bands below a photo hero (Wellness intro, and the same on every
 * page with the base nav). While the nav bar sits over a light background,
 * this module adds `is-on-light` to the header; the Webflow combo class
 * `site-nav_component.is-on-light` switches the text to the dark colour.
 *
 * DOM contract:
 *   [data-nav="header"]   fixed header (same element navToggle uses)
 *     .site-nav_bar       the bar whose midline is sampled
 *
 * Detection samples the bar midline at 25, 50 and 75 percent of the width
 * and calls it light when most points are light. At each point the first
 * element below the header (ignoring hairlines under 24px) with an opaque
 * background colour decides (light when its
 * relative luminance is above 0.5). An image, video or background image
 * counts as a photo and keeps the default cream text. Headers whose own
 * text is already dark (the Dark variant) are left alone, as is the open
 * full-screen menu.
 */

const LIGHT_CLASS = 'is-on-light'
const OPEN_CLASS = 'is-nav-open'
const LIGHT_LUMINANCE = 0.5
const MIN_SIZE = 24
const SAMPLE_POINTS = [0.25, 0.5, 0.75]

type Rgba = { red: number; green: number; blue: number; alpha: number }

const parseColor = (value: string): Rgba | null => {
  const match = value.match(/rgba?\(([^)]+)\)/)
  if (!match) return null
  const [red, green, blue, alpha = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number)
  return { red, green, blue, alpha }
}

const luminance = ({ red, green, blue }: Rgba) => {
  const channel = (value: number) => {
    const scaled = value / 255
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
}

const isMedia = (element: Element) =>
  element instanceof HTMLImageElement ||
  element instanceof HTMLVideoElement ||
  element instanceof HTMLCanvasElement ||
  element.tagName === 'PICTURE'

export const navContrast = () => {
  const header = document.querySelector<HTMLElement>('[data-nav="header"]')
  if (!header) return

  const headerColor = parseColor(getComputedStyle(header).color)
  if (!headerColor || luminance(headerColor) < LIGHT_LUMINANCE) return

  const bar = header.querySelector<HTMLElement>('.site-nav_bar') ?? header

  const isLightAt = (pointX: number, pointY: number) => {
    for (const element of document.elementsFromPoint(pointX, pointY)) {
      if (header.contains(element)) continue
      if (isMedia(element)) return false

      // Skip dividers and other hairlines painted over a photo.
      const box = element.getBoundingClientRect()
      if (box.width < MIN_SIZE || box.height < MIN_SIZE) continue

      const style = getComputedStyle(element)
      if (style.backgroundImage !== 'none') return false

      const background = parseColor(style.backgroundColor)
      if (background && background.alpha >= 0.5) return luminance(background) > LIGHT_LUMINANCE
    }
    return false
  }

  const isLightBehindBar = () => {
    const rect = bar.getBoundingClientRect()
    const pointY = rect.top + rect.height / 2
    const lightCount = SAMPLE_POINTS.filter((fraction) =>
      isLightAt(window.innerWidth * fraction, pointY),
    ).length
    return lightCount > SAMPLE_POINTS.length / 2
  }

  let frameRequested = false

  const update = () => {
    frameRequested = false
    const isLight = !header.classList.contains(OPEN_CLASS) && isLightBehindBar()
    header.classList.toggle(LIGHT_CLASS, isLight)
  }

  const requestUpdate = () => {
    if (frameRequested) return
    frameRequested = true
    requestAnimationFrame(update)
  }

  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  new MutationObserver(requestUpdate).observe(header, {
    attributes: true,
    attributeFilter: ['class'],
  })
  update()
}
