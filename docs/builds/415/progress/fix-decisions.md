## Round 1
- Target resolved first: candidates are current-text elements plus new-text elements on the target's tag and section; best by tag, section, liveOrder distance, ties to the current-text element; done only when the winner shows the new text; alternatives: a separate "elsewhere" status; why: keeps the four agreed statuses (no change to what counts as passing) while a target still showing old text can never be done; landed: scripts/api/webflow/lib/copy-check.mjs locateOnPage
- Any-element new-text match kept only when no target is locatable (no current-text hit, no tag/section/liveOrder hit); alternatives: drop it; why: the finding asks to keep it for those rows, and CMS listing rows with no tag rely on it; landed: same
- Slider clones excluded from every match, including the fallback (P2 #2); landed: same
- Equality checked on the winner without excluding current text, so a case-only change counts done; landed: same, test "only in case"
