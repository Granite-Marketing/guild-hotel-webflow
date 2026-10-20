# Q030 build record: 📰 Happenings & Stories template

Template page `6ad67d759914af41be21de84` (`/happenings-stories/<slug>`), Body `6ad67d759914af41be21de8c`, collection `6ad67d759914af41be21de7e`. Built 2026-10-20 through the Data API (no Designer). Brief: [Q030](../../briefs/Q030-cms-happenings-blog-indiv.md), re-scoped by the CMS model in `docs/figma/decisions.md`: one post detail template for both categories; happenings-indiv is the reference and blog-indiv is identical.

| # | Figma section | Built as | Element id | Values and bindings |
|---|---|---|---|---|
| top | navbar | Site Nav, base (light text over the photo hero) | `4528b5e2-f5b8-e5cd-862f-fb5babefae5f` | defaults |
| 01 | locals night at rodeo bar | Hero Fullbleed Centered, base | `ee8a5d6a-b096-60c0-e1f5-595b2e9ceac6` | Image ← `hero-image`, Heading ← `name`, Text ← `excerpt`, Eyebrow ← `topic` (Show Eyebrow on) |
| 02 | the guild, a tribute portfolio hotel | one-off `section_article-body` (left out of Q016, see P016) | `f667acd5-3df1-985c-b6ac-b209685e1ce5` | eyebrow `d0f68cf6-2cbc-b3dc-2ba8-1328ce3e2a29` text ← `date`; RichText `4b816f3a-c88d-4ef9-31bf-2c33aa413a3f` ← `body` |
| 03 | inset image | image-inset-single, Small (`ed48680f-16db-4226-7dda-8e89d4535148`) | `2eb0d65b-660c-4518-f3e3-8e277eb9a935` | image `6ad66fee735773f253407335` (library photo), alt |
| 04 | nam eleifend venenatis | Split image text light, Compact (`a6df7398-8cb4-0616-9847-2ba4833207db`) | `a7f159bf-8bc8-af43-afc3-0fe6a8e376b2` | Body ← `body-highlight`; Header visible off; Image `6ad670147e3d6550932e0fac` (library photo) |
| 05 | more around town | one-off `section_split-card-pair-captioned` with a Collection List | section `ec6687ae-bc5b-97ef-1856-fee0e452ec5a`, list `4048e357-02ea-e0d3-0a14-0d95030910f9` | source Happenings & Stories, sort `date` descending, limit 2, filter Name not equal to current Name; card image ← `hero-image`, title ← `name`; link `#` until the Designer step |
| 06 | more of the guild | Card Carousel Header Left, base | `b394ebe0-8830-b6e2-71eb-e3bf8adf2cc1` | rooms, dining, wellness with default photos; cards 4 to 6 off |
| 07 | offers & packages | Offers Slider Split, base | `b85a38f3-5cc2-7f8d-b093-b8f949adafb0` | defaults (five slides with library photos) |
| 08 | book your escape | CTA Booking Newsletter | `5c39a569-7d00-5c79-3ce3-48694f8c4b58` | no props |
| 09 | the hotel | Footer Links | `22166244-c785-d9a6-ec32-c0977b16c4f5` | no props |

## Deviations from the brief

- 03 uses the Small variant, the one Q024 made for the post layouts (the brief's `is-no-image` would leave a grey box; real photos only).
- 05 is a Collection List of real posts instead of two static cards; the category filter and per-item link are Designer steps (`docs/figma/follow-ups.md`).
- 06 and 07 are the live Q009 and Q008 components.
- 02 drops the Figma "learn more" button (no destination for a post).

## Staging check (2026-10-20, 1440 wide)

`/happenings-stories/locals-night-at-rodeo-bar`: sections in order; hero shows the post photo, topic, name and excerpt; article column 744px centred at x 348 (Figma 428 of 1600); body renders the CMS paragraphs at 20px; inset 744 x 524; more posts shows Historical tours and A guide to dining at The Guild (newest two, current excluded) at 720 x 810 with photos; carousel shows rooms, dining, wellness.

`/happenings-stories/historical-tours` at 390: no horizontal overflow; article 326px; cards stack full width with 24px titles; body paragraph gap 20.8px; the current post is excluded from more posts.
