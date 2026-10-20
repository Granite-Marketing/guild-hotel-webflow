"""Generates the Q006 overlay-detail-panel-modal styles and data_element_builder schema.

Usage: python3 build-schema.py styles|schema
"""
import json
import sys

P = "overlay-detail-panel-modal"
CREAM = "relume-variable--neutral-shade-1"
DARK = "relume-variable--neutral-shade-7"
OLIVE = "variable-0e074b1e-1a30-44cc-29cb-a5babd8773c3"
BURGUNDY = "variable-c75988d0-38f7-9a2f-b9d7-c4fb2dfa0e81"
HEADING_FONT = "relume-variable--font-style-heading"
IMAGE = "6ad67011134731ad1b928045"
CHAMFER = ("polygon(0 0.75rem, 0.6875rem 0, calc(100% - 0.6875rem) 0, 100% 0.75rem, "
           "100% calc(100% - 0.75rem), calc(100% - 0.6875rem) 100%, 0.6875rem 100%, 0 calc(100% - 0.75rem))")
PANEL_CHAMFER = "polygon(2.5rem 0, calc(100% - 2.5rem) 0, 100% 2.5rem, 100% 100%, 0 100%, 0 2.5rem)"


def var(v):
    return {"variable_as_value": v}


def caps(size="1rem"):
    return {"font-family": var(HEADING_FONT), "font-weight": "900", "font-size": size,
            "line-height": "1.2", "letter-spacing": "-0.03em", "text-transform": "lowercase"}


