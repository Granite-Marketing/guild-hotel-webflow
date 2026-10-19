# Q021 build plan: venue-card-fullbleed

Machine plan: [plan.json](plan.json). Preview: [preview.html](preview.html) (regenerate with `node docs/figma/build-plans/Q021/make-plan.mjs && node docs/figma/build-plans/Q021/build-preview.mjs`). Brief: [Q021](../../briefs/Q021-shared-venue-card-fullbleed.md).

## What this component really is

24 of the 29 "instances" are panels of one scroll animation, not sections. Figma Home-Animation-1 (home 04 to 09, dining-collection 03 to 08, and the wellness and meetings collections) is the A01 `scrollEnlargeSnap` module: a framed image grows to fill the stage, then snaps through panels. So the build is:

| Build unit | Root | Panels | Snap | Notes |
|---|---|---|---|---|
| home-venues | home/04 (`is-media-center`, intro heading) | home/05 to 09 | yes, step 80 | First build, on Home |
| dining-venues | dining-collection/03 (`is-media-center`, tabs) | dining-collection/04 to 08 | yes | Tab bar inside the frame |
| wellness-venues | wellness-collection/02 (Q023 today) | wellness-collection/03 to 06 | yes | Q021-OQ2 |
| meetings-venues | meetings-collection/02 (Q023 today) | meetings-collection/03 to 05 | yes | Q021-OQ2 |
| legal-venues, corporate-venues | none | 06 to 09 each | no | Four static base sections each, Q021-OQ3 |
| home-rooms | home/11 | 1 | no | `is-tall` |
| home-meetings | home/15 | 1 | no | `is-left` |

## Tree

One class family, `venue-card-fullbleed`. Optional elements are left out when an instance has no content for them.

- `section.section_venue-card-fullbleed` (`data-scroll-enlarge-snap` on snap groups)
  - `header.venue-card-fullbleed_intro` (optional)
    - `h2.heading-style-h4`
  - `div.venue-card-fullbleed_stage` (`data-scroll-enlarge-snap-stage`)
    - `div.venue-card-fullbleed_media` (`data-scroll-enlarge-snap-media`; chamfered frame)
      - `article.venue-card-fullbleed_item` (`data-scroll-enlarge-snap-item`; one per panel)
        - `figure.venue-card-fullbleed_figure` (optional)
          - `img.venue-card-fullbleed_image` (`data-scroll-enlarge-snap-image`, `data-eager`)
        - `div.venue-card-fullbleed_content` (`data-scroll-enlarge-snap-content`; also the 0.4 black scrim)
          - `header.venue-card-fullbleed_header` (optional)
            - `figure.venue-card-fullbleed_logo-wrapper` > `img.venue-card-fullbleed_logo` (optional wordmark)
            - `h3` or `h2` with `heading-style-display` / `heading-style-h1` / `heading-style-h2` (optional)
            - `div.venue-card-fullbleed_text` + `text-size-large` / `-medium` / `-regular` > `p` (optional)
          - `footer.venue-card-fullbleed_footer` (optional) > `a.button` (+ `is-outline`)
          - `div.venue-card-fullbleed_list` (optional) > `a.venue-card-fullbleed_list-link` > `div.heading-style-h3`
      - `nav.venue-card-fullbleed_tabs` (optional) > `a.venue-card-fullbleed_tab` + `text-size-regular` + `text-style-eyebrow-caps` (`data-scroll-enlarge-snap-tab`)

Headings are `h3` inside a snap group (the intro is the `h2`) and `h2` on a standalone card.

## Classes

- Family (17): `section_venue-card-fullbleed`, `_intro`, `_stage`, `_media`, `_item`, `_figure`, `_image`, `_content`, `_header`, `_logo-wrapper`, `_logo`, `_text`, `_footer`, `_tabs`, `_tab`, `_list`, `_list-link`.
- Proposed shared: `heading-style-display` (Sackers 80/80, no Relume level fits) and `text-style-eyebrow-caps` (combo on `text-size-regular`, same name as other wave 2 plans).
- Reused, values assumed for the preview only (`reusedClassAssumptions`): `heading-style-h1` to `h4`, `text-size-large`, `text-size-medium`, `text-size-regular`, `button`, `is-outline`. The button owner decides the real chamfered button; `button-outline.svg` is a starting point for `is-outline`.
- Variables: `color-neutral-100`, `color-neutral-300`, `color-neutral-900`, `color-accent`, `color-brand-4a1217` (D01 name pending K01), `font-style-heading`, `font-style-body`.

## Variants

Webflow cannot style children from a parent combo class, so each modifier goes on every element it changes.

