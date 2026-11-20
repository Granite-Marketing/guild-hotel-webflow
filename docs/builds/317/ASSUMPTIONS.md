# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | Blog, Happenings and Packages are not switched to the new category attributes in this build; only the shared module and Press are | Code-only tickets; Webflow markup changes belong to the Designer lane | Should the designer round add the category attributes to Blog, Happenings and Packages? |
| 2 | A video on a media frame sits over the image and does not take part in the hero zoom on load; the image underneath still zooms | Hero zoom targets the image; keeps the existing animation untouched | Is a still (non-zooming) hero video fine? |
| 3 | A single-slide Offers slider hides its arrows and counter with the existing `hide` class | Reuses an existing utility instead of new CSS | None unless the one-slide look should differ |
| 4 | With slides nested in a Collection List, the slider adds the Swiper wrapper class to the list's items wrapper | Swiper needs slides as direct children of its wrapper | Confirm on staging once the CMS slider is built? |