# Base = the meetings-collection/14 cream panel. Variants override (see plan.md).
STYLES = {
    "_component": {
        "position": "fixed", "top": "0", "right": "0", "bottom": "0", "left": "0", "z-index": "1000",
        "display": "flex", "justify-content": "center", "align-items": "flex-start",
        "overflow-y": "auto",         "opacity": "0", "visibility": "hidden", "pointer-events": "none",
        "transition": "opacity 400ms ease, visibility 400ms ease", "color": var(OLIVE),
    },
    "_backdrop": {
        "position": "fixed", "top": "0", "right": "0", "bottom": "0", "left": "0",
        "background-color": "rgba(38, 33, 24, 0.6)", "cursor": "pointer",
    },
    "_panel": {
        "position": "relative", "z-index": "1", "width": "100%", "min-height": "calc(100vh - 7.5rem)",
        "margin-top": "7.5rem", "padding-top": "3.25rem", "padding-right": "5.5rem",
        "padding-bottom": "5.5rem", "padding-left": "5.5rem",
        "background-color": var(CREAM), "clip-path": PANEL_CHAMFER,
    },
    "_bar": {
        "position": "absolute", "top": "3.25rem", "left": "1.5rem", "right": "1.5rem", "z-index": "2",
        "display": "flex", "justify-content": "space-between", "align-items": "center",
        "pointer-events": "none",
    },
    "_back": {
        "display": "flex", "align-items": "center", "column-gap": "0.5rem",
        "color": "inherit", "text-decoration": "none", "pointer-events": "auto", **caps(),
    },
    "_back-icon": {"display": "flex", "width": "1.5rem", "height": "1.5rem"},
    "_back-label": {"display": "none"},
    "_close": {
        "display": "none", "width": "2.5rem", "height": "2.5rem", "margin-left": "auto",
        "justify-content": "center", "align-items": "center", "color": "inherit", "pointer-events": "auto",
    },
    "_layout": {"display": "flex", "flex-direction": "column", "row-gap": "2.5rem"},
    "_figure": {
        "order": "1", "width": "100%", "aspect-ratio": "1421 / 707", "margin-top": "0", "margin-right": "0", "margin-bottom": "0", "margin-left": "0",
        "overflow-x": "hidden", "overflow-y": "hidden", "background-color": "#d9d9d9",
    },
    "_image": {"display": "block", "width": "100%", "height": "100%", "object-fit": "cover"},
    "_content": {"display": "flex", "flex-direction": "column", "row-gap": "6rem"},
    "_header": {
        "display": "flex", "flex-direction": "column", "align-items": "center",
        "row-gap": "0.75rem", "text-align": "center",
    },
    "_heading": {
        "margin-top": "0", "margin-bottom": "0", "font-family": var(HEADING_FONT), "font-weight": "900",
        "font-size": "2.5rem", "line-height": "1", "letter-spacing": "-0.05em", "color": "inherit",
    },
    "_eyebrow": {"margin-top": "0", "margin-bottom": "0", **caps()},
    "_caption": {"margin-top": "0", "margin-bottom": "0", "white-space": "pre-line", **caps()},
    "_body": {
        "display": "grid", "grid-template-columns": "1fr 1fr", "column-gap": "10rem",
        "row-gap": "3rem", "padding-left": "5rem", "padding-right": "5rem",
    },
    "_column": {"display": "flex", "flex-direction": "column", "row-gap": "1.25rem", "max-width": "30.5rem"},
    "_subheading": {
        "margin-top": "0", "margin-bottom": "0", "font-family": var(HEADING_FONT), "font-weight": "900",
        "font-size": "1.5rem", "line-height": "1.2", "text-transform": "lowercase", "color": "inherit",
    },
    "_text": {"margin-top": "0", "margin-bottom": "0", "font-size": "1.25rem", "line-height": "1.3",
              "white-space": "pre-line"},
    "_extras": {"display": "flex", "flex-direction": "column", "row-gap": "1.25rem", "margin-top": "2.5rem"},
    "_options": {"margin-top": "0", "margin-bottom": "0", "font-size": "1.25rem", "line-height": "1.7",
                 "white-space": "pre-line", "column-count": "2", "column-gap": "2rem", "max-width": "28rem"},
    "_link": {"align-self": "flex-start", "color": "inherit", "text-decoration": "underline", **caps("0.875rem")},
    "_note": {"margin-top": "0", "margin-bottom": "0", **caps("0.875rem")},
    "_list": {"display": "flex", "flex-direction": "column"},
    "_item": {"display": "flex", "column-gap": "3rem", "padding-top": "1.5rem", "padding-bottom": "1.5rem",
              "border-bottom-width": "1px", "border-bottom-style": "solid", "border-bottom-color": "rgba(41, 49, 12, 0.4)"},
    "_item-figure": {"display": "none", "flex-grow": "0", "flex-shrink": "0", "flex-basis": "15.625rem", "aspect-ratio": "250 / 186", "margin-top": "0", "margin-right": "0", "margin-bottom": "0", "margin-left": "0",
                     "overflow-x": "hidden", "overflow-y": "hidden", "background-color": "#d9d9d9"},
    "_item-image": {"display": "block", "width": "100%", "height": "100%", "object-fit": "cover"},
    "_item-content": {"display": "flex", "flex-direction": "column", "align-items": "flex-start",
                      "row-gap": "1.25rem"},
    "_item-heading": {"display": "flex", "align-items": "flex-start", "column-gap": "0.375rem"},
    "_item-number": {"font-size": "0.75rem", "line-height": "1"},
    "_item-title": {"margin-top": "0", "margin-bottom": "0", "font-size": "1.25rem", "line-height": "1.3"},
    "_item-text": {"display": "none", "margin-top": "0", "margin-bottom": "0", "font-size": "1.25rem", "line-height": "1.3"},
    "_item-button": {
        "display": "none", "min-height": "2.3125rem", "margin-top": "2rem",
        "padding-top": "0.5625rem", "padding-right": "1.5rem", "padding-bottom": "0.5625rem", "padding-left": "1.5rem",
        "justify-content": "center", "align-items": "center", "background-color": var(CREAM),
        "color": var(BURGUNDY), "font-family": var(HEADING_FONT), "font-size": "1rem", "line-height": "1",
        "font-weight": "900", "text-align": "center", "text-decoration": "none", "text-transform": "lowercase",
        "clip-path": CHAMFER,
    },
    "_footer": {"position": "absolute", "top": "3.25rem", "right": "5.5rem", "z-index": "2", "display": "flex"},
    "_button": {
        "display": "inline-flex", "min-height": "2.3125rem",
        "padding-top": "0.5625rem", "padding-right": "1.5rem", "padding-bottom": "0.5625rem", "padding-left": "1.5rem",
        "justify-content": "center", "align-items": "center", "background-color": var(DARK), "color": var(CREAM),
        "font-family": var(HEADING_FONT), "font-size": "1rem", "line-height": "1", "font-weight": "900",
        "text-align": "center", "text-decoration": "none", "text-transform": "lowercase", "clip-path": CHAMFER,
    },
}

