# Q037 staging check (2026-10-20)

`https://the-guild-hotel-c34e71.webflow.io/guidelines`, published by a concurrent session's site publish (mine hit the once-per-minute limit); confirmed by curl that the `ol` fix was live before checking.

- Published variant attributes: `site-nav` base, `hero-fullbleed-centered` base, `script-intro-centered` base, `form-split-script-contact` base. Section order matches the brief.
- 1600: hero 0/900 (grey, cream text, nav over it); script 900/880; process 1780/1075 (Figma dark panel 997); header at x 160 (Figma 169), list at x 792 width 648 (Figma 816 to 1463); heading Sackers 24px weight 400, items 20px / 1.3 with 30% cream rules, first item no top padding, last no rule; timeline 2855/1730; feature figure 1520 x 838 at x 40 (exact); form, FAQ, CTA, footer follow.
- 390: one column, list 326px wide, feature figure 358 x 448 (4:5), no horizontal overflow.


## Placeholder images filled (2026-10-20)

Stand-in library photos (not the final design images), set through the Data API and checked on webflow.io staging: no grey placeholder remains. Added images use `u-image`.

- Hero (`90928849-354b-cb74-9c7e-0d5b8393e30c`): Image `6ad67000240d911fb18d77af`, Show Image on.
- guidelines-feature figure: `u-image` prepended before the figcaption, asset `6ad670147e3d6550932e0fac`.
- timeline-scatter-images images come from the component definition (other session).
