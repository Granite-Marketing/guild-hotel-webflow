# M3 plan: newsletter CTA and footer, mobile parity

Source: Figma `Footer · complete mobile` (557:16242) in the home mobile frame, `figma/mobile/nodes.json.gz`. Layout only; the footer link list is unchanged (waiting on the client).

All changes are at the 767px (`small`) or 479px (`tiny`) breakpoint, so desktop at 1440px does not change. No element, class or content changes. The newsletter email label is already visually hidden (the "*Email" text is the input placeholder), so stacking the form is a style change only.

Hairline colour is Figma's `#f4efdf` at 32% opacity: `rgba(244, 239, 223, 0.32)`.

| # | Style | Breakpoint | Property | Old | New | Figma reason |
|---|---|---|---|---|---|---|
| 1 | `cta-booking-newsletter_divider` | 767 | display | block (6rem x 1px) | none | no short divider |
| 2 | `cta-booking-newsletter_columns` | 767 | row gap | 3rem | 6rem | 96px between Book and Stay blocks |
| 3 | `cta-booking-newsletter_column` | 767 | row gap | 2.5rem | 1.5rem | 24px heading to button |
| 4 | `cta-booking-newsletter_actions` | 767 | flex direction | row | column | Book Now and form go full width |
| 5 | `cta-booking-newsletter_form` | 767 | flex direction | row | column | email above Join Us |
| 5 | `cta-booking-newsletter_form` | 767 | align items | flex-end | stretch | Join Us full width (350px) |
| 5 | `cta-booking-newsletter_form` | 767 | row gap | none | 1.5rem | 24px email to Join Us |
| 6 | `cta-booking-newsletter_component` | 767 | row gap | 3rem | 7.5rem | 120px Join Us to Bonvoy |
| 6 | `cta-booking-newsletter_component` | 767 | padding top | 1rem | 2.5rem | 80px section top |
| 6 | `cta-booking-newsletter_component` | 767 | padding bottom | 1rem | 1rem (unchanged) | with section padding gives 56px Bonvoy to hairline |
| 7 | `cta-booking-newsletter_brand` | 767 | row gap | 1.625rem | 1.25rem | 20px logo to text |
| 8 | `cta-booking-newsletter_logo-wrapper` | 479 | width | 8.5rem | 10rem | 160px Bonvoy mark |
| 9 | `footer-links_component` | 767 | padding top | 5rem | 3.5rem | 56px hairline to links |
| 9 | `footer-links_component` | 767 | border top | none | 1px solid hairline | hairline above link grid |
| 9 | `footer-links_component` | 479 | padding top | 4rem | 3.5rem | as above |
| 9 | `footer-links_component` | 479 | padding bottom | 2rem | 2.5rem | 40px bottom |
| 10 | `footer-links_columns` | 767 | column gap | 1.5rem | 2.5rem | 40px between columns (155px each) |
| 11 | `footer-links_column` | 767 | row gap | 1.25rem | 1rem | 16px heading to list |
| 12 | `footer-links_list` | 767 | row gap | 0.75rem | 0.5rem | 8px between 36px links |
| 13 | `footer-links_link` | 767 | font size | 0.875rem (from utility) | 0.8125rem | 13px |
| 13 | `footer-links_link` | 767 | line height | 1 (from utility) | 1.2 | 15.6px |
| 13 | `footer-links_link` | 767 | padding top and bottom | 0 | 0.625rem | 36px touch target, 44px pitch |
| 14 | `footer-links_bottom` | 767 | justify items | start | center | centred brand block |
| 14 | `footer-links_bottom` | 767 | text align | inherit | center | centred copyright and credit |
| 14 | `footer-links_bottom` | 767 | border top | none | 1px solid hairline | hairline above Tribute Portfolio |
| 14 | `footer-links_bottom` | 767 | padding top | 0 | 3.5rem | 56px hairline to logo |
| 15 | `footer-links_logo` | 767 | justify self | start | center | centred mark |
| 15 | `footer-links_logo` | 767 | width | 9.5rem | 16.875rem | 270px mark |
| 15 | `footer-links_logo` | 767 | margin bottom | 0 | 1rem | 40px logo to copyright |
| 16 | `footer-links_legal` | 767 | justify self | start | center | centred copyright |
| 17 | `footer-links_credit` | 767 | text align | left | center | centred credit |
| 17 | `footer-links_credit` | 767 | justify self | start | center | centred credit |

`footer-links_list.is-after-cms` keeps its -0.5rem top margin at 767: with the new 1rem column gap it still lands on the 0.5rem list gap, so the CMS dining items and In-Room Dining read as one list.

Left alone (other workstreams or shared utilities): script heading sizes (M1), button label size (shared `button`), column heading and caption type (shared `text-style-*`), the background seam between the CTA and footer images, and the footer link list content.

## Result (2026-11-03)

Applied as listed and published to staging. Captured home, history and contact at 390px (system Chrome): Book Now and Join Us are full width, email sits above Join Us, the short divider is gone, hairlines sit above the link grid and the Tribute Portfolio mark, links are 13px on a 44px pitch, and the brand block is centred. Remaining differences are the footer link list content (Blog, Happenings, dining names), which waits on the client, and the seam between the CTA and footer background images. Only 767px and 479px styles changed, so 1440px is untouched.
