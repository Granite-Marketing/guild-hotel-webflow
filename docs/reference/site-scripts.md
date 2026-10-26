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
