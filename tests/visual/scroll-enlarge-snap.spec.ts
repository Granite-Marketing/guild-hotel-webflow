import { expect, test, type Page } from '@playwright/test'

import { serveFixtures } from '../../bin/fixtures.js'

/**
 * scrollEnlargeSnap reaches its end state on scroll, snaps between panels,
 * follows tab clicks, and shows the end state at once under reduced motion.
 * Runs without Webflow: the fixture server bundles the entry in memory.
 * GSAP and Lenis load from jsDelivr, so this needs network.
 */

const FIXTURE = '/scroll-enlarge-snap.html'
const SETTLE_MS = 1800

interface PinState {
  start: number
  end: number
  mediaWidth: number
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
    return {
      start: trigger?.start ?? -1,
      end: trigger?.end ?? -1,
      mediaWidth: mediaRect.width,
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

test.describe('scrollEnlargeSnap', () => {
  test('starts as a smaller frame', async ({ page }) => {
    await open(page)
    const state = await readState(page, 'wellness')
    expect(state.end).toBeGreaterThan(state.start)
    expect(state.mediaWidth).toBeLessThan(state.stageWidth * 0.85)
    expect(state.activeItem).toBe(0)
    expect(state.activeTab).toBe(0)
  })

  test('enlarges to fill the stage and reaches the last panel', async ({ page }) => {
    await open(page)
    await scrollToProgress(page, 'wellness', 1)
    const state = await readState(page, 'wellness')
    expect(Math.abs(state.mediaWidth - state.stageWidth)).toBeLessThan(2)
    expect(Math.abs(state.mediaHeight - state.stageHeight)).toBeLessThan(2)
    expect(state.activeItem).toBe(3)
    expect(state.activeTab).toBe(3)
    expect(state.itemOpacity[3]).toBe(1)
  })

  test('snaps to the nearest panel when scrolling stops between panels', async ({ page }) => {
    await open(page)
    // Four panels: snap points at 0.25, 0.5, 0.75 and 1. 0.43 is nearest 0.5.
    await scrollToProgress(page, 'wellness', 0.43)
    const state = await readState(page, 'wellness')
    const snappedTop = state.start + (state.end - state.start) * 0.5
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - snappedTop)).toBeLessThan(4)
    expect(state.activeItem).toBe(1)
  })

  test('tab click moves to that panel', async ({ page }) => {
    await open(page)
    await scrollToProgress(page, 'wellness', 0.25)
    await page.locator('#wellness [data-scroll-enlarge-snap-tab]').nth(2).click()
    await page.waitForTimeout(SETTLE_MS)
    const state = await readState(page, 'wellness')
    expect(state.activeItem).toBe(2)
    expect(state.activeTab).toBe(2)
    expect(state.itemOpacity[2]).toBe(1)
  })

  test('section without tabs or stage element reaches its end state', async ({ page }) => {
    await open(page)
    await scrollToProgress(page, 'home', 1)
    const state = await readState(page, 'home')
    expect(Math.abs(state.mediaWidth - state.stageWidth)).toBeLessThan(2)
    expect(state.activeItem).toBe(4)
    expect(state.itemOpacity[4]).toBe(1)
  })

  test('reduced motion shows the end state with no animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await open(page)
    const initial = await readState(page, 'wellness')
    expect(Math.abs(initial.mediaWidth - initial.stageWidth)).toBeLessThan(2)
    expect(initial.itemOpacity).toEqual([1, 0, 0, 0])

    const { start, end } = initial
    await page.evaluate((top) => window.scrollTo(0, top), end)
    // No tweens: the swap is visible on the next frame, not after a scrub.
    await page.waitForTimeout(150)
    const state = await readState(page, 'wellness')
    expect(state.itemOpacity).toEqual([0, 0, 0, 1])
    expect(state.activeTab).toBe(3)
    expect(end).toBeGreaterThan(start)
  })
})
