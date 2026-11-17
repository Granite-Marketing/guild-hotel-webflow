# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | FAQ jump fix turns off browser scroll anchoring for 700ms after each FAQ toggle | Longer than the 0.4s open/close transition seen on staging | Does the FAQ still feel steady on an iPhone? Safari has no scroll anchoring, so a jump there would need a further fix |
| 2 | "Other dining options" is the card carousel section that follows the dining detail content | It is what the existing code and site head CSS already name | Is that the right section to hide the button at? |
| 3 | Hero image settles from 112% to 100% over 1.8s | No value in the feedback; gentle and easy to tune | Is the zoom amount and speed right? |
| 4 | Room gallery restored = the Gallery Mosaic image fade from v1.1.60 (commit e5ed47c), on room pages only | M16 says room pages; the attribute was removed in the Designer, not in code | Is that the gallery Omar meant? |
| 5 | Corporate row images are expected inside the "Why teams choose the Guild" feature rows; class guessed until the Webflow ticket adds them | Images do not exist yet | Confirm the Webflow ticket uses that block's figure for the image |
| 6 | RFP field fade applies to every form built on the shared contact form component | The RFP page shares that component | Fine for the other forms to fade in too? |
| 7 | Subnav: 0.45s eased open, links fade and rise with a 0.06s stagger, 0.3s close | No values in the feedback | Does the timing feel right? |
| 8 | George Marston phone tilt uses its own design angle (-2.56deg); desktop left as is | Feedback says "same angle as the other script headings"; desktop is already tilted from an earlier item | Should desktop stay level as M26 says, or keep the earlier tilt? |
| 9 | Focus rings hidden after a tap or click by the script itself, so no site CSS paste is needed | Keeps it code-only and away from the Designer | None unless a ring still shows after a tap on the live site |
