# Home feedback round 2 (mobile, 390px)

All fixes are below 768px only (small and tiny). No line-break tags; widths only. Side-by-sides (Figma left, staging right): `img/fb2-pair-*.jpg`; desktop checks: `img/fb2-*-1440.jpg`.

| # | Feedback | Fix | Result |
|---|---|---|---|
| 1 | Hero CTA "book"; paragraph breaks | Home instance Button Text = "book". New hero variant "Home" (`1eb6c0d5-60d0-db3a-5e94-41f3cf7f9625`) sets `hero-fullbleed-centered_text` max-width 21.75rem (348px), centred | Figma breaks (storied / playground for / elegant and / resort and / city.) at 390; the 348px cap keeps them on wider phones (393 to 430) where a 350+ box rewrapped |
| 2 | Venue card copy too narrow; titles wrap | Cause: SplitText splits the card copy at init, while the scroll-enlarge media is still its small start size, so lines were fixed at that narrow width. `venue-card-fullbleed_content.is-media-center` now spans the viewport (`left/right: calc(50% - 50vw)`), header and text 100% wide to 310px | Garden Terrace and Solana Coffee one line; Zuma 2 lines; Lobby Bar 1 line (Figma) |
| 3 | Rooms paragraph narrower | `.venue-card-fullbleed_text.text-size-regular` (home only) max-width 15.3125rem, centred | "Generous layouts, thoughtful details, / and room to make yourself at home." |
| 4 | Offers paragraph narrower | Offers variant "Home Press" text max-width 11.6875rem; retail variant "Blue" 15rem; centred | "A comfortable king room for / an effortless city getaway."; retail: "Local makers, gifts and essentials, / steps from the lobby." (live retail copy differs from Figma's Fashionphile copy) |
| 5 | Slider buttons missing | Show slide 2 to 5 on both home instances (done by the planning session) and on /rooms (`d76e0040-…`); every other offers instance already had 5 slides | Swiper initialises, arrows and "01 / 05" show, next arrow moves to "02 / 05" at 390 and 1440 |

Placeholder copy now visible: slides 2 to 5 on home retail, home offers and /rooms (headings "wellness staycation" and "save on 5+ nights", Lorem-style text "Nullam scelerisque…"). Needs real copy.
