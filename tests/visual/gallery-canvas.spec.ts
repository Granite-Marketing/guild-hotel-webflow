import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { extname, join } from 'node:path'

/**
 * Gallery canvas: builds tests/visual/fixtures/gallery-canvas.{html,ts} the
 * way `pnpm dev` does, serves it from a fake origin and checks layout, mouse
 * pan, wheel behaviour, zoom steps, filter relayout, drag-vs-click on Arts
 * tiles and the touch joystick. GSAP and its plugins load from jsDelivr.
 */

const FIXTURE_ORIGIN = 'http://fixture.test'
const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
}

let buildDirectory = ''

test.beforeAll(async () => {
  buildDirectory = mkdtempSync(join(tmpdir(), 'gallery-canvas-'))
  await esbuild.build({
    bundle: true,
    entryPoints: [
      'tests/visual/fixtures/gallery-canvas.html',
      'tests/visual/fixtures/gallery-canvas.ts',
    ],
    outdir: buildDirectory,
    target: 'esnext',
    loader: { '.html': 'copy' },
    logLevel: 'error',
  })
})

const openFixture = async (page: Page, sectionId = 'gallery') => {
  await page.route(`${FIXTURE_ORIGIN}/**`, (route) => {
    const path = new URL(route.request().url()).pathname
    route.fulfill({
      body: readFileSync(join(buildDirectory, path)),
      contentType: CONTENT_TYPES[extname(path)] ?? 'application/octet-stream',
    })
  })
  await page.goto(`${FIXTURE_ORIGIN}/gallery-canvas.html`, { waitUntil: 'networkidle' })
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), sectionId)
  return page.locator(`#${sectionId}`)
}

const boardState = (page: Page, sectionId: string) =>
  page.evaluate((id) => {
    const board = document.querySelector<HTMLElement>(`#${id} .gallery-all_grid`)!
    const windowElement = board.parentElement!
    return {
      x: Number(gsap.getProperty(board, 'x')),
      y: Number(gsap.getProperty(board, 'y')),
      scale: Number(gsap.getProperty(board, 'scale')),
      boardWidth: board.offsetWidth,
      boardHeight: board.offsetHeight,
      windowWidth: windowElement.clientWidth,
      windowHeight: windowElement.clientHeight,
    }
  }, sectionId)

const settle = (page: Page) => page.waitForTimeout(900)

test('layout: brick rows at natural aspect, board sized by photo count, centred', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openFixture(page)
  const state = await boardState(page, 'gallery')
  expect(state.windowHeight).toBe(900)
  // 24 photos: wider than the 1.5-window minimum, and about the window's shape.
  expect(state.boardWidth).toBeGreaterThanOrEqual(state.windowWidth * 1.5)
  const boardShape = state.boardWidth / state.boardHeight
  expect(boardShape).toBeGreaterThan((state.windowWidth / state.windowHeight) * 0.6)
  expect(boardShape).toBeLessThan((state.windowWidth / state.windowHeight) * 1.6)
  expect(state.x).toBeCloseTo((state.windowWidth - state.boardWidth) / 2, 0)

  const rows = await page.locator('#gallery .gallery-all_item').evaluateAll((items) =>
    items.map((item) => {
      const image = item.querySelector('img')!
      return {
        height: (item as HTMLElement).offsetHeight,
        ratio: (item as HTMLElement).offsetWidth / (item as HTMLElement).offsetHeight,
        natural: image.naturalWidth / image.naturalHeight,
      }
    }),
  )
  expect(rows.every((row) => row.height === 414)).toBe(true)
  // Rows stretch flush, so each photo stays within 15% of its natural shape.
  expect(rows.every((row) => Math.abs(row.ratio / row.natural - 1) < 0.15)).toBe(true)
  await page.screenshot({ path: 'test-results/gallery-canvas-1440.png' })
})

test('mouse: drag pans the board, plain wheel scrolls the page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openFixture(page)
  const before = await boardState(page, 'gallery')

  await page.mouse.move(700, 450)
  await page.mouse.down()
  await page.mouse.move(500, 350, { steps: 10 })
  await page.mouse.up()
  await settle(page)
  const afterDrag = await boardState(page, 'gallery')
  expect(afterDrag.x).toBeLessThan(before.x - 100)

  const scrollBefore = await page.evaluate(() => window.scrollY)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(300)
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore)
  expect((await boardState(page, 'gallery')).scale).toBe(1)
})

