// Cloudflare Pages Function → /api/photo?q=alaska%20cruise&orientation=landscape
// Searches Pexels and 302-redirects to a matching photo so it can be used
// directly as an <img src> or CSS background. Edge-cached for 24h.
export const onRequestGet = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || 'cruise ship ocean').slice(0, 100);
  const orientation = url.searchParams.get('orientation') || 'landscape';

  const cache = (caches as any).default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  if (!env.PEXELS_API_KEY) {
    return new Response('PEXELS_API_KEY not configured', { status: 500 });
  }

  const api = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&orientation=${orientation}&per_page=20`;
  const res = await fetch(api, { headers: { Authorization: env.PEXELS_API_KEY } });
  if (!res.ok) return new Response(`Pexels error ${res.status}`, { status: 502 });

  const data: any = await res.json();
  const photos: any[] = data.photos || [];
  if (!photos.length) return new Response('No photo found', { status: 404 });

  // Deterministic pick from the query so each card is stable across loads.
  let h = 0;
  for (let i = 0; i < q.length; i++) h = (h * 31 + q.charCodeAt(i)) | 0;
  const photo = photos[Math.abs(h) % photos.length];
  const target = photo.src.landscape || photo.src.large2x || photo.src.large || photo.src.original;

  const out = new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'Cache-Control': 'public, max-age=86400',
      'X-Photo-Credit': `${photo.photographer || 'Pexels'} / Pexels`,
    },
  });
  context.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
};
