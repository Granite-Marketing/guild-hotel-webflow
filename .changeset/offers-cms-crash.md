---
"@granite-marketing/webflow-mcp-starter": patch
---

Fix: the CMS-driven Offers slider on Home crashed on load (its Collection List wrapper sat between the slider and its slides), which stopped every animation after it, including nav colour changes. The slider now lifts its slides into place, so all page animations run again.
