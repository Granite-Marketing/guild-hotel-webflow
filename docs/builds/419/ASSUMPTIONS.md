# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | Pop-up titles are found by `data-modal-title`, then the `overlay-detail-panel-modal_heading` class, then the first h1 to h6. | That class is the only pop-up title class on staging today. | Any other pop-up whose title becomes a paragraph needs `data-modal-title` in the Designer; is that fine for the Designer tickets? |
| 2 | Room grid and rooms quiz titles are found by `rooms-collection-room-grid_heading` and `rooms-collection-quiz_heading`, falling back to h2 or h3. | Those are the classes the cards and panels carry now. | Keep those classes when the tags change? |
| 3 | The heading check matches rows by sheet section as well as text: the page section is learned from rows whose text is unique, else a shared word with the `section_` class. | Sheet section names are free text, not class names. | OK as the matching rule? |
| 4 | Shared parts are the `section_footer-links`, `section_cta-booking-newsletter`, `section_offers-slider-split` and `section_faq-accordion` sections; a page "differs" if a part is missing or a class uses other tags than on the homepage. | These are the shared parts the spec names. | Should a page that simply lacks a part (the 404, four dining venues without the offers slider) count as a difference? |
| 5 | Template rows (`[room name], e.g. Cozy Queen`) match on the example text, and rows proposed as `p` are left out of the proposed H counts. | The example is the page the tab checks. | Fine? |
