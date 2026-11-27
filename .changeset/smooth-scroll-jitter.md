---
'@granite-marketing/webflow-mcp-starter': patch
---

Smoother scrolling: the nav colour mask only updates while the page is moving (no idle work), image fades keep their layer until off screen so the end of the zoom no longer repaints the photo mid-scroll, and line-mask text is split ahead of time while the browser is idle.
