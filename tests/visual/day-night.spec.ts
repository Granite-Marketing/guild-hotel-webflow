import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'
import * as esbuild from 'esbuild'

/**
 * Day and night content switch (ticket #339, spec #338), offline fixture with
 * the real dayNight, buttonHover, heroTextReveal and line mask modules plus
 * the real head snippet and CSS. Every test drives the page the way a visitor
 * does (press a button, reload, follow a link) and checks what shows.
 */

const PAGE_A = '/tests/visual/fixtures/day-night-a.html'
const HEAD_CSS = readFileSync('docs/reference/site-head/day-night.css', 'utf8')
const HEAD_JS = readFileSync('docs/reference/site-head/day-night-head.js', 'utf8')

const DAY_HEADING = 'Day heading'
const NIGHT_HEADING = 'Night heading'

let context: esbuild.BuildContext
let origin = ''

test.beforeAll(async () => {
  context = await esbuild.context({
    entryPoints: ['tests/visual/fixtures/day-night.ts'],
    bundle: true,
    outdir: 'tests/visual/fixtures',
    tsconfig: 'tsconfig.json',
    logLevel: 'silent',
  })
  const server = await context.serve({ servedir: '.', host: '127.0.0.1' })
  origin = `http://127.0.0.1:${server.port}`
})

test.afterAll(async () => {
  await context?.dispose()
})

test.beforeEach(async ({ page }) => {
  // The head snippet and CSS are pasted into the real site head; the fixtures carry a marker where they go.
  await page.route('**/day-night-*.html', async (route) => {
    const response = await route.fetch()
    const body = (await response.text()).replace('<!--HEAD-->', `<style>${HEAD_CSS}</style><script>${HEAD_JS}</script>`)
    await route.fulfill({ response, body })
  })
})

