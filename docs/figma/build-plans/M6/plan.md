# M6 Collection selectors and listings (mobile)

Workstream M6 of `docs/plans/2026-11-03-001-feat-mobile-figma-parity-plan.md`. Figma values come from `figma/mobile/nodes.json.gz` (press 693:11864, dining selector open 685:11254, meetings 695:11573, gallery 27:7100, intro 27:4064, cards 969:2121, dining details 27:6061). Desktop (992px and up) and tablet are untouched: every Designer change below is on the 767px (small) or 479px (tiny) breakpoint.

## Code (bundle, no Designer change)

`src/utils/tabDropdown.ts` collapses `.tab-pills-intro_tabs` (not `is-media`) and `.venue-card-fullbleed_tabs` below 768px into the Figma selector: a 220x40 burgundy pill (12px chamfer) with the active label underlined and a menu icon; tapping it opens every tab upward from the pill with a close X (40px rows, inactive 0.62). Tab clicks, Escape and a click outside close it. Pages: press, happenings, blog, neighborhood, gallery, arts, dining, meetings, home dining. Wellness (`is-media`) keeps its pill row. At 1440px the bar boxes measure identical with and without the new bundle.

Ships as a changeset. Not tagged on this branch: M2 already tagged v1.1.18 from its own branch, so a tag here would serve a bundle without the booking menu (and the reverse). Cut one release after the M branches merge into `claude/client-feedback-implementation-c8b545`, then Stephen bumps the Webflow footer URL.

## Designer style changes (approved by Stephen 2026-11-03, applied and published)

### article-card-staggered (press, happenings, blog)
| Style | Breakpoint | Change |
|---|---|---|
| `article-card-staggered_component` | small | max-width 19.0625rem (305px); padding-top and padding-bottom 2rem |
| `article-card-staggered_component.is-right` and the is-right variant (`c725504c-7f06-39a0-276e-18f876c7c43f`) | small | margin-left auto (right card ends on the 20px gutter) |
| `article-card-staggered_header.is-right` | small | padding-left 2.8125rem (label lines up with the right card) |
| `article-card-staggered_header.is-group` | small | padding-bottom 0 |
| `article-card-staggered_list` | tiny | row-gap 2rem (card gap 96px with the component padding) |
| `article-card-staggered_figure` | small | aspect-ratio 305 / 200 |
| `article-card-staggered_item` | small | row-gap 1rem |
| `article-card-staggered_content` | small | row-gap 1rem |
| `article-card-staggered_text` | small | max-width 15.25rem (244px) |

`is-tall` combos (neighborhood) keep their own values.

### gallery-all (gallery, arts)
| Style | Breakpoint | Change |
|---|---|---|
| `gallery-all_grid` | tiny | gap 1.25rem; padding-left and padding-right 0 |
| `gallery-all_item`, `gallery-all_item.is-narrow` | tiny | width calc(50% - 0.625rem) |

### text-columns-info (dining venue pages)
| Style | Breakpoint | Change |
|---|---|---|
| `text-columns-info_text`, `text-columns-info_aside` | small | font-size 1rem, line-height 1.25 (16/20) |
| `text-columns-info_link` | small | font-size 0.875rem, line-height 1.125rem, letter-spacing -0.05em |
| `text-columns-info_footer` | small | flex-direction column, align-items flex-start, row-gap 1.625rem |
| `text-columns-info_list` | small | row-gap 4.5rem |

### tab-pills-intro
| Style | Breakpoint | Change |
|---|---|---|
| `tab-pills-intro_component` | tiny | padding-top 7.5rem (Figma 120px) |

### Dinings Template element
Add a second link in `text-columns-info_footer` after "browse the menu": class `text-columns-info_link`, href bound to `venue-site-link`, shown only when that field is set, text "discover " plus the bound item name. Applied as link block `eeea8d64-cd44-b37b-cbe1-36d7c4f43bd8` (href bound to `venue-site-link`) with spans `55d58d59-...` ("discover ") and `ace5e8eb-31d5-3a08-081e-747b03cb5dbc` (bound to Name). The MCP cannot set an "is set" visibility condition, so the link is hidden (static visibility off). When the Zuma URL arrives: enter it on the Zuma item, then in the Designer set the link's visibility to the condition "Venue site link is set".

## Not done here (other owners or decisions)

- Intro script heading is 32px live vs 54px in Figma, and card group labels (24px) and titles (14px) use the global `heading-style-h4` and `text-style-eyebrow-caps`. These are global type (M1) and shared with wellness.
- Figma gallery and arts grids are bleeding horizontal rows, not the 2-up grid; only the gutter is matched.
- Neighborhood pill sits after Little Italy in the page; Figma puts it after the intro (page order).
- Dining hero selector pill (hero family, M5).
- Pinned bars rest 32px above the viewport bottom (`stickyTabs`); Figma uses 20px.
