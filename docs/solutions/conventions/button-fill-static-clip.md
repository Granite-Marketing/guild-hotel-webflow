---
module: buttonHover
tags: [css, clip-path, hover]
problem_type: convention
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
