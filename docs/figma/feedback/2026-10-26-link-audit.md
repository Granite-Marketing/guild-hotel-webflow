# F31 link audit (2026-10-26)

Light pass over buttons and CTAs on every published static page, checked against the staging HTML (`href="#"`, empty, or dead `#book`).

## Set in this pass

| Page | Element | New target | How |
|---|---|---|---|
| Home | Hero "book your stay" (was `#book`, no element with that id exists) | `/rooms` | Hero Fullbleed Centered instance, Button Link prop |
| Room Detail | Map Feature "Discover more" (was `#`) | `/neighborhood` | Map Feature instance, Button Link prop |

Already linked and left alone: Home dining, wellness, history, rooms, neighborhood, arts and meetings CTAs.

## Open questions for the client

| Page | Section | Button text | Current href | Question for the client |
|---|---|---|---|---|
| All pages | Site Nav | book now | `#book` | Which booking engine URL should "book now" open? No element with id `book` exists on any page. |
| All pages | CTA Booking Newsletter | book now | `#` | Same booking engine URL as the nav? |
| All pages | Footer Links | amenities, services (x2), resortpass, packages, in-room dining | `#` | Do these pages exist, or should they be removed from the footer? |
| All pages | Footer Links | instagram, facebook, tiktok | `#` | Social profile URLs? |
| All pages | Footer Links | Studio circa (credit) | `#` | URL for the studio credit? |
| Home | media-tabs (meetings and events), panels 2 and 3 | discover more | `#` | Panels 2 and 3 repeat panel 1's copy ("meetings & events") and link to `#`. What are the real titles, copy and links for courtyard and conference center? |
| Home | Offers Slider Split (retail) | discover more | `#` | Where does "shops at the guild" go? Is there a retail page? |
| Home and other pages | Offers Slider Split (offers & packages) | discover more (x5 per slider) | `#` | Do offers and packages have their own pages, or one packages page? Placeholder offer slides need real offers. |
| Home, Room Detail, Neighborhood | Map Feature place links 1 to 4 (hidden while "Show List" is off) | place links | `#` | URLs for the courthouse and landmark places, if the list is shown. |
| Dining | Venue card, Solana Coffee panel | discover more | `#` | Solana Coffee has no CMS dining page. Create one or link elsewhere? |
| Wellness | Venue card panels (in-room wellness, fitness center, mindful dining, wellness events) | discover more (x4) | `#` | Do these have detail pages, or should the buttons open a panel or be removed? |
| Meetings | Venue card, council boardroom panel | discover more | `#` | Should this open the council boardroom panel or link to a page? |
| Meetings, Neighborhood | Map Feature | Directions (x4 each) | `#` (set by script at runtime from `data-map-directions`) | Confirm each location's Google Maps URL or address. |
| Neighborhood | Overlay panel | learn more | `#` | Target for each place? |
| Rooms | Room grid cards (x4) | card links | `#` | Rooms are not in the CMS yet. Should each card link to a room page, and if so which template? |
| Arts | Gallery items (x10), card carousel | gallery item links | `#` | Should gallery items open a lightbox, an artist page, or stay unlinked? |
| Happenings | Article card | first card | `#` | Placeholder card. Real article link once content is in the CMS. |
| Contact | Social links | instagram, facebook | `#` | Social profile URLs (same as the footer). |
