# Review response (fix round after review round 2)

All four listed findings were applied; none pushed back.

- P1 #1 applied (8b26428), and extended: section learning no longer applies to labels a page section already names, so a single stray unique text cannot route the row to another section.
- P1 #2 applied (8b26428).
- P2 #3 applied (8b26428); the fix stays inside the lines and doc the diff already touched.
- P2 #4 applied (b02015c); the fixture has a heading before the marked element for the dialog, the room card and the quiz step, and each test fails on the old one-selector code.

Note: `rooms-quiz.spec.ts` "clicking an option ... focuses its question" fails on main too (#251); unchanged, per the issue.
