/**
 * Line Mask Reveal (helper, not wired in index.ts)
 *
 * Prepares a container for a line mask-in. The targets are its headings,
 * paragraphs, figures (logos), `.button`s and any `[data-line-mask]`
 * element, in DOM order, skipping targets nested in another target. Text is
 * split into lines and words: lines get overflow hidden and each line's
 * words rise into place, line after line. Non-text elements (a button, or
 * the logo) rise from behind a clip of their own.
 *
 * Two entry points share one paused timeline:
 *   - `createLineMaskTimeline(container)` returns `play()` and `reverse()`
 *     for a reveal that can run forward and back as often as needed. Used
 *     by scrollEnlargeSnap (F03, F15, F28).
 *   - `prepareLineMaskReveal(container)` returns a one-shot `play()`. Used
 *     by historyStickyYear's landmark gallery (F09).
 *
 * An element counts as text when it is a heading or paragraph, or has the
 * `data-line-mask="text"` attribute. Under prefers-reduced-motion nothing
 * is hidden and both calls are no-ops.
 *
 * Splitting is the expensive part (every split measures layout, and
 * autoSplit re-splits on each font load or resize), so text is split only
 * when it matters (docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md):
 *   - text in the first screen (or one viewport below it) is split in one
 *     batch right after the calling module returns, before the first paint;
 *   - text further down is split when it comes within one viewport of the
 *     screen, or the moment its reveal is played or reversed;
 *   - text that is not rendered (a closed dialog, an inactive slide) is split
 *     when it first plays, or when it first becomes visible.
 * Unsplit text is plain, readable text, so nothing hidden can be missed.
 */

import { isScript } from '$utils/scriptReveal'
import { trackSplit } from '$utils/splitRegistry'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'])
const DURATION = 0.9
const LINE_STAGGER = 0.08
const ELEMENT_STAGGER = 0.12
/** Reverse runs faster than the reveal so a leaving panel clears quickly. */
const REVERSE_SPEED = 1.6
const HIDDEN = { yPercent: 110 }
const SHOWN = { yPercent: 0, duration: DURATION, ease: 'power3.out' }
const WORD_SHOWN = { ...SHOWN, y: 0 }

/**
 * Extra drop (px) a word needs beyond yPercent 110 to clear its line's clip.
 * Zero for ordinary words. A superscript (the mosaic caption number, Stephen
 * 2026-11-17) has a collapsed line height, so its box is far shorter than its
 * glyph (zero tall in the caption) and 110% of it barely moves: the number sat
 * visible while its caption was hidden. Such a word drops by a full font size
 * past the line's bottom edge instead.
 */
const extraDrop = (word: HTMLElement, line: HTMLElement) => {
  const height = word.offsetHeight
  const fontSize = parseFloat(getComputedStyle(word).fontSize)
  if (height >= fontSize) return 0
  // Resting top: undo any transform a rebuild finds mid-tween.
  const shift = Number(gsap.getProperty(word, 'y')) + (Number(gsap.getProperty(word, 'yPercent')) * height) / 100
  const restingTop = word.getBoundingClientRect().top - shift
  return Math.max(0, line.getBoundingClientRect().bottom - restingTop + fontSize - height * 1.1)
}

const TARGET_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, figure, .button, [data-line-mask]'

interface TextPart {
  kind: 'text'
  element: HTMLElement
  /** Each line's words; the words, not the line's children, rise (inline spans ignore transforms). */
  lineWords: HTMLElement[][]
  /** The split lines, index-matched to lineWords (each clips its words). */
  lines: HTMLElement[]
  split: boolean
  /** Creates the SplitText once; later calls do nothing. */
  ensureSplit: () => void
}

interface ElementPart {
  kind: 'element'
  element: HTMLElement
}

type RevealPart = TextPart | ElementPart

export interface LineMaskTimeline {
  play: () => void
  reverse: () => void
  /** Snaps the copy to its hidden start state at once, with no outro (splitting it first if needed). */
  reset: () => void
}

/** Text within this many viewport heights of the screen is split ahead of its reveal. */
const SPLIT_AHEAD = 1

let splitQueue: Array<{ element: HTMLElement; split: () => void }> = []
let splitObserver: IntersectionObserver | null = null

const splitWhenNear = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return
    splitNow(entry.target)
  })
}
const splitCallbacks = new WeakMap<Element, () => void>()

const splitNow = (element: Element) => {
  splitObserver?.unobserve(element)
  const split = splitCallbacks.get(element)
  splitCallbacks.delete(element)
  split?.()
}

