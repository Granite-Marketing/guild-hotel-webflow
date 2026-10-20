# Q005 staging verification (the-guild-hotel-c34e71.webflow.io/build-site-nav)

Page returned 200 first try. Screenshots: staging-{closed,dark,open}-{1440,390}.png in this folder.

## Pass
- Header colour rgb(244,239,223) on first header. Dark instance (w-variant-08083309-..., data-wf--site-nav--variant=dark) colour rgb(38,33,24), also after scroll.
- Font on .site-nav_book and .site-nav_menu-link: "Sackers Gothic", Arial, sans-serif.
- Open: header gets is-nav-open, menu visibility visible, opacity 1, URL unchanged (no #), aria-expanded true (both widths).
- Escape removes is-nav-open in about 370ms (both widths).
- Console: no errors, page errors or failed requests.

## Measurements
1440x900: bar height 92, bar content centre y 54 (toggle, logo, book), logo 429x28, toggle x 40 (37x16), book now right inset 40, link letter-spacing normal (40px type), menu link pitch 62px (links 38 high, 9 links, first y 191.4), footer centred on 720: address x 64, phone x 644 w160 (centre 724, 4px right of viewport centre), email right inset 56 (x 1113 w271), footer y 853.
390x844: bar height 52.8, centre y 26.4, logo 192x12.8, toggle x 20, book right inset 20, link size 24px, pitch 42.8, phone centre 195 (exact), address x 40, email right inset 76 (centred at 195, stacked), footer rows y 738/766/795.

## Mismatches vs Figma (1440 scale)
Closed (figma home hero 1200px wide, factor 1.2):
- Bar centre y: figma 48, staging 54 (+6).
- Logo width: figma 386, staging 429 (+43, about 11% large).
- Toggle left x: figma 36, staging 40 (+4).
- Book now right inset: figma 36, staging 40 (+4).
Open (figma 2000px render of 1600 design, factor 0.72 to 1440):
- Bar centre y: figma about 49, staging 54.
- Link pitch: figma about 55.8, staging 62 (+6.2). First link centre y: figma 186, staging 210; last (CONTACT) centre figma 634, staging 706. List runs about 72px too low and too long.
- Link type looks slightly larger in staging (40px) than design; letter-spacing is "normal" while the design is clearly tracked wide. Check against spec.json.
- Footer y centre: figma 778, staging 862 (+84); staging sits at the bottom edge (853-872 of 900), figma has about 100px bottom margin.
- Footer x: address left figma 60, staging 64; email right inset figma about 50, staging 56; phone centre 724 vs 720.
- Day/Night toggle and the Webflow badge: Day/Night present in both; badge is the staging badge only (ignore).
- Open background image and scrim match closely.

## Orchestrating session's reading of the mismatches

The figures above scale Figma positions by 0.9 (1600 to 1440 wide). The build uses fixed rem sizes, as every other component does, and the Figma frame is 900px tall like the 1440x900 viewport, so vertical positions compare 1:1:

- Menu: Figma "stay" centre y about 202 (top 183, height 38), staging 210; "contact" about 698, staging 706. Pitch is 62px in both. About 8px low, within tolerance.
- Menu footer: Figma text at y 853 to 872, staging 853 to 872. Matches.
- Bar: Figma toggle and day/night centre at y about 54, staging 54. Matches.
- Logo 429px and the 40px side insets are the Figma values at 1600 and stay fixed in rem; they do not scale with the viewport. Revisit only if Stephen wants fluid scaling between 1440 and 1600.

Remaining font-dependent item: menu link tracking looks wider in Figma than `letter-spacing: 0`; check by eye in the Designer.
