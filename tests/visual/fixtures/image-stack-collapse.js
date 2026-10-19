"use strict";
(() => {
  // src/utils/imageStackCollapse.ts
  var DEFAULT_START = "top 75%";
  var DEFAULT_END = "center center";
  var findAnchor = (items) => items.find((item) => item.dataset.imageStackCollapseItem === "anchor") ?? items[Math.floor(items.length / 2)];
  var offsetToAnchor = (item, anchor) => {
    const itemRect = item.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    return {
      x: anchorRect.left + anchorRect.width / 2 - (itemRect.left + itemRect.width / 2) + Number(gsap.getProperty(item, "x")),
      y: anchorRect.top + anchorRect.height / 2 - (itemRect.top + itemRect.height / 2) + Number(gsap.getProperty(item, "y"))
    };
  };
  var raiseAnchor = (items, anchor) => {
    items.forEach((item) => {
      if (getComputedStyle(item).position === "static") gsap.set(item, { position: "relative" });
      gsap.set(item, { zIndex: item === anchor ? 2 : 1 });
    });
  };
  var imageStackCollapse = () => {
    const stacks = document.querySelectorAll("[data-image-stack-collapse]");
    if (!stacks.length) return;
    stacks.forEach((stack) => {
      const items = Array.from(
        stack.querySelectorAll("[data-image-stack-collapse-item]")
      );
      if (items.length < 2) return;
      const anchor = findAnchor(items);
      const movingItems = items.filter((item) => item !== anchor);
      const mm = gsap.matchMedia();
      mm.add(
        {
          allowsMotion: "(prefers-reduced-motion: no-preference)",
          reducesMotion: "(prefers-reduced-motion: reduce)"
        },
        (context) => {
          raiseAnchor(items, anchor);
          if (context.conditions.reducesMotion) {
            const showStack = () => movingItems.forEach((item) => gsap.set(item, offsetToAnchor(item, anchor)));
            showStack();
            ScrollTrigger.create({ trigger: stack, onRefresh: showStack });
            return;
          }
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: stack,
              start: stack.dataset.imageStackCollapseStart || DEFAULT_START,
              end: stack.dataset.imageStackCollapseEnd || DEFAULT_END,
              scrub: true,
              invalidateOnRefresh: true
            }
          });
          movingItems.forEach((item) => {
            timeline.fromTo(
              item,
              { x: 0, y: 0 },
              {
                x: () => offsetToAnchor(item, anchor).x,
                y: () => offsetToAnchor(item, anchor).y,
                ease: "power2.inOut"
              },
              0
            );
          });
        }
      );
    });
  };

  // tests/visual/fixtures/image-stack-collapse.ts
  imageStackCollapse();
})();
