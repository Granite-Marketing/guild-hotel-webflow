# Two-axis review, round 1 (base 69c1992, head 167d068)

## Standards

No hard violation in the code. src/ changes are small, use clean names, add no window helpers and no inline display. No em dashes in new files.

Hard violations (documented rules):
1. where-used not updated for a new shared attribute (CLAUDE.md "Shared changes reach every page"): `data-modal-title` (src/utils/modals.ts:84, docs/reference/modal-setup.md:31) is not in docs/reference/where-used.md. Same for the `.rooms-collection-quiz_heading` and `.rooms-collection-room-grid_heading` contracts. (Lead note: no page uses `data-modal-title` yet; it ships with the Designer tickets, so this becomes due then.)
2. `data-modal-title` is only in the prose bullet at modal-setup.md:31, not a row of the attribute table (lines 20-24) like `data-modal-no-overlay`.

Judgement calls:
3. Selector priority does not match comments or docs: modals.ts:84/114, roomGridHoverReveal.ts:28/45, roomsQuiz.ts:41/103/128/282. A comma list in querySelector returns the first match in document order, so an earlier h2/h3 wins over the class element. Fix the code (two queries) or reword the docs.
4. The quiz class contract is documented only in the new "Heading tags and scripts (#420)" section, not in the roomsQuiz section.
5. "Scripts must not depend on heading tags" went into runtime-modules.md, not docs/solutions/ (CLAUDE.md "Record learnings"); arguably fine as a reference doc.
6. copy-check-browser.mjs `collect` parameter is a small safe change; CLI entry console.error/process.exit is normal.

## Spec

Ran `pnpm test:factory` (131 pass) and `pnpm check` (clean). Build and Playwright not run. Real sheet parses to 19 tabs, 681 rows (matches the spec); Privacy & Accessibility gives both pages.

(a) Missing or partial
1. "Playwright test on a fixture page beside the existing modal, room and rooms quiz specs": one new spec file and fixture (tests/visual/heading-tags-420.spec.ts) beside them, not a case in each existing spec. Placement only.
2. "Typecheck and the bundle build pass": typecheck passes; build not run here.
3. "reporting any page whose footer, booking and newsletter band, offers slider or FAQ tags differ": parts matched by hard-coded section_ class names (lib/heading-check.mjs SHARED_PARTS); a wrong name means that part is silently never compared. diffSharedParts ignores classes present on one side only (lib/heading-check.mjs:193).

(b) Scope creep: none significant (CLI options, link crawl for untabbed pages, noPage list, docs, pnpm script all support the spec).

(c) Implemented but possibly wrong
1. "p means a paragraph": a row whose text sits in a bare div reports "failed, found DIV". Acceptable.
2. Wrapped logo: handled via hasImage; a wrapper h3 holding both text and a logo is matched by its text, not the alt.
3. "confirm a div turned h3 is picked up": the spec asserts current behaviour (plain div not split unless data-line-mask). Reasonable reading.
4. Template tabs check only the first path's rows.
5. Section fit takes priority over page order; order is a tiebreak within the best section. Consistent with "by section and text".

Confirmed fine: never writes to Webflow (source-scan test at tests/factory/heading-check.test.mjs:138); tests cover pass, fail, not found, repeated text, wrapped logo, counts, uncovered list, shared parts, end to end; all under test:factory; rooms-quiz.spec.ts (#251, #284) untouched; #420 modules look up by class or data attribute with the tag fallback.

Summary: Standards 2 hard (doc-level), 4 judgement; Spec 3 partial notes, no blocker. Worst single issue: selector precedence is document order, not class-first.
