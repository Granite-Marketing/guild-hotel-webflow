# Deployments

This project is served to Webflow via **jsDelivr** from GitHub release tags. There is no npm publish step — jsDelivr reads the built `dist/` directly from a tagged commit.

CDN URL pattern:

```
https://cdn.jsdelivr.net/gh/<your-org>/<your-repo>@vX.Y.Z/dist/index.js
```

## Why GitHub Actions is disabled

The previous `release.yml` workflow used `NPM_TOKEN` to publish to the npm registry. npm has since changed how publish tokens work and the automated release no longer runs reliably, so deployments are performed manually and the workflow has been removed. `ci.yml` (lint/tests) still runs on PRs.

## Manual deployment procedure

Run from the repo root on an up-to-date default branch (`main` for projects bootstrapped from this template; older repos may still be on `master`).

> **`dist/` is committed on purpose.** jsDelivr serves `dist/index.js` straight from the tagged commit, so if `dist/` is missing or stale at the tag the release is broken. Always build fresh before committing.

```bash
# 1. Make your code changes in src/

# 2. Build (refreshes dist/ — this is the artifact jsDelivr serves)
pnpm run build

# 3. Create a changeset (interactive prompt)
pnpm changeset
# Select: patch (bug fix), minor (new feature), or major (breaking change)
# Write a brief description

# 4. Version the package
# WARNING: This should create a git tag automatically, but sometimes it doesn't.
pnpm changeset version

# 5. CRITICAL: Verify the tag was created
git tag -l | sort -V | tail -3
# You should see the new version (e.g., v2.0.11)

# 6. If the tag is missing, create it manually using the version in package.json:
#    git tag v$(node -p "require('./package.json').version")

# 7. Commit and push
git add .
git commit -m "chore: release vX.Y.Z"
git push origin main

# 8. CRITICAL: Push all tags to GitHub
git push --tags
# Verify this succeeds. Check for authentication errors.

# 9. Verify tags are on GitHub
# Visit: https://github.com/<your-org>/<your-repo>/tags
# You should see your new version listed

# Done. Your code is live on the CDN within 2-3 minutes at:
# https://cdn.jsdelivr.net/gh/<your-org>/<your-repo>@vX.Y.Z/dist/index.js
```

## Troubleshooting

- **jsDelivr 404s on `dist/index.js` for a new tag.** Either propagation is still in progress (wait ~3 min) or `dist/` wasn't committed on the tag commit. Check with `git ls-tree <tag> -- dist`; if empty, rebuild, `git add dist/`, amend or cut a new patch, and re-tag.
- **`pnpm changeset version` did not create a tag.** This happens intermittently. Read the version from `package.json` and tag it manually (step 6), then continue.
- **`git push --tags` fails auth.** Re-authenticate (`gh auth login` or refresh the credential helper) and retry. Do not skip this step — if the tag is not on GitHub, jsDelivr cannot serve that version.
- **jsDelivr returns 404 or stale content.** Wait 2–3 minutes after the tag lands. jsDelivr caches aggressively; if you need a cache purge, use `https://purge.jsdelivr.net/gh/<your-org>/<your-repo>@vX.Y.Z/dist/index.js`.
- **Wrong version published.** jsDelivr serves whatever is at the tag — you cannot overwrite a tag safely once consumers pin to it. Cut a new patch version instead.
