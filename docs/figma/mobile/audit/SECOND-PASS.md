# Mobile second pass: line breaks, spacing, side-by-side review

Why: Stephen keeps finding the obvious by eye: text breaking on the wrong word, sections too tight to the top or the next section, logos too big. The first pass measured element boxes but did not compare where each line of text breaks, missed section padding on shared classes, and nobody looked at Figma and live side by side. His words: "Why are you not recognising the clear issues like top and bottom spacing, the spacing between elements, and the breaking of text on new lines?... Is there not a way you can do another pass on all of this without me having to tell you the obvious?"

## Hard rules

- Never add a line break tag or carriage return to any text. Match Figma line breaks with `max-width` (or a responsive font size). Remove any `<br>` or forced newline already added in headings, paragraphs, CMS fields or component props.
- Below 768px only; desktop (1440) must not change. Work autonomously, no questions.
- A shared class gets a page `is-` combo or goes to the global session (`local_b0db52b6-a83b-4ac7-8f01-2930a9484909`); say which in your report.

## For every block on your pages, at 390px

1. Line breaks: for every heading, paragraph, eyebrow and button label, get the live text of each rendered line (Range client rects per word) and the Figma line breaks (read them from the Figma render crop; Figma text nodes give box width, font size and line height). Same number of lines and same last word per line, or fix with max-width. Check the hero copy, script headings, footer and caption lines too.
2. Spacing: section padding-top and padding-bottom, and every vertical gap between consecutive elements (eyebrow, heading, paragraph, image, button, list, next section). Within 4px of Figma.
3. Sizes: logos, stamps, icons, images (width, height, aspect), button size. Within 4px or 3%.
4. Side-by-side review: build one image per block with the Figma crop left and the live 390 screenshot right (same scale, 780 wide), and give it to a fresh Sonnet subagent with only this prompt: "These are a design (left) and the built page (right) of the same block at the same scale. List every visible difference: line breaks, spacing above, below and between elements, sizes, alignment, missing or extra elements. Be specific." Fix every real difference it finds, then rerun until it finds none.
5. Save the final pairs as `docs/figma/mobile/audit/img/pass2-<page>-<n>.jpg`.

## Report

Write `docs/figma/mobile/audit/pass2-<group>.md`: block, differences found, fixed or global. Publish to staging (webflow.io only) when done, then report in under 8 lines.

You may use subagents. Send research, codebase extraction and verification (local preview checks, real-data runs, test runs, plan-vs-diff checks) to Sonnet subagents, running independent ones in parallel. Keep planning and core implementation in this session.
