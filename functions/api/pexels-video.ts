// /api/pexels-video?id=N — fetches metadata + preview thumbnails for a Pexels video.
// Used internally to identify dropped stock clips by their Pexels ID.
export const onRequestGet = async (context: any) => {
  const url = new URL(context.request.url);
  const id = url.searchParams.get('id') || '';
  if (!/^\d+$/.test(id)) return new Response('missing or invalid ?id=', { status: 400 });
  if (!context.env.PEXELS_API_KEY) return new Response('PEXELS_API_KEY missing', { status: 500 });

  const cache = (caches as any).default;
  const cacheKey = new Request(url.toString(), { method: 'GET' });
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const r = await fetch(`https://api.pexels.com/videos/videos/${id}`, {
    headers: { Authorization: context.env.PEXELS_API_KEY },
  });
  if (!r.ok) {
    const detail = await r.text();
    return new Response(JSON.stringify({ error: `pexels ${r.status}`, id, detail: detail.slice(0, 300) }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
  const d: any = await r.json();
  const body = {
    id: d.id,
    width: d.width,
    height: d.height,
    duration: d.duration,
    user: d.user?.name,
    url: d.url,
    image: d.image,
    tags: d.tags || [],
    pictures: (d.video_pictures || []).slice(0, 4).map((p: any) => p.picture),
  };
  const out = new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=86400' },
  });
  context.waitUntil(cache.put(cacheKey, out.clone()));
  return out;
};
