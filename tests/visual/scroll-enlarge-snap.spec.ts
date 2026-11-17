import { expect, test, type Page } from '@playwright/test'

import { serveFixtures } from '../../bin/fixtures.js'

/**
 * scrollEnlargeSnap (#257): the frame opens on scroll, then the section locks
 * and each gesture moves exactly one panel; the page releases at both ends.
 * Runs without Webflow: the fixture server bundles the entry in memory.
 * GSAP and Lenis load from jsDelivr, so this needs network.
 */

const FIXTURE = '/scroll-enlarge-snap.html'
const SETTLE_MS = 1800
/** Open step plus the 0.5-step hold. */
const TOTAL_STEPS = 1.5

interface PinState {
  start: number
  end: number
  mediaWidth: number
  visibleWidth: number
  mediaHeight: number
  stageWidth: number
  stageHeight: number
  activeItem: number
  activeTab: number
  itemOpacity: number[]
}

let fixtures: { origin: string; stop: () => Promise<void> }

test.beforeAll(async () => {
  fixtures = await serveFixtures(3102)
})

test.afterAll(async () => {
  await fixtures.stop()
})

const open = async (page: Page) => {
  await page.goto(`${fixtures.origin}${FIXTURE}`)
  await page.waitForFunction(() => window.fixtureReady === true)
}

/** Reads the pin range and current state of the section with `id`. */
const readState = (page: Page, id: string) =>
  page.evaluate((sectionId): PinState => {
    const root = document.getElementById(sectionId) as HTMLElement
    const stage = root.querySelector<HTMLElement>('[data-scroll-enlarge-snap-stage]') ?? root
    const media = root.querySelector<HTMLElement>('[data-scroll-enlarge-snap-media]') as HTMLElement
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-item]'))
    const tabs = Array.from(root.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-tab]'))
    const trigger = ScrollTrigger.getAll().find((candidate) => candidate.pin === stage)
    const style = getComputedStyle(stage)
    const mediaRect = media.getBoundingClientRect()
    // The media is full size from the start; its clip-path polygon shows
    // the visible frame (point 7 is the left inset, point 3 the right).
    const visibleWidthOf = (element: HTMLElement, width: number) => {
      const points = (element.style.clipPath.match(/^polygon\((.*)\)$/)?.[1] ?? '').split(',')
      if (points.length < 8) return width
      const left = parseFloat(points[6]) || 0
      const right = Number(points[2].match(/100% - ([\d.]+)px/)?.[1] ?? 0)
      return width - left - right
    }
    return {
      start: trigger?.start ?? -1,
      end: trigger?.end ?? -1,
      mediaWidth: mediaRect.width,
      visibleWidth: visibleWidthOf(media, mediaRect.width),
      mediaHeight: mediaRect.height,
      stageWidth: stage.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      stageHeight: stage.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
      activeItem: items.findIndex((item) => item.classList.contains('is-active')),
      activeTab: tabs.findIndex((tab) => tab.getAttribute('aria-current') === 'true'),
      itemOpacity: items.map((item) => Number(getComputedStyle(item).opacity)),
    }
  }, id)

const scrollToProgress = async (page: Page, id: string, progress: number) => {
  const { start, end } = await readState(page, id)
  await page.evaluate((top) => window.scrollTo(0, top), start + (end - start) * progress)
  await page.waitForTimeout(SETTLE_MS)
}

/** Scrolls to the lock point (frame fully open) and waits for the lock. */
const lockSection = async (page: Page, id: string) => {
  await scrollToProgress(page, id, 1 / TOTAL_STEPS)
  expect(await isLocked(page)).toBe(true)
}

const isLocked = (page: Page) =>
  page.evaluate(() => document.documentElement.classList.contains('lenis-stopped'))

/** One trackpad flick: a burst of wheel events with inertia, then a settle. */
const flick = async (page: Page, direction: 1 | -1, settle = SETTLE_MS) => {
  await page.mouse.move(400, 400)
  for (let event = 0; event < 25; event++) {
    await page.mouse.wheel(0, direction * Math.max(4, 80 - event * 3))
    await page.waitForTimeout(16)
  }
  await page.waitForTimeout(settle)
}

/** yPercent of every split word in the nth item's content. */
const readWordOffsets = (page: Page, id: string, itemIndex: number) =>
  page.evaluate(
    ({ sectionId, index }) => {
      const root = document.getElementById(sectionId) as HTMLElement
      const item = root.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-item]')[index]
      const words = Array.from(
        item.querySelectorAll<HTMLElement>('[data-scroll-enlarge-snap-content] p > * > *'),
      )
      return words.map((word) => Number(gsap.getProperty(word, 'yPercent')))
    },
    { sectionId: id, index: itemIndex },
  )

