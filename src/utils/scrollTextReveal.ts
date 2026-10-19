/**
 * Scroll Text Reveal
 *
 * Scroll-triggered line-by-line text reveal for `[data-scroll-text-reveal]`.
 *
 * DOM contract:
 *   <h2 data-scroll-text-reveal>Heading text</h2>
 *       a text element: its lines rise in, staggered
 *   <div data-scroll-text-reveal><h2>...</h2><p>...</p></div>
 *       a wrapper: each child becomes its own line group, delayed by index
 *
 * Each line gets `overflow: hidden` and its words rise from below. SplitText
 * `mask: 'lines'` is deliberately NOT used: it adds a second inline-block
 * layer per line that changes whitespace handling, so short phrases wrap
 * onto extra lines.
 *
 * Waits for document.fonts.ready so the first split measures the final
 * webfont (autoSplit handles later font swaps and resizes), then refreshes
 * ScrollTrigger in a rAF once layout has committed. Pre-hide the targets in
 * CSS to avoid a flash before fonts resolve (see
 * docs/reference/js-loading-flash-prevention.md).
 *
 * Do not put this on elements whose spans another hover script owns (for
 * example a text-roll button): the split would rewrap those spans.
 */

const WORD_CLASS = 'scroll-text-reveal_word'

interface RevealTiming {
  duration: number
  lineStagger: number
  delay: number
}

const revealLines = (
  target: HTMLElement,
  triggerElement: HTMLElement,
  timing: RevealTiming,
) => {
  new SplitText(target, {
    types: 'words, lines',
    wordsClass: WORD_CLASS,
    autoSplit: true,
    onSplit: (self: SplitTypeInstance) => {
      const lines = self.lines ?? []
      gsap.set(lines, { overflow: 'hidden' })

      const timeline = gsap.timeline({
        delay: timing.delay,
        scrollTrigger: {
          trigger: triggerElement,
          start: 'top 80%',
          end: 'bottom 20%',
        },
      })

      lines.forEach((line, index) => {
        timeline.fromTo(
          line.querySelectorAll(`.${WORD_CLASS}`),
          { y: '110%' },
          { y: '0%', duration: timing.duration, ease: 'power4.out' },
          index * timing.lineStagger,
        )
      })

      return timeline
    },
  })
}

export const scrollTextReveal = () => {
  const revealElements = document.querySelectorAll<HTMLElement>('[data-scroll-text-reveal]')
  if (!revealElements.length) return

  document.fonts.ready.then(() => {
    revealElements.forEach((element) => {
      if (element.children.length > 0) {
        Array.from(element.children).forEach((child, index) => {
          revealLines(child as HTMLElement, element, {
            duration: 0.75,
            lineStagger: 0.05,
            delay: index * 0.75,
          })
        })
        return
      }

      revealLines(element, element, { duration: 1, lineStagger: 0.15, delay: 0 })
    })

    requestAnimationFrame(() => ScrollTrigger.refresh(true))
  })
}
