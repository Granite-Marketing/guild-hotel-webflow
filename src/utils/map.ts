/**
 * Styled Google map with list-linked markers (F13), ported from Editoria
 * (`~/editoria/src/utils/map.ts`).
 *
 * DOM contract (built in Webflow, see docs/reference/runtime-modules.md):
 *   - Root:  `[data-map]` on the element the map fills (the Map Feature
 *            figure). Its static image stays as the fallback: the map canvas
 *            is layered on top and removed again if the API fails.
 *            `data-map-key` holds the Google Maps browser key (referrer-
 *            restricted; kept out of source). Optional `data-map-zoom` sets
 *            the starting zoom (default 15, the map is centred on all
 *            markers). Optional `data-map-home="lat,lng"` and `data-map-home-title`
 *            add a distinct, non-interactive hotel marker.
 *   - Items: `[data-map-item]` in the same section, one per address. Each
 *            item's coordinates come from its Google Maps directions link
 *            (`a[href*="destination="]`, value `lat,lng`), so the link and
 *            the marker share one source. Items without one get no marker.
 *
 * Hovering or focusing an item highlights its marker; hovering or clicking a
 * marker highlights its item (`is-active` on both). A click pins the
 * highlight until another item or marker is clicked.
 *
 * The API loads only when the root nears the viewport.
 */

import { mapNeeds } from '$utils/mapNeeds'

const ACTIVE_CLASS = 'is-active'
const DEFAULT_ZOOM = 15
const MAX_ZOOM = 18
const PANEL_GAP = 48

const pinColors = {
  normal: { fill: '#906E58', stroke: '#F4EFDF' },
  active: { fill: '#272516', stroke: '#F4EFDF' },
  home: { fill: '#F4EFDF', stroke: '#272516' },
}

// Warm greyscale to sit under the tan content panel; POIs and transit hidden.
const mapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#ECE8DD' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6F6A5E' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#F4EFDF' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#FBF9F3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#DCD5C3' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#C9D1CF' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#8C9693' }] },
]

interface MapPoint {
  title: string
  position: google.maps.LatLngLiteral
  item: HTMLElement | null
}

const parseLatLng = (value: string | null): google.maps.LatLngLiteral | null => {
  if (!value) return null
  const [lat, lng] = value.split(',').map((part) => Number(part.trim()))
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
}

const coordinatesFromLink = (item: HTMLElement) => {
  const link = item.querySelector<HTMLAnchorElement>('a[href*="destination="]')
  if (!link) return null
  try {
    return parseLatLng(new URL(link.href).searchParams.get('destination'))
  } catch {
    return null
  }
}

const itemTitle = (item: HTMLElement) =>
  item.getAttribute('data-map-item') || item.firstElementChild?.textContent?.trim() || ''

const pinMarkup = (size: number) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" aria-hidden="true" style="display:block;overflow:visible">` +
  `<circle cx="18" cy="18" r="17" stroke-width="2" style="transition:fill 300ms ease,stroke 300ms ease"/></svg>`

const paintPin = (pin: HTMLElement, colors: { fill: string; stroke: string }, scale: number) => {
  const circle = pin.querySelector('circle')
  if (circle) {
    circle.style.fill = colors.fill
    circle.style.stroke = colors.stroke
  }
  pin.style.transform = `translate(-50%, -50%) scale(${scale})`
}

const collectPoints = (root: HTMLElement) => {
  const scope = root.closest('section') ?? document
  const points: MapPoint[] = []
  scope.querySelectorAll<HTMLElement>('[data-map-item]').forEach((item) => {
    const position = coordinatesFromLink(item)
    if (position) points.push({ title: itemTitle(item), position, item })
  })
  return points
}

// Left padding so markers clear the content panel that overlaps the map.
const boundsPadding = (root: HTMLElement): google.maps.Padding => {
  const padding = { top: 96, right: 96, bottom: 96, left: 96 }
  const panel = root.closest('section')?.querySelector<HTMLElement>('[data-map-item]')
    ?.parentElement?.parentElement
  if (!panel) return padding
  const rootRect = root.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const overlap = panelRect.right - rootRect.left
  if (overlap > 0 && overlap < rootRect.width / 2) padding.left = overlap + PANEL_GAP
  return padding
}

