# Review stage, round 1 (head 0e6664f)

Verdict: fix first. 2 P2 and 8 P3 findings; nothing blocks on standards or library choice.

1. Fade-in reveals on the contact/RFP form fields and FAQ rows hide them from keyboard and screen-reader users until they are scrolled into view. Fix: fade with opacity only.
2. Tapping the mobile subnav toggle twice quickly can leave the menu collapsed while it reports as open. Fix: cancel the running animation properly.
3. The scroll-jump fix (#230) is well diagnosed, but by the builder's own note it does nothing on iPhone Safari. The live check in the release ticket must test a real iPhone.
4. Smaller items: focus-ring edge cases, the Home collage is not staggered when images arrive together, a Directions rel overwrite, two test gaps and a docs gap.

At merge, Stephen should know two things. The room gallery "restore" re-applies today's image fade from code, because the earlier one was removed in the Designer and not in git. The George Marston tilt on phones is set in a site-head CSS reference file, which may overlap the companion Webflow spec.

Artefacts: docs/builds/228/review.md, docs/builds/228/review/ce-code-review.json, docs/builds/228/review/two-axis.md
