---
title: "Custom CSS goes in an HTML embed component so the Designer shows it"
date: "2026-11-10"
category: "conventions"
module: "Webflow Designer, docs/reference/site-head"
problem_type: "convention"
severity: "medium"
applies_when:
  - "Writing CSS for layout, alignment or spacing that Webflow classes cannot express"
  - "A block looks different in the Designer than on the live site"
tags: [designer, custom-code, html-embed, components, css]
---

# Custom CSS goes in an HTML embed component so the Designer shows it

## Problem

The gallery canvas looked different in the Designer than on the live site. Its layout CSS shipped in `dist/site.css`, which the site head links from jsDelivr. The Designer does not load site head code or the bundle, so the canvas showed the bare classes while the live site showed the finished layout. Stephen builds and checks pages in the Designer, so anything only the live site can see is a problem.

## Rule

1. **Webflow classes first.** Build and align elements with classes, combo classes and variants in the Designer. Custom CSS only when no class can express it (`:has()`, CSS masks, attribute selectors on runtime state, pseudo-elements).
2. **Custom CSS lives in an HTML embed inside a component.** Put a `<style data-...>` block in an HTML embed, turn the embed into a component (group "Embeds"), and place an instance on every page that needs it. The Designer renders embed `<style>` on the canvas, so it matches the live site.
3. **Keep the source in the repo.** The readable CSS stays in `docs/reference/site-head/<name>.css`. Paste the minified version into the embed after every change (`npx esbuild <file> --minify`), and note the component name in the file header.
4. **Scope JS-dependent rules to a class the script adds.** The Designer does not run the bundle. Rules that only make sense after the script has run (absolute positions it computes, transforms) are scoped to a state class the module sets (for example `.is-canvas`), so the Designer keeps the plain layout instead of a broken one.
5. **Head or bundle CSS** is only for styles the Designer never needs to show, such as states of JS-built elements that do not exist on the canvas.

## Example

Gallery canvas (2026-11-10): component "Gallery Canvas Styles" holds the minified `docs/reference/site-head/gallery-canvas.css`, with an instance at the top of the gallery section on /gallery and /arts. The board and photo positioning rules are scoped to `[data-gallery-canvas].is-canvas`, a class `galleryCanvas()` adds, so the Designer shows the normal grid inside the 100vh window with both pills in place.
