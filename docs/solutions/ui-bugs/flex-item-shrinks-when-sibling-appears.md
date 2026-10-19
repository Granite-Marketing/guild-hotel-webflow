---
title: "Flex item (nav logo) shrinks when a sibling appears: needs flex-shrink: 0"
date: "2026-06-03"
category: "ui-bugs"
module: "nav / header CSS"
component: "frontend_stimulus"
problem_type: "ui_bug"
severity: "low"
status: "resolved"
root_cause: "logic_error"
resolution_type: "css_only"
symptoms:
  - "Logo SVG measures 464 x 40.2 with the nav closed and 388.88 x 33.69 (about 84%) when the nav opens"
  - "Uniform scale on both axes, no transform: scale() in computed styles"
  - "Only on breakpoints where the menu items are hidden by default and appear on .is-nav-open"
tags:
  - flexbox
  - flex-shrink
  - svg-sizing
  - webflow-embed
  - nav-header
  - sibling-reflow
---

# Flex item (nav logo) shrinks when a sibling appears: needs flex-shrink: 0

## Problem

A nav logo SVG rendered at 464 x 40.2px with the nav closed, then shrank to 388.88 x 33.69px (about 84%) when the nav opened. No `transform: scale()` was applied and no logo rule existed under the open state. The shrink was uniform and reversed on close. The cause was structural (flexbox sibling reflow), not a declared rule on the logo, which made it slow to find.

## Symptoms

- Logo width and height dropped when `.is-nav-open` was added to the header.
- DevTools showed no `transform`, no `font-size` change and no logo size override under the open state.
- Breakpoint-conditional: where the menu items were always visible the logo did not shrink; where the menu was hidden by default and appeared only on open (hamburger breakpoints), it did.

## What Didn't Work

1. Searching for logo sizing rules under the open state: only a colour change existed.
2. Suspecting a GSAP transform from the nav or logo scroll animations: those were scroll-driven and independent of the open state.
3. Suspecting a Webflow component variant change on open: the variant attribute was identical open and closed.

## Solution

One CSS rule on the brand link (a combo class in the Designer, or the nav component's style):

```css
.nav_brand-link {
  flex-shrink: 0;
}
```

Belt and braces: also pin the SVGs to their intrinsic size, since Webflow Embed SVGs get `width: 100%`:

```css
.nav_brand-link svg {
  width: auto;
  height: 100%;
}
```

## Why This Works

The header is a flex row of `[brand link] [menu items] [hamburger toggle]`. Where the menu is `display: none` by default and becomes `display: flex` only under `.is-nav-open`, opening the nav adds a new flex sibling. Default `flex-shrink: 1` lets every item compress proportionally, so the brand container shrinks to make room. The SVG inside uses `width: 100%` (Webflow's default for SVG embeds), so it scales down with its parent, preserving aspect ratio, which is why both axes shrink uniformly.

`flex-shrink: 0` pins the brand to its content width and the flex algorithm takes space from the other siblings instead.

## Prevention

- **Default to `flex-shrink: 0` on flex items whose size matters visually:** logos, icons, fixed-size CTAs. The default `1` is a foot-gun in any flex container where siblings appear and disappear (nav open/close, conditional menus, responsive visibility).
- **When a child resizes for no visible reason, inspect its parent's flex context.** The cause here was the absence of `flex-shrink: 0` plus a sibling appearing. Check the computed `flex-shrink` value; the Styles pane will not show a rule.
- **Webflow Embed blocks give inlined SVGs `width: 100%`.** To keep an SVG's intrinsic width, set `svg { width: auto; }` on its parent or give it an explicit width.
- **Test the header at every breakpoint with the nav both open and closed.**

## Related

- [component-patterns.md](../../reference/component-patterns.md): wrapper rules; every element needs intentional sizing in a flex or grid context
- [gsap-ypercent-vs-css-translate-individual-property.md](../integration-issues/gsap-ypercent-vs-css-translate-individual-property.md): a different nav logo bug from the same release cluster
- [css-attribute-selector-case-sensitivity-data-alignment.md](css-attribute-selector-case-sensitivity-data-alignment.md): another flex layout gotcha
