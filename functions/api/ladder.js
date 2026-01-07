export async function onRequest({ env }) {

  if (!env.RIOT_KEY) {
    return new Response("NO RIOT KEY", { status: 500 });
  }

  // 🔴 poné la región REAL de cada uno
  const players = [
    { name: "grande y grueso", tag: "7517", lolRegion: "la2" },
    { name: "DAMI", tag: "ARG",  lolRegion: "la2" }, 
    { name: "FernecitoConCoca", tag: "ARG",  lolRegion: "la2" }  
  ];

  const ladder = [];

  for (const p of players) {
    try {
      // account (SIEMPRE americas)
      const accRes = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/${encodeURIComponent(p.name)}/${encodeURIComponent(p.tag)}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );
      if (!accRes.ok) continue;
      const account = await accRes.json();

      // summoner (REGIÓN CORRECTA)
      const sumRes = await fetch(
        `https://${p.lolRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );
      if (!sumRes.ok) continue;
      const summoner = await sumRes.json();

      // ranked
      const rankRes = await fetch(
        `https://${p.lolRegion}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );
      const ranks = await rankRes.json();

      const soloQ = ranks.find(r => r.queueType === "RANKED_SOLO_5x5");

      ladder.push({
        name: `${p.name}#${p.tag}`,
        tier: soloQ?.tier ?? "UNRANKED",
        lp: soloQ?.leaguePoints ?? 0
      });

    } catch (_) {}
  }

  return new Response(JSON.stringify(ladder), {
    headers: { "Content-Type": "application/json" }
  });
}
