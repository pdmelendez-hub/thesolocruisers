// TEMP diagnostic → /api/models : lists Gemini models that support generateContent.
export const onRequestGet = async (context: any) => {
  const { env } = context;
  if (!env.GEMINI_API_KEY) return new Response('no key', { status: 500 });
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
  const d: any = await r.json();
  const names = (d.models || [])
    .filter((m: any) => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map((m: any) => m.name.replace('models/', ''));
  return new Response(JSON.stringify({ names }, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
