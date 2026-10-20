# Q005 preview vs Figma reference

Method: preview shots at 1440x900; the Figma crops are 1600 design width, so compare in design px (values below are converted to 1600 design px, preview values are 1440 px; horizontal margins and sizes compare directly, centred items compare by proportion). Brand fonts are Webflow-only, so glyph shapes, widths and tracking differ by design.

## base-open vs nav-elements/02-menu-1
Matches
- Toggle: 37px wide, 40px from left edge. Book now: 40px from right edge.
- Logo: 430px wide, horizontally centred (586 to 1016 in the 1600 design, 505 to 935 in the preview).
- Menu list: 9 links centred, row pitch about 62px in both (ref 62.1, preview 61.9). First link y 207 (ref) vs 211 (preview), last 704 vs 706.
- Menu footer baseline y about 864 (ref) vs 861 (preview); left text starts about 64 to 66px in both.
- Background image crop, dark overlay strength and cream text colour look equivalent.
- Day active (full opacity) and night dimmed (0.5): same.

Differences
1. Nav bar vertical position: reference nav content is centred at y about 54 (logo, toggle, modes, book all share it); preview centres at y 40. Logo is 28px tall, so reference top padding is about 40px, not 26px (1.625rem).
2. Menu footer is not centred: in the reference the phone number sits at exact centre (x 800 of 1600). In the preview `justify-content: space-between` puts it at 756 of 1440 (36px right of centre) because address and email have different widths. Right inset in the reference is about 56px vs 64px left.
3. Mode spacing: reference toggle-to-day gap about 32px (preview 38) and day-to-night icon distance 76px (preview 82). Partly the wider stand-in font.
4. Link tracking: the reference link text is wider and more letter-spaced; plan has `letter-spacing: 0`. Unverifiable until the brand font loads, then recheck.
5. Link size: reference cap height about 22px; stand-in looks about 20px. Font dependent, recheck on brand font.

## base-closed vs home/01 (top 90px)
Matches
- Toggle, modes, logo and book positions horizontally (40px margins, logo centred, 430px).
- Cream text on grey: same low contrast, night dimmed.
Differences
- Same vertical offset: reference centre y about 53 (crop scale 0.75), preview 40.
- "Book now" looks fainter in the home crop than DAY; the preview renders it at full cream. May be crop softness; open crop shows it at full strength. Not changed.
- Day icon in the home crop is about 13px vs the 16px plan value; open crop shows about 16px. Keep 16.

## dark-closed (no reference crop)
- Logo, toggle and labels flip to #262118, night stays dimmed. Works through currentColor. OK.

## 390 shots (no overflow)
- Closed and dark: bar fits, logo 192px, book at right edge 20px inset, modes hidden (tablet rule). No overlap, no horizontal scroll.
- Open: list and footer fit. Footer stacks centred. Nothing clipped. The header bar sits over the menu (z-index 2) as intended.
- Note: at 390 the logo (192px) plus toggle and book leave about 26px gaps; fine.

## Proposed plan.json changes (not applied)
1. `site-nav_bar`: desktop `padding-top` 1.625rem -> 2.5rem and `padding-bottom` 1.625rem -> 1.5rem if the bar height should stay about 70px (reference centre y 54 needs top padding about 40px with the 28px logo). Confirm bar bottom with the Figma node (236:8312) height; tablet/mobile paddings likely need the same review.
2. `site-nav_start`: `column-gap` 2.375rem -> 2rem.
3. `site-nav_menu-footer`: centre the phone. Use `display: grid; grid-template-columns: 1fr auto 1fr;` with the third child `justify-self: end` (Webflow: grid on the footer, or give first and last child `flex: 1` and align last `text-align: right`). Set `padding-right: 3.5rem` if the 56px right inset is confirmed. Keep the mobileLandscape column override (`display: flex`).
