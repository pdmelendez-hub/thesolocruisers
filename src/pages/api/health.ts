import type { APIContext } from 'astro';

export const prerender = false;

// Diagnostic endpoint: confirms the Cloudflare runtime is wired up and which
// secrets are present. Returns booleans ONLY — never the secret values.
export const GET = ({ locals }: APIContext) => {
  const env = (locals as any)?.runtime?.env ?? {};
  const body = {
    ok: true,
    runtime: Boolean((locals as any)?.runtime),
    secrets: {
      GEMINI_API_KEY: Boolean(env.GEMINI_API_KEY),
      PEXELS_API_KEY: Boolean(env.PEXELS_API_KEY),
    },
    ts: new Date().toISOString(),
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
};
