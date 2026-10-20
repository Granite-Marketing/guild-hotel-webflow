"""Q041 Arts gallery (arts/06): element schema for data_element_builder.

Reuses the Q040 gallery-all family with the is-dark modifier. Each tile is a
filter item (galleryFilter) whose link opens its detail dialog (modals).
After the build, each gallery-all_link gets href "#" through set_settings
(the builder drops hash links).
Run: python3 docs/figma/build-plans/Q041/gallery-schema.py > schema.json
"""
import json

TAGS = ["all", "painting", "photography", "sculpture", "artists"]

# (size combo, category, asset id, dialog id, alt)
TILES = [
    (None, "painting", "6ad66ffb8d039779ba7cb0a7", "artwork-oceano", "Oceano by Eva Struble, oil and acrylic on canvas"),
    ("is-narrow", "artists", "6ad67002c159d4564be772e7", "artist-eva-struble", "Eva Struble seated in front of her paintings"),
    ("is-wide", "photography", "6ad6701cf08ff78c37d862e1", "artwork-03", "Artwork in The Guild collection"),
    (None, "painting", "6ad670147e3d6550932e0fac", "artwork-04", "Artwork in The Guild collection"),
    ("is-narrow", "photography", "6ad67007cf42363c3ffe3d61", "artwork-05", "Artwork in The Guild collection"),
    ("is-narrow", "sculpture", "6ad67011134731ad1b928045", "artwork-06", "Artwork in The Guild collection"),
    ("is-wide", "painting", "6ad66ff96684c3e22ea4e1af", "artwork-07", "Artwork in The Guild collection"),
    ("is-wide", "photography", "6ad66fff134731ad1b927c11", "artwork-08", "Artwork in The Guild collection"),
    ("is-narrow", "sculpture", "6ad67017fb3a14e0db41143b", "artwork-09", "Artwork in The Guild collection"),
    (None, "painting", "6ad66ff0f8bf4846e809ead6", "artwork-10", "Artwork in The Guild collection"),
]


def attrs(**kv):
    return {"attributes": [{"name": k.replace("_", "-"), "value": v} for k, v in kv.items()]}


def tile(size, category, asset, dialog, alt):
    return {
        "type": "BY_CUSTOM_TAG",
        "custom_tag": "figure",
        "set_style": {"style_names": ["gallery-all_item"] + ([size] if size else [])},
        "set_attributes": attrs(data_gallery_filter_item=category),
        "children": [{
            "type": "LinkBlock",
            "set_style": {"style_names": ["gallery-all_link"]},
            "set_attributes": attrs(
                data_modal_open=dialog,
                aria_haspopup="dialog",
                aria_expanded="false",
                aria_label=f"View details: {alt}",
            ),
            "children": [{
                "type": "Image",
                "set_style": {"style_names": ["u-image"]},
                "set_image_asset": {"image_asset_id": asset, "alt_text": alt},
            }],
        }],
    }


def tag(name, active):
    return {
        "type": "TextLink",
        "set_style": {"style_names": ["tab-pills-intro_tab", "text-style-eyebrow-caps"] + (["is-active"] if active else [])},
        "set_text": {"text": name},
        "set_attributes": attrs(data_gallery_filter_tag=name, role="button", aria_pressed="true" if active else "false"),
    }


schema = {
    "type": "BY_CUSTOM_TAG",
    "custom_tag": "section",
    "set_style": {"style_names": ["section_gallery-all", "is-dark"]},
    "set_attributes": attrs(data_gallery_filter="true", aria_label="Art collection"),
    "children": [
        {"type": "DivBlock", "set_style": {"style_names": ["gallery-all_grid"]}, "children": [tile(*t) for t in TILES]},
        {"type": "DivBlock", "set_style": {"style_names": ["gallery-all_tags-wrapper"]}, "children": [{
            "type": "BY_CUSTOM_TAG", "custom_tag": "nav",
            "set_style": {"style_names": ["tab-pills-intro_tabs"]},
            "set_attributes": attrs(aria_label="Art categories"),
            "children": [tag(name, i == 0) for i, name in enumerate(TAGS)],
        }]},
    ],
}

print(json.dumps(schema))
