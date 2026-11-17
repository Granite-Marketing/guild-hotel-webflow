head: 0e6664f3735b9521cf439114f826b50e1518baf8
round: 1

## Actionable findings
- P2 #3 src/utils/scrollReveal.ts:214 fade-only hides form fields and FAQ rows from Tab and screen readers until scrolled to (autoAlpha sets visibility:hidden; breaks "keyboard and screen reader behaviour unchanged") (autofix: manual) fix: in playFadeOnly animate `opacity` (not autoAlpha) for interactive rows (form fields, accordion items), or also play the reveal on `focusin` of the hidden element
- P2 #5 src/utils/tabDropdown.ts:169 interrupted open/close timeline still fires onComplete (killTweensOf kills children, not the parent timeline), so reopening mid-close strips is-open and clears inline styles while aria-expanded says open (autofix: gated_auto) fix: keep `let activeTimeline: gsap.core.Timeline | undefined`, call `activeTimeline?.kill()` at the top of setOpen and assign each new timeline to it; add a Playwright case clicking the toggle twice within 200ms
- P3 #8 src/utils/accordion.ts:69 #230 fix covers only browsers with scroll anchoring; the builder's own diagnosis says WebKit (iPhone) is untouched, so "no jump scrolling into the footer at 390" is unproven on iOS (autofix: manual) fix: on the content wrapper's `transitionend` after a toggle, call `ScrollTrigger.refresh(true)` once (discrete content-size change, allowed by CLAUDE.md) instead of waiting for the observer, and keep the iPhone check in the release ticket
- P3 #1 src/utils/focusRing.ts:61 a keyboard user tabbing in from the browser chrome gets no ring on the first stop (keyboardActive starts false and that Tab never reaches the page) (autofix: gated_auto) fix: in focusin, do not quiet when `target.matches(':focus-visible')` and no pointer input has been seen since the last focus change; keep quieting tabindex="-1" targets
- P3 #9 src/utils/focusRing.ts:37 script focus is detected only on tabindex="-1" targets; a script that focuses a normal control after a keypress (e.g. a modal close button focused on open) still draws a ring, against "never on elements the scripts focus programmatically" (autofix: manual) fix: also quiet focus whose target is not the element the last keydown/Tab moved to, e.g. record `event.target` on keydown and quiet a focusin that arrives without a Tab key since that keydown
- P3 #10 src/utils/scrollReveal.ts:151 Home collage on mobile uses delay 0, so images entering the viewport together fade together, not "one by one" (autofix: gated_auto) fix: give each `.home-art-stories_trail-figure` a per-index delay (0.1s step, cap 0.5s) the way STAGGERED_REVEALS does
- P3 #11 src/utils/directionsLinks.ts:13 `link.rel = 'noopener'` overwrites any existing rel (e.g. nofollow) (autofix: gated_auto) fix: `link.relList.add('noopener')`
- P3 #2 tests/visual/scroll-reveal-fade-only.spec.ts:1 room gallery image-fade (scrollReveal.ts:180) and Corporate mobile image-fade have no test (autofix: manual) fix: add a room-page marker plus `.gallery-mosaic-captioned_figure` and a `.feature-grid-dark-eyebrow_item` figure at 390 to the fixture, assert opacity 0 then 1 and transform cleared; assert desktop leaves Corporate alone
- P3 #12 tests/visual/tab-dropdown.spec.ts:104 outside-click close assertion is vacuous (dropdown already closed by Escape) (autofix: gated_auto) fix: open the dropdown, click `[data-fixture="after"]`, assert aria-expanded=false and is-open removed after the close tween
- P3 #13 docs/reference/runtime-modules.md:1 new modules focusRing, heroImageScale, directionsLinks and the stickyCta `dockFromLoad` option are not in the runtime modules reference (CLAUDE.md: each module's DOM contract lives there) (autofix: gated_auto) fix: add one row each with DOM contract and init order

## Spec
- #230 "No jump scrolling into the footer on Home and Rooms at 390 and 1440": partial. Diagnosis and evidence are in docs/builds/228/notes/230.md (scroll anchoring, 252px fixture drop, staging probe, refresh count) and the CLAUDE.md refresh rules are kept with reasons, so "Diagnosis in the PR" and "refresh rules still hold" are covered once the PR body carries the note. iOS is acknowledged as unaddressed (finding #8).
- #235 "Tab key still shows a visible ring on every control" and "No focus ring after a tap or click": mostly met; edge cases in findings #1 and #9.
- #234 "keyboard and screen reader behaviour unchanged": the reopen race (#5) can leave aria-expanded=true with a collapsed list.
- #233 "Home collage images fade in one by one on mobile": partial (#10). "Corporate row images ... (once the Webflow ticket adds them)": selector is a flagged guess, acceptable under the Done-when wording. "Fade-only option documented in the module header and runtime modules reference": met. FAQ rows keyed on `.faq-accordion_list`; confirm on every FAQ page at live check.
- #232 "PR names the commit it restores from": met (e5ed47c, in notes/232.md). Note the gallery lost its reveal through a Designer change, so the "restore" re-tags the existing image-fade from code with today's values (1.04, 0.7s), not the e5ed47c values. Hero scale-in is scale-only, clipped by the frame, still under reduced motion; text mask untouched.
- #231: dockFromLoad plus inline important dock styles; end selector now `.section_card-carousel-header-left` (Other dining options) first; notes/231.md records why earlier fixes did not hold.
- Behaviour nobody asked for: fade-only stagger applies to every `form-split-script-contact` form, not only the RFP (flagged ASSUMPTION in code); docs/reference/site-head/script-tilt.css tilts George Marston on phones, which may overlap the companion Webflow spec ("must not collide").
- `pnpm check`, `pnpm test:factory`, `pnpm build` lines are the validator's job; reviewers noted most new visual specs load GSAP/Lenis from jsDelivr and are not part of test:factory.

## Standards
- No hard violations of CLAUDE.md Custom Code Delivery rules (module pattern, naming, autoAlpha, no inline display, refresh rules, vh/vw, no em dashes).
- Judgement: src/utils/tabDropdown.ts extends its pre-existing bundle-injected STYLES string (CLAUDE.md "The Designer must show what ships": custom CSS goes in an embed). Not new debt, but grows it.
- Judgement: src/utils/stickyCta.ts docks with inline `!important` styles instead of only toggling the non-default class (docs/solutions/conventions/gsap-module-conventions.md); justified in the module header (hero line mask rewrites the inline style) and is-stuck still toggles.
- Runtime modules reference not updated for the new modules (finding #13).
- No ticket named a convention id that the diff breaks.

## Build vs buy lens
none (no approved libraries declared; the diff hand-rolls nothing a library on the canon covers)

## Verdict
fix-first: two P2 behaviour bugs (fade-only reveals hide form fields and FAQ rows from keyboard users, and the subnav reopen race) break the "keyboard and screen reader behaviour unchanged" requirement and are small, local fixes.
