// Headless scroll frame-time check (docs/solutions/integration-issues/lenis-main-thread-jitter-2026-11-27.md).
// Usage: node scripts/perf-scroll.mjs [--bundle dist/index.js] [--throttle 4] [--settle 4000] [--pages /,/meetings] [--base https://the-guild-hotel-c34e71.webflow.io]
import { chromium } from '@playwright/test'
import { readFileSync } from 'node:fs'

const args = process.argv.slice(2)
const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback)
const bundle = opt('--bundle', null)
const throttle = Number(opt('--throttle', 1))
const base = opt('--base', 'https://the-guild-hotel-c34e71.webflow.io')
const pages = opt('--pages', '/rooms/guild-double,/,/meetings,/history,/legal-corporate/corporate').split(',')
const settle = Number(opt('--settle', 4000))
const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]

// Times every rAF callback, so idle cost is the work scheduled per frame with nothing moving.
const probe = () => {
  const native = window.requestAnimationFrame.bind(window)
  window.__rafWork = []
  window.requestAnimationFrame = (callback) =>
    native((time) => {
      const start = performance.now()
      callback(time)
      window.__rafWork.push(performance.now() - start)
    })
  // Layout reads with nothing moving: the nav mask loop was the source.
  window.__rects = 0
  const rect = Element.prototype.getBoundingClientRect
  Element.prototype.getBoundingClientRect = function () {
    window.__rects++
    return rect.call(this)
  }
  window.__frames = []
  let last = 0
  const loop = (time) => {
    if (last) window.__frames.push(time - last)
    last = time
    native(loop)
  }
  native(loop)
}

const p95 = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length * 0.95)] ?? 0
}

const browser = await chromium.launch({ headless: true })
const consoleErrors = []
for (const viewport of viewports) {
  for (const path of pages) {
    const context = await browser.newContext({ viewport, hasTouch: false })
    const page = await context.newPage()
    page.on('console', (message) => message.type() === 'error' && consoleErrors.push(`${path}: ${message.text()}`))
    page.on('pageerror', (error) => consoleErrors.push(`${path}: ${error.message}`))
    await page.addInitScript(probe)
    const cdp = await context.newCDPSession(page)
    await cdp.send('Performance.enable')
    if (throttle > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle })
    // Main-thread time (ms) spent in script, layout and style recalc between two points.
    const busy = async () => {
      const { metrics } = await cdp.send('Performance.getMetrics')
      const get = (name) => metrics.find((metric) => metric.name === name)?.value ?? 0
      return { script: get('ScriptDuration'), layout: get('LayoutDuration'), style: get('RecalcStyleDuration') }
    }
    if (bundle) {
      const body = readFileSync(bundle)
      await page.route(/guild-hotel-webflow@[^/]+\/dist\/index\.js/, (route) =>
        route.fulfill({ body, contentType: 'application/javascript' }),
      )
    }
    await page.goto(base + path, { waitUntil: 'load', timeout: 90000 })
    await page.waitForTimeout(settle)
    // Idle: nothing moving for 2s.
    await page.evaluate(() => ((window.__rafWork = []), (window.__rects = 0)))
    await page.waitForTimeout(2000)
    const idle = await page.evaluate(() => {
      const work = window.__rafWork
      return { calls: work.length, msPerSecond: work.reduce((a, b) => a + b, 0) / 2, rects: window.__rects / 2 }
    })
    // Scroll: wheel down in steps, like a trackpad flick series.
    await page.mouse.move(viewport.width / 2, viewport.height / 2)
    await page.evaluate(() => (window.__frames = []))
    const busyBefore = await busy()
    for (let step = 0; step < 50; step++) {
      await page.mouse.wheel(0, 120)
      await page.waitForTimeout(60)
    }
    await page.waitForTimeout(1500)
    const frames = await page.evaluate(() => window.__frames)
    const busyAfter = await busy()
    const busyMs = (key) => Math.round((busyAfter[key] - busyBefore[key]) * 1000)
    console.log(
      JSON.stringify({
        viewport: `${viewport.width}x${viewport.height}`,
        path,
        p95: +p95(frames).toFixed(1),
        long: frames.filter((frame) => frame > 33).length,
        frames: frames.length,
        scrollScriptMs: busyMs('script'),
        scrollLayoutMs: busyMs('layout'),
        scrollStyleMs: busyMs('style'),
        idleRafCallsPerSec: idle.calls / 2,
        idleRafMsPerSec: +idle.msPerSecond.toFixed(2),
        idleRectReadsPerSec: idle.rects,
      }),
    )
    await context.close()
  }
}
if (consoleErrors.length) console.log('CONSOLE ERRORS:\n' + [...new Set(consoleErrors)].join('\n'))
await browser.close()
