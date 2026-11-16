/**
 * Press Categories (#181)
 *
 * /press is one Collection List of every Press item. Each item carries its
 * category heading; this module keeps only the first heading of each
 * category and rebuilds the subnav tabs from the categories that have items,
 * so a new category or an empty one needs no Designer work.
 *
 * DOM contract:
 *   [data-press-list] .w-dyn-items                the Collection List
 *     [data-press-item]                           one per Press item
 *       data-press-category="{category slug}"     bound to Press Category: Slug
 *       data-press-category-order="{number}"      bound to Press Category: Order
 *       [data-press-heading]#{category slug}      header bound to Press Category: Name
 *   .tab-pills-intro_tabs a[href^="#"]            the subnav; the first tab is the template
 *
 * Items are re-ordered by category order, keeping the list's own order
 * (item Order) inside a category, so the nth-child left/right alternation
 * runs unbroken. Repeat headings are removed, not hidden, so their duplicate
 * ids go too. Without the bundle every heading shows and the static tabs
 * still reach the first heading of each category.
 *
 * Order: before tabDropdown() and the scroll engine, because it changes page
 * height and the tabs that stickyTabs() and tabDropdown() work on.
 */

export const pressCategories = () => {
  const list = document.querySelector<HTMLElement>('[data-press-list] .w-dyn-items')
  if (!list) return

  const items = [...list.querySelectorAll<HTMLElement>(':scope > [data-press-item]')]
  const categoryOrder = (item: HTMLElement) => {
    const order = Number.parseFloat(item.dataset.pressCategoryOrder ?? '')
    return Number.isNaN(order) ? Number.POSITIVE_INFINITY : order
  }
  // Array.prototype.sort is stable, so item Order survives inside each category.
  const sortedItems = [...items].sort((first, second) => categoryOrder(first) - categoryOrder(second))
  sortedItems.forEach((item) => list.append(item))

  const categories: { slug: string; name: string }[] = []
  sortedItems.forEach((item) => {
    const heading = item.querySelector<HTMLElement>('[data-press-heading]')
    const slug = item.dataset.pressCategory?.trim()
    if (!heading) return
    if (!slug || categories.some((category) => category.slug === slug)) {
      heading.remove()
      return
    }
    heading.id = slug
    categories.push({ slug, name: heading.textContent?.trim() ?? slug })
  })

  const tabBar = document.querySelector<HTMLElement>('.tab-pills-intro_tabs')
  const templateTab = tabBar?.querySelector<HTMLAnchorElement>('a[href^="#"]')
  if (!tabBar || !templateTab) return

  const tabs = categories.map(({ slug, name }, index) => {
    const tab = templateTab.cloneNode(true) as HTMLAnchorElement
    tab.href = `#${slug}`
    tab.textContent = name
    tab.classList.toggle('is-active', index === 0)
    tab.removeAttribute('aria-current')
    return tab
  })
  tabBar.querySelectorAll('a[href^="#"]').forEach((tab) => tab.remove())
  tabBar.prepend(...tabs)
}
