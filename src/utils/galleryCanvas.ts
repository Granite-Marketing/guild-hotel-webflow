/**
 * Gallery canvas: the /gallery and /arts photo grids become a 100vh window
 * onto a larger board of photos that the visitor drags and zooms (CONCEPTS.md
 * "Gallery canvas"). Plan: docs/plans/2026-11-10-001-feat-gallery-canvas-plan.md
 *
 * DOM contract (see docs/reference/runtime-modules.md):
 *   - Root:     `[data-gallery-canvas]` on the section (also `[data-gallery-filter]`)
 *   - Items:    `[data-gallery-filter-item]`; their common parent is the board,
 *               and the board's parent is the window (works for the static
 *               /gallery grid and the /arts Collection List alike)
 *   - Zoom:     `[data-gallery-canvas-zoom="out|reset|in"]` links
 *   - Joystick: `.gallery-all_joystick` > `.gallery-all_joystick-knob`, shown
 *               (`is-active`) on touch screens only
 * Layout and window styles live in docs/reference/site-head/gallery-canvas.css.
 *
 * Mouse: drag pans with inertia, plain wheel scrolls the page, cmd/ctrl+wheel
 * and trackpad pinch zoom one step. Touch: the board never captures a swipe;
 * the joystick and zoom buttons move it. Rows are brick rows of a fixed height
 * with each photo at its natural aspect ratio; photos are never repeated.
 */

const ZOOM_STEPS = [0.5, 1, 1.6]
const NORMAL_STEP = 1
const HIDDEN_CLASS = 'hide'
const ACTIVE_CLASS = 'is-active'
const FALLBACK_ASPECT = 4 / 3
const WHEEL_GESTURE_SILENCE = 0.3
const DRAG_CLICK_DISTANCE = 4
const DRAG_CLICK_WINDOW_MS = 300
const JOYSTICK_SPEED = 800
const KEY_PAN_RATIO = 0.4

const rowMetrics = () => {
  const width = window.innerWidth
  // minWidthRatio: the board is never narrower than this many window widths,
  // so there is always something to drag sideways; phones need more because a
  // row there holds only one or two photos per screen.
  if (width >= 992) return { rowHeight: 414, gap: 24, minWidthRatio: 1.5 }
  if (width >= 768) return { rowHeight: 320, gap: 24, minWidthRatio: 1.5 }
  return { rowHeight: 224, gap: 12, minWidthRatio: 2.5 }
}

const imageAspect = (item: HTMLElement) => {
  const image = item.querySelector<HTMLImageElement>('img')
  if (!image) return FALLBACK_ASPECT
  if (image.complete && image.naturalWidth && image.naturalHeight) {
    return image.naturalWidth / image.naturalHeight
  }
  const width = Number(image.getAttribute('width'))
  const height = Number(image.getAttribute('height'))
  return width && height ? width / height : FALLBACK_ASPECT
}

type Camera = { x: number; y: number; scale: number }
type Bounds = { minX: number; maxX: number; minY: number; maxY: number }

