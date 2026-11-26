## Summary

Closes #415
Closes #416
Closes #417

**What was built.** A copy map that reads the client's 20 content docs and matches every doc line to its place on staging (page text, component prop, fixed component text, CMS item field), with a readable per-page summary. A copy check then loads each mapped staging page headless at 1440 and marks every row done, missing or differs. The check never writes to Webflow.

## Go through with Stephen before merge

1. Is 160 rows to confirm the right amount of review, or should the match bar move?
2. Treat text on template pages (rooms, dining, legal and corporate items) as shared, since one edit hits every item?
3. Should City Level Loft map to the Guild City Level Loft item? (9 of 14 doc rooms matched by name; none created.)
4. Fine to leave site chrome (nav, footer, FAQ, offers), pop-up and form text, empty-list text and timeline years out of the "no copy yet" list?
5. Accept that a short repeated line like "Discover More" can read done from another element, or tighten to position-only matching?
6. OK that the check compares case and whitespace only and ignores the heading tag?
7. OK that writer's notes and "or" separator lines are listed under the map's notes, not as rows?

## Known residuals

Four P2/P3 housekeeping findings (duplicated staging URL, real-data tests pinned to catalogue names, a side-effect call, a header comment). Staged for your decision: [#444](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/444).

## Follow-ups filed

[#444](https://github.com/Granite-Marketing/guild-hotel-webflow/issues/444)

## How it was validated

93 factory tests pass; 23 of 23 held-out checks pass; typecheck and build check pass. No criteria unverifiable.

## Post-deploy monitoring

No additional operational monitoring required: dev tooling only, read-only against staging.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
