# Style & Component Inventory

This document is the **live reference** for what already exists in The Guild Hotel Webflow project. Before creating ANY new style or element, check here first. If a match exists, reuse it.

**Last updated:** 2026-10-19 (Q004 added 13 static pages; no styles or components changed, so the baseline below still matches the live site)

**Status:** Baseline only. The site currently holds the Relume starter style guide and no project components. The first build session must regenerate this file from the live site (`style_tool > get_styles(query: "all", skip_properties: false)` and `de_component_tool > get_all_components`) before building anything.

---

## Existing Components (Reusable)

| Component | ID | Instances | Use For |
|---|---|---|---|
| Global Styles | `ab488b17-f25a-fbf8-5f54-4a3955eb57e5` | | Relume global styles embed (do not edit) |

Navbar, modals and overlays, and sliders are built by hand in the Designer (see `docs/figma/inventory.md`). Add them here once they exist so agent builds insert instances instead of rebuilding.

## Typography

Relume starter classes: `heading-style-h1` to `heading-style-h6`, `text-size-*`, `text-weight-*`, `text-align-*`. The Figma type scale and its proposed mapping onto these classes live in `figma/tokens.json`.

## Layout, Decorative and Component Families

None yet. Record each shared class family here as build sessions create it (name, purpose, where used).

---

## How to Use This Inventory

1. **Before every build session**, query `style_tool > get_styles(query: "all")` and cross-reference with this doc
2. **Match Figma text sizes** to existing typography styles using `figma/tokens.json`; don't default to heading-style-h1 through h6
3. **Check components first**: if a section pattern exists as a component, insert an instance instead of building
4. **Reuse layout utilities**: aspect ratios, overlays, shadows, z-index helpers
5. **Use generic names** for new shared patterns (describe the layout, not the content)
6. **Update this doc** after each build with any new styles/components created
