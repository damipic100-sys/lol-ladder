const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

btn.onclick = async () => {
  ladderEl.innerHTML = "<li>Cargando...</li>";

  try {
    const res = await fetch("https://TU-PROYECTO.up.railway.app/ladder");
    const data = await res.json();

    ladderEl.innerHTML = "";

    if (!data.length || data.every(r => r.length === 0)) {
      ladderEl.innerHTML = "<li>Sin jugadores rankeados</li>";
      return;
    }

    data.forEach((ranks, i) => {
      const li = document.createElement("li");

      if (!ranks.length) {
        li.textContent = `Jugador ${i + 1} — UNRANKED`;
      } else {
        const solo = ranks.find(r => r.queueType === "RANKED_SOLO_5x5");
        li.textContent = solo
          ? `${solo.summonerName} — ${solo.tier} ${solo.rank} (${solo.leaguePoints} LP)`
          : "UNRANKED";
      }

      ladderEl.appendChild(li);
    });

  } catch {
    ladderEl.innerHTML = "<li>Error cargando datos</li>";
  }
};
