async function cargarLadder() {
  const res = await fetch(
    "https://TU-PROYECTO.up.railway.app/ladder"
  );
  const data = await res.json();

  renderLadder(data);
}
