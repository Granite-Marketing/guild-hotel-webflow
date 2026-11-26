import { expect, test, type Page } from '@playwright/test'

import { serveFixtures } from '../../bin/fixtures.js'

/**
 * #428: a hexagon scroll mask panel whose image frame carries data-video-link
 * shows a video covering the frame, and the video settles from the same
 * start size to normal size with its image when the panel moves in. Blank
 * and broken links keep today's image-only panel. GSAP and Lenis load from
 * jsDelivr, so this needs network; the video file itself is never played.
 */

const FIXTURE = '/scroll-enlarge-snap-video.html'
const SETTLE_MS = 1800
/** Open step plus the 0.5-step hold. */
const TOTAL_STEPS = 1.5
const START_SCALE = 1.2

interface PanelState {
  frameScale: number
  imageScale: number
  videoCount: number
  /** Video box matches the image box (both scaled the same). */
  videoOnImage: boolean
  /** Rendered image width over the panel width: the visible settle size. */
  imageToPanel: number
}

let fixtures: { origin: string; stop: () => Promise<void> }

test.beforeAll(async () => {
  fixtures = await serveFixtures(3103)
})

test.afterAll(async () => {
  await fixtures.stop()
})

const open = async (page: Page) => {
  await page.goto(`${fixtures.origin}${FIXTURE}`)
  await page.waitForFunction(() => window.fixtureReady === true)
}

const readPanel = (page: Page, index: number) =>
  page.evaluate((panelIndex): PanelState => {
    const item = document.querySelectorAll<HTMLElement>('#venues [data-scroll-enlarge-snap-item]')[panelIndex]
    const frame = item.querySelector('figure') as HTMLElement
    const image = item.querySelector('img') as HTMLElement
    const video = frame.querySelector('video')
    const imageBox = image.getBoundingClientRect()
    const videoBox = video?.getBoundingClientRect()
    const near = (first: number, second: number) => Math.abs(first - second) < 1
    return {
      frameScale: Number(gsap.getProperty(frame, 'scale')),
      imageScale: Number(gsap.getProperty(image, 'scale')),
      videoCount: frame.querySelectorAll('video, iframe').length,
      videoOnImage:
        !!videoBox &&
        near(videoBox.width, imageBox.width) &&
        near(videoBox.height, imageBox.height) &&
        near(videoBox.left, imageBox.left) &&
        near(videoBox.top, imageBox.top),
      imageToPanel: imageBox.width / item.getBoundingClientRect().width,
    }
  }, index)

const lockSection = async (page: Page) => {
  const { start, end } = await page.evaluate(() => {
    const stage = document.querySelector('#venues [data-scroll-enlarge-snap-stage]')
    const trigger = ScrollTrigger.getAll().find((candidate) => candidate.pin === stage)
    return { start: trigger?.start ?? 0, end: trigger?.end ?? 0 }
  })
  await page.evaluate((top) => window.scrollTo(0, top), start + (end - start) / TOTAL_STEPS)
  await page.waitForTimeout(SETTLE_MS)
  expect(await page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'))).toBe(true)
}

const nextPanel = async (page: Page) => {
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(SETTLE_MS)
}

for (const width of [390, 1440]) {
  test.describe(`at ${width}`, () => {
    test.use({ viewport: { width, height: 900 } })

    // MUTATION: scaling only the image (the code before #428) leaves the
    // video at full size while its image starts at 1.2, so videoOnImage and
    // the 1.2 start size both fail here; seen red before the fix.
    test('a video panel starts at the image start size and its video covers the image', async ({ page }) => {
      await open(page)
      const videoPanel = await readPanel(page, 1)
      expect(videoPanel.videoCount).toBe(1)
      expect(videoPanel.videoOnImage).toBe(true)
      expect(videoPanel.imageToPanel).toBeCloseTo(START_SCALE, 2)

      const imagePanel = await readPanel(page, 2)
      expect(imagePanel.imageToPanel).toBeCloseTo(videoPanel.imageToPanel, 2)
    })

    test('the video settles to normal size with its image', async ({ page }) => {
      await open(page)
      await lockSection(page)
      await nextPanel(page)
      const videoPanel = await readPanel(page, 1)
      expect(videoPanel.frameScale).toBeCloseTo(1, 3)
      expect(videoPanel.imageScale).toBeCloseTo(1, 3)
      expect(videoPanel.imageToPanel).toBeCloseTo(1, 2)
      expect(videoPanel.videoOnImage).toBe(true)
    })

    // MUTATION: settling the frame whenever it has the attribute, ignoring a
    // blank or unplayable link, scales these frames instead; seen red.
    test('blank and broken links keep the image-only panel', async ({ page }) => {
      await open(page)
      for (const index of [2, 3]) {
        const panel = await readPanel(page, index)
        expect(panel.videoCount).toBe(0)
        // Today's move: the image itself starts large, its frame never scales.
        expect(panel.imageScale).toBeCloseTo(START_SCALE, 3)
        expect(panel.frameScale).toBe(1)
      }
    })
  })
}
