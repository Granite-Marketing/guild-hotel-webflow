/**
 * Minimal Google Maps JS API declarations for `$utils/map`.
 *
 * The API is loaded at runtime by `$utils/mapNeeds` (no npm package), so only
 * the surface the map module touches is declared here.
 */

declare namespace google.maps {
  interface LatLngLiteral {
    lat: number
    lng: number
  }

  interface Padding {
    top: number
    right: number
    bottom: number
    left: number
  }

  interface MapTypeStyle {
    featureType?: string
    elementType?: string
    stylers: Record<string, string | number>[]
  }

  interface MapOptions {
    center?: LatLngLiteral
    zoom?: number
    maxZoom?: number
    styles?: MapTypeStyle[]
    disableDefaultUI?: boolean
    zoomControl?: boolean
    gestureHandling?: 'cooperative' | 'greedy' | 'none' | 'auto'
    clickableIcons?: boolean
    keyboardShortcuts?: boolean
  }

  class LatLngBounds {
    extend(point: LatLngLiteral): LatLngBounds
  }

  class Map {
    constructor(element: HTMLElement, options?: MapOptions)
    fitBounds(bounds: LatLngBounds, padding?: Padding | number): void
    panTo(point: LatLngLiteral): void
    getZoom(): number | undefined
    setZoom(zoom: number): void
  }

  interface MapPanes {
    overlayMouseTarget: HTMLElement
  }

  interface Point {
    x: number
    y: number
  }

  interface MapCanvasProjection {
    fromLatLngToDivPixel(point: LatLngLiteral): Point | null
  }

  class OverlayView {
    setMap(map: Map | null): void
    getPanes(): MapPanes | null
    getProjection(): MapCanvasProjection
    onAdd?(): void
    draw?(): void
    onRemove?(): void
  }

  namespace event {
    function addListenerOnce(instance: object, eventName: string, handler: () => void): void
  }

  interface MapsLibrary {
    Map: typeof Map
    OverlayView: typeof OverlayView
  }

  interface CoreLibrary {
    LatLngBounds: typeof LatLngBounds
  }

  function importLibrary(name: 'maps'): Promise<MapsLibrary>
  function importLibrary(name: 'core'): Promise<CoreLibrary>
  function importLibrary(name: string): Promise<unknown>
}

interface Window {
  google?: typeof google
  gm_authFailure?: () => void
}
