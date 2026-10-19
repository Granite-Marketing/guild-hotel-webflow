# Figma Access Requirements

What the pipeline needs from Figma before `/export-assets`, `pnpm run extract-styles` or `/build-component` can run, and how to check it in one call.

## Snapshot first

When a project has `figma/snapshot.json`, all design reads come from the committed snapshot (`pnpm figma:snapshot` fetches it once, `pnpm figma:slice` and `pnpm figma:tokens` rebuild everything locally for free). Build sessions never call the REST API or the Figma MCP on their default path. Refresh the snapshot only when the design changes; a re-run on an unchanged file costs one call. See `figma/README.md`.

## Edit access is required for the REST API

The Figma REST API returns **403 "File not exportable"** when the token holder only has "can view" access to the file. The Figma MCP (which works through the desktop app connection) may still return screenshots, so the problem shows up late, at token extraction or asset export.

Everything that uses `FIGMA_API_TOKEN` needs the token owner to have **edit access** (or to own the file): asset export, `extract-styles`, token sync. Ask the designer to grant "can edit" on the file, or to duplicate it into a project the token owner can edit.

## Pre-flight check

Run this before starting a build. It is cheap (depth 1 returns only the document and pages):

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  -H "X-Figma-Token: $FIGMA_API_TOKEN" \
  "https://api.figma.com/v1/files/<fileKey>?depth=1"
```

| Status | Meaning | Action |
|---|---|---|
| `200` | Token valid, file readable and exportable | Proceed |
| `403` | View-only access ("File not exportable"), or token lacks `file_content:read` | Request edit access, or check the token's scopes |
| `404` | Wrong file key, or the token owner cannot see the file at all | Check the key from the URL (`figma.com/design/<fileKey>/...`) and sharing |
| `401` / invalid token | Token expired (personal tokens expire every 90 days) or mistyped | Generate a new token and update `.env` |

## Figma MCP plan limits

The Figma MCP server enforces tool-call limits by seat type and plan. On free or basic seats it can return a rate-limit error after a few calls (for example one screenshot plus one design-context request), so a full component extraction may not finish in one session.

- Confirm the seat has Dev Mode or a plan with MCP access before relying on it for a whole page.
- Batch: fetch design context for a whole section node rather than each child separately.
- Fallback when the MCP is unavailable or rate-limited: `pnpm run extract-styles <fileKey> <nodeId>` for exact CSS values, the REST images endpoint (via `/export-assets`) for reference screenshots, then compare visually as usual.

## Related

- `CLAUDE.md` > API Tokens: `FIGMA_API_TOKEN` scope and expiry
- `.claude/skills/export-assets/SKILL.md`: the REST export flow
- [style-guide.md](style-guide.md): what token sync updates once access works
