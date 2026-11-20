# Assumptions (hold the merge)

Product values the build chose so it could keep going. Stephen answers each question at merge time; a wrong guess is a follow-up, not a rerun. A row that needs a human to do something outside the repo (a Notion property, a Railway variable, a token scope, an n8n credential) starts its Assumption cell with `⚠️ ACTION:` and names the check that proves it (`check: <command>`); the pr gate lists those first on the PR and pushes them to Stephen. Prose (README, CLAUDE.md) never carries a hand step; the implement gate rejects it.

| # | Assumption | Why | Question for Stephen at merge |
|---|---|---|---|
| 1 | ⚠️ ACTION: register the 125-character head snippet `docs/reference/site-head/day-night-head.js` as a site head script (Webflow scripts API) when the bundle ships; check: `curl -s "$WEBFLOW_SITE_URL" \| grep -c guild-mode` | Prevents the day flash on night loads; registering it touches the live site, so it waits for the release step | Register it with the next bundle release? |
| 2 | ⚠️ ACTION: add `data-day-night="day"` and `data-day-night="night"` to the existing nav Day and Night buttons in the Designer; check: `curl -s "$WEBFLOW_SITE_URL" \| grep -c 'data-day-night='` | The module finds the buttons by that attribute; the real nav markup is not in the repo | Fine to add these attributes in the Designer ticket that binds the night fields? |
| 3 | Cookie `guild-mode` (`day` or `night`), one year, host-only (no Domain attribute) | `webflow.io` is a public suffix, so a Domain cookie would be rejected on staging; `www` and the bare domain keep separate choices | Is host-only acceptable for launch? |
| 4 | Crossfade is 0.25 s out plus 0.25 s in (about 0.5 s) | Spec says about half a second; duration is a taste item | Happy with the speed? |
| 5 | The pressed nav button also gets `is-active` beside `aria-pressed` | Lets the Designer style the pressed state with a class | Keep `is-active` as the styling hook? |
| 6 | Text animated by `scrollTextReveal` or `swiperSliders` must not carry night attributes (only hero, line-mask and script reveal re-split safely) | Those modules do not use the new split registry | Any tagged block that uses those animations needs follow-up work? |
