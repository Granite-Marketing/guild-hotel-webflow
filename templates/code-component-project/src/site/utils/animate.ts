/**
 * Entrance reveals for the hooks the react-to-native build emits:
 *   [data-animate-title] — section header items (eyebrow, heading, intro)
 *   [data-animate-item]   — card / content items
 *
 * Reduced-motion is honoured (no animation, elements stay visible). GSAP and
 * ScrollTrigger are CDN globals loaded before this bundle (see src/site/types/cdn.d.ts).
 */

export const animate = (): void => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const reveal = (selector: string, opts: { y: number; stagger: number }) => {
    const els = document.querySelectorAll<HTMLElement>(selector)
    els.forEach((el) => {
      gsap.from(el, {
        autoAlpha: 0,
        y: opts.y,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })
  }

  reveal('[data-animate-title]', { y: 24, stagger: 0.08 })
  reveal('[data-animate-item]', { y: 16, stagger: 0.06 })
}
