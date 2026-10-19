/**
 * Image Trail Hover
 *
 * Spawns a trail of linked images under the mouse while it moves across a
 * zone. Each new image fades and scales in at the pointer once the pointer
 * has travelled `threshold` pixels; when more than `max` images are showing,
 * the oldest fades out. The newest image always sits under the pointer, so a
 * click follows its link (for example to an anchor on the Arts page).
 *
 * DOM contract:
 *   <div data-image-trail-hover>                        zone: hover target, position: relative
 *     <a data-image-trail-hover-item href="/arts#slug">   one per CMS item, cycled in DOM order
 *       <figure><img src="..." alt="..." /></figure>
 *     </a>
 *   </div>
 *
 * Optional on the zone:
 *   data-image-trail-hover-threshold="100"   pointer travel in px between spawns
 *   data-image-trail-hover-max="3"           images visible at once
 *   data-image-trail-hover-duration="0.6"    fade-in seconds (fade-out is 75%)
 *
 * Without hover (touch) or with prefers-reduced-motion, the end state is shown
 * with no animation: the first `max` items stacked around the zone centre.
 * Each item gets `is-active` while visible.
 */

const DEFAULT_THRESHOLD = 100
const DEFAULT_MAX_VISIBLE = 3
const DEFAULT_DURATION = 0.6
const STATIC_STEP_X = 125
const STATIC_STEP_Y = 110

const readNumber = (value: string | undefined, fallback: number) => {
  const parsed = value ? parseFloat(value) : NaN
  return Number.isFinite(parsed) ? parsed : fallback
}

const startTrail = (
  zone: HTMLElement,
  items: HTMLElement[],
  threshold: number,
  maxVisible: number,
  duration: number,
) => {
  gsap.set(items, {
    position: 'absolute',
    top: 0,
    left: 0,
    xPercent: -50,
    yPercent: -50,
    autoAlpha: 0,
  })

  const visibleItems: HTMLElement[] = []
  let nextIndex = 0
  let topZIndex = 1
  let lastSpawnX: number | null = null
  let lastSpawnY = 0

  const hideItem = (item: HTMLElement) => {
    item.classList.remove('is-active')
    gsap.to(item, {
      autoAlpha: 0,
      scale: 0.9,
      duration: duration * 0.75,
      ease: 'power2.in',
    })
  }

  const showItem = (x: number, y: number) => {
    const item = items[nextIndex]
    nextIndex = (nextIndex + 1) % items.length

    const visibleIndex = visibleItems.indexOf(item)
    if (visibleIndex !== -1) visibleItems.splice(visibleIndex, 1)
    visibleItems.push(item)

    topZIndex += 1
    gsap.killTweensOf(item)
    gsap.set(item, { x, y, zIndex: topZIndex })
    gsap.fromTo(
      item,
      { autoAlpha: 0, scale: 0.85 },
      { autoAlpha: 1, scale: 1, duration, ease: 'power3.out' },
    )
    item.classList.add('is-active')

    while (visibleItems.length > maxVisible) {
      const oldestItem = visibleItems.shift()
      if (oldestItem) hideItem(oldestItem)
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    const bounds = zone.getBoundingClientRect()
    const pointerX = event.clientX - bounds.left
    const pointerY = event.clientY - bounds.top

    if (
      lastSpawnX !== null &&
      Math.hypot(pointerX - lastSpawnX, pointerY - lastSpawnY) < threshold
    ) {
      return
    }

    lastSpawnX = pointerX
    lastSpawnY = pointerY
    showItem(pointerX, pointerY)
  }

  const handlePointerLeave = () => {
    lastSpawnX = null
    visibleItems.splice(0).forEach(hideItem)
  }

  zone.addEventListener('pointermove', handlePointerMove)
  zone.addEventListener('pointerleave', handlePointerLeave)

  return () => {
    zone.removeEventListener('pointermove', handlePointerMove)
    zone.removeEventListener('pointerleave', handlePointerLeave)
    items.forEach((item) => {
      gsap.killTweensOf(item)
      item.classList.remove('is-active')
    })
  }
}

const showEndState = (items: HTMLElement[], maxVisible: number) => {
  gsap.set(items, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    xPercent: -50,
    yPercent: -50,
    autoAlpha: 0,
  })

  const shownItems = items.slice(0, maxVisible)
  shownItems.forEach((item, index) => {
    const offset = index - (shownItems.length - 1) / 2
    gsap.set(item, {
      x: offset * STATIC_STEP_X,
      y: offset * STATIC_STEP_Y,
      zIndex: index + 1,
      autoAlpha: 1,
    })
    item.classList.add('is-active')
  })

  return () => {
    shownItems.forEach((item) => item.classList.remove('is-active'))
  }
}

export const imageTrailHover = () => {
  const zones = document.querySelectorAll<HTMLElement>('[data-image-trail-hover]')
  if (!zones.length) return

  zones.forEach((zone) => {
    const items = Array.from(
      zone.querySelectorAll<HTMLElement>('[data-image-trail-hover-item]'),
    )
    if (!items.length) return

    const threshold = readNumber(zone.dataset.imageTrailHoverThreshold, DEFAULT_THRESHOLD)
    const maxVisible = Math.max(
      1,
      Math.round(readNumber(zone.dataset.imageTrailHoverMax, DEFAULT_MAX_VISIBLE)),
    )
    const duration = readNumber(zone.dataset.imageTrailHoverDuration, DEFAULT_DURATION)

    const mm = gsap.matchMedia()
    mm.add(
      {
        isAnimated: '(hover: hover) and (prefers-reduced-motion: no-preference)',
        isStatic: '(hover: none), (prefers-reduced-motion: reduce)',
      },
      (context) => {
        if (context.conditions.isAnimated) {
          return startTrail(zone, items, threshold, maxVisible, duration)
        }
        return showEndState(items, maxVisible)
      },
    )
  })
}
