const proxyURL = "https://ratp-proxy.hippodrome-proxy42.workers.dev/?url=";
const baseURL = "https://prim.iledefrance-mobilites.fr/marketplace/v2/navitia";

// IDFM StopArea pour Joinville-le-Pont RER
const stopMonitoringRef = "STIF:StopPoint:Q:43135::1";

async function getNextStops() {
  const url = `${proxyURL}${baseURL}/stop-monitoring?MonitoringRef=${stopMonitoringRef}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.Siri || !data.Siri.ServiceDelivery || !data.Siri.ServiceDelivery.StopMonitoringDelivery) {
    throw new Error("Structure inattendue dans la réponse de stop-monitoring");
  }

  const monitoredVisits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;

  if (!monitoredVisits || monitoredVisits.length === 0) {
    throw new Error("Aucun train trouvé");
  }

  const vehicleJourneyId = monitoredVisits[0].MonitoredVehicleJourney.Frames[0].DatedVehicleJourneyRef;

  return getVehicleJourneyDetails(vehicleJourneyId);
}

async function getVehicleJourneyDetails(vehicleJourneyId) {
  const url = `${proxyURL}${baseURL}/vehicle_journeys/${encodeURIComponent(vehicleJourneyId)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.vehicle_journeys || data.vehicle_journeys.length === 0) {
    throw new Error("Aucun détail de trajet trouvé");
  }

  const stops = data.vehicle_journeys[0].stop_times.map(stop => ({
    name: stop.stop_point.name,
    departure: stop.departure_time
  }));

  return stops;
}