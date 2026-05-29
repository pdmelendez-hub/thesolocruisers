// Cloudflare Pages Function → /api/map?q=Seattle+WA&z=8&w=640&h=360
// Server-side proxy: TomTom geocode → TomTom static map → returns image bytes.
// Keeps TOMTOM_API_KEY hidden from the browser.
export const onRequestGet = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').slice(0, 200);
  if (!q) return new Response('missing ?q=', { status: 400 });
  if (!env.TOMTOM_API_KEY) return new Response('TOMTOM_API_KEY not configured', { status: 500 });

  const zoom = clamp(url.searchParams.get('z') || '7', 1, 22);
  const w = clamp(url.searchParams.get('w') || '640', 32, 1280);
  const h = clamp(url.searchParams.get('h') || '360', 32, 1280);

  const cache = (caches as any).default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  // 1) Geocode the query
  const geo = await fetch(
    `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(q)}.json?key=${env.TOMTOM_API_KEY}&limit=1`
  );
  if (!geo.ok) return new Response(`geocode ${geo.status}`, { status: 502 });
  const gd: any = await geo.json();
  const pos = gd.results?.[0]?.position;
  if (!pos) return new Response('no location for query', { status: 404 });

  // 2) Fetch the static map (key stays server-side)
  const mapUrl =
    `https://api.tomtom.com/map/1/staticimage?key=${env.TOMTOM_API_KEY}` +
    `&center=${pos.lon},${pos.lat}&zoom=${zoom}&width=${w}&height=${h}` +
    `&format=png&layer=basic&style=main&view=Unified`;
  const m = await fetch(mapUrl);
  if (!m.ok) return new Response(`map ${m.status}`, { status: 502 });

  const buf = await m.arrayBuffer();
  const resp = new Response(buf, {
    status: 200,
    headers: {
      'content-type': 'image/png',
      'cache-control': 'public, max-age=86400',
      'x-place-lat': String(pos.lat),
      'x-place-lon': String(pos.lon),
    },
  });
  context.waitUntil(cache.put(cacheKey, resp.clone()));
  return resp;
};
function clamp(v: string, lo: number, hi: number) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return String(lo);
  return String(Math.max(lo, Math.min(hi, n)));
}
