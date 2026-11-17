# Two-axis review, build 228, round 1 (head 0e6664f)

## Standards (Sonnet sub-agent, lightly cleaned)

Hard violations: none. Module pattern, clean naming, SplitText, autoAlpha, vh/vw and em-dash rules all hold; no new refresh() calls; reduced motion honoured in heroImageScale, tabDropdown, scrollReveal.

Judgement calls:
1. src/utils/tabDropdown.ts edits its pre-existing bundle-injected STYLES string (adds overflow:hidden and :not(.is-closing) selectors). CLAUDE.md / designer-visible-css-embed-component.md say custom CSS belongs in an embed. Pre-existing debt extended, no new injected stylesheet.
2. Inline styles from JS: focusRing (outline:none), accordion (overflow-anchor on html), stickyCta (inline !important dock styles). None sets display:none. stickyCta's inline styles depart from "toggle only the non-default class" (gsap-module-conventions.md); the module header explains why (hero line mask rewrites the inline style), and is-stuck is still toggled.
3. focusRing has no selector-presence guard (global listener module; rule does not fit cleanly). docs/reference/runtime-modules.md does not list focusRing, heroImageScale, directionsLinks or the dockFromLoad option (fade-only is documented).

## Spec (Sonnet sub-agent, lightly cleaned)

(a) Missing or partial
1. #230 "No jump scrolling into the footer on Home and Rooms at 390 and 1440": fix is overflow-anchor:none for 700ms per FAQ toggle (src/utils/accordion.ts:61-69). The builder note itself says WebKit has no scroll anchoring, so iOS is untouched; Home footer jump without a FAQ toggle is not separately addressed. Partial pending live check.
2. #235 "never on elements the scripts focus programmatically": focusRing only treats tabindex="-1" targets as script focus (src/utils/focusRing.ts:37); a script-focused control without tabindex=-1 after a keypress still rings.
3. #233 Corporate row image selector is a guess (scrollReveal.ts MOBILE_REVEALS, flagged ASSUMPTION); matches nothing until the Webflow ticket lands (Done-when allows this).
4. #233 "Home collage images fade in one by one on mobile": MOBILE_REVEALS uses delay 0; images entering together appear together.
5. #233 FAQ rows keyed on .faq-accordion_list; not confirmed present on every FAQ page.
(b) Scope creep
- Fade-only stagger applies to every form-split-script-contact form (not only RFP); marked ASSUMPTION.
- script-tilt.css moves the George Marston tilt to all widths (a Designer-paste reference file); possible overlap with the companion Webflow spec.
(c) Looks wrong or risky
- #232 room gallery: e5ed47c exists and introduced image-fade; the gallery lost it via a Designer attribute change, so the "restore" re-tags from code with today's image-fade values (1.04, 0.7s). The note says so honestly; commit is named.
- Hero scale: scale-only, frame overflow hidden, reduced motion still. Runs at load without waiting for the image.
- Sticky CTA: dockFromLoad + inline !important looks sound; end selector adds .section_card-carousel-header-left; the 231 note names the earlier commits and why they did not hold.
- Subnav: is-closing / expanded logic reasonable; links clickable during close.

Summary: Standards 0 hard, 3 judgement calls. Spec 5 partial, 2 scope notes, 0 clearly wrong. Worst: #230 iOS path unaddressed (live verification).
