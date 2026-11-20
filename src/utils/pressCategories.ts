/**
 * Press Categories (#181): thin wrapper over the shared category listing
 * module (#318) using Press's original attributes, so /press keeps working
 * unchanged.
 *
 *   [data-press-list] [data-press-item] data-press-category / data-press-category-order
 *   [data-press-heading], tabs in .tab-pills-intro_tabs
 *
 * Order: before tabDropdown() and the scroll engine.
 */
import { buildCategoryListings } from './categoryListing'

export const pressCategories = () =>
  buildCategoryListings({
    root: '[data-press-list]',
    item: '[data-press-item]',
    heading: '[data-press-heading]',
    tabs: '.tab-pills-intro_tabs',
    slugKey: 'pressCategory',
    orderKey: 'pressCategoryOrder',
  })
