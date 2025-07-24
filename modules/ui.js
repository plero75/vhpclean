export function renderStops(stops) {
  const container = document.getElementById("gares-desservies");
  container.innerHTML = "";

  if (!stops || stops.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Aucun arrêt à afficher";
    container.appendChild(li);
    return;
  }

  stops.forEach(stop => {
    const li = document.createElement("li");
    li.textContent = `${stop.time} – ${stop.name}`;
    container.appendChild(li);
  });
}