# Base tablet and mobile: stack everything. Set on the base class so it also wins over a
# variant's desktop rule at these widths (same specificity, later in the stylesheet).
MEDIUM = {
    "_panel": {"padding-top": "5.5rem", "padding-right": "2rem", "padding-bottom": "3rem", "padding-left": "2rem",
               "margin-top": "5rem"},
    "_bar": {"top": "1.5rem", "left": "1rem", "right": "1rem"},
    "_layout": {"display": "flex", "flex-direction": "column"},
    "_body": {"grid-template-columns": "1fr", "padding-left": "0", "padding-right": "0"},
    "_content": {"row-gap": "3rem"},
    "_footer": {"position": "static"},
}
SMALL = {
    "_panel": {"padding-left": "1.25rem", "padding-right": "1.25rem", "margin-top": "3rem"},
    "_heading": {"font-size": "1.875rem"},
    "_item": {"flex-direction": "column", "row-gap": "1.25rem"},
    "_item-figure": {"flex-basis": "auto", "width": "100%"},
}

# Variant styles: name -> {breakpoint: {suffix: props}}
VARIANTS = {
    "Dark": {"main": {
        "_component": {"align-items": "stretch", "color": var(CREAM)},
        "_panel": {"margin-top": "0", "min-height": "100vh", "padding-top": "3.25rem", "padding-right": "4.5rem",
                   "padding-bottom": "3.25rem", "padding-left": "4.5rem", "background-color": var(DARK), "clip-path": "none"},
        "_bar": {"top": "2.375rem", "left": "57%", "right": "4.5rem"},
        "_back-label": {"display": "block"},
        "_back-icon": {"width": "1rem", "height": "1rem"},
        "_layout": {"display": "grid", "grid-template-columns": "681fr 534fr", "column-gap": "10rem",
                    "min-height": "calc(100vh - 6.5rem)"},
        "_figure": {"order": "0", "aspect-ratio": "auto"},
        "_content": {"justify-content": "flex-end", "row-gap": "2.5rem", "padding-top": "4rem"},
        "_header": {"align-items": "flex-start", "text-align": "left"},
        "_heading": {"font-size": "1.875rem"},
        "_body": {"display": "block", "padding-left": "0", "padding-right": "0"},
        "_footer": {"position": "static"},
    }, "medium": {"_figure": {"aspect-ratio": "681 / 796"}, "_bar": {"left": "1rem"},
                  "_panel": {"margin-top": "0", "padding-top": "4.5rem"}}},
    "Image Bg": {"main": {
        "_component": {"align-items": "stretch", "color": var(CREAM)},
        "_panel": {"margin-top": "0", "min-height": "100vh", "padding-top": "0", "padding-right": "0",
                   "padding-bottom": "0", "padding-left": "0", "background-color": var(BURGUNDY), "clip-path": "none"},
        "_bar": {"top": "3.5rem", "left": "54.625%", "right": "3rem"},
        "_back": {"font-size": "1.125rem", "letter-spacing": "0em"},
        "_back-icon": {"display": "none"},
        "_back-label": {"display": "block"},
        "_close": {"display": "flex"},
        "_layout": {"display": "grid", "grid-template-columns": "1fr 1fr", "column-gap": "0", "min-height": "100vh"},
        "_figure": {"order": "0", "aspect-ratio": "auto", "height": "100vh", "position": "sticky", "top": "0"},
        "_content": {"padding-top": "8.625rem", "padding-right": "4.5rem", "padding-bottom": "4rem", "padding-left": "4.625rem"},
        "_body": {"display": "block", "padding-left": "0", "padding-right": "0"},
        "_list": {"row-gap": "3rem"},
        "_item": {"padding-top": "0", "padding-bottom": "0", "border-bottom-width": "0px"},
        "_item-figure": {"display": "block"},
        "_item-number": {"display": "none"},
        "_item-title": {"font-family": var(HEADING_FONT), "font-weight": "900", "font-size": "1.5rem", "line-height": "1.2",
                        "text-transform": "lowercase"},
        "_item-text": {"display": "block"},
        "_item-button": {"display": "inline-flex"},
        "_footer": {"position": "static"},
    }, "medium": {"_figure": {"height": "auto", "aspect-ratio": "4 / 3", "position": "relative"},
                  "_bar": {"left": "1rem", "right": "1rem"},
                  "_panel": {"margin-top": "0", "padding-top": "0", "padding-right": "0", "padding-bottom": "0", "padding-left": "0"},
                  "_content": {"padding-top": "0.5rem", "padding-left": "2rem", "padding-right": "2rem"}}},
    "Burgundy": {"main": {
        "_component": {"justify-content": "flex-end", "padding-top": "1.5rem", "padding-right": "1.5rem",
                       "padding-left": "1.5rem", "color": var(CREAM)},
        "_panel": {"margin-top": "0", "width": "48.75rem", "min-height": "0", "padding-top": "0", "padding-right": "0",
                   "padding-bottom": "0", "padding-left": "0", "background-color": var(BURGUNDY), "clip-path": "none"},
        "_bar": {"top": "2rem", "left": "auto", "right": "2rem"},
        "_back": {"display": "none"},
        "_close": {"display": "flex"},
        "_layout": {"display": "grid", "grid-template-columns": "21rem 1fr", "column-gap": "0"},
        "_figure": {"order": "0", "aspect-ratio": "336 / 434"},
        "_content": {"padding-top": "7rem", "padding-right": "3rem", "padding-bottom": "1.5rem", "padding-left": "3.375rem"},
        "_body": {"display": "block", "padding-left": "0", "padding-right": "0"},
        "_list": {"row-gap": "2.5rem"},
        "_item": {"padding-top": "0", "padding-bottom": "0", "border-bottom-width": "0px"},
        "_item-heading": {"display": "none"},
        "_item-button": {"display": "inline-flex", "min-height": "0", "margin-top": "0", "padding-top": "0",
                         "padding-right": "0", "padding-bottom": "0", "padding-left": "0", "background-color": "transparent",
                         "color": var(CREAM), "font-size": "1.3125rem", "clip-path": "none", "opacity": "0.55",
                         "text-align": "left", "justify-content": "flex-start"},
        "_footer": {"position": "static"},
    }, "medium": {"_panel": {"width": "100%", "margin-top": "0", "padding-top": "0", "padding-right": "0",
                             "padding-bottom": "0", "padding-left": "0"},
                  "_figure": {"aspect-ratio": "16 / 9"},
                  "_content": {"padding-top": "0.5rem", "padding-bottom": "2.5rem", "padding-left": "2rem", "padding-right": "2rem"}}},
    "Centered": {"main": {
        "_content": {"row-gap": "6.5rem"},
        "_body": {"display": "block", "padding-left": "0", "padding-right": "0"},
        "_column": {"max-width": "52rem", "margin-left": "auto", "margin-right": "auto", "text-align": "center"},
        "_footer": {"position": "static", "justify-content": "center", "margin-top": "-3.25rem"},
    }, "medium": {"_footer": {"margin-top": "0"}}},
}
# Base small-breakpoint rules come after a variant's medium rules, so the full-bleed variants repeat
# their panel reset at small.
for _name, _props in (("Dark", {"margin-top": "0"}),
                      ("Image Bg", {"margin-top": "0", "padding-left": "0", "padding-right": "0"}),
                      ("Burgundy", {"margin-top": "0", "padding-left": "0", "padding-right": "0"})):
    VARIANTS[_name]["small"] = {"_panel": _props}
