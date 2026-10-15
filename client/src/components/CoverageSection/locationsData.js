export const defaultLocationsData = {
  locations: [],
};

function parseConnectionsText(text) {
  return Number(String(text || '').replace(/\D/g, '')) || 0;
}

function normalizeStreets(streets) {
  return Array.isArray(streets) ? streets.join('\n') : String(streets || '');
}

export function normalizeLocationsData(loaded) {
  if (!loaded?.locations) return defaultLocationsData;
  return {
    locations: loaded.locations.map((item) => ({
      lat: 0,
      lng: 0,
      label: '',
      address: '',
      speedText: '',
      status: 'active',
      statusMessage: '',
      ...item,
      streets: normalizeStreets(item.streets ?? ''),
      connections: Number(item.connections) || parseConnectionsText(item.connectionsText) || 0,
    })),
  };
}
