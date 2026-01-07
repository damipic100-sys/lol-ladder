export async function onRequest({ env }) {
  return new Response(JSON.stringify({
    keyExists: !!env.RIOT_KEY,
    keyPreview: env.RIOT_KEY?.slice(0, 10)
  }), { headers: { "Content-Type": "application/json" } });
}
