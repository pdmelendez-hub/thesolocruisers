# Video Library — The Solo Cruisers

All website videos live here. Files are stored **locally in the repo** (not on a CDN), so they ship with the deploy and have no external dependencies.

## ⚠️ Cloudflare hard limits (must respect)

| Limit | Value |
|---|---|
| **Max file size per asset** | **25 MiB** (~26.2 MB) |
| Max files per deployment | 20,000 |
| GitHub warning threshold | 50 MB |
| GitHub hard limit per file | 100 MB |

**Safe target: keep every video under 24 MB** to leave a 1 MB safety margin and avoid GitHub warnings.

A guard script lives at `scripts/check-video-sizes.mjs` — run `npm run check:videos` before pushing. CI can also be wired to fail the build on oversize.

## Folder layout

```
public/videos/
├── README.md                  ← you are here
├── heroes/                    ← page hero backgrounds (wired into <video> elements)
│   ├── home/
│   ├── destinations/
│   └── concierge/
├── onboard/                   ← ship/onboard b-roll, by experience
│   ├── scarlet-night/
│   ├── the-galley/
│   ├── deck-spaces/
│   ├── solo-cabins/
│   └── group-mixers/
├── destinations/              ← port/region atmospheric clips
│   ├── alaska/
│   ├── caribbean/
│   ├── mediterranean/
│   ├── mexican-riviera/
│   ├── panama-canal/
│   └── bermuda/
├── testimonials/              ← solo sailor stories (one folder per sailor)
├── lifestyle/                 ← general solo travel b-roll
└── social/                    ← cuts optimised for Instagram / TikTok
    ├── reels-9x16/            ← vertical 1080×1920
    └── stories-9x16/          ← vertical 1080×1920 (shorter, casual)
```

## Recommended specs by use

| Use | Resolution | Codec | Duration | Bitrate | Target size |
|---|---|---|---|---|---|
| Hero loop (landscape) | 1920×1080 | H.264 MP4 + VP9 WebM | 8–15 s | 3–4 Mbps | **6–10 MB** |
| Hero loop (mobile/portrait alt) | 1080×1920 | H.264 MP4 | 8–15 s | 2–3 Mbps | **5–8 MB** |
| Onboard / destination b-roll | 1920×1080 | H.264 MP4 | 15–30 s | 2–3 Mbps | **8–15 MB** |
| Testimonial | 1920×1080 | H.264 MP4 (with audio) | 30–60 s | 1.5–2.5 Mbps | **10–20 MB** |
| Social reel | 1080×1920 | H.264 MP4 (with audio) | 15–60 s | 2–3 Mbps | **6–18 MB** |

Hero loops are **silent** (we set `muted` for autoplay). Testimonials/social clips keep audio.

## Compress with ffmpeg

Web-optimised H.264 MP4 (universal):

```bash
ffmpeg -i input.mov -vcodec libx264 -preset slow -crf 24 \
       -vf "scale=1920:-2" -an -movflags +faststart -t 12 \
       output.mp4
```

Tweaks:
- **`-crf 24`** = visual quality knob. Raise to 26–28 for smaller files, drop to 20–22 for higher quality.
- **`-vf "scale=1920:-2"`** = output width 1920px, height auto, even pixels.
- **`-an`** = strip audio (use for hero loops). Remove for testimonials.
- **`-t 12`** = cap duration to 12 seconds.
- **`-movflags +faststart`** = puts MOOV atom at the front so the browser can start playing before fully downloaded.

Add a smaller WebM (VP9) alternative for browsers that support it (Chromium, Firefox):

```bash
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 32 -b:v 0 \
       -vf "scale=1920:-2" -an -t 12 output.webm
```

## Naming conventions

| Pattern | Use |
|---|---|
| `main-video.mp4` + `main-video.webm` + `main-poster.jpg` | Primary hero of a page |
| `cta-video.mp4` + `cta-poster.jpg` | Secondary hero (CTA strip / mid-page) |
| `<topic>-01.mp4`, `<topic>-02.mp4`, … | Multiple clips in same folder (onboard, destinations) |
| `<sailor-name>.mp4` + `<sailor-name>-poster.jpg` | Testimonial clips |
| `<campaign>-reel.mp4` | Social reels |

## How to add a video to the site

1. Compress and rename per spec above.
2. Drop into the correct subfolder.
3. Run `npm run check:videos` to confirm it's under 24 MB.
4. Reference it in markup as `/videos/<path>` (because `public/` maps to the site root).
5. Commit, push, deploy.
