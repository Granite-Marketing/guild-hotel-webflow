/**
 * Category Listing (#318, generalises Press Categories #181)
 *
 * One Collection List of every item; each item carries its category heading.
 * This module keeps the first heading of each category, orders the items by
 * category order and rebuilds the tab pills from the categories that have
 * items, so a new or empty category needs no Designer work.
 *
 * DOM contract (generic attributes):
 *   [data-category-list] .w-dyn-items               the Collection List
 *     [data-category-item]                          one per CMS item
 *       data-category="{category slug}"             bound to Category: Slug
 *       data-category-order="{number}"              bound to Category: Order
 *       [data-category-heading]                     header bound to Category: Name
 *   [data-category-tabs] a[href^="#"]               the tab bar; first tab is the template
 *
 * Items are sorted by category order, keeping the list's own order inside a
 * category. Repeat headings are removed, not hidden, so duplicate ids go too.
 * Several lists on one page are supported; the tab bar is the nearest
 * `[data-category-tabs]` inside the list root, else the first on the page.
 *
 * Press keeps its older attributes through pressCategories (same behaviour).
 * Order: before tabDropdown() and the scroll engine (it changes page height).
 */

export type CategoryListingSelectors = {
  root: string
  item: string
  heading: string
  tabs: string
  slugKey: string
  orderKey: string
}

export const genericSelectors: CategoryListingSelectors = {
  root: '[data-category-list]',
  item: '[data-category-item]',
  heading: '[data-category-heading]',
  tabs: '[data-category-tabs]',
  slugKey: 'category',
  orderKey: 'categoryOrder',
}

export const buildCategoryListings = (selectors: CategoryListingSelectors) => {
  document.querySelectorAll<HTMLElement>(selectors.root).forEach((root) => {
    const list = root.matches('.w-dyn-items') ? root : root.querySelector<HTMLElement>('.w-dyn-items')
    if (!list) return

    const items = [...list.querySelectorAll<HTMLElement>(`:scope > ${selectors.item}`)]
    const categoryOrder = (item: HTMLElement) => {
      const order = Number.parseFloat(item.dataset[selectors.orderKey] ?? '')
      return Number.isNaN(order) ? Number.POSITIVE_INFINITY : order
    }
    // Array.prototype.sort is stable, so item Order survives inside each category.
    const sortedItems = [...items].sort((first, second) => categoryOrder(first) - categoryOrder(second))
    sortedItems.forEach((item) => list.append(item))

    const categories: { slug: string; name: string }[] = []
    sortedItems.forEach((item) => {
      const heading = item.querySelector<HTMLElement>(selectors.heading)
      const slug = item.dataset[selectors.slugKey]?.trim()
      if (!heading) return
      if (!slug || categories.some((category) => category.slug === slug)) {
        heading.remove()
        return
      }
      heading.id = slug
      categories.push({ slug, name: heading.textContent?.trim() ?? slug })
    })

    const tabBar = root.querySelector<HTMLElement>(selectors.tabs) ?? document.querySelector<HTMLElement>(selectors.tabs)
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
  })
}

export const categoryListing = () => buildCategoryListings(genericSelectors)
