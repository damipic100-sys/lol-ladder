const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

btn.onclick = async () => {
  ladderEl.textContent = "Cargando...";

  try {
    const res = await fetch("https://placeholderladder-production.up.railway.app/ladder");
    const data = await res.json();

    if (!data.length || data.every(r => r.length === 0)) {
      ladderEl.textContent = "Sin jugadores rankeados";
      return;
    }

    ladderEl.innerHTML = "";

    data.forEach((ranks, i) => {
      const li = document.createElement("li");

      if (!ranks.length) {
        li.textContent = `Jugador ${i + 1}: UNRANKED`;
      } else {
        const solo = ranks.find(r => r.queueType === "RANKED_SOLO_5x5");
        li.textContent = solo
          ? `${solo.summonerName} — ${solo.tier} ${solo.rank} (${solo.leaguePoints} LP)`
          : "UNRANKED";
      }

      ladderEl.appendChild(li);
    });

  } catch (e) {
    ladderEl.textContent = "Error cargando datos";
    console.error(e);
  }
};
