"""Crop each top-level section of a mobile Figma page frame from its render.

Usage: python3 scripts/visual/figma-sections.py <figma-section> <out-dir>
"""
import gzip
import json
import os
import sys

from PIL import Image

section, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
index = json.load(open('figma/mobile/index.json'))
frames = index if isinstance(index, list) else index['frames']
frame_meta = next(f for f in frames if f['section'] == section and f['kind'] == 'page')
nodes = json.load(gzip.open('figma/mobile/nodes.json.gz'))['nodes']


def find(node, node_id):
    if node.get('id') == node_id:
        return node
    for child in node.get('children', []):
        hit = find(child, node_id)
        if hit:
            return hit
    return None


frame = next(hit for v in nodes.values() if (hit := find(v.get('document', v), frame_meta['id'])))
render = Image.open(os.path.join('figma/mobile', frame_meta['file'])).convert('RGB')
# Figma clamps tall renders to 16384px; the height ratio is exact, the width one is rounded.
scale = render.height / frame['absoluteBoundingBox']['height']
top = frame['absoluteBoundingBox']['y']
children = [c for c in frame['children'] if c.get('visible', True)]
for n, child in enumerate(children):
    box = child['absoluteBoundingBox']
    y1, y2 = box['y'] - top, box['y'] - top + box['height']
    crop = render.crop((0, int(y1 * scale), render.width, int(y2 * scale)))
    crop = crop.resize((390, max(1, int(y2 - y1))))
    name = ''.join(ch if ch.isalnum() else '-' for ch in child['name'])[:40]
    crop.save(f'{out}/{n:02d}-{name}.jpg', quality=70)
    print(f'{n:02d} {round(y1)}-{round(y2)} {child["name"]}')
