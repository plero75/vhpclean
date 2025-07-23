export function updateClock() {
  const now = new Date();
  const clock = document.getElementById("clock");
  clock.textContent = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
