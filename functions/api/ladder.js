export async function onRequest({ env }) {
  const players = await fetch(
    new URL("../../../data/players.json", import.meta.url)
  ).then(r => r.json());

  const ladder = [];

  for (const p of players) {
    const base = `${p.region.toLowerCase()}.api.riotgames.com`;

    const summoner = await fetch(
      `https://${base}/lol/summoner/v4/summoners/by-name/${p.name}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    ).then(r => r.json());

    const rank = await fetch(
      `https://${base}/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    ).then(r => r.json());

    ladder.push({
      name: p.name,
      tier: rank[0]?.tier ?? "UNRANKED",
      lp: rank[0]?.leaguePoints ?? 0
    });
  }

  ladder.sort((a, b) => b.lp - a.lp);

  return new Response(JSON.stringify(ladder), {
    headers: { "Content-Type": "application/json" }
  });
}