test('zoom: buttons step and clamp at the ends; ctrl+wheel does not zoom the board', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openFixture(page)
  await page.mouse.move(720, 450)
  await page.keyboard.down('Control')
  await page.mouse.wheel(0, -40)
  await page.keyboard.up('Control')
  await settle(page)
  expect((await boardState(page, 'gallery')).scale).toBe(1)

  await page.locator('#gallery [data-gallery-canvas-zoom="in"]').click()
  await settle(page)
  expect((await boardState(page, 'gallery')).scale).toBeCloseTo(1.6)
  await expect(page.locator('#gallery [data-gallery-canvas-zoom="in"]')).toHaveClass(/is-active/)

  const zoomOut = page.locator('#gallery [data-gallery-canvas-zoom="out"]')
  await zoomOut.click()
  await settle(page)
  await zoomOut.click()
  await settle(page)
  const zoomedOut = await boardState(page, 'gallery')
  expect(zoomedOut.scale).toBeCloseTo(0.5)
  await expect(zoomOut).toHaveClass(/is-active/)
  await expect(page.locator('#gallery [data-gallery-canvas-zoom="reset"]')).not.toHaveClass(/is-active/)
  // At 0.5 the whole board fits the window.
  expect(zoomedOut.boardWidth * 0.5).toBeLessThanOrEqual(zoomedOut.windowWidth)
  await page.screenshot({ path: 'test-results/gallery-canvas-zoomed-out.png' })
})

test('filter: board re-lays out and returns to centre at Normal', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openFixture(page)
  await page.locator('#gallery [data-gallery-canvas-zoom="in"]').click()
  await page.locator('#gallery [data-gallery-filter-tag="dining"]').click()
  await page.waitForTimeout(1500)
  const state = await boardState(page, 'gallery')
  expect(state.scale).toBe(1)
  expect(await page.locator('#gallery .gallery-all_item:not(.hide)').count()).toBeLessThan(24)
  expect(state.x).toBeCloseTo((state.windowWidth - state.boardWidth) / 2, 0)
  expect(state.y).toBeCloseTo((state.windowHeight - state.boardHeight) / 2, 0)
  await expect(page.locator('#gallery [data-gallery-canvas-zoom="reset"]')).toHaveClass(/is-active/)
})

test('arts: a drag released on a tile does not open it, a click does', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await openFixture(page, 'arts')
  const tile = page.locator('#arts .gallery-all_link').nth(1)
  const box = (await tile.boundingBox())!
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 - 80, box.y + box.height / 2, { steps: 8 })
  await page.mouse.up()
  await page.waitForTimeout(200)
  await expect(page.locator('#art-1')).not.toHaveClass(/is-open/)

  await settle(page)
  await tile.click()
  await expect(page.locator('#art-1')).toHaveClass(/is-open/)
})

test.describe('touch', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })

  test('joystick moves the board; the board does not capture swipes', async ({ page }) => {
    await openFixture(page)
    const joystick = page.locator('#gallery .gallery-all_joystick')
    await expect(joystick).toHaveClass(/is-active/)
    const before = await boardState(page, 'gallery')

    // Real touch input through CDP: press the centre, push right, hold, lift.
    const box = (await joystick.boundingBox())!
    const centreX = box.x + box.width / 2
    const centreY = box.y + box.height / 2
    const cdp = await page.context().newCDPSession(page)
    const touch = (type: string, x: number, y: number) =>
      cdp.send('Input.dispatchTouchEvent', {
        type,
        touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }],
      })
    await touch('touchStart', centreX, centreY)
    await touch('touchMove', centreX + box.width, centreY)
    await page.waitForTimeout(800)
    await touch('touchEnd', centreX + box.width, centreY)
    const after = await boardState(page, 'gallery')
    // Full deflection right for 0.5s reaches the board's right edge.
    expect(after.x).toBeCloseTo(after.windowWidth - after.boardWidth, 0)
    expect(after.x).toBeLessThan(before.x)

    const touchAction = await page.evaluate(
      () => getComputedStyle(document.querySelector('#gallery .gallery-all_grid')!).touchAction,
    )
    expect(touchAction).toBe('auto')
    await page.screenshot({ path: 'test-results/gallery-canvas-390.png' })
  })
})
