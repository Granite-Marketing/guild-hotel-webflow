"""Generates the data_element_builder schema for the Q008 offers slider section."""
import json

RETAIL_IMAGE = "6ad67011134731ad1b928045"
SLIDES = [
    ("save on 5+ nights", "A comfortable king room for an effortless city getaway."),
    ("wellness staycation", "Nullam scelerisque mollis ex sed aliquam, mauris ultrices massa"),
    ("save on 5+ nights", "A comfortable king room for an effortless city getaway."),
    ("wellness staycation", "Nullam scelerisque mollis ex sed aliquam, mauris ultrices massa"),
    ("save on 5+ nights", "A comfortable king room for an effortless city getaway."),
]


def tag(name, classes, children=None, attributes=None):
    node = {"type": "BY_CUSTOM_TAG", "custom_tag": name, "set_style": {"style_names": classes}}
    if children:
        node["children"] = children
    if attributes:
        node["set_attributes"] = {"attributes": [{"name": k, "value": v} for k, v in attributes]}
    return node


def div(classes, children=None, attributes=None):
    node = {"type": "DivBlock", "set_style": {"style_names": classes}}
    if children:
        node["children"] = children
    if attributes:
        node["set_attributes"] = {"attributes": [{"name": k, "value": v} for k, v in attributes]}
    return node


def span(classes, text, attributes=()):
    settings = [{"key": "text", "static_text": {"value": text}}]
    node = {"type": "DOM", "set_dom_config": {"dom_tag": "span"}, "settings": settings}
    if classes:
        node["set_style"] = {"style_names": classes}
    if attributes:
        node["set_attributes"] = {"attributes": [{"name": k, "value": v} for k, v in attributes]}
    return node


def slide(number, heading, text):
    return div(
        ["offers-slider-split_slide", "swiper-slide"],
        [
            tag("article", ["offers-slider-split_item"], [
                div(["offers-slider-split_content"], [
                    tag("header", ["offers-slider-split_header"], [
                        {"type": "Heading", "set_heading_level": {"heading_level": 2},
                         "set_style": {"style_names": ["offers-slider-split_heading"]}, "set_text": {"text": heading}},
                        {"type": "Paragraph", "set_style": {"style_names": ["offers-slider-split_text"]},
                         "set_text": {"text": text}},
                    ]),
                    tag("footer", ["offers-slider-split_footer"], [
                        {"type": "TextLink", "set_style": {"style_names": ["offers-slider-split_button"]},
                         "set_text": {"text": "discover more"}, "set_link": {"link_type": "url", "link": "#"}},
                    ]),
                ]),
                tag("figure", ["offers-slider-split_figure"], [
                    {"type": "Image", "set_style": {"style_names": ["offers-slider-split_image"]},
                     "set_image_asset": {"image_asset_id": RETAIL_IMAGE, "alt_text": ""}},
                ], attributes=[("data-image-placeholder", f"offer image {number}")]),
            ]),
        ],
        attributes=[("data-offers-slide", str(number))],
    )


def arrow(direction):
    classes = ["offers-slider-split_arrow"] + (["is-prev"] if direction == "prev" else [])
    label = "Previous offer" if direction == "prev" else "Next offer"
    return {
        "type": "LinkBlock",
        "set_style": {"style_names": classes},
        "set_link": {"link_type": "url", "link": "#"},
        "set_attributes": {"attributes": [
            {"name": f"data-offers-slider-{direction}", "value": "true"},
            {"name": "aria-label", "value": label},
        ]},
        "children": [{"type": "HtmlEmbed"}],
    }


schema = tag(
    "section",
    ["section_offers-slider-split", "swiper_slider"],
    [
        div(["offers-slider-split_slider", "swiper", "offers"], [
            div(["offers-slider-split_slides", "swiper-wrapper"],
                [slide(i + 1, h, t) for i, (h, t) in enumerate(SLIDES)]),
        ]),
        div(["offers-slider-split_overlay"], [
            {"type": "Paragraph", "set_style": {"style_names": ["offers-slider-split_eyebrow"]},
             "set_text": {"text": "offers & packages"}},
            div(["offers-slider-split_controls"], [
                arrow("prev"),
                div(["offers-slider-split_counter"], [
                    span([], "01", [("data-offers-slider-current", "true")]),
                    span([], "/", [("aria-hidden", "true")]),
                    span(["offers-slider-split_total"], "05", [("data-offers-slider-total", "true")]),
                ]),
                arrow("next"),
            ], attributes=[("data-offers-slider-controls", "true")]),
        ]),
    ],
    attributes=[
        ("data-offers-slider", "true"),
        ("aria-roledescription", "carousel"),
        ("aria-label", "offers & packages"),
    ],
)

print(json.dumps(schema))
