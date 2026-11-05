#!/bin/bash
# One-shot Figma vs live comparison for a page at 390px: section crops,
# live screenshots, overview strips and per-section boxes on both sides.
# Usage: scripts/visual/compare-page.sh <figma-section> <live-path> <out-dir>
set -e
section=$1; path=$2; out=$3
url="https://the-guild-hotel-c34e71.webflow.io$path"
here=$(dirname "$0")
python3 "$here/figma-sections.py" "$section" "$out/figma" > "$out/figma-sections.txt"
grep -iv 'footer\|scroll anchor\|fixed' "$out/figma-sections.txt" | awk '{print $1}' > "$out/keep.txt"
mkdir -p "$out/figma-main"
while read -r n; do cp "$out/figma/$n-"*.jpg "$out/figma-main/"; done < "$out/keep.txt"
node "$here/live-sections.mjs" "$url" "$out/live" > "$out/live-sections.txt"
python3 "$here/overview.py" "$out/figma-main" "$out/live" "$out/overview"
count=$(wc -l < "$out/figma-sections.txt")
for n in $(seq 0 $((count - 1))); do python3 "$here/figma-boxes.py" "$section" "$n"; done > "$out/figma-boxes.txt" 2>/dev/null || true
node "$here/live-boxes.mjs" "$url" > "$out/live-boxes.txt"
cat "$out/figma-sections.txt" "$out/live-sections.txt"
