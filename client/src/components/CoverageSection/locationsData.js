export const defaultLocationsData = {
  locations: [
    {
      lat: 50.1871,
      lng: 14.6633,
      label: 'Brandýs n. L.',
      address: 'Brandýs nad Labem',
      connections: 1024,
      speedText: '1 Gb/s',
      status: 'active',
      statusMessage: '',
    },
    {
      lat: 50.091,
      lng: 14.379,
      label: 'Praha 6',
      address: 'Praha 6, Střešovice',
      connections: 218,
      speedText: '220 Mb/s',
      status: 'active',
      statusMessage: '',
    },
    {
      lat: 49.9765,
      lng: 14.3932,
      label: 'Praha 5',
      address: 'Praha 5, Zbraslav',
      connections: 146,
      speedText: '220 Mb/s',
      status: 'active',
      statusMessage: '',
    },
    {
      lat: 50.2014,
      lng: 14.8328,
      label: 'Lysá n. L.',
      address: 'Lysá nad Labem',
      connections: 88,
      speedText: '500 Mb/s',
      status: 'active',
      statusMessage: '',
    },
    {
      lat: 50.2593,
      lng: 14.5176,
      label: 'Neratovice',
      address: 'Neratovice',
      connections: 64,
      speedText: '500 Mb/s',
      status: 'active',
      statusMessage: '',
    },
  ],
};

function parseConnectionsText(text) {
  return Number(String(text || '').replace(/\D/g, '')) || 0;
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
      connections: Number(item.connections) || parseConnectionsText(item.connectionsText) || 0,
    })),
  };
}
