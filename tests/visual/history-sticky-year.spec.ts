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

    // F19: the label never fades while timeline text passes under it.
    const labelBox = page.locator('[data-history-sticky-year-label]')
    const centreY = page.viewportSize()!.height / 2
    for (const year of ['1924', '1924-1970', '2019', '2026']) {
      const textTop = await page.$eval(
        `${yearItem(year)} .history-timeline_text`,
        (element) => element.getBoundingClientRect().top + window.scrollY + element.getBoundingClientRect().height / 2,
      )
      await scrollTo(page, textTop - centreY)
      await expect(labelBox).toHaveCSS('opacity', '1')
      await expect(labelBox).toHaveCSS('visibility', 'visible')
    }

    // Scrolling back up restores the earlier year.
    const firstTop = await itemTop(page, yearItem('1924'))
    await scrollTo(page, firstTop - viewportHalf + 200)
    await expect(label).toHaveText('1924')
    await expect(label).toHaveCSS('opacity', '1')
  })

  test('mask opens on the same image at card framing, without unmask flicker', async ({ page }) => {
    await openFixture(page)
    const start = await collapseStart(page)
    const viewport = page.viewportSize()!
    const pinLength = 3 * viewport.height
    const total = 2.8
    const at = (time: number) => scrollTo(page, start + pinLength * (time / total))
    const items = '[data-history-collapse-item]'

    // Timeline position 1: stacked into one image at the centre.
    await at(1)
    const stacked = await centreOf(page, items)
    for (const centre of stacked) {
      expect(Math.abs(centre.x - viewport.width / 2)).toBeLessThan(2)
      expect(Math.abs(centre.y - viewport.height / 2)).toBeLessThan(2)
    }

    // Just past 1: the layer is up, framed to the card, and the photo
    // renders at the same size and place as in the card (F20).
    await at(1.06)
    const match = await page.evaluate(() => {
      const card = document.querySelector<HTMLElement>('[data-history-collapse-item]')!
      const cardImage = card.querySelector<HTMLImageElement>('img')!
      const layer = document.querySelector<HTMLElement>('[data-history-collapse-bleed]')!
      const copy = layer.querySelector<HTMLImageElement>('img')!
      const cardRect = card.getBoundingClientRect()
      const cover = Math.max(
        cardRect.width / cardImage.naturalWidth,
        cardRect.height / cardImage.naturalHeight,
      )
      const imageWidth = cardImage.naturalWidth * cover
      const imageHeight = cardImage.naturalHeight * cover
      const copyRect = copy.getBoundingClientRect()
      const layerRect = layer.getBoundingClientRect()
      // Computed clip-path collapses equal sides: inset(top right? bottom? left?).
      const values = (getComputedStyle(layer).clipPath.match(/[\d.]+px/g) ?? []).map(parseFloat)
      const [top = 0, right = top, bottom = top, left = right] = values
      const insets = [top, right, bottom, left]
      return {
        opacity: Number(getComputedStyle(layer).opacity),
        clip: {
          left: layerRect.left + (insets[3] ?? 0),
          top: layerRect.top + (insets[0] ?? 0),
          right: layerRect.right - (insets[1] ?? 0),
          bottom: layerRect.bottom - (insets[2] ?? 0),
        },
        card: { left: cardRect.left, top: cardRect.top, right: cardRect.right, bottom: cardRect.bottom },
        copy: {
          width: copyRect.width,
          height: copyRect.height,
          x: copyRect.left + copyRect.width / 2,
          y: copyRect.top + copyRect.height / 2,
        },
        image: {
          width: imageWidth,
          height: imageHeight,
          x: cardRect.left + cardRect.width / 2,
          y: cardRect.top + cardRect.height / 2,
        },
      }
    })
    expect(match.opacity).toBeGreaterThan(0)
    for (const side of ['left', 'top', 'right', 'bottom'] as const) {
      expect(Math.abs(match.clip[side] - match.card[side])).toBeLessThan(4)
    }
    for (const key of ['x', 'y'] as const) {
      expect(Math.abs(match.copy[key] - match.image[key])).toBeLessThan(2)
    }
    // Width and height drift by the eased scale just past 1, so allow 2%.
    expect(Math.abs(match.copy.width / match.image.width - 1)).toBeLessThan(0.02)
    expect(Math.abs(match.copy.height / match.image.height - 1)).toBeLessThan(0.02)

    // Scrub back and forth over the swap: whenever the layer shows, it is
    // masked (clip-path never "none").
    for (let round = 0; round < 3; round++) {
      for (const progress of [0.5, 0.32, 0.38]) {
        await scrollTo(page, start + pinLength * progress)
        const state = await page.$eval('[data-history-collapse-bleed]', (layer) => {
          const style = getComputedStyle(layer)
          return { opacity: Number(style.opacity), clipPath: style.clipPath }
        })
        if (state.opacity > 0) expect(state.clipPath).not.toBe('none')
      }
    }

    // End of the pin: full bleed, heading and caption hidden.
    await at(total)
    const end = await page.$eval('[data-history-collapse-bleed]', (layer) => {
      const style = getComputedStyle(layer)
      return { opacity: style.opacity, clipPath: style.clipPath }
    })
    expect(end.opacity).toBe('1')
    expect(end.clipPath).toMatch(/^inset\(0px( 0px)*\)$/)
    await expect(page.locator('[data-history-collapse-fade]').first()).toHaveCSS('visibility', 'hidden')
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
