import { useId, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export interface ExampleSectionProps {
  eyebrow: string
  heading: string
  body: string
  theme: 'Light' | 'Dark'
  headingLevel?: 'h2' | 'h3'
}

export function ExampleSection({ eyebrow, heading, body, theme, headingLevel = 'h2' }: ExampleSectionProps) {
  const isDark = theme === 'Dark'
  const section = useRef<HTMLElement>(null)
  const headingId = `example-section-${useId().replaceAll(':', '')}`
  const Heading = headingLevel

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.from('[data-animate-item]', {
      autoAlpha: 0,
      y: 24,
      duration: 0.65,
      stagger: 0.08,
      ease: 'power2.out',
    })
  }, { scope: section })

  return (
    <section
      ref={section}
      aria-labelledby={headingId}
      data-component="example-section"
      className={isDark ? 'bg-foreground text-background' : 'bg-background text-foreground'}
    >
      <div className="mx-auto max-w-site px-8 py-24 wf-tablet:py-20 wf-mobile-landscape:px-5 wf-mobile-landscape:py-16">
        <article className="grid gap-6">
          <header className="grid max-w-3xl gap-3">
            <p data-animate-item className="text-sm font-semibold uppercase tracking-wider">{eyebrow}</p>
            <Heading data-animate-item id={headingId} className="font-heading text-display leading-tight wf-tablet:text-display-tablet wf-mobile-portrait:text-display-mobile">
              {heading}
            </Heading>
          </header>
          <p data-animate-item className="max-w-2xl text-lg leading-relaxed">{body}</p>
        </article>
      </div>
    </section>
  )
}
