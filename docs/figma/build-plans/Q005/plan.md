# Q005 Site Nav: navbar and full-screen menu

One shared Webflow component, **Site Nav** (`fc94d1a2-3399-4de0-e836-0233a6c86cdf`, group Global), for every page. Built through the Data API on `🧱 site-nav` (`/build-site-nav`). Machine-readable plan: [plan.json](plan.json). Preview: [preview.html](preview.html), regenerated with `node docs/figma/build-plans/Q005/generate-preview.mjs --shoot`.

Figma sources: the nav component set `236:8312` (guild-nav-full-dark) and the open-menu frame `nav-elements/02-menu-1`. The set has four states. Main-Light is used on 21 of 23 pages and Default (dark text) on static-template and contact. Shield-Dark and Shield-Light are used on no page, so they are not built.

## Tree

- `header` .site-nav_component `[data-nav=header][data-nav-lock=always]` (absolute over the first section)
  - `div` .site-nav_bar
    - `div` .site-nav_start
      - `a` .site-nav_toggle `[data-nav=open]` href `#` > HtmlEmbed .site-nav_icon (hamburger SVG)
      - `div` .site-nav_modes `role=group` (hidden below 992px)
        - `div` .site-nav_mode .is-active `role=button` `[data-nav-mode=day]` > .site-nav_mode-icon (sun SVG) + `span` day
        - `div` .site-nav_mode `role=button` `[data-nav-mode=night]` > .site-nav_mode-icon (moon SVG) + `span` night
    - `a` .site-nav_logo (page link to Home) > HtmlEmbed .site-nav_icon (wordmark SVG)
    - `div` .site-nav_end > `a` .site-nav_book "book now" (prop Book link)
  - `div` .site-nav_menu `[data-nav=menu]` (fixed, full screen, hidden until open)
    - `figure` .site-nav_menu-figure > `img` .site-nav_menu-image (asset `6ad6700aba96f2e53726c671`)
    - `div` .site-nav_menu-overlay (50% black)
    - `nav` .site-nav_menu-nav `aria-label=Main` > `div` .site-nav_menu-list `[data-nav=list]` > 9 x `a` .site-nav_menu-link `[data-nav=link]` (page links)
    - `footer` .site-nav_menu-footer > `p` address, `a` phone, `a` .is-end email (all .site-nav_menu-detail)
  - HtmlEmbed .site-nav_embed: `<style>` for the open state

All SVGs are inline with `fill="currentColor"`, so the Dark variant recolours the logo and icons through one `color` change on the root.

## Variants and states

| Name | Kind | What changes |
|---|---|---|
| base (light) | component base | Cream text (`color-neutral-100`) over hero imagery. |
| Dark | Webflow component variant | `color` on `site-nav_component` set to `color-neutral-900`. For static-template and contact. |
| open | runtime class `is-nav-open` on the header | The embed shows the menu (opacity, visibility, pointer events) and forces cream text, so a Dark instance stays readable over the menu image. |
| `.site-nav_mode.is-active` | combo | Active mode at full opacity; inactive is 0.5. |

## Runtime

`navToggle` (`src/utils/navToggle.ts`) is now enabled in `src/index.ts` (slot D). Two changes, both covered by `tests/visual/nav-toggle.spec.ts` (5 cases):

- `data-nav-lock="always"` on the header pauses smooth scroll at every width, since this menu is full screen on desktop too.
- A link toggle (`href="#"`) no longer jumps the page, and Enter on it toggles once (Enter already fires click on a link).

The site has no custom code yet, so the published bundle does not run on staging. The build page carries page-only head and footer code (stand-in backgrounds plus a minified navToggle build) for the staging check.

## Compare notes

Preview against the crops: [compare-notes.md](compare-notes.md). Three fixes from that pass are applied (bar padding 2.5rem top and 1.5rem bottom, toggle gap 2rem, footer as a 1fr auto 1fr grid so the phone number is centred). Staging check: [staging-notes.md](staging-notes.md).

## Open questions

See `openQuestions` in plan.json: day and night behaviour, the booking URL, the experiences link target, and the unused Shield states.
