# Webflow MCP Factory — CLAUDE Conventions

Granite Marketing's private Webflow factory. This file documents the native runtime conventions retained by the factory and the routing boundary for generated React code-component projects.

## Choose the delivery lane first

Read `docs/reference/hybrid-lane-routing.md` before building.

- Use `webflow-code-components` for locally reviewed React sections imported through DevLink. Generated client repositories own all project React source and client-safe release tooling.
- Use `build-component` only for intentionally native Webflow DOM and classes.
- Never allow a failed React placement to fall through to native `element_builder` output.
- Never copy factory skills, prompts, orchestration, or cross-client methods into a generated repository.

Create clients through `pnpm create:client`; never fork this private factory as the client project.

## Working rules

- **CLAUDE.md is a router.** Keep this file to rules and pointers; detailed setup, DOM contracts and gotchas live in `docs/reference/` and `docs/solutions/`, linked from here.
- **One class family per component (hard rule).** Similar blocks share one `section_<component>` family; differences are `is-` modifiers or utility classes. Check `docs/figma/components.md` and the live styles before creating a family; see `build-component` Step 0.25. Five similar blocks with five unique class families is a failed build.
- **Reuse styles before creating them.** Before building, read the site's existing styles (`get_styles` with all styles) and reuse generic classes for shared patterns (dividers, page heroes, section headers). Name new shared classes generically, not after the page they first appear on.
- **Record learnings.** When a project hits a reusable gotcha, write it to that project's `docs/solutions/` with frontmatter, then back-port it here once a second project would benefit.

---

## Native pipeline overview

This section describes the retained native Figma-to-Webflow lane. The React lane is defined by `.claude/skills/webflow-code-components/SKILL.md` and the generated client repository.

## Prerequisites

**Style Guide page required.** Every Webflow project must have a `/style-guide` page with foundational styles before any component building begins. This page is cloned from the Relume starter template (or a minimal derivative) and then customised with project-specific tokens. The automation **verifies** the style guide exists and **updates variables/styles** to match the Figma design — it does NOT create the page from scratch.

See `docs/reference/style-guide.md` for what the style guide must contain.

## Pipeline Loop

1. **Export Assets** — `/export-assets` extracts images, icons, logos from Figma via REST API
2. **Verify** — Confirm `/style-guide` page exists with foundational styles, variables, and classes
3. **Sync Tokens** — Extract Figma tokens and update Webflow variables + styles to match
4. **Upload Assets** — Upload exported assets to Webflow asset library via Data API
5. **Read** — Figma MCP extracts component design specs
6. **Build** — Webflow MCP creates elements with correct structure and classes (using asset URLs from manifest)
7. **Capture** — Playwright screenshots the live Webflow page
8. **Compare** — Claude vision compares Figma reference vs Webflow screenshot
9. **Iterate** — Fix issues via Webflow MCP, re-capture, re-compare (max 5x)
10. **Post-build** — `/asset-metadata` for alt text, `/update-seo` for page SEO

## Class Naming Conventions (Client-First adapted)

### Structure
- **Section wrapper:** `section_component-name`
- **Component elements:** `component-name_element` with underscore separator
- **Modifiers:** `is-` prefix (e.g., `is-active`, `is-animated`, `is-link`)

### Utility Classes
- **Layout containers:** `container-large` (80rem), `container-medium` (64rem), `container-small` (48rem), `container-xl` (alias for container-large)
- **Horizontal padding:** `padding-global` — fixed **2rem** left/right (NOT 5%). Applied to the wrapper div inside sections.
- **Vertical padding:** `padding-section-large` (7rem), `padding-section-medium` (5rem), `padding-section-small` (3rem) — responsive, see `breakpoints.md`. Applied as combo class on same element as padding-global.
- **Typography:** `heading-style-h1` through `heading-style-h6`, `text-size-large`, `text-size-medium`, `text-size-regular`, `text-size-small`, `text-rich-text`
- **Text weight:** `text-weight-xbold`, `text-weight-bold`, `text-weight-semibold`, `text-weight-medium`, `text-weight-normal`, `text-weight-light`
- **Text alignment:** `text-align-left`, `text-align-center`, `text-align-right`
- **Buttons:** `button` (base) + `is-secondary`, `is-ghost`, `is-outline`, `is-link`, `is-text`, `is-small`, `is-icon`, `is-alternate` (combo modifiers)
- **Images:** `u-image`
- **Responsive visibility:** `hide`, `hide-tablet`, `hide-mobile-landscape`, `hide-mobile-portrait`

