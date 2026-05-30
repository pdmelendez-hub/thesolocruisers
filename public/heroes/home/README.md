# Hero Assets — Home (`/`)

Drop the files below into this folder and the homepage will pick them up
automatically on the next deploy. **All files are optional** — if any are
missing, the site falls back to a Pexels image served via `/api/photo`.

## Where they're used

| File | Used in section | Notes |
|---|---|---|
| `main-video.mp4`  | Top hero        | Looping silent b-roll behind "Sail Solo." headline |
| `main-video.webm` | Top hero        | Optional, smaller WebM alternative |
| `main-poster.jpg` | Top hero        | Still shown before video loads / on slow connections |
| `cta-video.mp4`   | "Stop dreaming" CTA strip | Looping b-roll behind the dark CTA |
| `cta-poster.jpg`  | "Stop dreaming" CTA strip | Still / fallback |

## Recommended specs

- **Video** — `1920×1080`, H.264 MP4 (and/or VP9 WebM for smaller size), `8–15 seconds`, looping smoothly, **silent** (we set `muted` so it autoplays everywhere), target **< 8 MB**.
- **Poster** — `1920×1080` JPG/WebP, target **< 300 KB**.

Tip: golden-hour ocean / cruise / horizon shots match the Off the Grid family
aesthetic. Cinematic, slow movement reads as premium.
