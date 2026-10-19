# Release and rollback

## Development candidate

1. On the first project setup, run `pnpm devlink:configure` interactively to establish the Webflow library identity and accept the dependency trust prompt. Review the resulting manifest change and commit only portable configuration.
2. Work on a clean branch and commit the reviewed source.
3. Run `pnpm release:check`.
4. Run the official component audit and pre-deploy check if the Granite factory is available. These are extra safeguards, not a requirement for client ownership.
5. Prepare immutable metadata with `pnpm release:prepare <version>`, then review and commit the candidate metadata before importing it.
6. Import the development library with `pnpm devlink:import:development`.
7. Verify component props, CMS fixtures, animations, reduced motion, and canonical breakpoints on the Webflow staging domain.
8. Set `WEBFLOW_SMOKE_URL` to the staging page and record approval with `pnpm release:approve-staging <version>`. The command runs the Webflow smoke test and records a same-source receipt; it cannot approve a skipped smoke test. Review and commit the metadata change.

If the CLI writes an absolute local path into `webflow.json` during first-time configuration, restore the portable relative `./src/globals.webflow.ts` value before committing. The non-interactive release gate must not introduce machine-specific manifest changes.

## Production promotion

Production never follows latest automatically. Promote only the exact source-equivalent revision and candidate version approved in staging. Run `pnpm devlink:import:production <version>`; the guarded command requires a clean repository, permits only release-metadata commits since candidate preparation, reruns the full release check, and then imports the production library. Review and commit the resulting production metadata before publishing the Webflow site through its normal confirmed publish flow.

The import writes `project/production-import-pending.json` immediately before DevLink mutates Webflow. If an import fails or is interrupted, later imports fail closed instead of overwriting that evidence. Inspect the recorded version, verify the actual library state in Webflow, then run `CONFIRM_WEBFLOW_IMPORT_STATE=verified pnpm devlink:import:production <version> --acknowledge-pending`. Acknowledgment only clears the reconciled receipt; run any retry as a separate command.

Removing a component or changing its prop contract requires a major version and migration notes supplied through `RELEASE_MIGRATION_NOTES` when preparing the candidate.

## Rollback

Run `pnpm release:rollback <version>` to print a non-mutating rollback plan for a previously imported production or superseded version. Check out the recorded verified revision, install from the lockfile, rerun the full release check, and use the exact rollback command printed by the plan. Verify staging before publishing. The planning command never changes Webflow by itself.

## Gotchas

Commit all source before `release:prepare`. The command pins the current git HEAD as the candidate's `sourceRevision`, and every later gate diffs `sourceRevision..HEAD`. `project/releases.json` is the only path excluded from that diff, so if any other tracked file changed since preparation, both `release:approve-staging` and the production import fail closed with `Source changed after candidate preparation`. The correct order is: get the repo to its final source state, commit everything, run `release:prepare <version>`, commit the candidate metadata, then run `release:approve-staging <version>` with no source commits in between. If you must edit source after preparing, reset the candidate — empty the `releases` array in `project/releases.json`, commit, and re-prepare — rather than trying to approve the stale one.

Point `WEBFLOW_SMOKE_URL` at a published page whose content matches the smoke spec, not an empty homepage. `release:approve-staging` reruns the full release check, which includes `tests/webflow-import.smoke.spec.ts`. That spec fetches `WEBFLOW_SMOKE_URL` and asserts the imported component contract renders — for example specific `[data-component="..."]` counts. A blank or default homepage has no components and fails the assertions, so approval is never recorded. Use a real published staging page that actually contains the imported components, and keep the spec's assertions aligned with what is published on that page.
