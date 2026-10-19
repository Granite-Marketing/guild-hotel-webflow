/**
 * Hero Text Reveal
 *
 * On-load word-by-word reveal for the page's hero heading, with optional
 * follower elements (CTA, badge, modal trigger) joining the same timeline so
 * they stay in sync with the text intro.
 *
 * DOM contract:
 *   <h1 data-hero-title>Heading text</h1>   first match on the page is used
 *   <div data-hero-reveal>...</div>          optional, any number, anywhere
 *
 * Lines get `overflow: hidden` and words rise in (no SplitText
 * `mask: 'lines'`, which changes inline wrapping). autoSplit re-resolves
 * line breaks after font swap or resize; returning the timeline from onSplit
 * lets SplitText restart it cleanly on resplit.
 *
 * Pre-hide `[data-hero-title]` and `[data-hero-reveal]` in CSS to avoid a
 * flash before the bundle runs (docs/reference/js-loading-flash-prevention.md).
 */

export const heroTextReveal = () => {
  const heroTitle = document.querySelector<HTMLElement>('[data-hero-title]')
  if (!heroTitle) return

  const followerElements = Array.from(
    document.querySelectorAll<HTMLElement>('[data-hero-reveal]'),
  )

  new SplitText(heroTitle, {
    types: 'words, lines',
    autoSplit: true,
    onSplit: (self: SplitTypeInstance) => {
      gsap.set(self.lines ?? [], { overflow: 'hidden' })

      const timeline = gsap.timeline()

      timeline.fromTo(
        self.words,
        { y: '110%' },
        { y: '0%', duration: 1, ease: 'power4.out', stagger: 0.05 },
      )

      if (followerElements.length) {
        timeline.fromTo(
          followerElements,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 1, ease: 'power4.out', stagger: 0.05 },
          '-=0.6',
        )
      }

      return timeline
    },
  })
}
