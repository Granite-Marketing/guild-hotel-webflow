/**
 * Hover follow image (legal/04 "why teams choose the guild"): hovering an
 * item in a grid shows one photo that follows the pointer across the zone,
 * and hides it when the pointer leaves the items.
 *
 * DOM contract (built in Webflow, see docs/reference/runtime-modules.md):
 *   [data-hover-image]                 zone (the list or grid wrapper)
 *     [data-hover-image-item]          each hover target
 *       optional data-hover-image-src  photo URL for this item
 *       optional data-hover-image-alt  alt text for this item's photo
 *     [data-hover-image-media]         figure holding one <img>, placed
 *                                      anywhere inside the zone
 *
 * The module positions the media absolutely inside the zone and fades it
 * with autoAlpha, so leave it visible in the Designer (hide it there only
 * with the module running). Skipped on touch devices and with reduced
 * motion: the media stays hidden and the grid reads as plain text.
 */

const ACTIVE_CLASS = 'is-active'
const DURATION = 0.5
// F109: the photo shows in front of the grid text and dividers, at full strength.
const HOVER_OPACITY = 1
// The hovered item's text masks in line by line once its panel shows (panel fade starts at 0.2s in CSS).
const LINE_DELAY = 0.3
const LINE_STAGGER = 0.08
const LINE_DURATION = 0.8

type LineMask = { splits: SplitTypeInstance[]; timeline: GsapTimeline }
const lineMasks = new Map<HTMLElement, LineMask>()

// Each line rises from behind its own edge: SplitText lines, each wrapped in a clipping block.
// Split fresh on every hover, so the lines always match the current width and font.
const maskInLines = (item: HTMLElement) => {
  restoreLines(item)
  const targets = Array.from(item.children) as HTMLElement[]
  if (!targets.length) return
  const splits = targets.map((target) => new SplitText(target, { type: 'lines' }))
  const lines = splits.flatMap((split) => split.lines ?? [])
  lines.forEach((line) => {
    const clip = document.createElement('div')
    Object.assign(clip.style, { overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em' })
    line.before(clip)
    clip.append(line)
  })
  const timeline = gsap.timeline({ delay: LINE_DELAY })
  lines.forEach((line, index) => {
    timeline.fromTo(line, { yPercent: 110 }, { yPercent: 0, duration: LINE_DURATION, ease: 'power3.out' }, index * LINE_STAGGER)
  })
  lineMasks.set(item, { splits, timeline })
}

// Back to plain text (the clips sit inside the split elements, so revert removes them too).
const restoreLines = (item: HTMLElement) => {
  const mask = lineMasks.get(item)
  if (!mask) return
  mask.timeline.kill()
  mask.splits.forEach((split) => split.revert())
  lineMasks.delete(item)
}

export const hoverFollowImage = () => {
  const zones = document.querySelectorAll<HTMLElement>('[data-hover-image]')
  if (!zones.length) return

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  zones.forEach((zone) => {
    const media = zone.querySelector<HTMLElement>('[data-hover-image-media]')
    const items = zone.querySelectorAll<HTMLElement>('[data-hover-image-item]')
    if (!media || !items.length) return

    gsap.set(media, { autoAlpha: 0, pointerEvents: 'none' })
    if (!canHover || reducedMotion) return

    const image = media.querySelector<HTMLImageElement>('img')
    if (getComputedStyle(zone).position === 'static') gsap.set(zone, { position: 'relative' })
    gsap.set(media, { position: 'absolute', top: 0, left: 0, xPercent: -50, yPercent: -50, zIndex: 10 })

    const moveX = gsap.quickTo(media, 'x', { duration: 0.8, ease: 'power3.out' })
    const moveY = gsap.quickTo(media, 'y', { duration: 0.8, ease: 'power3.out' })

    const follow = (event: PointerEvent) => {
      const rect = zone.getBoundingClientRect()
      moveX(event.clientX - rect.left)
      moveY(event.clientY - rect.top)
    }

    const show = (item: HTMLElement, event: PointerEvent) => {
      const source = item.getAttribute('data-hover-image-src')
      const alt = item.getAttribute('data-hover-image-alt')
      if (image && source && image.getAttribute('src') !== source) {
        image.removeAttribute('srcset')
        image.removeAttribute('sizes')
        image.loading = 'eager'
        image.src = source
      }
      if (image && alt !== null) image.alt = alt
      // The hovered item's text panel (CSS ::before) wraps its content, not the cell's min-height.
      const itemTop = item.getBoundingClientRect().top
      const first = item.firstElementChild?.getBoundingClientRect()
      const last = item.lastElementChild?.getBoundingClientRect()
      if (first && last) {
        item.style.setProperty('--hover-panel-top', `${first.top - itemTop}px`)
        item.style.setProperty('--hover-panel-height', `${last.bottom - first.top}px`)
      }
      if (!item.classList.contains(ACTIVE_CLASS)) {
        items.forEach((other) => {
          if (other !== item) restoreLines(other)
        })
        maskInLines(item)
      }
      items.forEach((other) => other.classList.toggle(ACTIVE_CLASS, other === item))
      if (!media.classList.contains(ACTIVE_CLASS)) {
        const rect = zone.getBoundingClientRect()
        gsap.set(media, { x: event.clientX - rect.left, y: event.clientY - rect.top })
      }
      media.classList.add(ACTIVE_CLASS)
      gsap.to(media, { autoAlpha: HOVER_OPACITY, duration: DURATION, ease: 'power3.out', overwrite: 'auto' })
    }

    const hide = () => {
      items.forEach((item) => {
        restoreLines(item)
        item.classList.remove(ACTIVE_CLASS)
      })
      media.classList.remove(ACTIVE_CLASS)
      gsap.to(media, { autoAlpha: 0, duration: DURATION, ease: 'power2.inOut', overwrite: 'auto' })
    }

    items.forEach((item) => {
      item.addEventListener('pointerenter', (event) => show(item, event))
      item.addEventListener('pointerleave', (event) => {
        const next = event.relatedTarget
        if (next instanceof Element && next.closest('[data-hover-image-item]')) return
        hide()
      })
    })
    zone.addEventListener('pointermove', follow)

    // Preload every item photo once, so the first hover never flashes the previous one.
    zone.addEventListener(
      'pointerenter',
      () => {
        items.forEach((item) => {
          const source = item.getAttribute('data-hover-image-src')
          if (source) {
            const preload = new Image()
            preload.src = source
          }
        })
      },
      { once: true },
    )
  })
}