const buildMap = async (root: HTMLElement, points: MapPoint[]) => {
  const { Map: GoogleMap, OverlayView } = await google.maps.importLibrary('maps')
  const { LatLngBounds } = await google.maps.importLibrary('core')

  const canvas = document.createElement('div')
  canvas.className = 'map_canvas'
  canvas.style.cssText = 'position:absolute;inset:0;'
  root.append(canvas)

  // Google calls this on key or referrer errors; drop back to the image.
  window.gm_authFailure = () => canvas.remove()

  const home = parseLatLng(root.getAttribute('data-map-home'))
  const zoomAttribute = Number(root.getAttribute('data-map-zoom'))
  const startZoom = zoomAttribute > 0 ? zoomAttribute : DEFAULT_ZOOM
  const googleMap = new GoogleMap(canvas, {
    center: home ?? points[0].position,
    zoom: startZoom,
    maxZoom: MAX_ZOOM,
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: 'cooperative',
    clickableIcons: false,
  })

  class PinOverlay extends OverlayView {
    constructor(
      private readonly position: google.maps.LatLngLiteral,
      readonly element: HTMLElement,
    ) {
      super()
      element.style.position = 'absolute'
      element.style.transition = 'transform 300ms ease'
    }

    onAdd() {
      this.getPanes()?.overlayMouseTarget.append(this.element)
    }

    draw() {
      const pixel = this.getProjection().fromLatLngToDivPixel(this.position)
      if (!pixel) return
      this.element.style.left = `${pixel.x}px`
      this.element.style.top = `${pixel.y}px`
    }

    onRemove() {
      this.element.remove()
    }
  }

  const bounds = new LatLngBounds()

  if (home) {
    const homePin = document.createElement('div')
    homePin.title = root.getAttribute('data-map-home-title') ?? ''
    homePin.innerHTML = pinMarkup(24)
    homePin.style.zIndex = '1'
    paintPin(homePin, pinColors.home, 1)
    new PinOverlay(home, homePin).setMap(googleMap)
    bounds.extend(home)
  }

  const pins = points.map((point) => {
    const pin = document.createElement('button')
    pin.type = 'button'
    pin.className = 'map_pin'
    pin.title = point.title
    pin.setAttribute('aria-label', point.title)
    pin.style.cssText = 'padding:0;border:0;background:none;cursor:pointer;z-index:2;'
    pin.innerHTML = pinMarkup(36)
    paintPin(pin, pinColors.normal, 1)
    new PinOverlay(point.position, pin).setMap(googleMap)
    bounds.extend(point.position)
    return pin
  })

  let pinnedIndex: number | null = null

  const highlight = (activeIndex: number | null) => {
    points.forEach((point, index) => {
      const isActive = index === activeIndex
      point.item?.classList.toggle(ACTIVE_CLASS, isActive)
      pins[index].classList.toggle(ACTIVE_CLASS, isActive)
      pins[index].style.zIndex = isActive ? '3' : '2'
      paintPin(pins[index], isActive ? pinColors.active : pinColors.normal, isActive ? 1.3 : 1)
    })
  }

  const pinHighlight = (index: number) => {
    pinnedIndex = index
    highlight(index)
  }

  points.forEach((point, index) => {
    const pin = pins[index]
    pin.addEventListener('mouseenter', () => highlight(index))
    pin.addEventListener('mouseleave', () => highlight(pinnedIndex))
    pin.addEventListener('focus', () => highlight(index))
    pin.addEventListener('blur', () => highlight(pinnedIndex))
    pin.addEventListener('click', () => pinHighlight(index))

    const item = point.item
    if (!item) return
    item.style.cursor = 'pointer'
    item.addEventListener('mouseenter', () => highlight(index))
    item.addEventListener('mouseleave', () => highlight(pinnedIndex))
    item.addEventListener('focusin', () => highlight(index))
    item.addEventListener('focusout', () => highlight(pinnedIndex))
    item.addEventListener('click', (event) => {
      // The directions link keeps its own job.
      if ((event.target as Element).closest('a')) return
      pinHighlight(index)
      googleMap.panTo(point.position)
    })
  })

  // Centre on every marker, but never closer than the starting zoom.
  if (points.length + (home ? 1 : 0) > 1) {
    google.maps.event.addListenerOnce(googleMap, 'idle', () => {
      if ((googleMap.getZoom() ?? startZoom) > startZoom) googleMap.setZoom(startZoom)
    })
    googleMap.fitBounds(bounds, boundsPadding(root))
  }
}

export const map = () => {
  const root = document.querySelector<HTMLElement>('[data-map]')
  if (!root) return

  const apiKey = root.getAttribute('data-map-key')
  const points = collectPoints(root)
  if (!apiKey || !points.length) return

  mapNeeds(apiKey)

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      buildMap(root, points).catch((error) => console.warn('[map]', error))
    },
    { rootMargin: '400px 0px' },
  )
  observer.observe(root)
}
