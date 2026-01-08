const btn = document.getElementById("btn");
const ladderEl = document.getElementById("ladder");

btn.onclick = async () => {
  ladderEl.innerHTML = "Cargando...";

  const res = await fetch("https://placeholderladder-production.up.railway.app/ladder");
  const data = await res.json();

  if (!data.length) {
    ladderEl.innerHTML = "Sin jugadores";
    return;
  }

  ladderEl.innerHTML = "";

  data.forEach(p => {
    const li = document.createElement("li");
    li.textContent = JSON.stringify(p);
    ladderEl.appendChild(li);
  });
};

