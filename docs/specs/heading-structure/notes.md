# Heading structure: Stephen's words and decisions (26 Nov 2026)

Source: "The Guild Hotel: Heading Structure Recommendations (New Website)", the SEO team's sheet, one tab per page, exported verbatim on 26 Nov into `source/` (681 rows across 19 tabs). Staging map: `docs/specs/guild-content/catalogue/`.

## Stephen's request

> "This is actually a fantastic document because it gives us the section, the current tag, the proposed tag, and why."

> "One thing we need to absolutely do is make sure that we check every single element to make sure that there aren't any contradictions or conflicts in the block. Maybe it's the same component, but on one page it's an H2, and on another page it's an H3. We just need to make sure that we catalogue all the different elements and components so that we don't accidentally fix something in one place and break something in the other."

## Decisions

- **H1. Verbatim.** Stephen: "We should replicate what the SEO team has done verbatim." Every row's proposed tag is applied as written, including rows where one shared element needs different tags on different items or pages.
- **H2. Same element, different tags.** Stephen: "If we do need to use the same element with different tags, how can we do that inside of the CMS, as an example, or inside of a component? What do we set to be able to control that, because we're going to have to do that?" The build proves one pattern on staging first and writes it down, then uses it everywhere it is needed (heading-structure ticket "per-item tag pattern").
- **H3. Text is not changed here.** "Keep, update text" rows change no wording: the content docs win (copy spec decision C2). Their suggested wording goes to Kevin in the report.
- **H4. Order.** Runs after the copy spec's live upload.

## What the map found (26 Nov)

- 681 rows, 636 matched to a live element; the rest are rich text (privacy, accessibility) or text the sheet paraphrases.
- The rows come down to about 107 distinct elements, because shared parts repeat: footer, booking and newsletter band, offers slider, FAQ, card carousel, hero (23, 23, 17, 19, 12 and 20 pages).
- Shared elements that need different tags in different places: offer card title (one card H3, the rest p, homepage), neighbourhood corporate services cards (two H3, their slider copies p), meetings tab panel item headings (H3 and p), the two "other dining options" blocks on venue pages (H2 and p), card carousel category labels (p on Press, H2 kept on Blog, Happenings and Packages).
- Runtime scripts that find elements by heading tag: modals (dialog title for screen readers), room grid hover reveal and rooms quiz (h2 or h3). A heading turned into a p would silently break them.
- Webflow's site-wide tag styles (All H2, All Paragraphs) can change spacing or size when a tag changes under the same class, so "same class, same look" must be checked, not assumed.
- Pages with no tab in the sheet still get every shared-part change (404, accessibility, each package, post, legal and corporate item).