### Design Variables

Managed via Webflow's `variable_tool`. The Relume starter template ships with its own variable collections — the automation **updates existing variables** to match Figma tokens rather than creating from scratch.

- **Colors collection:** `color-primary`, `color-secondary`, `color-accent`, `color-neutral-{900,700,500,300,100,0}`, `color-success`, `color-error`, `color-warning`, `color-info`
- **Spacing collection:** `spacing-{xxl,xl,lg,md,sm,xs,xxs}`
- See `docs/reference/style-guide.md` for default values and responsive scales

**Important:** Always query existing variable collections first (`variable_tool → get_variable_collections`). Map Relume's existing variable names to the project conventions before creating new ones — prefer updating over creating duplicates.

### Semantic HTML (mandatory)
- `<section>` for page sections
- `<article>` for component wrappers (NOT divs)
- `<figure>` for images — **every image MUST be inside a figure/wrapper div**
- `<header>` for heading areas — **every heading MUST be inside a header wrapper div**
- `<footer>` for CTA areas — **every CTA button MUST be inside a footer wrapper div**
- Proper heading hierarchy (`<h1>`, `<h2>`, etc.)

**CRITICAL: See `docs/reference/component-patterns.md` for mandatory wrapper rules.** Never place naked headings, images, or buttons as direct children of layout containers. Every element needs its semantic wrapper for spacing, sizing, and responsive control.

### Accessibility
- `aria-label` on headings and text elements with full readable text
- GSAP SplitText handles word-by-word animation at runtime — the automation does NOT create split divs

### Custom Attributes
- `data-animation-general` — section animation trigger
- `data-animation-order` — animation sequencing (0, 1, 2, 3...)
- `mq="mob"` / `mq="desk"` — responsive visibility
- `button-function` / `button-function-arg1` / `button-function-arg2` — button behavior
- `data-eapps-font-size` / `data-eapps-line-height` — responsive font scaling

### Finsweet CMS Filter (v1)
Used for CMS collection filtering on listing pages (e.g., projects, news). Single-select categories use radio groups; Webflow publishes the radio group name as `data-name`, so filters must restore it (see the doc). See `docs/reference/finsweet-cms-filter.md` for full attribute reference, CDN URLs, and setup patterns.

### Swiper Sliders
Swiper.js is loaded via CDN in Webflow Site Settings footer (before the bundle), so `Swiper` is an ambient global when `swiperSliders()` runs. Each slider section is wrapped with `swiper_slider`, then the `.swiper` element gets a type combo class (`text-animation`, `default`, `split`) that determines its TS config. CMS Collection Lists map directly to Swiper structure (DynamoWrapper → `.swiper`, DynamoList → `.swiper-wrapper`, DynamoItem → `.swiper-slide`). See `docs/reference/swiper-slider-setup.md` for full class structure, pagination CSS, how to add new slider types, and the **Animating Slides with SplitText** section (mandatory reading before touching any slider text/image animation — covers the GSAP SplitText vs SplitType gotcha, the mask reveal pattern, and the correct Swiper callback pattern for animating the first slide on load).

