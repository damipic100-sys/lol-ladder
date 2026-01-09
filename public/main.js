const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

btn.onclick = async () => {
  ladderEl.innerHTML = "<li>Cargando...</li>";

  try {
    const res = await fetch("/data/ladder.json");
    const data = await res.json();

    ladderEl.innerHTML = "";

    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} — ${p.tier} ${p.rank} (${p.lp} LP)`;
      ladderEl.appendChild(li);
    });

  } catch {
    ladderEl.innerHTML = "<li>Error cargando ladder</li>";
  }
};
