# SEO launch pack (launch Tue 1 Dec 2026)

Drafts for Stephen to check, then Omar. Nothing here has been applied in Webflow or on the old site.

| File | What it is |
|---|---|
| [2026-11-26-redirects.csv](2026-11-26-redirects.csv) | 301 redirects, old site to new site, in Webflow's import format (`source,target`) |
| [2026-11-26-meta.md](2026-11-26-meta.md) and [2026-11-26-meta.csv](2026-11-26-meta.csv) | Meta titles and descriptions for every published page and CMS template |
| [2026-11-26-schema.md](2026-11-26-schema.md) | JSON-LD snippets and where each goes in Webflow |

## Redirects: how the map was built

- **Old site:** `theguildhotel.com` (WordPress with Yoast). URLs from its sitemap index (page, room and room-type sitemaps, 45 URLs) plus 7 old room URLs that the agency's Search Console sheet says Google still shows. 52 old URLs in all. `robots.txt` blocks nothing.
- **New site:** pages and CMS items read (read-only) from the Webflow staging site. Staging has no sitemap (Webflow turns it off on `webflow.io`). Every redirect target was checked and returns 200 on staging.
- **No rule needed for 6 URLs** whose path is unchanged: `/`, `/contact/`, `/rooms/`, `/privacy-policy/`, `/rooms/two-bedroom-loft-suite/`, `/rooms/guild-double/`. Webflow already sends `/path/` to `/path` with a 301 (checked on staging), and it refuses a redirect from a path that is a live page.
- **46 redirect rules.** Sources are written without the trailing slash. After launch, test both forms of a few (for example `/zuma` and `/zuma/`) to confirm one hop.
- Room slugs that changed: `guild-loft-suite-6` to `guild-loft-suite`, `guild-corner-loft-suite-6` to `guild-corner-loft-suite`, `guild-double-7` to `guild-double`. Old room-type category pages go to the matching room, or to `/rooms` where the category had several rooms.
- `www.theguildhotel.com` and `?PageSpeed=noscript` copies are handled by the domain setting and the canonical tag, not by rules.

### Weak or no match (8 rules, flagged)

These have no equivalent page on the new site. Each has a fallback so nothing returns 404, but they need Omar's decision:

| Old URL | Fallback target | Why |
|---|---|---|
| `/accessible/` and its 4 rooms (`society-king-ada`, `artisan-king-ada`, `apprentice-king-ada`, `apprentice-queen-ada`) | `/rooms` | The new Rooms collection has no accessible rooms. The agency wrote meta for all four. |
| `/pet-policy/` | `/contact` | No pet page or pet FAQ on the new site. |
| `/the-guild-boutique/` | `/` | No shop page on the new site. |
| `/barbershop-at-the-guild/` | `/wellness` | No barbershop page; wellness is the nearest topic. |

### Probable matches worth a glance

- `/eat-drink/the-guild-bar/` to the **Lobby Bar** (assumes The Guild Bar is now the Lobby Bar).
- `/the-pool/` to the **Pool Lounge** dining page (the only pool page on the new site).
- `/faq/` to `/contact` (the contact page has the FAQ block).
- `/in-room-spa/` and `/discover/fitness/` to `/wellness`.
- `/discover/` goes to `/history`, because the old site already sends it to Our History.

## Counts

- Old URLs: 52 (45 from the sitemap, 7 from Search Console). Mapped to a matching page: 44 (6 unchanged, 38 by rule). Weak or no match: 8 (fallback rule in the CSV).
- Meta: 35 pages on the new site. From the agency sheet: 11 (rooms listing and 10 rooms), plus 4 ADA rooms with no page yet. Already on staging and kept: 16. Drafted here: 8 (5 dining venues, Legal, Corporate, 404).
- Schema: none exists on the new site or in the repo code. Drafted: site-wide Organization, WebSite and Hotel; BreadcrumbList for 16 static pages; HotelRoom, FoodEstablishment and BlogPosting for the CMS templates; an optional Event block.

## Open questions for Omar

1. **Accessible rooms.** The old site has four ADA rooms (and the agency wrote their meta), but the new Rooms collection has none. Add them before launch, or accept they redirect to `/rooms`?
2. **Pet policy, Boutique and Barbershop.** These old pages have no new home. Are the shop and barbershop still running, and where should pet policy information live?
3. **Per-room meta fields.** The agency wants each room's title and description set individually. Can we add two SEO fields to the Rooms collection (and, if wanted, Dinings) and bind them in the template? Without them, every room launches with the same description.
4. **Placeholder content still published.** Two placeholder rooms, all 6 Happenings & Stories items (two name "Spa Adolphus" and "Rodeo Bar"), all 4 packages, the dining item bodies and hours, the wellness copy and room descriptions are lorem ipsum or placeholders. Which will be real by 1 December, and which should be unpublished?
5. **Room facts.** Staging room sizes and guest counts disagree with the agency copy (for example Two Bedroom Loft Suite: 85 m² and 1 queen bed on staging vs 1,809 sq ft and two bedrooms). Which is right?
6. **Hotel facts for schema.** Please confirm: check-in 16:00 and check-out 11:00, 162 rooms, pets allowed, whether to name the Tribute Portfolio (Marriott) brand, and the logo and main photo to use.
7. **Social profiles.** The new footer shows Instagram, Facebook and TikTok without links. What are the URLs, and are X and LinkedIn still used?
8. **Domain.** Will the new site launch on `theguildhotel.com` (no www, as today) with www redirecting to it? The canonical URL and all schema assume that.
9. **Solana Coffee copy.** Its hero text is a copy of the Garden Terrace line. What should it say?
10. **Is The Guild Bar now the Lobby Bar,** and is the Pool Lounge the right home for the old Pool page?

## Note for Stephen

- **US or UK English.** The brief asked for UK English, so the 8 drafted metas use it (for example "fitness centre" in the schema). But the hotel is in San Diego, the existing site copy and staging meta use US spelling ("Neighborhood", "fitness center"), and the agency's room meta is US English, kept verbatim. Launching with both mixes spellings on one site. Recommend switching the drafts to US English; it is a few words.
