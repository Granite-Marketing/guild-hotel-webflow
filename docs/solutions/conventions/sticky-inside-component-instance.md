---
title: "Sticky inside a component instance needs a ScrollTrigger pin"
date: "2026-10-27"
category: "conventions"
module: "stickyTabs"
problem_type: "convention"
tags: [sticky, scrolltrigger, webflow-component]
---

# Sticky inside a component instance needs a ScrollTrigger pin

`position: sticky` only holds within its parent. The topic bar
(`tab-pills-intro_tabs`) is nested six wrappers deep in a component instance
and its direct parent frame is as tall as the bar, so sticky holds for zero
distance. No ancestor had `overflow` or transforms; the structure is the
problem, and the Designer cannot lift an element out of an instance.

Use a ScrollTrigger pin with `pinSpacing: false`, start `bottom bottom-=2rem`,
and an absolute end function that releases when the last rendered section's
bottom reaches the bar's bottom (F44: bottom-aligned like the other sticky
bars). Tab clicks offset by the fixed nav height only. See `src/utils/stickyTabs.ts`.
