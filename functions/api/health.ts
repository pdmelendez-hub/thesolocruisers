// Cloudflare Pages Function → served at /api/health
// Diagnostic only: confirms the runtime + which secrets are present.
// Returns booleans ONLY — never the secret values.
export const onRequestGet = async (context: any) => {
  const env = context.env ?? {};
  const body = {
    ok: true,
    secrets: {
      GEMINI_API_KEY: Boolean(env.GEMINI_API_KEY),
      PEXELS_API_KEY: Boolean(env.PEXELS_API_KEY),
      GOOGLE_PLACES_API_KEY: Boolean(env.GOOGLE_PLACES_API_KEY),
      TOMTOM_API_KEY: Boolean(env.TOMTOM_API_KEY),
      RAPIDAPI_KEY: Boolean(env.RAPIDAPI_KEY),
    },
    ts: new Date().toISOString(),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
