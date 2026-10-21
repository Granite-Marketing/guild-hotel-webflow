/**
 * Google Maps JS API loader, ported from Editoria (`~/editoria/src/utils/mapNeeds.ts`).
 *
 * Installs Google's dynamic-import bootstrap once, so `google.maps.importLibrary`
 * exists and the API script is only fetched on the first `importLibrary` call.
 * Same provider as Editoria (F13 decision, 2026-10-21), but the browser key is
 * not kept in source: the caller passes it from the page (`data-map-key`, set
 * in Webflow), and it should be restricted by HTTP referrer in Google Cloud.
 */

const CALLBACK_NAME = '__ib__'

export const mapNeeds = (apiKey: string) => {
  // Untyped until the API loads: only the bootstrap hooks exist here.
  const googleNamespace = (window.google ||= {} as typeof google)
  const mapsNamespace = ((googleNamespace as { maps?: object }).maps ||= {}) as Record<
    string,
    unknown
  >
  if (mapsNamespace.importLibrary) return

  const requestedLibraries = new Set<string>()
  let scriptPromise: Promise<void> | null = null

  const loadScript = () =>
    (scriptPromise ||= new Promise<void>((resolve, reject) => {
      const params = new URLSearchParams({
        key: apiKey,
        v: 'weekly',
        libraries: [...requestedLibraries].join(','),
        callback: `google.maps.${CALLBACK_NAME}`,
      })
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`
      script.async = true
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('The Google Maps JavaScript API could not load.'))
      }
      mapsNamespace[CALLBACK_NAME] = () => resolve()
      document.head.append(script)
    }))

  // The real API replaces this stub on load; later calls go straight to it.
  mapsNamespace.importLibrary = (name: string) => {
    requestedLibraries.add(name)
    return loadScript().then(() => google.maps.importLibrary(name))
  }
}
