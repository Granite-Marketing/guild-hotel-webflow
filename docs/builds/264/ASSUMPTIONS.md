# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | Home collage tiles on phones fade in 0.2s apart (capped at 0.5s), each fade 0.8s | M4 asks for "one by one" with no timing | Does the one-by-one pace feel right on a phone? |
| 2 | Newsletter form fields fade in 0.1s apart | M30 asks for a stagger with no timing | Is the newsletter stagger subtle enough? |
| 3 | Subnav links rise about 4px (20% of their height), 0.06s apart; hero zoom starts at 1.12 over 1.8s (both unchanged from the first pass) | Taste items M19 and M23 Stephen judges by eye | Keep these, or adjust after seeing them on staging? |