test.describe('scrollEnlargeSnap', () => {
  test('starts as a smaller frame with a short pin', async ({ page }) => {
    await open(page)
    const state = await readState(page, 'wellness')
    expect(state.visibleWidth).toBeLessThan(state.stageWidth * 0.85)
    // Open step plus hold: 1.5 stage heights, not one screen per panel.
    expect(state.end - state.start).toBeLessThan(state.stageHeight * 1.6 + 60)
    expect(state.activeItem).toBe(0)
    expect(state.activeTab).toBe(0)
  })

  test('opens fully, locks, and each flick moves exactly one panel', async ({ page }) => {
    await open(page)
    await lockSection(page, 'wellness')
    let state = await readState(page, 'wellness')
    expect(Math.abs(state.visibleWidth - state.stageWidth)).toBeLessThan(2)
    expect(Math.abs(state.mediaHeight - state.stageHeight)).toBeLessThan(2)

    for (const expected of [1, 2, 3]) {
      await flick(page, 1)
      state = await readState(page, 'wellness')
      expect(state.activeItem).toBe(expected)
      expect(state.activeTab).toBe(expected)
      expect(state.itemOpacity.map((opacity, index) => (index === expected ? 1 : 0))).toEqual(state.itemOpacity)
      expect(await isLocked(page)).toBe(true)
    }
    await flick(page, -1)
    expect((await readState(page, 'wellness')).activeItem).toBe(2)
  })

  test('down on the last panel releases the page', async ({ page }) => {
    await open(page)
    await lockSection(page, 'wellness')
    await page.locator('#wellness [data-scroll-enlarge-snap-tab]').nth(3).click()
    await page.waitForTimeout(SETTLE_MS * 1.5)
    await flick(page, 1)
    const state = await readState(page, 'wellness')
    expect(await isLocked(page)).toBe(false)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(state.end)
  })

  test('up on the first panel releases the page', async ({ page }) => {
    await open(page)
    await lockSection(page, 'wellness')
    const { start, end } = await readState(page, 'wellness')
    await flick(page, -1)
    expect(await isLocked(page)).toBe(false)
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(start + (end - start) / TOTAL_STEPS - 2)
  })

  test('tab click plays an eased move to that panel', async ({ page }) => {
    await open(page)
    await lockSection(page, 'wellness')
    await page.locator('#wellness [data-scroll-enlarge-snap-tab]').nth(2).click()
    // Mid-move: the tab is already highlighted, the panel not yet fully in.
    await page.waitForTimeout(300)
    let state = await readState(page, 'wellness')
    expect(state.activeTab).toBe(2)
    const clip = await page.evaluate(
      () => getComputedStyle(document.querySelectorAll('#wellness [data-scroll-enlarge-snap-item]')[2]).clipPath,
    )
    expect(clip).not.toBe('inset(0%)')
    await page.waitForTimeout(SETTLE_MS)
    state = await readState(page, 'wellness')
    expect(state.activeItem).toBe(2)
    expect(state.itemOpacity[2]).toBe(1)
  })

  test('arrow keys move one panel while locked', async ({ page }) => {
    await open(page)
    await lockSection(page, 'wellness')
    await page.keyboard.press('ArrowDown')
    await page.waitForTimeout(SETTLE_MS)
    expect((await readState(page, 'wellness')).activeItem).toBe(1)
  })

  test('section without tabs or stage element reaches its last panel', async ({ page }) => {
    await open(page)
    await lockSection(page, 'home')
    for (let panel = 0; panel < 4; panel++) await flick(page, 1)
    const state = await readState(page, 'home')
    expect(Math.abs(state.visibleWidth - state.stageWidth)).toBeLessThan(2)
    expect(state.activeItem).toBe(4)
    expect(state.itemOpacity[4]).toBe(1)
  })

  test('panel content masks in after its wipe and reverses on leave', async ({ page }) => {
    await open(page)
    expect((await readWordOffsets(page, 'wellness', 1)).every((offset) => offset === 110)).toBe(true)
    await lockSection(page, 'wellness')
    await flick(page, 1)
    const shown = await readWordOffsets(page, 'wellness', 1)
    expect(shown.length).toBeGreaterThan(0)
    expect(shown.every((offset) => Math.abs(offset) < 1)).toBe(true)

    await flick(page, -1)
    expect((await readWordOffsets(page, 'wellness', 1)).every((offset) => offset === 110)).toBe(true)
  })

  test('single-item section opens, holds, then releases on the next flick', async ({ page }) => {
    await open(page)
    const initial = await readState(page, 'arts')
    expect(initial.visibleWidth).toBeLessThan(initial.stageWidth * 0.85)

    await lockSection(page, 'arts')
    const state = await readState(page, 'arts')
    expect(Math.abs(state.visibleWidth - state.stageWidth)).toBeLessThan(2)
    const words = await readWordOffsets(page, 'arts', 0)
    expect(words.length).toBeGreaterThan(0)
    expect(words.every((offset) => Math.abs(offset) < 1)).toBe(true)

    await flick(page, 1)
    expect(await isLocked(page)).toBe(false)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(state.end)
  })

  test('reduced motion: full frame and instant panel swaps', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page)
    const initial = await readState(page, 'wellness')
    expect(Math.abs(initial.visibleWidth - initial.stageWidth)).toBeLessThan(2)
    expect(initial.itemOpacity).toEqual([1, 0, 0, 0])

    await page.evaluate((top) => window.scrollTo(0, top), initial.start + 2)
    await page.waitForTimeout(300)
    expect(await isLocked(page)).toBe(true)
    await flick(page, 1, 50)
    const state = await readState(page, 'wellness')
    expect(state.itemOpacity).toEqual([0, 1, 0, 0])
    expect(state.activeTab).toBe(1)
  })
})
