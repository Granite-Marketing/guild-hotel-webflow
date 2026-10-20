# Site custom code (R00)

What Site Settings > Custom Code holds on site `6ad6405eae8eac6d7b7c41a3`, and the exact content to paste. The bundle and its CDN globals load once, site-wide; pages carry no script code of their own.

## Release

- **Bundle version:** v1.1.1 (release commit `1e3e1429a832235a38903d7df288fa881d22a8fa`).
- **Tag URL:** `https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@v1.1.1/dist/index.js` (serves once tag `v1.1.1` is pushed).
- **Commit-pinned URL:** `https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@1e3e1429a832235a38903d7df288fa881d22a8fa/dist/index.js` (serves now; byte-identical to `dist/index.js`). Use it until the tag is pushed, then switch to the tag URL.
- **Repo visibility:** public since 2026-10-20 (jsDelivr only serves public repos).

## Site head (append after the existing font-smoothing style)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css">
```

## Site footer (the block was empty before R00)

```html
<!-- CDN globals for the site bundle (R00). Keep this order: GSAP, plugins, Lenis, Swiper, then the bundle. -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/Granite-Marketing/guild-hotel-webflow@v1.1.1/dist/index.js"></script>
```

Through the Data API this is `data_scripts_tool` > `set_site_freeform_code` (location `head` / `footer`), which writes the raw blocks; registered scripts are not used because the bundle (19 KB) is far over the 2,000-character inline cap. See `webflow-scripts-api.md`.

## Page code to remove once the site footer is in

- `🧱 site-nav` (`6ad769cad74aa30b7c564578`): empty the page **footer** block (CDN tags plus an inline navToggle copy). Keep the page head style (stand-in backgrounds for the nav check).

## Globals the modules use

`gsap`, `ScrollTrigger` (registered by the Lenis engine), `SplitText` (swiperSliders, scrollTextReveal, heroTextReveal), `Lenis`, `Swiper` (swiperSliders, offersSliderSplit). Every module has a selector-presence guard, so pages without its markup are unaffected.
