# Q037 Guidelines page build (2026-10-20)

Page `/guidelines` (`6ad66fd44c7f57894534ada5`), Body `6ad66fd44c7f57894534adac`. Built through the Data API, top to bottom with `append` on the Body.

| # | Section | Built as | Element id | Variant and props |
|---|---|---|---|---|
| 0 | Site nav | Site Nav instance | `79234008-43d1-5007-51c8-956421b99572` | Variant `base` (light text over the hero); Book link default `#book` |
| 1 | guidelines/01 photoshoot guidelines | Hero Fullbleed Centered | `90928849-354b-cb74-9c7e-0d5b8393e30c` | Variant `base`; Heading "photoshoot guidelines"; Text from the snapshot; Show Image false (Figma grey slot) |
| 2 | guidelines/02 thank you | script-intro-centered | `56baa9f8-3a44-90fb-6a7a-e3382e3b3644` | Variant `base`; heading with a line break; paragraph from the snapshot |
| 3 | guidelines/03 our process | one-off `section_guidelines-process` | `ff46f334-9067-2cf3-9fdd-3086a2166155` | Dark split: header (h2 + intro) left, `ol` of six numbered terms right; item 6 links `mailto:sales@theguildhotel.com` and `#photoshoot-request` |
| 4 | guidelines/04 collaborators | timeline-scatter-images | `863b7871-f19e-4de0-ae50-51b43d808d35` | No variants; defaults match (heading "work from our collaborators", captions "@username") |
| 5 | guidelines/05 @username | one-off `section_guidelines-feature` | `762a9193-f7ec-e0a6-89e7-c9c08044db10` | Empty `figure` with #d9d9d9 fill and `data-image-placeholder`, `figcaption` "@username" |
| - | form anchor | plain `div#photoshoot-request` | `6d5b2d98-e0be-66ba-fe7c-8a8a185a2852` | Target of the "form" link in item 6 |
| 6 | guidelines/06 photoshoot request | form-split-script-contact | `402516c8-cd6b-d060-14aa-9d368b87e7e6` | Variant `base`; defaults are this section's content |
| 7 | guidelines/07 faqs | faq-accordion | `44153fa0-3a05-a5fd-7f47-f6ab2f0b08cf` | no props |
| 8 | guidelines/08 book your escape | CTA Booking Newsletter | `a5736ffe-cf36-d412-9636-a69eab1309ab` | no props |
| 9 | guidelines/09 the hotel | Footer Links | `c70b461e-6018-8dde-bd85-a1617696e3c6` | no props |

No Q006, Q008, Q009 or Q007 slot is on this page, and `figma/animations/` has no guidelines file, so no placeholders and no animation attributes.

## Read-back and fixes

- `BY_CUSTOM_TAG ol` came back as a List with tag `ul` and three seeded empty ListItems. Removed the three seeds and set the tag with `set_tag` `ol`.
- The builder dropped `set_link` url `#photoshoot-request` on the "form" TextLink (the email link on the same item was kept). Written afterwards with `set_settings` key `link`, `static_link` url.
- Everything else matched the plan: classes, texts, Variant overrides (`hasOverride: true`), attributes and the anchor id.
