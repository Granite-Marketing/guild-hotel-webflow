---
"@granite-marketing/webflow-mcp-starter": patch
---

Hexagon buttons draw their fill and 1px outline in an inline SVG added by buttonHover, so the diagonals are as crisp and even as the straight edges at every zoom and no corner thins at half-pixel positions (#190). The CSS ring stays as the Designer and pre-script fallback.
