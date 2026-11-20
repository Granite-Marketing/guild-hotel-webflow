# Validation log

Every mechanical attempt, positive markers included. Held-out results live in validation-heldout.md.

## Attempt 1, mechanical, 2026-11-20 12:58, head a1dee59

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 2 | - | FAIL |
| `pnpm test:factory` | 1 | - | FAIL |
| `pnpm build` | 1 | - | FAIL |

### `pnpm check` (exit 2)
```
> @granite-marketing/webflow-mcp-starter@1.3.12 check /Users/sanindo/guild-hotel-webflow/.claude/worktrees/peaceful-satoshi-8f0eaf-build-338-spec-day-and-night-content-switch-20-nov
> tsc --noEmit

src/utils/offersSliderSplit.ts(27,39): error TS1005: ',' expected.
src/utils/roomGridHoverReveal.ts(23,15): error TS1005: ',' expected.
tsconfig.json(5,25): error TS6046: Argument for '--moduleResolution' option must be: 'node', 'classic'.
 ELIFECYCLE  Command failed with exit code 2.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
```

### `pnpm test:factory` (exit 1)
```
ok 26 - token adapter emits semantic utilities with non-circular fallbacks
  ---
  duration_ms: 1.995334
  type: 'test'
  ...
# Subtest: changed Figma values require intentional override provenance
ok 27 - changed Figma values require intentional override provenance
  ---
  duration_ms: 0.14575
  type: 'test'
  ...
# Subtest: normalized semantic collisions are rejected before generating CSS
ok 28 - normalized semantic collisions are rejected before generating CSS
  ---
  duration_ms: 0.227625
  type: 'test'
  ...
# Subtest: factory and generated-client token contracts stay identical
ok 29 - factory and generated-client token contracts stay identical
  ---
  duration_ms: 0.143708
  type: 'test'
  ...
# Subtest: parseBoard keeps open lists and cards in board order with checklists and comments
ok 30 - parseBoard keeps open lists and cards in board order with checklists and comments
  ---
  duration_ms: 0.944291
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
# duration_ms 280.316333
 ELIFECYCLE  Command failed with exit code 1.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
```

### `pnpm build` (exit 1)
```
> @granite-marketing/webflow-mcp-starter@1.3.12 build /Users/sanindo/guild-hotel-webflow/.claude/worktrees/peaceful-satoshi-8f0eaf-build-338-spec-day-and-night-content-switch-20-nov
> cross-env NODE_ENV=production node ./bin/build.js

 ELIFECYCLE  Command failed.
 WARN   Local package.json exists, but node_modules missing, did you mean to install?
sh: cross-env: command not found
```

## Attempt 2, mechanical, 2026-11-20 13:02, head 0e607c6

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |

## Attempt 1, mechanical, 2026-11-20 13:26, head 6d07800

| Command | Exit | Count | Result |
|---|---|---|---|
| `pnpm check` | 0 | - | pass |
| `pnpm test:factory` | 0 | - | pass |
| `pnpm build` | 0 | - | pass |
