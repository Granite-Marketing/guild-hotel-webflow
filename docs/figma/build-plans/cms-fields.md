# CMS field name map (C01)

Proposal names (`s<section>-<role>`) mapped to the live readable fields. All text fields are PlainText. Items are drafts.

## `cms-dining` (items: dining-zuma, dining-gardenterrace, dining-lobbybar, dining-poollounge)

| Proposal field | Live field (slug) | Binds to |
|---|---|---|
| s01-h2-caps | Hero heading (`hero-heading`) | Section 01 H2 (venue name) |
| s01-text-22 | Hero intro (`hero-intro`) | Section 01 intro paragraph |
| s02-image | Intro image (`intro-image`, Image) | Section 02 image; set on Zuma only (asset 6ad66ff45794075272b9663f) |
| s10-h2-caps | Other dining heading (`other-dining-heading`) | Last section H2 |
| s10-text-20 | Other dining intro (`other-dining-intro`) | Last section paragraph |
| s10-eyebrow-caps-6 | Other dining label 1 (`other-dining-label-1`) | First card eyebrow |
| s10-eyebrow-caps-7 | Other dining label 2 (`other-dining-label-2`) | Second card eyebrow |
| s10-eyebrow-caps-8 | Other dining label 3 (`other-dining-label-3`) | Third card eyebrow |

Note: the three label values are identical on all four items ("pool lounge", "lobby terrace", "the lobby bar"), so each venue's page lists itself. Revisit when the real cards are bound.

## `🏷️ Post Categories` (items: Happenings, Blog)

| Live field (slug) | Binds to |
|---|---|
| Hero heading (`hero-heading`) | Section 01 H2 ("happenings" / "blog") on the category template page, which is the listing page |

## `📰 Happenings & Stories` (C02; items: 3 Happenings and 3 Blog sample posts, all draft)

Listing pages are not CMS items. This collection holds the real posts; one template serves both categories.

| Live field (slug) | Group | Binds to |
|---|---|---|
| Name (`name`) | | Detail hero H1 and listing card title |
| Category (`category`, Reference to Post Categories) | Post details | Listing filter: posts whose Category equals the current category |
| Topic (`topic`, Option: dining, culture, conferences) | Post details | Listing card tag |
| Date (`date`, DateTime) | Post details | Sort order and optional date label |
| Hero image (`hero-image`, Image) | Hero and card | Detail hero and card image. Empty on samples: Figma holds no post-specific images |
| Excerpt (`excerpt`) | Hero and card | Detail hero intro and card text |
| Body (`body`, RichText) | Content | Detail section 02 body |
| Body highlight (`body-highlight`) | Content | Detail section 04 statement paragraph |

Section 02 heading ("The Guild, a Tribute Portfolio Hotel"), its "learn more" button and the "more around town" cards are identical or collection-derived, so they stay static or use a collection list in the template (Q030).

## `cms-legal-corporate`

No custom fields; items hold name and slug only. Copy on these pages is identical across the group and stays static in the template.
