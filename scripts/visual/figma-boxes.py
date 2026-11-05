"""Print every text, image and instance box inside one top-level section of a
mobile Figma page frame, relative to the section top.

Usage: python3 scripts/visual/figma-boxes.py <figma-section> <section-index>
"""
import gzip
import json
import sys

section, wanted = sys.argv[1], int(sys.argv[2])
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
target = [c for c in frame['children'] if c.get('visible', True)][wanted]
top, left = target['absoluteBoundingBox']['y'], frame['absoluteBoundingBox']['x']
print(f"section {target['name']} h{round(target['absoluteBoundingBox']['height'])}")


def walk(node, depth):
    if not node.get('visible', True):
        return
    box = node.get('absoluteBoundingBox')
    kind = node['type']
    # The section itself is often an instance; only nested instances are leaves.
    leaf = depth > 0 and (kind == 'TEXT' or kind == 'INSTANCE') or any(f.get('type') == 'IMAGE' for f in node.get('fills', []))
    if box and leaf:
        style = node.get('style', {})
        text = (node.get('characters') or node['name']).replace('\n', ' / ')[:50]
        font = f" {style.get('fontSize')}/{round(style.get('lineHeightPx', 0), 1)}" if kind == 'TEXT' else ''
        print(f"{round(box['y'] - top):5} -> {round(box['y'] - top + box['height']):5}  x{round(box['x'] - left):4} w{round(box['width']):4}{font}  {kind[:4]} {text}")
        if kind == 'INSTANCE' and depth > 0:
            return
    for child in node.get('children', []):
        walk(child, depth + 1)


walk(target, 0)
