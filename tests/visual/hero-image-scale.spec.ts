import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * heroImageScale: the hero photo starts slightly larger and settles to its
 * normal size, never fades, stays inside its frame, and sits still under
 * reduced motion. GSAP loads from jsDelivr, so this needs network.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/hero-image-scale.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/hero-image-scale.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context.dispose()
})

const measure = () => {
  const frame = document.querySelector<HTMLElement>('.hero-fullbleed-centered_figure')!
  const image = document.querySelector<HTMLElement>('.hero-fullbleed-centered_image')!
  const frameBox = frame.getBoundingClientRect()
  const imageBox = image.getBoundingClientRect()
  return {
    overflow: getComputedStyle(frame).overflow,
    opacity: getComputedStyle(image).opacity,
    imageWidth: imageBox.width,
    frameWidth: frameBox.width,
    transform: image.style.transform,
  }
}

test('image starts larger than the frame, clipped by it, and settles to 1 with no fade', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  const start = await page.evaluate(measure)
  expect(start.overflow).toBe('hidden')
  expect(start.imageWidth).toBeGreaterThan(start.frameWidth)
  expect(Number(start.opacity)).toBe(1)

  await page.waitForFunction(() => document.querySelector<HTMLElement>('.hero-fullbleed-centered_image')!.style.transform === '')
  const end = await page.evaluate(measure)
  expect(end.imageWidth).toBeCloseTo(end.frameWidth, 0)
  expect(end.overflow).toBe('hidden')
  expect(Number(end.opacity)).toBe(1)
})

test('opacity never drops below 1 while it scales', async ({ page }) => {
  await page.goto(`${origin}${FIXTURE_PATH}`)
  const lowest = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        const image = document.querySelector<HTMLElement>('.hero-fullbleed-centered_image')!
        let min = 1
        const tick = () => {
          min = Math.min(min, Number(getComputedStyle(image).opacity))
          if (image.style.transform === '') resolve(min)
          else requestAnimationFrame(tick)
        }
        tick()
      }),
  )
  expect(lowest).toBe(1)
})

test('reduced motion shows the photo still at normal size', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${origin}${FIXTURE_PATH}`)
  const state = await page.evaluate(measure)
  expect(state.transform).toBe('')
  expect(state.imageWidth).toBeCloseTo(state.frameWidth, 0)
})
