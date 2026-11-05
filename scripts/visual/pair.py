"""Put a Figma crop and a live screenshot side by side, same width, tops aligned.

Usage: python3 scripts/visual/pair.py <figma.jpg> <live.jpg> <out.jpg>
"""
import sys

from PIL import Image, ImageDraw

figma, live = (Image.open(path).convert('RGB') for path in sys.argv[1:3])
live = live.resize((390, round(live.height * 390 / live.width)))
height = max(figma.height, live.height)
canvas = Image.new('RGB', (390 * 2 + 10, height), (255, 0, 255))
canvas.paste(figma, (0, 0))
canvas.paste(live, (400, 0))
draw = ImageDraw.Draw(canvas)
draw.text((4, 4), f'FIGMA {figma.height}px', fill=(255, 0, 0))
draw.text((404, 4), f'LIVE {live.height}px', fill=(255, 0, 0))
canvas.save(sys.argv[3], quality=75)