/**
 * Text still waiting on the observer is split ahead of time while the page is
 * idle after load, one block per idle moment and never while scrolling, so
 * no split lands mid-scroll (the gallery mosaic captions did). One block at a
 * time keeps the load-time freeze from coming back
 * (docs/solutions/integration-issues/page-load-scroll-freeze-2026-11-16.md).
 * The observer stays as the fallback for anything not reached yet.
 */
const IDLE_MIN_MS = 10
const SCROLL_QUIET_MS = 250
const idleQueue: Element[] = []
let idleStarted = false
let lastScroll = 0

const whenIdle = (callback: (deadline?: IdleDeadline) => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(callback, { timeout: 2000 }) : setTimeout(callback, 200)

const splitNextWhenIdle = (deadline?: IdleDeadline) => {
  const quiet = performance.now() - lastScroll > SCROLL_QUIET_MS
  const roomy = !deadline || deadline.didTimeout || deadline.timeRemaining() >= IDLE_MIN_MS
  if (quiet && roomy) {
    // Skip anything already split, and anything not rendered (a closed dialog), which splits on first show or play.
    let next = idleQueue.shift()
    while (next && (!splitCallbacks.has(next) || !next.getClientRects().length)) next = idleQueue.shift()
    if (next) splitNow(next)
  }
  if (idleQueue.length) whenIdle(splitNextWhenIdle)
}

const queueIdleSplit = (element: Element) => {
  idleQueue.push(element)
  if (idleStarted) return
  idleStarted = true
  window.addEventListener('scroll', () => (lastScroll = performance.now()), { passive: true })
  const start = () => whenIdle(splitNextWhenIdle)
  if (document.readyState === 'complete') start()
  else window.addEventListener('load', start, { once: true })
}

/**
 * Splits the queued text that is in or near the first screen, all in one
 * pass (rects first, so no split interleaves with a measurement), and hands
 * the rest to one shared observer.
 */
const flushSplitQueue = () => {
  const queue = splitQueue
  splitQueue = []
  const viewport = window.innerHeight
  const near = queue.map(({ element }) => {
    const rect = element.getBoundingClientRect()
    // Off to the side (an inactive slide) counts as far away too.
    const onScreenAcross = rect.right > 0 && rect.left < window.innerWidth
    return (
      rect.height > 0 && onScreenAcross && rect.bottom > -viewport * SPLIT_AHEAD && rect.top < viewport * (1 + SPLIT_AHEAD)
    )
  })
  queue.forEach(({ element, split }, index) => {
    if (near[index]) {
      split()
      return
    }
    splitObserver ||= new IntersectionObserver(splitWhenNear, { rootMargin: `${SPLIT_AHEAD * 100}% 0px` })
    splitCallbacks.set(element, split)
    splitObserver.observe(element)
    queueIdleSplit(element)
  })
}

const scheduleSplit = (element: HTMLElement, split: () => void) => {
  if (!splitQueue.length) queueMicrotask(flushSplitQueue)
  splitQueue.push({ element, split })
}

const findTargets = (container: HTMLElement, exclude?: string) => {
  // Script headings write themselves in (scriptReveal), so they are never masked here, tagged or not.
  // Elements a variant hides (display: none) take no stagger slot: the Book menu's hidden figures and texts held its rows back by seconds (Stephen 18 Nov).
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).filter(
    (candidate) =>
      !isScript(candidate) &&
      !(exclude && candidate.matches(exclude)) &&
      getComputedStyle(candidate).display !== 'none',
  )
  // A bare paragraph or heading passed as the container is its own target.
  if (!candidates.length && container.matches(TARGET_SELECTOR) && !isScript(container)) return [container]
  return candidates.filter(
    (candidate) =>
      !candidates.some((other) => other !== candidate && other.contains(candidate)),
  )
}

const isText = (element: HTMLElement) =>
  element.dataset.lineMask === 'text' || TEXT_TAGS.has(element.tagName)

/**
 * Builds a paused, reversible reveal for `container`. The timeline is
 * rebuilt whenever SplitText re-splits (font swap, resize), keeping its
 * progress and the last requested direction.
 */
