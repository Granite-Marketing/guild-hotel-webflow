---
title: Compressing animated GIFs under Webflow's 4MB upload cap
category: integration-issues
date: 2026-05-02
tags: [webflow, gif, animated, compression, gifski, ffmpeg, cms, asset-pipeline]
problem_type: integration_issue
component: asset_pipeline
related:
  - integration-issues/mcp-api-gap-asset-pipeline.md
  - reference/style-guide.md
---

# Compressing animated GIFs under Webflow's 4MB upload cap

## Problem

Webflow's Data API enforces a 4MB cap per asset upload. Animated GIFs at typical client-supplied sizes (480×480, 30fps, 10–25 seconds) routinely come in at **6–14 MB**, all of which fail the upload step with no useful error path. A `sharp`-based resize script handles JPG/PNG but ignores GIFs entirely.

We hit this when uploading 14 animated card GIFs (years 2018–2025) for an animated-cards CMS collection: every single file was over the limit.

## Root cause

GIFs are uncompressible by the standard image-pipeline tools the project already uses:

- **Webflow's auto-AVIF transcoding does not preserve animation** — the cap-then-let-Webflow-handle-it strategy that works for static JPEG/PNG simply doesn't apply.
- **`sharp` does not handle animated GIFs** — only first frame, which destroys the asset.
- **GIF size is dominated by frame count × dimensions × color depth**, so simply resizing (the static-image strategy) is rarely enough on its own. A 13MB 480×480 GIF resized to 400×400 is still 7–8MB.

To fit a long animation under 4MB while staying visually acceptable at 400×400 display size requires controlling **all three** of those axes (frames, dimensions, palette).

## Investigation — what didn't work

These were tried first and rejected. Documenting so future-you doesn't re-run them.

| Approach | Result | Why it failed |
|---|---|---|
| `gifsicle -O3 --lossy=80/100/120` (alone) | 11MB on 13MB source — **15% reduction** | Lossy LZW alone barely moves the needle on long animations |
| `gifsicle --resize 400x400 --lossy=100` | 7.9MB on 13MB source | Better, but still over 4MB |
| ffmpeg native GIF encoder (`-c:v gif`) | 12MB output from 13MB source — **larger than original** | ffmpeg's built-in GIF encoder is inefficient; do not use as the final encoder |
| ffmpeg `palettegen=stats_mode=single` (per-frame palette) | Files collapsed to 8KB (corrupted) | `stats_mode=single` regenerates palette per frame; on frames with very few colors it produces near-empty palettes and breaks the output |
| `gifsicle --resize 400x400 --lossy=120 + frame skip via "#0 #2 #4..."` | E2BIG (`File name too long`) on long GIFs | Bash command-line length limit; gifsicle has no built-in stride/decimation flag |
| Frame skip + 400×400 + `gifsicle -O3 --lossy=120` (working but ugly) | 3.6MB but visible color banding and block artifacts | gifsicle's lossy at this ratio produces poor visual quality |

## Solution — `ffmpeg` extracts frames, `gifski` encodes

`gifski` (Rust, neural-quantization palette + per-frame error diffusion) produces materially smaller and higher-quality output than gifsicle at the same target size. Use ffmpeg only for frame extraction + Lanczos resampling, not for the GIF re-encode.

### Install

```bash
brew install gifski ffmpeg
```

### Pipeline

```bash
# 1. Extract frames at target fps with high-quality resampling
mkdir -p /tmp/frames && rm -f /tmp/frames/*.png
ffmpeg -y -i input.gif \
  -vf "fps=15,scale=400:400:flags=lanczos" \
  /tmp/frames/frame_%04d.png

# 2. Re-encode with gifski
gifski --fps 15 --width 400 --height 400 --quality 70 \
  -o output.gif /tmp/frames/*.png
```

### Tuning matrix

400×400 is the project's max display size for animated cards: going larger wastes bytes, going smaller introduces upscale blur. Frame rate and quality are the dials:

| Source duration | Settings that fit under 4MB |
|---|---|
| 10–15s | 15fps, quality=70 |
| 15–20s | 15fps, quality=65 |
| 20–25s | 15fps, quality=55–60 *or* 12fps, quality=70 |
| 25s+ or very busy motion | 8–10fps, quality=50 |

### Adaptive bash loop (production-ready)

This is what we actually shipped — it tries quality=70 first, drops by 5 until ≤4.1MB (with safety margin), then drops fps if quality alone can't get there:

