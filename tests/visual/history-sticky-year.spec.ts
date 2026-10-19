import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Local check for src/utils/historyStickyYear.ts against
 * fixtures/history-sticky-year.html. The fixture entry is bundled in memory
 * and served from a fake origin, so no dev server or Webflow site is needed.
 * GSAP loads from jsDelivr, as on the live site.
 */

const ORIGIN = 'http://fixture.test'
const REPO_ROOT = process.cwd()
const FIXTURES = join(REPO_ROOT, 'tests/visual/fixtures')

let bundle = ''

test.beforeAll(async () => {
  const result = await esbuild.build({
    entryPoints: [join(FIXTURES, 'history-sticky-year.entry.ts')],
    bundle: true,
    write: false,
    format: 'iife',
    target: 'es2020',
  })
  bundle = result.outputFiles[0].text
})

const openFixture = async (page: Page) => {
  await page.route(`${ORIGIN}/**`, async (route) => {
    const path = new URL(route.request().url()).pathname
    if (path === '/') {
      return route.fulfill({
        contentType: 'text/html',
        body: readFileSync(join(FIXTURES, 'history-sticky-year.html'), 'utf8'),
      })
    }
    if (path === '/history-sticky-year.js') {
      return route.fulfill({ contentType: 'text/javascript', body: bundle })
    }
    if (path.startsWith('/figma/')) {
      return route.fulfill({
        contentType: 'image/webp',
        body: readFileSync(join(REPO_ROOT, path)),
      })
    }
    return route.fulfill({ status: 404 })
  })
  await page.goto(`${ORIGIN}/`, { waitUntil: 'load' })
  await page.waitForFunction(() => typeof window.ScrollTrigger !== 'undefined')
}

const scrollTo = async (page: Page, y: number) => {
  await page.evaluate((target) => window.scrollTo(0, target), y)
  // Let ScrollTrigger update and the 0.5s label swap finish.
  await page.waitForTimeout(700)
}

const itemTop = (page: Page, selector: string) =>
  page.evaluate(
    (s) => document.querySelector<HTMLElement>(s)!.getBoundingClientRect().top + window.scrollY,
    selector,
  )

const yearItem = (year: string) => `[data-history-sticky-year-item="${year}"]`

const centreOf = async (page: Page, selector: string) =>
  page.$$eval(selector, (elements) =>
    elements.map((element) => {
      const rect = element.getBoundingClientRect()
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width }
    }),
  )

const collapseStart = (page: Page) =>
  page.evaluate(() => {
    const root = document.querySelector<HTMLElement>('[data-history-collapse]')!
    const spacer = root.parentElement!
    return spacer.getBoundingClientRect().top + window.scrollY
  })

test.describe('historyStickyYear', () => {
  test('sticky year label follows the milestone in view', async ({ page }) => {
    await openFixture(page)
    const label = page.locator('[data-history-sticky-year-text]')
    const viewportHalf = 450

    for (const year of ['1924', '1924-1970', '2019', '2026']) {
      const top = await itemTop(page, yearItem(year))
      await scrollTo(page, top - viewportHalf + 200)
      await expect(label).toHaveText(year)
      await expect(page.locator(yearItem(year))).toHaveClass(/is-active/)
    }

    // Scrolling back up restores the earlier year.
    const firstTop = await itemTop(page, yearItem('1924'))
    await scrollTo(page, firstTop - viewportHalf + 200)
    await expect(label).toHaveText('1924')
    await expect(label).toHaveCSS('opacity', '1')
  })

  test('gallery collapses, fills the screen, then returns to the grid', async ({ page }) => {
    await openFixture(page)
    const start = await collapseStart(page)
    const viewport = page.viewportSize()!
    const pinLength = 3 * viewport.height
    const items = '[data-history-collapse-item]'

    // Timeline position 1 of 3.6: stacked into one image at the centre.
    await scrollTo(page, start + pinLength * (1 / 3.6))
    const stacked = await centreOf(page, items)
    for (const centre of stacked) {
      expect(Math.abs(centre.x - viewport.width / 2)).toBeLessThan(2)
      expect(Math.abs(centre.y - viewport.height / 2)).toBeLessThan(2)
    }

    // Timeline position 2.2: full screen, heading and caption hidden.
    await scrollTo(page, start + pinLength * (2.2 / 3.6))
    const top = await page.$eval(`${items}:last-child`, (element) => {
      const rect = element.getBoundingClientRect()
      return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }
    })
    expect(top.left).toBeLessThanOrEqual(1)
    expect(top.top).toBeLessThanOrEqual(1)
    expect(top.right).toBeGreaterThanOrEqual(viewport.width - 1)
    expect(top.bottom).toBeGreaterThanOrEqual(viewport.height - 1)
    await expect(page.locator('[data-history-collapse-fade]').first()).toHaveCSS('visibility', 'hidden')

    // Past the pin: end state is the untransformed gallery grid.
    await scrollTo(page, start + pinLength + 50)
    const transforms = await page.$$eval(items, (elements) =>
      elements.map((element) => getComputedStyle(element).transform),
    )
    for (const transform of transforms) {
      expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(transform)
    }
    for (const fade of await page.locator('[data-history-collapse-fade]').all()) {
      await expect(fade).toHaveCSS('opacity', '1')
    }
  })

  test('reduced motion shows the end state with no animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await openFixture(page)

    // No pin and no transforms on the gallery.
    const pinned = await page.$eval('[data-history-collapse]', (root) =>
      root.parentElement!.classList.contains('pin-spacer'),
    )
    expect(pinned).toBe(false)
    await page.locator('[data-history-collapse]').scrollIntoViewIfNeeded()
    const transforms = await page.$$eval('[data-history-collapse-item]', (elements) =>
      elements.map((element) => getComputedStyle(element).transform),
    )
    for (const transform of transforms) expect(transform).toBe('none')

    // The year still updates, swapped instantly.
    const top = await itemTop(page, yearItem('2026'))
    await page.evaluate((target) => window.scrollTo(0, target), top - 250)
    await page.waitForTimeout(100)
    await expect(page.locator('[data-history-sticky-year-text]')).toHaveText('2026')
  })
})

declare global {
  interface Window {
    ScrollTrigger: unknown
  }
}
