import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * #181 pressCategories: bundles the module and runs it over a Press list
 * whose items arrive out of category order with one category per heading
 * repeated, as the /press Collection List renders them.
 */

const item = (slug: string, order: number, name: string, title: string) => `
  <div data-press-item data-press-category="${slug}" data-press-category-order="${order}">
    <header data-press-heading id="${slug}"><h2>${name}</h2></header>
    <h3>${title}</h3>
  </div>`

const FIXTURE_HTML = `
  <nav class="tab-pills-intro_tabs">
    <a href="#press" class="tab-pills-intro_tab is-active" aria-current="true">press</a>
    <a href="#design" class="tab-pills-intro_tab">design</a>
    <a href="#community" class="tab-pills-intro_tab">community</a>
  </nav>
  <section data-press-list><div class="w-dyn-items">
    ${item('community', 3, 'Community', 'AD')}
    ${item('press', 1, 'Press', 'NatGeo')}
    ${item('design', 2, 'Design', 'Grasshopper')}
    ${item('press', 1, 'Press', 'Forbes')}
  </div></section>
`

let moduleScript = ''

test.beforeAll(async () => {
  const result = await esbuild.build({
    bundle: true,
    write: false,
    format: 'iife',
    target: 'esnext',
    logLevel: 'error',
    stdin: {
      contents: "import { pressCategories } from './src/utils/pressCategories'\npressCategories()\n",
      resolveDir: process.cwd(),
      loader: 'ts',
    },
  })
  moduleScript = result.outputFiles[0].text
})

test('pressCategories groups items, keeps one heading per category and rebuilds the tabs', async ({ page }) => {
  await page.setContent(FIXTURE_HTML)
  await page.addScriptTag({ content: moduleScript })

  await expect(page.locator('[data-press-item] h3')).toHaveText(['NatGeo', 'Forbes', 'Grasshopper', 'AD'])
  await expect(page.locator('[data-press-heading]')).toHaveText(['Press', 'Design', 'Community'])
  await expect(page.locator('#press')).toHaveCount(1)

  const tabs = page.locator('.tab-pills-intro_tabs a')
  await expect(tabs).toHaveText(['Press', 'Design', 'Community'])
  await expect(tabs.nth(1)).toHaveAttribute('href', '#design')
  await expect(tabs.first()).toHaveClass(/is-active/)
  await expect(tabs.nth(2)).not.toHaveClass(/is-active/)
})

test('pressCategories drops the tab of a category with no items', async ({ page }) => {
  await page.setContent(FIXTURE_HTML.replace(/<div data-press-item data-press-category="community"[\s\S]*?<\/div>/, ''))
  await page.addScriptTag({ content: moduleScript })

  await expect(page.locator('.tab-pills-intro_tabs a')).toHaveText(['Press', 'Design'])
  await expect(page.locator('#community')).toHaveCount(0)
})

/**
 * #318 categoryListing: the same module driven by the generic attributes
 * (Blog, Happenings, Packages). A category added appears, a category
 * emptied disappears, and the tabs match the headings.
 */
const genericItem = (slug: string, order: number, name: string, title: string) => `
  <div data-category-item data-category="${slug}" data-category-order="${order}">
    <header data-category-heading><h2>${name}</h2></header>
    <h3>${title}</h3>
  </div>`

const genericHtml = (items: string) => `
  <nav data-category-tabs>
    <a href="#a" class="tab is-active" aria-current="true">a</a>
  </nav>
  <section data-category-list><div class="w-dyn-items">${items}</div></section>
`

let genericScript = ''

test.beforeAll(async () => {
  const result = await esbuild.build({
    bundle: true,
    write: false,
    format: 'iife',
    target: 'esnext',
    logLevel: 'error',
    stdin: {
      contents: "import { categoryListing } from './src/utils/categoryListing'\ncategoryListing()\n",
      resolveDir: process.cwd(),
      loader: 'ts',
    },
  })
  genericScript = result.outputFiles[0].text
})

for (const width of [390, 1440]) {
  test.describe(`categoryListing at ${width}`, () => {
    test.use({ viewport: { width, height: 900 } })

    test('groups by category, one heading and one tab each, in category order', async ({ page }) => {
      await page.setContent(
        genericHtml(
          genericItem('dining', 3, 'Dining', 'D1') +
            genericItem('culture', 1, 'Culture', 'C1') +
            genericItem('culture', 1, 'Culture', 'C2') +
            genericItem('events', 2, 'Events', 'E1'),
        ),
      )
      await page.addScriptTag({ content: genericScript })

      await expect(page.locator('[data-category-item] h3')).toHaveText(['C1', 'C2', 'E1', 'D1'])
      await expect(page.locator('[data-category-heading]')).toHaveText(['Culture', 'Events', 'Dining'])
      await expect(page.locator('#culture')).toHaveCount(1)
      const tabs = page.locator('[data-category-tabs] a')
      await expect(tabs).toHaveText(['Culture', 'Events', 'Dining'])
      await expect(tabs.nth(2)).toHaveAttribute('href', '#dining')
      await expect(tabs.first()).toHaveClass(/is-active/)
    })

    test('a category added appears and a category emptied disappears', async ({ page }) => {
      const base = genericItem('culture', 1, 'Culture', 'C1') + genericItem('dining', 3, 'Dining', 'D1')
      await page.setContent(genericHtml(base + genericItem('events', 2, 'Events', 'E1')))
      await page.addScriptTag({ content: genericScript })
      await expect(page.locator('[data-category-tabs] a')).toHaveText(['Culture', 'Events', 'Dining'])
      await expect(page.locator('[data-category-heading]')).toHaveText(['Culture', 'Events', 'Dining'])

      // Emptied: the Events category has no items, so it has no heading or tab.
      await page.setContent(genericHtml(base))
      await page.addScriptTag({ content: genericScript })
      await expect(page.locator('[data-category-tabs] a')).toHaveText(['Culture', 'Dining'])
      await expect(page.locator('[data-category-heading]')).toHaveText(['Culture', 'Dining'])
      await expect(page.locator('#events')).toHaveCount(0)
    })
  })
}

test('pressCategories at 390 keeps the same order and alternation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.setContent(FIXTURE_HTML)
  await page.addScriptTag({ content: moduleScript })
  await expect(page.locator('[data-press-item] h3')).toHaveText(['NatGeo', 'Forbes', 'Grasshopper', 'AD'])
  await expect(page.locator('.tab-pills-intro_tabs a')).toHaveText(['Press', 'Design', 'Community'])
})
