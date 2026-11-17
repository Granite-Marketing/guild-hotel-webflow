/**
 * Directions Links (mobile feedback M31b)
 *
 * Every "Directions" link opens in a new tab, desktop and mobile. Matches the
 * CMS link (`data-map-directions`), static links that carry coordinates
 * (`href*="destination="`) and any Google Maps directions URL.
 */

const SELECTOR = 'a[data-map-directions], a[href*="destination="], a[href*="google.com/maps/dir"]'

export const openInNewTab = (link: HTMLAnchorElement) => {
  link.target = '_blank'
  link.rel = 'noopener'
}

export const directionsLinks = () => {
  document.querySelectorAll<HTMLAnchorElement>(SELECTOR).forEach(openInNewTab)
}
