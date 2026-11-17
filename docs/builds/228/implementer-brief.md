# Implementer brief, build 228 (common to all tickets)

You implement ONE ticket of spec #228 in your own git worktree. Headless: no user, never ask questions.

Read before your first edit:
- /home/sanindo/guild-hotel-webflow-build-228-spec-mobile-feedback-code-fixes-builder/docs/builds/228/issue.md (spec + your ticket body)
- <worktree>/CLAUDE.md (repo rules: module pattern, GSAP conventions, refresh rules, vh not svh, no Designer changes)
- ~/granite/knowledge/tech-conventions.md
- <worktree>/docs/feedback/mobile-2026-11-17.md (the M-items your ticket names; screenshots in docs/feedback/images/2026-11-17/)
- docs/reference/runtime-modules.md for the modules you touch

Rules:
- Work ONLY in your worktree, branch ticket/<N>, already based on build/228-spec-mobile-feedback-code-fixes-builder. node_modules is a symlink; do not install anything; no new dependencies.
- Call the Skill tool with `tdd` for your ticket. Tests check behaviour a visitor sees. Add assert-based self-checks or a Playwright fixture under tests/visual/fixtures plus a spec in tests/visual, following existing fixtures (for example nav-toggle.html / nav-toggle.ts / nav-toggle.spec.ts and playwright config). Run your new spec with `npx playwright test tests/visual/<file>.spec.ts` if browsers are available; if Playwright cannot run, say so.
- Never edit existing tests to make them pass. Never touch CLAUDE.md, AGENTS.md, .claude/ config, or the conventions canon. Never read any held-out check directory.
- Do NOT commit dist/ (if `pnpm build` rewrites dist/, run `git checkout dist` before committing). The lead rebuilds dist once.
- No Webflow Designer, CMS or API mutations, no publishing, no releases, no changesets.
- No em dashes in UI copy or doc prose you write.
- Live staging checks at 1440 and 390 happen in a later release ticket; do the code plus fixture tests and note what needs live verification.
- If your ticket needs a decision the spec does not settle and no safe assumption exists, stop and reply "PAUSED: <question>" instead of guessing. Product values you choose go in your reply as ASSUMPTION lines.
- Out-of-scope discoveries: FOLLOWUP lines in your reply (do not fix them).
- Gate: `pnpm check`, `pnpm test:factory`, `pnpm build` must pass in your worktree (then restore dist).
- Commit on ticket/<N>; messages end with the line `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Write and commit `docs/builds/228/notes/<N>.md` in your worktree: PR-ready notes with any diagnosis, cause or provenance the Done-when asks for, with evidence; files changed; tests added; what remains for live verification.
- Before replying: `git merge build/228-spec-mobile-feedback-code-fixes-builder` into your branch, resolve conflicts, re-run `pnpm check`.

Final reply (under 15 lines): DONE or PAUSED, commit shas, tests added, ASSUMPTION and FOLLOWUP lines.
