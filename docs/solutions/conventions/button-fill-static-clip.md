---
module: buttonHover
tags: [css, clip-path, hover]
problem_type: convention
last_updated: "2026-10-27"
---

# Button fill: keep the clipped box static, animate background-size

**Problem (F43):** the hover fill was a `::before` with its own chamfer `clip-path`, moved with `transform: translateY`. The clip-path travelled with the layer, so its chamfered top corners were visible rising and broke outside the button outline. It was hard to see on dark buttons over dark photos (the /meetings button) and obvious on cream or flat backgrounds.

**Rule:** never animate a clip-path'd pseudo-element by transform. Keep the clipped box static and grow the fill inside it:

```css
[data-btn]::before{inset:0;background:linear-gradient(var(--btn-fill),var(--btn-fill)) no-repeat bottom/100% 0;clip-path:var(--btn-chamfer);transition:background-size var(--btn-dur) var(--btn-ease)}
[data-btn]:hover::before{background-size:100% 100%}
```

This is the same technique the submit inputs already use. Outline variants keep their stroke because the stroke is an element background image and the fill sits over it in the same colour.

Source: `docs/reference/site-head/button-hover.css`.

## Outline buttons: match the stretched SVG (F52, 2026-10-27)

`is-outline` and `is-outline-light` draw their stroke with a 194×37 SVG background (`preserveAspectRatio="none"`, `background-size: 100% 100%`), so the stroke's chamfer **scales with the button**. The fill's `--btn-chamfer` is fixed rem, so on a button taller or wider than 194×37 (the 326×70 rooms quiz options) the fill's corners poked outside the stroke. Give outline variants a percentage chamfer taken from the SVG path (11.2/194, 12.2/37, 24.6/37):

```css
.button.is-chamfer:is(.is-outline,.is-outline-light){--btn-chamfer:polygon(0 32.97%,5.77% 0,93.84% 0,100% 32.97%,100% 66.49%,93.84% 100%,5.77% 100%,0 66.49%)}
```

Any button whose outline comes from a stretched image needs its fill clip derived from that image's geometry, not a fixed size. Solid chamfer buttons clip the element itself, so the rem chamfer stays correct for them.
