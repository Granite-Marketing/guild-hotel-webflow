Checked all 13 criteria for #420 and #421; all pass.
The pop-up, room card and quiz changes are proven by browser tests that fail on the old code and pass now.
Script reveal and line mask already worked, so their tests pass either way; that is expected.
The heading check passes pass, fail, not-found and repeated-text cases, and has no write calls to Webflow.
Typecheck, bundle build and the 139 factory tests all pass.
Not checked: the real staging pages (the 19 tabs run live), and whether the class names used for lookup match the live Webflow markup.
Nothing blocks merge.
