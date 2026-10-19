/**
 * CMS Filter Links
 *
 * Builds deep links into a Finsweet CMS Filter listing page from data
 * attributes, so a CMS card or tag can link to a pre-filtered list.
 *
 * DOM contract:
 *   <a data-filter-path="works"            listing page slug (no leading slash)
 *      data-title="{{ Category name }}"     value to filter by
 *      data-filter-param="category">        optional query key, default "category"
 *
 * Result: href="/works?category=Category+name". The query key must match the
 * Finsweet filter field the listing page reads from the URL.
 */

const DEFAULT_FILTER_PARAM = 'category'

export const cmsFilterLinks = () => {
  const filterLinks = document.querySelectorAll<HTMLAnchorElement>(
    'a[data-filter-path][data-title]',
  )
  if (!filterLinks.length) return

  filterLinks.forEach((link) => {
    const filterValue = link.getAttribute('data-title')
    const filterPath = link.getAttribute('data-filter-path')
    if (!filterValue || !filterPath) return

    const filterParam = link.getAttribute('data-filter-param') || DEFAULT_FILTER_PARAM
    const encodedValue = encodeURIComponent(filterValue).replace(/%20/g, '+')
    link.href = `/${filterPath.replace(/^\/+/, '')}?${filterParam}=${encodedValue}`
  })
}
