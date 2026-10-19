# Q024 build plan: image-inset-single

One inset image on a cream section. Build once on `rooms-individual` (page `6ad66fd5f8bf4846e809dc45`) from `rooms-individual/04-section`, convert to a Webflow component, and add the small variant as a component variant. Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q024/generate-preview.mjs --shoot`.

## Tree

- `section` `.section_image-inset-single`
  - `div` `.padding-global .padding-section-small`
    - `div` `.container-large`
      - `figure` `.image-inset-single_figure` (+ `.is-small` on the small variant)
        - `img` `.image-inset-single_image` (props: image, image alt)

## Class family

| Class | Desktop styles | Breakpoint overrides |
|---|---|---|
| `section_image-inset-single` | background `color-neutral-100` | none |
| `image-inset-single_figure` | position relative, width 100%, aspect-ratio 1253 / 753, margin 0, overflow hidden | none |
| `image-inset-single_image` | display block, width 100%, height 100%, object-fit cover | none |

Reused: `padding-global`, `padding-section-small`, `container-large`. No new shared classes. Variables: `color-neutral-100` (#F4EFDF per `figma/tokens.json`).

## Variants

| Variant | Modifier | Differences | Instances |
|---|---|---|---|
| base | none | full container width, aspect 1253 / 753 | `rooms-individual/04-section`, `arts/03-section` (different images) |
| small | `is-small` on `image-inset-single_figure` | max-width 46.5rem (744px), aspect 744 / 524, left-aligned by default flow | `happenings-indiv/03-section`, `blog-indiv/03-section` |

The brief's `is-cream + is-no-image + is-regular` is replaced by `is-small`: all instances are on cream, the variant does hold an image (a #D9D9D9 placeholder), and the shorter height follows from the narrower figure. Webflow combo classes cannot style descendants, so the modifier sits on the figure; expose it as a Webflow component variant (base, small) that swaps the figure's combo class. Full list in `deviations` in plan.json.

## Assets

| Slot | Webflow asset id | Local |
|---|---|---|
| rooms-individual image | `6ad67019735773f25340899e` | `assets/images/d7332204a5bee888af6d6fe5adf267bebfab8918.png` |
| arts image | `6ad66fff134731ad1b927c11` | `assets/images/6f6117168648560af09fa8344fd7ec88a095e861.png` |

KTD10: if MCP image placement fails, set these two images by hand in the Designer. The small variant has no asset yet (see open questions).

## Open questions

1. `rooms-individual/04-section` was tagged video/media and looks like a video frame. Is it a background video? If yes, the img becomes the backgroundVideo module markup inside the same figure.
2. Which image fills the small variant on happenings-indiv and blog-indiv? C01 proposes no image field for `cms-happenings-blog-indiv`.
3. Should the rooms-individual image bind to a per-room CMS field (the page is the rooms-collection template)?
4. No mobile design: desktop aspect ratios are kept at every breakpoint. Confirm or give a mobile ratio.
5. Vertical spacing uses `padding-section-small`; Figma gaps vary (130/40, 163/40, 150/202 px). K01 to confirm against neighbouring plans.

## Compare notes

Compared by a Sonnet subagent. The Figma frame is 1600 wide and the preview shots are 1440, so proportions are compared, not pixels.

| Crop | Preview | Matches | Does not match |
|---|---|---|---|
| `rooms-individual/04-section` | `preview-base-1440.png` | Aspect 1.665 vs 1.664, symmetric insets, cream background, same image crop | Left inset 5.6% of viewport vs 11.1%: container-large is 1280px at any viewport of 1344px or more, against Figma's 1253px in 1600. At a 1600 viewport the gap is 10% vs 11.1%. Accepted deviation (low). |
| `arts/03-section` | `preview-base-arts-1440.png` | Aspect, insets, background and crop match | Same inset difference as above (low) |
| `happenings-indiv/03-section` (and identical `blog-indiv/03-section`) | `preview-is-small-1440.png` | 744px wide placeholder, aspect 1.42, #D9D9D9, left-aligned, empty right side, cream background | Left inset 80px vs 169px (container width, as above). Vertical whitespace 48px vs 75/101px in the crop, which includes neighbour padding (open question 5). Low. |
| none (no mobile design) | `preview-*-390.png` | 32px gutters, no overflow, sensible cover crops, small variant goes full width | Not compared |

Validation: plan.json parses, has every required key, every tree class and variant target is declared, asset paths exist, preview.css matches the plan values, no em dashes. The preview sets `loading="eager"` on images so screenshots wait for them; the plan keeps `lazy`.
