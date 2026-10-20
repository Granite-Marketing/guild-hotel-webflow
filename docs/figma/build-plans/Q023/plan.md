# Q023 tab-pills-intro: build plan

Build on `wellness-collection` (page `6ad66fd7735773f253406791`), section `wellness-collection/02-from-movement-and-produce-to-deep`. Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q023/generate-preview.mjs --shoot`.

## What it is

A centred script heading and paragraph, then a burgundy chamfered pill of tabs. The base variant (press, happenings, blog) has the pill directly below the text, and its tabs are anchors to the category headings further down the page. The `media` variant (wellness, meetings) is the `scrollEnlargeSnap` root (A01). A chamfered frame below the intro grows to full screen on scroll, the Q021 venue cards stack inside it as panels, and the pill sits over the frame and drives the panels.

## Tree

- `section` .section_tab-pills-intro `[data-scroll-enlarge-snap]`
  - `div` .padding-global
    - `div` .container-large
      - `div` .tab-pills-intro_component
        - `header` .tab-pills-intro_header
          - `h2` .tab-pills-intro_heading .heading-style-h1 .text-style-script (prop `heading`, line break in the text)
          - `div` .tab-pills-intro_text .text-size-medium
            - `p` (prop `text`)
  - `div` .tab-pills-intro_stage `[data-scroll-enlarge-snap-stage]`
    - `div` .tab-pills-intro_frame `[data-scroll-enlarge-snap-media]`
      - slot `panels` (media only: one Q021 venue card per panel, each `[data-scroll-enlarge-snap-item]`)
      - `nav` .tab-pills-intro_tabs `aria-label` (slot `tabs`)
        - `a` .tab-pills-intro_tab .text-style-eyebrow-caps `[data-scroll-enlarge-snap-tab]`, one per tab

## Class family

`section_tab-pills-intro`, `tab-pills-intro_component`, `_header`, `_heading`, `_text`, `_stage`, `_frame`, `_tabs`, `_tab`. Reused: `padding-global`, `container-large`, `heading-style-h1`, `text-size-medium`. Proposed shared: `text-style-script` (Morello) and `text-style-eyebrow-caps` (EYEBROW-CAPS). Variables: `color-neutral-100`, `color-accent`, `color-brand-4a1217`.

## Variants

| Variant | Instances | Differences |
|---|---|---|
| base | press/02, happenings-collection/02, blog-collection/02 | Pill sits 3.75rem under the text; stage and frame are plain wrappers; section about 700px tall. The panels slot stays empty. |
| `is-media` (Webflow component variant "media") | wellness-collection/02, meetings-collection/02 | `is-media` is added to component (padding 7.5rem top, 10rem bottom), header (gap 3.5rem), stage (`100svh`, 1.25rem padding, centres the frame), frame (start width 80.8333% of the stage content box, which is 78.8% of the page, aspect 1261 / 712, 1.5rem chamfer, overflow hidden) and tabs (absolute, centred, 2.5rem above the frame bottom). |
| `is-active` (state) | all | Active tab: full opacity, underlined. scrollEnlargeSnap toggles it on media instances; base instances set it statically on the first tab. |

How the brief's variants map: base stays base. `is-media-center + is-1-image + is-tall` (wellness) and `is-centered + is-tall` (meetings) both become `is-media`. All three references centre their text, and the meetings frame is the same frame showing a grey placeholder where its first panel image will go. The wellness image is the first Q021 panel's image, so it sits in the panels slot and not on this component. See `deviations` in plan.json.

## Webflow build notes

- One component with slots `panels` and `tabs`, text props `heading`, `text`, `tabs label`, and a component variant "media" that applies the `is-media` combos.
- Media instances: drop the Q021 venue cards (wellness 03 to 06, meetings 03 to 05) into `panels`. Their `-item` classes come from Q021. Interface note for P021 and K01 is in the shared session notes (`P023-tab-pills-intro-interface.md`).
- Base tab hrefs are the ids of the category headings below (`#press`, `#design`, `#community`; `#dining`, `#culture`, `#conferences`). Media tab hrefs are `#`, and the module handles clicks.
- No image assets of its own. The wellness frame image is asset `6ad67000240d911fb18d77af`, placed by Q021 on the first panel.
- happenings-collection and blog-collection are CMS template pages (Q029). Their instance is identical, with no CMS binding.

## Open questions

See `openQuestions` in plan.json: base tab active state or filters, sticky pill, console warning on base instances, shared stage and frame with Q021 home, meetings tab copy, mobile values, and mobile tab overflow.

## Compare notes (Sonnet subagent, per crop)

The preview uses stand-in fonts (Snell Roundhand, Copperplate, Avenir Next) because the brand fonts exist only on Webflow. Glyphs, slant and line wraps therefore differ from Figma and are not counted below. The 1440 previews are compared with 1600-wide Figma frames, scaled.

**press/02 (base) vs preview-base-1440/390**
- Matches: cream background, burgundy chamfered pill centred under the text, pill 56px tall and about 410px wide at the 1440 scale (Figma 456 at 1600), side padding about 60px. Inactive tabs read at about 45% opacity, and the active tab is underlined. Text to pill gap is 60px in both.
- Differs: the body copy wraps to 3 lines against 2, because the stand-in font is wider. The tab text looks bolder (stand-in font). The "PRESS" heading at the bottom of the crop is the next section's and is intentionally absent.
- 390: nothing broken. The heading takes 2 lines, the body 4, and the three tabs fit inside the pill.

**wellness-collection/02 (is-media) vs preview-is-media-wellness-1440/390**
- Matches: the intro sits above a large gap (about 300px both). The frame has chamfered corners. The pill is centred about 40px above the frame bottom and is about 810px wide (Figma 900 at 1600, scaled). Tab spacing and the active underline match.
- Fixed after the first compare: the frame first measured 76.7% of the page against Figma's 78.8%, because the width resolves against the stage content box. The width is now 80.8333% of the stage, which measures 78.6% of the page.
- Differs: the body wraps to 3 lines (stand-in font). Heading colour is #29310C against Figma #000000 (deviation).
- 390: the frame is inset 16px with chamfers and the pill sits over the image. The last tab scrolls sideways (open question). The heading wraps to 3 lines.

**meetings-collection/02 (is-media) vs preview-is-media-meetings-1440/390**
- Matches: grey placeholder frame with chamfers, the pill centred about 40px above the frame bottom, a 2-line heading and a 5-line body like Figma, and proportional tab spacing.
- Differs: Figma's script slants more (font). Heading colour is as for wellness. The frame width was fixed in the same way.
- 390: "conference center" is clipped at the pill edge until scrolled, with no scroll cue (open question). The frame is centred in the 100svh stage, which leaves gaps above and below at the start state.
