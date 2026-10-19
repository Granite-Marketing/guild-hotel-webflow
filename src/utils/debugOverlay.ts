/**
 * Debug Overlay
 *
 * Dev-mode runtime diagnostics for ScrollTrigger and the active scroll engine.
 * Gated by `?debug=1` in the URL: when absent it returns immediately, so no
 * listeners, DOM or intervals exist in production page views.
 *
 * When active, mounts a fixed-position panel that exposes:
 *   - ScrollTrigger.getAll() table (id, start, end, progress, isActive, pin?)
 *   - Scroll engine state from `smoothScroll.describe()` (Lenis or
 *     ScrollSmoother, whichever `$utils/smoothScroll` exports)
 *   - Layout-shift log via PerformanceObserver (Chromium only, feature-detected)
 *   - Refresh log via ScrollTrigger.addEventListener('refreshInit'/'refresh')
 *   - Image still-loading count
 *
 * Also enables ScrollTrigger.defaults({ markers: true }) so visual start/end
 * lines are drawn on every trigger.
 *
 * Call it before `smoothScroll.init()` so the refresh log captures the first
 * refresh. Use the documented event hooks (addEventListener); do NOT
 * monkey-patch ScrollTrigger.refresh. The hooks are version-stable, wrappers
 * are not.
 */

import { smoothScroll } from '$utils/smoothScroll'

const REFRESH_LOG_CAP = 20
const SHIFT_LOG_CAP = 50
const PANEL_REFRESH_HZ = 4

interface RefreshLogEntry {
  type: 'refreshInit' | 'refresh'
  timestamp: number
  isScrolling: boolean
}

interface ShiftLogEntry {
  timestamp: number
  value: number
  target: string
}

