"""Element schema for neighborhood/08-corporate-services (section_neighborhood-corporate)."""
import json

TEXT = ("Pellentesque dui metus, tempus vel sodales sit amet, lobortis ac arcu. Proin varius "
        "semper tempor. Nam ac lobortis orci. Morbi ullamcorper rutrum varius. Integer nunc odio,")
CARDS = ["san diego convention center", "san diego superior court"] * 2


def card(title):
    return {"type": "BY_CUSTOM_TAG", "custom_tag": "article",
            "set_style": {"style_names": ["neighborhood-corporate_item"]},
            "children": [
                {"type": "BY_CUSTOM_TAG", "custom_tag": "figure",
                 "set_style": {"style_names": ["neighborhood-corporate_figure"]},
                 "set_attributes": {"attributes": [{"name": "data-image-placeholder", "value": title + " photo"}]}},
                {"type": "DivBlock", "set_style": {"style_names": ["neighborhood-corporate_content"]},
                 "children": [
                     {"type": "BY_CUSTOM_TAG", "custom_tag": "header", "children": [
                         {"type": "Heading", "set_heading_level": {"heading_level": 3},
                          "set_style": {"style_names": ["neighborhood-corporate_title"]},
                          "set_text": {"text": title}}]},
                     {"type": "Paragraph", "set_style": {"style_names": ["neighborhood-corporate_text"]},
                      "set_text": {"text": TEXT}}]}]}


schema = {"type": "Section",
          "set_style": {"style_names": ["section_neighborhood-corporate"]},
          "children": [{"type": "DivBlock", "set_style": {"style_names": ["padding-global", "padding-section-large"]},
                        "children": [{"type": "DivBlock", "set_style": {"style_names": ["neighborhood-corporate_component"]},
                                      "children": [
                                          {"type": "BY_CUSTOM_TAG", "custom_tag": "header",
                                           "set_style": {"style_names": ["neighborhood-corporate_header"]},
                                           "children": [{"type": "Heading", "set_heading_level": {"heading_level": 2},
                                                         "set_style": {"style_names": ["neighborhood-corporate_heading"]},
                                                         "set_text": {"text": "corporate & services"}}]},
                                          {"type": "DivBlock", "set_style": {"style_names": ["neighborhood-corporate_list"]},
                                           "children": [card(t) for t in CARDS]},
                                          {"type": "BY_CUSTOM_TAG", "custom_tag": "footer",
                                           "set_style": {"style_names": ["neighborhood-corporate_footer"]},
                                           "children": [
                                               {"type": "Paragraph", "set_style": {"style_names": ["neighborhood-corporate_caption"]},
                                                "set_text": {"text": TEXT}},
                                               {"type": "TextLink", "set_style": {"style_names": ["button", "is-chamfer", "is-text-burgundy"]},
                                                "set_text": {"text": "corporate & legal packages"},
                                                "set_link": {"link_type": "url", "link": "/meetings"}}]}]}]}]}

print(json.dumps(schema))
