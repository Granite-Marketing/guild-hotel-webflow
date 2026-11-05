"""Stack every Figma section crop and every live section screenshot side by side,
split into 2200px strips, for a whole-page first look.

Usage: python3 scripts/visual/overview.py <figma-dir> <live-dir> <out-prefix>
"""
import glob
import sys

from PIL import Image


def stack(folder):
    images = [Image.open(path) for path in sorted(glob.glob(f'{folder}/*.jpg'))]
    canvas = Image.new('RGB', (390, sum(image.height for image in images)), 'white')
    top = 0
    for image in images:
        canvas.paste(image, (0, top))
        top += image.height
    return canvas


figma, live = stack(sys.argv[1]), stack(sys.argv[2])
height = max(figma.height, live.height)
canvas = Image.new('RGB', (790, height), (255, 0, 255))
canvas.paste(figma, (0, 0))
canvas.paste(live, (400, 0))
for index, top in enumerate(range(0, height, 2200)):
    canvas.crop((0, top, 790, min(height, top + 2200))).save(f'{sys.argv[3]}-{index}.jpg', quality=70)
print(figma.height, live.height)
