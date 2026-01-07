export async function onRequest({ env }) {

  const headers = {
    "X-Riot-Token": env.RIOT_KEY,
    "User-Agent": "cf-debug/1.0"
  };

  const url =
    "https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/TU_NOMBRE/TU_TAG";

  const res = await fetch(url, { headers });
  const text = await res.text();

  return new Response(JSON.stringify({
    status: res.status,
    body: text
  }), { headers: { "Content-Type": "application/json" } });
}
