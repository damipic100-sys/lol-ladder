const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

btn.onclick = async () => {
  ladderEl.innerHTML = "<li>Cargando...</li>";

  try {
    const res = await fetch("./ladder.json");

    if (!res.ok) {
      throw new Error("HTTP " + res.status);
    }

    const data = await res.json();

    ladderEl.innerHTML = "";

    data.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} — ${p.tier} ${p.rank} (${p.lp} LP)`;
      ladderEl.appendChild(li);
    });

  } catch (e) {
    console.error(e);
    ladderEl.innerHTML = "<li>Error cargando ladder</li>";
  }
};
