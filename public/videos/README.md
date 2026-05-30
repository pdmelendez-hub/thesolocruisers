# Video Library — The Solo Cruisers

All website videos live here. Files are stored locally in the repo (no external CDN), so they ship with the deploy and have no third-party dependencies.

## ⚠️ Cloudflare hard limits

| Limit | Value |
|---|---|
| Max file size per asset | **25 MiB** (~26.2 MB) |
| Max files per deployment | 20,000 |
| GitHub warning threshold | 50 MB |
| GitHub hard limit per file | 100 MB |

**Safe target: keep every video under 24 MB.** Run `npm run check:videos` before pushing.

## Folder layout (flat, 6 categories)

```
public/videos/
├── README.md          ← you are here
├── INVENTORY.md       ← what's in each file + attribution
├── heroes/            ← page hero videos (wired into <video> elements)
├── destinations/      ← port/region atmospheric b-roll
├── onboard/           ← ship/onboard experience b-roll
├── lifestyle/         ← general solo-travel lifestyle b-roll
├── testimonials/      ← solo sailor stories (one file per sailor)
└── social/            ← cuts pre-formatted for Instagram / TikTok
```

The disambiguation (which port, which ship space, which sailor) lives in the **filename**, not in another folder layer. See INVENTORY.md for the live list.

## Filename conventions

| Folder | Pattern | Example |
|---|---|---|
| `heroes/` | `hero-{page}.mp4` or `cta-{page}.mp4` | `hero-home.mp4`, `cta-home.mp4`, `hero-destinations.mp4` |
| `destinations/` | `destinations-{topic}.mp4` | `destinations-philippines-lagoon.mp4` |
| `onboard/` | `onboard-{topic}.mp4` (`-NN` if multiple) | `onboard-scarlet-night-01.mp4` |
| `lifestyle/` | `lifestyle-{topic}.mp4` | `lifestyle-sunset-ocean-walk.mp4` |
| `testimonials/` | `{sailor-name}.mp4` (+ `{sailor-name}-poster.jpg`) | `deeann.mp4` |
| `social/` | `{platform}-{topic}.mp4` | `reel-friendships.mp4`, `story-scarlet-night.mp4` |

## Recommended specs

| Use | Resolution | Codec | Duration | Bitrate | Target size |
|---|---|---|---|---|---|
| Hero (landscape) | 1920×1080 | H.264 MP4 (+ optional VP9 WebM) | 8–15 s | 3–4 Mbps | **6–10 MB** |
| Onboard / destination b-roll | 1920×1080 | H.264 MP4 | 15–30 s | 2–3 Mbps | **8–15 MB** |
| Testimonial | 1920×1080 | H.264 MP4 with audio | 30–60 s | 1.5–2.5 Mbps | **10–20 MB** |
| Social reel (9:16) | 1080×1920 | H.264 MP4 with audio | 15–60 s | 2–3 Mbps | **6–18 MB** |

Hero loops are silent (`muted` for autoplay). Testimonials and social keep audio.

## Compress with ffmpeg

```bash
# Silent hero loop (~10 MB, 12 s, 1080p)
ffmpeg -i input.mov -vcodec libx264 -preset slow -crf 24 \
       -vf "scale=1920:-2" -an -movflags +faststart -t 12 output.mp4

# Same content as smaller WebM (VP9) for browsers that support it
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 32 -b:v 0 \
       -vf "scale=1920:-2" -an -t 12 output.webm
```

Tweaks: raise `-crf` to 26–28 for smaller files; drop to 20–22 for higher quality.

## How to add a video to the site

1. Compress per spec above (`< 24 MB`).
2. Rename per filename convention.
3. Drop into the matching folder.
4. Run `npm run check:videos` — all green = safe to ship.
5. Reference it as `/videos/<folder>/<filename>` in markup (the `public/` prefix maps to the site root).
6. Add a row to `INVENTORY.md` with content + attribution.
7. Commit, push, deploy.
