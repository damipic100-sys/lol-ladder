const ladderEl = document.getElementById("ladder");

const tierValue = {
  UNRANKED: 0,
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

async function cargarLadder() {
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
      li.className = `card ${p.tier.toLowerCase()}`;
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
}

// 🔥 carga automática
cargarLadder();

const countdownEl = document.getElementById("countdown");

function actualizarContador() {
  const ahora = new Date();
  const manana = new Date();
  manana.setHours(24, 0, 0, 0);

  const diff = manana - ahora;

  const h = Math.floor(diff / 1000 / 60 / 60);
  const m = Math.floor((diff / 1000 / 60) % 60);
  const s = Math.floor((diff / 1000) % 60);

  countdownEl.textContent = `se actualiza en ${h}h ${m}m ${s}s`;
}

setInterval(actualizarContador, 1000);
actualizarContador();