export const createLineMaskTimeline = (
  container: HTMLElement,
  speed = 1,
  exclude?: string,
): LineMaskTimeline => {
  const elements = findTargets(container, exclude)
  if (!elements.length || window.matchMedia(REDUCED_MOTION).matches) {
    return { play: () => undefined, reverse: () => undefined, reset: () => undefined }
  }

  const timeline = gsap.timeline({ paused: true })
  let direction: 'forward' | 'reverse' | null = null
  const parts: RevealPart[] = []

  const runDirection = () => {
    if (direction === 'forward') timeline.timeScale(speed).play()
    else if (direction === 'reverse') timeline.timeScale(REVERSE_SPEED).reverse()
  }

  let builtParts = 0
  let rebuildQueued = false
  const rebuild = () => {
    const splitParts = parts.filter((part) => part.kind === 'element' || part.split)
    // Keep the playhead through a re-split (same parts, so progress holds). A
    // part that joined late keeps the time instead, so what already played stays shown.
    const progress = timeline.progress()
    const time = timeline.time()
    const joined = splitParts.length !== builtParts
    builtParts = splitParts.length
    timeline.clear()
    splitParts.forEach((part) => {
      const offset = parts.indexOf(part) * ELEMENT_STAGGER
      if (part.kind === 'text') {
        part.lineWords.forEach((words, lineIndex) => {
          const line = part.lines[lineIndex]
          timeline.fromTo(
            words,
            { ...HIDDEN, y: (_index: number, word: HTMLElement) => (line ? extraDrop(word, line) : 0) },
            WORD_SHOWN,
            offset + lineIndex * LINE_STAGGER,
          )
        })
        return
      }
      timeline.fromTo(part.element, HIDDEN, SHOWN, offset)
    })
    if (joined) timeline.time(time)
    else timeline.progress(progress)
    runDirection()
  }

  /** Re-splits of many elements land together (a font loads); rebuild once per batch. */
  const queueRebuild = () => {
    if (rebuildQueued) return
    rebuildQueued = true
    queueMicrotask(() => {
      rebuildQueued = false
      rebuild()
    })
  }

  elements.forEach((element) => {
    if (isText(element)) {
      let splitStarted = false
      const part: TextPart = {
        kind: 'text',
        element,
        lineWords: [],
        lines: [],
        split: false,
        ensureSplit: () => {
          if (splitStarted) return
          splitStarted = true
          trackSplit(element, {
            type: 'lines,words',
            autoSplit: true,
            onSplit: (self) => {
              // Clip on the lines themselves, never `mask: 'lines'` (see the GSAP
              // module conventions, rule 7). The timeline is owned here, so
              // nothing is returned for SplitText to revert.
              const lines = self.lines ?? []
              // An empty paragraph splits into no lines, and GSAP warns about an empty target.
              if (lines.length) gsap.set(lines, { overflow: 'hidden' })
              const words = self.words ?? []
              part.lineWords = lines.map((line) => words.filter((word) => line.contains(word)))
              part.lines = lines as HTMLElement[]
              part.split = true
              queueRebuild()
            },
          })
        },
      }
      parts.push(part)
      scheduleSplit(element, part.ensureSplit)
      return
    }
    wrapInClip(element)
    parts.push({ kind: 'element', element })
  })
  // Element-only containers have nothing to wait for.
  if (parts.every((part) => part.kind === 'element')) rebuild()

  /** A reveal that is about to run needs its text split, whether or not it was near. */
  const ensureAllSplit = () => {
    parts.forEach((part) => {
      if (part.kind === 'text') part.ensureSplit()
    })
  }

  return {
    play: () => {
      if (direction === 'forward') return
      direction = 'forward'
      ensureAllSplit()
      runDirection()
    },
    reverse: () => {
      if (direction === 'reverse') return
      direction = 'reverse'
      ensureAllSplit()
      runDirection()
    },
    reset: () => {
      direction = null
      // Split now, so text that was never shown starts hidden instead of jumping when it plays.
      ensureAllSplit()
      timeline.pause().progress(0)
    },
  }
}

/** One-shot reveal: `play()` runs the mask-in once; later calls do nothing. `speed` above 1 plays it faster. */
export const prepareLineMaskReveal = (container: HTMLElement, speed = 1) => {
  const reveal = createLineMaskTimeline(container, speed)
  let played = false
  return {
    play: () => {
      if (played) return
      played = true
      reveal.play()
    },
  }
}

/**
 * Puts a non-text element inside a block that clips it. A wrapper (not
 * overflow on the element itself) keeps a chamfered button's own shape
 * intact.
 */
const wrapInClip = (element: HTMLElement) => {
  const parent = element.parentElement
  if (!parent || parent.dataset.lineMaskClip !== undefined) return
  const clip = document.createElement('div')
  clip.dataset.lineMaskClip = ''
  const display = getComputedStyle(element).display
  clip.style.display = display.startsWith('inline') ? 'inline-block' : 'block'
  clip.style.overflow = 'hidden'
  parent.insertBefore(clip, element)
  clip.appendChild(element)
}
