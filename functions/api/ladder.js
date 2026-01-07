export async function onRequest({ env }) {

  const players = [
    { riotId: "NoTGastesTasMute#420", region: "americas" },
    { riotId: "DAMI#ARG", region: "americas" }
  ];

  const ladder = [];

  for (const p of players) {
    const [name, tag] = p.riotId.split("#");

    // 1) account → puuid
    const accRes = await fetch(
      `https://${p.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${tag}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    );

    if (!accRes.ok) continue;
    const account = await accRes.json();

    // 2) summoner
    const sumRes = await fetch(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${account.puuid}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    );

    const summoner = await sumRes.json();

    // 3) rank
    const rankRes = await fetch(
      `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.id}`,
      { headers: { "X-Riot-Token": env.RIOT_KEY } }
    );

    const ranks = await rankRes.json();

    const soloQ = ranks.find(
      r => r.queueType === "RANKED_SOLO_5x5"
    );

    ladder.push({
      name: p.riotId,
      tier: soloQ?.tier ?? "UNRANKED",
      lp: soloQ?.leaguePoints ?? 0
    });

  return new Response(JSON.stringify(ladder), {
    headers: { "Content-Type": "application/json" }
  });

}