const open = async (page: Page, path = PAGE_A) => {
  await page.goto(`${origin}${path}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
}

const setNightCookie = (page: Page) =>
  page.context().addCookies([{ name: 'guild-mode', value: 'night', url: origin }])

const press = (page: Page, mode: 'day' | 'night') => page.locator(`[data-day-night="${mode}"]`).click()

const snapshot = (page: Page) =>
  page.evaluate(() => {
    const photo = document.querySelector<HTMLImageElement>('#photo')!
    const link = document.querySelector<HTMLAnchorElement>('#link')!
    const video = document.querySelector<HTMLVideoElement>('#frame video')
    return {
      heading: document.querySelector('#heading')!.textContent,
      kept: document.querySelector('#kept')!.textContent,
      missing: document.querySelector('#missing')!.textContent,
      photoSrc: photo.currentSrc,
      photoAttrs: [photo.getAttribute('src'), photo.getAttribute('srcset'), photo.getAttribute('sizes')],
      emptyPhotoSrc: document.querySelector<HTMLImageElement>('#photo-empty')!.currentSrc,
      videoSrc: video?.getAttribute('src') ?? null,
      linkHref: link.getAttribute('href'),
      // The button's roll label holds the text twice (the second is the aria-hidden copy); both must match.
      linkLabel: Array.from(link.querySelectorAll('[data-btn-label] > span')).map((span) => span.textContent).join('|'),
      linkHtml: link.innerHTML,
      mode: document.documentElement.classList.contains('is-night') ? 'night' : 'day',
      pressed: Array.from(document.querySelectorAll('[data-day-night]')).map((button) => button.getAttribute('aria-pressed')),
    }
  })

const settled = (page: Page) => page.waitForTimeout(900)

for (const viewport of [
  { name: '390', width: 390, height: 800 },
  { name: '1440', width: 1440, height: 900 },
]) {
  test.describe(`at ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('Night swaps text, image, video and link, and Day restores them exactly', async ({ page }) => {
      await open(page)
      await settled(page)
      const day = await snapshot(page)
      expect(day.heading).toBe(DAY_HEADING)
      expect(day.photoSrc).toContain('day-night-day.svg')
      expect(day.videoSrc).toBeNull()
      expect(day.linkHref).toBe('/day-link')

      await press(page, 'night')
      await settled(page)
      const night = await snapshot(page)
      expect(night.mode).toBe('night')
      expect(night.heading).toBe(NIGHT_HEADING)
      expect(night.photoSrc).toContain('day-night-night.svg')
      expect(night.videoSrc).toContain('day-night-night.mp4')
      expect(night.linkHref).toBe('/night-link')
      expect(night.linkLabel).toBe('Night button|Night button')
      // The day picture must not survive in srcset, or the browser would keep choosing it.
      expect(night.photoAttrs[1]).not.toContain('day-night-day')

      await press(page, 'day')
      await settled(page)
      expect(await snapshot(page)).toEqual(day)
    })

    test('a first visit with no cookie is day, with Day pressed', async ({ page }) => {
      await open(page)
      const state = await snapshot(page)
      expect(state.mode).toBe('day')
      expect(state.pressed).toEqual(['true', 'false'])
      expect(state.heading).toBe(DAY_HEADING)
    })

    test('night stays through a reload and on another page (cookie)', async ({ page }) => {
      await open(page)
      await press(page, 'night')
      await settled(page)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
      let state = await snapshot(page)
      expect(state.mode).toBe('night')
      expect(state.pressed).toEqual(['false', 'true'])
      expect(state.heading).toBe(NIGHT_HEADING)

      await page.locator('#other').click()
      await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
      expect(page.url()).toContain('day-night-b.html')
      state = await snapshot(page)
      expect(state.mode).toBe('night')
      expect(state.heading).toBe(NIGHT_HEADING)

      const cookie = (await page.context().cookies()).find((entry) => entry.name === 'guild-mode')
      expect(cookie?.value).toBe('night')
      expect(cookie!.expires - Date.now() / 1000).toBeGreaterThan(364 * 86400)
    })

    test('an empty or missing night value keeps the day content', async ({ page }) => {
      await open(page)
      await press(page, 'night')
      await settled(page)
      const state = await snapshot(page)
      expect(state.kept).toBe('Day paragraph with an empty night value')
      expect(state.missing).toBe('Day paragraph with no night attribute')
      expect(state.emptyPhotoSrc).toContain('day-night-day.svg')
    })

    test('the Night and Day buttons work by keyboard', async ({ page }) => {
      await open(page)
      await page.locator('[data-day-night="night"]').focus()
      await page.keyboard.press('Enter')
      await settled(page)
      expect((await snapshot(page)).heading).toBe(NIGHT_HEADING)
      await page.locator('[data-day-night="day"]').focus()
      await page.keyboard.press('Space')
      await settled(page)
      expect((await snapshot(page)).heading).toBe(DAY_HEADING)
    })

    test('no day text or image shows on a night load before the night content is in', async ({ page }) => {
      await setNightCookie(page)
      let release: () => void = () => undefined
      const gate = new Promise<void>((resolve) => (release = resolve))
      // Hold the bundle back: this is the window in which a day flash would show.
      await page.route('**/day-night.js', async (route) => {
        await gate
        await route.continue()
      })
      await page.goto(`${origin}${PAGE_A}`, { waitUntil: 'commit' })
      await page.waitForSelector('#photo', { state: 'attached' })
      const hidden = await page.evaluate(() =>
        ['#hero', '#heading', '#photo', '#frame', '#link'].map((selector) => getComputedStyle(document.querySelector(selector)!).visibility),
      )
      expect(hidden).toEqual(['hidden', 'hidden', 'hidden', 'hidden', 'hidden'])
      // Elements with no night value are not hidden.
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('#kept')!).visibility)).toBe('visible')
      release()
      await page.waitForFunction(() => (window as unknown as { fixtureReady?: boolean }).fixtureReady === true)
      const state = await snapshot(page)
      expect(state.heading).toBe(NIGHT_HEADING)
      expect(state.photoSrc).toContain('day-night-night.svg')
      expect(
        await page.evaluate(() => ['#hero', '#heading', '#photo', '#link'].map((selector) => getComputedStyle(document.querySelector(selector)!).visibility)),
      ).toEqual(['visible', 'visible', 'visible', 'visible'])
    })

    test('hero text reveal and line masks still animate after a switch, with no duplicated lines', async ({ page }) => {
      await open(page)
      await page.waitForTimeout(1600)
      await press(page, 'night')
      // Sample the hero words for two seconds: they must rise again, then rest in place.
      const result = await page.evaluate(
        () =>
          new Promise<{ moved: boolean; text: string; lines: string[]; maskedLines: string[]; restingOffset: number }>((resolve) => {
            let moved = false
            const hero = document.querySelector<HTMLElement>('#hero')!
            const started = performance.now()
            const sample = () => {
              const words = Array.from(hero.querySelectorAll<HTMLElement>('div > div, div > span')).filter((node) => node.textContent?.trim())
              const offsets = Array.from(hero.querySelectorAll<HTMLElement>('*')).map((node) => new DOMMatrix(getComputedStyle(node).transform).m42)
              if (words.length && offsets.some((offset) => Math.abs(offset) > 1)) moved = true
              if (performance.now() - started < 2400) return requestAnimationFrame(sample)
              const normalise = (value: string | null) => (value ?? '').replace(/\s+/g, ' ').trim()
              const lineNodes = (root: HTMLElement) =>
                Array.from(root.children).filter((node) => node.tagName === 'DIV').map((node) => normalise(node.textContent))
              const masked = document.querySelector<HTMLElement>('#masked-heading')!
              resolve({
                moved,
                text: normalise(hero.textContent),
                lines: lineNodes(hero),
                maskedLines: lineNodes(masked),
                restingOffset: Math.max(...Array.from(hero.querySelectorAll<HTMLElement>('*')).map((node) => Math.abs(new DOMMatrix(getComputedStyle(node).transform).m42))),
              })
            }
            requestAnimationFrame(sample)
          }),
      )
      const heroNight = 'Night hero heading that is long enough to wrap onto several lines on a phone'
      expect(result.moved).toBe(true)
      expect(result.text).toBe(heroNight)
      // Each line once: the lines read back in order make the sentence, with nothing repeated.
      expect(result.lines.join(' ')).toBe(heroNight)
      expect(result.maskedLines.join(' ')).toBe('Night masked heading that also wraps onto a second and a third line')
      expect(result.restingOffset).toBeLessThan(1)

      await press(page, 'day')
      await page.waitForTimeout(1800)
      const back = await page.evaluate(() => document.querySelector('#hero')!.textContent!.replace(/\s+/g, ' ').trim())
      expect(back).toBe('Day hero heading that is long enough to wrap onto several lines on a phone')
    })

    test('the content crossfades in about half a second', async ({ page }) => {
      await open(page)
      await page.waitForTimeout(1600)
      const trace = await page.evaluate(
        () =>
          new Promise<{ opacities: number[]; swappedAt: number; doneAt: number; textAtStart: string }>((resolve) => {
            const heading = document.querySelector<HTMLElement>('#heading')!
            const opacities: number[] = []
            let swappedAt = -1
            const textAtStart = heading.textContent ?? ''
            const started = performance.now()
            document.querySelector<HTMLElement>('[data-day-night="night"]')!.click()
            const sample = () => {
              const now = performance.now() - started
              const opacity = Number(getComputedStyle(heading).opacity)
              opacities.push(opacity)
              if (swappedAt < 0 && heading.textContent === 'Night heading') swappedAt = now
              if (now > 900) return resolve({ opacities, swappedAt, doneAt: now, textAtStart })
              requestAnimationFrame(sample)
            }
            requestAnimationFrame(sample)
          }),
      )
      expect(trace.textAtStart).toBe(DAY_HEADING)
      // It fades out, swaps once nearly invisible, then fades back in.
      expect(Math.min(...trace.opacities)).toBeLessThan(0.15)
      expect(trace.opacities.some((opacity) => opacity > 0.1 && opacity < 0.9)).toBe(true)
      expect(trace.swappedAt).toBeGreaterThan(150)
      expect(trace.swappedAt).toBeLessThan(400)
      expect(trace.opacities.at(-1)).toBe(1)
    })

    test('with reduced motion the swap is instant', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await open(page)
      await press(page, 'night')
      const right = await snapshot(page)
      expect(right.heading).toBe(NIGHT_HEADING)
      // The picture itself loads a moment later; the attributes are already night.
      expect(right.photoAttrs[0]).toContain('day-night-night.svg')
      await expect.poll(() => page.locator('#photo').evaluate((photo: HTMLImageElement) => photo.currentSrc)).toContain('day-night-night.svg')
      expect(await page.evaluate(() => getComputedStyle(document.querySelector('#heading')!).opacity)).toBe('1')
    })
  })
}
