# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | Copy map match thresholds: accept at confidence 0.45, flag for a person below 0.75 unless the text matches exactly; CMS field picks below 0.65 flagged; fixed component text never matched on position alone | Spec asks for low-confidence matches to be marked, not a number | Are 160 rows to confirm the right amount of review, or should the bar move? |
| 2 | Template pages (rooms, dining, legal and corporate item pages) count as shared text, since one edit hits every item | Shared rule covers components on more than one page; templates behave the same | Treat template text as shared, yes? |
| 3 | Room items matched by name: 9 of 14 doc rooms match; City Level Loft (possible item Guild City Level Loft) and the four ADA rooms have no item; Guild City Level Loft and two placeholders have no doc copy. All listed, none created | Spec says list, never create | Should City Level Loft map to the Guild City Level Loft item? |
| 4 | "No copy yet" leaves out site chrome (nav, footer, FAQ, offers), pop-up and form text, empty-list text and timeline years | These are not page copy the docs would cover | Fine to leave these out of the "no copy yet" list? |
| 5 | Copy check counts a row done when its new text appears on the checked page, so a short repeated line like "Discover More" can read done from another element | Live elements carry no stable id to pin each row exactly | Accept, or tighten to position-only matching for short lines? |
| 6 | Copy check compares case and whitespace only (punctuation kept), and does not require the heading tag to match, so the later heading spec cannot break it | Spec names case and whitespace only | OK? |
| 7 | Writer's notes and "or" separator lines are listed under the map's notes, not as rows | The status list has no note status | OK? |
