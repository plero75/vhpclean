const PROXY_URL = "https://ratp-proxy.hippodrome-proxy42.workers.dev/?url=";
const STOP_AREA_ID = "stop_area:IDFM:70640"; // Joinville-le-Pont
const NAVITIA_BASE = "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia";

export async function getNextStops() {
  const now = new Date();
  const formattedTime = now.toISOString().replace(/[-:]/g, '').split('.')[0]; // YYYYMMDDTHHmmss
  const url = `${PROXY_URL}${encodeURIComponent(`${NAVITIA_BASE}/coverage/fr-idf/${STOP_AREA_ID}/stop_schedules?from_datetime=${formattedTime}&count=1&data_freshness=realtime`)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur API Navitia: ${response.status}`);

  const data = await response.json();
  const schedules = data.stop_schedules;

  if (!schedules || schedules.length === 0) {
    throw new Error("Aucun train trouvé");
  }

  // On prend le premier train
  const journey = schedules[0];
  const vehicleLink = journey.vehicle_journey?.id;

  if (!vehicleLink) {
    throw new Error("Aucune info de parcours disponible");
  }

  // Deuxième appel : récupérer la liste des arrêts du trajet
  const stopsUrl = `${PROXY_URL}${encodeURIComponent(`${NAVITIA_BASE}/coverage/fr-idf/vehicle_journeys/${vehicleLink}/stop_times`)}`;
  const stopsResp = await fetch(stopsUrl);
  if (!stopsResp.ok) throw new Error("Impossible de récupérer les arrêts");

  const stopData = await stopsResp.json();
  return stopData.stop_times?.map(s => ({
    name: s.stop_point.name,
    time: s.arrival_time || s.departure_time
  })) || [];
}