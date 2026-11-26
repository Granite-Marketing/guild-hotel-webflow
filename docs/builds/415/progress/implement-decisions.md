# Implement decisions

- Build #416 then #417 serially (417 blocked by 416), one Sonnet implementer each in .claude/worktrees/t4xx; alternatives: parallel with stubbed map format; why: the check consumes the map's row shape, serial avoids a contract mismatch; landed: progress/implement.md
- Copy map and check as Node ESM scripts under scripts/api/webflow/ with pure modules tested by tests/factory/*.test.mjs (the factory test command); alternatives: new test folder; why: done-when says tests run in the factory test command, prior art catalogue.mjs and trello parse-board tests; landed: ticket briefs
- Writer's notes and "or" separators are recorded under copy-map.json `notes`, not as rows; every other non-blank doc line is a row (checked: only separators and image placeholders sit outside rows/notes); alternatives: add a "note" status row; why: the spec's status list has no note status and done-when says notes are recorded as notes; landed: copy-map.json
