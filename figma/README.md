# Figma snapshot

A committed, offline copy of the GUILD-WEB-NEW Figma file. Build sessions read
design data from here instead of calling Figma. Plan:
`docs/plans/2026-10-19-001-feat-figma-snapshot-cache-plan.md`.

## What is here

| Path | Committed | Contents |
|---|---|---|
| `snapshot.json` | yes | File key, version, lastModified, render cap and tiers, the Figma call ledger, and every captured frame (kind, page slug, size, render scale, status) |
| `raw/file.json.gz` | yes | Verbatim gzipped body of `GET /v1/files/:key` at full depth. Every local step (slicing, tokens) reads this |
| `brand/*.svg` | yes | Brand marks exported as SVG with outlined text |
| `vectors/*.svg`, `vectors/index.json` | yes | Every distinct vector-only shape inside the pages (icons, arrows, button outlines, frame shapes, illustrations), with each use's frame-relative box (`pnpm figma:vectors`, one call per file version) |
| `animations/<page>.md` | yes | Animation reference notes per page (the screen recordings themselves are not available over REST) |
| `review/vision-*.json` | yes | Vision pass: layout name, kind, slider flag and boundary notes per section |
| `pages/`, `tokens.json`, `inventory.json` | yes | Section crops, specs and tokens, produced locally from the raw file |
| `.cache/renders/<id>.png` | no | Full-page renders (node id with `:` replaced by `-`) |
| `.cache/steps/<version>/` | no | Step completion markers and the per-version call log |
| `.cache/ledger.jsonl` | no | Every Figma request ever made from this checkout |

Image fill originals go to `assets/images/<imageRef>.<ext>` (gitignored) and are
recorded in `assets/asset-manifest.json`.

No committed file may exceed 10MB; the snapshot run fails if one would.

## Refreshing

```bash
pnpm figma:snapshot --dry-run   # planned calls, zero network requests
pnpm figma:snapshot             # file key from FIGMA_FILE_KEY or the first argument
pnpm figma:slice                # local: section crops and specs
pnpm figma:tokens               # local: tokens.json
pnpm figma:vectors              # one call: vector SVGs, skipped if already done for this version
pnpm figma:inventory            # local: inventory.json, docs/figma/inventory.md, cms-proposal.md
```

A run first makes one cheap `depth=1` call. If the version and lastModified
match `snapshot.json`, it exits without writing anything. Otherwise it fetches
the full file, image fills, one render call per scale tier and one brand SVG
call (7 or 8 calls against a budget of 8). Each step leaves a marker, so a run
interrupted by an error resumes with only the remaining calls. `snapshot.json`
is written last.

A frame whose render URL comes back empty is marked `failed`. Re-render it with
one extra call: `pnpm figma:snapshot --only <frameId>`.

## Quota rules

- Never call `api.figma.com` from a build session. Builds read this folder.
- Never loop or retry Figma calls by hand. The client aborts on any rate limit
  wait over 60 seconds; when it does, stop and report the wait, do not re-run.
- Run `--dry-run` before every real run, and run the real snapshot only under
  supervision.
- Slicing and token extraction are local and free; re-run them as often as
  needed.