| Modifier | On | Difference | Brief variant |
|---|---|---|---|
| (base) | | 1520:988 chamfered frame, 2.5rem side gap, centred content, cream button | base |
| `is-media-center` | stage, media | Stage 100svh flex centre; frame 83% of the stage content box, 1261:712. Snap start state | is-media-center; is-left + is-media-center |
| `is-tall` | stage, media, header | No gap, no chamfer, 1600:1579; header gap 2rem, max 22rem | is-2-images + is-tall |
| `is-left` | stage, media, content, header | No side or bottom gap, no chamfer, 16:9; content is a 2-column grid at the bottom, CTA right, list full width | is-left |
| `is-active` | tab, list-link | Full opacity, tab underline (set by the module) | state |

Deviations from the brief (full reasons in `plan.json` `deviations`): `is-2-images` dropped (duplicate image node); dining-collection/03 is `is-media-center` plus the optional tabs, not `is-left`; meetings-collection/03 is a base panel whose image is still a Figma placeholder, not `is-cream + is-no-image`; no `padding-global` or container because the frame must enlarge to the full stage; scrim unified at 0.4.

## Assets

14 images, all uploaded (ids in `plan.json` `assets`). Not uploaded yet: the three venue wordmark SVGs (`figma/vectors/group-270989670-416x101-250-1958.svg`, `a-738x232-433-5771.svg`, `a-682x148-433-5793.svg`) and `button-outline.svg`. Upload them before the Designer session. Image placement may need the manual Designer step (KTD10).

## Open questions

1. Q021-OQ1: build the 24 panels as items of 4 snap sections. Default yes.
2. Q021-OQ2: wellness and meetings intro and start frame live in Q023 (tab-pills-intro) but must share one snap root with these panels. Default: this component owns the whole snap section and Q023 drops wellness-collection/02 and meetings-collection/02.
3. Q021-OQ3: legal and corporate 06 to 09 have no animation note. Default: static stack of four base sections.
4. Q021-OQ4: Webflow components cannot repeat items. Default: one component for static cards; snap groups as plain sections with the same classes.
5. Q021-OQ5: home/15 venue list behaviour. Default: static links, first row `is-active`.
6. Q021-OQ6: meetings-collection/03 image and the dark square. Default: image to come, square ignored.
7. Q021-OQ7: dining tab "lobby terrace" vs panel "garden terrace". Default: garden terrace.
8. Q021-OQ8: logo panels have no text heading. Default: logo alt text only.
9. Q021-OQ9: `clip-path` may not be settable through the Designer API. Fallback: site-wide CSS for the media, tabs and button.
10. Q021-OQ10: `is-left` could be a unique section instead of a modifier. Default: keep it as a modifier, and split it out if the Designer build fights the grid.

## Compare notes

A Sonnet subagent compared each 1440 and 390 screenshot with its crop. The Figma frame is 1600 wide and the preview 1440, and the brand fonts fall back to Copperplate and Avenir Next, so text widths and weights differ by design. All six came out close; there were no mismatches. The fix applied afterwards: the start frame width went from 78.8% to 83% of the stage content box (it measured 74% of the viewport against 79% in Figma).

| Crop | Matches | Does not match | Verdict |
|---|---|---|---|
| base ([home/05](../../../../figma/pages/home/sections/05-dress-up-for-the-rich-worldly/section.webp)) | Inset chamfered frame, centred logo, body and cream CTA, scrim | Body wraps to 2 lines (fallback font is wider); content about 25px lower | close |
| media-center ([home/04](../../../../figma/pages/home/sections/04-an-unexpected-resort-dining-experience/section.webp)) | Intro heading, small centred 16:9 chamfered frame | Frame was 74% vs 79% (fixed). The heading-to-frame gap is about 1.8x larger, because the frame is centred in a 100svh stage as scrollEnlargeSnap needs. 390 has a large gap above the frame | close |
| tall ([home/11](../../../../figma/pages/home/sections/11-rooms-suites/section.webp)) | Edge-to-edge image, scrim, centred heading, text, outline CTA | Text 12 to 40% larger relative to the width (rem sizes at 1440 vs 1600). Heading breaks after "rooms &" instead of before "&". Content needs a line break in the build | close |
| left ([home/15](../../../../figma/pages/home/sections/15-meetings-events/section.webp)) | Left heading and sub, CTA right, 3 list rows, dividers, active row bright | Rows about 30% taller and list text larger relative to the width. Figma dividers run edge to edge; the preview insets them by the 2.5rem content padding | close |
| media-center-tabs ([dining-collection/03](../../../../figma/pages/dining-collection/sections/03-zuma/section.webp)) | Chamfered frame, maroon chamfered tab bar, underlined active tab | Tab bar about 25% taller and wider. Tab text looks bold (fallback font). At 390 the bar scrolls sideways (intended) | close |
| no-image ([meetings-collection/03](../../../../figma/pages/meetings-collection/sections/03-council-boardroom/section.webp)) | Chamfered card, centred heading, text and CTA | Grey is darker: the scrim sits over color-neutral-300, so text contrast is better than Figma. The dark square is absent (Q021-OQ6) | close |

For the Designer session to check against the real fonts: the list row height on `is-left` (try 1.25rem padding), the divider bleed, and whether the 2.125rem frame chamfer reads too large on the smaller start frame.