HOVER_VARIANT = {"Burgundy": {"_item-button": {"opacity": "1"}}}


def props_list(d):
    out = []
    for k, v in d.items():
        if isinstance(v, dict):
            out.append({"property_name": k, **v})
        else:
            out.append({"property_name": k, "property_value": v})
    return out


def style_actions():
    acts = []
    for suffix, props in STYLES.items():
        acts.append({"label": suffix, "create_style": {"name": P + suffix, "properties": props_list(props)}})
    acts.append({"label": "is-open", "create_style": {"name": "is-open", "parent_style_names": [P + "_component"],
                 "properties": props_list({"opacity": "1", "visibility": "visible", "pointer-events": "auto"})}})
    for bp, table in (("medium", MEDIUM), ("small", SMALL)):
        for suffix, props in table.items():
            acts.append({"label": f"{suffix}@{bp}", "update_style": {"style_name": P + suffix, "breakpoint_id": bp,
                         "properties": props_list(props)}})
    acts.append({"label": "item last", "update_style": {"style_name": P + "_item", "pseudo": "last-child",
                 "properties": props_list({"border-bottom-width": "0px"})}})
    acts.append({"label": "item-button hover", "update_style": {"style_name": P + "_item-button", "pseudo": "hover",
                 "properties": props_list({"opacity": "0.85"})}})
    return acts


