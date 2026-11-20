status: complete

- #339 day and night switch: merge a1dee59 (feat 21ef9fe, tests 657a412); tests added: tests/visual/day-night.spec.ts (9 scenarios x 390 and 1440), fixtures in tests/visual/fixtures/day-night-*
- Assumptions: docs/builds/338/ASSUMPTIONS.md rows 1-6

## Fix round 2

- Gate: diff touched protected paths dist/index.js and dist/site.css (from 71b17d2). Restored both to base 0c9b237; kept the package.json test:factory fix.
- dist rebuild filed as follow-up https://github.com/Granite-Marketing/guild-hotel-webflow/issues/358
- Checks: pnpm check exit 0; pnpm test:factory 38 pass 0 fail; playwright day-night.spec.ts 18 passed.
