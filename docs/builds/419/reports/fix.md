# Fix report (review round 2 findings)

All four blocking findings are fixed and committed (b02015c, 8b26428); nothing was pushed back.

1. The heading check no longer passes a row against the same text in an unrelated section (for example "Book now" in the footer for a Rooms row). It reports "not found in its section" and names where the text was. I also closed the same hole through the section-learning path.
2. If the homepage fails to load, or lacks a shared part, the report now says "baseline missing, comparison not done" and counts it, instead of "no page differs". Classes on only one side are now listed too.
3. Room and venue tabs are now checked on the page that matches the sheet's example (Cozy Queen, Zuma), so their H1 rows can pass.
4. Pop-ups, room cards and the rooms quiz now look for the marked title first and only fall back to any heading if none is marked. New fixture cases prove it, and they fail on the old code.

Checks: typecheck, bundle build and the factory tests pass (139). One rooms quiz test fails on main too (#251) and was left alone, as the issue says.
