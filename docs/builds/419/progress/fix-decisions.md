# fix decisions

## Round 1
- P2 #4: two lookups (marked element, then heading fallback) in modals, roomGridHoverReveal and a `panelHeading` helper in roomsQuiz; fixture gets an h2/h3 before each marked element; alternatives: :is() priority tricks; why: the reviewer's shape, readable; landed: b02015c
- P1 #1: fit-0 candidates rejected when any page element fits the row's label; row is `not-found` with `otherSection`, rendered "not found in its section (text found in X)"; alternatives: status failed; why: the element found is not the row's element, so its tag is not a verdict; landed: 8b26428
- P1 #1 (extended): a label is learned only when no page section shares a word with it, else one stray unique text in the footer would teach "Rooms" the footer (fit 2) and reopen the same hole; alternatives: majority-only voting; why: closes the reported scenario through the learning path too; landed: 8b26428
- P1 #2: `missingBaselines(home)` reported as `sharedParts.baselineMissing`, counted in summarise, rendered per part; "No page differs." only when nothing is missing; diffSharedParts lists one-sided class keys with [] on the other side ("none"); landed: 8b26428
- P2 #3: `templatePath` = exact slug match, else most shared words (fewest extra words on a tie), else paths[0]; `checkedPaths` used for both tab checks and the shared-part exclusion; docs updated; landed: 8b26428
- dist/index.js not committed: the branch leaves the bundle to the release step, as earlier commits did
