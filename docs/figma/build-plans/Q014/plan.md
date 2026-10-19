# Q014 build plan: hero-fullbleed-centered

One native Webflow component for the page heroes: 24 instances on 22 pages. Build it once on Home (`6ad64060ae8eac6d7b7c4241`) from `home/01-the-bold-handsome-heart-of-san`, convert it to a Webflow component, then insert instances. Machine-readable plan: [plan.json](plan.json). Regenerate with `node docs/figma/build-plans/Q014/generate-plan.mjs` (reads the `figma/` specs and the asset manifest), then `node docs/figma/build-plans/Q014/render-preview.mjs` (writes the preview and screenshots).

## Tree

- `section` `.section_hero-fullbleed-centered` (+ `is-text-dark`)
  - `figure` `.hero-fullbleed-centered_figure` (optional: image prop; absolute, fills the section)
    - `img` `.hero-fullbleed-centered_image` (`data-eager`, object-fit cover)
  - `figure` `.hero-fullbleed-centered_logo-wrapper` (optional: logo prop; centred in the section, Zuma only)
    - `img` `.hero-fullbleed-centered_logo`
  - `div` `.padding-global .padding-section-small`
    - `div` `.container-large`
      - `article` `.hero-fullbleed-centered_component` (+ `is-left`)
        - `header` `.hero-fullbleed-centered_header`
          - `div` `.text-size-regular .text-style-eyebrow-caps` (optional) > `p`
          - `h1` `.heading-style-h2` (optional)
          - `div` `.hero-fullbleed-centered_text .text-size-large` (optional) > `p`
        - `footer` `.hero-fullbleed-centered_footer` (optional)
          - `a` `.button .is-octagon` (+ `is-burgundy` or `is-blue`)
            - `div` `.text-size-regular .text-style-button`

The section is `min-height: 100vh` with content pinned to the bottom (`justify-content: flex-end`); `padding-section-small` gives the 3rem bottom gap that Figma shows (43 to 47px). The heading, text and button stack with a 1.75rem gap, matching home/01.

## Class family

New, owned by this plan: `section_hero-fullbleed-centered`, `hero-fullbleed-centered_figure`, `_image`, `_logo-wrapper`, `_logo`, `_component`, `_header`, `_text`, `_footer`, and the modifiers `is-text-dark` (on the section) and `is-left` (on `_component`).

Reused: `padding-global`, `padding-section-small`, `container-large`, `heading-style-h2`, `text-size-large`, `text-size-regular`, `button`.

Proposed shared (K01 settles names): `text-style-eyebrow-caps` and `text-style-button` (combos on `text-size-regular`), `is-octagon`, `is-burgundy`, `is-blue` (combos on `button`).

Variables: `color-neutral-100`, `color-neutral-900`, `color-neutral-300`, `color-secondary`, `color-brand-4a1217`, `color-brand-489cca`, `font-style-heading`, `font-style-body`.

## Variants

| Variant | Classes | Differences from base | Instances |
|---|---|---|---|
| base | none | Cream text, centred, placeholder fill (`color-neutral-300`) or the image prop | 15 (includes arts/01 with image, 4 dining heroes with a button) |
| is-text-dark | `is-text-dark` on the section | Text `color-neutral-900` | 6: home, dining-collection, wellness, meetings, history, neighborhood |
| brief `is-image-bg + is-1-image` | none | Image prop set; layout is base | arts/01 |
| brief `is-image-bg + is-left + is-1-image` | `is-left` on `_component` | Left-aligned, max-width 44rem, eyebrow only | rooms-individual/05, arts/04 |

Content, not variants: eyebrow, heading, text, button (text, link, colour combo), image, logo. Button colours per instance: cream on home/01, `is-blue` on dining-zuma, `is-burgundy` on garden terrace, lobby bar and pool lounge.

## Open questions

