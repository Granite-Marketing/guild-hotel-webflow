"use strict";
(() => {
  // src/utils/accordion.ts
  var OPEN_HEIGHT_PADDING = 9 * 14;
  var accordion = () => {
    const accordionTriggers = document.querySelectorAll(".accordion_header");
    if (!accordionTriggers.length) return;
    function openHeight(contentWrapper) {
      const content = contentWrapper.querySelector(".accordion_content");
      if (!content) return null;
      return `${content.offsetHeight + OPEN_HEIGHT_PADDING}px`;
    }
    const headerByContent = /* @__PURE__ */ new Map();
    const contentObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const header = headerByContent.get(entry.target);
        if (!header || header.getAttribute("aria-expanded") !== "true") return;
        const contentWrapper = header.nextElementSibling;
        const height = contentWrapper ? openHeight(contentWrapper) : null;
        if (contentWrapper && height && contentWrapper.style.maxHeight !== height) {
          contentWrapper.style.maxHeight = height;
        }
      });
    });
    function setOpen(item, isOpen) {
      item.setAttribute("aria-expanded", isOpen ? "true" : "false");
      item.classList.toggle("is-active", isOpen);
      const contentWrapper = item.nextElementSibling;
      if (!contentWrapper) return;
      contentWrapper.style.maxHeight = isOpen ? openHeight(contentWrapper) ?? "0px" : "0px";
    }
    function toggleAccordion(item) {
      accordionTriggers.forEach((otherItem) => {
        if (otherItem !== item) setOpen(otherItem, false);
      });
      setOpen(item, item.getAttribute("aria-expanded") !== "true");
    }
    function isNativeButton(element) {
      return element.tagName === "BUTTON";
    }
    function isNativeLink(element) {
      return element.tagName === "A" && element.hasAttribute("href");
    }
    accordionTriggers.forEach((item, index) => {
      const contentWrapper = item.nextElementSibling;
      if (!contentWrapper) return;
      const accordionId = `accordion-${index}`;
      const accordionTargetId = `accordion-target-${index}`;
      item.id = accordionId;
      item.setAttribute("aria-controls", accordionTargetId);
      contentWrapper.id = accordionTargetId;
      contentWrapper.setAttribute("aria-labelledby", accordionId);
      const content = contentWrapper.querySelector(".accordion_content");
      if (content && contentObserver) {
        headerByContent.set(content, item);
        contentObserver.observe(content);
      }
      if (!isNativeButton(item) && !isNativeLink(item)) {
        if (!item.hasAttribute("tabindex")) item.setAttribute("tabindex", "0");
        if (!item.hasAttribute("role")) item.setAttribute("role", "button");
      }
      setOpen(item, index === 0);
      item.addEventListener("click", (event) => {
        event.preventDefault();
        toggleAccordion(item);
      });
      item.addEventListener("keydown", (event) => {
        if (event.target !== item || isNativeButton(item)) return;
        const isSpace = event.key === " " || event.key === "Spacebar";
        const isEnter = event.key === "Enter";
        if (isSpace || isEnter && !isNativeLink(item)) {
          event.preventDefault();
          toggleAccordion(item);
        }
      });
    });
  };

  // src/utils/buttonHover.ts
  var BUTTON_SELECTOR = [
    ".button",
    ".offers-slider-split_button",
    ".overlay-detail-panel-modal_button",
    '.overlay-detail-panel-modal_item-button:not([class*="w-variant-0e56f707"])'
  ].join(",");
  var isSubmitInput = (element) => element instanceof HTMLInputElement && ["submit", "button"].includes(element.type);
  var hasText = (node) => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim();
  var buildLabel = (text) => {
    const label = document.createElement("span");
    label.dataset.btnLabel = "";
    const main = document.createElement("span");
    main.textContent = text;
    const copy = document.createElement("span");
    copy.textContent = text;
    copy.dataset.btnCopy = "";
    copy.setAttribute("aria-hidden", "true");
    label.append(main, copy);
    return label;
  };
  var enhance = (button) => {
    if (button.dataset.btnHover === "off") return;
    if (button.hasAttribute("data-btn") || button.hasAttribute("data-btn-fill")) return;
    if (isSubmitInput(button)) {
      button.dataset.btnFill = "";
      return;
    }
    const ownText = Array.from(button.childNodes).some(hasText);
    const onlyChild = button.children.length === 1 ? button.children[0] : null;
    const host = !ownText && onlyChild && !onlyChild.children.length && onlyChild.textContent?.trim() ? onlyChild : button;
    const textNodes = Array.from(host.childNodes).filter(hasText);
    if (!textNodes.length) return;
    textNodes.forEach(
      (node) => node.replaceWith(buildLabel((node.textContent ?? "").replace(/\s+/g, " ").trim()))
    );
    button.dataset.btn = "";
  };
  var enhanceWithin = (root) => {
    if (root instanceof HTMLElement && root.matches(BUTTON_SELECTOR)) enhance(root);
    root.querySelectorAll(BUTTON_SELECTOR).forEach(enhance);
  };
  var buttonHover = () => {
    const buttons = document.querySelectorAll(BUTTON_SELECTOR);
    if (!buttons.length) return;
    buttons.forEach(enhance);
    new MutationObserver(
      (records) => records.forEach(
        (record) => record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) enhanceWithin(node);
        })
      )
    ).observe(document.body, { childList: true, subtree: true });
  };

  // src/utils/cardCarouselHeaderLeft.ts
  var cardCarouselHeaderLeft = () => {
    const carousels = document.querySelectorAll("[data-card-carousel]");
    if (!carousels.length) return;
    carousels.forEach((carousel) => {
      const container = carousel.querySelector(".swiper.cards");
      if (!container) return;
      const previousButton = carousel.querySelector("[data-card-carousel-prev]");
      const nextButton = carousel.querySelector("[data-card-carousel-next]");
      new Swiper(container, {
        slidesPerView: "auto",
        spaceBetween: 0,
        speed: 700,
        grabCursor: true,
        watchOverflow: true,
        a11y: {
          prevSlideMessage: "Previous card",
          nextSlideMessage: "Next card"
        },
        navigation: {
          prevEl: previousButton,
          nextEl: nextButton,
          disabledClass: "is-disabled",
          lockClass: "hide"
        }
      });
    });
  };

  // src/utils/cmsItemLinks.ts
  var trimSlashes = (value) => value.trim().replace(/^\/+|\/+$/g, "");
  var cmsItemLinks = () => {
    const itemLinks = document.querySelectorAll("a[data-cms-link-slug]");
    if (!itemLinks.length) return;
    itemLinks.forEach((link) => {
      const slug = trimSlashes(link.getAttribute("data-cms-link-slug") ?? "");
      if (!slug) return;
      const collectionPath = trimSlashes(link.getAttribute("data-cms-link-path") ?? "");
      const separator = link.hasAttribute("data-cms-link-anchor") ? "#" : "/";
      link.setAttribute("href", collectionPath ? `/${collectionPath}${separator}${slug}` : `/${slug}`);
    });
  };

  // src/utils/currentYear.ts
  var currentYear = () => {
    const yearElements = document.querySelectorAll(
      "[data-current-year], #current-year"
    );
    if (!yearElements.length) return;
    const year = String((/* @__PURE__ */ new Date()).getFullYear());
    yearElements.forEach((element) => {
      element.textContent = year;
    });
  };

  // src/utils/eagerImages.ts
  var eagerImages = () => {
    const eagerRoots = document.querySelectorAll("[data-eager]");
    if (!eagerRoots.length) return;
    eagerRoots.forEach((element) => {
      if (element instanceof HTMLImageElement && element.loading === "lazy") {
        element.loading = "eager";
      }
      element.querySelectorAll('img[loading="lazy"]').forEach((image) => {
        image.loading = "eager";
      });
    });
  };

  // src/utils/formPlaceholders.ts
  var LABEL_SELECTOR = "form label:not(.w-checkbox):not(.w-radio)";
  var CONTROL_SELECTOR = "input, textarea, select";
  var OPT_OUT_SELECTOR = '[data-form-label="visible"]';
  var SR_ONLY_CLASS = "u-sr-only";
  var SR_ONLY_COMBO_CLASS = "is-sr-only";
  var LABELLED_INPUT_CLASS = "is-labelled";
  var PLACEHOLDER_SELECT_CLASS = "is-placeholder";
  var SKIPPED_INPUT_TYPES = /* @__PURE__ */ new Set([
    "checkbox",
    "radio",
    "submit",
    "button",
    "hidden",
    "file",
    "image",
    "reset",
    "range",
    "color"
  ]);
  var isTextControl = (element) => !!element && element.matches(CONTROL_SELECTOR) && !(element instanceof HTMLInputElement && SKIPPED_INPUT_TYPES.has(element.type));
  var findControl = (label) => {
    const controlByFor = label.htmlFor ? document.getElementById(label.htmlFor) : null;
    if (isTextControl(controlByFor)) return controlByFor;
    const nextSibling = label.nextElementSibling;
    if (isTextControl(nextSibling)) return nextSibling;
    const parentControls = label.parentElement?.querySelectorAll(CONTROL_SELECTOR) ?? [];
    return [...parentControls].find((element) => !label.contains(element) && isTextControl(element)) ?? null;
  };
  var ensureControlId = (control, label, index) => {
    if (control.id) return control.id;
    const preferredId = label.htmlFor || (control.name ? `field-${control.name}` : "");
    const candidateId = preferredId && !document.getElementById(preferredId) ? preferredId : `form-field-${index}`;
    control.id = candidateId;
    return candidateId;
  };
  var formPlaceholders = () => {
    const labels = document.querySelectorAll(LABEL_SELECTOR);
    if (!labels.length) return;
    labels.forEach((label, index) => {
      if (label.closest(OPT_OUT_SELECTOR)) return;
      const control = findControl(label);
      const labelText = label.textContent?.replace(/\s+/g, " ").trim();
      if (!control || !labelText) return;
      if (control.closest(OPT_OUT_SELECTOR)) return;
      if (control instanceof HTMLSelectElement) {
        const promptOption = control.querySelector('option[value=""]');
        if (!promptOption) return;
        promptOption.textContent = labelText;
        const syncPlaceholderState = () => control.classList.toggle(PLACEHOLDER_SELECT_CLASS, control.value === "");
        syncPlaceholderState();
        control.addEventListener("change", syncPlaceholderState);
        control.form?.addEventListener("reset", () => requestAnimationFrame(syncPlaceholderState));
      } else {
        control.placeholder = labelText;
        control.classList.remove(LABELLED_INPUT_CLASS);
      }
      label.htmlFor = ensureControlId(control, label, index);
      label.classList.add(SR_ONLY_CLASS, SR_ONLY_COMBO_CLASS);
    });
  };

  // src/utils/galleryFilter.ts
  var HIDDEN_CLASS = "hide";
  var ACTIVE_CLASS = "is-active";
  var SHOW_ALL = "all";
  var normaliseCategory = (value) => value.trim().toLowerCase().replace(/\s+/g, "-");
  var parseCategories = (value) => (value ?? "").split(",").map(normaliseCategory).filter(Boolean);
  var galleryFilter = () => {
    const roots = document.querySelectorAll("[data-gallery-filter]");
    if (!roots.length) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    roots.forEach((root) => {
      const tags = Array.from(
        root.querySelectorAll("[data-gallery-filter-tag]")
      );
      const items = Array.from(
        root.querySelectorAll("[data-gallery-filter-item]")
      );
      if (!tags.length || !items.length) return;
      const emptyState = root.querySelector("[data-gallery-filter-empty]");
      const itemCategories = new Map(
        items.map((item) => [
          item,
          parseCategories(item.getAttribute("data-gallery-filter-item"))
        ])
      );
      let transitionId = 0;
      const tagCategory = (tag) => normaliseCategory(tag.getAttribute("data-gallery-filter-tag") ?? "") || SHOW_ALL;
      const matches = (item, category) => category === SHOW_ALL || (itemCategories.get(item) ?? []).includes(category);
      const setActiveTag = (activeTag) => {
        tags.forEach((tag) => {
          const isActive = tag === activeTag;
          tag.classList.toggle(ACTIVE_CLASS, isActive);
          tag.setAttribute("aria-pressed", String(isActive));
        });
      };
      const applyVisibility = (category) => {
        let visibleCount = 0;
        items.forEach((item) => {
          const isMatch = matches(item, category);
          item.classList.toggle(HIDDEN_CLASS, !isMatch);
          if (isMatch) visibleCount += 1;
        });
        emptyState?.classList.toggle(ACTIVE_CLASS, visibleCount === 0);
        root.setAttribute("data-gallery-filter-active", category);
      };
      const showMatches = (category) => {
        applyVisibility(category);
        ScrollTrigger.refresh(true);
      };
      const scrollRootIntoView = () => {
        if (root.getBoundingClientRect().top >= 0) return;
        root.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
      };
      const filterTo = (category) => {
        transitionId += 1;
        const currentTransition = transitionId;
        gsap.killTweensOf(items);
        if (reducedMotion.matches) {
          gsap.set(items, { autoAlpha: 1, y: 0 });
          showMatches(category);
          scrollRootIntoView();
          return;
        }
        const outgoing = items.filter(
          (item) => !item.classList.contains(HIDDEN_CLASS) && !matches(item, category)
        );
        const incoming = items.filter(
          (item) => item.classList.contains(HIDDEN_CLASS) && matches(item, category)
        );
        const revealIncoming = () => {
          if (currentTransition !== transitionId) return;
          showMatches(category);
          gsap.set(outgoing, { autoAlpha: 1, y: 0 });
          scrollRootIntoView();
          gsap.fromTo(
            incoming,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.04 }
          );
        };
        if (!outgoing.length) {
          revealIncoming();
          return;
        }
        gsap.to(outgoing, {
          autoAlpha: 0,
          y: -12,
          duration: 0.25,
          ease: "power1.in",
          onComplete: revealIncoming
        });
      };
      const initialTag = tags.find((tag) => tag.classList.contains(ACTIVE_CLASS)) ?? tags.find((tag) => tagCategory(tag) === SHOW_ALL) ?? tags[0];
      setActiveTag(initialTag);
      applyVisibility(tagCategory(initialTag));
      tags.forEach((tag) => {
        tag.addEventListener("click", (event) => {
          event.preventDefault();
          if (tag.classList.contains(ACTIVE_CLASS)) return;
          setActiveTag(tag);
          filterTo(tagCategory(tag));
        });
      });
    });
  };

  // src/utils/gsapBasicAnimations.ts
  var gsapBasicAnimations = () => {
    gsap.set(".slide-in", { y: 25, opacity: 0 });
    ScrollTrigger.batch(".slide-in", {
      start: "top 80%",
      end: "bottom 20%",
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1 })
    });
    gsap.set(".fade-in", { opacity: 0 });
    ScrollTrigger.batch(".fade-in", {
      start: "top 80%",
      end: "bottom 20%",
      onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 1 })
    });
  };

  // src/utils/lineMaskReveal.ts
  var REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
  var TEXT_TAGS = /* @__PURE__ */ new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P"]);
  var DURATION = 0.9;
  var LINE_STAGGER = 0.08;
  var ELEMENT_STAGGER = 0.12;
  var REVERSE_SPEED = 1.6;
  var HIDDEN = { yPercent: 110 };
  var SHOWN = { yPercent: 0, duration: DURATION, ease: "power3.out" };
  var TARGET_SELECTOR = "h1, h2, h3, h4, h5, h6, p, figure, .button, [data-line-mask]";
  var findTargets = (container) => {
    const candidates = Array.from(container.querySelectorAll(TARGET_SELECTOR));
    if (!candidates.length && container.matches(TARGET_SELECTOR)) return [container];
    return candidates.filter(
      (candidate) => !candidates.some((other) => other !== candidate && other.contains(candidate))
    );
  };
  var isText = (element) => element.dataset.lineMask === "text" || TEXT_TAGS.has(element.tagName);
  var createLineMaskTimeline = (container) => {
    const elements = findTargets(container);
    if (!elements.length || window.matchMedia(REDUCED_MOTION).matches) {
      return { play: () => void 0, reverse: () => void 0, isRevealed: () => false };
    }
    const timeline = gsap.timeline({ paused: true });
    let direction = null;
    const parts = [];
    const runDirection = () => {
      if (direction === "forward") timeline.timeScale(1).play();
      else if (direction === "reverse") timeline.timeScale(REVERSE_SPEED).reverse();
    };
    const rebuild = () => {
      if (parts.some((part) => part.kind === "text" && !part.split)) return;
      const progress = timeline.progress();
      timeline.clear();
      parts.forEach((part, index) => {
        const offset = index * ELEMENT_STAGGER;
        if (part.kind === "text") {
          part.lines.forEach((line, lineIndex) => {
            timeline.fromTo(line.children, HIDDEN, SHOWN, offset + lineIndex * LINE_STAGGER);
          });
          return;
        }
        timeline.fromTo(part.element, HIDDEN, SHOWN, offset);
      });
      timeline.progress(progress);
      runDirection();
    };
    elements.forEach((element) => {
      if (isText(element)) {
        parts.push({ kind: "text", element, lines: [], split: false });
        return;
      }
      wrapInClip(element);
      parts.push({ kind: "element", element });
    });
    parts.forEach((part) => {
      if (part.kind !== "text") return;
      new SplitText(part.element, {
        type: "lines,words",
        autoSplit: true,
        onSplit: (self) => {
          const lines = self.lines ?? [];
          gsap.set(lines, { overflow: "hidden" });
          part.lines = lines;
          part.split = true;
          rebuild();
        }
      });
    });
    rebuild();
    return {
      play: () => {
        if (direction === "forward") return;
        direction = "forward";
        runDirection();
      },
      reverse: () => {
        if (direction === "reverse") return;
        direction = "reverse";
        runDirection();
      },
      isRevealed: () => timeline.progress() > 0
    };
  };
  var prepareLineMaskReveal = (container) => {
    const reveal = createLineMaskTimeline(container);
    let played = false;
    return {
      play: () => {
        if (played) return;
        played = true;
        reveal.play();
      }
    };
  };
  var wrapInClip = (element) => {
    const parent = element.parentElement;
    if (!parent || parent.dataset.lineMaskClip !== void 0) return;
    const clip = document.createElement("div");
    clip.dataset.lineMaskClip = "";
    const display = getComputedStyle(element).display;
    clip.style.display = display.startsWith("inline") ? "inline-block" : "block";
    clip.style.overflow = "hidden";
    parent.insertBefore(clip, element);
    clip.appendChild(element);
  };

  // src/utils/historyStickyYear.ts
  var REDUCED_MOTION2 = "(prefers-reduced-motion: reduce)";
  var DEFAULT_COLLAPSE_DISTANCE = 3;
  var historyStickyYear = () => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION2).matches;
    document.querySelectorAll("[data-history-sticky-year]").forEach((root) => setupStickyYear(root, reducedMotion));
    if (reducedMotion) return;
    document.querySelectorAll("[data-history-collapse]").forEach((root) => setupCollapseGallery(root));
  };
  var setupStickyYear = (root, reducedMotion) => {
    const label = root.querySelector("[data-history-sticky-year-label]");
    const items = Array.from(
      root.querySelectorAll("[data-history-sticky-year-item]")
    );
    if (!label || !items.length) return;
    const labelText = label.querySelector("[data-history-sticky-year-text]") ?? label;
    const years = items.map(
      (item) => item.getAttribute("data-history-sticky-year-item")?.trim() || item.textContent?.trim() || ""
    );
    let activeIndex = -1;
    const showYear = (index) => {
      if (index === activeIndex) return;
      const previousItem = items[activeIndex];
      previousItem?.classList.remove("is-active");
      items[index].classList.add("is-active");
      activeIndex = index;
      const year = years[index];
      if (labelText.textContent === year) return;
      if (reducedMotion) {
        labelText.textContent = year;
        return;
      }
      gsap.killTweensOf(labelText);
      gsap.to(labelText, {
        yPercent: -40,
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          labelText.textContent = years[activeIndex];
          gsap.fromTo(
            labelText,
            { yPercent: 40, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }
          );
        }
      });
    };
    items.forEach((item, index) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top center",
        end: "bottom center",
        onToggle: (self) => {
          if (self.isActive) showYear(index);
        }
      });
    });
  };
  var setupCollapseGallery = (root) => {
    const items = Array.from(
      root.querySelectorAll("[data-history-collapse-item]")
    );
    if (items.length < 2) return;
    const bleedItem = items.find((item) => item.dataset.historyCollapseItem === "bleed") ?? items[0];
    const bleedImage = bleedItem.querySelector("img");
    if (!bleedImage) return;
    const fades = Array.from(root.querySelectorAll("[data-history-collapse-fade]"));
    const distance = Number(root.getAttribute("data-history-collapse-distance")) || DEFAULT_COLLAPSE_DISTANCE;
    if (getComputedStyle(root).position === "static") {
      root.style.position = "relative";
    }
    const viewportProbe = document.createElement("div");
    viewportProbe.style.cssText = "position:absolute;top:0;height:100vh;width:0;visibility:hidden;pointer-events:none";
    root.append(viewportProbe);
    const visibleHeight = () => Math.min(root.offsetHeight, viewportProbe.offsetHeight);
    const offsetWithinRoot = (element) => {
      let left = 0;
      let top = 0;
      let node = element;
      while (node && node !== root) {
        left += node.offsetLeft;
        top += node.offsetTop;
        node = node.offsetParent;
      }
      return { left, top };
    };
    const deltaToCentre = (element) => {
      const { left, top } = offsetWithinRoot(element);
      return {
        x: root.clientWidth / 2 - (left + element.offsetWidth / 2),
        y: visibleHeight() / 2 - (top + element.offsetHeight / 2)
      };
    };
    items.forEach((item) => {
      if (getComputedStyle(item).position === "static") item.style.position = "relative";
      item.style.zIndex = item === bleedItem ? "2" : "1";
    });
    const reveals = fades.map((fade) => prepareLineMaskReveal(fade));
    ScrollTrigger.create({
      trigger: root,
      start: "top 70%",
      once: true,
      onEnter: () => reveals.forEach((reveal) => reveal.play())
    });
    const bleedHeight = () => {
      const coverBottom = Math.max(root.offsetHeight, viewportProbe.offsetHeight, window.innerHeight);
      return 2 * coverBottom - visibleHeight();
    };
    const openInset = () => {
      const x = Math.max(0, (root.clientWidth - bleedItem.offsetWidth) / 2);
      const y = Math.max(0, (bleedHeight() - bleedItem.offsetHeight) / 2);
      return `inset(${-y}px ${-x}px ${-y}px ${-x}px)`;
    };
    const layoutBleedImage = () => {
      const frameWidth = root.clientWidth;
      const frameHeight = bleedHeight();
      Object.assign(bleedImage.style, {
        position: "absolute",
        width: `${frameWidth}px`,
        height: `${frameHeight}px`,
        maxWidth: "none",
        left: `${(bleedItem.offsetWidth - frameWidth) / 2}px`,
        top: `${(bleedItem.offsetHeight - frameHeight) / 2}px`,
        objectFit: "cover"
      });
    };
    bleedImage.sizes = "100vw";
    bleedImage.loading = "eager";
    if (getComputedStyle(bleedItem).position === "static") bleedItem.style.position = "relative";
    bleedItem.style.overflow = "visible";
    layoutBleedImage();
    ScrollTrigger.addEventListener("refreshInit", layoutBleedImage);
    gsap.set(bleedItem, { clipPath: "inset(0px 0px 0px 0px)" });
    const caption = root.querySelector("[data-history-collapse-caption]");
    if (caption) {
      caption.style.zIndex = "4";
      caption.style.pointerEvents = "none";
      gsap.set(caption, { autoAlpha: 0 });
    }
    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: () => `+=${distance * viewportProbe.offsetHeight}`,
        pin: true,
        // Pins a frame early so iOS native scroll does not jump past the pin start.
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true
      }
    });
    timeline.to(
      items,
      {
        x: (index) => deltaToCentre(items[index]).x,
        y: (index) => deltaToCentre(items[index]).y,
        // Keeps the cards on their own GPU layers so Safari composites the
        // clip-path below instead of repainting the full-screen photo each frame.
        force3D: true,
        duration: 1
      },
      0
    ).to(fades, { autoAlpha: 0, duration: 0.4, ease: "none" }, 0.6).to(bleedItem, { clipPath: openInset, duration: 1.2 }, 1).to({}, { duration: 0.4 }, 2.4);
    if (caption) {
      timeline.to(caption, { autoAlpha: 1, duration: 0.4, ease: "none" }, 2.2);
    }
  };

  // src/utils/hoverFollowImage.ts
  var ACTIVE_CLASS2 = "is-active";
  var DURATION2 = 0.35;
  var HOVER_OPACITY = 0.55;
  var hoverFollowImage = () => {
    const zones = document.querySelectorAll("[data-hover-image]");
    if (!zones.length) return;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    zones.forEach((zone) => {
      const media = zone.querySelector("[data-hover-image-media]");
      const items = zone.querySelectorAll("[data-hover-image-item]");
      if (!media || !items.length) return;
      gsap.set(media, { autoAlpha: 0, pointerEvents: "none" });
      if (!canHover || reducedMotion) return;
      const image = media.querySelector("img");
      if (getComputedStyle(zone).position === "static") gsap.set(zone, { position: "relative" });
      gsap.set(media, { position: "absolute", top: 0, left: 0, xPercent: -50, yPercent: -50, zIndex: 0 });
      const moveX = gsap.quickTo(media, "x", { duration: 0.5, ease: "power3.out" });
      const moveY = gsap.quickTo(media, "y", { duration: 0.5, ease: "power3.out" });
      const follow = (event) => {
        const rect = zone.getBoundingClientRect();
        moveX(event.clientX - rect.left);
        moveY(event.clientY - rect.top);
      };
      const show = (item, event) => {
        const source = item.getAttribute("data-hover-image-src");
        const alt = item.getAttribute("data-hover-image-alt");
        if (image && source && image.getAttribute("src") !== source) {
          image.removeAttribute("srcset");
          image.removeAttribute("sizes");
          image.loading = "eager";
          image.src = source;
        }
        if (image && alt !== null) image.alt = alt;
        items.forEach((other) => other.classList.toggle(ACTIVE_CLASS2, other === item));
        if (!media.classList.contains(ACTIVE_CLASS2)) {
          const rect = zone.getBoundingClientRect();
          gsap.set(media, { x: event.clientX - rect.left, y: event.clientY - rect.top });
        }
        media.classList.add(ACTIVE_CLASS2);
        gsap.to(media, { autoAlpha: HOVER_OPACITY, duration: DURATION2, ease: "power2.out", overwrite: "auto" });
      };
      const hide = () => {
        items.forEach((item) => item.classList.remove(ACTIVE_CLASS2));
        media.classList.remove(ACTIVE_CLASS2);
        gsap.to(media, { autoAlpha: 0, duration: DURATION2, ease: "power2.in", overwrite: "auto" });
      };
      items.forEach((item) => {
        item.addEventListener("pointerenter", (event) => show(item, event));
        item.addEventListener("pointerleave", (event) => {
          const next = event.relatedTarget;
          if (next instanceof Element && next.closest("[data-hover-image-item]")) return;
          hide();
        });
      });
      zone.addEventListener("pointermove", follow);
      zone.addEventListener(
        "pointerenter",
        () => {
          items.forEach((item) => {
            const source = item.getAttribute("data-hover-image-src");
            if (source) {
              const preload = new Image();
              preload.src = source;
            }
          });
        },
        { once: true }
      );
    });
  };

  // src/utils/hoverImageSwap.ts
  var ROOT_SELECTOR = "[data-hover-swap]";
  var ACTIVE_CLASS3 = "is-active";
  var DEFAULT_KEY = "default";
  var FADE_DURATION = 0.6;
  var HOVER_QUERY = "(hover: hover) and (pointer: fine)";
  var REDUCED_MOTION3 = "(prefers-reduced-motion: reduce)";
  var setupSwap = (root) => {
    const triggers = Array.from(root.querySelectorAll("[data-hover-swap-trigger]"));
    const media = Array.from(root.querySelectorAll("[data-hover-swap-media]"));
    if (!triggers.length || !media.length) return;
    const fallback = media.find((item) => item.dataset.hoverSwapMedia === DEFAULT_KEY) ?? media[0];
    let current = fallback;
    fallback.classList.add(ACTIVE_CLASS3);
    const hoverQuery = window.matchMedia(HOVER_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION3);
    const show = (key) => {
      const next = media.find((item) => item.dataset.hoverSwapMedia === key) ?? fallback;
      if (next === current) return;
      const previous = current;
      current = next;
      media.forEach((item) => item.classList.toggle(ACTIVE_CLASS3, item === next));
      gsap.killTweensOf(media);
      media.forEach((item) => {
        if (item !== next && item !== previous) gsap.set(item, { autoAlpha: 0, zIndex: 0 });
      });
      gsap.set(previous, { zIndex: 1 });
      gsap.set(next, { zIndex: 2 });
      if (reducedMotionQuery.matches) {
        gsap.set(next, { autoAlpha: 1 });
        gsap.set(previous, { autoAlpha: 0 });
        return;
      }
      gsap.to(next, {
        autoAlpha: 1,
        duration: FADE_DURATION,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(previous, { autoAlpha: 0 });
        }
      });
    };
    triggers.forEach((trigger) => {
      const key = trigger.dataset.hoverSwapTrigger ?? "";
      trigger.addEventListener("mouseenter", () => {
        if (hoverQuery.matches) show(key);
      });
      trigger.addEventListener("focus", () => show(key));
    });
    const list = root.querySelector("[data-hover-swap-list]") ?? root;
    list.addEventListener("mouseleave", () => show(DEFAULT_KEY));
    root.addEventListener("hover-swap:reset", () => show(DEFAULT_KEY));
    root.addEventListener("focusout", (event) => {
      const nextFocus = event.relatedTarget;
      const staysOnTrigger = nextFocus instanceof Element && root.contains(nextFocus) && nextFocus.closest("[data-hover-swap-trigger]") !== null;
      if (!staysOnTrigger) show(DEFAULT_KEY);
    });
  };
  var hoverImageSwap = () => {
    const roots = document.querySelectorAll(ROOT_SELECTOR);
    if (!roots.length) return;
    roots.forEach(setupSwap);
  };

  // src/utils/imageHoverScale.ts
  var DEFAULT_SCALE = 1.1;
  var DEFAULT_DURATION = 0.5;
  var readNumber = (value, fallback) => {
    const parsed = value ? parseFloat(value) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  var imageHoverScale = () => {
    const scaleTargets = document.querySelectorAll("[data-hover-scale]");
    if (!scaleTargets.length) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    scaleTargets.forEach((target) => {
      const parentElement = target.parentElement;
      if (!parentElement) return;
      const scale = readNumber(target.getAttribute("data-hover-scale"), DEFAULT_SCALE);
      const duration = readNumber(
        target.getAttribute("data-hover-scale-duration"),
        DEFAULT_DURATION
      );
      gsap.set(parentElement, { overflow: "hidden" });
      parentElement.addEventListener("mouseenter", () => {
        gsap.to(target, { scale, duration, ease: "power2.out" });
      });
      parentElement.addEventListener("mouseleave", () => {
        gsap.to(target, { scale: 1, duration, ease: "power2.out" });
      });
    });
  };

  // src/utils/imageStackCollapse.ts
  var DEFAULT_START = "top 55%";
  var DEFAULT_END = "center 40%";
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

  // src/utils/imageTrailHover.ts
  var DEFAULT_THRESHOLD = 100;
  var DEFAULT_MAX_VISIBLE = 3;
  var DEFAULT_DURATION2 = 0.6;
  var STATIC_STEP_X = 125;
  var STATIC_STEP_Y = 110;
  var COLLAGE_TILE_WIDTH = "45.7%";
  var COLLAGE_LAYOUT = [
    { left: "-15.7%", top: "2%" },
    { left: "12%", top: "13.4%" },
    { left: "34.9%", top: "31.8%" },
    { left: "60%", top: "47.5%" },
    { left: "30.9%", top: "63.8%" },
    { left: "0.9%", top: "77.2%" },
    { left: "-22%", top: "90.6%" }
  ];
  var readNumber2 = (value, fallback) => {
    const parsed = value ? parseFloat(value) : NaN;
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  var startTrail = (zone, items, threshold, maxVisible, duration) => {
    gsap.set(items, {
      position: "absolute",
      top: 0,
      left: 0,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0
    });
    const visibleItems = [];
    let nextIndex = 0;
    let topZIndex = 1;
    let lastSpawnX = null;
    let lastSpawnY = 0;
    const hideItem = (item) => {
      item.classList.remove("is-active");
      gsap.to(item, {
        autoAlpha: 0,
        scale: 0.9,
        duration: duration * 0.75,
        ease: "power2.in"
      });
    };
    const showItem = (x, y) => {
      const item = items[nextIndex];
      nextIndex = (nextIndex + 1) % items.length;
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) visibleItems.splice(visibleIndex, 1);
      visibleItems.push(item);
      topZIndex += 1;
      gsap.killTweensOf(item);
      gsap.set(item, { x, y, zIndex: topZIndex });
      gsap.fromTo(
        item,
        { autoAlpha: 0, scale: 0.85 },
        { autoAlpha: 1, scale: 1, duration, ease: "power3.out" }
      );
      item.classList.add("is-active");
      while (visibleItems.length > maxVisible) {
        const oldestItem = visibleItems.shift();
        if (oldestItem) hideItem(oldestItem);
      }
    };
    const handlePointerMove = (event) => {
      if (event.pointerType !== "mouse") return;
      const bounds = zone.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      if (lastSpawnX !== null && Math.hypot(pointerX - lastSpawnX, pointerY - lastSpawnY) < threshold) {
        return;
      }
      lastSpawnX = pointerX;
      lastSpawnY = pointerY;
      showItem(pointerX, pointerY);
    };
    const handlePointerLeave = () => {
      lastSpawnX = null;
      visibleItems.splice(0).forEach(hideItem);
    };
    zone.addEventListener("pointermove", handlePointerMove);
    zone.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      zone.removeEventListener("pointermove", handlePointerMove);
      zone.removeEventListener("pointerleave", handlePointerLeave);
      items.forEach((item) => {
        gsap.killTweensOf(item);
        item.classList.remove("is-active");
      });
    };
  };
  var showEndState = (items, maxVisible) => {
    gsap.set(items, {
      position: "absolute",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0
    });
    const shownItems = items.slice(0, maxVisible);
    shownItems.forEach((item, index) => {
      const offset = index - (shownItems.length - 1) / 2;
      gsap.set(item, {
        x: offset * STATIC_STEP_X,
        y: offset * STATIC_STEP_Y,
        zIndex: index + 1,
        autoAlpha: 1
      });
      item.classList.add("is-active");
    });
    return () => {
      shownItems.forEach((item) => item.classList.remove("is-active"));
    };
  };
  var showCollage = (items) => {
    gsap.set(items, { position: "absolute", autoAlpha: 0 });
    const shownItems = items.slice(0, COLLAGE_LAYOUT.length);
    shownItems.forEach((item, index) => {
      gsap.set(item, {
        ...COLLAGE_LAYOUT[index],
        width: COLLAGE_TILE_WIDTH,
        zIndex: index + 1,
        autoAlpha: 1
      });
      item.classList.add("is-active");
    });
    return () => {
      shownItems.forEach((item) => item.classList.remove("is-active"));
    };
  };
  var imageTrailHover = () => {
    const zones = document.querySelectorAll("[data-image-trail-hover]");
    if (!zones.length) return;
    zones.forEach((zone) => {
      const items = Array.from(
        zone.querySelectorAll("[data-image-trail-hover-item]")
      );
      if (!items.length) return;
      const threshold = readNumber2(zone.dataset.imageTrailHoverThreshold, DEFAULT_THRESHOLD);
      const maxVisible = Math.max(
        1,
        Math.round(readNumber2(zone.dataset.imageTrailHoverMax, DEFAULT_MAX_VISIBLE))
      );
      const duration = readNumber2(zone.dataset.imageTrailHoverDuration, DEFAULT_DURATION2);
      const mm = gsap.matchMedia();
      mm.add(
        {
          isCollage: "(max-width: 767px)",
          isAnimated: "(hover: hover) and (prefers-reduced-motion: no-preference)",
          isStatic: "(hover: none), (prefers-reduced-motion: reduce)"
        },
        (context) => {
          if (context.conditions.isCollage) return showCollage(items);
          if (context.conditions.isAnimated) {
            return startTrail(zone, items, threshold, maxVisible, duration);
          }
          return showEndState(items, maxVisible);
        }
      );
    });
  };

  // src/utils/mapNeeds.ts
  var CALLBACK_NAME = "__ib__";
  var mapNeeds = (apiKey) => {
    const googleNamespace = window.google ||= {};
    const mapsNamespace = googleNamespace.maps ||= {};
    if (mapsNamespace.importLibrary) return;
    const requestedLibraries = /* @__PURE__ */ new Set();
    let scriptPromise = null;
    const loadScript = () => scriptPromise ||= new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        key: apiKey,
        v: "weekly",
        libraries: [...requestedLibraries].join(","),
        callback: `google.maps.${CALLBACK_NAME}`
      });
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
      script.async = true;
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("The Google Maps JavaScript API could not load."));
      };
      mapsNamespace[CALLBACK_NAME] = () => resolve();
      document.head.append(script);
    });
    mapsNamespace.importLibrary = (name) => {
      requestedLibraries.add(name);
      return loadScript().then(() => google.maps.importLibrary(name));
    };
  };

  // src/utils/map.ts
  var ACTIVE_CLASS4 = "is-active";
  var DEFAULT_ZOOM = 15;
  var MAX_ZOOM = 18;
  var PANEL_GAP = 48;
  var pinColors = {
    normal: { fill: "#906E58", stroke: "#F4EFDF" },
    active: { fill: "#272516", stroke: "#F4EFDF" },
    home: { fill: "#F4EFDF", stroke: "#272516" }
  };
  var mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#ECE8DD" }] },
    { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#6F6A5E" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#F4EFDF" }] },
    { featureType: "poi", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.land_parcel", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#FFFFFF" }] },
    { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#FBF9F3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#DCD5C3" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#C9D1CF" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#8C9693" }] }
  ];
  var parseLatLng = (value) => {
    if (!value) return null;
    const [lat, lng] = value.split(",").map((part) => Number(part.trim()));
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  };
  var directionsUrl = ({ lat, lng }) => `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  var coordinatesOf = (item) => {
    const fromAttribute = parseLatLng(item.getAttribute("data-map-coordinates"));
    if (!fromAttribute) return coordinatesFromLink(item);
    item.querySelectorAll("[data-map-directions]").forEach((link) => {
      link.href = directionsUrl(fromAttribute);
    });
    return fromAttribute;
  };
  var coordinatesFromLink = (item) => {
    const link = item.querySelector('a[href*="destination="]');
    if (!link) return null;
    try {
      return parseLatLng(new URL(link.href).searchParams.get("destination"));
    } catch {
      return null;
    }
  };
  var itemTitle = (item) => item.getAttribute("data-map-item") || item.firstElementChild?.textContent?.trim() || "";
  var pinMarkup = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" aria-hidden="true" style="display:block;overflow:visible"><circle cx="18" cy="18" r="17" stroke-width="2" style="transition:fill 300ms ease,stroke 300ms ease"/></svg>`;
  var paintPin = (pin, colors, scale) => {
    const circle = pin.querySelector("circle");
    if (circle) {
      circle.style.fill = colors.fill;
      circle.style.stroke = colors.stroke;
    }
    pin.style.transform = `translate(-50%, -50%) scale(${scale})`;
  };
  var collectPoints = (root) => {
    const scope = root.closest("section") ?? document;
    const points = [];
    scope.querySelectorAll("[data-map-item]").forEach((item) => {
      const position = coordinatesOf(item);
      if (position) points.push({ title: itemTitle(item), position, item });
    });
    return points;
  };
  var boundsPadding = (root) => {
    const padding = { top: 96, right: 96, bottom: 96, left: 96 };
    const rootRect = root.getBoundingClientRect();
    let panel = null;
    let ancestor = root.closest("section")?.querySelector("[data-map-item]")?.parentElement;
    while (ancestor && !ancestor.contains(root)) {
      if (ancestor.getBoundingClientRect().width < rootRect.width / 2) panel = ancestor;
      ancestor = ancestor.parentElement;
    }
    if (!panel) return padding;
    const panelRect = panel.getBoundingClientRect();
    const overlap = panelRect.right - rootRect.left;
    if (overlap > 0 && overlap < rootRect.width / 2) padding.left = overlap + PANEL_GAP;
    return padding;
  };
  var buildMap = async (root, points) => {
    const { Map: GoogleMap, OverlayView } = await google.maps.importLibrary("maps");
    const { LatLngBounds } = await google.maps.importLibrary("core");
    const canvas = document.createElement("div");
    canvas.className = "map_canvas";
    canvas.style.cssText = "position:absolute;inset:0;";
    root.append(canvas);
    window.gm_authFailure = () => canvas.remove();
    const home = parseLatLng(root.getAttribute("data-map-home"));
    const zoomAttribute = Number(root.getAttribute("data-map-zoom"));
    const startZoom = zoomAttribute > 0 ? zoomAttribute : DEFAULT_ZOOM;
    const googleMap = new GoogleMap(canvas, {
      center: home ?? points[0].position,
      zoom: startZoom,
      maxZoom: MAX_ZOOM,
      styles: mapStyles,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "cooperative",
      clickableIcons: false
    });
    class PinOverlay extends OverlayView {
      constructor(position, element) {
        super();
        this.position = position;
        this.element = element;
        element.style.position = "absolute";
        element.style.transition = "transform 300ms ease";
      }
      onAdd() {
        this.getPanes()?.overlayMouseTarget.append(this.element);
      }
      draw() {
        const pixel = this.getProjection().fromLatLngToDivPixel(this.position);
        if (!pixel) return;
        this.element.style.left = `${pixel.x}px`;
        this.element.style.top = `${pixel.y}px`;
      }
      onRemove() {
        this.element.remove();
      }
    }
    const bounds = new LatLngBounds();
    if (home) {
      const homePin = document.createElement("div");
      homePin.title = root.getAttribute("data-map-home-title") ?? "";
      homePin.innerHTML = pinMarkup(24);
      homePin.style.zIndex = "1";
      paintPin(homePin, pinColors.home, 1);
      new PinOverlay(home, homePin).setMap(googleMap);
      bounds.extend(home);
    }
    const pins = points.map((point) => {
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = "map_pin";
      pin.title = point.title;
      pin.setAttribute("aria-label", point.title);
      pin.style.cssText = "padding:0;border:0;background:none;cursor:pointer;z-index:2;";
      pin.innerHTML = pinMarkup(36);
      paintPin(pin, pinColors.normal, 1);
      new PinOverlay(point.position, pin).setMap(googleMap);
      bounds.extend(point.position);
      return pin;
    });
    let pinnedIndex = null;
    const highlight = (activeIndex) => {
      points.forEach((point, index) => {
        const isActive = index === activeIndex;
        point.item?.classList.toggle(ACTIVE_CLASS4, isActive);
        pins[index].classList.toggle(ACTIVE_CLASS4, isActive);
        pins[index].style.zIndex = isActive ? "3" : "2";
        paintPin(pins[index], isActive ? pinColors.active : pinColors.normal, isActive ? 1.3 : 1);
      });
    };
    const pinHighlight = (index) => {
      pinnedIndex = index;
      highlight(index);
    };
    points.forEach((point, index) => {
      const pin = pins[index];
      pin.addEventListener("mouseenter", () => highlight(index));
      pin.addEventListener("mouseleave", () => highlight(pinnedIndex));
      pin.addEventListener("focus", () => highlight(index));
      pin.addEventListener("blur", () => highlight(pinnedIndex));
      pin.addEventListener("click", () => pinHighlight(index));
      const item = point.item;
      if (!item) return;
      item.style.cursor = "pointer";
      item.addEventListener("mouseenter", () => highlight(index));
      item.addEventListener("mouseleave", () => highlight(pinnedIndex));
      item.addEventListener("focusin", () => highlight(index));
      item.addEventListener("focusout", () => highlight(pinnedIndex));
      item.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        pinHighlight(index);
        googleMap.panTo(point.position);
      });
    });
    if (points.length + (home ? 1 : 0) > 1) {
      google.maps.event.addListenerOnce(googleMap, "idle", () => {
        if ((googleMap.getZoom() ?? startZoom) > startZoom) googleMap.setZoom(startZoom);
      });
      googleMap.fitBounds(bounds, boundsPadding(root));
    }
  };
  var map = () => {
    const root = document.querySelector("[data-map]");
    if (!root) return;
    const apiKey = root.getAttribute("data-map-key");
    const points = collectPoints(root);
    if (!apiKey || !points.length) return;
    mapNeeds(apiKey);
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        buildMap(root, points).catch((error) => console.warn("[map]", error));
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(root);
  };

  // src/utils/mediaTabs.ts
  var ROOT_SELECTOR2 = "[data-media-tabs]";
  var ACTIVE_CLASS5 = "is-active";
  var FADE_DURATION2 = 0.6;
  var REDUCED_MOTION4 = "(prefers-reduced-motion: reduce)";
  var TEXT_TAGS2 = /* @__PURE__ */ new Set(["H1", "H2", "H3", "H4", "H5", "H6", "P"]);
  var TARGET_SELECTOR2 = "h1, h2, h3, h4, h5, h6, p, .button, [data-line-mask]";
  var HIDDEN_BELOW = 110;
  var HIDDEN_ABOVE = -110;
  var OUT_DURATION = 0.45;
  var OUT_STAGGER = 0.03;
  var IN_DURATION = 0.9;
  var IN_STAGGER = 0.06;
  var instanceCount = 0;
  var mediaTabs = () => {
    const roots = document.querySelectorAll(ROOT_SELECTOR2);
    if (!roots.length) return;
    roots.forEach((root) => setupTabs(root));
  };
  var setupTabs = (root) => {
    const tabs = Array.from(root.querySelectorAll("[data-media-tabs-tab]"));
    const panels = Array.from(root.querySelectorAll("[data-media-tabs-panel]"));
    const media = Array.from(root.querySelectorAll("[data-media-tabs-media]"));
    if (!tabs.length || tabs.length !== panels.length) {
      console.warn("[mediaTabs] needs one -panel per -tab", root);
      return;
    }
    if (media.length && media.length !== tabs.length) {
      console.warn("[mediaTabs] needs one -media per -tab when -media is used", root);
      return;
    }
    instanceCount += 1;
    const idPrefix = `media-tabs-${instanceCount}`;
    const list = root.querySelector("[data-media-tabs-list]");
    list?.setAttribute("role", "tablist");
    tabs.forEach((tab, index) => {
      const tabId = tab.id || `${idPrefix}-tab-${index}`;
      const panelId = panels[index].id || `${idPrefix}-panel-${index}`;
      tab.id = tabId;
      panels[index].id = panelId;
      tab.setAttribute("role", "tab");
      tab.setAttribute("aria-controls", panelId);
      panels[index].setAttribute("role", "tabpanel");
      panels[index].setAttribute("aria-labelledby", tabId);
    });
    const panelLayer = panels[0].parentElement;
    if (media.length && panelLayer && getComputedStyle(panelLayer).position !== "static") {
      panelLayer.style.zIndex = "2";
    }
    let activeIndex = 0;
    let initialised = false;
    let switchTimeline = null;
    const reducedMotion = window.matchMedia(REDUCED_MOTION4).matches;
    const panelTargets = panels.map(
      (panel, panelIndex) => reducedMotion ? [] : prepareMaskTargets(panel, () => panelIndex === activeIndex)
    );
    const panelGroups = (index) => panelTargets[index].flatMap((target) => target.groups);
    const groupElements = (index) => panelGroups(index).flat();
    const showPanelOnly = (index) => {
      panels.forEach(
        (panel, panelIndex) => gsap.set(panel, {
          autoAlpha: panelIndex === index ? 1 : 0,
          zIndex: panelIndex === index ? 1 : 0
        })
      );
    };
    const settle = (index) => {
      showPanelOnly(index);
      panels.forEach((_, panelIndex) => {
        const elements = groupElements(panelIndex);
        if (elements.length) {
          gsap.set(elements, { yPercent: panelIndex === index ? 0 : HIDDEN_BELOW });
        }
      });
    };
    const activate = (index, animate) => {
      if (initialised && index === activeIndex) return;
      initialised = true;
      const previous = activeIndex;
      activeIndex = index;
      tabs.forEach((tab, tabIndex) => {
        const isActive = tabIndex === index;
        tab.classList.toggle(ACTIVE_CLASS5, isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });
      [...panels, ...media].forEach(
        (element) => element.classList.toggle(
          ACTIVE_CLASS5,
          panels[index] === element || media[index] === element
        )
      );
      switchTimeline?.progress(1).kill();
      switchTimeline = null;
      const shouldAnimate = animate && !reducedMotion;
      if (media.length) crossfade(media, index, previous, shouldAnimate);
      if (!shouldAnimate) {
        settle(index);
        return;
      }
      const outgoingGroups = panelGroups(previous);
      const incomingGroups = panelGroups(index);
      const outgoingElements = outgoingGroups.flat();
      const incomingElements = incomingGroups.flat();
      const timeline = gsap.timeline();
      outgoingGroups.forEach((group, groupIndex) => {
        timeline.to(
          group,
          { yPercent: HIDDEN_ABOVE, duration: OUT_DURATION, ease: "power3.in" },
          groupIndex * OUT_STAGGER
        );
      });
      const swapAt = outgoingGroups.length ? OUT_DURATION + (outgoingGroups.length - 1) * OUT_STAGGER : 0;
      timeline.set(panels[previous], { autoAlpha: 0, zIndex: 0 }, swapAt);
      timeline.set(panels[index], { autoAlpha: 1, zIndex: 1 }, swapAt);
      if (incomingElements.length) {
        timeline.set(incomingElements, { yPercent: HIDDEN_BELOW }, swapAt);
      }
      incomingGroups.forEach((group, groupIndex) => {
        timeline.to(
          group,
          { yPercent: 0, duration: IN_DURATION, ease: "power3.out" },
          swapAt + groupIndex * IN_STAGGER
        );
      });
      if (outgoingElements.length) {
        timeline.set(outgoingElements, { yPercent: HIDDEN_BELOW }, swapAt);
      }
      switchTimeline = timeline;
    };
    activate(0, false);
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        activate(index, true);
      });
      tab.addEventListener("keydown", (event) => {
        const target = targetIndex(event.key, index, tabs.length);
        if (target === null) return;
        event.preventDefault();
        tabs[target].focus();
        activate(target, true);
      });
    });
  };
  var prepareMaskTargets = (panel, isActive) => {
    const scope = panel.querySelector("[data-media-tabs-content]") ?? panel;
    return findTargets2(scope).map((element) => {
      const target = { groups: [] };
      if (isText2(element)) {
        new SplitText(element, {
          type: "lines,words",
          autoSplit: true,
          onSplit: (self) => {
            const lines = self.lines ?? [];
            gsap.set(lines, { overflow: "hidden" });
            target.groups = lines.map((line) => Array.from(line.children)).filter((words2) => words2.length);
            const words = target.groups.flat();
            if (words.length) gsap.set(words, { yPercent: isActive() ? 0 : HIDDEN_BELOW });
          }
        });
        return target;
      }
      wrapInClip2(element);
      target.groups = [[element]];
      gsap.set(element, { yPercent: isActive() ? 0 : HIDDEN_BELOW });
      return target;
    });
  };
  var findTargets2 = (scope) => {
    const candidates = Array.from(scope.querySelectorAll(TARGET_SELECTOR2));
    return candidates.filter(
      (candidate) => !candidates.some((other) => other !== candidate && other.contains(candidate))
    );
  };
  var isText2 = (element) => element.dataset.lineMask === "text" || TEXT_TAGS2.has(element.tagName);
  var wrapInClip2 = (element) => {
    const parent = element.parentElement;
    if (!parent || parent.dataset.mediaTabsClip !== void 0) return;
    const clip = document.createElement("div");
    clip.dataset.mediaTabsClip = "";
    const display = getComputedStyle(element).display;
    clip.style.display = display.startsWith("inline") ? "inline-block" : "block";
    clip.style.overflow = "hidden";
    parent.insertBefore(clip, element);
    clip.appendChild(element);
  };
  var targetIndex = (key, current, count) => {
    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        return (current + 1) % count;
      case "ArrowLeft":
      case "ArrowUp":
        return (current - 1 + count) % count;
      case "Home":
        return 0;
      case "End":
        return count - 1;
      default:
        return null;
    }
  };
  var crossfade = (elements, index, previous, animate) => {
    const incoming = elements[index];
    gsap.killTweensOf(elements);
    if (!animate || previous === index) {
      elements.forEach(
        (element, elementIndex) => gsap.set(element, {
          autoAlpha: elementIndex === index ? 1 : 0,
          zIndex: elementIndex === index ? 1 : 0
        })
      );
      return;
    }
    elements.forEach((element, elementIndex) => {
      if (elementIndex !== index && elementIndex !== previous) {
        gsap.set(element, { autoAlpha: 0, zIndex: 0 });
      }
    });
    gsap.set(elements[previous], { zIndex: 0 });
    gsap.set(incoming, { zIndex: 1 });
    gsap.fromTo(
      incoming,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: FADE_DURATION2,
        ease: "power2.out",
        onComplete: () => gsap.set(elements[previous], { autoAlpha: 0 })
      }
    );
  };

  // src/utils/scrollTriggerRefresh.ts
  var scrollTriggerRefresh = (contentElement) => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    window.addEventListener("load", () => ScrollTrigger.refresh(true), { once: true });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) ScrollTrigger.refresh(true);
    });
    let refreshPending = false;
    let lastHeight = contentElement.offsetHeight;
    const contentResizeObserver = new ResizeObserver(() => {
      const height = contentElement.offsetHeight;
      if (height === lastHeight || refreshPending) return;
      lastHeight = height;
      refreshPending = true;
      requestAnimationFrame(() => {
        refreshPending = false;
        ScrollTrigger.refresh(true);
      });
    });
    contentResizeObserver.observe(contentElement);
  };

  // src/utils/lenisGsap.ts
  var instance = null;
  var lenis = {
    get raw() {
      return instance;
    },
    stop() {
      instance?.stop();
    },
    start() {
      instance?.start();
    }
  };
  var lenisGsap = (gsapInstance, scrollTrigger) => {
    instance = new Lenis({ wrapper: window, content: document.body });
    gsapInstance.registerPlugin(scrollTrigger);
    instance.on("scroll", scrollTrigger.update);
    gsapInstance.ticker.add((time) => {
      instance?.raf(time * 1e3);
    });
    gsapInstance.ticker.lagSmoothing(0);
    scrollTriggerRefresh(document.body);
    scrollTrigger.addEventListener("refresh", () => instance?.resize());
  };
  var fixedNavOffset = () => {
    const header = document.querySelector('[data-nav="header"]');
    if (!header || getComputedStyle(header).position !== "fixed") return 0;
    const bar = header.querySelector(".site-nav_bar") ?? header;
    return Math.max(0, bar.getBoundingClientRect().bottom);
  };
  var lenisEngine = {
    name: "Lenis",
    init: () => lenisGsap(gsap, ScrollTrigger),
    stop: () => lenis.stop(),
    start: () => lenis.start(),
    scrollTo: (target) => {
      const offset = target.hasAttribute("data-scroll-flush") ? 0 : -fixedNavOffset();
      if (instance) instance.scrollTo(target, { offset });
      else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
    },
    scrollTop: () => instance?.scroll ?? window.scrollY,
    describe: () => instance ? {
      active: true,
      scroll: instance.scroll,
      targetScroll: instance.targetScroll,
      velocity: instance.velocity,
      isScrolling: instance.isScrolling
    } : { active: false }
  };

  // src/utils/modals.ts
  var FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])'
  ].join(",");
  var HASH_SCROLL_TIMEOUT = 5e3;
  var SCROLLABLE_OVERFLOW = ["auto", "scroll"];
  var NATIVE_ACTIVATION_SELECTOR = "a[href], button, input, select, textarea, summary";
  var modals = () => {
    const modalElements = document.querySelectorAll('[role="dialog"]');
    if (!modalElements.length) return;
    const overlayElement = document.querySelector("[data-modal-overlay]");
    modalElements.forEach((modal) => modal.setAttribute("data-lenis-prevent", ""));
    let activeModal = null;
    let activeTrigger = null;
    let modalLenis = null;
    let modalResizeObserver = null;
    const modalTick = (time) => modalLenis?.raf(time * 1e3);
    modalElements.forEach((modal) => {
      if (!modal.id) return;
      const titleElement = modal.querySelector("h1, h2, h3, h4, h5, h6");
      if (titleElement) {
        if (!titleElement.id) titleElement.id = `${modal.id}-title`;
        modal.setAttribute("aria-labelledby", titleElement.id);
      }
      const descriptionElement = modal.querySelector(
        '.w-richtext, [role="document"], p'
      );
      if (descriptionElement) {
        if (!descriptionElement.id) descriptionElement.id = `${modal.id}-desc`;
        modal.setAttribute("aria-describedby", descriptionElement.id);
      }
    });
    document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
      if (trigger.matches(NATIVE_ACTIVATION_SELECTOR)) return;
      if (!trigger.hasAttribute("tabindex")) trigger.setAttribute("tabindex", "0");
      if (!trigger.hasAttribute("role")) trigger.setAttribute("role", "button");
    });
    function getDialog(id) {
      if (!id) return null;
      const element = document.getElementById(id);
      return element && element.getAttribute("role") === "dialog" ? element : null;
    }
    function hashTarget(href) {
      if (!href || !href.startsWith("#") || href.length < 2) return null;
      try {
        return decodeURIComponent(href.slice(1));
      } catch {
        return href.slice(1);
      }
    }
    function getFocusableElements(root) {
      return Array.from(root.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute("disabled") && element.offsetParent !== null
      );
    }
    function isScrollable(element) {
      return SCROLLABLE_OVERFLOW.includes(getComputedStyle(element).overflowY);
    }
    function getScrollContainer(modal) {
      const override = modal.querySelector("[data-modal-scroll]");
      if (override) return override;
      if (isScrollable(modal)) return modal;
      return Array.from(modal.querySelectorAll("*")).find(
        (element) => isScrollable(element)
      ) ?? null;
    }
    function loadModalImages(modal) {
      modal.querySelectorAll('img[loading="lazy"]').forEach((image) => {
        image.loading = "eager";
        if (!image.complete) {
          image.addEventListener("load", () => modalLenis?.resize(), { once: true });
        }
      });
    }
    function startModalScroll(modal) {
      stopModalScroll();
      const scroller = getScrollContainer(modal);
      if (!scroller) return;
      scroller.scrollTop = 0;
      if (typeof Lenis === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      modalLenis = new Lenis({
        wrapper: scroller,
        content: scroller,
        eventsTarget: scroller,
        autoRaf: false
      });
      gsap.ticker.add(modalTick);
      modalResizeObserver = new ResizeObserver(() => modalLenis?.resize());
      Array.from(scroller.children).forEach((child) => modalResizeObserver?.observe(child));
    }
    function stopModalScroll() {
      gsap.ticker.remove(modalTick);
      modalResizeObserver?.disconnect();
      modalLenis?.destroy();
      modalResizeObserver = null;
      modalLenis = null;
    }
    function openModal(modal, trigger) {
      if (activeModal === modal) return;
      const returnTrigger = activeModal && trigger && activeModal.contains(trigger) ? activeTrigger : trigger;
      if (activeModal) closeModal({ restoreFocus: false });
      activeModal = modal;
      activeTrigger = returnTrigger;
      loadModalImages(modal);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      if (trigger?.hasAttribute("data-modal-open")) trigger.setAttribute("aria-expanded", "true");
      const overlayEnabled = overlayElement && !modal.hasAttribute("data-modal-no-overlay");
      if (overlayEnabled) {
        overlayElement.classList.add("is-open");
        overlayElement.setAttribute("aria-hidden", "false");
      }
      lenisEngine.stop();
      startModalScroll(modal);
      focusAfterTransition(modal);
    }
    function focusAfterTransition(modal) {
      const computed = getComputedStyle(modal);
      const duration = parseSecondsList(computed.transitionDuration);
      const delay = parseSecondsList(computed.transitionDelay);
      const waitMs = Math.max(50, (duration + delay) * 1e3 + 50);
      window.setTimeout(() => {
        if (activeModal !== modal) return;
        const focusable = getFocusableElements(modal);
        const firstFocusable = focusable[0] ?? modal;
        firstFocusable.focus({ preventScroll: true });
      }, waitMs);
    }
    function parseSecondsList(value) {
      return Math.max(
        0,
        ...value.split(",").map((v) => {
          const trimmed = v.trim();
          if (trimmed.endsWith("ms")) return parseFloat(trimmed) / 1e3;
          if (trimmed.endsWith("s")) return parseFloat(trimmed);
          return 0;
        })
      );
    }
    function closeModal({ restoreFocus = true } = {}) {
      if (!activeModal) return;
      const modal = activeModal;
      const trigger = activeTrigger;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      if (trigger?.hasAttribute("data-modal-open")) trigger.setAttribute("aria-expanded", "false");
      if (overlayElement) {
        overlayElement.classList.remove("is-open");
        overlayElement.setAttribute("aria-hidden", "true");
      }
      stopModalScroll();
      lenisEngine.start();
      if (restoreFocus) trigger?.focus({ preventScroll: true });
      activeModal = null;
      activeTrigger = null;
    }
    function closeAndScrollTo(section) {
      closeModal({ restoreFocus: false });
      lenisEngine.scrollTo(section);
      if (!section.matches(FOCUSABLE_SELECTOR)) section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    }
    function openFromTrigger(trigger) {
      const modal = getDialog(trigger.getAttribute("data-modal-open"));
      if (modal) openModal(modal, trigger);
    }
    document.addEventListener(
      "click",
      (event) => {
        const link = event.target?.closest('a[href^="#"]');
        const targetId = hashTarget(link?.getAttribute("href") ?? null);
        if (!link || !targetId) return;
        const targetDialog = getDialog(targetId);
        if (targetDialog) {
          event.preventDefault();
          event.stopPropagation();
          openModal(targetDialog, link);
          return;
        }
        if (!activeModal || !link.matches("[data-modal-close]")) return;
        const section = document.getElementById(targetId);
        if (!section) return;
        event.preventDefault();
        event.stopPropagation();
        closeAndScrollTo(section);
      },
      true
    );
    document.addEventListener("click", (event) => {
      const target = event.target;
      const trigger = target?.closest("[data-modal-open]");
      if (trigger) {
        event.preventDefault();
        openFromTrigger(trigger);
        return;
      }
      const closeButton = target?.closest("[data-modal-close]");
      if (closeButton && activeModal) {
        event.preventDefault();
        closeModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      const target = event.target;
      const isActivationKey = event.key === "Enter" || event.key === " " || event.key === "Spacebar";
      if (isActivationKey && target?.matches("[data-modal-open]") && !target.matches(NATIVE_ACTIVATION_SELECTOR)) {
        event.preventDefault();
        openFromTrigger(target);
        return;
      }
      if (!activeModal) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }
      if (event.key === "Tab") {
        const focusable = getFocusableElements(activeModal);
        if (!focusable.length) {
          event.preventDefault();
          return;
        }
        const firstFocusable = focusable[0];
        const lastFocusable = focusable[focusable.length - 1];
        const currentFocus = document.activeElement;
        if (event.shiftKey && currentFocus === firstFocusable) {
          event.preventDefault();
          lastFocusable.focus({ preventScroll: true });
        } else if (!event.shiftKey && currentFocus === lastFocusable) {
          event.preventDefault();
          firstFocusable.focus({ preventScroll: true });
        }
      }
    });
    const initialHash = hashTarget(window.location.hash);
    const initialDialog = getDialog(initialHash);
    if (initialDialog) openModal(initialDialog, null);
    const initialSection = !initialDialog && initialHash ? document.getElementById(initialHash) : null;
    if (initialSection) {
      const imagesAbove = Array.from(document.images).filter(
        (image) => image.compareDocumentPosition(initialSection) & Node.DOCUMENT_POSITION_FOLLOWING
      );
      imagesAbove.forEach((image) => {
        image.loading = "eager";
      });
      const imagesLoaded = Promise.all(
        imagesAbove.filter((image) => !image.complete).map(
          (image) => new Promise((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          })
        )
      );
      const pageLoaded = new Promise((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      });
      const timeout = new Promise((resolve) => window.setTimeout(resolve, HASH_SCROLL_TIMEOUT));
      Promise.race([Promise.all([imagesLoaded, pageLoaded]), timeout]).then(() => {
        ScrollTrigger.refresh();
        lenisEngine.scrollTo(initialSection);
      });
    }
    window.addEventListener("hashchange", () => {
      const dialog = getDialog(hashTarget(window.location.hash));
      if (dialog) openModal(dialog, null);
    });
  };

  // src/utils/navTheme.ts
  var HEADER_SELECTOR = '[data-nav="header"]';
  var BAR_SELECTOR = ".site-nav_bar";
  var DARK_COLOR = "var(--_primitives---colors--neutral-darkest, #262118)";
  var LIGHT_COLOR = "var(--_primitives---colors--neutral-lightest, #f4efdf)";
  var OPEN_CLASS = "is-nav-open";
  var LIGHT_LUMINANCE = 0.5;
  var PHOTO_MIN_WIDTH = 0.6;
  var PHOTO_SELECTOR = "figure, video";
  var NOT_PHOTO_SELECTOR = '[class*="map"], [class*="map"] *';
  var navTheme = () => {
    const header = document.querySelector(HEADER_SELECTOR);
    const bar = header?.querySelector(BAR_SELECTOR);
    if (!header || !bar) return;
    const darkBase = isDarkColor(getComputedStyle(header).color);
    const overlay = document.createElement("div");
    overlay.setAttribute("aria-hidden", "true");
    overlay.inert = true;
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      zIndex: "101",
      pointerEvents: "none",
      color: darkBase ? LIGHT_COLOR : DARK_COLOR
    });
    document.body.appendChild(overlay);
    const buildClone = () => {
      const clone = bar.cloneNode(true);
      clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
      clone.querySelectorAll("[data-nav], [data-nav-mode]").forEach((element) => {
        element.removeAttribute("data-nav");
        element.removeAttribute("data-nav-mode");
      });
      clone.querySelectorAll('a, button, [tabindex], [role="button"]').forEach(
        (element) => element.setAttribute("tabindex", "-1")
      );
      overlay.replaceChildren(clone);
    };
    buildClone();
    new MutationObserver(() => {
      buildClone();
      lastGradient = "";
    }).observe(bar, { attributes: true, attributeFilter: ["class"], subtree: true });
    let lightAreas = [];
    let darkAreas = [];
    let photos = [];
    const classifyAreas = () => {
      lightAreas = [];
      darkAreas = [];
      document.querySelectorAll("section, [data-header-theme]").forEach((element) => {
        if (header.contains(element)) return;
        const forced = element.dataset.headerTheme;
        if (forced === "dark") return void lightAreas.push(element);
        if (forced === "white") return void darkAreas.push(element);
        const background = effectiveBackground(element);
        if (!background) return;
        if (luminance(background) > LIGHT_LUMINANCE) lightAreas.push(element);
        else darkAreas.push(element);
      });
      photos = Array.from(document.querySelectorAll(PHOTO_SELECTOR)).filter(
        (element) => !header.contains(element) && !overlay.contains(element) && !element.matches(NOT_PHOTO_SELECTOR)
      ).map((element) => ({ element, clipHost: findClipHost(element) }));
    };
    classifyAreas();
    let navHeight = bar.offsetHeight;
    let lastGradient = "";
    const bandInterval = (top, bottom) => {
      const start = Math.max(0, Math.min(top, navHeight));
      const end = Math.max(0, Math.min(bottom, navHeight));
      return end > start ? { start, end } : null;
    };
    const updateMask = () => {
      if (header.classList.contains(OPEN_CLASS)) return;
      const light = [];
      lightAreas.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const interval = bandInterval(rect.top, rect.bottom);
        if (interval) light.push(interval);
      });
      const dark = [];
      darkAreas.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const interval = bandInterval(rect.top, rect.bottom);
        if (interval) dark.push(interval);
      });
      const minPhotoWidth = window.innerWidth * PHOTO_MIN_WIDTH;
      photos.forEach(({ element, clipHost }) => {
        const rect = element.getBoundingClientRect();
        if (rect.top > navHeight || rect.bottom < 0 || rect.width < minPhotoWidth) return;
        let top = rect.top;
        let bottom = rect.bottom;
        if (clipHost) {
          const clipped = visibleVerticalRange(clipHost, clipHost.getBoundingClientRect());
          if (!clipped) return;
          top = Math.max(top, clipped.top);
          bottom = Math.min(bottom, clipped.bottom);
        }
        const interval = bandInterval(top, bottom);
        if (interval) dark.push(interval);
      });
      const lightVisible = subtractIntervals(light, dark);
      const shown = darkBase ? subtractIntervals([{ start: 0, end: navHeight }], lightVisible) : lightVisible;
      const gradient = buildMaskGradient(shown, navHeight);
      if (gradient === lastGradient) return;
      lastGradient = gradient;
      overlay.style.maskImage = gradient;
      overlay.style.setProperty("-webkit-mask-image", gradient);
    };
    new MutationObserver(() => {
      if (header.classList.contains(OPEN_CLASS)) {
        overlay.style.visibility = "hidden";
        return;
      }
      lastGradient = "";
      updateMask();
      overlay.style.visibility = "";
    }).observe(header, { attributes: true, attributeFilter: ["class"] });
    updateMask();
    const tick = () => {
      updateMask();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.addEventListener(
      "resize",
      () => {
        navHeight = bar.offsetHeight;
        classifyAreas();
        lastGradient = "";
      },
      { passive: true }
    );
    window.addEventListener("load", classifyAreas, { once: true });
  };
  var effectiveBackground = (element) => {
    let node = element;
    while (node) {
      const color = parseColor(getComputedStyle(node).backgroundColor);
      if (color && color.alpha >= 0.5) return color;
      node = node.parentElement;
    }
    return null;
  };
  var findClipHost = (element) => {
    let node = element;
    while (node && node !== document.body) {
      if (getComputedStyle(node).clipPath !== "none") return node;
      node = node.parentElement;
    }
    return null;
  };
  var visibleVerticalRange = (element, rect) => {
    const clipPath = getComputedStyle(element).clipPath;
    if (!clipPath || clipPath === "none") return { top: rect.top, bottom: rect.bottom };
    const inset = clipPath.match(/^inset\((.*)\)$/)?.[1];
    if (inset) {
      const values = inset.split(/\s+(?![^(]*\))/).map((value) => resolveLength(value, rect.height));
      const topInset = values[0] ?? 0;
      const bottomInset = values[2] ?? topInset;
      return { top: rect.top + topInset, bottom: rect.bottom - bottomInset };
    }
    const polygon = clipPath.match(/^polygon\((.*)\)$/)?.[1];
    if (polygon) {
      const ys = polygon.split(",").map((point) => point.trim().split(/\s+(?![^(]*\))/)[1]).map((value) => resolveLength(value, rect.height));
      if (!ys.length) return null;
      return { top: rect.top + Math.min(...ys), bottom: rect.top + Math.max(...ys) };
    }
    return { top: rect.top, bottom: rect.bottom };
  };
  var resolveLength = (value, length) => {
    if (!value) return 0;
    const calc = value.match(/^calc\(\s*100%\s*-\s*([\d.]+)px\s*\)$/);
    if (calc) return length - parseFloat(calc[1]);
    if (value.endsWith("%")) return parseFloat(value) / 100 * length;
    return parseFloat(value) || 0;
  };
  var subtractIntervals = (bases, cuts) => {
    if (!cuts.length) return bases;
    const result = [];
    bases.forEach((base) => {
      let segments = [base];
      cuts.forEach((cut) => {
        const next = [];
        segments.forEach((segment) => {
          if (cut.end <= segment.start || cut.start >= segment.end) {
            next.push(segment);
            return;
          }
          if (cut.start > segment.start) next.push({ start: segment.start, end: cut.start });
          if (cut.end < segment.end) next.push({ start: cut.end, end: segment.end });
        });
        segments = next;
      });
      result.push(...segments);
    });
    return result;
  };
  var buildMaskGradient = (intervals, navHeight) => {
    if (!intervals.length) return "linear-gradient(transparent, transparent)";
    const sorted = [...intervals].sort((first, second) => first.start - second.start);
    const stops = [];
    let cursor = 0;
    sorted.forEach(({ start, end }) => {
      if (start > cursor) stops.push(`transparent ${cursor}px`, `transparent ${start}px`);
      stops.push(`black ${Math.max(start, cursor)}px`, `black ${end}px`);
      cursor = Math.max(cursor, end);
    });
    if (cursor < navHeight) stops.push(`transparent ${cursor}px`, `transparent ${navHeight}px`);
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
  };
  var parseColor = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const [red, green, blue, alpha = 1] = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { red, green, blue, alpha };
  };
  var luminance = ({ red, green, blue }) => {
    const channel = (value) => {
      const normalised = value / 255;
      return normalised <= 0.03928 ? normalised / 12.92 : ((normalised + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
  };
  var isDarkColor = (value) => {
    const color = parseColor(value);
    return color ? luminance(color) <= LIGHT_LUMINANCE : false;
  };

  // src/utils/navToggle.ts
  var OPEN_CLASS2 = "is-nav-open";
  var MOBILE_QUERY = "(max-width: 991px)";
  var OPEN_LABEL = "Open menu";
  var CLOSE_LABEL = "Close menu";
  var REDUCED_MOTION5 = "(prefers-reduced-motion: reduce)";
  var ICON_ORIGIN = "18.5 8";
  var ICON_CROSS_BAR = { x: 8.5, y: 7, width: 20, height: 2 };
  var navToggle = () => {
    const toggle = document.querySelector('[data-nav="open"]');
    const header = document.querySelector('[data-nav="header"]');
    if (!toggle || !header) return;
    const menu = document.querySelector('[data-nav="menu"]');
    const navLinks = document.querySelectorAll('[data-nav="link"]');
    const navLists = Array.from(document.querySelectorAll('[data-nav="list"]'));
    if (toggle.tagName !== "BUTTON") {
      toggle.setAttribute("role", "button");
      if (!toggle.hasAttribute("tabindex")) toggle.setAttribute("tabindex", "0");
    }
    toggle.setAttribute("aria-label", OPEN_LABEL);
    toggle.setAttribute("aria-expanded", "false");
    if (menu) {
      if (!menu.id) menu.id = "nav-menu";
      toggle.setAttribute("aria-controls", menu.id);
    }
    const iconBars = Array.from(toggle.querySelectorAll("svg rect")).sort(
      (first, second) => Number(first.getAttribute("y") ?? 0) - Number(second.getAttribute("y") ?? 0)
    );
    let iconTimeline = null;
    if (iconBars.length === 3) {
      const [topBar, middleBar, bottomBar] = iconBars;
      iconTimeline = gsap.timeline({ paused: true, defaults: { duration: 0.35, ease: "power2.inOut" } }).to(topBar, { attr: ICON_CROSS_BAR, rotation: 45, svgOrigin: ICON_ORIGIN }, 0).to(bottomBar, { attr: ICON_CROSS_BAR, rotation: -45, svgOrigin: ICON_ORIGIN }, 0).to(middleBar, { autoAlpha: 0, duration: 0.2 }, 0);
    }
    const setIcon = (toOpen) => {
      if (!iconTimeline) return;
      if (window.matchMedia(REDUCED_MOTION5).matches) iconTimeline.progress(toOpen ? 1 : 0).pause();
      else if (toOpen) iconTimeline.play();
      else iconTimeline.reverse();
    };
    let isAnimating = false;
    let scrollWasStopped = false;
    const locksAtEveryWidth = header.dataset.navLock === "always";
    const shouldLockScroll = () => locksAtEveryWidth || window.matchMedia(MOBILE_QUERY).matches;
    const isOpen = () => header.classList.contains(OPEN_CLASS2);
    const menuItems = () => navLists.flatMap((list) => Array.from(list.children));
    const open = () => {
      header.classList.add(OPEN_CLASS2);
      if (shouldLockScroll()) {
        lenisEngine.stop();
        scrollWasStopped = true;
      }
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", CLOSE_LABEL);
      setIcon(true);
      const items = menuItems();
      if (items.length) {
        gsap.fromTo(
          items,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
        );
      }
    };
    const close = () => {
      if (isAnimating) return;
      isAnimating = true;
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", OPEN_LABEL);
      setIcon(false);
      const timeline = gsap.timeline({
        onComplete: () => {
          header.classList.remove(OPEN_CLASS2);
          if (scrollWasStopped) {
            lenisEngine.start();
            scrollWasStopped = false;
          }
          isAnimating = false;
        }
      });
      const items = menuItems();
      if (items.length) {
        timeline.to(items, { autoAlpha: 0, y: 8, duration: 0.35, ease: "power2.in" }, 0);
      }
    };
    const handleToggle = (event) => {
      event?.preventDefault();
      if (isAnimating) return;
      if (isOpen()) close();
      else open();
    };
    toggle.addEventListener("click", handleToggle);
    toggle.addEventListener("keydown", (event) => {
      if (toggle.tagName === "BUTTON") return;
      if (event.key === "Enter" && toggle.tagName === "A") return;
      if (event.key === "Enter" || event.key === " ") {
        handleToggle(event);
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) close();
    });
    navLinks.forEach(
      (link) => link.addEventListener("click", () => {
        if (isOpen()) close();
      })
    );
  };

  // src/utils/offersSliderSplit.ts
  var padNumber = (value) => String(value).padStart(2, "0");
  var offersSliderSplit = () => {
    const sliders = document.querySelectorAll("[data-offers-slider]");
    if (!sliders.length) return;
    sliders.forEach((slider) => {
      const container = slider.querySelector(".swiper.offers");
      if (!container) return;
      const slideCount = container.querySelectorAll(".swiper-slide").length;
      const controls = slider.querySelector("[data-offers-slider-controls]");
      const previousButton = slider.querySelector("[data-offers-slider-prev]");
      const nextButton = slider.querySelector("[data-offers-slider-next]");
      const currentLabel = slider.querySelector("[data-offers-slider-current]");
      const totalLabel = slider.querySelector("[data-offers-slider-total]");
      if (totalLabel) totalLabel.textContent = padNumber(slideCount);
      if (slideCount < 2) {
        controls?.classList.add("hide");
        controls?.setAttribute("aria-hidden", "true");
        return;
      }
      const updateCounter = (swiper) => {
        if (currentLabel) currentLabel.textContent = padNumber(swiper.realIndex + 1);
      };
      new Swiper(container, {
        loop: true,
        speed: 800,
        effect: "fade",
        fadeEffect: { crossFade: true },
        slidesPerView: 1,
        grabCursor: true,
        a11y: {
          prevSlideMessage: "Previous offer",
          nextSlideMessage: "Next offer"
        },
        navigation: {
          prevEl: previousButton,
          nextEl: nextButton
        },
        on: {
          init: updateCounter,
          slideChange: updateCounter
        }
      });
    });
  };

  // src/utils/roomGridHoverReveal.ts
  var CARD_SELECTOR = ".rooms-collection-room-grid_card";
  var TARGET_SELECTOR3 = ".rooms-collection-room-grid_details, footer";
  var DURATION3 = 0.45;
  var roomGridHoverReveal = () => {
    const cards = document.querySelectorAll(CARD_SELECTOR);
    if (!cards.length) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    cards.forEach((card) => {
      const targets = card.querySelectorAll(TARGET_SELECTOR3);
      if (!targets.length) return;
      gsap.set(targets, { autoAlpha: 0, yPercent: 30 });
      const reveal = () => {
        gsap.to(targets, {
          autoAlpha: 1,
          yPercent: 0,
          duration: DURATION3,
          stagger: 0.06,
          ease: "power2.out",
          overwrite: true
        });
      };
      const conceal = () => {
        gsap.to(targets, {
          autoAlpha: 0,
          yPercent: 30,
          duration: DURATION3,
          ease: "power2.inOut",
          overwrite: true
        });
      };
      card.addEventListener("mouseenter", reveal);
      card.addEventListener("mouseleave", conceal);
      card.addEventListener("focusin", reveal);
      card.addEventListener("focusout", conceal);
    });
  };

  // src/utils/roomListHoverPreview.ts
  var ACTIVE_CLASS6 = "is-active";
  var HIDDEN_CLASS2 = "hide";
  var roomListHoverPreview = () => {
    const root = document.querySelector("[data-room-preview]");
    if (!root) return;
    const triggers = Array.from(root.querySelectorAll("[data-room-preview-trigger]"));
    const panels = Array.from(root.querySelectorAll("[data-room-preview-panel]"));
    if (!triggers.length || !panels.length) return;
    const keyOf = (element, attribute) => element.getAttribute(attribute) ?? "";
    const activate = (key) => {
      triggers.forEach((trigger) => {
        trigger.classList.toggle(ACTIVE_CLASS6, keyOf(trigger, "data-room-preview-trigger") === key);
      });
      panels.forEach((panel) => {
        const isActive = keyOf(panel, "data-room-preview-panel") === key;
        panel.classList.toggle(ACTIVE_CLASS6, isActive);
        panel.setAttribute("aria-hidden", String(!isActive));
      });
    };
    const isVisible = (trigger) => !trigger.closest(`.${HIDDEN_CLASS2}`) && trigger.offsetParent !== null;
    triggers.forEach((trigger) => {
      const key = keyOf(trigger, "data-room-preview-trigger");
      trigger.addEventListener("mouseenter", () => activate(key));
      trigger.addEventListener("focus", () => activate(key));
    });
    const list = triggers[0].closest("ul, ol") ?? root;
    new MutationObserver(() => {
      const active = triggers.find((trigger) => trigger.classList.contains(ACTIVE_CLASS6));
      if (active && isVisible(active)) return;
      const firstVisible = triggers.find(isVisible);
      if (firstVisible) activate(keyOf(firstVisible, "data-room-preview-trigger"));
    }).observe(list, { subtree: true, attributes: true, attributeFilter: ["class"] });
    const initial = triggers.find((trigger) => trigger.classList.contains(ACTIVE_CLASS6)) ?? triggers[0];
    activate(keyOf(initial, "data-room-preview-trigger"));
  };

  // src/utils/roomsQuiz.ts
  var ACTIVE_CLASS7 = "is-active";
  var WIDE_CLASS = "is-wide";
  var HIDDEN_CLASS3 = "hide";
  var STEPS = 3;
  var GUEST_STEP = 1;
  var NEST_TIMEOUT_MS = 8e3;
  var SWAP_RESET_EVENT = "hover-swap:reset";
  var setHidden = (element, hidden) => {
    element?.classList.toggle(HIDDEN_CLASS3, hidden);
  };
  var waitForNest = () => new Promise((resolve) => {
    window.fsAttributes ??= [];
    window.fsAttributes.push(["cmsnest", () => resolve()]);
  });
  var roomsQuiz = () => {
    const root = document.querySelector("[data-rooms-quiz]");
    if (!root) return;
    const panels = /* @__PURE__ */ new Map();
    root.querySelectorAll("[data-rooms-quiz-step]").forEach((panel) => {
      panels.set(Number(panel.dataset.roomsQuizStep), panel);
    });
    if (panels.size !== STEPS) return;
    const resultSections = Array.from(document.querySelectorAll("[data-rooms-quiz-results]"));
    const closestLine = document.querySelector("[data-rooms-quiz-closest]");
    const emptyLine = document.querySelector("[data-rooms-quiz-empty]");
    const loadingLine = document.querySelector("[data-rooms-quiz-loading]");
    const cards = Array.from(
      document.querySelectorAll('[fs-cmsnest-element="list"] > .w-dyn-items > .w-dyn-item')
    );
    const timeout = Number(root.dataset.roomsQuizTimeout) || NEST_TIMEOUT_MS;
    let nestReady = false;
    const nestDone = waitForNest().then(() => {
      nestReady = true;
    });
    const answers = /* @__PURE__ */ new Map();
    let evaluationId = 0;
    const panelOptions = (step) => Array.from(panels.get(step)?.querySelectorAll("[data-rooms-quiz-option]") ?? []);
    panels.forEach((panel) => {
      const heading = panel.querySelector("h2, h3");
      if (heading && !heading.hasAttribute("tabindex")) heading.setAttribute("tabindex", "-1");
    });
    const showStep = (step, moveFocus) => {
      panels.forEach((panel, panelStep) => {
        const isCurrent = panelStep === step;
        if (!isCurrent && panel.classList.contains(ACTIVE_CLASS7)) {
          panel.dispatchEvent(new Event(SWAP_RESET_EVENT));
        }
        panel.classList.toggle(ACTIVE_CLASS7, isCurrent);
      });
      if (moveFocus) panels.get(step)?.querySelector("h2, h3")?.focus({ preventScroll: true });
    };
    const markSelected = (step, slug) => {
      panelOptions(step).forEach((option) => {
        const isSelected = option.dataset.roomsQuizOption === slug;
        option.classList.toggle(ACTIVE_CLASS7, isSelected);
        option.setAttribute("aria-pressed", String(isSelected));
      });
    };
    const cardTags = (card) => new Set(
      Array.from(card.querySelectorAll("[data-rooms-quiz-tag]")).map(
        (tag) => tag.dataset.roomsQuizTag ?? ""
      )
    );
    const setLines = (state) => {
      setHidden(loadingLine, state !== "loading");
      setHidden(closestLine, state !== "closest");
      setHidden(emptyLine, state !== "empty");
    };
    const showMatches = () => {
      const picks = Array.from({ length: STEPS }, (_, index) => answers.get(index + 1) ?? "");
      const guestPick = answers.get(GUEST_STEP) ?? "";
      const otherPicks = picks.filter((_, index) => index + 1 !== GUEST_STEP);
      const tagged = cards.map((card) => ({ card, tags: cardTags(card) }));
      let matches = tagged.filter(({ tags }) => picks.every((pick) => tags.has(pick)));
      let state = "exact";
      if (!matches.length) {
        matches = tagged.filter(({ tags }) => tags.has(guestPick) && otherPicks.some((pick) => tags.has(pick)));
        state = matches.length ? "closest" : "empty";
      }
      const lastOddMatch = matches.length % 2 === 1 ? matches[matches.length - 1].card : null;
      tagged.forEach(({ card }) => {
        setHidden(card, !matches.some((match) => match.card === card));
        card.classList.toggle(WIDE_CLASS, card === lastOddMatch);
      });
      setLines(state);
      ScrollTrigger.refresh(true);
    };
    const revealResults = () => {
      const runId = ++evaluationId;
      resultSections.forEach((section) => setHidden(section, false));
      if (nestReady) {
        showMatches();
      } else {
        cards.forEach((card) => setHidden(card, true));
        setLines("loading");
        const timedOut = new Promise((resolve) => window.setTimeout(resolve, timeout));
        Promise.race([nestDone, timedOut]).then(() => {
          if (runId === evaluationId) showMatches();
        });
      }
      if (resultSections[0]) lenisEngine.scrollTo(resultSections[0]);
    };
    const hideResults = () => {
      evaluationId++;
      resultSections.forEach((section) => setHidden(section, true));
      setLines("exact");
      ScrollTrigger.refresh(true);
    };
    const choose = (option) => {
      const step = Number(option.closest("[data-rooms-quiz-step]")?.dataset.roomsQuizStep);
      const slug = option.dataset.roomsQuizOption;
      if (!step || !slug) return;
      answers.set(step, slug);
      markSelected(step, slug);
      if (step < STEPS) showStep(step + 1, true);
      else revealResults();
    };
    root.addEventListener("click", (event) => {
      const target = event.target;
      const option = target.closest("[data-rooms-quiz-option]");
      if (option) {
        event.preventDefault();
        choose(option);
        return;
      }
      const back = target.closest("[data-rooms-quiz-back]");
      if (back) {
        event.preventDefault();
        const step = Number(back.closest("[data-rooms-quiz-step]")?.dataset.roomsQuizStep);
        if (step > 1) showStep(step - 1, true);
      }
    });
    root.addEventListener("keydown", (event) => {
      if (event.key !== " ") return;
      const option = event.target.closest("[data-rooms-quiz-option]");
      if (!option) return;
      event.preventDefault();
      choose(option);
    });
    document.querySelectorAll("[data-rooms-quiz-restart]").forEach((restart) => {
      restart.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        answers.clear();
        panels.forEach((_, step) => markSelected(step, void 0));
        hideResults();
        showStep(1, false);
        lenisEngine.scrollTo(root);
        panels.get(1)?.querySelector("h2, h3")?.focus({ preventScroll: true });
      });
    });
  };

  // src/utils/scrollEnlargeSnap.ts
  var ROOT_SELECTOR3 = "[data-scroll-enlarge-snap]";
  var ACTIVE_CLASS8 = "is-active";
  var DEFAULT_STEP_PERCENT = 100;
  var WIPE_DURATION = 0.5;
  var DWELL = 0.7;
  var PITCH = WIPE_DURATION + DWELL;
  var REVEAL_LEAD = 0.1;
  var SETTLE = 0.1;
  var END_HOLD = 0.5;
  var scrollEnlargeSnap = () => {
    const roots = document.querySelectorAll(ROOT_SELECTOR3);
    if (!roots.length) return;
    roots.forEach((root) => {
      const parts = readParts(root);
      if (!parts) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          animate: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          mobile: "(max-width: 767px)"
        },
        (context) => context.conditions.reduce ? initReduced(parts) : initAnimated(parts, Boolean(context.conditions.mobile))
      );
    });
  };
  var readParts = (root) => {
    const media = root.querySelector("[data-scroll-enlarge-snap-media]");
    const items = Array.from(
      root.querySelectorAll("[data-scroll-enlarge-snap-item]")
    );
    if (!media || !items.length) {
      console.warn("[scrollEnlargeSnap] needs a -media element and at least one -item", root);
      return null;
    }
    const stepAttribute = Number(root.getAttribute("data-scroll-enlarge-snap-step"));
    return {
      root,
      stage: root.querySelector("[data-scroll-enlarge-snap-stage]") ?? root,
      media,
      items,
      tabs: Array.from(root.querySelectorAll("[data-scroll-enlarge-snap-tab]")),
      stepPercent: stepAttribute > 0 ? stepAttribute : DEFAULT_STEP_PERCENT
    };
  };
  var initAnimated = (parts, closeCorners) => {
    const { stage, media, items, stepPercent } = parts;
    const shownAt = items.map((_, index) => 1 + index * PITCH);
    const wipeAt = (index) => shownAt[index] - WIPE_DURATION;
    const totalSteps = shownAt[shownAt.length - 1] + END_HOLD;
    const snapPoints = shownAt.map((time) => time / totalSteps);
    stackItems(items, 0);
    const reveals = items.map((item) => {
      const content = item.querySelector("[data-scroll-enlarge-snap-content]");
      return content ? createLineMaskTimeline(content) : null;
    });
    const mask = createChamferMask(stage, media, closeCorners);
    const contentIndexAt = (time) => {
      for (let index = items.length - 1; index >= 0; index--) {
        const leaveAt = index === items.length - 1 ? Infinity : wipeAt(index + 1);
        if (time >= shownAt[index] - REVEAL_LEAD && time < leaveAt) return index;
      }
      return -1;
    };
    let shownIndex = -1;
    let targetIndex2 = -1;
    let pending = null;
    const syncContent = (time, immediate = false) => {
      const next = contentIndexAt(time);
      if (next === targetIndex2) return;
      targetIndex2 = next;
      pending?.kill();
      pending = null;
      reveals.forEach((reveal, index) => {
        if (index !== next && reveal?.isRevealed()) reveal.reverse();
      });
      if (shownIndex !== next) shownIndex = -1;
      if (next === -1) return;
      const start = () => {
        reveals[next]?.play();
        shownIndex = next;
      };
      if (immediate) start();
      else pending = gsap.delayedCall(SETTLE, start);
    };
    let activeIndex = -1;
    const nearestIndex = (time) => shownAt.reduce(
      (best, at, index) => Math.abs(at - time) < Math.abs(shownAt[best] - time) ? index : best,
      0
    );
    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;
      markActive(parts, index);
    };
    setActive(0);
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      // Content follows the scrubbed timeline, which lags scroll position.
      onUpdate: () => syncContent(timeline.time()),
      scrollTrigger: {
        trigger: stage,
        start: "top top",
        end: () => `+=${window.innerHeight * stepPercent * totalSteps / 100}`,
        pin: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) => snapToPanel(value, snapPoints),
          duration: { min: 0.2, max: 0.6 },
          delay: 0.1,
          ease: "power1.inOut",
          // Without this a tab jump reads as a fling and overshoots to the end.
          inertia: false
        },
        onRefresh: (self) => {
          mask.measure();
          syncContent(self.progress * totalSteps, true);
        },
        onUpdate: (self) => {
          setActive(nearestIndex(self.progress * totalSteps));
        }
      }
    });
    timeline.to(mask.state, {
      progress: 1,
      duration: 1,
      ease: "power1.inOut",
      onUpdate: mask.apply
    });
    items.slice(1).forEach((item, offset) => {
      const previous = items[offset];
      const at = wipeAt(offset + 1);
      const image = itemImage(item);
      timeline.set(item, { autoAlpha: 1 }, at);
      timeline.fromTo(
        item,
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: WIPE_DURATION, ease: "power2.inOut" },
        at
      );
      if (image) {
        timeline.fromTo(image, { scale: 1.2 }, { scale: 1, duration: WIPE_DURATION, ease: "power2.out" }, at);
      }
      timeline.set(previous, { autoAlpha: 0 }, at + WIPE_DURATION);
    });
    timeline.to({}, { duration: END_HOLD }, shownAt[shownAt.length - 1]);
    syncContent((timeline.scrollTrigger?.progress ?? 0) * totalSteps, true);
    const unbindTabs = bindTabs(parts, timeline.scrollTrigger, snapPoints);
    return () => {
      pending?.kill();
      unbindTabs?.();
    };
  };
  var initReduced = (parts) => {
    const { stage, media, items, stepPercent } = parts;
    gsap.set(media, { width: "100%", height: "100%" });
    stackItems(items, 0);
    markActive(parts, 0);
    if (items.length < 2) return;
    const changeCount = items.length - 1;
    const snapPoints = items.map((_, index) => index / changeCount);
    let activeIndex = 0;
    const trigger = ScrollTrigger.create({
      trigger: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * stepPercent * changeCount / 100}`,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = clampIndex(Math.round(self.progress * changeCount), items.length);
        if (index === activeIndex) return;
        gsap.set(items[activeIndex], { autoAlpha: 0 });
        gsap.set(items[index], { autoAlpha: 1 });
        activeIndex = index;
        markActive(parts, index);
      }
    });
    return bindTabs(parts, trigger, snapPoints);
  };
  var stackItems = (items, visibleIndex) => {
    items.forEach((item, index) => {
      gsap.set(item, { zIndex: index + 1, autoAlpha: index === visibleIndex ? 1 : 0 });
    });
  };
  var markActive = (parts, index) => {
    parts.items.forEach(
      (item, itemIndex) => item.classList.toggle(ACTIVE_CLASS8, itemIndex === index)
    );
    parts.tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      tab.classList.toggle(ACTIVE_CLASS8, isActive);
      if (isActive) tab.setAttribute("aria-current", "true");
      else tab.removeAttribute("aria-current");
    });
  };
  var bindTabs = (parts, trigger, snapPoints) => {
    if (!trigger || !parts.tabs.length) return;
    const handlers = parts.tabs.map((tab, index) => {
      const handler = (event) => {
        const point = snapPoints[index];
        if (point === void 0) return;
        event.preventDefault();
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * point });
      };
      tab.addEventListener("click", handler);
      return handler;
    });
    return () => parts.tabs.forEach((tab, index) => tab.removeEventListener("click", handlers[index]));
  };
  var snapToPanel = (value, snapPoints) => {
    if (value < snapPoints[0] / 2) return value;
    if (value > snapPoints[snapPoints.length - 1]) return value;
    return snapPoints.reduce(
      (nearest, point) => Math.abs(point - value) < Math.abs(nearest - value) ? point : nearest
    );
  };
  var clampIndex = (index, length) => Math.min(Math.max(index, 0), length - 1);
  var itemImage = (item) => item.querySelector("[data-scroll-enlarge-snap-image]") ?? item.querySelector("img");
  var createChamferMask = (stage, media, closeCorners) => {
    const state = { progress: 0 };
    let start = { top: 0, right: 0, bottom: 0, left: 0 };
    let chamfer = { x: 0, y: 0 };
    const apply = () => {
      const remaining = 1 - state.progress;
      const top = start.top * remaining;
      const right = start.right * remaining;
      const bottom = start.bottom * remaining;
      const left = start.left * remaining;
      const corner = closeCorners ? remaining : 1;
      const x = chamfer.x * corner;
      const y = chamfer.y * corner;
      media.style.clipPath = `polygon(${[
        `${left + x}px ${top}px`,
        `calc(100% - ${right + x}px) ${top}px`,
        `calc(100% - ${right}px) ${top + y}px`,
        `calc(100% - ${right}px) calc(100% - ${bottom + y}px)`,
        `calc(100% - ${right + x}px) calc(100% - ${bottom}px)`,
        `${left + x}px calc(100% - ${bottom}px)`,
        `${left}px calc(100% - ${bottom + y}px)`,
        `${left}px ${top + y}px`
      ].join(", ")})`;
    };
    const measure = () => {
      gsap.set(media, { clearProps: "width,height,clipPath" });
      chamfer = readChamfer(media);
      const natural = media.getBoundingClientRect();
      const full = contentBox(stage);
      gsap.set(media, { width: full.width, height: full.height });
      const sized = media.getBoundingClientRect();
      start = {
        top: Math.max(0, natural.top - sized.top),
        left: Math.max(0, natural.left - sized.left),
        bottom: Math.max(0, sized.bottom - natural.bottom),
        right: Math.max(0, sized.right - natural.right)
      };
      apply();
    };
    measure();
    return { state, apply, measure };
  };
  var readChamfer = (element) => {
    const clipPath = getComputedStyle(element).clipPath;
    const inner = clipPath.match(/^polygon\((.*)\)$/)?.[1];
    if (!inner) return { x: 0, y: 0 };
    const points = inner.split(",").map((point) => point.trim().split(/\s+(?![^(]*\))/));
    const pixels = (value) => parseFloat(value ?? "") || 0;
    return { x: pixels(points[0]?.[0]), y: pixels(points[2]?.[1]) };
  };
  var contentBox = (element) => {
    const style = getComputedStyle(element);
    return {
      width: element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      height: element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
    };
  };

  // src/utils/staggerCards.ts
  var CARD = ".article-card-staggered_component.is-cms-item";
  var GROUP_HEADER = ".article-card-staggered_header.is-group";
  var staggerCards = () => {
    const cards = [...document.querySelectorAll(CARD)].filter(
      (card) => getComputedStyle(card).display !== "none"
    );
    if (!cards.length) return;
    cards.forEach((card, index) => card.classList.toggle("is-right", index % 2 === 1));
    document.querySelectorAll(GROUP_HEADER).forEach((header) => {
      const section = header.closest("section");
      const firstCard = section ? cards.find((card) => section.contains(card)) : void 0;
      let isRight;
      if (firstCard) {
        isRight = firstCard.classList.contains("is-right");
      } else {
        const precedingCards = cards.filter(
          (card) => header.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_PRECEDING
        ).length;
        isRight = precedingCards % 2 === 1;
      }
      header.classList.toggle("is-right", isRight);
    });
  };

  // src/utils/stickyCta.ts
  var DEFAULT_SELECTOR = "[data-sticky-cta]";
  var STUCK_CLASS = "is-stuck";
  var DOCK_GAP = 24;
  var END_SELECTOR = ".section_cta-booking-newsletter, .section_footer-links";
  var stickyCta = (selector = DEFAULT_SELECTOR) => {
    const button = document.querySelector(selector);
    if (!button) return;
    const holder = button.parentElement;
    if (!holder) return;
    const endSection = document.querySelector(END_SELECTOR);
    let isStuck = false;
    let dockGap = DOCK_GAP;
    const measureDock = () => {
      const naturalBottom = holder.getBoundingClientRect().bottom + window.scrollY;
      const gapAtTop = window.innerHeight - naturalBottom;
      dockGap = gapAtTop > 0 ? gapAtTop : DOCK_GAP;
    };
    const holdSpace = () => {
      holder.style.minHeight = "";
      holder.style.minHeight = `${button.offsetHeight}px`;
    };
    holdSpace();
    const setStuck = (stuck) => {
      if (stuck === isStuck) return;
      isStuck = stuck;
      button.classList.toggle(STUCK_CLASS, stuck);
      if (stuck) {
        gsap.set(button, {
          position: "fixed",
          left: "50%",
          bottom: dockGap,
          xPercent: -50,
          zIndex: 90
        });
      } else {
        gsap.set(button, { clearProps: "position,left,bottom,zIndex,transform" });
      }
    };
    ScrollTrigger.create({
      trigger: holder,
      start: () => {
        measureDock();
        return `bottom bottom-=${dockGap}`;
      },
      end: "max",
      onRefreshInit: () => setStuck(false),
      // onToggle does not fire again when the trigger stays active through a
      // refresh, so re-apply the docked state here.
      onRefresh: (self) => {
        holdSpace();
        setStuck(self.isActive);
      },
      onToggle: (self) => setStuck(self.isActive)
    });
    if (!endSection) return;
    ScrollTrigger.create({
      trigger: endSection,
      start: "top bottom",
      end: "max",
      onToggle: (self) => gsap.to(button, { autoAlpha: self.isActive ? 0 : 1, duration: 0.3, overwrite: "auto" })
    });
  };

  // src/utils/stickyTabs.ts
  var navBottom = () => {
    const header = document.querySelector('[data-nav="header"]');
    const bar = header?.querySelector(".site-nav_bar") ?? header;
    return Math.max(0, bar?.getBoundingClientRect().bottom ?? 0);
  };
  var BOTTOM_GAP_REM = 2;
  var FADE_DISTANCE_VH = 0.25;
  var bottomGap = () => BOTTOM_GAP_REM * parseFloat(getComputedStyle(document.documentElement).fontSize);
  var MOBILE_BARS = '.tab-pills-intro_tabs:not(.is-media):not([data-sticky-tabs="true"])';
  var stickyTabs = () => {
    document.querySelectorAll('[data-sticky-tabs="true"]').forEach((tabs) => pinTabs(tabs, true));
    const mobileBars = [...document.querySelectorAll(MOBILE_BARS)];
    if (!mobileBars.length) return;
    gsap.matchMedia().add({ mobile: "(max-width: 767px)" }, () => {
      const cleanups = mobileBars.map((tabs) => pinTabs(tabs, false));
      return () => cleanups.forEach((cleanup) => cleanup?.());
    });
  };
  var pinTabs = (tabs, warn) => {
    const links = [...tabs.querySelectorAll('a[href^="#"]')];
    const entries = links.map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) })).filter((entry) => entry.target !== null);
    if (!entries.length) {
      if (warn) console.warn("[stickyTabs] no tab target resolves", tabs);
      return;
    }
    const sections = [...document.querySelectorAll(".section_article-card-staggered")].filter(
      (section) => tabs.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING
    );
    const isRendered = (section) => section.offsetParent !== null && section.offsetHeight > 0;
    const fallbackSection = entries[entries.length - 1].target;
    const lastSection = () => [...sections].reverse().find(isRendered) ?? [...entries].reverse().find((e) => isRendered(e.target))?.target ?? fallbackSection;
    const clearance = () => navBottom();
    const pinEnd = () => lastSection().getBoundingClientRect().bottom + window.scrollY - (window.innerHeight - bottomGap());
    ScrollTrigger.create({
      trigger: tabs,
      start: () => `bottom bottom-=${bottomGap()}`,
      // Absolute scroll position (not endTrigger) so the rendered last
      // section is re-resolved on every refresh. The pin releases when the
      // last section's bottom reaches the bar's bottom, so the bar rests
      // flush at the section end like the sticky gallery bars.
      end: pinEnd,
      pin: tabs,
      pinSpacing: false,
      invalidateOnRefresh: true
    });
    gsap.fromTo(
      tabs,
      { autoAlpha: 1 },
      {
        autoAlpha: 0,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          start: () => pinEnd() - FADE_DISTANCE_VH * window.innerHeight,
          end: pinEnd,
          scrub: true,
          invalidateOnRefresh: true
        }
      }
    );
    const setActive = (active) => {
      links.forEach((link) => {
        const on = link === active;
        link.classList.toggle("is-active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
    };
    entries.forEach(({ link, target }) => {
      ScrollTrigger.create({
        trigger: target,
        start: () => `top top+=${clearance() + 1}`,
        end: () => `bottom top+=${clearance() + 1}`,
        onToggle: (self) => {
          if (self.isActive) setActive(link);
        }
      });
    });
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      const entry = entries.find((item) => item.link === link);
      if (!link || !entry) return;
      event.preventDefault();
      event.stopPropagation();
      const offset = -clearance();
      const immediate = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (lenis.raw) lenis.raw.scrollTo(entry.target, { offset, immediate });
      else {
        window.scrollTo({
          top: entry.target.getBoundingClientRect().top + window.scrollY + offset,
          behavior: immediate ? "auto" : "smooth"
        });
      }
      history.replaceState(null, "", link.hash);
      setActive(link);
    };
    tabs.addEventListener("click", onClick, true);
    return () => tabs.removeEventListener("click", onClick, true);
  };

  // src/utils/swiperSliders.ts
  var swiperSliders = () => {
    const sliderWrappers = document.querySelectorAll(".swiper_slider");
    if (!sliderWrappers.length) return;
    const heroSplits = /* @__PURE__ */ new Map();
    const getHeroTitles = (slide) => slide.querySelectorAll(".heading-style-h1.hero_title.is-slider");
    const splitHeroTitles = (slide) => {
      const instances = [];
      getHeroTitles(slide).forEach((title) => {
        const split = new SplitText(title, { types: "words, lines" });
        gsap.set(split.lines, { overflow: "hidden" });
        gsap.set(split.words, { y: "110%" });
        instances.push(split);
      });
      if (instances.length) heroSplits.set(slide, instances);
    };
    const hideHeroTitles = (slide) => {
      const instances = heroSplits.get(slide);
      if (!instances) return;
      instances.forEach((split) => {
        gsap.set(split.words, { y: "110%" });
      });
    };
    const revealHeroTitles = (slide) => {
      const instances = heroSplits.get(slide);
      if (!instances) return;
      instances.forEach((split) => {
        gsap.to(split.words, {
          y: "0%",
          duration: 1,
          ease: "power4.out",
          stagger: 0.05
        });
      });
    };
    sliderWrappers.forEach((slider) => {
      const textAnimationSlider = slider.querySelector(".swiper.text-animation");
      const defaultSlider = slider.querySelector(".swiper.default");
      const nextButton = slider.querySelector(".slide-button.swiper-button-next");
      const prevButton = slider.querySelector(".slide-button.swiper-button-prev");
      const splitSlider = slider.querySelector(".swiper.split");
      const children = slider.querySelectorAll(".image-slider_item");
      const pagination = slider.querySelector(".swiper-pagination");
      if (textAnimationSlider) {
        if (children.length === 1) {
          nextButton?.classList.add("hide");
          nextButton?.setAttribute("aria-hidden", "true");
          prevButton?.classList.add("hide");
          prevButton?.setAttribute("aria-hidden", "true");
        }
        new Swiper(textAnimationSlider, {
          loop: true,
          speed: 1e3,
          slidesPerView: 1,
          centeredSlides: true,
          grabCursor: true,
          autoplay: {
            delay: 5e3,
            disableOnInteraction: false
          },
          navigation: {
            nextEl: nextButton,
            prevEl: prevButton
          },
          pagination: {
            el: pagination,
            clickable: true
          },
          on: {
            init: function(swiper) {
              swiper.slides.forEach((slide) => {
                splitHeroTitles(slide);
              });
              const activeSlide = swiper.slides.find(
                (slide) => slide.classList.contains("swiper-slide-active")
              );
              if (activeSlide) revealHeroTitles(activeSlide);
            },
            slideChangeTransitionStart: function(swiper) {
              const previousSlide = swiper.slides[swiper.previousIndex];
              if (previousSlide) hideHeroTitles(previousSlide);
              const activeSlide = swiper.slides[swiper.activeIndex];
              if (activeSlide) revealHeroTitles(activeSlide);
            }
          }
        });
      }
      if (defaultSlider) {
        new Swiper(defaultSlider, {
          loop: true,
          speed: 1e3,
          slidesPerView: 1,
          grabCursor: true,
          autoplay: {
            delay: 3e3,
            disableOnInteraction: false
          },
          pagination: {
            el: pagination,
            clickable: true
          }
        });
      }
      if (splitSlider) {
        new Swiper(splitSlider, {
          loop: false,
          speed: 1e3,
          freeMode: true,
          grabCursor: true,
          mousewheel: {
            forceToAxis: true
          },
          navigation: {
            nextEl: nextButton
          },
          breakpoints: {
            0: { slidesPerView: 1.05 },
            767: { slidesPerView: 1.25 },
            992: { slidesPerView: 1.25 }
          }
        });
      }
    });
  };

  // src/utils/tabDropdown.ts
  var BARS = ".tab-pills-intro_tabs, .venue-card-fullbleed_tabs";
  var OPEN_CLASS3 = "is-open";
  var MENU_ICON = '<svg data-tab-dropdown-menu width="16" height="8" viewBox="0 0 16 8" fill="none" aria-hidden="true"><path d="M0 .4h16M0 4h16M0 7.6h16" stroke="currentColor" stroke-width=".8"/></svg>';
  var CLOSE_ICON = '<svg data-tab-dropdown-close width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M0 0l10 10M10 0L0 10" stroke="currentColor" stroke-width=".8"/></svg>';
  var STYLES = `
[data-tab-dropdown-panel]{display:contents}
[data-tab-dropdown-toggle]{display:none}
@media (max-width:767px){
 :is(.tab-pills-intro_tabs,.venue-card-fullbleed_tabs)[data-tab-dropdown]{display:block;width:13.75rem;max-width:none;height:2.5rem;padding:0;overflow:visible;background:none;clip-path:none}
 :is(.venue-card-fullbleed_tabs,.tab-pills-intro_tabs.is-media)[data-tab-dropdown]{left:50%;right:auto;bottom:1.25rem;transform:translateX(-50%)}
 [data-tab-dropdown-panel]{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:max-content;min-width:100%;display:flex;flex-direction:column;padding:0 1.5rem;background-color:var(--_primitives---colors--burgundy);color:var(--_primitives---colors--neutral-lightest);clip-path:polygon(.75rem 0,calc(100% - .75rem) 0,100% .75rem,100% calc(100% - .75rem),calc(100% - .75rem) 100%,.75rem 100%,0 calc(100% - .75rem),0 .75rem)}
 [data-tab-dropdown-panel]>*{font-size:.875rem;line-height:1.125rem;letter-spacing:-.05em}
 [data-tab-dropdown-panel]>a{display:none;padding:.8125rem 0 1rem;border:0;opacity:.62;text-box:trim-both cap alphabetic}
 [data-tab-dropdown-panel]>a.is-active{opacity:1}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]{padding-top:.625rem}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]>a{display:block}
 [data-tab-dropdown].is-open [data-tab-dropdown-panel]>a:nth-last-child(2){margin-bottom:.625rem}
 [data-tab-dropdown-toggle]{display:flex;align-items:center;justify-content:space-between;gap:2.5rem;height:2.5rem;margin:0;padding:0;border:0;background:none;color:inherit;text-align:left;cursor:pointer}
 [data-tab-dropdown-label]{white-space:nowrap;margin-top:-.1875rem;padding-bottom:.25rem;border-bottom:1px solid currentColor;text-box:trim-both cap alphabetic}
 [data-tab-dropdown-close],[data-tab-dropdown].is-open [data-tab-dropdown-menu]{display:none}
 [data-tab-dropdown].is-open [data-tab-dropdown-close]{display:block}
}`;
  var tabDropdown = () => {
    const bars = document.querySelectorAll(BARS);
    if (!bars.length) return;
    const style = document.createElement("style");
    style.setAttribute("data-tab-dropdown-style", "");
    style.textContent = STYLES;
    document.head.append(style);
    bars.forEach((bar, barIndex) => {
      const tabs = [...bar.querySelectorAll(":scope > a")];
      if (!tabs.length) return;
      const panel = document.createElement("div");
      panel.setAttribute("data-tab-dropdown-panel", "");
      panel.id = `tab-dropdown-${barIndex}`;
      panel.append(...tabs);
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.setAttribute("data-tab-dropdown-toggle", "");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", panel.id);
      toggle.className = tabs[0].className.replace(/\S+_tab\b|\bis-active\b/g, "").trim();
      toggle.innerHTML = `<span data-tab-dropdown-label></span>${MENU_ICON}${CLOSE_ICON}`;
      const label = toggle.querySelector("[data-tab-dropdown-label]");
      panel.append(toggle);
      bar.append(panel);
      bar.setAttribute("data-tab-dropdown", "");
      const syncLabel = () => {
        const active = tabs.find((tab) => tab.classList.contains("is-active")) ?? tabs[0];
        label.textContent = active.textContent;
      };
      syncLabel();
      new MutationObserver(syncLabel).observe(panel, { subtree: true, attributeFilter: ["class"] });
      const setOpen = (open) => {
        bar.classList.toggle(OPEN_CLASS3, open);
        toggle.setAttribute("aria-expanded", String(open));
      };
      toggle.addEventListener("click", () => setOpen(!bar.classList.contains(OPEN_CLASS3)));
      bar.addEventListener(
        "click",
        (event) => {
          if (event.target.closest("a")) setOpen(false);
        },
        true
      );
      document.addEventListener("click", (event) => {
        if (!bar.contains(event.target)) setOpen(false);
      });
      bar.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || !bar.classList.contains(OPEN_CLASS3)) return;
        setOpen(false);
        toggle.focus();
      });
    });
  };

  // src/index.ts
  var DININGS_TEMPLATE_PAGE_ID = "6ad67d7416e13e66c2b76107";
  window.Webflow ||= [];
  window.Webflow.push(() => {
    eagerImages();
    formPlaceholders();
    buttonHover();
    tabDropdown();
    lenisEngine.init();
    scrollEnlargeSnap();
    swiperSliders();
    offersSliderSplit();
    cardCarouselHeaderLeft();
    navToggle();
    navTheme();
    imageHoverScale();
    roomGridHoverReveal();
    imageTrailHover();
    hoverFollowImage();
    accordion();
    modals();
    roomListHoverPreview();
    hoverImageSwap();
    roomsQuiz();
    mediaTabs();
    map();
    currentYear();
    cmsItemLinks();
    staggerCards();
    galleryFilter();
    gsapBasicAnimations();
    historyStickyYear();
    imageStackCollapse();
    stickyTabs();
    stickyCta(`html[data-wf-page="${DININGS_TEMPLATE_PAGE_ID}"] .section_hero-fullbleed-centered .button`);
  });
})();
//# sourceMappingURL=index.js.map
