# Q042 staging check: /static-template

Screenshots: staging-1600.png, staging-1440.png, staging-390.png (this folder). Method: Playwright chromium, full page, lazy content scrolled in.

## Pass
- Body order: site nav header, section_static-template-privacy-policy, section_cta-booking-newsletter, section_footer-links (then scripts and Webflow badge).
- Body background rgb(244,239,223) = #F4EFDF. Text colour on h1, h2s, paragraph, ul = rgb(41,49,12) = #29310C.
- h1 40px Sackers Gothic, h2 20px Sackers Gothic, body 20px Gatchtest, line-height 26px, paragraph width 744px: all match.
- ul is list-style disc, padding-left 28px, bullets visible and legible.
- 1440 layout identical to 1600 (content column re-centres, widths unchanged); no horizontal scroll.
- 390: single column, scrollWidth 390 (no horizontal scroll), h1 30px, h2 18px, text 18px/23.4px, nav 52.8px tall.
- CTA and footer visually match crops 02 and 03 in structure and content: two-column Book your escape / Stay in the loop with Bonvoy lockup, five footer columns, Tribute Portfolio mark, copyright and credit line.
- Nav visually matches crop (menu icon, Day/Night, wordmark centre, Book now right); nav colour rgb(38,33,24), background transparent, height 92px at 1600.

## Measurements (1600 wide, CSS px, y from page top)
- h1: x32 y384, 40px, Sackers Gothic, ls -2px, colour #29310C
- h2 #1: x695.7 y420 w744, 20px, ls normal, text-transform lowercase, lh 24px
- h2 #2: x695.7 y1246, same styles
- first .static-template-privacy-policy_text: x695.7 y484 w744 h260, 20px/26px
- ul: x695.7 y1388 w744 h304, disc, padding-left 28px
- nav [data-wf--site-nav--variant]: h92, colour rgb(38,33,24), bg transparent
- section height 1804, page height 3483 (1600), 3404 (390)
- Console errors: 4 at 1600 (Webflow "%c%d NaN" log noise x2, CSP block on connect-src 'data:,' x2, Cloudflare challenge CSP origin list); 2 at 390. None from site code; look like Webflow/Cloudflare tooling.

## Mismatches (Figma vs staging)
- h1 x: Figma 40, staging 32 (8px left). Matches 2rem padding-global; Figma 1600 frame used 40.
- Text column x: Figma 687, staging 695.7 (+8.7px right). Column is centred/grid derived, so shifts with the h1 gap.
- h1 y: Figma 388, staging 384 (-4px).
- h2 #1 y: Figma 424, staging 420 (-4px). Paragraph 1 y: Figma 488, staging 484 (-4px). Consistent 4px upward offset above the fold.
- h2 #2 y: Figma 1237, staging 1246 (+9px). Gap between blocks is roughly 13px larger on staging than Figma (offset flips from -4 to +9).
- Bullets: Figma shows small bullet dots with ~34px text indent (text x ~716); staging uses larger default disc glyphs with 28px indent. Cosmetic, about 6px indent and visibly larger discs.
- Section/page height: Figma section crop ends about 1761px, staging section is 1804px (+43px, extra bottom padding or trailing blank list/paragraph space).
- Webflow badge overlaps text edge at right (ignored per brief).