def variant_actions(ids):
    acts = []
    for name, bps in VARIANTS.items():
        for bp, table in bps.items():
            for suffix, props in table.items():
                acts.append({"label": f"{name} {suffix}@{bp}", "set_variant_styles": {
                    "variant_id": ids[name], "style_name": P + suffix, "breakpoint_id": bp,
                    "properties": props_list(props)}})
    for name, table in HOVER_VARIANT.items():
        for suffix, props in table.items():
            acts.append({"label": f"{name} {suffix}:hover", "set_variant_styles": {
                "variant_id": ids[name], "style_name": P + suffix, "breakpoint_id": "main", "pseudo": "hover",
                "properties": props_list(props)}})
    return acts


# ---------- elements ----------

def node(type_, cls, children=None, attrs=None, **extra):
    n = {"type": type_, "set_style": {"style_names": [P + cls]}}
    n.update(extra)
    if children:
        n["children"] = children
    if attrs:
        n["set_attributes"] = {"attributes": [{"name": k, "value": v} for k, v in attrs]}
    return n


def tag(t, cls, children=None, attrs=None):
    return node("BY_CUSTOM_TAG", cls, children, attrs, custom_tag=t)


def div(cls, children=None, attrs=None):
    return node("DivBlock", cls, children, attrs)


def para(cls, text):
    return node("Paragraph", cls, set_text={"text": text})


def heading(level, cls, text):
    return node("Heading", cls, set_heading_level={"heading_level": level}, set_text={"text": text})


def span(cls, text, attrs=None):
    n = {"type": "DOM", "set_dom_config": {"dom_tag": "span"}, "set_style": {"style_names": [P + cls]},
         "settings": [{"key": "text", "static_text": {"value": text}}]}
    if attrs:
        n["set_attributes"] = {"attributes": [{"name": k, "value": v} for k, v in attrs]}
    return n


