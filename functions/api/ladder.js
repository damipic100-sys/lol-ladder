export async function onRequest({ env }) {

  const players = [
  { "name": "NoTGastesTasMute#420", "region": "LA2" },
  { "name": "DAMI#ARG", "region": "LA2" },
  { "name": "grande y grueso#7518", "region": "LA2" }
  ];

  const ladder = [];

  for (const p of players) {
    const base = `${p.region.toLowerCase()}.api.riotgames.com`;

    const summonerRes = await fetch(
      `https://${base}/lol/summoner/v4/summoners/by-name/${encodeURIComponent(p.name)}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    );

    if (!summonerRes.ok) continue;

    const summoner = await summonerRes.json();

    const rankRes = await fetch(
      `https://${base}/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    );

    const rank = await rankRes.json();

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
