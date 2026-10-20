# Q032 staging notes (2026-10-20)

Agent check of `https://the-guild-hotel-c34e71.webflow.io/dining` at 1440px and 375px, from DOM and computed styles plus crop comparison. No screenshots were saved.

- Published HTML has every section in order, the variant attributes (`site-nav` base, hero `text-dark`, script intro `wide`, offers `base`), five snap tabs and links to the four Dinings items. All four item pages return 200.
- 01 hero matches (grey slot, dark text). 02, 09, 11, 12 and 13 render with their copy; section heights are close to the crops.
- 03 to 08: one 900px section; panels stack at the same position because the A01 module is not enabled yet. Tabs and the chamfered media frame match the crop.
- 10: all six FAQ answers render open (known Q015 follow-up).
- 375px: no page-level horizontal overflow; three venue tabs extend past the viewport inside the tabs row.
- No console errors at either width; no broken images at 1440px. At 375px five lazy images were still loading after one scroll pass.
