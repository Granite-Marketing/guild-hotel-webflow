/**
 * Line Mask Reveal (helper, not wired in index.ts)
 *
 * Prepares a container for a one-shot line mask-in. The targets are its
 * headings, paragraphs, figures (logos), `.button`s and any
 * `[data-line-mask]` element, in DOM order, skipping targets nested in
 * another target. Text is split
 * into lines and words: lines get overflow hidden and each line's words
 * rise into place, line after line. Non-text elements (a button, or the
 * logo) rise from behind a clip of their own. Returns
 * `play()`, which runs the reveal once; later calls do nothing. Used by
 * scrollEnlargeSnap (F03) and historyStickyYear's landmark gallery (F09).
 *
 * An element counts as text when it is a heading or paragraph, or has the
 * `data-line-mask="text"` attribute. Under prefers-reduced-motion nothing is hidden and
 * `play()` is a no-op.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'])
const DURATION = 0.9
const LINE_STAGGER = 0.08
const ELEMENT_STAGGER = 0.12

const TARGET_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, figure, .button, [data-line-mask]'

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

export const prepareLineMaskReveal = (container: HTMLElement) => {
  const elements = findTargets(container)
  let played = false
  if (!elements.length || window.matchMedia(REDUCED_MOTION).matches) {
    return { play: () => undefined }
  }

  const playFunctions = elements.map((element) => {
    if (isText(element)) {
      let lines: HTMLElement[] = []
      let pendingDelay: number | null = null
      new SplitText(element, {
        types: 'lines,words',
        autoSplit: true,
        onSplit: (self) => {
          lines = self.lines ?? []
          // Clip on the lines themselves, never `mask: 'lines'` (see the
          // GSAP module conventions, rule 7).
          gsap.set(lines, { overflow: 'hidden' })
          if (played && pendingDelay === null) return undefined
          gsap.set(self.words ?? [], { yPercent: 110 })
          if (pendingDelay === null) return undefined
          const delay = pendingDelay
          pendingDelay = null
          return revealLines(lines, delay)
        },
      })
      return (delay: number) => {
        if (!lines.length) {
          pendingDelay = delay
          return
        }
        revealLines(lines, delay)
      }
    }

    wrapInClip(element)
    gsap.set(element, { yPercent: 110 })
    return (delay: number) =>
      gsap.to(element, { yPercent: 0, duration: DURATION, ease: 'power3.out', delay })
  })

  const play = () => {
    if (played) return
    played = true
    playFunctions.forEach((playElement, index) => playElement(index * ELEMENT_STAGGER))
  }

  return { play }
}

/** Each line's words rise together, one line after another. */
const revealLines = (lines: HTMLElement[], delay: number) => {
  const timeline = gsap.timeline({ delay })
  lines.forEach((line, index) => {
    timeline.to(
      line.children,
      { yPercent: 0, duration: DURATION, ease: 'power3.out' },
      index * LINE_STAGGER,
    )
  })
  return timeline
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
