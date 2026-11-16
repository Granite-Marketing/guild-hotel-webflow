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
