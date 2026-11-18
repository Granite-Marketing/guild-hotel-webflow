---
module: release
tags: [jsdelivr, release, cdn]
problem_type: integration-issue
date: 2026-11-18
---

# jsDelivr refuses commits once the repo passes 50MB

## Problem
jsDelivr serves `gh/<org>/<repo>@<ref>` by packaging the whole repo tree at that ref. Since the Figma snapshot and feedback images landed, the tree is about 186MB, so any new ref on `main` (or a PR branch) returns 403 "Package size exceeded the configured limit of 50 MB". Old tags (v1.2.35) still load because jsDelivr cached them.

## Fix
Point the CDN at a commit whose tree holds only `dist/`:

1. Build and commit the release on `main` as usual (`changeset version`, `pnpm build`, commit `chore: release vX.Y.Z`).
2. Make a dist-only commit on top of it and tag that commit, not the release commit:
   ```bash
   REL=$(git rev-parse HEAD)
   B=$(git hash-object -w dist/index.js); C=$(git hash-object -w dist/site.css)
   T=$(printf "100644 blob %s\tindex.js\n100644 blob %s\tsite.css\n" "$B" "$C" | git mktree)
   T2=$(printf "040000 tree %s\tdist\n" "$T" | git mktree)
   D=$(git commit-tree "$T2" -p "$REL" -m "release vX.Y.Z (dist only, for jsDelivr; source at ${REL:0:8})")
   git tag -a vX.Y.Z "$D" -m "vX.Y.Z: dist only; source at $REL" && git push origin vX.Y.Z
   ```
3. Curl `@vX.Y.Z/dist/index.js` and `site.css` (expect 200), then point the Webflow head and footer at the tag and publish.

Previews work the same way on the `preview/pr-291-dist` branch. In zsh write `${SHA}:refs/...`, never `$SHA:refs/...` (`:r` is a zsh modifier). Use 8+ character SHAs in jsDelivr URLs: a 404 fetched before the push lands is cached for that exact string.

First used for v1.3.0 (18 Nov 2026).
