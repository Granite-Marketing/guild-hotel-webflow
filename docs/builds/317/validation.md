# Validation log

Every mechanical attempt, positive markers included. Held-out results live in validation-heldout.md.

## Attempt 1, mechanical, 2026-11-20 11:33, head f3fe744

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 2 | - | FAIL |
| `pnpm test:factory` | 1 | - | FAIL |
| `pnpm build` | 1 | - | FAIL |

### `pnpm check` (exit 2)
```
> @granite-marketing/webflow-mcp-starter@1.3.12 check /Users/sanindo/guild-hotel-webflow/.claude/worktrees/peaceful-satoshi-8f0eaf-build-317-spec-cms-and-component-cleanup-every-pag
> tsc --noEmit

src/utils/offersSliderSplit.ts(28,39): error TS1005: ',' expected.
src/utils/roomGridHoverReveal.ts(23,15): error TS1005: ',' expected.
tsconfig.json(5,25): error TS6046: Argument for '--moduleResolution' option must be: 'node', 'classic'.
 ELIFECYCLE  Command failed with exit code 2.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
```

### `pnpm test:factory` (exit 1)
```
ok 26 - token adapter emits semantic utilities with non-circular fallbacks
  ---
  duration_ms: 2.072625
  type: 'test'
  ...
# Subtest: changed Figma values require intentional override provenance
ok 27 - changed Figma values require intentional override provenance
  ---
  duration_ms: 0.137792
  type: 'test'
  ...
# Subtest: normalized semantic collisions are rejected before generating CSS
ok 28 - normalized semantic collisions are rejected before generating CSS
  ---
  duration_ms: 0.225291
  type: 'test'
  ...
# Subtest: factory and generated-client token contracts stay identical
ok 29 - factory and generated-client token contracts stay identical
  ---
  duration_ms: 0.140584
  type: 'test'
  ...
# Subtest: parseBoard keeps open lists and cards in board order with checklists and comments
ok 30 - parseBoard keeps open lists and cards in board order with checklists and comments
  ---
  duration_ms: 1.043
  type: 'test'
  ...
1..30
# tests 30
# suites 0
# pass 28
# fail 2
# cancelled 0
# skipped 0
# todo 0
# duration_ms 422.940542
 ELIFECYCLE  Command failed with exit code 1.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
```

### `pnpm build` (exit 1)
```
> @granite-marketing/webflow-mcp-starter@1.3.12 build /Users/sanindo/guild-hotel-webflow/.claude/worktrees/peaceful-satoshi-8f0eaf-build-317-spec-cms-and-component-cleanup-every-pag
> cross-env NODE_ENV=production node ./bin/build.js

 ELIFECYCLE  Command failed.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
sh: cross-env: command not found
```

## Attempt 2, mechanical, 2026-11-20 11:36, head 683e626

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

## Attempt 1, mechanical, 2026-11-20 11:49, head 683e626

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 2 | - | FAIL |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

### `pnpm check` (exit 2)
```
> @granite-marketing/webflow-mcp-starter@1.3.12 check /Users/sanindo/guild-hotel-webflow/.claude/worktrees/peaceful-satoshi-8f0eaf-build-317-spec-cms-and-component-cleanup-every-pag
> tsc --noEmit

src/__heldout__/1-category.heldout.ts(21,127): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
src/__heldout__/2-media.heldout.ts(3,30): error TS2307: Cannot find module 'node:fs' or its corresponding type declarations.
src/__heldout__/2-media.heldout.ts(18,273): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
src/__heldout__/3-offers.heldout.ts(10,215): error TS2580: Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node`.
 ELIFECYCLE  Command failed with exit code 2.
```

## Attempt 2, mechanical, 2026-11-20 11:51, head a6ff183

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

## Attempt 1, mechanical, 2026-11-20 12:22, head 11a8b07

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

## Attempt 2, mechanical, 2026-11-20 12:27, head 11a8b07

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

## Attempt 1, mechanical, 2026-11-20 12:40, head 9f9fae4

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |
