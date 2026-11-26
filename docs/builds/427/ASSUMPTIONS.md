# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | Dropbox links keep every other query value (only `dl`, `raw` and `st` are dropped), and `dl.dropbox.com` and bare `dropbox.com` count as Dropbox too | Covers every link shape an editor might have saved without guessing at unknown parameters | Fine to keep other Dropbox parameters as they are? |
| 2 | A video panel settles by scaling its whole image frame, not the image alone | The video is added after the panel move is set up; the frame fills the panel, so it looks the same as an image panel | Happy with this, given the frame always fills the panel in the Designer? |
