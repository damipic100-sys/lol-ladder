const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

const tierValue = {
  IRON: 1,
  BRONZE: 2,
  SILVER: 3,
  GOLD: 4,
  PLATINUM: 5,
  EMERALD: 6,
  DIAMOND: 7,
  MASTER: 8,
  GRANDMASTER: 9,
  CHALLENGER: 10
};

btn.onclick = async () => {
  ladderEl.innerHTML = "<li class='loading'>Cargando...</li>";

  try {
    const res = await fetch("/ladder.json");
    const data = await res.json();

    data.sort((a, b) => {
      const eloA = tierValue[a.tier] * 1000 + a.lp;
      const eloB = tierValue[b.tier] * 1000 + b.lp;
      return eloB - eloA;
    });

    ladderEl.innerHTML = "";

    data.forEach((p, i) => {
      const li = document.createElement("li");
      li.className = "card";
      li.innerHTML = `
        <span class="pos">#${i + 1}</span>
        <div class="player">
          <span class="name">${p.name}</span>
          <span class="rank">${p.tier} ${p.rank} · ${p.lp} LP</span>
        </div>
      `;
      ladderEl.appendChild(li);
    });

  } catch {
    ladderEl.innerHTML = "<li>Error cargando ladder</li>";
  }
};