export const galleryCanvas = () => {
  const roots = document.querySelectorAll<HTMLElement>('[data-gallery-canvas]')
  if (!roots.length) return

  gsap.registerPlugin(Draggable, InertiaPlugin)
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  // shortcut: input mode is decided once at load; a hybrid device that switches mid-visit keeps the first mode.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  roots.forEach((root) => {
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-filter-item]'))
    const board = items[0]?.parentElement
    const windowElement = board?.parentElement
    if (!board || !windowElement) return

    const zoomLinks = Array.from(root.querySelectorAll<HTMLElement>('[data-gallery-canvas-zoom]'))
    const joystick = root.querySelector<HTMLElement>('.gallery-all_joystick')
    const joystickKnob = joystick?.querySelector<HTMLElement>('.gallery-all_joystick-knob')

    let boardWidth = 0
    let boardHeight = 0
    let zoomStep = NORMAL_STEP

    root.classList.add('is-canvas')
    windowElement.setAttribute('tabindex', '0')
    windowElement.setAttribute('role', 'region')
    windowElement.setAttribute(
      'aria-label',
      'Photo board. Arrow keys move, plus and minus zoom.',
    )

    // -- Layout ---------------------------------------------------------------

    const layout = (animate: boolean) => {
      const { rowHeight, gap, minWidthRatio } = rowMetrics()
      const visibleItems = items.filter((item) => !item.classList.contains(HIDDEN_CLASS))
      const naturalWidths = visibleItems.map((item) => imageAspect(item) * rowHeight)

      // Board width grows with the photo count: by default the board takes the
      // window's shape (rows and width grow together), never narrower than
      // minWidthRatio windows. `data-gallery-canvas-width="3"` on the root fixes
      // it at that many window widths instead.
      const windowWidth = windowElement.clientWidth
      const windowHeight = windowElement.clientHeight || window.innerHeight
      const fixedRatio = Number(root.getAttribute('data-gallery-canvas-width'))
      const totalArea = naturalWidths.reduce((total, width) => total + width + gap, 0) * (rowHeight + gap)
      const targetWidth = fixedRatio > 0
        ? windowWidth * fixedRatio
        : Math.max(windowWidth * minWidthRatio, Math.sqrt(totalArea * (windowWidth / windowHeight)))

      // Pack natural widths into rows, closing a row where it lands nearest the
      // target width, then stretch each full row flush (object-fit crops the
      // few percent) so both edges line up like the Figma rows.
      const rows: number[][] = [[]]
      let rowWidth = 0
      naturalWidths.forEach((width, index) => {
        const currentRow = rows[rows.length - 1]
        const withItem = rowWidth + (currentRow.length ? gap : 0) + width
        if (currentRow.length && withItem - targetWidth > targetWidth - rowWidth) {
          rows.push([index])
          rowWidth = width
        } else {
          currentRow.push(index)
          rowWidth = withItem
        }
      })

      const fullRowWidth = rows.length > 1 ? targetWidth : rowWidth
      const slots: Array<{ left: number; top: number; width: number; height: number }> = []
      rows.forEach((row, rowIndex) => {
        const contentWidth = row.reduce((total, index) => total + naturalWidths[index], 0)
        const gaps = gap * (row.length - 1)
        const isLastRow = rowIndex === rows.length - 1
        // The last row keeps natural widths unless stretching it is a small change.
        const stretch = (fullRowWidth - gaps) / contentWidth
        const rowScale = isLastRow && rows.length > 1 && stretch > 1.15 ? 1 : stretch
        let left = isLastRow && rowScale === 1 ? (fullRowWidth - contentWidth - gaps) / 2 : 0
        row.forEach((index) => {
          const width = Math.round(naturalWidths[index] * rowScale)
          slots[index] = { left: Math.round(left), top: rowIndex * (rowHeight + gap), width, height: rowHeight }
          left += width + gap
        })
      })

      boardWidth = Math.round(fullRowWidth)
      boardHeight = visibleItems.length ? rows.length * (rowHeight + gap) - gap : 0
      gsap.set(board, { width: boardWidth, height: boardHeight })

      visibleItems.forEach((item, index) => {
        if (animate && !reducedMotion.matches) {
          gsap.to(item, { ...slots[index], duration: 0.5, ease: 'power2.out' })
        } else {
          gsap.set(item, slots[index])
        }
      })
    }

    // -- Camera ---------------------------------------------------------------

    const camera = (): Camera => ({
      x: Number(gsap.getProperty(board, 'x')),
      y: Number(gsap.getProperty(board, 'y')),
      scale: Number(gsap.getProperty(board, 'scale')),
    })

    const axisRange = (windowSize: number, boardSize: number) => {
      const overflow = windowSize - boardSize
      // Smaller than the window: centre and lock this axis.
      return overflow >= 0 ? [overflow / 2, overflow / 2] : [overflow, 0]
    }

    const boundsFor = (scale: number): Bounds => {
      const [minX, maxX] = axisRange(windowElement.clientWidth, boardWidth * scale)
      const [minY, maxY] = axisRange(windowElement.clientHeight, boardHeight * scale)
      return { minX, maxX, minY, maxY }
    }

    const clamp = ({ x, y, scale }: Camera): Camera => {
      const bounds = boundsFor(scale)
      return {
        x: gsap.utils.clamp(bounds.minX, bounds.maxX, x),
        y: gsap.utils.clamp(bounds.minY, bounds.maxY, y),
        scale,
      }
    }

    const centred = (scale: number): Camera => {
      const bounds = boundsFor(scale)
      return { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2, scale }
    }

    let boardDraggable: DraggableInstance | undefined

    const syncDraggable = (scale: number) => {
      if (!boardDraggable) return
      boardDraggable.applyBounds(boundsFor(scale))
      boardDraggable.update()
    }

    const stopMotion = () => {
      gsap.killTweensOf(board)
      boardDraggable?.tween?.kill()
    }

    const glideTo = (target: Camera, duration: number) => {
      stopMotion()
      const next = clamp(target)
      if (reducedMotion.matches || duration === 0) {
        gsap.set(board, next)
        syncDraggable(next.scale)
        return
      }
      gsap.to(board, {
        ...next,
        duration,
        ease: 'power3.out',
        onComplete: () => syncDraggable(next.scale),
      })
    }

    // -- Zoom -----------------------------------------------------------------

    const markZoomStep = () => {
      const activeAction = zoomStep === NORMAL_STEP ? 'reset' : undefined
      zoomLinks.forEach((link) => {
        const isActive = link.getAttribute('data-gallery-canvas-zoom') === activeAction
        link.classList.toggle(ACTIVE_CLASS, isActive)
        link.setAttribute('aria-pressed', String(isActive))
        const action = link.getAttribute('data-gallery-canvas-zoom')
        const atLimit =
          (action === 'out' && zoomStep === 0) ||
          (action === 'in' && zoomStep === ZOOM_STEPS.length - 1)
        link.setAttribute('aria-disabled', String(atLimit))
      })
    }

    const zoomTo = (step: number, anchorX?: number, anchorY?: number) => {
      const nextStep = gsap.utils.clamp(0, ZOOM_STEPS.length - 1, step)
      if (nextStep === zoomStep) return
      const current = camera()
      const nextScale = ZOOM_STEPS[nextStep]
      const anchorLeft = anchorX ?? windowElement.clientWidth / 2
      const anchorTop = anchorY ?? windowElement.clientHeight / 2
      const ratio = nextScale / current.scale
      zoomStep = nextStep
      markZoomStep()
      glideTo(
        {
          x: anchorLeft - (anchorLeft - current.x) * ratio,
          y: anchorTop - (anchorTop - current.y) * ratio,
          scale: nextScale,
        },
        0.45,
      )
    }

    zoomLinks.forEach((link) => {
      link.setAttribute('role', 'button')
      link.addEventListener('click', (event) => {
        event.preventDefault()
        const action = link.getAttribute('data-gallery-canvas-zoom')
        if (action === 'in') zoomTo(zoomStep + 1)
        else if (action === 'out') zoomTo(zoomStep - 1)
        else zoomTo(NORMAL_STEP)
      })
    })

    // A trackpad pinch is a burst of ctrl+wheel events: one step per burst.
    let wheelGestureActive = false
    const wheelGestureEnd = gsap.delayedCall(WHEEL_GESTURE_SILENCE, () => {
      wheelGestureActive = false
    }).pause()

    windowElement.addEventListener(
      'wheel',
      (event) => {
        if (!event.ctrlKey && !event.metaKey) return // plain wheel scrolls the page
        event.preventDefault()
        event.stopPropagation() // keep Lenis (listening on window) from scrolling
        wheelGestureEnd.restart(true)
        if (wheelGestureActive || event.deltaY === 0) return
        wheelGestureActive = true
        const box = windowElement.getBoundingClientRect()
        zoomTo(zoomStep + (event.deltaY < 0 ? 1 : -1), event.clientX - box.left, event.clientY - box.top)
      },
      { passive: false },
    )

    // Safari reports trackpad pinch as gesture events, not ctrl+wheel.
    windowElement.addEventListener('gesturestart', (event) => event.preventDefault())
    windowElement.addEventListener('gestureend', (event) => {
      event.preventDefault()
      const scale = (event as Event & { scale?: number }).scale ?? 1
      if (scale !== 1) zoomTo(zoomStep + (scale > 1 ? 1 : -1))
    })

    // -- Pan: mouse -----------------------------------------------------------

    let lastDragEnd = 0
    let lastDragDistance = 0

    if (finePointer) {
      boardDraggable = Draggable.create(board, {
        type: 'x,y',
        inertia: !reducedMotion.matches,
        bounds: boundsFor(ZOOM_STEPS[NORMAL_STEP]),
        edgeResistance: 0.8,
        overshootTolerance: 0.5,
        throwResistance: 2500,
        maxDuration: 1.2,
        minimumMovement: DRAG_CLICK_DISTANCE,
        dragClickables: true,
        zIndexBoost: false,
        cursor: 'grab',
        activeCursor: 'grabbing',
        allowContextMenu: true,
        onPress(this: DraggableInstance) {
          // Hybrid device: a finger scrolls the page, it never drags the board.
          if ((this.pointerEvent as PointerEvent | undefined)?.pointerType === 'touch') {
            this.endDrag(this.pointerEvent)
            return
          }
          gsap.killTweensOf(board)
        },
        onDragEnd(this: DraggableInstance) {
          lastDragEnd = performance.now()
          lastDragDistance = Math.hypot(this.endX - this.startX, this.endY - this.startY)
        },
      })[0]

      // A release after a drag is never a click (modals() listens on document).
      board.addEventListener(
        'click',
        (event) => {
          const justDragged = performance.now() - lastDragEnd < DRAG_CLICK_WINDOW_MS
          if (justDragged && lastDragDistance >= DRAG_CLICK_DISTANCE) {
            event.preventDefault()
            event.stopPropagation()
          }
        },
        true,
      )
    }

    // -- Pan: touch joystick --------------------------------------------------

    if (!finePointer && joystick && joystickKnob) {
      joystick.classList.add(ACTIVE_CLASS)
      joystick.setAttribute('aria-hidden', 'true')
      let vectorX = 0
      let vectorY = 0
      let pressed = false
      let lastTick = 0

      const moveBoard = () => {
        const now = performance.now()
        const deltaSeconds = Math.min((now - lastTick) / 1000, 0.1)
        lastTick = now
        const current = camera()
        gsap.set(
          board,
          clamp({
            x: current.x - vectorX * JOYSTICK_SPEED * deltaSeconds,
            y: current.y - vectorY * JOYSTICK_SPEED * deltaSeconds,
            scale: current.scale,
          }),
        )
      }

      const pointAt = (event: PointerEvent) => {
        const box = joystick.getBoundingClientRect()
        const radius = box.width / 2
        let offsetX = event.clientX - (box.left + radius)
        let offsetY = event.clientY - (box.top + radius)
        const distance = Math.hypot(offsetX, offsetY)
        if (distance > radius) {
          offsetX = (offsetX / distance) * radius
          offsetY = (offsetY / distance) * radius
        }
        vectorX = offsetX / radius
        vectorY = offsetY / radius
        gsap.set(joystickKnob, { x: offsetX, y: offsetY })
      }

      const release = () => {
        if (!pressed) return
        pressed = false
        vectorX = 0
        vectorY = 0
        gsap.ticker.remove(moveBoard)
        gsap.to(joystickKnob, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' })
      }

      joystick.addEventListener('pointerdown', (event) => {
        event.preventDefault()
        stopMotion()
        pressed = true
        // Keeps moves coming when the thumb slides off the ring.
        if (event.isTrusted) joystick.setPointerCapture(event.pointerId)
        pointAt(event)
        lastTick = performance.now()
        gsap.ticker.add(moveBoard)
      })
      joystick.addEventListener('pointermove', (event) => {
        if (pressed) pointAt(event)
      })
      joystick.addEventListener('pointerup', release)
      joystick.addEventListener('pointercancel', release)
    }

    // -- Keyboard and focus -----------------------------------------------------

    windowElement.addEventListener('keydown', (event) => {
      const current = camera()
      const stepX = windowElement.clientWidth * KEY_PAN_RATIO
      const stepY = windowElement.clientHeight * KEY_PAN_RATIO
      const moves: Record<string, [number, number]> = {
        ArrowLeft: [stepX, 0],
        ArrowRight: [-stepX, 0],
        ArrowUp: [0, stepY],
        ArrowDown: [0, -stepY],
      }
      if (moves[event.key]) {
        event.preventDefault()
        const [moveX, moveY] = moves[event.key]
        glideTo({ ...current, x: current.x + moveX, y: current.y + moveY }, 0.35)
      } else if (event.key === '+' || event.key === '=') {
        event.preventDefault()
        zoomTo(zoomStep + 1)
      } else if (event.key === '-') {
        event.preventDefault()
        zoomTo(zoomStep - 1)
      } else if (event.key === '0') {
        event.preventDefault()
        zoomTo(NORMAL_STEP)
      }
    })

    // Tabbing to a tile (or focus returning from its modal) brings it into view.
    windowElement.addEventListener('focusin', (event) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>('[data-gallery-filter-item]')
      // Browsers scroll an overflow-hidden box to reveal focus; the camera owns position.
      windowElement.scrollLeft = 0
      windowElement.scrollTop = 0
      if (!item) return
      const current = camera()
      const left = Number(gsap.getProperty(item, 'left')) * current.scale + current.x
      const top = Number(gsap.getProperty(item, 'top')) * current.scale + current.y
      const width = item.offsetWidth * current.scale
      const height = item.offsetHeight * current.scale
      const viewWidth = windowElement.clientWidth
      const viewHeight = windowElement.clientHeight
      let nextX = current.x
      let nextY = current.y
      if (left < 0 || left + width > viewWidth) nextX += viewWidth / 2 - (left + width / 2)
      if (top < 0 || top + height > viewHeight) nextY += viewHeight / 2 - (top + height / 2)
      if (nextX !== current.x || nextY !== current.y) {
        glideTo({ ...current, x: nextX, y: nextY }, 0.45)
      }
    })

    // -- Filter, late images, resize -------------------------------------------

    root.addEventListener('gallery-filter:change', () => {
      layout(true)
      zoomStep = NORMAL_STEP
      markZoomStep()
      glideTo(centred(ZOOM_STEPS[NORMAL_STEP]), 0.7)
    })

    let relayoutFrame = 0
    const relayoutSoon = () => {
      cancelAnimationFrame(relayoutFrame)
      relayoutFrame = requestAnimationFrame(() => {
        // Keep the same spot of the board in the middle of the window.
        const before = camera()
        const focusX = boardWidth ? (windowElement.clientWidth / 2 - before.x) / (boardWidth * before.scale) : 0.5
        const focusY = boardHeight ? (windowElement.clientHeight / 2 - before.y) / (boardHeight * before.scale) : 0.5
        layout(false)
        glideTo(
          {
            x: windowElement.clientWidth / 2 - focusX * boardWidth * before.scale,
            y: windowElement.clientHeight / 2 - focusY * boardHeight * before.scale,
            scale: before.scale,
          },
          0,
        )
      })
    }

    items.forEach((item) => {
      const image = item.querySelector<HTMLImageElement>('img')
      if (image && !(image.complete && image.naturalWidth)) {
        image.addEventListener('load', relayoutSoon, { once: true })
      }
    })

    let lastWindowWidth = windowElement.clientWidth
    let lastWindowHeight = windowElement.clientHeight
    new ResizeObserver(() => {
      if (
        windowElement.clientWidth === lastWindowWidth &&
        windowElement.clientHeight === lastWindowHeight
      ) {
        return
      }
      lastWindowWidth = windowElement.clientWidth
      lastWindowHeight = windowElement.clientHeight
      relayoutSoon()
    }).observe(windowElement)

    layout(false)
    gsap.set(board, centred(ZOOM_STEPS[NORMAL_STEP]))
    syncDraggable(ZOOM_STEPS[NORMAL_STEP])
    markZoomStep()
  })
}
