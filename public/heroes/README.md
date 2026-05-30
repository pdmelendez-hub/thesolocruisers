# Hero Assets

This directory holds the cinematic background media (video + still poster) for
each page's hero section. Folder name = page path.

```
public/heroes/
├── home/           → /            (homepage hero + CTA strip)
└── destinations/   → /destinations
```

How it works (all files optional):
1. Each page's `<video>` element points to `/heroes/<page>/main-video.{mp4,webm}`.
2. The `poster` is a Pexels fallback served by `/api/photo` — so the hero
   ALWAYS has a relevant image, even before you upload anything.
3. Drop a real video in the corresponding folder → it plays automatically on
   the next deploy. Drop a `main-poster.jpg` → it becomes the poster.

See each subfolder's `README.md` for filename conventions per page.