### Modals
Accessible dialog modals are driven by the global `modals.ts` script and a tiny DOM contract — no new JS per instance. Discovery is via `[role="dialog"]` + native `id` (bound to CMS slug for CMS dialogs); triggers use `data-modal-open="{id}"`; close controls use `data-modal-close`; the optional global overlay uses `[data-modal-overlay]`. The script handles `is-open` class toggling, aria-hidden/aria-expanded sync, runtime aria-labelledby/describedby wiring, ESC + click-outside + close-button dismissal, focus trap, return-focus, and body scroll lock. Per-dialog overlay opt-out via `data-modal-no-overlay`. **See `docs/reference/modal-setup.md` for the complete attribute table, three reusable patterns (static, CMS-list, multi-static), sanity-check snippet, and common mistakes. Mandatory reading before building any new modal.**

## Asset Pipeline

Images, icons, and logos are exported from Figma and uploaded to Webflow via REST API scripts in `scripts/api/`. The pipeline is tracked by `assets/asset-manifest.json`.

### Workflow
1. `pnpm run export-assets <fileKey> <nodeId>` — exports from Figma to `assets/`
2. `pnpm run upload-assets` — uploads to Webflow asset library (dedup by MD5 hash)
3. `pnpm run update-metadata --dry-run` — audit assets missing alt text
4. Build-component reads `webflowUrl` from manifest when setting image sources

### Skills
- `/export-assets` — full Figma export + Webflow upload combo
- `/asset-metadata` — generate alt text via Claude vision
- `/update-seo` — generate page titles, descriptions, Open Graph tags

### Alt text and CMS images
- `/asset-metadata` runs the context-aware alt-text pipeline: inventory, cost estimate, batch generation, then apply. See `docs/reference/alt-text-pipeline.md`.
- Alt text is under 200 characters, functional rather than decorative.
- **Library alt (`PATCH /assets`) is safe. Any write to a CMS image field re-imports the file:** new fileId, and responsive srcset is lost for good. There is no alt-only CMS image update. Probe one item and check the live HTML before any bulk CMS image write. See `docs/solutions/conventions/webflow-cms-image-emission.md`.
- Webflow's upload cap is 4MB. Resize the long edge only (preserve aspect ratio) and let Webflow's automatic AVIF handle compression. Use gifski for animated GIFs.

### API Tokens
- `FIGMA_API_TOKEN` — Personal access token, expires every 90 days. Scope: `file_content:read`
- `WEBFLOW_API_TOKEN` — Site or workspace API token
- `WEBFLOW_SITE_ID` — Found in Site Settings > General
- `ANTHROPIC_API_KEY` — Alt-text generation (paid; scripts print a dollar estimate and need `--yes` before submitting)

**Figma snapshot (this project):** design data is cached in `figma/` (see `figma/README.md`); build sessions read it and never call `api.figma.com`. Build order and lanes: `docs/figma/build-queue.md`.

Figma REST calls fail with 403 when the token holder has view-only access, and the Figma MCP has plan-based call limits. Check access before starting: `docs/reference/figma-access.md`.

### Precise Style Extraction
`node scripts/api/figma/extract-styles.js <fileKey> <nodeId>` outputs exact CSS values (in rem) from Figma nodes. Use it when the MCP's Tailwind approximation doesn't match the design.

## Custom Code Delivery

All custom code is bundled from a single TypeScript entry into one minified JS
file served from jsDelivr by git tag. One CDN URL goes into Webflow Site
Settings → Custom Code → Footer; updates ship by bumping a changeset and
editing the URL.

```
src/
├── index.ts                 ← single entry: imports every feature and wires it into Webflow.push
├── utils/{name}.ts          ← one file per feature, named export
└── types/gsap.d.ts          ← ambient CDN globals (gsap, ScrollTrigger, Lenis, SplitText, Swiper)
bin/
└── build.js                 ← esbuild: bundle: true, entry: src/index.ts, outdir: dist/
dist/
└── index.js                 ← committed build output; jsDelivr serves this at the tag
.changeset/                  ← changeset versioning
docs/solutions/              ← documented solutions (bugs, conventions, patterns), organized by category with YAML frontmatter (module, tags, problem_type)
```

