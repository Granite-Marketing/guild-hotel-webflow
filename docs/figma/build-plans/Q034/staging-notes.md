# Q034 staging check: /wellness

Checked https://the-guild-hotel-c34e71.webflow.io/wellness with Playwright chromium at 1440x900 and 390x844 on 2026-10-20. Screenshots: `staging-1440-top.png`, `staging-1440-start.png`, `staging-1440-snap.png`, `staging-390.png`.

## Pass

- Order: site nav, hero, wellness snap section (`data-scroll-enlarge-snap`), offers slider, faq-accordion, CTA, footer. No broken images; no horizontal overflow at 390.
- scrollEnlargeSnap at 1440: frame 1132px at scroll top, grows to 1400px (stage minus 20px gutters), then panels 1 to 4 and the tabs activate in turn (scrollY 2454, 3172, 3913, 4823). At 390 the frame keeps 358px width and grows in height from 448 to 812px; panels 2 to 4 activate at scrollY 2827, 3605, 4471. Clicking the third tab activates panel 3 at both widths.
- Tab pill is above the panels throughout the enlarge and the snap.
- Offers slider: Swiper initialised, 5 slides, counter "01 / 05", slide 1 "wellness staycation".
- No console errors from the site bundle.

## Mismatches and notes

1. The tab pill sits about 50px above the frame bottom; Figma has it a little lower.
2. At 390 the tab pill is wider than the frame, so "fitness center" is clipped (horizontal scroll on the pill).
3. Offers slider image half is the grey slot (no offer photos yet). Its "offers & packages" label overlaps the nav text at the top left while the nav is over it.
4. The light Site Nav text is low contrast over the cream intro; only the hero shows it as intended. Same on other pages using the base nav.
5. Console noise only: "GSAP target .slide-in / .fade-in not found" warnings, Turnstile CSP errors, WebGL ReadPixels, one WOFF2 OTS parse error.