```bash
recompress() {
  local input="$1"
  local output="$2"

  rm -f /tmp/frames/*.png
  ffmpeg -y -i "$input" -vf "fps=15,scale=400:400:flags=lanczos" \
    /tmp/frames/frame_%04d.png 2>/dev/null > /dev/null

  for q in 70 65 60 55 50 45 40; do
    gifski --fps 15 --width 400 --height 400 --quality $q \
      -o "$output" /tmp/frames/*.png 2>/dev/null
    [ "$(stat -f%z "$output")" -le 4100000 ] && return 0
  done

  # Fallback: drop fps
  for fps in 12 10 8; do
    rm -f /tmp/frames/*.png
    ffmpeg -y -i "$input" -vf "fps=$fps,scale=400:400:flags=lanczos" \
      /tmp/frames/frame_%04d.png 2>/dev/null > /dev/null
    for q in 60 55 50 45 40; do
      gifski --fps $fps --width 400 --height 400 --quality $q \
        -o "$output" /tmp/frames/*.png 2>/dev/null
      [ "$(stat -f%z "$output")" -le 4100000 ] && return 0
    done
  done

  echo "FAILED to compress under 4MB: $(basename "$output")"
  return 1
}
```

### Verified results (animated cards, May 2026)

14/14 files compressed successfully, mean reduction 64%, worst case 13.2MB → 3.3MB:

```
card-a 8.0MB → 3.9MB (15fps q70)
card-b 6.6MB → 2.9MB (15fps q65)
card-c 6.4MB → 3.6MB (8fps  q50)   ← long, busy animation
card-d 7.7MB → 3.8MB (15fps q45)
card-e 13.2MB → 3.3MB (15fps q70)
card-f 9.5MB → 3.5MB (15fps q60)
card-g 7.4MB → 3.9MB (12fps q60)
```

## Upload — re-use the existing pattern

After compression, upload with the same REST pattern as `scripts/api/webflow/upload-assets.cjs`:

- Two-step S3 presigned-URL upload (`POST /sites/:id/assets` → POST to S3)
- MD5 deduplication against existing site assets
- `card-image: { fileId, url, alt }` PATCH format (all three required; this is an upload, never an in-place update: see [webflow-cms-image-alt-reimport-srcset-loss.md](webflow-cms-image-alt-reimport-srcset-loss.md))
- New items via `POST /collections/:id/items`; check existing slugs first to avoid 409 conflicts

## Prevention

1. **Default to gifski for any animated content.** Add `brew install gifski ffmpeg` to the project setup checklist alongside the existing tooling.
2. **Don't extend a static-image resize script to handle GIFs.** Keep static (sharp) and animated (gifski) pipelines separate: they have different optimal strategies and combining them produces worse results than either alone.
3. **400×400 is the cap for animated cards.** If a future component needs larger animated content, re-evaluate quality settings: going to 600×600 with the same quality target will roughly double file size.
4. **Naming sanity:** strip trailing spaces, normalize case, consolidate `.GIF`/`.gif` extensions before processing. Source GIFs from clients arrive in chaotic case (`Card2018.gif`, `card2019.GIF`, `card2020 .gif`).
5. **Match existing CMS naming conventions.** For animated cards: `Holiday YYYY`, slug `holiday-yyyy`, with `date` field populated for sort order. Don't invent new conventions for animated variants of the same content type.

## When this won't be enough

If gifski at fps=8 and quality=40 still can't get under 4MB (very long, very busy animations), fall back in this order:

1. **Trim the GIF** — clients often supply 30s loops where 10s would do.
2. **Convert to MP4/WebM**: 5 to 10× smaller than even optimized GIF, plays via `<video autoplay loop muted playsinline>`. Requires CMS schema change (add a Video field) and template update; document the swap clearly so static and animated cards render through the same component.
3. **Drop the asset**: animated isn't load-bearing for animated cards; static fallback is acceptable.

Do not attempt to bypass the 4MB cap with multipart tricks; Webflow rejects them.

## See also

- `docs/solutions/integration-issues/mcp-api-gap-asset-pipeline.md` — why uploads go through REST API not MCP
- [webflow-cms-image-emission.md](../conventions/webflow-cms-image-emission.md): static image strategy (long-edge resize, let Webflow auto-AVIF). Does **not** apply to GIFs.
- [webflow-cms-image-alt-reimport-srcset-loss.md](webflow-cms-image-alt-reimport-srcset-loss.md): the `{ fileId, url, alt }` payload always re-imports