1. Base background: 21 instances show the Figma grey placeholder. Are hero photos coming for all of them? The plan fills with `color-neutral-300` until then.
2. `is-text-dark` is new (not in the brief). Confirm the dark/cream split is intended, or say which colour wins once photos are in.
3. Paragraph line height: dark-text instances use 1.3, cream ones 1.6. The plan uses 1.6 everywhere via `_text`; check it still wins over whatever Q001 sets on `text-size-large`.
4. Button label: home uses CAPS-CAPTION-16, dining pages use Label / Button. The plan uses `text-style-button` for both.
5. `is-octagon` uses `clip-path`; if the style panel cannot set it, K01 moves it to the global embed.
6. Gutter: Figma puts the `is-left` eyebrow at x=40 on a 1600 frame; `container-large` puts it at x=80 at 1440 and x=160 at 1600. K01 decides whether full-bleed captions skip the container.
7. Variable names `color-brand-4a1217` and `color-brand-489cca` are tokens.json suggestions; D01 does not name them and does not cover #489CCA.
8. Optional element `gatch-24` from components.md appears in none of the 24 specs; no slot planned.
9. `heroTextReveal` attributes are left off; no animation note asks for them.

## Manual Designer steps

- Upload the Zuma wordmark (`figma/vectors/group-270989670-416x101-250-1958.svg`) before the dining-zuma page entry.
- Images (KTD10): `arts/01` uses asset `6ad670147e3d6550932e0fac`, `rooms-individual/05` uses `6ad67019735773f25340899e`, `arts/04` uses `6ad66fff134731ad1b927c11`. Place by hand unless MCP placement is proven.
- The nav overlay (`guild-nav-full-dark`) is built by hand; its region is ignored in the compare.

## Compare notes

A Sonnet subagent compared each 1440 and 390 screenshot with its crop. Known exclusions: the hand-built nav, the licensed fonts (previews use Copperplate and Helvetica Neue fallbacks, so text widths and heading size run about 10% off), the #D9D9D9 placeholder shown as #D1D1D1, and the Figma button-over-paragraph overlap on dining pages. Nothing overflows or clips at 390 in any preview.

**base, [preview-base-1440.png](preview-base-1440.png) vs press/01.** Matches: flat grey fill, cream text, centred, heading then one-line paragraph, no button. Differs: text block sits about 8 to 10px higher than Figma (3rem bottom padding against about 2.75rem in Figma).

**is-text-dark, [preview-is-text-dark-1440.png](preview-is-text-dark-1440.png) vs home/01 (reference).** Matches: dark heading and paragraph, cream octagon button at about 195x37, order and centring, heading within 8px of the Figma position. Differs: the paragraph wraps to 4 lines (Figma 3) because of the wider fallback font and the 1.6 line height (Figma 1.3 on this instance, open question 3); heading-to-text and text-to-button gaps read larger for the same reason; button bottom is 49px from the edge against 43px in Figma.

**is-image-bg + is-1-image, [preview-image-centered-1440.png](preview-image-centered-1440.png) vs arts/01.** Matches: photo fills the hero at the same scale, cream text centred over it. Differs: the vertical crop of the photo differs (the Figma fill shows the painting lower in the frame, and looks warmer). The Designer session should check the Figma fill crop and set an object-position on the instance if the uploaded asset is framed differently; no overlay or tint is in the spec.

**is-image-bg + is-left + is-1-image, [preview-is-left-1440.png](preview-is-left-1440.png) vs rooms-individual/05.** Matches: photo background, two-line cream eyebrow bottom-left in caps. Differs: left inset is 80px against 40px in Figma at 1600 (container-large, open question 6); the wrap point differs (fallback font; max-width 44rem copies the Figma text box); last line sits about 19px higher; photo framing is about 55px lower. The 20px cream strip at the top of the crop belongs to the previous section.

**base with logo and is-blue button, [preview-logo-button-blue-1440.png](preview-logo-button-blue-1440.png) vs dining-zuma/01.** Matches: Zuma wordmark centred (within 1px vertically), blue octagon button with cream label, one-line paragraph. Differs: logo and button stay at Figma pixel size (26rem, 12.125rem) rather than scaling with the viewport, which is intended; heading and paragraph sit about 17 to 20px lower because the button now sits below the text instead of overlapping it.

**base with is-burgundy button, [preview-button-burgundy-1440.png](preview-button-burgundy-1440.png) vs dining-gardenterrace/01.** Matches: burgundy octagon button with cream label, same shape and size as Zuma, centred stack. Differs: same offsets as Zuma for the same reason.

No plan changes came out of the compare: the remaining differences come from fallback fonts, are logged as open questions 3 and 6, or are under 10px of bottom padding (padding-section-small is reused rather than overridden). Re-check against the real fonts in the Designer session.
