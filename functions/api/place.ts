// Cloudflare Pages Function → /api/place?q=Seattle+WA
// Server-side proxy to Google Places API (New). Returns JSON metadata for the
// top match. Hides GOOGLE_PLACES_API_KEY from the client.
export const onRequestGet = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = (url.searchParams.get('q') || '').slice(0, 200);
  if (!q) return j({ error: 'missing ?q=' }, 400);
  if (!env.GOOGLE_PLACES_API_KEY) return j({ error: 'GOOGLE_PLACES_API_KEY not configured' }, 500);

  // Edge cache (same query → same answer)
  const cache = (caches as any).default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'X-Goog-Api-Key': env.GOOGLE_PLACES_API_KEY,
      'X-Goog-FieldMask':
        'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.location,places.types',
    },
    body: JSON.stringify({ textQuery: q }),
  });
  if (!res.ok) {
    const detail = await res.text();
    return j({ error: `places ${res.status}`, detail: detail.slice(0, 300) });
  }
  const data: any = await res.json();
  const p = data.places?.[0];
  if (!p) return j({ error: 'no match for query' }, 404);

  const body = {
    name: p.displayName?.text,
    address: p.formattedAddress,
    rating: p.rating ?? null,
    ratingCount: p.userRatingCount ?? null,
    types: p.types ?? [],
    lat: p.location?.latitude,
    lon: p.location?.longitude,
  };
  const out = j(body);
  context.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
};
function j(obj: any, status = 200) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=86400' },
  });
}
