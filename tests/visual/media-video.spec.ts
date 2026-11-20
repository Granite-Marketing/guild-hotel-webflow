import { expect, test } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * mediaVideo: any media frame with data-video-link gets a muted, looping,
 * playsinline video covering it, image kept underneath. Works offline: it
 * checks the video element's attributes and box, not playback.
 */

const FIXTURE_PATH = '/tests/visual/fixtures/media-video.html'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/media-video.ts'],
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

const inspect = (frameId: string) => {
  const frame = document.getElementById(frameId)!
  const image = frame.querySelector('img')!
  const video = frame.querySelector('video')
  const imageBox = image.getBoundingClientRect()
  const videoBox = video?.getBoundingClientRect()
  return {
    hasImage: !!image && image.isConnected,
    videoCount: frame.querySelectorAll('video').length,
    muted: video?.muted,
    loop: video?.loop,
    playsInline: video?.playsInline,
    autoplay: video?.autoplay,
    src: video?.src ?? '',
    objectFit: video ? getComputedStyle(video).objectFit : '',
    imageObjectFit: getComputedStyle(image).objectFit,
    objectPosition: video ? getComputedStyle(video).objectPosition : '',
    imageObjectPosition: getComputedStyle(image).objectPosition,
    sameBox:
      !!videoBox &&
      Math.abs(videoBox.width - imageBox.width) < 1 &&
      Math.abs(videoBox.height - imageBox.height) < 1 &&
      Math.abs(videoBox.left - imageBox.left) < 1 &&
      Math.abs(videoBox.top - imageBox.top) < 1,
  }
}

for (const width of [390, 1440]) {
  test.describe(`at ${width}`, () => {
    test.use({ viewport: { width, height: 900 } })

    test('video covers the frame with the image box and object-fit', async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`)
      const state = await page.evaluate(inspect, 'plain')
      expect(state.hasImage).toBe(true)
      expect(state.videoCount).toBe(1)
      expect(state.src).toContain('placeholder-video.mp4')
      expect([state.muted, state.loop, state.playsInline, state.autoplay]).toEqual([true, true, true, true])
      expect(state.sameBox).toBe(true)
      expect(state.objectFit).toBe(state.imageObjectFit)
      expect(state.objectPosition).toBe(state.imageObjectPosition)
    })

    test('frames in list items show their video, empty ones do not', async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`)
      for (const id of ['item-1', 'item-2']) {
        const state = await page.evaluate(inspect, id)
        expect(state.videoCount).toBe(1)
        expect(state.sameBox).toBe(true)
      }
      expect((await page.evaluate(inspect, 'item-empty')).videoCount).toBe(0)
    })

    test('hero frame accepts the link and the image still scales on load', async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`)
      const hero = await page.evaluate(() => {
        const frame = document.getElementById('hero')!
        const image = frame.querySelector('img')!
        return {
          videoCount: frame.querySelectorAll('video').length,
          imageAnimations: image.getAnimations().length,
          firstMedia: frame.querySelector('img, video')?.tagName,
        }
      })
      expect(hero.videoCount).toBe(1)
      expect(hero.firstMedia).toBe('IMG')
      expect(hero.imageAnimations).toBeGreaterThan(0)
    })

    test('empty or blank link keeps the image untouched', async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`)
      const state = await page.evaluate(inspect, 'blank')
      expect(state.hasImage).toBe(true)
      expect(state.videoCount).toBe(0)
    })

    test('reduced motion keeps the image', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(`${origin}${FIXTURE_PATH}`)
      for (const id of ['plain', 'item-1', 'hero']) {
        const state = await page.evaluate(inspect, id)
        expect(state.hasImage).toBe(true)
        expect(state.videoCount).toBe(0)
      }
    })

    test('legacy section-video markup still produces a visible video', async ({ page }) => {
      await page.goto(`${origin}${FIXTURE_PATH}`)
      const state = await page.evaluate(inspect, 'legacy-frame')
      expect(state.videoCount).toBe(1)
      expect([state.muted, state.loop, state.playsInline]).toEqual([true, true, true])
      expect(state.sameBox).toBe(true)
    })
  })
}
