# Site custom code (R00)

What Site Settings > Custom Code holds on site `6ad6405eae8eac6d7b7c41a3`, and the exact content to paste. The bundle and its CDN globals load once, site-wide; pages carry no script code of their own.

## Release

- **Bundle version:** v1.1.8 (release commit `da39be9`, tag `v1.1.8` pushed; jsDelivr serves it, byte-identical to `dist/index.js`).
- **Tag URL:** `https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@v1.1.8/dist/index.js`
- **Footer state:** staging footer names v1.1.8, written on 2026-10-26 with `data_scripts_tool` > `set_site_freeform_code` (location `footer`); the earlier permission block no longer applied.
- **Repo visibility:** public since 2026-10-20 (jsDelivr only serves public repos).

## GSAP comes from Webflow, not the footer

Since Webflow's GSAP 3.15 rewrite, Webflow loads GSAP itself on every published page: `gsap`, `ScrollTrigger` and `SplitText` from `cdn.prod.website-files.com/gsap/3.15.0/`, followed by an inline `gsap.registerPlugin(ScrollTrigger,SplitText)`. These tags sit before the site footer code, so the footer must not add its own GSAP tags (a second copy would replace the global and drop the registration). The site footer holds only Lenis, Swiper and the bundle.

## Site head (after the existing font-smoothing style)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">
```

F34 (button hover) adds a second block to the head. It is keyed off the `[data-btn]` / `[data-btn-fill]` attributes that `src/utils/buttonHover.ts` sets, so write the head before the footer bundle that wraps the labels (the other order shows a stacked duplicate label). Keep the existing head content and append:

```html
<style data-button-hover>
/* F34 button hover: fill from the bottom, label rolls up. Elements get [data-btn] from src/utils/buttonHover.ts. */
:root{--btn-chamfer:polygon(0 .75rem,.6875rem 0,calc(100% - .6875rem) 0,100% .75rem,100% calc(100% - .75rem),calc(100% - .6875rem) 100%,.6875rem 100%,0 calc(100% - .75rem));--btn-ease:cubic-bezier(.65,0,.35,1);--btn-dur:.45s}
/* Colours: --btn-fill is the hover background, --btn-ink the hover label. Default = cream button with dark label. */
.button,.offers-slider-split_button,.overlay-detail-panel-modal_button,.overlay-detail-panel-modal_item-button{--btn-fill:var(--_primitives---colors--neutral-darkest);--btn-ink:var(--_primitives---colors--neutral-lightest)}
.button:not(.is-chamfer){--btn-fill:var(--_primitives---colors--white);--btn-ink:var(--_primitives---colors--neutral-darkest)}
.button.is-chamfer.is-dark,.overlay-detail-panel-modal_button{--btn-fill:var(--_primitives---colors--neutral-lightest);--btn-ink:var(--_primitives---colors--neutral-darkest)}
.button.is-chamfer.is-text-burgundy,.offers-slider-split_button,.overlay-detail-panel-modal_item-button{--btn-fill:var(--_primitives---colors--burgundy);--btn-ink:var(--_primitives---colors--neutral-lightest)}
.button.is-chamfer.is-burgundy{--btn-fill:var(--_primitives---colors--secondary);--btn-ink:var(--_primitives---colors--burgundy)}
.button.is-chamfer.is-blue{--btn-fill:var(--_primitives---colors--secondary);--btn-ink:var(--_primitives---colors--blue)}
.button.is-chamfer.is-outline-light{--btn-fill:var(--_primitives---colors--neutral-lightest);--btn-ink:var(--_primitives---colors--neutral-darkest)}
.button.is-chamfer.is-outline-light.is-active{--btn-fill:var(--_primitives---colors--burgundy);--btn-ink:var(--_primitives---colors--neutral-lightest)}
.button:where(.w-variant-81c5f9ea-386b-7949-fba8-9ed7d1d78407){--btn-fill:var(--_primitives---colors--secondary);--btn-ink:var(--_primitives---colors--burgundy)}
.button:where(.w-variant-e8c11cfd-fe49-cdf5-9556-32d89df58988){--btn-fill:var(--_primitives---colors--secondary);--btn-ink:var(--_primitives---colors--blue)}
.offers-slider-split_button:where(.w-variant-1993beed-24b7-3024-c815-349d23e9e282){--btn-fill:#b2c5d5;--btn-ink:var(--_primitives---colors--neutral-darkest)}
.offers-slider-split_button:where(.w-variant-33c1374c-e0f0-7e2f-88ab-e318ee666728){--btn-fill:var(--_primitives---colors--tan);--btn-ink:var(--_primitives---colors--neutral-lightest)}
/* Text links (is-link) roll the label only: no fill layer. */
.button.is-link{--btn-fill:transparent;--btn-ink:currentColor}
.button.is-link.text-style-caps-caption-16 [data-btn-label]>span{text-decoration:underline;text-underline-offset:.25em}
/* Fill layer (anchors and other elements that can hold children). */
[data-btn]{position:relative;isolation:isolate;overflow:hidden}
[data-btn]::before{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(var(--btn-fill),var(--btn-fill)) no-repeat bottom/100% 0;clip-path:var(--btn-chamfer);transition:background-size var(--btn-dur) var(--btn-ease)}
.button:not(.is-chamfer)[data-btn]::before{clip-path:none}
/* Label roll: two stacked spans in one grid cell, clipped by the wrapper. */
[data-btn-label]{display:inline-grid;overflow:hidden;padding-block:.2em;margin-block:-.2em;vertical-align:top}
[data-btn-label]>span{grid-area:1/1;display:block;transition:transform var(--btn-dur) var(--btn-ease)}
[data-btn-label]>[data-btn-copy]{transform:translateY(calc(100% + .4em));color:var(--btn-ink)}
/* Submit inputs cannot hold children: fill only, growing from the bottom edge. */
input[data-btn-fill]{background-image:linear-gradient(var(--btn-fill),var(--btn-fill));background-repeat:no-repeat;background-position:bottom;background-size:100% 0;transition:background-size var(--btn-dur) var(--btn-ease),color var(--btn-dur) var(--btn-ease)}
@media (hover:hover){
 [data-btn]:hover::before{background-size:100% 100%}
 [data-btn]:hover [data-btn-label]>:first-child{transform:translateY(calc(-100% - .4em))}
 [data-btn]:hover [data-btn-copy]{transform:none}
 input.button[data-btn-fill]:hover{background-size:100% 100%;color:var(--btn-ink)}
}
[data-btn]:focus-visible::before{background-size:100% 100%}
[data-btn]:focus-visible [data-btn-label]>:first-child{transform:translateY(calc(-100% - .4em))}
[data-btn]:focus-visible [data-btn-copy]{transform:none}
input.button[data-btn-fill]:focus-visible{background-size:100% 100%;color:var(--btn-ink)}
/* Reduced motion: no movement, a plain colour change. */
@media (prefers-reduced-motion:reduce){
 [data-btn]::before{background-size:100% 100%;opacity:0;transition:opacity .15s linear}
 [data-btn-label]>[data-btn-copy]{display:none}
 [data-btn-label]>span{transition:color .15s linear}
 input[data-btn-fill]{transition:none}
 [data-btn]:focus-visible::before{opacity:1}
 [data-btn]:focus-visible [data-btn-label]>:first-child{transform:none;color:var(--btn-ink)}
}
@media (prefers-reduced-motion:reduce) and (hover:hover){
 [data-btn]:hover::before{opacity:1}
 [data-btn]:hover [data-btn-label]>:first-child{transform:none;color:var(--btn-ink)}
}
/* Replace the F17-era hover dim: the fill is the hover state now. */
.offers-slider-split_button:hover,.overlay-detail-panel-modal_item-button:hover{opacity:1}
</style>
```

## Site footer

```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@v1.1.8/dist/index.js"></script>
```

Through the Data API this is `data_scripts_tool` > `set_site_freeform_code` (location `footer`), which writes the raw block; registered scripts are not used because the bundle (21 KB) is far over the 2,000-character inline cap. See `webflow-scripts-api.md`.

## Page code to remove once the site footer is in

- `🧱 site-nav` (`6ad769cad74aa30b7c564578`): empty the page **footer** block (CDN tags plus an inline navToggle copy). Keep the page head style (stand-in backgrounds for the nav check).

## Globals the modules use

`gsap`, `ScrollTrigger` (registered by the Lenis engine), `SplitText` (swiperSliders, scrollTextReveal, heroTextReveal), `Lenis`, `Swiper` (swiperSliders, offersSliderSplit, cardCarouselHeaderLeft). Every module has a selector-presence guard, so pages without its markup are unaffected.

## Site head: button hover CSS (F34)

Webflow styles cannot target pseudo-elements, so the F34 fill-and-roll CSS lives in the site head as `<style data-button-hover>…</style>`, after the existing head content. Source of truth: [`site-head/button-hover.css`](site-head/button-hover.css). `src/utils/buttonHover.ts` adds the `[data-btn]` markup it targets.

F43: the fill layer is a static chamfer-clipped box and the fill grows with background-size from the bottom (same technique as the submit inputs); the layer never translates, so its own chamfer edge is never visible.

## Site head: History divider (F50)

`<style data-history-divider>` after the button hover block. Source: `docs/reference/site-head/history-divider.css`.