- `pnpm run build` — production bundle (minified IIFE)
- `pnpm run dev` — watch mode with live reload on `localhost:3000`
- `pnpm run check` — strict typecheck (no emit)

**Module pattern (mandatory):**

```ts
// src/utils/featureName.ts
export const featureName = () => {
  const root = document.querySelector<HTMLElement>('.selector')
  if (!root) return  // selector-presence guard — the only guard needed

  // do the work; CDN globals (gsap, ScrollTrigger, Lenis, SplitText, Swiper)
  // are ambient and guaranteed available inside Webflow.push
}
```

Every module is called once from `src/index.ts` inside `window.Webflow.push(() => {...})`.
`Webflow.push` fires after DOMContentLoaded and after Webflow.js has
initialised, so every CDN global is resolved by the time the callback runs.
No polling loaders, no dedup guards, no readyState checks, no onLayoutReady
queues, no scheduleLayoutInvalidation helpers — the bundle is loaded once
from a single `<script src>` tag and modules run in the order `src/index.ts`
dictates. Cross-module calls are normal TypeScript imports; don't put helpers
on `window`.

- **Clean naming (mandatory):** Use full, descriptive identifiers in source
  (`listWrapper`, not `l`). Minification handles compression.
- **SplitText:** Use `new SplitText(el, { autoSplit: true, onSplit: (self) => <animation> })`.
  GSAP 3.13+ auto-resplits on font swap and container resize. Never call
  `.revert()` manually when `autoSplit: true`. Never use `mask: 'lines'`: it
  breaks inline word flow; set `overflow: hidden` on `self.lines` manually.
  The option is `type` (plural values, e.g. `'lines,words'`).
- **GSAP module conventions:** `autoAlpha`, not `opacity: 0` (keeps pointer
  events honest); toggle only the non-default class so a failure falls back
  to the default; target the `.footer` class, never the `footer` tag (CTA
  wrappers are `<footer>`); prefer `yPercent` over CSS `translate` on the
  same element. See `docs/solutions/conventions/gsap-module-conventions.md`.
- **Visibility:** toggle `is-active` (or similar) classes; never set inline
  `display: none` from JS.
- **ScrollTrigger.refresh:** Don't call `refresh()` from inside a scroll
  handler, `gsap.ticker` callback, or `lenis.on('scroll', …)` — that causes
  scroll lock. For a deliberate, discrete content-size change (CMS filter,
  accordion expand), call `ScrollTrigger.refresh(true)` inline; it defers
  until momentum scroll settles.
- **Smooth-scroll default is Lenis** (`src/utils/lenisGsap.ts`). Lenis
  supports `position: sticky` and pairs cleanly with `ScrollTrigger.update`.
  GSAP ScrollSmoother is an opt-in swap (`src/utils/gsapSmoothScroll.ts`);
  follow the swap checklist in `docs/reference/runtime-modules.md` (wrapper
  structure, modals outside `#smooth-content`, `[data-pin]` instead of CSS
  fixed/sticky, iOS `isTouch` fallback, deferred modal focus).
- **Late layout shifts (mandatory, both engines):** ScrollTrigger caches
  trigger positions, so any image that loads after init shifts every trigger
  below it. `eagerImages()` runs first in `Webflow.push` and promotes
  `[data-eager]` lazy images to eager; put `data-eager` on images above or
  inside animated sections. The scroll module adds engine-neutral refresh
  layers (`ignoreMobileResize`, `load`, bfcache `pageshow`, debounced
  ResizeObserver, all via `refresh(true)`). Eliminating the shift beats any
  refresh hook. Background:
  `docs/solutions/integration-issues/scrolltrigger-mobile-premature-animations.md`.
- **Runtime modules:** `src/utils/` ships opt-in modules (nav toggle, hero
  video, Finsweet filter panels and refresh, scroll text reveal, image hover,
  view switcher, scroll pin, `?debug=1` overlay). Each module's DOM contract
  and its required init order are in `docs/reference/runtime-modules.md`;
  enable one by uncommenting it in `src/index.ts`.

