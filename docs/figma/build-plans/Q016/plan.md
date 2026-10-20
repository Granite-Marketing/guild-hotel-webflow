# Q016 build plan: script-intro-centered

Build once on Home (`6ad64060ae8eac6d7b7c4241`) from `home/02-a-century-of-stories-meets-a`, convert to a Webflow component, and insert instances on 9 other pages. happenings-indiv/02 and blog-indiv/02 are excluded (see below). Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated from the plan with `node docs/figma/build-plans/Q016/generate-preview.mjs --validate --shoot`.

## Tree

- `section.section_script-intro-centered` (+ `is-tall` on home)
  - `div.padding-global.padding-section-xlarge`
    - `div.container-large`
      - `article.script-intro-centered_component`
        - `div.script-intro-centered_back` (optional, rooms-individual)
          - `a.script-intro-centered_back-link.text-size-regular.text-style-caps-caption-16`
            - `img.script-intro-centered_back-icon` (arrow SVG)
            - `span` (link text)
        - `figure.script-intro-centered_figure` (optional; + `is-bottom` for the stamp)
          - `img.script-intro-centered_image`
        - `header.script-intro-centered_header`
          - `h2.script-intro-centered_heading.heading-style-h1.text-style-script` (script heading, rotated -7.38deg)
        - `div.script-intro-centered_text` (optional; + `is-wide` for 742px copy)
          - `p.script-intro-centered_paragraph.text-size-medium.text-weight-normal`

Flex column order puts the figure above the header; `is-bottom` sets `order: 1` so the stamp sits below the paragraph without a second slot.

## Class family

`section_script-intro-centered` plus 10 `script-intro-centered_*` element classes. Reused: `padding-global`, `container-large`, `heading-style-h1`, `text-size-medium`, `text-size-regular`, `text-weight-normal`.

Proposed shared classes (K01 reconciles with sibling plans):

| Class | On | Values |
|---|---|---|
| `padding-section-xlarge` | `padding-global` | 14 / 10 / 6 / 5rem top and bottom (Figma gaps 218 to 283px) |
| `text-style-script` | `heading-style-h1` | Morello 5rem, line-height 1.2; 4 / 3.25 / 2.75rem below desktop |
| `text-style-caps-caption-16` | `text-size-regular` | same definition as P018 |

Variables: `color-neutral-100` (background), `color-neutral-900` (script heading), `color-accent` (paragraph, back link), `font-style-heading`, `font-style-body`.

## Variants and element modifiers

| Modifier | On | Difference | Used by |
|---|---|---|---|
| base | | cream, centred, script heading, 36.75rem paragraph | 11 instances |
| `is-tall` | section | +2.5rem bottom padding; the illustration supplies the rest of the height | home |
| `is-wide` | `_text` | paragraph max-width 46.5rem | dining-collection |
| `is-bottom` | `_figure` | decoration below the paragraph, 10rem wide | rooms-collection |

Every covered instance uses the Morello script heading (`heading-style-h1` + `text-style-script`), so heading size is not a variable here.

## Instances

| Page / section | Variant | Slots used |
|---|---|---|
| home/02 | is-tall | illustration, script heading, paragraph |
| dining-collection/02 (base reference) | base, `_text.is-wide` | heading, paragraph |
| rooms-collection/02 | base, `_figure.is-bottom` | heading, paragraph, stamp |
| history/02 | base | heading only |
| guidelines/02 | base | heading, paragraph |
| rooms-individual/02 | base | back link, heading |
| arts/02 | base | heading, paragraph |
| neighborhood/02 | base | heading, paragraph |
| legal/02 = corporate/02 | base | heading, paragraph (identical) |

## Excluded instances

happenings-indiv/02 and blog-indiv/02 (identical CMS templates) have a different layout: left-aligned caps title (H5-CAPS), long paragraph, burgundy octagon CTA, no script heading. Following the orchestrator rule (unsure between variant and unique item: make it unique), they are left out of this family and listed under `excludedInstances` in plan.json with their content. They need their own entry.

## Open questions

See `openQuestions` in plan.json. In short: upload the three decoration SVGs (no Webflow asset id yet); an entry for the excluded happenings and blog sections; arts heading colour; the back-link target; responsive scale (no mobile design).

## Compare notes per crop

A Sonnet subagent compared each preview at 1440 with its crop (crop scaled from 1600 to 1440) and checked the 390 shots. Fonts are fallbacks locally (Morello, Sackers and Gatch are not installed), so line wraps differ slightly. Plan values are Figma px converted 1:1, so the preview reads about 10 percent larger than the scaled crop; that is one systematic offset, not a per-crop bug.

**dining-collection/02 (base reference)**
- Matches: centred two-line rotated heading with the same break; heading width and rotation agree; olive centred paragraph at 46.5rem (`is-wide`); heading to paragraph gap within about 10px.
- Differs: nothing beyond fonts. (The subagent reported a 588px paragraph; measured in the page it is 744px with `is-wide`, so that note was wrong.)
- 390: heading wraps to three lines, no overflow.

**home/02 (is-tall)**
- Matches: illustration, rotated heading, paragraph in that order, centred; 36.75rem paragraph box.
- Differs: illustration to heading and heading to paragraph gaps are about 27px larger than Figma (home is tighter than the other instances, which the one shared heading margin cannot express). Left as is; the Designer session can tighten home with a heading margin if wanted.
- 390: fits, no overflow.

**rooms-collection/02 (stamp, `is-bottom`)**
- Matches: heading, paragraph, stamp order and centring; paragraph to stamp gap (85 versus 83px); heading to paragraph gap within about 8px.
- Differs: the stamp was 191px wide against 159px in the SVG; fixed to 10rem and re-shot.
- 390: fits.

**rooms-individual/02 (back link)**
- Matches: centred back link with arrow and about 6px gap, caps styling, link width, two-line rotated heading.
- Differs: link to heading gap about 9px larger than Figma at 1600. Left as is.
- 390: fits.

happenings-indiv/02 and blog-indiv/02 were compared against an earlier preview and then excluded from this plan, so no notes are kept for them.

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- Class list `script-intro-centered_back-link text-size-regular text-style-caps-caption-16` is now `script-intro-centered_back-link text-style-caps-caption-16`.
- Class list `script-intro-centered_heading heading-style-h1 text-style-script` is now `script-intro-centered_heading text-style-script is-large`.
- Script heading is `text-style-script is-large` (Morello 80/96) with no `heading-style-h1`.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).
