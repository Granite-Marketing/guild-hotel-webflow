"""Generates the data_element_builder schema for the Q009 card carousel section."""
import json

FAMILY = "card-carousel-header-left"
CARDS = [
    ("rooms", "/rooms"),
    ("dining", "/dining"),
    ("wellness", "/wellness"),
    ("meetings & events", "/meetings"),
    ("arts", "/arts"),
    ("history", "/history"),
]
# Figma stagger: tall, square, mid, repeating.
FIGURE_MODIFIERS = [["is-tall"], [], ["is-mid"]]
PREV_ARROW = (
    '<svg width="30" height="14" viewBox="0 0 30 14" fill="none" aria-hidden="true" style="display:block" '
    'xmlns="http://www.w3.org/2000/svg"><path d="M0.75 6.75H29.25M0.75 6.75L6.75 12.75M0.75 6.75L6.75 0.75" '
    'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)
NEXT_ARROW = (
    '<svg width="30" height="14" viewBox="0 0 30 14" fill="none" aria-hidden="true" style="display:block" '
    'xmlns="http://www.w3.org/2000/svg"><path d="M29.25 6.75H0.75M29.25 6.75L23.25 0.75M29.25 6.75L23.25 12.75" '
    'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
)
PLACEHOLDER_IMAGE = "6ad67011134731ad1b928045"


def attrs(pairs):
    return {"attributes": [{"name": k, "value": v} for k, v in pairs]}


def tag(name, classes, children=None, attributes=None):
    node = {"type": "BY_CUSTOM_TAG", "custom_tag": name, "set_style": {"style_names": classes}}
    if children:
        node["children"] = children
    if attributes:
        node["set_attributes"] = attrs(attributes)
    return node


def div(classes, children=None, attributes=None):
    node = {"type": "DivBlock", "set_style": {"style_names": classes}}
    if children:
        node["children"] = children
    if attributes:
        node["set_attributes"] = attrs(attributes)
    return node


def card(index, label, link):
    figure_classes = [f"{FAMILY}_figure"] + FIGURE_MODIFIERS[index % 3]
    return div(
        [f"{FAMILY}_slide", "swiper-slide"],
        [
            {
                "type": "LinkBlock",
                "set_style": {"style_names": [f"{FAMILY}_link"]},
                "set_link": {"link_type": "url", "link": link},
                "children": [
                    tag("figure", figure_classes, [
                        {"type": "Image", "set_style": {"style_names": [f"{FAMILY}_image"]},
                         "set_image_asset": {"image_asset_id": PLACEHOLDER_IMAGE, "alt_text": ""}},
                    ], attributes=[("data-image-placeholder", f"card image {index + 1}")]),
                    {"type": "Paragraph", "set_style": {"style_names": [f"{FAMILY}_label"]},
                     "set_text": {"text": label}},
                ],
            }
        ],
        attributes=[("data-card-carousel-slide", str(index + 1))],
    )


def arrow(direction):
    classes = [f"{FAMILY}_arrow"] + (["is-disabled"] if direction == "prev" else [])
    label = "Previous cards" if direction == "prev" else "Next cards"
    return {
        "type": "LinkBlock",
        "set_style": {"style_names": classes},
        "set_link": {"link_type": "url", "link": "#"},
        "set_attributes": attrs([(f"data-card-carousel-{direction}", "true"), ("aria-label", label)]),
        "children": [{"type": "HtmlEmbed"}],
    }


schema = tag(
    "section",
    [f"section_{FAMILY}", "swiper_slider"],
    [
        div([f"{FAMILY}_component"], [
            div([f"{FAMILY}_content"], [
                tag("header", [f"{FAMILY}_header"], [
                    {"type": "Heading", "set_heading_level": {"heading_level": 2},
                     "set_style": {"style_names": [f"{FAMILY}_heading"]}, "set_text": {"text": "more of the guild"}},
                    {"type": "Paragraph", "set_style": {"style_names": [f"{FAMILY}_text"]},
                     "set_text": {"text": "Duis posuere lorem lacinia justo commodo, id lobortis augue eleifend. "
                                          "Nunc molestie arcu vel tempor maximus."}},
                ]),
                div([f"{FAMILY}_controls"], [arrow("prev"), arrow("next")],
                    attributes=[("data-card-carousel-controls", "true")]),
            ]),
            div([f"{FAMILY}_slider", "swiper", "cards"], [
                div([f"{FAMILY}_slides", "swiper-wrapper"],
                    [card(i, label, link) for i, (label, link) in enumerate(CARDS)]),
            ]),
        ]),
    ],
    attributes=[
        ("data-card-carousel", "true"),
        ("aria-roledescription", "carousel"),
        ("aria-label", "more of the guild"),
    ],
)

if __name__ == "__main__":
    print(json.dumps(schema))
