---
title: "Sackers small-caps text sits low in chamfered shapes"
date: "2026-10-26"
category: "conventions"
module: "Webflow styles (chamfer buttons, clip-path bars and badges)"
component: "webflow_styles"
problem_type: "convention"
severity: "low"
applies_when:
  - "Styling any chamfered or clip-path element that contains text"
  - "Copying the chamfer button into a component so variants can recolour it"
  - "Building a bar of links inside a chevron or chamfer shape"
tags:
  - sackers-gothic
  - chamfer
  - clip-path
  - vertical-centring
  - padding
---

# Sackers small-caps text sits low in chamfered shapes

## Problem

Sackers Gothic small caps put their ink about 2.4px below the centre of the line box
at 16 to 18px. Any element with symmetric vertical padding, or a symmetric box centred
with flex, therefore renders its text low. Inside a chamfer or clip-path shape the
offset is obvious (feedback F02, F17, F21).

## Rule

- **Chamfer buttons (37px tall):** top padding smaller than bottom. Use the F02 values:
  `padding: 0.375rem 1.5rem 0.6875rem`. This applies to every component-local copy of
  the chamfer button too (`offers-slider-split_button`,
  `overlay-detail-panel-modal_button`, `overlay-detail-panel-modal_item-button`); F17
  found all three still on the old symmetric 0.5625rem.
- **Links in a bar:** use the venue-tab pattern on the link: `padding-bottom: 0.25rem`
  plus `border-bottom: 1px solid transparent`, with the active state setting
  `border-bottom-color: currentColor` instead of a text-decoration underline
  (`.venue-card-fullbleed_tab`, and `.tab-pills-intro_tab` after F21).
- **Even spacing in a bar shape:** side padding equals the column gap.
- **Badges and larger sizes:** scale the offset; measure, do not guess (history label
  at 3.125rem needs about 3px more bottom than top).
- Lining digits and ampersands stand taller than the small caps on the same baseline,
  so labels like "5+ guests" measure about 2px high. That is expected; do not correct it.

## How to check

Measure on the page rather than by eye: take the text node's line box from a `Range`,
the ink extents from canvas `measureText()` (`actualBoundingBoxAscent` /
`actualBoundingBoxDescent`), and compare the gap to the shape's box on each side.
Target: top and bottom gaps within 1px. Method and numbers:
`docs/figma/feedback/2026-10-26-styles-f17-f21.md`.
