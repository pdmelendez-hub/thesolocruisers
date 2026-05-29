// Cloudflare Pages Function → POST /api/concierge
// Body: { messages: [{ role: "user"|"assistant", content: string }, ...] }
// Calls Gemini, grounded in The Solo Cruisers sailings, returns { reply }.

const SAILINGS = `
- Explore Alaska on NCL — 7 nights, departs Jun 7 2026 from Seattle WA, Norwegian Encore. Call for pricing.
- Solar Eclipse in Spain — 9 nights, departs Aug 7 2026 from Southampton UK, Liberty of the Seas. Call for pricing.
- Halloween Caribbean — 7 nights, departs Oct 25 2026 from Miami FL, Allure of the Seas. From $1,039.
- Caribbean Christmas & New Year's — 12 nights, departs Dec 23 2026 from Miami FL, Norwegian Jewel. From $1,978.
- Overnights in Cabo (Mexican Riviera) — 7 nights, departs Jan 15 2027 from Los Angeles CA, Ovation of the Seas. From $628.
- Full Transit Panama Canal — 15 nights, departs Apr 21 2027 from Miami FL, Norwegian Joy. From $2,334.
`;

const SYSTEM = `You are the friendly cruise concierge for "The Solo Cruisers", a hosted-cruise company for solo travelers and single adults. Your job: help visitors find the right hosted sailing and feel excited and at ease about traveling solo.

Tone: warm, concise, encouraging. Keep replies under ~120 words. Use a little personality, no hard sell.

Only recommend from these real upcoming sailings:
${SAILINGS}

Rules:
- If asked about a destination/date we don't offer, say so kindly and suggest the closest match.
- For booking, pricing specifics, hotels or airfare, tell them to call Sailor Services at 800-393-5000 (Mon–Fri 9am–5:30pm EDT) or use the "Reach Out" button.
- Every sailing is fully hosted with onboard events (mixers, theme nights, shared dining) — reassure nervous first-time solo travelers.
- Never invent prices, ships, or dates beyond the list. Don't discuss topics unrelated to solo cruising.`;

export const onRequestPost = async (context: any) => {
  const { request, env } = context;
  try {
    if (!env.GEMINI_API_KEY) {
      return json({ error: 'GEMINI_API_KEY not configured' }, 500);
    }
    const body = await request.json().catch(() => ({}));
    const messages: any[] = Array.isArray(body.messages) ? body.messages : [];
    if (!messages.length) return json({ error: 'No messages provided' }, 400);

    // Map chat history to Gemini "contents" (roles: user | model)
    const contents = messages.slice(-12).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '').slice(0, 2000) }],
    }));

    const model = env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json({ error: `Gemini error ${res.status}`, model, detail: detail.slice(0, 400) });
    }
    const data: any = await res.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') ||
      "I'm having trouble responding right now — please call us at 800-393-5000.";
    return json({ reply });
  } catch (err: any) {
    return json({ error: 'Server error', detail: String(err).slice(0, 300) });
  }
};

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