**Deploy:** bump a changeset, tag, push. Live CDN URL:
`https://cdn.jsdelivr.net/gh/Granite-Marketing/<your-repo>@vX.Y.Z/dist/index.js`.
Update the Webflow footer tag to the new version to ship. Pushing a tag does
not change the live site until the footer URL changes. Changesets does not
create the tag; tag after `changeset version`. Curl the jsDelivr URL for the
new tag before editing the footer. Webflow script API limits (alphanumeric
display names, version bumps, 2,000-char inline and 10,000-char custom-code
caps): `docs/reference/webflow-scripts-api.md`.

## Automation Boundary

### What the automation handles
- HTML structure, class names, content, images, links
- Custom data attributes
- Semantic elements and accessibility attributes

### What GSAP handles at runtime (NOT automated)
- Text splitting animations (SplitText)
- Clip-path reveals
- Scroll-triggered effects
- `aria-hidden="true"` on split text wrappers

## Component Variants
- Use `is-` modifier classes for variants, NOT separate components
- Example: `card_component` + `is-large` for a larger variant of the same component

## Visual Testing
- Playwright captures Webflow screenshots at 1440x900 viewport
- Claude vision compares against Figma reference (primary)
- Playwright `toHaveScreenshot()` for regression between iterations (secondary)
- Baseline URL: configured in `playwright.config.ts`

## Webflow ID Caching (mandatory)

After any Webflow API or MCP call that returns resource IDs (pages, collections, fields, component IDs), **save them to `docs/reference/webflow-ids.md`** if not already cached. This prevents redundant `list_pages`, `get_collection_list`, and similar lookups in future conversations. Always verify cached IDs still exist before using them on destructive operations (e.g., `upsert_page_script`, `delete_collection_items`).

## Webflow MCP Notes
- Element Builder (MCP 2.1+) nests to any depth in one call. Use `Paragraph`/`Heading` for text: `set_text` on a `TextBlock` is silently ignored (see `docs/solutions/integration-issues/webflow-mcp-element-builder-textblock-text-ignored.md`)
- **CMS bindings via MCP:** `data_element_settings_tool` > `set_settings` can bind custom attributes (`key: "attributes"`, `value_binding`) and element text (`key: "text"`, `binding`) to CMS fields. The `attributes` write replaces the full list, so read first and re-include static attributes. Webflow refuses to delete a CMS field that is still bound (409), so unbind first (see `docs/solutions/workflow-issues/webflow-cms-field-limit-migration.md`)
- **Never mutate Webflow without approval:** present the plan (elements, classes, CMS writes) and wait for a yes before any Designer or Data API change.
- Designer API requires Webflow Designer open + companion app running
- **Site ID verification (mandatory on failure):** Always use the site ID from `docs/reference/webflow-ids.md`. If MCP calls fail twice, do a fresh `sites_list` API call to verify the cached ID is still correct — a wrong site ID produces a generic "Unable to connect" error that mimics connection issues.
- Images uploaded via `/export-assets` skill or `pnpm run upload-assets` (MCP can't upload directly)
- Publish via `sites-publish` after building, then wait before screenshotting

### MCP Limitations (what it CANNOT do)
- **Rich text child styling** — Can apply a class to the rich text container, but cannot style nested element types (All H2s, All Paragraphs, etc.) within it. Must be done manually in Designer or pre-set in the Relume template.
- **Form elements** — Since MCP 2.1 the element builder creates real form elements (e.g. `FormRadioInput` builds a radio wrapper, input and label; radio `groupName` is a setting). Verify the output in the Designer; the template is still the safer source for full forms.
- **Inline styles on specific elements** — Limited ability to set per-element overrides; prefer combo classes instead.
- **Rich text block content** — Cannot programmatically add/edit content inside a RichText element.

These limitations are why the Style Guide page must be pre-built from a template (Relume) rather than generated from scratch.
