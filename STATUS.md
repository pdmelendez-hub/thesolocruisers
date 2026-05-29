# The Solo Cruisers — Project Status

_Last updated: 2026-05-28 (nap-time handoff)_

## Live URLs
- **Production** → https://thesolocruisers.com — **maintenance / coming-soon page** (main branch)
- **Dev (full site)** → https://dev.thesolocruisers.com — redesigned editorial site (dev branch)
- **Logo preview** → https://dev.thesolocruisers.com/logo-final — the chosen "Solo Cruisers" logo, all variations
- **Earlier concept board** → https://dev.thesolocruisers.com/logo-lab — 4 Off-the-Grid-family gold concepts

## Infrastructure
- **Repo:** https://github.com/pdmelendez-hub/thesolocruisers
- **Local path:** `C:\Users\pd_me\OneDrive\Projects\thesolocruisers`
- **Stack:** Astro + Cloudflare adapter, deployed via **GitHub Actions** (`.github/workflows/deploy.yml`)
- **Deploy command:** `wrangler pages deploy dist/client` (NOTE: `dist/client`, not `dist` — Astro CF adapter splits output)
- **Cloudflare account ID:** `8dbea82fd02e7e24c44dab2794ba6c05` · **Zone ID:** `02fbb601c15108b15767ae9c20e28dc0`
- **Pages project:** `thesolocruisers` · secret `CLOUDFLARE_API_TOKEN` set in repo
- **DNS:** CNAMEs for `@`, `www`, `dev` → `*.pages.dev` (all proxied). Custom domains active w/ SSL.

### Branches
- `main` → production (maintenance page)
- `dev` → preview (full site + logo previews). All work happens here; merge to main only to go live.

## Branding / Logo — where we landed
Explored three rounds:
1. **v1:** 5 generic concepts (porthole, anchor, tideline, compass, monogram) — superseded.
2. **v2:** 4 Off-the-Grid-family concepts (gold ring + "— subtitle —"): The Wake, Solo Liner, SC Monogram, Family Crest. Compiled into a **PDF**: `C:\Users\pd_me\OneDrive\Desktop\The Solo Cruisers - Logo Concepts.pdf` (7 pages, every variation). Vetted against famous cruise marks.
3. **v3 (CURRENT / chosen):** Vector recreation of Paolo's own design — cruise-scene emblem (coral sun, gulls, navy ship, teal waves) + "SOLO" with a **lifebuoy "O"** + "Cruisers" script. Built at `/logo-final`. Three treatments:
   - **Full color** (coral/navy/red/teal)
   - **Favicon** (teal rounded square; full + simplified-for-16px)
   - **Platinum** monochrome outline (on charcoal + silver) + platinum favicon
   - Waves + funnels **centered on x=100** axis (verified by measuring geometry).
- Palette: Navy `#173A5E` · Sun coral→orange · Buoy Red `#E5443B` · Teal `#46BCD0` · Sky `#7AD4E2`
- Fonts: **Poppins** (800) for "SOLO", **Pacifico** for "Cruisers".

### Legal note
Paolo created the original design himself → owns copyright, no third-party infringement risk. Trademark distinctiveness is moderate (generic nautical elements; "The Solo Cruise Company" / "The Solo Cruise" already exist). A USPTO search / IP attorney is recommended before trademark registration. (Not legal advice.)

## NEXT STEPS (pick up here)
1. **Decide the primary logo treatment** (likely full-color; platinum as alt for dark/print).
2. Generate production assets: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`.
3. Wire the chosen lockup into the **site header** (replace text-only logo on dev).
4. Remove the scratch pages `/logo-lab` and `/logo-final` once decided.
5. Possible logo tweaks discussed: sun more orange, ship bigger, alt script for "Cruisers", outlined vs filled wordmark, warmer/cooler platinum.
6. Site polish backlog (from earlier): real photography (highest impact), animated stat counters, sticky mobile CTA, real lead-capture form, OG/social meta, testimonial photos.

## Gotchas / notes
- `preview_screenshot` tool intermittently times out on these pages (infinite hero animation / renderer warm-up). Workaround: verify via `preview_eval` measurements; the deployed dev URL is the source of truth.
- Chrome extension **blocks external domains** (incl. singlescruise.com, niftyduckscotravel.com) — used WebFetch instead.
- `offthegridgetaways.com` occasionally returns **522** — flaky origin, retry.
- Playwright (for PDF render) installed in `C:\Users\pd_me\OneDrive\Desktop\OTGG Site` (node_modules, render-pdf.mjs, logo-concepts.html) — reusable; safe to delete if cleaning up.
- This `STATUS.md` is a local note (not committed/deployed).
