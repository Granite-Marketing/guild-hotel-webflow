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

## `cms-happenings-blog-collection` (items: happenings-collection, blog-collection)

| Proposal field | Live field (slug) | Binds to |
|---|---|---|
| s01-h2-caps | Hero heading (`hero-heading`) | Section 01 H2 ("happenings" / "blog") |

## `cms-legal-corporate` and `cms-happenings-blog-indiv`

No custom fields; items hold name and slug only. Copy on these pages is identical across the group and stays static in the template.
