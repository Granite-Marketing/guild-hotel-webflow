# Review response (fix round 1)

- P1 #1: applied. The check now resolves the row's target first and calls it done only when that element shows the new text; new text elsewhere while the target keeps its old text reads differs. Tests cover the Guild-Neighborhood shape, a nearer old-text tie, the target slot updated while the old text survives elsewhere, a case-only change and the no-target fallback.
- P2 #2: applied. Slider clones are excluded from the done match and the fallback; test added.

No finding pushed back.
