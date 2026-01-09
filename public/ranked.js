export async function onRequest(context) {
  const { RIOT_API_KEY } = context.env

  if (context.request.method !== "POST") {
    return new Response("usar POST", { status: 405 })
  }

  const { summonerIds } = await context.request.json()

  if (!Array.isArray(summonerIds)) {
    return new Response(JSON.stringify({ error: "summonerIds debe ser un array" }), { status: 400 })
  }

  const results = []

  for (const id of summonerIds) {
    // datos de la cuenta
    const summonerRes = await fetch(
      `https://la2.api.riotgames.com/lol/summoner/v4/summoners/${id}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    )
    const summoner = await summonerRes.json()

    // ranked
    const rankedRes = await fetch(
      `https://la2.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    )
    const ranked = await rankedRes.json()

    const soloq = ranked.find(q => q.queueType === "RANKED_SOLO_5x5")

    results.push({
      summonerId: id,
      nombre: summoner.name,
      rango: soloq ? `${soloq.tier} ${soloq.rank}` : null,
      lp: soloq ? soloq.leaguePoints : 0,
      victorias: soloq ? soloq.wins : 0,
      derrotas: soloq ? soloq.losses : 0
    })
  }

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  })
}
