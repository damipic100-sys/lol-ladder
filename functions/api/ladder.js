export async function onRequest({ env }) {

  if (!env.RIOT_KEY) {
    return new Response("NO RIOT KEY", { status: 500 });
  }

  const players = [
    { riotId: "JugadorReal#TAGREAL" }
  ];

  const ladder = [];

  for (const p of players) {
    try {
      const [name, tag] = p.riotId.split("#");

      const accRes = await fetch(
        `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );

      if (!accRes.ok) continue;
      const account = await accRes.json();

      const sumRes = await fetch(
        `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );

      if (!sumRes.ok) continue;
      const summoner = await sumRes.json();

      const rankRes = await fetch(
        `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
        { headers: { "X-Riot-Token": env.RIOT_KEY } }
      );

      const ranks = await rankRes.json();
      const soloQ = ranks.find(r => r.queueType === "RANKED_SOLO_5x5");

      ladder.push({
        name: p.riotId,
        tier: soloQ?.tier ?? "UNRANKED",
        lp: soloQ?.leaguePoints ?? 0
      });

    } catch (_) {}
  }

  return new Response(JSON.stringify(ladder), {
    headers: { "Content-Type": "application/json" }
  });
}
