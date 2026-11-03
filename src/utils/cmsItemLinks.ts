/**
 * CMS Item Links
 *
 * Builds a CMS item URL from data attributes, for links Webflow cannot bind
 * headlessly (Collection List "current item" links, reference-field links).
 *
 * DOM contract:
 *   <a data-cms-link-slug="{{ Slug }}"             bound to a CMS Slug field
 *      data-cms-link-path="happenings-stories"     optional collection path
 *      data-cms-link-anchor>                      optional: slug as a hash
 *
 * Result: href="/happenings-stories/{slug}", or "/{slug}" with no path.
 * With data-cms-link-anchor: href="/arts#{slug}", which modals() opens as
 * the dialog with that id on page load.
 * Links with an empty slug keep their Designer href (the no-JS fallback).
 */

const trimSlashes = (value: string) => value.trim().replace(/^\/+|\/+$/g, '')

export const cmsItemLinks = () => {
  const itemLinks = document.querySelectorAll<HTMLAnchorElement>('a[data-cms-link-slug]')
  if (!itemLinks.length) return

  itemLinks.forEach((link) => {
    const slug = trimSlashes(link.getAttribute('data-cms-link-slug') ?? '')
    if (!slug) return

    const collectionPath = trimSlashes(link.getAttribute('data-cms-link-path') ?? '')
    const separator = link.hasAttribute('data-cms-link-anchor') ? '#' : '/'
    link.setAttribute('href', collectionPath ? `/${collectionPath}${separator}${slug}` : `/${slug}`)
  })
}