ITEMS = [
    ("510 SQ FT", "Contemporary Japanese dining.", "reserve"),
    ("Modern executive seating for 12", "Cocktails, light bites and an intimate atmosphere.", "reserve"),
    ("Premium conference table with ultra connectivity",
     "Flexible spaces for meetings, celebrations, and everything worth gathering for.", "reserve"),
    ("Oversized, built-in hi-res TV", "Flexible spaces for meetings, celebrations, and everything worth gathering for.", "reserve"),
    ("Capacity: 50+", "", "reserve"),
]

PARAGRAPH = ("Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis non. Proin tortor felis, fringilla eu "
             "tincidunt a, facilisis ultrices massa. Suspendisse viverra interdum elit, vitae vestibulum lectus iaculis "
             "non. Proin tortor felis, fringilla eu tincidunt a, facilisis ultrices massa.")
OPTIONS = "Classroom: 21*\nU-shape: 21\nRounds: 21\nTheater: 21\nConference: 21*\nReception: 21"


def item(n, title, text, button):
    return div("_item", [
        tag("figure", "_item-figure", [node("Image", "_item-image",
                                            set_image_asset={"image_asset_id": IMAGE, "alt_text": ""})],
            attrs=[("data-image-placeholder", f"item image {n}")]),
        div("_item-content", [
            div("_item-heading", [span("_item-number", str(n), [("aria-hidden", "true")]), para("_item-title", title)]),
            para("_item-text", text or "Flexible spaces for meetings, celebrations, and everything worth gathering for."),
            node("TextLink", "_item-button", set_text={"text": button}, set_link={"link_type": "url", "link": "#"}),
        ]),
    ], attrs=[("role", "listitem")])


def schema():
    return div("_component", [
        div("_backdrop", attrs=[("data-modal-close", "true"), ("aria-hidden", "true")]),
        div("_panel", [
            div("_bar", [
                node("LinkBlock", "_back", [
                    div("_back-icon", [{"type": "HtmlEmbed"}]),
                    span("_back-label", "back"),
                ], attrs=[("data-modal-close", "true"), ("aria-label", "Close")], set_link={"link_type": "url", "link": "#"}),
                node("LinkBlock", "_close", [{"type": "HtmlEmbed"}],
                     attrs=[("data-modal-close", "true"), ("aria-label", "Close")], set_link={"link_type": "url", "link": "#"}),
            ]),
            div("_layout", [
                tag("figure", "_figure", [node("Image", "_image",
                                               set_image_asset={"image_asset_id": IMAGE, "alt_text": ""})],
                    attrs=[("data-image-placeholder", "modal image")]),
                div("_content", [
                    tag("header", "_header", [
                        heading(2, "_heading", "council boardroom"),
                        para("_eyebrow", "by eva struble"),
                        para("_caption", "2024 | 48 x 60 in\nOil and acrylic on canvas"),
                    ]),
                    div("_body", [
                        div("_column", [
                            heading(3, "_subheading", "details"),
                            para("_text", PARAGRAPH),
                            div("_extras", [
                                heading(3, "_subheading", "layout options"),
                                para("_options", OPTIONS),
                                node("TextLink", "_link", set_text={"text": "floorplan"},
                                     set_link={"link_type": "url", "link": "#"}),
                                para("_note", "*requires furniture removal, charges may apply"),
                            ]),
                        ]),
                        div("_list", [item(i + 1, *it) for i, it in enumerate(ITEMS)], attrs=[("role", "list")]),
                    ]),
                    tag("footer", "_footer", [
                        node("TextLink", "_button", set_text={"text": "submit your request"},
                             set_link={"link_type": "url", "link": "#"}),
                    ]),
                ]),
            ]),
        ]),
    ], attrs=[("role", "dialog"), ("aria-modal", "true"), ("aria-hidden", "true"), ("tabindex", "-1"),
              ("data-modal-no-overlay", "true")])


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "styles":
        print(json.dumps(style_actions()))
    elif mode == "schema":
        print(json.dumps(schema()))
    elif mode == "variants":
        print(json.dumps(variant_actions(json.loads(sys.argv[2]))))
