# Review, round 1: fix-first

1. The four fixes are mostly in place and the checks pass (type check clean, 38 of 38 factory tests).
2. The modal Back button has two small gaps. Going back from a dialog without a dark backdrop leaves the dialog beneath without its backdrop. The dialog you return to also jumps back to its top.
3. The map warm-up uses a page-ready check that the repo rules forbid. It is a one-line change.
4. The button outline thickness setting only fully works at today's 1px. Raising it would leave the diagonals thinner than the edges.
5. One line of the button doc still describes the old Meetings 2px outline.
6. Smaller items: one accessibility state on a trigger, a few missing test cases, and one unproven risk that late text splitting shifts scroll positions.
7. At merge: the scroll "jump back" was never reproduced. Only staging can confirm it is gone, in the release ticket.
Detail: docs/builds/174/review.md (8 findings: 4 P2, 4 P3).
