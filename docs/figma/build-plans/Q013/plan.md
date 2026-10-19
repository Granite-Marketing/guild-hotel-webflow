# Q013 build plan: footer-links

Site footer shared by 24 pages. Build once on Home (`home/19-the-hotel`, page `6ad64060ae8eac6d7b7c4241`), convert to a Webflow component with no props, then insert instances. All 24 instances have identical content, so there is one variant (base) and no modifier.

Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), generated with `node docs/figma/build-plans/Q013/render-preview.mjs` (CSS comes only from the style values in plan.json).

## Tree

- `section.section_footer-links` (`role="contentinfo"`)
  - `figure.footer-links_background`
    - `img.footer-links_background-image` (asset `6ad66fef6684c3e22ea4dc76`, empty alt, decorative)
    - `div.footer-links_overlay`
  - `div.padding-global.footer-links_padding`
    - `article.footer-links_component`
      - `nav.footer-links_columns` (`aria-label="Footer"`)
        - `div.footer-links_column` x5 (the hotel, experience, dining, social, links)
          - `header.footer-links_column-header`
            - `h2.footer-links_column-heading.text-style-eyebrow-caps`
          - `ul.footer-links_list` (`role="list"`)
            - `li.footer-links_list-item` > `a.footer-links_link.text-style-caption` (8, 7, 5, 3, 3 links)
      - `div.footer-links_bottom`
        - `div.footer-links_legal` > `p.footer-links_text.text-style-legal`: "copyright © `<span data-current-year>`2026`</span>` the guild hotel"
        - `figure.footer-links_logo` > `img.footer-links_logo-image` (Tribute Portfolio SVG, not uploaded yet)
        - `div.footer-links_credit` > `p.footer-links_text.text-style-legal`: "brand & website by" `a.footer-links_credit-link` "Studio circa"

## Classes

- Reused: `padding-global`.
- Family `footer-links_*` plus `section_footer-links` (20 classes). `footer-links_padding` is a combo on `padding-global` that makes the padding wrapper a flex column so the component fills the 43.75rem section. `footer-links_text` only resets paragraph margins.
- Proposed shared (named generically, from `figma/tokens.json` suggestions):
  - `text-style-eyebrow-caps`: heading font, 1.125rem, line-height 1.2, letter-spacing -0.03em, lowercase.
  - `text-style-caption`: heading font, 0.875rem, line-height 1, letter-spacing 0.05em, lowercase (648 uses site-wide).
  - `text-style-legal`: same as `text-style-caption` with letter-spacing 0 (the 96 untracked uses). Standalone rather than a combo so it never competes with `text-style-caption` over letter-spacing.
- Variables: `color-neutral-100` (text), `color-neutral-900` (fallback under the image), `font-style-heading`.

Sackers Heavy Gothic is an all-caps face, so lowercase source text renders as caps; Webflow content is entered lowercase, matching Figma.

## Layout values (desktop, from the 1600 frame)

- Section min-height 43.75rem (700px); component padding 12.5rem top, 2.5rem bottom; columns and bottom row pushed apart with `justify-content: space-between`.
- Columns grid `0.87fr 1fr 1fr 1fr max-content` reproduces the Figma x positions (40, 333, 671, 1009, 1347). Heading to first link 2rem; link pitch 26px, so list gap 0.75rem.
- Bottom row grid `1fr auto 1fr`, items aligned to the end; logo 9.5rem wide.
- Image: `object-fit: cover`, `object-position: 50% 80%`. Overlay: 20% black plus a black gradient from 56% to 65% over the top 22%.

## Responsive (proposal, no mobile design in the snapshot)

- Tablet (991px): min-height auto, padding-top 8rem, 3 columns.
- Mobile landscape (767px): padding-top 5rem, 2 columns, column inner gap 1.25rem, bottom row stacks left-aligned with the logo first.
- Mobile portrait (479px): padding 4rem top, 2rem bottom; link line-height 1.2 for wrapped labels.

## Variants

Only `base`. The brief's optional `gatch-20` element is not part of this component: on the three dining venue pages it comes from an overlapping "other dining options" slider (Group 270990062) whose box runs past the footer band. See deviations in plan.json.

## Open questions

1. Logo SVG has no Webflow asset id: upload it before the Designer session, or use an inline SVG embed?
2. Hrefs for amenities, services (x2), corporate, resortpass, packages, the four dining venues, in-room dining, privacy policy, accessibility, the three social links, and the Studio circa credit. Placeholders are `#`.
3. Confirm the responsive proposal or supply a mobile design.
4. `<section role="contentinfo">` versus a `<footer>` tag (CLAUDE.md reserves `<footer>` for CTA wrappers).
5. No `container-large`: the design runs edge to edge. Confirm that is acceptable for this section.

## Compare notes

Sonnet comparison of the final screenshots against the reference crops.

### `home/19-the-hotel` (base, 1440 preview vs 1600 crop)

- Matches: 5 columns in Figma order and content; column starts within 1.3% of width of Figma (2.2, 21.2, 42.6, 64.0, 85.5% vs 2.5, 20.8, 41.9, 63.1, 84.2%); link pitch 26px; bottom row text bottom about 660 and logo 629 to 660; section 700 tall; background crop (tables and banquette) and overlay darkness; text colour; underlined credit link.
- Differs: visible glyph tops of headings sit about 11px and first links about 7px below Figma. The text boxes start at the planned 200px; the offset comes from the Copperplate fallback's metrics and should close with Sackers Heavy Gothic. Fallback font is heavier and wider. Side margin 32px vs 40px (padding-global).

### `dining-lobbybar/10-the-hotel` (stands for the three dining venue crops)

- Matches: the top 700px is the same footer as home; the preview matches it the same way.
- Differs: the crop's extra 144px (H2, Gatch 20 body, grey placeholders, arrows) is an overlapping slider from another section, not built here by design.

### Mobile (390, no reference)

- Two columns, three rows of groups, then logo, copyright and credit stacked left-aligned. No overflow; "photoshoot guidelines" wraps to two lines. Logo left-aligned is a judgement call, listed in open question 3.

The other 20 instance crops are identical in content to `home/19-the-hotel` (checked from spec texts and node lists), so the home comparison covers them.