export const debugOverlay = () => {
  if (new URLSearchParams(location.search).get('debug') !== '1') return

  // Draw start/end markers on every trigger created after this call.
  ScrollTrigger.defaults({ markers: true })

  const refreshLog: RefreshLogEntry[] = []
  const shiftLog: ShiftLogEntry[] = []

  ScrollTrigger.addEventListener('refreshInit', () => {
    refreshLog.push({
      type: 'refreshInit',
      timestamp: performance.now(),
      isScrolling: ScrollTrigger.isScrolling(),
    })
    if (refreshLog.length > REFRESH_LOG_CAP) refreshLog.shift()
  })

  ScrollTrigger.addEventListener('refresh', () => {
    refreshLog.push({
      type: 'refresh',
      timestamp: performance.now(),
      isScrolling: ScrollTrigger.isScrolling(),
    })
    if (refreshLog.length > REFRESH_LOG_CAP) refreshLog.shift()
  })

  const supportsLayoutShift =
    typeof PerformanceObserver !== 'undefined' &&
    (PerformanceObserver as unknown as { supportedEntryTypes?: string[] })
      .supportedEntryTypes?.includes('layout-shift')

  if (supportsLayoutShift) {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry as PerformanceEntry & {
          value: number
          hadRecentInput: boolean
          sources?: Array<{ node?: HTMLElement | null }>
        }
        if (shift.hadRecentInput) continue
        const node = shift.sources?.[0]?.node
        const target = node
          ? `${node.tagName.toLowerCase()}${node.className ? '.' + node.className.split(/\s+/)[0] : ''}`
          : '?'
        shiftLog.push({
          timestamp: performance.now(),
          value: shift.value,
          target,
        })
        if (shiftLog.length > SHIFT_LOG_CAP) shiftLog.shift()
      }
    }).observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit)
  }

  const panel = document.createElement('div')
  panel.id = 'st-debug-overlay'
  panel.style.cssText = [
    'position:fixed',
    'top:0.5rem',
    'right:0.5rem',
    'z-index:999999',
    'font:11px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace',
    'background:rgba(0,0,0,0.85)',
    'color:#fff',
    'padding:0.75rem',
    'max-width:24rem',
    'max-height:80vh',
    'overflow:auto',
    'border-radius:0.25rem',
    'pointer-events:auto',
    'white-space:nowrap',
  ].join(';')
  document.body.appendChild(panel)

  const pendingImages = () =>
    Array.from(document.images).filter(
      (image) => !(image.complete && image.naturalWidth > 0),
    ).length

  const formatNumber = (value: number, decimals = 0) =>
    Number.isFinite(value) ? value.toFixed(decimals) : '-'

  const renderTriggers = () => {
    const triggers = ScrollTrigger.getAll()
    const rows = triggers
      .map((trigger) => {
        const id =
          (trigger.vars.id as string | undefined) ??
          (typeof trigger.trigger === 'string'
            ? trigger.trigger
            : trigger.trigger?.tagName.toLowerCase() ?? '?')
        const isPinned = !!trigger.pin
        const isScrubbed = !!trigger.vars.scrub
        return [
          id.slice(0, 22).padEnd(22),
          formatNumber(trigger.start).padStart(6),
          formatNumber(trigger.end).padStart(6),
          formatNumber(trigger.progress, 3).padStart(5),
          trigger.isActive ? '●' : ' ',
          isPinned ? 'P' : ' ',
          isScrubbed ? 'S' : ' ',
        ].join(' ')
      })
      .join('\n')
    return `<b>ScrollTriggers (${triggers.length})</b>\n` +
      `<small>id                     start    end  prog  A P S</small>\n${rows || '(none)'}`
  }

  const renderEngine = () => {
    const rows = Object.entries(smoothScroll.describe())
      .map(([key, value]) => {
        const formatted = typeof value === 'number' ? formatNumber(value, 2) : String(value)
        return `${key.padEnd(13)}${formatted}`
      })
      .join('\n')
    return `<b>Scroll engine: ${smoothScroll.name}</b>\n${rows}`
  }

  const renderImages = () => `<b>Images pending</b> ${pendingImages()}`

  const renderDocument = () => {
    const scrollHeight = document.documentElement.scrollHeight
    const viewport = window.innerHeight
    const maxScroll = scrollHeight - viewport
    const currentScroll = smoothScroll.scrollTop()
    const remaining = maxScroll - currentScroll
    const bodyOverflow = getComputedStyle(document.body).overflow
    const htmlOverflow = getComputedStyle(document.documentElement).overflow
    const pinSpacers = document.querySelectorAll('.pin-spacer').length
    return [
      '<b>Document</b>',
      `scrollHeight   ${scrollHeight}`,
      `viewport       ${viewport}`,
      `maxScroll      ${maxScroll}`,
      `remaining      ${formatNumber(remaining, 0)}`,
      `body overflow  ${bodyOverflow}`,
      `html overflow  ${htmlOverflow}`,
      `pin-spacers    ${pinSpacers}`,
    ].join('\n')
  }

  const renderRefreshLog = () => {
    if (refreshLog.length === 0) return '<b>Refresh log</b> (none yet)'
    const rows = refreshLog
      .slice(-REFRESH_LOG_CAP)
      .map(
        (entry) =>
          `${entry.type.padEnd(12)} t=${formatNumber(entry.timestamp)}ms ${entry.isScrolling ? 'SCROLLING' : ''}`,
      )
      .join('\n')
    return `<b>Refresh log</b>\n${rows}`
  }

  const renderShiftLog = () => {
    if (!supportsLayoutShift) return '<b>Layout shifts</b> (no support)'
    if (shiftLog.length === 0) return '<b>Layout shifts</b> (none)'
    const total = shiftLog.reduce((sum, entry) => sum + entry.value, 0)
    const rows = shiftLog
      .slice(-10)
      .map((entry) => `${formatNumber(entry.value, 4)} ${entry.target}`)
      .join('\n')
    return `<b>Layout shifts</b> total=${formatNumber(total, 4)}\n${rows}`
  }

  const render = () => {
    panel.innerHTML = [
      renderTriggers(),
      renderEngine(),
      renderDocument(),
      renderImages(),
      renderRefreshLog(),
      renderShiftLog(),
    ]
      .map((section) => `<pre style="margin:0 0 0.5rem;white-space:pre">${section}</pre>`)
      .join('')
  }

  render()
  setInterval(render, 1000 / PANEL_REFRESH_HZ)
}
