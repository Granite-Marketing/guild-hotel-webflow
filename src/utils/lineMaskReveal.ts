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
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'])
const DURATION = 0.9
const LINE_STAGGER = 0.08
const ELEMENT_STAGGER = 0.12
/** Reverse runs faster than the reveal so a leaving panel clears quickly. */
const REVERSE_SPEED = 1.6
const HIDDEN = { yPercent: 110 }
const SHOWN = { yPercent: 0, duration: DURATION, ease: 'power3.out' }

const TARGET_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, figure, .button, [data-line-mask]'

interface TextPart {
  kind: 'text'
  element: HTMLElement
  lines: HTMLElement[]
  split: boolean
}

interface ElementPart {
  kind: 'element'
  element: HTMLElement
}

type RevealPart = TextPart | ElementPart

export interface LineMaskTimeline {
  play: () => void
  reverse: () => void
}

const findTargets = (container: HTMLElement) => {
  const candidates = Array.from(container.querySelectorAll<HTMLElement>(TARGET_SELECTOR))
  // A bare paragraph or heading passed as the container is its own target.
  if (!candidates.length && container.matches(TARGET_SELECTOR)) return [container]
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
export const createLineMaskTimeline = (container: HTMLElement): LineMaskTimeline => {
  const elements = findTargets(container)
  if (!elements.length || window.matchMedia(REDUCED_MOTION).matches) {
    return { play: () => undefined, reverse: () => undefined }
  }

  const timeline = gsap.timeline({ paused: true })
  let direction: 'forward' | 'reverse' | null = null
  const parts: RevealPart[] = []

  const runDirection = () => {
    if (direction === 'forward') timeline.timeScale(1).play()
    else if (direction === 'reverse') timeline.timeScale(REVERSE_SPEED).reverse()
  }

  const rebuild = () => {
    // Wait until every text target has been split.
    if (parts.some((part) => part.kind === 'text' && !part.split)) return
    const progress = timeline.progress()
    timeline.clear()
    parts.forEach((part, index) => {
      const offset = index * ELEMENT_STAGGER
      if (part.kind === 'text') {
        part.lines.forEach((line, lineIndex) => {
          timeline.fromTo(line.children, HIDDEN, SHOWN, offset + lineIndex * LINE_STAGGER)
        })
        return
      }
      timeline.fromTo(part.element, HIDDEN, SHOWN, offset)
    })
    timeline.progress(progress)
    runDirection()
  }

  // Register every part before splitting, so the first rebuild waits for
  // all text targets instead of building from the first one alone.
  elements.forEach((element) => {
    if (isText(element)) {
      parts.push({ kind: 'text', element, lines: [], split: false })
      return
    }
    wrapInClip(element)
    parts.push({ kind: 'element', element })
  })

  parts.forEach((part) => {
    if (part.kind !== 'text') return
    new SplitText(part.element, {
      type: 'lines,words',
      autoSplit: true,
      onSplit: (self) => {
        // Clip on the lines themselves, never `mask: 'lines'` (see the GSAP
        // module conventions, rule 7). The timeline is owned here, so
        // nothing is returned for SplitText to revert.
        const lines = self.lines ?? []
        gsap.set(lines, { overflow: 'hidden' })
        part.lines = lines
        part.split = true
        rebuild()
      },
    })
  })
  rebuild()

  return {
    play: () => {
      direction = 'forward'
      runDirection()
    },
    reverse: () => {
      direction = 'reverse'
      runDirection()
    },
  }
}

/** One-shot reveal: `play()` runs the mask-in once; later calls do nothing. */
export const prepareLineMaskReveal = (container: HTMLElement) => {
  const reveal = createLineMaskTimeline(container)
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
