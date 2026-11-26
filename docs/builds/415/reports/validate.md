Validation of the copy map and copy check (#416, #417), head ee3754a.
- 17 Done-when criteria checked, 17 passed, 0 failed, 0 unverifiable.
- 23 held-out checks pass; the factory test command runs 93 tests, all pass.
- Both new test files fail on the old code (the modules did not exist), so they prove the change.
- One of my checks was out of date after the last review fix (a target still showing old text is now "differs" even if the new text appears elsewhere). That is the correct behaviour; I corrected the check.
- Real data note: all 14 text-fixed-in-component rows sit in single-page components, so none is marked shared; the shared flag is proven on a fixture.
- Nothing needs Stephen at merge from validation.
