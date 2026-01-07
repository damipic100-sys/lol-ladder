export async function onRequest({ env }) {

  if (!env.RIOT_KEY) {
    return new Response("NO RIOT KEY", { status: 500 });
  }

  const headers = {
    "X-Riot-Token": env.RIOT_KEY,
    "User-Agent": "lol-ladder/1.0 (contact: damipic100@gmail.com)"
  };

  const players = [
    { name: "DAMI", tag: "ARG", region: "la2" },
    { name: "FernecitoConCoca", tag: "ARG",  region: "la2" },
    { name: "lushoto", tag: "uwu",  region: "la2" }
  ];

  const ladder = [];

  for (const p of players) {
    try {
      //  account 
      const accRes = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-game-name/${encodeURIComponent(p.name)}/${encodeURIComponent(p.tag)}`,
        { headers }
      );
      if (!accRes.ok) continue;
      const account = await accRes.json();

      // summoner 
      const sumRes = await fetch(
        `https://${p.region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
        { headers }
      );
      if (!sumRes.ok) continue;
      const summoner = await sumRes.json();

      //  ranked
      const rankRes = await fetch(
        `https://${p.region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers }
      );
      if (!rankRes.ok) continue;

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
