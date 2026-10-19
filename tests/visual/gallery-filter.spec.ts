import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'

/**
 * A05 gallery filter: builds tests/visual/fixtures/gallery-filter.{html,ts}
 * the same way `pnpm dev` does, serves it from a fake origin, and checks that
 * each tag click reaches the filtered end state and that an Arts piece opens
 * its detail modal. GSAP and ScrollTrigger load from jsDelivr, as on the site.
 */

const FIXTURE_ORIGIN = 'http://fixture.test'
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
}

let buildDirectory = ''

test.beforeAll(async () => {
  buildDirectory = mkdtempSync(join(tmpdir(), 'gallery-filter-'))
  await esbuild.build({
    bundle: true,
    entryPoints: [
      'tests/visual/fixtures/gallery-filter.html',
      'tests/visual/fixtures/gallery-filter.ts',
    ],
    outdir: buildDirectory,
    target: 'esnext',
    loader: { '.html': 'copy', '.webp': 'file' },
    assetNames: 'assets/[name]-[hash]',
    logLevel: 'error',
  })
})

const openFixture = async (page: Page) => {
  await page.route(`${FIXTURE_ORIGIN}/**`, (route) => {
    const path = new URL(route.request().url()).pathname
    route.fulfill({
      body: readFileSync(join(buildDirectory, path)),
      contentType: CONTENT_TYPES[extname(path)] ?? 'application/octet-stream',
    })
  })
  await page.goto(`${FIXTURE_ORIGIN}/gallery-filter.html`, { waitUntil: 'networkidle' })
  await page.locator('[data-gallery-filter]').scrollIntoViewIfNeeded()
}

/** Categories of visible items, and whether every visible item is fully shown. */
const visibleItems = (page: Page) =>
  page.locator('[data-gallery-filter-item]').evaluateAll((items) =>
    items
      .filter((item) => !item.classList.contains('hide'))
      .map((item) => ({
        categories: (item.getAttribute('data-gallery-filter-item') ?? '').toLowerCase(),
        opacity: getComputedStyle(item).opacity,
        visibility: getComputedStyle(item).visibility,
      })),
  )

const expectEndState = async (page: Page, category: string, count: number) => {
  await expect
    .poll(async () => {
      const items = await visibleItems(page)
      const settled = items.every((item) => item.opacity === '1' && item.visibility === 'visible')
      const allMatch = items.every(
        (item) => category === 'all' || item.categories.includes(category),
      )
      return { count: items.length, settled, allMatch }
    })
    .toEqual({ count, settled: true, allMatch: true })
}

const tag = (page: Page, category: string) =>
  page.locator(`[data-gallery-filter-tag="${category}"]`)

test('gallery filter: tag click reaches the filtered end state', async ({ page }) => {
  await openFixture(page)
  await expectEndState(page, 'all', 12)
  await expect(tag(page, 'all')).toHaveAttribute('aria-pressed', 'true')

  await tag(page, 'dining').click()
  await expectEndState(page, 'dining', 3)
  await expect(tag(page, 'dining')).toHaveClass(/is-active/)
  await expect(tag(page, 'all')).toHaveAttribute('aria-pressed', 'false')

  // Quick successive clicks settle on the last tag.
  await tag(page, 'rooms').click()
  await tag(page, 'design').click()
  await expectEndState(page, 'design', 3)

  await tag(page, 'events').click()
  await expectEndState(page, 'events', 0)
  await expect(page.locator('[data-gallery-filter-empty]')).toHaveClass(/is-active/)

  await tag(page, 'all').click()
  await expectEndState(page, 'all', 12)
  await expect(page.locator('[data-gallery-filter-empty]')).not.toHaveClass(/is-active/)
  await page.screenshot({ path: 'test-results/gallery-filter-end.png' })
})

test('gallery filter: reduced motion shows the end state with no animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openFixture(page)

  await tag(page, 'wellness').click()
  const items = await visibleItems(page)
  expect(items).toHaveLength(2)
  expect(items.every((item) => item.opacity === '1' && item.categories.includes('wellness'))).toBe(
    true,
  )
})

test('arts: clicking a piece opens its detail modal', async ({ page }) => {
  await openFixture(page)
  const piece = page.locator('[data-modal-open="oceano"]').first()
  await piece.scrollIntoViewIfNeeded()
  await piece.click()

  const modal = page.locator('#oceano')
  await expect(modal).toHaveClass(/is-open/)
  await expect(modal).toHaveAttribute('aria-hidden', 'false')
  await expect(modal).toBeVisible()
  await page.screenshot({ path: 'test-results/arts-modal-open.png' })

  await page.keyboard.press('Escape')
  await expect(modal).not.toHaveClass(/is-open/)
  await expect(piece).toBeFocused()
})
