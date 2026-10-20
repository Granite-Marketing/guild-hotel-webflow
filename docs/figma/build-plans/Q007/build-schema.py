"""Generates the Q007 room-list-hover-preview element schema (data_element_builder)."""
import json

P = 'room-list-hover-preview_'
ALT = {
    '6ad67004134731ad1b927d6c': 'Guest room with a tan upholstered headboard, white bedding and an arched window',
    '6ad66feb58367429abb4835f': 'Guest relaxing in bed in a robe with a tan channel headboard and breakfast tray',
    '6ad67017fb3a14e0db41143b': 'Bright guest room with white beams, a striped sofa, garment rail and a king bed',
    '6ad66ff0f8bf4846e809ead6': 'Light guest room with two beds, a tan lounge chair and tall factory windows',
    '6ad66ff96684c3e22ea4e1af': 'Suite with green panelled walls, brass lamps and a large made bed',
    '6ad67001f08ff78c37d85427': 'Loft suite living area with a wooden dining table, green sofa and tall windows',
    '6ad6701a28c5dc695c82c539': 'Couple celebrating on a suite bed with a tan headboard',
}
ROOMS = [
    # key, name, category, guests, size, asset
    ('cozy-queen', 'cozy queen', 'room', '2 guests', '20 m² size', '6ad67004134731ad1b927d6c'),
    ('cozy-king', 'cozy king', 'room', '2 guests', '22 m² size', '6ad66feb58367429abb4835f'),
    ('cozy-courtyard-queen', 'cozy courtyard queen', 'room', '4 guests', '52 m² size', '6ad67017fb3a14e0db41143b'),
    ('cozy-courtyard-king', 'cozy courtyard king', 'room', '2 guests', '26 m² size', '6ad66ff0f8bf4846e809ead6'),
    ('city-level-below-ground', 'city level below ground', 'room', '2 guests', '30 m² size', '6ad66ff96684c3e22ea4e1af'),
    ('guild-city-level-loft', 'guild city level loft', 'suite', '3 guests', '45 m² size', '6ad67001f08ff78c37d85427'),
    ('guild-loft-suite', 'guild loft suite', 'suite', '4 guests', '55 m² size', '6ad6701a28c5dc695c82c539'),
    ('guild-corner-loft-suite', 'guild corner loft suite', 'suite', '4 guests', '60 m² size', '6ad67001f08ff78c37d85427'),
    ('guild-double', 'guild double', 'room', '4 guests', '32 m² size', '6ad66ff0f8bf4846e809ead6'),
    ('two-bedroom-loft-suite', 'two bedroom loft suite', 'suite', '6 guests', '85 m² size', '6ad66ff96684c3e22ea4e1af'),
]
ACTIVE = 'cozy-courtyard-queen'  # the room shown in the Figma reference


def dom(tag, cls, children=None, attrs=None, extra=None):
    el = {'type': 'DOM', 'set_dom_config': {'dom_tag': tag}}
    if cls:
        el['set_style'] = {'style_names': cls}
    if attrs:
        el['set_attributes'] = {'attributes': [{'name': k, 'value': v} for k, v in attrs]}
    if children:
        el['children'] = children
    if extra:
        el.update(extra)
    return el


def link(cls, text, href=None, attrs=None):
    el = {'type': 'TextLink', 'set_style': {'style_names': cls}, 'set_text': {'text': text}}
    if href:
        el['set_link'] = {'link_type': 'url', 'link': href}
    if attrs:
        el['set_attributes'] = {'attributes': [{'name': k, 'value': v} for k, v in attrs]}
    return el


def text_el(tag, cls, text):
    return dom(tag, cls, extra={'settings': [{'key': 'text', 'static_text': {'value': text}}]})


tabs = [
    link([P + 'tab'] + (['is-active'] if key == 'all' else []), label, attrs=[('data-gallery-filter-tag', key)])
    for key, label in [('all', 'all'), ('room', 'rooms'), ('suite', 'suites')]
]
items = [
    dom('li', [P + 'item'], [
        link([P + 'link'] + (['is-active'] if key == ACTIVE else []), name, '/rooms-individual',
             [('data-room-preview-trigger', key)])
    ], [('data-gallery-filter-item', cat)])
    for key, name, cat, *_ in ROOMS
]
panels = []
for key, name, cat, guests, size, asset in ROOMS:
    panels.append(dom('article', [P + 'preview'] + (['is-active'] if key == ACTIVE else []), [
        dom('figure', [P + 'figure'], [
            {'type': 'Image', 'set_style': {'style_names': [P + 'image']},
             'set_image_asset': {'image_asset_id': asset, 'alt_text': ALT[asset]}},
        ]),
        dom('div', [P + 'details'], [
            dom('header', [P + 'header'], [
                {'type': 'Heading', 'set_heading_level': {'heading_level': 3},
                 'set_style': {'style_names': [P + 'heading']}, 'set_text': {'text': name}},
                dom('ul', [P + 'specs'], [text_el('li', [P + 'spec'], guests), text_el('li', [P + 'spec'], size)]),
            ]),
            dom('footer', [P + 'preview-footer'], [link(['button', 'is-chamfer'], 'view more', '/rooms-individual')]),
        ]),
    ], [('data-room-preview-panel', key)]))

root = dom('div', [P + 'component'], [
    dom('div', [P + 'layout'], [
        dom('div', [P + 'content'], [
            dom('div', [P + 'bar'], [link([P + 'close'], 'close', attrs=[('data-modal-close', 'true'), ('aria-label', 'Close all rooms')])]),
            dom('div', [P + 'main'], [
                dom('nav', [P + 'tabs'], tabs, [('aria-label', 'Filter rooms')]),
                dom('ul', [P + 'list'], items, [('role', 'list')]),
            ]),
            dom('footer', [P + 'footer'], [link([P + 'back'], 'back to the quiz', attrs=[('data-modal-close', 'true')])]),
        ]),
        dom('div', [P + 'media'], panels),
    ]),
], [('role', 'dialog'), ('aria-modal', 'true'), ('aria-hidden', 'true'), ('tabindex', '-1'), ('aria-label', 'All rooms'),
    ('data-modal-no-overlay', 'true'), ('data-gallery-filter', 'true'), ('data-room-preview', 'true')],
    extra={'settings': [{'key': 'domId', 'static_text': {'value': 'all-rooms'}}]})

if __name__ == '__main__':
    print(json.dumps(root, ensure_ascii=False, separators=(',', ':')))
