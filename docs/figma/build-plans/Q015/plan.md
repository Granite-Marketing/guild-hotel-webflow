# Q015 build plan: faq-accordion

Build once on Home (`6ad64060ae8eac6d7b7c4241`) from `home/17-faqs`, convert to a Webflow component with no props, then insert it on the other 20 pages (content identical everywhere). Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q015/generate-preview.mjs`; plan checked with `node docs/figma/build-plans/Q015/validate-plan.mjs`.

## Tree

- `section.section_faq-accordion`
  - `div.padding-global.padding-section-large`
    - `div.container-large`
      - `article.faq-accordion_component`
        - `header.faq-accordion_header`
          - `div.text-size-regular.text-weight-normal.text-style-eyebrow-caps` > `p` "faqs"
          - `h2.heading-style-h2.text-weight-normal` "your questions, answered"
        - `div.faq-accordion_list`
          - `div.accordion_item` (x6)
            - `button.accordion_header` (`type="button"`)
              - `div.accordion_question.heading-style-h4.text-weight-normal` question
              - `div.accordion_icon` (`aria-hidden="true"`) > embed: chevron SVG, `currentColor`
            - `div.accordion_content-wrapper`
              - `div.accordion_content.text-size-medium.text-weight-normal` > `p` answer

## Classes

- **Family (new):** `section_faq-accordion` (cream background, dark text), `faq-accordion_component` (centred column, 5rem top and 7rem bottom on top of `padding-section-large`), `faq-accordion_header` (centred, 1.25rem gap, 5rem below), `faq-accordion_list` (max-width 59.75rem).
- **Proposed shared (K01):** `text-style-eyebrow-caps`; the accordion contract family `accordion_item`, `accordion_header`, `accordion_question`, `accordion_icon`, `accordion_content-wrapper`, `accordion_content`. Their names are fixed by `src/utils/accordion.ts`, so any later accordion reuses them.
- **Reused:** `padding-global`, `padding-section-large`, `container-large`, `heading-style-h2`, `heading-style-h4`, `text-size-regular`, `text-size-medium`, `text-weight-normal`.
- **Variables:** `color-neutral-100` (#F4EFDF), `color-neutral-900` (#262118), `font-style-heading`, `font-style-body`.
- **Site custom CSS (one rule):** `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }` (see open question 2).

Measurements (Figma px at 1600 wide): list x 323 to 1278 (955px, 59.75rem); eyebrow to H2 19px; H2 to first question 123px (5rem header margin plus 2.625rem item top padding); closed row pitch 81px (42px above the question, 10px below to the divider, so header padding 2.625rem / 0.625rem); open item 25px question to answer and 45px answer to divider (content padding 0.9375rem / 2.75rem); divider 1px at about 30% of #262118.

## Variants

One variant, `base`, used by all 21 instances. No modifiers.

## Runtime check

The real `accordion()` module was bundled and run against `preview.html` in Chromium: click and keyboard Enter on the button trigger both open the item, close the others, set `aria-expanded`, and toggle `is-active`. It also showed that the module collapses every item on init, so the open first item in the crop cannot be reproduced without a module change (open question 1).

## Open questions

1. **First item open on load.** The module collapses all items on init; a pre-set `is-active` leaves the header saying expanded while its content is closed. Proposal: a small module change in a separate code entry (open a header that carries `data-accordion-open`). Until then all items start closed and the Designer must not pre-set `is-active`.
2. **Chevron state.** `.accordion_header.is-active .accordion_icon` cannot be authored in the Designer. Proposal: one rule in site head custom code, or the module toggles a class on the icon. K01 picks one for every accordion.
3. **Trigger element.** Native `button` (custom element tag) so Enter and Space work. Fallback if the builder cannot nest children in a button: Link Block with `href="#"`. Never a plain div.
4. **Copy.** All 21 instances repeat room-specific placeholder questions, and only item 1 has an answer in Figma; items 2 to 6 reuse it as a placeholder. Per-page FAQs later would need component props or a FAQ collection.
5. **Section spacing.** Bottom gap is about 227px everywhere; the top gap varies with the band crop (194, 134, 67px). Component padding is used for the extra; K01 may prefer a shared `padding-section-xlarge`.
6. **Mobile.** No mobile frame in Figma; tablet and mobile values are derived. Questions wrap to 2 or 3 lines at 390px with `heading-style-h4` at 1.5rem; the responsive heading scale belongs to Q001.
7. **Divider colour.** Plan uses `color-mix(in srgb, var(--_primitives---colors--neutral-darkest) 30%, transparent)`. If Webflow will not take `color-mix` on a border, K01 adds a variable (blended solid #B6B1A3) instead of a hard-coded rgba.
8. **Mobile answer size.** `text-size-medium` stays 1.25rem at 390px, larger than the questions. Q001 should scale it to 1rem to 1.125rem on mobile.

## Deviations from the conventions

- The question is a `div` with `heading-style-h4` inside the button, not a heading in a header wrapper: a button cannot contain a heading, and the module needs the trigger directly before the content wrapper.
- The chevron is an inline SVG embed with `currentColor`, not an uploaded asset (the vector has no Webflow asset id).
- `accordion_*` classes sit outside the `faq-accordion_*` family because the runtime module fixes their names.

## Compare notes

Sonnet subagent compare, two iterations. Preview is rendered at 1440 and read 1:1 against Figma px (list width and positions are fixed in rem). Fonts in the preview are local fallbacks (Copperplate, Avenir Next), so font face differences are not judged.

### `home/17-faqs` crop vs `preview-base-1440.png` (applies to all 21 instances; their content is identical)

| Check | Result |
|---|---|
| Background and text colour | Match (#F4EFDF, #262118) |
| Eyebrow position, centring, case | Match (top about 194px) |
| H2 size, centring, 19px gap below eyebrow | Match |
| H2 to first question | Match (about 156px between centres) |
| List width and position | Match (955px, centred) |
| Open item: question to answer 25px, answer to divider 45px | Match after iteration 1 (was 36px and 33px) |
| Open item: chevron up, answer 20px on 26px | Match |
| Closed rows: pitch 81px, 42px above, 10px below | Match after iteration 1 (82px, 43px, 11px; was 84px and 13px below) |
| Divider | Match after iteration 1 (was solid near-black; now about 30% of #262118) |
| Section padding (about 194px top, 227px bottom) | Match (194px, about 225px) |
| Question size and tracking | Differs: cap height about 11px vs 13.5px, tighter tracking. Fallback font only; recheck on the live site with Sackers Heavy Gothic |
| Chevron | Slightly larger and thinner stroke than Figma; acceptable, recheck live |

Other instances: `gallery/05-faqs`, `contact/04-faqs` and `arts/09-faqs` crops are shorter only because their band starts closer to the eyebrow (top gap 134px or 67px); the component is the same.

### `preview-base-390.png` (no Figma mobile frame)

- No overflow; 32px gutters; H2 wraps to two lines cleanly.
- Questions wrap to 2 or 3 lines with the chevron centred; dividers light, as on desktop.
- Padding about 70px above and 65px below after iteration 1 (was about 44px and 41px).
- Answer text at 20px dominates the 15px questions (open question 8, for Q001).

## K01 reconciliation (2026-10-20)

`plan.json` is authoritative where this page differs. Shared classes, new variables and live corrections: [shared-classes.md](../shared-classes.md).

- Class list `text-size-regular text-weight-normal text-style-eyebrow-caps` is now `text-style-eyebrow-caps`.
- The six `accordion_*` classes are shared (runtime contract of accordion.ts), defined in shared-classes.json.
- Variables use live CSS names (`--_primitives---colors--*`, `--_typography---font-styles--*`).

## Build (2026-10-20)

Built through the Data API on `🧱 faq-accordion` (`6ad712c2faaaa1926dd004e3`, `/build-faq-accordion`) and converted to the component `faq-accordion` (`064f3089-65e4-65ec-6f9a-dc5cb4ab8ee7`), no props. The read-back matches the plan tree, classes, copy, chevron embed and `href="#"` on all six items, except for the following:

- **Trigger is a Link Block** (`href="#"`, class `accordion_header`), the plan's fallback. The Data API cannot make a native button, and `type` is a reserved attribute. Enter works through the module; Space does not activate a link.
- **The h2 is `heading-style-h2` only**, so it renders at weight 900 instead of 400. The `.heading-style-h2.text-weight-normal` combo does not exist, and it sits under a shared utility that this session may not create.
- **Four empty combos created** (approved by Stephen) so the accordion stacks apply: `.accordion_question.heading-style-h4`, `.accordion_question.heading-style-h4.text-weight-normal`, `.accordion_content.text-size-medium`, `.accordion_content.text-size-medium.text-weight-normal`.
- **Still open:** the chevron state rule `.accordion_header.is-active .accordion_icon { transform: rotate(0deg); }` (site custom code), and the first item open on load (module change). Both were open questions 1 and 2.
