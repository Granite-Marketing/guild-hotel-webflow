# Implement decisions

- Run #420 and #421 in parallel; alternatives: sequential; why: neither blocks the other and they touch disjoint files (src/ + tests/visual vs scripts/ + tests/factory); landed: progress/implement.md
- Added section-aware matching to the heading check; alternatives: text only (as the ticket implementer chose); why: Done-when says 'by section and text'; landed: 167d068
