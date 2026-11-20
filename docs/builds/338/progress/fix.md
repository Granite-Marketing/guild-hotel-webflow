status: done
approach: change split text through SplitText's own public split() and onRevert hook, so nothing reverts an autoSplit instance by hand
- [x] fix gate feedback P1 #1 (manual revert in splitRegistry): src/utils/splitRegistry.ts, 6d07800
- [x] prove Night, Day, Night and resize leave no duplicate lines (fixture test): tests/visual/day-night.spec.ts, 20/20 pass at 390 and 1440
- [x] pnpm check: passes
- [x] commit: 6d07800
- [x] stage report: docs/builds/338/reports/fix.md
